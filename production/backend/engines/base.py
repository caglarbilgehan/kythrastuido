"""
Kythra Production Engine Interfaces (4-Stage DAG Context)
"""

from typing import Protocol, Dict, Any, Optional
from pathlib import Path
from dataclasses import dataclass, field

from backend.models import BeatEvent, ChordEvent


@dataclass
class PipelineContext:
    """Shared thread-safe state passed across Parallel DAG pipeline engines."""
    audio_path: Path
    sample_rate: int = 44100

    # Intermediate outputs (Beats, Chords, Stems, Lyrics)
    separated_stems: Dict[str, Path] = field(default_factory=dict)
    stem_telemetry: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    active_guitar_path: Optional[Path] = None
    beats: list[BeatEvent] = field(default_factory=list)
    chords: list[ChordEvent] = field(default_factory=list)
    lyrics_result: Optional[Dict[str, Any]] = None

    # Musical metadata
    tempo_bpm: float = 120.0
    time_signature: str = "4/4"
    key_signature: str = "C major"

    # Execution diagnostics
    timings_ms: Dict[str, float] = field(default_factory=dict)
    warnings: list[str] = field(default_factory=list)
    progress_callback: Optional[Any] = None


class Engine(Protocol):
    """Common interface for all production analysis stages."""
    name: str
    version: str

    def load(self) -> None:
        """Load weights and initialize GPU/CPU state."""
        ...

    def run(self, ctx: PipelineContext) -> None:
        """Process context and populate stage outputs."""
        ...
