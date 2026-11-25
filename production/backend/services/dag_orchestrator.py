"""
KythraStudio Unified Progressive Parallel DAG Orchestrator
Powers both Web Studio (`prepare-studio`) and Developer (`Üretim Akışı` / `run-all`)
with a single concurrency engine:
- Wave 1 (t=0): CPU Stage 1 (madmom) + CPU Stage 2a (BTC CQT) + GPU Stage 3 (BS-RoFormer 6-Stem)
- Fast Studio Open (~12-15s TTFO): Joins Stage 1 + BTC chords + provisional sections without waiting for BS-RoFormer
- Wave 2b (Zero Duplicate Demucs): allin1 Structural Sections reuses Stage 3 stems (~3s) and refines chords.json
- Wave 4 (GPU Vocal ASR + CTC): Stage 4 Lyrics Transcription & MMS_FA alignment on stems/vocals.wav -> lyrics.json
"""

from concurrent.futures import ThreadPoolExecutor
import logging
import threading
import time
from typing import Any, Dict, List, Optional

from backend.config import APP_PIPELINE_VERSION
from backend.domain.chords import (
    align_chords_to_bars,
    build_provisional_sections,
    estimate_key_signature,
    extract_dynamic_sections,
)
from backend.engines.base import PipelineContext
from backend.models import BeatEvent, ChordEvent
from backend.services.log_service import CURRENT_SESSION_ID, get_log_service
from backend.services.session_repository import SessionRepository
from backend.services.stage_factory import StageExecutorFactory
from backend.stages.chord_recognition import _chroma_template_fallback
from backend.stages.registry import get_engine

logger = logging.getLogger("backend.services.dag_orchestrator")


def _with_session_ctx(session_id: Optional[str], fn, *args, **kwargs):
    token = CURRENT_SESSION_ID.set(session_id)
    try:
        return fn(*args, **kwargs)
    finally:
        CURRENT_SESSION_ID.reset(token)


class DAGPipelineOrchestrator:
    def __init__(self, repo: SessionRepository):
        self.repo = repo
        self.session_id = repo.session_id

    @staticmethod
    def _build_progression(bars: List[Dict[str, Any]]) -> str:
        unique_prog: List[str] = []
        for b in bars:
            lbl = b.get("chord")
            if lbl and lbl != "N.C." and (not unique_prog or unique_prog[-1] != lbl):
                unique_prog.append(lbl)
        return " → ".join(unique_prog[:8]) if unique_prog else "N/A"

    def _run_stage1_worker(self, ctx: PipelineContext, state: Dict[str, Any]) -> Dict[str, Any]:
        log_svc = get_log_service()
        t0 = time.time()
        log_svc.emit_stage_log(1, "[Dal-1 · CPU] Ölçü ve Tempo Tespiti başlatıldı...", session_id=self.session_id)
        try:
            executor1 = StageExecutorFactory.get_executor(1)
            data1, summary1 = executor1.execute(ctx, self.repo, state)
            elapsed1 = round((time.time() - t0) * 1000, 1)
            st1 = self.repo.update_stage_state(
                1, status="completed", timings_ms=elapsed1, summary=summary1, error=None
            )
            log_svc.emit_stage_log(
                1, f"[Dal-1] Tamamlandı ({round(elapsed1 / 1000, 1)} sn) -> {summary1}", session_id=self.session_id
            )
            return {
                "stage_num": 1,
                "status": "completed",
                "timings_ms": elapsed1,
                "summary": summary1,
                "data": data1,
                "state": st1,
            }
        except Exception as e:
            elapsed1 = round((time.time() - t0) * 1000, 1)
            logger.error("Stage 1 error in DAG: %s", e, exc_info=True)
            st1 = self.repo.update_stage_state(1, status="error", timings_ms=elapsed1, error=str(e))
            log_svc.emit_stage_log(1, f"[Dal-1] Hata: {e}", level="ERROR", session_id=self.session_id)
            raise

    def _run_btc_cqt_worker(self, ctx: PipelineContext):
        log_svc = get_log_service()
        t0 = time.time()
        log_svc.emit_stage_log(2, "[Dal-2a · CPU] BTC CQT Spektral Özellik Çıkarımı başlatıldı...", session_id=self.session_id)
        chord_engine = get_engine("chord")
        feat_tuple = chord_engine.extract_features(ctx.audio_path)
        elapsed_cqt = round((time.time() - t0) * 1000, 1)
        log_svc.emit_stage_log(
            2, f"[Dal-2a · CPU] CQT Özellikleri hazır ({round(elapsed_cqt / 1000, 1)} sn).", session_id=self.session_id
        )
        return feat_tuple, elapsed_cqt

    def _run_stage3_worker(
        self,
        ctx: PipelineContext,
        state: Dict[str, Any],
        *,
        song_db=None,
        current_user: Optional[Dict[str, Any]] = None,
        track_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        from backend.config import MSS_BATCH_SIZE, MSS_USE_AMP

        log_svc = get_log_service()
        t0 = time.time()
        amp_tag = "BF16/FP16 AMP" if MSS_USE_AMP else "TF32"
        batch_tag = str(MSS_BATCH_SIZE) if MSS_BATCH_SIZE > 0 else "Auto"
        self.repo.update_stage_state(3, status="running", error=None)
        log_svc.emit_stage_log(
            3,
            f"[Dal-3 · GPU] BS-RoFormer 6-Kanal Ayırma (Batch={batch_tag}, {amp_tag}) başlatıldı...",
            session_id=self.session_id,
        )
        try:
            executor3 = StageExecutorFactory.get_executor(3)
            data3, summary3 = executor3.execute(ctx, self.repo, state)
            elapsed3 = round((time.time() - t0) * 1000, 1)
            st3 = self.repo.update_stage_state(
                3, status="completed", timings_ms=elapsed3, summary=summary3, error=None
            )
            if (
                song_db is not None
                and current_user
                and track_key
                and str(track_key).startswith("sha256:")
                and isinstance(data3, dict)
                and data3.get("stems")
            ):
                try:
                    song_db.update_user_private_song_stage3(current_user["id"], str(track_key), data3)
                except Exception as db_exc:
                    logger.warning("Failed to persist Stage 3 stems to DB: %s", db_exc)

            log_svc.emit_stage_log(
                3, f"[Dal-3 · GPU] 6 Kanal diske ayrıştırıldı ({round(elapsed3 / 1000, 1)} sn) -> {summary3}", session_id=self.session_id
            )
            return {
                "stage_num": 3,
                "status": "completed",
                "timings_ms": elapsed3,
                "summary": summary3,
                "data": data3,
                "state": st3,
            }
        except Exception as e:
            elapsed3 = round((time.time() - t0) * 1000, 1)
            logger.error("Stage 3 failed in DAG: %s", e, exc_info=True)
            st3 = self.repo.update_stage_state(3, status="error", timings_ms=elapsed3, error=str(e))
            log_svc.emit_stage_log(3, f"[Dal-3] Hata: {e}", level="ERROR", session_id=self.session_id)
            return {
                "stage_num": 3,
                "status": "error",
                "timings_ms": elapsed3,
                "summary": None,
                "error": str(e),
                "data": None,
                "state": st3,
            }

    def _run_stage4_worker(
        self,
        ctx: PipelineContext,
        state: Dict[str, Any],
        *,
        song_db=None,
        current_user: Optional[Dict[str, Any]] = None,
        track_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        log_svc = get_log_service()
        t_s4 = time.time()
        self.repo.update_stage_state(4, status="running", error=None)
        log_svc.emit_stage_log(
            4,
            "[Dal-4 · GPU] İzole vokalden söz transkripsiyonu ve MMS_FA CTC hizalama başlatıldı...",
            session_id=self.session_id,
        )
        try:
            executor4 = StageExecutorFactory.get_executor(4)
            data4, summary4 = executor4.execute(ctx, self.repo, state)
            elapsed4 = round((time.time() - t_s4) * 1000, 1)
            st4 = self.repo.update_stage_state(
                4, status="completed", timings_ms=elapsed4, summary=summary4, error=None
            )
            if isinstance(data4, dict) and data4.get("lines"):
                latest_state = self.repo.load_state()
                if latest_state.get("lyrics_source") != "user" or not latest_state.get("lyrics"):
                    latest_state["lyrics"] = data4["lines"]
                    latest_state["lyrics_source"] = "ai"
                    latest_state["lyrics_locked"] = False
                    self.repo.save_state(latest_state)
                    st4 = latest_state
                    if song_db is not None and current_user and track_key and str(track_key).startswith("sha256:"):
                        try:
                            song_db.update_user_private_song_lyrics(
                                current_user["id"], str(track_key), data4["lines"], lyrics_source="ai"
                            )
                        except Exception as db_exc:
                            logger.warning("Failed to persist AI lyrics to DB: %s", db_exc)
                    elif song_db is not None and track_key and not str(track_key).startswith("sha256:"):
                        try:
                            song_db.update_song_lyrics(str(track_key), data4["lines"], lyrics_source="ai")
                        except Exception:
                            pass

            log_svc.emit_stage_log(
                4, f"[Dal-4 · GPU] Tamamlandı ({round(elapsed4 / 1000, 1)} sn) -> {summary4}", session_id=self.session_id
            )
            return {
                "stage_num": 4,
                "status": "completed",
                "timings_ms": elapsed4,
                "summary": summary4,
                "data": data4,
                "state": st4,
            }
        except Exception as e:
            elapsed4 = round((time.time() - t_s4) * 1000, 1)
            logger.warning("DAG Stage 4 (Lyrics) failed gracefully: %s", e)
            st4 = self.repo.update_stage_state(4, status="error", timings_ms=elapsed4, error=str(e))
            log_svc.emit_stage_log(4, f"[Dal-4] Hata: {e}", level="ERROR", session_id=self.session_id)
            return {
                "stage_num": 4,
                "status": "error",
                "timings_ms": elapsed4,
                "summary": None,
                "error": str(e),
                "data": None,
                "state": st4,
            }

    def _refine_sections_with_stems(
        self,
        *,
        duration: float,
        separated_stems: Dict[str, Any],
        song_db=None,
        current_user: Optional[Dict[str, Any]] = None,
        track_key: Optional[str] = None,
        clear_refining: bool = True,
    ) -> Optional[Dict[str, Any]]:
        """Refines structural sections via allin1 using Stage 3 stems and updates chords.json + DB."""
        log_svc = get_log_service()
        t_ref = time.time()
        d_beats = self.repo.load_artifact("beats") or {}
        d_chords = self.repo.load_artifact("chords") or {}
        if not d_chords:
            return None

        beats = [BeatEvent(**b) for b in d_beats.get("beats", [])]
        source_path = self.repo.get_source_audio_path()
        log_svc.emit_stage_log(
            2,
            "[Dal-2b · Stem Paylaşımı] Aşama 3 kanalları kullanılarak yapısal bölümler çıkarılıyor (Demucs atlandı)...",
            session_id=self.session_id,
        )
        sections = extract_dynamic_sections(
            source_path,
            beats,
            duration,
            separated_stems=separated_stems,
        )
        bars = d_chords.get("bars") or []
        key_signature = d_chords.get("key_signature", "C major")
        chord_count = int(d_chords.get("chord_count", len(d_chords.get("chords", []))))
        prev_ms = float((self.repo.load_state().get("stages", {}).get("2", {}).get("timings_ms")) or 0.0)
        refine_ms = round((time.time() - t_ref) * 1000, 1)
        total_s2_ms = round(prev_ms + refine_ms, 1)

        updated_chords = dict(d_chords)
        updated_chords["engine"] = "BTC-Transformer (Batched) & allin1 (Stem-Shared)"
        updated_chords["sections"] = sections
        updated_chords["sections_refined"] = True
        updated_chords["pipeline_version"] = APP_PIPELINE_VERSION
        self.repo.save_artifact("chords", updated_chords)

        summary2 = f"Ton: {key_signature} · {chord_count} Akor · {len(bars)} Ölçü · {len(sections)} Bölüm"
        self.repo.update_stage_state(2, status="completed", timings_ms=total_s2_ms, summary=summary2, error=None)

        st_now = self.repo.load_state()
        if clear_refining:
            st_now["sections_refining"] = False
            self.repo.save_state(st_now)

        if song_db is not None and track_key and d_beats:
            try:
                user_id = current_user["id"] if current_user else None
                is_priv = bool(str(track_key).startswith("sha256:"))
                song_db.save_song_analysis(
                    track_key=str(track_key),
                    title=str(st_now.get("track_name") or "Kythra Track"),
                    duration_sec=float(duration),
                    stage1=d_beats,
                    stage2=updated_chords,
                    waveform_peaks=st_now.get("waveform_peaks") or [0.35] * 120,
                    lyrics=st_now.get("lyrics") or [],
                    lyrics_source=str(st_now.get("lyrics_source") or "none"),
                    pipeline_version=APP_PIPELINE_VERSION,
                    owner_user_id=user_id,
                    is_private_upload=is_priv,
                    stage3=self.repo.load_artifact("stems") or {},
                )
            except Exception as db_exc:
                logger.warning("Failed to update refined sections in DB: %s", db_exc)

        log_svc.emit_stage_log(
            2,
            f"[Dal-2b] Bölümler güncellendi ({round(refine_ms / 1000, 1)} sn) -> {len(sections)} Bölüm",
            session_id=self.session_id,
        )
        return updated_chords

    def execute_dag(self, force: bool = True) -> Dict[str, Any]:
        """
        Full end-to-end Production Flow run (used by Developer 'Üretim Akışı' / run-all):
        Concurrently runs Stage 1 (CPU), Stage 2a BTC CQT (CPU), and Stage 3 BS-RoFormer (GPU),
        measures fast TTFO, then runs stem-shared allin1 sections (Wave 2b) & Stage 4 Lyrics (Wave 4).
        """
        t_dag_start = time.time()
        log_svc = get_log_service()
        state = self.repo.load_state()
        duration = float(state.get("duration_sec", 30.0))
        ctx = self.repo.build_context_from_session()
        sid = self.session_id

        log_svc.add_entry(
            "INFO",
            "backend.dag",
            "Üretim Akışı (Birleşik Paralel DAG) başlatıldı (CPU + GPU Eşzamanlı, Çift Demucs Devre Dışı).",
            session_id=sid,
        )

        for s_num in (1, 2, 3):
            self.repo.update_stage_state(s_num, status="running", error=None)

        results: Dict[int, Dict[str, Any]] = {}

        with ThreadPoolExecutor(max_workers=3) as pool:
            fut_stage1 = pool.submit(_with_session_ctx, sid, self._run_stage1_worker, ctx, state)
            fut_btc_cqt = pool.submit(_with_session_ctx, sid, self._run_btc_cqt_worker, ctx)
            fut_stage3 = pool.submit(_with_session_ctx, sid, self._run_stage3_worker, ctx, state)

            # Await fast CPU wave (Stage 1 + BTC CQT) first to record real Web Studio TTFO
            stage1_failed = False
            try:
                res1 = fut_stage1.result()
                results[1] = res1
            except Exception as e1:
                stage1_failed = True
                results[1] = {
                    "stage_num": 1,
                    "status": "error",
                    "timings_ms": round((time.time() - t_dag_start) * 1000, 1),
                    "summary": None,
                    "error": str(e1),
                    "data": None,
                    "state": self.repo.load_state(),
                }
                self.repo.update_stage_state(2, status="error", error=f"Ön koşul (Aşama 1) başarısız: {e1}")
                results[2] = {
                    "stage_num": 2,
                    "status": "error",
                    "timings_ms": 0.0,
                    "summary": None,
                    "error": f"Ön koşul (Aşama 1) başarısız: {e1}",
                    "data": None,
                    "state": self.repo.load_state(),
                }

            if stage1_failed:
                # Let Stage 3 finish cleanly under ThreadPoolExecutor without leaking GPU threads
                results[3] = fut_stage3.result()
                total_wall_ms = round((time.time() - t_dag_start) * 1000, 1)
                return {
                    "status": "error",
                    "execution_mode": "parallel_dag",
                    "ttfo_ms": total_wall_ms,
                    "wall_time_ms": total_wall_ms,
                    "sequential_sum_ms": round(sum(float(r.get("timings_ms") or 0.0) for r in results.values()), 1),
                    "message": f"Stage 1 failed: {results[1]['error']}",
                    "results": results,
                    "state": self.repo.load_state(),
                }

            t_s2_gpu = time.time()
            cqt_ms = 0.0
            try:
                (feature, time_unit, n_timestep, orig_frames), cqt_ms = fut_btc_cqt.result()
                chord_engine = get_engine("chord")
                ctx.chords = chord_engine.infer_from_features(
                    feature, time_unit, n_timestep, orig_frames, allow_cpu_fallback=True
                )
            except Exception as e:
                logger.warning("DAG Batched BTC error (%s), using fallback...", e)

            if len(ctx.chords) == 0:
                _chroma_template_fallback(ctx, duration)

            bars = align_chords_to_bars(ctx.beats, ctx.chords, duration)
            key_signature = estimate_key_signature(ctx.chords)
            ctx.key_signature = key_signature
            primary_progression = self._build_progression(bars)
            ttfo_ms = round((time.time() - t_dag_start) * 1000, 1)

            log_svc.add_entry(
                "INFO",
                "backend.dag",
                f"İlk Stüdyo Açılış Hazır (TTFO: {round(ttfo_ms / 1000, 1)} sn) — BS-RoFormer devam ediyor.",
                session_id=sid,
            )

            # Now wait for GPU Stage 3 before stem-shared Wave 2b
            res3 = fut_stage3.result()
            results[3] = res3
            stage3_ok = res3.get("status") == "completed"

            t_sections = time.time()
            if stage3_ok:
                sections = extract_dynamic_sections(
                    ctx.audio_path,
                    ctx.beats,
                    duration,
                    separated_stems=ctx.separated_stems,
                )
                sections_refined = True
                engine_label = "BTC-Transformer (Batched) & allin1 (Stem-Shared)"
            else:
                logger.warning("Stage 3 failed; skipping allin1 Demucs fallback and using provisional sections.")
                sections = build_provisional_sections(bars, duration)
                sections_refined = False
                engine_label = "BTC-Transformer (Batched) & Provisional Sections"

            s2_elapsed = round(cqt_ms + (time.time() - t_s2_gpu) * 1000, 1)
            data2 = {
                "engine": engine_label,
                "key_signature": key_signature,
                "chord_count": len(ctx.chords),
                "bar_count": len(bars),
                "primary_progression": primary_progression,
                "sections": sections,
                "sections_refined": sections_refined,
                "bars": bars,
                "chords": [c.model_dump() for c in ctx.chords],
                "pipeline_version": APP_PIPELINE_VERSION,
            }
            self.repo.save_artifact("chords", data2)
            summary2 = f"Ton: {key_signature} · {len(ctx.chords)} Akor · {len(bars)} Ölçü · {len(sections)} Bölüm"
            st2 = self.repo.update_stage_state(
                2, status="completed", timings_ms=s2_elapsed, summary=summary2, error=None
            )
            log_svc.emit_stage_log(
                2,
                f"[Dal-2b · {'Stem Paylaşımı' if sections_refined else 'Geçici Bölümler'}] Tamamlandı ({round((time.time() - t_sections), 1)} sn) -> {summary2}",
                session_id=sid,
            )
            results[2] = {
                "stage_num": 2,
                "status": "completed",
                "timings_ms": s2_elapsed,
                "summary": summary2,
                "data": data2,
                "state": st2,
            }

        # WAVE 4: Lyrics Transcription & CTC Alignment on Isolated Vocals
        vocals_path = ctx.separated_stems.get("vocals") or (self.repo.get_stems_dir() / "vocals.wav")
        if stage3_ok and vocals_path.exists():
            results[4] = self._run_stage4_worker(ctx, state)

        total_wall_ms = round((time.time() - t_dag_start) * 1000, 1)
        sum_stages_ms = round(sum(float(r.get("timings_ms") or 0.0) for r in results.values()), 1)
        has_any_error = any(r.get("status") == "error" for r in results.values())
        overall_status = "completed_with_errors" if has_any_error else "completed"
        log_svc.add_entry(
            "WARNING" if has_any_error else "INFO",
            "backend.dag",
            f"Üretim Akışı {'kısmi hatalarla ' if has_any_error else ''}tamamlandı! İlk Açılış (TTFO): {round(ttfo_ms / 1000, 1)} sn · "
            f"Toplam Duvar Süresi: {round(total_wall_ms / 1000, 1)} sn "
            f"(Sıralı Karşılığı: {round(sum_stages_ms / 1000, 1)} sn).",
            session_id=sid,
        )

        return {
            "status": overall_status,
            "execution_mode": "parallel_dag",
            "ttfo_ms": ttfo_ms,
            "wall_time_ms": total_wall_ms,
            "sequential_sum_ms": sum_stages_ms,
            "message": (
                "Production 4-stage flow completed with stage errors."
                if has_any_error
                else "Production 4-stage flow executed successfully."
            ),
            "results": results,
            "state": self.repo.load_state(),
        }

    def execute_progressive_studio_load(
        self,
        *,
        song_db=None,
        current_user: Optional[Dict[str, Any]] = None,
        background_stems: bool = True,
        disk_stems: Optional[Dict[str, Any]] = None,
        disk_lyrics: Optional[Dict[str, Any]] = None,
        lyrics: Optional[List[Dict[str, Any]]] = None,
        lyrics_source: str = "none",
    ) -> Dict[str, Any]:
        """
        Ultra-fast Progressive Web Studio Loader:
        - Launches CPU Stage 1 + CPU Stage 2a + Background GPU Stage 3 at t=0.
        - Returns immediately after Stage 1 + BTC Chords finish (~12-15s TTFO) with fast provisional sections.
        - Background thread seamlessly finishes BS-RoFormer 6-Stem -> stem-shared allin1 refinement -> Stage 4 Lyrics.
        """
        t_start = time.time()
        log_svc = get_log_service()
        state = self.repo.load_state()
        duration = float(state.get("duration_sec") or 180.0)
        track_key = state.get("track_key")
        waveform_peaks = state.get("waveform_peaks") or [0.35] * 120
        sid = self.session_id
        user_id = current_user["id"] if current_user else None
        is_priv = bool(track_key and str(track_key).startswith("sha256:"))
        ctx = self.repo.build_context_from_session()

        self.repo.update_stage_state(1, status="running", error=None)
        self.repo.update_stage_state(2, status="running", error=None)

        initial_s1_s2_ready = threading.Event()
        has_preseparated = disk_stems is not None

        if not has_preseparated:
            self.repo.update_stage_state(
                3,
                status="running",
                summary="Arka planda 6 kanala ayrıştırılıyor...",
                error=None,
            )

            def _bg_pipeline():
                token = CURRENT_SESSION_ID.set(sid)
                try:
                    bg_ctx = self.repo.build_context_from_session()
                    res3 = self._run_stage3_worker(
                        bg_ctx,
                        self.repo.load_state(),
                        song_db=song_db,
                        current_user=current_user,
                        track_key=track_key,
                    )
                    initial_s1_s2_ready.wait(timeout=120.0)

                    if res3.get("status") == "completed":
                        try:
                            self._refine_sections_with_stems(
                                duration=duration,
                                separated_stems=bg_ctx.separated_stems,
                                song_db=song_db,
                                current_user=current_user,
                                track_key=track_key,
                                clear_refining=False,
                            )
                        except Exception as ref_exc:
                            logger.warning("Section refinement skipped: %s", ref_exc)

                        st_after = self.repo.load_state()
                        has_lyrics_now = bool(st_after.get("lyrics"))
                        s4_status_now = st_after.get("stages", {}).get("4", {}).get("status")
                        vocals_wav = self.repo.get_stems_dir() / "vocals.wav"
                        will_run_stage4 = (
                            not has_lyrics_now
                            and s4_status_now != "completed"
                            and vocals_wav.exists()
                            and disk_lyrics is None
                        )
                        if will_run_stage4:
                            # Mark Stage 4 running BEFORE clearing sections_refining to avoid polling gap
                            self.repo.update_stage_state(4, status="running", error=None)
                        st_clear = self.repo.load_state()
                        st_clear["sections_refining"] = False
                        self.repo.save_state(st_clear)

                        if will_run_stage4:
                            self._run_stage4_worker(
                                bg_ctx,
                                st_clear,
                                song_db=song_db,
                                current_user=current_user,
                                track_key=track_key,
                            )
                    else:
                        st_err = self.repo.load_state()
                        st_err["sections_refining"] = False
                        self.repo.save_state(st_err)
                except Exception as bg_exc:
                    logger.error("Background progressive pipeline failed: %s", bg_exc, exc_info=True)
                finally:
                    CURRENT_SESSION_ID.reset(token)

            bg_thread = threading.Thread(target=_bg_pipeline, daemon=True, name=f"bg-dag-{sid[:12]}")
            if background_stems:
                bg_thread.start()
        else:
            bg_thread = None

        # Foreground Fast Wave (CPU Stage 1 + CPU Stage 2a BTC CQT)
        with ThreadPoolExecutor(max_workers=2) as pool:
            fut_s1 = pool.submit(_with_session_ctx, sid, self._run_stage1_worker, ctx, state)
            fut_cqt = pool.submit(_with_session_ctx, sid, self._run_btc_cqt_worker, ctx)

            res1 = fut_s1.result()
            s1_data = res1["data"]

            t_s2_infer = time.time()
            cqt_ms = 0.0
            try:
                (feature, time_unit, n_timestep, orig_frames), cqt_ms = fut_cqt.result()
                chord_engine = get_engine("chord")
                ctx.chords = chord_engine.infer_from_features(
                    feature, time_unit, n_timestep, orig_frames, allow_cpu_fallback=background_stems
                )
            except Exception as exc:
                logger.warning("Progressive BTC chord recognition fallback (%s)", exc)

            if len(ctx.chords) == 0:
                _chroma_template_fallback(ctx, duration)

            bars = align_chords_to_bars(ctx.beats, ctx.chords, duration)
            key_signature = estimate_key_signature(ctx.chords)
            ctx.key_signature = key_signature
            primary_progression = self._build_progression(bars)

            if has_preseparated:
                sections = extract_dynamic_sections(
                    ctx.audio_path, ctx.beats, duration, separated_stems=ctx.separated_stems
                )
                sections_refined = True
            else:
                sections = build_provisional_sections(bars, duration)
                sections_refined = False

            s2_elapsed = round(cqt_ms + (time.time() - t_s2_infer) * 1000, 1)
            s2_data = {
                "engine": "BTC-Transformer (Batched) & allin1 (Stem-Shared)",
                "key_signature": key_signature,
                "chord_count": len(ctx.chords),
                "bar_count": len(bars),
                "primary_progression": primary_progression,
                "sections": sections,
                "sections_refined": sections_refined,
                "bars": bars,
                "chords": [c.model_dump() for c in ctx.chords],
                "pipeline_version": APP_PIPELINE_VERSION,
            }
            self.repo.save_artifact("chords", s2_data)
            summary2 = f"Ton: {key_signature} · {len(ctx.chords)} Akor · {len(bars)} Ölçü · {len(sections)} Bölüm"
            self.repo.update_stage_state(2, status="completed", timings_ms=s2_elapsed, summary=summary2, error=None)

            latest_state = self.repo.load_state()
            latest_state["sections_refining"] = not sections_refined
            self.repo.save_state(latest_state)

            if song_db is not None and track_key:
                try:
                    song_db.save_song_analysis(
                        track_key=str(track_key),
                        title=str(latest_state.get("track_name") or "Kythra Track"),
                        duration_sec=duration,
                        stage1=s1_data,
                        stage2=s2_data,
                        waveform_peaks=waveform_peaks,
                        lyrics=lyrics or [],
                        lyrics_source=lyrics_source,
                        pipeline_version=APP_PIPELINE_VERSION,
                        owner_user_id=user_id,
                        is_private_upload=is_priv,
                        stage3=disk_stems or {},
                    )
                except Exception as db_exc:
                    logger.warning("Failed to save initial progressive song analysis: %s", db_exc)

            initial_s1_s2_ready.set()

        if not has_preseparated and not background_stems:
            # Synchronous mode fallback: run Stage 3 -> Section Refinement -> Stage 4 inline
            res3 = self._run_stage3_worker(
                ctx, self.repo.load_state(), song_db=song_db, current_user=current_user, track_key=track_key
            )
            if res3.get("status") == "completed":
                self._refine_sections_with_stems(
                    duration=duration,
                    separated_stems=ctx.separated_stems,
                    song_db=song_db,
                    current_user=current_user,
                    track_key=track_key,
                )
                vocals_wav = self.repo.get_stems_dir() / "vocals.wav"
                if disk_lyrics is None and vocals_wav.exists() and not self.repo.load_state().get("lyrics"):
                    self._run_stage4_worker(
                        ctx, self.repo.load_state(), song_db=song_db, current_user=current_user, track_key=track_key
                    )

        ttfo_sec = round(time.time() - t_start, 1)
        log_svc.add_entry(
            "INFO",
            "backend.pipeline",
            f"Stüdyo İlk Açılış Hazır ({ttfo_sec} sn TTFO) — Arka planda stem & bölüm iyileştirme aktif.",
            session_id=sid,
        )
        return {"s1_data": s1_data, "s2_data": s2_data, "ttfo_sec": ttfo_sec}
