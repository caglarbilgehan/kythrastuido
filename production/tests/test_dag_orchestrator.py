"""Tests for Production Parallel DAG Orchestrator & Vectorized Engines."""

from unittest.mock import MagicMock, patch
import numpy as np

from backend.models import BeatEvent, ChordEvent
from backend.services.dag_orchestrator import DAGPipelineOrchestrator
from backend.services.session_repository import SessionRepository


def test_parallel_dag_orchestrator_executes_and_joins_stages(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "dag_sess")
    # Create a dummy stereo 44.1kHz WAV file
    import soundfile as sf
    sr = 44100
    t = np.linspace(0, 2.0, sr * 2, dtype=np.float32)
    stereo = np.column_stack([0.2 * np.sin(2 * np.pi * 440 * t), 0.2 * np.sin(2 * np.pi * 440 * t)])
    sf.write(str(repo.get_source_audio_path()), stereo, sr)

    state = repo.load_state()
    state["has_session"] = True
    state["track_name"] = "dag_test_track.wav"
    state["duration_sec"] = 2.0
    repo.save_state(state)

    def _fake_exec1(ctx, r, st):
        ctx.tempo_bpm = 120.0
        ctx.time_signature = "4/4"
        ctx.beats = [
            BeatEvent(time_sec=0.0, beat_number=1, is_downbeat=True, bar_index=0),
            BeatEvent(time_sec=0.5, beat_number=2, is_downbeat=False, bar_index=0),
            BeatEvent(time_sec=1.0, beat_number=1, is_downbeat=True, bar_index=1),
            BeatEvent(time_sec=1.5, beat_number=2, is_downbeat=False, bar_index=1),
        ]
        d1 = {"tempo_bpm": 120.0, "time_signature": "4/4", "beats": [b.model_dump() for b in ctx.beats]}
        r.save_artifact("beats", d1)
        return d1, "120.0 BPM, 4/4 (2 Bars)"

    def _fake_exec3(ctx, r, st):
        stems_dir = r.get_stems_dir()
        for s_name in ("guitar", "bass", "drums", "vocals", "piano", "other"):
            p = stems_dir / f"{s_name}.wav"
            sf.write(str(p), stereo, sr)
            ctx.separated_stems[s_name] = p
        d3 = {"stem_count": 6, "stems": {}}
        r.save_artifact("stems", d3)
        return d3, "6/6 Enstrüman Tespit Edildi"

    def _fake_exec4(ctx, r, st):
        d4 = {
            "engine": "stable-ts + MMS_FA",
            "detected_language": "en",
            "is_instrumental": False,
            "word_count": 2,
            "line_count": 1,
            "lines": [{"start_sec": 0.2, "end_sec": 1.2, "text": "hello world", "words": [{"word": "hello", "start_sec": 0.2, "end_sec": 0.6}, {"word": "world", "start_sec": 0.7, "end_sec": 1.2}]}],
        }
        r.save_artifact("lyrics", d4)
        return d4, "1 Satır · 2 Kelime · Dil: EN (MMS_FA CTC)"

    fake_chord_engine = MagicMock()
    fake_chord_engine.extract_features.return_value = (np.zeros((108, 144), dtype=np.float32), 0.1, 108, 20)
    fake_chord_engine.infer_from_features.return_value = [
        ChordEvent(start_sec=0.0, end_sec=1.0, chord="F#:min"),
        ChordEvent(start_sec=1.0, end_sec=2.0, chord="B:min"),
    ]

    with patch("backend.services.dag_orchestrator.StageExecutorFactory.get_executor") as mock_get_exec, \
         patch("backend.services.dag_orchestrator.get_engine", return_value=fake_chord_engine), \
         patch("backend.services.dag_orchestrator.extract_dynamic_sections") as mock_sections:
        exec1 = MagicMock()
        exec1.execute.side_effect = _fake_exec1
        exec3 = MagicMock()
        exec3.execute.side_effect = _fake_exec3
        exec4 = MagicMock()
        exec4.execute.side_effect = _fake_exec4
        mock_get_exec.side_effect = lambda num: exec1 if num == 1 else (exec3 if num == 3 else exec4)
        mock_sections.return_value = [
            {"name": "Giriş (Intro)", "raw_label": "intro", "start_bar": 1, "end_bar": 2, "start_sec": 0.0, "end_sec": 2.0}
        ]

        orchestrator = DAGPipelineOrchestrator(repo)
        res = orchestrator.execute_dag()

    assert res["status"] == "completed"
    assert res["execution_mode"] == "parallel_dag"
    assert res["state"]["stages"]["1"]["status"] == "completed"
    assert res["state"]["stages"]["2"]["status"] == "completed"
    assert res["state"]["stages"]["3"]["status"] == "completed"
    assert res["state"]["stages"]["4"]["status"] == "completed"
    assert (repo.session_dir / "lyrics.json").exists()
    assert res["results"][2]["data"]["key_signature"] == "F# minor"
    assert len(res["results"][2]["data"]["bars"]) == 2
    assert res["results"][2]["data"]["bars"][0]["chord"] == "F#m"
    assert res["results"][2]["data"]["bars"][1]["chord"] == "Bm"
    # Verify Stage 3 separated_stems were passed into extract_dynamic_sections
    _, kwargs = mock_sections.call_args
    assert "guitar" in kwargs["separated_stems"]


def test_coalesce_consecutive_sections_merges_intros_and_verses():
    from backend.domain.chords import coalesce_consecutive_sections

    raw = [
        {"name": "Giriş (Intro)", "raw_label": "intro", "start_bar": 1, "end_bar": 1, "start_sec": 0.0, "end_sec": 0.3},
        {"name": "Giriş (Intro) 2", "raw_label": "intro", "start_bar": 1, "end_bar": 4, "start_sec": 0.3, "end_sec": 13.3},
        {"name": "Giriş (Intro) 3", "raw_label": "intro", "start_bar": 4, "end_bar": 8, "start_sec": 13.3, "end_sec": 26.3},
        {"name": "Giriş (Intro) 4", "raw_label": "intro", "start_bar": 8, "end_bar": 17, "start_sec": 26.3, "end_sec": 52.4},
        {"name": "Verse (Kıta) 1", "raw_label": "verse", "start_bar": 17, "end_bar": 24, "start_sec": 52.4, "end_sec": 78.4},
        {"name": "Verse (Kıta) 2", "raw_label": "verse", "start_bar": 24, "end_bar": 34, "start_sec": 78.4, "end_sec": 104.5},
        {"name": "Nakarat (Chorus)", "raw_label": "chorus", "start_bar": 34, "end_bar": 45, "start_sec": 104.5, "end_sec": 135.0},
        {"name": "Verse (Kıta) 3", "raw_label": "verse", "start_bar": 45, "end_bar": 55, "start_sec": 135.0, "end_sec": 165.0},
    ]

    merged = coalesce_consecutive_sections(raw, total_bars=55)
    assert len(merged) == 4
    assert merged[0]["name"] == "Intro"
    assert merged[0]["start_bar"] == 1
    assert merged[0]["end_bar"] == 16
    assert merged[0]["start_sec"] == 0.0
    assert merged[0]["end_sec"] == 52.4

    assert merged[1]["name"] == "Verse A"
    assert merged[1]["start_bar"] == 17
    assert merged[1]["end_bar"] == 33
    assert merged[1]["start_sec"] == 52.4
    assert merged[1]["end_sec"] == 104.5

    assert merged[2]["name"] == "Chorus"
    assert merged[3]["name"] == "Verse B"


def test_versioned_song_database_cache_hit_and_version_invalidation(tmp_path):
    from backend.services.song_database import SongDatabase

    db = SongDatabase(db_path=tmp_path / "test_library.db")
    s1 = {"tempo_bpm": 117.6, "time_signature": "4/4", "beats": []}
    s2 = {"key_signature": "F# minor", "primary_progression": "F#m → G#m", "sections": [], "bars": [], "chords": []}
    wf = [0.2, 0.5, 0.8]

    db.save_song_analysis(
        track_key="demo:billie_jean",
        title="Michael Jackson - Billie Jean",
        duration_sec=295.8,
        stage1=s1,
        stage2=s2,
        waveform_peaks=wf,
        pipeline_version="1.2.0",
    )

    # Matching version -> cache hit
    hit = db.get_valid_cached_song("demo:billie_jean", required_version="1.2.0")
    assert hit is not None
    assert hit["tempo_bpm"] == 117.6
    assert hit["key_signature"] == "F# minor"
    assert hit["beats"]["tempo_bpm"] == 117.6

    # Upgraded app version -> cache miss (requires re-analysis)
    miss = db.get_valid_cached_song("demo:billie_jean", required_version="1.3.0")
    assert miss is None
