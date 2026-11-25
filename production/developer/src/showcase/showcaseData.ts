import { DEFAULT_STAGES } from '../constants/stages';
import {
  Stage1BeatData,
  Stage2ChordData,
  Stage3MssData,
  Stage4LyricsData,
  StageOutputMap
} from '../types/stages';
import {
  InspectorTab,
  LogEntry,
  RequestTraceEntry,
  SessionState,
  StageMetadata,
  StemChannel,
  TelemetrySessionSummary
} from '../types/workbench';

export type DeveloperShowcaseView =
  | 'empty'
  | 'stage1'
  | 'stage2'
  | 'pipeline'
  | 'stage3'
  | 'stems'
  | 'stage4'
  | 'json'
  | 'console'
  | 'requests'
  | 'source-modal'
  | 'source-modal-loading'
  | 'sessions-menu'
  | 'mixer-popover'
  | 'running'
  | 'pending'
  | 'error';
export type DeveloperShowcaseTheme = 'light' | 'dark';

export interface DeveloperShowcaseConfig {
  view: DeveloperShowcaseView;
  theme: DeveloperShowcaseTheme;
  stageId: number;
  tab: InspectorTab;
}

const TEMPO_BPM = 118;
const BEAT_SEC = 60 / TEMPO_BPM;
const BAR_SEC = BEAT_SEC * 4;
const TOTAL_BARS = 32;
const round3 = (n: number) => Math.round(n * 1000) / 1000;

export const DEV_SHOWCASE_SESSION_ID = 'sess_web_bilgehan_01';
export const DEV_SHOWCASE_CURRENT_TIME = round3(12 * BAR_SEC + BEAT_SEC * 1.3);

const SHOWCASE_SECTION_DEFS = [
  { name: 'Intro', raw_label: 'intro', start_bar: 1, end_bar: 4, pattern: ['Am7', 'Fmaj7', 'C', 'G'] },
  { name: 'Verse 1', raw_label: 'verse', start_bar: 5, end_bar: 12, pattern: ['Am', 'Em7', 'Fmaj7', 'G'] },
  { name: 'Chorus 1', raw_label: 'chorus', start_bar: 13, end_bar: 20, pattern: ['Fmaj7', 'Am7', 'G', 'C'] },
  { name: 'Verse 2', raw_label: 'verse', start_bar: 21, end_bar: 28, pattern: ['Am', 'Dm7', 'Fmaj7', 'E7'] },
  { name: 'Outro', raw_label: 'outro', start_bar: 29, end_bar: 32, pattern: ['Am7', 'Fmaj7', 'C', 'G'] }
];

const DEV_SECTIONS = SHOWCASE_SECTION_DEFS.map((s) => ({
  name: s.name,
  raw_label: s.raw_label,
  start_bar: s.start_bar,
  end_bar: s.end_bar,
  start_sec: round3((s.start_bar - 1) * BAR_SEC),
  end_sec: round3(s.end_bar * BAR_SEC)
}));

const DEV_BEATS: Stage1BeatData['beats'] = [];
const DEV_BARS: NonNullable<Stage2ChordData['bars']> = [];
const DEV_RAW_CHORDS: Stage2ChordData['chords'] = [];

let beatCounter = 1;
for (let bar = 1; bar <= TOTAL_BARS; bar++) {
  const sec =
    SHOWCASE_SECTION_DEFS.find((s) => bar >= s.start_bar && bar <= s.end_bar) ||
    SHOWCASE_SECTION_DEFS[0];
  const startSec = round3((bar - 1) * BAR_SEC);
  const endSec = round3(bar * BAR_SEC);
  const chord = sec.pattern[(bar - sec.start_bar) % sec.pattern.length];

  DEV_BARS.push({
    bar_number: bar,
    start_sec: startSec,
    end_sec: endSec,
    duration_sec: round3(BAR_SEC),
    chord,
    chord_raw: chord,
    chords: [
      {
        chord,
        chord_raw: chord,
        start_sec: startSec,
        end_sec: endSec,
        duration_sec: round3(BAR_SEC)
      }
    ]
  });

  DEV_RAW_CHORDS.push({
    start_sec: startSec,
    end_sec: endSec,
    chord
  });

  for (let b = 0; b < 4; b++) {
    DEV_BEATS.push({
      beat_number: beatCounter++,
      time_sec: round3(startSec + b * BEAT_SEC),
      is_downbeat: b === 0,
      bar_index: bar - 1
    });
  }
}

const TOTAL_DURATION_SEC = round3(TOTAL_BARS * BAR_SEC);

const DEV_STAGE_TIMINGS: Record<number, number> = {
  1: 11420,
  2: 4820,
  3: 27350,
  4: 8410
};

const DEV_STAGE_MAP: Record<string, StageMetadata> = {};
for (const def of DEFAULT_STAGES) {
  DEV_STAGE_MAP[String(def.id)] = {
    ...def,
    status: 'completed',
    durationMs: DEV_STAGE_TIMINGS[def.id] || 4000,
    error: null
  };
}

export const DEV_SHOWCASE_SESSION: SessionState = {
  has_session: true,
  track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
  track_key: 'upload_showcase_midnight_echoes',
  duration_sec: TOTAL_DURATION_SEC,
  sample_rate: 44100,
  channels: 2,
  device: 'cuda:0 (RTX 4060 8GB)',
  stages: DEV_STAGE_MAP,
  audio_url: null,
  sections: DEV_SECTIONS,
  sections_refining: false,
  client_app: 'web',
  last_active_at: '2026-11-25T14:52:18Z',
  session_user: {
    id: 'dev-user-01',
    username: 'Bilgehan',
    email: 'bilgehan@kythrastudio.com',
    role: 'developer'
  }
};

export const DEV_SHOWCASE_TELEMETRY_SESSIONS: TelemetrySessionSummary[] = [
  {
    session_id: DEV_SHOWCASE_SESSION_ID,
    has_session: true,
    track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    track_key: 'upload_showcase_midnight_echoes',
    duration_sec: TOTAL_DURATION_SEC,
    last_active_at: '2026-11-25T14:52:18Z',
    client_app: 'web',
    user: {
      id: 'dev-user-01',
      username: 'Bilgehan',
      email: 'bilgehan@kythrastudio.com',
      role: 'developer'
    },
    is_running: false,
    sections_refining: false,
    stages: {
      '1': { status: 'completed', timings_ms: 11420 },
      '2': { status: 'completed', timings_ms: 4820 },
      '3': { status: 'completed', timings_ms: 27350 },
      '4': { status: 'completed', timings_ms: 8410 }
    }
  },
  {
    session_id: 'sess_web_guest_94f2',
    has_session: true,
    track_name: 'Arctic Monkeys — 505',
    track_key: 'library_arctic_monkeys_505',
    duration_sec: 253,
    last_active_at: '2026-11-25T14:51:44Z',
    client_app: 'web',
    user: null,
    is_running: true,
    sections_refining: true,
    stages: {
      '1': { status: 'completed', timings_ms: 10910 },
      '2': { status: 'completed', timings_ms: 4210 },
      '3': { status: 'running', timings_ms: 0 },
      '4': { status: 'pending', timings_ms: 0 }
    }
  },
  {
    session_id: 'default',
    has_session: true,
    track_name: 'Red Hot Chili Peppers — Californication',
    track_key: 'library_red_hot_californication',
    duration_sec: 329,
    last_active_at: '2026-11-25T14:38:05Z',
    client_app: 'developer',
    user: {
      id: 'dev-user-01',
      username: 'Bilgehan',
      email: 'bilgehan@kythrastudio.com',
      role: 'developer'
    },
    is_running: false,
    sections_refining: false,
    stages: {
      '1': { status: 'completed', timings_ms: 12180 },
      '2': { status: 'completed', timings_ms: 5110 },
      '3': { status: 'completed', timings_ms: 29440 },
      '4': { status: 'completed', timings_ms: 9120 }
    }
  }
];

const DEV_STAGE1_DATA: Stage1BeatData = {
  engine: 'madmom DBNBeatTracker + DownbeatTrackingProcessor',
  tempo_bpm: TEMPO_BPM,
  time_signature: '4/4',
  beat_count: DEV_BEATS.length,
  downbeat_count: TOTAL_BARS,
  beats: DEV_BEATS
};

const DEV_STAGE2_DATA: Stage2ChordData = {
  engine: 'BTC Transformer Large-Voca + allin1 (Stem-Shared)',
  key_signature: 'Am',
  chord_count: DEV_RAW_CHORDS.length,
  bar_count: TOTAL_BARS,
  primary_progression: 'Am7 – Fmaj7 – C – G',
  sections: DEV_SECTIONS,
  bars: DEV_BARS,
  chords: DEV_RAW_CHORDS
};

const DEV_STAGE3_DATA: Stage3MssData = {
  engine: 'BS-RoFormer-SW (6-Stem · AMP FP16 · Batch=2)',
  architecture: 'Band-Split RoFormer 6-Channel',
  channel_order: ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'],
  sampling_rate_hz: 44100,
  detected_count: 6,
  macro_stem_count: 6,
  sub_stem_count: 0,
  detected_channels: ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'],
  absent_channels: [],
  bleed_prevention: 'Aktif (-28.4 dB Crosstalk Suppression)',
  diagnostics: {
    guitar_sdr_db: 11.8,
    bleed_rejection_db: 28.4,
    guitar_sub_count: 1,
    vocals_sub_count: 1,
    amt_readiness: 'V2+ Ready (Hi-Fi 44.1 kHz)'
  },
  stems: {
    guitar: {
      id: 'guitar',
      channel: 'guitar',
      category: 'guitar',
      label: 'Gitar',
      role: 'Ritim & Lead Gitar Katmanı',
      detected: true,
      presence_status: 'active',
      presence_label: 'Aktif Sinyal',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -13.4,
      peak_dbfs: -1.8,
      dynamic_range_db: 11.6,
      isolation_confidence_pct: 96.4,
      storage_mode: 'persistent_disk_wav',
      amt_ready: true,
      filename: 'guitar.wav'
    },
    vocals: {
      id: 'vocals',
      channel: 'vocals',
      category: 'vocals',
      label: 'Vokal',
      role: 'Ana & Geri Vokal',
      detected: true,
      presence_status: 'active',
      presence_label: 'Aktif Sinyal',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -11.8,
      peak_dbfs: -0.9,
      dynamic_range_db: 10.9,
      isolation_confidence_pct: 98.1,
      storage_mode: 'persistent_disk_wav',
      amt_ready: true,
      filename: 'vocals.wav'
    },
    bass: {
      id: 'bass',
      channel: 'bass',
      category: 'bass',
      label: 'Bas Gitar',
      role: 'Alt Frekans Armonik Hat',
      detected: true,
      presence_status: 'active',
      presence_label: 'Aktif Sinyal',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -15.2,
      peak_dbfs: -3.4,
      dynamic_range_db: 11.8,
      isolation_confidence_pct: 95.2,
      storage_mode: 'persistent_disk_wav',
      amt_ready: true,
      filename: 'bass.wav'
    },
    drums: {
      id: 'drums',
      channel: 'drums',
      category: 'drums',
      label: 'Davul',
      role: 'Perküsyon & Transient',
      detected: true,
      presence_status: 'active',
      presence_label: 'Aktif Sinyal',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -12.1,
      peak_dbfs: -0.6,
      dynamic_range_db: 11.5,
      isolation_confidence_pct: 97.3,
      storage_mode: 'persistent_disk_wav',
      amt_ready: true,
      filename: 'drums.wav'
    },
    piano: {
      id: 'piano',
      channel: 'piano',
      category: 'piano',
      label: 'Piyano',
      role: 'Tuşlu Eşlik',
      detected: true,
      presence_status: 'active',
      presence_label: 'Aktif Sinyal',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -18.6,
      peak_dbfs: -5.2,
      dynamic_range_db: 13.4,
      isolation_confidence_pct: 91.8,
      storage_mode: 'persistent_disk_wav',
      amt_ready: true,
      filename: 'piano.wav'
    },
    other: {
      id: 'other',
      channel: 'other',
      category: 'other',
      label: 'Diğer',
      role: 'Synth & Ambiyans',
      detected: true,
      presence_status: 'active',
      presence_label: 'Ambiyans',
      buffer_size_mb: 11.4,
      sample_rate_hz: 44100,
      duration_sec: TOTAL_DURATION_SEC,
      rms_dbfs: -21.3,
      peak_dbfs: -7.1,
      dynamic_range_db: 14.2,
      isolation_confidence_pct: 89.5,
      storage_mode: 'persistent_disk_wav',
      amt_ready: false,
      filename: 'other.wav'
    }
  }
};

function makeDevLine(startBar: number, endBar: number, text: string) {
  const start_sec = round3((startBar - 1) * BAR_SEC);
  const end_sec = round3(endBar * BAR_SEC - 0.15);
  const wordsArr = text.split(/\s+/).filter(Boolean);
  const step = (end_sec - start_sec) / Math.max(1, wordsArr.length);
  return {
    start_sec,
    end_sec,
    text,
    words: wordsArr.map((word, idx) => ({
      word,
      start_sec: round3(start_sec + idx * step),
      end_sec: round3(start_sec + (idx + 1) * step)
    }))
  };
}

const DEV_LYRIC_LINES = [
  makeDevLine(5, 8, 'Gece sokaklarda yankılanır eski bir melodi'),
  makeDevLine(9, 12, 'Rüzgâr taşır uzaktan suskun kalan sözleri'),
  makeDevLine(13, 16, 'Senden daha güzel bir melodi duymadım ben hiç'),
  makeDevLine(17, 20, 'Her akorda saklı kaldı yarım kalan düşlerimiz'),
  makeDevLine(21, 24, 'Zaman dursa da bu ritim hiç susmaz kalbimizde')
];

const DEV_STAGE4_DATA: Stage4LyricsData = {
  engine: 'Hybrid Lyrics (faster-whisper large-v3-turbo + MMS_FA)',
  transcription_engine: 'faster-whisper large-v3-turbo (int8_float16)',
  alignment_engine: 'torchaudio MMS_FA Forced Alignment',
  detected_language: 'tr',
  is_instrumental: false,
  vocal_rms_dbfs: -11.8,
  word_count: DEV_LYRIC_LINES.reduce((acc, l) => acc + (l.words?.length || 0), 0),
  line_count: DEV_LYRIC_LINES.length,
  inference_sec: 8.41,
  lines: DEV_LYRIC_LINES
};

export const DEV_SHOWCASE_STAGE_OUTPUTS: StageOutputMap = {
  1: DEV_STAGE1_DATA,
  2: DEV_STAGE2_DATA,
  3: DEV_STAGE3_DATA,
  4: DEV_STAGE4_DATA
};

export const DEV_SHOWCASE_STEM_CHANNELS: StemChannel[] = [
  { id: 'guitar', category: 'guitar', name: 'Gitar', fileName: 'guitar.wav', volume: 0.9, isMuted: false, isSolo: false, isGuitar: true, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'vocals', category: 'vocals', name: 'Vokal', fileName: 'vocals.wav', volume: 0.85, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'bass', category: 'bass', name: 'Bas Gitar', fileName: 'bass.wav', volume: 0.85, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'drums', category: 'drums', name: 'Davul', fileName: 'drums.wav', volume: 0.88, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'piano', category: 'piano', name: 'Piyano', fileName: 'piano.wav', volume: 0.78, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'other', category: 'other', name: 'Diğer', fileName: 'other.wav', volume: 0.72, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Ambiyans' }
];

export const DEV_SHOWCASE_LOGS: LogEntry[] = [
  {
    id: 101,
    timestamp: '14:51:30.112',
    level: 'INFO',
    logger: 'kythra.dag',
    stage_num: null,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'Dalga 1 başlatıldı: CPU (Aşama 1 madmom + Aşama 2a BTC CQT) || GPU (Aşama 3 BS-RoFormer 6-Stem)'
  },
  {
    id: 102,
    timestamp: '14:51:30.420',
    level: 'INFO',
    logger: 'kythra.stage3',
    stage_num: 3,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'GPU_LOCK alındı · RTX 4060 (8.0 GB VRAM) tespit edildi -> Oto Batch=2, AMP=FP16 aktif'
  },
  {
    id: 103,
    timestamp: '14:51:41.530',
    level: 'INFO',
    logger: 'kythra.stage1',
    stage_num: 1,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'Aşama 1 tamamlandı (11.42 sn): 118.0 BPM · 4/4 · 128 vuruş, 32 ölçü başı'
  },
  {
    id: 104,
    timestamp: '14:51:43.890',
    level: 'INFO',
    logger: 'kythra.stage2',
    stage_num: 2,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'BTC Large-Voca tamamlandı · Ton: Am · Geçici bölümler üretildi -> ⚡ Stüdyo ilk açılış hazır (TTFO: 13.7 sn)'
  },
  {
    id: 105,
    timestamp: '14:51:44.012',
    level: 'INFO',
    logger: 'kythra.gpu_guard',
    stage_num: 2,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'BTC model ağırlıkları CPU RAM üzerine indirildi (offload_to_cpu + cuda.empty_cache)'
  },
  {
    id: 106,
    timestamp: '14:51:52.104',
    level: 'WARNING',
    logger: 'kythra.stage3',
    stage_num: 3,
    session_id: 'sess_web_guest_94f2',
    message: 'Diğer oturum (sess_web_guest_94f2) GPU_LOCK kuyruğunda bekliyor'
  },
  {
    id: 107,
    timestamp: '14:51:57.770',
    level: 'INFO',
    logger: 'kythra.stage3',
    stage_num: 3,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'Aşama 3 tamamlandı (27.35 sn): 6/6 aktif kanal diske yazıldı (Guitar SDR: 11.8 dB) · BS-RoFormer CPU offload tamamlandı'
  },
  {
    id: 108,
    timestamp: '14:52:01.410',
    level: 'INFO',
    logger: 'kythra.stage2',
    stage_num: 2,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'Aşama 2b (allin1 stem paylaşımı) tamamlandı (3.64 sn): 5 yapısal bölüm keskinleştirildi (Demucs atlandı)'
  },
  {
    id: 109,
    timestamp: '14:52:09.820',
    level: 'INFO',
    logger: 'kythra.stage4',
    stage_num: 4,
    session_id: DEV_SHOWCASE_SESSION_ID,
    message: 'Aşama 4 tamamlandı (8.41 sn): İzole vokalden 36 kelime (5 satır · tr) MMS_FA ile hizalandı · SQLite önbelleği güncellendi'
  }
];

export const DEV_SHOWCASE_REQUESTS: RequestTraceEntry[] = [
  {
    id: 510,
    timestamp: '14:52:18.204',
    method: 'GET',
    path: '/api/workbench/studio-bundle',
    query: '',
    status_code: 200,
    duration_ms: 8.4,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    error_detail: null
  },
  {
    id: 509,
    timestamp: '14:52:10.015',
    method: 'PUT',
    path: '/api/workbench/lyrics',
    query: '',
    status_code: 200,
    duration_ms: 19.2,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    error_detail: null
  },
  {
    id: 508,
    timestamp: '14:51:50.840',
    method: 'POST',
    path: '/api/workbench/prepare-studio',
    query: '',
    status_code: 200,
    duration_ms: 14120.5,
    session_id: 'sess_web_guest_94f2',
    client_app: 'web',
    user: null,
    track_name: 'Arctic Monkeys — 505',
    error_detail: null
  },
  {
    id: 507,
    timestamp: '14:51:45.102',
    method: 'POST',
    path: '/api/workbench/session/upload',
    query: '',
    status_code: 400,
    duration_ms: 42.1,
    session_id: 'sess_web_guest_94f2',
    client_app: 'web',
    user: null,
    track_name: 'invalid_demo.midi',
    error_detail: 'Desteklenmeyen dosya uzantısı (.midi). İzin verilenler: .wav, .mp3, .flac, .ogg, .m4a'
  },
  {
    id: 506,
    timestamp: '14:51:43.910',
    method: 'POST',
    path: '/api/workbench/prepare-studio',
    query: '',
    status_code: 200,
    duration_ms: 13780.3,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    error_detail: null
  },
  {
    id: 505,
    timestamp: '14:51:29.400',
    method: 'POST',
    path: '/api/workbench/session/upload',
    query: '',
    status_code: 200,
    duration_ms: 412.6,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    error_detail: null
  },
  {
    id: 504,
    timestamp: '14:51:18.022',
    method: 'GET',
    path: '/api/workbench/library',
    query: '',
    status_code: 200,
    duration_ms: 6.1,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: null,
    error_detail: null
  },
  {
    id: 503,
    timestamp: '14:51:15.550',
    method: 'POST',
    path: '/api/workbench/auth/login',
    query: '',
    status_code: 200,
    duration_ms: 28.4,
    session_id: DEV_SHOWCASE_SESSION_ID,
    client_app: 'web',
    user: { id: 'dev-user-01', username: 'Bilgehan', email: 'bilgehan@kythrastudio.com', role: 'developer' },
    track_name: null,
    error_detail: null
  }
];

const VALID_DEV_SHOWCASE_VIEWS = new Set<DeveloperShowcaseView>([
  'empty',
  'stage1',
  'stage2',
  'pipeline',
  'stage3',
  'stems',
  'stage4',
  'json',
  'console',
  'requests',
  'source-modal',
  'source-modal-loading',
  'sessions-menu',
  'mixer-popover',
  'running',
  'pending',
  'error'
]);

export function parseDeveloperShowcaseFromSearch(search: string): DeveloperShowcaseConfig | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const rawView = (params.get('showcase') || '').trim().toLowerCase() as DeveloperShowcaseView;
  if (!VALID_DEV_SHOWCASE_VIEWS.has(rawView)) {
    return null;
  }

  const rawTheme = (params.get('theme') || 'light').trim().toLowerCase();
  const theme: DeveloperShowcaseTheme = rawTheme === 'dark' ? 'dark' : 'light';

  const defaultStage =
    rawView === 'stage1'
      ? 1
      : rawView === 'stage3' || rawView === 'stems' || rawView === 'running' || rawView === 'error'
      ? 3
      : rawView === 'stage4' || rawView === 'pending'
      ? 4
      : 2;
  const rawStage = Number(params.get('stage') || String(defaultStage));
  const stageId = [1, 2, 3, 4].includes(rawStage) ? rawStage : defaultStage;

  const tab: InspectorTab =
    rawView === 'requests'
      ? 'requests'
      : rawView === 'console'
      ? 'console'
      : rawView === 'json'
      ? 'json'
      : 'diagnostic';

  return {
    view: rawView,
    theme,
    stageId,
    tab
  };
}
