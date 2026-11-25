export type StageStatus = 'pending' | 'running' | 'completed' | 'error';

export type InspectorTab = 'diagnostic' | 'json' | 'console' | 'requests';

export interface StageMetadata {
  id: number;
  title: string;
  operation: string;
  input: string;
  output: string;
  status: StageStatus;
  durationMs: number;
  prerequisites: string;
  diagnosticFocus: string;
  error?: string | null;
}

export interface SongSection {
  name: string;
  start_bar: number;
  end_bar: number;
  start_sec: number;
  end_sec: number;
  color?: string;
}

export interface SessionUserInfo {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  role?: 'user' | 'developer' | string;
}

export interface SessionState {
  has_session: boolean;
  track_name: string | null;
  track_key?: string | null;
  duration_sec: number | null;
  sample_rate: number | null;
  channels: number | null;
  device?: string;
  stages: Record<string, StageMetadata>;
  audio_url: string | null;
  sections?: SongSection[];
  sections_refining?: boolean;
  client_app?: string;
  last_active_at?: string;
  session_user?: SessionUserInfo | null;
}

export interface TelemetrySessionSummary {
  session_id: string;
  has_session: boolean;
  track_name?: string | null;
  track_key?: string | null;
  duration_sec: number;
  last_active_at?: string | null;
  client_app?: string;
  user?: SessionUserInfo | null;
  is_running: boolean;
  sections_refining?: boolean;
  stages: Record<string, { status: StageStatus; timings_ms: number }>;
}

export interface RequestTraceEntry {
  id: number;
  timestamp: string;
  method: string;
  path: string;
  query: string;
  status_code: number;
  duration_ms: number;
  session_id?: string | null;
  client_app: string;
  user?: SessionUserInfo | null;
  track_name?: string | null;
  error_detail?: string | null;
}

export interface StemChannel {
  id: string;
  category?: string;
  channelMode?: 'mono' | 'stereo';
  name: string;
  fileName: string;
  sizeBytes?: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  isSolo: boolean;
  isGuitar?: boolean;
  detected?: boolean;
  presenceLabel?: string;
  isSubStem?: boolean;
  parentChannel?: string;
  panningDesc?: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  logger: string;
  stage_num?: number | null;
  message: string;
  session_id?: string | null;
}
