"""
KythraStudio Production & Developer Workbench Routes (Controller Layer)
Includes:
- Per-user / Per-browser Session Isolation (`X-Session-Id` header or `session_id` query param)
- Persistent Disk Storage (`storage/tracks/<track_key>/` for normalized audio & separated stems)
- User Auth (`POST /auth/register`, `POST /auth/login`, `GET /auth/me`)
- User Favorites, Custom Playlists, and Private Uploaded Songs (`GET /account/overview`, etc.)
- Community & Private Lyric Editor with LRCLIB Locking & Versioned Revision Audit Logs (`PUT /lyrics`, `GET /lyrics/revisions`)
"""

from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, File, Header, HTTPException, Query, Request, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool

from backend.schemas.workbench import (
    ActionResponse,
    LogEntryDTO,
    LogsResponse,
    SessionResponse,
    StageRunResponse,
)
from backend.services.log_service import CURRENT_SESSION_ID, get_log_service
from backend.services.request_trace_service import get_request_trace_service
from backend.services.session_repository import SessionRepository
from backend.services.song_database import get_song_database
from backend.services.workbench_service import WorkbenchService

router = APIRouter(prefix="/api/workbench", tags=["workbench"])


class AuthRegisterRequest(BaseModel):
    email: str
    username: str
    password: str


class AuthLoginRequest(BaseModel):
    email_or_username: str
    password: str


class AuthUpdateProfileRequest(BaseModel):
    email: str
    username: str
    new_password: Optional[str] = None


class FavoriteToggleRequest(BaseModel):
    track_key: str
    title: str
    tempo_bpm: float = 120.0
    key_signature: str = "C major"
    time_signature: str = "4/4"


class PlaylistCreateRequest(BaseModel):
    name: str


class PlaylistAddSongRequest(BaseModel):
    track_key: str
    title: str
    tempo_bpm: float = 120.0
    key_signature: str = "C major"
    time_signature: str = "4/4"


class RenameUploadRequest(BaseModel):
    track_key: str
    title: str


class LyricsUpdateRequest(BaseModel):
    track_key: str
    lyrics: List[Dict[str, Any]]
    change_summary: Optional[str] = ""


def get_current_user_optional(
    authorization: Optional[str] = Header(default=None),
) -> Optional[Dict[str, Any]]:
    if not authorization:
        return None
    return get_song_database().get_user_by_token(authorization)


def get_workbench_service(
    request: Request,
    x_session_id: Optional[str] = Header(default=None, alias="X-Session-Id"),
    x_client_app: Optional[str] = Header(default=None, alias="X-Client-App"),
    session_id: Optional[str] = Query(default=None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
) -> WorkbenchService:
    effective_sid = x_session_id or session_id or (f"usr_{current_user['id']}" if current_user else "default")
    CURRENT_SESSION_ID.set(effective_sid)
    service = WorkbenchService(session_id=effective_sid, current_user=current_user)
    path = request.url.path
    if not path.startswith("/api/workbench/telemetry") and "/logs" not in path:
        if request.method != "GET" or path.endswith(("/studio-bundle", "/session", "/state")):
            client_tag = (x_client_app or "api").strip().lower()
            # Avoid marking Developer's passive observation peeks as ownership of a Web user session
            if client_tag != "developer" or request.method != "GET":
                service.repo.touch_session_metadata(client_app=client_tag, user=current_user)
    return service


# ============================================================================
# 1. ISOLATED SESSION & PERSISTENT AUDIO ENDPOINTS
# ============================================================================
@router.get("/session", response_model=SessionResponse)
@router.get("/state", response_model=SessionResponse)
async def get_session(service: WorkbenchService = Depends(get_workbench_service)):
    """Returns current active session state for the isolated X-Session-Id."""
    return service.get_session()


@router.post("/session/reset", response_model=ActionResponse)
async def reset_session(service: WorkbenchService = Depends(get_workbench_service)):
    """Purges session artifacts and resets pipeline state."""
    state = await run_in_threadpool(service.reset_session)
    return ActionResponse(status="ok", message="Session reset successfully.", state=state)


@router.post("/session/upload", response_model=ActionResponse)
async def upload_audio_source(
    file: UploadFile = File(...),
    service: WorkbenchService = Depends(get_workbench_service),
):
    """Uploads and normalizes local audio file into persistent disk storage."""
    res = await service.ingest_file(file)
    return ActionResponse(**res)


@router.post("/session/load-track")
async def load_cached_track_into_session(
    track_key: str = Query(...),
    service: WorkbenchService = Depends(get_workbench_service),
):
    """Loads a cached song (public or user's private upload) into the user's studio session."""
    return await run_in_threadpool(service.load_cached_song_into_session, track_key)


# ============================================================================
# 2. PIPELINE STAGES & STUDIO BUNDLE
# ============================================================================
@router.post("/stage/{stage_num}/run", response_model=StageRunResponse)
@router.post("/run/{stage_num}", response_model=StageRunResponse)
async def run_stage_endpoint(
    stage_num: int,
    service: WorkbenchService = Depends(get_workbench_service),
):
    res = await run_in_threadpool(service.run_stage, stage_num)
    return StageRunResponse(**res)


@router.post("/run-all")
async def run_all_stages_endpoint(
    force: bool = Query(default=True),
    service: WorkbenchService = Depends(get_workbench_service),
):
    return await run_in_threadpool(service.run_all_stages, force)


@router.get("/stage/{stage_num}/data")
async def get_stage_data_endpoint(
    stage_num: int,
    service: WorkbenchService = Depends(get_workbench_service),
):
    return service.get_stage_data(stage_num)


@router.get("/studio-bundle")
async def get_studio_bundle_endpoint(
    service: WorkbenchService = Depends(get_workbench_service),
):
    return service.get_studio_bundle()


@router.post("/prepare-studio")
async def prepare_studio_endpoint(
    background_stems: bool = True,
    service: WorkbenchService = Depends(get_workbench_service),
):
    return await run_in_threadpool(service.prepare_studio_session, background_stems)


@router.get("/library")
async def list_library_songs_endpoint(
    service: WorkbenchService = Depends(get_workbench_service),
):
    """Returns user's uploaded songs and public demo library items."""
    return {"songs": await run_in_threadpool(service.list_library_songs)}


# ============================================================================
# 3. AUTHENTICATION, FAVORITES, PLAYLISTS & PRIVATE USER UPLOADS
# ============================================================================
@router.post("/auth/register")
async def register_user_endpoint(req: AuthRegisterRequest):
    db = get_song_database()
    try:
        return await run_in_threadpool(db.register_user, req.email, req.username, req.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/auth/login")
async def login_user_endpoint(req: AuthLoginRequest):
    db = get_song_database()
    try:
        return await run_in_threadpool(db.login_user, req.email_or_username, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e)) from e


@router.get("/auth/me")
async def get_me_endpoint(current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)):
    if not current_user:
        return {"authenticated": False, "user": None}
    db = get_song_database()
    return {
        "authenticated": True,
        "user": current_user,
        "favorites": await run_in_threadpool(db.list_favorites, current_user["id"]),
        "playlists": await run_in_threadpool(db.list_playlists, current_user["id"]),
        "private_uploads": await run_in_threadpool(db.list_user_private_songs, current_user["id"]),
    }


@router.put("/auth/profile")
async def update_user_profile_endpoint(
    req: AuthUpdateProfileRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    try:
        updated_user = await run_in_threadpool(
            db.update_user_profile,
            current_user["id"],
            req.email,
            req.username,
            req.new_password,
        )
        return {"status": "ok", "user": updated_user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.post("/account/favorites/toggle")
async def toggle_favorite_endpoint(
    req: FavoriteToggleRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    res = await run_in_threadpool(
        db.toggle_favorite,
        current_user["id"],
        req.track_key,
        req.title,
        req.tempo_bpm,
        req.key_signature,
        req.time_signature,
    )
    favorites = await run_in_threadpool(db.list_favorites, current_user["id"])
    return {**res, "favorites": favorites}


@router.post("/account/playlists")
async def create_playlist_endpoint(
    req: PlaylistCreateRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    try:
        await run_in_threadpool(db.create_playlist, current_user["id"], req.name)
        return {"playlists": await run_in_threadpool(db.list_playlists, current_user["id"])}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e


@router.delete("/account/playlists/{playlist_id}")
async def delete_playlist_endpoint(
    playlist_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    await run_in_threadpool(db.delete_playlist, current_user["id"], playlist_id)
    return {"playlists": await run_in_threadpool(db.list_playlists, current_user["id"])}


@router.post("/account/playlists/{playlist_id}/items")
async def add_song_to_playlist_endpoint(
    playlist_id: str,
    req: PlaylistAddSongRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    try:
        await run_in_threadpool(
            db.add_song_to_playlist,
            current_user["id"],
            playlist_id,
            req.track_key,
            req.title,
            req.tempo_bpm,
            req.key_signature,
            req.time_signature,
        )
        return {"playlists": await run_in_threadpool(db.list_playlists, current_user["id"])}
    except PermissionError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.delete("/account/playlists/{playlist_id}/items")
async def remove_song_from_playlist_endpoint(
    playlist_id: str,
    track_key: str = Query(...),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Authentication required.")
    db = get_song_database()
    await run_in_threadpool(db.remove_song_from_playlist, current_user["id"], playlist_id, track_key)
    return {"playlists": await run_in_threadpool(db.list_playlists, current_user["id"])}


@router.put("/account/uploads/rename")
async def rename_uploaded_track_endpoint(
    req: RenameUploadRequest,
    service: WorkbenchService = Depends(get_workbench_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    clean_title = req.title.strip()[:120]
    if not clean_title:
        raise HTTPException(status_code=400, detail="Track title cannot be empty.")

    db = get_song_database()
    updated_in_db = False
    if current_user:
        try:
            await run_in_threadpool(
                db.rename_user_private_song,
                current_user["id"],
                req.track_key,
                clean_title,
            )
            updated_in_db = True
        except KeyError:
            updated_in_db = False
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e)) from e

    updated_in_session = False
    state = service.repo.load_state()
    if state.get("has_session") and state.get("track_key") == req.track_key:
        state["track_name"] = clean_title
        service.repo.save_state(state)
        updated_in_session = True

    if not updated_in_db and not updated_in_session:
        raise HTTPException(status_code=404, detail="Track not found.")

    return {
        "status": "ok",
        "track_key": req.track_key,
        "title": clean_title,
        "private_uploads": (
            await run_in_threadpool(db.list_user_private_songs, current_user["id"])
            if current_user
            else []
        ),
        "favorites": (
            await run_in_threadpool(db.list_favorites, current_user["id"])
            if current_user
            else []
        ),
    }


@router.delete("/account/uploads")
async def delete_uploaded_track_endpoint(
    track_key: str = Query(...),
    service: WorkbenchService = Depends(get_workbench_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    db = get_song_database()
    deleted_in_db = False
    if current_user:
        deleted_in_db = await run_in_threadpool(
            db.delete_user_private_song,
            current_user["id"],
            track_key,
        )

    reset_active = False
    state = service.repo.load_state()
    if state.get("has_session") and state.get("track_key") == track_key:
        await run_in_threadpool(service.reset_session)
        reset_active = True

    if (deleted_in_db or reset_active) and await run_in_threadpool(db.count_track_references, track_key) == 0:
        await run_in_threadpool(service.repo.delete_track_audio, track_key)

    if not deleted_in_db and not reset_active:
        raise HTTPException(status_code=404, detail="Track not found.")

    return {
        "status": "ok",
        "track_key": track_key,
        "reset_active": reset_active,
        "private_uploads": (
            await run_in_threadpool(db.list_user_private_songs, current_user["id"])
            if current_user
            else []
        ),
        "favorites": (
            await run_in_threadpool(db.list_favorites, current_user["id"])
            if current_user
            else []
        ),
    }


# ============================================================================
# 4. COMMUNITY & PRIVATE LYRICS EDITOR + VERSIONED AUDIT LOGS
# ============================================================================
@router.put("/lyrics")
async def update_song_lyrics_endpoint(
    req: LyricsUpdateRequest,
    service: WorkbenchService = Depends(get_workbench_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional),
):
    """
    Saves user-added or edited lyrics for a song:
    - Locked if official LRCLIB lyrics exist.
    - Increments lyrics_version (+1) and logs contributor & diff summary in lyric_revisions.
    """
    db = get_song_database()
    try:
        res = await run_in_threadpool(
            db.save_community_or_private_lyrics_edit,
            req.track_key,
            req.lyrics,
            current_user,
            req.change_summary or "",
        )
        # Also update active session state if same song is loaded
        state = service.repo.load_state()
        if state.get("track_key") == req.track_key:
            state["lyrics"] = req.lyrics
            state["lyrics_source"] = "user"
            state["lyrics_locked"] = False
            state["lyrics_version"] = res["lyrics_version"]
            state["lyrics_updated_by"] = res["lyrics_updated_by"]
            service.repo.save_state(state)

        revisions = await run_in_threadpool(db.list_lyric_revisions, req.track_key)
        return {**res, "revisions": revisions}
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e)) from e
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e)) from e


@router.get("/lyrics/revisions")
async def list_lyric_revisions_endpoint(track_key: str = Query(...)):
    db = get_song_database()
    revisions = await run_in_threadpool(db.list_lyric_revisions, track_key)
    return {"track_key": track_key, "revisions": revisions}


# ============================================================================
# 5. LOGS, TELEMETRY OBSERVABILITY & STREAMING
# ============================================================================
@router.get("/telemetry/sessions")
async def list_telemetry_sessions_endpoint():
    """Lists all active/recent Web Studio and Developer sessions for live debugging."""
    sessions = await run_in_threadpool(SessionRepository.list_all_sessions)
    return {"sessions": sessions}


@router.get("/telemetry/requests")
async def list_telemetry_requests_endpoint(
    since_id: int = 0,
    session_id: Optional[str] = None,
    only_errors: bool = False,
    limit: int = 200,
):
    """Returns captured HTTP requests & errors for live observability."""
    trace_svc = get_request_trace_service()
    entries = trace_svc.get_entries(
        since_id=since_id,
        session_id=session_id or None,
        only_errors=only_errors,
        limit=limit,
    )
    return {"requests": entries, "last_id": trace_svc.latest_id}


@router.post("/telemetry/requests/clear")
async def clear_telemetry_requests_endpoint():
    get_request_trace_service().clear()
    return {"status": "ok", "message": "Request traces cleared."}


@router.get("/logs", response_model=LogsResponse)
async def get_system_logs(
    since_id: int = 0,
    stage_num: Optional[int] = None,
    filter_session_id: Optional[str] = None,
    limit: int = 200,
):
    log_svc = get_log_service()
    entries = log_svc.get_logs(
        since_id=since_id,
        stage_num=stage_num,
        limit=limit,
        session_id=filter_session_id or None,
    )
    return LogsResponse(logs=[LogEntryDTO(**e) for e in entries], last_id=log_svc.latest_id)


@router.post("/logs/clear", response_model=ActionResponse)
async def clear_system_logs(
    service: WorkbenchService = Depends(get_workbench_service),
):
    get_log_service().clear()
    state = service.get_session()["state"]
    return ActionResponse(status="ok", message="Logs cleared.", state=state)


@router.api_route("/stream/{filename}", methods=["GET", "HEAD"])
@router.api_route("/audio/{filename}", methods=["GET", "HEAD"])
async def stream_audio_file(
    filename: str,
    service: WorkbenchService = Depends(get_workbench_service),
):
    """Streams full mix or isolated stems directly from persistent disk storage."""
    file_path = service.get_audio_path(filename)
    return FileResponse(
        str(file_path),
        media_type="audio/wav",
        headers={
            "Accept-Ranges": "bytes",
            "Cache-Control": "private, max-age=300",
            "X-Audio-Storage": "persistent_disk",
        },
    )


@router.api_route("/download/{filename}", methods=["GET", "HEAD"])
async def download_artifact_file(
    filename: str,
    service: WorkbenchService = Depends(get_workbench_service),
):
    file_path = service.get_download_path(filename)
    return FileResponse(
        str(file_path),
        filename=filename,
        media_type="application/octet-stream",
    )
