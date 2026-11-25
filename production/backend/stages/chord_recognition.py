"""Chord Recognition & Structural Segmentation Executor (BTC-Transformer & allin1 MSA)."""

import logging
from typing import Any, Dict, Tuple

from backend.domain.chords import (
    align_chords_to_bars,
    estimate_key_signature,
    extract_dynamic_sections,
)
from backend.engines.base import PipelineContext
from backend.models import ChordEvent
from backend.services.session_repository import SessionRepository
from backend.stages.base import BaseStageExecutor
from backend.stages.registry import get_engine

logger = logging.getLogger("backend.stages.chord_recognition")


def _chroma_template_fallback(ctx: PipelineContext, duration_hint: float) -> None:
    try:
        import librosa
        import numpy as np

        y, sr = librosa.load(str(ctx.audio_path), sr=22050, mono=True)
        chroma = librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=2048)
        chord_names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
        frames_per_sec = sr / 2048
        win_frames = max(1, int(2.0 * frames_per_sec))
        n_windows = chroma.shape[1] // win_frames
        major_template = np.array([1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0])
        dur = duration_hint or float(len(y) / sr)

        for w in range(n_windows):
            sub_c = np.mean(chroma[:, w * win_frames : (w + 1) * win_frames], axis=1)
            scores = [np.dot(sub_c, np.roll(major_template, i)) for i in range(12)]
            best_i = int(np.argmax(scores))
            t_start = round(w * 2.0, 2)
            t_end = round(min(dur, (w + 1) * 2.0), 2)
            ctx.chords.append(
                ChordEvent(start_sec=t_start, end_sec=t_end, chord=chord_names[best_i])
            )
    except Exception as e:
        logger.warning("Chroma fallback error: %s", e)


class ChordRecognitionExecutor(BaseStageExecutor):
    def _execute_stage(
        self,
        ctx: PipelineContext,
        repo: SessionRepository,
        state: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], str]:
        engine = get_engine("chord")
        engine.run(ctx)

        duration = state.get("duration_sec", 30.0)
        if len(ctx.chords) == 0:
            _chroma_template_fallback(ctx, duration)

        sections = extract_dynamic_sections(
            ctx.audio_path, ctx.beats, duration, separated_stems=ctx.separated_stems
        )
        bars = align_chords_to_bars(ctx.beats, ctx.chords, duration)
        key_signature = estimate_key_signature(ctx.chords)
        ctx.key_signature = key_signature

        unique_prog = []
        for b in bars:
            lbl = b["chord"]
            if lbl != "N.C." and (not unique_prog or unique_prog[-1] != lbl):
                unique_prog.append(lbl)
        primary_progression = " → ".join(unique_prog[:8]) if unique_prog else "N/A"

        result_data = {
            "engine": f"{engine.name} & allin1 MSA",
            "key_signature": key_signature,
            "chord_count": len(ctx.chords),
            "bar_count": len(bars),
            "primary_progression": primary_progression,
            "sections": sections,
            "bars": bars,
            "chords": [c.model_dump() for c in ctx.chords],
        }
        repo.save_artifact("chords", result_data)
        summary = f"Ton: {key_signature} · {len(ctx.chords)} Akor · {len(bars)} Ölçü · {len(sections)} Bölüm"
        return result_data, summary
