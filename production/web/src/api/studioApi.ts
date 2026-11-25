import {
  BarChordItem,
  BeatItem,
  FavoriteSongItem,
  LibrarySongItem,
  LyricLineItem,
  LyricRevisionItem,
  LyricsSourceType,
  PrivateUploadedSongItem,
  SongSection,
  StemCategory,
  StudioSong,
  StudioUser
} from '../types/studio';
import { deleteCachedTrackFromClientDb } from '../utils/clientAudioCache';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

const SESSION_STORAGE_KEY = 'kythra_isolated_session_id';
const AUTH_TOKEN_STORAGE_KEY = 'kythra_auth_token';

const VALID_STEM_CATEGORIES = new Set<StemCategory>([
  'guitar',
  'bass',
  'drums',
  'vocals',
  'piano',
  'other'
]);

export function getOrCreateClientSessionId(): string {
  if (typeof window === 'undefined') return 'default';
  try {
    let sid = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      const rnd =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
          : Math.random().toString(36).slice(2, 14) + Date.now().toString(36);
      sid = `sess_${rnd}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return 'default';
  }
}

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function buildStudioHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Session-Id': getOrCreateClientSessionId(),
    ...(extra || {})
  };
  const token = getStoredAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

const DEFAULT_WAVEFORM: number[] = Array.from({ length: 120 }, () => 0.2);

export const EMPTY_STUDIO_SONG: StudioSong = {
  id: 'empty-session',
  trackKey: '',
  source: 'empty',
  title: 'Kythra Studio',
  artist: 'KythraStudio',
  durationSec: 0,
  tempoBpm: 120,
  timeSignature: '4/4',
  keySignature: 'C major',
  primaryProgression: '',
  totalBars: 0,
  sections: [],
  bars: [],
  beats: [],
  lyrics: [],
  lyricsSource: 'none',
  lyricsLocked: false,
  lyricsVersion: 1,
  waveformPeaks: DEFAULT_WAVEFORM,
  stage3Status: 'pending',
  stems: {}
};

function cleanChord(raw: string | undefined): string {
  if (!raw || raw === 'N' || raw === 'N.C.') return 'N.C.';
  return raw.replace(':min', 'm').replace(':maj', '').replace(':', '');
}

function normalizeCategory(raw: unknown, fallbackId: string): StemCategory {
  const candidate = String(raw || fallbackId).toLowerCase() as StemCategory;
  return VALID_STEM_CATEGORIES.has(candidate) ? candidate : 'other';
}

export function bundleToStudioSong(bundle: any): StudioSong | null {
  const state = bundle?.state;
  if (!state?.has_session) return null;

  const s1 = bundle?.stage1 || {};
  const s2 = bundle?.stage2 || {};
  const s3 = bundle?.stage3 || {};

  const trackName = String(state.track_name || 'Studio Session');
  const trackKey = String(state.track_key || `title:${trackName}`);
  const isPrivate = Boolean(bundle?.is_private ?? state?.is_private ?? trackKey.startsWith('sha256:'));
  const durationSec = Number(state.duration_sec || 180);
  const tempoBpm = Number(s1.tempo_bpm ? Number(s1.tempo_bpm).toFixed(1) : 120.0);
  const timeSignature = String(s1.time_signature || '4/4');
  const keySignature = String(s2.key_signature || 'C major');
  const stage3Status = (state?.stages?.['3']?.status || 'pending') as StudioSong['stage3Status'];

  const beats: BeatItem[] = Array.from(Array.isArray(s1.beats) ? s1.beats : []).map((b: any, idx: number) => ({
    beatNumber: Number(b.beat_number || (idx % 4) + 1),
    timeSec: Number(b.time_sec || 0),
    isDownbeat: Boolean(b.is_downbeat || b.beat_number === 1),
    barIndex: Number(b.bar_index ?? Math.floor(idx / 4))
  }));

  const rawBars = Array.isArray(s2.bars) ? s2.bars : [];
  const bars: BarChordItem[] = rawBars.map((b: any, idx: number) => {
    const chord = cleanChord(b.chord);
    const subChords = Array.isArray(b.chords)
      ? b.chords.map((sc: any) => ({
          chord: cleanChord(sc.chord),
          startSec: Number(sc.start_sec || b.start_sec || 0),
          endSec: Number(sc.end_sec || b.end_sec || 0),
          durationSec: Number(sc.duration_sec || 0)
        }))
      : [];
    return {
      barNumber: Number(b.bar_number || idx + 1),
      startSec: Number(b.start_sec || 0),
      endSec: Number(b.end_sec || 0),
      durationSec: Number(b.duration_sec || 2.0),
      chord,
      subChords
    };
  });

  if (bars.length === 0) {
    const estBarDur = (4 * 60) / Math.max(40, tempoBpm);
    const count = Math.max(8, Math.ceil(durationSec / estBarDur));
    for (let i = 0; i < count; i++) {
      bars.push({
        barNumber: i + 1,
        startSec: Number((i * estBarDur).toFixed(2)),
        endSec: Number(Math.min(durationSec, (i + 1) * estBarDur).toFixed(2)),
        durationSec: Number(estBarDur.toFixed(2)),
        chord: '—',
        subChords: []
      });
    }
  }

  const rawSections = Array.isArray(s2.sections) ? s2.sections : [];
  const sections: SongSection[] = rawSections.map((sec: any, idx: number) => ({
    id: `sec-${idx + 1}`,
    name: String(sec.name || `Section ${idx + 1}`),
    rawLabel: String(sec.raw_label || 'verse'),
    startBar: Number(sec.start_bar || 1),
    endBar: Number(sec.end_bar || bars.length),
    startSec: Number(sec.start_sec || 0),
    endSec: Number(sec.end_sec || durationSec)
  }));

  if (sections.length === 0) {
    sections.push({
      id: 'sec-1',
      name: 'Intro',
      rawLabel: 'intro',
      startBar: 1,
      endBar: bars.length,
      startSec: 0,
      endSec: durationSec
    });
  }

  const primaryProgression =
    s2.primary_progression ||
    Array.from(new Set(bars.map((b) => b.chord).filter((c) => c !== 'N.C.' && c !== '—')))
      .slice(0, 8)
      .join(' → ') ||
    'N/A';

  const stems: StudioSong['stems'] = {};
  const isStage3Done = stage3Status === 'completed';
  const s3Stems = (s3?.stems && typeof s3.stems === 'object') ? s3.stems : {};
  const defaultStandardIds = ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'];
  const rawOrder: string[] = Array.isArray(s3?.channel_order) && s3.channel_order.length > 0
    ? s3.channel_order
    : Object.keys(s3Stems).length > 0
    ? Object.keys(s3Stems)
    : defaultStandardIds;

  const cacheBust = encodeURIComponent(trackName);
  const sidParam = encodeURIComponent(getOrCreateClientSessionId());
  const hasSourceAudio = Boolean(bundle?.has_source_audio ?? false);
  const stemOrder: string[] = [];

  if (isStage3Done) {
    for (const id of rawOrder) {
      const info = s3Stems[id];
      if (!info && Object.keys(s3Stems).length > 0) continue;
      const detected =
        typeof info?.detected === 'boolean'
          ? info.detected
          : info?.rms_dbfs !== undefined
          ? info.rms_dbfs > -48
          : true;
      const category = normalizeCategory(info?.category, id);
      stemOrder.push(id);
      stems[id] = {
        id,
        category,
        url: hasSourceAudio
          ? `${API_BASE}/api/workbench/stream/${encodeURIComponent(id)}?track=${cacheBust}&session_id=${sidParam}`
          : undefined,
        detected,
        rmsDbfs: info?.rms_dbfs,
        presenceLabel: detected ? 'Active Signal' : 'Silent'
      };
    }
  }

  const waveformPeaks: number[] =
    Array.isArray(bundle?.waveform_peaks) && bundle.waveform_peaks.length > 0
      ? bundle.waveform_peaks
      : Array.isArray(state?.waveform_peaks) && state.waveform_peaks.length > 0
      ? state.waveform_peaks
      : DEFAULT_WAVEFORM;

  const rawLyrics = Array.isArray(bundle?.lyrics)
    ? bundle.lyrics
    : Array.isArray(state?.lyrics)
    ? state.lyrics
    : [];
  const lyrics: LyricLineItem[] = rawLyrics
    .map((ln: any) => ({
      startSec: Number(ln.start_sec ?? ln.startSec ?? 0),
      endSec: Number(ln.end_sec ?? ln.endSec ?? 0),
      text: String(ln.text || '').trim(),
      words: Array.isArray(ln.words)
        ? ln.words
            .map((w: any) => ({
              word: String(w.word || '').trim(),
              startSec: Number(w.start_sec ?? w.startSec ?? 0),
              endSec: Number(w.end_sec ?? w.endSec ?? 0)
            }))
            .filter((w: { word: string }) => w.word.length > 0)
        : undefined
    }))
    .filter((ln: LyricLineItem) => ln.text.length > 0);

  const lyricsSource = (bundle?.lyrics_source || state?.lyrics_source || 'none') as LyricsSourceType;
  const lyricsLocked = Boolean(bundle?.lyrics_locked ?? state?.lyrics_locked ?? (lyricsSource === 'lrclib' && !isPrivate && lyrics.length > 0));
  const lyricsVersion = Number(bundle?.lyrics_version || state?.lyrics_version || 1);
  const lyricsUpdatedBy = bundle?.lyrics_updated_by || state?.lyrics_updated_by || null;

  const parts = trackName.split(/\s+[-—]\s+/);
  const artist = parts.length > 1 ? parts[0].trim() : 'KythraStudio';

  return {
    id: `live-${trackKey}`,
    trackKey,
    isPrivate,
    stemOrder: stemOrder.length > 0 ? stemOrder : undefined,
    source: 'live',
    title: trackName,
    artist,
    durationSec,
    tempoBpm,
    timeSignature,
    keySignature,
    primaryProgression,
    totalBars: bars.length,
    sections,
    bars,
    beats,
    lyrics,
    lyricsSource,
    lyricsLocked,
    lyricsVersion,
    lyricsUpdatedBy,
    waveformPeaks,
    stage3Status,
    pipelineVersion: bundle?.pipeline_version,
    cacheHit: Boolean(bundle?.cache_hit),
    masterAudioUrl: hasSourceAudio
      ? `${API_BASE}/api/workbench/stream/master?track=${cacheBust}&session_id=${sidParam}`
      : undefined,
    stems
  };
}

export async function fetchActiveStudioSong(): Promise<StudioSong | null> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/studio-bundle`, {
      headers: buildStudioHeaders()
    });
    if (!res.ok) return null;
    const bundle = await res.json();
    const s1Done = bundle?.state?.stages?.['1']?.status === 'completed';
    const s2Done = bundle?.state?.stages?.['2']?.status === 'completed';
    if (!s1Done || !s2Done) return null;
    return bundleToStudioSong(bundle);
  } catch {
    return null;
  }
}

export async function fetchLibrarySongs(): Promise<LibrarySongItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/library`, {
      headers: buildStudioHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.songs) ? data.songs : [];
  } catch {
    return [];
  }
}

export async function loadAndPrepareUploadedFile(
  file: File,
  onStatus?: (msg: string) => void
): Promise<StudioSong> {
  onStatus?.('upload');
  const formData = new FormData();
  formData.append('file', file);
  const ingRes = await fetch(`${API_BASE}/api/workbench/session/upload`, {
    method: 'POST',
    headers: buildStudioHeaders(),
    body: formData
  });
  if (!ingRes.ok) {
    const err = await ingRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not upload audio file.');
  }

  onStatus?.('prepare');
  const prepRes = await fetch(`${API_BASE}/api/workbench/prepare-studio?background_stems=true`, {
    method: 'POST',
    headers: buildStudioHeaders()
  });
  if (!prepRes.ok) {
    const err = await prepRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not prepare studio.');
  }
  const bundle = await prepRes.json();
  const song = bundleToStudioSong(bundle);
  if (!song) throw new Error('Could not build song bundle.');
  return song;
}

export async function loadCachedSongByTrackKey(trackKey: string): Promise<StudioSong> {
  const res = await fetch(
    `${API_BASE}/api/workbench/session/load-track?track_key=${encodeURIComponent(trackKey)}`,
    {
      method: 'POST',
      headers: buildStudioHeaders()
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not load song.');
  }
  const bundle = await res.json();
  const song = bundleToStudioSong(bundle);
  if (!song) throw new Error('Could not parse song.');
  return song;
}

// ============================================================================
// AUTHENTICATION, FAVORITES & LYRICS REVISION API
// ============================================================================
export interface AccountOverviewResponse {
  authenticated: boolean;
  user: StudioUser | null;
  favorites: FavoriteSongItem[];
  private_uploads: PrivateUploadedSongItem[];
}

export async function fetchAccountOverview(): Promise<AccountOverviewResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/auth/me`, {
      headers: buildStudioHeaders()
    });
    if (!res.ok) {
      return { authenticated: false, user: null, favorites: [], private_uploads: [] };
    }
    const data = await res.json();
    return {
      authenticated: Boolean(data?.authenticated),
      user: data?.user || null,
      favorites: Array.isArray(data?.favorites) ? data.favorites : [],
      private_uploads: Array.isArray(data?.private_uploads) ? data.private_uploads : []
    };
  } catch {
    return { authenticated: false, user: null, favorites: [], private_uploads: [] };
  }
}

export async function registerStudioUser(
  email: string,
  username: string,
  password: string
): Promise<{ token: string; user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/register`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email, username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Registration failed.');
  }
  setStoredAuthToken(data.token);
  return data;
}

export async function loginStudioUser(
  emailOrUsername: string,
  password: string
): Promise<{ token: string; user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/login`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email_or_username: emailOrUsername, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Sign in failed.');
  }
  setStoredAuthToken(data.token);
  return data;
}

export function logoutStudioUser(): void {
  setStoredAuthToken(null);
}

export async function updateUserProfile(
  email: string,
  username: string,
  newPassword?: string
): Promise<{ user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/profile`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      email: email.trim(),
      username: username.trim(),
      new_password: newPassword && newPassword.trim() ? newPassword : null
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not update profile.');
  }
  return data;
}

export async function toggleFavoriteSong(song: StudioSong): Promise<{
  is_favorite: boolean;
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(`${API_BASE}/api/workbench/account/favorites/toggle`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      track_key: song.trackKey,
      title: song.title,
      tempo_bpm: song.tempoBpm,
      key_signature: song.keySignature,
      time_signature: song.timeSignature
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not update favorites.');
  }
  return data;
}

export async function renameUploadedTrack(
  trackKey: string,
  title: string
): Promise<{
  track_key: string;
  title: string;
  private_uploads: PrivateUploadedSongItem[];
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(`${API_BASE}/api/workbench/account/uploads/rename`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ track_key: trackKey, title: title.trim() })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not rename track.');
  }
  return data;
}

export async function deleteUploadedTrack(trackKey: string): Promise<{
  track_key: string;
  reset_active: boolean;
  private_uploads: PrivateUploadedSongItem[];
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(
    `${API_BASE}/api/workbench/account/uploads?track_key=${encodeURIComponent(trackKey)}`,
    {
      method: 'DELETE',
      headers: buildStudioHeaders()
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not delete track.');
  }
  await deleteCachedTrackFromClientDb(trackKey);
  return data;
}

export async function saveSongLyricsEdit(
  trackKey: string,
  lyrics: LyricLineItem[],
  changeSummary?: string
): Promise<{
  lyrics: LyricLineItem[];
  lyrics_source: LyricsSourceType;
  lyrics_locked: boolean;
  lyrics_version: number;
  lyrics_updated_by: string;
  revisions: LyricRevisionItem[];
}> {
  const payloadLyrics = lyrics.map((ln) => ({
    start_sec: Number(ln.startSec.toFixed(2)),
    end_sec: Number(ln.endSec.toFixed(2)),
    text: ln.text.trim()
  }));
  const res = await fetch(`${API_BASE}/api/workbench/lyrics`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      track_key: trackKey,
      lyrics: payloadLyrics,
      change_summary: changeSummary || ''
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not save lyrics.');
  }
  return {
    ...data,
    lyrics
  };
}

export async function fetchLyricRevisions(trackKey: string): Promise<LyricRevisionItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/workbench/lyrics/revisions?track_key=${encodeURIComponent(trackKey)}`,
      { headers: buildStudioHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.revisions) ? data.revisions : [];
  } catch {
    return [];
  }
}
