"""Integration tests for Workbench FastAPI routes using isolated TestClient."""


def test_get_session_endpoint(test_client):
    response = test_client.get("/api/workbench/session")
    assert response.status_code == 200
    data = response.json()
    assert "state" in data
    assert "stages" in data["state"]


def test_get_state_alias_endpoint(test_client):
    response = test_client.get("/api/workbench/state")
    assert response.status_code == 200
    data = response.json()
    assert "state" in data


def test_reset_session_endpoint(test_client):
    response = test_client.post("/api/workbench/session/reset")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["state"]["has_session"] is False


def test_unsupported_upload_extension_returns_400(test_client):
    response = test_client.post(
        "/api/workbench/session/upload",
        files={"file": ("notes.txt", b"not audio data", "text/plain")},
    )
    assert response.status_code == 400
    assert "Unsupported format" in response.json()["detail"]


def test_invalid_stage_number_returns_400(test_client, temp_repo):
    # Ensure source audio exists in isolated temp repo so stage factory validation is exercised
    temp_repo.get_source_audio_path().write_bytes(b"RIFFdummy")
    response = test_client.post("/api/workbench/stage/99/run")
    assert response.status_code == 400
    assert "Invalid stage number" in response.json()["detail"]


def test_missing_stage_data_returns_404(test_client):
    response = test_client.get("/api/workbench/stage/1/data")
    assert response.status_code == 404
    assert "No output computed yet" in response.json()["detail"]


def test_logs_endpoint_lifecycle(test_client):
    from backend.services.log_service import get_log_service

    log_svc = get_log_service()
    log_svc.emit_stage_log(1, "Test stage 1 progress message", level="INFO")

    response = test_client.get("/api/workbench/logs?stage_num=1")
    assert response.status_code == 200
    data = response.json()
    assert "logs" in data
    assert any("Test stage 1 progress message" in item["message"] for item in data["logs"])

    # Clear logs
    clear_resp = test_client.post("/api/workbench/logs/clear")
    assert clear_resp.status_code == 200
    assert len(test_client.get("/api/workbench/logs").json()["logs"]) == 0


def test_studio_bundle_endpoint(test_client):
    response = test_client.get("/api/workbench/studio-bundle")
    assert response.status_code == 200
    data = response.json()
    assert "state" in data
    assert "stage1" in data
    assert "stage2" in data
    assert "stage3" in data
    assert "stage4" in data
    assert len(data["state"]["stages"]) == 4

