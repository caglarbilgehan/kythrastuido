import {
  AppLanguage,
  BarChordItem,
  BeatItem,
  FavoriteSongItem,
  InstrumentType,
  LibrarySongItem,
  LyricLineItem,
  LyricRevisionItem,
  PrivateUploadedSongItem,
  SongSection,
  StemChannelState,
  StudioSong,
  StudioUser
} from '../types/studio';

export type ShowcaseView =
  | 'studio'
  | 'piano'
  | 'ukulele'
  | 'welcome'
  | 'upload'
  | 'upload-loading'
  | 'omnibox'
  | 'account-auth'
  | 'account-signup'
  | 'account-user'
  | 'account-uploads'
  | 'account-profile'
  | 'mixer'
  | 'instrument'
  | 'speed'
  | 'settings'
  | 'lyrics-editor'
  | 'inline-rename'
  | 'confirm-delete';
export type ShowcaseTheme = 'light' | 'dark';

export interface ShowcaseConfig {
  view: ShowcaseView;
  theme: ShowcaseTheme;
  language: AppLanguage;
  instrument: InstrumentType;
  currentTimeSec: number;
}

const TEMPO_BPM = 118;
const BEAT_SEC = 60 / TEMPO_BPM; // ~0.50847s
const BAR_SEC = BEAT_SEC * 4; // ~2.0339s
const TOTAL_BARS = 64;

const SECTION_DEFS: Array<{
  id: string;
  name: string;
  rawLabel: string;
  startBar: number;
  endBar: number;
  pattern: string[];
}> = [
  {
    id: 'sec-intro',
    name: 'Intro',
    rawLabel: 'intro',
    startBar: 1,
    endBar: 8,
    pattern: ['Am7', 'Fmaj7', 'C', 'G']
  },
  {
    id: 'sec-verse-1',
    name: 'Verse 1',
    rawLabel: 'verse',
    startBar: 9,
    endBar: 20,
    pattern: ['Am', 'Em7', 'Fmaj7', 'G']
  },
  {
    id: 'sec-chorus-1',
    name: 'Chorus 1',
    rawLabel: 'chorus',
    startBar: 21,
    endBar: 36,
    pattern: ['Fmaj7', 'Am7', 'G', 'C']
  },
  {
    id: 'sec-verse-2',
    name: 'Verse 2',
    rawLabel: 'verse',
    startBar: 37,
    endBar: 48,
    pattern: ['Am', 'Dm7', 'Fmaj7', 'E7']
  },
  {
    id: 'sec-bridge',
    name: 'Bridge',
    rawLabel: 'bridge',
    startBar: 49,
    endBar: 56,
    pattern: ['Dm7', 'Am7', 'F', 'G']
  },
  {
    id: 'sec-outro',
    name: 'Outro',
    rawLabel: 'outro',
    startBar: 57,
    endBar: 64,
    pattern: ['Am7', 'Fmaj7', 'C', 'G']
  }
];

function roundSec(val: number): number {
  return Math.round(val * 1000) / 1000;
}

const SHOWCASE_SECTIONS: SongSection[] = SECTION_DEFS.map((def) => ({
  id: def.id,
  name: def.name,
  rawLabel: def.rawLabel,
  startBar: def.startBar,
  endBar: def.endBar,
  startSec: roundSec((def.startBar - 1) * BAR_SEC),
  endSec: roundSec(def.endBar * BAR_SEC)
}));

const SHOWCASE_BARS: BarChordItem[] = [];
const SHOWCASE_BEATS: BeatItem[] = [];

let globalBeatNum = 1;
for (let bar = 1; bar <= TOTAL_BARS; bar++) {
  const sec =
    SECTION_DEFS.find((s) => bar >= s.startBar && bar <= s.endBar) || SECTION_DEFS[0];
  const startSec = roundSec((bar - 1) * BAR_SEC);
  const endSec = roundSec(bar * BAR_SEC);
  const chord = sec.pattern[(bar - sec.startBar) % sec.pattern.length];
  const hasSplitChord = bar === 24 || bar === 28 || bar === 32 || bar === 44;
  const splitSecondChord = bar === 44 ? 'E7' : 'G';
  const midSec = roundSec(startSec + BAR_SEC / 2);

  SHOWCASE_BARS.push({
    barNumber: bar,
    startSec,
    endSec,
    durationSec: roundSec(BAR_SEC),
    chord,
    subChords: hasSplitChord
      ? [
          { chord, startSec, endSec: midSec, durationSec: roundSec(BAR_SEC / 2) },
          {
            chord: splitSecondChord,
            startSec: midSec,
            endSec,
            durationSec: roundSec(BAR_SEC / 2)
          }
        ]
      : []
  });

  for (let beatInBar = 0; beatInBar < 4; beatInBar++) {
    SHOWCASE_BEATS.push({
      beatNumber: globalBeatNum++,
      timeSec: roundSec(startSec + beatInBar * BEAT_SEC),
      isDownbeat: beatInBar === 0,
      barIndex: bar - 1
    });
  }
}

const TOTAL_DURATION_SEC = roundSec(TOTAL_BARS * BAR_SEC);

// Positioned right in Chorus 1, Bar 26, Beat 2:
// Prev = Fmaj7 (Bar 25), Active = Am7 (Bar 26), Next = G (Bar 27)
export const SHOWCASE_DEFAULT_TIME_SEC = roundSec(25 * BAR_SEC + BEAT_SEC * 1.45);

const SHOWCASE_WAVEFORM_PEAKS: number[] = Array.from({ length: 72 }, (_, idx) => {
  const ratio = idx / 71;
  const env =
    ratio < 0.1
      ? 0.32 + ratio * 3.2
      : ratio > 0.88
      ? 0.3 + (1 - ratio) * 3.5
      : ratio > 0.3 && ratio < 0.62
      ? 0.84
      : 0.64;
  const wave = Math.sin(idx * 0.85) * 0.16 + Math.cos(idx * 2.15) * 0.11;
  return Math.max(0.18, Math.min(0.98, Math.round((env + wave) * 100) / 100));
});

function buildTimedLine(startBar: number, endBar: number, text: string): LyricLineItem {
  const startSec = roundSec((startBar - 1) * BAR_SEC);
  const endSec = roundSec(endBar * BAR_SEC - 0.15);
  const tokens = text.split(/\s+/).filter(Boolean);
  const step = (endSec - startSec) / Math.max(1, tokens.length);
  return {
    startSec,
    endSec,
    text,
    words: tokens.map((word, idx) => ({
      word,
      startSec: roundSec(startSec + idx * step),
      endSec: roundSec(startSec + (idx + 1) * step)
    }))
  };
}

const SHOWCASE_LYRICS: LyricLineItem[] = [
  buildTimedLine(9, 12, 'Gece sokaklarda yankılanır eski bir melodi'),
  buildTimedLine(13, 16, 'Rüzgâr taşır uzaktan suskun kalan sözleri'),
  buildTimedLine(17, 20, 'Bir gitar teli gibi titrer içimde her anı'),
  buildTimedLine(21, 24, 'Işıklar yanarken yeniden başlar bu hikâye'),
  buildTimedLine(25, 28, 'Senden daha güzel bir melodi duymadım ben hiç'),
  buildTimedLine(29, 32, 'Her akorda saklı kaldı yarım kalan düşlerimiz'),
  buildTimedLine(33, 36, 'Zaman dursa da bu ritim hiç susmaz kalbimizde'),
  buildTimedLine(37, 40, 'Sabahın ilk ışığında yeni bir sayfa açılır')
];

export const SHOWCASE_STUDIO_SONG: StudioSong = {
  id: 'showcase-kythra-demo',
  trackKey: 'upload_showcase_midnight_echoes',
  isPrivate: false,
  stemOrder: ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'],
  source: 'live',
  title: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
  artist: 'Duman',
  durationSec: TOTAL_DURATION_SEC,
  tempoBpm: TEMPO_BPM,
  timeSignature: '4/4',
  keySignature: 'Am',
  primaryProgression: 'Am7 – Fmaj7 – C – G',
  totalBars: TOTAL_BARS,
  sections: SHOWCASE_SECTIONS,
  bars: SHOWCASE_BARS,
  beats: SHOWCASE_BEATS,
  lyrics: SHOWCASE_LYRICS,
  lyricsSource: 'ai',
  lyricsLocked: false,
  lyricsVersion: 2,
  lyricsUpdatedBy: 'bilgehan',
  waveformPeaks: SHOWCASE_WAVEFORM_PEAKS,
  stage3Status: 'completed',
  stage4Status: 'completed',
  sectionsRefining: false,
  pipelineVersion: '1.2.0',
  cacheHit: true,
  stems: {
    guitar: {
      id: 'guitar',
      label: 'Gitar',
      category: 'guitar',
      detected: true,
      rmsDbfs: -13.4,
      presenceLabel: 'Aktif Sinyal'
    },
    vocals: {
      id: 'vocals',
      label: 'Vokal',
      category: 'vocals',
      detected: true,
      rmsDbfs: -11.8,
      presenceLabel: 'Aktif Sinyal'
    },
    bass: {
      id: 'bass',
      label: 'Bas Gitar',
      category: 'bass',
      detected: true,
      rmsDbfs: -15.2,
      presenceLabel: 'Aktif Sinyal'
    },
    drums: {
      id: 'drums',
      label: 'Davul',
      category: 'drums',
      detected: true,
      rmsDbfs: -12.1,
      presenceLabel: 'Aktif Sinyal'
    },
    piano: {
      id: 'piano',
      label: 'Piyano',
      category: 'piano',
      detected: true,
      rmsDbfs: -18.6,
      presenceLabel: 'Aktif Sinyal'
    },
    other: {
      id: 'other',
      label: 'Diğer',
      category: 'other',
      detected: true,
      rmsDbfs: -21.3,
      presenceLabel: 'Ambiyans'
    }
  }
};

export const SHOWCASE_USER: StudioUser = {
  id: 'dev-user-01',
  email: 'bilgehan@kythrastudio.com',
  username: 'Bilgehan',
  role: 'developer'
};

export const SHOWCASE_FAVORITES: FavoriteSongItem[] = [
  {
    track_key: 'upload_showcase_midnight_echoes',
    title: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    tempo_bpm: 118,
    key_signature: 'Am',
    time_signature: '4/4',
    is_private: false,
    created_at: '2026-11-24T19:15:00Z'
  },
  {
    track_key: 'library_arctic_monkeys_505',
    title: 'Arctic Monkeys — 505',
    tempo_bpm: 140,
    key_signature: 'Dm',
    time_signature: '4/4',
    is_private: false,
    created_at: '2026-11-23T14:20:00Z'
  }
];

export const SHOWCASE_PRIVATE_UPLOADS: PrivateUploadedSongItem[] = [
  {
    track_key: 'upload_showcase_midnight_echoes',
    title: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    duration_sec: TOTAL_DURATION_SEC,
    tempo_bpm: 118,
    key_signature: 'Am',
    time_signature: '4/4',
    primary_progression: 'Am7 – Fmaj7 – C – G',
    pipeline_version: '1.2.0',
    is_private: true,
    updated_at: '2026-11-25T11:30:00Z'
  },
  {
    track_key: 'upload_acoustic_rehearsal_take2',
    title: 'Akustik Prova — Take 2 (Em Balad)',
    duration_sec: 196,
    tempo_bpm: 92,
    key_signature: 'Em',
    time_signature: '4/4',
    primary_progression: 'Em – C – G – D',
    pipeline_version: '1.2.0',
    is_private: true,
    updated_at: '2026-11-24T20:10:00Z'
  }
];

export const SHOWCASE_LIBRARY_SONGS: LibrarySongItem[] = [
  {
    track_key: 'upload_showcase_midnight_echoes',
    title: 'Duman — Senden Daha Güzel (Stüdyo Kaydı)',
    duration_sec: TOTAL_DURATION_SEC,
    tempo_bpm: 118,
    key_signature: 'Am',
    time_signature: '4/4',
    primary_progression: 'Am7 – Fmaj7 – C – G',
    pipeline_version: '1.2.0',
    is_current_version: true,
    is_private: false,
    updated_at: '2026-11-25T11:30:00Z'
  },
  {
    track_key: 'library_arctic_monkeys_505',
    title: 'Arctic Monkeys — 505',
    duration_sec: 253,
    tempo_bpm: 140,
    key_signature: 'Dm',
    time_signature: '4/4',
    primary_progression: 'Dm – Em',
    pipeline_version: '1.2.0',
    is_current_version: true,
    updated_at: '2026-11-23T14:20:00Z'
  },
  {
    track_key: 'library_red_hot_californication',
    title: 'Red Hot Chili Peppers — Californication',
    duration_sec: 329,
    tempo_bpm: 96,
    key_signature: 'Am',
    time_signature: '4/4',
    primary_progression: 'Am – F – C – G',
    pipeline_version: '1.2.0',
    is_current_version: true,
    updated_at: '2026-11-22T18:05:00Z'
  },
  {
    track_key: 'library_mor_ve_otesi_bir_derdim_var',
    title: 'Mor ve Ötesi — Bir Derdim Var',
    duration_sec: 215,
    tempo_bpm: 124,
    key_signature: 'Em',
    time_signature: '4/4',
    primary_progression: 'Em – C – G – D',
    pipeline_version: '1.2.0',
    is_current_version: true,
    updated_at: '2026-11-21T16:40:00Z'
  },
  {
    track_key: 'library_john_mayer_slow_dancing',
    title: 'John Mayer — Slow Dancing in a Burning Room',
    duration_sec: 242,
    tempo_bpm: 67,
    key_signature: 'C#m',
    time_signature: '4/4',
    primary_progression: 'C#m7 – A – E',
    pipeline_version: '1.2.0',
    is_current_version: true,
    updated_at: '2026-11-20T09:50:00Z'
  },
  {
    track_key: 'library_oasis_wonderwall',
    title: 'Oasis — Wonderwall (Capo 2)',
    duration_sec: 258,
    tempo_bpm: 87,
    key_signature: 'F#m',
    time_signature: '4/4',
    primary_progression: 'Em7 – G – Dsus4 – A7sus4',
    pipeline_version: '1.2.0',
    is_current_version: true,
    updated_at: '2026-11-19T21:12:00Z'
  }
];

export const SHOWCASE_MIXER_CHANNELS: StemChannelState[] = [
  {
    id: 'guitar',
    category: 'guitar',
    label: 'Gitar',
    role: 'Polyphonic Guitar',
    icon: 'music_note',
    color: '#0B57D0',
    volume: 0.9,
    isMuted: true,
    isSolo: false,
    detected: true,
    presenceLabel: 'Aktif Sinyal',
    rmsDbfs: -13.4
  },
  {
    id: 'vocals',
    category: 'vocals',
    label: 'Vokal',
    role: 'Lead & Backing Vocals',
    icon: 'mic',
    color: '#B3261E',
    volume: 0.9,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Aktif Sinyal',
    rmsDbfs: -11.8
  },
  {
    id: 'bass',
    category: 'bass',
    label: 'Bas Gitar',
    role: 'Harmonic Bassline',
    icon: 'graphic_eq',
    color: '#146C2E',
    volume: 0.85,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Aktif Sinyal',
    rmsDbfs: -15.2
  },
  {
    id: 'drums',
    category: 'drums',
    label: 'Davul',
    role: 'Percussion & Transients',
    icon: 'album',
    color: '#D97706',
    volume: 0.88,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Aktif Sinyal',
    rmsDbfs: -12.1
  },
  {
    id: 'piano',
    category: 'piano',
    label: 'Piyano',
    role: 'Keys & Accompaniment',
    icon: 'piano',
    color: '#7C3AED',
    volume: 0.78,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Aktif Sinyal',
    rmsDbfs: -18.6
  },
  {
    id: 'other',
    category: 'other',
    label: 'Diğer',
    role: 'Synth & Ambience',
    icon: 'equalizer',
    color: '#64748B',
    volume: 0.72,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Ambiyans',
    rmsDbfs: -21.3
  },
  {
    id: 'metronome',
    category: 'metronome',
    label: 'Metronom',
    role: 'Beat & Downbeat Click',
    icon: 'timer',
    color: '#00639B',
    volume: 0.7,
    isMuted: false,
    isSolo: false,
    detected: true,
    presenceLabel: 'Senkron Klik'
  }
];

export const SHOWCASE_LYRIC_REVISIONS: LyricRevisionItem[] = [
  {
    id: 12,
    track_key: 'upload_showcase_midnight_echoes',
    version_num: 2,
    user_id: 'dev-user-01',
    username: 'Bilgehan',
    change_summary: 'Nakarat zaman damgaları 25. ölçüye hassas hizalandı',
    created_at: '2026-11-25T11:32:00Z'
  },
  {
    id: 11,
    track_key: 'upload_showcase_midnight_echoes',
    version_num: 1,
    user_id: null,
    username: 'AI Hybrid (Whisper + MMS_FA)',
    change_summary: 'İzole vokal kanalından otomatik kelime hizalama oluşturuldu',
    created_at: '2026-11-25T11:30:12Z'
  }
];

const VALID_SHOWCASE_VIEWS = new Set<ShowcaseView>([
  'studio',
  'piano',
  'ukulele',
  'welcome',
  'upload',
  'upload-loading',
  'omnibox',
  'account-auth',
  'account-signup',
  'account-user',
  'account-uploads',
  'account-profile',
  'mixer',
  'instrument',
  'speed',
  'settings',
  'lyrics-editor',
  'inline-rename',
  'confirm-delete'
]);

export function parseShowcaseFromSearch(search: string): ShowcaseConfig | null {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const rawView = (params.get('showcase') || '').trim().toLowerCase() as ShowcaseView;
  if (!VALID_SHOWCASE_VIEWS.has(rawView)) {
    return null;
  }

  const rawTheme = (params.get('theme') || 'light').trim().toLowerCase();
  const theme: ShowcaseTheme = rawTheme === 'dark' ? 'dark' : 'light';

  const rawLang = (params.get('lang') || 'tr').trim().toLowerCase();
  const language: AppLanguage = rawLang === 'en' ? 'en' : 'tr';

  const defaultInst: InstrumentType =
    rawView === 'piano' ? 'piano' : rawView === 'ukulele' ? 'ukulele' : 'guitar';
  const rawInst = (params.get('instrument') || defaultInst).trim().toLowerCase();
  const instrument: InstrumentType =
    rawInst === 'piano' || rawInst === 'ukulele' ? rawInst : 'guitar';

  return {
    view: rawView,
    theme,
    language,
    instrument,
    currentTimeSec: SHOWCASE_DEFAULT_TIME_SEC
  };
}
