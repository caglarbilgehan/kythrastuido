"""
KythraStudio Production API Engine (4-Stage REST API)
Pure JSON REST API service without any bundled static frontend UI,
enhanced with real-time HTTP Request Tracing and Session Context propagation.
"""

import json
import logging
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.api.routes.workbench import router as workbench_router
from backend.config import APP_PIPELINE_VERSION, DEVICE
from backend.exceptions import KythraDomainError
from backend.services.log_service import CURRENT_SESSION_ID
from backend.services.request_trace_service import get_request_trace_service
from backend.services.session_repository import SessionRepository
from backend.services.song_database import get_song_database

logger = logging.getLogger("backend.api")

app = FastAPI(
    title="KythraStudio Production API",
    description="4-Stage Music Analysis, 6-Stem Separation & Auto Lyrics/Karaoke REST API.",
    version=APP_PIPELINE_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _should_skip_trace(path: str, client_app: str, *, is_poll: bool = False, status_code: int = 200) -> bool:
    """Skips high-frequency Developer/Web polling and root health endpoints to keep trace feed noise-free."""
    if not path.startswith("/api/workbench"):
        return True
    if path.startswith("/api/workbench/telemetry") or path.startswith("/api/workbench/logs"):
        return True
    if client_app == "developer" and path in ("/api/workbench/session", "/api/workbench/state"):
        return True
    if is_poll and status_code < 400 and path in ("/api/workbench/studio-bundle", "/api/workbench/session", "/api/workbench/state"):
        return True
    return False


@app.middleware("http")
async def request_observability_middleware(request: Request, call_next):
    path = request.url.path
    client_app = (request.headers.get("x-client-app") or "").strip().lower()
    if not client_app:
        referer = (request.headers.get("referer") or "").lower()
        if ":5175" in referer:
            client_app = "web"
        elif ":5174" in referer:
            client_app = "developer"
        else:
            client_app = "api"
    is_poll = (request.headers.get("x-request-poll") or "").strip().lower() in ("1", "true", "yes")

    raw_sid = request.headers.get("x-session-id") or request.query_params.get("session_id")
    auth_header = request.headers.get("authorization")
    current_user = get_song_database().get_user_by_token(auth_header) if auth_header else None
    eff_sid = raw_sid or (f"usr_{current_user['id']}" if current_user else "default")

    ctx_tok = CURRENT_SESSION_ID.set(eff_sid)
    t0 = time.perf_counter()
    error_detail = None
    response = None

    try:
        response = await call_next(request)
        return response
    except Exception as exc:
        error_detail = str(exc)
        raise
    finally:
        duration_ms = (time.perf_counter() - t0) * 1000.0
        CURRENT_SESSION_ID.reset(ctx_tok)
        status_code = response.status_code if response is not None else 500
        if not _should_skip_trace(path, client_app, is_poll=is_poll, status_code=status_code):
            if error_detail is None:
                error_detail = getattr(request.state, "kythra_error_detail", None)
            if status_code >= 400 and error_detail is None and response is not None:
                body_bytes = getattr(response, "body", None)
                if isinstance(body_bytes, (bytes, bytearray)):
                    try:
                        parsed = json.loads(body_bytes.decode("utf-8", errors="ignore"))
                        if isinstance(parsed, dict) and parsed.get("detail"):
                            error_detail = str(parsed["detail"])
                    except Exception:
                        pass
            if status_code >= 400 and error_detail is None:
                error_detail = f"HTTP {status_code}"
            track_name = request.query_params.get("track")
            if not track_name and eff_sid:
                try:
                    repo = SessionRepository(session_id=eff_sid)
                    st = repo.load_state()
                    track_name = st.get("track_name")
                except Exception:
                    pass
            get_request_trace_service().record(
                method=request.method,
                path=path,
                query=request.url.query,
                status_code=status_code,
                duration_ms=duration_ms,
                session_id=eff_sid,
                client_app=client_app,
                user=current_user,
                track_name=track_name,
                error_detail=error_detail,
            )


@app.exception_handler(KythraDomainError)
async def domain_exception_handler(request: Request, exc: KythraDomainError):
    """Translates clean domain exceptions into JSON HTTP responses and captures error telemetry."""
    request.state.kythra_error_detail = exc.message
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Captures FastAPI HTTPException details into request telemetry."""
    request.state.kythra_error_detail = str(exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})


@app.get("/")
@app.get("/health")
async def api_root_health():
    """Root health & status endpoint for kythrastudio-api.bilgehan.biz."""
    return {
        "service": "KythraStudio Production API",
        "status": "ok",
        "pipeline_version": APP_PIPELINE_VERSION,
        "device": DEVICE,
        "docs_url": "/docs",
        "endpoints": {
            "studio_bundle": "/api/workbench/studio-bundle",
            "prepare_studio": "/api/workbench/prepare-studio",
            "upload_single": "/api/workbench/session/upload",
            "library": "/api/workbench/library",
            "telemetry_sessions": "/api/workbench/telemetry/sessions",
            "telemetry_requests": "/api/workbench/telemetry/requests",
        },
    }


# API Routers
app.include_router(workbench_router)
