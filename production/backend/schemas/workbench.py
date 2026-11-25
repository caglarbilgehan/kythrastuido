"""
KythraStudio Workbench Data Transfer Objects (DTOs)
Strict Pydantic V2 schemas for API requests, responses, and session metadata.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict


class StageMetadataDTO(BaseModel):
    model_config = ConfigDict(extra="allow")

    id: str
    name: str
    desc: str
    status: str = "pending"  # pending | running | completed | error
    timings_ms: float = 0.0
    summary: Optional[str] = None
    error: Optional[str] = None


class SessionStateDTO(BaseModel):
    model_config = ConfigDict(extra="allow")

    has_session: bool = False
    track_name: Optional[str] = None
    duration_sec: Optional[float] = 0.0
    sample_rate: Optional[int] = 44100
    channels: Optional[int] = 2
    device: str = "cuda:0"
    stages: Dict[str, StageMetadataDTO]


class SessionResponse(BaseModel):
    state: SessionStateDTO


class ActionResponse(BaseModel):
    status: str
    message: str
    state: SessionStateDTO


class StageRunResponse(BaseModel):
    stage_num: int
    status: str
    timings_ms: float
    summary: Optional[str] = None
    data: Dict[str, Any]
    state: SessionStateDTO


class LogEntryDTO(BaseModel):
    id: int
    timestamp: str
    level: str
    logger: str
    stage_num: Optional[int] = None
    message: str
    session_id: Optional[str] = None


class LogsResponse(BaseModel):
    logs: List[LogEntryDTO]
    last_id: int

