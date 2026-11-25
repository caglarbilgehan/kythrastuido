import { SessionState } from '../types/workbench';
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

export function runAllStages(): Promise<{
  status: string;
  execution_mode?: string;
  wall_time_ms?: number;
  sequential_sum_ms?: number;
  results?: Record<number, any>;
  state: SessionState;
}> {
  return apiRequest('/run-all', { method: 'POST' }, 'Parallel DAG execution failed');
}

export function resetSession(): Promise<{ status: string; state: SessionState }> {
  return apiRequest('/session/reset', { method: 'POST' }, 'Reset failed');
}

export function getLogs(
  sinceId = 0,
  stageNum?: number,
  limit = 200
): Promise<{ logs: import('../types/workbench').LogEntry[]; last_id: number }> {
  const params = new URLSearchParams({ since_id: String(sinceId), limit: String(limit) });
  if (stageNum !== undefined && stageNum !== null) {
    params.set('stage_num', String(stageNum));
  }
  return apiRequest(`/logs?${params.toString()}`, {}, 'Failed to fetch logs');
}

export function clearLogs(): Promise<{ status: string; message: string }> {
  return apiRequest('/logs/clear', { method: 'POST' }, 'Failed to clear logs');
}

