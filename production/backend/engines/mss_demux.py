"""
Kythra Engine: Music Source Separation (BS-RoFormer-SW)
Optimized with Ada Lovelace TF32/FP16 Tensor Cores, Batch Size=4,
Zero-Overhead soundfile PCM Loading, In-Memory Telemetry, and Parallel 6-Thread Disk Writes.
"""

from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import time
import logging
import numpy as np
import torch
import soundfile as sf
import librosa

from backend.config import (
    BS_ROFORMER_CKPT,
    BS_ROFORMER_CONFIG,
    DEVICE,
    MSS_BATCH_SIZE,
    MSS_USE_AMP,
    MSST_DIR,
)
from backend.engines.base import PipelineContext
from backend.services.gpu_guard import GPU_LOCK, release_cuda_cache

logger = logging.getLogger("backend.mss")


def _compute_and_write_stem(
    stem_name: str,
    audio_arr: np.ndarray,
    sr: int,
    output_stems_dir: Path
) -> tuple[str, Path, dict]:
    """
    Computes RMS/Peak telemetry directly from in-memory float32 numpy array
    and writes WAV to persistent disk storage without redundant disk reads.
    """
    stem_file = output_stems_dir / f"{stem_name}.wav"
    dur = round(float(audio_arr.shape[-1]) / sr, 2)
    rms = float(np.sqrt(np.mean(np.square(audio_arr, dtype=np.float32)))) + 1e-9
    peak = float(np.max(np.abs(audio_arr))) + 1e-9
    rms_db = round(float(20.0 * np.log10(rms)), 1)
    peak_db = round(float(20.0 * np.log10(peak)), 1)

    sf.write(str(stem_file), audio_arr.T, sr)
    buffer_mb = round(stem_file.stat().st_size / (1024 * 1024), 2)

    telemetry = {
        "rms_dbfs": rms_db,
        "peak_dbfs": peak_db,
        "duration_sec": dur,
        "sample_rate_hz": sr,
        "buffer_size_mb": buffer_mb,
    }
    return stem_name, stem_file, telemetry


class MssDemuxEngine:
    name: str = "BS-RoFormer-SW"
    version: str = "6-stem-2.1-amp"

    def __init__(self, batch_size: int = MSS_BATCH_SIZE, use_amp: bool = MSS_USE_AMP):
        self.model = None
        self.config = None
        self.is_loaded = False
        self.batch_size = max(0, int(batch_size))
        self.use_amp = bool(use_amp)

    @staticmethod
    def _resolve_safe_batch_size(requested: int) -> int:
        if requested > 0:
            return requested
        if not torch.cuda.is_available():
            return 1
        try:
            vram_gb = torch.cuda.get_device_properties(0).total_memory / float(1024 ** 3)
            if vram_gb <= 9.5:
                return 2
            if vram_gb <= 16.5:
                return 4
            return 8
        except Exception:
            return 2

    def load(self) -> None:
        if self.is_loaded:
            return
        logger.info("Loading BS-RoFormer-SW model with Tensor Core optimizations...")
        import sys
        if str(MSST_DIR) not in sys.path:
            sys.path.insert(0, str(MSST_DIR))

        if torch.cuda.is_available():
            torch.backends.cuda.matmul.allow_tf32 = True
            torch.backends.cudnn.allow_tf32 = True
            torch.backends.cudnn.benchmark = True

        from utils.settings import get_model_from_config
        self.model, self.config = get_model_from_config("bs_roformer", str(BS_ROFORMER_CONFIG))

        effective_bs = self._resolve_safe_batch_size(self.batch_size)
        if hasattr(self.config, "inference"):
            self.config.inference.batch_size = effective_bs
        if hasattr(self.config, "training"):
            self.config.training.use_amp = bool(self.use_amp and torch.cuda.is_available())

        state = torch.load(str(BS_ROFORMER_CKPT), map_location="cpu")
        if "state_dict" in state:
            state = state["state_dict"]
        new_state = {k.replace("model.", ""): v for k, v in state.items()}
        self.model.load_state_dict(new_state)
        self.model = self.model.to(DEVICE).eval()
        self.is_loaded = True
        logger.info(
            "BS-RoFormer-SW loaded onto %s (batch_size=%d, AMP=%s, TF32=True)",
            DEVICE,
            getattr(self.config.inference, "batch_size", effective_bs),
            self.use_amp and torch.cuda.is_available(),
        )

    def offload_to_cpu(self) -> None:
        """Moves BS-RoFormer weights off 8GB VRAM back to CPU RAM after stage completion."""
        if self.model is not None:
            try:
                self.model = self.model.to("cpu")
            except Exception as exc:
                logger.debug("BS-RoFormer offload skipped: %s", exc)
        release_cuda_cache()

    def _run_demix_with_backoff(self, demix_fn, mix: np.ndarray):
        device_obj = torch.device(DEVICE)

        with GPU_LOCK:
            if self.model is not None:
                self.model = self.model.to(device_obj)
            try:
                while True:
                    cur_bs = getattr(self.config.inference, "batch_size", 2)
                    try:
                        with torch.inference_mode():
                            # MSST demix() internally manages torch.cuda.amp.autocast via config.training.use_amp
                            return demix_fn(self.config, self.model, mix, device_obj, "bs_roformer", pbar=False)
                    except torch.cuda.OutOfMemoryError:
                        if cur_bs <= 1 or not hasattr(self.config, "inference"):
                            raise
                        next_bs = max(1, cur_bs // 2)
                        logger.warning(
                            "CUDA OOM in BS-RoFormer at batch_size=%d; clearing cache and retrying with batch_size=%d",
                            cur_bs,
                            next_bs,
                        )
                        release_cuda_cache()
                        self.config.inference.batch_size = next_bs
            finally:
                self.offload_to_cpu()

    def run(self, ctx: PipelineContext, output_stems_dir: Path) -> None:
        t0 = time.time()
        output_stems_dir.mkdir(parents=True, exist_ok=True)

        try:
            self.load()
            import sys
            if str(MSST_DIR) not in sys.path:
                sys.path.insert(0, str(MSST_DIR))
            from utils.model_utils import demix

            target_sr = getattr(self.config.audio, "sample_rate", 44100)

            # Fast zero-overhead PCM read via soundfile instead of slow librosa.load
            data, file_sr = sf.read(str(ctx.audio_path), dtype="float32", always_2d=True)
            mix = data.T  # shape: (channels, samples)
            if file_sr != target_sr:
                mix = librosa.resample(mix, orig_sr=file_sr, target_sr=target_sr)
            if mix.shape[0] == 1:
                mix = np.vstack([mix, mix])
            elif mix.shape[0] > 2:
                mix = mix[:2, :]

            logger.info(
                "Demixing multitrack audio (%d ch, %.1fs) with BS-RoFormer-SW (batch=%d, amp=%s)...",
                mix.shape[0],
                mix.shape[1] / target_sr,
                getattr(self.config.inference, "batch_size", self.batch_size),
                self.use_amp and torch.cuda.is_available(),
            )
            stems_dict = self._run_demix_with_backoff(demix, mix)

            # Parallel 6-thread telemetry & persistent disk write
            with ThreadPoolExecutor(max_workers=6) as pool:
                futures = [
                    pool.submit(_compute_and_write_stem, s_name, s_arr, target_sr, output_stems_dir)
                    for s_name, s_arr in stems_dict.items()
                ]
                for fut in futures:
                    s_name, s_file, telemetry = fut.result()
                    ctx.separated_stems[s_name] = s_file
                    ctx.stem_telemetry[s_name] = telemetry

            if "guitar" in ctx.separated_stems:
                ctx.active_guitar_path = ctx.separated_stems["guitar"]
            else:
                ctx.active_guitar_path = ctx.audio_path

        except Exception as e:
            logger.error("BS-RoFormer separation failed: %s", e, exc_info=True)
            ctx.warnings.append(f"Source separation error: {str(e)}")
            raise e

        ctx.timings_ms["mss"] = (time.time() - t0) * 1000
