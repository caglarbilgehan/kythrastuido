import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useWorkbench, DEFAULT_STAGES } from './hooks/useWorkbench';
import { STAGE_DEPENDENCIES } from './constants/stages';
import { StageMetadata } from './types/workbench';
import { Header } from './components/Header';
import { SourceSelectModal } from './components/SourceSelectModal';
import { MasterAudioPlayer } from './components/MasterAudioPlayer';
import { EmptyState } from './components/EmptyState';
import { PipelineRail } from './components/PipelineRail';
import { InspectorHeader } from './components/Inspector/InspectorHeader';
import { RawJsonViewer } from './components/Inspector/RawJsonViewer';
import { StagePendingView } from './components/Inspector/StagePendingView';
import { StageExecutingView } from './components/Inspector/StageExecutingView';
import { GlobalPipelineTracker } from './components/Inspector/GlobalPipelineTracker';
import { StudioConsoleView } from './components/Console/StudioConsoleView';
import { RequestTraceView } from './components/Telemetry/RequestTraceView';
import { useLiveLogs } from './hooks/useLiveLogs';

// Production 4-Stage Diagnostic Views
import { Stage1BeatView } from './components/Inspector/stages/Stage1BeatView';
import { Stage2ChordView } from './components/Inspector/stages/Stage2ChordView';
import { Stage3MixerView } from './components/Inspector/stages/Stage3MixerView';
import { Stage4LyricsView } from './components/Inspector/stages/Stage4LyricsView';
import {
  DEV_SHOWCASE_CURRENT_TIME,
  DEV_SHOWCASE_LOGS,
  DEV_SHOWCASE_REQUESTS,
  DEV_SHOWCASE_SESSION,
  DEV_SHOWCASE_SESSION_ID,
  DEV_SHOWCASE_STAGE_OUTPUTS,
  DEV_SHOWCASE_STEM_CHANNELS,
  DEV_SHOWCASE_TELEMETRY_SESSIONS,
  parseDeveloperShowcaseFromSearch
} from './showcase/showcaseData';

export const App: React.FC = () => {
  const showcaseConfig = useMemo(
    () =>
      typeof window !== 'undefined'
        ? parseDeveloperShowcaseFromSearch(window.location.search)
        : null,
    []
  );
  const isShowcaseMode = showcaseConfig !== null;

  const {
    activeSessionId: liveSessionId,
    telemetrySessions: liveTelemetrySessions,
    switchSession: liveSwitchSession,
    refreshTelemetrySessions,
    session: liveSession,
    selectedStageId: liveSelectedStageId,
    setSelectedStageId: setLiveSelectedStageId,
    activeInspectorTab: liveInspectorTab,
    setActiveInspectorTab: setLiveInspectorTab,
    stageOutputs: liveStageOutputs,
    isLoading: liveIsLoading,
    runningStage: liveRunningStage,
    error: liveError,
    clearError,
    isPlaying,
    currentTime: liveCurrentTime,
    audioDuration: liveAudioDuration,
    seekAudio: liveSeekAudio,
    toggleMasterPlay,
    stemChannels: liveStemChannels,
    toggleStemSolo,
    toggleStemMute,
    setStemVolume,
    resetStemMixer,
    handleUpload,
    handleReset,
    handleRunStage,
    handleRunAll,
    executionMode,
    setExecutionMode
  } = useWorkbench();

  const [showcaseStageId, setShowcaseStageId] = useState<number>(
    () => showcaseConfig?.stageId ?? 2
  );
  const [showcaseTab, setShowcaseTab] = useState(
    () => showcaseConfig?.tab ?? 'diagnostic'
  );
  const [showcaseSessionId, setShowcaseSessionId] = useState<string>(
    DEV_SHOWCASE_SESSION_ID
  );
  const [showcaseTime, setShowcaseTime] = useState<number>(DEV_SHOWCASE_CURRENT_TIME);

  const activeSessionId = isShowcaseMode ? showcaseSessionId : liveSessionId;
  const telemetrySessions = isShowcaseMode
    ? DEV_SHOWCASE_TELEMETRY_SESSIONS
    : liveTelemetrySessions;
  const switchSession = isShowcaseMode ? setShowcaseSessionId : liveSwitchSession;
  const session = isShowcaseMode
    ? showcaseConfig.view === 'empty'
      ? null
      : DEV_SHOWCASE_SESSION
    : liveSession;
  const selectedStageId = isShowcaseMode ? showcaseStageId : liveSelectedStageId;
  const setSelectedStageId = isShowcaseMode ? setShowcaseStageId : setLiveSelectedStageId;
  const activeInspectorTab = isShowcaseMode ? showcaseTab : liveInspectorTab;
  const setActiveInspectorTab = isShowcaseMode ? setShowcaseTab : setLiveInspectorTab;
  const stageOutputs = isShowcaseMode ? DEV_SHOWCASE_STAGE_OUTPUTS : liveStageOutputs;
  const isLoading = isShowcaseMode ? showcaseConfig.view === 'running' : liveIsLoading;
  const runningStage = isShowcaseMode
    ? showcaseConfig.view === 'running'
      ? 3
      : null
    : liveRunningStage;
  const error = isShowcaseMode
    ? showcaseConfig.view === 'error'
      ? 'Aşama 3 (BS-RoFormer 6-Stem) CUDA bellek sınırı aşıldı — batch_size=1 ile yeniden denenebilir.'
      : null
    : liveError;
  const currentTime = isShowcaseMode ? showcaseTime : liveCurrentTime;
  const audioDuration = isShowcaseMode
    ? DEV_SHOWCASE_SESSION.duration_sec || 65
    : liveAudioDuration;
  const seekAudio = isShowcaseMode ? setShowcaseTime : liveSeekAudio;
  const stemChannels = isShowcaseMode ? DEV_SHOWCASE_STEM_CHANNELS : liveStemChannels;

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(
    () =>
      showcaseConfig?.view === 'source-modal' ||
      showcaseConfig?.view === 'source-modal-loading'
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (showcaseConfig) {
      return showcaseConfig.theme === 'dark';
    }
    try {
      return window.localStorage.getItem('kythra_dev_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    if (isShowcaseMode) return;
    try {
      window.localStorage.setItem('kythra_dev_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDarkMode, isShowcaseMode]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [selectedStageId]);

  const isPipelineExecuting = Boolean(isLoading || runningStage !== null);

  const {
    logs: liveLogs,
    stageLogs,
    filterStage,
    setFilterStage,
    filterLevel,
    setFilterLevel,
    onlyActiveSession,
    setOnlyActiveSession,
    autoScroll,
    setAutoScroll,
    clearAllLogs
  } = useLiveLogs({
    isExecuting: isPipelineExecuting,
    activeSessionId
  });

  const logs = useMemo(() => {
    if (!isShowcaseMode) return liveLogs;
    return DEV_SHOWCASE_LOGS.filter((entry) => {
      if (onlyActiveSession && entry.session_id && entry.session_id !== activeSessionId) {
        return false;
      }
      if (filterStage !== 'all' && entry.stage_num !== filterStage) return false;
      if (filterLevel !== 'all' && entry.level !== filterLevel) return false;
      return true;
    });
  }, [isShowcaseMode, liveLogs, onlyActiveSession, activeSessionId, filterStage, filterLevel]);

  const stagesList: StageMetadata[] = useMemo(() => {
    return DEFAULT_STAGES.map((def) => {
      if (isShowcaseMode && showcaseConfig?.view === 'pending' && (def.id === 3 || def.id === 4)) {
        return { ...def, status: 'pending', durationMs: 0 };
      }
      if (isShowcaseMode && showcaseConfig?.view === 'running' && def.id === 4) {
        return { ...def, status: 'pending', durationMs: 0 };
      }
      if (isShowcaseMode && showcaseConfig?.view === 'error') {
        if (def.id === 3) return { ...def, status: 'error', durationMs: 4120 };
        if (def.id === 4) return { ...def, status: 'pending', durationMs: 0 };
      }
      const backendStage = session?.stages?.[String(def.id)];
      const isRunningNow = runningStage === def.id;
      if (!backendStage) {
        return {
          ...def,
          status: isRunningNow ? 'running' : def.status
        };
      }
      return {
        ...def,
        status: isRunningNow
          ? 'running'
          : (backendStage.status as StageMetadata['status']) || def.status,
        durationMs: (backendStage as any).timings_ms || backendStage.durationMs || def.durationMs,
        error: backendStage.error || def.error
      };
    });
  }, [session?.stages, runningStage, isShowcaseMode, showcaseConfig?.view]);

  const currentStage: StageMetadata = useMemo(() => {
    return stagesList.find((s) => s.id === selectedStageId) || stagesList[0] || DEFAULT_STAGES[0];
  }, [stagesList, selectedStageId]);

  const missingDependency = useMemo(() => {
    const dep = STAGE_DEPENDENCIES[selectedStageId];
    if (!dep) return null;
    const isCompleted = (id: number) =>
      stagesList.find((s) => s.id === id)?.status === 'completed';
    const hasMissing = dep.required.some((reqId) => !isCompleted(reqId));
    return hasMissing ? dep.message : null;
  }, [selectedStageId, stagesList]);

  const hasSource = Boolean(session?.has_session);

  return (
    <div className={`m3-dev-shell ${hasSource ? 'has-session' : ''}`}>
      <Header
        session={session}
        activeSessionId={activeSessionId}
        telemetrySessions={telemetrySessions}
        onSelectSession={switchSession}
        onRefreshSessions={refreshTelemetrySessions}
        isLoading={isLoading}
        runningStage={runningStage}
        onRunAll={handleRunAll}
        onReset={handleReset}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        mode={executionMode}
        onModeChange={setExecutionMode}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
        initialSessionMenuOpen={showcaseConfig?.view === 'sessions-menu'}
      />

      {error && (
        <div className="m3-error-banner" role="alert">
          <div className="m3-error-banner-left">
            <md-icon style={{ fontSize: '18px' }}>error</md-icon>
            <span>Hata: {error}</span>
          </div>
          <md-text-button onClick={clearError}>Kapat</md-text-button>
        </div>
      )}

      <SourceSelectModal
        isOpen={isSourceModalOpen}
        onClose={() => setIsSourceModalOpen(false)}
        isLoading={isLoading || showcaseConfig?.view === 'source-modal-loading'}
        onUpload={handleUpload}
      />

      {!hasSource ? (
        <main className="dev-empty-main">
          <div style={{ width: '100%', maxWidth: '1060px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <EmptyState onUpload={handleUpload} />
            <RequestTraceView
              activeSessionId={activeSessionId}
              onSelectSession={switchSession}
              initialRequests={isShowcaseMode ? DEV_SHOWCASE_REQUESTS : undefined}
              initialExpandedId={
                isShowcaseMode
                  ? DEV_SHOWCASE_REQUESTS.find((r) => Boolean(r.error_detail))?.id ?? null
                  : null
              }
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
              onSelectStage={setSelectedStageId}
            />
          </aside>

          <div className="dev-inspector-pane">
            <div className="dev-inspector-top">
              <InspectorHeader
                stage={currentStage}
                isRunning={runningStage === selectedStageId}
                onRunStage={() => handleRunStage(selectedStageId)}
                rawJsonData={stageOutputs[selectedStageId]}
                activeTab={activeInspectorTab}
                onTabChange={setActiveInspectorTab}
                missingDependency={missingDependency}
                onRunMissingPrerequisites={handleRunAll}
                logCount={logs.length}
              />
            </div>

            <div ref={contentScrollRef} className="dev-inspector-scroll">
              <GlobalPipelineTracker
                stages={stagesList}
                runningStage={runningStage}
                selectedStageId={selectedStageId}
                onSelectStage={setSelectedStageId}
                onOpenConsole={() => setActiveInspectorTab('console')}
              />

                { activeInspectorTab === 'requests' ? (
                  <RequestTraceView
                    activeSessionId={activeSessionId}
                    onSelectSession={switchSession}
                    initialRequests={isShowcaseMode ? DEV_SHOWCASE_REQUESTS : undefined}
                    initialExpandedId={
                      isShowcaseMode
                        ? DEV_SHOWCASE_REQUESTS.find((r) => Boolean(r.error_detail))?.id ?? null
                        : null
                    }
                  />
                ) : activeInspectorTab === 'console' ? (
                  <StudioConsoleView
                    logs={logs}
                    filterStage={filterStage}
                    onFilterStageChange={setFilterStage}
                    filterLevel={filterLevel}
                    onFilterLevelChange={setFilterLevel}
                    onlyActiveSession={onlyActiveSession}
                    onToggleOnlyActiveSession={() => setOnlyActiveSession((p) => !p)}
                    activeSessionId={activeSessionId}
                    onClear={clearAllLogs}
                    autoScroll={autoScroll}
                    onToggleAutoScroll={() => setAutoScroll((p) => !p)}
                    isExecuting={isPipelineExecuting}
                    activeStageNum={runningStage}
                  />
                ) : activeInspectorTab === 'json' ? (
                  <RawJsonViewer
                    fileName={currentStage.output}
                    data={stageOutputs[selectedStageId]}
                  />
                ) : currentStage.status === 'running' || runningStage === selectedStageId ? (
                  <StageExecutingView
                    stage={currentStage}
                    logs={stageLogs(selectedStageId)}
                    onOpenConsole={() => setActiveInspectorTab('console')}
                  />
                ) : currentStage.status !== 'completed' ? (
                  <StagePendingView
                    stage={currentStage}
                    onRunStage={() => handleRunStage(selectedStageId)}
                    missingDependency={missingDependency}
                  />
                ) : (
                  <>
                    {selectedStageId === 1 && (
                      <Stage1BeatView
                        data={stageOutputs[1]}
                        currentTime={currentTime}
                        onSeek={seekAudio}
                      />
                    )}
                    {selectedStageId === 2 && (
                      <Stage2ChordView
                        data={stageOutputs[2]}
                        currentTime={currentTime}
                        onSeek={seekAudio}
                      />
                    )}
                    {selectedStageId === 3 && (
                      <Stage3MixerView
                        channels={stemChannels}
                        data={stageOutputs[3]}
                      />
                    )}
                    {selectedStageId === 4 && (
                      <Stage4LyricsView
                        data={stageOutputs[4]}
                        currentTime={currentTime}
                        onSeek={seekAudio}
                      />
                    )}
                  </>
                )}
            </div>
          </div>

          <MasterAudioPlayer
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={audioDuration}
            onTogglePlay={toggleMasterPlay}
            onSeek={seekAudio}
            trackName={session?.track_name}
            isStage3Completed={session?.stages?.['3']?.status === 'completed'}
            stemChannels={stemChannels}
            onToggleSolo={toggleStemSolo}
            onToggleMute={toggleStemMute}
            onSetVolume={setStemVolume}
            onResetStems={resetStemMixer}
            initialMixerOpen={showcaseConfig?.view === 'mixer-popover'}
          />
        </main>
      )}
    </div>
  );
};

export default App;
