"""
KythraStudio Automatic Lyrics Transcription & Forced Alignment Engine
Combines Benchmark 09's champion architecture:
1. Transcription: `stable-ts` (`faster-whisper` large-v3, VAD + silence suppression + regrouping)
   on isolated BS-RoFormer vocals (`stems/vocals.wav`).
2. Forced Alignment: Chunked Meta `MMS_FA` CTC aligner (`torchaudio.pipelines.MMS_FA`) for
   millisecond-level word timestamps (34.1 ms median timing error) inside bounded GPU memory.
"""

from __future__ import annotations

import logging
from pathlib import Path
import re
import time
from typing import Any, Dict, List, Optional, Tuple
import unicodedata

import numpy as np
import soundfile as sf
import torch

from backend.config import DEVICE
from backend.engines.base import PipelineContext

logger = logging.getLogger("backend.engines.lyrics_hybrid")


def romanize_for_mms_fa(word: str) -> str:
    """
    Converts multilingual Latin-script singing tokens (Turkish, English, Spanish, French, German)
    into the MMS_FA emission vocabulary (`a-z` and `'`), returning `*` if empty.
    """
    s = unicodedata.normalize("NFKC", str(word or "")).lower().strip()
    replacements = {
        "ß": "ss",
        "æ": "ae",
        "œ": "oe",
        "ø": "o",
        "ı": "i",
        "ş": "s",
        "ğ": "g",
        "ç": "c",
        "ñ": "n",
        "’": "'",
        "‘": "'",
        "`": "'",
        "´": "'",
    }
    for src, dst in replacements.items():
        s = s.replace(src, dst)
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = re.sub(r"[^a-z']", "", s).strip("'")
    return s if s else "*"


def words_to_karaoke_lines(
    words: List[Dict[str, Any]],
    max_gap_sec: float = 0.72,
    max_words: int = 9,
    max_chars: int = 46,
    max_dur_sec: float = 5.8,
) -> List[Dict[str, Any]]:
    """
    Groups chronological word-level timestamps into readable karaoke display lines
    preserving word-level bounds for per-word karaoke highlighting.
    """
    if not words:
        return []

    lines: List[Dict[str, Any]] = []
    cur: List[Dict[str, Any]] = []

    def _flush() -> None:
        nonlocal cur
        if not cur:
            return
        text = " ".join(str(w["word"]).strip() for w in cur if str(w.get("word", "")).strip()).strip()
        if text:
            lines.append({
                "start_sec": round(float(cur[0]["start_sec"]), 3),
                "end_sec": round(float(max(cur[0]["start_sec"] + 0.25, cur[-1]["end_sec"])), 3),
                "text": text,
                "words": [
                    {
                        "word": w["word"],
                        "start_sec": round(float(w["start_sec"]), 3),
                        "end_sec": round(float(w["end_sec"]), 3),
                    }
                    for w in cur
                ],
            })
        cur = []

    for w in words:
        txt = str(w.get("word", "")).strip()
        if not txt:
            continue
        w_start = float(w.get("start_sec", w.get("start", 0.0)))
        w_end = float(w.get("end_sec", w.get("end", w_start + 0.1)))

        if cur:
            gap = w_start - float(cur[-1]["end_sec"])
            cur_chars = sum(len(str(x["word"]).strip()) + 1 for x in cur) + len(txt)
            cur_dur = w_end - float(cur[0]["start_sec"])
            prev_ended_sentence = str(cur[-1]["word"]).strip().endswith((".", "!", "?", ";"))
            if (
                gap >= max_gap_sec
                or prev_ended_sentence
                or len(cur) >= max_words
                or cur_chars > max_chars
                or cur_dur > max_dur_sec
            ):
                _flush()

        cur.append({
            "word": txt,
            "start_sec": w_start,
            "end_sec": max(w_start + 0.02, w_end),
        })

    _flush()
    return lines


class LyricsHybridEngine:
    """Singleton lazy-loaded engine running stable-ts ASR + chunked Meta MMS_FA CTC forced alignment."""

    name = "stable-ts (large-v3) + Meta MMS_FA CTC"
    version = "1.0.0"

    def __init__(self, model_size: str = "large-v3"):
        self.model_size = model_size
        self.device_str = "cuda" if DEVICE.startswith("cuda") and torch.cuda.is_available() else "cpu"
        self.torch_device = torch.device(self.device_str)
        self._asr_model: Optional[Any] = None
        self._fa_bundle: Optional[Any] = None
        self._fa_model: Optional[Any] = None
        self._fa_tokenizer: Optional[Any] = None
        self._fa_aligner: Optional[Any] = None
        self._fa_sr: int = 16000
        self._loaded = False

    def load(self) -> None:
        if self._loaded:
            return

        import stable_whisper
        import torchaudio

        compute_type = "int8_float16" if self.device_str == "cuda" else "int8"
        logger.info("Loading stable-ts (%s, %s, %s)...", self.model_size, self.device_str, compute_type)
        self._asr_model = stable_whisper.load_faster_whisper(
            self.model_size,
            device=self.device_str,
            compute_type=compute_type,
        )

        logger.info("Loading Meta MMS_FA CTC Forced Aligner on %s...", self.device_str)
        self._fa_bundle = torchaudio.pipelines.MMS_FA
        self._fa_sr = self._fa_bundle.sample_rate
        self._fa_model = self._fa_bundle.get_model(with_star=True).to(self.torch_device).eval()
        self._fa_tokenizer = self._fa_bundle.get_tokenizer()
        self._fa_aligner = self._fa_bundle.get_aligner()
        self._loaded = True

    def _extract_full_emission(self, waveform_16k: torch.Tensor) -> Tuple[torch.Tensor, float]:
        """Extracts full-song CTC log-emissions in bounded 24s chunks (+3s context padding)."""
        total_samples = waveform_16k.shape[1]
        duration_sec = total_samples / float(self._fa_sr)

        if total_samples <= int(45 * self._fa_sr):
            with torch.inference_mode():
                em, _ = self._fa_model(waveform_16k.to(self.torch_device))
            em_cpu = em[0].float().cpu()
            return em_cpu, duration_sec / max(1, em_cpu.shape[0])

        stride_samples = 24 * self._fa_sr
        ctx_samples = 3 * self._fa_sr
        chunks_em: List[torch.Tensor] = []

        start = 0
        while start < total_samples:
            core_end = min(total_samples, start + stride_samples)
            win_start = max(0, start - ctx_samples)
            win_end = min(total_samples, core_end + ctx_samples)
            seg = waveform_16k[:, win_start:win_end].to(self.torch_device)
            with torch.inference_mode():
                em_seg, _ = self._fa_model(seg)
            em_2d = em_seg[0].float().cpu()

            seg_dur = (win_end - win_start) / float(self._fa_sr)
            fps = em_2d.shape[0] / max(1e-6, seg_dur)
            keep_left = int(round(((start - win_start) / float(self._fa_sr)) * fps))
            keep_right = int(round(((core_end - win_start) / float(self._fa_sr)) * fps))
            keep_left = max(0, min(keep_left, em_2d.shape[0]))
            keep_right = max(keep_left, min(keep_right, em_2d.shape[0]))
            chunks_em.append(em_2d[keep_left:keep_right])
            start = core_end

        full_em = torch.cat(chunks_em, dim=0)
        frame_dur_sec = duration_sec / max(1, full_em.shape[0])
        return full_em, frame_dur_sec

    def _align_with_mms_fa(
        self,
        mono_audio: np.ndarray,
        sr: int,
        raw_words: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        import torchaudio

        wav_t = torch.from_numpy(mono_audio).unsqueeze(0)
        if sr != self._fa_sr:
            wav_t = torchaudio.functional.resample(wav_t, sr, self._fa_sr)

        emission, frame_dur = self._extract_full_emission(wav_t)

        kept_surface: List[str] = []
        norm_tokens_str: List[str] = []
        for w in raw_words:
            surface = str(w.get("word") or "").strip()
            if not surface:
                continue
            kept_surface.append(surface)
            norm_tokens_str.append(romanize_for_mms_fa(surface))

        if not norm_tokens_str:
            return []

        tokenized = self._fa_tokenizer(norm_tokens_str)
        spans_per_word = self._fa_aligner(emission.to(self.torch_device), tokenized)

        aligned: List[Dict[str, Any]] = []
        for surf, spans in zip(kept_surface, spans_per_word):
            if spans:
                s_sec = round(float(spans[0].start * frame_dur), 3)
                e_sec = round(max(s_sec + 0.02, float(spans[-1].end * frame_dur)), 3)
            else:
                prev_end = aligned[-1]["end_sec"] if aligned else 0.0
                s_sec = round(prev_end, 3)
                e_sec = round(prev_end + 0.05, 3)
            aligned.append({"word": surf, "start_sec": s_sec, "end_sec": e_sec})

        return aligned

    @staticmethod
    def _detect_active_vocal_window(
        mono: np.ndarray,
        sr: int,
        frame_sec: float = 0.05,
        pad_sec: float = 0.4,
    ) -> Tuple[int, int]:
        """
        Finds the first/last sample of real vocal energy so long silent intros/outros are never fed
        to Whisper. Purely acoustic (frame RMS vs. adaptive threshold) — never inspects words, so
        genuine lyrics such as "thank you" are always preserved.
        """
        hop = max(1, int(frame_sec * sr))
        n_frames = len(mono) // hop
        if n_frames < 2:
            return 0, len(mono)
        frames = mono[: n_frames * hop].reshape(n_frames, hop)
        frame_db = 20.0 * np.log10(np.sqrt(np.mean(np.square(frames), axis=1)) + 1e-9)
        threshold_db = max(-45.0, float(np.percentile(frame_db, 99)) - 35.0)
        active = np.where(frame_db > threshold_db)[0]
        if active.size == 0:
            return 0, len(mono)
        pad = int(pad_sec * sr)
        start = max(0, int(active[0]) * hop - pad)
        end = min(len(mono), (int(active[-1]) + 1) * hop + pad)
        return start, end

    @staticmethod
    def _clamp_word_durations(
        words: List[Dict[str, Any]],
        max_word_sec: float = 3.0,
    ) -> List[Dict[str, Any]]:
        """Prevents a word before a long instrumental gap from stretching across the whole gap."""
        for idx, w in enumerate(words):
            limit = w["start_sec"] + max_word_sec
            if idx + 1 < len(words):
                limit = min(limit, words[idx + 1]["start_sec"])
            w["end_sec"] = round(max(w["start_sec"] + 0.02, min(w["end_sec"], limit)), 3)
        return words

    def transcribe_and_align(self, vocals_wav: Path) -> Dict[str, Any]:
        """Runs vocal silence gating -> active-window trim -> stable-ts ASR -> MMS_FA CTC alignment."""
        t0 = time.time()

        data, sr = sf.read(str(vocals_wav), dtype="float32", always_2d=True)
        mono = np.mean(data, axis=1)
        rms = float(np.sqrt(np.mean(np.square(mono)))) + 1e-9
        rms_db = 20.0 * np.log10(rms)

        if rms_db < -50.0:
            return {
                "engine": self.name,
                "transcription_engine": f"stable-ts ({self.model_size})",
                "alignment_engine": "skipped_instrumental",
                "detected_language": None,
                "is_instrumental": True,
                "vocal_rms_dbfs": round(float(rms_db), 1),
                "word_count": 0,
                "line_count": 0,
                "inference_sec": round(time.time() - t0, 3),
                "lines": [],
                "words": [],
            }

        self.load()

        # Trim long silent intro/outro so Whisper's first 30s window starts exactly at vocal onset.
        import torchaudio

        win_start, win_end = self._detect_active_vocal_window(mono, sr)
        offset_sec = win_start / float(sr)
        active_mono = np.ascontiguousarray(mono[win_start:win_end])
        active_16k = torchaudio.functional.resample(
            torch.from_numpy(active_mono).unsqueeze(0), sr, 16000
        )[0].numpy()

        asr_res = self._asr_model.transcribe(
            active_16k,
            vad=True,
            regroup=True,
            word_timestamps=True,
            condition_on_previous_text=False,
            beam_size=5,
            suppress_silence=True,
        )

        detected_language = getattr(asr_res, "language", None)
        asr_words: List[Dict[str, Any]] = []
        for seg in asr_res.segments:
            for w in getattr(seg, "words", []) or []:
                tok = (getattr(w, "word", "") or "").strip()
                if not tok:
                    continue
                ws = round(float(w.start), 3)
                we = round(max(ws + 0.02, float(w.end)), 3)
                asr_words.append({"word": tok, "start_sec": ws, "end_sec": we})

        if not asr_words:
            return {
                "engine": self.name,
                "transcription_engine": f"stable-ts ({self.model_size})",
                "alignment_engine": "none_detected",
                "detected_language": detected_language,
                "is_instrumental": True,
                "vocal_rms_dbfs": round(float(rms_db), 1),
                "word_count": 0,
                "line_count": 0,
                "inference_sec": round(time.time() - t0, 3),
                "lines": [],
                "words": [],
            }

        alignment_engine = "torchaudio.MMS_FA_CTC"
        try:
            aligned_words = self._align_with_mms_fa(active_mono, sr, asr_words)
            if not aligned_words:
                aligned_words = asr_words
                alignment_engine = "stable-ts-dtw-fallback"
        except Exception as exc:
            logger.warning("MMS_FA alignment fallback triggered (%s); keeping stable-ts timestamps.", exc)
            aligned_words = asr_words
            alignment_engine = "stable-ts-dtw-fallback"

        # Shift timestamps from trimmed-window time back to absolute song time.
        for w in aligned_words:
            w["start_sec"] = round(w["start_sec"] + offset_sec, 3)
            w["end_sec"] = round(w["end_sec"] + offset_sec, 3)
        aligned_words = self._clamp_word_durations(aligned_words)

        karaoke_lines = words_to_karaoke_lines(aligned_words)
        elapsed = time.time() - t0

        return {
            "engine": self.name,
            "transcription_engine": f"stable-ts ({self.model_size})",
            "alignment_engine": alignment_engine,
            "detected_language": detected_language,
            "is_instrumental": False,
            "vocal_rms_dbfs": round(float(rms_db), 1),
            "active_vocal_window_sec": [round(offset_sec, 2), round(win_end / float(sr), 2)],
            "word_count": len(aligned_words),
            "line_count": len(karaoke_lines),
            "inference_sec": round(elapsed, 3),
            "lines": karaoke_lines,
            "words": aligned_words,
        }

    def run(self, ctx: PipelineContext) -> None:
        vocals_path = ctx.separated_stems.get("vocals") or ctx.audio_path
        ctx.lyrics_result = self.transcribe_and_align(vocals_path)
