const API_BASE = '/api/workbench';
const ACTIVE_SESSION_STORAGE_KEY = 'kythra_dev_active_session_id';

let currentSessionId: string = (() => {
  if (typeof window === 'undefined') return 'default';
  try {
    return window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) || 'default';
  } catch {
    return 'default';
  }
})();

export function getActiveSessionId(): string {
  return currentSessionId || 'default';
}

export function setActiveSessionId(sessionId: string): string {
  const clean = (sessionId || 'default').trim() || 'default';
  currentSessionId = clean;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, clean);
    } catch {
      // ignore storage errors
    }
  }
  return clean;
}

export function buildStreamUrl(stemOrMaster: string, trackName?: string | null): string {
  const sid = encodeURIComponent(getActiveSessionId());
  const track = encodeURIComponent(trackName || 'track');
  return `${API_BASE}/stream/${encodeURIComponent(stemOrMaster)}?track=${track}&session_id=${sid}`;
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  fallbackErrorPrefix = 'API hatası'
): Promise<T> {
  const headers = new Headers(options?.headers || {});
  if (!headers.has('X-Session-Id')) {
    headers.set('X-Session-Id', getActiveSessionId());
  }
  if (!headers.has('X-Client-App')) {
    headers.set('X-Client-App', 'developer');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = typeof err?.detail === 'string' ? err.detail : null;
    throw new Error(detail || `${fallbackErrorPrefix}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
