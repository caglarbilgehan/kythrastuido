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
import { useLiveLogs } from './hooks/useLiveLogs';

// Production 4-Stage Diagnostic Views
import { Stage1BeatView } from './components/Inspector/stages/Stage1BeatView';
import { Stage2ChordView } from './components/Inspector/stages/Stage2ChordView';
import { Stage3MixerView } from './components/Inspector/stages/Stage3MixerView';
import { Stage4LyricsView } from './components/Inspector/stages/Stage4LyricsView';

export const App: React.FC = () => {
  const {
    session,
    selectedStageId,
    setSelectedStageId,
    activeInspectorTab,
    setActiveInspectorTab,
    stageOutputs,
    isLoading,
    runningStage,
    error,
    clearError,
    isPlaying,
    currentTime,
    audioDuration,
    seekAudio,
    toggleMasterPlay,
    stemChannels,
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

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem('kythra_dev_theme') === 'dark';
    } catch {
      return false;
    }
  });
  const contentScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    try {
      window.localStorage.setItem('kythra_dev_theme', isDarkMode ? 'dark' : 'light');
    } catch {
      // ignore storage errors
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [selectedStageId]);

  const isPipelineExecuting = Boolean(isLoading || runningStage !== null);

  const {
    logs,
    stageLogs,
    filterStage,
    setFilterStage,
    filterLevel,
    setFilterLevel,
    autoScroll,
    setAutoScroll,
    clearAllLogs
  } = useLiveLogs({
    isExecuting: isPipelineExecuting
  });

  const stagesList: StageMetadata[] = useMemo(() => {
    return DEFAULT_STAGES.map((def) => {
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
  }, [session?.stages, runningStage]);

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
        isLoading={isLoading}
        runningStage={runningStage}
        onRunAll={handleRunAll}
        onReset={handleReset}
        onOpenSourceModal={() => setIsSourceModalOpen(true)}
        mode={executionMode}
        onModeChange={setExecutionMode}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
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
        isLoading={isLoading}
        onUpload={handleUpload}
      />

      {!hasSource ? (
        <main className="dev-empty-main">
          <EmptyState onUpload={handleUpload} />
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

              {activeInspectorTab === 'console' ? (
                <StudioConsoleView
                  logs={logs}
                  filterStage={filterStage}
                  onFilterStageChange={setFilterStage}
                  filterLevel={filterLevel}
                  onFilterLevelChange={setFilterLevel}
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
          />
        </main>
      )}
    </div>
  );
};

export default App;
