import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { M3Colors } from '../theme/material3';
import { MixPresetId, StemChannelState, StemId } from '../types/studio';

interface MobileStemMixerSheetProps {
  channels: StemChannelState[];
  activePreset: MixPresetId;
  onApplyPreset: (preset: MixPresetId) => void;
  onToggleMute: (id: StemId) => void;
  onToggleSolo: (id: StemId) => void;
  onStepVolume: (id: StemId, delta: number) => void;
  onReset: () => void;
}

const PRESETS: { id: MixPresetId; label: string }[] = [
  { id: 'full', label: 'Tam Miks' },
  { id: 'guitar_backing', label: 'Gitar Backing' },
  { id: 'guitar_focus', label: 'Sadece Gitar' },
  { id: 'vocal_karaoke', label: 'Karaoke' }
];

export const MobileStemMixerSheet: React.FC<MobileStemMixerSheetProps> = ({
  channels,
  activePreset,
  onApplyPreset,
  onToggleMute,
  onToggleSolo,
  onStepVolume,
  onReset
}) => {
  const isAnySolo = channels.some((c) => c.isSolo);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>6-Kanal Stüdyo Mikseri (BS-RoFormer)</Text>
        <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
          <Text style={styles.resetText}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      {/* Preset Chips */}
      <View style={styles.presetRow}>
        {PRESETS.map((p) => {
          const selected = activePreset === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => onApplyPreset(p.id)}
              style={[styles.presetChip, selected ? styles.presetChipSelected : null]}
            >
              <Text style={[styles.presetText, selected ? styles.presetTextSelected : null]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 6 Channels List */}
      <View style={styles.channelList}>
        {channels.map((ch) => {
          const silent = ch.isMuted || (isAnySolo && !ch.isSolo) || !ch.detected;
          const pct = silent ? 0 : Math.round(ch.volume * 100);
          return (
            <View key={ch.id} style={styles.channelRow}>
              <View style={styles.channelInfo}>
                <View style={[styles.dot, { backgroundColor: ch.color }]} />
                <View>
                  <Text style={styles.channelLabel}>{ch.label}</Text>
                  <Text style={styles.presenceText}>{ch.presenceLabel}</Text>
                </View>
              </View>

              <View style={styles.controlsRow}>
                <TouchableOpacity
                  onPress={() => onStepVolume(ch.id, -0.1)}
                  style={styles.volStepBtn}
                >
                  <Text style={styles.volStepText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.volPctText}>{pct}%</Text>
                <TouchableOpacity
                  onPress={() => onStepVolume(ch.id, 0.1)}
                  style={styles.volStepBtn}
                >
                  <Text style={styles.volStepText}>+</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onToggleMute(ch.id)}
                  style={[styles.msBtn, ch.isMuted ? styles.muteActive : null]}
                >
                  <Text style={[styles.msText, ch.isMuted ? styles.msTextActive : null]}>
                    M
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onToggleSolo(ch.id)}
                  style={[styles.msBtn, ch.isSolo ? styles.soloActive : null]}
                >
                  <Text style={[styles.msText, ch.isSolo ? styles.msTextActive : null]}>
                    S
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: M3Colors.surfaceLowest,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    gap: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  resetBtn: {
    backgroundColor: M3Colors.surfaceContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999
  },
  resetText: {
    fontSize: 11,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  presetChip: {
    backgroundColor: M3Colors.surfaceLow,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant
  },
  presetChipSelected: {
    backgroundColor: M3Colors.primary,
    borderColor: M3Colors.primary
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  presetTextSelected: {
    color: '#FFFFFF'
  },
  channelList: {
    gap: 8
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: M3Colors.surfaceLow,
    padding: 10,
    borderRadius: 12
  },
  channelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  channelLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  presenceText: {
    fontSize: 10,
    color: M3Colors.tertiary,
    fontWeight: '600'
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  volStepBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: M3Colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant
  },
  volStepText: {
    fontSize: 13,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  volPctText: {
    fontSize: 11,
    fontWeight: '700',
    width: 34,
    textAlign: 'center',
    color: M3Colors.onSurface
  },
  msBtn: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: M3Colors.surfaceLowest,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant
  },
  muteActive: {
    backgroundColor: M3Colors.error,
    borderColor: M3Colors.error
  },
  soloActive: {
    backgroundColor: M3Colors.amberSolo,
    borderColor: M3Colors.amberSolo
  },
  msText: {
    fontSize: 11,
    fontWeight: '800',
    color: M3Colors.onSurfaceVariant
  },
  msTextActive: {
    color: '#FFFFFF'
  }
});
