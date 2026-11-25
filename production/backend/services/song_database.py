"""
KythraStudio Versioned Song Metadata, Auth, Favorites, Playlists, Private Uploads & Lyric Revisions Database
Persists:
1. Public/demo analyzed song metadata (`analyzed_songs` — NEVER user-uploaded private files, NEVER audio files!)
2. Users & Session Tokens (`users`, `auth_tokens`)
3. User Private Uploaded Song Analyses (`user_private_songs` — visible strictly to the owner user!)
4. User Favorites (`user_favorites`) & Custom Playlists (`user_playlists`, `user_playlist_items`)
5. Versioned Lyric Revision Audit Logs (`lyric_revisions` — tracks who edited, diff summary, version number, timestamp)
"""

from datetime import datetime, timezone
import hashlib
import hmac
import json
import logging
import os
from pathlib import Path
import secrets
import sqlite3
import threading
import uuid
from typing import Any, Dict, List, Optional

from backend.config import APP_PIPELINE_VERSION, SONG_DB_PATH
from backend.domain.chords import coalesce_consecutive_sections

logger = logging.getLogger("backend.services.song_database")

_DB_LOCK = threading.RLock()


def _hash_password(password: str, salt: Optional[str] = None) -> str:
    salt_str = salt or secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt_str.encode("utf-8"), 120_000)
    return f"{salt_str}${dk.hex()}"


def _verify_password(password: str, stored_hash: str) -> bool:
    if "$" not in stored_hash:
        return False
    salt_str, _ = stored_hash.split("$", 1)
    expected = _hash_password(password, salt=salt_str)
    return hmac.compare_digest(expected, stored_hash)


class SongDatabase:
    def __init__(self, db_path: Path = SONG_DB_PATH):
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_schema()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path), timeout=15.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        conn.execute("PRAGMA foreign_keys=ON;")
        return conn

    def _migrate_stage_columns(self, conn: sqlite3.Connection, table_name: str) -> None:
        cols = {row["name"] for row in conn.execute(f"PRAGMA table_info({table_name})").fetchall()}
        renames = [
            ("stage1_json", "beats_json"),
            ("stage2_json", "chords_json"),
            ("stage3_json", "stems_json"),
        ]
        for old_col, new_col in renames:
            if old_col in cols and new_col not in cols:
                conn.execute(f"ALTER TABLE {table_name} RENAME COLUMN {old_col} TO {new_col}")
                cols.add(new_col)

    def _init_schema(self) -> None:
        with _DB_LOCK:
            with self._connect() as conn:
                # 1. Public / Demo Analyzed Songs (NO private user uploads)
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS analyzed_songs (
                        track_key TEXT PRIMARY KEY,
                        title TEXT NOT NULL,
                        duration_sec REAL NOT NULL,
                        tempo_bpm REAL NOT NULL,
                        key_signature TEXT NOT NULL,
                        time_signature TEXT NOT NULL,
                        primary_progression TEXT,
                        pipeline_version TEXT NOT NULL,
                        beats_json TEXT NOT NULL,
                        chords_json TEXT NOT NULL,
                        stems_json TEXT DEFAULT '{}',
                        waveform_json TEXT NOT NULL,
                        lyrics_json TEXT DEFAULT '[]',
                        lyrics_source TEXT DEFAULT 'none',
                        lyrics_version INTEGER DEFAULT 1,
                        lyrics_updated_by TEXT,
                        updated_at TEXT NOT NULL
                    )
                    """
                )
                self._migrate_stage_columns(conn, "analyzed_songs")
                for col_sql in [
                    "ALTER TABLE analyzed_songs ADD COLUMN stems_json TEXT DEFAULT '{}'",
                    "ALTER TABLE analyzed_songs ADD COLUMN lyrics_json TEXT DEFAULT '[]'",
                    "ALTER TABLE analyzed_songs ADD COLUMN lyrics_source TEXT DEFAULT 'none'",
                    "ALTER TABLE analyzed_songs ADD COLUMN lyrics_version INTEGER DEFAULT 1",
                    "ALTER TABLE analyzed_songs ADD COLUMN lyrics_updated_by TEXT",
                ]:
                    try:
                        conn.execute(col_sql)
                    except sqlite3.OperationalError:
                        pass

                conn.execute("DELETE FROM analyzed_songs WHERE track_key LIKE 'sha256:%'")

                # 2. Users & Session Tokens
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        email TEXT UNIQUE NOT NULL,
                        username TEXT NOT NULL,
                        password_hash TEXT NOT NULL,
                        role TEXT NOT NULL DEFAULT 'user',
                        created_at TEXT NOT NULL
                    )
                    """
                )
                try:
                    conn.execute("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'")
                except sqlite3.OperationalError:
                    pass
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS auth_tokens (
                        token TEXT PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        created_at TEXT NOT NULL,
                        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                    )
                    """
                )

                # 3. Private User-Uploaded Songs (Visible ONLY to owner user_id)
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS user_private_songs (
                        user_id TEXT NOT NULL,
                        track_key TEXT NOT NULL,
                        title TEXT NOT NULL,
                        duration_sec REAL NOT NULL,
                        tempo_bpm REAL NOT NULL,
                        key_signature TEXT NOT NULL,
                        time_signature TEXT NOT NULL,
                        primary_progression TEXT,
                        pipeline_version TEXT NOT NULL,
                        beats_json TEXT NOT NULL,
                        chords_json TEXT NOT NULL,
                        stems_json TEXT DEFAULT '{}',
                        waveform_json TEXT NOT NULL,
                        lyrics_json TEXT DEFAULT '[]',
                        lyrics_source TEXT DEFAULT 'user',
                        lyrics_version INTEGER DEFAULT 1,
                        updated_at TEXT NOT NULL,
                        PRIMARY KEY (user_id, track_key)
                    )
                    """
                )
                self._migrate_stage_columns(conn, "user_private_songs")
                for col_sql in [
                    "ALTER TABLE user_private_songs ADD COLUMN stems_json TEXT DEFAULT '{}'",
                ]:
                    try:
                        conn.execute(col_sql)
                    except sqlite3.OperationalError:
                        pass

                # 4. User Favorites
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS user_favorites (
                        user_id TEXT NOT NULL,
                        track_key TEXT NOT NULL,
                        title TEXT NOT NULL,
                        tempo_bpm REAL DEFAULT 120.0,
                        key_signature TEXT DEFAULT 'C major',
                        time_signature TEXT DEFAULT '4/4',
                        is_private INTEGER DEFAULT 0,
                        created_at TEXT NOT NULL,
                        PRIMARY KEY (user_id, track_key)
                    )
                    """
                )

                # 5. User Custom Playlists
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS user_playlists (
                        id TEXT PRIMARY KEY,
                        user_id TEXT NOT NULL,
                        name TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    )
                    """
                )
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS user_playlist_items (
                        playlist_id TEXT NOT NULL,
                        track_key TEXT NOT NULL,
                        title TEXT NOT NULL,
                        tempo_bpm REAL DEFAULT 120.0,
                        key_signature TEXT DEFAULT 'C major',
                        time_signature TEXT DEFAULT '4/4',
                        is_private INTEGER DEFAULT 0,
                        added_at TEXT NOT NULL,
                        PRIMARY KEY (playlist_id, track_key)
                    )
                    """
                )

                # 6. Lyric Revision History Log
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS lyric_revisions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        track_key TEXT NOT NULL,
                        version_num INTEGER NOT NULL,
                        user_id TEXT,
                        username TEXT NOT NULL,
                        change_summary TEXT NOT NULL,
                        previous_lyrics_json TEXT NOT NULL,
                        new_lyrics_json TEXT NOT NULL,
                        created_at TEXT NOT NULL
                    )
                    """
                )
                conn.execute(
                    "CREATE INDEX IF NOT EXISTS idx_lyric_revs_track ON lyric_revisions(track_key, version_num DESC)"
                )
                conn.commit()

    # =========================================================================
    # PUBLIC SONG CATALOG METHODS
    # =========================================================================
    def get_valid_cached_song(
        self,
        track_key: str,
        required_version: str = APP_PIPELINE_VERSION,
        user_id: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Returns cached song metadata.
        - If track_key starts with 'sha256:' (user file upload), ONLY checks user_private_songs for that user_id!
        - Otherwise checks public analyzed_songs.
        """
        if not track_key:
            return None

        if track_key.startswith("sha256:"):
            if not user_id:
                return None
            return self.get_user_private_song(user_id, track_key)

        with _DB_LOCK:
            with self._connect() as conn:
                row = conn.execute(
                    "SELECT * FROM analyzed_songs WHERE track_key = ?",
                    (track_key,),
                ).fetchone()
                if not row:
                    return None
                if row["pipeline_version"] != required_version:
                    return None
                return self._deserialize_song_row(row, is_private=False)

    def _deserialize_song_row(self, row: sqlite3.Row, is_private: bool = False) -> Optional[Dict[str, Any]]:
        try:
            keys = row.keys()
            beats = json.loads(row["beats_json"])
            chords = json.loads(row["chords_json"])
            stems_raw = row["stems_json"] if "stems_json" in keys and row["stems_json"] else "{}"
            stems = json.loads(stems_raw)
            if not isinstance(stems, dict):
                stems = {}
            waveform = json.loads(row["waveform_json"])
            lyrics_raw = row["lyrics_json"] if "lyrics_json" in keys and row["lyrics_json"] else "[]"
            lyrics = json.loads(lyrics_raw)
            lyrics_source = row["lyrics_source"] if "lyrics_source" in keys and row["lyrics_source"] else "none"
            lyrics_version = int(row["lyrics_version"] if "lyrics_version" in keys and row["lyrics_version"] else 1)
            lyrics_updated_by = row["lyrics_updated_by"] if "lyrics_updated_by" in keys else None

            if chords.get("sections"):
                chords["sections"] = coalesce_consecutive_sections(
                    chords["sections"],
                    total_bars=len(chords.get("bars", [])),
                )
            return {
                "track_key": row["track_key"],
                "title": row["title"],
                "duration_sec": row["duration_sec"],
                "tempo_bpm": row["tempo_bpm"],
                "key_signature": row["key_signature"],
                "time_signature": row["time_signature"],
                "primary_progression": row["primary_progression"],
                "pipeline_version": row["pipeline_version"],
                "beats": beats,
                "chords": chords,
                "stems": stems,
                "stage1": beats,
                "stage2": chords,
                "stage3": stems,
                "waveform_peaks": waveform,
                "lyrics": lyrics if isinstance(lyrics, list) else [],
                "lyrics_source": lyrics_source,
                "lyrics_locked": lyrics_source == "lrclib" and not is_private,
                "lyrics_version": lyrics_version,
                "lyrics_updated_by": lyrics_updated_by,
                "is_private": is_private,
                "updated_at": row["updated_at"],
            }
        except Exception as e:
            logger.warning("Failed to deserialize song %s: %s", row["track_key"], e)
            return None

    def save_song_analysis(
        self,
        track_key: str,
        title: str,
        duration_sec: float,
        stage1: Dict[str, Any],
        stage2: Dict[str, Any],
        waveform_peaks: List[float],
        lyrics: Optional[List[Dict[str, Any]]] = None,
        lyrics_source: str = "none",
        pipeline_version: str = APP_PIPELINE_VERSION,
        owner_user_id: Optional[str] = None,
        is_private_upload: bool = False,
        stage3: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Saves song analysis metadata:
        - If is_private_upload is True (or track_key starts with 'sha256:'):
          NEVER writes to public analyzed_songs! Only writes to user_private_songs if owner_user_id is authenticated.
        """
        if not track_key:
            return

        if is_private_upload or track_key.startswith("sha256:"):
            if owner_user_id:
                self.save_user_private_song(
                    user_id=owner_user_id,
                    track_key=track_key,
                    title=title,
                    duration_sec=duration_sec,
                    stage1=stage1,
                    stage2=stage2,
                    waveform_peaks=waveform_peaks,
                    lyrics=lyrics,
                    pipeline_version=pipeline_version,
                    stage3=stage3,
                )
            return

        tempo_bpm = float(stage1.get("tempo_bpm", 120.0))
        time_sig = str(stage1.get("time_signature", "4/4"))
        key_sig = str(stage2.get("key_signature", "C major"))
        prog = str(stage2.get("primary_progression", ""))
        now_iso = datetime.now(timezone.utc).isoformat()
        lyrics_list = lyrics if isinstance(lyrics, list) else []

        if stage2.get("sections"):
            stage2 = dict(stage2)
            stage2["sections"] = coalesce_consecutive_sections(
                stage2["sections"],
                total_bars=len(stage2.get("bars", [])),
            )

        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    """
                    INSERT INTO analyzed_songs (
                        track_key, title, duration_sec,
                        tempo_bpm, key_signature, time_signature, primary_progression,
                        pipeline_version, beats_json, chords_json, waveform_json,
                        lyrics_json, lyrics_source, lyrics_version, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                    ON CONFLICT(track_key) DO UPDATE SET
                        title = excluded.title,
                        duration_sec = excluded.duration_sec,
                        tempo_bpm = excluded.tempo_bpm,
                        key_signature = excluded.key_signature,
                        time_signature = excluded.time_signature,
                        primary_progression = excluded.primary_progression,
                        pipeline_version = excluded.pipeline_version,
                        beats_json = excluded.beats_json,
                        chords_json = excluded.chords_json,
                        waveform_json = excluded.waveform_json,
                        lyrics_json = CASE
                            WHEN analyzed_songs.lyrics_source IN ('lrclib', 'user') AND length(analyzed_songs.lyrics_json) > 5
                            THEN analyzed_songs.lyrics_json
                            ELSE excluded.lyrics_json
                        END,
                        lyrics_source = CASE
                            WHEN analyzed_songs.lyrics_source IN ('lrclib', 'user') AND length(analyzed_songs.lyrics_json) > 5
                            THEN analyzed_songs.lyrics_source
                            ELSE excluded.lyrics_source
                        END,
                        updated_at = excluded.updated_at
                    """,
                    (
                        track_key,
                        title,
                        round(float(duration_sec), 2),
                        round(tempo_bpm, 1),
                        key_sig,
                        time_sig,
                        prog,
                        pipeline_version,
                        json.dumps(stage1, ensure_ascii=False),
                        json.dumps(stage2, ensure_ascii=False),
                        json.dumps(waveform_peaks),
                        json.dumps(lyrics_list, ensure_ascii=False),
                        lyrics_source,
                        now_iso,
                    ),
                )
                conn.commit()

    def update_song_lyrics(
        self,
        track_key: str,
        lyrics: List[Dict[str, Any]],
        lyrics_source: str = "lrclib",
    ) -> None:
        if not track_key or track_key.startswith("sha256:"):
            return
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    "UPDATE analyzed_songs SET lyrics_json = ?, lyrics_source = ? WHERE track_key = ?",
                    (json.dumps(lyrics, ensure_ascii=False), lyrics_source, track_key),
                )
                conn.commit()

    def save_community_or_private_lyrics_edit(
        self,
        track_key: str,
        new_lyrics: List[Dict[str, Any]],
        user: Optional[Dict[str, Any]],
        change_summary: str = "",
    ) -> Dict[str, Any]:
        """
        Updates lyrics with strict locking and versioned audit logging:
        - If song is in public analyzed_songs and lyrics_source == 'lrclib', editing is FORBIDDEN!
        - If song is a private upload (sha256:*), updates user_private_songs for the owner user.
        - Every edit increments lyrics_version (+1) and writes an immutable record to lyric_revisions.
        """
        now_iso = datetime.now(timezone.utc).isoformat()
        user_id = user["id"] if user else None
        username = user["username"] if user else "Misafir (Guest)"

        with _DB_LOCK:
            with self._connect() as conn:
                if track_key.startswith("sha256:"):
                    if not user_id:
                        return {
                            "track_key": track_key,
                            "lyrics": new_lyrics,
                            "lyrics_source": "user",
                            "lyrics_locked": False,
                            "lyrics_version": 1,
                            "lyrics_updated_by": username,
                        }
                    row = conn.execute(
                        "SELECT lyrics_json, lyrics_version FROM user_private_songs WHERE user_id = ? AND track_key = ?",
                        (user_id, track_key),
                    ).fetchone()
                    prev_json = row["lyrics_json"] if row and row["lyrics_json"] else "[]"
                    prev_ver = int(row["lyrics_version"]) if row and row["lyrics_version"] else 0
                    next_ver = prev_ver + 1
                    new_json = json.dumps(new_lyrics, ensure_ascii=False)

                    if row:
                        conn.execute(
                            """
                            UPDATE user_private_songs
                            SET lyrics_json = ?, lyrics_source = 'user', lyrics_version = ?, updated_at = ?
                            WHERE user_id = ? AND track_key = ?
                            """,
                            (new_json, next_ver, now_iso, user_id, track_key),
                        )
                else:
                    row = conn.execute(
                        "SELECT lyrics_json, lyrics_source, lyrics_version FROM analyzed_songs WHERE track_key = ?",
                        (track_key,),
                    ).fetchone()
                    if not row:
                        raise ValueError("Song not found in database.")
                    if row["lyrics_source"] == "lrclib" and len(json.loads(row["lyrics_json"] or "[]")) > 0:
                        raise PermissionError(
                            "Official LRCLIB synchronized lyrics are verified and locked from editing."
                        )
                    prev_json = row["lyrics_json"] or "[]"
                    prev_ver = int(row["lyrics_version"] or 1)
                    next_ver = prev_ver + 1
                    new_json = json.dumps(new_lyrics, ensure_ascii=False)

                    conn.execute(
                        """
                        UPDATE analyzed_songs
                        SET lyrics_json = ?, lyrics_source = 'user', lyrics_version = ?,
                            lyrics_updated_by = ?, updated_at = ?
                        WHERE track_key = ?
                        """,
                        (new_json, next_ver, username, now_iso, track_key),
                    )

                prev_count = len(json.loads(prev_json))
                new_count = len(new_lyrics)
                summary = change_summary.strip() or f"{prev_count} satır -> {new_count} satır güncellendi (v{next_ver})"

                conn.execute(
                    """
                    INSERT INTO lyric_revisions (
                        track_key, version_num, user_id, username, change_summary,
                        previous_lyrics_json, new_lyrics_json, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        track_key,
                        next_ver,
                        user_id,
                        username,
                        summary,
                        prev_json,
                        new_json,
                        now_iso,
                    ),
                )
                conn.commit()

                return {
                    "track_key": track_key,
                    "lyrics": new_lyrics,
                    "lyrics_source": "user",
                    "lyrics_locked": False,
                    "lyrics_version": next_ver,
                    "lyrics_updated_by": username,
                    "updated_at": now_iso,
                }

    def list_lyric_revisions(self, track_key: str, limit: int = 20) -> List[Dict[str, Any]]:
        with _DB_LOCK:
            with self._connect() as conn:
                rows = conn.execute(
                    """
                    SELECT id, track_key, version_num, user_id, username, change_summary, created_at
                    FROM lyric_revisions
                    WHERE track_key = ?
                    ORDER BY version_num DESC
                    LIMIT ?
                    """,
                    (track_key, limit),
                ).fetchall()
                return [
                    {
                        "id": r["id"],
                        "track_key": r["track_key"],
                        "version_num": r["version_num"],
                        "user_id": r["user_id"],
                        "username": r["username"],
                        "change_summary": r["change_summary"],
                        "created_at": r["created_at"],
                    }
                    for r in rows
                ]

    def list_cached_songs(self, limit: int = 30) -> List[Dict[str, Any]]:
        """Lists public/demo analyzed songs (never private sha256 uploads)."""
        with _DB_LOCK:
            with self._connect() as conn:
                rows = conn.execute(
                    """
                    SELECT track_key, title, duration_sec,
                           tempo_bpm, key_signature, time_signature, primary_progression,
                           pipeline_version, updated_at
                    FROM analyzed_songs
                    WHERE track_key NOT LIKE 'sha256:%'
                    ORDER BY updated_at DESC
                    LIMIT ?
                    """,
                    (limit,),
                ).fetchall()
                return [
                    {
                        "track_key": r["track_key"],
                        "title": r["title"],
                        "duration_sec": r["duration_sec"],
                        "tempo_bpm": r["tempo_bpm"],
                        "key_signature": r["key_signature"],
                        "time_signature": r["time_signature"],
                        "primary_progression": r["primary_progression"],
                        "pipeline_version": r["pipeline_version"],
                        "is_current_version": r["pipeline_version"] == APP_PIPELINE_VERSION,
                        "updated_at": r["updated_at"],
                    }
                    for r in rows
                ]

    # =========================================================================
    # USER PRIVATE UPLOADS (STRICTLY PER-USER)
    # =========================================================================
    def save_user_private_song(
        self,
        user_id: str,
        track_key: str,
        title: str,
        duration_sec: float,
        stage1: Dict[str, Any],
        stage2: Dict[str, Any],
        waveform_peaks: List[float],
        lyrics: Optional[List[Dict[str, Any]]] = None,
        pipeline_version: str = APP_PIPELINE_VERSION,
        stage3: Optional[Dict[str, Any]] = None,
    ) -> None:
        tempo_bpm = float(stage1.get("tempo_bpm", 120.0))
        time_sig = str(stage1.get("time_signature", "4/4"))
        key_sig = str(stage2.get("key_signature", "C major"))
        prog = str(stage2.get("primary_progression", ""))
        now_iso = datetime.now(timezone.utc).isoformat()
        lyrics_list = lyrics if isinstance(lyrics, list) else []
        stage3_payload = stage3 if isinstance(stage3, dict) else {}

        if stage2.get("sections"):
            stage2 = dict(stage2)
            stage2["sections"] = coalesce_consecutive_sections(
                stage2["sections"],
                total_bars=len(stage2.get("bars", [])),
            )

        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    """
                    INSERT INTO user_private_songs (
                        user_id, track_key, title, duration_sec, tempo_bpm,
                        key_signature, time_signature, primary_progression,
                        pipeline_version, beats_json, chords_json, stems_json,
                        waveform_json,
                        lyrics_json, lyrics_source, lyrics_version, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 1, ?)
                    ON CONFLICT(user_id, track_key) DO UPDATE SET
                        title = excluded.title,
                        duration_sec = excluded.duration_sec,
                        tempo_bpm = excluded.tempo_bpm,
                        key_signature = excluded.key_signature,
                        time_signature = excluded.time_signature,
                        primary_progression = excluded.primary_progression,
                        pipeline_version = excluded.pipeline_version,
                        beats_json = excluded.beats_json,
                        chords_json = excluded.chords_json,
                        stems_json = CASE
                            WHEN length(excluded.stems_json) > 5 THEN excluded.stems_json
                            ELSE user_private_songs.stems_json
                        END,
                        waveform_json = excluded.waveform_json,
                        updated_at = excluded.updated_at
                    """,
                    (
                        user_id,
                        track_key,
                        title,
                        round(float(duration_sec), 2),
                        round(tempo_bpm, 1),
                        key_sig,
                        time_sig,
                        prog,
                        pipeline_version,
                        json.dumps(stage1, ensure_ascii=False),
                        json.dumps(stage2, ensure_ascii=False),
                        json.dumps(stage3_payload, ensure_ascii=False),
                        json.dumps(waveform_peaks),
                        json.dumps(lyrics_list, ensure_ascii=False),
                        now_iso,
                    ),
                )
                conn.commit()

    def update_user_private_song_stage3(
        self,
        user_id: str,
        track_key: str,
        stage3: Dict[str, Any],
    ) -> None:
        if not user_id or not track_key:
            return
        now_iso = datetime.now(timezone.utc).isoformat()
        stage3_payload = stage3 if isinstance(stage3, dict) else {}
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    """
                    UPDATE user_private_songs
                    SET stems_json = ?,
                        updated_at = ?
                    WHERE user_id = ? AND track_key = ?
                    """,
                    (
                        json.dumps(stage3_payload, ensure_ascii=False),
                        now_iso,
                        user_id,
                        track_key,
                    ),
                )
                conn.commit()

    def update_user_private_song_lyrics(
        self,
        user_id: str,
        track_key: str,
        lyrics: List[Dict[str, Any]],
        lyrics_source: str = "ai",
    ) -> None:
        """Persists auto-transcribed lyrics without overwriting manual user edits."""
        if not user_id or not track_key or not isinstance(lyrics, list):
            return
        now_iso = datetime.now(timezone.utc).isoformat()
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    """
                    UPDATE user_private_songs
                    SET lyrics_json = ?,
                        lyrics_source = ?,
                        updated_at = ?
                    WHERE user_id = ? AND track_key = ?
                      AND (
                          lyrics_source != 'user'
                          OR lyrics_json IS NULL
                          OR length(lyrics_json) <= 5
                      )
                    """,
                    (
                        json.dumps(lyrics, ensure_ascii=False),
                        lyrics_source,
                        now_iso,
                        user_id,
                        track_key,
                    ),
                )
                conn.commit()

    def get_user_private_song(self, user_id: str, track_key: str) -> Optional[Dict[str, Any]]:
        with _DB_LOCK:
            with self._connect() as conn:
                row = conn.execute(
                    "SELECT * FROM user_private_songs WHERE user_id = ? AND track_key = ?",
                    (user_id, track_key),
                ).fetchone()
                if not row:
                    return None
                return self._deserialize_song_row(row, is_private=True)

    def list_user_private_songs(self, user_id: str) -> List[Dict[str, Any]]:
        with _DB_LOCK:
            with self._connect() as conn:
                rows = conn.execute(
                    """
                    SELECT track_key, title, duration_sec, tempo_bpm, key_signature,
                           time_signature, primary_progression, pipeline_version, updated_at
                    FROM user_private_songs
                    WHERE user_id = ?
                    ORDER BY updated_at DESC
                    """,
                    (user_id,),
                ).fetchall()
                return [
                    {
                        "track_key": r["track_key"],
                        "title": r["title"],
                        "duration_sec": r["duration_sec"],
                        "tempo_bpm": r["tempo_bpm"],
                        "key_signature": r["key_signature"],
                        "time_signature": r["time_signature"],
                        "primary_progression": r["primary_progression"],
                        "pipeline_version": r["pipeline_version"],
                        "is_private": True,
                        "updated_at": r["updated_at"],
                    }
                    for r in rows
                ]

    def rename_user_private_song(
        self,
        user_id: str,
        track_key: str,
        new_title: str,
    ) -> Dict[str, Any]:
        clean_title = new_title.strip()[:120]
        if not clean_title:
            raise ValueError("Track title cannot be empty.")
        now_iso = datetime.now(timezone.utc).isoformat()
        with _DB_LOCK:
            with self._connect() as conn:
                cur = conn.execute(
                    """
                    UPDATE user_private_songs
                    SET title = ?, updated_at = ?
                    WHERE user_id = ? AND track_key = ?
                    """,
                    (clean_title, now_iso, user_id, track_key),
                )
                if cur.rowcount == 0:
                    raise KeyError("Track not found.")
                conn.execute(
                    """
                    UPDATE user_favorites
                    SET title = ?
                    WHERE user_id = ? AND track_key = ?
                    """,
                    (clean_title, user_id, track_key),
                )
                conn.execute(
                    """
                    UPDATE user_playlist_items
                    SET title = ?
                    WHERE track_key = ?
                      AND playlist_id IN (SELECT id FROM user_playlists WHERE user_id = ?)
                    """,
                    (clean_title, track_key, user_id),
                )
                conn.commit()
        return {"track_key": track_key, "title": clean_title}

    def delete_user_private_song(self, user_id: str, track_key: str) -> bool:
        with _DB_LOCK:
            with self._connect() as conn:
                cur = conn.execute(
                    "DELETE FROM user_private_songs WHERE user_id = ? AND track_key = ?",
                    (user_id, track_key),
                )
                conn.execute(
                    "DELETE FROM user_favorites WHERE user_id = ? AND track_key = ?",
                    (user_id, track_key),
                )
                conn.execute(
                    """
                    DELETE FROM user_playlist_items
                    WHERE track_key = ?
                      AND playlist_id IN (SELECT id FROM user_playlists WHERE user_id = ?)
                    """,
                    (track_key, user_id),
                )
                if track_key.startswith("sha256:"):
                    conn.execute(
                        "DELETE FROM lyric_revisions WHERE track_key = ? AND user_id = ?",
                        (track_key, user_id),
                    )
                conn.commit()
                return cur.rowcount > 0

    def count_track_references(self, track_key: str) -> int:
        """Counts remaining DB references to track_key across private and public tables."""
        with _DB_LOCK:
            with self._connect() as conn:
                priv = conn.execute(
                    "SELECT COUNT(*) FROM user_private_songs WHERE track_key = ?",
                    (track_key,),
                ).fetchone()[0]
                pub = conn.execute(
                    "SELECT COUNT(*) FROM analyzed_songs WHERE track_key = ?",
                    (track_key,),
                ).fetchone()[0]
                return int(priv) + int(pub)

    # =========================================================================
    # AUTHENTICATION, FAVORITES & CUSTOM PLAYLISTS
    # =========================================================================
    @staticmethod
    def _is_env_developer(email: str) -> bool:
        raw = os.getenv("KYTHRA_DEVELOPER_EMAILS", "")
        dev_emails = {e.strip().lower() for e in raw.split(",") if e.strip()}
        return email.strip().lower() in dev_emails

    def set_user_role(self, email_or_username: str, role: str) -> bool:
        clean_role = "developer" if role == "developer" else "user"
        ident = email_or_username.strip().lower()
        with _DB_LOCK:
            with self._connect() as conn:
                cur = conn.execute(
                    "UPDATE users SET role = ? WHERE lower(email) = ? OR lower(username) = ?",
                    (clean_role, ident, ident),
                )
                conn.commit()
                return cur.rowcount > 0

    def register_user(self, email: str, username: str, password: str) -> Dict[str, Any]:
        clean_email = email.strip().lower()
        clean_name = username.strip() or clean_email.split("@")[0]
        if not clean_email or len(password) < 4:
            raise ValueError("Valid email and password (min 4 chars) required.")

        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        pw_hash = _hash_password(password)
        role = "developer" if self._is_env_developer(clean_email) else "user"
        now_iso = datetime.now(timezone.utc).isoformat()
        token = secrets.token_urlsafe(32)

        with _DB_LOCK:
            with self._connect() as conn:
                existing = conn.execute("SELECT id FROM users WHERE email = ?", (clean_email,)).fetchone()
                if existing:
                    raise ValueError("Email is already registered.")
                conn.execute(
                    "INSERT INTO users (id, email, username, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                    (user_id, clean_email, clean_name, pw_hash, role, now_iso),
                )
                conn.execute(
                    "INSERT INTO auth_tokens (token, user_id, created_at) VALUES (?, ?, ?)",
                    (token, user_id, now_iso),
                )
                conn.commit()

        return {
            "token": token,
            "user": {"id": user_id, "email": clean_email, "username": clean_name, "role": role},
        }

    def login_user(self, email: str, password: str) -> Dict[str, Any]:
        ident = email.strip().lower()
        now_iso = datetime.now(timezone.utc).isoformat()

        with _DB_LOCK:
            with self._connect() as conn:
                row = conn.execute(
                    "SELECT id, email, username, password_hash, role FROM users WHERE lower(email) = ?",
                    (ident,),
                ).fetchone()
                if not row or not _verify_password(password, row["password_hash"]):
                    raise ValueError("Invalid email or password.")
                role = row["role"] or "user"
                if role != "developer" and self._is_env_developer(row["email"]):
                    role = "developer"
                    conn.execute("UPDATE users SET role = 'developer' WHERE id = ?", (row["id"],))
                token = secrets.token_urlsafe(32)
                conn.execute(
                    "INSERT INTO auth_tokens (token, user_id, created_at) VALUES (?, ?, ?)",
                    (token, row["id"], now_iso),
                )
                conn.commit()
                return {
                    "token": token,
                    "user": {"id": row["id"], "email": row["email"], "username": row["username"], "role": role},
                }

    def get_user_by_token(self, token: Optional[str]) -> Optional[Dict[str, Any]]:
        if not token:
            return None
        clean_tok = token.replace("Bearer ", "").strip()
        if not clean_tok:
            return None
        with _DB_LOCK:
            with self._connect() as conn:
                row = conn.execute(
                    """
                    SELECT u.id, u.email, u.username, u.role
                    FROM auth_tokens t
                    JOIN users u ON u.id = t.user_id
                    WHERE t.token = ?
                    """,
                    (clean_tok,),
                ).fetchone()
                if not row:
                    return None
                return {
                    "id": row["id"],
                    "email": row["email"],
                    "username": row["username"],
                    "role": row["role"] or "user",
                }

    def update_user_profile(
        self,
        user_id: str,
        email: str,
        username: str,
        new_password: Optional[str] = None,
    ) -> Dict[str, Any]:
        clean_email = email.strip().lower()
        clean_name = username.strip()
        if not clean_email or not clean_name:
            raise ValueError("Display name and email address are required.")
        if new_password is not None and new_password.strip() != "":
            if len(new_password) < 4:
                raise ValueError("New password must be at least 4 characters.")

        with _DB_LOCK:
            with self._connect() as conn:
                existing = conn.execute(
                    "SELECT id FROM users WHERE lower(email) = ? AND id != ?",
                    (clean_email, user_id),
                ).fetchone()
                if existing:
                    raise ValueError("This email address is already in use by another account.")

                if new_password and new_password.strip():
                    pw_hash = _hash_password(new_password)
                    conn.execute(
                        "UPDATE users SET email = ?, username = ?, password_hash = ? WHERE id = ?",
                        (clean_email, clean_name, pw_hash, user_id),
                    )
                else:
                    conn.execute(
                        "UPDATE users SET email = ?, username = ? WHERE id = ?",
                        (clean_email, clean_name, user_id),
                    )
                row = conn.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
                conn.commit()
                role = (row["role"] if row else "user") or "user"

        return {"id": user_id, "email": clean_email, "username": clean_name, "role": role}

    def toggle_favorite(
        self,
        user_id: str,
        track_key: str,
        title: str,
        tempo_bpm: float = 120.0,
        key_signature: str = "C major",
        time_signature: str = "4/4",
    ) -> Dict[str, Any]:
        now_iso = datetime.now(timezone.utc).isoformat()
        is_priv = 1 if track_key.startswith("sha256:") else 0
        with _DB_LOCK:
            with self._connect() as conn:
                existing = conn.execute(
                    "SELECT 1 FROM user_favorites WHERE user_id = ? AND track_key = ?",
                    (user_id, track_key),
                ).fetchone()
                if existing:
                    conn.execute(
                        "DELETE FROM user_favorites WHERE user_id = ? AND track_key = ?",
                        (user_id, track_key),
                    )
                    conn.commit()
                    return {"is_favorite": False, "track_key": track_key}
                else:
                    conn.execute(
                        """
                        INSERT INTO user_favorites (
                            user_id, track_key, title, tempo_bpm,
                            key_signature, time_signature, is_private, created_at
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        """,
                        (
                            user_id,
                            track_key,
                            title,
                            tempo_bpm,
                            key_signature,
                            time_signature,
                            is_priv,
                            now_iso,
                        ),
                    )
                    conn.commit()
                    return {"is_favorite": True, "track_key": track_key}

    def list_favorites(self, user_id: str) -> List[Dict[str, Any]]:
        with _DB_LOCK:
            with self._connect() as conn:
                rows = conn.execute(
                    """
                    SELECT track_key, title, tempo_bpm, key_signature,
                           time_signature, is_private, created_at
                    FROM user_favorites
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                    """,
                    (user_id,),
                ).fetchall()
                return [
                    {
                        "track_key": r["track_key"],
                        "title": r["title"],
                        "tempo_bpm": r["tempo_bpm"],
                        "key_signature": r["key_signature"],
                        "time_signature": r["time_signature"],
                        "is_private": bool(r["is_private"]),
                        "created_at": r["created_at"],
                    }
                    for r in rows
                ]

    def create_playlist(self, user_id: str, name: str) -> Dict[str, Any]:
        clean_name = name.strip()
        if not clean_name:
            raise ValueError("Playlist name required.")
        pl_id = f"pl_{uuid.uuid4().hex[:10]}"
        now_iso = datetime.now(timezone.utc).isoformat()
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    "INSERT INTO user_playlists (id, user_id, name, created_at) VALUES (?, ?, ?, ?)",
                    (pl_id, user_id, clean_name, now_iso),
                )
                conn.commit()
        return {"id": pl_id, "name": clean_name, "items": [], "created_at": now_iso}

    def delete_playlist(self, user_id: str, playlist_id: str) -> None:
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    "DELETE FROM user_playlist_items WHERE playlist_id IN (SELECT id FROM user_playlists WHERE id = ? AND user_id = ?)",
                    (playlist_id, user_id),
                )
                conn.execute(
                    "DELETE FROM user_playlists WHERE id = ? AND user_id = ?",
                    (playlist_id, user_id),
                )
                conn.commit()

    def add_song_to_playlist(
        self,
        user_id: str,
        playlist_id: str,
        track_key: str,
        title: str,
        tempo_bpm: float = 120.0,
        key_signature: str = "C major",
        time_signature: str = "4/4",
    ) -> None:
        now_iso = datetime.now(timezone.utc).isoformat()
        is_priv = 1 if track_key.startswith("sha256:") else 0
        with _DB_LOCK:
            with self._connect() as conn:
                owner = conn.execute(
                    "SELECT 1 FROM user_playlists WHERE id = ? AND user_id = ?",
                    (playlist_id, user_id),
                ).fetchone()
                if not owner:
                    raise PermissionError("Playlist not found.")
                conn.execute(
                    """
                    INSERT OR REPLACE INTO user_playlist_items (
                        playlist_id, track_key, title, tempo_bpm,
                        key_signature, time_signature, is_private, added_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        playlist_id,
                        track_key,
                        title,
                        tempo_bpm,
                        key_signature,
                        time_signature,
                        is_priv,
                        now_iso,
                    ),
                )
                conn.commit()

    def remove_song_from_playlist(self, user_id: str, playlist_id: str, track_key: str) -> None:
        with _DB_LOCK:
            with self._connect() as conn:
                conn.execute(
                    """
                    DELETE FROM user_playlist_items
                    WHERE playlist_id = ? AND track_key = ?
                      AND playlist_id IN (SELECT id FROM user_playlists WHERE user_id = ?)
                    """,
                    (playlist_id, track_key, user_id),
                )
                conn.commit()

    def list_playlists(self, user_id: str) -> List[Dict[str, Any]]:
        with _DB_LOCK:
            with self._connect() as conn:
                pls = conn.execute(
                    "SELECT id, name, created_at FROM user_playlists WHERE user_id = ? ORDER BY created_at DESC",
                    (user_id,),
                ).fetchall()
                result: List[Dict[str, Any]] = []
                for p in pls:
                    items = conn.execute(
                        """
                        SELECT track_key, title, tempo_bpm, key_signature,
                               time_signature, is_private, added_at
                        FROM user_playlist_items
                        WHERE playlist_id = ?
                        ORDER BY added_at DESC
                        """,
                        (p["id"],),
                    ).fetchall()
                    result.append(
                        {
                            "id": p["id"],
                            "name": p["name"],
                            "created_at": p["created_at"],
                            "items": [
                                {
                                    "track_key": it["track_key"],
                                    "title": it["title"],
                                    "tempo_bpm": it["tempo_bpm"],
                                    "key_signature": it["key_signature"],
                                    "time_signature": it["time_signature"],
                                    "is_private": bool(it["is_private"]),
                                    "added_at": it["added_at"],
                                }
                                for it in items
                            ],
                        }
                    )
                return result


_SONG_DB_SINGLETON: Optional[SongDatabase] = None


def get_song_database() -> SongDatabase:
    global _SONG_DB_SINGLETON
    if _SONG_DB_SINGLETON is None:
        _SONG_DB_SINGLETON = SongDatabase()
    return _SONG_DB_SINGLETON
