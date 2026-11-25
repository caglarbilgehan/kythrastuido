"""
KythraStudio Test Configuration and Shared Fixtures
Provides fully isolated tmp_path repositories and FastAPI dependency overrides
so tests NEVER touch the live storage/sessions workspace.
"""

from pathlib import Path
import sys

from fastapi.testclient import TestClient
import pytest

PROJECT_ROOT = Path(__file__).parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.api.main import app
from backend.api.routes.workbench import get_workbench_service
from backend.services.session_repository import SessionRepository
from backend.services.workbench_service import WorkbenchService


@pytest.fixture
def temp_repo(tmp_path):
    """Provides an isolated SessionRepository working in a temporary directory."""
    return SessionRepository(session_dir=tmp_path / "test_session")


@pytest.fixture
def temp_service(temp_repo):
    """Provides an isolated WorkbenchService bound to the temporary repo."""
    return WorkbenchService(repo=temp_repo)


@pytest.fixture
def test_client(temp_service):
    """Provides a FastAPI TestClient wired strictly to isolated temp_service."""
    app.dependency_overrides[get_workbench_service] = lambda: temp_service
    try:
        with TestClient(app) as client:
            yield client
    finally:
        app.dependency_overrides.clear()
