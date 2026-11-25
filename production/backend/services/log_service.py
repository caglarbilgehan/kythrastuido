"""
KythraStudio In-Memory Execution Log Service
Captures Python standard logging and stage lifecycle events into a thread-safe ring buffer.
Enables real-time log streaming and console monitoring in the developer workbench.
"""

from collections import deque
from contextvars import ContextVar
from dataclasses import asdict, dataclass
from datetime import datetime
import logging
import threading
from typing import Any, Dict, List, Optional
import re

MAX_LOG_ENTRIES = 2000

# Tracks active HTTP / background thread session_id for live developer filtering
CURRENT_SESSION_ID: ContextVar[Optional[str]] = ContextVar("kythra_session_id", default=None)


@dataclass
class LogEntry:
    id: int
    timestamp: str
    level: str
    logger: str
    stage_num: Optional[int]
    message: str
    session_id: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


_STAGE_LOGGER_MAP = {
    "backend.stages.stage1_beat": 1,
    "backend.stages.beat_tracking": 1,
    "backend.beat": 1,
    "backend.stages.stage2_chord": 2,
    "backend.stages.chord_recognition": 2,
    "backend.chords": 2,
    "backend.domain.chords": 2,
    "backend.stages.stage3_mss": 3,
    "backend.stages.source_separation": 3,
    "backend.mss": 3,
    "backend.stages.lyrics_alignment": 4,
    "backend.engines.lyrics_hybrid": 4,
}

_STAGE_MSG_REGEX = re.compile(r"\[Aşama\s*([1-9])\]|\[Stage\s*([1-9])\]|Aşama\s*([1-9])", re.IGNORECASE)


class MemoryLogHandler(logging.Handler):
    """Logging handler that diverts logs into the LogService ring buffer."""

    def __init__(self, service: "LogService"):
        super().__init__()
        self.service = service

    def emit(self, record: logging.LogRecord):
        try:
            msg = self.format(record)
            stage_num = _STAGE_LOGGER_MAP.get(record.name)

            if stage_num is None:
                match = _STAGE_MSG_REGEX.search(msg)
                if match:
                    val = match.group(1) or match.group(2) or match.group(3)
                    if val:
                        stage_num = int(val)

            self.service.add_entry(
                level=record.levelname,
                logger=record.name,
                message=msg,
                stage_num=stage_num,
            )
        except Exception:
            self.handleError(record)


class LogService:
    """Thread-safe in-memory log repository for live developer workbench telemetry."""

    _instance: Optional["LogService"] = None
    _lock = threading.Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_service()
            return cls._instance

    def _init_service(self):
        self._entries: deque[LogEntry] = deque(maxlen=MAX_LOG_ENTRIES)
        self._counter: int = 0
        self._buffer_lock = threading.Lock()

        # Attach handler to root and backend loggers
        self.handler = MemoryLogHandler(self)
        self.handler.setFormatter(
            logging.Formatter("%(message)s")
        )

        root_logger = logging.getLogger()
        backend_logger = logging.getLogger("backend")
        
        # Avoid duplicate attachment
        if not any(isinstance(h, MemoryLogHandler) for h in root_logger.handlers):
            root_logger.addHandler(self.handler)
        if not any(isinstance(h, MemoryLogHandler) for h in backend_logger.handlers):
            backend_logger.addHandler(self.handler)

    def add_entry(
        self,
        level: str,
        logger: str,
        message: str,
        stage_num: Optional[int] = None,
        session_id: Optional[str] = None,
    ) -> LogEntry:
        eff_session = session_id if session_id is not None else CURRENT_SESSION_ID.get()
        with self._buffer_lock:
            self._counter += 1
            now = datetime.now().strftime("%H:%M:%S.%f")[:-3]
            entry = LogEntry(
                id=self._counter,
                timestamp=now,
                level=level.upper(),
                logger=logger,
                stage_num=stage_num,
                message=message,
                session_id=eff_session,
            )
            self._entries.append(entry)
            return entry

    def emit_stage_log(
        self,
        stage_num: int,
        message: str,
        level: str = "INFO",
        session_id: Optional[str] = None,
    ) -> LogEntry:
        """Explicitly records a human-readable stage progress log."""
        full_message = f"[Aşama 0{stage_num}] {message}"
        # Also log through standard python logger so it prints to terminal/daemon
        std_logger = logging.getLogger(f"backend.stages.stage{stage_num}")
        log_func = getattr(std_logger, level.lower(), std_logger.info)
        log_func(full_message)
        return self.add_entry(
            level=level,
            logger=f"backend.stages.stage{stage_num}",
            message=full_message,
            stage_num=stage_num,
            session_id=session_id,
        )

    def get_logs(
        self,
        since_id: int = 0,
        stage_num: Optional[int] = None,
        limit: int = 200,
        session_id: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        with self._buffer_lock:
            results: List[Dict[str, Any]] = []
            for entry in self._entries:
                if entry.id > since_id:
                    if stage_num is not None and entry.stage_num != stage_num:
                        continue
                    if session_id and entry.session_id != session_id:
                        continue
                    results.append(entry.to_dict())
            if limit and len(results) > limit:
                results = results[-limit:]
            return results

    def clear(self):
        with self._buffer_lock:
            self._entries.clear()

    @property
    def latest_id(self) -> int:
        with self._buffer_lock:
            return self._counter


# Global accessor
def get_log_service() -> LogService:
    return LogService()
