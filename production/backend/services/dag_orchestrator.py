"""
KythraStudio Production Parallel DAG Orchestrator (DAG & Strategy Pattern)
Maximizes 24-Core CPU and RTX 4060 GPU concurrency while enforcing data dependencies
and eliminating duplicate source separation between Stage 2 (allin1) and Stage 3 (BS-RoFormer).
"""

from concurrent.futures import ThreadPoolExecutor
import logging
import time
from typing import Any, Dict

from backend.domain.chords import (
    align_chords_to_bars,
    estimate_key_signature,
    extract_dynamic_sections,
)
from backend.services.log_service import get_log_service
from backend.services.session_repository import SessionRepository
from backend.services.stage_factory import StageExecutorFactory
from backend.stages.registry import get_engine
from backend.stages.chord_recognition import _chroma_template_fallback

logger = logging.getLogger("backend.services.dag_orchestrator")


class DAGPipelineOrchestrator:
    """
    Executes the 4-stage Production pipeline as a true Directed Acyclic Graph (DAG):

    Wave 1 (Concurrent CPU + GPU at t = 0):
      - Branch A (CPU Multi-Core): Stage 1 Beat & Downbeat Tracking (madmom RNNDownBeat)
      - Branch B (CPU Multi-Core): Stage 2a BTC CQT Spectral Feature Extraction
      - Branch C (GPU Tensor Cores): Stage 3 BS-RoFormer 6-Stem Separation (Batch=4, TF32/FP16)

    Wave 2 (Fast GPU Inference & Stem Reuse — Zero Duplicate Demucs):
      - Branch D (GPU): Stage 2b Batched BTC-Transformer Forward Pass (< 0.1s)
      - Branch E (GPU + CPU): Stage 2c allin1 Structural Sections consuming persistent disk stems (~3s)

    Wave 3 (Barrier Join < 5ms):
      - Joins Beat Tracking + Chords & Sections + Key Signature into chords.json.

    Wave 4 (GPU Vocal ASR + CTC Alignment):
      - Stage 4 Lyrics Transcription & Forced Alignment on persistent vocals.wav -> lyrics.json.
    """

    def __init__(self, repo: SessionRepository):
        self.repo = repo

    def execute_dag(self) -> Dict[str, Any]:
        t_dag_start = time.time()
        log_svc = get_log_service()
        state = self.repo.load_state()
        duration = float(state.get("duration_sec", 30.0))
        ctx = self.repo.build_context_from_session()

        log_svc.add_entry(
            "INFO",
            "backend.dag",
            "Paralel DAG Çözümleme Motoru başlatıldı (CPU 24-Çekirdek + GPU Tensor Core Eşzamanlı).",
        )

        # Mark stages as running in parallel wave
        for s_num in (1, 2, 3):
            self.repo.update_stage_state(s_num, status="running", error=None)

        results: Dict[int, Dict[str, Any]] = {}

        def _run_stage1_cpu() -> Dict[str, Any]:
            t0 = time.time()
            log_svc.emit_stage_log(1, "[DAG Dal-1 · CPU] Ölçü ve Tempo Tespiti başlatıldı...")
            executor1 = StageExecutorFactory.get_executor(1)
            data1, summary1 = executor1.execute(ctx, self.repo, state)
            elapsed1 = round((time.time() - t0) * 1000, 1)
            st1 = self.repo.update_stage_state(
                1, status="completed", timings_ms=elapsed1, summary=summary1
            )
            log_svc.emit_stage_log(
                1, f"[DAG Dal-1] Tamamlandı ({round(elapsed1 / 1000, 1)} sn) -> {summary1}"
            )
            return {
                "stage_num": 1,
                "status": "completed",
                "timings_ms": elapsed1,
                "summary": summary1,
                "data": data1,
                "state": st1,
            }

        def _run_btc_cqt_cpu():
            t0 = time.time()
            log_svc.emit_stage_log(2, "[DAG Dal-2a · CPU] BTC CQT Spektral Özellik Çıkarımı başlatıldı...")
            chord_engine = get_engine("chord")
            feat_tuple = chord_engine.extract_features(ctx.audio_path)
            elapsed_cqt = round((time.time() - t0) * 1000, 1)
            log_svc.emit_stage_log(
                2, f"[DAG Dal-2a · CPU] CQT Özellikleri hazır ({round(elapsed_cqt / 1000, 1)} sn)."
            )
            return feat_tuple, elapsed_cqt

        def _run_stage3_gpu() -> Dict[str, Any]:
            from backend.config import MSS_BATCH_SIZE, MSS_USE_AMP

            t0 = time.time()
            amp_tag = "BF16/FP16 AMP" if MSS_USE_AMP else "TF32"
            log_svc.emit_stage_log(
                3,
                f"[DAG Dal-3 · GPU] BS-RoFormer 6-Kanal Ayırma (Batch={MSS_BATCH_SIZE}, {amp_tag}) başlatıldı...",
            )
            executor3 = StageExecutorFactory.get_executor(3)
            data3, summary3 = executor3.execute(ctx, self.repo, state)
            elapsed3 = round((time.time() - t0) * 1000, 1)
            st3 = self.repo.update_stage_state(
                3, status="completed", timings_ms=elapsed3, summary=summary3
            )
            log_svc.emit_stage_log(
                3, f"[DAG Dal-3 · GPU] 6 Kanal diske ayrıştırıldı ({round(elapsed3 / 1000, 1)} sn) -> {summary3}"
            )
            return {
                "stage_num": 3,
                "status": "completed",
                "timings_ms": elapsed3,
                "summary": summary3,
                "data": data3,
                "state": st3,
            }

        # WAVE 1: Launch CPU Beat Tracking, CPU BTC Feature Extraction, and GPU Stage 3 concurrently
        with ThreadPoolExecutor(max_workers=3) as pool:
            fut_stage1 = pool.submit(_run_stage1_cpu)
            fut_btc_cqt = pool.submit(_run_btc_cqt_cpu)
            fut_stage3 = pool.submit(_run_stage3_gpu)

            # Wait for GPU Stage 3 & CPU BTC CQT so Wave 2 GPU inference can immediately reuse Stage 3 stems
            res3 = fut_stage3.result()
            results[3] = res3

            t_s2_gpu = time.time()
            try:
                (feature, time_unit, n_timestep, orig_frames), cqt_ms = fut_btc_cqt.result()
                chord_engine = get_engine("chord")
                ctx.chords = chord_engine.infer_from_features(
                    feature, time_unit, n_timestep, orig_frames
                )
            except Exception as e:
                logger.warning("DAG Batched BTC error (%s), using fallback...", e)
                cqt_ms = 0.0

            if len(ctx.chords) == 0:
                _chroma_template_fallback(ctx, duration)

            # Wait for Stage 1 beats before finalizing Stage 2 section & bar alignment
            res1 = fut_stage1.result()
            results[1] = res1

            # WAVE 2: Run allin1 MSA directly on BS-RoFormer persistent disk stems (Zero Demucs overhead!)
            log_svc.emit_stage_log(
                2, "[DAG Dal-2b · Stem Paylaşımı] Aşama 3 kanalları kullanılarak yapısal bölümler çıkarılıyor..."
            )
            sections = extract_dynamic_sections(
                ctx.audio_path,
                ctx.beats,
                duration,
                separated_stems=ctx.separated_stems,
            )

            # WAVE 3: Barrier Join (< 5ms) — Beat-synchronous bar chord alignment & Key Signature
            bars = align_chords_to_bars(ctx.beats, ctx.chords, duration)
            key_signature = estimate_key_signature(ctx.chords)
            ctx.key_signature = key_signature

            unique_prog = []
            for b in bars:
                lbl = b["chord"]
                if lbl != "N.C." and (not unique_prog or unique_prog[-1] != lbl):
                    unique_prog.append(lbl)
            primary_progression = " → ".join(unique_prog[:8]) if unique_prog else "N/A"

            s2_elapsed = round(cqt_ms + (time.time() - t_s2_gpu) * 1000, 1)
            data2 = {
                "engine": "BTC-Transformer (Batched) & allin1 (Stem-Shared DAG)",
                "key_signature": key_signature,
                "chord_count": len(ctx.chords),
                "bar_count": len(bars),
                "primary_progression": primary_progression,
                "sections": sections,
                "bars": bars,
                "chords": [c.model_dump() for c in ctx.chords],
            }
            self.repo.save_artifact("chords", data2)
            summary2 = f"Ton: {key_signature} · {len(ctx.chords)} Akor · {len(bars)} Ölçü · {len(sections)} Bölüm"
            st2 = self.repo.update_stage_state(
                2, status="completed", timings_ms=s2_elapsed, summary=summary2
            )
            log_svc.emit_stage_log(
                2, f"[DAG Birleştirme] Tamamlandı ({round(s2_elapsed / 1000, 1)} sn) -> {summary2}"
            )
            results[2] = {
                "stage_num": 2,
                "status": "completed",
                "timings_ms": s2_elapsed,
                "summary": summary2,
                "data": data2,
                "state": st2,
            }

        # WAVE 4: Automatic Lyrics Transcription & CTC Alignment on Isolated Vocals
        vocals_path = ctx.separated_stems.get("vocals") or (self.repo.get_stems_dir() / "vocals.wav")
        if vocals_path.exists():
            t_s4 = time.time()
            self.repo.update_stage_state(4, status="running", error=None)
            log_svc.emit_stage_log(
                4, "[DAG Dal-4 · GPU] İzole vokalden söz transkripsiyonu ve MMS_FA CTC hizalama başlatıldı..."
            )
            try:
                executor4 = StageExecutorFactory.get_executor(4)
                data4, summary4 = executor4.execute(ctx, self.repo, state)
                elapsed4 = round((time.time() - t_s4) * 1000, 1)
                st4 = self.repo.update_stage_state(
                    4, status="completed", timings_ms=elapsed4, summary=summary4
                )
                if data4.get("lines"):
                    latest_state = self.repo.load_state()
                    if latest_state.get("lyrics_source") != "user" or not latest_state.get("lyrics"):
                        latest_state["lyrics"] = data4["lines"]
                        latest_state["lyrics_source"] = "ai"
                        latest_state["lyrics_locked"] = False
                        self.repo.save_state(latest_state)
                log_svc.emit_stage_log(
                    4, f"[DAG Dal-4 · GPU] Tamamlandı ({round(elapsed4 / 1000, 1)} sn) -> {summary4}"
                )
                results[4] = {
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
                st4 = self.repo.update_stage_state(
                    4, status="error", timings_ms=elapsed4, error=str(e)
                )
                log_svc.emit_stage_log(4, f"[DAG Dal-4] Hata: {str(e)}", level="ERROR")
                results[4] = {
                    "stage_num": 4,
                    "status": "error",
                    "timings_ms": elapsed4,
                    "summary": None,
                    "data": None,
                    "state": st4,
                }

        total_wall_ms = round((time.time() - t_dag_start) * 1000, 1)
        sum_stages_ms = round(
            sum(r.get("timings_ms", 0.0) for r in results.values()), 1
        )
        log_svc.add_entry(
            "INFO",
            "backend.dag",
            f"Paralel DAG tamamlandı! Gerçek Duvar Süresi: {round(total_wall_ms / 1000, 1)} sn "
            f"(Sıralı Toplam Karşılığı: {round(sum_stages_ms / 1000, 1)} sn).",
        )

        return {
            "status": "completed",
            "execution_mode": "parallel_dag",
            "wall_time_ms": total_wall_ms,
            "sequential_sum_ms": sum_stages_ms,
            "message": "Production 4-stage Parallel DAG executed successfully.",
            "results": results,
            "state": self.repo.load_state(),
        }
