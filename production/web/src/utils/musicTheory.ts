import { AppLanguage, ChordComplexityMode } from '../types/studio';

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

export function transposeNote(note: string, semitones: number, preferFlats = false): string {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note;
  const nextIdx = ((idx + semitones) % 12 + 12) % 12;
  return preferFlats ? NOTES_FLAT[nextIdx] : NOTES_SHARP[nextIdx];
}

export function simplifyChordToBasic(chord: string): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N') return chord || '—';
  const main = chord.split('/')[0];
  const match = main.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return main;
  const [, root, suffix] = match;
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  if (isDim) return `${root}dim`;
  return `${root}${isMinor ? 'm' : ''}`;
}

export function transposeChord(
  chord: string,
  semitones: number,
  complexity: ChordComplexityMode = 'all'
): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N') {
    return '—';
  }
  const baseChord = complexity === 'basic' ? simplifyChordToBasic(chord) : chord;
  if (semitones === 0) return baseChord;

  if (baseChord.includes('/')) {
    const [main, bass] = baseChord.split('/');
    return `${transposeChord(main, semitones, complexity)}/${transposeChord(bass, semitones, complexity)}`;
  }

  const match = baseChord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return baseChord;
  const [, root, suffix] = match;
  const preferFlats = root.includes('b');
  const nextRoot = transposeNote(root, semitones, preferFlats);
  return `${nextRoot}${suffix}`;
}

export function getCapoAdjustedChord(
  chord: string,
  transposeSemitones: number,
  capo: number,
  complexity: ChordComplexityMode = 'all'
): { soundingChord: string; shapeChord: string } {
  const soundingChord = transposeChord(chord, transposeSemitones, complexity);
  const shapeChord = capo > 0 ? transposeChord(soundingChord, -capo, complexity) : soundingChord;
  return { soundingChord, shapeChord };
}

export function transposeKeySignature(
  keySignature: string,
  semitones: number,
  _lang: AppLanguage = 'en'
): string {
  if (!keySignature) return 'C';
  const parts = keySignature.trim().split(/\s+/);
  const root = parts[0] || 'C';
  const modeRaw = (parts[1] || 'major').toLowerCase();
  const isMinor = modeRaw.includes('min') || modeRaw === 'm';
  const transposedRoot = semitones === 0 ? root : transposeNote(root, semitones, root.includes('b'));
  return `${transposedRoot}${isMinor ? 'm' : ''}`;
}

export interface FretPositionVariation {
  frets: Array<number | 'x'>;   // Relative fret numbers (0 = open, 'x' = muted, 1..5 = fret inside box)
  fingers: Array<number | 0>;   // Finger number (1..4, 0 = none)
  baseFret: number;             // Starting fret of diagram box (1..12)
  barre?: { fret: number; fromString: number; toString: number; finger: number };
  stringNotes: string[];        // Sounded note on each string
}

export interface MultiInstrumentChordInfo {
  symbol: string;
  shapeSymbol: string;
  root: string;
  qualityLabel: string;
  notes: string[];
  pianoMidiKeys: number[]; // Relative to C3=0 .. B4=23
  guitarPositions: FretPositionVariation[];
  ukulelePositions: FretPositionVariation[];
}

// Standard tuning open string pitch classes:
// Guitar: E2(4), A2(9), D3(2), G3(7), B3(11), E4(4)
const GUITAR_OPEN_PC = [4, 9, 2, 7, 11, 4];
// Ukulele: G4(7), C4(0), E4(4), A4(9)
const UKULELE_OPEN_PC = [7, 0, 4, 9];

function computeStringNotes(
  openPcs: number[],
  frets: Array<number | 'x'>,
  baseFret: number
): string[] {
  return frets.map((f, idx) => {
    if (f === 'x') return '×';
    const actualFret = f === 0 ? 0 : baseFret + f - 1;
    const pc = (openPcs[idx] + actualFret) % 12;
    return NOTES_SHARP[pc];
  });
}

/**
 * Generates authentic multi-position Guitar (E-form, A-form, open) and Ukulele voicings
 * for any root (0..11) and quality (major, minor, 7, m7, maj7, sus4).
 */
function buildGuitarPositions(rootPc: number, isMinor: boolean, has7: boolean, hasMaj7: boolean): FretPositionVariation[] {
  const variations: FretPositionVariation[] = [];

  // Open standard chord shapes for common roots
  const OPEN_SHAPES: Record<string, { frets: Array<number | 'x'>; fingers: number[]; baseFret: number; barre?: FretPositionVariation['barre'] }> = {
    '0_maj':  { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 }, // C
    '2_maj':  { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 }, // D
    '2_min':  { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 }, // Dm
    '4_maj':  { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 }, // E
    '4_min':  { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 }, // Em
    '7_maj':  { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 }, // G
    '9_maj':  { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 }, // A
    '9_min':  { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 }, // Am
  };

  const openKey = `${rootPc}_${isMinor ? 'min' : 'maj'}`;
  if (OPEN_SHAPES[openKey]) {
    const o = OPEN_SHAPES[openKey];
    variations.push({
      frets: o.frets,
      fingers: o.fingers,
      baseFret: o.baseFret,
      barre: o.barre,
      stringNotes: computeStringNotes(GUITAR_OPEN_PC, o.frets, o.baseFret)
    });
  }

  // E-String Root Barre Shape (6th string root at fret = (rootPc - 4 + 12) % 12)
  const eFret = ((rootPc - 4) % 12 + 12) % 12;
  const eBase = eFret === 0 ? 12 : eFret;
  const eFrets: Array<number | 'x'> = isMinor
    ? (has7 ? [1, 3, 1, 1, 1, 1] : [1, 3, 3, 1, 1, 1])
    : (hasMaj7 ? [1, 'x', 2, 2, 1, 'x'] : has7 ? [1, 3, 1, 2, 1, 1] : [1, 3, 3, 2, 1, 1]);
  const eFingers = isMinor
    ? (has7 ? [1, 3, 1, 1, 1, 1] : [1, 3, 4, 1, 1, 1])
    : (has7 ? [1, 3, 1, 2, 1, 1] : [1, 3, 4, 2, 1, 1]);

  variations.push({
    frets: eFrets,
    fingers: eFingers,
    baseFret: eBase,
    barre: { fret: 1, fromString: 0, toString: 5, finger: 1 },
    stringNotes: computeStringNotes(GUITAR_OPEN_PC, eFrets, eBase)
  });

  // A-String Root Barre Shape (5th string root at fret = (rootPc - 9 + 12) % 12)
  const aFret = ((rootPc - 9) % 12 + 12) % 12;
  const aBase = aFret === 0 ? 12 : aFret;
  const aFrets: Array<number | 'x'> = isMinor
    ? (has7 ? ['x', 1, 3, 1, 2, 1] : ['x', 1, 3, 3, 2, 1])
    : (hasMaj7 ? ['x', 1, 3, 2, 3, 1] : has7 ? ['x', 1, 3, 1, 3, 1] : ['x', 1, 3, 3, 3, 1]);
  const aFingers = isMinor
    ? (has7 ? [0, 1, 3, 1, 2, 1] : [0, 1, 3, 4, 2, 1])
    : (hasMaj7 ? [0, 1, 3, 2, 4, 1] : has7 ? [0, 1, 3, 1, 4, 1] : [0, 1, 2, 3, 4, 1]);

  variations.push({
    frets: aFrets,
    fingers: aFingers,
    baseFret: aBase,
    barre: { fret: 1, fromString: 1, toString: 5, finger: 1 },
    stringNotes: computeStringNotes(GUITAR_OPEN_PC, aFrets, aBase)
  });

  return variations;
}

function buildUkulelePositions(rootPc: number, isMinor: boolean): FretPositionVariation[] {
  // Common 4-string Ukulele (G C E A) voicings
  const UKU_TABLE: Record<string, { frets: Array<number | 'x'>; fingers: number[]; baseFret: number; barre?: FretPositionVariation['barre'] }> = {
    '0_maj':  { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], baseFret: 1 }, // C
    '0_min':  { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3], baseFret: 1 }, // Cm
    '1_maj':  { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], baseFret: 1, barre: { fret: 1, fromString: 0, toString: 3, finger: 1 } }, // C#
    '1_min':  { frets: [1, 4, 4, 4], fingers: [1, 2, 3, 4], baseFret: 1 }, // C#m
    '2_maj':  { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], baseFret: 1 }, // D
    '2_min':  { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], baseFret: 1 }, // Dm
    '3_maj':  { frets: [0, 3, 3, 1], fingers: [0, 2, 3, 1], baseFret: 1 }, // Eb
    '3_min':  { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1], baseFret: 1 }, // Ebm
    '4_maj':  { frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1], baseFret: 1 }, // E
    '4_min':  { frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1], baseFret: 1 }, // Em
    '5_maj':  { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], baseFret: 1 }, // F
    '5_min':  { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4], baseFret: 1 }, // Fm
    '6_maj':  { frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 3, finger: 1 } }, // F#
    '6_min':  { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0], baseFret: 1 }, // F#m
    '7_maj':  { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], baseFret: 1 }, // G
    '7_min':  { frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1], baseFret: 1 }, // Gm
    '8_maj':  { frets: [5, 3, 4, 3], fingers: [3, 1, 2, 1], baseFret: 1 }, // G#
    '8_min':  { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], baseFret: 1 }, // G#m
    '9_maj':  { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], baseFret: 1 }, // A
    '9_min':  { frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0], baseFret: 1 }, // Am
    '10_maj': { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 2, toString: 3, finger: 1 } }, // Bb
    '10_min': { frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 3, finger: 1 } }, // Bbm
    '11_maj': { frets: [4, 3, 2, 2], fingers: [3, 2, 1, 1], baseFret: 1, barre: { fret: 2, fromString: 2, toString: 3, finger: 1 } }, // B
    '11_min': { frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1], baseFret: 1, barre: { fret: 2, fromString: 1, toString: 3, finger: 1 } }  // Bm
  };

  const key = `${rootPc}_${isMinor ? 'min' : 'maj'}`;
  const shape = UKU_TABLE[key] || UKU_TABLE['0_maj'];
  return [
    {
      frets: shape.frets,
      fingers: shape.fingers,
      baseFret: shape.baseFret,
      barre: shape.barre,
      stringNotes: computeStringNotes(UKULELE_OPEN_PC, shape.frets, shape.baseFret)
    }
  ];
}

export function getMultiInstrumentChordInfo(
  chordSymbol: string,
  capo = 0
): MultiInstrumentChordInfo {
  const cleanSounding = (!chordSymbol || chordSymbol === 'N.C.' || chordSymbol === '—') ? 'F#m' : chordSymbol;
  const shapeSymbol = capo > 0 ? transposeChord(cleanSounding, -capo, 'all') : cleanSounding;

  const parseTarget = shapeSymbol.split('/')[0];
  const match = parseTarget.match(/^([A-G][#b]?)(.*)$/);
  const root = match ? match[1] : 'C';
  const suffix = match ? match[2] : '';

  const rootIdx = NOTE_TO_INDEX[root] ?? 0;
  const soundingRootMatch = cleanSounding.split('/')[0].match(/^([A-G][#b]?)(.*)$/);
  const soundingRoot = soundingRootMatch ? soundingRootMatch[1] : root;
  const soundingRootIdx = NOTE_TO_INDEX[soundingRoot] ?? rootIdx;

  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  const isAug = suffix.startsWith('aug');
  const isSus4 = suffix.includes('sus4');
  const isSus2 = suffix.includes('sus2');
  const hasMaj7 = suffix.includes('maj7') || suffix.includes('M7');
  const has7 = suffix.includes('7') && !hasMaj7;

  const intervals: number[] = [0];
  if (isSus2) intervals.push(2, 7);
  else if (isSus4) intervals.push(5, 7);
  else if (isDim) intervals.push(3, 6);
  else if (isAug) intervals.push(4, 8);
  else if (isMinor) intervals.push(3, 7);
  else intervals.push(4, 7);

  if (hasMaj7) intervals.push(11);
  else if (has7) intervals.push(10);

  const preferFlats = soundingRoot.includes('b');
  const notes = intervals.map((iv) => {
    const idx = (soundingRootIdx + iv) % 12;
    return preferFlats ? NOTES_FLAT[idx] : NOTES_SHARP[idx];
  });

  // Piano keys in 2-octave range (0..23 where 0 = C3)
  const pianoMidiKeys = intervals.map((iv) => soundingRootIdx + iv);

  let qualityLabel = 'Majör';
  if (isMinor && has7) qualityLabel = 'Minör 7';
  else if (isMinor) qualityLabel = 'Minör';
  else if (hasMaj7) qualityLabel = 'Majör 7';
  else if (has7) qualityLabel = 'Dominant 7';
  else if (isSus4) qualityLabel = 'Sus4';
  else if (isDim) qualityLabel = 'Diminished';

  return {
    symbol: cleanSounding,
    shapeSymbol,
    root: soundingRoot,
    qualityLabel,
    notes,
    pianoMidiKeys,
    guitarPositions: buildGuitarPositions(rootIdx, isMinor, has7, hasMaj7),
    ukulelePositions: buildUkulelePositions(rootIdx, isMinor)
  };
}

export function formatDurationSec(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
