"""Lyrics Transcription & Forced Alignment Executor (stable-ts + Meta MMS_FA CTC)."""

import logging
from typing import Any, Dict, Tuple

from backend.engines.base import PipelineContext
from backend.exceptions import StageExecutionError
from backend.services.session_repository import SessionRepository
from backend.stages.base import BaseStageExecutor
from backend.stages.registry import get_engine

logger = logging.getLogger("backend.stages.lyrics_alignment")


class LyricsAlignmentExecutor(BaseStageExecutor):
    def _execute_stage(
        self,
        ctx: PipelineContext,
        repo: SessionRepository,
        state: Dict[str, Any],
    ) -> Tuple[Dict[str, Any], str]:
        vocals_path = ctx.separated_stems.get("vocals") or (repo.get_stems_dir() / "vocals.wav")
        if not vocals_path.exists():
            raise StageExecutionError(
                "İzole vokal kanalı (stems/vocals.wav) bulunamadı. Önce Makro Kanal Ayırma aşamasını çalıştırın."
            )

        engine = get_engine("lyrics")
        result_data = engine.transcribe_and_align(vocals_path)
        ctx.lyrics_result = result_data
        repo.save_artifact("lyrics", result_data)

        if result_data.get("is_instrumental") or result_data.get("line_count", 0) == 0:
            summary = "Enstrümantal Parça · Vokal Söz Tespit Edilmedi"
        else:
            lang = (result_data.get("detected_language") or "auto").upper()
            summary = (
                f"{result_data['line_count']} Satır · {result_data['word_count']} Kelime · "
                f"Dil: {lang} (MMS_FA CTC)"
            )

        return result_data, summary
