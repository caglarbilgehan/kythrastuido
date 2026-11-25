export type StemId = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other';

export type MixPresetId = 'full' | 'guitar_backing' | 'vocal_karaoke' | 'guitar_focus' | 'rhythm_section';

export interface BeatItem {
  beatNumber: number;
  timeSec: number;
  isDownbeat: boolean;
  barIndex: number;
}

export interface SubChordEvent {
  chord: string;
  startSec: number;
  endSec: number;
  durationSec: number;
}

export interface BarChordItem {
  barNumber: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  chord: string;
  subChords: SubChordEvent[];
}

export interface SongSection {
  id: string;
  name: string;
  rawLabel: string;
  startBar: number;
  endBar: number;
  startSec: number;
  endSec: number;
}

export interface StemChannelState {
  id: StemId;
  label: string;
  role: string;
  color: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  detected: boolean;
  presenceLabel: string;
  rmsDbfs?: number;
  audioUrl?: string;
}

export interface StudioSong {
  id: string;
  source: 'live' | 'demo';
  title: string;
  artist: string;
  durationSec: number;
  tempoBpm: number;
  timeSignature: string;
  keySignature: string;
  primaryProgression: string;
  totalBars: number;
  sections: SongSection[];
  bars: BarChordItem[];
  beats: BeatItem[];
  masterAudioUrl?: string;
  stems: Partial<Record<StemId, {
    url: string;
    detected: boolean;
    rmsDbfs?: number;
    presenceLabel: string;
  }>>;
}

export interface BenchmarkTrackItem {
  id: string;
  name: string;
  category: string;
  duration_sec: number;
  description: string;
}

export interface PipelineProgressStep {
  stageNum: 1 | 2 | 3;
  title: string;
  subtitle: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  summary?: string;
}
