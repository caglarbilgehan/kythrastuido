export interface BeatEventItem {
  beat_number: number;
  time_sec: number;
  is_downbeat: boolean;
  bar_index?: number;
}

export interface Stage1BeatData {
  engine?: string;
  tempo_bpm: number;
  time_signature: string;
  beat_count: number;
  downbeat_count: number;
  beats: BeatEventItem[];
}

export interface ChordSectionItem {
  name: string;
  raw_label?: string;
  start_bar: number;
  end_bar: number;
  start_sec: number;
  end_sec: number;
  color?: string;
}

export interface BarChordItem {
  bar_number: number;
  start_sec: number;
  end_sec: number;
  duration_sec: number;
  chord: string;
  chord_raw: string;
  chords: Array<{
    chord: string;
    chord_raw: string;
    start_sec: number;
    end_sec: number;
    duration_sec: number;
  }>;
}

export interface RawChordItem {
  start_sec: number;
  end_sec: number;
  chord: string;
}

export interface Stage2ChordData {
  engine?: string;
  key_signature?: string;
  chord_count: number;
  bar_count?: number;
  primary_progression?: string;
  sections?: ChordSectionItem[];
  bars?: BarChordItem[];
  chords: RawChordItem[];
}

export interface StemInfoItem {
  id?: string;
  channel: string;
  category?: string;
  parent_channel?: string;
  sub_index?: number;
  label?: string;
  role?: string;
  panning_desc?: string;
  detected?: boolean;
  presence_status?: string;
  presence_label?: string;
  stream_url?: string;
  buffer_size_mb?: number;
  sample_rate_hz?: number;
  duration_sec?: number;
  rms_dbfs?: number;
  peak_dbfs?: number;
  dynamic_range_db?: number;
  isolation_confidence_pct?: number;
  storage_mode?: string;
  amt_ready?: boolean;
  filename?: string;
  size_bytes?: number;
  separation_method?: string;
}

export interface Stage3MssData {
  engine?: string;
  architecture?: string;
  channel_order?: string[];
  sampling_rate_hz?: number;
  detected_count?: number;
  macro_stem_count?: number;
  sub_stem_count?: number;
  detected_channels?: string[];
  absent_channels?: string[];
  bleed_prevention?: string;
  stems?: Record<string, StemInfoItem>;
  sub_stems?: Record<string, StemInfoItem[]>;
  all_channels?: Record<string, StemInfoItem>;
  diagnostics?: {
    guitar_sdr_db?: number;
    bleed_rejection_db?: number;
    guitar_sub_count?: number;
    vocals_sub_count?: number;
    amt_readiness?: string;
  };
}

export interface LyricWordTimestamp {
  word: string;
  start_sec: number;
  end_sec: number;
}

export interface LyricLineTimestamp {
  start_sec: number;
  end_sec: number;
  text: string;
  words?: LyricWordTimestamp[];
}

export interface Stage4LyricsData {
  engine?: string;
  transcription_engine?: string;
  alignment_engine?: string;
  detected_language?: string | null;
  is_instrumental?: boolean;
  vocal_rms_dbfs?: number;
  word_count: number;
  line_count: number;
  inference_sec?: number;
  lines: LyricLineTimestamp[];
  words?: LyricWordTimestamp[];
}

export type StageOutputMap = {
  1?: Stage1BeatData;
  2?: Stage2ChordData;
  3?: Stage3MssData;
  4?: Stage4LyricsData;
  [key: number]: unknown;
};
