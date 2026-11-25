"""
KythraStudio Production Workbench Service (4-Stage Facade, SQLite Cache & Progressive Background Pipeline)
Coordinates session repository, audio ingestion, versioned SQLite metadata DB,
instant Beats + Chords studio load, and background 6-stem separation + Lyrics/Karaoke alignment.
"""

from concurrent.futures import ThreadPoolExecutor
import logging
from pathlib import Path
import threading
import time
from typing import Any, Dict, List, Optional

from fastapi import UploadFile

from backend.config import APP_PIPELINE_VERSION
from backend.domain.chords import (
    coalesce_consecutive_sections,
    estimate_key_signature,
    extract_waveform_peaks,
)
from backend.exceptions import (
    ArtifactNotFoundError,
    KythraDomainError,
    SessionAudioNotFoundError,
    StageExecutionError,
)
from backend.models import ChordEvent
from backend.services.ingestion_service import IngestionService
from backend.services.log_service import get_log_service
from backend.services.lyrics_service import (
    fetch_synchronized_lyrics_with_source,
)
from backend.services.session_repository import SessionRepository
from backend.services.song_database import get_song_database
from backend.services.stage_factory import StageExecutorFactory

logger = logging.getLogger("backend.services.workbench_service")

STAGE_LABELS = {
    1: "Ölçü ve Tempo Tespiti (Madmom RNN)",
    2: "Akor Tanıma, Ton ve Şarkı Yapısı (BTC-CNN & allin1)",
    3: "Makro Kanal Ayırma (BS-RoFormer 6-Kanal)",
    4: "Aşama 4 (Otomatik Şarkı Sözü & Karaoke)",
}


class WorkbenchService:
    def __init__(
        self,
        repo: Optional[SessionRepository] = None,
        ingestion: Optional[IngestionService] = None,
        session_id: Optional[str] = None,
        current_user: Optional[Dict[str, Any]] = None,
    ):
        self.session_id = session_id or "default"
        self.current_user = current_user
        self.repo = repo or SessionRepository(session_id=self.session_id)
        self.ingestion = ingestion or IngestionService(self.repo)
        self.song_db = get_song_database()

    def get_session(self) -> Dict[str, Any]:
        """Returns the active session state."""
        return {"state": self.repo.load_state()}

    def reset_session(self) -> Dict[str, Any]:
        """Clears all session artifacts and resets state to idle."""
        return self.repo.reset()

    async def ingest_file(self, file: UploadFile) -> Dict[str, Any]:
        """Uploads and normalizes local audio file into persistent disk storage."""
        return await self.ingestion.ingest_uploaded_file(file)

    def list_library_songs(self) -> List[Dict[str, Any]]:
        """Returns user's private uploaded songs (if authenticated) plus public demo library entries."""
        songs: List[Dict[str, Any]] = []
        if self.current_user:
            for up in self.song_db.list_user_private_songs(self.current_user["id"]):
                songs.append({
                    **up,
                    "is_current_version": up.get("pipeline_version") == APP_PIPELINE_VERSION,
                })
        existing_keys = {s["track_key"] for s in songs}
        for item in self.song_db.list_cached_songs():
            if item["track_key"] not in existing_keys:
                songs.append(item)
        return songs

    def run_stage(self, stage_num: int) -> Dict[str, Any]:
        """Executes a single production pipeline stage (1, 2, or 3) in strict isolation."""
        log_svc = get_log_service()
        stage_label = STAGE_LABELS.get(stage_num, f"Aşama {stage_num}")

        if not self.repo.has_source_audio():
            log_svc.emit_stage_log(stage_num, "Hata: Yüklü ses kaynağı bulunamadı.", level="ERROR")
            raise SessionAudioNotFoundError(
                "No audio source loaded. Please upload or ingest a source first."
            )

        executor = StageExecutorFactory.get_executor(stage_num)
        state = self.repo.update_stage_state(stage_num, status="running", error=None)
        log_svc.emit_stage_log(stage_num, f"{stage_label} yürütülüyor...")

        t_start = time.time()
        ctx = self.repo.build_context_from_session()

        try:
            result_data, summary = executor.execute(ctx, self.repo, state)
            elapsed_ms = round((time.time() - t_start) * 1000, 1)

            state = self.repo.update_stage_state(
                stage_num,
                status="completed",
                timings_ms=elapsed_ms,
                summary=summary,
            )
            if (
                stage_num == 3
                and isinstance(result_data, dict)
                and result_data.get("stems")
                and self.current_user
                and state.get("track_key")
                and str(state.get("track_key")).startswith("sha256:")
            ):
                self.song_db.update_user_private_song_stage3(
                    self.current_user["id"],
                    str(state["track_key"]),
                    result_data,
                )
            elif stage_num == 4 and isinstance(result_data, dict):
                lines = result_data.get("lines") or []
                latest_state = self.repo.load_state()
                has_manual = latest_state.get("lyrics_source") == "user" and bool(latest_state.get("lyrics"))
                if lines and not has_manual:
                    latest_state["lyrics"] = lines
                    latest_state["lyrics_source"] = "ai"
                    latest_state["lyrics_locked"] = False
                    self.repo.save_state(latest_state)
                    state = latest_state
                    if (
                        self.current_user
                        and state.get("track_key")
                        and str(state.get("track_key")).startswith("sha256:")
                    ):
                        self.song_db.update_user_private_song_lyrics(
                            self.current_user["id"],
                            str(state["track_key"]),
                            lines,
                            lyrics_source="ai",
                        )
            log_svc.emit_stage_log(
                stage_num,
                f"Tamamlandı ({round(elapsed_ms / 1000, 1)} sn) -> {summary or 'Başarılı'}",
                level="INFO",
            )

            return {
                "stage_num": stage_num,
                "status": "completed",
                "timings_ms": elapsed_ms,
                "summary": summary,
                "data": result_data,
                "state": state,
            }
        except KythraDomainError as e:
            elapsed_ms = round((time.time() - t_start) * 1000, 1)
            self.repo.update_stage_state(
                stage_num, status="error", timings_ms=elapsed_ms, error=e.message
            )
            log_svc.emit_stage_log(stage_num, f"Etki alanı hatası: {e.message}", level="ERROR")
            raise
        except Exception as e:
            elapsed_ms = round((time.time() - t_start) * 1000, 1)
            logger.error("Stage %d execution failed: %s", stage_num, e, exc_info=True)
            self.repo.update_stage_state(
                stage_num, status="error", timings_ms=elapsed_ms, error=str(e)
            )
            log_svc.emit_stage_log(stage_num, f"Sistem hatası: {str(e)}", level="ERROR")
            raise StageExecutionError(f"Stage {stage_num} error: {str(e)}") from e

    def prepare_studio_session(self, background_stems: bool = True) -> Dict[str, Any]:
        """
        Progressive Studio Loader:
        1. Checks if song's track_key exists in SQLite DB with pipeline_version == APP_PIPELINE_VERSION.
           - If YES (Cache Hit): Restores Stage 1 (Tempo/Beats) & Stage 2 (Chords/Key/Coalesced Sections)
             in < 10ms without re-running Stage 1 or Stage 2!
           - If NO (Cache Miss or Version Upgraded): Executes Stage 1 and Stage 2, then persists
             metadata + APP_PIPELINE_VERSION to SQLite DB.
        2. Spawns Stage 3 (BS-RoFormer 6-Stem Demux) in a background daemon thread so the user interface
           opens immediately with Master Audio (source.wav), full chords, sections, and diagrams while
           6-channel stem separation completes in the background!
        """
        if not self.repo.has_source_audio():
            raise SessionAudioNotFoundError(
                "No audio source loaded. Please upload or ingest a source first."
            )

        log_svc = get_log_service()
        state = self.repo.load_state()
        track_key = state.get("track_key")
        if not track_key and state.get("track_name"):
            track_key = f"title:{state['track_name']}"

        waveform_peaks = state.get("waveform_peaks")
        if not waveform_peaks:
            waveform_peaks = extract_waveform_peaks(self.repo.get_source_audio_path())
            state["waveform_peaks"] = waveform_peaks
            state["track_key"] = track_key
            self.repo.save_state(state)

        user_id = self.current_user["id"] if self.current_user else None
        is_private_upload = bool(track_key and track_key.startswith("sha256:"))
        cached = (
            self.song_db.get_valid_cached_song(track_key, APP_PIPELINE_VERSION, user_id=user_id)
            if track_key
            else None
        )
        cache_hit = False

        if cached:
            cache_hit = True
            s1_data = cached["beats"]
            s2_data = cached["chords"]
            self.repo.save_artifact("beats", s1_data)
            self.repo.save_artifact("chords", s2_data)

            lyrics = cached.get("lyrics") or []
            lyrics_source = cached.get("lyrics_source") or "none"
            lyrics_version = int(cached.get("lyrics_version") or 1)
            lyrics_updated_by = cached.get("lyrics_updated_by")
            if not lyrics and not is_private_upload:
                lyrics, lyrics_source = fetch_synchronized_lyrics_with_source(
                    str(state.get("track_name") or ""),
                    duration_sec=float(state.get("duration_sec") or 240.0),
                )
                if lyrics and track_key:
                    self.song_db.update_song_lyrics(track_key, lyrics, lyrics_source=lyrics_source)
            state["lyrics"] = lyrics
            state["lyrics_source"] = lyrics_source
            state["lyrics_locked"] = lyrics_source == "lrclib" and not is_private_upload
            state["lyrics_version"] = lyrics_version
            state["lyrics_updated_by"] = lyrics_updated_by
            state["is_private"] = is_private_upload
            self.repo.save_state(state)

            s1_summary = f"{s1_data.get('tempo_bpm', 120)} BPM, {s1_data.get('time_signature', '4/4')} (DB v{APP_PIPELINE_VERSION})"
            s2_summary = (
                f"Ton: {s2_data.get('key_signature', 'C major')} · "
                f"{len(s2_data.get('chords', []))} Akor · "
                f"{len(s2_data.get('sections', []))} Bölüm (DB Önbellek)"
            )
            self.repo.update_stage_state(1, status="completed", timings_ms=5.0, summary=s1_summary, error=None)
            self.repo.update_stage_state(2, status="completed", timings_ms=5.0, summary=s2_summary, error=None)
            log_svc.add_entry(
                "INFO",
                "backend.cache",
                f"Şarkı veritabanı önbelleğinden (v{APP_PIPELINE_VERSION}) 10ms içinde yüklendi: {state.get('track_name')}",
            )
        else:
            # Execute Stage 1 and Stage 2 so the screen can open immediately!
            log_svc.add_entry(
                "INFO",
                "backend.pipeline",
                f"Yeni şarkı veya yeni versiyon (v{APP_PIPELINE_VERSION}): Aşama 1 & 2 çözümleniyor...",
            )
            self.run_stage(1)
            self.run_stage(2)
            s1_data = self.repo.load_stage_data(1) or {}
            s2_data = self.repo.load_stage_data(2) or {}

            if is_private_upload:
                lyrics = []
                lyrics_source = "user"
            else:
                lyrics, lyrics_source = fetch_synchronized_lyrics_with_source(
                    str(state.get("track_name") or ""),
                    duration_sec=float(state.get("duration_sec") or 240.0),
                )
            state = self.repo.load_state()
            state["lyrics"] = lyrics
            state["lyrics_source"] = lyrics_source
            state["lyrics_locked"] = lyrics_source == "lrclib" and not is_private_upload
            state["lyrics_version"] = 1
            state["lyrics_updated_by"] = None
            state["is_private"] = is_private_upload
            self.repo.save_state(state)

            if track_key and s1_data and s2_data:
                s3_data = self.repo.load_stage_data(3) or {}
                self.song_db.save_song_analysis(
                    track_key=track_key,
                    title=str(state.get("track_name") or "Kythra Track"),
                    duration_sec=float(state.get("duration_sec") or 180.0),
                    stage1=s1_data,
                    stage2=s2_data,
                    waveform_peaks=waveform_peaks,
                    lyrics=lyrics,
                    lyrics_source=lyrics_source,
                    pipeline_version=APP_PIPELINE_VERSION,
                    owner_user_id=user_id,
                    is_private_upload=is_private_upload,
                    stage3=s3_data,
                )

        # Spawn Stage 3 (6-Channel Separation) in background if not yet completed
        current_state = self.repo.load_state()
        s3_status = current_state.get("stages", {}).get("3", {}).get("status")
        if s3_status != "completed":
            if background_stems:
                self.repo.update_stage_state(
                    3,
                    status="running",
                    summary="Arka planda 6 kanala ayrıştırılıyor...",
                    error=None,
                )

                def _bg_stage3():
                    try:
                        self.run_stage(3)
                        st_after = self.repo.load_state()
                        has_lyrics = bool(st_after.get("lyrics"))
                        s4_status = st_after.get("stages", {}).get("4", {}).get("status")
                        if not has_lyrics and s4_status != "completed":
                            try:
                                self.run_stage(4)
                            except Exception as e4:
                                logger.warning("Background Stage 4 (Lyrics) skipped/failed: %s", e4)
                    except Exception as e:
                        logger.error("Background Stage 3 failed: %s", e)

                threading.Thread(target=_bg_stage3, daemon=True, name="bg-stage3-mss").start()
            else:
                self.run_stage(3)

        bundle = self.get_studio_bundle()
        bundle["cache_hit"] = cache_hit
        bundle["pipeline_version"] = APP_PIPELINE_VERSION
        return bundle

    def run_all_stages(self) -> Dict[str, Any]:
        """Executes production pipeline stages 1, 2, 3 via the Parallel DAG Orchestrator."""
        if not self.repo.has_source_audio():
            raise SessionAudioNotFoundError(
                "No audio source loaded. Please upload or ingest a source first."
            )
        from backend.services.dag_orchestrator import DAGPipelineOrchestrator

        orchestrator = DAGPipelineOrchestrator(self.repo)
        res = orchestrator.execute_dag()

        # Also persist Stage 1 & Stage 2 to SQLite SongDatabase with APP_PIPELINE_VERSION
        try:
            state = self.repo.load_state()
            track_key = state.get("track_key") or f"title:{state.get('track_name')}"
            s1 = self.repo.load_stage_data(1)
            s2 = self.repo.load_stage_data(2)
            wf = state.get("waveform_peaks") or extract_waveform_peaks(self.repo.get_source_audio_path())
            if track_key and s1 and s2:
                self.song_db.save_song_analysis(
                    track_key=track_key,
                    title=str(state.get("track_name") or "Kythra Track"),
                    duration_sec=float(state.get("duration_sec") or 180.0),
                    stage1=s1,
                    stage2=s2,
                    waveform_peaks=wf,
                    pipeline_version=APP_PIPELINE_VERSION,
                )
        except Exception as e:
            logger.warning("Failed to persist DAG result to SQLite DB: %s", e)

        return res

    def get_stage_data(self, stage_num: int) -> Dict[str, Any]:
        """Retrieves raw JSON payload for a completed stage (1, 2, 3, or 4)."""
        if stage_num not in (1, 2, 3, 4):
            raise ArtifactNotFoundError(f"Stage {stage_num} is not part of the Production 4-stage pipeline.")
        data = self.repo.load_stage_data(stage_num)
        if data is None:
            raise ArtifactNotFoundError(f"No output computed yet for Stage {stage_num}.")
        if stage_num == 2:
            if not data.get("key_signature"):
                chords = [ChordEvent(**c) for c in data.get("chords", [])]
                data["key_signature"] = estimate_key_signature(chords)
            if data.get("sections"):
                data["sections"] = coalesce_consecutive_sections(
                    data["sections"],
                    total_bars=len(data.get("bars", [])),
                )
        return data

    def get_studio_bundle(self) -> Dict[str, Any]:
        """Returns unified production bundle combining Session + Stages 1-4 + Waveform."""
        state = self.repo.load_state()
        s1 = self.repo.load_stage_data(1) or {}
        s2 = self.repo.load_stage_data(2) or {}
        s3 = self.repo.load_stage_data(3) or {}
        s4 = self.repo.load_stage_data(4) or {}

        if not state.get("has_session"):
            return {
                "state": state,
                "stage1": {},
                "stage2": {},
                "stage3": {},
                "stage4": {},
                "has_source_audio": False,
                "waveform_peaks": [],
                "lyrics": [],
                "lyrics_source": "none",
                "lyrics_locked": False,
                "lyrics_version": 1,
                "lyrics_updated_by": None,
                "is_private": False,
                "pipeline_version": APP_PIPELINE_VERSION,
            }

        if s2:
            if not s2.get("key_signature"):
                try:
                    chords = [ChordEvent(**c) for c in s2.get("chords", [])]
                    s2["key_signature"] = estimate_key_signature(chords)
                except Exception:
                    s2["key_signature"] = "C major"
            if s2.get("sections"):
                s2["sections"] = coalesce_consecutive_sections(
                    s2["sections"],
                    total_bars=len(s2.get("bars", [])),
                )

        waveform_peaks = state.get("waveform_peaks")
        if not waveform_peaks and self.repo.has_source_audio():
            waveform_peaks = extract_waveform_peaks(self.repo.get_source_audio_path())

        user_id = self.current_user["id"] if self.current_user else None
        track_key = state.get("track_key")
        is_private = bool(state.get("is_private") or (track_key and track_key.startswith("sha256:")))
        cached_meta = (
            self.song_db.get_valid_cached_song(track_key, APP_PIPELINE_VERSION, user_id=user_id)
            if track_key
            else None
        )

        lyrics = state.get("lyrics")
        lyrics_source = state.get("lyrics_source") or (cached_meta.get("lyrics_source") if cached_meta else "none")
        lyrics_version = int(state.get("lyrics_version") or (cached_meta.get("lyrics_version") if cached_meta else 1) or 1)
        lyrics_updated_by = state.get("lyrics_updated_by") or (cached_meta.get("lyrics_updated_by") if cached_meta else None)

        if cached_meta and cached_meta.get("lyrics") is not None and (not lyrics or cached_meta.get("lyrics_version", 1) >= lyrics_version):
            lyrics = cached_meta["lyrics"]
            lyrics_source = cached_meta.get("lyrics_source") or lyrics_source
            lyrics_version = int(cached_meta.get("lyrics_version") or 1)
            lyrics_updated_by = cached_meta.get("lyrics_updated_by")

        if not lyrics and isinstance(s4, dict) and s4.get("lines"):
            lyrics = s4["lines"]
            lyrics_source = "ai"

        if not lyrics and state.get("track_name") and not is_private:
            lyrics, lyrics_source = fetch_synchronized_lyrics_with_source(
                str(state.get("track_name") or ""),
                duration_sec=float(state.get("duration_sec") or 240.0),
            )
            if lyrics and track_key:
                self.song_db.update_song_lyrics(track_key, lyrics, lyrics_source=lyrics_source)
            if lyrics:
                state["lyrics"] = lyrics
                state["lyrics_source"] = lyrics_source
                self.repo.save_state(state)

        lyrics_locked = (lyrics_source == "lrclib") and not is_private and bool(lyrics)

        return {
            "state": state,
            "stage1": s1,
            "stage2": s2,
            "stage3": s3,
            "stage4": s4,
            "has_source_audio": self.repo.has_source_audio(),
            "waveform_peaks": waveform_peaks or [0.35] * 120,
            "lyrics": lyrics or [],
            "lyrics_source": lyrics_source,
            "lyrics_locked": lyrics_locked,
            "lyrics_version": lyrics_version,
            "lyrics_updated_by": lyrics_updated_by,
            "is_private": is_private,
            "pipeline_version": APP_PIPELINE_VERSION,
        }

    def load_cached_song_into_session(self, track_key: str) -> Dict[str, Any]:
        """Loads a cached song (either public or user's private upload) into the user's isolated session."""
        user_id = self.current_user["id"] if self.current_user else None
        cached = self.song_db.get_valid_cached_song(track_key, APP_PIPELINE_VERSION, user_id=user_id)
        if not cached:
            raise ArtifactNotFoundError(f"Song '{track_key}' not found in library.")

        cached_s3 = cached.get("stage3") or {}
        has_cached_stems = (
            isinstance(cached_s3, dict)
            and isinstance(cached_s3.get("stems"), dict)
            and len(cached_s3.get("stems")) > 0
        )

        self.repo.reset()
        state = self.repo.load_state()
        state["has_session"] = True
        state["track_name"] = cached["title"]
        state["track_key"] = cached["track_key"]
        state["duration_sec"] = cached["duration_sec"]
        state["waveform_peaks"] = cached["waveform_peaks"]
        state["lyrics"] = cached.get("lyrics") or []
        state["lyrics_source"] = cached.get("lyrics_source") or "none"
        state["lyrics_locked"] = cached.get("lyrics_locked", False)
        state["lyrics_version"] = cached.get("lyrics_version", 1)
        state["lyrics_updated_by"] = cached.get("lyrics_updated_by")
        state["is_private"] = cached.get("is_private", False)
        state["stages"]["1"] = {"status": "completed", "timings_ms": 5.0}
        state["stages"]["2"] = {"status": "completed", "timings_ms": 5.0}
        self.repo.save_state(state)
        has_persistent_stems = any(self.repo.get_stems_dir().glob("*.wav"))
        state["stages"]["3"] = (
            {"status": "completed", "timings_ms": 0.0}
            if (has_cached_stems or has_persistent_stems)
            else {"status": "pending", "timings_ms": 0.0}
        )
        self.repo.save_state(state)
        self.repo.save_artifact("beats", cached["beats"])
        self.repo.save_artifact("chords", cached["chords"])
        if has_cached_stems:
            self.repo.save_artifact("stems", cached_s3)
        s4_artifact = self.repo.load_stage_data(4)
        if (isinstance(s4_artifact, dict) and s4_artifact.get("lines")) or state["lyrics"]:
            self.repo.update_stage_state(4, status="completed", timings_ms=0.0)
        return self.get_studio_bundle()

    def get_audio_path(self, filename: str) -> Path:
        """Resolves source or stem audio path for media streaming from persistent disk."""
        safe_name = Path(filename).name
        if safe_name in ["source", "source.wav", "master"]:
            target = self.repo.get_source_audio_path()
        else:
            stem_name = safe_name if safe_name.endswith(".wav") else f"{safe_name}.wav"
            target = self.repo.get_stems_dir() / stem_name
            if not target.exists():
                fallback_stem = self.repo.stems_dir / stem_name
                if fallback_stem.exists():
                    target = fallback_stem

        if target.exists():
            return target

        raise ArtifactNotFoundError(f"Audio stream '{filename}' not found.")

    def get_download_path(self, filename: str) -> Path:
        """Resolves downloadable artifact path."""
        safe_name = Path(filename).name
        target = self.repo.session_dir / safe_name
        if not target.exists():
            raise ArtifactNotFoundError(f"File '{filename}' not found.")
        return target
