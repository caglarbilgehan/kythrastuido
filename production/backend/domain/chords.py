"""
KythraStudio Harmonic Chord & Section Alignment Domain Helpers
Pure musicological logic decoupled from HTTP handlers and frontend styling classes.
"""

import logging
import shutil
import threading
from pathlib import Path
from typing import Any, Dict, List

from backend.models import BeatEvent, ChordEvent
from backend.services.gpu_guard import GPU_LOCK, release_cuda_cache

logger = logging.getLogger("backend.domain.chords")

SECTION_LABEL_MAP: Dict[str, str] = {
    "start": "Intro",
    "intro": "Intro",
    "verse": "Verse",
    "chorus": "Chorus",
    "bridge": "Bridge",
    "solo": "Solo",
    "inst": "Solo",
    "outro": "Outro",
    "end": "Outro",
    "silence": "Outro",
}

CANONICAL_SECTION_MAP: Dict[str, str] = {
    "start": "intro",
    "intro": "intro",
    "verse": "verse",
    "chorus": "chorus",
    "bridge": "bridge",
    "solo": "solo",
    "inst": "solo",
    "outro": "outro",
    "end": "outro",
    "silence": "outro",
}


def coalesce_consecutive_sections(
    raw_sections: List[Dict[str, Any]],
    total_bars: int = 0,
) -> List[Dict[str, Any]]:
    """
    Merges consecutive song sections that share the same canonical structural type
    (e.g. Intro 1 + Intro 2 + Intro 3 + Intro 4 -> Intro; Verse 1 + Verse 2 -> Verse A)
    and absorbs < 1.5s micro-segments so sections flow cleanly as:
    Intro -> Verse A -> Chorus -> Verse B -> Chorus -> Solo -> Outro.
    """
    if not raw_sections:
        return []

    normalized: List[Dict[str, Any]] = []
    for seg in raw_sections:
        raw_lbl = str(seg.get("raw_label") or seg.get("name") or "verse").lower().strip()
        # Strip trailing numbers or parentheticals
        for key in CANONICAL_SECTION_MAP:
            if key in raw_lbl:
                canon = CANONICAL_SECTION_MAP[key]
                break
        else:
            canon = "verse"

        s_sec = round(float(seg.get("start_sec", 0.0)), 2)
        e_sec = round(float(seg.get("end_sec", s_sec)), 2)
        s_bar = max(1, int(seg.get("start_bar", 1)))
        e_bar = max(s_bar, int(seg.get("end_bar", s_bar)))

        normalized.append({
            "raw_label": canon,
            "start_bar": s_bar,
            "end_bar": e_bar,
            "start_sec": s_sec,
            "end_sec": e_sec,
        })

    # Pass 1: Absorb micro-segments (< 1.5s) into their adjacent section
    filtered: List[Dict[str, Any]] = []
    for seg in normalized:
        dur = seg["end_sec"] - seg["start_sec"]
        if dur < 1.5 and filtered:
            filtered[-1]["end_sec"] = max(filtered[-1]["end_sec"], seg["end_sec"])
            filtered[-1]["end_bar"] = max(filtered[-1]["end_bar"], seg["end_bar"])
        else:
            filtered.append(dict(seg))

    if not filtered:
        filtered = [dict(normalized[0])]
        filtered[0]["end_sec"] = normalized[-1]["end_sec"]
        filtered[0]["end_bar"] = normalized[-1]["end_bar"]

    # If the very first segment was a < 1.5s micro-segment, merge it forward into the second
    if len(filtered) > 1 and (filtered[0]["end_sec"] - filtered[0]["start_sec"]) < 1.5:
        filtered[1]["start_sec"] = filtered[0]["start_sec"]
        filtered[1]["start_bar"] = min(filtered[0]["start_bar"], filtered[1]["start_bar"])
        filtered.pop(0)

    # Pass 2: Coalesce consecutive identical canonical labels
    merged: List[Dict[str, Any]] = []
    for seg in filtered:
        if merged and merged[-1]["raw_label"] == seg["raw_label"]:
            merged[-1]["end_sec"] = max(merged[-1]["end_sec"], seg["end_sec"])
            merged[-1]["end_bar"] = max(merged[-1]["end_bar"], seg["end_bar"])
        else:
            merged.append(dict(seg))

    # Ensure contiguous bar boundaries without overlaps (section[i].end_bar == section[i+1].start_bar - 1)
    for i in range(len(merged) - 1):
        next_start = merged[i + 1]["start_bar"]
        if next_start > merged[i]["start_bar"]:
            merged[i]["end_bar"] = next_start - 1
        else:
            merged[i + 1]["start_bar"] = merged[i]["end_bar"] + 1
            merged[i + 1]["end_bar"] = max(merged[i + 1]["start_bar"], merged[i + 1]["end_bar"])

    if total_bars > 0 and merged:
        merged[-1]["end_bar"] = max(merged[-1]["end_bar"], total_bars)

    # Pass 3: Assign clean musician-friendly names (Intro, Verse A, Chorus, Verse B, Solo, Outro)
    total_by_type: Dict[str, int] = {}
    for seg in merged:
        c = seg["raw_label"]
        total_by_type[c] = total_by_type.get(c, 0) + 1

    seen_by_type: Dict[str, int] = {}
    verse_letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    for seg in merged:
        c = seg["raw_label"]
        idx = seen_by_type.get(c, 0)
        seen_by_type[c] = idx + 1
        base = SECTION_LABEL_MAP.get(c, c.capitalize())

        if c == "verse":
            if total_by_type[c] > 1:
                letter = verse_letters[idx] if idx < len(verse_letters) else str(idx + 1)
                seg["name"] = f"Verse {letter}"
            else:
                seg["name"] = "Verse"
        elif total_by_type[c] > 1 and c not in ("intro", "outro"):
            seg["name"] = f"{base} {idx + 1}"
        else:
            seg["name"] = base

    return merged


def extract_waveform_peaks(audio_path: Path, num_bins: int = 120) -> List[float]:
    """
    Computes a normalized acoustic waveform envelope (0.08..1.0) in <15ms
    for the interactive footer Waveform Scrubber.
    """
    try:
        import numpy as np
        import soundfile as sf

        if not audio_path.exists():
            return [0.35] * num_bins
        data, _ = sf.read(str(audio_path), dtype="float32", always_2d=True)
        mono = np.mean(np.abs(data), axis=1)
        if len(mono) < num_bins:
            return [0.35] * num_bins
        edges = np.linspace(0, len(mono), num_bins + 1, dtype=int)
        peaks = np.array([
            float(np.mean(mono[edges[i]:edges[i + 1]]))
            for i in range(num_bins)
        ], dtype=np.float32)
        max_p = float(np.max(peaks))
        if max_p > 1e-6:
            peaks = peaks / max_p
        peaks = np.clip(0.12 + 0.88 * np.power(peaks, 0.75), 0.12, 1.0)
        return [round(float(x), 3) for x in peaks]
    except Exception as e:
        logger.warning("Waveform peak extraction fallback: %s", e)
        return [0.35] * num_bins


def format_chord_symbol(raw_chord: str) -> str:
    """Format Harte notation chord symbols to standard readable musician format."""
    if not raw_chord or raw_chord == "N":
        return "N.C."
    c = raw_chord
    c = c.replace(":min", "m")
    c = c.replace(":maj", "")
    c = c.replace(":sus4", "sus4")
    c = c.replace(":sus2", "sus2")
    c = c.replace(":dim", "dim")
    c = c.replace(":aug", "aug")
    c = c.replace(":", "")
    return c


_NOTE_TO_PC: Dict[str, int] = {
    "C": 0, "B#": 0,
    "C#": 1, "Db": 1,
    "D": 2,
    "D#": 3, "Eb": 3,
    "E": 4, "Fb": 4,
    "F": 5, "E#": 5,
    "F#": 6, "Gb": 6,
    "G": 7,
    "G#": 8, "Ab": 8,
    "A": 9,
    "A#": 10, "Bb": 10,
    "B": 11, "Cb": 11,
}

_PC_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
_PC_NAMES_FLAT = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"]

# Krumhansl-Schmuckler key profiles
_KS_MAJOR = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]
_KS_MINOR = [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17]


def estimate_key_signature(chords: List[ChordEvent]) -> str:
    """
    Estimates global musical key signature (e.g. 'F# minor', 'B minor', 'C major')
    from recognized chord sequence using duration-weighted pitch-class profiles
    and Krumhansl-Schmuckler correlation.
    """
    if not chords:
        return "C major"

    pc_hist = [0.0] * 12
    minor_root_weight = [0.0] * 12
    major_root_weight = [0.0] * 12
    flat_votes = 0
    sharp_votes = 0

    for ev in chords:
        raw = (ev.chord or "").strip()
        if not raw or raw in ("N", "N.C.", "—"):
            continue
        dur = max(0.05, float(ev.end_sec - ev.start_sec))
        clean = format_chord_symbol(raw)
        if clean == "N.C.":
            continue

        # Extract root note (1 or 2 chars)
        if len(clean) >= 2 and clean[1] in ("#", "b"):
            root_str = clean[:2]
            rest = clean[2:]
            if clean[1] == "b":
                flat_votes += 1
            else:
                sharp_votes += 1
        else:
            root_str = clean[:1]
            rest = clean[1:]

        root_pc = _NOTE_TO_PC.get(root_str)
        if root_pc is None:
            continue

        is_minor = rest.startswith("m") and not rest.startswith("maj")
        is_dim = rest.startswith("dim")

        if is_dim:
            third_pc = (root_pc + 3) % 12
            fifth_pc = (root_pc + 6) % 12
        elif is_minor:
            third_pc = (root_pc + 3) % 12
            fifth_pc = (root_pc + 7) % 12
            minor_root_weight[root_pc] += dur
        else:
            third_pc = (root_pc + 4) % 12
            fifth_pc = (root_pc + 7) % 12
            major_root_weight[root_pc] += dur

        pc_hist[root_pc] += dur * 1.6
        pc_hist[third_pc] += dur * 1.1
        pc_hist[fifth_pc] += dur * 0.9

    if sum(pc_hist) <= 0:
        return "C major"

    best_score = -1e9
    best_pc = 0
    best_mode = "major"

    for tonic in range(12):
        maj_corr = sum(pc_hist[(tonic + i) % 12] * _KS_MAJOR[i] for i in range(12))
        maj_corr += major_root_weight[tonic] * 4.5

        min_corr = sum(pc_hist[(tonic + i) % 12] * _KS_MINOR[i] for i in range(12))
        min_corr += minor_root_weight[tonic] * 4.5

        if maj_corr > best_score:
            best_score = maj_corr
            best_pc = tonic
            best_mode = "major"
        if min_corr > best_score:
            best_score = min_corr
            best_pc = tonic
            best_mode = "minor"

    use_flats = flat_votes > sharp_votes or (
        flat_votes == sharp_votes and best_pc in (1, 3, 5, 8, 10) and best_mode == "major"
    )
    tonic_name = _PC_NAMES_FLAT[best_pc] if use_flats else _PC_NAMES_SHARP[best_pc]
    return f"{tonic_name} {best_mode}"


def align_chords_to_bars(
    beats: List[BeatEvent],
    chords: List[ChordEvent],
    duration: float
) -> List[Dict[str, Any]]:
    """
    Groups beats into bars and performs beat-synchronous majority voting
    to assign the dominant and secondary harmonic chord events to each measure.
    """
    if not beats:
        bar_len = 2.0
        n_bars = max(1, int(duration // bar_len))
        raw_bars = [(i + 1, i * bar_len, min(duration, (i + 1) * bar_len)) for i in range(n_bars)]
    else:
        raw_bars = []
        current_bar_beats = []
        bar_num = 1

        for b in beats:
            is_down = b.is_downbeat or b.beat_number == 1
            if is_down and current_bar_beats:
                start_sec = current_bar_beats[0].time_sec
                end_sec = b.time_sec
                raw_bars.append((bar_num, start_sec, end_sec))
                bar_num += 1
                current_bar_beats = [b]
            else:
                current_bar_beats.append(b)

        if current_bar_beats:
            start_sec = current_bar_beats[0].time_sec
            avg_dur = (raw_bars[-1][2] - raw_bars[-1][1]) if raw_bars else 2.0
            end_sec = min(duration, start_sec + avg_dur)
            raw_bars.append((bar_num, start_sec, end_sec))

    aligned_bars: List[Dict[str, Any]] = []

    for b_num, b_start, b_end in raw_bars:
        b_dur = max(0.01, b_end - b_start)
        overlaps: Dict[str, float] = {}
        bar_chord_events: List[Dict[str, Any]] = []

        for c in chords:
            o_start = max(b_start, c.start_sec)
            o_end = min(b_end, c.end_sec)
            if o_end > o_start:
                dur_ov = o_end - o_start
                overlaps[c.chord] = overlaps.get(c.chord, 0.0) + dur_ov
                bar_chord_events.append({
                    "chord": format_chord_symbol(c.chord),
                    "chord_raw": c.chord,
                    "start_sec": round(o_start, 2),
                    "end_sec": round(o_end, 2),
                    "duration_sec": round(dur_ov, 2),
                })

        if overlaps:
            best_raw = max(overlaps.items(), key=lambda x: x[1])[0]
            best_formatted = format_chord_symbol(best_raw)
        else:
            best_raw = "N"
            best_formatted = "N.C."

        aligned_bars.append({
            "bar_number": b_num,
            "start_sec": round(b_start, 2),
            "end_sec": round(b_end, 2),
            "duration_sec": round(b_dur, 2),
            "chord": best_formatted,
            "chord_raw": best_raw,
            "chords": bar_chord_events,
        })

    return aligned_bars


def build_provisional_sections(
    bars: List[Dict[str, Any]],
    duration: float,
) -> List[Dict[str, Any]]:
    """
    Fast <1ms structural skeleton built immediately from bar boundaries while Stage 3
    (BS-RoFormer) runs in background. Replaced by real allin1 MSA sections once stems finish.
    """
    total_bars = len(bars)
    dur = max(1.0, float(duration or (bars[-1]["end_sec"] if bars else 180.0)))
    if total_bars >= 16:
        b1 = max(2, min(total_bars - 6, int(round(total_bars * 0.12))))
        b2 = max(b1 + 2, min(total_bars - 4, int(round(total_bars * 0.45))))
        b3 = max(b2 + 2, min(total_bars - 2, int(round(total_bars * 0.80))))
        ranges = [
            ("Intro", "intro", 1, b1),
            ("Verse A", "verse", b1 + 1, b2),
            ("Chorus", "chorus", b2 + 1, b3),
            ("Outro", "outro", b3 + 1, total_bars),
        ]
        sections: List[Dict[str, Any]] = []
        for name, raw_lbl, sb, eb in ranges:
            s_sec = float(bars[sb - 1].get("start_sec", 0.0))
            e_sec = float(bars[eb - 1].get("end_sec", dur))
            sections.append({
                "name": name,
                "raw_label": raw_lbl,
                "start_bar": sb,
                "end_bar": eb,
                "start_sec": round(s_sec, 2),
                "end_sec": round(e_sec, 2),
            })
        return sections

    end_bar = max(1, total_bars)
    return [
        {"name": "Intro", "raw_label": "intro", "start_bar": 1, "end_bar": max(1, end_bar // 4), "start_sec": 0.0, "end_sec": round(dur * 0.15, 2)},
        {"name": "Verse A", "raw_label": "verse", "start_bar": max(1, end_bar // 4 + 1), "end_bar": max(1, end_bar // 2), "start_sec": round(dur * 0.15, 2), "end_sec": round(dur * 0.50, 2)},
        {"name": "Chorus", "raw_label": "chorus", "start_bar": max(1, end_bar // 2 + 1), "end_bar": max(1, int(end_bar * 0.8)), "start_sec": round(dur * 0.50, 2), "end_sec": round(dur * 0.82, 2)},
        {"name": "Outro", "raw_label": "outro", "start_bar": max(1, int(end_bar * 0.8) + 1), "end_bar": end_bar, "start_sec": round(dur * 0.82, 2), "end_sec": round(dur, 2)},
    ]


def extract_dynamic_sections(
    audio_path: Path,
    beats: List[BeatEvent],
    duration: float,
    separated_stems: Dict[str, Path] | None = None,
) -> List[Dict[str, Any]]:
    """
    Extracts structural sections (Intro, Verse, Chorus, Solo, Outro) using allin1 MSA.
    Optimization: If 6-stem BS-RoFormer outputs exist on disk, passes them
    directly via `stems_input` to completely bypass redundant htdemucs source separation (~90s saved).
    """
    sections: List[Dict[str, Any]] = []
    tmp_dir: str | None = None
    try:
        import tempfile
        import allin1_infer
        import numpy as np
        import soundfile as sf
        import torch
        from backend.config import DEVICE

        device = "cuda" if "cuda" in DEVICE and torch.cuda.is_available() else "cpu"
        tmp_dir = tempfile.mkdtemp()
        use_mp = threading.current_thread() is threading.main_thread()

        # Check if pre-separated stems from Stage 3 exist on disk
        stems_dir = audio_path.parent / "stems"
        stems_map = separated_stems or {}
        bass_p = stems_map.get("bass") or (stems_dir / "bass.wav")
        drums_p = stems_map.get("drums") or (stems_dir / "drums.wav")
        vocals_p = stems_map.get("vocals") or (stems_dir / "vocals.wav")
        other_p = stems_map.get("other") or (stems_dir / "other.wav")
        guitar_p = stems_map.get("guitar") or (stems_dir / "guitar.wav")
        piano_p = stems_map.get("piano") or (stems_dir / "piano.wav")

        has_preseparated = all(p.exists() for p in (bass_p, drums_p, vocals_p, other_p))

        if has_preseparated:
            # Synthesize composite 'other' (guitar + piano + other) so allin1 gets full harmonic energy without running Demucs
            composite_other = Path(tmp_dir) / "other_composite.wav"
            try:
                o_data, sr = sf.read(str(other_p), dtype="float32")
                if guitar_p.exists():
                    g_data, _ = sf.read(str(guitar_p), dtype="float32")
                    min_len = min(len(o_data), len(g_data))
                    o_data[:min_len] += g_data[:min_len]
                if piano_p.exists():
                    p_data, _ = sf.read(str(piano_p), dtype="float32")
                    min_len = min(len(o_data), len(p_data))
                    o_data[:min_len] += p_data[:min_len]
                sf.write(str(composite_other), o_data, sr)
            except Exception:
                composite_other = other_p

            logger.info("Executing allin1 MSA using pre-separated Stage 3 stems (Skipping Demucs!)")
            with GPU_LOCK:
                res = allin1_infer.analyze(
                    stems_input=[{
                        "bass": str(bass_p),
                        "drums": str(drums_p),
                        "vocals": str(vocals_p),
                        "other": str(composite_other),
                        "name": audio_path.stem or "session",
                    }],
                    demix_dir=tmp_dir,
                    spec_dir=tmp_dir,
                    keep_byproducts=False,
                    multiprocess=use_mp,
                    device=device,
                )
            if isinstance(res, list):
                res = res[0]
        else:
            logger.info("Executing allin1 Transformer MSA on %s (device=%s, fp16=True)", audio_path, device)
            with GPU_LOCK:
                res = allin1_infer.analyze(
                    paths=audio_path,
                    demix_dir=tmp_dir,
                    spec_dir=tmp_dir,
                    keep_byproducts=False,
                    multiprocess=use_mp,
                    device=device,
                    demucs_fp16=(device == "cuda"),
                )

        counts: Dict[str, int] = {}
        for seg in res.segments:
            raw = seg.label.lower().strip()
            display_base = SECTION_LABEL_MAP.get(raw, raw.capitalize())
            counts[display_base] = counts.get(display_base, 0) + 1

            start_bar = 1
            end_bar = 1
            if beats:
                for b in beats:
                    if b.time_sec <= seg.start:
                        start_bar = max(1, b.bar_index + 1)
                    if b.time_sec <= seg.end:
                        end_bar = max(start_bar, b.bar_index + 1)
            else:
                start_bar = max(1, int(seg.start / 2.0) + 1)
                end_bar = max(start_bar, int(seg.end / 2.0) + 1)

            name = (
                f"{display_base} {counts[display_base]}"
                if counts[display_base] > 1 or raw in ("verse", "chorus", "solo")
                else display_base
            )
            sections.append({
                "name": name,
                "raw_label": raw,
                "start_bar": start_bar,
                "end_bar": end_bar,
                "start_sec": round(float(seg.start), 2),
                "end_sec": round(float(seg.end), 2),
            })

        if sections:
            coalesced = coalesce_consecutive_sections(sections)
            logger.info(
                "allin1 identified %d raw segments -> coalesced into %d structural sections",
                len(sections),
                len(coalesced),
            )
            return coalesced
    except Exception as e:
        logger.warning("allin1 MSA analysis error (%s). Using fallback segmentation.", e)
    finally:
        if tmp_dir:
            shutil.rmtree(tmp_dir, ignore_errors=True)
        release_cuda_cache()

    return [
        {"name": "Intro", "raw_label": "intro", "start_bar": 1, "end_bar": 4, "start_sec": 0.0, "end_sec": round(duration * 0.15, 1)},
        {"name": "Verse A", "raw_label": "verse", "start_bar": 5, "end_bar": 16, "start_sec": round(duration * 0.15, 1), "end_sec": round(duration * 0.50, 1)},
        {"name": "Chorus", "raw_label": "chorus", "start_bar": 17, "end_bar": 28, "start_sec": round(duration * 0.50, 1), "end_sec": round(duration * 0.80, 1)},
        {"name": "Outro", "raw_label": "outro", "start_bar": 29, "end_bar": 36, "start_sec": round(duration * 0.80, 1), "end_sec": round(duration, 1)},
    ]
