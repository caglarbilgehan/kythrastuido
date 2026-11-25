"""Beat & Downbeat Tracking Executor (madmom RNN DownBeat)."""

from typing import Any, Dict, Tuple

from backend.engines.base import PipelineContext
from backend.services.session_repository import SessionRepository
from backend.stages.base import BaseStageExecutor
from backend.stages.registry import get_engine


class BeatTrackingExecutor(BaseStageExecutor):
    def _execute_stage(
        self,
        ctx: PipelineContext,
        repo: SessionRepository,
        state: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], str]:
        engine = get_engine("beat")
        engine.run(ctx)
        result_data = {
            "engine": engine.name,
            "tempo_bpm": round(ctx.tempo_bpm, 1),
            "time_signature": ctx.time_signature,
            "beat_count": len(ctx.beats),
            "downbeat_count": sum(1 for b in ctx.beats if b.is_downbeat),
            "beats": [b.model_dump() for b in ctx.beats],
        }
        repo.save_artifact("beats", result_data)
        summary = (
            f"{result_data['tempo_bpm']} BPM, {result_data['time_signature']} "
            f"({result_data['downbeat_count']} Bars)"
        )
        return result_data, summary
