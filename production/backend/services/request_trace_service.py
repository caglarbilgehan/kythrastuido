"""
KythraStudio Live HTTP Request Trace & Error Monitoring Service
Captures real-time API traffic (latency, status codes, session_id, user/role, track_name, error_detail)
into a thread-safe in-memory ring buffer so Developer Workbench can observe all Web Studio activity live.
"""

from collections import deque
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
import threading
from typing import Any, Dict, List, Optional

MAX_TRACE_ENTRIES = 500


@dataclass
class RequestTraceEntry:
    id: int
    timestamp: str
    method: str
    path: str
    query: str
    status_code: int
    duration_ms: float
    session_id: Optional[str]
    client_app: str
    user: Optional[Dict[str, Any]]
    track_name: Optional[str]
    error_detail: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class RequestTraceService:
    """Thread-safe in-memory ring buffer for recent HTTP workbench API requests."""

    _instance: Optional["RequestTraceService"] = None
    _lock = threading.Lock()

    def __new__(cls) -> "RequestTraceService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_service()
            return cls._instance

    def _init_service(self) -> None:
        self._entries: deque[RequestTraceEntry] = deque(maxlen=MAX_TRACE_ENTRIES)
        self._counter: int = 0
        self._buffer_lock = threading.Lock()

    def record(
        self,
        *,
        method: str,
        path: str,
        query: str = "",
        status_code: int,
        duration_ms: float,
        session_id: Optional[str] = None,
        client_app: str = "api",
        user: Optional[Dict[str, Any]] = None,
        track_name: Optional[str] = None,
        error_detail: Optional[str] = None,
    ) -> RequestTraceEntry:
        with self._buffer_lock:
            self._counter += 1
            user_summary = (
                {
                    "id": user.get("id"),
                    "username": user.get("username"),
                    "email": user.get("email"),
                    "role": user.get("role", "user"),
                }
                if isinstance(user, dict)
                else None
            )
            entry = RequestTraceEntry(
                id=self._counter,
                timestamp=datetime.now(timezone.utc).strftime("%H:%M:%S.%f")[:-3],
                method=method.upper(),
                path=path,
                query=query,
                status_code=int(status_code),
                duration_ms=round(float(duration_ms), 1),
                session_id=session_id,
                client_app=(client_app or "api").lower(),
                user=user_summary,
                track_name=track_name,
                error_detail=error_detail,
            )
            self._entries.append(entry)
            return entry

    def get_entries(
        self,
        *,
        since_id: int = 0,
        session_id: Optional[str] = None,
        only_errors: bool = False,
        limit: int = 200,
    ) -> List[Dict[str, Any]]:
        with self._buffer_lock:
            results: List[Dict[str, Any]] = []
            for entry in self._entries:
                if entry.id <= since_id:
                    continue
                if session_id and entry.session_id != session_id:
                    continue
                if only_errors and entry.status_code < 400:
                    continue
                results.append(entry.to_dict())
            if limit and len(results) > limit:
                results = results[-limit:]
            return results

    def clear(self) -> None:
        with self._buffer_lock:
            self._entries.clear()

    @property
    def latest_id(self) -> int:
        with self._buffer_lock:
            return self._counter


def get_request_trace_service() -> RequestTraceService:
    return RequestTraceService()
