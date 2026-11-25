"""
KythraStudio Instrument Tunings & Biomechanical Fretboard Domain Helpers
Single source of truth for standard string tunings, naive baseline allocation,
and fretboard biomechanical metrics.
"""

from collections import defaultdict
from typing import Dict, List, Tuple, Any
from backend.models import TabNote

# Standard 6-String Guitar Tuning (1 = high E4(64) .. 6 = low E2(40))
GUITAR_OPEN_STRINGS: List[Tuple[int, int]] = [
    (1, 64),  # High E4
    (2, 59),  # B3
    (3, 55),  # G3
    (4, 50),  # D3
    (5, 45),  # A2
    (6, 40),  # Low E2
]

# Standard 4-String Bass Tuning (1 = high G2(43) .. 4 = low E1(28))
BASS_4_OPEN_STRINGS: List[Tuple[int, int]] = [
    (1, 43),  # G2
    (2, 38),  # D2
    (3, 33),  # A1
    (4, 28),  # E1
]

# Standard 5-String Bass Tuning (1 = high G2(43) .. 5 = low B0(23))
BASS_5_OPEN_STRINGS: List[Tuple[int, int]] = [
    (1, 43),  # G2
    (2, 38),  # D2
    (3, 33),  # A1
    (4, 28),  # E1
    (5, 23),  # Low B0
]

OPEN_STRINGS = GUITAR_OPEN_STRINGS


def naive_string_fret(
    pitch: int,
    open_strings: List[Tuple[int, int]] = GUITAR_OPEN_STRINGS
) -> Tuple[int, int]:
    """Greedy lowest-fret allocation without biomechanics (Stage 7 bypassed)."""
    candidates = [(s, pitch - op) for s, op in open_strings if 0 <= pitch - op <= 24]
    if not candidates:
        lowest_s, lowest_op = open_strings[-1]
        highest_s, highest_op = open_strings[0]
        if pitch < lowest_op:
            return (lowest_s, 0)
        return (highest_s, min(24, max(0, pitch - highest_op)))
    return min(candidates, key=lambda x: x[1])


def generate_naive_tab_notes(
    tab_notes: List[TabNote],
    open_strings: List[Tuple[int, int]] = GUITAR_OPEN_STRINGS
) -> List[TabNote]:
    """Clones tab notes replacing string/fret with naive greedy allocation."""
    naive_notes: List[TabNote] = []
    for tn in tab_notes:
        s, f = naive_string_fret(tn.quantized.pitch, open_strings)
        naive_notes.append(
            TabNote(
                string=s,
                fret=f,
                spelled=tn.spelled,
                quantized=tn.quantized,
                instrument=tn.instrument,
                folded_octave=tn.folded_octave,
            )
        )
    return naive_notes


def compute_fret_metrics(tab_notes: List[TabNote]) -> Dict[str, Any]:
    """Computes average and maximum fret jump across consecutive fretted notes."""
    if len(tab_notes) < 2:
        return {"avg_fret_jump": 0.0, "max_jump": 0}
    jumps = []
    prev_fretted = None
    for tn in tab_notes:
        if tn.fret > 0:
            if prev_fretted is not None:
                jumps.append(abs(tn.fret - prev_fretted))
            prev_fretted = tn.fret
    avg_jump = sum(jumps) / max(1, len(jumps))
    return {
        "avg_fret_jump": round(avg_jump, 2),
        "max_jump": max(jumps) if jumps else 0,
    }


def _avg_chord_span(tab_notes: List[TabNote]) -> float:
    by_slice: Dict[Tuple[int, float], List[int]] = defaultdict(list)
    for tn in tab_notes:
        if tn.fret > 0:
            by_slice[(tn.quantized.bar_index, tn.quantized.beat_position)].append(tn.fret)
    spans = [max(frets) - min(frets) for frets in by_slice.values() if len(frets) >= 2]
    return round(sum(spans) / max(1, len(spans)), 2) if spans else 0.0


def compute_biomechanical_summary(
    tab_notes: List[TabNote],
    open_strings: List[Tuple[int, int]] = GUITAR_OPEN_STRINGS
) -> Dict[str, Any]:
    """Computes full A/B biomechanical summary vs naive greedy baseline."""
    if not tab_notes:
        return {
            "avg_fret_jump_optimized": 0.0,
            "avg_fret_jump_naive": 0.0,
            "hand_movement_reduction_pct": 0.0,
            "avg_chord_span_optimized": 0.0,
            "avg_chord_span_naive": 0.0,
            "playability_score_pct": 100.0,
        }

    naive_notes = generate_naive_tab_notes(tab_notes, open_strings)
    m_opt = compute_fret_metrics(tab_notes)
    m_naive = compute_fret_metrics(naive_notes)
    opt_jump = m_opt["avg_fret_jump"]
    naive_jump = m_naive["avg_fret_jump"]
    reduction = (
        round((1.0 - opt_jump / naive_jump) * 100.0, 1) if naive_jump > 0.01 else 0.0
    )
    opt_span = _avg_chord_span(tab_notes)
    naive_span = _avg_chord_span(naive_notes)
    playability = round(max(40.0, min(99.5, 100.0 - opt_jump * 4.5 - max(0.0, opt_span - 4.0) * 5.0)), 1)

    return {
        "avg_fret_jump_optimized": opt_jump,
        "avg_fret_jump_naive": naive_jump,
        "hand_movement_reduction_pct": reduction,
        "avg_chord_span_optimized": opt_span,
        "avg_chord_span_naive": naive_span,
        "playability_score_pct": playability,
    }
