"""Tests for IngestionService: audio upload normalization and 48 kHz -> 44.1 kHz resampling."""

import io
import numpy as np
import soundfile as sf


def test_upload_resamples_48khz_preserving_duration(test_client, temp_repo):
    sr_in = 48000
    duration_sec = 1.0
    t = np.linspace(0, duration_sec, int(sr_in * duration_sec), endpoint=False, dtype=np.float32)
    sine = 0.25 * np.sin(2 * np.pi * 440.0 * t)
    stereo = np.column_stack([sine, sine])

    buf = io.BytesIO()
    sf.write(buf, stereo, sr_in, format="WAV", subtype="PCM_16")
    buf.seek(0)

    res = test_client.post(
        "/api/workbench/session/upload",
        files={"file": ("sine_48k.wav", buf, "audio/wav")},
    )
    assert res.status_code == 200
    payload = res.json()
    assert payload["status"] == "ok"
    assert payload["state"]["has_session"] is True
    assert payload["state"]["sample_rate"] == 44100
    assert abs(payload["state"]["duration_sec"] - 1.0) <= 0.02

    out_info = sf.info(str(temp_repo.get_source_audio_path()))
    assert out_info.samplerate == 44100
    assert out_info.channels == 2
    assert abs(out_info.duration - 1.0) <= 0.02


def test_upload_rejects_unsupported_extension(test_client):
    res = test_client.post(
        "/api/workbench/session/upload",
        files={"file": ("notes.txt", b"not audio", "text/plain")},
    )
    assert res.status_code == 400
    assert "Unsupported format" in res.json()["detail"]
