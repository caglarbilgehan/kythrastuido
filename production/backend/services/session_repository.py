"""
KythraStudio Production Session Repository (Repository Pattern)
Encapsulates thread-safe, atomic disk-backed session persistence, 2-level hash-sharded
persistent track artifacts (beats.json, chords.json, stems.json, lyrics.json),
and PipelineContext reconstruction.
"""

from datetime import datetime, timezone
import hashlib
import json
import logging
import os
from pathlib import Path
import re
import shutil
import tempfile
import threading
import time
from typing import Any, Dict, List, Optional, Tuple
import weakref

from backend.config import DEVICE, SESSION_DIR, SESSIONS_DIR, TRACKS_DIR
from backend.engines.base import PipelineContext
from backend.models import BeatEvent, ChordEvent

logger = logging.getLogger("backend.services.session_repository")

_SAFE_SESSION_ID_RE = re.compile(r"[^a-zA-Z0-9_-]")
_SAFE_TRACK_KEY_RE = re.compile(r"[^a-zA-Z0-9_-]")

ARTIFACT_FILENAMES: Dict[str, str] = {
    "beats": "beats.json",
    "chords": "chords.json",
    "stems": "stems.json",
    "lyrics": "lyrics.json",
}

STAGE_TO_ARTIFACT: Dict[int, str] = {
    1: "beats",
    2: "chords",
    3: "stems",
    4: "lyrics",
}

STAGE_INFO: Dict[int, Dict[str, str]] = {
    1: {
        "id": "beat",
        "name": "Ölçü ve Tempo Tespiti",
        "desc": "Vuruş gücü ve metrik ızgara çıkarımı",
        "engine_name": "madmom RNNDownBeat",
    },
    2: {
        "id": "chord",
        "name": "Akor Tanıma ve Şarkı Yapısı",
        "desc": "Armonik akor tahmini, şarkı tonu ve yapısal bölümleme",
        "engine_name": "BTC-Transformer & allin1",
    },
    3: {
        "id": "mss",
        "name": "Makro Kanal Ayırma (BS-RoFormer 6-Kanal)",
        "desc": "6 kanallı zaman-frekans makro kaynak ayrıştırma",
        "engine_name": "BS-RoFormer-SW",
    },
    4: {
        "id": "lyrics",
        "name": "Otomatik Şarkı Sözü & Karaoke",
        "desc": "İzole vokalden söz transkripsiyonu ve milisaniyelik CTC hizalama",
        "engine_name": "stable-ts & Meta MMS_FA",
    },
}


class _WeakRLock:
    """Thin weak-referenceable wrapper around threading.RLock to prevent memory leaks."""

    def __init__(self) -> None:
        self._lock = threading.RLock()

    def __enter__(self):
        return self._lock.__enter__()

    def __exit__(self, exc_type, exc_val, exc_tb):
        return self._lock.__exit__(exc_type, exc_val, exc_tb)


_DIR_LOCKS: "weakref.WeakValueDictionary[Path, _WeakRLock]" = weakref.WeakValueDictionary()
_LOCKS_MUTEX = threading.Lock()


def _get_dir_lock(session_dir: Path) -> _WeakRLock:
    resolved = session_dir.resolve()
    with _LOCKS_MUTEX:
        lock = _DIR_LOCKS.get(resolved)
        if lock is None:
            lock = _WeakRLock()
            _DIR_LOCKS[resolved] = lock
        return lock


def sanitize_track_key(track_key: str) -> str:
    """Converts a track_key into a filesystem-safe directory name."""
    cleaned = _SAFE_TRACK_KEY_RE.sub("_", (track_key or "").strip()).strip("_")
    return (cleaned or "track")[:64]


def _shard_prefix(track_key: str) -> Tuple[str, str]:
    """Computes 2-level hex/alnum directory shard prefixes, stripping any 'algo:' prefix."""
    raw = (track_key or "").strip()
    core = raw.split(":", 1)[1] if ":" in raw else raw
    clean = re.sub(r"[^a-zA-Z0-9]", "", core).lower()
    if len(clean) >= 4:
        return clean[0:2], clean[2:4]
    digest = hashlib.sha1(raw.encode("utf-8")).hexdigest()
    return digest[0:2], digest[2:4]


def resolve_session_dir_for_id(session_id: Optional[str] = None) -> Path:
    """Resolves an isolated persistent disk session directory per browser session_id."""
    if not session_id or session_id.strip() in ("", "default"):
        return SESSION_DIR
    clean_id = _SAFE_SESSION_ID_RE.sub("", session_id.strip())[:48]
    if not clean_id:
        return SESSION_DIR
    return SESSIONS_DIR / clean_id


def cleanup_stale_session_dirs(max_age_sec: float = 86400.0) -> int:
    """Purges inactive browser session metadata directories older than max_age_sec (never touches tracks)."""
    if not SESSIONS_DIR.exists():
        return 0
    now = time.time()
    removed = 0
    try:
        for child in SESSIONS_DIR.iterdir():
            if not child.is_dir() or child.name == "default":
                continue
            try:
                mtime = child.stat().st_mtime
                state_f = child / "state.json"
                if state_f.exists():
                    mtime = max(mtime, state_f.stat().st_mtime)
                if now - mtime > max_age_sec:
                    shutil.rmtree(child, ignore_errors=True)
                    removed += 1
            except Exception:
                pass
    except Exception:
        pass
    return removed


class SessionRepository:
    def __init__(
        self,
        session_dir: Path = SESSION_DIR,
        session_id: Optional[str] = None,
        tracks_dir: Optional[Path] = None,
    ):
        if session_id and session_dir == SESSION_DIR:
            session_dir = resolve_session_dir_for_id(session_id)
        self.session_id = session_id or "default"
        self.session_dir = session_dir
        self.session_dir.mkdir(parents=True, exist_ok=True)
        if tracks_dir is not None:
            self.tracks_dir = tracks_dir
        elif session_dir == SESSION_DIR or SESSIONS_DIR in session_dir.parents:
            self.tracks_dir = TRACKS_DIR
        else:
            self.tracks_dir = session_dir / "_tracks"
        self.state_file = self.session_dir / "state.json"
        self.source_audio = self.session_dir / "source.wav"
        self.stems_dir = self.session_dir / "stems"
        self._lock = _get_dir_lock(self.session_dir)

    def _atomic_write_text(self, target: Path, content: str) -> None:
        target.parent.mkdir(parents=True, exist_ok=True)
        fd, tmp_name = tempfile.mkstemp(prefix=".tmp_", suffix=target.suffix, dir=str(target.parent))
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as tmp_file:
                tmp_file.write(content)
                tmp_file.flush()
                os.fsync(tmp_file.fileno())
            os.replace(tmp_name, target)
        except BaseException:
            Path(tmp_name).unlink(missing_ok=True)
            raise

    def _default_state(self) -> Dict[str, Any]:
        return {
            "has_session": False,
            "track_name": None,
            "duration_sec": 0.0,
            "sample_rate": 44100,
            "channels": 2,
            "device": DEVICE,
            "stages": {
                str(num): {
                    "id": meta["id"],
                    "name": meta["name"],
                    "desc": meta["desc"],
                    "status": "pending",
                    "timings_ms": 0.0,
                    "summary": None,
                    "error": None,
                }
                for num, meta in STAGE_INFO.items()
            },
        }

    def load_state(self) -> Dict[str, Any]:
        """Loads session state under lock."""
        with self._lock:
            if self.state_file.exists():
                try:
                    data = json.loads(self.state_file.read_text(encoding="utf-8"))
                    old_stages = data.get("stages", {})
                    new_stages: Dict[str, Any] = {}
                    for num, meta in STAGE_INFO.items():
                        s_key = str(num)
                        if s_key in old_stages:
                            entry = dict(old_stages[s_key])
                            entry["id"] = meta["id"]
                            entry["name"] = meta["name"]
                            entry["desc"] = meta["desc"]
                            new_stages[s_key] = entry
                        else:
                            new_stages[s_key] = {
                                "id": meta["id"],
                                "name": meta["name"],
                                "desc": meta["desc"],
                                "status": "pending",
                                "timings_ms": 0.0,
                                "summary": None,
                                "error": None,
                            }
                    data["stages"] = new_stages
                    return data
                except Exception as e:
                    logger.warning("Corrupted state.json, re-initializing: %s", e)
            return self._default_state()

    def save_state(self, state: Dict[str, Any]) -> None:
        """Persists session state atomically under repository lock."""
        with self._lock:
            payload = json.dumps(state, indent=2, ensure_ascii=False)
            self._atomic_write_text(self.state_file, payload)

    def touch_session_metadata(
        self,
        *,
        client_app: Optional[str] = None,
        user: Optional[Dict[str, Any]] = None,
        force: bool = False,
    ) -> None:
        """Records last_active_at, client_app, and user summary onto state.json for Developer observability."""
        with self._lock:
            state = self.load_state()
            now_dt = datetime.now(timezone.utc)
            now_iso = now_dt.isoformat()
            prev_ts = state.get("last_active_at")
            elapsed_too_recent = False
            if not force and prev_ts:
                try:
                    prev_dt = datetime.fromisoformat(str(prev_ts))
                    if (now_dt - prev_dt).total_seconds() < 10.0:
                        elapsed_too_recent = True
                except Exception:
                    pass

            user_summary = (
                {
                    "id": user.get("id"),
                    "username": user.get("username"),
                    "email": user.get("email"),
                    "role": user.get("role", "user"),
                }
                if isinstance(user, dict)
                else state.get("session_user")
            )
            new_client = (client_app or state.get("client_app") or "api").lower()

            meta_changed = (
                new_client != state.get("client_app")
                or user_summary != state.get("session_user")
                or not prev_ts
            )
            if not meta_changed and elapsed_too_recent:
                return

            state["last_active_at"] = now_iso
            state["client_app"] = new_client
            if user_summary is not None:
                state["session_user"] = user_summary
            self.save_state(state)

    @staticmethod
    def list_all_sessions(sessions_dir: Path = SESSIONS_DIR) -> List[Dict[str, Any]]:
        """Scans active/recent sessions under sessions_dir and returns compact telemetry summaries."""
        if not sessions_dir.exists():
            return []

        summaries: List[Dict[str, Any]] = []
        for child in sessions_dir.iterdir():
            if not child.is_dir():
                continue
            state_path = child / "state.json"
            data: Dict[str, Any] = {}
            mtime_iso = datetime.fromtimestamp(child.stat().st_mtime, tz=timezone.utc).isoformat()
            if state_path.exists():
                try:
                    data = json.loads(state_path.read_text(encoding="utf-8"))
                    mtime_iso = datetime.fromtimestamp(
                        state_path.stat().st_mtime, tz=timezone.utc
                    ).isoformat()
                except Exception:
                    data = {}
            elif child.name != "default":
                continue

            stages_raw = data.get("stages") or {}
            compact_stages: Dict[str, Dict[str, Any]] = {}
            is_running = bool(data.get("sections_refining"))
            for key in ("1", "2", "3", "4"):
                st = stages_raw.get(key) or {}
                status = str(st.get("status") or "pending")
                if status == "running":
                    is_running = True
                compact_stages[key] = {
                    "status": status,
                    "timings_ms": float(st.get("timings_ms") or 0.0),
                }

            summaries.append({
                "session_id": child.name,
                "has_session": bool(data.get("has_session")),
                "track_name": data.get("track_name"),
                "track_key": data.get("track_key"),
                "duration_sec": float(data.get("duration_sec") or 0.0),
                "last_active_at": data.get("last_active_at") or mtime_iso,
                "client_app": data.get("client_app") or ("developer" if child.name == "default" else "web"),
                "user": data.get("session_user"),
                "is_running": is_running,
                "sections_refining": bool(data.get("sections_refining")),
                "stages": compact_stages,
            })

        summaries.sort(
            key=lambda s: (s.get("last_active_at") or "", s.get("session_id") == "default"),
            reverse=True,
        )
        return summaries

    def update_stage_state(self, stage_num: int, **updates: Any) -> Dict[str, Any]:
        """Atomically merges updates into a single stage without clobbering parallel sibling updates."""
        with self._lock:
            state = self.load_state()
            s_key = str(stage_num)
            if s_key in state.get("stages", {}):
                state["stages"][s_key].update(updates)
                self.save_state(state)
            return state

    def reset(self) -> Dict[str, Any]:
        """Purges ephemeral session metadata and resets state to blank under lock."""
        with self._lock:
            if self.session_dir.exists():
                for item in self.session_dir.iterdir():
                    if item.is_dir():
                        shutil.rmtree(item, ignore_errors=True)
                    else:
                        item.unlink(missing_ok=True)
            default_state = self._default_state()
            self.save_state(default_state)
            return default_state

    def get_track_dir(self, track_key: str) -> Path:
        """Returns 2-level hash-sharded persistent disk folder for a canonical track_key."""
        p1, p2 = _shard_prefix(track_key)
        return self.tracks_dir / p1 / p2 / sanitize_track_key(track_key)

    def get_persistent_source_path(self, track_key: str) -> Path:
        """Ensures persistent sharded track folder exists and returns its master source.wav path."""
        track_dir = self.get_track_dir(track_key)
        track_dir.mkdir(parents=True, exist_ok=True)
        return track_dir / "source.wav"

    def get_persistent_stems_dir(self, track_key: str) -> Path:
        """Ensures persistent track stems folder exists and returns it."""
        stems_dir = self.get_track_dir(track_key) / "stems"
        stems_dir.mkdir(parents=True, exist_ok=True)
        return stems_dir

    def delete_track_audio(self, track_key: str) -> bool:
        """Deletes persistent master, stem audio, and cached artifacts for a track_key."""
        track_dir = self.get_track_dir(track_key)
        if track_dir.exists():
            shutil.rmtree(track_dir, ignore_errors=True)
            return True
        return False

    def has_source_audio(self) -> bool:
        return self.get_source_audio_path().exists()

    def get_source_audio_path(self) -> Path:
        if self.source_audio.exists():
            return self.source_audio
        state = self.load_state()
        tk = state.get("track_key")
        if tk:
            persistent_source = self.get_track_dir(str(tk)) / "source.wav"
            if persistent_source.exists():
                return persistent_source
        return self.source_audio

    def get_stems_dir(self) -> Path:
        state = self.load_state()
        tk = state.get("track_key")
        if tk:
            return self.get_persistent_stems_dir(str(tk))
        self.stems_dir.mkdir(parents=True, exist_ok=True)
        return self.stems_dir

    def _resolve_artifact_filename(self, artifact_key: str) -> str:
        return ARTIFACT_FILENAMES.get(artifact_key, f"{artifact_key}.json")

    def save_artifact(self, artifact_key: str, data: Dict[str, Any]) -> None:
        """Persists a domain artifact (beats, chords, stems, lyrics) to the track folder or session dir."""
        fname = self._resolve_artifact_filename(artifact_key)
        with self._lock:
            state = self.load_state()
            tk = state.get("track_key")
            target = (self.get_track_dir(str(tk)) / fname) if tk else (self.session_dir / fname)
            payload = json.dumps(data, indent=2, ensure_ascii=False)
            self._atomic_write_text(target, payload)

    def load_artifact(self, artifact_key: str) -> Optional[Dict[str, Any]]:
        """Loads a domain artifact from the sharded track folder, falling back to session dir."""
        fname = self._resolve_artifact_filename(artifact_key)
        with self._lock:
            state = self.load_state()
            tk = state.get("track_key")
            candidates = []
            if tk:
                candidates.append(self.get_track_dir(str(tk)) / fname)
            candidates.append(self.session_dir / fname)
            for target in candidates:
                if target.exists():
                    try:
                        return json.loads(target.read_text(encoding="utf-8"))
                    except Exception as e:
                        logger.error("Error reading %s: %s", target, e)
            return None

    def load_stage_data(self, stage_num: int) -> Optional[Dict[str, Any]]:
        artifact_key = STAGE_TO_ARTIFACT.get(stage_num)
        return self.load_artifact(artifact_key) if artifact_key else None

    def save_stage_output(self, filename: str, data: Dict[str, Any]) -> None:
        with self._lock:
            target = self.session_dir / filename
            payload = json.dumps(data, indent=2, ensure_ascii=False)
            self._atomic_write_text(target, payload)

    def load_stage_output(self, filename: str) -> Optional[Dict[str, Any]]:
        with self._lock:
            target = self.session_dir / filename
            if target.exists():
                try:
                    return json.loads(target.read_text(encoding="utf-8"))
                except Exception as e:
                    logger.error("Error reading %s: %s", filename, e)
            return None

    def build_context_from_session(self) -> PipelineContext:
        """Reconstructs PipelineContext from existing persistent disk artifacts."""
        source_path = self.get_source_audio_path()
        if not source_path.exists():
            raise FileNotFoundError("Source audio not found. Upload an audio file first.")

        ctx = PipelineContext(audio_path=source_path)

        # 1. Separated Stems
        stems_dir = self.get_stems_dir()
        if stems_dir.exists():
            for stem_f in stems_dir.glob("*.wav"):
                stem_key = stem_f.stem.lower()
                ctx.separated_stems[stem_key] = stem_f
            if "guitar" in ctx.separated_stems:
                ctx.active_guitar_path = ctx.separated_stems["guitar"]

        # 2. Beats artifact
        d_beats = self.load_artifact("beats")
        if d_beats:
            try:
                ctx.tempo_bpm = d_beats.get("tempo_bpm", 120.0)
                ctx.time_signature = d_beats.get("time_signature", "4/4")
                ctx.beats = [BeatEvent(**b) for b in d_beats.get("beats", [])]
            except Exception as e:
                logger.warning("Error loading beats.json: %s", e)

        # 3. Chords artifact
        d_chords = self.load_artifact("chords")
        if d_chords:
            try:
                ctx.chords = [ChordEvent(**c) for c in d_chords.get("chords", [])]
                if d_chords.get("key_signature"):
                    ctx.key_signature = d_chords["key_signature"]
            except Exception as e:
                logger.warning("Error loading chords.json: %s", e)

        return ctx
