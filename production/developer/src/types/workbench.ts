export type StageStatus = 'pending' | 'running' | 'completed' | 'error';

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

export interface SessionState {
  has_session: boolean;
  track_name: string | null;
  duration_sec: number | null;
  sample_rate: number | null;
  channels: number | null;
  device?: string;
  stages: Record<string, StageMetadata>;
  audio_url: string | null;
  sections?: SongSection[];
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
}


