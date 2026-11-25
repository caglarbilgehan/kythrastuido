import { renderToStaticMarkup } from 'react-dom/server';
import { FocusedChordWorkspace } from '../components/FocusedChordWorkspace';
import { FooterDockerControlCenter } from '../components/FooterDockerControlCenter';
import { KaraokeLyricsStage } from '../components/KaraokeLyricsStage';
import { SongInfoStrip } from '../components/SongInfoStrip';
import { StudioHeader } from '../components/StudioHeader';
import { StudioWelcomeView } from '../components/StudioWelcomeView';
import {
  SHOWCASE_DEFAULT_TIME_SEC,
  SHOWCASE_FAVORITES,
  SHOWCASE_LIBRARY_SONGS,
  SHOWCASE_MIXER_CHANNELS,
  SHOWCASE_PRIVATE_UPLOADS,
  SHOWCASE_STUDIO_SONG,
  SHOWCASE_USER,
  ShowcaseTheme,
  ShowcaseView
} from './showcaseData';

export interface StaticScreenRenderResult {
  slug: string;
  title: string;
  view: ShowcaseView;
  theme: ShowcaseTheme;
  markup: string;
}

const noop = () => {};
const noopAsync = async () => {};

function renderSingleScreen(view: ShowcaseView, theme: ShowcaseTheme): StaticScreenRenderResult {
  const isDarkMode = theme === 'dark';
  const language = 'tr' as const;
  const song = SHOWCASE_STUDIO_SONG;
  const currentTimeSec = SHOWCASE_DEFAULT_TIME_SEC;

  const activeBarIndex = Math.max(
    0,
    song.bars.findIndex((b) => currentTimeSec >= b.startSec && currentTimeSec < b.endSec)
  );
  const activeBar = song.bars[activeBarIndex] || song.bars[0];
  const prevBar = activeBarIndex > 0 ? song.bars[activeBarIndex - 1] : undefined;
  const nextBar = song.bars[activeBarIndex + 1];
  const activeSection =
    song.sections.find(
      (s) => activeBar.barNumber >= s.startBar && activeBar.barNumber <= s.endBar
    ) || song.sections[2];
  const loopRangeSec: [number, number] = [activeSection.startSec, activeSection.endSec];
  const activeBeatInBar = 2;

  const openPopover = view === 'mixer' ? ('mixer' as const) : null;
  const isWelcome = view === 'welcome';

  const element = (
    <div className="m3-app-shell">
      <StudioHeader
        language={language}
        isDarkMode={isDarkMode}
        user={SHOWCASE_USER}
        favorites={SHOWCASE_FAVORITES}
        privateUploads={SHOWCASE_PRIVATE_UPLOADS}
        initialLibrarySongs={SHOWCASE_LIBRARY_SONGS}
        isAccountCardOpen={false}
        isUploadDialogOpen={false}
        onSetAccountCardOpen={noop}
        onOpenUploadDialog={noop}
        onToggleDarkMode={noop}
        onSongLoaded={noop}
        onRenameTrack={noopAsync}
        onDeleteTrack={noopAsync}
        onAuthChanged={noop}
      />

      {isWelcome ? (
        <StudioWelcomeView
          language={language}
          privateUploads={SHOWCASE_PRIVATE_UPLOADS}
          initialLibrarySongs={SHOWCASE_LIBRARY_SONGS}
          onOpenUpload={noop}
          onSongLoaded={noop}
          onRenameTrack={noopAsync}
          onDeleteTrack={noopAsync}
        />
      ) : (
        <>
          <main className="m3-main-container">
            <SongInfoStrip
              song={song}
              language={language}
              instrument="guitar"
              transposeSemitones={0}
              capo={0}
              playbackSpeed={1.0}
              chordComplexity="all"
              currentTimeSec={currentTimeSec}
              durationSec={song.durationSec}
              loopRangeSec={loopRangeSec}
              activeSection={activeSection}
              isLoopActive={true}
              isMetronomeActive={false}
              isMasterMuted={false}
              customBarLoopRange={null}
              openPopover={openPopover}
              onSeekSec={noop}
              onToggleLoop={noop}
              onToggleMetronome={noop}
              onToggleMasterMute={noop}
              onSetOpenPopover={noop}
              isFavorite={true}
              onToggleFavorite={noop}
              onRenameTrack={noopAsync}
              onDeleteTrack={noopAsync}
            />

            <FocusedChordWorkspace
              language={language}
              sections={song.sections}
              bars={song.bars}
              activeSection={activeSection}
              focusedSection={activeSection}
              loopedSection={activeSection}
              activeBar={activeBar}
              prevBar={prevBar}
              nextBar={nextBar}
              activeBeatInBar={activeBeatInBar}
              currentTimeSec={currentTimeSec}
              durationSec={song.durationSec}
              waveformPeaks={song.waveformPeaks}
              loopRangeSec={loopRangeSec}
              isPlaying={false}
              instrument="guitar"
              transposeSemitones={0}
              capo={0}
              chordComplexity="all"
              autoFollowSection={true}
              isLoopActive={true}
              customBarLoopRange={null}
              onSelectSection={noop}
              onSelectBar={noop}
              onSeekSec={noop}
              onSetCustomBarLoopRange={noop}
              onToggleLoopCurrentSection={noop}
            />

            <KaraokeLyricsStage
              language={language}
              trackKey={song.trackKey}
              sections={song.sections}
              lyrics={song.lyrics}
              lyricsSource={song.lyricsSource}
              lyricsLocked={song.lyricsLocked}
              lyricsVersion={song.lyricsVersion}
              lyricsUpdatedBy={song.lyricsUpdatedBy}
              currentTimeSec={currentTimeSec}
              onSeekSec={noop}
              onLyricsUpdated={noop}
            />
          </main>

          <FooterDockerControlCenter
            language={language}
            songTitle={song.title}
            timeSignature={song.timeSignature}
            tempoBpm={song.tempoBpm}
            keySignature={song.keySignature}
            isFavorite={true}
            onToggleFavorite={noop}
            isPlaying={false}
            currentTimeSec={currentTimeSec}
            durationSec={song.durationSec}
            waveformPeaks={song.waveformPeaks}
            sections={song.sections}
            activeSection={activeSection}
            activeBarNumber={activeBar.barNumber}
            totalBars={song.totalBars}
            instrument="guitar"
            playbackSpeed={1.0}
            transposeSemitones={0}
            capo={0}
            chordComplexity="all"
            autoFollowSection={true}
            isLoopActive={true}
            isMetronomeActive={false}
            isMasterMuted={false}
            loopRangeSec={loopRangeSec}
            customBarLoopRange={null}
            openPopover={openPopover}
            stage3Status="completed"
            channels={SHOWCASE_MIXER_CHANNELS}
            activePreset={view === 'mixer' ? 'guitar_backing' : 'full'}
            onChangeLanguage={noop}
            onTogglePlay={noop}
            onPrevBar={noop}
            onSeekSec={noop}
            onToggleLoop={noop}
            onToggleMetronome={noop}
            onToggleMasterMute={noop}
            onClearCustomBarLoop={noop}
            onSetOpenPopover={noop}
            onChangeInstrument={noop}
            onChangeSpeed={noop}
            onChangeTranspose={noop}
            onChangeCapo={noop}
            onChangeChordComplexity={noop}
            onToggleAutoFollowSection={noop}
            onSetChannelVolume={noop}
            onToggleChannelMute={noop}
            onToggleChannelSolo={noop}
            onResetChannels={noop}
            onApplyMixPreset={noop}
          />
        </>
      )}
    </div>
  );

  const labels: Record<ShowcaseView, { slug: string; title: string }> = {
    studio: { slug: 'web-studio-active', title: 'Web Studio — Aktif Stüdyo' },
    mixer: { slug: 'web-studio-mixer', title: 'Web Studio — 6-Kanal Stem Mikser' },
    welcome: { slug: 'web-studio-welcome', title: 'Web Studio — Karşılama & Kütüphane' }
  };

  return {
    slug: `${labels[view].slug}-${theme}`,
    title: `${labels[view].title} (${theme === 'dark' ? 'Dark' : 'Light'})`,
    view,
    theme,
    markup: renderToStaticMarkup(element)
  };
}

export function renderAllStitchScreens(): StaticScreenRenderResult[] {
  const views: ShowcaseView[] = ['studio', 'mixer', 'welcome'];
  const themes: ShowcaseTheme[] = ['light', 'dark'];
  const results: StaticScreenRenderResult[] = [];
  for (const view of views) {
    for (const theme of themes) {
      results.push(renderSingleScreen(view, theme));
    }
  }
  return results;
}
