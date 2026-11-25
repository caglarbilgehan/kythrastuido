const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0, 'B#': 0,
  'C#': 1, Db: 1,
  D: 2,
  'D#': 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, 'E#': 5,
  'F#': 6, Gb: 6,
  G: 7,
  'G#': 8, Ab: 8,
  A: 9,
  'A#': 10, Bb: 10,
  B: 11, Cb: 11
};

const TURKISH_NOTE_NAMES: Record<string, string> = {
  C: 'Do',
  'C#': 'Do#',
  Db: 'Reb',
  D: 'Re',
  'D#': 'Re#',
  Eb: 'Mib',
  E: 'Mi',
  F: 'Fa',
  'F#': 'Fa#',
  Gb: 'Solb',
  G: 'Sol',
  'G#': 'Sol#',
  Ab: 'Lab',
  A: 'La',
  'A#': 'La#',
  Bb: 'Sib',
  B: 'Si'
};

export function transposeNote(note: string, semitones: number, preferFlats = false): string {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note;
  const nextIdx = ((idx + semitones) % 12 + 12) % 12;
  return preferFlats ? NOTES_FLAT[nextIdx] : NOTES_SHARP[nextIdx];
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N' || semitones === 0) {
    return chord || '—';
  }

  // Handle slash chords like D/F#
  if (chord.includes('/')) {
    const [main, bass] = chord.split('/');
    return `${transposeChord(main, semitones)}/${transposeChord(bass, semitones)}`;
  }

  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;
  const [, root, suffix] = match;
  const preferFlats = root.includes('b');
  const nextRoot = transposeNote(root, semitones, preferFlats);
  return `${nextRoot}${suffix}`;
}

export function transposeKeySignature(keySignature: string, semitones: number): string {
  if (!keySignature) return 'C Majör';
  const parts = keySignature.trim().split(/\s+/);
  const root = parts[0] || 'C';
  const modeRaw = (parts[1] || 'major').toLowerCase();
  const isMinor = modeRaw.includes('min') || modeRaw === 'm';
  const transposedRoot = semitones === 0 ? root : transposeNote(root, semitones, root.includes('b'));
  const trNote = TURKISH_NOTE_NAMES[transposedRoot] || transposedRoot;
  return `${transposedRoot} ${isMinor ? 'Minör' : 'Majör'} (${trNote} ${isMinor ? 'Minör' : 'Majör'})`;
}

export interface ChordVoicingInfo {
  symbol: string;
  root: string;
  qualityLabel: string;
  notes: string[];
  frets: Array<number | 'x'>; // 6 strings: E A D G B e
  baseFret: number;
}

const GUITAR_VOICINGS: Record<string, { frets: Array<number | 'x'>; baseFret: number }> = {
  C: { frets: ['x', 3, 2, 0, 1, 0], baseFret: 1 },
  Cm: { frets: ['x', 3, 5, 5, 4, 3], baseFret: 3 },
  'C#': { frets: ['x', 4, 6, 6, 6, 4], baseFret: 4 },
  'C#m': { frets: ['x', 4, 6, 6, 5, 4], baseFret: 4 },
  D: { frets: ['x', 'x', 0, 2, 3, 2], baseFret: 1 },
  Dm: { frets: ['x', 'x', 0, 2, 3, 1], baseFret: 1 },
  'D#': { frets: ['x', 6, 8, 8, 8, 6], baseFret: 6 },
  'D#m': { frets: ['x', 6, 8, 8, 7, 6], baseFret: 6 },
  Eb: { frets: ['x', 6, 8, 8, 8, 6], baseFret: 6 },
  E: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  Em: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  F: { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  Fm: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'F#': { frets: [2, 4, 4, 3, 2, 2], baseFret: 2 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], baseFret: 2 },
  G: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  Gm: { frets: [3, 5, 5, 3, 3, 3], baseFret: 3 },
  'G#': { frets: [4, 6, 6, 5, 4, 4], baseFret: 4 },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], baseFret: 4 },
  A: { frets: ['x', 0, 2, 2, 2, 0], baseFret: 1 },
  Am: { frets: ['x', 0, 2, 2, 1, 0], baseFret: 1 },
  'A#': { frets: ['x', 1, 3, 3, 3, 1], baseFret: 1 },
  Bb: { frets: ['x', 1, 3, 3, 3, 1], baseFret: 1 },
  'A#m': { frets: ['x', 1, 3, 3, 2, 1], baseFret: 1 },
  Bbm: { frets: ['x', 1, 3, 3, 2, 1], baseFret: 1 },
  B: { frets: ['x', 2, 4, 4, 4, 2], baseFret: 2 },
  Bm: { frets: ['x', 2, 4, 4, 3, 2], baseFret: 2 }
};

export function getChordVoicingInfo(chordSymbol: string): ChordVoicingInfo {
  const clean = (!chordSymbol || chordSymbol === 'N.C.' || chordSymbol === '—') ? 'F#m' : chordSymbol.split('/')[0];
  const match = clean.match(/^([A-G][#b]?)(.*)$/);
  const root = match ? match[1] : 'C';
  const suffix = match ? match[2] : '';

  const rootIdx = NOTE_TO_INDEX[root] ?? 0;
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  const isAug = suffix.startsWith('aug');
  const isSus4 = suffix.includes('sus4');
  const isSus2 = suffix.includes('sus2');
  const has7 = suffix.includes('7');
  const hasMaj7 = suffix.includes('maj7');

  const intervals: number[] = [0];
  if (isSus2) intervals.push(2, 7);
  else if (isSus4) intervals.push(5, 7);
  else if (isDim) intervals.push(3, 6);
  else if (isAug) intervals.push(4, 8);
  else if (isMinor) intervals.push(3, 7);
  else intervals.push(4, 7);

  if (hasMaj7) intervals.push(11);
  else if (has7) intervals.push(10);

  const preferFlats = root.includes('b');
  const notes = intervals.map((iv) => {
    const idx = (rootIdx + iv) % 12;
    return preferFlats ? NOTES_FLAT[idx] : NOTES_SHARP[idx];
  });

  let qualityLabel = 'Majör Akor';
  if (isMinor && has7) qualityLabel = 'Minör 7\'li Akor';
  else if (isMinor) qualityLabel = 'Minör Akor';
  else if (hasMaj7) qualityLabel = 'Majör 7\'li Akor';
  else if (has7) qualityLabel = 'Dominant 7\'li Akor';
  else if (isSus4) qualityLabel = 'Sus4 Akor';
  else if (isDim) qualityLabel = 'Diminished Akor';

  const lookupKey = `${root}${isMinor ? 'm' : ''}`;
  const voicing = GUITAR_VOICINGS[clean] || GUITAR_VOICINGS[lookupKey] || GUITAR_VOICINGS.C;

  return {
    symbol: chordSymbol || '—',
    root,
    qualityLabel,
    notes,
    frets: voicing.frets,
    baseFret: voicing.baseFret
  };
}
