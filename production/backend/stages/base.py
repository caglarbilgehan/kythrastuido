"""Abstract Strategy / Template Method base for pipeline stage executors."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Tuple

from backend.engines.base import PipelineContext
from backend.services.session_repository import SessionRepository


class BaseStageExecutor(ABC):
    @abstractmethod
    def _execute_stage(
        self,
        ctx: PipelineContext,
        repo: SessionRepository,
        state: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], str]:
        """Core stage execution logic implemented by each stage strategy."""

    def execute(
        self,
        ctx: PipelineContext,
        repo: SessionRepository,
        state: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], str]:
        """Executes stage logic and guarantees CUDA VRAM cleanup on completion."""
        try:
            return self._execute_stage(ctx, repo, state)
        finally:
            try:
                import torch
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
            except ImportError:
                pass
