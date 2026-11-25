"""Unit tests for LyricsHybridEngine anti-hallucination/clamping and WorkbenchService disk cache hits."""

from types import SimpleNamespace
from unittest.mock import patch

import numpy as np
import soundfile as sf

from backend.engines.lyrics_hybrid import LyricsHybridEngine
from backend.services.session_repository import SessionRepository
from backend.services.song_database import SongDatabase
from backend.services.workbench_service import WorkbenchService


def _make_tone(sr: int, duration_sec: float, amp: float = 0.2, freq: float = 220.0) -> np.ndarray:
    t = np.linspace(0.0, duration_sec, int(round(sr * duration_sec)), endpoint=False, dtype=np.float32)
    return (amp * np.sin(2.0 * np.pi * freq * t)).astype(np.float32)


def test_detect_active_vocal_window_trims_silent_intro_outro_and_ignores_bleed_spike():
    sr = 16000
    # 10s silence, a stray 25ms click at 3s, real singing from 10s..15s, 5s silent outro
    mono = np.zeros(sr * 20, dtype=np.float32)
    mono[int(3.0 * sr) : int(3.025 * sr)] = 0.25  # single-frame bleed spike
    mono[int(10.0 * sr) : int(15.0 * sr)] = _make_tone(sr, 5.0, amp=0.18)

    win_start, win_end = LyricsHybridEngine._detect_active_vocal_window(mono, sr)
    start_sec = win_start / sr
    end_sec = win_end / sr

    assert 9.4 <= start_sec <= 10.05
    assert 14.95 <= end_sec <= 15.6


def test_filter_hallucinated_segments_drops_phantoms_but_keeps_genuine_thank_you():
    sr = 16000
    mono = np.zeros(sr * 35, dtype=np.float32)
    # Weak breath/bleed at 0.2..1.0 (intro phantom "Thank you.")
    mono[int(0.2 * sr) : int(1.0 * sr)] = _make_tone(sr, 0.8, amp=0.015)
    # Real singing from 2.8..7.5
    mono[int(2.8 * sr) : int(7.5 * sr)] = _make_tone(sr, 4.7, amp=0.22)
    # 20s silence gap -> weak post-solo phantom at 28.0..29.0
    mono[int(28.0 * sr) : int(29.0 * sr)] = _make_tone(sr, 1.0, amp=0.01)

    def _seg(words_tuples, no_speech_prob=0.05, avg_logprob=-0.2):
        return SimpleNamespace(
            no_speech_prob=no_speech_prob,
            avg_logprob=avg_logprob,
            words=[
                SimpleNamespace(word=w, start=s, end=e, probability=p)
                for (w, s, e, p) in words_tuples
            ],
        )

    segments = [
        # Intro phantom "Thank you."
        _seg([("Thank", 0.2, 0.6, 0.52), ("you.", 0.65, 1.0, 0.55)], no_speech_prob=0.45, avg_logprob=-0.7),
        # Genuine opening line
        _seg([("The", 2.8, 3.0, 0.94), ("world", 3.05, 3.5, 0.96), ("is", 3.55, 3.7, 0.97), ("muddy.", 3.75, 4.2, 0.95)]),
        # Genuine loud mid-verse "Thank you" closely surrounded by lyrics with high confidence
        _seg([("Thank", 4.5, 4.9, 0.96), ("you", 4.95, 5.2, 0.97)], no_speech_prob=0.02, avg_logprob=-0.12),
        # Next genuine line immediately after
        _seg([("for", 5.4, 5.6, 0.95), ("staying.", 5.65, 6.2, 0.94)]),
        # Post-solo / outro phantom "Thank you." after 21s gap
        _seg([("Thank", 28.0, 28.5, 0.60), ("you.", 28.55, 29.0, 0.62)], no_speech_prob=0.35, avg_logprob=-0.55),
    ]

    kept, filtered_count = LyricsHybridEngine._filter_hallucinated_segments(segments, mono, sr)
    kept_tokens = [w["word"] for w in kept]

    assert filtered_count == 2
    assert kept_tokens == ["The", "world", "is", "muddy.", "Thank", "you", "for", "staying."]


def test_clamp_word_durations_trims_stretched_word_to_vocal_decay_and_caps_max():
    sr = 16000
    mono = np.zeros(sr * 20, dtype=np.float32)
    # Singer holds "though." for 0.9s (from 1.0s to 1.9s), then 10s of silence before next word at 12.0s
    mono[int(1.0 * sr) : int(1.9 * sr)] = _make_tone(sr, 0.9, amp=0.2)
    # Next word is held continuously for 4.0s (12.0s to 16.0s) -> should cap at max_word_sec=2.5
    mono[int(12.0 * sr) : int(16.0 * sr)] = _make_tone(sr, 4.0, amp=0.2)

    words = [
        {"word": "though.", "start_sec": 1.0, "end_sec": 11.9},
        {"word": "Pockets", "start_sec": 12.0, "end_sec": 16.0},
    ]

    clamped = LyricsHybridEngine._clamp_word_durations(words, max_word_sec=2.5, mono=mono, sr=sr)
    # First word trimmed tightly near 1.9s + release tail (well under 2.5s)
    assert 1.85 <= clamped[0]["end_sec"] <= 2.15
    # Second word continuously sung -> capped cleanly at start + 2.5s = 14.5s
    assert clamped[1]["end_sec"] == 14.5


def test_prepare_studio_session_uses_disk_cache_for_all_4_stages_across_new_session(tmp_path):
    tracks_dir = tmp_path / "tracks"
    track_key = "sha256:2e3571c53f674f72"

    # Seed persistent track folder (as if a previous session already analyzed this track)
    seed_repo = SessionRepository(session_dir=tmp_path / "sess_old", tracks_dir=tracks_dir)
    seed_state = seed_repo.load_state()
    seed_state["has_session"] = True
    seed_state["track_key"] = track_key
    seed_state["track_name"] = "02_ Forgetting You, You Know - V03.m4a"
    seed_state["duration_sec"] = 2.0
    seed_repo.save_state(seed_state)

    sr = 44100
    stereo = np.column_stack([_make_tone(sr, 1.0, 0.1), _make_tone(sr, 1.0, 0.1)])
    sf.write(str(seed_repo.get_persistent_source_path(track_key)), stereo, sr)
    stems_dir = seed_repo.get_persistent_stems_dir(track_key)
    stems_payload = {"stem_count": 2, "detected_count": 2, "stems": {}}
    for stem_name in ("vocals", "guitar"):
        sf.write(str(stems_dir / f"{stem_name}.wav"), stereo, sr)
        stems_payload["stems"][stem_name] = {"channel": stem_name, "detected": True}

    seed_repo.save_artifact("beats", {"tempo_bpm": 115.4, "time_signature": "4/4", "beats": [{"time_sec": 0.5, "beat_number": 1, "is_downbeat": True, "bar_index": 0}]})
    seed_repo.save_artifact("chords", {"key_signature": "C major", "chords": [{"start_sec": 0.0, "end_sec": 1.0, "chord": "C:maj"}], "bars": [], "sections": []})
    seed_repo.save_artifact("stems", stems_payload)
    seed_repo.save_artifact("lyrics", {
        "detected_language": "english",
        "is_instrumental": False,
        "word_count": 3,
        "line_count": 1,
        "lines": [{"start_sec": 0.2, "end_sec": 0.9, "text": "The world turns", "words": []}],
        "words": [],
    })

    # Open a brand-new session with the exact same uploaded track_key (guest / new tab)
    fresh_repo = SessionRepository(session_dir=tmp_path / "sess_new", tracks_dir=tracks_dir)
    fresh_state = fresh_repo.load_state()
    fresh_state["has_session"] = True
    fresh_state["track_key"] = track_key
    fresh_state["track_name"] = "02_ Forgetting You, You Know - V03.m4a"
    fresh_state["duration_sec"] = 2.0
    fresh_state["waveform_peaks"] = [0.5] * 20
    fresh_repo.save_state(fresh_state)

    service = WorkbenchService(repo=fresh_repo, session_id="sess_new")
    service.song_db = SongDatabase(db_path=tmp_path / "test_cache.db")

    with patch.object(service, "run_stage", side_effect=AssertionError("run_stage must not be called on full disk cache hit")):
        bundle = service.prepare_studio_session(background_stems=True)

    assert bundle["cache_hit"] is True
    for s_num in ("1", "2", "3", "4"):
        assert bundle["state"]["stages"][s_num]["status"] == "completed"
    assert len(bundle["lyrics"]) == 1
    assert bundle["lyrics"][0]["text"] == "The world turns"
    assert bundle["lyrics_source"] == "ai"
