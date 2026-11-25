export type StemCategory = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other' | 'metronome';

export type StemId = string;

export type InstrumentType = 'guitar' | 'piano' | 'ukulele';

export type ChordComplexityMode = 'basic' | 'all';

export type MixPresetId = 'full' | 'guitar_backing' | 'vocal_karaoke' | 'guitar_focus' | 'rhythm_section';

export type DockerPopoverId = 'instrument' | 'speed' | 'pitch_capo' | 'mixer' | 'settings' | null;

export type AppLanguage = 'en' | 'tr';

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
  category: StemCategory;
  label: string;
  role: string;
  icon: string;
  color: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  detected: boolean;
  presenceLabel: string;
  rmsDbfs?: number;
  audioUrl?: string;
}

export interface LyricWordItem {
  word: string;
  startSec: number;
  endSec: number;
}

export interface LyricLineItem {
  startSec: number;
  endSec: number;
  text: string;
  words?: LyricWordItem[];
}

export type LyricsSourceType = 'lrclib' | 'ai' | 'user' | 'none';

export interface StudioSong {
  id: string;
  trackKey: string;
  isPrivate?: boolean;
  stemOrder?: string[];
  source: 'live' | 'empty';
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
  lyrics: LyricLineItem[];
  lyricsSource?: LyricsSourceType;
  lyricsLocked?: boolean;
  lyricsVersion?: number;
  lyricsUpdatedBy?: string | null;
  waveformPeaks: number[];
  stage3Status: 'pending' | 'running' | 'completed' | 'error';
  stage4Status?: 'pending' | 'running' | 'completed' | 'error';
  sectionsRefining?: boolean;
  pipelineVersion?: string;
  cacheHit?: boolean;
  masterAudioUrl?: string;
  stems: Record<string, {
    id: string;
    label?: string;
    category: StemCategory;
    url?: string;
    detected: boolean;
    rmsDbfs?: number;
    presenceLabel: string;
  }>;
}

export interface StudioUser {
  id: string;
  email: string;
  username: string;
  role?: 'user' | 'developer';
}

export interface FavoriteSongItem {
  track_key: string;
  title: string;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  is_private?: boolean;
  created_at: string;
}

export interface PrivateUploadedSongItem {
  track_key: string;
  title: string;
  duration_sec: number;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  primary_progression: string;
  pipeline_version: string;
  is_private: boolean;
  updated_at: string;
}

export interface LyricRevisionItem {
  id: number;
  track_key: string;
  version_num: number;
  user_id?: string | null;
  username: string;
  change_summary: string;
  created_at: string;
}

export interface LibrarySongItem {
  track_key: string;
  title: string;
  duration_sec: number;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  primary_progression: string;
  pipeline_version: string;
  is_current_version: boolean;
  is_private?: boolean;
  updated_at: string;
}
