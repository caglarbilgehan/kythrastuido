"""
KythraStudio Production Stage Executor Factory (Factory Pattern)
Provides stage executor instances mapped to Production pipeline stages 1 through 4.
"""

from typing import Dict, Type

from backend.exceptions import InvalidStageError
from backend.stages import (
    BaseStageExecutor,
    BeatTrackingExecutor,
    ChordRecognitionExecutor,
    LyricsAlignmentExecutor,
    SourceSeparationExecutor,
)


class StageExecutorFactory:
    _EXECUTOR_REGISTRY: Dict[int, Type[BaseStageExecutor]] = {
        1: BeatTrackingExecutor,
        2: ChordRecognitionExecutor,
        3: SourceSeparationExecutor,
        4: LyricsAlignmentExecutor,
    }

    _INSTANCES: Dict[int, BaseStageExecutor] = {}

    @classmethod
    def get_executor(cls, stage_num: int) -> BaseStageExecutor:
        if stage_num not in cls._EXECUTOR_REGISTRY:
            raise InvalidStageError(
                f"Invalid stage number: {stage_num}. Production supports stages 1 to 4."
            )

        if stage_num not in cls._INSTANCES:
            cls._INSTANCES[stage_num] = cls._EXECUTOR_REGISTRY[stage_num]()

        return cls._INSTANCES[stage_num]
