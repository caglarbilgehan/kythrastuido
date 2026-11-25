"""
KythraStudio Synchronized Karaoke Lyrics Service
Fetches time-aligned karaoke lyrics ([mm:ss.xx] Line) via:
1. LRCLIB API (official locked source -> lyrics_source = 'lrclib')
2. Empty fallback ready for user section-based contribution (editable -> lyrics_source = 'none' / 'user')
"""

import json
import logging
import re
from typing import Any, Dict, List, Optional, Tuple
import urllib.parse
import urllib.request

logger = logging.getLogger("backend.services.lyrics_service")

_LRC_LINE_RE = re.compile(r"\[(\d{1,3}):(\d{2})(?:[.:](\d{1,3}))?\]")
_VTT_TIME_RE = re.compile(
    r"(?:(\d{1,2}):)?(\d{2}):(\d{2})[.,](\d{3})\s*-->\s*(?:(\d{1,2}):)?(\d{2}):(\d{2})[.,](\d{3})"
)

_NOISE_PATTERNS = [
    r"\(official\s*(music\s*)?(video|audio|lyric\s*video|visualizer|hd|4k|remaster(ed)?)\)",
    r"\[official\s*(music\s*)?(video|audio|lyric\s*video|visualizer|hd|4k|remaster(ed)?)\]",
    r"\((lyrics?|audio|video|hd|hq|4k|remastered\s*\d*)\)",
    r"\[(lyrics?|audio|video|hd|hq|4k|remastered\s*\d*)\]",
    r"\b(official\s+audio|official\s+video|official\s+music\s+video|lyric\s+video)\b",
    r"\b(remastered\s*\d{0,4}|hd|4k)\b",
]


def clean_song_title_for_search(raw_title: str) -> Dict[str, str]:
    """Extracts clean query, artist, and track name from raw audio filename titles."""
    cleaned = raw_title or ""
    cleaned = re.sub(r"\.(wav|mp3|flac|ogg|m4a)$", "", cleaned, flags=re.IGNORECASE)
    for pat in _NOISE_PATTERNS:
        cleaned = re.sub(pat, " ", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" -–—|")

    parts = re.split(r"\s+[-–—]\s+", cleaned, maxsplit=1)
    if len(parts) == 2:
        return {
            "query": cleaned,
            "artist": parts[0].strip(),
            "track": parts[1].strip(),
        }
    return {
        "query": cleaned,
        "artist": "",
        "track": cleaned,
    }


def parse_lrc_to_lines(lrc_text: str, duration_sec: float = 240.0) -> List[Dict[str, Any]]:
    """Parses standard LRC format ([mm:ss.xx] text) into sorted [{start_sec, end_sec, text}]."""
    if not lrc_text or not lrc_text.strip():
        return []

    raw_events: List[Dict[str, Any]] = []
    for raw_line in lrc_text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        matches = list(_LRC_LINE_RE.finditer(line))
        if not matches:
            continue
        text = _LRC_LINE_RE.sub("", line).strip()
        text = re.sub(r"<\d{1,3}:\d{2}(?:[.:]\d{1,3})?>", "", text).strip()
        text = re.sub(r"\s+", " ", text)
        if not text or text in ("♪", "♫", "..."):
            continue

        for m in matches:
            mins = int(m.group(1))
            secs = int(m.group(2))
            frac_str = m.group(3) or "0"
            frac = int(frac_str) / (1000.0 if len(frac_str) == 3 else 100.0)
            start_sec = round(mins * 60.0 + secs + frac, 2)
            raw_events.append({"start_sec": start_sec, "text": text})

    if not raw_events:
        return []

    raw_events.sort(key=lambda x: x["start_sec"])

    lines: List[Dict[str, Any]] = []
    for idx, ev in enumerate(raw_events):
        start_s = ev["start_sec"]
        if idx + 1 < len(raw_events):
            next_s = raw_events[idx + 1]["start_sec"]
            end_s = round(max(start_s + 0.5, next_s), 2)
        else:
            end_s = round(max(start_s + 4.0, duration_sec), 2)
        lines.append({
            "start_sec": start_s,
            "end_sec": end_s,
            "text": ev["text"],
        })
    return lines


def distribute_plain_lyrics(plain_text: str, duration_sec: float) -> List[Dict[str, Any]]:
    """Fallback when only unsynced plain lyrics are available: distributes lines across vocal span."""
    raw_lines = [
        ln.strip()
        for ln in (plain_text or "").splitlines()
        if ln.strip() and not ln.strip().startswith("[")
    ]
    if not raw_lines:
        return []
    usable_start = min(8.0, duration_sec * 0.05)
    usable_end = max(usable_start + 10.0, duration_sec * 0.92)
    step = (usable_end - usable_start) / max(1, len(raw_lines))
    result: List[Dict[str, Any]] = []
    for i, txt in enumerate(raw_lines):
        s = round(usable_start + i * step, 2)
        e = round(s + step, 2)
        result.append({"start_sec": s, "end_sec": e, "text": txt})
    return result


def _fetch_from_lrclib(title: str, duration_sec: float) -> Tuple[List[Dict[str, Any]], str]:
    """Queries LRCLIB for synchronized LRC karaoke lyrics. Returns (lines, source_tag)."""
    meta = clean_song_title_for_search(title)
    queries_to_try = []
    if meta["artist"] and meta["track"]:
        queries_to_try.append(
            f"https://lrclib.net/api/search?artist_name={urllib.parse.quote(meta['artist'])}&track_name={urllib.parse.quote(meta['track'])}"
        )
    if meta["query"]:
        queries_to_try.append(
            f"https://lrclib.net/api/search?q={urllib.parse.quote(meta['query'])}"
        )
    if meta["track"] and meta["track"] != meta["query"]:
        queries_to_try.append(
            f"https://lrclib.net/api/search?q={urllib.parse.quote(meta['track'])}"
        )

    headers = {
        "User-Agent": "KythraStudio/1.2.0 (https://kythrastudio.local)",
        "Accept": "application/json",
    }

    for url in queries_to_try:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=4.5) as resp:
                if resp.status != 200:
                    continue
                items = json.loads(resp.read().decode("utf-8", errors="ignore"))
                if not isinstance(items, list) or not items:
                    continue

                synced_candidates = [it for it in items if it.get("syncedLyrics")]
                if synced_candidates:
                    if duration_sec > 0:
                        synced_candidates.sort(
                            key=lambda it: abs(float(it.get("duration") or duration_sec) - duration_sec)
                        )
                    for cand in synced_candidates:
                        parsed = parse_lrc_to_lines(cand["syncedLyrics"], duration_sec=duration_sec)
                        if len(parsed) >= 4:
                            logger.info(
                                "LRCLIB matched synced karaoke lyrics (%d lines) for '%s'",
                                len(parsed),
                                title,
                            )
                            return parsed, "lrclib"
        except Exception as e:
            logger.debug("LRCLIB lookup warning for %s: %s", url, e)

    return [], "none"


def parse_vtt_to_lines(vtt_content: str, duration_sec: float = 240.0) -> List[Dict[str, Any]]:
    """Parses WebVTT (.vtt) subtitles into deduplicated karaoke lyric lines."""
    if not vtt_content:
        return []
    lines: List[Dict[str, Any]] = []
    blocks = re.split(r"\n\s*\n", vtt_content.strip())
    last_text = ""

    for block in blocks:
        block_lines = [ln.strip() for ln in block.splitlines() if ln.strip()]
        if not block_lines:
            continue
        time_match = None
        text_start_idx = 0
        for idx, bl in enumerate(block_lines):
            m = _VTT_TIME_RE.search(bl)
            if m:
                time_match = m
                text_start_idx = idx + 1
                break
        if not time_match or text_start_idx >= len(block_lines):
            continue

        h1 = int(time_match.group(1) or 0)
        m1 = int(time_match.group(2))
        s1 = int(time_match.group(3))
        ms1 = int(time_match.group(4))
        start_sec = round(h1 * 3600 + m1 * 60 + s1 + ms1 / 1000.0, 2)

        h2 = int(time_match.group(5) or 0)
        m2 = int(time_match.group(6))
        s2 = int(time_match.group(7))
        ms2 = int(time_match.group(8))
        end_sec = round(max(start_sec + 0.6, h2 * 3600 + m2 * 60 + s2 + ms2 / 1000.0), 2)

        raw_txt = " ".join(block_lines[text_start_idx:])
        clean_txt = re.sub(r"<[^>]+>", "", raw_txt)
        clean_txt = re.sub(r"\[(?:Music|Applause|Laughter|Müzik|Alkış)\]", "", clean_txt, flags=re.IGNORECASE)
        clean_txt = re.sub(r"\s+", " ", clean_txt).strip(" ♪♫-")

        if not clean_txt or len(clean_txt) < 2 or clean_txt.lower() == last_text.lower():
            continue
        last_text = clean_txt
        lines.append({
            "start_sec": start_sec,
            "end_sec": min(end_sec, round(duration_sec, 2)),
            "text": clean_txt,
        })

    return lines


def fetch_synchronized_lyrics_with_source(
    title: str,
    duration_sec: float = 240.0,
) -> Tuple[List[Dict[str, Any]], str]:
    """
    Fetches time-synchronized karaoke lyrics and returns (lines, lyrics_source).
    lyrics_source is one of:
    - 'lrclib': Verified official synced lyrics from LRCLIB (locked from public editing)
    - 'none': Not found automatically (user editable)
    """
    if title:
        try:
            lines, src = _fetch_from_lrclib(title, duration_sec=duration_sec)
            if lines and src == "lrclib":
                return lines, "lrclib"
        except Exception as e:
            logger.warning("LRCLIB fetch error for '%s': %s", title, e)

    return [], "none"


def fetch_synchronized_lyrics(
    title: str,
    duration_sec: float = 240.0,
) -> List[Dict[str, Any]]:
    """Backwards-compatible wrapper returning only the lyrics list."""
    lines, _ = fetch_synchronized_lyrics_with_source(
        title=title,
        duration_sec=duration_sec,
    )
    return lines
