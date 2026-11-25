import { renderToStaticMarkup } from 'react-dom/server';
import { DEFAULT_STAGES } from '../constants/stages';
import { Header } from '../components/Header';
import { EmptyState } from '../components/EmptyState';
import { SourceSelectModal } from '../components/SourceSelectModal';
import { PipelineRail } from '../components/PipelineRail';
import { InspectorHeader } from '../components/Inspector/InspectorHeader';
import { GlobalPipelineTracker } from '../components/Inspector/GlobalPipelineTracker';
import { RawJsonViewer } from '../components/Inspector/RawJsonViewer';
import { StageExecutingView } from '../components/Inspector/StageExecutingView';
import { StagePendingView } from '../components/Inspector/StagePendingView';
import { Stage1BeatView } from '../components/Inspector/stages/Stage1BeatView';
import { Stage2ChordView } from '../components/Inspector/stages/Stage2ChordView';
import { Stage3MixerView } from '../components/Inspector/stages/Stage3MixerView';
import { Stage4LyricsView } from '../components/Inspector/stages/Stage4LyricsView';
import { StudioConsoleView } from '../components/Console/StudioConsoleView';
import { RequestTraceView } from '../components/Telemetry/RequestTraceView';
import { MasterAudioPlayer } from '../components/MasterAudioPlayer';
import { InspectorTab, StageMetadata } from '../types/workbench';
import {
  DEV_SHOWCASE_CURRENT_TIME,
  DEV_SHOWCASE_LOGS,
  DEV_SHOWCASE_REQUESTS,
  DEV_SHOWCASE_SESSION,
  DEV_SHOWCASE_SESSION_ID,
  DEV_SHOWCASE_STAGE_OUTPUTS,
  DEV_SHOWCASE_STEM_CHANNELS,
  DEV_SHOWCASE_TELEMETRY_SESSIONS,
  DeveloperShowcaseTheme,
  DeveloperShowcaseView
} from './showcaseData';

export interface DeveloperStaticScreenResult {
  slug: string;
  title: string;
  group: string;
  view: DeveloperShowcaseView;
  theme: DeveloperShowcaseTheme;
  app: 'developer';
  markup: string;
}

const noop = () => {};
const noopAsync = async () => {};

interface DevScreenSpec {
  view: DeveloperShowcaseView;
  slug: string;
  title: string;
  group: string;
  stageId: number;
  tab: InspectorTab;
  isEmpty?: boolean;
  isSourceModalOpen?: boolean;
  isSourceModalLoading?: boolean;
  isSessionMenuOpen?: boolean;
  isMixerPopoverOpen?: boolean;
  isRunningState?: boolean;
  isPendingState?: boolean;
  isErrorState?: boolean;
}

const DEV_SCREEN_SPECS: DevScreenSpec[] = [
  {
    view: 'empty',
    slug: 'dev-empty-home',
    title: 'Başlangıç Ekranı & Canlı İstek Akışı',
    group: 'Ana Ekranlar & Modallar',
    stageId: 1,
    tab: 'diagnostic',
    isEmpty: true
  },
  {
    view: 'source-modal',
    slug: 'dev-modal-source',
    title: 'Modal: Yeni Ses Kaynağı Yükleme Diyaloğu',
    group: 'Ana Ekranlar & Modallar',
    stageId: 2,
    tab: 'diagnostic',
    isSourceModalOpen: true
  },
  {
    view: 'source-modal-loading',
    slug: 'dev-modal-source-loading',
    title: 'Modal: Ses Kaynağı Yükleniyor (İşleniyor)',
    group: 'Ana Ekranlar & Modallar',
    stageId: 2,
    tab: 'diagnostic',
    isSourceModalOpen: true,
    isSourceModalLoading: true
  },
  {
    view: 'sessions-menu',
    slug: 'dev-dropdown-sessions',
    title: 'Açılır Menü: Çoklu Canlı Oturum Seçici (Session Switcher)',
    group: 'Ana Ekranlar & Modallar',
    stageId: 2,
    tab: 'diagnostic',
    isSessionMenuOpen: true
  },
  {
    view: 'mixer-popover',
    slug: 'dev-popover-mixer',
    title: 'Popover: Master Oynatıcı 6-Kanal Stem Mikser',
    group: 'Ana Ekranlar & Modallar',
    stageId: 3,
    tab: 'diagnostic',
    isMixerPopoverOpen: true
  },
  {
    view: 'stage1',
    slug: 'dev-stage1-beats',
    title: 'Aşama 1: Ölçü & Tempo Zaman Çizelgesi (madmom)',
    group: '4 Aşama Tanı Görünümleri',
    stageId: 1,
    tab: 'diagnostic'
  },
  {
    view: 'stage2',
    slug: 'dev-stage2-chords',
    title: 'Aşama 2: Bölüm Haritası & Akor Izgarası (BTC + allin1)',
    group: '4 Aşama Tanı Görünümleri',
    stageId: 2,
    tab: 'diagnostic'
  },
  {
    view: 'stage3',
    slug: 'dev-stage3-stems',
    title: 'Aşama 3: 6-Kanal Stem & SDR Analizi (BS-RoFormer)',
    group: '4 Aşama Tanı Görünümleri',
    stageId: 3,
    tab: 'diagnostic'
  },
  {
    view: 'stage4',
    slug: 'dev-stage4-lyrics',
    title: 'Aşama 4: Kelime Bazlı Söz & Hizalama (Whisper + MMS_FA)',
    group: '4 Aşama Tanı Görünümleri',
    stageId: 4,
    tab: 'diagnostic'
  },
  {
    view: 'json',
    slug: 'dev-tab-raw-json',
    title: 'Sekme: Ham JSON Çıktı İnceleyici',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 2,
    tab: 'json'
  },
  {
    view: 'console',
    slug: 'dev-tab-console',
    title: 'Sekme: Canlı Sistem Konsolu (Oturum Filtreli Loglar)',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 2,
    tab: 'console'
  },
  {
    view: 'requests',
    slug: 'dev-tab-requests',
    title: 'Sekme: Canlı API İstek & Hata Takibi (Telemetry)',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 2,
    tab: 'requests'
  },
  {
    view: 'running',
    slug: 'dev-state-running',
    title: 'Durum: Aşama Çalışıyor (Canlı İlerleme & Log)',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 3,
    tab: 'diagnostic',
    isRunningState: true
  },
  {
    view: 'pending',
    slug: 'dev-state-pending',
    title: 'Durum: Aşama Beklemede / Eksik Bağımlılık Uyarısı',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 4,
    tab: 'diagnostic',
    isPendingState: true
  },
  {
    view: 'error',
    slug: 'dev-state-error',
    title: 'Durum: Hata Şeridi & Başarısız Aşama Tanısı',
    group: 'Gözlemleme & Çalışma Durumları',
    stageId: 3,
    tab: 'diagnostic',
    isErrorState: true
  }
];

function buildStagesList(spec: DevScreenSpec): StageMetadata[] {
  return DEFAULT_STAGES.map((def) => {
    const backendStage = DEV_SHOWCASE_SESSION.stages[String(def.id)];
    const base = backendStage ? { ...def, ...backendStage } : def;
    if (spec.isRunningState) {
      if (def.id === 3) return { ...base, status: 'running', durationMs: 0 };
      if (def.id === 4) return { ...base, status: 'pending', durationMs: 0 };
    }
    if (spec.isPendingState) {
      if (def.id === 3 || def.id === 4) return { ...base, status: 'pending', durationMs: 0 };
    }
    if (spec.isErrorState) {
      if (def.id === 3) return { ...base, status: 'error', durationMs: 4120 };
      if (def.id === 4) return { ...base, status: 'pending', durationMs: 0 };
    }
    return base;
  });
}

function renderDeveloperScreen(
  spec: DevScreenSpec,
  theme: DeveloperShowcaseTheme
): DeveloperStaticScreenResult {
  const isDarkMode = theme === 'dark';
  const stagesList = buildStagesList(spec);
  const selectedStageId = spec.stageId;
  const currentStage =
    stagesList.find((s) => s.id === selectedStageId) || stagesList[0] || DEFAULT_STAGES[0];
  const runningStage = spec.isRunningState ? 3 : null;
  const missingDependency = spec.isPendingState
    ? 'Aşama 4 için önce Aşama 3 (BS-RoFormer 6-Kanal Vokal Ayırma) tamamlanmalıdır.'
    : null;

  const firstErrorRequestId =
    DEV_SHOWCASE_REQUESTS.find((r) => Boolean(r.error_detail))?.id ?? null;

  const element = (
    <div className={`m3-dev-shell ${spec.isEmpty ? '' : 'has-session'}`}>
      <Header
        session={spec.isEmpty ? null : DEV_SHOWCASE_SESSION}
        activeSessionId={DEV_SHOWCASE_SESSION_ID}
        telemetrySessions={DEV_SHOWCASE_TELEMETRY_SESSIONS}
        onSelectSession={noop}
        onRefreshSessions={noop}
        isLoading={Boolean(spec.isRunningState || spec.isSourceModalLoading)}
        runningStage={runningStage}
        onRunAll={noopAsync}
        onReset={noopAsync}
        onOpenSourceModal={noop}
        mode="parallel"
        onModeChange={noop}
        isDarkMode={isDarkMode}
        onToggleTheme={noop}
        initialSessionMenuOpen={Boolean(spec.isSessionMenuOpen)}
      />

      {spec.isErrorState && (
        <div className="m3-error-banner" role="alert">
          <div className="m3-error-banner-left">
            <md-icon style={{ fontSize: '18px' }}>error</md-icon>
            <span>
              Hata: Aşama 3 (BS-RoFormer 6-Stem) CUDA bellek sınırı aşıldı — batch_size=1 ile yeniden denenebilir.
            </span>
          </div>
          <md-text-button onClick={noop}>Kapat</md-text-button>
        </div>
      )}

      <SourceSelectModal
        isOpen={Boolean(spec.isSourceModalOpen)}
        onClose={noop}
        isLoading={Boolean(spec.isSourceModalLoading)}
        onUpload={noopAsync}
      />

      {spec.isEmpty ? (
        <main className="dev-empty-main">
          <div style={{ width: '100%', maxWidth: '1060px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <EmptyState onUpload={noopAsync} />
            <RequestTraceView
              activeSessionId={DEV_SHOWCASE_SESSION_ID}
              onSelectSession={noop}
              initialRequests={DEV_SHOWCASE_REQUESTS}
              initialExpandedId={firstErrorRequestId}
            />
          </div>
        </main>
      ) : (
        <main className="dev-workbench-layout">
          <aside className="dev-pipeline-rail">
            <PipelineRail
              stages={stagesList}
              selectedStageId={selectedStageId}
              runningStage={runningStage}
              onSelectStage={noop}
            />
          </aside>

          <div className="dev-inspector-pane">
            <div className="dev-inspector-top">
              <InspectorHeader
                stage={currentStage}
                isRunning={runningStage === selectedStageId}
                onRunStage={noop}
                rawJsonData={
                  spec.isPendingState || spec.isRunningState || spec.isErrorState
                    ? undefined
                    : DEV_SHOWCASE_STAGE_OUTPUTS[selectedStageId]
                }
                activeTab={spec.tab}
                onTabChange={noop}
                missingDependency={missingDependency}
                onRunMissingPrerequisites={noop}
                logCount={DEV_SHOWCASE_LOGS.length}
              />
            </div>

            <div className="dev-inspector-scroll">
              <GlobalPipelineTracker
                stages={stagesList}
                runningStage={runningStage}
                selectedStageId={selectedStageId}
                onSelectStage={noop}
                onOpenConsole={noop}
              />

              {spec.tab === 'requests' ? (
                <RequestTraceView
                  activeSessionId={DEV_SHOWCASE_SESSION_ID}
                  onSelectSession={noop}
                  initialRequests={DEV_SHOWCASE_REQUESTS}
                  initialExpandedId={firstErrorRequestId}
                />
              ) : spec.tab === 'console' ? (
                <StudioConsoleView
                  logs={DEV_SHOWCASE_LOGS}
                  filterStage="all"
                  onFilterStageChange={noop}
                  filterLevel="all"
                  onFilterLevelChange={noop}
                  onlyActiveSession={false}
                  onToggleOnlyActiveSession={noop}
                  activeSessionId={DEV_SHOWCASE_SESSION_ID}
                  onClear={noop}
                  autoScroll={true}
                  onToggleAutoScroll={noop}
                  isExecuting={false}
                  activeStageNum={null}
                />
              ) : spec.tab === 'json' ? (
                <RawJsonViewer
                  fileName={currentStage.output}
                  data={DEV_SHOWCASE_STAGE_OUTPUTS[selectedStageId]}
                />
              ) : spec.isRunningState ? (
                <StageExecutingView
                  stage={currentStage}
                  logs={DEV_SHOWCASE_LOGS.filter((l) => l.stage_num === 3 || l.stage_num === null)}
                  onOpenConsole={noop}
                />
              ) : spec.isPendingState || spec.isErrorState ? (
                <StagePendingView
                  stage={currentStage}
                  onRunStage={noop}
                  missingDependency={missingDependency}
                />
              ) : selectedStageId === 1 ? (
                <Stage1BeatView
                  data={DEV_SHOWCASE_STAGE_OUTPUTS[1]}
                  currentTime={DEV_SHOWCASE_CURRENT_TIME}
                  onSeek={noop}
                />
              ) : selectedStageId === 3 ? (
                <Stage3MixerView
                  channels={DEV_SHOWCASE_STEM_CHANNELS}
                  data={DEV_SHOWCASE_STAGE_OUTPUTS[3]}
                />
              ) : selectedStageId === 4 ? (
                <Stage4LyricsView
                  data={DEV_SHOWCASE_STAGE_OUTPUTS[4]}
                  currentTime={DEV_SHOWCASE_CURRENT_TIME}
                  onSeek={noop}
                />
              ) : (
                <Stage2ChordView
                  data={DEV_SHOWCASE_STAGE_OUTPUTS[2]}
                  currentTime={DEV_SHOWCASE_CURRENT_TIME}
                  onSeek={noop}
                />
              )}
            </div>
          </div>

          <MasterAudioPlayer
            isPlaying={false}
            currentTime={DEV_SHOWCASE_CURRENT_TIME}
            duration={DEV_SHOWCASE_SESSION.duration_sec || 65}
            onTogglePlay={noop}
            onSeek={noop}
            trackName={DEV_SHOWCASE_SESSION.track_name}
            isStage3Completed={!spec.isPendingState && !spec.isRunningState && !spec.isErrorState}
            stemChannels={DEV_SHOWCASE_STEM_CHANNELS}
            onToggleSolo={noop}
            onToggleMute={noop}
            onSetVolume={noop}
            onResetStems={noop}
            initialMixerOpen={Boolean(spec.isMixerPopoverOpen)}
          />
        </main>
      )}
    </div>
  );

  return {
    slug: `${spec.slug}-${theme}`,
    title: `${spec.title} (${theme === 'dark' ? 'Dark' : 'Light'})`,
    group: spec.group,
    view: spec.view,
    theme,
    app: 'developer',
    markup: renderToStaticMarkup(element)
  };
}

export function renderAllDeveloperStitchScreens(): DeveloperStaticScreenResult[] {
  const themes: DeveloperShowcaseTheme[] = ['light', 'dark'];
  const results: DeveloperStaticScreenResult[] = [];
  for (const spec of DEV_SCREEN_SPECS) {
    for (const theme of themes) {
      results.push(renderDeveloperScreen(spec, theme));
    }
  }
  return results;
}
