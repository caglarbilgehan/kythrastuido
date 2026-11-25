import { StemChannel } from '../types/workbench';

export type InstrumentId = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other';

export interface InstrumentMeta {
  id: InstrumentId;
  label: string;
  role: string;
  materialIcon: string;
  color: string;
}

export const INSTRUMENT_META: Record<InstrumentId, InstrumentMeta> = {
  guitar: {
    id: 'guitar',
    label: 'Gitar',
    role: 'Akustik / Elektro Gitar Hattı',
    materialIcon: 'guitar',
    color: '#0B57D0'
  },
  bass: {
    id: 'bass',
    label: 'Bas',
    role: 'Ritmik / Armonik Bas Hattı',
    materialIcon: 'graphic_eq',
    color: '#146C2E'
  },
  drums: {
    id: 'drums',
    label: 'Davul',
    role: 'Perküsyon & Transient Zamanlama',
    materialIcon: 'album',
    color: '#D97706'
  },
  vocals: {
    id: 'vocals',
    label: 'Vokal',
    role: 'Melodik Vokal Hattı',
    materialIcon: 'mic',
    color: '#B3261E'
  },
  piano: {
    id: 'piano',
    label: 'Piyano',
    role: 'Harmonik Eşlik & Klavye',
    materialIcon: 'piano',
    color: '#7C3AED'
  },
  other: {
    id: 'other',
    label: 'Diğer',
    role: 'Ambiyans, Sentetizör ve Efektler',
    materialIcon: 'equalizer',
    color: '#64748B'
  }
};

export const STEM_CHANNEL_ORDER: InstrumentId[] = [
  'guitar',
  'bass',
  'drums',
  'vocals',
  'piano',
  'other'
];

export const DEFAULT_STEMS: StemChannel[] = [
  { id: 'guitar', name: 'Gitar', fileName: 'Gitar', sizeBytes: 32925286, volume: 0.85, isMuted: false, isSolo: false, isGuitar: true },
  { id: 'bass', name: 'Bas', fileName: 'Bas', sizeBytes: 32925286, volume: 0.70, isMuted: false, isSolo: false },
  { id: 'drums', name: 'Davul', fileName: 'Davul', sizeBytes: 32925286, volume: 0.65, isMuted: false, isSolo: false },
  { id: 'vocals', name: 'Vokal', fileName: 'Vokal', sizeBytes: 32925286, volume: 0.60, isMuted: false, isSolo: false },
  { id: 'piano', name: 'Piyano', fileName: 'Piyano', sizeBytes: 32925286, volume: 0.50, isMuted: false, isSolo: false },
  { id: 'other', name: 'Diğer', fileName: 'Diğer', sizeBytes: 32925286, volume: 0.40, isMuted: false, isSolo: false }
];

export type SectionTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'neutral';

export const SECTION_TONE_MAP: Record<string, SectionTone> = {
    start: 'primary',
    intro: 'primary',
    inst: 'primary',
    verse: 'success',
    chorus: 'tertiary',
    solo: 'tertiary',
    bridge: 'secondary',
    outro: 'neutral',
    end: 'neutral'
};

export function resolveInstrumentMeta(id: string): InstrumentMeta {
  if (INSTRUMENT_META[id as InstrumentId]) {
    return INSTRUMENT_META[id as InstrumentId];
  }
  if (id.startsWith('guitar_')) {
    return {
      id: id as InstrumentId,
      label: id.replace('guitar_', 'Gitar '),
      role: 'Ayrıştırılmış Gitar İcracısı',
      materialIcon: 'guitar',
      color: '#0B57D0'
    };
  }
  if (id.startsWith('vocal_')) {
    return {
      id: id as InstrumentId,
      label: id.replace('vocal_', 'Vokal '),
      role: 'Ayrıştırılmış Vokal İcracısı',
      materialIcon: 'mic',
      color: '#B3261E'
    };
  }
  return {
    id: id as InstrumentId,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    role: 'Enstrüman Kanalı',
    materialIcon: 'music_note',
    color: '#64748B'
  };
}
