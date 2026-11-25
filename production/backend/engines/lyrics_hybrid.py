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

from backend.config import DEVICE, WHISPER_BEAM_SIZE, WHISPER_MODEL_SIZE
from backend.engines.base import PipelineContext

logger = logging.getLogger("backend.engines.lyrics_hybrid")

_KNOWN_HALLUCINATION_PHRASES = frozenset({
    "thank you",
    "thank you very much",
    "thank you so much",
    "thanks",
    "thanks for watching",
    "thank you for watching",
    "thanks for listening",
    "thank you for listening",
    "subscribe",
    "please subscribe",
    "like and subscribe",
    "see you next time",
    "see you in the next video",
    "bye",
    "bye bye",
    "subtitles by",
    "captions by",
    "amara org",
    "music",
    "applause",
    "silence",
    "tesekkurler",
    "tesekkur ederim",
    "izlediginiz icin tesekkurler",
    "dinlediginiz icin tesekkurler",
    "abone olun",
    "abone olmayi unutmayin",
    "altyazi",
})


def _normalize_phrase(text: str) -> str:
    """Normalizes text to lowercase ASCII words for hallucination phrase matching."""
    s = unicodedata.normalize("NFKC", str(text or "")).lower().strip()
    s = s.replace("ı", "i").replace("ş", "s").replace("ğ", "g").replace("ç", "c").replace("ö", "o").replace("ü", "u")
    s = unicodedata.normalize("NFKD", s)
    s = "".join(ch for ch in s if unicodedata.category(ch) != "Mn")
    s = re.sub(r"[^a-z0-9\s]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def _slice_rms_db(mono: np.ndarray, sr: int, start_sec: float, end_sec: float) -> float:
    """Computes RMS energy in dBFS for a time slice of mono audio."""
    if len(mono) == 0 or sr <= 0:
        return -120.0
    i0 = max(0, min(len(mono) - 1, int(round(start_sec * sr))))
    i1 = max(i0 + 1, min(len(mono), int(round(end_sec * sr))))
    seg = mono[i0:i1]
    if seg.size == 0:
        return -120.0
    rms = float(np.sqrt(np.mean(np.square(seg, dtype=np.float32)))) + 1e-9
    return float(20.0 * np.log10(rms))


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

    name = f"stable-ts ({WHISPER_MODEL_SIZE}) + Meta MMS_FA CTC"
    version = "1.1.0"

    def __init__(
        self,
        model_size: str = WHISPER_MODEL_SIZE,
        beam_size: int = WHISPER_BEAM_SIZE,
    ):
        self.model_size = model_size
        self.beam_size = max(1, int(beam_size))
        self.name = f"stable-ts ({self.model_size}) + Meta MMS_FA CTC"
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
        logger.info(
            "Loading stable-ts (%s, beam=%d, %s, %s)...",
            self.model_size,
            self.beam_size,
            self.device_str,
            compute_type,
        )
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
        pad_sec: float = 0.35,
        min_run_frames: int = 3,
    ) -> Tuple[int, int]:
        """
        Finds the first/last sample of sustained real vocal energy so long silent intros/outros
        (and stray single-frame bleed spikes) are never fed to Whisper.
        """
        hop = max(1, int(frame_sec * sr))
        n_frames = len(mono) // hop
        if n_frames < 2:
            return 0, len(mono)
        frames = mono[: n_frames * hop].reshape(n_frames, hop)
        frame_db = 20.0 * np.log10(np.sqrt(np.mean(np.square(frames, dtype=np.float32), axis=1)) + 1e-9)
        threshold_db = max(-45.0, float(np.percentile(frame_db, 99)) - 35.0)
        active_mask = frame_db > threshold_db

        # Require sustained vocal frames (e.g., 150ms) so isolated drum/bleed clicks do not expand the window.
        run = max(1, min(min_run_frames, n_frames))
        sustained = np.where(np.convolve(active_mask.astype(np.int32), np.ones(run, dtype=np.int32), mode="valid") == run)[0]
        if sustained.size > 0:
            first_frame = int(sustained[0])
            last_frame = int(sustained[-1]) + run - 1
        else:
            active = np.where(active_mask)[0]
            if active.size == 0:
                return 0, len(mono)
            first_frame = int(active[0])
            last_frame = int(active[-1])

        pad = int(pad_sec * sr)
        start = max(0, first_frame * hop - pad)
        end = min(len(mono), (last_frame + 1) * hop + pad)
        return start, end

    def _transcribe_with_anti_hallucination(self, active_16k: np.ndarray) -> Any:
        """Calls stable-ts faster-whisper with strict anti-hallucination settings and safe kwarg fallback."""
        base_kwargs: Dict[str, Any] = {
            "vad": True,
            "regroup": True,
            "word_timestamps": True,
            "condition_on_previous_text": False,
            "beam_size": self.beam_size,
            "suppress_silence": True,
            "no_speech_threshold": 0.6,
            "compression_ratio_threshold": 2.4,
            "hallucination_silence_threshold": 1.5,
        }
        try:
            return self._asr_model.transcribe(active_16k, **base_kwargs)
        except TypeError as exc:
            # Older stable-ts / faster-whisper versions may reject hallucination_silence_threshold
            logger.debug("Retrying stable-ts transcribe without optional kwargs (%s)", exc)
            fallback_kwargs = dict(base_kwargs)
            fallback_kwargs.pop("hallucination_silence_threshold", None)
            try:
                return self._asr_model.transcribe(active_16k, **fallback_kwargs)
            except TypeError:
                for key in ("no_speech_threshold", "compression_ratio_threshold"):
                    fallback_kwargs.pop(key, None)
                return self._asr_model.transcribe(active_16k, **fallback_kwargs)

    @staticmethod
    def _filter_hallucinated_segments(
        segments: Any,
        active_mono: np.ndarray,
        sr: int,
    ) -> Tuple[List[Dict[str, Any]], int]:
        """
        Drops Whisper silence/YouTube-outro hallucinations (e.g. 'Thank you.', 'Thanks for watching.')
        using acoustic vocal RMS, segment no_speech_prob/logprob, per-word probability, and silence
        isolation while preserving genuine high-confidence sung lyrics.
        """
        extracted: List[Dict[str, Any]] = []
        for seg in segments or []:
            seg_words: List[Dict[str, Any]] = []
            probs: List[float] = []
            for w in getattr(seg, "words", []) or []:
                tok = (getattr(w, "word", "") or "").strip()
                if not tok:
                    continue
                ws = round(float(getattr(w, "start", 0.0)), 3)
                we = round(max(ws + 0.02, float(getattr(w, "end", ws + 0.05))), 3)
                prob = getattr(w, "probability", None)
                if prob is not None:
                    try:
                        probs.append(float(prob))
                    except (TypeError, ValueError):
                        pass
                seg_words.append({"word": tok, "start_sec": ws, "end_sec": we, "probability": prob})

            if not seg_words:
                continue

            seg_start = seg_words[0]["start_sec"]
            seg_end = seg_words[-1]["end_sec"]
            seg_text = " ".join(w["word"] for w in seg_words)
            no_speech_prob = float(getattr(seg, "no_speech_prob", 0.0) or 0.0)
            avg_logprob_raw = getattr(seg, "avg_logprob", None)
            avg_logprob = float(avg_logprob_raw) if avg_logprob_raw is not None else 0.0
            avg_word_prob = float(np.mean(probs)) if probs else 0.75
            seg_rms_db = _slice_rms_db(active_mono, sr, seg_start, seg_end)

            extracted.append({
                "words": seg_words,
                "start_sec": seg_start,
                "end_sec": seg_end,
                "norm_text": _normalize_phrase(seg_text),
                "no_speech_prob": no_speech_prob,
                "avg_logprob": avg_logprob,
                "avg_word_prob": avg_word_prob,
                "rms_db": seg_rms_db,
            })

        kept_words: List[Dict[str, Any]] = []
        filtered_segments = 0
        total_segs = len(extracted)

        for idx, item in enumerate(extracted):
            prev_gap = (item["start_sec"] - extracted[idx - 1]["end_sec"]) if idx > 0 else 999.0
            next_gap = (extracted[idx + 1]["start_sec"] - item["end_sec"]) if idx + 1 < total_segs else 999.0
            is_isolated = idx == 0 or idx == total_segs - 1 or prev_gap >= 1.5 or next_gap >= 1.5

            # 1. Pure dead-silence hallucination (no vocal energy at all)
            if item["rms_db"] < -46.0:
                filtered_segments += 1
                continue

            # 2. High no-speech probability combined with low word confidence
            if item["no_speech_prob"] >= 0.65 and item["avg_word_prob"] < 0.55:
                filtered_segments += 1
                continue

            # 3. Known Whisper YouTube/subtitle phantom phrases (intro, post-solo, outro)
            if item["norm_text"] in _KNOWN_HALLUCINATION_PHRASES:
                low_conf_any = (
                    item["no_speech_prob"] > 0.40
                    or item["avg_logprob"] < -0.55
                    or item["avg_word_prob"] < 0.72
                    or item["rms_db"] < -36.0
                )
                suspect_when_isolated = is_isolated and (
                    item["avg_word_prob"] < 0.90
                    or item["no_speech_prob"] > 0.25
                    or item["avg_logprob"] < -0.35
                    or item["rms_db"] < -28.0
                )
                if low_conf_any or suspect_when_isolated:
                    filtered_segments += 1
                    continue

            # Also check if regrouping glued a leading/trailing ghost phrase across a >= 1.2s pause
            seg_words = item["words"]
            if len(seg_words) >= 3:
                split_points = [
                    i for i in range(1, len(seg_words))
                    if (seg_words[i]["start_sec"] - seg_words[i - 1]["end_sec"]) >= 1.2
                ]
                if split_points:
                    sub_groups: List[List[Dict[str, Any]]] = []
                    prev_i = 0
                    for sp in split_points:
                        sub_groups.append(seg_words[prev_i:sp])
                        prev_i = sp
                    sub_groups.append(seg_words[prev_i:])

                    rebuilt: List[Dict[str, Any]] = []
                    for g_idx, grp in enumerate(sub_groups):
                        g_norm = _normalize_phrase(" ".join(w["word"] for w in grp))
                        g_rms = _slice_rms_db(active_mono, sr, grp[0]["start_sec"], grp[-1]["end_sec"])
                        g_probs = [float(w["probability"]) for w in grp if w.get("probability") is not None]
                        g_avg_prob = float(np.mean(g_probs)) if g_probs else item["avg_word_prob"]
                        is_edge_grp = g_idx == 0 or g_idx == len(sub_groups) - 1
                        if g_rms < -46.0 or (
                            g_norm in _KNOWN_HALLUCINATION_PHRASES
                            and is_edge_grp
                            and (g_avg_prob < 0.90 or g_rms < -28.0 or item["no_speech_prob"] > 0.25)
                        ):
                            filtered_segments += 1
                            continue
                        rebuilt.extend(grp)
                    seg_words = rebuilt

            for w in seg_words:
                kept_words.append({
                    "word": w["word"],
                    "start_sec": w["start_sec"],
                    "end_sec": w["end_sec"],
                })

        return kept_words, filtered_segments

    @staticmethod
    def _clamp_word_durations(
        words: List[Dict[str, Any]],
        max_word_sec: float = 2.5,
        mono: Optional[np.ndarray] = None,
        sr: Optional[int] = None,
        silence_tail_db: float = -45.0,
    ) -> List[Dict[str, Any]]:
        """
        Prevents a word before a long instrumental gap from stretching across the gap.
        Enforces a strict upper duration cap (default 2.5s) and, when vocal audio is provided,
        trims trailing silence inside stretched words back to actual vocal decay end.
        """
        frame_sec = 0.02
        min_active_sec = 0.12
        silence_run_frames = 6  # 120ms continuous drop below threshold -> word ended
        release_pad_sec = 0.08

        for idx, w in enumerate(words):
            start_sec = float(w["start_sec"])
            limit = start_sec + max_word_sec
            if idx + 1 < len(words):
                limit = min(limit, float(words[idx + 1]["start_sec"]))
            cand_end = max(start_sec + 0.02, min(float(w["end_sec"]), limit))

            # Acoustic silence tail trimming for unusually long words (> 0.75s)
            if mono is not None and sr and sr > 0 and (cand_end - start_sec) > 0.75:
                i0 = max(0, min(len(mono), int(round(start_sec * sr))))
                i1 = max(i0, min(len(mono), int(round(cand_end * sr))))
                hop = max(1, int(round(frame_sec * sr)))
                seg = mono[i0:i1]
                n_frames = len(seg) // hop
                if n_frames > silence_run_frames + 2:
                    frames = seg[: n_frames * hop].reshape(n_frames, hop)
                    frame_db = 20.0 * np.log10(
                        np.sqrt(np.mean(np.square(frames, dtype=np.float32), axis=1)) + 1e-9
                    )
                    peak_db = float(np.max(frame_db))
                    thr_db = max(silence_tail_db, peak_db - 28.0)
                    min_frame = max(1, int(round(min_active_sec / frame_sec)))
                    below = frame_db < thr_db
                    # Locate first sustained silence after initial syllable onset
                    consec = 0
                    trimmed_end = cand_end
                    for f_idx in range(min_frame, n_frames):
                        if below[f_idx]:
                            consec += 1
                            if consec >= silence_run_frames:
                                last_active_frame = f_idx - silence_run_frames + 1
                                trimmed_end = start_sec + (last_active_frame * frame_sec) + release_pad_sec
                                break
                        else:
                            consec = 0
                    cand_end = max(start_sec + 0.12, min(cand_end, trimmed_end))

            w["end_sec"] = round(max(start_sec + 0.02, cand_end), 3)
        return words

    def transcribe_and_align(self, vocals_wav: Path) -> Dict[str, Any]:
        """Runs vocal silence gating -> active-window trim -> stable-ts ASR -> hallucination filter -> MMS_FA CTC alignment."""
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

        # Trim long silent intro/outro so Whisper's first 30s window starts right at sustained vocal onset.
        import torchaudio

        win_start, win_end = self._detect_active_vocal_window(mono, sr)
        offset_sec = win_start / float(sr)
        active_mono = np.ascontiguousarray(mono[win_start:win_end])
        active_16k = torchaudio.functional.resample(
            torch.from_numpy(active_mono).unsqueeze(0), sr, 16000
        )[0].numpy()

        asr_res = self._transcribe_with_anti_hallucination(active_16k)
        detected_language = getattr(asr_res, "language", None)
        asr_words, filtered_hallucinations = self._filter_hallucinated_segments(
            getattr(asr_res, "segments", []),
            active_mono,
            sr,
        )
        if filtered_hallucinations > 0:
            logger.info(
                "Filtered %d hallucinated/silent ASR segment(s) prior to MMS_FA alignment.",
                filtered_hallucinations,
            )

        if not asr_words:
            return {
                "engine": self.name,
                "transcription_engine": f"stable-ts ({self.model_size})",
                "alignment_engine": "none_detected",
                "detected_language": detected_language,
                "is_instrumental": True,
                "vocal_rms_dbfs": round(float(rms_db), 1),
                "active_vocal_window_sec": [round(offset_sec, 2), round(win_end / float(sr), 2)],
                "filtered_hallucinations": filtered_hallucinations,
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
        aligned_words = self._clamp_word_durations(
            aligned_words,
            max_word_sec=2.5,
            mono=mono,
            sr=sr,
        )

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
            "filtered_hallucinations": filtered_hallucinations,
            "word_count": len(aligned_words),
            "line_count": len(karaoke_lines),
            "inference_sec": round(elapsed, 3),
            "lines": karaoke_lines,
            "words": aligned_words,
        }

    def run(self, ctx: PipelineContext) -> None:
        vocals_path = ctx.separated_stems.get("vocals") or ctx.audio_path
        ctx.lyrics_result = self.transcribe_and_align(vocals_path)
