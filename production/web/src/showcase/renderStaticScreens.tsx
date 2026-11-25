import { renderToStaticMarkup } from 'react-dom/server';
import { FocusedChordWorkspace } from '../components/FocusedChordWorkspace';
import { FooterDockerControlCenter } from '../components/FooterDockerControlCenter';
import { KaraokeLyricsStage } from '../components/KaraokeLyricsStage';
import { SongInfoStrip } from '../components/SongInfoStrip';
import { StudioHeader } from '../components/StudioHeader';
import { StudioUploadDialog } from '../components/StudioUploadDialog';
import { StudioWelcomeView } from '../components/StudioWelcomeView';
import { DockerPopoverId, InstrumentType } from '../types/studio';
import {
  SHOWCASE_DEFAULT_TIME_SEC,
  SHOWCASE_FAVORITES,
  SHOWCASE_LIBRARY_SONGS,
  SHOWCASE_LYRIC_REVISIONS,
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
  group: string;
  view: ShowcaseView;
  theme: ShowcaseTheme;
  markup: string;
}

const noop = () => {};
const noopAsync = async () => {};

interface WebScreenSpec {
  view: ShowcaseView;
  slug: string;
  title: string;
  group: string;
  isWelcome?: boolean;
  instrument?: InstrumentType;
  capo?: number;
  transposeSemitones?: number;
  playbackSpeed?: number;
  openPopover?: DockerPopoverId;
  isUploadDialogOpen?: boolean;
  isUploadLoading?: boolean;
  isOmniboxOpen?: boolean;
  isAccountCardOpen?: boolean;
  isProfileSettingsOpen?: boolean;
  isGuestUser?: boolean;
  authTab?: 'signin' | 'signup';
  accountSectionTab?: 'favorites' | 'uploads';
  isLyricsEditorOpen?: boolean;
  isEditingTitle?: boolean;
  isConfirmDelete?: boolean;
  customBarLoopRange?: [number, number] | null;
  isMetronomeActive?: boolean;
}

const WEB_SCREEN_SPECS: WebScreenSpec[] = [
  {
    view: 'studio',
    slug: 'web-studio-active',
    title: 'Aktif Stüdyo — Gitar Diyagramları & Karaoke',
    group: 'Ana Ekranlar',
    instrument: 'guitar'
  },
  {
    view: 'piano',
    slug: 'web-studio-piano',
    title: 'Aktif Stüdyo — Piyano 2-Oktav Diyagramı',
    group: 'Ana Ekranlar',
    instrument: 'piano'
  },
  {
    view: 'ukulele',
    slug: 'web-studio-ukulele',
    title: 'Aktif Stüdyo — Ukulele (Capo 2)',
    group: 'Ana Ekranlar',
    instrument: 'ukulele',
    capo: 2
  },
  {
    view: 'welcome',
    slug: 'web-studio-welcome',
    title: 'Karşılama & Kütüphane Ekranı',
    group: 'Ana Ekranlar',
    isWelcome: true
  },
  {
    view: 'upload',
    slug: 'web-modal-upload',
    title: 'Modal: Ses Dosyası Yükleme Diyaloğu',
    group: 'Modallar & Açılır Menüler',
    isUploadDialogOpen: true
  },
  {
    view: 'upload-loading',
    slug: 'web-modal-upload-loading',
    title: 'Modal: Ses Dosyası Analiz Ediliyor (Yükleme İlerlemesi)',
    group: 'Modallar & Açılır Menüler',
    isUploadDialogOpen: true,
    isUploadLoading: true
  },
  {
    view: 'omnibox',
    slug: 'web-dropdown-omnibox',
    title: 'Açılır Menü: Omnibox Kütüphane Arama',
    group: 'Modallar & Açılır Menüler',
    isOmniboxOpen: true
  },
  {
    view: 'account-auth',
    slug: 'web-dropdown-account-auth',
    title: 'Açılır Kart: Giriş Yap (Misafir)',
    group: 'Modallar & Açılır Menüler',
    isAccountCardOpen: true,
    isGuestUser: true,
    authTab: 'signin'
  },
  {
    view: 'account-signup',
    slug: 'web-dropdown-account-signup',
    title: 'Açılır Kart: Kayıt Ol (Yeni Hesap)',
    group: 'Modallar & Açılır Menüler',
    isAccountCardOpen: true,
    isGuestUser: true,
    authTab: 'signup'
  },
  {
    view: 'account-user',
    slug: 'web-dropdown-account-user',
    title: 'Açılır Kart: Hesabım — Favorilerim',
    group: 'Modallar & Açılır Menüler',
    isAccountCardOpen: true,
    accountSectionTab: 'favorites'
  },
  {
    view: 'account-uploads',
    slug: 'web-dropdown-account-uploads',
    title: 'Açılır Kart: Hesabım — Özel Yüklemelerim',
    group: 'Modallar & Açılır Menüler',
    isAccountCardOpen: true,
    accountSectionTab: 'uploads'
  },
  {
    view: 'account-profile',
    slug: 'web-dropdown-account-profile',
    title: 'Açılır Kart: Profil & Şifre Ayarları',
    group: 'Modallar & Açılır Menüler',
    isAccountCardOpen: true,
    isProfileSettingsOpen: true
  },
  {
    view: 'mixer',
    slug: 'web-popover-mixer',
    title: 'Popover: 6-Kanal BS-RoFormer Stem Mikser',
    group: 'Alt Docker Popover & Editörler',
    openPopover: 'mixer'
  },
  {
    view: 'instrument',
    slug: 'web-popover-instrument',
    title: 'Popover: Enstrüman Seçici (Gitar / Piyano / Ukulele)',
    group: 'Alt Docker Popover & Editörler',
    openPopover: 'instrument'
  },
  {
    view: 'speed',
    slug: 'web-popover-speed',
    title: 'Popover: Oynatma Hızı Kontrolü',
    group: 'Alt Docker Popover & Editörler',
    openPopover: 'speed',
    playbackSpeed: 0.85
  },
  {
    view: 'settings',
    slug: 'web-popover-settings',
    title: 'Popover: Transpoze, Kapo, Akor Modu & Dil Ayarları',
    group: 'Alt Docker Popover & Editörler',
    openPopover: 'settings',
    capo: 2,
    transposeSemitones: 2
  },
  {
    view: 'lyrics-editor',
    slug: 'web-panel-lyrics-editor',
    title: 'Panel: Şarkı Sözü Düzenleyici & Revizyon Geçmişi',
    group: 'Alt Docker Popover & Editörler',
    isLyricsEditorOpen: true
  },
  {
    view: 'inline-rename',
    slug: 'web-inline-rename-loop',
    title: 'Satır İçi: Parça Adı Düzenleme + Özel Ölçü Döngüsü (9–12)',
    group: 'Alt Docker Popover & Editörler',
    isEditingTitle: true,
    customBarLoopRange: [9, 12],
    isMetronomeActive: true
  },
  {
    view: 'confirm-delete',
    slug: 'web-inline-confirm-delete',
    title: 'Satır İçi: Parça Silme Onayı',
    group: 'Alt Docker Popover & Editörler',
    isConfirmDelete: true
  }
];

function renderSingleScreen(spec: WebScreenSpec, theme: ShowcaseTheme): StaticScreenRenderResult {
  const isDarkMode = theme === 'dark';
  const language = 'tr' as const;
  const song = SHOWCASE_STUDIO_SONG;
  const currentTimeSec = SHOWCASE_DEFAULT_TIME_SEC;
  const instrument = spec.instrument ?? 'guitar';
  const capo = spec.capo ?? 0;
  const transposeSemitones = spec.transposeSemitones ?? 0;
  const playbackSpeed = spec.playbackSpeed ?? 1.0;
  const openPopover: DockerPopoverId = spec.openPopover ?? null;

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

  const element = (
    <div className="m3-app-shell">
      <StudioHeader
        language={language}
        isDarkMode={isDarkMode}
        user={spec.isGuestUser ? null : SHOWCASE_USER}
        favorites={spec.isGuestUser ? [] : SHOWCASE_FAVORITES}
        privateUploads={spec.isGuestUser ? [] : SHOWCASE_PRIVATE_UPLOADS}
        initialLibrarySongs={SHOWCASE_LIBRARY_SONGS}
        initialOmniboxOpen={Boolean(spec.isOmniboxOpen)}
        initialProfileSettingsOpen={Boolean(spec.isProfileSettingsOpen)}
        initialAuthTab={spec.authTab ?? 'signin'}
        initialAccountSectionTab={spec.accountSectionTab ?? 'favorites'}
        isAccountCardOpen={Boolean(spec.isAccountCardOpen)}
        isUploadDialogOpen={Boolean(spec.isUploadDialogOpen)}
        onSetAccountCardOpen={noop}
        onOpenUploadDialog={noop}
        onToggleDarkMode={noop}
        onSongLoaded={noop}
        onRenameTrack={noopAsync}
        onDeleteTrack={noopAsync}
        onAuthChanged={noop}
      />

      <StudioUploadDialog
        isOpen={Boolean(spec.isUploadDialogOpen)}
        language={language}
        onClose={noop}
        onSongLoaded={noop}
        onAuthChanged={noop}
        initialLoading={Boolean(spec.isUploadLoading)}
        initialLoadingMessage={
          spec.isUploadLoading ? 'Harmonik akorlar ve ritim ızgarası hazırlanıyor...' : ''
        }
      />

      {spec.isWelcome ? (
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
              instrument={instrument}
              transposeSemitones={transposeSemitones}
              capo={capo}
              playbackSpeed={playbackSpeed}
              chordComplexity="all"
              currentTimeSec={currentTimeSec}
              durationSec={song.durationSec}
              loopRangeSec={loopRangeSec}
              activeSection={activeSection}
              isLoopActive={true}
              isMetronomeActive={Boolean(spec.isMetronomeActive)}
              isMasterMuted={false}
              customBarLoopRange={spec.customBarLoopRange ?? null}
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
              initialEditingTitle={Boolean(spec.isEditingTitle)}
              initialConfirmDelete={Boolean(spec.isConfirmDelete)}
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
              instrument={instrument}
              transposeSemitones={transposeSemitones}
              capo={capo}
              chordComplexity="all"
              autoFollowSection={true}
              isLoopActive={true}
              customBarLoopRange={spec.customBarLoopRange ?? null}
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
              initialEditorOpen={Boolean(spec.isLyricsEditorOpen)}
              initialShowRevisions={Boolean(spec.isLyricsEditorOpen)}
              initialRevisions={SHOWCASE_LYRIC_REVISIONS}
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
            instrument={instrument}
            playbackSpeed={playbackSpeed}
            transposeSemitones={transposeSemitones}
            capo={capo}
            chordComplexity="all"
            autoFollowSection={true}
            isLoopActive={true}
            isMetronomeActive={Boolean(spec.isMetronomeActive)}
            isMasterMuted={false}
            loopRangeSec={loopRangeSec}
            customBarLoopRange={spec.customBarLoopRange ?? null}
            openPopover={openPopover}
            stage3Status="completed"
            channels={SHOWCASE_MIXER_CHANNELS}
            activePreset={openPopover === 'mixer' ? 'guitar_backing' : 'full'}
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

  return {
    slug: `${spec.slug}-${theme}`,
    title: `${spec.title} (${theme === 'dark' ? 'Dark' : 'Light'})`,
    group: spec.group,
    view: spec.view,
    theme,
    markup: renderToStaticMarkup(element)
  };
}

export function renderAllStitchScreens(): StaticScreenRenderResult[] {
  const themes: ShowcaseTheme[] = ['light', 'dark'];
  const results: StaticScreenRenderResult[] = [];
  for (const spec of WEB_SCREEN_SPECS) {
    for (const theme of themes) {
      results.push(renderSingleScreen(spec, theme));
    }
  }
  return results;
}
