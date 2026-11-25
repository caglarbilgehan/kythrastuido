"""
Kythra Production Configuration (4-Stage Engine)
Paths, device selection, thresholds, and engine parameters for Production V1.
"""

from pathlib import Path
from typing import Optional
import os
import shutil
import sys
import torch

BASE_DIR = Path(__file__).resolve().parent
ENV_ROOT = BASE_DIR.parent
PROJECT_ROOT = ENV_ROOT.parent
BENCHMARKS_DIR = PROJECT_ROOT.parent / "benchmarks"

# Persistent Disk Storage (Session metadata + permanent normalized master & stem WAVs)
STORAGE_DIR = PROJECT_ROOT / "storage"
SESSIONS_DIR = STORAGE_DIR / "sessions"
SESSION_DIR = SESSIONS_DIR / "default"
TRACKS_DIR = STORAGE_DIR / "tracks"
DEVELOPER_DIR = ENV_ROOT / "developer"
WEB_DIR = ENV_ROOT / "web"

# Pipeline Version & Persistent Disk Audio + SQLite Metadata Library
APP_PIPELINE_VERSION = "1.2.0"
SONG_DB_PATH = STORAGE_DIR / "kythra_library.db"

# Hardware
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"

# Ingestion Limits (Single Source of Truth)
MAX_UPLOAD_SIZE_MB = 100
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024
MAX_AUDIO_DURATION_SEC = 600  # 10 minutes
ALLOWED_EXTENSIONS = {".wav", ".mp3", ".flac", ".ogg", ".m4a"}


def get_ffmpeg_dir() -> Optional[str]:
    """Resolves the directory containing the ffmpeg binary cleanly."""
    venv_bin = Path(sys.executable).resolve().parent
    if (venv_bin / "ffmpeg").exists():
        return str(venv_bin)
    found = shutil.which("ffmpeg")
    if found:
        return str(Path(found).resolve().parent)
    return None


# Model Paths (Stages 1, 2, 3)
BTC_DIR = BENCHMARKS_DIR / "02-Automatic-Chord-Recognition" / "models" / "btc"
BTC_CKPT = BTC_DIR / "test" / "btc_model_large_voca.pt"
BTC_CONFIG = BTC_DIR / "run_config.yaml"

BS_ROFORMER_DIR = BENCHMARKS_DIR / "07-Music-Source-Separation" / "weights" / "bs_roformer_sw"
BS_ROFORMER_CKPT = BS_ROFORMER_DIR / "BS-Roformer-SW.ckpt"
BS_ROFORMER_CONFIG = BS_ROFORMER_DIR / "BS-Roformer-SW.yaml"
MSST_DIR = BENCHMARKS_DIR / "07-Music-Source-Separation" / "repos" / "MSST"

# Inference Tuning (Stages 3 & 4)
# KYTHRA_MSS_BATCH_SIZE=0 -> auto-select by GPU VRAM (<=9.5GB -> 2, <=16.5GB -> 4, >16.5GB -> 8)
MSS_BATCH_SIZE = max(0, int(os.getenv("KYTHRA_MSS_BATCH_SIZE", "0")))
MSS_USE_AMP = os.getenv("KYTHRA_MSS_USE_AMP", "1").strip().lower() not in ("0", "false", "no")

WHISPER_MODEL_SIZE = os.getenv("KYTHRA_WHISPER_MODEL", "large-v3-turbo").strip() or "large-v3-turbo"
WHISPER_BEAM_SIZE = max(1, int(os.getenv("KYTHRA_WHISPER_BEAM_SIZE", "2")))

