const API_BASE = '/api/workbench';

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  fallbackErrorPrefix = 'API hatası'
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = typeof err?.detail === 'string' ? err.detail : null;
    throw new Error(detail || `${fallbackErrorPrefix}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
