import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  EMPTY_STUDIO_SONG,
  deleteUploadedTrack,
  fetchAccountOverview,
  fetchActiveStudioSong,
  renameUploadedTrack,
  toggleFavoriteSong
} from './api/studioApi';
import { FocusedChordWorkspace } from './components/FocusedChordWorkspace';
import { FooterDockerControlCenter } from './components/FooterDockerControlCenter';
import { KaraokeLyricsStage } from './components/KaraokeLyricsStage';
import { SongInfoStrip } from './components/SongInfoStrip';
import { StudioHeader } from './components/StudioHeader';
import { StudioUploadDialog } from './components/StudioUploadDialog';
import { StudioWelcomeView } from './components/StudioWelcomeView';
import { useStemAudio } from './hooks/useStemAudio';
import { detectInitialLanguage, persistLanguage } from './i18n/translations';
import {
  AppLanguage,
  BarChordItem,
  ChordComplexityMode,
  DockerPopoverId,
  FavoriteSongItem,
  InstrumentType,
  PrivateUploadedSongItem,
  SongSection,
  StudioSong,
  StudioUser
} from './types/studio';

export const App: React.FC = () => {
  const [song, setSong] = useState<StudioSong | null>(null);
  const [language, setLanguage] = useState<AppLanguage>(() => detectInitialLanguage());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [user, setUser] = useState<StudioUser | null>(null);
  const [favorites, setFavorites] = useState<FavoriteSongItem[]>([]);
  const [privateUploads, setPrivateUploads] = useState<PrivateUploadedSongItem[]>([]);
  const [isAccountCardOpen, setIsAccountCardOpen] = useState<boolean>(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false);

  const [instrument, setInstrument] = useState<InstrumentType>('guitar');
  const [transposeSemitones, setTransposeSemitones] = useState<number>(0);
  const [capo, setCapo] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [chordComplexity, setChordComplexity] = useState<ChordComplexityMode>('all');
  const [autoFollowSection, setAutoFollowSection] = useState<boolean>(true);
  const [manualSectionId, setManualSectionId] = useState<string | null>(null);

  const [isLoopActive, setIsLoopActive] = useState<boolean>(false);
  const [customBarLoopRange, setCustomBarLoopRange] = useState<[number, number] | null>(null);
  const [openPopover, setOpenPopover] = useState<DockerPopoverId>(null);

  const activeSong = song ?? EMPTY_STUDIO_SONG;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    persistLanguage(language);
  }, [language]);

  const refreshAccountOverview = useCallback(() => {
    fetchAccountOverview().then((overview) => {
      setUser(overview.user);
      setFavorites(overview.favorites);
      setPrivateUploads(overview.private_uploads);
    });
  }, []);

  useEffect(() => {
    fetchActiveStudioSong().then((liveSong) => {
      if (liveSong) {
        setSong(liveSong);
      }
    });
    refreshAccountOverview();
  }, [refreshAccountOverview]);

  const isBackgroundProcessing = Boolean(
    song &&
    song.source === 'live' &&
    (song.stage3Status === 'running' ||
      song.stage4Status === 'running' ||
      song.sectionsRefining)
  );

  useEffect(() => {
    if (!isBackgroundProcessing) return;
    const interval = window.setInterval(async () => {
      const updated = await fetchActiveStudioSong();
      if (!updated) return;
      setSong((prev) => {
        if (!prev) return updated;
        const prevSecSig = prev.sections.map((s) => `${s.name}:${s.startSec}`).join('|');
        const nextSecSig = updated.sections.map((s) => `${s.name}:${s.startSec}`).join('|');
        if (
          prev.id === updated.id &&
          prev.stage3Status === updated.stage3Status &&
          prev.stage4Status === updated.stage4Status &&
            prev.sectionsRefining === updated.sectionsRefining &&
            Object.keys(prev.stems).length === Object.keys(updated.stems).length &&
            prevSecSig === nextSecSig &&
            prev.lyrics.length === updated.lyrics.length &&
            prev.lyricsSource === updated.lyricsSource
        ) {
        return prev;
      }
      return updated;
    });
  }, 1500);
  return () => window.clearInterval(interval);
  }, [isBackgroundProcessing]);

const [currentSectionForLoop, setCurrentSectionForLoop] = useState<SongSection | undefined>(
  activeSong.sections[0]
);

const loopRangeSec = useMemo<[number, number] | null>(() => {
  if (!isLoopActive && !customBarLoopRange) return null;

  if (customBarLoopRange) {
    const startBarObj = activeSong.bars.find((b) => b.barNumber === customBarLoopRange[0]);
    const endBarObj = activeSong.bars.find((b) => b.barNumber === customBarLoopRange[1]);
    if (startBarObj && endBarObj) {
      return [startBarObj.startSec, endBarObj.endSec];
    }
  }

  if (isLoopActive && currentSectionForLoop) {
    return [currentSectionForLoop.startSec, currentSectionForLoop.endSec];
  }

  return null;
}, [isLoopActive, customBarLoopRange, currentSectionForLoop, activeSong.bars]);

const stemAudio = useStemAudio({
  song: activeSong,
  playbackSpeed,
  loopRangeSec
});

const activeBarIndex = useMemo(() => {
  if (!activeSong.bars.length) return 0;
  const idx = activeSong.bars.findIndex(
    (b) => stemAudio.currentTimeSec >= b.startSec && stemAudio.currentTimeSec < b.endSec
  );
  if (idx >= 0) return idx;
  if (stemAudio.currentTimeSec >= (activeSong.bars[activeSong.bars.length - 1]?.endSec || 0)) {
    return activeSong.bars.length - 1;
  }
  return 0;
}, [activeSong.bars, stemAudio.currentTimeSec]);

const activeBar: BarChordItem | undefined = activeSong.bars[activeBarIndex] || activeSong.bars[0];
const prevBar: BarChordItem | undefined =
  activeBarIndex > 0 ? activeSong.bars[activeBarIndex - 1] : undefined;
const nextBar: BarChordItem | undefined = activeSong.bars[activeBarIndex + 1];

const activeSection: SongSection | undefined = useMemo(() => {
  if (!activeSong.sections.length) return undefined;
  return (
    activeSong.sections.find(
      (s) =>
        activeBar &&
        activeBar.barNumber >= s.startBar &&
        activeBar.barNumber <= s.endBar
    ) || activeSong.sections[0]
  );
}, [activeSong.sections, activeBar]);

useEffect(() => {
  if (!isLoopActive && activeSection) {
    setCurrentSectionForLoop(activeSection);
  }
}, [activeSection, isLoopActive]);

const focusedSection: SongSection | undefined = useMemo(() => {
  if (isLoopActive) {
    if (manualSectionId) {
      return activeSong.sections.find((s) => s.id === manualSectionId) || currentSectionForLoop || activeSection;
    }
    return currentSectionForLoop || activeSection;
  }
  if (!autoFollowSection && manualSectionId) {
    return activeSong.sections.find((s) => s.id === manualSectionId) || activeSection;
  }
  return activeSection;
}, [isLoopActive, currentSectionForLoop, autoFollowSection, manualSectionId, activeSong.sections, activeSection]);

const activeBeatInBar = useMemo(() => {
  if (!activeBar || activeBar.durationSec <= 0) return 1;
  const rel = Math.max(0, stemAudio.currentTimeSec - activeBar.startSec);
  const beatFloat = (rel / activeBar.durationSec) * 4;
  return Math.min(4, Math.max(1, Math.floor(beatFloat) + 1));
}, [activeBar, stemAudio.currentTimeSec]);

const handleSelectSection = useCallback(
  (section: SongSection) => {
    setManualSectionId(section.id);
    if (isLoopActive) {
      return;
    }
    setCurrentSectionForLoop(section);
    stemAudio.seekToSec(section.startSec);
  },
  [isLoopActive, stemAudio]
);

const handleSelectBar = useCallback(
  (bar: BarChordItem) => {
    stemAudio.seekToSec(bar.startSec);
  },
  [stemAudio]
);

const handlePrevBar = useCallback(() => {
  stemAudio.seekToSec(0);
}, [stemAudio]);

const handleToggleLoop = useCallback(() => {
  setIsLoopActive((prev) => {
    const next = !prev;
    if (next && activeSection) {
      setCurrentSectionForLoop(activeSection);
      setManualSectionId(activeSection.id);
    }
    if (!next) {
      setCustomBarLoopRange(null);
    }
    return next;
  });
}, [activeSection]);

const handleSetCustomBarLoopRange = useCallback((range: [number, number] | null) => {
  setCustomBarLoopRange(range);
  if (range) {
    setIsLoopActive(true);
  }
}, []);

useEffect(() => {
  if (!song) return;
  const onKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      stemAudio.togglePlay();
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, [song, stemAudio]);

const handleSongLoaded = useCallback((nextSong: StudioSong) => {
  setTransposeSemitones(0);
  setCapo(0);
  setCustomBarLoopRange(null);
  setIsLoopActive(false);
  setManualSectionId(null);
  setSong(nextSong);
}, []);

const isCurrentSongFavorite = useMemo(
  () => (song ? favorites.some((f) => f.track_key === song.trackKey) : false),
  [favorites, song]
);

const handleToggleFavorite = useCallback(async () => {
  if (!song) return;
  if (!user) {
    setIsAccountCardOpen(true);
    return;
  }
  try {
    const res = await toggleFavoriteSong(song);
    setFavorites(res.favorites);
  } catch {
    // ignore
  }
}, [user, song]);

const handleRenameTrack = useCallback(
  async (trackKey: string, newTitle: string) => {
    const res = await renameUploadedTrack(trackKey, newTitle);
    setSong((prev) => (prev && prev.trackKey === trackKey ? { ...prev, title: res.title } : prev));
    if (user) {
      setPrivateUploads(res.private_uploads);
      setFavorites(res.favorites);
    }
    refreshAccountOverview();
  },
  [user, refreshAccountOverview]
);

const handleDeleteTrack = useCallback(
  async (trackKey: string) => {
    const res = await deleteUploadedTrack(trackKey);
    setSong((prev) => (prev && (prev.trackKey === trackKey || res.reset_active) ? null : prev));
    if (user) {
      setPrivateUploads(res.private_uploads);
      setFavorites(res.favorites);
    }
    refreshAccountOverview();
  },
  [user, refreshAccountOverview]
);

return (
  <div className="m3-app-shell">
    <StudioHeader
      language={language}
      isDarkMode={isDarkMode}
      user={user}
      favorites={favorites}
      privateUploads={privateUploads}
      isAccountCardOpen={isAccountCardOpen}
      isUploadDialogOpen={isUploadDialogOpen}
      onSetAccountCardOpen={setIsAccountCardOpen}
      onOpenUploadDialog={() => setIsUploadDialogOpen(true)}
      onToggleDarkMode={() => setIsDarkMode((v) => !v)}
      onSongLoaded={handleSongLoaded}
      onRenameTrack={handleRenameTrack}
      onDeleteTrack={handleDeleteTrack}
      onAuthChanged={refreshAccountOverview}
    />

    <StudioUploadDialog
      isOpen={isUploadDialogOpen}
      language={language}
      onClose={() => setIsUploadDialogOpen(false)}
      onSongLoaded={handleSongLoaded}
      onAuthChanged={refreshAccountOverview}
    />

    {!song || !activeBar ? (
      <StudioWelcomeView
        language={language}
        privateUploads={privateUploads}
        onOpenUpload={() => setIsUploadDialogOpen(true)}
        onSongLoaded={handleSongLoaded}
        onRenameTrack={handleRenameTrack}
        onDeleteTrack={handleDeleteTrack}
      />
    ) : (
      <>
        <main className="m3-main-container">
          <SongInfoStrip
            song={song}
            language={language}
            instrument={instrument}
            transposeSemitones={transposeSemitones}
            capo={capo}
            playbackSpeed={playbackSpeed}
            chordComplexity={chordComplexity}
            currentTimeSec={stemAudio.currentTimeSec}
            durationSec={song.durationSec}
            loopRangeSec={loopRangeSec}
            activeSection={activeSection}
            isLoopActive={isLoopActive}
            isMetronomeActive={stemAudio.isMetronomeActive}
            isMasterMuted={stemAudio.isMasterMuted}
            customBarLoopRange={customBarLoopRange}
            openPopover={openPopover}
            onSeekSec={stemAudio.seekToSec}
            onToggleLoop={handleToggleLoop}
            onToggleMetronome={stemAudio.toggleMetronome}
            onToggleMasterMute={stemAudio.toggleMasterMute}
            onSetOpenPopover={setOpenPopover}
            isFavorite={isCurrentSongFavorite}
            onToggleFavorite={handleToggleFavorite}
            onRenameTrack={handleRenameTrack}
            onDeleteTrack={handleDeleteTrack}
          />

          <FocusedChordWorkspace
            language={language}
            sections={song.sections}
            bars={song.bars}
            activeSection={activeSection}
            focusedSection={focusedSection}
            loopedSection={isLoopActive ? currentSectionForLoop : undefined}
            activeBar={activeBar}
            prevBar={prevBar}
            nextBar={nextBar}
            activeBeatInBar={activeBeatInBar}
            currentTimeSec={stemAudio.currentTimeSec}
            durationSec={song.durationSec}
            waveformPeaks={song.waveformPeaks}
            loopRangeSec={loopRangeSec}
            isPlaying={stemAudio.isPlaying}
            instrument={instrument}
            transposeSemitones={transposeSemitones}
            capo={capo}
            chordComplexity={chordComplexity}
            autoFollowSection={autoFollowSection}
            isLoopActive={isLoopActive}
            customBarLoopRange={customBarLoopRange}
            onSelectSection={handleSelectSection}
            onSelectBar={handleSelectBar}
            onSeekSec={stemAudio.seekToSec}
            onSetCustomBarLoopRange={handleSetCustomBarLoopRange}
            onToggleLoopCurrentSection={handleToggleLoop}
          />

          <KaraokeLyricsStage
            language={language}
            trackKey={song.trackKey}
            sections={song.sections}
            lyrics={song.lyrics || []}
            lyricsSource={song.lyricsSource}
            lyricsLocked={song.lyricsLocked}
            lyricsVersion={song.lyricsVersion}
            lyricsUpdatedBy={song.lyricsUpdatedBy}
            currentTimeSec={stemAudio.currentTimeSec}
            onSeekSec={(sec) => {
              if (!isLoopActive) {
                stemAudio.seekToSec(sec);
              }
            }}
            onLyricsUpdated={(nextLyrics, nextVersion, updatedBy) => {
              setSong((prev) =>
                prev
                  ? {
                    ...prev,
                    lyrics: nextLyrics,
                    lyricsSource: 'user',
                    lyricsLocked: false,
                    lyricsVersion: nextVersion,
                    lyricsUpdatedBy: updatedBy
                  }
                  : prev
              );
            }}
          />
        </main>

        <FooterDockerControlCenter
          language={language}
          songTitle={song.title}
          timeSignature={song.timeSignature}
          tempoBpm={song.tempoBpm}
          keySignature={song.keySignature}
          isFavorite={isCurrentSongFavorite}
          onToggleFavorite={handleToggleFavorite}
          isPlaying={stemAudio.isPlaying}
          currentTimeSec={stemAudio.currentTimeSec}
          durationSec={song.durationSec}
          waveformPeaks={song.waveformPeaks}
          sections={song.sections}
          activeSection={activeSection}
          activeBarNumber={activeBar?.barNumber || 1}
          totalBars={song.totalBars}
          instrument={instrument}
          playbackSpeed={playbackSpeed}
          transposeSemitones={transposeSemitones}
          capo={capo}
          chordComplexity={chordComplexity}
          autoFollowSection={autoFollowSection}
          isLoopActive={isLoopActive}
          isMetronomeActive={stemAudio.isMetronomeActive}
          isMasterMuted={stemAudio.isMasterMuted}
          loopRangeSec={loopRangeSec}
          customBarLoopRange={customBarLoopRange}
          openPopover={openPopover}
          stage3Status={song.stage3Status}
          channels={stemAudio.channels}
          activePreset={stemAudio.activePreset}
          onChangeLanguage={setLanguage}
          onTogglePlay={stemAudio.togglePlay}
          onPrevBar={handlePrevBar}
          onSeekSec={stemAudio.seekToSec}
          onToggleLoop={handleToggleLoop}
          onToggleMetronome={stemAudio.toggleMetronome}
          onToggleMasterMute={stemAudio.toggleMasterMute}
          onClearCustomBarLoop={() => setCustomBarLoopRange(null)}
          onSetOpenPopover={setOpenPopover}
          onChangeInstrument={setInstrument}
          onChangeSpeed={setPlaybackSpeed}
          onChangeTranspose={setTransposeSemitones}
          onChangeCapo={setCapo}
          onChangeChordComplexity={setChordComplexity}
          onToggleAutoFollowSection={() => setAutoFollowSection((v) => !v)}
          onSetChannelVolume={stemAudio.setChannelVolume}
          onToggleChannelMute={stemAudio.toggleMute}
          onToggleChannelSolo={stemAudio.toggleSolo}
          onResetChannels={stemAudio.resetChannels}
          onApplyMixPreset={stemAudio.applyMixPreset}
        />
      </>
    )}
  </div>
);
};

export default App;
