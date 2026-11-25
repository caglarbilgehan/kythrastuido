import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { M3Colors } from '../theme/material3';
import { BarChordItem } from '../types/studio';
import { transposeChord } from '../utils/musicTheory';

interface MobileChordGridProps {
  bars: BarChordItem[];
  activeBarNumber: number;
  transposeSemitones: number;
  onSelectBar: (bar: BarChordItem) => void;
}

export const MobileChordGrid: React.FC<MobileChordGridProps> = ({
  bars,
  activeBarNumber,
  transposeSemitones,
  onSelectBar
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ölçü & Akor Izgarası ({bars.length} Ölçü)</Text>
      <View style={styles.grid}>
        {bars.map((bar) => {
          const isCurrent = bar.barNumber === activeBarNumber;
          const chord = transposeChord(bar.chord, transposeSemitones);
          return (
            <TouchableOpacity
              key={bar.barNumber}
              onPress={() => onSelectBar(bar)}
              style={[styles.cell, isCurrent ? styles.cellActive : null]}
            >
              <Text style={[styles.barNum, isCurrent ? styles.barNumActive : null]}>
                #{bar.barNumber}
              </Text>
              <Text style={[styles.chordText, isCurrent ? styles.chordTextActive : null]}>
                {chord}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: M3Colors.surfaceLowest,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    gap: 10
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  cell: {
    width: '23%',
    backgroundColor: M3Colors.surfaceLow,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    gap: 3
  },
  cellActive: {
    backgroundColor: M3Colors.secondarySoft,
    borderColor: M3Colors.secondary,
    borderWidth: 2
  },
  barNum: {
    fontSize: 10,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  },
  barNumActive: {
    color: M3Colors.secondary
  },
  chordText: {
    fontSize: 15,
    fontWeight: '800',
    color: M3Colors.onSurface
  },
  chordTextActive: {
    color: M3Colors.secondary
  }
});
