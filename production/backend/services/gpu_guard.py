"""
Process-wide GPU Concurrency Lock & CUDA VRAM Release Utility.
Kept as a zero-dependency leaf module so engines, domain logic, and stages never form circular imports.
"""

import gc
import threading

# Process-wide lock ensuring heavy CUDA models (BS-RoFormer, allin1, Whisper+MMS_FA)
# never contend for limited 8GB VRAM simultaneously.
GPU_LOCK = threading.RLock()


def release_cuda_cache() -> None:
    """Collects Python garbage and flushes PyTorch CUDA caching allocator back to driver."""
    gc.collect()
    try:
        import torch

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    except Exception:
        pass
