import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { M3Colors } from '../theme/material3';
import { BarChordItem, SongSection } from '../types/studio';
import { getChordVoicingInfo, transposeChord, transposeKeySignature } from '../utils/musicTheory';

interface MobileLiveChordCardProps {
  activeBar: BarChordItem;
  nextBar?: BarChordItem;
  activeSection?: SongSection;
  activeBeatInBar: number;
  tempoBpm: number;
  keySignature: string;
  transposeSemitones: number;
  onChangeTranspose: (delta: number) => void;
  isPlaying: boolean;
}

const STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];

export const MobileLiveChordCard: React.FC<MobileLiveChordCardProps> = ({
  activeBar,
  nextBar,
  activeSection,
  activeBeatInBar,
  tempoBpm,
  keySignature,
  transposeSemitones,
  onChangeTranspose,
  isPlaying
}) => {
  const currentChord = transposeChord(activeBar?.chord || 'F#m', transposeSemitones);
  const upcomingChord = transposeChord(nextBar?.chord || '—', transposeSemitones);
  const formattedKey = transposeKeySignature(keySignature, transposeSemitones);
  const voicing = getChordVoicingInfo(currentChord);

  return (
    <View style={styles.card}>
      {/* Top Row: Section Pill + Measure & Key Badge */}
      <View style={styles.topRow}>
        <View style={styles.sectionPill}>
          <Text style={styles.sectionPillText}>{activeSection?.name || 'Bölüm'}</Text>
        </View>
        <View style={styles.metaPill}>
          <Text style={styles.metaPillText}>
            Ölçü #{activeBar?.barNumber || 1} · {tempoBpm} BPM
          </Text>
        </View>
      </View>

      {/* Main Chord & Guitar Voicing Row */}
      <View style={styles.mainRow}>
        <View style={styles.chordColumn}>
          <Text style={styles.chordSymbol}>{currentChord}</Text>
          <Text style={styles.qualityText}>{voicing.qualityLabel}</Text>
          <View style={styles.notesRow}>
            {voicing.notes.map((n, idx) => (
              <View key={`${n}-${idx}`} style={styles.noteChip}>
                <Text style={styles.noteChipText}>{n}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Guitar Fretboard Mini Box */}
        <View style={styles.diagramBox}>
          <Text style={styles.diagramTitle}>Gitar ({voicing.baseFret}. Perde)</Text>
          <View style={styles.stringsRow}>
            {voicing.frets.map((fret, idx) => (
              <View key={idx} style={styles.stringCol}>
                <Text style={styles.stringLabel}>{STRING_LABELS[idx]}</Text>
                <View
                  style={[
                    styles.fretBadge,
                    fret === 'x'
                      ? styles.fretMuted
                      : fret === 0
                      ? styles.fretOpen
                      : styles.fretActive
                  ]}
                >
                  <Text
                    style={[
                      styles.fretText,
                      fret !== 'x' && fret !== 0 ? styles.fretTextActive : null
                    ]}
                  >
                    {String(fret)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Row: 4-Beat Pulse + Next Chord + Transpose */}
      <View style={styles.bottomRow}>
        <View style={styles.beatsRow}>
          {[1, 2, 3, 4].map((beat) => {
            const active = isPlaying && activeBeatInBar === beat;
            return (
              <View
                key={beat}
                style={[
                  styles.beatCircle,
                  active
                    ? beat === 1
                      ? styles.beatCircleDownbeat
                      : styles.beatCircleActive
                    : null
                ]}
              >
                <Text style={[styles.beatText, active ? styles.beatTextActive : null]}>
                  {beat}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.nextBox}>
          <Text style={styles.nextLabel}>Sıradaki:</Text>
          <Text style={styles.nextChord}>{upcomingChord}</Text>
        </View>

        <View style={styles.transposePill}>
          <TouchableOpacity onPress={() => onChangeTranspose(-1)} style={styles.trBtn}>
            <Text style={styles.trBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.trValue}>
            {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones}
          </Text>
          <TouchableOpacity onPress={() => onChangeTranspose(1)} style={styles.trBtn}>
            <Text style={styles.trBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.keyBar}>
        <Text style={styles.keyBarText}>Şarkı Tonu: {formattedKey}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: M3Colors.surfaceLowest,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    gap: 12
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionPill: {
    backgroundColor: M3Colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999
  },
  sectionPillText: {
    color: M3Colors.primary,
    fontSize: 12,
    fontWeight: '700'
  },
  metaPill: {
    backgroundColor: M3Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  metaPillText: {
    color: M3Colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: '600'
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12
  },
  chordColumn: {
    flex: 1,
    gap: 4
  },
  chordSymbol: {
    fontSize: 44,
    fontWeight: '800',
    color: M3Colors.onSurface
  },
  qualityText: {
    fontSize: 12,
    fontWeight: '600',
    color: M3Colors.secondary
  },
  notesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4
  },
  noteChip: {
    backgroundColor: M3Colors.surfaceHigh,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },
  noteChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  diagramBox: {
    backgroundColor: M3Colors.surfaceLow,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    alignItems: 'center',
    gap: 6
  },
  diagramTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  },
  stringsRow: {
    flexDirection: 'row',
    gap: 4
  },
  stringCol: {
    alignItems: 'center',
    gap: 3
  },
  stringLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  },
  fretBadge: {
    width: 22,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fretMuted: {
    backgroundColor: M3Colors.surfaceContainer
  },
  fretOpen: {
    backgroundColor: M3Colors.tertiarySoft
  },
  fretActive: {
    backgroundColor: M3Colors.primary
  },
  fretText: {
    fontSize: 11,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  fretTextActive: {
    color: M3Colors.onPrimary
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: M3Colors.surfaceContainer
  },
  beatsRow: {
    flexDirection: 'row',
    gap: 6
  },
  beatCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: M3Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  beatCircleDownbeat: {
    backgroundColor: M3Colors.secondary
  },
  beatCircleActive: {
    backgroundColor: M3Colors.primary
  },
  beatText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  },
  beatTextActive: {
    color: '#FFFFFF'
  },
  nextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  nextLabel: {
    fontSize: 11,
    color: M3Colors.onSurfaceVariant
  },
  nextChord: {
    fontSize: 16,
    fontWeight: '800',
    color: M3Colors.secondary
  },
  transposePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: M3Colors.surfaceContainer,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 6
  },
  trBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: M3Colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center'
  },
  trBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  trValue: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.primary
  },
  keyBar: {
    backgroundColor: M3Colors.tertiarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10
  },
  keyBarText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.tertiary
  }
});
