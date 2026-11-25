"""
Kythra Data Models
Formal data contracts between transcription pipeline stages.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class RawNote(BaseModel):
    """Raw note event output from AMT (YourMT3+ / Basic Pitch)."""
    start_sec: float
    end_sec: float
    pitch: int  # MIDI pitch number (21-108)
    velocity: int = 80
    instrument: str = "guitar"
    confidence: float = 1.0


class BeatEvent(BaseModel):
    """Beat and measure tracking event (madmom)."""
    time_sec: float
    beat_number: int  # 1-indexed within the bar (e.g. 1, 2, 3, 4)
    is_downbeat: bool = False
    bar_index: int = 0


class ChordEvent(BaseModel):
    """Recognized chord symbol segment (BTC-Transformer)."""
    start_sec: float
    end_sec: float
    chord: str  # e.g. "C:maj", "A:min7", "G:7", "N"


class QNote(BaseModel):
    """Quantized note event (Bridge 1: Rhythmic Quantization)."""
    bar_index: int
    beat_position: float  # e.g. 1.0, 1.5, 2.0 (quarter note based)
    duration_beats: float  # e.g. 1.0 (quarter), 0.5 (eighth), 0.333 (triplet)
    pitch: int
    is_tied: bool = False
    tuplet_type: Optional[str] = None  # None, "triplet"
    raw_start_sec: float
    raw_end_sec: float


class SpelledPitch(BaseModel):
    """Enharmonically spelled pitch (Bridge 2: Pitch Spelling)."""
    step: str  # 'C', 'D', 'E', 'F', 'G', 'A', 'B'
    alter: int  # -2 (bb), -1 (b), 0 (natural), 1 (#), 2 (##)
    octave: int  # e.g. 4 for middle C
    name: str  # e.g. "C#", "Db", "F"


class TabNote(BaseModel):
    """Guitar or Bass tablature fingering assignment (Bridge 3: gtrsnipe Viterbi)."""
    string: int  # 1 to 6 (1 = high E) for guitar, 1 to 4/5 (1 = high G) for bass
    fret: int  # 0 to 24
    spelled: SpelledPitch
    quantized: QNote
    instrument: str = "guitar"  # 'guitar', 'bass'
    folded_octave: bool = False  # True if transposed +12 st to fit on 4-string bass


class StemMetadata(BaseModel):
    """Separated source stem metadata."""
    stem_name: str  # 'guitar', 'bass', 'drums', 'vocals', 'other'
    audio_path: str
    sdr_db: Optional[float] = None
    sir_db: Optional[float] = None
    quality_badge: str = "silver"  # 'gold', 'silver', 'bronze'


class KythraScore(BaseModel):
    """Complete serialized piece delivered to AlphaTab and Player UI."""
    title: str
    artist: str = "Unknown"
    tempo_bpm: float
    time_signature: str = "4/4"
    key_signature: str = "C major"
    duration_sec: float
    tuning: List[str] = ["E4", "B3", "G3", "D3", "A2", "E2"]
    notes: List[TabNote] = []
    chords: List[ChordEvent] = []
    alphatex: str
    stems: Dict[str, StemMetadata] = {}
    timings_ms: Dict[str, float] = {}
    metrics: Optional[Dict[str, Any]] = None  # Benchmark / Ground-Truth evaluation metrics
