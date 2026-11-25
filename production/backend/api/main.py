"""
KythraStudio Production API Engine (4-Stage REST API)
Pure JSON REST API service without any bundled static frontend UI.
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.config import APP_PIPELINE_VERSION, DEVICE
from backend.exceptions import KythraDomainError
from backend.api.routes.workbench import router as workbench_router

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


@app.exception_handler(KythraDomainError)
async def domain_exception_handler(_request: Request, exc: KythraDomainError):
    """Translates clean domain exceptions into JSON HTTP responses."""
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.message})


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
        },
    }


# API Routers
app.include_router(workbench_router)
