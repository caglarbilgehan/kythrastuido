"""Tests for SessionRepository (Unit, Atomic Persistence & Concurrency tests)."""

from concurrent.futures import ThreadPoolExecutor

from backend.services.session_repository import SessionRepository


def test_repository_initial_state(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "sess")
    state = repo.load_state()

    assert state["has_session"] is False
    assert state["track_name"] is None
    assert "device" in state
    assert len(state["stages"]) == 4
    assert state["stages"]["1"]["id"] == "beat"
    assert state["stages"]["2"]["id"] == "chord"
    assert state["stages"]["3"]["id"] == "mss"
    assert state["stages"]["4"]["id"] == "lyrics"
    assert state["stages"]["1"]["status"] == "pending"


def test_repository_save_and_reload_state(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "sess")
    state = repo.load_state()
    state["has_session"] = True
    state["track_name"] = "test_audio.wav"
    state["stages"]["1"]["status"] = "completed"
    repo.save_state(state)

    reloaded = repo.load_state()
    assert reloaded["has_session"] is True
    assert reloaded["track_name"] == "test_audio.wav"
    assert reloaded["stages"]["1"]["status"] == "completed"


def test_repository_reset(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "sess")
    dummy_wav = repo.get_source_audio_path()
    dummy_wav.write_bytes(b"RIFFdummydata")

    assert dummy_wav.exists()
    reset_state = repo.reset()

    assert not dummy_wav.exists()
    assert reset_state["has_session"] is False
    assert reset_state["stages"]["1"]["status"] == "pending"


def test_repository_stage_output_io(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "sess")
    data = {"tempo": 120.0, "time_sig": "4/4"}
    repo.save_artifact("beats", data)

    loaded = repo.load_artifact("beats")
    assert loaded == data
    assert (repo.session_dir / "beats.json").exists()


def test_repository_two_level_hash_sharding(tmp_path):
    repo = SessionRepository(session_dir=tmp_path / "sess", tracks_dir=tmp_path / "tracks")
    track_dir = repo.get_track_dir("sha256:ff7ae1f70e9f6800")
    assert track_dir == tmp_path / "tracks" / "ff" / "7a" / "sha256_ff7ae1f70e9f6800"


def test_repository_parallel_stage_updates_no_lost_writes(tmp_path):
    sess_dir = tmp_path / "parallel_sess"
    SessionRepository(session_dir=sess_dir).save_state(
        SessionRepository(session_dir=sess_dir).load_state()
    )

    def _update(stage_num: int):
        # Use independent SessionRepository instances simulating concurrent requests
        repo_inst = SessionRepository(session_dir=sess_dir)
        repo_inst.update_stage_state(stage_num, status="running")
        repo_inst.update_stage_state(
            stage_num,
            status="completed",
            timings_ms=float(stage_num * 100),
            summary=f"Stage {stage_num} done",
        )

    with ThreadPoolExecutor(max_workers=4) as pool:
        list(pool.map(_update, [1, 2, 3, 4]))

    final_state = SessionRepository(session_dir=sess_dir).load_state()
    for s in ("1", "2", "3", "4"):
        assert final_state["stages"][s]["status"] == "completed"
        assert final_state["stages"][s]["summary"] == f"Stage {int(s)} done"
