"""Modular production pipeline stage executors."""

from backend.stages.base import BaseStageExecutor
from backend.stages.registry import get_engine
from backend.stages.beat_tracking import BeatTrackingExecutor
from backend.stages.chord_recognition import ChordRecognitionExecutor
from backend.stages.source_separation import SourceSeparationExecutor
from backend.stages.lyrics_alignment import LyricsAlignmentExecutor

__all__ = [
    "BaseStageExecutor",
    "get_engine",
    "BeatTrackingExecutor",
    "ChordRecognitionExecutor",
    "SourceSeparationExecutor",
    "LyricsAlignmentExecutor",
]
