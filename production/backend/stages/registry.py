"""Lazy engine cache for Production pipeline."""

from typing import Any, Dict

_ENGINE_CACHE: Dict[str, Any] = {}


def get_engine(key: str) -> Any:
    """Returns a cached singleton ML/algorithmic engine instance."""
    if key not in _ENGINE_CACHE:
        if key == "beat":
            from backend.engines.beat_madmom import BeatMadmomEngine
            _ENGINE_CACHE[key] = BeatMadmomEngine()
        elif key == "chord":
            from backend.engines.chords_btc import ChordsBtcEngine
            _ENGINE_CACHE[key] = ChordsBtcEngine()
        elif key == "mss":
            from backend.engines.mss_demux import MssDemuxEngine
            _ENGINE_CACHE[key] = MssDemuxEngine()
        elif key == "lyrics":
            from backend.engines.lyrics_hybrid import LyricsHybridEngine
            _ENGINE_CACHE[key] = LyricsHybridEngine()
        else:
            raise ValueError(f"Unknown production engine key: {key}")
    return _ENGINE_CACHE[key]
