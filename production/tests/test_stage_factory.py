"""Tests for Production StageExecutorFactory (3-Stage Factory Pattern Verification)."""

import pytest

from backend.domain.chords import estimate_key_signature
from backend.exceptions import InvalidStageError
from backend.models import ChordEvent
from backend.services.stage_factory import StageExecutorFactory
from backend.stages import (
    BaseStageExecutor,
    BeatTrackingExecutor,
    ChordRecognitionExecutor,
    LyricsAlignmentExecutor,
    SourceSeparationExecutor,
)


def test_stage_factory_returns_correct_executors():
    expected_types = {
        1: BeatTrackingExecutor,
        2: ChordRecognitionExecutor,
        3: SourceSeparationExecutor,
        4: LyricsAlignmentExecutor,
    }

    for stage_num, expected_cls in expected_types.items():
        executor = StageExecutorFactory.get_executor(stage_num)
        assert isinstance(executor, expected_cls)
        assert isinstance(executor, BaseStageExecutor)


def test_stage_factory_invalid_stage():
    for invalid_num in (0, 5, 6, 7, 8, 9, 10):
        with pytest.raises(InvalidStageError):
            StageExecutorFactory.get_executor(invalid_num)


def test_estimate_key_signature_from_chords():
    chords = [
        ChordEvent(start_sec=0.0, end_sec=4.0, chord="F#:min"),
        ChordEvent(start_sec=4.0, end_sec=6.0, chord="B:min"),
        ChordEvent(start_sec=6.0, end_sec=8.0, chord="C#:maj"),
        ChordEvent(start_sec=8.0, end_sec=12.0, chord="F#:min"),
    ]
    key_sig = estimate_key_signature(chords)
    assert key_sig == "F# minor"
