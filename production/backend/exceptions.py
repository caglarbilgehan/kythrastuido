"""
KythraStudio Domain Exceptions
Clean domain-level exceptions decoupled from HTTP transport concerns.
Mapped to HTTP status codes via global exception handlers in backend.api.main.
"""


class KythraDomainError(Exception):
    """Base exception for all domain and pipeline errors."""

    status_code: int = 400

    def __init__(self, message: str, status_code: int | None = None):
        super().__init__(message)
        self.message = message
        if status_code is not None:
            self.status_code = status_code


class InvalidStageError(KythraDomainError):
    status_code = 400


class SessionAudioNotFoundError(KythraDomainError):
    status_code = 400


class StagePrerequisiteError(KythraDomainError):
    status_code = 400


class UnsupportedMediaFormatError(KythraDomainError):
    status_code = 400


class MediaPayloadTooLargeError(KythraDomainError):
    status_code = 413


class ArtifactNotFoundError(KythraDomainError):
    status_code = 404


class StageExecutionError(KythraDomainError):
    status_code = 500
