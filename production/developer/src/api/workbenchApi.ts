import {
  LogEntry,
  RequestTraceEntry,
  SessionState,
  TelemetrySessionSummary
} from '../types/workbench';
import { apiRequest } from './httpClient';

export function getSession(): Promise<{ state: SessionState }> {
  return apiRequest('/session', undefined, 'State error');
}

export function getStageData<T = any>(stageNum: number): Promise<T> {
  return apiRequest(`/stage/${stageNum}/data`, undefined, 'Stage data error');
}

export function uploadAudio(file: File): Promise<{ status: string; state: SessionState }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest(
    '/session/upload',
    {
      method: 'POST',
      body: formData
    },
    'Upload failed'
  );
}

export function runStage<T = any>(
  stageNum: number
): Promise<{ stage: number; data: T; state: SessionState }> {
  return apiRequest(`/stage/${stageNum}/run`, { method: 'POST' }, `Stage ${stageNum} failed`);
}

export function runAllStages(force = true): Promise<{
  status: string;
  execution_mode?: string;
  ttfo_ms?: number;
  wall_time_ms?: number;
  sequential_sum_ms?: number;
  results?: Record<number, any>;
  state: SessionState;
}> {
  return apiRequest(
    `/run-all?force=${force ? 'true' : 'false'}`,
    { method: 'POST' },
    'Üretim akışı çalıştırılamadı'
  );
}

export function resetSession(): Promise<{ status: string; state: SessionState }> {
  return apiRequest('/session/reset', { method: 'POST' }, 'Reset failed');
}

export function getLogs(
  sinceId = 0,
  stageNum?: number,
  limit = 200,
  filterSessionId?: string | null
): Promise<{ logs: LogEntry[]; last_id: number }> {
  const params = new URLSearchParams({ since_id: String(sinceId), limit: String(limit) });
  if (stageNum !== undefined && stageNum !== null) {
    params.set('stage_num', String(stageNum));
  }
  if (filterSessionId) {
    params.set('filter_session_id', filterSessionId);
  }
  return apiRequest(`/logs?${params.toString()}`, {}, 'Failed to fetch logs');
}

export function clearLogs(): Promise<{ status: string; message: string }> {
  return apiRequest('/logs/clear', { method: 'POST' }, 'Failed to clear logs');
}

export function getTelemetrySessions(): Promise<{ sessions: TelemetrySessionSummary[] }> {
  return apiRequest('/telemetry/sessions', undefined, 'Oturum listesi alınamadı');
}

export function getTelemetryRequests(params?: {
  sinceId?: number;
  sessionId?: string | null;
  onlyErrors?: boolean;
  limit?: number;
}): Promise<{ requests: RequestTraceEntry[]; last_id: number }> {
  const qs = new URLSearchParams({
    since_id: String(params?.sinceId ?? 0),
    limit: String(params?.limit ?? 200)
  });
  if (params?.sessionId) {
    qs.set('session_id', params.sessionId);
  }
  if (params?.onlyErrors) {
    qs.set('only_errors', 'true');
  }
  return apiRequest(`/telemetry/requests?${qs.toString()}`, undefined, 'İstek geçmişi alınamadı');
}

export function clearTelemetryRequests(): Promise<{ status: string; message: string }> {
  return apiRequest('/telemetry/requests/clear', { method: 'POST' }, 'İstek geçmişi temizlenemedi');
}
