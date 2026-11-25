"""Tests for Request Trace Middleware, Multi-Session Telemetry, Developer Role & Progressive DAG."""

import time
from unittest.mock import MagicMock, patch
import numpy as np
import soundfile as sf

from backend.models import BeatEvent, ChordEvent
from backend.services.request_trace_service import get_request_trace_service
from backend.services.session_repository import SessionRepository
from backend.services.song_database import SongDatabase
from backend.services.workbench_service import WorkbenchService


def test_request_trace_middleware_records_web_traffic_and_errors(test_client):
    trace_svc = get_request_trace_service()
    trace_svc.clear()

    # Normal Web Studio request with session header
    r_ok = test_client.get(
        "/api/workbench/studio-bundle",
        headers={"X-Session-Id": "sess_web_123", "X-Client-App": "web"},
    )
    assert r_ok.status_code == 200

    # Intentional 404 request on missing stage
    r_err = test_client.get(
        "/api/workbench/stage/1/data",
        headers={"X-Session-Id": "sess_web_123", "X-Client-App": "web"},
    )
    assert r_err.status_code == 404

    # Telemetry polling itself must NOT appear in trace feed
    r_tel = test_client.get("/api/workbench/telemetry/requests")
    assert r_tel.status_code == 200

    entries = trace_svc.get_entries(session_id="sess_web_123")
    paths = [e["path"] for e in entries]
    assert "/api/workbench/studio-bundle" in paths
    assert "/api/workbench/stage/1/data" in paths
    assert "/api/workbench/telemetry/requests" not in paths

    err_entries = trace_svc.get_entries(session_id="sess_web_123", only_errors=True)
    assert len(err_entries) == 1
    assert err_entries[0]["status_code"] == 404
    assert err_entries[0]["client_app"] == "web"
    assert err_entries[0]["error_detail"] is not None


def test_session_directory_listing_and_developer_role(tmp_path):
    db = SongDatabase(db_path=tmp_path / "roles.db")
    reg = db.register_user("dev@kythra.studio", "bilgehan", "secret123")
    assert reg["user"]["role"] == "user"
    assert db.set_user_role("dev@kythra.studio", "developer") is True

    authed = db.get_user_by_token(reg["token"])
    assert authed is not None
    assert authed["role"] == "developer"

    sessions_root = tmp_path / "sessions"
    tracks_root = tmp_path / "tracks"

    r1 = SessionRepository(session_dir=sessions_root / "default", session_id="default", tracks_dir=tracks_root)
    r1.touch_session_metadata(client_app="developer", user=None, force=True)

    r2 = SessionRepository(session_dir=sessions_root / "sess_web_abc", session_id="sess_web_abc", tracks_dir=tracks_root)
    st2 = r2.load_state()
    st2["has_session"] = True
    st2["track_name"] = "Test Track.m4a"
    r2.save_state(st2)
    r2.touch_session_metadata(client_app="web", user=authed, force=True)

    listed = SessionRepository.list_all_sessions(sessions_dir=sessions_root)
    by_id = {item["session_id"]: item for item in listed}
    assert "default" in by_id
    assert "sess_web_abc" in by_id
    assert by_id["sess_web_abc"]["client_app"] == "web"
    assert by_id["sess_web_abc"]["user"]["role"] == "developer"
    assert by_id["sess_web_abc"]["track_name"] == "Test Track.m4a"


def test_progressive_prepare_studio_opens_fast_and_refines_in_background(tmp_path):
    tracks_dir = tmp_path / "tracks"
    repo = SessionRepository(session_dir=tmp_path / "sess_prog", session_id="sess_prog", tracks_dir=tracks_dir)

    track_key = "sha256:progressive1234"
    sr = 44100
    t = np.linspace(0, 1.5, int(sr * 1.5), dtype=np.float32)
    stereo = np.column_stack([0.2 * np.sin(2 * np.pi * 440 * t), 0.2 * np.sin(2 * np.pi * 440 * t)])
    sf.write(str(repo.get_persistent_source_path(track_key)), stereo, sr)

    st = repo.load_state()
    st["has_session"] = True
    st["track_key"] = track_key
    st["track_name"] = "Progressive Song.m4a"
    st["duration_sec"] = 1.5
    st["waveform_peaks"] = [0.4] * 20
    repo.save_state(st)

    def _fake_exec1(ctx, r, s):
        ctx.tempo_bpm = 124.0
        ctx.time_signature = "4/4"
        ctx.beats = [
            BeatEvent(time_sec=0.0, beat_number=1, is_downbeat=True, bar_index=0),
            BeatEvent(time_sec=0.5, beat_number=2, is_downbeat=False, bar_index=0),
            BeatEvent(time_sec=1.0, beat_number=1, is_downbeat=True, bar_index=1),
        ]
        d1 = {"tempo_bpm": 124.0, "time_signature": "4/4", "beats": [b.model_dump() for b in ctx.beats]}
        r.save_artifact("beats", d1)
        return d1, "124.0 BPM, 4/4 (2 Bars)"

    def _fake_exec3(ctx, r, s):
        stems_dir = r.get_stems_dir()
        for s_name in ("guitar", "bass", "drums", "vocals", "piano", "other"):
            p = stems_dir / f"{s_name}.wav"
            sf.write(str(p), stereo, sr)
            ctx.separated_stems[s_name] = p
        d3 = {"stem_count": 6, "detected_count": 6, "stems": {"vocals": {"detected": True}}}
        r.save_artifact("stems", d3)
        return d3, "6/6 Enstrüman"

    def _fake_exec4(ctx, r, s):
        d4 = {
            "detected_language": "tr",
            "is_instrumental": False,
            "word_count": 2,
            "line_count": 1,
            "lines": [{"start_sec": 0.1, "end_sec": 1.2, "text": "zaman kayboldugunda", "words": []}],
        }
        r.save_artifact("lyrics", d4)
        return d4, "1 Satır · 2 Kelime · Dil: TR"

    fake_chord_engine = MagicMock()
    fake_chord_engine.extract_features.return_value = (np.zeros((108, 144), dtype=np.float32), 0.1, 108, 15)
    fake_chord_engine.infer_from_features.return_value = [
        ChordEvent(start_sec=0.0, end_sec=1.5, chord="A:min"),
    ]

    service = WorkbenchService(repo=repo, session_id="sess_prog")
    service.song_db = SongDatabase(db_path=tmp_path / "prog.db")

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
            {"name": "Intro", "raw_label": "intro", "start_bar": 1, "end_bar": 1, "start_sec": 0.0, "end_sec": 0.75},
            {"name": "Verse A", "raw_label": "verse", "start_bar": 2, "end_bar": 2, "start_sec": 0.75, "end_sec": 1.5},
        ]

        bundle = service.prepare_studio_session(background_stems=True)
        assert bundle["state"]["stages"]["1"]["status"] == "completed"
        assert bundle["state"]["stages"]["2"]["status"] == "completed"
        assert bundle["sections_refining"] is True

        # Wait briefly for the background daemon wave (Stage 3 -> Section Refinement -> Stage 4)
        deadline = time.time() + 5.0
        final_bundle = bundle
        while time.time() < deadline:
            final_bundle = service.get_studio_bundle()
            if (
                final_bundle["state"]["stages"]["3"]["status"] == "completed"
                and final_bundle["state"]["stages"]["4"]["status"] == "completed"
                and not final_bundle.get("sections_refining")
            ):
                break
            time.sleep(0.05)

        assert final_bundle["state"]["stages"]["3"]["status"] == "completed"
        assert final_bundle["state"]["stages"]["4"]["status"] == "completed"
        assert final_bundle["sections_refining"] is False
        assert final_bundle["stage2"]["sections_refined"] is True
        assert final_bundle["lyrics"][0]["text"] == "zaman kayboldugunda"
        assert mock_sections.call_count == 1
        _, kwargs = mock_sections.call_args
        assert "vocals" in kwargs["separated_stems"]
