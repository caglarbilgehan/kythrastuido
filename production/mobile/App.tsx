import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import {
  analyzeYoutubeFromMobile,
  fetchMobileStudioSong,
  MOBILE_DEMO_SONG
} from './src/api/studioApi';
import { MobileChordGrid } from './src/components/MobileChordGrid';
import { MobileLiveChordCard } from './src/components/MobileLiveChordCard';
import { MobileSectionPills } from './src/components/MobileSectionPills';
import { MobileStemMixerSheet } from './src/components/MobileStemMixerSheet';
import { M3Colors } from './src/theme/material3';
import {
  BarChordItem,
  MixPresetId,
  PipelineProgressStep,
  SongSection,
  StemChannelState,
  StemId,
  StudioSong
} from './src/types/studio';

const INITIAL_CHANNELS: StemChannelState[] = [
  { id: 'guitar', label: 'Gitar', role: 'Akustik / Elektro', color: '#1A56DB', volume: 0.9, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'vocals', label: 'Vokal', role: 'Ana & Geri Vokal', color: '#D95326', volume: 0.85, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'bass', label: 'Bas Gitar', role: 'Bas & Groove', color: '#0D7A6F', volume: 0.85, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'drums', label: 'Davul', role: 'Perküsyon & Ritim', color: '#D97706', volume: 0.85, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'piano', label: 'Piyano', role: 'Tuşlu & Synth', color: '#7C3AED', volume: 0.8, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' },
  { id: 'other', label: 'Diğer', role: 'Ambiyans', color: '#64748B', volume: 0.75, isMuted: false, isSolo: false, detected: true, presenceLabel: 'Aktif Sinyal' }
];

export default function App() {
  const [song, setSong] = useState<StudioSong>(MOBILE_DEMO_SONG);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [loopedSectionId, setLoopedSectionId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<MixPresetId>('full');
  const [channels, setChannels] = useState<StemChannelState[]>(INITIAL_CHANNELS);
  const [showMixer, setShowMixer] = useState(true);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [youtubeInput, setYoutubeInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineSteps, setPipelineSteps] = useState<PipelineProgressStep[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    fetchMobileStudioSong().then((live) => {
      if (live) setSong(live);
    });
  }, []);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev + 0.1;
        if (loopedSectionId) {
          const sec = song.sections.find((s) => s.id === loopedSectionId);
          if (sec && next >= sec.endSec) return sec.startSec;
        }
        if (next >= song.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [isPlaying, loopedSectionId, song.sections, song.durationSec]);

  const activeBarIndex = useMemo(() => {
    const idx = song.bars.findIndex(
      (b) => currentTimeSec >= b.startSec && currentTimeSec < b.endSec
    );
    return idx >= 0 ? idx : 0;
  }, [song.bars, currentTimeSec]);

  const activeBar: BarChordItem = song.bars[activeBarIndex] || song.bars[0];
  const nextBar: BarChordItem | undefined = song.bars[activeBarIndex + 1];

  const activeSection: SongSection | undefined = useMemo(() => {
    return (
      song.sections.find(
        (s) => activeBar && activeBar.barNumber >= s.startBar && activeBar.barNumber <= s.endBar
      ) || song.sections[0]
    );
  }, [song.sections, activeBar]);

  const activeBeatInBar = useMemo(() => {
    if (!activeBar || activeBar.durationSec <= 0) return 1;
    const rel = Math.max(0, currentTimeSec - activeBar.startSec);
    return Math.min(4, Math.max(1, Math.floor((rel / activeBar.durationSec) * 4) + 1));
  }, [activeBar, currentTimeSec]);

  const handleApplyPreset = (preset: MixPresetId) => {
    setActivePreset(preset);
    setChannels((prev) =>
      prev.map((c) => {
        if (preset === 'full') return { ...c, isMuted: false, isSolo: false };
        if (preset === 'guitar_backing') return { ...c, isMuted: c.id === 'guitar', isSolo: false };
        if (preset === 'guitar_focus') return { ...c, isMuted: false, isSolo: c.id === 'guitar' };
        if (preset === 'vocal_karaoke') return { ...c, isMuted: c.id === 'vocals', isSolo: false };
        return c;
      })
    );
  };

  const handleRunYoutube = async () => {
    if (!youtubeInput.trim()) return;
    setIsAnalyzing(true);
    try {
      const nextSong = await analyzeYoutubeFromMobile(youtubeInput, (steps, msg) => {
        setPipelineSteps(steps);
        setStatusMessage(msg);
      });
      setSong(nextSong);
      setShowAnalyzer(false);
      setYoutubeInput('');
    } catch (e: any) {
      setStatusMessage(e?.message || 'Analiz hatası');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={M3Colors.surfaceLowest} />

      {/* Google Material 3 Mobile App Bar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoText}>K</Text>
          </View>
          <View style={styles.titleCol}>
            <Text style={styles.songTitle} numberOfLines={1}>
              {song.title}
            </Text>
            <Text style={styles.songSub}>
              {song.tempoBpm} BPM · {song.keySignature} · {song.timeSignature}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setShowMixer((v) => !v)}
            style={[styles.iconChip, showMixer ? styles.iconChipActive : null]}
          >
            <Text style={[styles.iconChipText, showMixer ? styles.iconChipTextActive : null]}>
              Mikser
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowAnalyzer((v) => !v)}
            style={styles.primaryChip}
          >
            <Text style={styles.primaryChipText}>+ Analiz</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Optional New Song YouTube Analyzer Card */}
        {showAnalyzer && (
          <View style={styles.analyzerCard}>
            <Text style={styles.analyzerTitle}>
              3 Aşamalı Şarkı Analizi (Android & iOS)
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                value={youtubeInput}
                onChangeText={setYoutubeInput}
                placeholder="YouTube Linki yapıştırın..."
                style={styles.textInput}
              />
              <TouchableOpacity
                disabled={isAnalyzing}
                onPress={handleRunYoutube}
                style={styles.analyzeBtn}
              >
                <Text style={styles.analyzeBtnText}>
                  {isAnalyzing ? '...' : 'Başlat'}
                </Text>
              </TouchableOpacity>
            </View>
            {statusMessage ? (
              <Text style={styles.statusMsg}>{statusMessage}</Text>
            ) : null}
            {pipelineSteps.map((st) => (
              <Text key={st.stageNum} style={styles.stepLine}>
                {st.title}: {st.status.toUpperCase()} {st.summary ? `(${st.summary})` : ''}
              </Text>
            ))}
          </View>
        )}

        {/* 1. Section Navigation Pills */}
        <MobileSectionPills
          sections={song.sections}
          activeSectionId={activeSection?.id}
          loopedSectionId={loopedSectionId}
          onSelectSection={(sec) => setCurrentTimeSec(sec.startSec)}
          onToggleLoopSection={(sec) =>
            setLoopedSectionId((prev) => (prev === sec.id ? null : sec.id))
          }
        />

        {/* 2. Live Active Chord & Beat Pulse Card */}
        <MobileLiveChordCard
          activeBar={activeBar}
          nextBar={nextBar}
          activeSection={activeSection}
          activeBeatInBar={activeBeatInBar}
          tempoBpm={song.tempoBpm}
          keySignature={song.keySignature}
          transposeSemitones={transposeSemitones}
          onChangeTranspose={(delta) =>
            setTransposeSemitones((prev) => Math.max(-6, Math.min(6, prev + delta)))
          }
          isPlaying={isPlaying}
        />

        {/* 3. 6-Channel Stem Mixer Sheet */}
        {showMixer && (
          <MobileStemMixerSheet
            channels={channels}
            activePreset={activePreset}
            onApplyPreset={handleApplyPreset}
            onToggleMute={(id) =>
              setChannels((prev) =>
                prev.map((c) => (c.id === id ? { ...c, isMuted: !c.isMuted } : c))
              )
            }
            onToggleSolo={(id) =>
              setChannels((prev) => {
                const target = prev.find((c) => c.id === id);
                const nextSolo = !target?.isSolo;
                return prev.map((c) => ({ ...c, isSolo: c.id === id ? nextSolo : false }));
              })
            }
            onStepVolume={(id, delta) =>
              setChannels((prev) =>
                prev.map((c) =>
                  c.id === id
                    ? { ...c, volume: Math.max(0, Math.min(1, Number((c.volume + delta).toFixed(2)))) }
                    : c
                )
              )
            }
            onReset={() => setChannels(INITIAL_CHANNELS)}
          />
        )}

        {/* 4. Interactive 4-Column Measure & Chord Grid */}
        <MobileChordGrid
          bars={song.bars}
          activeBarNumber={activeBar?.barNumber || 1}
          transposeSemitones={transposeSemitones}
          onSelectBar={(bar) => setCurrentTimeSec(bar.startSec)}
        />
      </ScrollView>

      {/* Bottom Floating Transport Bar */}
      <View style={styles.transportDock}>
        <TouchableOpacity
          onPress={() => {
            const prev = song.bars[Math.max(0, activeBarIndex - 1)];
            if (prev) setCurrentTimeSec(prev.startSec);
          }}
          style={styles.navBtn}
        >
          <Text style={styles.navBtnText}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsPlaying((v) => !v)}
          style={styles.playBtn}
        >
          <Text style={styles.playBtnText}>{isPlaying ? 'Duraklat' : '▶ Oynat'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            const next = song.bars[Math.min(song.bars.length - 1, activeBarIndex + 1)];
            if (next) setCurrentTimeSec(next.startSec);
          }}
          style={styles.navBtn}
        >
          <Text style={styles.navBtnText}>⏭</Text>
        </TouchableOpacity>

        <View style={styles.timeBox}>
          <Text style={styles.timeText}>
            Ölçü {activeBar?.barNumber || 1} / {song.totalBars}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: M3Colors.surface
  },
  header: {
    backgroundColor: M3Colors.surfaceLowest,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: M3Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: M3Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  titleCol: {
    flex: 1
  },
  songTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: M3Colors.onSurface
  },
  songSub: {
    fontSize: 11,
    fontWeight: '600',
    color: M3Colors.onSurfaceVariant
  },
  headerActions: {
    flexDirection: 'row',
    gap: 6
  },
  iconChip: {
    backgroundColor: M3Colors.surfaceContainer,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999
  },
  iconChipActive: {
    backgroundColor: M3Colors.primarySoft
  },
  iconChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  iconChipTextActive: {
    color: M3Colors.primary
  },
  primaryChip: {
    backgroundColor: M3Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999
  },
  primaryChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  content: {
    padding: 14,
    paddingBottom: 96,
    gap: 14
  },
  analyzerCard: {
    backgroundColor: M3Colors.surfaceLowest,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    gap: 8
  },
  analyzerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8
  },
  textInput: {
    flex: 1,
    backgroundColor: M3Colors.surfaceLow,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12
  },
  analyzeBtn: {
    backgroundColor: M3Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    justifyContent: 'center'
  },
  analyzeBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700'
  },
  statusMsg: {
    fontSize: 11,
    fontWeight: '600',
    color: M3Colors.primary
  },
  stepLine: {
    fontSize: 11,
    color: M3Colors.onSurfaceVariant
  },
  transportDock: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    backgroundColor: M3Colors.surfaceLowest,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: M3Colors.outlineVariant,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: M3Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navBtnText: {
    fontSize: 14
  },
  playBtn: {
    backgroundColor: M3Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800'
  },
  timeBox: {
    paddingHorizontal: 8
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.primary
  }
});
