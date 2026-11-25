"""
KythraStudio Audio Ingestion Service (Service Pattern)
Handles local single-track uploads, true 44.1 kHz polyphase resampling, ffmpeg fallback
decoding, and track_key + waveform envelope generation into persistent disk storage (storage/tracks/).
"""

import hashlib
import logging
import math
from pathlib import Path
import subprocess
import tempfile
from typing import Any, Dict, Optional

from fastapi import UploadFile
import numpy as np
from scipy.signal import resample_poly
import soundfile as sf

from backend.config import (
    ALLOWED_EXTENSIONS,
    MAX_UPLOAD_SIZE_BYTES,
    get_ffmpeg_dir,
)
from backend.domain.chords import extract_waveform_peaks
from backend.exceptions import (
    KythraDomainError,
    MediaPayloadTooLargeError,
    UnsupportedMediaFormatError,
)
from backend.services.session_repository import SessionRepository

logger = logging.getLogger("backend.services.ingestion_service")

TARGET_SAMPLE_RATE = 44100


def _resolve_ffmpeg_bin() -> str:
    ffmpeg_dir = get_ffmpeg_dir()
    if ffmpeg_dir:
        candidate = Path(ffmpeg_dir) / "ffmpeg"
        if candidate.exists():
            return str(candidate)
    return "ffmpeg"


def _decode_audio_file(raw_path: Path) -> np.ndarray:
    """
    Decodes an audio file (.wav, .mp3, .flac, .ogg, .m4a) to 44.1 kHz float32 stereo array.
    """
    data: Optional[np.ndarray] = None
    sr: int = TARGET_SAMPLE_RATE

    try:
        data, sr = sf.read(str(raw_path), dtype="float32")
    except Exception:
        ffmpeg_bin = _resolve_ffmpeg_bin()
        with tempfile.TemporaryDirectory() as tmpdir:
            conv_wav = Path(tmpdir) / "decoded.wav"
            cmd = [
                ffmpeg_bin,
                "-y",
                "-i",
                str(raw_path),
                "-ar",
                str(TARGET_SAMPLE_RATE),
                "-ac",
                "2",
                "-c:a",
                "pcm_f32le",
                str(conv_wav),
            ]
            proc = subprocess.run(cmd, capture_output=True, text=True)
            if proc.returncode != 0 or not conv_wav.exists():
                raise RuntimeError(proc.stderr.strip() or "ffmpeg decoding failed")
            data, sr = sf.read(str(conv_wav), dtype="float32")

    if data is None or data.size == 0:
        raise ValueError("Decoded audio file is empty.")

    if data.ndim == 1:
        arr = np.column_stack([data, data])
    elif data.shape[1] == 1:
        arr = np.column_stack([data[:, 0], data[:, 0]])
    else:
        arr = data[:, :2]

    if sr != TARGET_SAMPLE_RATE:
        g = math.gcd(TARGET_SAMPLE_RATE, sr)
        up = TARGET_SAMPLE_RATE // g
        down = sr // g
        arr = resample_poly(arr, up, down, axis=0)

    return np.clip(arr.astype(np.float32, copy=False), -1.0, 1.0)


class IngestionService:
    def __init__(self, session_repo: SessionRepository):
        self.repo = session_repo

    async def ingest_uploaded_file(self, file: UploadFile) -> Dict[str, Any]:
        """Validates, resamples to 44.1 kHz stereo PCM WAV on persistent disk, and computes SHA256 track_key."""
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise UnsupportedMediaFormatError(
                f"Unsupported format: '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
            )

        self.repo.reset()
        session_dir = self.repo.session_dir
        temp_upload = session_dir / f"upload_raw{ext}"

        size_bytes = 0
        hasher = hashlib.sha256()
        with open(temp_upload, "wb") as f_out:
            while chunk := await file.read(1024 * 1024):
                size_bytes += len(chunk)
                if size_bytes > MAX_UPLOAD_SIZE_BYTES:
                    temp_upload.unlink(missing_ok=True)
                    raise MediaPayloadTooLargeError("File size exceeds maximum 100MB limit.")
                hasher.update(chunk)
                f_out.write(chunk)

        track_key = f"sha256:{hasher.hexdigest()[:16]}"
        source_audio = self.repo.get_persistent_source_path(track_key)
        try:
            data = _decode_audio_file(temp_upload)
            sf.write(str(source_audio), data, TARGET_SAMPLE_RATE, subtype="PCM_16")
            temp_upload.unlink(missing_ok=True)
            info = sf.info(str(source_audio))
        except KythraDomainError:
            raise
        except Exception as e:
            logger.error("Audio normalization error: %s", e)
            temp_upload.unlink(missing_ok=True)
            raise KythraDomainError(f"Audio decoding failed: {str(e)}", status_code=400) from e

        waveform_peaks = extract_waveform_peaks(source_audio)
        state = self.repo.load_state()
        state["has_session"] = True
        state["track_name"] = file.filename
        state["track_key"] = track_key
        state["source_type"] = "upload"
        state["is_private"] = True
        state["waveform_peaks"] = waveform_peaks
        state["storage_mode"] = "persistent_disk"
        state["duration_sec"] = round(info.duration, 2)
        state["sample_rate"] = info.samplerate
        state["channels"] = info.channels
        self.repo.save_state(state)

        return {
            "status": "ok",
            "message": f"'{file.filename}' uploaded and normalized successfully.",
            "state": state,
        }
