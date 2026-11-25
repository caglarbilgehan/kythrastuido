# KythraStudio — Web Studio, Developer Workbench & Mobile Codebase Snapshot

> React/TypeScript sources for Web Studio, Developer Observability Workbench, and Mobile prototype (excluding large CSS stylesheets, fonts, and binaries).
> Toplam Dosya: 91 | Üretim Tarihi: 2026-11-25

## Dosya Dizini
- `package.json`
- `production/developer/package.json`
- `production/developer/src/api/httpClient.ts`
- `production/developer/src/api/workbenchApi.ts`
- `production/developer/src/App.tsx`
- `production/developer/src/components/AudioPlayer/StemMixerPopover.tsx`
- `production/developer/src/components/AudioPlayer/WaveformScrubber.tsx`
- `production/developer/src/components/Console/StudioConsoleView.tsx`
- `production/developer/src/components/EmptyState.tsx`
- `production/developer/src/components/Header.tsx`
- `production/developer/src/components/icons/BrandLogoIcon.tsx`
- `production/developer/src/components/icons/index.ts`
- `production/developer/src/components/icons/instruments/GuitarIcon.tsx`
- `production/developer/src/components/icons/instruments/InstrumentIcon.tsx`
- `production/developer/src/components/icons/instruments/PianoIcon.tsx`
- `production/developer/src/components/icons/instruments/UkuleleIcon.tsx`
- `production/developer/src/components/icons/MetronomeIcon.tsx`
- `production/developer/src/components/icons/MixerIcon.tsx`
- `production/developer/src/components/icons/sources/SourceOriginIcon.tsx`
- `production/developer/src/components/icons/StemChannelIcon.tsx`
- `production/developer/src/components/icons/SvgIconBase.tsx`
- `production/developer/src/components/Inspector/GlobalPipelineTracker.tsx`
- `production/developer/src/components/Inspector/InspectorHeader.tsx`
- `production/developer/src/components/Inspector/RawJsonViewer.tsx`
- `production/developer/src/components/Inspector/StageExecutingView.tsx`
- `production/developer/src/components/Inspector/StagePendingView.tsx`
- `production/developer/src/components/Inspector/stages/Stage1BeatView.tsx`
- `production/developer/src/components/Inspector/stages/stage2/LeadSheetChordGrid.tsx`
- `production/developer/src/components/Inspector/stages/stage2/SectionFormGrid.tsx`
- `production/developer/src/components/Inspector/stages/Stage2ChordView.tsx`
- `production/developer/src/components/Inspector/stages/Stage3MixerView.tsx`
- `production/developer/src/components/Inspector/stages/Stage4LyricsView.tsx`
- `production/developer/src/components/MasterAudioPlayer.tsx`
- `production/developer/src/components/PipelineRail.tsx`
- `production/developer/src/components/SessionSwitcher.tsx`
- `production/developer/src/components/SourceSelectModal.tsx`
- `production/developer/src/components/Telemetry/RequestTraceView.tsx`
- `production/developer/src/components/ui/AudioDropzone.tsx`
- `production/developer/src/components/ui/MetricCard.tsx`
- `production/developer/src/constants/instruments.ts`
- `production/developer/src/constants/stages.ts`
- `production/developer/src/hooks/useAudioMixer.ts`
- `production/developer/src/hooks/useLiveLogs.ts`
- `production/developer/src/hooks/useSessionPipeline.ts`
- `production/developer/src/hooks/useWorkbench.ts`
- `production/developer/src/main.tsx`
- `production/developer/src/material3.ts`
- `production/developer/src/types/stages.ts`
- `production/developer/src/types/workbench.ts`
- `production/developer/vite.config.ts`
- `production/mobile/App.tsx`
- `production/mobile/package.json`
- `production/mobile/src/api/studioApi.ts`
- `production/mobile/src/components/MobileChordGrid.tsx`
- `production/mobile/src/components/MobileLiveChordCard.tsx`
- `production/mobile/src/components/MobileSectionPills.tsx`
- `production/mobile/src/components/MobileStemMixerSheet.tsx`
- `production/mobile/src/react-native-shim.d.ts`
- `production/mobile/src/theme/material3.ts`
- `production/mobile/src/types/studio.ts`
- `production/mobile/src/utils/musicTheory.ts`
- `production/web/package.json`
- `production/web/src/api/studioApi.ts`
- `production/web/src/App.tsx`
- `production/web/src/components/FocusedChordWorkspace.tsx`
- `production/web/src/components/FooterDockerControlCenter.tsx`
- `production/web/src/components/icons/BrandLogoIcon.tsx`
- `production/web/src/components/icons/index.ts`
- `production/web/src/components/icons/instruments/GuitarIcon.tsx`
- `production/web/src/components/icons/instruments/InstrumentIcon.tsx`
- `production/web/src/components/icons/instruments/PianoIcon.tsx`
- `production/web/src/components/icons/instruments/UkuleleIcon.tsx`
- `production/web/src/components/icons/MetronomeIcon.tsx`
- `production/web/src/components/icons/MixerIcon.tsx`
- `production/web/src/components/icons/sources/SourceOriginIcon.tsx`
- `production/web/src/components/icons/SvgIconBase.tsx`
- `production/web/src/components/InstrumentChordDiagram.tsx`
- `production/web/src/components/KaraokeLyricsStage.tsx`
- `production/web/src/components/SongInfoStrip.tsx`
- `production/web/src/components/StudioHeader.tsx`
- `production/web/src/components/StudioUploadDialog.tsx`
- `production/web/src/components/StudioWelcomeView.tsx`
- `production/web/src/hooks/useStemAudio.ts`
- `production/web/src/i18n/translations.ts`
- `production/web/src/main.tsx`
- `production/web/src/material3.ts`
- `production/web/src/types/studio.ts`
- `production/web/src/utils/clientAudioCache.ts`
- `production/web/src/utils/musicTheory.ts`
- `production/web/src/vite-env.d.ts`
- `production/web/vite.config.ts`

---

## `package.json`

```json
{
  "name": "kythrastudio",
  "private": true,
  "version": "1.0.0",
  "workspaces": [
    "production/web",
    "production/developer"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=production/web",
    "build": "npm run build --workspace=production/web",
    "preview": "npm run preview --workspace=production/web",
    "lint": "npm run lint --workspace=production/web",
    "export:context": "node scripts/export-ai-context.mjs"
  }
}
```

## `production/developer/package.json`

```json
{
  "name": "kythra-production-developer",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@material/web": "^2.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.7.3",
    "vite": "^6.2.1"
  }
}
```

## `production/developer/src/api/httpClient.ts`

```ts
const API_BASE = '/api/workbench';
const ACTIVE_SESSION_STORAGE_KEY = 'kythra_dev_active_session_id';

let currentSessionId: string = (() => {
  if (typeof window === 'undefined') return 'default';
  try {
    return window.localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) || 'default';
  } catch {
    return 'default';
  }
})();

export function getActiveSessionId(): string {
  return currentSessionId || 'default';
}

export function setActiveSessionId(sessionId: string): string {
  const clean = (sessionId || 'default').trim() || 'default';
  currentSessionId = clean;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, clean);
    } catch {
      // ignore storage errors
    }
  }
  return clean;
}

export function buildStreamUrl(stemOrMaster: string, trackName?: string | null): string {
  const sid = encodeURIComponent(getActiveSessionId());
  const track = encodeURIComponent(trackName || 'track');
  return `${API_BASE}/stream/${encodeURIComponent(stemOrMaster)}?track=${track}&session_id=${sid}`;
}

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  fallbackErrorPrefix = 'API hatası'
): Promise<T> {
  const headers = new Headers(options?.headers || {});
  if (!headers.has('X-Session-Id')) {
    headers.set('X-Session-Id', getActiveSessionId());
  }
  if (!headers.has('X-Client-App')) {
    headers.set('X-Client-App', 'developer');
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = typeof err?.detail === 'string' ? err.detail : null;
    throw new Error(detail || `${fallbackErrorPrefix}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
```

## `production/developer/src/api/workbenchApi.ts`

```ts
import {
  LogEntry,
  RequestTraceEntry,
  SessionState,
  TelemetrySessionSummary
} from '../types/workbench';
import { apiRequest } from './httpClient';

export function getSession(): Promise<{ state: SessionState }> {
  return apiRequest('/session', undefined, 'State error');
}

export function getStageData<T = any>(stageNum: number): Promise<T> {
  return apiRequest(`/stage/${stageNum}/data`, undefined, 'Stage data error');
}

export function uploadAudio(file: File): Promise<{ status: string; state: SessionState }> {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest(
    '/session/upload',
    {
      method: 'POST',
      body: formData
    },
    'Upload failed'
  );
}

export function runStage<T = any>(
  stageNum: number
): Promise<{ stage: number; data: T; state: SessionState }> {
  return apiRequest(`/stage/${stageNum}/run`, { method: 'POST' }, `Stage ${stageNum} failed`);
}

export function runAllStages(force = true): Promise<{
  status: string;
  execution_mode?: string;
  ttfo_ms?: number;
  wall_time_ms?: number;
  sequential_sum_ms?: number;
  results?: Record<number, any>;
  state: SessionState;
}> {
  return apiRequest(
    `/run-all?force=${force ? 'true' : 'false'}`,
    { method: 'POST' },
    'Üretim akışı çalıştırılamadı'
  );
}

export function resetSession(): Promise<{ status: string; state: SessionState }> {
  return apiRequest('/session/reset', { method: 'POST' }, 'Reset failed');
}

export function getLogs(
  sinceId = 0,
  stageNum?: number,
  limit = 200,
    filterSessionId ?: string | null
): Promise < { logs: LogEntry[]; last_id: number } > {
    const params = new URLSearchParams({ since_id: String(sinceId), limit: String(limit) });
    if(stageNum !== undefined && stageNum !== null) {
    params.set('stage_num', String(stageNum));
  }
  if (filterSessionId) {
    params.set('filter_session_id', filterSessionId);
  }
  return apiRequest(`/logs?${params.toString()}`, {}, 'Failed to fetch logs');
}

export function clearLogs(): Promise<{ status: string; message: string }> {
  return apiRequest('/logs/clear', { method: 'POST' }, 'Failed to clear logs');
}

export function getTelemetrySessions(): Promise<{ sessions: TelemetrySessionSummary[] }> {
  return apiRequest('/telemetry/sessions', undefined, 'Oturum listesi alınamadı');
}

export function getTelemetryRequests(params?: {
  sinceId?: number;
  sessionId?: string | null;
  onlyErrors?: boolean;
  limit?: number;
}): Promise<{ requests: RequestTraceEntry[]; last_id: number }> {
  const qs = new URLSearchParams({
    since_id: String(params?.sinceId ?? 0),
    limit: String(params?.limit ?? 200)
  });
  if (params?.sessionId) {
    qs.set('session_id', params.sessionId);
  }
  if (params?.onlyErrors) {
    qs.set('only_errors', 'true');
  }
  return apiRequest(`/telemetry/requests?${qs.toString()}`, undefined, 'İstek geçmişi alınamadı');
}

export function clearTelemetryRequests(): Promise<{ status: string; message: string }> {
  return apiRequest('/telemetry/requests/clear', { method: 'POST' }, 'İstek geçmişi temizlenemedi');
}
```

## `production/developer/src/App.tsx`

```tsx
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

export const App: React.FC = () => {
  const {
    activeSessionId,
    telemetrySessions,
    switchSession,
    refreshTelemetrySessions,
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
    onlyActiveSession,
    setOnlyActiveSession,
    autoScroll,
    setAutoScroll,
    clearAllLogs
  } = useLiveLogs({
    isExecuting: isPipelineExecuting,
    activeSessionId
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
          <div style={{ width: '100%', maxWidth: '1060px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <EmptyState onUpload={handleUpload} />
            <RequestTraceView activeSessionId={activeSessionId} onSelectSession={switchSession} />
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
          />
        </main>
      )}
    </div>
  );
};

export default App;
```

## `production/developer/src/components/AudioPlayer/StemMixerPopover.tsx`

```tsx
import React from 'react';
import { StemChannel } from '../../types/workbench';
import { MixerIcon, StemChannelIcon } from '../icons';

interface StemMixerPopoverProps {
  channels: StemChannel[];
  onClose: () => void;
  onToggleSolo?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onSetVolume?: (id: string, vol: number) => void;
  onResetStems?: () => void;
}

export const StemMixerPopover: React.FC<StemMixerPopoverProps> = ({
  channels,
  onClose,
  onToggleSolo,
  onToggleMute,
  onSetVolume,
  onResetStems
}) => {
  const channelsToRender = channels.filter((c) => c.detected !== false);

  return (
    <div className="m3-upward-card mixer-card">
      <md-elevation></md-elevation>

      {/* Popover Header */}
      <div className="dev-benchmark-top" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="dev-io-flow">
          <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MixerIcon size={20} />
          </md-icon>
          <span className="md-typescale-title-small">Stüdyo Mikseri</span>
        </div>

        <div className="dev-inspector-controls" style={{ gap: '4px' }}>
          {onResetStems && (
            <md-text-button onClick={onResetStems} title="Mikseri Varsayılan Düzeye Sıfırla">
              Sıfırla
            </md-text-button>
          )}
          <md-icon-button onClick={onClose} aria-label="Mikseri Kapat" title="Mikseri Kapat">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Stem Rows with Official <md-slider> */}
      <div className="m3-mixer-rows">
        {channelsToRender.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' }} className="dev-aside-copy">
            Aktif ses kanalı bulunamadı.
          </div>
        ) : (
          channelsToRender.map((ch) => {
            const effectiveVolPct = Math.round((ch.isMuted ? 0 : ch.volume) * 100);
            const rowClass = [
              'm3-mixer-row',
              ch.isSolo ? 'is-solo' : '',
              ch.isMuted ? 'is-muted' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={ch.id} className={rowClass}>
                <div className="m3-mixer-channel-name">
                  <StemChannelIcon channelId={ch.id} category={ch.category} size={18} />
                  <div className="dev-modal-track-meta">
                    <span className="md-typescale-label-large" title={ch.name}>
                      {ch.name}
                    </span>
                    {ch.panningDesc && (
                      <span className="dev-aside-copy m3-mono" style={{ fontSize: '10px' }}>
                        {ch.panningDesc}
                      </span>
                    )}
                  </div>
                </div>

                <div className="m3-mixer-slider-wrap">
                  <md-slider
                    min={0}
                    max={100}
                    value={effectiveVolPct}
                    onInput={(e: any) => {
                      const val = Number(e.target?.value ?? effectiveVolPct);
                      onSetVolume?.(ch.id, val / 100);
                    }}
                  ></md-slider>
                  <span className="m3-mixer-vol-pct m3-tabular">%{effectiveVolPct}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleMute?.(ch.id)}
                  className={`m3-mixer-ms-btn ${ch.isMuted ? 'is-mute-active' : ''}`}
                  title={`${ch.name} Sustur (Mute)`}
                >
                  M
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSolo?.(ch.id)}
                  className={`m3-mixer-ms-btn ${ch.isSolo ? 'is-solo-active' : ''}`}
                  title={`${ch.name} Solo`}
                >
                  S
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
```

## `production/developer/src/components/AudioPlayer/WaveformScrubber.tsx`

```tsx
import React from 'react';

const WAVEFORM_HEIGHTS = [
  5, 8, 12, 7, 16, 22, 11, 19, 24, 15, 9, 17, 21, 12, 6, 18,
  23, 10, 14, 20, 13, 8, 16, 24, 18, 11, 20, 24, 14, 8, 18, 12
];

interface WaveformScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const WaveformScrubber: React.FC<WaveformScrubberProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
    onSeek(ratio * duration);
  };

  return (
    <div
      onClick={handleWaveformClick}
      role="slider"
      aria-label="Dalga Formu İlerleme Çubuğu"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      className="m3-waveform-track"
      title="İlerlemek için dalga formuna tıklayın"
    >
      <div
        className="m3-waveform-playhead"
        style={{ left: `${progressPercent}%` }}
      />

      <div className="m3-waveform-bars">
        {Array.from({ length: 84 }).map((_, i) => {
          const h = WAVEFORM_HEIGHTS[i % WAVEFORM_HEIGHTS.length];
          const isPast = (i / 84) * 100 <= progressPercent;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}px`,
                borderRadius: '9999px',
                backgroundColor: isPast
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-outline-variant)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
```

## `production/developer/src/components/Console/StudioConsoleView.tsx`

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../../types/workbench';

interface StudioConsoleViewProps {
  logs: LogEntry[];
  filterStage: number | 'all';
  onFilterStageChange: (stage: number | 'all') => void;
  filterLevel: 'all' | 'INFO' | 'WARNING' | 'ERROR';
  onFilterLevelChange: (lvl: 'all' | 'INFO' | 'WARNING' | 'ERROR') => void;
  onlyActiveSession: boolean;
  onToggleOnlyActiveSession: () => void;
  activeSessionId?: string;
  onClear: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  isExecuting?: boolean;
  activeStageNum?: number | null;
}

const CONSOLE_STAGES: Array<{ id: number; label: string }> = [
  { id: 1, label: '01 Ölçü' },
  { id: 2, label: '02 Akor' },
  { id: 3, label: '03 Kanal' },
  { id: 4, label: '04 Sözler' }
];

export const StudioConsoleView: React.FC<StudioConsoleViewProps> = ({
  logs,
  filterStage,
  onFilterStageChange,
  filterLevel,
  onFilterLevelChange,
  onlyActiveSession,
  onToggleOnlyActiveSession,
  activeSessionId,
  onClear,
  autoScroll,
  onToggleAutoScroll,
  isExecuting = false,
  activeStageNum
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyLogs = () => {
    const text = logs
      .map(
        (l) =>
          `[${l.timestamp}] [${l.level}] ${l.stage_num ? `[Aşama ${l.stage_num}] ` : ''}${l.message}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const displayedLogs = searchTerm
    ? logs.filter((l) => l.message.toLowerCase().includes(searchTerm.toLowerCase()))
    : logs;

  const errorCount = logs.filter((l) => l.level === 'ERROR').length;
  const warnCount = logs.filter((l) => l.level === 'WARNING').length;

  return (
    <div className="m3-surface-card dev-section-block">
      <md-elevation></md-elevation>

      {/* 1. Console Header */}
      <div className="dev-section-header">
        <div className="dev-section-header-title" style={{ flexWrap: 'wrap' }}>
          <div className="dev-modal-icon-badge" style={{ width: '30px', height: '30px' }}>
            <md-icon style={{ fontSize: '17px' }}>terminal</md-icon>
          </div>
          <span className="md-typescale-title-small">Canlı Konsol & Çıkarım Günlüğü</span>
          <span className="m3-tonal-badge sm m3-tabular">{logs.length} Kayıt</span>

          {isExecuting && (
            <span className="m3-tonal-badge sm secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>Aşama {activeStageNum ? `0${activeStageNum}` : ''} Yürütülüyor</span>
            </span>
          )}

          {errorCount > 0 && (
            <span className="m3-tonal-badge sm error">
              <md-icon style={{ fontSize: '14px' }}>cancel</md-icon>
              <span>{errorCount} Hata</span>
            </span>
          )}

          {warnCount > 0 && (
            <span className="m3-tonal-badge sm tertiary">
              <md-icon style={{ fontSize: '14px' }}>warning</md-icon>
              <span>{warnCount} Uyarı</span>
            </span>
          )}
        </div>

        <div className="dev-section-header-actions">
          <div className="dev-search-pill">
            <md-icon>search</md-icon>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Loglarda filtrele..."
              className="dev-search-input"
            />
          </div>

          <md-filled-tonal-button
            onClick={onToggleAutoScroll}
            title="Yeni kayıt geldikçe aşağı otomatik kaydır"
          >
            <md-icon slot="icon">
              {autoScroll ? 'vertical_align_bottom' : 'pause_circle'}
            </md-icon>
            <span>Oto-Kaydır</span>
          </md-filled-tonal-button>

          <md-outlined-button onClick={handleCopyLogs} title="Tüm logları panoya kopyala">
            <md-icon slot="icon">{copied ? 'check' : 'content_copy'}</md-icon>
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </md-outlined-button>

          <md-text-button onClick={onClear} title="Log kayıtlarını temizle">
            <md-icon slot="icon">delete</md-icon>
            <span>Temizle</span>
          </md-text-button>
        </div>
      </div>

      {/* 2. Stage & Level Filter Strip */}
      <div className="dev-terminal-toolbar">
        <div className="m3-segmented-group">
          <button
            type="button"
            onClick={() => onFilterStageChange('all')}
            className={`m3-segmented-btn ${filterStage === 'all' ? 'is-active' : ''}`}
          >
            Tüm Aşamalar
          </button>
          {CONSOLE_STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onFilterStageChange(s.id)}
              className={`m3-segmented-btn ${filterStage === s.id ? 'is-active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="m3-segmented-group">
          {(['all', 'INFO', 'WARNING', 'ERROR'] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onFilterLevelChange(lvl)}
              className={`m3-segmented-btn ${filterLevel === lvl ? 'is-active' : ''}`}
            >
              {lvl === 'all' ? 'Tüm Seviyeler' : lvl}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`dev-filter-pill ${onlyActiveSession ? 'is-active' : ''}`}
          onClick={onToggleOnlyActiveSession}
          title={
            activeSessionId
              ? `Yalnızca seçili oturumun (${activeSessionId}) loglarını göster`
              : 'Yalnızca seçili oturumun loglarını göster'
          }
        >
          {onlyActiveSession ? 'Sadece Seçili Oturum' : 'Tüm Oturumlar'}
        </button>
      </div>

      {/* 3. Telemetry Viewport */}
      <div className="dev-terminal-viewport">
        {displayedLogs.length === 0 ? (
          <div style={{ margin: 'auto', color: '#94A3B8', fontStyle: 'italic' }}>
            Henüz günlük kaydı bulunmuyor. Bir aşama çalıştırıldığında tüm sistem telemetrisi anlık
            olarak buraya yansır.
          </div>
        ) : (
          displayedLogs.map((log) => {
            const isErr = log.level === 'ERROR';
            const isWarn = log.level === 'WARNING';
            const isSuccess =
              log.message.includes('Tamamlandı') || log.message.includes('başarıyla');

            const rowClass = [
              'dev-log-row',
              isErr ? 'is-err' : isWarn ? 'is-warn' : isSuccess ? 'is-success' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={log.id} className={rowClass}>
                <span className="dev-log-ts m3-tabular">[{log.timestamp}]</span>
                <span className="dev-log-lvl">{log.level}</span>
                {log.session_id && (
                  <span className="m3-tonal-badge sm m3-mono" title={`Oturum: ${log.session_id}`}>
                    {log.session_id === 'default' ? 'default' : log.session_id.slice(0, 10)}
                  </span>
                )}
                {log.stage_num && (
                  <span className="m3-tonal-badge sm primary">Aşama {log.stage_num}</span>
                )}
                <span className="dev-log-msg">{log.message}</span>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* 4. Terminal Status Footer */}
      <div className="dev-terminal-footer">
        <span>Kythra In-Memory Telemetry Ring-Buffer (Maks: 2000 satır)</span>
        <span className="dev-io-flow">
          <span className="m3-status-dot success is-pulsing" aria-hidden="true" />
          <span>Sistem Bağlantısı Aktif</span>
        </span>
      </div>
    </div>
  );
};
```

## `production/developer/src/components/EmptyState.tsx`

```tsx
import React from 'react';
import { AudioDropzone } from './ui/AudioDropzone';

interface EmptyStateProps {
  onUpload: (file: File) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUpload }) => {
  return (
    <div className="dev-empty-container">
      {/* 1. Welcome Hero Card */}
      <section className="m3-surface-card dev-hero-card">
        <md-elevation></md-elevation>
        <div className="dev-hero-copy">
          <div className="dev-hero-badges">
            <span className="m3-tonal-badge success">
              <span className="m3-status-dot success is-pulsing" aria-hidden="true" />
              <span>Faz 01 · Hazır</span>
            </span>
            <span className="m3-tonal-badge">Hedef: 44.1 kHz Stereo PCM WAV</span>
          </div>

          <h1 className="dev-hero-title">Çözümlemeyi Başlatmak İçin Ses Dosyası Yükleyin</h1>
          <p className="dev-body-muted">
            Tek parça bir ses kaydı yükleyerek 4 aşamalı AI boru hattını başlatın ve her aşamanın
            çıktısını canlı olarak inceleyin.
          </p>
        </div>

        <div className="dev-hero-aside">
          <span className="dev-aside-title">Ses Alımı Bekleniyor</span>
          <p className="dev-aside-copy">
            Yüklenen tek parça ses dosyası otomatik olarak tempo, akor, BS-RoFormer 6-kanal
            ayrıştırma ve söz/karaoke aşamalarından geçirilir.
          </p>
        </div>
      </section>

      {/* 2. Single Track Ingestion Card */}
      <section className="m3-surface-card dev-ingest-card">
        <md-elevation></md-elevation>
        <div>
          <div className="dev-card-head-row">
            <span className="dev-card-title">01 · Tek Parça Ses Dosyası Yükle</span>
            <span className="m3-tonal-badge sm">WAV / MP3 / FLAC / M4A</span>
          </div>
          <p className="dev-aside-copy">
            Tüm dosyalar otomatik olarak 44.1 kHz 16-bit stereo standardına dönüştürülür ve 3
            aşamalı AI boru hattıyla işlenir.
          </p>
        </div>

        <AudioDropzone
          onUpload={onUpload}
          compact={true}
          title="Dosya seçmek için tıklayın veya buraya sürükleyip bırakın"
          subtitle="100 MB’a kadar ses dosyaları desteklenir"
        />
      </section>
    </div>
  );
};
```

## `production/developer/src/components/Header.tsx`

```tsx
import React from 'react';
import { SessionState, TelemetrySessionSummary } from '../types/workbench';
import { BrandLogoIcon } from './icons';
import { SessionSwitcher } from './SessionSwitcher';

interface HeaderProps {
  session: SessionState | null;
  activeSessionId: string;
  telemetrySessions: TelemetrySessionSummary[];
  onSelectSession: (sessionId: string) => void;
  onRefreshSessions: () => void;
  onRunAll: () => void;
  onReset: () => void;
  onOpenSourceModal: () => void;
  isLoading: boolean;
  runningStage: number | null;
  mode: 'sequential' | 'parallel';
  onModeChange: (mode: 'sequential' | 'parallel') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  activeSessionId,
  telemetrySessions,
  onSelectSession,
  onRefreshSessions,
  onRunAll,
  onReset,
  onOpenSourceModal,
  isLoading,
  runningStage,
  mode,
  onModeChange,
  isDarkMode,
  onToggleTheme
}) => {
  const hasSession = Boolean(session?.has_session);

  return (
    <header className="m3-top-app-bar">
      <div className="m3-top-app-bar-inner">
        {/* 1. Brand Lockup + Live Session Switcher + Segmented Execution Mode */}
        <div className="m3-header-left">
          <div className="m3-brand-lockup">
            <div className="m3-brand-logo">
              <BrandLogoIcon size={20} />
            </div>
            <span className="m3-brand-title">
              Kythra <span className="m3-brand-subtitle">Developer</span>
            </span>
          </div>

          <div className="m3-header-divider" aria-hidden="true" />

          <SessionSwitcher
            activeSessionId={activeSessionId}
            sessions={telemetrySessions}
            onSelectSession={onSelectSession}
            onRefresh={onRefreshSessions}
          />

          <div className="m3-header-divider" aria-hidden="true" />

          <div role="group" aria-label="Çalıştırma Modu" className="m3-segmented-group">
            <button
              type="button"
              onClick={() => onModeChange('sequential')}
              className={`m3-segmented-btn ${mode === 'sequential' ? 'is-active' : ''}`}
              title="Adım Adım Mod: Her aşamayı (01 → 04) tek tek manuel veya sıralı çalıştırıp hata ayıkla"
            >
              <md-icon>commit</md-icon>
              <span>Adım Adım</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('parallel')}
              className={`m3-segmented-btn ${mode === 'parallel' ? 'is-active is-secondary' : ''}`}
              title="Üretim Akışı Modu: Web Studio kullanıcı akışını birebir simüle et ve test et"
            >
              <md-icon>bolt</md-icon>
              <span>Üretim Akışı</span>
            </button>
          </div>
        </div>

        {/* 2. Live Pipeline Execution Badge */}
        <div className="m3-header-center">
          {runningStage && (
            <span className="m3-tonal-badge secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>
                {mode === 'parallel'
                ? 'Üretim Akışı: Aşamalar eşzamanlı çalışıyor...'
                : `Adım Adım: Aşama 0${runningStage} çalışıyor...`}
              </span>
            </span>
          )}
        </div>

        {/* 3. Official Material 3 Action Buttons & Theme Switcher */}
        <div className="m3-header-actions">
          <md-filled-tonal-button
            onClick={onOpenSourceModal}
            disabled={isLoading || undefined}
            title="Yeni Ses Dosyası Yükle"
          >
            <md-icon slot="icon">audio_file</md-icon>
            <span>Kaynağı Değiştir</span>
          </md-filled-tonal-button>

          <md-outlined-button
            onClick={onReset}
            disabled={isLoading || !hasSession || undefined}
            title="Oturumu ve Aşama Çıktılarını Sıfırla"
          >
            <md-icon slot="icon">restart_alt</md-icon>
            <span>Sıfırla</span>
          </md-outlined-button>

          <md-filled-button
            onClick={onRunAll}
            disabled={isLoading || !hasSession || undefined}
            title={
              mode === 'parallel'
                  ? 'Seçili oturumda Web Studio üretim akışını birebir test et'
                  : 'Tüm aşamaları (01 → 04) adım adım sırayla çözümle'
            }
          >
            <md-icon slot="icon">{mode === 'parallel' ? 'bolt' : 'play_arrow'}</md-icon>
            <span>{mode === 'parallel' ? 'Üretim Akışını Test Et' : 'Adım Adım Çalıştır'}</span>
          </md-filled-button>

          <md-icon-button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            title={isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            <md-icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</md-icon>
          </md-icon-button>
        </div>
      </div>
    </header>
  );
};
```

## `production/developer/src/components/icons/BrandLogoIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

const BRAND_LOGO_PATHS = (
  <path
    d="M5 12V7M9 17V5M13 19V3M17 15V8M21 12V10"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  />
);

/**
 * Kythra Studio equalizer waveform brand mark.
 */
export const BrandLogoIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {BRAND_LOGO_PATHS}
  </SvgIconBase>
));

BrandLogoIcon.displayName = 'BrandLogoIcon';
```

## `production/developer/src/components/icons/index.ts`

```ts
export { SvgIconBase, type IconProps } from './SvgIconBase';
export { BrandLogoIcon } from './BrandLogoIcon';
export { MetronomeIcon } from './MetronomeIcon';
export { MixerIcon } from './MixerIcon';
export {
  InstrumentIcon,
  type InstrumentIconProps,
  type StudioInstrumentKind
} from './instruments/InstrumentIcon';
export { GuitarIcon } from './instruments/GuitarIcon';
export { PianoIcon } from './instruments/PianoIcon';
export { UkuleleIcon } from './instruments/UkuleleIcon';
export { StemChannelIcon } from './StemChannelIcon';
export {
  SourceOriginIcon,
  detectSongSource,
  type SongSourceOrigin
} from './sources/SourceOriginIcon';
```

## `production/developer/src/components/icons/instruments/GuitarIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Iconic Electric Guitar (Fender Stratocaster Silhouette)
 * Features:
 * - Asymmetric double-cutaway horns
 * - Cutout negative-space pickguard (fillRule="evenodd")
 * - 3 single-coil pickups and tone/volume control knobs
 * - Signature 6-in-line headstock with tuning pegs
 */
const GUITAR_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Body with Cutout Pickguard (evenodd creates the negative space pickguard) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2,5 V12.2 C10,12 8.5,11.2 7.6,11.6 C6.7,12 6.6,13.2 7.1,14.6 C7.7,16 7.4,17.2 6.6,18.4 C5.4,20 6.4,22.6 9.4,22.9 C11.5,23.1 13.5,23.1 15.2,22.3 C17.5,21.1 17.8,18.5 16.7,17 C15.9,15.8 15.7,14.8 16.4,13.8 C17.1,12.8 16.6,12.2 15.6,12.5 C14.6,12.8 13.6,13 12.8,12.2 V5 H11.2 Z M11.5,13.5 C10.8,13.5 10.2,13.8 9.8,14.2 C9.3,14.8 9.5,15.8 9.2,16.8 C8.8,17.8 8.8,18.8 9.5,19.8 C10.2,20.6 11.8,20.8 13.2,20.5 C14.6,20.2 15.2,19.2 15.2,18.2 C15.2,16.8 14.8,15.5 14.2,14.5 C13.6,13.8 12.5,13.5 11.5,13.5 Z"
    />

    {/* Stratocaster 6-in-line Headstock */}
    <path d="M11.2,5 L10.8,1.7 C10.8,1.2 11.3,0.8 11.8,0.8 C12.6,0.8 13.2,1.1 13.6,1.4 C14.3,1.9 14.1,2.8 13.3,3.3 C12.8,3.6 12.8,4.3 12.8,5 H11.2 Z" />

    {/* 6 Tuning Pegs in a row on the left */}
    <circle cx="10.2" cy="1.5" r="0.45" />
    <circle cx="10.2" cy="2.1" r="0.45" />
    <circle cx="10.2" cy="2.7" r="0.45" />
    <circle cx="10.2" cy="3.3" r="0.45" />
    <circle cx="10.2" cy="3.9" r="0.45" />
    <circle cx="10.2" cy="4.5" r="0.45" />

    {/* 3 Single-Coil Pickups inside the Pickguard */}
    <rect x="10.8" y="14.8" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="16.3" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="17.8" width="2.4" height="0.7" rx="0.3" />

    {/* Control Knobs (Potanslar) */}
    <circle cx="13.8" cy="18.5" r="0.4" />
    <circle cx="13.2" cy="19.5" r="0.4" />
  </g>
);

/**
 * Electric guitar (Stratocaster) icon matching the 24x24 studio outline grid.
 */
export const GuitarIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {GUITAR_PATHS}
  </SvgIconBase>
));

GuitarIcon.displayName = 'GuitarIcon';
```

## `production/developer/src/components/icons/instruments/InstrumentIcon.tsx`

```tsx
import React from 'react';
import { IconProps } from '../SvgIconBase';
import { GuitarIcon } from './GuitarIcon';
import { PianoIcon } from './PianoIcon';
import { UkuleleIcon } from './UkuleleIcon';

  export type StudioInstrumentKind = 'guitar' | 'piano' | 'ukulele';

  const INSTRUMENT_ICON_REGISTRY: Record<StudioInstrumentKind, React.ComponentType < IconProps >> = {
    guitar: GuitarIcon,
    piano: PianoIcon,
    ukulele: UkuleleIcon
  };

export interface InstrumentIconProps extends IconProps {
  instrument: StudioInstrumentKind;
}

/**
 * Strategy selector rendering the pure SVG icon for the active instrument type.
 */
export const InstrumentIcon: React.FC<InstrumentIconProps> = React.memo(({
  instrument,
  ...rest
}) => {
  const Icon = INSTRUMENT_ICON_REGISTRY[instrument] ?? GuitarIcon;
  return <Icon {...rest} />;
});

InstrumentIcon.displayName = 'InstrumentIcon';
```

## `production/developer/src/components/icons/instruments/PianoIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

const PIANO_PATHS = (
  <g style={{ fill: 'none' }}>
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      style={{ fill: 'none' }}
    />
    <line x1="7" y1="4" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17" y1="4" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="10.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="15.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-black / 5-white piano keyboard icon matching the 24x24 studio outline grid.
 */
export const PianoIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {PIANO_PATHS}
  </SvgIconBase>
));

PianoIcon.displayName = 'PianoIcon';
```

## `production/developer/src/components/icons/instruments/UkuleleIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Solid Silhouette Soprano/Concert Ukulele Icon
 * Matches the guitar's modern filled silhouette aesthetic:
 * - Solid figure-8 body with negative space (evenodd) cutout soundhole and bridge
 * - Neck with 2 frets and rounded heel
 * - Crown headstock with 4 tuning pegs (2 per side)
 * - Cohesive 43-degree diagonal studio angle
 */
const UKULELE_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Solid Ukulele Body with Negative-Space Soundhole & Bridge (evenodd) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8,9.5 C9.8,9.2 7.6,9.5 6.6,11.2 C5.6,12.8 6.4,14.5 5.5,16 C4.2,18 4.8,21.5 8,22.8 C10.5,23.5 13.5,23.5 16,22.8 C19.2,21.5 19.8,18 18.5,16 C17.6,14.5 18.4,12.8 17.4,11.2 C16.4,9.5 14.2,9.2 13.2,9.5 V10.5 C13.2,11.8 10.8,11.8 10.8,10.5 Z M12,14.5 C10.9,14.5 10,15.4 10,16.5 C10,17.6 10.9,18.5 12,18.5 C13.1,18.5 14,17.6 14,16.5 C14,15.4 13.1,14.5 12,14.5 Z M9.5,20.2 H14.5 V21.2 H9.5 Z"
    />

    {/* Neck & Frets */}
    <path
      d="M10.8,4.5 V9.5 M13.2,4.5 V9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="10.8" y1="6.2" x2="13.2" y2="6.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <line x1="10.8" y1="7.8" x2="13.2" y2="7.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M10.8,9.5 C10.8,11 13.2,11 13.2,9.5" stroke="currentColor" strokeWidth="1.5" fill="none" />

    {/* Crown Headstock */}
    <path d="M10.4,4.5 C9.8,3.5 10.2,1.8 12,1.2 C13.8,1.8 14.2,3.5 13.6,4.5 Z" />

    {/* 4 Tuning Pegs (2 Left, 2 Right) */}
    <line x1="10.6" y1="2.5" x2="9.2" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="10.8" y1="3.8" x2="9.4" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.4" y1="2.5" x2="14.8" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.2" y1="3.8" x2="14.6" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

/**
 * 4-peg rounded figure-8 ukulele icon matching the 24x24 studio outline grid.
 */
export const UkuleleIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {UKULELE_PATHS}
  </SvgIconBase>
));

UkuleleIcon.displayName = 'UkuleleIcon';
```

## `production/developer/src/components/icons/MetronomeIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Option A: Dynamic Mechanical Metronome Icon (Studio Standard)
 * Features an open-pyramid body, center tempo guide, and an angled swinging pendulum arm
 * with a high-readability counterweight bob.
 *
 * Explicit `fill="none"` and `style={{ fill: 'none' }}` guarantees that web-component host
 * styles (like `<md-icon>`'s `fill: currentColor`) will never fill the body into a solid block.
 */
const METRONOME_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* Center tempo scale guide */}
    <path
      d="M12 11.5V9"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Swinging pendulum arm */}
    <path
      d="M12 17.2L18.8 10.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Open Pyramid Metronome Frame */}
    <path
      d="M15.1 5.7L14.85 4.98C14.4 3.75 13.25 3 12 3C10.75 3 9.6 3.75 9.15 4.98L4.42 19.69C4.15 20.5 4.76 21 5.37 21H18.63C19.24 21 19.85 20.5 19.58 19.69L18.45 16.2"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ fill: 'none' }}
    />

    {/* Counterweight Bob (Pirinç Ağırlık) */}
    <circle
      cx="19.8"
      cy="9.4"
      r="2"
      fill="currentColor"
      stroke="none"
      style={{ fill: 'currentColor' }}
    />
  </g>
);

/**
 * Classic mechanical pyramid metronome icon with angled swinging pendulum and weight.
 */
export const MetronomeIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {METRONOME_PATHS}
  </SvgIconBase>
));

MetronomeIcon.displayName = 'MetronomeIcon';
```

## `production/developer/src/components/icons/MixerIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Clean 3-Channel Studio Fader Icon
 * Spacious vertical rails with staggered horizontal slider caps:
 * - Zero sub-pixel gaps or cluttered backing boxes at 18px-20px
 * - Explicit fill overrides guard against <md-icon> host CSS fill inheritance
 */
const MIXER_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* 3 Spacious Vertical Fader Rails */}
    <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="18" y1="4" x2="18" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />

    {/* 3 Staggered Horizontal Studio Fader Caps */}
    <rect x="3.7" y="7.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="9.7" y="13.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="15.7" y="6.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-fader studio mixer icon matching the 24x24 studio outline grid.
 */
export const MixerIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {MIXER_PATHS}
  </SvgIconBase>
));

MixerIcon.displayName = 'MixerIcon';
```

## `production/developer/src/components/icons/sources/SourceOriginIcon.tsx`

```tsx
import React from 'react';

export type SongSourceOrigin = 'upload' | 'audio';

export function detectSongSource(
  trackKey?: string
): SongSourceOrigin {
  if (trackKey && trackKey.startsWith('sha256:')) {
    return 'upload';
  }
  return 'audio';
}

const SOURCE_ICON_REGISTRY: Record<SongSourceOrigin, React.ReactElement> = {
  upload: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>audio_file</md-icon>,
  audio: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>music_note</md-icon>
};

export const SourceOriginIcon: React.FC<{ source: SongSourceOrigin }> = React.memo(({ source }) => (
  SOURCE_ICON_REGISTRY[source] ?? SOURCE_ICON_REGISTRY.audio
));

SourceOriginIcon.displayName = 'SourceOriginIcon';
```

## `production/developer/src/components/icons/StemChannelIcon.tsx`

```tsx
import React from 'react';
import { resolveInstrumentMeta } from '../../constants/instruments';
import { InstrumentIcon } from './instruments/InstrumentIcon';

interface StemChannelIconProps {
  channelId: string;
  category?: string;
  size?: number;
  color?: string;
}

/**
 * Unified channel icon resolver for the Developer Workbench:
 * - Reuses shared custom SVG icons (`InstrumentIcon`) for Guitar and Piano channels
 * - Renders official Material Symbols (`<md-icon>`) for Vocals, Bass, Drums, Other
 */
export const StemChannelIcon: React.FC<StemChannelIconProps> = React.memo(({
  channelId,
  category,
  size = 18,
  color
}) => {
  const effectiveKey = category || channelId;
  const meta = resolveInstrumentMeta(effectiveKey);
  const resolvedColor = color ?? meta.color;

  if (effectiveKey === 'guitar' || channelId === 'guitar' || channelId.startsWith('guitar_')) {
    return (
      <span
        className="m3-inline-icon-slot"
        style={{ color: resolvedColor, width: size, height: size }}
        aria-hidden="true"
      >
        <InstrumentIcon instrument="guitar" size={size} />
      </span>
    );
  }

  if (effectiveKey === 'piano' || channelId === 'piano') {
    return (
      <span
        className="m3-inline-icon-slot"
        style={{ color: resolvedColor, width: size, height: size }}
        aria-hidden="true"
      >
        <InstrumentIcon instrument="piano" size={size} />
      </span>
    );
  }

  return (
    <md-icon
      style={{
        color: resolvedColor,
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {meta.materialIcon}
    </md-icon>
  );
});

StemChannelIcon.displayName = 'StemChannelIcon';
```

## `production/developer/src/components/icons/SvgIconBase.tsx`

```tsx
import React from 'react';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  title?: string;
}

interface SvgIconBaseProps extends IconProps {
  children: React.ReactNode;
}

/**
 * Shared accessible SVG primitive enforcing consistent viewBox, sizing,
 * stroke-less defaults, and automatic ARIA attributes across studio icons.
 */
export const SvgIconBase: React.FC<SvgIconBaseProps> = React.memo(({
  size = 20,
  width,
  height,
  viewBox = '0 0 24 24',
  fill = 'none',
  title,
  children,
  ...rest
}) => (
  <svg
    width={width ?? size}
    height={height ?? size}
    viewBox={viewBox}
    fill={fill}
    role={title ? 'img' : undefined}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : true}
    {...rest}
  >
    {children}
  </svg>
));

SvgIconBase.displayName = 'SvgIconBase';
```

## `production/developer/src/components/Inspector/GlobalPipelineTracker.tsx`

```tsx
import React from 'react';
import { StageMetadata } from '../../types/workbench';

interface GlobalPipelineTrackerProps {
  stages: StageMetadata[];
  runningStage: number | null;
  selectedStageId: number;
  onSelectStage: (id: number) => void;
  onOpenConsole: () => void;
}

const STAGE_SHORT_NAMES = ['Ölçü & Tempo', 'Akor & Yapı', 'Kanal Ayırma', 'Sözler'];

export const GlobalPipelineTracker: React.FC<GlobalPipelineTrackerProps> = ({
  stages,
  runningStage,
  selectedStageId,
  onSelectStage,
  onOpenConsole
}) => {
  if (!runningStage) return null;

  const currentStageMeta = stages.find((s) => s.id === runningStage);
  const completedCount = stages.filter((s) => s.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (stages.length || 3)) * 100);

  return (
    <div className="m3-surface-card dev-tracker-card">
      <md-elevation></md-elevation>

      <div className="dev-tracker-status">
        <md-circular-progress
          indeterminate={true}
          style={{ '--md-circular-progress-size': '22px', width: '22px', height: '22px' } as React.CSSProperties}
        ></md-circular-progress>
        <div className="dev-modal-track-meta">
          <div className="dev-io-flow m3-mono" style={{ fontSize: '11px', color: 'var(--md-sys-color-primary)' }}>
            <strong>Boru Hattı Aktif · Aşama 0{runningStage} / 0{stages.length || 3}</strong>
            <span className="m3-tabular">(%{progressPercent})</span>
          </div>
          <span className="md-typescale-title-small">
            {currentStageMeta?.title || 'Çözümleme yürütülüyor...'}
          </span>
        </div>
      </div>

      <div className="dev-tracker-pills">
        {stages.map((st, idx) => {
          const isCurrent = runningStage === st.id;
          const isDone = st.status === 'completed';
          const isErr = st.status === 'error';
          const isSelected = selectedStageId === st.id;

          const cls = [
            'dev-tracker-stage-btn',
            isCurrent ? 'is-current' : isDone ? 'is-done' : isErr ? 'is-error' : '',
            isSelected ? 'is-selected' : ''
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => onSelectStage(st.id)}
              className={cls}
              title={`${st.id}. ${st.title} (${st.status})`}
            >
              {isCurrent ? (
                <span className="m3-status-dot primary is-pulsing" aria-hidden="true" />
              ) : isDone ? (
                <md-icon style={{ fontSize: '15px' }}>check_circle</md-icon>
              ) : isErr ? (
                <md-icon style={{ fontSize: '15px' }}>error</md-icon>
              ) : (
                <span className="m3-status-dot neutral" aria-hidden="true" />
              )}
              <span className="m3-tabular">0{st.id}</span>
              <span>{STAGE_SHORT_NAMES[idx] || st.title}</span>
            </button>
          );
        })}
      </div>

      <md-filled-tonal-button onClick={onOpenConsole} title="Canlı Konsol sekmesine git">
        <md-icon slot="icon">terminal</md-icon>
        <span>Konsolu Aç</span>
      </md-filled-tonal-button>
    </div>
  );
};
```

## `production/developer/src/components/Inspector/InspectorHeader.tsx`

```tsx
import React from 'react';
import { InspectorTab, StageMetadata } from '../../types/workbench';
import { formatStageDuration } from '../../constants/stages';

interface InspectorHeaderProps {
  stage: StageMetadata;
  isRunning: boolean;
  onRunStage: () => void;
  rawJsonData: any;
  activeTab: InspectorTab;
  onTabChange: (tab: InspectorTab) => void;
  missingDependency?: string | null;
  onRunMissingPrerequisites?: () => void;
  logCount?: number;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({
  stage,
  isRunning,
  onRunStage,
  activeTab,
  onTabChange,
  missingDependency,
  onRunMissingPrerequisites,
  logCount = 0
}) => {
  return (
    <header className="m3-surface-card dev-inspector-card">
      <md-elevation></md-elevation>

      {/* 1. Primary Inspector Toolbar */}
      <div className="dev-inspector-main-row">
        <div className="dev-inspector-title-group">
          <span className="dev-index-pill m3-tabular">0{stage.id}</span>
          <h2 className="md-typescale-title-medium" title={stage.title}>
            {stage.title}
          </h2>
        </div>

        <div className="dev-inspector-controls">
          <div className="m3-segmented-group" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'diagnostic'}
              onClick={() => onTabChange('diagnostic')}
              className={`m3-segmented-btn ${activeTab === 'diagnostic' ? 'is-active' : ''}`}
            >
              Çözümleme Görünümü
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'json'}
              onClick={() => onTabChange('json')}
              className={`m3-segmented-btn ${activeTab === 'json' ? 'is-active' : ''}`}
            >
              Ham JSON
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'console'}
              onClick={() => onTabChange('console')}
              className={`m3-segmented-btn ${activeTab === 'console' ? 'is-active' : ''}`}
            >
              <span>Canlı Konsol</span>
              {logCount > 0 && (
                <span className="m3-tonal-badge sm primary m3-tabular">{logCount}</span>
              )}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'requests'}
              onClick={() => onTabChange('requests')}
              className={`m3-segmented-btn ${activeTab === 'requests' ? 'is-active' : ''}`}
              title="Web Studio ve Developer API isteklerini & hatalarını canlı izle"
            >
              <span>İstekler</span>
            </button>
          </div>

          <md-filled-button
            onClick={onRunStage}
            disabled={isRunning || undefined}
            title={`Aşama ${stage.id} adımını tek başına çalıştır`}
          >
            {isRunning ? (
              <md-circular-progress
                slot="icon"
                indeterminate={true}
                style={{ '--md-circular-progress-size': '16px', width: '16px', height: '16px' } as React.CSSProperties}
              ></md-circular-progress>
            ) : (
              <md-icon slot="icon">play_arrow</md-icon>
            )}
            <span>{isRunning ? `Aşama 0${stage.id} Çalışıyor...` : `Aşama 0${stage.id} Çalıştır`}</span>
          </md-filled-button>
        </div>
      </div>

      {isRunning && <md-linear-progress indeterminate={true}></md-linear-progress>}

      {/* 2. Input / Output & Timing Metadata Bar */}
      <div className="dev-inspector-subbar">
        <div className="dev-io-flow">
          <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '17px' }}>
            layers
          </md-icon>
          <strong>Girdi:</strong>
          <code className="dev-code-pill">{stage.input}</code>
          <span aria-hidden="true">→</span>
          <strong>Çıktı:</strong>
          <code className="dev-code-pill is-output">{stage.output}</code>
        </div>

        <div className="dev-io-flow">
          <span>
            <strong>Ön Koşul:</strong> {stage.prerequisites}
          </span>
          {stage.durationMs > 0 && (
            <span className="m3-tonal-badge sm m3-tabular">
              Süre: {formatStageDuration(stage.durationMs)}
            </span>
          )}
        </div>
      </div>

      {/* 3. Missing Dependency Banner */}
      {missingDependency && (
        <div className="dev-missing-dep-row">
          <div className="dev-io-flow">
            <md-icon style={{ fontSize: '18px' }}>warning</md-icon>
            <span>{missingDependency}</span>
          </div>
          {onRunMissingPrerequisites && (
            <md-filled-tonal-button onClick={onRunMissingPrerequisites}>
              Ön Koşulları Çalıştır
            </md-filled-tonal-button>
          )}
        </div>
      )}
    </header>
  );
};
```

## `production/developer/src/components/Inspector/RawJsonViewer.tsx`

```tsx
import React, { useState } from 'react';

interface RawJsonViewerProps {
  fileName: string;
  data: any;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ fileName, data }) => {
  const [copied, setCopied] = useState(false);

  const jsonText = data
    ? JSON.stringify(data, null, 2)
    : '// Bu aşama için henüz JSON çıktısı üretilmedi.\n// Çalıştırmak için yukarıdaki "Aşama Çalıştır" düğmesini kullanın.';

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="m3-surface-card dev-section-block">
      <md-elevation></md-elevation>

      <div className="dev-section-header">
        <div className="dev-section-header-title">
          <span className="m3-mono">/session/{fileName}</span>
          <span className="m3-tonal-badge sm success">Canlı Oturum JSON</span>
        </div>

        {data && (
          <md-filled-tonal-button onClick={handleCopy}>
            <md-icon slot="icon">{copied ? 'check' : 'content_copy'}</md-icon>
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </md-filled-tonal-button>
        )}
      </div>

      <pre className="dev-json-pre">{jsonText}</pre>
    </div>
  );
};
```

## `production/developer/src/components/Inspector/StageExecutingView.tsx`

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { StageMetadata, LogEntry } from '../../types/workbench';

interface StageExecutingViewProps {
  stage: StageMetadata;
  logs: LogEntry[];
  onOpenConsole?: () => void;
}

const STAGE_SUB_STEPS: Record<number, { title: string; desc: string }[]> = {
  1: [
    { title: 'Kaynak Ses Okuma', desc: '44.1 kHz stereo PCM dalga formu diskten okunuyor' },
    { title: 'Madmom RNN Çıkarımı', desc: 'Derin öğrenme vuruş ve downbeat olasılık matrisi hesaplanıyor' },
    { title: 'Metrik Izgara Eşleme', desc: 'BPM, ölçü başları ve süreklilik katsayıları hesaplanıyor' },
    { title: 'Çıktı & Doğrulama', desc: 'beats.json oluşturuluyor ve oturum güncelleniyor' }
  ],
  2: [
    { title: 'Zaman-Frekans Dönüşümü', desc: 'Chromagram ve harmonik spektrum vektörleri çıkarılıyor' },
    { title: 'BTC-CNN Akor Sınıflandırma', desc: 'Akor türleri ve bas dereceleri zaman damgalarıyla etiketleniyor' },
    { title: 'Form & Bölüm Segmentasyonu', desc: 'Intro, Verse, Chorus, Solo bölümleri yapılandırılıyor' },
    { title: 'Lead Sheet Çıktısı', desc: 'chords.json formatında oturuma işleniyor' }
  ],
  3: [
    { title: 'Frekans Ayrıştırma Girişi', desc: 'BS-RoFormer-SW frekans domeninde çok kanallı modele besleniyor' },
    { title: 'Derin Model Çıkarımı', desc: 'İzole enstrüman ve vokal kanalları üretiliyor' },
    { title: 'Dalga Formu Normalizasyonu', desc: 'Her kanal 44.1 kHz 16-bit WAV formatına kodlanıyor' },
    { title: 'Mikser Kanalları Kaydı', desc: 'İzole stem WAV akışları mikserde kullanıma hazır hale getiriliyor' }
  ],
  4: [
    { title: 'İzole Vokal Okuma', desc: 'BS-RoFormer tarafından ayrılan stems/vocals.wav sinyali taranıyor' },
    { title: 'stable-ts Transkripsiyon', desc: 'Şarkı sözleri VAD gürültü filtresi ile kelimelere dönüştürülüyor' },
    { title: 'Meta MMS_FA CTC Hizalama', desc: 'Her kelime vokal dalga formuna milisaniye hassasiyetinde hizalanıyor' },
    { title: 'Karaoke Çıktısı Kaydı', desc: 'lyrics.json oluşturuluyor ve veritabanına işleniyor' }
  ]
};

export const StageExecutingView: React.FC<StageExecutingViewProps> = ({
  stage,
  logs,
  onOpenConsole
}) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSec((Date.now() - startTime) / 1000);
    }, 100);
    return () => window.clearInterval(timer);
  }, [stage.id]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const steps = STAGE_SUB_STEPS[stage.id] || [
    { title: 'Girdi Verileri Hazırlığı', desc: 'Önceki aşama çıktıları ve ses kanalları taranıyor' },
    { title: 'Yapay Zeka Motoru Çıkarımı', desc: 'Derin öğrenme modeli hesaplama yapıyor' },
    { title: 'Müzikal Optimizasyon', desc: 'Çıktılar doğrulanıyor ve standart formatlanıyor' },
    { title: 'Çıktı Kaydı', desc: 'Sonuçlar oturum deposuna kaydediliyor' }
  ];

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = (sec % 60).toFixed(1);
    return `${mins > 0 ? `${mins}m ` : ''}${remainingSec}s`;
  };

  return (
    <div className="dev-stack">
      {/* 1. Primary Executing Card */}
      <section className="m3-surface-card dev-inspector-card">
        <md-elevation></md-elevation>
        <div className="dev-status-banner">
          <div className="dev-hero-copy">
            <div className="dev-hero-badges">
              <span className="m3-tonal-badge primary m3-tabular">Aşama 0{stage.id}</span>
              <span className="m3-tonal-badge secondary">
                <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
                <span>Yürütülüyor...</span>
              </span>
              <span className="m3-tonal-badge m3-mono m3-tabular">
                <md-icon style={{ fontSize: '15px' }}>schedule</md-icon>
                <span>Geçen Süre: {formatTimer(elapsedSec)}</span>
              </span>
            </div>

            <h3 className="md-typescale-headline-small">{stage.title} Çözümleniyor</h3>
            <p className="dev-body-muted">
              Bu aşamanın müzikal çıkarım motoru şu anda aktif olarak çalışıyor. İşlem
              tamamlandığında bu alan otomatik olarak canlı tanı görünümüne geçecektir.
            </p>
          </div>

          <div className="dev-modal-track-meta" style={{ alignItems: 'flex-end', gap: '8px' }}>
            <span className="m3-tonal-badge secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>İşlem Sürüyor</span>
            </span>
            <code className="dev-code-pill is-output">{stage.output}</code>
          </div>
        </div>
        <md-linear-progress indeterminate={true}></md-linear-progress>
      </section>

      {/* 2. Sub-Step Progress Matrix */}
      <section className="dev-grid-4">
        {steps.map((st, idx) => (
          <div key={idx} className="m3-surface-card dev-substep-card">
            <md-elevation></md-elevation>
            <div className="dev-card-head-row" style={{ marginBottom: 0 }}>
              <span className="m3-mono m3-tabular" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                0{idx + 1} · Adım
              </span>
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
            </div>
            <h4 className="md-typescale-title-small">{st.title}</h4>
            <p className="dev-aside-copy">{st.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. Embedded Live Telemetry Stream */}
      <section className="m3-surface-card dev-section-block">
        <md-elevation></md-elevation>
        <div className="dev-section-header">
          <div className="dev-section-header-title">
            <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
              terminal
            </md-icon>
            <span>Aşama 0{stage.id} Anlık Telemetri Akışı</span>
            <span className="m3-tonal-badge sm primary m3-tabular">{logs.length} satır</span>
          </div>

          {onOpenConsole && (
            <md-text-button onClick={onOpenConsole}>
              <span>Konsol Görünümünü Aç</span>
              <md-icon slot="icon">arrow_forward</md-icon>
            </md-text-button>
          )}
        </div>

        <div ref={logContainerRef} className="dev-terminal-viewport is-compact">
          {logs.length === 0 ? (
            <div className="dev-io-flow" style={{ color: '#94A3B8', fontStyle: 'italic' }}>
              <md-circular-progress
                indeterminate={true}
                style={{ '--md-circular-progress-size': '16px', width: '16px', height: '16px' } as React.CSSProperties}
              ></md-circular-progress>
              <span>Yapay zeka motoru başlatılıyor, tensörler işleniyor...</span>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="dev-log-row">
                <span className="dev-log-ts m3-tabular">[{log.timestamp}]</span>
                <span className="dev-log-lvl">Aşama {stage.id}</span>
                <span className="dev-log-msg">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
```

## `production/developer/src/components/Inspector/StagePendingView.tsx`

```tsx
import React from 'react';
import { StageMetadata } from '../../types/workbench';

interface StagePendingViewProps {
  stage: StageMetadata;
  onRunStage?: () => void;
  missingDependency?: string | null;
}

export const StagePendingView: React.FC<StagePendingViewProps> = ({
  stage,
  onRunStage,
  missingDependency
}) => {
  return (
    <div className="dev-stack">
      {/* 1. Primary Pending Status Card */}
      <section className="m3-surface-card dev-status-banner">
        <md-elevation></md-elevation>
        <div className="dev-hero-copy">
          <div className="dev-hero-badges">
            <span className="m3-tonal-badge primary m3-tabular">Aşama 0{stage.id}</span>
            <span className="dev-aside-copy">Çalıştırılmayı Bekliyor</span>
          </div>

          <h3 className="md-typescale-headline-small">{stage.title} Henüz Çalıştırılmadı</h3>

          <p className="dev-body-muted">
            Bu oturumda ilgili aşama için henüz üretilmiş bir çözümleme verisi bulunmuyor. Tek
            başına yürütmek için <strong>Aşama 0{stage.id} Çalıştır</strong> düğmesini, tüm akışı
            başlatmak için üst çubuktaki <strong>Tümünü Çözümle</strong> düğmesini
            kullanabilirsiniz.
          </p>

          {missingDependency && (
            <div className="dev-missing-dep-row" style={{ borderRadius: '12px' }}>
              <div className="dev-io-flow">
                <md-icon style={{ fontSize: '18px' }}>warning</md-icon>
                <span>{missingDependency}</span>
              </div>
            </div>
          )}
        </div>

        <div className="dev-inspector-controls">
          <span className="m3-tonal-badge secondary">
            <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
            <span>Çalıştırma Bekleniyor</span>
          </span>

          {onRunStage && !missingDependency && (
            <md-filled-button onClick={onRunStage}>
              <md-icon slot="icon">play_arrow</md-icon>
              <span>Aşama 0{stage.id} Çalıştır</span>
            </md-filled-button>
          )}
        </div>
      </section>

      {/* 2. Stage Contract Specification (3 Cards) */}
      <section className="dev-grid-3">
        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">01 · Girdi Bağımlılığı</span>
          <code className="dev-code-pill">{stage.input}</code>
          <p className="dev-aside-copy">
            Çıkarım işlemi için gereken kaynak ses kanalı veya önceki aşama çıktıları.
          </p>
        </div>

        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">02 · Motor İşlemi</span>
          <strong className="md-typescale-title-small" style={{ color: 'var(--md-sys-color-primary)' }}>
            {stage.operation}
          </strong>
          <p className="dev-aside-copy">
            Zaman-frekans ayrıştırma, nota/vuruş tespiti veya harmonik analiz adımı.
          </p>
        </div>

        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">03 · Hedef Çıktı</span>
          <code className="dev-code-pill is-output">{stage.output}</code>
          <p className="dev-aside-copy">
            Kalıcı diske kaydedilen standartlaştırılmış JSON çözümleme çıktısı.
          </p>
        </div>
      </section>

      {/* 3. Diagnostic Guidance */}
      <section className="dev-guidance-banner">
        <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
          schedule
        </md-icon>
        <div className="dev-modal-track-meta">
          <span className="dev-aside-title">Aşama Teşhis Rehberi ve Doğrulama Odağı</span>
          <p className="dev-aside-copy">{stage.diagnosticFocus}</p>
        </div>
      </section>
    </div>
  );
};
```

## `production/developer/src/components/Inspector/stages/Stage1BeatView.tsx`

```tsx
import React, { useMemo, useState } from 'react';
import { Stage1BeatData } from '../../../types/stages';
import { MetricCard } from '../../ui/MetricCard';

interface Stage1BeatViewProps {
  data?: Stage1BeatData;
  currentTime?: number;
  onSeek?: (sec: number) => void;
}

interface BarData {
  barNumber: number;
  startTime: number;
  endTime: number;
  beats: Array<{
    beat_number: number;
    time_sec: number;
    is_downbeat: boolean;
  }>;
}

export const Stage1BeatView: React.FC<Stage1BeatViewProps> = ({
  data,
  currentTime = 0,
  onSeek
}) => {
  const tempo = data?.tempo_bpm || 0;
  const timeSig = data?.time_signature || '4/4';
  const beatCount = data?.beat_count || (data?.beats ? data.beats.length : 0);
  const downbeats = data?.downbeat_count || Math.floor(beatCount / 4);

  const [searchBar, setSearchBar] = useState<string>('');

  const bars: BarData[] = useMemo(() => {
    const rawBeats = data?.beats || [];
    if (!rawBeats.length) return [];

    const grouped: BarData[] = [];
    let currentBar: BarData | null = null;
    let barCounter = 1;

    for (let i = 0; i < rawBeats.length; i++) {
      const b = rawBeats[i];
      const isDown = b.is_downbeat || b.beat_number === 1;

      if (isDown || !currentBar) {
        if (currentBar) {
          currentBar.endTime = b.time_sec;
          grouped.push(currentBar);
        }
        currentBar = {
          barNumber: barCounter++,
          startTime: b.time_sec,
          endTime: b.time_sec + 2.0,
          beats: []
        };
      }

      currentBar.beats.push({
        beat_number: b.beat_number || currentBar.beats.length + 1,
        time_sec: b.time_sec,
        is_downbeat: Boolean(isDown)
      });
    }

    if (currentBar && currentBar.beats.length > 0) {
      currentBar.endTime = currentBar.startTime + 2.0;
      grouped.push(currentBar);
    }

    return grouped;
  }, [data?.beats]);

  const filteredBars = useMemo(() => {
    if (!searchBar.trim()) return bars;
    const q = searchBar.toLowerCase().replace(/ölçü|bar/gi, '').trim();
    const num = parseInt(q, 10);
    if (isNaN(num)) return bars;
    return bars.filter((b) => b.barNumber === num);
  }, [bars, searchBar]);

  const activeBarNumber = useMemo(() => {
    if (!bars.length || currentTime === undefined) return -1;
    const found = bars.find((b) => currentTime >= b.startTime && currentTime < b.endTime);
    return found ? found.barNumber : -1;
  }, [bars, currentTime]);

  return (
        <div className="dev-stack">
          <div className="dev-grid-4">
            <MetricCard
              label="Tespit Edilen Tempo"
              icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>speed</md-icon>}
              value={
                <>
                  {tempo} <span className="dev-aside-copy">BPM</span>
                </>
              }
            />
            <MetricCard
              label="Ölçü Birimi"
              icon={<md-icon style={{ color: 'var(--md-sys-color-tertiary)' }}>music_note</md-icon>}
              tone="tertiary"
              value={timeSig}
            />
            <MetricCard
              label="Vuruş Sayısı"
              icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>graphic_eq</md-icon>}
              value={beatCount}
            />
            <MetricCard
              label="Toplam Ölçü"
              icon={<md-icon style={{ color: 'var(--md-sys-color-secondary)' }}>schedule</md-icon>}
              tone="secondary"
              value={
                <>
                  {bars.length || downbeats} <span className="dev-aside-copy">Ölçü</span>
                </>
              }
            />
          </div>

                  <div className="m3-surface-card dev-section-block">
                    <md-elevation></md-elevation>

                    <div className="dev-section-header">
                      <div className="dev-section-header-title">
                        <md-icon style={{ color: 'var(--md-sys-color-tertiary)', fontSize: '18px' }}>
                          podcasts
                        </md-icon>
                        <span className="m3-tabular">
                          Şarkı Ölçü Zaman Çizelgesi · {bars.length} Ölçü · Atlamak İçin Tıklayın
                        </span>
                      </div>

                          <div className="dev-section-header-actions">
                            <div className="dev-search-pill">
                              <md-icon>search</md-icon>
                              <input
                                type="text"
                                placeholder="Ölçü # ara..."
                                value={searchBar}
                                onChange={(e) => setSearchBar(e.target.value)}
                                className="dev-search-input m3-tabular"
                              />
                            </div>
                            {searchBar && (
              <md-text-button onClick={() => setSearchBar('')}>Temizle</md-text-button>
                            )}
                          </div>
                        </div>

                          <div className="dev-timeline-list">
                            {filteredBars.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center' }} className="dev-aside-copy">
                                  {bars.length === 0
                                    ? 'Henüz metrik vuruş verisi bulunamadı. Vuruş ızgarasını oluşturmak için "Aşama 01 Çalıştır" düğmesine tıklayın.'
                                    : `"${searchBar}" aramasıyla eşleşen ölçü bulunamadı.`}
                                </div>
                                ) : (
            filteredBars.map((bar) => {
              const isActive = activeBarNumber === bar.barNumber;
                                return (
                                <div
                                  key={bar.barNumber}
                                  onClick={() => onSeek?.(bar.startTime)}
                                  className={`dev-beat-row ${isActive ? 'is-active' : ''}`}
                                  title={`Oynatmayı Ölçü ${bar.barNumber} (${bar.startTime.toFixed(3)} sn) noktasına atlat`}
                                >
                                        <div className="dev-beat-bar-info">
                                          <div className="dev-bar-circle m3-tabular">{bar.barNumber}</div>
                                          <div className="dev-modal-track-meta">
                                            <span className="m3-tabular" style={{ fontSize: '12.5px', fontWeight: 600 }}>
                                              Ölçü {bar.barNumber}{' '}
                                              {isActive && <span className="m3-status-dot secondary is-pulsing" />}
                                            </span>
                                              <span className="m3-tabular" style={{ fontSize: '11px', color: 'var(--md-sys-color-tertiary)', fontWeight: 600 }}>
                                                {bar.startTime.toFixed(3)} sn
                                              </span>
                                          </div>
                                        </div>

                                          <div className="dev-subbeat-grid m3-tabular">
                                            {bar.beats.map((b) => {
                                              const isSubBeatActive =
                                                currentTime >= b.time_sec && currentTime < b.time_sec + 0.5;
                                              const chipCls = [
                                                'dev-subbeat-chip',
                                                isSubBeatActive ? 'is-sub-active' : b.is_downbeat ? 'is-downbeat' : ''
                                              ]
                                                .filter(Boolean)
                                                .join(' ');

                                              return (
                                                <div
                                                  key={b.beat_number}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSeek?.(b.time_sec);
                                                  }}
                                                  className={chipCls}
                                                  title={`Vuruş ${bar.barNumber}.${b.beat_number} (${b.time_sec.toFixed(3)} sn) noktasına git`}
                                                >
                                                  <span>{b.is_downbeat ? `.${b.beat_number} (Baş)` : `.${b.beat_number}`}</span>
                                                  <span>{b.time_sec.toFixed(2)}s</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                        );
            })
          )}
                                    </div>
                                  </div>
                                </div>
                                );
};
```

## `production/developer/src/components/Inspector/stages/stage2/LeadSheetChordGrid.tsx`

```tsx
import React from 'react';
import { BarChordItem, ChordSectionItem } from '../../../../types/stages';

export interface SectionBarGroup {
  idx: number;
  section: ChordSectionItem;
  bars: BarChordItem[];
}

interface LeadSheetChordGridProps {
  totalBars: number;
  groups: SectionBarGroup[];
  activeSectionIdx: number;
  activeBarNumber: number;
  searchBar: string;
  onSearchBarChange: (val: string) => void;
  onSeek?: (sec: number) => void;
  safeSec: (val: unknown) => number;
}

export const LeadSheetChordGrid: React.FC<LeadSheetChordGridProps> = ({
  totalBars,
  groups,
  activeSectionIdx,
  activeBarNumber,
  searchBar,
  onSearchBarChange,
  onSeek,
  safeSec
}) => {
  return (
          <div className="m3-surface-card dev-section-block">
            <md-elevation></md-elevation>

            <div className="dev-section-header">
              <div className="dev-section-header-title">
                <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
                  grid_view
                </md-icon>
                <span>Ölçü Bazlı Akor Şeması (Lead Sheet Grid)</span>
                  <span className="dev-aside-copy m3-tabular">
                    · Toplam {totalBars} Ölçü · Standart Görünüm
                  </span>
              </div>

                  <div className="dev-section-header-actions">
                    <div className="dev-search-pill">
                      <md-icon>search</md-icon>
                      <input
                        type="text"
                        placeholder="Ölçü Ara (örn: 14)"
                        value={searchBar}
                        onChange={(e) => onSearchBarChange(e.target.value)}
                        className="dev-search-input m3-tabular"
                      />
                    </div>
                    {searchBar && (
            <md-text-button onClick={() => onSearchBarChange('')}>Temizle</md-text-button>
                    )}
                  </div>
                </div>

                  <div className="dev-chords-scroll">
                    {groups.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center' }} className="dev-aside-copy">
                          Arama kriterlerine uyan ölçü bulunamadı.
                        </div>
                        ) : (
          groups.map((group, gIdx) => {
            const sec = group.section;
                        const isGroupActive = activeSectionIdx === group.idx;
                        const secStart = safeSec(sec?.start_sec);
                        const secEnd = safeSec(sec?.end_sec);

                        return (
                              <div key={`${sec.name || 'grp'}-${gIdx}`} className="dev-stack" style={{ gap: '12px' }}>
                                <div className="dev-chord-group-header">
                                  <div className="dev-io-flow">
                                    <span
                                      className={`m3-status-dot ${isGroupActive ? 'is-pulsing' : 'neutral'}`}
                                      aria-hidden="true"
                                    />
                                      <span className="md-typescale-title-small">{sec.name || 'Bölüm'}</span>
                                      <span className="dev-aside-copy m3-tabular">
                                        (Ölçü {sec.start_bar || 1}–{sec.end_bar || 1} · {secStart.toFixed(1)}s–
                                        {secEnd.toFixed(1)}s)
                                      </span>
                                  </div>

                                    <md-text-button onClick={() => onSeek?.(secStart)}>
                                      <md-icon slot="icon">play_arrow</md-icon>
                                      <span>Bu Bölümü Çal</span>
                                </md-text-button>
                              </div>

                                <div className="dev-chord-bar-grid">
                                  {group.bars.map((bar) => {
                                    const isActive = activeBarNumber === bar.bar_number;
                                    const bStart = safeSec(bar.start_sec);
                                    const bDur = safeSec(bar.duration_sec);

                                    return (
                                      <button
                                        type="button"
                                        key={bar.bar_number}
                                        onClick={() => onSeek?.(bStart)}
                                        className={`dev-chord-bar-card ${isActive ? 'is-active' : ''}`}
                                        title={`Ölçü ${bar.bar_number}: ${bar.chord} (${bStart.toFixed(2)} sn) noktasına atlat`}
                                      >
                                            <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '11px', opacity: 0.85 }}>
                                              <span className="dev-io-flow">
                                                {isActive && <span className="m3-status-dot is-pulsing" aria-hidden="true" />}
                                                <strong>Ölçü {bar.bar_number}</strong>
                                              </span>
                                              <span>{bStart.toFixed(1)}s</span>
                                            </div>

                                              <div className="dev-benchmark-top">
                                                <span className="dev-chord-symbol">{bar.chord}</span>
                                                {bar.chords && bar.chords.length > 1 && (
                            <span className="dev-aside-copy" style={{ fontWeight: 600 }}>
                              {bar.chords.map((c) => c.chord).join(' / ')}
                            </span>
                                                )}
                                              </div>

                                                <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '10.5px', opacity: 0.78, paddingTop: '4px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                                                  <span>{bDur.toFixed(2)} sn</span>
                                                  <md-icon style={{ fontSize: '14px' }}>play_arrow</md-icon>
                                                </div>
                                              </button>
                                              );
                  })}
                                            </div>
                                        </div>
                                        );
          })
        )}
                                      </div>
    </div>
                                );
};
```

## `production/developer/src/components/Inspector/stages/stage2/SectionFormGrid.tsx`

```tsx
import React from 'react';
import { ChordSectionItem } from '../../../../types/stages';
import { SECTION_TONE_MAP } from '../../../../constants/instruments';

interface SectionFormGridProps {
  sections: ChordSectionItem[];
  activeSectionIdx: number;
  selectedSectionFilter: number | 'all';
  onSelectSection: (idx: number | 'all', startSec?: number) => void;
  safeSec: (val: unknown) => number;
}

export const SectionFormGrid: React.FC<SectionFormGridProps> = ({
  sections,
  activeSectionIdx,
  selectedSectionFilter,
  onSelectSection,
  safeSec
}) => {
  return (
          <div className="m3-surface-card dev-section-block">
            <md-elevation></md-elevation>

            <div className="dev-section-header">
              <div className="dev-section-header-title">
                <md-icon style={{ color: 'var(--md-sys-color-secondary)', fontSize: '18px' }}>
                  bookmark
                </md-icon>
                <span>Şarkı Formu ve Bölümleme (allin1 MSA)</span>
                <span className="dev-aside-copy">· Tıklayarak oynatıcıyı bölüme atlatın</span>
              </div>

                <div className="dev-section-header-actions">
                  {selectedSectionFilter !== 'all' && (
                      <md-text-button onClick={() => onSelectSection('all')}>
                        Filtreyi Sıfırla (Tümü)
            </md-text-button>
          )}
                  <span className="m3-tonal-badge sm secondary m3-tabular">
                    {sections.length} Bölüm Tespit Edildi
                  </span>
              </div>
            </div>

              <div className="dev-section-grid">
                {sections.map((sec, idx) => {
                  const secStart = safeSec(sec.start_sec);
                  const secEnd = safeSec(sec.end_sec);
                  const dur = Math.max(0, secEnd - secStart).toFixed(1);
                  const isActive = idx === activeSectionIdx;
                  const isFilterSelected = selectedSectionFilter === idx;
                  const tone = (sec.raw_label && SECTION_TONE_MAP[sec.raw_label]) || 'neutral';

                  const tileClass = [
                    'dev-section-tile',
                    tone !== 'neutral' ? `tone-${tone}` : '',
                    isActive ? 'is-active' : '',
                    isFilterSelected ? 'is-filtered' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      type="button"
                      key={`${sec.name || 'section'}-${idx}`}
                      onClick={() => onSelectSection(idx, secStart)}
                      className={tileClass}
                      title={`Oynatmayı ${sec.name || 'Bölüm'} (${secStart.toFixed(1)} sn · Ölçü ${sec.start_bar || 1}) noktasına atlat ve filtrele`}
                    >
                          <div className="dev-benchmark-top">
                            <span className="dev-benchmark-name-wrap" style={{ fontSize: '12.5px', fontWeight: 600 }}>
                              {isActive ? (
                    <span className="m3-status-dot is-pulsing" aria-hidden="true" />
                              ) : (
                    <md-icon style={{ fontSize: '16px' }}>play_arrow</md-icon>
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sec.name || `Bölüm ${idx + 1}`}
                              </span>
                            </span>
                              <span className={`m3-tonal-badge sm m3-tabular ${isActive ? 'primary' : isFilterSelected ? 'secondary' : ''}`}>
                                Ölçü {sec.start_bar || 1}–{sec.end_bar || 1}
                              </span>
                          </div>

                              <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '11.5px', opacity: 0.85 }}>
                                <span>
                                  {secStart.toFixed(1)}s – {secEnd.toFixed(1)}s
                                </span>
                                <span>({dur} sn)</span>
                              </div>
                            </button>
                            );
        })}
                          </div>
                      </div>
                      );
};
```

## `production/developer/src/components/Inspector/stages/Stage2ChordView.tsx`

```tsx
import React, { useMemo, useState } from 'react';
import { BarChordItem, ChordSectionItem, Stage2ChordData } from '../../../types/stages';
import { MetricCard } from '../../ui/MetricCard';
import { SectionFormGrid } from './stage2/SectionFormGrid';
import { LeadSheetChordGrid, SectionBarGroup } from './stage2/LeadSheetChordGrid';

interface Stage2ChordViewProps {
  data?: Stage2ChordData;
  currentTime?: number;
  onSeek?: (sec: number) => void;
}

function safeSec(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const p = parseFloat(val);
    if (!isNaN(p)) return p;
  }
  return 0;
}

export const Stage2ChordView: React.FC<Stage2ChordViewProps> = ({
  data,
  currentTime = 0,
  onSeek
}) => {
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<number | 'all'>('all');
  const [searchBar, setSearchBar] = useState<string>('');

  const chordCount = data?.chord_count || (data?.chords ? data.chords.length : 0);

  const primaryProgression =
    data?.primary_progression ||
    (Array.isArray(data?.bars) && data.bars.length > 0
        ? Array.from(new Set(data.bars.map((b) => b.chord).filter((c) => c !== 'N.C.')))
          .slice(0, 8)
          .join(' → ')
        : 'Yok');

  const sections: ChordSectionItem[] = useMemo(() => {
    return data?.sections && data.sections.length > 0 ? data.sections : [];
  }, [data?.sections]);

  const bars: BarChordItem[] = useMemo(() => {
    if (Array.isArray(data?.bars) && data.bars.length > 0) {
      return data.bars;
    }
    const raw = data?.chords || [];
    return raw.map((c, i) => {
      const sStart = safeSec(c.start_sec);
      const sEnd = safeSec(c.end_sec);
      const formatted = (c.chord || 'N').replace(':min', 'm').replace(':maj', '');
      return {
        bar_number: i + 1,
        start_sec: sStart,
        end_sec: sEnd,
        duration_sec: Math.max(0, sEnd - sStart),
        chord: formatted,
        chord_raw: c.chord || 'N',
        chords: [
          {
            chord: formatted,
            chord_raw: c.chord || 'N',
            start_sec: sStart,
            end_sec: sEnd,
            duration_sec: Math.max(0, sEnd - sStart)
          }
        ]
      };
    });
  }, [data?.bars, data?.chords]);

  const activeSectionIdx = useMemo(() => {
    if (!sections.length) return -1;
    return sections.findIndex(
      (sec) => currentTime >= safeSec(sec?.start_sec) && currentTime < safeSec(sec?.end_sec)
    );
  }, [sections, currentTime]);

  const activeBarNumber = useMemo(() => {
    if (!bars.length) return -1;
    const found = bars.find(
      (b) => currentTime >= safeSec(b?.start_sec) && currentTime < safeSec(b?.end_sec)
    );
    return found ? found.bar_number : -1;
  }, [bars, currentTime]);

  const sectionGroups: SectionBarGroup[] = useMemo(() => {
    if (!sections.length || !bars.length) {
      const firstBar = bars[0];
      const lastBar = bars[bars.length - 1];
      return [
        {
          idx: 0,
          section: {
            name: 'Tüm Şarkı',
            start_bar: 1,
            end_bar: Math.max(1, bars.length),
            start_sec: firstBar ? safeSec(firstBar.start_sec) : 0.0,
            end_sec: lastBar ? safeSec(lastBar.end_sec) : 0.0
          },
          bars
        }
      ];
    }

    return sections.map((sec, idx) => {
      const sStartBar = Number(sec?.start_bar ?? 1);
      const sEndBar = Number(sec?.end_bar ?? 1);
      return {
        idx,
        section: sec,
        bars: bars.filter((b) => b.bar_number >= sStartBar && b.bar_number <= sEndBar)
      };
    });
  }, [sections, bars]);

  const filteredSectionGroups = useMemo(() => {
    let groups = sectionGroups;
    if (selectedSectionFilter !== 'all') {
      groups = groups.filter((g) => g.idx === selectedSectionFilter);
    }
    if (searchBar.trim()) {
      const q = parseInt(searchBar.trim(), 10);
      if (!isNaN(q)) {
        groups = groups
          .map((g) => ({
            ...g,
            bars: g.bars.filter((b) => b.bar_number === q)
          }))
          .filter((g) => g.bars.length > 0);
      }
    }
    return groups;
  }, [sectionGroups, selectedSectionFilter, searchBar]);

  const handleSelectSection = (idx: number | 'all', startSec?: number) => {
    if (idx !== 'all' && typeof startSec === 'number') {
      onSeek?.(startSec);
    }
    setSelectedSectionFilter(idx);
  };

  return (
        <div className="dev-stack">
          <div className="dev-grid-4">
            <MetricCard
              label="Şarkı Tonu (Key)"
              tone="primary"
              value={data?.key_signature || 'C major'}
              subtitle="Krumhansl-Schmuckler Armonik Ton Analizi"
            />
            <MetricCard
              label="Metrik Ölçü Kapsamı"
              value={
                <>
                  {bars.length} <span className="dev-aside-copy">Ölçü (Bar)</span>
                </>
              }
              subtitle={
            <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
              Aşama 01 Vuruş Izgarası ile Senkronize
            </span>
              }
            />
            <MetricCard
              label="Armonik Değişim Olayları"
              tone="secondary"
              value={
                <>
                  {chordCount} <span className="dev-aside-copy">Akor (BTC)</span>
                </>
              }
              subtitle="Majority Voting ile Barlara Kuantize Edildi"
            />
            <MetricCard
              label="Baskın Akor Yürüyüşü"
              tone="tertiary"
              compactValue={true}
              value={<span title={primaryProgression}>{primaryProgression}</span>}
              subtitle="Şarkı Boyunca Ana Armonik Dizi"
            />
          </div>

          {sections.length > 0 && (
            <SectionFormGrid
              sections={sections}
              activeSectionIdx={activeSectionIdx}
              selectedSectionFilter={selectedSectionFilter}
              onSelectSection={handleSelectSection}
              safeSec={safeSec}
            />
          )}

          <LeadSheetChordGrid
            totalBars={bars.length}
            groups={filteredSectionGroups}
            activeSectionIdx={activeSectionIdx}
            activeBarNumber={activeBarNumber}
            searchBar={searchBar}
            onSearchBarChange={setSearchBar}
            onSeek={onSeek}
            safeSec={safeSec}
          />
        </div>
        );
};
```

## `production/developer/src/components/Inspector/stages/Stage3MixerView.tsx`

```tsx
import React from 'react';
import { StemChannel } from '../../../types/workbench';
import { Stage3MssData } from '../../../types/stages';
import { STEM_CHANNEL_ORDER, resolveInstrumentMeta } from '../../../constants/instruments';
import { MetricCard } from '../../ui/MetricCard';
import { MixerIcon, StemChannelIcon } from '../../icons';

interface Stage3MixerViewProps {
  channels?: StemChannel[];
  data?: Stage3MssData;
}

export const Stage3MixerView: React.FC<Stage3MixerViewProps> = ({ data }) => {
  const stemsData = data?.stems || {};
  const channelKeys =
    data?.channel_order && data.channel_order.length > 0
      ? data.channel_order
      : Object.keys(stemsData).length > 0
      ? Object.keys(stemsData)
      : STEM_CHANNEL_ORDER;
  const totalCount = channelKeys.length;
  const detectedCount =
    data?.detected_count ??
    Object.values(stemsData).filter((s) => s.detected !== false).length;
  const absentCount = Math.max(0, totalCount - (detectedCount || totalCount));
  const guitarSdr = data?.diagnostics?.guitar_sdr_db;
  const guitarIsolation = stemsData['guitar']?.isolation_confidence_pct;

  return (
      <div className="dev-stack">
        {/* 1. Studio Status & Navigation Banner */}
                <section className="m3-surface-card dev-status-banner">
                  <md-elevation></md-elevation>
                  <div className="dev-hero-copy">
                    <div className="dev-hero-badges">
                      <span className="m3-tonal-badge sm success">
                        BS-RoFormer-SW · {((data?.sampling_rate_hz || 44100) / 1000).toFixed(1)} kHz Hi-Fi
                      </span>
                      <span className="dev-aside-copy">Kalıcı Disk Oturumu</span>
                    </div>
                      <h3 className="md-typescale-title-large">
                        Akustik Kaynak Ayrıştırması & Varlık Tespiti
                      </h3>
                        <p className="dev-body-muted">
                          Yapay zeka ses motoru kanalları bağımsız olarak analiz etti. Parçada gerçek sinyali
                          bulunan enstrümanlar miksere aktarılırken, ses bulunmayan kanallar otomatik olarak devre
                          dışı bırakıldı.
                        </p>
                      </div>

                        <span className="m3-tonal-badge primary" style={{ height: 'auto', padding: '10px 14px', borderRadius: '14px' }}>
                          <MixerIcon size={18} />
                          <span>
                            Aktif kanalları mikslemek için alt oynatıcıdaki <strong>Mikser</strong>&apos;i açın
                          </span>
                    </span>
                </section>

                {/* 2. Telemetry Quick Stats Cards */}
                  <section className="dev-grid-4">
                    <MetricCard
                      label="Tespit Edilen Enstrümanlar"
                      icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>podcasts</md-icon>}
                      compactValue={true}
                      value={`${detectedCount} Aktif Kanal`}
                      subtitle={
            absentCount > 0 ? `${absentCount} kanalda ses bulunmadı` : 'Tüm enstrümanlar mevcut'
          }
        />
                      <MetricCard
                        label="Depolama Modu"
                        icon={<md-icon style={{ color: 'var(--md-sys-color-secondary)' }}>storage</md-icon>}
                        compactValue={true}
                        value="Kalıcı Disk"
                        subtitle="Kalıcı WAV Depolama"
                      />
                      <MetricCard
                        label="Gitar SDR Kazancı"
                        icon={<md-icon style={{ color: 'var(--md-sys-color-tertiary)' }}>developer_board</md-icon>}
                        tone="primary"
                        compactValue={true}
                        value={guitarSdr !== undefined ? `+${guitarSdr} dB SDR` : 'Hesaplandı'}
                        subtitle={
            guitarIsolation !== undefined ? `%${guitarIsolation} İzolasyon Skoru` : 'İzole Edildi'
          }
        />
                      <MetricCard
                        label="Sinyal Hazırlığı"
                        icon={<md-icon style={{ color: 'var(--dev-color-success)' }}>verified</md-icon>}
                        compactValue={true}
                        value={
                          data?.diagnostics?.amt_readiness === 'no_guitar_signal'
                            ? 'Sinyal Zayıf'
                            : 'Kullanıma Hazır'
                        }
                        subtitle="Temiz Transient Hattı"
                      />
                  </section>

                    {/* 3. Isolated Channel Cards Grid */}
                    <section className="dev-grid-3">
                      {channelKeys.map((key) => {
                        const stem = stemsData[key];
                        const categoryKey = stem?.category || key;
                        const meta = resolveInstrumentMeta(categoryKey);
                        const isDetected =
                          stem?.detected ??
                          (stem?.rms_dbfs !== undefined
                            ? stem.rms_dbfs > -48 && (stem.peak_dbfs ?? -60) > -40
                            : true);
                        const label = meta.label;
                        const role = stem?.role || meta.role;
                        const rms = stem?.rms_dbfs;
                        const peak = stem?.peak_dbfs;
                        const bufferMb = stem?.buffer_size_mb;
                        const isolation = stem?.isolation_confidence_pct;

                        return (
                          <div
                            key={key}
                            className={`m3-surface-card dev-stem-card ${!isDetected ? 'is-muted-stem' : ''}`}
                          >
                                  <md-elevation></md-elevation>

                                  <div className="dev-benchmark-top">
                                    <div className="dev-benchmark-name-wrap">
                                      <div className="dev-stem-icon-box">
                                        {isDetected ? (
                      <StemChannelIcon channelId={key} category={categoryKey} size={18} />
                                        ) : (
                      <md-icon style={{ color: 'var(--md-sys-color-outline)', fontSize: '18px' }}>
                        volume_off
                      </md-icon>
                                        )}
                                      </div>
                                        <div className="dev-modal-track-meta">
                                          <span className="dev-benchmark-name">{label}</span>
                                          <span className="dev-aside-copy" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {role}
                                          </span>
                                        </div>
                                      </div>

                                        <span className={`m3-tonal-badge sm ${isDetected ? 'success' : ''}`}>
                                          {isDetected ? '● Aktif Sinyal' : '○ Ses Bulunmadı'}
                                        </span>
                                    </div>

                                          <div className="dev-stem-metrics-box m3-tabular">
                                            <div className="dev-modal-track-meta">
                                              <span className="dev-aside-copy">RMS Enerji</span>
                                              <strong>
                                                {rms !== undefined ? (isDetected ? `${rms} dBFS` : `${rms} dBFS (Sessiz)`) : '-'}
                                            </strong>
                                          </div>
                                            <div className="dev-modal-track-meta">
                                              <span className="dev-aside-copy">Tepe (Peak)</span>
                                              <strong>{peak !== undefined ? `${peak} dBFS` : '-'}</strong>
                                            </div>
                                              <div className="dev-modal-track-meta">
                                                <span className="dev-aside-copy">Dosya Boyutu</span>
                                                <strong>{bufferMb !== undefined ? `${bufferMb} MB` : '-'}</strong>
                                              </div>
                                                  <div className="dev-modal-track-meta">
                                                    <span className="dev-aside-copy">İzolasyon Skoru</span>
                                                    <strong style={{ color: isDetected ? 'var(--dev-color-success)' : undefined }}>
                                                      {isDetected ? (isolation !== undefined ? `%${isolation}` : '-') : 'Sinyal Yok'}
                                                  </strong>
                                              </div>
                                            </div>

                                              <div className="dev-stem-footer">
                                                {isDetected ? (
                                                  <>
                                                      <code className="m3-mono dev-stage-op">/api/workbench/stream/{key}</code>
                                                      <span className="dev-io-flow" style={{ color: 'var(--dev-color-success)', fontWeight: 600 }}>
                                                        <md-icon style={{ fontSize: '15px' }}>check_circle</md-icon>
                                                        <span>Mikserde</span>
                                                      </span>
                                                    </>
                                                    ) : (
                                                    <>
                                                        <span className="dev-io-flow dev-aside-copy">
                                                          <md-icon style={{ fontSize: '15px' }}>volume_off</md-icon>
                                                          <span>Parçada Sinyal Yok</span>
                                                        </span>
                                                        <span className="dev-aside-copy">Çıkarıldı</span>
                                                      </>
                )}
                                                    </div>
                                                  </div>
                                                );
        })}
                                              </section>

                                                  <section className="m3-surface-card dev-ingest-card" style={{ gap: '10px' }}>
                                                    <md-elevation></md-elevation>
                                                    <div className="dev-section-header-title">
                                                      <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
                                                        verified_user
                                                      </md-icon>
                                                      <span>Akustik Sızma (Bleed) ve İzolasyon Doğrulama Raporu</span>
                                                    </div>
                                                      <p className="dev-body-muted">
                                                        BS-RoFormer-SW modeli, sinyalsiz kanalları otomatik algılayarak{' '}
                                                        <strong>-48 dBFS eşiği altında</strong> kalan enstrümanları mikser konsoluna dahil etmez.
                                                        Bu filtreleme sayesinde yalnızca parçada gerçekten çalan enstrümanlar mikslenir.
                                                      </p>
                                                  </section>
                                                </div>
                                                );
};
```

## `production/developer/src/components/Inspector/stages/Stage4LyricsView.tsx`

```tsx
import React, { useMemo } from 'react';
import { Stage4LyricsData } from '../../../types/stages';
import { MetricCard } from '../../ui/MetricCard';

interface Stage4LyricsViewProps {
  data?: Stage4LyricsData;
  currentTime?: number;
  onSeek?: (sec: number) => void;
}

function fmtSec(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(2).padStart(5, '0');
  return `${m}:${s}`;
}

export const Stage4LyricsView: React.FC<Stage4LyricsViewProps> = ({
  data,
  currentTime = 0,
  onSeek
}) => {
  const lines = useMemo(() => data?.lines || [], [data?.lines]);

  const activeLineIdx = useMemo(() => {
    return lines.findIndex(
      (ln) => currentTime >= ln.start_sec && currentTime <= ln.end_sec
    );
  }, [lines, currentTime]);

  const langLabel = data?.detected_language ? data.detected_language.toUpperCase() : 'OTO / YOK';

  return (
    <div className="dev-stack">
      <div className="dev-grid-4">
        <MetricCard
          label="Algılanan Dil"
          tone="primary"
          value={langLabel}
          subtitle={data?.transcription_engine || 'stable-ts ASR'}
        />
        <MetricCard
          label="Karaoke Satırı"
          value={data?.line_count ?? lines.length}
          subtitle="Doğal Nefes & Duraklama Bölgeleri"
        />
        <MetricCard
          label="Kelime Zaman Damgası"
          tone="secondary"
          value={data?.word_count ?? 0}
          subtitle={`Vokal Seviyesi: ${data?.vocal_rms_dbfs ?? '-'} dBFS`}
        />
        <MetricCard
          label="Hizalama Motoru"
          tone="tertiary"
          compactValue={true}
          value={data?.alignment_engine || 'MMS_FA CTC'}
          subtitle={`Çıkarım Süresi: ${data?.inference_sec ?? 0} sn`}
        />
      </div>

      <div className="dev-card">
        <div className="dev-card-header">
          <div>
            <div className="dev-card-title">Zaman Hizalı Şarkı Sözü Akışı (Kelime Bazlı CTC)</div>
            <div className="dev-card-sub">
              Herhangi bir satıra veya kelimeye tıklayarak oynatıcıyı milisaniye hassasiyetinde o ana sarabilirsiniz.
            </div>
          </div>
          <span className="dev-badge">{lines.length} Satır</span>
        </div>

        {lines.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--md-sys-color-on-surface-variant)' }}>
            Bu parçada vokal sözü tespit edilmedi (Enstrümantal parça olabilir).
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '460px', overflowY: 'auto' }}>
            {lines.map((line, idx) => {
              const isCurrent = idx === activeLineIdx;
              return (
                <div
                  key={`${line.start_sec}-${idx}`}
                  onClick={() => onSeek?.(line.start_sec)}
                  role="button"
                  tabIndex={0}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    backgroundColor: isCurrent
                      ? 'var(--md-sys-color-primary-container)'
                      : 'var(--md-sys-color-surface-container)',
                    border: isCurrent
                      ? '1px solid var(--md-sys-color-primary)'
                      : '1px solid var(--md-sys-color-outline-variant)',
                    transition: 'background-color 120ms ease'
                  }}
                >
                  <span
                    className="dev-mono"
                    style={{
                      fontSize: '12px',
                      color: isCurrent ? 'var(--md-sys-color-on-primary-container)' : 'var(--md-sys-color-on-surface-variant)',
                      minWidth: '108px',
                      paddingTop: '2px'
                    }}
                  >
                    {fmtSec(line.start_sec)} - {fmtSec(line.end_sec)}
                  </span>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 }}>
                    {line.words && line.words.length > 0 ? (
                      line.words.map((w, wIdx) => {
                        const isWordActive = currentTime >= w.start_sec && currentTime <= w.end_sec;
                        return (
                          <span
                            key={`${wIdx}-${w.start_sec}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSeek?.(w.start_sec);
                            }}
                            title={`${fmtSec(w.start_sec)} -> ${fmtSec(w.end_sec)}`}
                            style={{
                              padding: '1px 4px',
                              borderRadius: '6px',
                              backgroundColor: isWordActive ? 'var(--md-sys-color-primary)' : 'transparent',
                              color: isWordActive
                                ? 'var(--md-sys-color-on-primary)'
                                : isCurrent
                                ? 'var(--md-sys-color-on-primary-container)'
                                : 'var(--md-sys-color-on-surface)',
                              fontWeight: isWordActive ? 700 : 500
                            }}
                          >
                            {w.word}
                          </span>
                        );
                      })
                    ) : (
                      <span>{line.text}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
```

## `production/developer/src/components/MasterAudioPlayer.tsx`

```tsx
import React, { useState } from 'react';
import { StemChannel } from '../types/workbench';
import { StemMixerPopover } from './AudioPlayer/StemMixerPopover';
import { WaveformScrubber } from './AudioPlayer/WaveformScrubber';
import { MixerIcon } from './icons';

interface MasterAudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  trackName?: string | null;
  isStage3Completed?: boolean;
  stemChannels?: StemChannel[];
  onToggleSolo?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onSetVolume?: (id: string, vol: number) => void;
  onResetStems?: () => void;
}

function formatTime(sec: number): string {
  const mins = Math.floor(sec / 60);
  const secs = (sec % 60).toFixed(1);
  return `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
}

export const MasterAudioPlayer: React.FC<MasterAudioPlayerProps> = ({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  trackName,
  isStage3Completed = false,
  stemChannels = [],
  onToggleSolo,
  onToggleMute,
  onSetVolume,
  onResetStems
}) => {
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  const displayName = (trackName || 'Oturum Sesi (Hafıza)').replace(
    /\s*\(\d+(\.\d+)?\s*BPM\)/i,
    ''
  );
  const activeChannels = stemChannels.filter((c) => c.detected !== false);
  const hasActiveSoloOrMute = activeChannels.some((c) => c.isSolo || c.isMuted);

  return (
      <div className="m3-footer-dock-outer">
        <div className="m3-footer-dock-inner">
          {isMixerOpen && isStage3Completed && (
            <StemMixerPopover
              channels={activeChannels}
              onClose={() => setIsMixerOpen(false)}
              onToggleSolo={onToggleSolo}
              onToggleMute={onToggleMute}
              onSetVolume={onSetVolume}
              onResetStems={onResetStems}
            />
          )}

              <footer aria-label="Ana Ses Oynatıcısı" className="m3-footer-bar">
                <md-elevation></md-elevation>

                        < div className="m3-player-track-meta">
                    <md-filled-icon-button
                      onClick={onTogglePlay}
                      aria-label={isPlaying ? 'Sesi duraklat' : 'Sesi oynat'}
                      title={isPlaying ? 'Sesi duraklat' : 'Sesi oynat'}
                    >
                      <md-icon>{isPlaying ? 'pause' : 'play_arrow'}</md-icon>
                    </md-filled-icon-button>

                    <div className="m3-player-titles">
                      <span className="m3-player-title" title={displayName}>
                        {displayName}
                      </span>
                      <span className="m3-player-sub">
                        {isStage3Completed
                          ? 'Kanallar Ayrıştırıldı · Mikser Aktif'
                          : 'Ana Ses · 44.1 kHz Stereo'}
                  </span>
                </div>
            </div>

        <span className="m3-tabular md-typescale-label-medium" style={{ color: 'var(--md-sys-color-primary)' }}>
          {formatTime(currentTime)}
        </span>

        <WaveformScrubber currentTime={currentTime} duration={duration} onSeek={onSeek} />

        <span className="m3-tabular md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {formatTime(duration)}
        </span>

      {isStage3Completed ? (
        <md-filled-tonal-button
          data-role="mixer-btn"
          data-active={isMixerOpen || hasActiveSoloOrMute ? 'true' : 'false'}
          onClick={() => setIsMixerOpen((prev) => !prev)}
          title="Stüdyo Mikserini Aç / Kapat"
        >
          <md-icon slot="icon">
            <MixerIcon size={18} />
          </md-icon>
          <span>Mikser</span>
        </md-filled-tonal-button>
      ) : (
        <span className="m3-tonal-badge success">
          <span className="m3-status-dot success is-pulsing" aria-hidden="true" />
          <span>Disk Aktif</span>
        </span>
      )}
    </footer>
      </div >
    </div >
  );
};
```

## `production/developer/src/components/PipelineRail.tsx`

```tsx
import React from 'react';
import { StageMetadata } from '../types/workbench';
import { formatStageDuration } from '../constants/stages';

interface PipelineRailProps {
  stages: StageMetadata[];
  selectedStageId: number;
  onSelectStage: (id: number) => void;
  runningStage: number | null;
}

export const PipelineRail: React.FC<PipelineRailProps> = ({
  stages,
  selectedStageId,
  onSelectStage,
  runningStage
}) => {
    const renderStatusChip = (status: string, isRunning: boolean) => {
      if (isRunning || status === 'running') {
        return (
            <span className="m3-tonal-badge sm secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>Çalışıyor</span>
            </span>
            );
    }
            if (status === 'completed') {
      return (
              <span className="m3-tonal-badge sm success">
                <md-icon style={{ fontSize: '14px' }}>check_circle</md-icon>
                <span>Tamam</span>
              </span>
              );
    }
              if (status === 'error') {
      return (
                <span className="m3-tonal-badge sm error">
                  <md-icon style={{ fontSize: '14px' }}>error</md-icon>
                  <span>Hata</span>
                </span>
                );
    }
                return <span className="m3-tonal-badge sm">Bekliyor</span>;
  };

                return (
                    <nav aria-label="Çözümleme Akışı">
                      <div className="dev-rail-header">
                        <h2 className="md-typescale-title-small">Çözümleme Aşamaları</h2>
                        <span className="m3-tonal-badge sm m3-tabular">{stages.length} Aşama</span>
                      </div>

                        <div className="dev-rail-list">
                          {stages.map((stage) => {
                            const isSelected = selectedStageId === stage.id;
                            const isRunning = runningStage === stage.id;
                            const isCompleted = stage.status === 'completed';

                            const itemClass = [
                              'dev-stage-item',
                              isSelected ? 'is-selected' : '',
                              isCompleted ? 'is-completed' : ''
                            ]
                              .filter(Boolean)
                              .join(' ');

                            return (
                              <button
                                key={stage.id}
                                type="button"
                                onClick={() => onSelectStage(stage.id)}
                                className={itemClass}
                              >
                                      <div className="dev-stage-item-top">
                                        <div className="dev-stage-item-title-wrap">
                                          <span className="dev-stage-num m3-tabular">0{stage.id}</span>
                                          <span className="dev-stage-title" title={stage.title}>
                                            {stage.title}
                                          </span>
                                        </div>

                                          <div className="dev-stage-chips">
                                            {renderStatusChip(stage.status, isRunning)}
                                          </div>
                                        </div>

                                            <div className="dev-stage-sub">
                                              <span
                                                className="dev-stage-op"
                                                title={stage.operation}
                                              >
                                                {stage.operation}
                                              </span>

                                              {stage.durationMs > 0 && (
                  <span className="m3-tabular">{formatStageDuration(stage.durationMs)}</span>
                                              )}
                                            </div>
                                          </button>
                                          );
        })}
                                        </div>
                                      </nav>
                                      );
};
```

## `production/developer/src/components/SessionSwitcher.tsx`

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { TelemetrySessionSummary } from '../types/workbench';

interface SessionSwitcherProps {
  activeSessionId: string;
  sessions: TelemetrySessionSummary[];
  onSelectSession: (sessionId: string) => void;
  onRefresh: () => void;
}

function formatRelativeTime(iso?: string | null): string {
  if (!iso) return '—';
  try {
    const ms = Date.now() - new Date(iso).getTime();
    if (!Number.isFinite(ms) || ms < 0) return 'az önce';
    const sec = Math.floor(ms / 1000);
    if (sec < 60) return `${sec}sn önce`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}dk önce`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}sa önce`;
    return `${Math.floor(hr / 24)}g önce`;
  } catch {
    return '—';
  }
}

function getUserLabel(s: TelemetrySessionSummary): { label: string; isDev: boolean } {
  if (s.user?.username) {
    return {
      label: s.user.username,
      isDev: s.user.role === 'developer'
    };
  }
  return {
    label: s.session_id === 'default' ? 'Varsayılan' : 'Misafir',
    isDev: false
  };
}

export const SessionSwitcher: React.FC<SessionSwitcherProps> = ({
  activeSessionId,
  sessions,
  onSelectSession,
  onRefresh
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const activeSummary = sessions.find((s) => s.session_id === activeSessionId);
  const activeCount = sessions.filter((s) => s.has_session).length;
  const activeUser = activeSummary ? getUserLabel(activeSummary) : null;

  return (
    <div ref={rootRef} className="dev-session-switcher">
      <button
        type="button"
        onClick={() => {
          onRefresh();
          setOpen((prev) => !prev);
        }}
        className={`dev-session-trigger ${open ? 'is-open' : ''}`}
        title="Web Studio ve Developer oturumları arasında geçiş yap"
      >
        <span
          className={`m3-status-dot ${
            activeSummary?.is_running ? 'secondary is-pulsing' : activeSummary?.has_session ? 'success' : 'neutral'
          }`}
          aria-hidden="true"
        />
        <span className="dev-session-trigger-label">
          <span className="m3-mono" style={{ fontWeight: 700, fontSize: '11px' }}>
            {activeSessionId === 'default' ? 'default' : activeSessionId.slice(0, 12)}
          </span>
          {activeUser && (
            <span className={`m3-tonal-badge sm ${activeUser.isDev ? 'secondary' : ''}`}>
              {activeUser.isDev ? 'DEV' : activeUser.label}
            </span>
          )}
          <span className="m3-tonal-badge sm primary m3-tabular">{activeCount} oturum</span>
        </span>
        <md-icon style={{ fontSize: '16px' }}>{open ? 'expand_less' : 'expand_more'}</md-icon>
      </button>

      {open && (
        <div className="dev-session-dropdown" role="menu" aria-label="Aktif Oturumlar">
          <div className="dev-session-dropdown-head">
            <span>İzlenen Oturumlar ({sessions.length})</span>
            <button
              type="button"
              className="dev-mini-icon-btn"
              onClick={onRefresh}
              title="Oturumları yenile"
            >
              <md-icon style={{ fontSize: '15px' }}>refresh</md-icon>
            </button>
          </div>

          <div className="dev-session-list">
            {sessions.length === 0 ? (
              <div className="dev-session-empty">Kayıtlı oturum bulunamadı.</div>
            ) : (
              sessions.map((s) => {
                const isSelected = s.session_id === activeSessionId;
                const u = getUserLabel(s);
                return (
                  <button
                    key={s.session_id}
                    type="button"
                    className={`dev-session-row ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      onSelectSession(s.session_id);
                      setOpen(false);
                    }}
                  >
                    <div className="dev-session-row-top">
                      <div className="dev-io-flow" style={{ gap: '6px' }}>
                        <span
                          className={`m3-status-dot ${
                            s.is_running ? 'secondary is-pulsing' : s.has_session ? 'success' : 'neutral'
                          }`}
                        />
                        <span className="m3-mono" style={{ fontSize: '11px', fontWeight: 700 }}>
                          {s.session_id}
                        </span>
                        <span className={`m3-tonal-badge sm ${s.client_app === 'web' ? 'primary' : ''}`}>
                          {s.client_app === 'web' ? 'Web' : s.client_app === 'developer' ? 'Dev' : 'API'}
                        </span>
                        <span className={`m3-tonal-badge sm ${u.isDev ? 'secondary' : ''}`}>
                          {u.isDev ? `Developer (${u.label})` : u.label}
                        </span>
                      </div>
                      <span className="m3-mono" style={{ fontSize: '10px', opacity: 0.7 }}>
                        {formatRelativeTime(s.last_active_at)}
                      </span>
                    </div>

                    <div className="dev-session-row-bottom">
                      <span className="dev-session-track-name" title={s.track_name || 'Boş oturum'}>
                        {s.track_name || 'Henüz şarkı yüklenmedi'}
                      </span>
                      <div className="dev-session-stage-dots" title="Aşama 01 → 04 Durumları">
                        {['1', '2', '3', '4'].map((k) => {
                          const st = s.stages?.[k]?.status || 'pending';
                          const cls =
                            st === 'completed'
                              ? 'success'
                              : st === 'running'
                              ? 'secondary is-pulsing'
                              : st === 'error'
                              ? 'error'
                              : 'neutral';
                          return <span key={k} className={`m3-status-dot ${cls}`} title={`Aşama 0${k}: ${st}`} />;
                        })}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

## `production/developer/src/components/SourceSelectModal.tsx`

```tsx
import React from 'react';
import { AudioDropzone } from './ui/AudioDropzone';

interface SourceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onUpload: (file: File) => void;
}

export const SourceSelectModal: React.FC<SourceSelectModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onUpload
}) => {
  if (!isOpen) return null;

  const handleUploadFile = (file: File) => {
    onUpload(file);
    onClose();
  };

  return (
    <div
      className="dev-modal-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-modal-title"
        className="dev-modal-card"
      >
        <md-elevation></md-elevation>

        <div className="dev-modal-header">
          <div className="dev-modal-title-wrap">
            <div className="dev-modal-icon-badge">
              <md-icon style={{ fontSize: '18px' }}>audio_file</md-icon>
            </div>
            <h2 id="source-modal-title" className="md-typescale-title-medium">
              Ses Dosyası Yükle
            </h2>
          </div>
          <md-icon-button onClick={onClose} aria-label="Pencereyi kapat">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        <div className="dev-modal-body">
          <AudioDropzone onUpload={handleUploadFile} />
        </div>
      </div>
    </div>
  );
};
```

## `production/developer/src/components/Telemetry/RequestTraceView.tsx`

```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RequestTraceEntry } from '../../types/workbench';
import * as api from '../../api/workbenchApi';

interface RequestTraceViewProps {
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
}

export const RequestTraceView: React.FC<RequestTraceViewProps> = ({
  activeSessionId,
  onSelectSession
}) => {
  const [requests, setRequests] = useState<RequestTraceEntry[]>([]);
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [onlyActiveSession, setOnlyActiveSession] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const lastIdRef = useRef(0);

  const fetchTraces = useCallback(async (reset = false) => {
    try {
      const since = reset ? 0 : lastIdRef.current;
      const res = await api.getTelemetryRequests({
        sinceId: since,
        limit: 200
      });
      if (res.last_id > lastIdRef.current) {
        lastIdRef.current = res.last_id;
      }
      if (reset) {
        setRequests((res.requests || []).slice().reverse());
      } else if (res.requests && res.requests.length > 0) {
        setRequests((prev) => {
          const seen = new Set(prev.map((r) => r.id));
          const incoming = res.requests.filter((r) => !seen.has(r.id)).reverse();
          return [...incoming, ...prev].slice(0, 300);
        });
      }
    } catch {
      // ignore transient errors
    }
  }, []);

  useEffect(() => {
    fetchTraces(true);
    const id = window.setInterval(() => fetchTraces(false), 1500);
    return () => window.clearInterval(id);
  }, [fetchTraces]);

  const handleClear = async () => {
    await api.clearTelemetryRequests().catch(() => undefined);
    setRequests([]);
    lastIdRef.current = 0;
  };

  const visible = requests.filter((r) => {
    if (onlyErrors && r.status_code < 400) return false;
    if (onlyActiveSession && r.session_id !== activeSessionId) return false;
    return true;
  });

  const errorCount = requests.filter((r) => r.status_code >= 400).length;

  return (
    <section className="m3-surface-card dev-section-block">
      <md-elevation></md-elevation>

      <div className="dev-section-header">
        <div className="dev-section-header-title">
          <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
            monitoring
          </md-icon>
          <span>Canlı API İstek & Hata Takibi</span>
          <span className="m3-tonal-badge sm primary m3-tabular">{visible.length} istek</span>
          {errorCount > 0 && (
            <span className="m3-tonal-badge sm error m3-tabular">{errorCount} hata</span>
          )}
        </div>

        <div className="dev-trace-controls">
          <button
            type="button"
            className={`dev-filter-pill ${onlyActiveSession ? 'is-active' : ''}`}
            onClick={() => setOnlyActiveSession((p) => !p)}
            title="Yalnızca seçili oturuma ait istekleri göster"
          >
            Sadece Seçili Oturum
          </button>
          <button
            type="button"
            className={`dev-filter-pill ${onlyErrors ? 'is-error-active' : ''}`}
            onClick={() => setOnlyErrors((p) => !p)}
            title="Sadece 4xx/5xx hatalarını göster"
          >
            Sadece Hatalar
          </button>
          <md-text-button onClick={handleClear}>
            <md-icon slot="icon">delete_sweep</md-icon>
            <span>Temizle</span>
          </md-text-button>
        </div>
      </div>

      <div className="dev-trace-table-wrap">
        {visible.length === 0 ? (
          <div className="dev-trace-empty">
            Henüz yakalanan istek yok. Web Studio veya Developer üzerinden yapılan tüm API istekleri burada canlı görünür.
          </div>
        ) : (
          <table className="dev-trace-table">
            <thead>
              <tr>
                <th>Zaman</th>
                <th>İstemci</th>
                <th>Kullanıcı</th>
                <th>İstek</th>
                <th>Durum</th>
                <th>Süre</th>
                <th>Oturum / Şarkı</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const isErr = r.status_code >= 400;
                const statusCls =
                  r.status_code >= 500
                    ? 'error'
                    : r.status_code >= 400
                    ? 'secondary'
                    : 'success';
                const hasDetail = Boolean(r.error_detail);
                const isExpanded = expandedId === r.id;

                return (
                  <React.Fragment key={r.id}>
                    <tr
                      className={`dev-trace-row ${isErr ? 'is-error-row' : ''}`}
                      onClick={() => hasDetail && setExpandedId(isExpanded ? null : r.id)}
                      style={{ cursor: hasDetail ? 'pointer' : 'default' }}
                    >
                      <td className="m3-mono m3-tabular">{r.timestamp}</td>
                      <td>
                        <span className={`m3-tonal-badge sm ${r.client_app === 'web' ? 'primary' : ''}`}>
                          {r.client_app === 'web' ? 'Web' : r.client_app === 'developer' ? 'Dev' : 'API'}
                        </span>
                      </td>
                      <td>
                        {r.user ? (
                          <span className={`m3-tonal-badge sm ${r.user.role === 'developer' ? 'secondary' : ''}`}>
                            {r.user.role === 'developer' ? `DEV · ${r.user.username}` : r.user.username}
                          </span>
                        ) : (
                          <span style={{ opacity: 0.65, fontSize: '11px' }}>Misafir</span>
                        )}
                      </td>
                      <td className="m3-mono" style={{ fontSize: '11.5px' }}>
                        <strong>{r.method}</strong> {r.path.replace('/api/workbench', '')}
                        {r.query ? <span style={{ opacity: 0.65 }}>?{r.query}</span> : null}
                      </td>
                      <td>
                        <span className={`m3-tonal-badge sm m3-tabular ${statusCls}`}>
                          {r.status_code}
                        </span>
                      </td>
                      <td className="m3-mono m3-tabular">{r.duration_ms.toFixed(0)} ms</td>
                      <td>
                        <div className="dev-io-flow" style={{ gap: '6px' }}>
                          {r.session_id && (
                            <button
                              type="button"
                              className={`dev-session-chip ${r.session_id === activeSessionId ? 'is-active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectSession(r.session_id!);
                              }}
                              title="Bu oturuma geç ve tanıları incele"
                            >
                              {r.session_id === 'default' ? 'default' : r.session_id.slice(0, 12)}
                            </button>
                          )}
                          {r.track_name && (
                            <span className="dev-trace-track" title={r.track_name}>
                              {r.track_name}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {isExpanded && r.error_detail && (
                      <tr className="dev-trace-detail-row">
                        <td colSpan={7}>
                          <code>{r.error_detail}</code>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};
```

## `production/developer/src/components/ui/AudioDropzone.tsx`

```tsx
import React, { useId, useState } from 'react';

interface AudioDropzoneProps {
  onUpload: (file: File) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const AudioDropzone: React.FC<AudioDropzoneProps> = ({
  onUpload,
  title = 'Dosya seçmek için tıklayın veya sürükleyip bırakın',
  subtitle = 'WAV, MP3, FLAC, OGG ve M4A desteklenir (Azami 100 MB)',
  compact = false
}) => {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        id={inputId}
        accept=".wav,.mp3,.flac,.ogg,.m4a"
        className="dev-hidden-input"
        onChange={handleFileInput}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
        className={`m3-upload-dropzone ${compact ? 'is-compact' : ''} ${dragActive ? 'is-dragging' : ''
          }`}
      >
          <div className="m3-upload-dropzone-icon">
            <md-icon>cloud_upload</md-icon>
          </div>
          <span className="md-typescale-title-small">{title}</span>
          <span className="dev-aside-copy m3-tabular">{subtitle}</span>
        </div>
      </>
      );
};
```

## `production/developer/src/components/ui/MetricCard.tsx`

```tsx
import React from 'react';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'error';
  compactValue?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  tone = 'default',
  compactValue = false
}) => {
  const containerTone =
    tone === 'tertiary' ? 'tone-tertiary' : tone === 'error' ? 'tone-error' : '';
  const valueTone = tone !== 'default' ? `tone-${tone}` : '';

  return (
        <div className={`m3-surface-card dev-metric-card ${containerTone}`}>
          <md-elevation></md-elevation>
          <div className="dev-metric-label">
            {icon}
            <span>{label}</span>
          </div>
            <div className={`dev-metric-value m3-tabular ${valueTone} ${compactValue ? 'is-compact' : ''}`}>
              {value}
            </div>
            {subtitle && <div className="dev-metric-sub">{subtitle}</div>}
          </div>
          );
};
```

## `production/developer/src/constants/instruments.ts`

```ts
import { StemChannel } from '../types/workbench';

export type InstrumentId = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other';

export interface InstrumentMeta {
  id: InstrumentId;
  label: string;
  role: string;
  materialIcon: string;
  color: string;
}

export const INSTRUMENT_META: Record<InstrumentId, InstrumentMeta> = {
  guitar: {
    id: 'guitar',
    label: 'Gitar',
    role: 'Akustik / Elektro Gitar Hattı',
    materialIcon: 'guitar',
    color: '#0B57D0'
  },
  bass: {
    id: 'bass',
    label: 'Bas',
    role: 'Ritmik / Armonik Bas Hattı',
    materialIcon: 'graphic_eq',
    color: '#146C2E'
  },
  drums: {
    id: 'drums',
    label: 'Davul',
    role: 'Perküsyon & Transient Zamanlama',
    materialIcon: 'album',
    color: '#D97706'
  },
  vocals: {
    id: 'vocals',
    label: 'Vokal',
    role: 'Melodik Vokal Hattı',
    materialIcon: 'mic',
    color: '#B3261E'
  },
  piano: {
    id: 'piano',
    label: 'Piyano',
    role: 'Harmonik Eşlik & Klavye',
    materialIcon: 'piano',
    color: '#7C3AED'
  },
  other: {
    id: 'other',
    label: 'Diğer',
    role: 'Ambiyans, Sentetizör ve Efektler',
    materialIcon: 'equalizer',
    color: '#64748B'
  }
};

export const STEM_CHANNEL_ORDER: InstrumentId[] = [
  'guitar',
  'bass',
  'drums',
  'vocals',
  'piano',
  'other'
];

export const DEFAULT_STEMS: StemChannel[] = [
  { id: 'guitar', name: 'Gitar', fileName: 'Gitar', sizeBytes: 32925286, volume: 0.85, isMuted: false, isSolo: false, isGuitar: true },
  { id: 'bass', name: 'Bas', fileName: 'Bas', sizeBytes: 32925286, volume: 0.70, isMuted: false, isSolo: false },
  { id: 'drums', name: 'Davul', fileName: 'Davul', sizeBytes: 32925286, volume: 0.65, isMuted: false, isSolo: false },
  { id: 'vocals', name: 'Vokal', fileName: 'Vokal', sizeBytes: 32925286, volume: 0.60, isMuted: false, isSolo: false },
  { id: 'piano', name: 'Piyano', fileName: 'Piyano', sizeBytes: 32925286, volume: 0.50, isMuted: false, isSolo: false },
  { id: 'other', name: 'Diğer', fileName: 'Diğer', sizeBytes: 32925286, volume: 0.40, isMuted: false, isSolo: false }
];

export type SectionTone = 'primary' | 'secondary' | 'tertiary' | 'success' | 'neutral';

export const SECTION_TONE_MAP: Record<string, SectionTone> = {
    start: 'primary',
    intro: 'primary',
    inst: 'primary',
    verse: 'success',
    chorus: 'tertiary',
    solo: 'tertiary',
    bridge: 'secondary',
    outro: 'neutral',
    end: 'neutral'
};

export function resolveInstrumentMeta(id: string): InstrumentMeta {
  if (INSTRUMENT_META[id as InstrumentId]) {
    return INSTRUMENT_META[id as InstrumentId];
  }
  if (id.startsWith('guitar_')) {
    return {
      id: id as InstrumentId,
      label: id.replace('guitar_', 'Gitar '),
      role: 'Ayrıştırılmış Gitar İcracısı',
      materialIcon: 'guitar',
      color: '#0B57D0'
    };
  }
  if (id.startsWith('vocal_')) {
    return {
      id: id as InstrumentId,
      label: id.replace('vocal_', 'Vokal '),
      role: 'Ayrıştırılmış Vokal İcracısı',
      materialIcon: 'mic',
      color: '#B3261E'
    };
  }
  return {
    id: id as InstrumentId,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    role: 'Enstrüman Kanalı',
    materialIcon: 'music_note',
    color: '#64748B'
  };
}
```

## `production/developer/src/constants/stages.ts`

```ts
import { StageMetadata } from '../types/workbench';

export const DEFAULT_STAGES: StageMetadata[] = [
  {
    id: 1,
    title: 'Ölçü ve Tempo Tespiti',
    operation: 'Vuruş gücü ve metrik ızgara çıkarımı',
    input: 'Oturum Sesi (Disk)',
    output: 'beats.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Yok',
    diagnosticFocus:
      'Temponun yarıya veya iki katına kaymadığını ve ölçü başlarının (downbeat) bar çizgileriyle hizalandığını doğrulayın.'
  },
  {
    id: 2,
    title: 'Akor Tanıma ve Şarkı Yapısı',
    operation: 'Armonik akor tahmini, şarkı tonu ve yapısal bölümleme',
    input: 'Oturum Sesi + beats.json',
    output: 'chords.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Aşama 1 (bölümler için)',
    diagnosticFocus:
      'Şarkı tonunu (Key), akor geçiş doğruluğunu ve Giriş/Kıta/Nakarat sınırlarını kontrol edin.'
  },
  {
    id: 3,
    title: 'Makro Kanal Ayırma (BS-RoFormer)',
    operation: 'Çok kanallı zaman-frekans makro kaynak ayrıştırma',
    input: 'Oturum Sesi (Disk)',
    output: 'stems.json + İzole Kanallar',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Yok',
    diagnosticFocus:
      'Ayrıştırılan enstrüman kanallarını, akustik sızma (bleed) ve izolasyon skorlarını inceleyin. Miksaj için alt oynatıcıdaki Mikser butonunu kullanın.'
  },
  {
    id: 4,
    title: 'Otomatik Şarkı Sözü & Karaoke',
    operation: 'İzole vokal transkripsiyonu ve milisaniyelik CTC hizalama',
    input: 'İzole Vokal (stems/vocals.wav)',
    output: 'lyrics.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Aşama 3 (Vokal Kanalı)',
    diagnosticFocus:
      'Çıkarılan sözlerin doğruluğunu, dil tespitini ve kelime bazlı milisaniye zaman damgalarını kontrol edin.'
  }
];

export const STAGE_DEPENDENCIES: Record<number, { required: number[]; message: string }> = {
  4: {
    required: [3],
    message: 'Önce Aşama 3 (Makro Kanal Ayırma) çalıştırılarak izole vokal üretilmelidir.'
  }
};

export function formatStageDuration(ms: number): string {
  if (!ms || ms <= 0) return '0 sn';
  const sec = ms / 1000;
  if (sec < 60) {
    return `${sec.toFixed(1)} sn`;
  }
  const min = Math.floor(sec / 60);
  const remSec = Math.round(sec % 60);
  return `${min} dk ${remSec} sn`;
}
```

## `production/developer/src/hooks/useAudioMixer.ts`

```ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionState, StemChannel } from '../types/workbench';
import { Stage3MssData } from '../types/stages';
import { DEFAULT_STEMS } from '../constants/instruments';
import { buildStreamUrl } from '../api/httpClient';

interface UseAudioMixerOptions {
  session: SessionState | null;
  stage3Output?: Stage3MssData;
  activeSessionId?: string;
}

  export function useAudioMixer({ session, stage3Output, activeSessionId = 'default' }: UseAudioMixerOptions) {
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [stemChannels, setStemChannels] = useState<StemChannel[]>(DEFAULT_STEMS);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const stemAudioRefs = useRef<Record<string, HTMLAudioElement>>({});
    const currentTimeRef = useRef<number>(0);
    const playPromisesRef = useRef<Record<string, Promise<void> | null>>({});

    const safePlay = useCallback((audio: HTMLAudioElement, id: string) => {
      if (!audio.src) return;
      try {
        const p = audio.play();
        if (p !== undefined) {
          playPromisesRef.current[id] = p;
          p.then(() => {
            playPromisesRef.current[id] = null;
          }).catch((err: unknown) => {
            playPromisesRef.current[id] = null;
            // AbortError is thrown when pause() interrupts play() - standard browser behavior, ignore safely
            if (err instanceof Error && (err.name === 'AbortError' || err.message?.includes('interrupted'))) {
              return;
            }
            console.warn(`Kanal ${id} oynatma hatası:`, err);
          });
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.warn(`Kanal ${id} başlatma hatası:`, err);
      }
    }, []);

    const safePause = useCallback((audio: HTMLAudioElement, id: string) => {
      const p = playPromisesRef.current[id];
      if (p) {
        p.then(() => {
          try {
            audio.pause();
          } catch {
            // ignore
          }
        }).catch(() => {
          // ignore
        });
      } else {
        try {
          audio.pause();
        } catch {
          // ignore
        }
      }
    }, []);

    currentTimeRef.current = currentTime;
    const audioDuration = session?.duration_sec || 0;
    const isStage3Done = session?.stages?.['3']?.status === 'completed';

    // Bind master HTML5 Audio element
    useEffect(() => {
      if (typeof window === 'undefined') return;

      if (!audioRef.current) {
        const audio = new Audio();
        audioRef.current = audio;

        audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);
      }

      const audio = audioRef.current;
      if (session?.has_session) {
          const srcUrl = buildStreamUrl('master', session.track_name);
          if (!audio.src.endsWith(srcUrl)) {
            audio.src = srcUrl;
            audio.load();
          }
        } else {
          safePause(audio, 'master');
          audio.src = '';
          setIsPlaying(false);
          setCurrentTime(0);
        }
  }, [session?.has_session, session?.track_name, activeSessionId, safePause]);

  // Bind isolated stem audio elements and remove obsolete ones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentChannelIds = new Set(stemChannels.map((c) => c.id));
    // Clean up audio elements for channels that were removed
    Object.keys(stemAudioRefs.current).forEach((id) => {
      if (!currentChannelIds.has(id)) {
        const obsoleteAudio = stemAudioRefs.current[id];
        safePause(obsoleteAudio, id);
        obsoleteAudio.src = '';
        delete stemAudioRefs.current[id];
      }
    });

    stemChannels.forEach((ch) => {
      const stemId = ch.id;
      if (!stemAudioRefs.current[stemId]) {
        const audio = new Audio();
        audio.preload = 'auto';
        stemAudioRefs.current[stemId] = audio;
      }
      const audio = stemAudioRefs.current[stemId];
      if (isStage3Done) {
          const srcUrl = buildStreamUrl(stemId, session?.track_name || 'stem');
          if (!audio.src.endsWith(srcUrl)) {
            audio.src = srcUrl;
            audio.load();
          }
        } else {
          safePause(audio, stemId);
          audio.src = '';
        }
      });
}, [stemChannels, isStage3Done, session?.track_name, activeSessionId, safePause]);

// Update stem metadata: standart BS-RoFormer 6 kanal
useEffect(() => {
  if (!stage3Output) return;

  setStemChannels((prev) => {
    const prevMap = new Map(prev.map((p) => [p.id, p]));
    const stemsObj = stage3Output.stems || {};
    const order =
      stage3Output.channel_order && stage3Output.channel_order.length > 0
        ? stage3Output.channel_order
        : Object.keys(stemsObj).length > 0
          ? Object.keys(stemsObj)
          : DEFAULT_STEMS.map((d) => d.id);

    return order.map((id) => {
      const def = DEFAULT_STEMS.find((d) => d.id === id);
      const prevCh = prevMap.get(id);
      const stemInfo = stemsObj[id];
      const category = stemInfo?.category || def?.id || 'other';
      const isDetected =
        typeof stemInfo?.detected === 'boolean'
          ? stemInfo.detected
          : stemInfo?.rms_dbfs !== undefined
            ? stemInfo.rms_dbfs > -48 && (stemInfo.peak_dbfs ?? -60) > -40
            : false;

      const resolvedName = def?.name || id;
      return {
        id,
        category,
        name: resolvedName,
        fileName: resolvedName,
        sizeBytes: stemInfo?.buffer_size_mb
          ? Math.round(stemInfo.buffer_size_mb * 1024 * 1024)
          : stemInfo?.size_bytes,
        volume: prevCh ? prevCh.volume : def?.volume ?? 0.8,
        isMuted: prevCh ? prevCh.isMuted : false,
        isSolo: prevCh ? prevCh.isSolo : false,
        isGuitar: category === 'guitar',
        detected: isDetected,
        presenceLabel: isDetected ? 'Aktif Sinyal' : 'Ses Bulunmadı'
      };
    });
  });
}, [stage3Output]);

// Synchronize playback, solo, mute, and volume across stem elements
useEffect(() => {
  const isAnySolo = stemChannels.some((c) => c.isSolo);
  const shouldPlayStems = isStage3Done && isPlaying;

  stemChannels.forEach((ch) => {
    const audio = stemAudioRefs.current[ch.id];
    if (!audio || !audio.src) return;

    let effectiveVol = ch.volume;
    if (ch.isMuted || (isAnySolo && !ch.isSolo) || ch.detected === false) {
      effectiveVol = 0;
    }
    audio.volume = Math.max(0, Math.min(1, effectiveVol));

    if (shouldPlayStems) {
      if (audio.paused && !playPromisesRef.current[ch.id]) {
        audio.currentTime = currentTimeRef.current;
        safePlay(audio, ch.id);
      }
    } else if (!audio.paused) {
      safePause(audio, ch.id);
    }
  });
}, [isPlaying, isStage3Done, stemChannels, safePlay, safePause]);

// Keep master timeline synced to stem playback leader
useEffect(() => {
  if (!isStage3Done || !isPlaying) return;

  const leader =
    stemAudioRefs.current['guitar'] ||
    Object.values(stemAudioRefs.current)[0];
  if (!leader) return;

  const onTime = () => setCurrentTime(leader.currentTime);
  const onEnded = () => setIsPlaying(false);

  leader.addEventListener('timeupdate', onTime);
  leader.addEventListener('ended', onEnded);
  return () => {
    leader.removeEventListener('timeupdate', onTime);
    leader.removeEventListener('ended', onEnded);
  };
}, [isPlaying, isStage3Done, stemChannels]);

const seekAudio = useCallback(
  (sec: number) => {
    const clamped = Math.max(0, Math.min(sec, audioDuration || 300));
    setCurrentTime(clamped);
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
    Object.values(stemAudioRefs.current).forEach((a) => {
      if (a && a.src) a.currentTime = clamped;
    });
  },
  [audioDuration]
);

const toggleMasterPlay = useCallback(() => {
  if (!session?.has_session) {
    setIsPlaying((prev) => !prev);
    return;
  }

  if (isStage3Done) {
    if (isPlaying) {
      Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
        if (a) safePause(a, id);
      });
      if (audioRef.current) safePause(audioRef.current, 'master');
      setIsPlaying(false);
    } else {
      if (audioRef.current) safePause(audioRef.current, 'master');
      Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
        if (a && a.src) {
          if (a.error || a.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
            a.load();
          }
          a.currentTime = currentTimeRef.current;
          safePlay(a, id);
        }
      });
      setIsPlaying(true);
    }
    return;
  }

  const audio = audioRef.current;
  if (!audio) return;

  if (audio.paused) {
    audio.currentTime = currentTimeRef.current;
    safePlay(audio, 'master');
    setIsPlaying(true);
  } else {
    safePause(audio, 'master');
    setIsPlaying(false);
  }
}, [session?.has_session, isStage3Done, isPlaying, safePlay, safePause]);

const toggleStemSolo = useCallback((channelId: string) => {
  setStemChannels((prev) => {
    const target = prev.find((c) => c.id === channelId);
    const isCurrentlySolo = target?.isSolo;
    return prev.map((c) => ({
      ...c,
      isSolo: c.id === channelId ? !isCurrentlySolo : false
    }));
  });
}, []);

const toggleStemMute = useCallback((channelId: string) => {
  setStemChannels((prev) =>
    prev.map((c) => (c.id === channelId ? { ...c, isMuted: !c.isMuted } : c))
  );
}, []);

const setStemVolume = useCallback((channelId: string, vol: number) => {
  setStemChannels((prev) =>
    prev.map((c) => (c.id === channelId ? { ...c, volume: vol } : c))
  );
}, []);

const resetStemMixer = useCallback(() => {
  setStemChannels((prev) =>
    prev.map((c) => ({
      ...c,
      volume: c.id === 'guitar' ? 0.85 : 0.7,
      isMuted: false,
      isSolo: false
    }))
  );
}, []);

const stopAndResetAudio = useCallback(() => {
  if (audioRef.current) {
    safePause(audioRef.current, 'master');
    audioRef.current.src = '';
  }
  Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
    if (a) {
      safePause(a, id);
      a.src = '';
    }
  });
  setIsPlaying(false);
  setCurrentTime(0);
}, [safePause]);

return {
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
  stopAndResetAudio
};
}
```

## `production/developer/src/hooks/useLiveLogs.ts`

```ts
import { useState, useEffect, useRef, useCallback } from 'react';
import { LogEntry } from '../types/workbench';
import * as api from '../api/workbenchApi';

interface UseLiveLogsOptions {
  isExecuting?: boolean;
  activeSessionId?: string;
}

export function useLiveLogs({ isExecuting = false, activeSessionId }: UseLiveLogsOptions = {}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterStage, setFilterStage] = useState<number | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'INFO' | 'WARNING' | 'ERROR'>('all');
  const [onlyActiveSession, setOnlyActiveSession] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const lastIdRef = useRef<number>(0);
  const isFetchingRef = useRef(false);

  // Auto-open console when an execution begins
  useEffect(() => {
    if (isExecuting) {
      setIsOpen(true);
    }
  }, [isExecuting]);

  const fetchNewLogs = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const res = await api.getLogs(lastIdRef.current, undefined, 200);
      if (res.logs && res.logs.length > 0) {
        lastIdRef.current = res.last_id;
        setLogs((prev) => {
          const existingIds = new Set(prev.map((l) => l.id));
          const fresh = res.logs.filter((l) => !existingIds.has(l.id));
          return fresh.length > 0 ? [...prev, ...fresh].slice(-1000) : prev;
        });
      }
    } catch {
      // Backend may be momentarily busy
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Adaptive polling interval
  useEffect(() => {
    fetchNewLogs();
    const intervalMs = isExecuting ? 500 : 2500;
    const intervalId = setInterval(fetchNewLogs, intervalMs);
    return () => clearInterval(intervalId);
  }, [isExecuting, fetchNewLogs]);

  const clearAllLogs = useCallback(async () => {
    try {
      await api.clearLogs();
      setLogs([]);
      lastIdRef.current = 0;
    } catch (err) {
      console.error('Günlükler temizlenemedi:', err);
    }
  }, []);

  // Filtered views
  const filteredLogs = logs.filter((entry) => {
    if (onlyActiveSession && activeSessionId && entry.session_id !== activeSessionId) {
      return false;
    }
    if (filterStage !== 'all' && entry.stage_num !== filterStage) {
      return false;
    }
    if (filterLevel !== 'all' && entry.level !== filterLevel) {
      return false;
    }
    return true;
  });

  const stageLogs = useCallback(
    (stageNum: number) =>
      logs.filter(
        (l) =>
          l.stage_num === stageNum &&
          (!activeSessionId || !l.session_id || l.session_id === activeSessionId)
      ),
    [logs, activeSessionId]
  );

  return {
    logs: filteredLogs,
    allLogsCount: logs.length,
    stageLogs,
    filterStage,
    setFilterStage,
    filterLevel,
    setFilterLevel,
    onlyActiveSession,
    setOnlyActiveSession,
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    autoScroll,
    setAutoScroll,
    clearAllLogs,
    fetchNewLogs
  };
}
```

## `production/developer/src/hooks/useSessionPipeline.ts`

```ts
import { useState, useEffect, useCallback } from 'react';
import {
  InspectorTab,
  SessionState,
  TelemetrySessionSummary
} from '../types/workbench';
import { StageOutputMap } from '../types/stages';
import * as api from '../api/workbenchApi';
import { getActiveSessionId, setActiveSessionId } from '../api/httpClient';

function getInitialStageId(): number {
  try {
    const urlStage = new URLSearchParams(window.location.search).get('stage');
    const num = urlStage ? parseInt(urlStage, 10) : 1;
    return num >= 1 && num <= 4 ? num : 1;
  } catch {
    return 1;
  }
}

export function useSessionPipeline(onBeforeSourceChange?: () => void) {
  const [activeSessionId, setActiveSessionIdState] = useState<string>(() => getActiveSessionId());
  const [telemetrySessions, setTelemetrySessions] = useState<TelemetrySessionSummary[]>([]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number>(getInitialStageId);
  const [activeInspectorTab, setActiveInspectorTab] = useState<InspectorTab>('diagnostic');

  const [stageOutputs, setStageOutputs] = useState<StageOutputMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [runningStage, setRunningStage] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionMode, setExecutionMode] = useState<'sequential' | 'parallel'>('parallel');

  const refreshSession = useCallback(async () => {
    try {
      const data = await api.getSession();
      setSession(data.state);
    } catch {
      // Backend may be starting up
    }
  }, []);

  const refreshTelemetrySessions = useCallback(async () => {
    try {
      const res = await api.getTelemetrySessions();
      setTelemetrySessions(res.sessions || []);
    } catch {
      // ignore transient failures
    }
  }, []);

  useEffect(() => {
    refreshSession();
  refreshTelemetrySessions();
  const timer = window.setInterval(refreshTelemetrySessions, 3000);
  return () => window.clearInterval(timer);
}, [refreshSession, refreshTelemetrySessions]);

// Observe remote background progress on the currently selected session (e.g. Web Studio upload)
const hasRemoteRunningStage = Boolean(
  session?.sections_refining ||
  (session?.stages &&
    Object.values(session.stages).some((st) => st?.status === 'running'))
);
useEffect(() => {
  if (!hasRemoteRunningStage) return;
  const pollId = window.setInterval(() => {
    refreshSession();
  }, 1500);
  return () => window.clearInterval(pollId);
}, [hasRemoteRunningStage, refreshSession]);

const switchSession = useCallback(
  async (sessionId: string) => {
    const clean = setActiveSessionId(sessionId);
    onBeforeSourceChange?.();
    setActiveSessionIdState(clean);
    setStageOutputs({});
    setError(null);
    setRunningStage(null);
    await refreshSession();
    refreshTelemetrySessions();
  },
  [onBeforeSourceChange, refreshSession, refreshTelemetrySessions]
);

const loadStageData = useCallback(async (stageNum: number) => {
  try {
    const data = await api.getStageData(stageNum);
    setStageOutputs((prev) => ({ ...prev, [stageNum]: data }));
  } catch {
    // Output may not exist yet
  }
}, []);

const selectedStageMeta = session?.stages?.[String(selectedStageId)];
useEffect(() => {
  if (selectedStageMeta?.status === 'completed') {
    loadStageData(selectedStageId);
  }
}, [
  activeSessionId,
  selectedStageId,
  selectedStageMeta?.status,
  selectedStageMeta?.durationMs,
  (selectedStageMeta as any)?.timings_ms,
  session?.sections_refining,
  loadStageData
]);

// Ensure Stage 3 outputs are loaded whenever completed for the mixer
useEffect(() => {
  if (session?.stages?.['3']?.status === 'completed' && !stageOutputs[3]) {
    loadStageData(3);
  }
  }, [activeSessionId, session?.stages?.['3']?.status, stageOutputs, loadStageData]);

const runSourceTransition = useCallback(
  async (action: () => Promise<{ state: SessionState }>, fallbackMsg: string) => {
    onBeforeSourceChange?.();
    setIsLoading(true);
    setError(null);
    try {
      const res = await action();
      setSession(res.state);
      setStageOutputs({});
      setSelectedStageId(1);
      refreshTelemetrySessions();
    } catch (err: any) {
      setError(err?.message || fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  },
  [onBeforeSourceChange, refreshTelemetrySessions]
);

const handleUpload = useCallback(
  (file: File) => runSourceTransition(() => api.uploadAudio(file), 'Ses dosyası yüklenemedi'),
  [runSourceTransition]
);

const handleReset = useCallback(
  () => runSourceTransition(() => api.resetSession(), 'Oturum sıfırlanamadı'),
  [runSourceTransition]
);

const handleRunStage = useCallback(
  async (stageNum: number) => {
    setRunningStage(stageNum);
    setError(null);
    try {
      const res = await api.runStage(stageNum);
      setSession(res.state);
      setStageOutputs((prev) => ({ ...prev, [stageNum]: res.data }));
      refreshTelemetrySessions();
    } catch (err: any) {
      setError(err?.message || `Aşama ${stageNum} çalıştırma hatası`);
    } finally {
      setRunningStage(null);
    }
  },
  [refreshTelemetrySessions]
);

const handleRunAll = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const stagesToRun = [1, 2, 3, 4];
    if (executionMode === 'parallel') {
      setRunningStage(1);
      const pollTimer = window.setInterval(() => {
        refreshSession();
    }, 700);
try {
  const dagRes = await api.runAllStages(true);
  if (dagRes?.state) {
    setSession(dagRes.state);
  }
          const [d1, d2, d3, d4] = await Promise.all([
    api.getStageData(1).catch(() => undefined),
    api.getStageData(2).catch(() => undefined),
            api.getStageData(3).catch(() => undefined),
    api.getStageData(4).catch(() => undefined)
  ]);
  setStageOutputs((prev) => ({
    ...prev,
    ...(d1 ? { 1: d1 } : {}),
    ...(d2 ? { 2: d2 } : {}),
            ...(d3 ? { 3: d3 } : {}),
    ...(d4 ? { 4: d4 } : {})
  }));
} finally {
  window.clearInterval(pollTimer);
}
      } else {
  for (const s of stagesToRun) {
    setRunningStage(s);
    const res = await api.runStage(s);
    setStageOutputs((prev) => ({ ...prev, [s]: res.data }));
    setSession(res.state);
  }
}
refreshTelemetrySessions();
    } catch (err: any) {
  setError(err?.message || 'Üretim akışı çalıştırılamadı');
} finally {
  setIsLoading(false);
  setRunningStage(null);
}
  }, [executionMode, refreshSession, refreshTelemetrySessions]);

return {
  activeSessionId,
  telemetrySessions,
  switchSession,
  refreshTelemetrySessions,
  session,
  selectedStageId,
  setSelectedStageId,
  activeInspectorTab,
  setActiveInspectorTab,
  stageOutputs,
  isLoading,
  runningStage,
  error,
  clearError: () => setError(null),
  executionMode,
  setExecutionMode,
  handleUpload,
  handleReset,
  handleRunStage,
  handleRunAll
};
}
```

## `production/developer/src/hooks/useWorkbench.ts`

```ts
import { useRef } from 'react';
import { DEFAULT_STAGES } from '../constants/stages';
import { useAudioMixer } from './useAudioMixer';
import { useSessionPipeline } from './useSessionPipeline';

export { DEFAULT_STAGES };

export function useWorkbench() {
  const stopAudioRef = useRef<(() => void) | null>(null);

  const pipeline = useSessionPipeline(() => stopAudioRef.current?.());
  const audio = useAudioMixer({
    session: pipeline.session,
    stage3Output: pipeline.stageOutputs[3],
    activeSessionId: pipeline.activeSessionId
  });
  stopAudioRef.current = audio.stopAndResetAudio;

    return {
      ...pipeline,
    ...audio
};
}
```

## `production/developer/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './material3';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## `production/developer/src/material3.ts`

```ts
/**
 * Official Google Material 3 Web Components (@material/web) Registry
 * Reference: https://m3.material.io/develop/web
 */
import '@material/web/typography/md-typescale-styles.css';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/slider/slider.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/tabs/tabs.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/dialog/dialog.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/ripple/ripple.js';
import '@material/web/elevation/elevation.js';
import '@material/web/divider/divider.js';
```

## `production/developer/src/types/stages.ts`

```ts
export interface BeatEventItem {
  beat_number: number;
  time_sec: number;
  is_downbeat: boolean;
  bar_index?: number;
}

export interface Stage1BeatData {
  engine?: string;
  tempo_bpm: number;
  time_signature: string;
  beat_count: number;
  downbeat_count: number;
  beats: BeatEventItem[];
}

export interface ChordSectionItem {
  name: string;
  raw_label?: string;
  start_bar: number;
  end_bar: number;
  start_sec: number;
  end_sec: number;
  color?: string;
}

export interface BarChordItem {
  bar_number: number;
  start_sec: number;
  end_sec: number;
  duration_sec: number;
  chord: string;
  chord_raw: string;
  chords: Array<{
    chord: string;
    chord_raw: string;
    start_sec: number;
    end_sec: number;
    duration_sec: number;
  }>;
}

export interface RawChordItem {
  start_sec: number;
  end_sec: number;
  chord: string;
}

export interface Stage2ChordData {
  engine?: string;
  key_signature?: string;
  chord_count: number;
  bar_count?: number;
  primary_progression?: string;
  sections?: ChordSectionItem[];
  bars?: BarChordItem[];
  chords: RawChordItem[];
}

export interface StemInfoItem {
  id?: string;
  channel: string;
  category?: string;
  parent_channel?: string;
  sub_index?: number;
  label?: string;
  role?: string;
  panning_desc?: string;
  detected?: boolean;
  presence_status?: string;
  presence_label?: string;
  stream_url?: string;
  buffer_size_mb?: number;
  sample_rate_hz?: number;
  duration_sec?: number;
  rms_dbfs?: number;
  peak_dbfs?: number;
  dynamic_range_db?: number;
  isolation_confidence_pct?: number;
  storage_mode?: string;
  amt_ready?: boolean;
  filename?: string;
  size_bytes?: number;
  separation_method?: string;
}

export interface Stage3MssData {
  engine?: string;
  architecture?: string;
  channel_order?: string[];
  sampling_rate_hz?: number;
  detected_count?: number;
  macro_stem_count?: number;
  sub_stem_count?: number;
  detected_channels?: string[];
  absent_channels?: string[];
  bleed_prevention?: string;
  stems?: Record<string, StemInfoItem>;
  sub_stems?: Record<string, StemInfoItem[]>;
  all_channels?: Record<string, StemInfoItem>;
  diagnostics?: {
    guitar_sdr_db?: number;
    bleed_rejection_db?: number;
    guitar_sub_count?: number;
    vocals_sub_count?: number;
    amt_readiness?: string;
  };
}

export interface LyricWordTimestamp {
  word: string;
  start_sec: number;
  end_sec: number;
}

export interface LyricLineTimestamp {
  start_sec: number;
  end_sec: number;
  text: string;
  words?: LyricWordTimestamp[];
}

export interface Stage4LyricsData {
  engine?: string;
  transcription_engine?: string;
  alignment_engine?: string;
  detected_language?: string | null;
  is_instrumental?: boolean;
  vocal_rms_dbfs?: number;
  word_count: number;
  line_count: number;
  inference_sec?: number;
  lines: LyricLineTimestamp[];
  words?: LyricWordTimestamp[];
}

export type StageOutputMap = {
  1?: Stage1BeatData;
  2?: Stage2ChordData;
  3?: Stage3MssData;
  4?: Stage4LyricsData;
  [key: number]: unknown;
};
```

## `production/developer/src/types/workbench.ts`

```ts
export type StageStatus = 'pending' | 'running' | 'completed' | 'error';

export type InspectorTab = 'diagnostic' | 'json' | 'console' | 'requests';

export interface StageMetadata {
  id: number;
  title: string;
  operation: string;
  input: string;
  output: string;
  status: StageStatus;
  durationMs: number;
  prerequisites: string;
  diagnosticFocus: string;
  error?: string | null;
}

export interface SongSection {
  name: string;
  start_bar: number;
  end_bar: number;
  start_sec: number;
  end_sec: number;
  color?: string;
}

export interface SessionUserInfo {
  id?: string | null;
  username?: string | null;
  email?: string | null;
  role?: 'user' | 'developer' | string;
}

export interface SessionState {
  has_session: boolean;
  track_name: string | null;
  track_key?: string | null;
  duration_sec: number | null;
  sample_rate: number | null;
  channels: number | null;
  device?: string;
  stages: Record<string, StageMetadata>;
  audio_url: string | null;
  sections?: SongSection[];
  sections_refining?: boolean;
  client_app?: string;
  last_active_at?: string;
  session_user?: SessionUserInfo | null;
}

export interface TelemetrySessionSummary {
  session_id: string;
  has_session: boolean;
  track_name?: string | null;
  track_key?: string | null;
  duration_sec: number;
  last_active_at?: string | null;
  client_app?: string;
  user?: SessionUserInfo | null;
  is_running: boolean;
  sections_refining?: boolean;
  stages: Record<string, { status: StageStatus; timings_ms: number }>;
}

export interface RequestTraceEntry {
  id: number;
  timestamp: string;
  method: string;
  path: string;
  query: string;
  status_code: number;
  duration_ms: number;
  session_id?: string | null;
  client_app: string;
  user?: SessionUserInfo | null;
  track_name?: string | null;
  error_detail?: string | null;
}

export interface StemChannel {
  id: string;
  category?: string;
  channelMode?: 'mono' | 'stereo';
  name: string;
  fileName: string;
  sizeBytes?: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  isSolo: boolean;
  isGuitar?: boolean;
  detected?: boolean;
  presenceLabel?: string;
  isSubStem?: boolean;
  parentChannel?: string;
  panningDesc?: string;
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG';
  logger: string;
  stage_num?: number | null;
  message: string;
  session_id?: string | null;
}
```

## `production/developer/vite.config.ts`

```ts
import http from 'node:http';
import https from 'node:https';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8001';

function sendOfflineFallback(urlPath: string, method: string, res: http.ServerResponse) {
  if (res.headersSent) {
    res.end();
    return;
  }
  const cleanPath = urlPath.split('?')[0];
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Kythra-Backend-Status', 'offline');

  if (method === 'GET') {
    if (cleanPath === '/api/workbench/session' || cleanPath === '/api/workbench/state') {
      res.statusCode = 200;
      res.end(JSON.stringify({ state: { has_session: false, stages: {} } }));
      return;
    }
    if (cleanPath === '/api/workbench/telemetry/sessions') {
      res.statusCode = 200;
      res.end(JSON.stringify({ sessions: [] }));
      return;
    }
    if (cleanPath === '/api/workbench/telemetry/requests') {
      res.statusCode = 200;
      res.end(JSON.stringify({ requests: [], last_id: 0 }));
      return;
    }
    if (cleanPath === '/api/workbench/logs') {
      res.statusCode = 200;
      res.end(JSON.stringify({ logs: [], last_id: 0 }));
      return;
    }
  }

  res.statusCode = 503;
  res.end(JSON.stringify({ detail: 'Backend API (127.0.0.1:8001) is not running in this environment.' }));
}

function resilientApiProxy(): Plugin {
  const target = new URL(API_PROXY_TARGET);
  const client = target.protocol === 'https:' ? https : http;

  return {
    name: 'kythra-resilient-api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = req.url || '';
        if (!reqUrl.startsWith('/api')) {
          return next();
        }

        const method = (req.method || 'GET').toUpperCase();
        const headers: http.OutgoingHttpHeaders = { ...req.headers, host: target.host };

        const upstreamReq = client.request(
          {
            protocol: target.protocol,
            hostname: target.hostname,
            port: target.port || (target.protocol === 'https:' ? 443 : 80),
            path: reqUrl,
            method,
            headers
          },
          (upstreamRes) => {
            if (!res.headersSent) {
              res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
            }
            upstreamRes.pipe(res);
          }
        );

        upstreamReq.on('error', () => {
          sendOfflineFallback(reqUrl, method, res);
        });

        req.on('close', () => {
          if (!upstreamReq.destroyed) {
            upstreamReq.destroy();
          }
        });

        if (method === 'GET' || method === 'HEAD') {
          upstreamReq.end();
        } else {
          req.pipe(upstreamReq);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    resilientApiProxy()
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    conditions: ['production', 'browser', 'module', 'import', 'default']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: 5174
  }
});
```

## `production/mobile/App.tsx`

```tsx
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
```

## `production/mobile/package.json`

```json
{
  "name": "kythra-production-mobile",
  "version": "1.0.0",
  "private": true,
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-av": "~15.0.0",
    "expo-status-bar": "~2.0.0",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "react-native-safe-area-context": "4.12.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.12",
    "typescript": "~5.3.3"
  }
}
```

## `production/mobile/src/api/studioApi.ts`

```ts
import {
  BarChordItem,
  BeatItem,
  PipelineProgressStep,
  SongSection,
  StemId,
  StudioSong
} from '../types/studio';

// Configurable Production API Host for Android & iOS devices over LAN / Wi-Fi
let apiBaseUrl = 'http://localhost:8001';

export function setMobileApiBaseUrl(url: string) {
  apiBaseUrl = url.replace(/\/+$/, '');
}

export function getMobileApiBaseUrl(): string {
  return apiBaseUrl;
}

export const MOBILE_DEMO_SONG: StudioSong = {
  id: 'demo-billie-jean',
  source: 'demo',
  title: 'Michael Jackson — Billie Jean',
  artist: 'Michael Jackson',
  durationSec: 295.8,
  tempoBpm: 117.6,
  timeSignature: '4/4',
  keySignature: 'F# minor',
  primaryProgression: 'F#m → G#m → A → G#m → Bm → C#',
  totalBars: 32,
  sections: [
    { id: 'sec-1', name: 'Giriş (Intro)', rawLabel: 'intro', startBar: 1, endBar: 8, startSec: 0, endSec: 16.3 },
    { id: 'sec-2', name: 'Verse 1', rawLabel: 'verse', startBar: 9, endBar: 16, startSec: 16.3, endSec: 32.6 },
    { id: 'sec-3', name: 'Pre-Chorus', rawLabel: 'bridge', startBar: 17, endBar: 24, startSec: 32.6, endSec: 49.0 },
    { id: 'sec-4', name: 'Nakarat (Chorus)', rawLabel: 'chorus', startBar: 25, endBar: 32, startSec: 49.0, endSec: 65.3 }
  ],
  bars: Array.from({ length: 32 }, (_, idx) => {
    const barNum = idx + 1;
    const barDur = 2.04;
    const startSec = Number((idx * barDur).toFixed(2));
    const endSec = Number(((idx + 1) * barDur).toFixed(2));
    const cycle = ['F#m', 'G#m', 'A', 'G#m', 'F#m', 'G#m', 'Bm', 'C#'];
    const chord = cycle[idx % cycle.length];
    return {
      barNumber: barNum,
      startSec,
      endSec,
      durationSec: barDur,
      chord,
      subChords: [{ chord, startSec, endSec, durationSec: barDur }]
    };
  }),
  beats: Array.from({ length: 128 }, (_, bIdx) => ({
    beatNumber: (bIdx % 4) + 1,
    timeSec: Number((bIdx * 0.51).toFixed(2)),
    isDownbeat: bIdx % 4 === 0,
    barIndex: Math.floor(bIdx / 4)
  })),
  stems: {}
};

function cleanChord(raw: string | undefined): string {
  if (!raw || raw === 'N' || raw === 'N.C.') return 'N.C.';
  return raw.replace(':min', 'm').replace(':maj', '').replace(':', '');
}

export async function fetchMobileStudioSong(): Promise<StudioSong | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/api/workbench/studio-bundle`);
    if (!res.ok) return null;
    const bundle = await res.json();
    const state = bundle?.state;
    if (!state?.has_session) return null;

    const s1 = bundle?.stage1 || {};
    const s2 = bundle?.stage2 || {};
    const s3 = bundle?.stage3 || {};

    const trackName = String(state.track_name || 'Stüdyo Oturumu');
    const durationSec = Number(state.duration_sec || 180);
    const tempoBpm = Number(s1.tempo_bpm ? Number(s1.tempo_bpm).toFixed(1) : 120.0);
    const timeSignature = String(s1.time_signature || '4/4');
    const keySignature = String(s2.key_signature || 'F# minor');

    const beats: BeatItem[] = Array.isArray(s1.beats)
      ? s1.beats.map((b: any, idx: number) => ({
          beatNumber: Number(b.beat_number || (idx % 4) + 1),
          timeSec: Number(b.time_sec || 0),
          isDownbeat: Boolean(b.is_downbeat || b.beat_number === 1),
          barIndex: Number(b.bar_index ?? Math.floor(idx / 4))
        }))
      : [];

    const rawBars = Array.isArray(s2.bars) ? s2.bars : [];
    const bars: BarChordItem[] = rawBars.map((b: any, idx: number) => ({
      barNumber: Number(b.bar_number || idx + 1),
      startSec: Number(b.start_sec || 0),
      endSec: Number(b.end_sec || 0),
      durationSec: Number(b.duration_sec || 2.0),
      chord: cleanChord(b.chord),
      subChords: []
    }));

    const rawSections = Array.isArray(s2.sections) ? s2.sections : [];
    const sections: SongSection[] = rawSections.map((sec: any, idx: number) => ({
      id: `sec-${idx + 1}`,
      name: String(sec.name || `Bölüm ${idx + 1}`),
      rawLabel: String(sec.raw_label || 'verse'),
      startBar: Number(sec.start_bar || 1),
      endBar: Number(sec.end_bar || bars.length),
      startSec: Number(sec.start_sec || 0),
      endSec: Number(sec.end_sec || durationSec)
    }));

    const stemIds: StemId[] = ['guitar', 'bass', 'drums', 'vocals', 'piano', 'other'];
    const stems: StudioSong['stems'] = {};
    const cacheBust = encodeURIComponent(trackName);
    const s3Stems = s3?.stems || {};

    for (const id of stemIds) {
      const info = s3Stems[id];
      const detected =
        typeof info?.detected === 'boolean'
          ? info.detected
          : info?.rms_dbfs !== undefined
          ? info.rms_dbfs > -48
          : true;
      stems[id] = {
        url: `${apiBaseUrl}/api/workbench/stream/${id}?track=${cacheBust}`,
        detected,
        rmsDbfs: info?.rms_dbfs,
        presenceLabel: detected ? 'Aktif Sinyal' : 'Ses Bulunmadı'
      };
    }

    return {
      id: `live-${trackName}`,
      source: 'live',
      title: trackName,
      artist: 'KythraStudio Mobile',
      durationSec,
      tempoBpm,
      timeSignature,
      keySignature,
      primaryProgression: s2.primary_progression || 'F#m → G#m → A',
      totalBars: bars.length,
      sections,
      bars,
      beats,
      masterAudioUrl: `${apiBaseUrl}/api/workbench/stream/master?track=${cacheBust}`,
      stems
    };
  } catch {
    return null;
  }
}

export async function analyzeYoutubeFromMobile(
  youtubeUrl: string,
  onStatus: (steps: PipelineProgressStep[], text: string) => void
): Promise<StudioSong> {
  const steps: PipelineProgressStep[] = [
    { stageNum: 1, title: '01 · Ölçü ve Tempo Tespiti', subtitle: 'BPM & Bar Izgarası', status: 'pending' },
    { stageNum: 2, title: '02 · Akor, Ton ve Şarkı Yapısı', subtitle: 'BTC Akor & Ton Analizi', status: 'pending' },
    { stageNum: 3, title: '03 · Makro Kanal Ayırma (6-Kanal)', subtitle: 'BS-RoFormer 6-Stem', status: 'pending' }
  ];

  onStatus([...steps], 'YouTube ses akışı indiriliyor...');
  const ingRes = await fetch(`${apiBaseUrl}/api/workbench/session/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: youtubeUrl.trim() })
  });
  if (!ingRes.ok) {
    throw new Error('YouTube bağlantısı indirilemedi.');
  }

  for (let i = 0; i < 3; i++) {
    steps[i] = { ...steps[i], status: 'running' };
  }
  onStatus([...steps], 'Paralel DAG Motoru çalışıyor (CPU + GPU eşzamanlı)...');
  const r = await fetch(`${apiBaseUrl}/api/workbench/run-all`, { method: 'POST' });
  if (!r.ok) throw new Error('Paralel DAG çözümleme hatası');
  const dagJson = await r.json();
  const resMap = dagJson?.results || {};
  for (let i = 0; i < 3; i++) {
    steps[i] = { ...steps[i], status: 'completed', summary: resMap[i + 1]?.summary };
  }
  onStatus([...steps], 'Paralel DAG çözümlemesi tamamlandı.');

  const song = await fetchMobileStudioSong();
  if (!song) throw new Error('Şarkı verisi alınamadı.');
  return song;
}
```

## `production/mobile/src/components/MobileChordGrid.tsx`

```tsx
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
```

## `production/mobile/src/components/MobileLiveChordCard.tsx`

```tsx
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
```

## `production/mobile/src/components/MobileSectionPills.tsx`

```tsx
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { M3Colors } from '../theme/material3';
import { SongSection } from '../types/studio';

interface MobileSectionPillsProps {
  sections: SongSection[];
  activeSectionId?: string;
  loopedSectionId: string | null;
  onSelectSection: (section: SongSection) => void;
  onToggleLoopSection: (section: SongSection) => void;
}

export const MobileSectionPills: React.FC<MobileSectionPillsProps> = ({
  sections,
  activeSectionId,
  loopedSectionId,
  onSelectSection,
  onToggleLoopSection
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section) => {
          const isActive = section.id === activeSectionId;
          const isLooped = section.id === loopedSectionId;
          return (
            <View
              key={section.id}
              style={[
                styles.pill,
                isLooped
                  ? styles.pillLooped
                  : isActive
                  ? styles.pillActive
                  : styles.pillDefault
              ]}
            >
              <TouchableOpacity
                onPress={() => onSelectSection(section)}
                style={styles.pillMain}
              >
                <Text
                  style={[
                    styles.pillText,
                    isActive || isLooped ? styles.pillTextSelected : null
                  ]}
                >
                  {section.name} ({section.startBar}–{section.endBar})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onToggleLoopSection(section)}
                style={styles.loopBtn}
              >
                <Text
                  style={[
                    styles.loopIcon,
                    isActive || isLooped ? styles.pillTextSelected : null
                  ]}
                >
                  ⟳
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%'
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1
  },
  pillDefault: {
    backgroundColor: M3Colors.surfaceLowest,
    borderColor: M3Colors.outlineVariant
  },
  pillActive: {
    backgroundColor: M3Colors.primary,
    borderColor: M3Colors.primary
  },
  pillLooped: {
    backgroundColor: M3Colors.secondary,
    borderColor: M3Colors.secondary
  },
  pillMain: {
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 7
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: M3Colors.onSurface
  },
  pillTextSelected: {
    color: '#FFFFFF'
  },
  loopBtn: {
    paddingHorizontal: 8,
    paddingVertical: 7
  },
  loopIcon: {
    fontSize: 13,
    fontWeight: '700',
    color: M3Colors.onSurfaceVariant
  }
});
```

## `production/mobile/src/components/MobileStemMixerSheet.tsx`

```tsx
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
```

## `production/mobile/src/react-native-shim.d.ts`

```ts
declare module 'react-native' {
  import * as React from 'react';
  export const View: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;
  export const TouchableOpacity: React.ComponentType<any>;
  export const ScrollView: React.ComponentType<any>;
  export const SafeAreaView: React.ComponentType<any>;
  export const StatusBar: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
  export const StyleSheet: {
    create<T extends Record<string, any>>(styles: T): T;
  };
}
```

## `production/mobile/src/theme/material3.ts`

```ts
/**
 * KythraStudio Google Material 3 Theme Tokens for Android & iOS
 */
export const M3Colors = {
  primary: '#003FB1',
  onPrimary: '#FFFFFF',
  primaryContainer: '#1A56DB',
  primarySoft: '#EEF3FF',

  secondary: '#AC3404',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#FF6E3F',
  secondarySoft: '#FFF1EB',

  tertiary: '#00544B',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#006E64',
  tertiarySoft: '#E6F6F4',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',

  surface: '#F8F9FC',
  surfaceLowest: '#FFFFFF',
  surfaceLow: '#F3F3F7',
  surfaceContainer: '#EDEEF1',
  surfaceHigh: '#E7E8EB',
  onSurface: '#191C1E',
  onSurfaceVariant: '#434654',

  outline: '#737686',
  outlineVariant: '#C3C5D7',
  amberSolo: '#F59E0B'
} as const;
```

## `production/mobile/src/types/studio.ts`

```ts
export type StemId = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other';

export type MixPresetId = 'full' | 'guitar_backing' | 'vocal_karaoke' | 'guitar_focus' | 'rhythm_section';

export interface BeatItem {
  beatNumber: number;
  timeSec: number;
  isDownbeat: boolean;
  barIndex: number;
}

export interface SubChordEvent {
  chord: string;
  startSec: number;
  endSec: number;
  durationSec: number;
}

export interface BarChordItem {
  barNumber: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  chord: string;
  subChords: SubChordEvent[];
}

export interface SongSection {
  id: string;
  name: string;
  rawLabel: string;
  startBar: number;
  endBar: number;
  startSec: number;
  endSec: number;
}

export interface StemChannelState {
  id: StemId;
  label: string;
  role: string;
  color: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  detected: boolean;
  presenceLabel: string;
  rmsDbfs?: number;
  audioUrl?: string;
}

export interface StudioSong {
  id: string;
  source: 'live' | 'demo';
  title: string;
  artist: string;
  durationSec: number;
  tempoBpm: number;
  timeSignature: string;
  keySignature: string;
  primaryProgression: string;
  totalBars: number;
  sections: SongSection[];
  bars: BarChordItem[];
  beats: BeatItem[];
  masterAudioUrl?: string;
  stems: Partial<Record<StemId, {
    url: string;
    detected: boolean;
    rmsDbfs?: number;
    presenceLabel: string;
  }>>;
}

export interface BenchmarkTrackItem {
  id: string;
  name: string;
  category: string;
  duration_sec: number;
  description: string;
}

export interface PipelineProgressStep {
  stageNum: 1 | 2 | 3;
  title: string;
  subtitle: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  summary?: string;
}
```

## `production/mobile/src/utils/musicTheory.ts`

```ts
const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0, 'B#': 0,
  'C#': 1, Db: 1,
  D: 2,
  'D#': 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, 'E#': 5,
  'F#': 6, Gb: 6,
  G: 7,
  'G#': 8, Ab: 8,
  A: 9,
  'A#': 10, Bb: 10,
  B: 11, Cb: 11
};

const TURKISH_NOTE_NAMES: Record<string, string> = {
  C: 'Do',
  'C#': 'Do#',
  Db: 'Reb',
  D: 'Re',
  'D#': 'Re#',
  Eb: 'Mib',
  E: 'Mi',
  F: 'Fa',
  'F#': 'Fa#',
  Gb: 'Solb',
  G: 'Sol',
  'G#': 'Sol#',
  Ab: 'Lab',
  A: 'La',
  'A#': 'La#',
  Bb: 'Sib',
  B: 'Si'
};

export function transposeNote(note: string, semitones: number, preferFlats = false): string {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note;
  const nextIdx = ((idx + semitones) % 12 + 12) % 12;
  return preferFlats ? NOTES_FLAT[nextIdx] : NOTES_SHARP[nextIdx];
}

export function transposeChord(chord: string, semitones: number): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N' || semitones === 0) {
    return chord || '—';
  }

  // Handle slash chords like D/F#
  if (chord.includes('/')) {
    const [main, bass] = chord.split('/');
    return `${transposeChord(main, semitones)}/${transposeChord(bass, semitones)}`;
  }

  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord;
  const [, root, suffix] = match;
  const preferFlats = root.includes('b');
  const nextRoot = transposeNote(root, semitones, preferFlats);
  return `${nextRoot}${suffix}`;
}

export function transposeKeySignature(keySignature: string, semitones: number): string {
  if (!keySignature) return 'C Majör';
  const parts = keySignature.trim().split(/\s+/);
  const root = parts[0] || 'C';
  const modeRaw = (parts[1] || 'major').toLowerCase();
  const isMinor = modeRaw.includes('min') || modeRaw === 'm';
  const transposedRoot = semitones === 0 ? root : transposeNote(root, semitones, root.includes('b'));
  const trNote = TURKISH_NOTE_NAMES[transposedRoot] || transposedRoot;
  return `${transposedRoot} ${isMinor ? 'Minör' : 'Majör'} (${trNote} ${isMinor ? 'Minör' : 'Majör'})`;
}

export interface ChordVoicingInfo {
  symbol: string;
  root: string;
  qualityLabel: string;
  notes: string[];
  frets: Array<number | 'x'>; // 6 strings: E A D G B e
  baseFret: number;
}

const GUITAR_VOICINGS: Record<string, { frets: Array<number | 'x'>; baseFret: number }> = {
  C: { frets: ['x', 3, 2, 0, 1, 0], baseFret: 1 },
  Cm: { frets: ['x', 3, 5, 5, 4, 3], baseFret: 3 },
  'C#': { frets: ['x', 4, 6, 6, 6, 4], baseFret: 4 },
  'C#m': { frets: ['x', 4, 6, 6, 5, 4], baseFret: 4 },
  D: { frets: ['x', 'x', 0, 2, 3, 2], baseFret: 1 },
  Dm: { frets: ['x', 'x', 0, 2, 3, 1], baseFret: 1 },
  'D#': { frets: ['x', 6, 8, 8, 8, 6], baseFret: 6 },
  'D#m': { frets: ['x', 6, 8, 8, 7, 6], baseFret: 6 },
  Eb: { frets: ['x', 6, 8, 8, 8, 6], baseFret: 6 },
  E: { frets: [0, 2, 2, 1, 0, 0], baseFret: 1 },
  Em: { frets: [0, 2, 2, 0, 0, 0], baseFret: 1 },
  F: { frets: [1, 3, 3, 2, 1, 1], baseFret: 1 },
  Fm: { frets: [1, 3, 3, 1, 1, 1], baseFret: 1 },
  'F#': { frets: [2, 4, 4, 3, 2, 2], baseFret: 2 },
  'F#m': { frets: [2, 4, 4, 2, 2, 2], baseFret: 2 },
  G: { frets: [3, 2, 0, 0, 0, 3], baseFret: 1 },
  Gm: { frets: [3, 5, 5, 3, 3, 3], baseFret: 3 },
  'G#': { frets: [4, 6, 6, 5, 4, 4], baseFret: 4 },
  'G#m': { frets: [4, 6, 6, 4, 4, 4], baseFret: 4 },
  A: { frets: ['x', 0, 2, 2, 2, 0], baseFret: 1 },
  Am: { frets: ['x', 0, 2, 2, 1, 0], baseFret: 1 },
  'A#': { frets: ['x', 1, 3, 3, 3, 1], baseFret: 1 },
  Bb: { frets: ['x', 1, 3, 3, 3, 1], baseFret: 1 },
  'A#m': { frets: ['x', 1, 3, 3, 2, 1], baseFret: 1 },
  Bbm: { frets: ['x', 1, 3, 3, 2, 1], baseFret: 1 },
  B: { frets: ['x', 2, 4, 4, 4, 2], baseFret: 2 },
  Bm: { frets: ['x', 2, 4, 4, 3, 2], baseFret: 2 }
};

export function getChordVoicingInfo(chordSymbol: string): ChordVoicingInfo {
  const clean = (!chordSymbol || chordSymbol === 'N.C.' || chordSymbol === '—') ? 'F#m' : chordSymbol.split('/')[0];
  const match = clean.match(/^([A-G][#b]?)(.*)$/);
  const root = match ? match[1] : 'C';
  const suffix = match ? match[2] : '';

  const rootIdx = NOTE_TO_INDEX[root] ?? 0;
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  const isAug = suffix.startsWith('aug');
  const isSus4 = suffix.includes('sus4');
  const isSus2 = suffix.includes('sus2');
  const has7 = suffix.includes('7');
  const hasMaj7 = suffix.includes('maj7');

  const intervals: number[] = [0];
  if (isSus2) intervals.push(2, 7);
  else if (isSus4) intervals.push(5, 7);
  else if (isDim) intervals.push(3, 6);
  else if (isAug) intervals.push(4, 8);
  else if (isMinor) intervals.push(3, 7);
  else intervals.push(4, 7);

  if (hasMaj7) intervals.push(11);
  else if (has7) intervals.push(10);

  const preferFlats = root.includes('b');
  const notes = intervals.map((iv) => {
    const idx = (rootIdx + iv) % 12;
    return preferFlats ? NOTES_FLAT[idx] : NOTES_SHARP[idx];
  });

  let qualityLabel = 'Majör Akor';
  if (isMinor && has7) qualityLabel = 'Minör 7\'li Akor';
  else if (isMinor) qualityLabel = 'Minör Akor';
  else if (hasMaj7) qualityLabel = 'Majör 7\'li Akor';
  else if (has7) qualityLabel = 'Dominant 7\'li Akor';
  else if (isSus4) qualityLabel = 'Sus4 Akor';
  else if (isDim) qualityLabel = 'Diminished Akor';

  const lookupKey = `${root}${isMinor ? 'm' : ''}`;
  const voicing = GUITAR_VOICINGS[clean] || GUITAR_VOICINGS[lookupKey] || GUITAR_VOICINGS.C;

  return {
    symbol: chordSymbol || '—',
    root,
    qualityLabel,
    notes,
    frets: voicing.frets,
    baseFret: voicing.baseFret
  };
}
```

## `production/web/package.json`

```json
{
  "name": "kythra-production-web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@material/web": "^2.5.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.3",
    "vite": "^6.1.0"
  }
}
```

## `production/web/src/api/studioApi.ts`

```ts
import {
  BarChordItem,
  BeatItem,
  FavoriteSongItem,
  LibrarySongItem,
  LyricLineItem,
  LyricRevisionItem,
  LyricsSourceType,
  PrivateUploadedSongItem,
  SongSection,
  StemCategory,
  StudioSong,
  StudioUser
} from '../types/studio';
import { deleteCachedTrackFromClientDb } from '../utils/clientAudioCache';

const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

const SESSION_STORAGE_KEY = 'kythra_isolated_session_id';
const AUTH_TOKEN_STORAGE_KEY = 'kythra_auth_token';

const VALID_STEM_CATEGORIES = new Set<StemCategory>([
  'guitar',
  'bass',
  'drums',
  'vocals',
  'piano',
  'other'
]);

export function getOrCreateClientSessionId(): string {
  if (typeof window === 'undefined') return 'default';
  try {
    let sid = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sid) {
      const rnd =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
          : Math.random().toString(36).slice(2, 14) + Date.now().toString(36);
      sid = `sess_${rnd}`;
      window.localStorage.setItem(SESSION_STORAGE_KEY, sid);
    }
    return sid;
  } catch {
    return 'default';
  }
}

export function getStoredAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function buildStudioHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Session-Id': getOrCreateClientSessionId(),
    'X-Client-App': 'web',
    ...(extra || {})
  };
  const token = getStoredAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

const DEFAULT_WAVEFORM: number[] = Array.from({ length: 120 }, () => 0.2);

export const EMPTY_STUDIO_SONG: StudioSong = {
  id: 'empty-session',
  trackKey: '',
  source: 'empty',
  title: 'Kythra Studio',
  artist: 'KythraStudio',
  durationSec: 0,
  tempoBpm: 120,
  timeSignature: '4/4',
  keySignature: 'C major',
  primaryProgression: '',
  totalBars: 0,
  sections: [],
  bars: [],
  beats: [],
  lyrics: [],
  lyricsSource: 'none',
  lyricsLocked: false,
  lyricsVersion: 1,
  waveformPeaks: DEFAULT_WAVEFORM,
  stage3Status: 'pending',
  stage4Status: 'pending',
  sectionsRefining: false,
  stems: {}
};

function cleanChord(raw: string | undefined): string {
  if (!raw || raw === 'N' || raw === 'N.C.') return 'N.C.';
  return raw.replace(':min', 'm').replace(':maj', '').replace(':', '');
}

function normalizeCategory(raw: unknown, fallbackId: string): StemCategory {
  const candidate = String(raw || fallbackId).toLowerCase() as StemCategory;
  return VALID_STEM_CATEGORIES.has(candidate) ? candidate : 'other';
}

export function bundleToStudioSong(bundle: any): StudioSong | null {
  const state = bundle?.state;
  if (!state?.has_session) return null;

  const s1 = bundle?.stage1 || {};
  const s2 = bundle?.stage2 || {};
  const s3 = bundle?.stage3 || {};

  const trackName = String(state.track_name || 'Studio Session');
  const trackKey = String(state.track_key || `title:${trackName}`);
  const isPrivate = Boolean(bundle?.is_private ?? state?.is_private ?? trackKey.startsWith('sha256:'));
  const durationSec = Number(state.duration_sec || 180);
  const tempoBpm = Number(s1.tempo_bpm ? Number(s1.tempo_bpm).toFixed(1) : 120.0);
  const timeSignature = String(s1.time_signature || '4/4');
  const keySignature = String(s2.key_signature || 'C major');
  const stage3Status = (state?.stages?.['3']?.status || 'pending') as StudioSong['stage3Status'];
  const stage4Status = (state?.stages?.['4']?.status || 'pending') as NonNullable<StudioSong['stage4Status']>;
  const sectionsRefining = Boolean(
    bundle?.sections_refining ??
      state?.sections_refining ??
      (s2 && s2.sections_refined === false)
  );

  const beats: BeatItem[] = Array.from(Array.isArray(s1.beats) ? s1.beats : []).map((b: any, idx: number) => ({
    beatNumber: Number(b.beat_number || (idx % 4) + 1),
    timeSec: Number(b.time_sec || 0),
    isDownbeat: Boolean(b.is_downbeat || b.beat_number === 1),
    barIndex: Number(b.bar_index ?? Math.floor(idx / 4))
  }));

  const rawBars = Array.isArray(s2.bars) ? s2.bars : [];
  const bars: BarChordItem[] = rawBars.map((b: any, idx: number) => {
    const chord = cleanChord(b.chord);
    const subChords = Array.isArray(b.chords)
      ? b.chords.map((sc: any) => ({
          chord: cleanChord(sc.chord),
          startSec: Number(sc.start_sec || b.start_sec || 0),
          endSec: Number(sc.end_sec || b.end_sec || 0),
          durationSec: Number(sc.duration_sec || 0)
        }))
      : [];
    return {
      barNumber: Number(b.bar_number || idx + 1),
      startSec: Number(b.start_sec || 0),
      endSec: Number(b.end_sec || 0),
      durationSec: Number(b.duration_sec || 2.0),
      chord,
      subChords
    };
  });

  if (bars.length === 0) {
    const estBarDur = (4 * 60) / Math.max(40, tempoBpm);
    const count = Math.max(8, Math.ceil(durationSec / estBarDur));
    for (let i = 0; i < count; i++) {
      bars.push({
        barNumber: i + 1,
        startSec: Number((i * estBarDur).toFixed(2)),
        endSec: Number(Math.min(durationSec, (i + 1) * estBarDur).toFixed(2)),
        durationSec: Number(estBarDur.toFixed(2)),
        chord: '—',
        subChords: []
      });
    }
  }

  const rawSections = Array.isArray(s2.sections) ? s2.sections : [];
  const sections: SongSection[] = rawSections.map((sec: any, idx: number) => ({
    id: `sec-${idx + 1}`,
    name: String(sec.name || `Section ${idx + 1}`),
    rawLabel: String(sec.raw_label || 'verse'),
    startBar: Number(sec.start_bar || 1),
    endBar: Number(sec.end_bar || bars.length),
    startSec: Number(sec.start_sec || 0),
    endSec: Number(sec.end_sec || durationSec)
  }));

  if (sections.length === 0) {
    sections.push({
      id: 'sec-1',
      name: 'Intro',
      rawLabel: 'intro',
      startBar: 1,
      endBar: bars.length,
      startSec: 0,
      endSec: durationSec
    });
  }

  const primaryProgression =
    s2.primary_progression ||
    Array.from(new Set(bars.map((b) => b.chord).filter((c) => c !== 'N.C.' && c !== '—')))
      .slice(0, 8)
      .join(' → ') ||
    'N/A';

  const stems: StudioSong['stems'] = {};
  const isStage3Done = stage3Status === 'completed';
  const s3Stems = (s3?.stems && typeof s3.stems === 'object') ? s3.stems : {};
  const defaultStandardIds = ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'];
  const rawOrder: string[] = Array.isArray(s3?.channel_order) && s3.channel_order.length > 0
    ? s3.channel_order
    : Object.keys(s3Stems).length > 0
    ? Object.keys(s3Stems)
    : defaultStandardIds;

  const cacheBust = encodeURIComponent(trackName);
  const sidParam = encodeURIComponent(getOrCreateClientSessionId());
  const hasSourceAudio = Boolean(bundle?.has_source_audio ?? false);
  const stemOrder: string[] = [];

  if (isStage3Done) {
    for (const id of rawOrder) {
      const info = s3Stems[id];
      if (!info && Object.keys(s3Stems).length > 0) continue;
      const detected =
        typeof info?.detected === 'boolean'
          ? info.detected
          : info?.rms_dbfs !== undefined
          ? info.rms_dbfs > -48
          : true;
      const category = normalizeCategory(info?.category, id);
      stemOrder.push(id);
      stems[id] = {
        id,
        category,
        url: hasSourceAudio
          ? `${API_BASE}/api/workbench/stream/${encodeURIComponent(id)}?track=${cacheBust}&session_id=${sidParam}`
          : undefined,
        detected,
        rmsDbfs: info?.rms_dbfs,
        presenceLabel: detected ? 'Active Signal' : 'Silent'
      };
    }
  }

  const waveformPeaks: number[] =
    Array.isArray(bundle?.waveform_peaks) && bundle.waveform_peaks.length > 0
      ? bundle.waveform_peaks
      : Array.isArray(state?.waveform_peaks) && state.waveform_peaks.length > 0
      ? state.waveform_peaks
      : DEFAULT_WAVEFORM;

  const rawLyrics = Array.isArray(bundle?.lyrics)
    ? bundle.lyrics
    : Array.isArray(state?.lyrics)
    ? state.lyrics
    : [];
  const lyrics: LyricLineItem[] = rawLyrics
    .map((ln: any) => ({
      startSec: Number(ln.start_sec ?? ln.startSec ?? 0),
      endSec: Number(ln.end_sec ?? ln.endSec ?? 0),
      text: String(ln.text || '').trim(),
      words: Array.isArray(ln.words)
        ? ln.words
            .map((w: any) => ({
              word: String(w.word || '').trim(),
              startSec: Number(w.start_sec ?? w.startSec ?? 0),
              endSec: Number(w.end_sec ?? w.endSec ?? 0)
            }))
            .filter((w: { word: string }) => w.word.length > 0)
        : undefined
    }))
    .filter((ln: LyricLineItem) => ln.text.length > 0);

  const lyricsSource = (bundle?.lyrics_source || state?.lyrics_source || 'none') as LyricsSourceType;
  const lyricsLocked = Boolean(bundle?.lyrics_locked ?? state?.lyrics_locked ?? (lyricsSource === 'lrclib' && !isPrivate && lyrics.length > 0));
  const lyricsVersion = Number(bundle?.lyrics_version || state?.lyrics_version || 1);
  const lyricsUpdatedBy = bundle?.lyrics_updated_by || state?.lyrics_updated_by || null;

  const parts = trackName.split(/\s+[-—]\s+/);
  const artist = parts.length > 1 ? parts[0].trim() : 'KythraStudio';

  return {
    id: `live-${trackKey}`,
    trackKey,
    isPrivate,
    stemOrder: stemOrder.length > 0 ? stemOrder : undefined,
    source: 'live',
    title: trackName,
    artist,
    durationSec,
    tempoBpm,
    timeSignature,
    keySignature,
    primaryProgression,
    totalBars: bars.length,
    sections,
    bars,
    beats,
    lyrics,
    lyricsSource,
    lyricsLocked,
    lyricsVersion,
    lyricsUpdatedBy,
    waveformPeaks,
    stage3Status,
    stage4Status,
    sectionsRefining,
    pipelineVersion: bundle?.pipeline_version,
    cacheHit: Boolean(bundle?.cache_hit),
    masterAudioUrl: hasSourceAudio
      ? `${API_BASE}/api/workbench/stream/master?track=${cacheBust}&session_id=${sidParam}`
      : undefined,
    stems
  };
}

export async function fetchActiveStudioSong(isPoll = false): Promise<StudioSong | null> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/studio-bundle`, {
      headers: buildStudioHeaders(isPoll ? { 'X-Request-Poll': '1' } : undefined)
    });
    if (!res.ok) return null;
    const bundle = await res.json();
    const s1Done = bundle?.state?.stages?.['1']?.status === 'completed';
    const s2Done = bundle?.state?.stages?.['2']?.status === 'completed';
    if (!s1Done || !s2Done) return null;
    return bundleToStudioSong(bundle);
  } catch {
    return null;
  }
}

export async function fetchLibrarySongs(): Promise<LibrarySongItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/library`, {
      headers: buildStudioHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.songs) ? data.songs : [];
  } catch {
    return [];
  }
}

export async function loadAndPrepareUploadedFile(
  file: File,
  onStatus?: (msg: string) => void
): Promise<StudioSong> {
  onStatus?.('upload');
  const formData = new FormData();
  formData.append('file', file);
  const ingRes = await fetch(`${API_BASE}/api/workbench/session/upload`, {
    method: 'POST',
    headers: buildStudioHeaders(),
    body: formData
  });
  if (!ingRes.ok) {
    const err = await ingRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not upload audio file.');
  }

  onStatus?.('prepare');
  const prepRes = await fetch(`${API_BASE}/api/workbench/prepare-studio?background_stems=true`, {
    method: 'POST',
    headers: buildStudioHeaders()
  });
  if (!prepRes.ok) {
    const err = await prepRes.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not prepare studio.');
  }
  const bundle = await prepRes.json();
  const song = bundleToStudioSong(bundle);
  if (!song) throw new Error('Could not build song bundle.');
  return song;
}

export async function loadCachedSongByTrackKey(trackKey: string): Promise<StudioSong> {
  const res = await fetch(
    `${API_BASE}/api/workbench/session/load-track?track_key=${encodeURIComponent(trackKey)}`,
    {
      method: 'POST',
      headers: buildStudioHeaders()
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Could not load song.');
  }
  const bundle = await res.json();
  const song = bundleToStudioSong(bundle);
  if (!song) throw new Error('Could not parse song.');
  return song;
}

// ============================================================================
// AUTHENTICATION, FAVORITES & LYRICS REVISION API
// ============================================================================
export interface AccountOverviewResponse {
  authenticated: boolean;
  user: StudioUser | null;
  favorites: FavoriteSongItem[];
  private_uploads: PrivateUploadedSongItem[];
}

export async function fetchAccountOverview(): Promise<AccountOverviewResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/workbench/auth/me`, {
      headers: buildStudioHeaders()
    });
    if (!res.ok) {
      return { authenticated: false, user: null, favorites: [], private_uploads: [] };
    }
    const data = await res.json();
    return {
      authenticated: Boolean(data?.authenticated),
      user: data?.user || null,
      favorites: Array.isArray(data?.favorites) ? data.favorites : [],
      private_uploads: Array.isArray(data?.private_uploads) ? data.private_uploads : []
    };
  } catch {
    return { authenticated: false, user: null, favorites: [], private_uploads: [] };
  }
}

export async function registerStudioUser(
  email: string,
  username: string,
  password: string
): Promise<{ token: string; user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/register`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email, username, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Registration failed.');
  }
  setStoredAuthToken(data.token);
  return data;
}

export async function loginStudioUser(
  emailOrUsername: string,
  password: string
): Promise<{ token: string; user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/login`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ email_or_username: emailOrUsername, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Sign in failed.');
  }
  setStoredAuthToken(data.token);
  return data;
}

export function logoutStudioUser(): void {
  setStoredAuthToken(null);
}

export async function updateUserProfile(
  email: string,
  username: string,
  newPassword?: string
): Promise<{ user: StudioUser }> {
  const res = await fetch(`${API_BASE}/api/workbench/auth/profile`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      email: email.trim(),
      username: username.trim(),
      new_password: newPassword && newPassword.trim() ? newPassword : null
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not update profile.');
  }
  return data;
}

export async function toggleFavoriteSong(song: StudioSong): Promise<{
  is_favorite: boolean;
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(`${API_BASE}/api/workbench/account/favorites/toggle`, {
    method: 'POST',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      track_key: song.trackKey,
      title: song.title,
      tempo_bpm: song.tempoBpm,
      key_signature: song.keySignature,
      time_signature: song.timeSignature
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not update favorites.');
  }
  return data;
}

export async function renameUploadedTrack(
  trackKey: string,
  title: string
): Promise<{
  track_key: string;
  title: string;
  private_uploads: PrivateUploadedSongItem[];
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(`${API_BASE}/api/workbench/account/uploads/rename`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ track_key: trackKey, title: title.trim() })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not rename track.');
  }
  return data;
}

export async function deleteUploadedTrack(trackKey: string): Promise<{
  track_key: string;
  reset_active: boolean;
  private_uploads: PrivateUploadedSongItem[];
  favorites: FavoriteSongItem[];
}> {
  const res = await fetch(
    `${API_BASE}/api/workbench/account/uploads?track_key=${encodeURIComponent(trackKey)}`,
    {
      method: 'DELETE',
      headers: buildStudioHeaders()
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not delete track.');
  }
  await deleteCachedTrackFromClientDb(trackKey);
  return data;
}

export async function saveSongLyricsEdit(
  trackKey: string,
  lyrics: LyricLineItem[],
  changeSummary?: string
): Promise<{
  lyrics: LyricLineItem[];
  lyrics_source: LyricsSourceType;
  lyrics_locked: boolean;
  lyrics_version: number;
  lyrics_updated_by: string;
  revisions: LyricRevisionItem[];
}> {
  const payloadLyrics = lyrics.map((ln) => ({
    start_sec: Number(ln.startSec.toFixed(2)),
    end_sec: Number(ln.endSec.toFixed(2)),
    text: ln.text.trim()
  }));
  const res = await fetch(`${API_BASE}/api/workbench/lyrics`, {
    method: 'PUT',
    headers: buildStudioHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      track_key: trackKey,
      lyrics: payloadLyrics,
      change_summary: changeSummary || ''
    })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || 'Could not save lyrics.');
  }
  return {
    ...data,
    lyrics
  };
}

export async function fetchLyricRevisions(trackKey: string): Promise<LyricRevisionItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/workbench/lyrics/revisions?track_key=${encodeURIComponent(trackKey)}`,
      { headers: buildStudioHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.revisions) ? data.revisions : [];
  } catch {
    return [];
  }
}
```

## `production/web/src/App.tsx`

```tsx
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
      const updated = await fetchActiveStudioSong(true);
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
```

## `production/web/src/components/FocusedChordWorkspace.tsx`

```tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  AppLanguage,
  BarChordItem,
  ChordComplexityMode,
  InstrumentType,
  SongSection
} from '../types/studio';
import {
  formatDurationSec,
  transposeChord
} from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { InstrumentChordDiagram } from './InstrumentChordDiagram';
import { InstrumentIcon } from './icons';

interface FocusedChordWorkspaceProps {
  language: AppLanguage;
  sections: SongSection[];
  bars: BarChordItem[];
  activeSection?: SongSection;
  focusedSection?: SongSection;
  loopedSection?: SongSection;
  activeBar: BarChordItem;
  prevBar?: BarChordItem;
  nextBar?: BarChordItem;
  activeBeatInBar: number;
  currentTimeSec: number;
  durationSec: number;
  waveformPeaks: number[];
  loopRangeSec?: [number, number] | null;
  isPlaying: boolean;
  instrument: InstrumentType;
  transposeSemitones: number;
  capo: number;
  chordComplexity: ChordComplexityMode;
  autoFollowSection: boolean;
  isLoopActive: boolean;
  customBarLoopRange: [number, number] | null;
  onSelectSection: (section: SongSection) => void;
  onSelectBar: (bar: BarChordItem) => void;
  onSeekSec?: (sec: number) => void;
  onSetCustomBarLoopRange: (range: [number, number] | null) => void;
  onToggleLoopCurrentSection: () => void;
}

export const FocusedChordWorkspace: React.FC<FocusedChordWorkspaceProps> = ({
  language,
  sections,
  bars,
  activeSection,
  focusedSection,
  loopedSection,
  activeBar,
  prevBar,
  nextBar,
  activeBeatInBar,
  currentTimeSec,
  durationSec,
  waveformPeaks,
  loopRangeSec,
  instrument,
  transposeSemitones,
  capo,
  chordComplexity,
  isLoopActive,
  customBarLoopRange,
  onSelectSection,
  onSelectBar,
  onSeekSec,
  onSetCustomBarLoopRange
}) => {
  const t = TRANSLATIONS[language].workspace;
  const instT = TRANSLATIONS[language].docker.instruments;
  const dockerT = TRANSLATIONS[language].docker;
  const [firstSelectedBarNum, setFirstSelectedBarNum] = useState<number | null>(null);
  const barGridScrollRef = useRef<HTMLDivElement>(null);
  const activeBarCellRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const sectionTabsBarRef = useRef<HTMLDivElement>(null);
  const activeSectionTabRef = useRef<HTMLElement | null>(null);
  const tabDragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startScrollLeft: number;
    hasDragged: boolean;
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false
  });

  const displayedSection = focusedSection || activeSection || sections[0];

  // Clear pending first-bar click when loop is turned off
  useEffect(() => {
    if (!isLoopActive) {
      setFirstSelectedBarNum(null);
    }
  }, [isLoopActive]);

  // Auto-scroll the horizontal section tabs bar so the active section tab is ALWAYS centered
  // whenever it reaches or passes the horizontal middle of the bar!
  useEffect(() => {
    const container = sectionTabsBarRef.current;
    const activeTabEl = activeSectionTabRef.current;
    if (!container || !activeTabEl) return;

    const containerWidth = container.clientWidth;
    if (container.scrollWidth <= containerWidth) return;

    const tabCenter = activeTabEl.offsetLeft + activeTabEl.offsetWidth / 2;
    const targetLeft = Math.max(
      0,
      Math.min(
        container.scrollWidth - containerWidth,
        tabCenter - containerWidth / 2
      )
    );

    if (Math.abs(container.scrollLeft - targetLeft) > 4) {
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    }
  }, [displayedSection?.id, sections.length]);

  const handleTabsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = sectionTabsBarRef.current;
    if (!container) return;
    tabDragStateRef.current = {
      isDown: true,
      startX: e.pageX - container.offsetLeft,
      startScrollLeft: container.scrollLeft,
      hasDragged: false
    };
  };

  const handleTabsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const st = tabDragStateRef.current;
    const container = sectionTabsBarRef.current;
    if (!st.isDown || !container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = x - st.startX;
    if (Math.abs(walk) > 6) {
      st.hasDragged = true;
      e.preventDefault();
      container.scrollLeft = st.startScrollLeft - walk;
    }
  };

  const handleTabsMouseUpOrLeave = () => {
    tabDragStateRef.current.isDown = false;
  };

  // Auto-scroll the 2-row bar grid so the currently playing bar's row is at the TOP
  // and the upcoming row is directly BELOW it!
  useEffect(() => {
    const container = barGridScrollRef.current;
    const activeEl = activeBarCellRef.current;
    if (!container || !activeEl) return;

    const targetTop = Math.max(0, activeEl.offsetTop - 10);
    if (Math.abs(container.scrollTop - targetTop) > 4) {
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  }, [activeBar?.barNumber, displayedSection?.id]);

  const sectionBars = bars.filter((b) =>
    displayedSection
      ? b.barNumber >= displayedSection.startBar && b.barNumber <= displayedSection.endBar
      : true
  );

  const activeChordDisplay = transposeChord(
    activeBar?.chord || 'N',
    transposeSemitones,
    chordComplexity
  );
  const prevChordDisplay = prevBar
    ? transposeChord(prevBar.chord, transposeSemitones, chordComplexity)
    : '—';
  const nextChordDisplay = nextBar
    ? transposeChord(nextBar.chord, transposeSemitones, chordComplexity)
    : t.endChord;

  const handleBarClick = (bar: BarChordItem, e: React.MouseEvent) => {
    // When Loop is active (or Shift key is held), clicking bars selects the loop bar range
    // instead of seeking playback time!
    if (isLoopActive || e.shiftKey) {
      if (firstSelectedBarNum === null) {
        setFirstSelectedBarNum(bar.barNumber);
        onSetCustomBarLoopRange([bar.barNumber, bar.barNumber]);
      } else {
        const start = Math.min(firstSelectedBarNum, bar.barNumber);
        const end = Math.max(firstSelectedBarNum, bar.barNumber);
        onSetCustomBarLoopRange([start, end]);
        setFirstSelectedBarNum(null);
      }
      return;
    }
    onSelectBar(bar);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || durationSec <= 0 || !onSeekSec) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeekSec(ratio * durationSec);
  };

  const progressRatio = durationSec > 0 ? Math.min(1, Math.max(0, currentTimeSec / durationSec)) : 0;
  const loopStartRatio =
    loopRangeSec && durationSec > 0 ? Math.max(0, loopRangeSec[0] / durationSec) : null;
  const loopEndRatio =
    loopRangeSec && durationSec > 0 ? Math.min(1, loopRangeSec[1] / durationSec) : null;

  return (
    <div className="m3-workspace-root">
      {/* 1. CANLI AKOR & ÇOKLU ENSTRÜMAN DİYAGRAMI (Gitar / Piyano / Ukulele) */}
      <section aria-label="Canlı Akor ve Enstrüman Diyagramı" className="m3-hero-grid">
        {/* Sol: Önceki -> ŞU ANKİ -> Sıradaki Bar */}
        <div
          className="m3-surface-card m3-chord-flow-card"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
        >
          <md-elevation></md-elevation>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div className="m3-chord-stage-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="m3-tonal-badge primary">
                {displayedSection?.name || t.sectionFallback}
              </span>
              <span
                className="md-typescale-label-large m3-chord-stage-bar-label"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.barLabel} {activeBar?.barNumber || 1} ·{' '}
                <span className="m3-desktop-bar-time">
                  {formatDurationSec(activeBar?.startSec || 0)}
                </span>
                <span className="m3-mobile-song-time">
                  <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                    {formatDurationSec(currentTimeSec)}
                  </strong>{' '}
                  / {formatDurationSec(durationSec)}
                </span>
              </span>
            </div>

            <div className="m3-beat-dots">
              {[1, 2, 3, 4].map((beat) => {
                const isBeatActive = activeBeatInBar === beat;
                const cls = isBeatActive
                  ? beat === 1
                    ? 'm3-beat-dot active-downbeat'
                    : 'm3-beat-dot active-beat'
                  : 'm3-beat-dot';
                return (
                  <div key={beat} className={cls}>
                    {beat}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="m3-chord-flow-grid">
            <div className="m3-chord-box">
              <span
                className="md-typescale-label-small"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.prevChord} {prevBar ? `#${prevBar.barNumber}` : ''}
              </span>
              <span className="md-typescale-headline-small" style={{ marginTop: '4px' }}>
                {prevChordDisplay}
              </span>
            </div>

            <div className="m3-chord-box active">
              <span className="md-typescale-label-medium">
                {t.currentChord} · {t.barLabel} {activeBar?.barNumber || 1}
              </span>
              <div
                className="md-typescale-display-medium"
                style={{ color: 'var(--md-sys-color-primary)', margin: '4px 0' }}
              >
                {activeChordDisplay}
              </div>
            </div>

            <div className="m3-chord-box next">
              <span className="md-typescale-label-small">
                {t.nextChord} {nextBar ? `#${nextBar.barNumber}` : ''}
              </span>
              <span className="md-typescale-headline-small" style={{ marginTop: '4px' }}>
                {nextChordDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ: Enstrüman Akor Diyagramları */}
        <div
          className="m3-surface-card m3-diagram-stage-card"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}
        >
          <md-elevation></md-elevation>

          {/* Mobil Durum Başlığı: Bölüm + Bar · Canlı Süre / Toplam Süre + 1-2-3-4 Beat Noktaları */}
          <div className="m3-mobile-diagram-status-row">
            <div className="m3-chord-stage-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="m3-tonal-badge primary">
                {displayedSection?.name || t.sectionFallback}
              </span>
              <span
                className="md-typescale-label-large m3-chord-stage-bar-label"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.barLabel} {activeBar?.barNumber || 1} ·{' '}
                <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                  {formatDurationSec(currentTimeSec)}
                </strong>{' '}
                / {formatDurationSec(durationSec)}
              </span>
            </div>

            <div className="m3-beat-dots">
              {[1, 2, 3, 4].map((beat) => {
                const isBeatActive = activeBeatInBar === beat;
                const cls = isBeatActive
                  ? beat === 1
                    ? 'm3-beat-dot active-downbeat'
                    : 'm3-beat-dot active-beat'
                  : 'm3-beat-dot';
                return (
                  <div key={beat} className={cls}>
                    {beat}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="m3-diagram-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <InstrumentIcon instrument={instrument} size={18} />
              </md-icon>
              <span className="md-typescale-title-small">
                {instT[instrument].name} {t.diagramHeaderSuffix}
              </span>
            </div>
            {capo > 0 && instrument !== 'piano' && (
              <span className="m3-tonal-badge secondary">{t.capoBadge} {capo}</span>
            )}
          </div>

          <div className="m3-diagram-pair">
            <InstrumentChordDiagram
              chordSymbol={activeChordDisplay}
              instrument={instrument}
              language={language}
              capo={capo}
              size="sm"
              labelBadge={t.activeDiagramRole}
              highlighted={true}
            />
            <InstrumentChordDiagram
              chordSymbol={nextBar ? nextChordDisplay : activeChordDisplay}
              instrument={instrument}
              language={language}
              capo={capo}
              size="sm"
              labelBadge={t.nextDiagramRole}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* MOBİL WAVEFORM: Akor diyagramları ile şarkı bölüm sekmeleri arasında */}
      <div className="m3-mobile-mid-waveform">
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          role="slider"
          aria-label={dockerT.waveformAria}
          aria-valuemin={0}
          aria-valuemax={Math.round(durationSec)}
          aria-valuenow={Math.round(currentTimeSec)}
          tabIndex={0}
          className="m3-waveform-track"
        >
          {loopStartRatio !== null && loopEndRatio !== null && (
            <div
              className="m3-waveform-loop-overlay"
              style={{
                left: `${loopStartRatio * 100}%`,
                width: `${Math.max(1, (loopEndRatio - loopStartRatio) * 100)}%`
              }}
            />
          )}

          <div className="m3-waveform-bars">
            {waveformPeaks.map((peak, idx) => {
              const barRatio = idx / Math.max(1, waveformPeaks.length - 1);
              const isPlayed = barRatio <= progressRatio;
              const heightPct = Math.max(20, Math.min(92, Math.round(peak * 92)));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    borderRadius: '999px',
                    backgroundColor: isPlayed
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-outline-variant)'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. BİRLEŞTİRİLMİŞ ŞARKI BÖLÜMLERİ (<md-chip-set>) + AKTİF BÖLÜM COMPACT AKOR IZGARASI */}
      <section aria-label={t.sectionsAria} className="m3-unified-section-card">
        <md-elevation></md-elevation>

        {/* Üst Şerit: Resmi Google <md-tabs> & <md-primary-tab> Tek Satır Yatay Otomatik Ortalanan & Sürüklenebilir Sekme Çubuğu */}
        <div
          ref={sectionTabsBarRef}
          className="m3-section-tabs-bar"
          onMouseDown={handleTabsMouseDown}
          onMouseMove={handleTabsMouseMove}
          onMouseUp={handleTabsMouseUpOrLeave}
          onMouseLeave={handleTabsMouseUpOrLeave}
        >
          <md-tabs
            aria-label={t.sectionsAria}
            className="m3-section-md-tabs"
          >
            {sections.map((sec) => {
              const isSelected = displayedSection?.id === sec.id;
              const isSectionLooped =
                isLoopActive &&
                (customBarLoopRange !== null
                  ? customBarLoopRange[0] <= sec.endBar && customBarLoopRange[1] >= sec.startBar
                  : loopedSection?.id === sec.id);

              return (
                <md-primary-tab
                  key={sec.id}
                  ref={(el: HTMLElement | null) => {
                    if (isSelected) {
                      activeSectionTabRef.current = el;
                    }
                  }}
                  active={isSelected || undefined}
                  data-looped={isSectionLooped ? 'true' : 'false'}
                  onClick={(e: React.MouseEvent) => {
                    if (tabDragStateRef.current.hasDragged) {
                      e.preventDefault();
                      e.stopPropagation();
                      tabDragStateRef.current.hasDragged = false;
                      return;
                    }
                    onSelectSection(sec);
                  }}
                >
                  <span>{sec.name}</span>
                  <span
                    className="md-typescale-label-small m3-section-tab-bars"
                    style={{
                      opacity: 0.75,
                      marginLeft: '6px',
                      fontWeight: 400
                    }}
                  >
                    {sec.startBar}–{sec.endBar}
                  </span>
                </md-primary-tab>
              );
            })}
          </md-tabs>
        </div>

        {/* Alt Gövde: Maksimum 2 Satır Görünür, Mevcut Satır Üstte + Sonraki Satır Altta Otomatik Kayan Kompakt 12-Sütunlu Bar Izgarası */}
        <div ref={barGridScrollRef} className="m3-bar-grid">
          {sectionBars.map((bar) => {
            const isCurrentBar = activeBar?.barNumber === bar.barNumber;
            const isNextBar = nextBar?.barNumber === bar.barNumber;
            const isInCustomLoop =
              customBarLoopRange !== null &&
              bar.barNumber >= customBarLoopRange[0] &&
              bar.barNumber <= customBarLoopRange[1];

            const chordLabel = transposeChord(
              bar.chord,
              transposeSemitones,
              chordComplexity
            );

            const barProgressPct = isCurrentBar
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    ((currentTimeSec - bar.startSec) / Math.max(0.1, bar.durationSec)) * 100
                  )
                )
              : 0;

            const isInSectionLoop =
              isLoopActive &&
              customBarLoopRange === null &&
              loopedSection !== undefined &&
              bar.barNumber >= loopedSection.startBar &&
              bar.barNumber <= loopedSection.endBar;

            const isBarLooped = isInCustomLoop || isInSectionLoop;

            const cellClass = [
              'm3-bar-cell',
              isBarLooped ? 'is-looped' : '',
              isCurrentBar ? 'is-current' : '',
              !isCurrentBar && isNextBar ? 'is-next' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={bar.barNumber}
                ref={isCurrentBar ? activeBarCellRef : undefined}
                role="button"
                tabIndex={0}
                onClick={(e) => handleBarClick(bar, e)}
                className={cellClass}
              >
                <md-ripple></md-ripple>
                {isCurrentBar && (
                  <div
                    className="m3-bar-progress-fill"
                    style={{ width: `${barProgressPct}%` }}
                  />
                )}

                <span className="md-typescale-title-medium">{chordLabel}</span>
                <span className="md-typescale-label-small" style={{ opacity: 0.65 }}>
                  #{bar.barNumber}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
```

## `production/web/src/components/FooterDockerControlCenter.tsx`

```tsx
import React, { useEffect, useRef } from 'react';
import {
  AppLanguage,
  ChordComplexityMode,
  DockerPopoverId,
  InstrumentType,
  MixPresetId,
  SongSection,
  StemChannelState,
  StemId
} from '../types/studio';
import { formatDurationSec, transposeKeySignature } from '../utils/musicTheory';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { InstrumentIcon, MetronomeIcon, MixerIcon } from './icons';

interface FooterDockerControlCenterProps {
  language: AppLanguage;
  songTitle: string;
  timeSignature: string;
  tempoBpm: number;
  keySignature: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  waveformPeaks: number[];
  sections: SongSection[];
  activeSection?: SongSection;
  activeBarNumber: number;
  totalBars: number;
  instrument: InstrumentType;
  playbackSpeed: number;
  transposeSemitones: number;
  capo: number;
  chordComplexity: ChordComplexityMode;
  autoFollowSection: boolean;
  isLoopActive: boolean;
  isMetronomeActive: boolean;
  isMasterMuted: boolean;
  loopRangeSec: [number, number] | null;
  customBarLoopRange: [number, number] | null;
  openPopover: DockerPopoverId;
  stage3Status: 'pending' | 'running' | 'completed' | 'error';
  channels: StemChannelState[];
  activePreset: MixPresetId;
  onChangeLanguage: (lang: AppLanguage) => void;
  onTogglePlay: () => void;
  onPrevBar: () => void;
  onSeekSec: (sec: number) => void;
  onToggleLoop: () => void;
  onToggleMetronome: () => void;
  onToggleMasterMute: () => void;
  onClearCustomBarLoop: () => void;
  onSetOpenPopover: (id: DockerPopoverId) => void;
  onChangeInstrument: (inst: InstrumentType) => void;
  onChangeSpeed: (speed: number) => void;
  onChangeTranspose: (semitones: number) => void;
  onChangeCapo: (capo: number) => void;
  onChangeChordComplexity: (mode: ChordComplexityMode) => void;
  onToggleAutoFollowSection: () => void;
  onSetChannelVolume: (id: StemId, volume: number) => void;
  onToggleChannelMute: (id: StemId) => void;
  onToggleChannelSolo: (id: StemId) => void;
  onResetChannels: () => void;
  onApplyMixPreset: (preset: MixPresetId) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 0.85, 1.0, 1.15, 1.25, 1.5];

export const FooterDockerControlCenter: React.FC<FooterDockerControlCenterProps> = ({
  language,
  songTitle,
  timeSignature,
  tempoBpm,
  keySignature,
  isFavorite = false,
  onToggleFavorite,
  isPlaying,
  currentTimeSec,
  durationSec,
  waveformPeaks,
  activeSection,
  instrument,
  playbackSpeed,
  transposeSemitones,
  capo,
  chordComplexity,
  isLoopActive,
  isMetronomeActive,
  isMasterMuted,
  loopRangeSec,
  customBarLoopRange,
  openPopover,
  stage3Status,
  channels,
  activePreset,
  onChangeLanguage,
  onTogglePlay,
  onPrevBar,
  onSeekSec,
  onToggleLoop,
  onToggleMetronome,
  onToggleMasterMute,
  onSetOpenPopover,
  onChangeInstrument,
  onChangeSpeed,
  onChangeTranspose,
  onChangeCapo,
  onChangeChordComplexity,
  onSetChannelVolume,
  onToggleChannelMute,
  onToggleChannelSolo,
  onResetChannels,
  onApplyMixPreset
}) => {
  const t = TRANSLATIONS[language].docker;
  const popT = t.popovers;
  const wsT = TRANSLATIONS[language].workspace;
  const infoT = TRANSLATIONS[language].infoStrip;
  const dockerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-popover-trigger="true"]')) return;
      if (dockerRef.current && !dockerRef.current.contains(target as Node)) {
        onSetOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onSetOpenPopover]);

  const togglePopover = (id: DockerPopoverId) => {
    onSetOpenPopover(openPopover === id ? null : id);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || durationSec <= 0) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeekSec(ratio * durationSec);
  };

  const progressRatio = durationSec > 0 ? Math.min(1, Math.max(0, currentTimeSec / durationSec)) : 0;
  const loopStartRatio =
    loopRangeSec && durationSec > 0 ? Math.max(0, loopRangeSec[0] / durationSec) : null;
  const loopEndRatio =
    loopRangeSec && durationSec > 0 ? Math.min(1, loopRangeSec[1] / durationSec) : null;

  const detectedChannels = channels.filter((c) => c.detected !== false);

  return (
    <footer
      ref={dockerRef}
      aria-label={t.ariaLabel}
      className={`m3-footer-dock-outer ${openPopover ? 'has-open-card' : ''}`}
    >
      {openPopover && (
        <div
          className="m3-card-scrim"
          onClick={() => onSetOpenPopover(null)}
        />
      )}
      <div className="m3-footer-dock-inner">
        {/* =================================================================== */}
        {/* UPWARD POPOVER CARDS (100% @material/web Components)                */}
        {/* =================================================================== */}

        {/* 1. Enstrüman Seçimi Kartı (<md-list> & <md-list-item>) */}
        {openPopover === 'instrument' && (
          <div className="m3-upward-card instrument-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="md-typescale-title-small">{popT.instrumentTitle}</span>
              <md-icon-button onClick={() => onSetOpenPopover(null)}>
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
            <md-list>
              {(['guitar', 'piano', 'ukulele'] as InstrumentType[]).map((inst) => {
                const meta = t.instruments[inst];
                const isSelected = instrument === inst;
                return (
                  <md-list-item
                    key={inst}
                    type="button"
                    onClick={() => {
                      onChangeInstrument(inst);
                      onSetOpenPopover(null);
                    }}
                  >
                    <md-icon slot="start">
                      <InstrumentIcon instrument={inst} size={22} />
                    </md-icon>
                    <div slot="headline">{meta.name}</div>
                    <div slot="supporting-text">{meta.tuning}</div>
                    {isSelected && <md-icon slot="end">check</md-icon>}
                  </md-list-item>
                );
              })}
            </md-list>
          </div>
        )}

        {/* 2. Çalma Hızı Kartı (Tek Satır Yatay Kaydırılabilir Hap Butonlar) */}
        {openPopover === 'speed' && (
          <div className="m3-upward-card speed-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ fontSize: '20px', color: 'var(--md-sys-color-primary)' }}>
                  speed
                </md-icon>
                <span className="md-typescale-title-small">{popT.speedTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {Math.abs(playbackSpeed - 1.0) > 0.01 && (
                  <md-text-button onClick={() => onChangeSpeed(1.0)}>{popT.reset1x}</md-text-button>
                )}
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>
            <div className="m3-speed-pill-row">
              {SPEED_OPTIONS.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  className={`m3-settings-pill-btn ${Math.abs(playbackSpeed - spd) < 0.01 ? 'is-active' : ''}`}
                  onClick={() => onChangeSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Stüdyo Mikseri Kartı (Resmi <md-slider> + Kompakt M/S Butonları, İzole Kelimesi Yok) */}
        {openPopover === 'mixer' && (
          <div className="m3-upward-card mixer-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MixerIcon size={20} />
                </md-icon>
                <span className="md-typescale-title-small">
                  {popT.mixerTitle()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <md-text-button onClick={onResetChannels}>{popT.resetBtn}</md-text-button>
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>

            {stage3Status === 'running' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="md-typescale-body-small">
                  {popT.stage3RunningMsg}
                </span>
                <md-linear-progress indeterminate={true}></md-linear-progress>
              </div>
            )}

            <div className="m3-mixer-rows">
              {detectedChannels.map((ch) => {
                const effectiveVolPct = Math.round((ch.isMuted ? 0 : ch.volume) * 100);
                const standardChannelIds = ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'];
                const isLegacyOrDefaultLabel =
                  !ch.label ||
                  standardChannelIds.includes(ch.id) ||
                  /^(İzole|Kompozit)/i.test(ch.label);
                const channelName =
                  ch.category === 'metronome'
                    ? t.channels.metronome
                    : isLegacyOrDefaultLabel
                    ? t.channels[ch.category] || ch.label
                    : ch.label;
                const rowClass = [
                  'm3-mixer-row',
                  ch.isSolo ? 'is-solo' : '',
                  ch.isMuted ? 'is-muted' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={ch.id} className={rowClass}>
                    <div className="m3-mixer-channel-name">
                      <md-icon style={{ color: ch.color, fontSize: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {ch.category === 'guitar' ? (
                          <InstrumentIcon instrument="guitar" size={18} />
                        ) : ch.category === 'piano' ? (
                          <InstrumentIcon instrument="piano" size={18} />
                        ) : ch.category === 'metronome' ? (
                          <MetronomeIcon size={18} />
                        ) : (
                          ch.icon
                        )}
                      </md-icon>
                      <span className="md-typescale-label-large" title={channelName}>
                        {channelName}
                      </span>
                    </div>

                    <div className="m3-mixer-slider-wrap">
                      <md-slider
                        min={0}
                        max={100}
                        value={effectiveVolPct}
                        onInput={(e: any) => {
                          const val = Number(e.target?.value ?? effectiveVolPct);
                          onSetChannelVolume(ch.id, val / 100);
                        }}
                      ></md-slider>
                      <span className="m3-mixer-vol-pct">
                        %{effectiveVolPct}
                      </span>
                    </div>

                    <div className="m3-mixer-ms-group">
                      <div
                        role="button"
                        tabIndex={0}
                        title={popT.muteTooltip(channelName)}
                        onClick={() => onToggleChannelMute(ch.id)}
                        className={`m3-mixer-ms-btn ${ch.isMuted ? 'is-muted-active' : ''}`}
                      >
                        <md-ripple></md-ripple>
                        M
                      </div>

                      <div
                        role="button"
                        tabIndex={0}
                        title={popT.soloTooltip(channelName)}
                        onClick={() => onToggleChannelSolo(ch.id)}
                        className={`m3-mixer-ms-btn ${ch.isSolo ? 'is-solo-active' : ''}`}
                      >
                        <md-ripple></md-ripple>
                        S
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Stüdyo Ayarları Kartı (Satır Satır Tek Satır: Transpoze + Capo + Akor + Hızlı Miks + Dil) */}
        {openPopover === 'settings' && (
          <div className="m3-upward-card settings-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ fontSize: '20px', color: 'var(--md-sys-color-primary)' }}>
                  settings
                </md-icon>
                <span className="md-typescale-title-small">{popT.settingsTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {(transposeSemitones !== 0 || capo > 0 || Math.abs(playbackSpeed - 1.0) > 0.01) && (
                  <md-text-button
                    onClick={() => {
                      onChangeTranspose(0);
                      onChangeCapo(0);
                      onChangeSpeed(1.0);
                    }}
                  >
                    {popT.resetBtn}
                  </md-text-button>
                )}
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>

            <div className="m3-settings-rows">
              {/* Mobil Özel Satır: Çalma Hızı */}
              <div className="m3-settings-row m3-mobile-only-settings-row">
                <span className="m3-settings-row-label">{t.speedBtnTitle}</span>
                <div className="m3-settings-row-controls">
                  {SPEED_OPTIONS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`m3-settings-pill-btn ${Math.abs(playbackSpeed - spd) < 0.01 ? 'is-active' : ''}`}
                      onClick={() => onChangeSpeed(spd)}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Satır 1: Transpoze */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{t.transposeBtnLabel}</span>
                <div className="m3-settings-row-controls">
                  <div className="m3-settings-stepper">
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={transposeSemitones <= -6}
                      onClick={() => onChangeTranspose(Math.max(-6, transposeSemitones - 1))}
                      aria-label={`${t.transposeBtnLabel} -1`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="m3-settings-value-pill"
                      data-active={transposeSemitones !== 0 ? 'true' : 'false'}
                      title={popT.resetBtn}
                      onClick={() => onChangeTranspose(0)}
                    >
                      {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones} ST
                    </button>
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={transposeSemitones >= 6}
                      onClick={() => onChangeTranspose(Math.min(6, transposeSemitones + 1))}
                      aria-label={`${t.transposeBtnLabel} +1`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Satır 2: Capo */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{wsT.capoBadge}</span>
                <div className="m3-settings-row-controls">
                  <div className="m3-settings-stepper">
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={capo <= 0}
                      onClick={() => onChangeCapo(Math.max(0, capo - 1))}
                      aria-label={`${wsT.capoBadge} -1`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="m3-settings-value-pill"
                      data-active={capo > 0 ? 'true' : 'false'}
                      title={popT.resetBtn}
                      onClick={() => onChangeCapo(0)}
                    >
                      {capo === 0 ? popT.capoNone : popT.capoFretValue(capo)}
                    </button>
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={capo >= 12}
                      onClick={() => onChangeCapo(Math.min(12, capo + 1))}
                      aria-label={`${wsT.capoBadge} +1`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Satır 3: Akor Gösterimi */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.chordVoicingLabel}</span>
                <div className="m3-settings-row-controls">
                  <button
                    type="button"
                    className={`m3-settings-pill-btn ${chordComplexity === 'basic' ? 'is-active' : ''}`}
                    onClick={() => onChangeChordComplexity('basic')}
                  >
                    {popT.chordBasic}
                  </button>
                  <button
                    type="button"
                    className={`m3-settings-pill-btn ${chordComplexity === 'all' ? 'is-active' : ''}`}
                    onClick={() => onChangeChordComplexity('all')}
                  >
                    {popT.chordAll}
                  </button>
                </div>
              </div>

              {/* Satır 4: Hızlı Miks Presetleri */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.quickMixPresetsLabel}</span>
                <div className="m3-settings-row-controls">
                  {(['full', 'guitar_backing', 'guitar_focus', 'vocal_karaoke'] as MixPresetId[]).map(
                    (presetId) => (
                      <button
                        key={presetId}
                        type="button"
                        className={`m3-settings-pill-btn ${activePreset === presetId ? 'is-active' : ''}`}
                        onClick={() => onApplyMixPreset(presetId)}
                      >
                        {t.presets[presetId]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Satır 5: Uygulama Dili */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.languageLabel}</span>
                <div className="m3-settings-row-controls">
                  {SUPPORTED_LANGUAGES.map((langItem) => (
                    <button
                      key={langItem.id}
                      type="button"
                      className={`m3-settings-pill-btn ${language === langItem.id ? 'is-active' : ''}`}
                      onClick={() => onChangeLanguage(langItem.id)}
                    >
                      {langItem.nativeLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MAIN GOOGLE VIDS SINGLE-ROW FOOTER BAR (100% <md-*> Buttons)        */}
        {/* =================================================================== */}
        <div className="m3-footer-bar">
          <md-elevation></md-elevation>

          {/* Mobil Spotify Tarzı Mini Player (Sol: Favori Yıldız + 2 Satırlı Şarkı Adı & 4/4 / BPM / Ton) */}
          <div className="m3-mobile-mini-player">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={onToggleFavorite}
                title={infoT.favoriteTooltip}
                aria-label={infoT.favoriteTooltip}
                className={`m3-fav-star-btn ${isFavorite ? 'is-fav' : ''}`}
              >
                <md-icon style={{ fontSize: '20px' }}>{isFavorite ? 'star' : 'star_outline'}</md-icon>
              </button>
            )}
            <div className="m3-mini-player-info">
              <div className="m3-mini-player-title" title={songTitle}>
                {songTitle}
              </div>
              <div className="m3-mini-player-meta">
                <span className="m3-mini-meta-text">{timeSignature}</span>
                <span className="m3-mini-meta-dot" aria-hidden="true" />
                <span className="m3-mini-meta-text">{Math.round(tempoBpm)} BPM</span>
                <span className="m3-mini-meta-dot" aria-hidden="true" />
                <span className="m3-mini-meta-text is-key">
                  {transposeKeySignature(keySignature, transposeSemitones, language)}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Transport Controls (<md-icon-button> & <md-filled-icon-button>) */}
          <div className="m3-transport-group">
            <div className="m3-playback-core">
              <md-icon-button
                data-role="restart-btn"
                aria-label={t.prevBar}
                title={t.prevBar}
                onClick={onPrevBar}
              >
                <md-icon>skip_previous</md-icon>
              </md-icon-button>

              <md-filled-icon-button
                data-role="play-btn"
                aria-label={isPlaying ? t.pause : t.play}
                title={isPlaying ? t.pause : t.play}
                onClick={onTogglePlay}
              >
                <md-icon>{isPlaying ? 'pause' : 'play_arrow'}</md-icon>
              </md-filled-icon-button>
            </div>

            <div className="m3-practice-toggles">
              {isLoopActive ? (
                <md-filled-icon-button
                  data-loop="active"
                  aria-label={t.loopActive}
                  title={
                    customBarLoopRange
                      ? t.loopBarsTooltip(customBarLoopRange[0], customBarLoopRange[1])
                      : t.loopSectionTooltip(activeSection?.name || wsT.sectionFallback)
                  }
                  onClick={onToggleLoop}
                >
                  <md-icon>repeat</md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-loop="inactive"
                  aria-label="Loop"
                  title={t.loopToggleTooltip}
                  onClick={onToggleLoop}
                >
                  <md-icon>repeat</md-icon>
                </md-filled-tonal-icon-button>
              )}

              {/* Loop Butonunun Sağında Metronom Aç/Kapat İkon Butonu */}
              {isMetronomeActive ? (
                <md-filled-icon-button
                  data-metronome="active"
                  aria-label={t.channels.metronome}
                  title={t.metronomeActiveTooltip}
                  onClick={onToggleMetronome}
                >
                  <md-icon>
                    <MetronomeIcon size={19} />
                  </md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-metronome="inactive"
                  aria-label={t.channels.metronome}
                  title={t.metronomeInactiveTooltip}
                  onClick={onToggleMetronome}
                >
                  <md-icon>
                    <MetronomeIcon size={19} />
                  </md-icon>
                </md-filled-tonal-icon-button>
              )}
            </div>
          </div>

          {/* 2. Center Waveform Scrubber + Google Vids Timestamp */}
          <div className="m3-waveform-group">
            <span className="md-typescale-label-medium" style={{ whiteSpace: 'nowrap' }}>
              <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                {formatDurationSec(currentTimeSec)}
              </strong>{' '}
              / {formatDurationSec(durationSec)}
            </span>

            <div
              ref={waveformRef}
              onClick={handleWaveformClick}
              role="slider"
              aria-label={t.waveformAria}
              aria-valuemin={0}
              aria-valuemax={Math.round(durationSec)}
              aria-valuenow={Math.round(currentTimeSec)}
              tabIndex={0}
              className="m3-waveform-track"
            >
              {loopStartRatio !== null && loopEndRatio !== null && (
                <div
                  className="m3-waveform-loop-overlay"
                  style={{
                    left: `${loopStartRatio * 100}%`,
                    width: `${Math.max(1, (loopEndRatio - loopStartRatio) * 100)}%`
                  }}
                />
              )}

              <div className="m3-waveform-bars">
                {waveformPeaks.map((peak, idx) => {
                  const barRatio = idx / Math.max(1, waveformPeaks.length - 1);
                  const isPlayed = barRatio <= progressRatio;
                  const heightPct = Math.max(20, Math.min(92, Math.round(peak * 92)));
                  return (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: `${heightPct}%`,
                        borderRadius: '999px',
                        backgroundColor: isPlayed
                          ? 'var(--md-sys-color-primary)'
                          : 'var(--md-sys-color-outline-variant)'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Right Official M3 Tool Buttons (Desktop Pill Buttons; Mobile uses SongInfoStrip.m3-mobile-tools-strip) */}
          <div className="m3-tools-group">
            <div className="m3-sound-tools">
              {/* 1. Enstrüman Seçimi */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={openPopover === 'instrument' ? 'true' : 'false'}
                title={`${t.instrumentBtnTitle}: ${t.instruments[instrument].name}`}
                onClick={() => togglePopover('instrument')}
              >
                <md-icon slot="icon">
                  <InstrumentIcon instrument={instrument} size={18} />
                </md-icon>
                <span>{t.instruments[instrument].name}</span>
              </md-filled-tonal-button>

              {/* 2. Hız Ayarı (Sadece masaüstünde ayrı buton; mobilde Ayarlar kartı içinde tek satırda!) */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={
                  openPopover === 'speed' || Math.abs(playbackSpeed - 1.0) > 0.01 ? 'true' : 'false'
                }
                title={t.speedBtnTitle}
                onClick={() => togglePopover('speed')}
              >
                <md-icon slot="icon">speed</md-icon>
                <span>{playbackSpeed}x</span>
              </md-filled-tonal-button>

              {/* 4. Stüdyo Mikseri */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={openPopover === 'mixer' ? 'true' : 'false'}
                title={t.mixerBtnTitle}
                onClick={() => togglePopover('mixer')}
              >
                <md-icon slot="icon">
                  <MixerIcon size={18} />
                </md-icon>
                <span>{t.mixerBtnLabel}</span>
              </md-filled-tonal-button>

              {/* 5. Genel Sesi Aç / Kapat (Master Mute) İkon Butonu */}
              {isMasterMuted ? (
                <md-filled-icon-button
                  data-master-mute="active"
                  aria-label={t.masterUnmuteTitle}
                  title={t.masterUnmuteTitle}
                  onClick={onToggleMasterMute}
                >
                  <md-icon>volume_off</md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-master-mute="inactive"
                  aria-label={t.masterMuteTitle}
                  title={t.masterMuteTitle}
                  onClick={onToggleMasterMute}
                >
                  <md-icon>volume_off</md-icon>
                </md-filled-tonal-icon-button>
              )}
            </div>

            {/* 6. Stüdyo Ayarları */}
            <div className="m3-settings-trigger">
              <md-icon-button
                aria-label={t.settingsBtnTitle}
                title={t.settingsBtnTitle}
                style={{
                  color:
                    openPopover === 'settings' ||
                    transposeSemitones !== 0 ||
                    capo > 0 ||
                    Math.abs(playbackSpeed - 1.0) > 0.01
                      ? 'var(--md-sys-color-primary)'
                      : undefined,
                }}
                onClick={() => togglePopover('settings')}
              >
                <md-icon>settings</md-icon>
              </md-icon-button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

## `production/web/src/components/icons/BrandLogoIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

const BRAND_LOGO_PATHS = (
  <path
    d="M5 12V7M9 17V5M13 19V3M17 15V8M21 12V10"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  />
);

/**
 * Kythra Studio equalizer waveform brand mark.
 */
export const BrandLogoIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {BRAND_LOGO_PATHS}
  </SvgIconBase>
));

BrandLogoIcon.displayName = 'BrandLogoIcon';
```

## `production/web/src/components/icons/index.ts`

```ts
export { SvgIconBase, type IconProps } from './SvgIconBase';
export { BrandLogoIcon } from './BrandLogoIcon';
export { MetronomeIcon } from './MetronomeIcon';
export { MixerIcon } from './MixerIcon';
export { InstrumentIcon, type InstrumentIconProps } from './instruments/InstrumentIcon';
export { GuitarIcon } from './instruments/GuitarIcon';
export { PianoIcon } from './instruments/PianoIcon';
export { UkuleleIcon } from './instruments/UkuleleIcon';
export {
  SourceOriginIcon,
  detectSongSource,
  type SongSourceOrigin
} from './sources/SourceOriginIcon';
```

## `production/web/src/components/icons/instruments/GuitarIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Iconic Electric Guitar (Fender Stratocaster Silhouette)
 * Features:
 * - Asymmetric double-cutaway horns
 * - Cutout negative-space pickguard (fillRule="evenodd")
 * - 3 single-coil pickups and tone/volume control knobs
 * - Signature 6-in-line headstock with tuning pegs
 */
const GUITAR_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Body with Cutout Pickguard (evenodd creates the negative space pickguard) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2,5 V12.2 C10,12 8.5,11.2 7.6,11.6 C6.7,12 6.6,13.2 7.1,14.6 C7.7,16 7.4,17.2 6.6,18.4 C5.4,20 6.4,22.6 9.4,22.9 C11.5,23.1 13.5,23.1 15.2,22.3 C17.5,21.1 17.8,18.5 16.7,17 C15.9,15.8 15.7,14.8 16.4,13.8 C17.1,12.8 16.6,12.2 15.6,12.5 C14.6,12.8 13.6,13 12.8,12.2 V5 H11.2 Z M11.5,13.5 C10.8,13.5 10.2,13.8 9.8,14.2 C9.3,14.8 9.5,15.8 9.2,16.8 C8.8,17.8 8.8,18.8 9.5,19.8 C10.2,20.6 11.8,20.8 13.2,20.5 C14.6,20.2 15.2,19.2 15.2,18.2 C15.2,16.8 14.8,15.5 14.2,14.5 C13.6,13.8 12.5,13.5 11.5,13.5 Z"
    />

    {/* Stratocaster 6-in-line Headstock */}
    <path d="M11.2,5 L10.8,1.7 C10.8,1.2 11.3,0.8 11.8,0.8 C12.6,0.8 13.2,1.1 13.6,1.4 C14.3,1.9 14.1,2.8 13.3,3.3 C12.8,3.6 12.8,4.3 12.8,5 H11.2 Z" />

    {/* 6 Tuning Pegs in a row on the left */}
    <circle cx="10.2" cy="1.5" r="0.45" />
    <circle cx="10.2" cy="2.1" r="0.45" />
    <circle cx="10.2" cy="2.7" r="0.45" />
    <circle cx="10.2" cy="3.3" r="0.45" />
    <circle cx="10.2" cy="3.9" r="0.45" />
    <circle cx="10.2" cy="4.5" r="0.45" />

    {/* 3 Single-Coil Pickups inside the Pickguard */}
    <rect x="10.8" y="14.8" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="16.3" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="17.8" width="2.4" height="0.7" rx="0.3" />

    {/* Control Knobs (Potanslar) */}
    <circle cx="13.8" cy="18.5" r="0.4" />
    <circle cx="13.2" cy="19.5" r="0.4" />
  </g>
);

/**
 * Electric guitar (Stratocaster) icon matching the 24x24 studio outline grid.
 */
export const GuitarIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {GUITAR_PATHS}
  </SvgIconBase>
));

GuitarIcon.displayName = 'GuitarIcon';
```

## `production/web/src/components/icons/instruments/InstrumentIcon.tsx`

```tsx
import React from 'react';
import { InstrumentType } from '../../../types/studio';
import { IconProps } from '../SvgIconBase';
import { GuitarIcon } from './GuitarIcon';
import { PianoIcon } from './PianoIcon';
import { UkuleleIcon } from './UkuleleIcon';

const INSTRUMENT_ICON_REGISTRY: Record<InstrumentType, React.ComponentType<IconProps>> = {
  guitar: GuitarIcon,
  piano: PianoIcon,
  ukulele: UkuleleIcon
};

export interface InstrumentIconProps extends IconProps {
  instrument: InstrumentType;
}

/**
 * Strategy selector rendering the pure SVG icon for the active InstrumentType.
 */
export const InstrumentIcon: React.FC<InstrumentIconProps> = React.memo(({
  instrument,
  ...rest
}) => {
  const Icon = INSTRUMENT_ICON_REGISTRY[instrument] ?? GuitarIcon;
  return <Icon {...rest} />;
});

InstrumentIcon.displayName = 'InstrumentIcon';
```

## `production/web/src/components/icons/instruments/PianoIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

const PIANO_PATHS = (
  <g style={{ fill: 'none' }}>
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      style={{ fill: 'none' }}
    />
    <line x1="7" y1="4" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17" y1="4" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="10.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="15.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-black / 5-white piano keyboard icon matching the 24x24 studio outline grid.
 */
export const PianoIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {PIANO_PATHS}
  </SvgIconBase>
));

PianoIcon.displayName = 'PianoIcon';
```

## `production/web/src/components/icons/instruments/UkuleleIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Solid Silhouette Soprano/Concert Ukulele Icon
 * Matches the guitar's modern filled silhouette aesthetic:
 * - Solid figure-8 body with negative space (evenodd) cutout soundhole and bridge
 * - Neck with 2 frets and rounded heel
 * - Crown headstock with 4 tuning pegs (2 per side)
 * - Cohesive 43-degree diagonal studio angle
 */
const UKULELE_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Solid Ukulele Body with Negative-Space Soundhole & Bridge (evenodd) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8,9.5 C9.8,9.2 7.6,9.5 6.6,11.2 C5.6,12.8 6.4,14.5 5.5,16 C4.2,18 4.8,21.5 8,22.8 C10.5,23.5 13.5,23.5 16,22.8 C19.2,21.5 19.8,18 18.5,16 C17.6,14.5 18.4,12.8 17.4,11.2 C16.4,9.5 14.2,9.2 13.2,9.5 V10.5 C13.2,11.8 10.8,11.8 10.8,10.5 Z M12,14.5 C10.9,14.5 10,15.4 10,16.5 C10,17.6 10.9,18.5 12,18.5 C13.1,18.5 14,17.6 14,16.5 C14,15.4 13.1,14.5 12,14.5 Z M9.5,20.2 H14.5 V21.2 H9.5 Z"
    />

    {/* Neck & Frets */}
    <path
      d="M10.8,4.5 V9.5 M13.2,4.5 V9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="10.8" y1="6.2" x2="13.2" y2="6.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <line x1="10.8" y1="7.8" x2="13.2" y2="7.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M10.8,9.5 C10.8,11 13.2,11 13.2,9.5" stroke="currentColor" strokeWidth="1.5" fill="none" />

    {/* Crown Headstock */}
    <path d="M10.4,4.5 C9.8,3.5 10.2,1.8 12,1.2 C13.8,1.8 14.2,3.5 13.6,4.5 Z" />

    {/* 4 Tuning Pegs (2 Left, 2 Right) */}
    <line x1="10.6" y1="2.5" x2="9.2" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="10.8" y1="3.8" x2="9.4" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.4" y1="2.5" x2="14.8" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.2" y1="3.8" x2="14.6" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

/**
 * 4-peg rounded figure-8 ukulele icon matching the 24x24 studio outline grid.
 */
export const UkuleleIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {UKULELE_PATHS}
  </SvgIconBase>
));

UkuleleIcon.displayName = 'UkuleleIcon';
```

## `production/web/src/components/icons/MetronomeIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Option A: Dynamic Mechanical Metronome Icon (Studio Standard)
 * Features an open-pyramid body, center tempo guide, and an angled swinging pendulum arm
 * with a high-readability counterweight bob.
 *
 * Explicit `fill="none"` and `style={{ fill: 'none' }}` guarantees that web-component host
 * styles (like `<md-icon>`'s `fill: currentColor`) will never fill the body into a solid block.
 */
const METRONOME_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* Center tempo scale guide */}
    <path
      d="M12 11.5V9"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Swinging pendulum arm */}
    <path
      d="M12 17.2L18.8 10.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Open Pyramid Metronome Frame */}
    <path
      d="M15.1 5.7L14.85 4.98C14.4 3.75 13.25 3 12 3C10.75 3 9.6 3.75 9.15 4.98L4.42 19.69C4.15 20.5 4.76 21 5.37 21H18.63C19.24 21 19.85 20.5 19.58 19.69L18.45 16.2"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ fill: 'none' }}
    />

    {/* Counterweight Bob (Pirinç Ağırlık) */}
    <circle
      cx="19.8"
      cy="9.4"
      r="2"
      fill="currentColor"
      stroke="none"
      style={{ fill: 'currentColor' }}
    />
  </g>
);

/**
 * Classic mechanical pyramid metronome icon with angled swinging pendulum and weight.
 */
export const MetronomeIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {METRONOME_PATHS}
  </SvgIconBase>
));

MetronomeIcon.displayName = 'MetronomeIcon';
```

## `production/web/src/components/icons/MixerIcon.tsx`

```tsx
import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Clean 3-Channel Studio Fader Icon
 * Spacious vertical rails with staggered horizontal slider caps:
 * - Zero sub-pixel gaps or cluttered backing boxes at 18px-20px
 * - Explicit fill overrides guard against <md-icon> host CSS fill inheritance
 */
const MIXER_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* 3 Spacious Vertical Fader Rails */}
    <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="18" y1="4" x2="18" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />

    {/* 3 Staggered Horizontal Studio Fader Caps */}
    <rect x="3.7" y="7.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="9.7" y="13.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="15.7" y="6.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-fader studio mixer icon matching the 24x24 studio outline grid.
 */
export const MixerIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {MIXER_PATHS}
  </SvgIconBase>
));

MixerIcon.displayName = 'MixerIcon';
```

## `production/web/src/components/icons/sources/SourceOriginIcon.tsx`

```tsx
import React from 'react';

export type SongSourceOrigin = 'upload' | 'audio';

/**
 * Determines the origin badge type for a song from its track key.
 */
export function detectSongSource(
  trackKey?: string
): SongSourceOrigin {
  if (trackKey && trackKey.startsWith('sha256:')) {
    return 'upload';
  }
  return 'audio';
}

const SOURCE_ICON_REGISTRY: Record<SongSourceOrigin, React.ReactElement> = {
  upload: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>audio_file</md-icon>,
  audio: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>music_note</md-icon>
};

/**
 * Renders the visual source indicator (uploaded audio file or music note).
 */
export const SourceOriginIcon: React.FC<{ source: SongSourceOrigin }> = React.memo(({ source }) => (
  SOURCE_ICON_REGISTRY[source] ?? SOURCE_ICON_REGISTRY.audio
));

SourceOriginIcon.displayName = 'SourceOriginIcon';
```

## `production/web/src/components/icons/SvgIconBase.tsx`

```tsx
import React from 'react';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  title?: string;
}

interface SvgIconBaseProps extends IconProps {
  children: React.ReactNode;
}

/**
 * Shared accessible SVG primitive enforcing consistent viewBox, sizing,
 * stroke-less defaults, and automatic ARIA attributes across studio icons.
 */
export const SvgIconBase: React.FC<SvgIconBaseProps> = React.memo(({
  size = 20,
  width,
  height,
  viewBox = '0 0 24 24',
  fill = 'none',
  title,
  children,
  ...rest
}) => (
  <svg
    width={width ?? size}
    height={height ?? size}
    viewBox={viewBox}
    fill={fill}
    role={title ? 'img' : undefined}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : true}
    {...rest}
  >
    {children}
  </svg>
));

SvgIconBase.displayName = 'SvgIconBase';
```

## `production/web/src/components/InstrumentChordDiagram.tsx`

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage, InstrumentType } from '../types/studio';
import { FretPositionVariation, getMultiInstrumentChordInfo } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';

interface InstrumentChordDiagramProps {
  chordSymbol: string;
  instrument: InstrumentType;
  language?: AppLanguage;
  capo?: number;
  size?: 'sm' | 'md' | 'lg';
  labelBadge?: string;
  highlighted?: boolean;
}

const PIANO_WHITE_PCS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
const PIANO_WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
const PIANO_BLACK_KEYS: { midi: number; leftIndex: number; name: string }[] = [
  { midi: 1, leftIndex: 0, name: 'C#' },
  { midi: 3, leftIndex: 1, name: 'D#' },
  { midi: 6, leftIndex: 3, name: 'F#' },
  { midi: 8, leftIndex: 4, name: 'G#' },
  { midi: 10, leftIndex: 5, name: 'A#' },
  { midi: 13, leftIndex: 7, name: 'C#' },
  { midi: 15, leftIndex: 8, name: 'D#' },
  { midi: 18, leftIndex: 10, name: 'F#' },
  { midi: 20, leftIndex: 11, name: 'G#' },
  { midi: 22, leftIndex: 12, name: 'A#' }
];

export const InstrumentChordDiagram: React.FC<InstrumentChordDiagramProps> = ({
  chordSymbol,
  instrument,
  language = 'en',
  capo = 0,
  labelBadge,
  highlighted = false
}) => {
  const t = TRANSLATIONS[language].workspace;
  const info = getMultiInstrumentChordInfo(chordSymbol, capo);
  const positions: FretPositionVariation[] =
    instrument === 'ukulele' ? info.ukulelePositions : info.guitarPositions;

  const [posIndex, setPosIndex] = useState(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPosIndex(0);
  }, [chordSymbol, instrument, capo]);

  const currentPos = positions[posIndex] || positions[0];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (positions.length <= 1) return;
    if ((e.target as HTMLElement | null)?.closest('.m3-diagram-pos-dot')) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null || positions.length <= 1) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // Sola sürükleme -> Sonraki pozisyon
        setPosIndex((prev) => (prev + 1) % positions.length);
      } else {
        // Sağa sürükleme -> Önceki pozisyon
        setPosIndex((prev) => (prev - 1 + positions.length) % positions.length);
      }
      return;
    }

    if (
      Math.abs(dx) < 10 &&
      Math.abs(dy) < 10 &&
      !(e.target as HTMLElement | null)?.closest('.m3-diagram-pos-dot')
    ) {
      // Tıklama / dokunma -> Sonraki basılış varyasyonuna geç
      setPosIndex((prev) => (prev + 1) % positions.length);
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  const renderLeftInfoColumn = (showPositionDots: boolean) => (
    <div className="m3-diagram-info-col">
      {capo > 0 && instrument !== 'piano' && (
        <span className="m3-diagram-capo-pill" title={`${t.capoBadge}: ${capo}`}>
          {t.capoBadge}: {capo}
        </span>
      )}
      <span className="m3-diagram-role-label">
        {labelBadge || (highlighted ? t.activeDiagramRole : t.nextDiagramRole)}
      </span>
      <span className="m3-diagram-chord-title">{info.symbol}</span>

      {showPositionDots && positions.length > 1 && (
        <div className="m3-diagram-pos-dots">
          {positions.map((_, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setPosIndex(idx);
              }}
              title={t.positionTooltip(idx + 1, positions[idx].baseFret)}
              className={`m3-diagram-pos-dot ${idx === posIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (instrument === 'piano') {
    const activeMidis = new Set(info.pianoMidiKeys);
    const keyWidth = 14;
    const keyHeight = 96;
    const blackWidth = 9.5;
    const blackHeight = 58;
    const totalW = PIANO_WHITE_PCS.length * keyWidth;

    return (
      <div className={`m3-diagram-card is-piano ${highlighted ? 'highlighted' : ''}`}>
        {renderLeftInfoColumn(false)}

        <div className="m3-diagram-visual-col">
          <svg
            width={totalW}
            height={keyHeight + 18}
            viewBox={`0 0 ${totalW} ${keyHeight + 18}`}
            className="m3-diagram-svg m3-diagram-svg-piano"
            style={{ userSelect: 'none', overflow: 'visible' }}
          >
            {PIANO_WHITE_PCS.map((midi, i) => {
              const isActive = activeMidis.has(midi) || activeMidis.has(midi % 12);
              const x = i * keyWidth;
              return (
                <g key={`w-${midi}`}>
                  <rect
                    x={x + 0.5}
                    y={0}
                    width={keyWidth - 1}
                    height={keyHeight}
                    rx={3}
                    fill={isActive ? 'var(--md-sys-color-primary-container)' : '#FFFFFF'}
                    stroke="var(--md-sys-color-outline-variant)"
                    strokeWidth={1}
                  />
                  {isActive && (
                    <>
                      <circle
                        cx={x + keyWidth / 2}
                        cy={keyHeight - 14}
                        r={4.5}
                        fill="var(--md-sys-color-primary)"
                      />
                      <text
                        x={x + keyWidth / 2}
                        y={keyHeight + 13}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight="600"
                        fill="var(--md-sys-color-primary)"
                      >
                        {PIANO_WHITE_NAMES[i]}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {PIANO_BLACK_KEYS.map((bk) => {
              const isActive = activeMidis.has(bk.midi) || activeMidis.has(bk.midi % 12);
              const x = (bk.leftIndex + 1) * keyWidth - blackWidth / 2;
              return (
                <g key={`b-${bk.midi}`}>
                  <rect
                    x={x}
                    y={0}
                    width={blackWidth}
                    height={blackHeight}
                    rx={2.5}
                    fill={isActive ? 'var(--md-sys-color-primary)' : '#1F1F1F'}
                  />
                  {isActive && (
                    <circle
                      cx={x + blackWidth / 2}
                      cy={blackHeight - 10}
                      r={3.2}
                      fill="var(--md-sys-color-on-primary)"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  const numStrings = instrument === 'ukulele' ? 4 : 6;
  const numFrets = 5;
  const stringGap = 18;
  const fretGap = 19;
  const padLeft = 22;
  const padRight = 12;
  const padTop = 20;
  const padBottom = 18;
  const boardW = (numStrings - 1) * stringGap;
  const boardH = numFrets * fretGap;
  const svgW = padLeft + boardW + padRight;
  const svgH = padTop + boardH + padBottom;

  return (
    <div
      className={`m3-diagram-card ${highlighted ? 'highlighted' : ''} ${positions.length > 1 ? 'is-swipeable' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      {renderLeftInfoColumn(true)}

      <div className="m3-diagram-visual-col">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="m3-diagram-svg m3-diagram-svg-fret"
          style={{ userSelect: 'none', overflow: 'visible' }}
        >
          {currentPos.baseFret > 1 && (
            <text
              x={padLeft - 7}
              y={padTop + fretGap * 0.65}
              textAnchor="end"
              fontSize={11}
              fontWeight="600"
              fill="var(--md-sys-color-primary)"
            >
              {currentPos.baseFret}fr
            </text>
          )}

          {Array.from({ length: numFrets + 1 }).map((_, fIdx) => {
            const y = padTop + fIdx * fretGap;
            const isNut = fIdx === 0 && currentPos.baseFret === 1;
            return (
              <line
                key={`f-${fIdx}`}
                x1={padLeft}
                y1={y}
                x2={padLeft + boardW}
                y2={y}
                stroke={isNut ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-outline-variant)'}
                strokeWidth={isNut ? 3 : 1.1}
                strokeLinecap="round"
              />
            );
          })}

          {Array.from({ length: numStrings }).map((_, sIdx) => {
            const x = padLeft + sIdx * stringGap;
            return (
              <line
                key={`s-${sIdx}`}
                x1={x}
                y1={padTop}
                x2={x}
                y2={padTop + boardH}
                stroke="var(--md-sys-color-outline)"
                strokeWidth={1.2}
              />
            );
          })}

          {currentPos.frets.slice(0, numStrings).map((fret, sIdx) => {
            const x = padLeft + sIdx * stringGap;
            const noteLbl = currentPos.stringNotes[sIdx] || '';
            return (
              <g key={`m-${sIdx}`}>
                {fret === 'x' && (
                  <text
                    x={x}
                    y={padTop - 6}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="600"
                    fill="var(--md-sys-color-on-surface-variant)"
                  >
                    ×
                  </text>
                )}
                {fret === 0 && (
                  <circle
                    cx={x}
                    cy={padTop - 9}
                    r={3.8}
                    fill="none"
                    stroke="var(--md-sys-color-primary)"
                    strokeWidth={1.6}
                  />
                )}
                <text
                  x={x}
                  y={padTop + boardH + 13}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight="600"
                  fill={
                    fret === 'x'
                      ? 'var(--md-sys-color-outline)'
                      : 'var(--md-sys-color-on-surface)'
                  }
                >
                  {noteLbl}
                </text>
              </g>
            );
          })}

          {currentPos.barre && (
            <rect
              x={padLeft + currentPos.barre.fromString * stringGap - 6}
              y={padTop + (currentPos.barre.fret - 0.5) * fretGap - 6}
              width={(currentPos.barre.toString - currentPos.barre.fromString) * stringGap + 12}
              height={12}
              rx={6}
              fill="var(--md-sys-color-primary)"
              opacity={0.9}
            />
          )}

          {currentPos.frets.slice(0, numStrings).map((fret, sIdx) => {
            if (typeof fret !== 'number' || fret <= 0) return null;
            const x = padLeft + sIdx * stringGap;
            const y = padTop + (fret - 0.5) * fretGap;
            const fingerNum = currentPos.fingers[sIdx] || '';

            return (
              <g key={`dot-${sIdx}`}>
                <circle cx={x} cy={y} r={6.5} fill="var(--md-sys-color-primary)" />
                {fingerNum ? (
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontWeight="600"
                    fill="var(--md-sys-color-on-primary)"
                  >
                    {fingerNum}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
```

## `production/web/src/components/KaraokeLyricsStage.tsx`

```tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppLanguage,
  LyricLineItem,
  LyricRevisionItem,
  LyricsSourceType,
  SongSection
} from '../types/studio';
import { formatDurationSec } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchLyricRevisions, saveSongLyricsEdit } from '../api/studioApi';

interface KaraokeLyricsStageProps {
  language: AppLanguage;
  trackKey: string;
  sections: SongSection[];
  lyrics: LyricLineItem[];
  lyricsSource?: LyricsSourceType;
  lyricsLocked?: boolean;
  lyricsVersion?: number;
  lyricsUpdatedBy?: string | null;
  currentTimeSec: number;
  onSeekSec?: (sec: number) => void;
  onLyricsUpdated?: (
    nextLyrics: LyricLineItem[],
    nextVersion: number,
    updatedBy: string
  ) => void;
}

export const KaraokeLyricsStage: React.FC<KaraokeLyricsStageProps> = ({
  language,
  trackKey,
  sections,
  lyrics,
  lyricsSource = 'none',
  lyricsLocked = false,
  lyricsVersion = 1,
  lyricsUpdatedBy = null,
  currentTimeSec,
  onSeekSec,
  onLyricsUpdated
}) => {
  const t = TRANSLATIONS[language].karaoke;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const windowFirstRef = useRef<HTMLDivElement>(null);
  const windowSecondRef = useRef<HTMLDivElement>(null);
  const windowThirdRef = useRef<HTMLDivElement>(null);

  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftLines, setDraftLines] = useState<LyricLineItem[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [revisions, setRevisions] = useState<LyricRevisionItem[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length > 0 && !sections.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const activeLineIndex = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return -1;
    if (currentTimeSec < lyrics[0].startSec) {
      return 0;
    }
    let foundIdx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTimeSec >= lyrics[i].startSec) {
        foundIdx = i;
      } else {
        break;
      }
    }
    return foundIdx;
  }, [lyrics, currentTimeSec]);

  const windowStartIdx = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return 0;
    const maxStart = Math.max(0, lyrics.length - 3);
    return activeLineIndex <= 0 ? 0 : Math.min(maxStart, activeLineIndex - 1);
  }, [lyrics, activeLineIndex]);

  // Auto-scroll the 3-line viewport (Previous -> Current -> Next) and resize dynamically for wrapped lyrics!
  useEffect(() => {
    const measureAndScroll = () => {
      const container = scrollContainerRef.current;
      const firstEl = windowFirstRef.current;
      if (!container || !firstEl || isEditorOpen) return;

      const els = [
        windowFirstRef.current,
        windowSecondRef.current,
        windowThirdRef.current
      ].filter((el): el is HTMLDivElement => Boolean(el));

      const cs = window.getComputedStyle(container);
      const padTop = parseFloat(cs.paddingTop) || 8;
      const padBottom = parseFloat(cs.paddingBottom) || 8;
      const rowGap = parseFloat(cs.rowGap || cs.gap) || 6;

      const totalHeight =
        els.reduce((acc, el) => acc + el.offsetHeight, 0) +
        rowGap * Math.max(0, els.length - 1) +
        padTop +
        padBottom;

      setViewportHeight((prev) => {
        const nextH = Math.max(56, Math.ceil(totalHeight));
        return prev === nextH ? prev : nextH;
      });

      const targetTop = Math.max(0, firstEl.offsetTop - padTop);
      if (Math.abs(container.scrollTop - targetTop) > 3) {
        container.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    };

    const rafId = requestAnimationFrame(measureAndScroll);
    window.addEventListener('resize', measureAndScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureAndScroll);
    };
  }, [activeLineIndex, windowStartIdx, lyrics, isEditorOpen]);

  const isOfficialLocked = Boolean(lyricsLocked && lyricsSource === 'lrclib' && lyrics.length > 0);

  const handleOpenEditor = () => {
    if (isOfficialLocked) return;
    const initial = lyrics.map((l) => ({ ...l }));
    setDraftLines(initial);
    const currentSec =
      sections.find((s) => currentTimeSec >= s.startSec && currentTimeSec <= s.endSec) ||
      sections[0];
    if (currentSec) {
      setSelectedSectionId(currentSec.id);
    }
    setIsEditorOpen(true);
    setSaveError(null);
    fetchLyricRevisions(trackKey).then(setRevisions);
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleAddLineAtCurrentTime = () => {
    const startSec = Number(currentTimeSec.toFixed(2));
    const endSec = Number((startSec + 4.0).toFixed(2));
    setDraftLines((prev) => {
      const next = [...prev, { startSec, endSec, text: '' }];
      next.sort((a, b) => a.startSec - b.startSec);
      return next;
    });
  };

  const handleAddLineToSection = (sec: SongSection) => {
    const sectionLines = draftLines.filter(
      (l) => l.startSec >= sec.startSec - 0.1 && l.startSec <= sec.endSec + 0.1
    );
    const lastLine = sectionLines[sectionLines.length - 1];
    const startSec = lastLine
      ? Number(Math.min(sec.endSec - 0.5, lastLine.startSec + 3.5).toFixed(2))
      : Number(sec.startSec.toFixed(2));
    const endSec = Number(Math.min(sec.endSec, startSec + 3.5).toFixed(2));
    setDraftLines((prev) => {
      const next = [...prev, { startSec, endSec, text: '' }];
      next.sort((a, b) => a.startSec - b.startSec);
      return next;
    });
  };

  const handleStampLineToCurrentTime = (index: number) => {
    const stamped = Number(currentTimeSec.toFixed(2));
    setDraftLines((prev) => {
      const copy = prev.map((l, idx) =>
        idx === index
          ? {
              ...l,
              startSec: stamped,
              endSec: Math.max(stamped + 2.5, l.endSec)
            }
          : l
      );
      copy.sort((a, b) => a.startSec - b.startSec);
      return copy;
    });
  };

  const handleSaveLyrics = async () => {
    const cleaned = draftLines
      .map((l) => ({
        startSec: Number(l.startSec),
        endSec: Number(Math.max(l.startSec + 0.8, l.endSec)),
        text: l.text.trim()
      }))
      .filter((l) => l.text.length > 0)
      .sort((a, b) => a.startSec - b.startSec);

    // Automatically chain endSec to next line's startSec for smooth karaoke progress fill
    for (let i = 0; i < cleaned.length - 1; i++) {
      cleaned[i].endSec = Number(Math.max(cleaned[i].startSec + 0.5, cleaned[i + 1].startSec).toFixed(2));
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveSongLyricsEdit(trackKey, cleaned);
      onLyricsUpdated?.(cleaned, res.lyrics_version, res.lyrics_updated_by);
      setRevisions(res.revisions || []);
      setIsEditorOpen(false);
    } catch (err: any) {
      setSaveError(err?.message || 'Could not save lyrics.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section aria-label={t.ariaLabel} className="m3-karaoke-card">
      <md-elevation></md-elevation>

      {/* Top Mini Toolbar inside Lyrics Card: Only shown when lyrics are NOT locked by verified LRCLIB */}
      {!isOfficialLocked && (
        <div className="m3-karaoke-header-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <md-icon style={{ fontSize: '16px', color: 'var(--md-sys-color-primary)' }}>
              lyrics
            </md-icon>
            <span className="md-typescale-label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t.versionBadge(lyricsVersion, lyricsUpdatedBy)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => (isEditorOpen ? setIsEditorOpen(false) : handleOpenEditor())}
              className="m3-karaoke-edit-pill"
            >
              <md-icon style={{ fontSize: '14px' }}>{isEditorOpen ? 'close' : 'edit_note'}</md-icon>
              <span>
                {isEditorOpen
                  ? t.cancelBtn
                  : lyrics.length > 0
                  ? t.editLyricsBtn
                  : t.addLyricsBtn}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION-BASED LIVE LYRIC EDITOR PANEL */}
      {isEditorOpen && !isOfficialLocked && (
        <div className="m3-lyric-editor-panel">
          <div className="m3-lyric-editor-top">
            <span className="md-typescale-title-small">{t.editorTitle}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="m3-mini-action-pill"
                onClick={() => {
                  setShowRevisions((v) => !v);
                  fetchLyricRevisions(trackKey).then(setRevisions);
                }}
              >
                <md-icon style={{ fontSize: '14px' }}>history</md-icon>
                <span>{t.revisionsTitle} ({revisions.length})</span>
              </button>
              <button
                type="button"
                className="m3-mini-action-pill primary"
                onClick={handleAddLineAtCurrentTime}
              >
                <md-icon style={{ fontSize: '14px' }}>add_circle</md-icon>
                <span>{t.addLineAtCurrentTime(formatDurationSec(currentTimeSec))}</span>
              </button>
            </div>
          </div>

          {/* Section Filter Chips so user can jump & add lines per Song Section (Intro, Verse A, Chorus 1...) */}
          {sections.length > 0 && (
            <div className="m3-lyric-editor-sections">
              {sections.map((sec) => {
                const isSecSelected = selectedSection?.id === sec.id;
                const countInSec = draftLines.filter(
                  (l) => l.startSec >= sec.startSec - 0.2 && l.startSec < sec.endSec + 0.2
                ).length;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    className={`m3-account-seg-btn ${isSecSelected ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      onSeekSec?.(sec.startSec);
                    }}
                  >
                    {sec.name} ({countInSec})
                  </button>
                );
              })}

              {selectedSection && (
                <button
                  type="button"
                  className="m3-mini-action-pill"
                  onClick={() => handleAddLineToSection(selectedSection)}
                >
                  {t.addLineToSection(selectedSection.name)}
                </button>
              )}
            </div>
          )}

          {saveError && (
            <div
              className="md-typescale-label-medium"
              style={{
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                padding: '8px 12px',
                borderRadius: '10px'
              }}
            >
              {saveError}
            </div>
          )}

          {/* Editable Lines List */}
          <div className="m3-lyric-editor-rows">
            {draftLines.map((line, idx) => {
              const secForLine = sections.find(
                (s) => line.startSec >= s.startSec - 0.2 && line.startSec <= s.endSec + 0.2
              );
              return (
                <div key={idx} className="m3-lyric-edit-row">
                  <div className="m3-lyric-edit-meta">
                    <button
                      type="button"
                      className="m3-lyric-stamp-btn"
                      title={t.stampCurrentTime}
                      onClick={() => handleStampLineToCurrentTime(idx)}
                    >
                      <md-icon style={{ fontSize: '14px' }}>timer</md-icon>
                      <span>{formatDurationSec(line.startSec)}</span>
                    </button>

                    {secForLine && (
                      <span className="m3-lyric-sec-tag">{secForLine.name}</span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraftLines((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, text: val } : item))
                      );
                    }}
                    placeholder={t.linePlaceholder}
                    className="m3-clean-text-input m3-lyric-edit-input"
                    style={{ flex: 1 }}
                  />

                  <button
                    type="button"
                    className="m3-playlist-remove-btn"
                    onClick={() =>
                      setDraftLines((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Revision Audit Log Drawer */}
          {showRevisions && (
            <div className="m3-lyric-revisions-box">
              <div className="md-typescale-label-medium" style={{ marginBottom: '6px' }}>
                {t.revisionsTitle}
              </div>
              {revisions.length === 0 ? (
                <div className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t.noRevisionsYet}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {revisions.map((rev) => (
                    <div key={rev.id} className="m3-lyric-rev-item">
                      <strong>v{rev.version_num}</strong> · {rev.username} ·{' '}
                      <span style={{ opacity: 0.8 }}>{rev.change_summary}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <md-text-button onClick={() => setIsEditorOpen(false)}>
              {t.cancelBtn}
            </md-text-button>
            <md-filled-button
              disabled={isSaving || undefined}
              onClick={handleSaveLyrics}
            >
              {t.saveLyricsBtn}
            </md-filled-button>
          </div>
        </div>
      )}

      {/* 2-Row Auto-Scrolling Karaoke Viewport (Top row: Current Lyric, Bottom row: Next Lyric) */}
      {!lyrics || lyrics.length === 0 ? (
        <div className="m3-karaoke-empty-row" style={{ padding: '12px 16px' }}>
          <span className="md-typescale-body-medium">
            {t.emptyLyrics}
          </span>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="m3-karaoke-scroll-viewport"
          style={viewportHeight ? { maxHeight: `${viewportHeight}px` } : undefined}
        >
          {lyrics.map((line, idx) => {
            const isCurrent = idx === activeLineIndex;
            const isNext = idx === activeLineIndex + 1;
            const isBeforeFirstVocal =
              idx === 0 && currentTimeSec < line.startSec - 0.5;
            const remainingIntroSec = isBeforeFirstVocal
              ? Math.max(1, Math.ceil(line.startSec - currentTimeSec))
              : 0;

            const lineDuration = Math.max(0.4, line.endSec - line.startSec);
            const progressPct = isCurrent
              ? Math.min(
                  100,
                  Math.max(0, ((currentTimeSec - line.startSec) / lineDuration) * 100)
                )
              : idx < activeLineIndex
              ? 100
              : 0;

            const rowClass = [
              'm3-karaoke-line',
              isCurrent ? 'is-current' : '',
              isNext ? 'is-next' : '',
              idx < activeLineIndex ? 'is-past' : ''
            ]
              .filter(Boolean)
              .join(' ');

            const displayText =
              line.text.includes('Enstrümantal') || line.text.includes('Instrumental')
                ? t.instrumentalIntro
                : line.text;

            const rowRef =
              idx === windowStartIdx
                ? windowFirstRef
                : idx === windowStartIdx + 1
                ? windowSecondRef
                : idx === windowStartIdx + 2
                ? windowThirdRef
                : undefined;

            return (
              <div
                key={`${line.startSec}-${idx}`}
                ref={rowRef}
                role="button"
                tabIndex={0}
                onClick={() => onSeekSec && onSeekSec(line.startSec)}
                title={t.seekTooltip(formatDurationSec(line.startSec))}
                className={rowClass}
              >
                <md-ripple></md-ripple>

                {/* Left Status / Countdown / Timestamp Pill */}
                <div className="m3-karaoke-line-meta">
                  {isCurrent ? (
                    <span className="m3-karaoke-badge active">
                      <md-icon style={{ fontSize: '15px' }}>
                        {isBeforeFirstVocal ? 'timer' : 'mic'}
                      </md-icon>
                      <span>
                        {isBeforeFirstVocal
                          ? t.vocalCountdown(formatDurationSec(remainingIntroSec))
                          : t.nowBadge}
                      </span>
                    </span>
                  ) : isNext ? (
                    <span className="m3-karaoke-badge next">{t.nextBadge}</span>
                  ) : (
                    <span className="m3-karaoke-time">{formatDurationSec(line.startSec)}</span>
                  )}
                </div>

                {/* Center Karaoke Lyric Text (Word-Level Highlight when MMS_FA word bounds exist) */}
                <div className="m3-karaoke-line-text">
                  {isCurrent && !isBeforeFirstVocal && line.words && line.words.length > 0 ? (
                    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.28em' }}>
                      {line.words.map((w, wIdx) => {
                        const isWordActive =
                          currentTimeSec >= w.startSec && currentTimeSec <= w.endSec;
                        const isWordSung = currentTimeSec > w.endSec;
                        return (
                          <span
                            key={`${wIdx}-${w.startSec}`}
                            style={{
                              color: isWordActive
                                ? 'var(--md-sys-color-primary)'
                                : isWordSung
                                ? 'var(--md-sys-color-on-surface)'
                                : 'var(--md-sys-color-on-surface-variant)',
                              fontWeight: isWordActive ? 700 : isWordSung ? 600 : 500,
                              opacity: isWordActive || isWordSung ? 1 : 0.65,
                              transition: 'color 80ms linear, opacity 80ms linear'
                            }}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    displayText
                  )}
                </div>

                {/* Bottom Karaoke Progress Fill inside active line */}
                {isCurrent && !isBeforeFirstVocal && (
                  <div
                    className="m3-karaoke-progress-bar"
                    style={{ width: `${progressPct}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
```

## `production/web/src/components/SongInfoStrip.tsx`

```tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  AppLanguage,
  ChordComplexityMode,
  DockerPopoverId,
  InstrumentType,
  SongSection,
  StudioSong
} from '../types/studio';
import { transposeKeySignature } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { InstrumentIcon, MetronomeIcon, MixerIcon } from './icons';

interface SongInfoStripProps {
  song: StudioSong;
  language: AppLanguage;
  instrument: InstrumentType;
  transposeSemitones: number;
  capo: number;
  playbackSpeed: number;
  chordComplexity: ChordComplexityMode;
  currentTimeSec: number;
  durationSec: number;
  loopRangeSec?: [number, number] | null;
  activeSection?: SongSection;
  isLoopActive: boolean;
  isMetronomeActive: boolean;
  isMasterMuted: boolean;
  customBarLoopRange: [number, number] | null;
  openPopover: DockerPopoverId;
  onSeekSec?: (sec: number) => void;
  onToggleLoop: () => void;
  onToggleMetronome: () => void;
  onToggleMasterMute: () => void;
  onSetOpenPopover: (id: DockerPopoverId) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
}

export const SongInfoStrip: React.FC<SongInfoStripProps> = ({
  song,
  language,
  instrument,
  transposeSemitones,
  capo,
  playbackSpeed,
  currentTimeSec,
  durationSec,
  loopRangeSec,
  activeSection,
  isLoopActive,
  isMetronomeActive,
  isMasterMuted,
  customBarLoopRange,
  openPopover,
  onSeekSec,
  onToggleLoop,
  onToggleMetronome,
  onToggleMasterMute,
  onSetOpenPopover,
  isFavorite = false,
  onToggleFavorite,
  onRenameTrack,
  onDeleteTrack
}) => {
  const t = TRANSLATIONS[language].infoStrip;
  const hT = TRANSLATIONS[language].header;
  const dockerT = TRANSLATIONS[language].docker;
  const wsT = TRANSLATIONS[language].workspace;
  const formattedKey = transposeKeySignature(song.keySignature, transposeSemitones, language);
  const waveformRef = useRef<HTMLDivElement>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(song.title);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setIsEditingTitle(false);
    setIsConfirmDelete(false);
    setTitleDraft(song.title);
  }, [song.trackKey, song.title]);

  const submitRename = async () => {
    const clean = titleDraft.trim();
    if (!clean || !onRenameTrack || clean === song.title) {
      setIsEditingTitle(false);
      setTitleDraft(song.title);
      return;
    }
    setIsMutating(true);
    try {
      await onRenameTrack(song.trackKey, clean);
      setIsEditingTitle(false);
    } finally {
      setIsMutating(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteTrack) return;
    setIsMutating(true);
    try {
      await onDeleteTrack(song.trackKey);
    } finally {
      setIsMutating(false);
      setIsConfirmDelete(false);
    }
  };

  const togglePopover = (id: DockerPopoverId) => {
    onSetOpenPopover(openPopover === id ? null : id);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || durationSec <= 0 || !onSeekSec) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeekSec(ratio * durationSec);
  };

  const progressRatio = durationSec > 0 ? Math.min(1, Math.max(0, currentTimeSec / durationSec)) : 0;
  const loopStartRatio =
    loopRangeSec && durationSec > 0 ? Math.max(0, loopRangeSec[0] / durationSec) : null;
  const loopEndRatio =
    loopRangeSec && durationSec > 0 ? Math.min(1, loopRangeSec[1] / durationSec) : null;

  return (
    <section aria-label={t.ariaLabel} className="m3-info-strip">
      <md-elevation></md-elevation>

      {/* Masaüstü Üst Satır: Favori Yıldız + Şarkı Başlığı | 4/4 · BPM · Ton */}
      <div className="m3-info-top-row">
        <div className="m3-info-left">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              title={t.favoriteTooltip}
              aria-label={t.favoriteTooltip}
              className={`m3-fav-star-btn ${isFavorite ? 'is-fav' : ''}`}
            >
              <md-icon style={{ fontSize: '20px' }}>{isFavorite ? 'star' : 'star_outline'}</md-icon>
            </button>
          )}
          {isEditingTitle ? (
            <div className="m3-inline-rename-row">
              <input
                type="text"
                value={titleDraft}
                autoFocus
                disabled={isMutating}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename();
                  if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                    setTitleDraft(song.title);
                  }
                }}
                placeholder={hT.trackTitlePlaceholder}
                className="m3-inline-rename-input"
              />
              <md-icon-button
                aria-label={hT.saveTitleBtn}
                title={hT.saveTitleBtn}
                disabled={isMutating || undefined}
                onClick={submitRename}
              >
                <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
              </md-icon-button>
              <md-icon-button
                aria-label={hT.cancelActionBtn}
                title={hT.cancelActionBtn}
                disabled={isMutating || undefined}
                onClick={() => {
                  setIsEditingTitle(false);
                  setTitleDraft(song.title);
                }}
              >
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
          ) : (
            <div className="m3-info-title-actions-wrap">
              <span className="md-typescale-title-medium m3-info-song-title" title={song.title}>
                {song.title}
              </span>
              {song.trackKey && (onRenameTrack || onDeleteTrack) && (
                <div className="m3-track-row-actions">
                  {onRenameTrack && (
                    <md-icon-button
                      aria-label={hT.renameTrackTooltip}
                      title={hT.renameTrackTooltip}
                      disabled={isMutating || undefined}
                      onClick={() => {
                        setIsConfirmDelete(false);
                        setTitleDraft(song.title);
                        setIsEditingTitle(true);
                      }}
                    >
                      <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                    </md-icon-button>
                  )}
                  {onDeleteTrack && (
                    isConfirmDelete ? (
                      <div className="m3-inline-delete-confirm">
                        <button
                          type="button"
                          disabled={isMutating}
                          className="m3-inline-delete-btn"
                          onClick={submitDelete}
                        >
                          {hT.confirmDeleteBtn}
                        </button>
                        <button
                          type="button"
                          disabled={isMutating}
                          className="m3-inline-cancel-btn"
                          onClick={() => setIsConfirmDelete(false)}
                        >
                          {hT.cancelActionBtn}
                        </button>
                      </div>
                    ) : (
                      <md-icon-button
                        aria-label={hT.deleteTrackTooltip}
                        title={hT.deleteTrackTooltip}
                        disabled={isMutating || undefined}
                        onClick={() => setIsConfirmDelete(true)}
                      >
                        <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                      </md-icon-button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="m3-info-right">
          <span className="m3-tonal-badge">
            {song.timeSignature}
          </span>
          <span className="m3-tonal-badge primary">
            <strong>{Math.round(song.tempoBpm)} BPM</strong>
          </span>
          <span className="m3-tonal-badge secondary">
            <strong>{formattedKey}</strong>
          </span>
        </div>
      </div>

      {/* Mobil Üst Araç Şeridi: Sol [Enstrüman + Adı, Mikser, Sessize Al] | Sağ [Döngü, Metronom, Ayarlar] */}
      <div className="m3-mobile-tools-strip">
        <div className="m3-top-tools-left">
          <md-filled-tonal-button
            data-role="mobile-instrument-pill"
            data-popover-trigger="true"
            data-active={openPopover === 'instrument' ? 'true' : 'false'}
            title={`${dockerT.instrumentBtnTitle}: ${dockerT.instruments[instrument].name}`}
            onClick={() => togglePopover('instrument')}
          >
            <md-icon slot="icon">
              <InstrumentIcon instrument={instrument} size={18} />
            </md-icon>
            <span>{dockerT.instruments[instrument].name}</span>
          </md-filled-tonal-button>

          <md-filled-tonal-icon-button
            data-role="mobile-tool"
            data-popover-trigger="true"
            data-active={openPopover === 'mixer' ? 'true' : 'false'}
            aria-label={dockerT.mixerBtnTitle}
            title={dockerT.mixerBtnTitle}
            onClick={() => togglePopover('mixer')}
          >
            <md-icon>
              <MixerIcon size={19} />
            </md-icon>
          </md-filled-tonal-icon-button>

          {isMasterMuted ? (
            <md-filled-icon-button
              data-master-mute="active"
              aria-label={dockerT.masterUnmuteTitle}
              title={dockerT.masterUnmuteTitle}
              onClick={onToggleMasterMute}
            >
              <md-icon>volume_off</md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-master-mute="inactive"
              aria-label={dockerT.masterMuteTitle}
              title={dockerT.masterMuteTitle}
              onClick={onToggleMasterMute}
            >
              <md-icon>volume_off</md-icon>
            </md-filled-tonal-icon-button>
          )}
        </div>

        <div className="m3-top-tools-right">
          {isLoopActive ? (
            <md-filled-icon-button
              data-loop="active"
              aria-label={dockerT.loopActive}
              title={
                customBarLoopRange
                  ? dockerT.loopBarsTooltip(customBarLoopRange[0], customBarLoopRange[1])
                  : dockerT.loopSectionTooltip(activeSection?.name || wsT.sectionFallback)
              }
              onClick={onToggleLoop}
            >
              <md-icon>repeat</md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-loop="inactive"
              aria-label="Loop"
              title={dockerT.loopToggleTooltip}
              onClick={onToggleLoop}
            >
              <md-icon>repeat</md-icon>
            </md-filled-tonal-icon-button>
          )}

          {isMetronomeActive ? (
            <md-filled-icon-button
              data-metronome="active"
              aria-label={dockerT.channels.metronome}
              title={dockerT.metronomeActiveTooltip}
              onClick={onToggleMetronome}
            >
              <md-icon>
                <MetronomeIcon size={19} />
              </md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-metronome="inactive"
              aria-label={dockerT.channels.metronome}
              title={dockerT.metronomeInactiveTooltip}
              onClick={onToggleMetronome}
            >
              <md-icon>
                <MetronomeIcon size={19} />
              </md-icon>
            </md-filled-tonal-icon-button>
          )}

          <md-icon-button
            data-popover-trigger="true"
            aria-label={dockerT.settingsBtnTitle}
            title={dockerT.settingsBtnTitle}
            style={{
              color:
                openPopover === 'settings' ||
                transposeSemitones !== 0 ||
                capo > 0 ||
                Math.abs(playbackSpeed - 1.0) > 0.01
                  ? 'var(--md-sys-color-primary)'
                  : undefined,
            }}
            onClick={() => togglePopover('settings')}
          >
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Mobil Waveform (Sadece <= 640px ve yatay telefon ekranlarında üst araçların altında/yanında görünür) */}
      <div className="m3-mobile-song-waveform">
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          role="slider"
          aria-label={dockerT.waveformAria}
          aria-valuemin={0}
          aria-valuemax={Math.round(durationSec)}
          aria-valuenow={Math.round(currentTimeSec)}
          tabIndex={0}
          className="m3-waveform-track"
        >
          {loopStartRatio !== null && loopEndRatio !== null && (
            <div
              className="m3-waveform-loop-overlay"
              style={{
                left: `${loopStartRatio * 100}%`,
                width: `${Math.max(1, (loopEndRatio - loopStartRatio) * 100)}%`
              }}
            />
          )}

          <div className="m3-waveform-bars">
            {song.waveformPeaks.map((peak, idx) => {
              const barRatio = idx / Math.max(1, song.waveformPeaks.length - 1);
              const isPlayed = barRatio <= progressRatio;
              const heightPct = Math.max(20, Math.min(92, Math.round(peak * 92)));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    borderRadius: '999px',
                    backgroundColor: isPlayed
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-outline-variant)'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
```

## `production/web/src/components/StudioHeader.tsx`

```tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  fetchLibrarySongs,
  loadCachedSongByTrackKey,
  loginStudioUser,
  logoutStudioUser,
  registerStudioUser,
  updateUserProfile
} from '../api/studioApi';
import {
  AppLanguage,
  FavoriteSongItem,
  LibrarySongItem,
  PrivateUploadedSongItem,
  StudioSong,
  StudioUser
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { formatDurationSec, transposeKeySignature } from '../utils/musicTheory';
import { BrandLogoIcon } from './icons/BrandLogoIcon';
import { SourceOriginIcon, detectSongSource } from './icons/sources/SourceOriginIcon';

interface StudioHeaderProps {
  language: AppLanguage;
  isDarkMode: boolean;
  user: StudioUser | null;
  favorites: FavoriteSongItem[];
  privateUploads: PrivateUploadedSongItem[];
  isAccountCardOpen: boolean;
  isUploadDialogOpen: boolean;
  onSetAccountCardOpen: (open: boolean) => void;
  onOpenUploadDialog: () => void;
  onToggleDarkMode: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
  onAuthChanged: () => void;
}

function parseSongTitleAndArtist(rawTitle: string): { title: string; artist: string } {
  const parts = rawTitle.split(/\s+[-—–]\s+/);
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim(),
      title: parts.slice(1).join(' - ').trim()
    };
  }
  return { artist: '', title: rawTitle.trim() };
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  language,
  isDarkMode,
  user,
  favorites,
  privateUploads,
  isAccountCardOpen,
  isUploadDialogOpen,
  onSetAccountCardOpen,
  onOpenUploadDialog,
  onToggleDarkMode,
  onSongLoaded,
  onRenameTrack,
  onDeleteTrack,
  onAuthChanged
}) => {
  const t = TRANSLATIONS[language].header;

  const [query, setQuery] = useState('');
  const [isOmniboxOpen, setIsOmniboxOpen] = useState(false);
  const [librarySongs, setLibrarySongs] = useState<LibrarySongItem[]>([]);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingTrackKey, setEditingTrackKey] = useState<string | null>(null);
  const [editingTrackTitle, setEditingTrackTitle] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [mutatingTrackKey, setMutatingTrackKey] = useState<string | null>(null);

  // Account & Auth card states
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [accountSectionTab, setAccountSectionTab] = useState<'favorites' | 'uploads'>('favorites');
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Account profile settings form state
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileEmailInput, setProfileEmailInput] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [showProfilePassword, setShowProfilePassword] = useState(false);
  const [showProfileConfirmPassword, setShowProfileConfirmPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const omniboxRef = useRef<HTMLDivElement>(null);
  const accountWrapRef = useRef<HTMLDivElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLibrarySongs().then(setLibrarySongs);
  }, [privateUploads.length]);

  useEffect(() => {
    if (!isOmniboxOpen) return;
    fetchLibrarySongs().then(setLibrarySongs);
  }, [isOmniboxOpen]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (omniboxRef.current && !omniboxRef.current.contains(e.target as Node)) {
        if (!isLoadingSong) setIsOmniboxOpen(false);
      }
      if (accountWrapRef.current && !accountWrapRef.current.contains(e.target as Node)) {
        if (!isLoadingSong) onSetAccountCardOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isLoadingSong, onSetAccountCardOpen]);

  // Unified library + private uploads filter (strictly local/user-owned library)
  const filteredLibrary = useMemo(() => {
    const map = new Map<string, LibrarySongItem>();
    privateUploads.forEach((up) => {
      map.set(up.track_key, { ...up, is_current_version: true });
    });
    librarySongs.forEach((item) => {
      if (!map.has(item.track_key)) {
        map.set(item.track_key, item);
      }
    });
    const merged = Array.from(map.values());
    const q = query.trim().toLowerCase();
    if (!q) return merged;
    return merged.filter((item) => item.title.toLowerCase().includes(q));
  }, [librarySongs, privateUploads, query]);

  const handleSelectCachedTrackKey = async (trackKey: string) => {
    setIsLoadingSong(true);
    setLoadingMessage(t.loadingStudioTitle);
    setErrorMessage(null);
    try {
      const loaded = await loadCachedSongByTrackKey(trackKey);
      onSongLoaded(loaded);
      setIsOmniboxOpen(false);
      onSetAccountCardOpen(false);
      setQuery('');
    } catch (err: any) {
      setErrorMessage(err?.message || t.errSongLoad);
    } finally {
      setIsLoadingSong(false);
      setLoadingMessage('');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authTab === 'signup') {
      const cleanEmail = emailInput.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setAuthError(t.invalidEmailError);
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setAuthError(t.passwordMismatchError);
        return;
      }
    }

    setIsAuthSubmitting(true);
    try {
      if (authTab === 'signup') {
        await registerStudioUser(
          emailInput.trim(),
          usernameInput.trim() || emailInput.trim().split('@')[0],
          passwordInput
        );
      } else {
        await loginStudioUser(emailInput.trim(), passwordInput);
      }
      setEmailInput('');
      setUsernameInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      onAuthChanged();
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication error');
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleOpenProfileSettings = () => {
    if (!user) return;
    setProfileNameInput(user.username || '');
    setProfileEmailInput(user.email || '');
    setProfileNewPassword('');
    setProfileConfirmPassword('');
    setShowProfilePassword(false);
    setShowProfileConfirmPassword(false);
    setProfileError(null);
    setProfileSuccess(null);
    setIsProfileSettingsOpen(true);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    const cleanEmail = profileEmailInput.trim();
    const cleanName = profileNameInput.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setProfileError(t.invalidEmailError);
      return;
    }
    if (profileNewPassword || profileConfirmPassword) {
      if (profileNewPassword.length < 4 || profileNewPassword !== profileConfirmPassword) {
        setProfileError(t.passwordMismatchError);
        return;
      }
    }

    setIsProfileSubmitting(true);
    try {
      await updateUserProfile(
        cleanEmail,
        cleanName,
        profileNewPassword ? profileNewPassword : undefined
      );
      setProfileNewPassword('');
      setProfileConfirmPassword('');
      setShowProfilePassword(false);
      setShowProfileConfirmPassword(false);
      setProfileSuccess(t.profileUpdatedMsg);
      onAuthChanged();
    } catch (err: any) {
      setProfileError(err?.message || 'Profile update failed.');
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const hasOpenHeaderCard = isOmniboxOpen || isAccountCardOpen;

  return (
    <header className={`m3-top-app-bar ${hasOpenHeaderCard ? 'has-open-card' : ''}`}>
      {hasOpenHeaderCard && (
        <div
          className="m3-card-scrim"
          onClick={() => {
            if (!isLoadingSong) {
              setIsOmniboxOpen(false);
              onSetAccountCardOpen(false);
            }
          }}
        />
      )}
      <div className="m3-top-app-bar-inner">
        {/* SOL GRUP: Logo + Hemen Sağında Arama ve Yeni Proje */}
        <div className="m3-header-left">
          <div className="m3-brand-lockup">
            <div className="m3-brand-logo">
              <BrandLogoIcon size={20} />
            </div>
            <span className="m3-brand-title">
              Kythra <span className="m3-brand-subtitle">Studio</span>
            </span>
          </div>

          {/* Search Form (Desktop Pill + Mobile Icon Trigger Immediately Right of Logo) */}
          <div ref={omniboxRef} className="m3-omnibox-wrapper">
            {/* Desktop Search Pill */}
            <div className={`m3-omnibox-pill m3-desktop-omnibox-pill ${isOmniboxOpen ? 'is-open' : ''}`}>
              <md-icon style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                search
              </md-icon>

              <input
                type="text"
                value={query}
                onFocus={() => {
                  setIsOmniboxOpen(true);
                  onSetAccountCardOpen(false);
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOmniboxOpen(true);
                }}
                placeholder={t.searchPlaceholder}
                className="m3-omnibox-input"
              />

              {query && (
                <md-icon-button
                  aria-label={t.clearSearch}
                  onClick={() => setQuery('')}
                >
                  <md-icon>close</md-icon>
                </md-icon-button>
              )}
            </div>

            {/* Mobile Search Icon Button (Placed right next to logo!) */}
            <div className="m3-mobile-search-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-search-btn"
                data-active={isOmniboxOpen ? 'true' : 'false'}
                aria-label={t.searchPlaceholder}
                title={t.searchPlaceholder}
                onClick={() => {
                  const nextOpen = !isOmniboxOpen;
                  setIsOmniboxOpen(nextOpen);
                  onSetAccountCardOpen(false);
                  if (nextOpen) {
                    window.setTimeout(() => mobileSearchInputRef.current?.focus(), 60);
                  }
                }}
              >
                <md-icon>search</md-icon>
              </md-filled-tonal-icon-button>
            </div>

            {/* Official Google Material 3 (<md-list> & <md-list-item>) Omnibox Dropdown Card */}
            {isOmniboxOpen && (
              <div className="m3-omnibox-dropdown">
                <md-elevation></md-elevation>

                {/* Mobile Search Input Row inside the Downward Card */}
                <div className="m3-mobile-card-search-bar">
                  <div className="m3-omnibox-pill is-open">
                    <md-icon style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                      search
                    </md-icon>
                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="m3-omnibox-input"
                    />
                    {query ? (
                      <md-icon-button
                        aria-label={t.clearSearch}
                        onClick={() => setQuery('')}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    ) : (
                      <md-icon-button
                        aria-label={t.close}
                        onClick={() => setIsOmniboxOpen(false)}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div
                    className="md-typescale-label-medium"
                    style={{
                      backgroundColor: 'var(--md-sys-color-error-container)',
                      color: 'var(--md-sys-color-on-error-container)',
                      padding: '10px 16px'
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                {isLoadingSong ? (
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <md-circular-progress indeterminate={true}></md-circular-progress>
                      <div>
                        <div className="md-typescale-title-small">
                          {loadingMessage || t.loadingStudioTitle}
                        </div>
                        <div
                          className="md-typescale-body-small"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          {t.loadingStudioSub}
                        </div>
                      </div>
                    </div>
                    <md-linear-progress indeterminate={true}></md-linear-progress>
                  </div>
                ) : (
                  <div className="m3-omnibox-results-scroll">
                    {/* Kütüphane ve Özel Yüklemeler */}
                    {filteredLibrary.length > 0 ? (
                      <div>
                        <div
                          className="md-typescale-label-medium"
                          style={{
                            padding: '10px 16px 4px',
                            color: 'var(--md-sys-color-primary)'
                          }}
                        >
                          {query.trim() ? t.libraryFoundTitle : t.recentReadyTitle}
                        </div>
                        <md-list>
                          {filteredLibrary.slice(0, 8).map((item) => {
                            const { title: songTitle, artist } = parseSongTitleAndArtist(item.title);
                            return (
                              <md-list-item
                                key={item.track_key}
                                type="button"
                                onClick={() => handleSelectCachedTrackKey(item.track_key)}
                              >
                                <div slot="start" className="m3-source-logo-slot">
                                  <SourceOriginIcon
                                    source={detectSongSource(item.track_key)}
                                  />
                                </div>
                                <div slot="headline">{songTitle}</div>
                                <div slot="supporting-text">
                                  {artist ? `${artist} · ` : ''}
                                  {Math.round(item.tempo_bpm)} BPM · {formatDurationSec(item.duration_sec)}
                                </div>
                              </md-list-item>
                            );
                          })}
                        </md-list>
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: '18px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <span
                          className="md-typescale-body-small"
                          style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                        >
                          {t.emptySearchHint}
                        </span>
                        <md-filled-tonal-button
                          onClick={() => {
                            setIsOmniboxOpen(false);
                            onOpenUploadDialog();
                          }}
                        >
                          <md-icon slot="icon">upload_file</md-icon>
                          <span>{t.uploadBtnFull}</span>
                        </md-filled-tonal-button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Arama Butonunun Hemen Yanında Yeni Proje / Dosya Yükle Butonu */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <md-filled-tonal-button
              data-role="upload-btn"
              data-active={isUploadDialogOpen ? 'true' : 'false'}
              title={t.uploadTitle}
              onClick={() => {
                setIsOmniboxOpen(false);
                onSetAccountCardOpen(false);
                onOpenUploadDialog();
              }}
            >
              <md-icon slot="icon">upload_file</md-icon>
              <span>{t.uploadBtnFull}</span>
            </md-filled-tonal-button>

            <div className="m3-mobile-upload-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-upload-btn"
                data-active={isUploadDialogOpen ? 'true' : 'false'}
                aria-label={t.uploadTitle}
                title={t.uploadTitle}
                onClick={() => {
                  setIsOmniboxOpen(false);
                  onSetAccountCardOpen(false);
                  onOpenUploadDialog();
                }}
              >
                <md-icon>upload_file</md-icon>
              </md-filled-tonal-icon-button>
            </div>
          </div>
        </div>

        {/* EN SAĞ GRUP: Tema Geçişi + Hesabım / Giriş Yap Butonu ve Aşağı Açılan Hesabım Kartı */}
        <div className="m3-header-right">
          <md-icon-button
            aria-label={isDarkMode ? t.switchToLight : t.switchToDark}
            title={isDarkMode ? t.switchToLight : t.switchToDark}
            onClick={onToggleDarkMode}
          >
            <md-icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</md-icon>
          </md-icon-button>

          <div ref={accountWrapRef} style={{ position: 'relative', flexShrink: 0 }}>
            {/* Desktop Account / Sign In Button */}
            <md-filled-tonal-button
              data-role="desktop-account-btn"
              data-active={isAccountCardOpen ? 'true' : 'false'}
              title={user ? `${t.myAccountBtn} (${user.username})` : t.signInBtn}
              onClick={() => {
                onSetAccountCardOpen(!isAccountCardOpen);
                setIsProfileSettingsOpen(false);
                setIsOmniboxOpen(false);
                setAuthError(null);
              }}
            >
              <md-icon slot="icon">{user ? 'account_circle' : 'login'}</md-icon>
              <span>{user ? user.username : t.signInBtn}</span>
            </md-filled-tonal-button>

            {/* Mobile Account / Sign In Icon-Only Button (Always on the far right!) */}
            <div className="m3-mobile-account-trigger">
              <md-filled-tonal-icon-button
                data-role="mobile-account-btn"
                data-active={isAccountCardOpen ? 'true' : 'false'}
                aria-label={user ? t.myAccountBtn : t.signInBtn}
                title={user ? `${t.myAccountBtn} (${user.username})` : t.signInBtn}
                onClick={() => {
                  onSetAccountCardOpen(!isAccountCardOpen);
                  setIsProfileSettingsOpen(false);
                  setIsOmniboxOpen(false);
                  setAuthError(null);
                }}
              >
                <md-icon>{user ? 'account_circle' : 'person'}</md-icon>
              </md-filled-tonal-icon-button>
            </div>

            {/* Aşağı Açılan Hesabım / Giriş Yap & Kayıt Ol Kartı */}
            {isAccountCardOpen && (
              <div className="m3-account-dropdown-card">
                <md-elevation></md-elevation>

                {!user ? (
                  /* GİRİŞ YAPILMAMIŞSA: GİRİŞ YAP / KAYIT OL KARTI */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>account_circle</md-icon>
                        <span className="md-typescale-title-small">
                          {authTab === 'signin' ? t.signInTab : t.signUpTab}
                        </span>
                      </div>
                      <md-icon-button onClick={() => onSetAccountCardOpen(false)}>
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    </div>

                    <div className="m3-account-tabs-row">
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${authTab === 'signin' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAuthTab('signin');
                          setAuthError(null);
                        }}
                      >
                        {t.signInTab}
                      </button>
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${authTab === 'signup' ? 'is-active' : ''}`}
                        onClick={() => {
                          setAuthTab('signup');
                          setAuthError(null);
                        }}
                      >
                        {t.signUpTab}
                      </button>
                    </div>

                    {authError && (
                      <div
                        className="md-typescale-label-medium"
                        style={{
                          backgroundColor: 'var(--md-sys-color-error-container)',
                          color: 'var(--md-sys-color-on-error-container)',
                          padding: '8px 12px',
                          borderRadius: '12px'
                        }}
                      >
                        {authError}
                      </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="m3-auth-form-grid">
                      {authTab === 'signup' && (
                        <input
                          type="text"
                          required
                          autoComplete="name"
                          value={usernameInput}
                          onChange={(e) => setUsernameInput(e.target.value)}
                          placeholder={t.usernameLabel}
                          className="m3-clean-text-input"
                        />
                      )}
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder={t.emailLabel}
                        className="m3-clean-text-input"
                      />

                      {/* Parola + Göz Aç/Kapat İkonu */}
                      <div className="m3-password-field-wrap">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          minLength={4}
                          autoComplete={authTab === 'signup' ? 'new-password' : 'current-password'}
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder={t.passwordLabel}
                          className="m3-clean-text-input m3-password-input"
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          aria-label={showPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                          title={showPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                          onClick={() => setShowPassword((v) => !v)}
                          className="m3-password-eye-btn"
                        >
                          <md-icon style={{ fontSize: '19px' }}>
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </md-icon>
                        </button>
                      </div>

                      {/* Kayıt Olurken Parolayı Doğrula + Göz Aç/Kapat İkonu */}
                      {authTab === 'signup' && (
                        <div className="m3-password-field-wrap">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={4}
                            autoComplete="new-password"
                            value={confirmPasswordInput}
                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                            placeholder={t.confirmPasswordLabel}
                            className="m3-clean-text-input m3-password-input"
                          />
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                            title={showConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="m3-password-eye-btn"
                          >
                            <md-icon style={{ fontSize: '19px' }}>
                              {showConfirmPassword ? 'visibility_off' : 'visibility'}
                            </md-icon>
                          </button>
                        </div>
                      )}

                      <md-filled-button
                        type="submit"
                        className="m3-auth-submit-btn"
                        disabled={isAuthSubmitting || undefined}
                        style={{ marginTop: '4px', width: '100%' }}
                      >
                        {authTab === 'signin' ? t.signInTab : t.signUpTab}
                      </md-filled-button>
                    </form>
                  </div>
                ) : (
                  /* GİRİŞ YAPILMIŞSA: HESABIM KARTI (Favorilerim | Yüklediklerim) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="m3-account-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div className="m3-avatar-badge">
                          {user.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div className="md-typescale-title-small" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.username}
                          </div>
                          <div className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <div className="m3-account-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <md-icon-button
                          aria-label={t.accountSettingsTitle}
                          title={t.accountSettingsTitle}
                          onClick={() => {
                            if (isProfileSettingsOpen) {
                              setIsProfileSettingsOpen(false);
                            } else {
                              handleOpenProfileSettings();
                            }
                          }}
                        >
                          <md-icon>{isProfileSettingsOpen ? 'arrow_back' : 'manage_accounts'}</md-icon>
                        </md-icon-button>
                        <md-text-button
                          onClick={() => {
                            setIsProfileSettingsOpen(false);
                            logoutStudioUser();
                            onAuthChanged();
                          }}
                        >
                          {t.signOutBtn}
                        </md-text-button>
                        <md-icon-button
                          aria-label={t.close}
                          onClick={() => {
                            setIsProfileSettingsOpen(false);
                            onSetAccountCardOpen(false);
                          }}
                        >
                          <md-icon>close</md-icon>
                        </md-icon-button>
                      </div>
                    </div>

                    {isProfileSettingsOpen ? (
                      /* HESAP AYARLARI BÖLÜMÜ (Görünen Ad, E-posta, Doğrulamalı Parola) */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <md-icon style={{ fontSize: '18px', color: 'var(--md-sys-color-primary)' }}>
                            manage_accounts
                          </md-icon>
                          <span className="md-typescale-title-small">{t.accountSettingsTitle}</span>
                        </div>

                        {profileError && (
                          <div
                            className="md-typescale-label-medium"
                            style={{
                              backgroundColor: 'var(--md-sys-color-error-container)',
                              color: 'var(--md-sys-color-on-error-container)',
                              padding: '8px 12px',
                              borderRadius: '12px'
                            }}
                          >
                            {profileError}
                          </div>
                        )}

                        {profileSuccess && (
                          <div
                            className="md-typescale-label-medium"
                            style={{
                              backgroundColor: 'var(--md-sys-color-primary-container)',
                              color: 'var(--md-sys-color-on-primary-container)',
                              padding: '8px 12px',
                              borderRadius: '12px'
                            }}
                          >
                            {profileSuccess}
                          </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="m3-auth-form-grid">
                          <input
                            type="text"
                            required
                            autoComplete="name"
                            value={profileNameInput}
                            onChange={(e) => setProfileNameInput(e.target.value)}
                            placeholder={t.usernameLabel}
                            className="m3-clean-text-input"
                          />
                          <input
                            type="email"
                            required
                            autoComplete="email"
                            value={profileEmailInput}
                            onChange={(e) => setProfileEmailInput(e.target.value)}
                            placeholder={t.emailLabel}
                            className="m3-clean-text-input"
                          />

                          <div className="m3-password-field-wrap">
                            <input
                              type={showProfilePassword ? 'text' : 'password'}
                              minLength={4}
                              autoComplete="new-password"
                              value={profileNewPassword}
                              onChange={(e) => setProfileNewPassword(e.target.value)}
                              placeholder={t.newPasswordOptionalLabel}
                              className="m3-clean-text-input m3-password-input"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label={showProfilePassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              title={showProfilePassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              onClick={() => setShowProfilePassword((v) => !v)}
                              className="m3-password-eye-btn"
                            >
                              <md-icon style={{ fontSize: '19px' }}>
                                {showProfilePassword ? 'visibility_off' : 'visibility'}
                              </md-icon>
                            </button>
                          </div>

                          <div className="m3-password-field-wrap">
                            <input
                              type={showProfileConfirmPassword ? 'text' : 'password'}
                              minLength={4}
                              autoComplete="new-password"
                              value={profileConfirmPassword}
                              onChange={(e) => setProfileConfirmPassword(e.target.value)}
                              placeholder={t.confirmNewPasswordLabel}
                              className="m3-clean-text-input m3-password-input"
                            />
                            <button
                              type="button"
                              tabIndex={-1}
                              aria-label={showProfileConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              title={showProfileConfirmPassword ? t.hidePasswordTooltip : t.showPasswordTooltip}
                              onClick={() => setShowProfileConfirmPassword((v) => !v)}
                              className="m3-password-eye-btn"
                            >
                              <md-icon style={{ fontSize: '19px' }}>
                                {showProfileConfirmPassword ? 'visibility_off' : 'visibility'}
                              </md-icon>
                            </button>
                          </div>

                          <md-filled-button
                            type="submit"
                            className="m3-auth-submit-btn"
                            disabled={isProfileSubmitting || undefined}
                            style={{ marginTop: '4px', width: '100%' }}
                          >
                            {t.saveProfileBtn}
                          </md-filled-button>
                        </form>
                      </div>
                    ) : (
                      <>
                    {/* Hesabım Alt Sekmeleri: Favorilerim | Yüklediklerim */}
                    <div className="m3-account-tabs-row">
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${accountSectionTab === 'favorites' ? 'is-active' : ''}`}
                        onClick={() => setAccountSectionTab('favorites')}
                      >
                        ★ {t.favoritesTab} ({favorites.length})
                      </button>
                      <button
                        type="button"
                        className={`m3-account-seg-btn ${accountSectionTab === 'uploads' ? 'is-active' : ''}`}
                        onClick={() => setAccountSectionTab('uploads')}
                      >
                        📁 {t.myUploadsTab} ({privateUploads.length})
                      </button>
                    </div>

                    {/* 1. FAVORİLERİM LİSTESİ */}
                    {accountSectionTab === 'favorites' && (
                      <div className="m3-account-list-scroll">
                        {favorites.length === 0 ? (
                          <div className="m3-account-empty-box">{t.emptyFavorites}</div>
                        ) : (
                          <md-list>
                            {favorites.map((fav) => (
                              <md-list-item
                                key={fav.track_key}
                                type="button"
                                onClick={() => handleSelectCachedTrackKey(fav.track_key)}
                              >
                                <md-icon slot="start" style={{ color: 'var(--md-sys-color-tertiary)' }}>
                                  star
                                </md-icon>
                                <div slot="headline">{fav.title}</div>
                                <div slot="supporting-text">
                                  {Math.round(fav.tempo_bpm)} BPM · {transposeKeySignature(fav.key_signature, 0, language)} · {fav.time_signature}
                                </div>
                              </md-list-item>
                            ))}
                          </md-list>
                        )}
                      </div>
                    )}

                    {/* 2. YÜKLEDİKLERİM (SADECE BU KULLANICIYA ÖZEL DOSYALAR) */}
                    {accountSectionTab === 'uploads' && (
                      <div className="m3-account-list-scroll">
                        <div
                          className="md-typescale-body-small"
                          style={{
                            backgroundColor: 'var(--md-sys-color-surface-container-low)',
                            color: 'var(--md-sys-color-on-surface-variant)',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            fontSize: '11.5px'
                          }}
                        >
                          {t.localDeviceNotice}
                        </div>
                        {privateUploads.length === 0 ? (
                          <div className="m3-account-empty-box">{t.emptyUploads}</div>
                        ) : (
                          <div className="m3-upload-manage-list">
                            {privateUploads.map((up) => {
                              const isEditing = editingTrackKey === up.track_key;
                              const isConfirming = confirmDeleteKey === up.track_key;
                              const isBusy = mutatingTrackKey === up.track_key;

                              return (
                                <div key={up.track_key} className="m3-upload-manage-row">
                                  {isEditing ? (
                                    <div className="m3-inline-rename-row" style={{ flex: 1 }}>
                                      <input
                                        type="text"
                                        value={editingTrackTitle}
                                        autoFocus
                                        disabled={isBusy}
                                        onChange={(e) => setEditingTrackTitle(e.target.value)}
                                        onKeyDown={async (e) => {
                                          if (e.key === 'Enter' && onRenameTrack) {
                                            const clean = editingTrackTitle.trim();
                                            if (clean) {
                                              setMutatingTrackKey(up.track_key);
                                              try {
                                                await onRenameTrack(up.track_key, clean);
                                                setEditingTrackKey(null);
                                              } finally {
                                                setMutatingTrackKey(null);
                                              }
                                            }
                                          }
                                          if (e.key === 'Escape') {
                                            setEditingTrackKey(null);
                                          }
                                        }}
                                        placeholder={t.trackTitlePlaceholder}
                                        className="m3-inline-rename-input"
                                      />
                                      <md-icon-button
                                        aria-label={t.saveTitleBtn}
                                        disabled={isBusy || undefined}
                                        onClick={async () => {
                                          const clean = editingTrackTitle.trim();
                                          if (!clean || !onRenameTrack) {
                                            setEditingTrackKey(null);
                                            return;
                                          }
                                          setMutatingTrackKey(up.track_key);
                                          try {
                                            await onRenameTrack(up.track_key, clean);
                                            setEditingTrackKey(null);
                                          } finally {
                                            setMutatingTrackKey(null);
                                          }
                                        }}
                                      >
                                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
                                      </md-icon-button>
                                      <md-icon-button
                                        aria-label={t.cancelActionBtn}
                                        disabled={isBusy || undefined}
                                        onClick={() => setEditingTrackKey(null)}
                                      >
                                        <md-icon>close</md-icon>
                                      </md-icon-button>
                                    </div>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        disabled={isBusy}
                                        onClick={() => handleSelectCachedTrackKey(up.track_key)}
                                        className="m3-upload-manage-main"
                                      >
                                        <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '20px', flexShrink: 0 }}>
                                          lock
                                        </md-icon>
                                        <div className="m3-upload-manage-text">
                                          <span className="m3-upload-manage-title" title={up.title}>
                                            {up.title}
                                          </span>
                                          <span className="m3-upload-manage-sub">
                                            {Math.round(up.tempo_bpm)} BPM · {transposeKeySignature(up.key_signature, 0, language)} · {up.time_signature}
                                          </span>
                                        </div>
                                      </button>

                                      <div className="m3-track-row-actions">
                                        {onRenameTrack && (
                                          <md-icon-button
                                            aria-label={t.renameTrackTooltip}
                                            title={t.renameTrackTooltip}
                                            disabled={isBusy || undefined}
                                            onClick={(e: React.MouseEvent) => {
                                              e.stopPropagation();
                                              setConfirmDeleteKey(null);
                                              setEditingTrackKey(up.track_key);
                                              setEditingTrackTitle(up.title);
                                            }}
                                          >
                                            <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                                          </md-icon-button>
                                        )}
                                        {onDeleteTrack && (
                                          isConfirming ? (
                                            <div className="m3-inline-delete-confirm">
                                              <button
                                                type="button"
                                                disabled={isBusy}
                                                className="m3-inline-delete-btn"
                                                onClick={async (e) => {
                                                  e.stopPropagation();
                                                  setMutatingTrackKey(up.track_key);
                                                  try {
                                                    await onDeleteTrack(up.track_key);
                                                  } finally {
                                                    setMutatingTrackKey(null);
                                                    setConfirmDeleteKey(null);
                                                  }
                                                }}
                                              >
                                                {t.confirmDeleteBtn}
                                              </button>
                                              <button
                                                type="button"
                                                disabled={isBusy}
                                                className="m3-inline-cancel-btn"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setConfirmDeleteKey(null);
                                                }}
                                              >
                                                {t.cancelActionBtn}
                                              </button>
                                            </div>
                                          ) : (
                                            <md-icon-button
                                              aria-label={t.deleteTrackTooltip}
                                              title={t.deleteTrackTooltip}
                                              disabled={isBusy || undefined}
                                              onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                setConfirmDeleteKey(up.track_key);
                                              }}
                                            >
                                              <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                                            </md-icon-button>
                                          )
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

## `production/web/src/components/StudioUploadDialog.tsx`

```tsx
import React, { useRef, useState } from 'react';
import {
  AppLanguage,
  StudioSong
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { loadAndPrepareUploadedFile } from '../api/studioApi';
import { saveAudioBlobToClientDb } from '../utils/clientAudioCache';

interface StudioUploadDialogProps {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onAuthChanged: () => void;
}

const SUPPORTED_FORMATS = ['WAV', 'MP3', 'FLAC', 'OGG', 'M4A'];

export const StudioUploadDialog: React.FC<StudioUploadDialogProps> = ({
  isOpen,
  language,
  onClose,
  onSongLoaded,
  onAuthChanged
}) => {
  const t = TRANSLATIONS[language].header;

  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const singleFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSingleFileUpload = async (file: File) => {
    setIsLoadingSong(true);
    setUploadError(null);
    setLoadingMessage(t.uploadingAudio);
    try {
      const loaded = await loadAndPrepareUploadedFile(file, (step) => {
        if (step === 'upload') setLoadingMessage(t.uploadingAudio);
        else setLoadingMessage(t.preparingHarmonic);
      });
      await saveAudioBlobToClientDb(loaded.trackKey, 'master', file);
      onSongLoaded(loaded);
      onAuthChanged();
      onClose();
    } catch (err: any) {
      setUploadError(err?.message || t.errAudioUpload);
    } finally {
      setIsLoadingSong(false);
      setLoadingMessage('');
    }
  };

  return (
    <div
      className="m3-dialog-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoadingSong) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-upload-dialog-title"
        className="m3-upload-dialog-card"
      >
        <md-elevation></md-elevation>

        {/* Dialog Header */}
        <div className="m3-upload-dialog-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="m3-upload-dialog-badge">
              <md-icon style={{ fontSize: '20px' }}>audio_file</md-icon>
            </div>
            <span id="studio-upload-dialog-title" className="md-typescale-title-medium">
              {t.uploadTitle}
            </span>
          </div>
          <md-icon-button
            aria-label={t.close}
            disabled={isLoadingSong || undefined}
            onClick={() => !isLoadingSong && onClose()}
          >
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {uploadError && (
          <div className="m3-dialog-error-banner md-typescale-label-medium">
            <md-icon style={{ fontSize: '18px' }}>error</md-icon>
            <span>{uploadError}</span>
          </div>
        )}

        {isLoadingSong ? (
          <div style={{ padding: '24px 8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <md-circular-progress indeterminate={true}></md-circular-progress>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="md-typescale-title-small">
                  {loadingMessage || t.analyzingAudioFile}
                </span>
                <span
                  className="md-typescale-body-small"
                  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  {t.loadingStudioSub}
                </span>
              </div>
            </div>
            <md-linear-progress indeterminate={true}></md-linear-progress>
          </div>
        ) : (
          <div className="m3-upload-card-body">
            <input
              ref={singleFileInputRef}
              type="file"
              accept=".wav,.mp3,.flac,.ogg,.m4a,audio/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleSingleFileUpload(f);
                e.target.value = '';
              }}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => singleFileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleSingleFileUpload(f);
              }}
              className={`m3-upload-dropzone ${isDragOver ? 'is-dragover' : ''}`}
            >
              <md-ripple></md-ripple>
              <div className="m3-upload-dropzone-icon">
                <md-icon style={{ fontSize: '28px', color: 'var(--md-sys-color-primary)' }}>
                  cloud_upload
                </md-icon>
              </div>
              <span className="md-typescale-title-small">{t.dropzoneHeadline}</span>
              <span
                className="md-typescale-body-small"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.dropzoneSubtext}
              </span>
              <md-filled-tonal-button style={{ marginTop: '4px' }}>
                <md-icon slot="icon">folder_open</md-icon>
                {t.chooseFileBtn}
              </md-filled-tonal-button>
            </div>

            <div className="m3-upload-meta-col">
              <div className="m3-dialog-info-box md-typescale-body-small">
                {t.localDeviceNotice}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    className="md-typescale-label-medium"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {t.supportedFormats}
                  </span>
                  <span
                    className="md-typescale-label-small"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {t.uploadLimits}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUPPORTED_FORMATS.map((fmt) => (
                    <span key={fmt} className="m3-tonal-badge">
                      .{fmt.toLowerCase()} ({fmt})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

## `production/web/src/components/StudioWelcomeView.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import {
  AppLanguage,
  LibrarySongItem,
  PrivateUploadedSongItem,
  StudioSong
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchLibrarySongs, loadCachedSongByTrackKey } from '../api/studioApi';
import { formatDurationSec } from '../utils/musicTheory';
import { SourceOriginIcon, detectSongSource } from './icons';

interface StudioWelcomeViewProps {
  language: AppLanguage;
  privateUploads: PrivateUploadedSongItem[];
  onOpenUpload: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
}

export const StudioWelcomeView: React.FC<StudioWelcomeViewProps> = ({
  language,
  privateUploads,
  onOpenUpload,
  onSongLoaded,
  onRenameTrack,
  onDeleteTrack
}) => {
  const wT = TRANSLATIONS[language].welcome;
  const hT = TRANSLATIONS[language].header;
  const [libraryItems, setLibraryItems] = useState<LibrarySongItem[]>([]);
  const [loadingTrackKey, setLoadingTrackKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [mutatingKey, setMutatingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchLibrarySongs().then(setLibraryItems);
  }, [privateUploads.length]);

  const combinedRecent = React.useMemo(() => {
    const map = new Map<
      string,
      {
        track_key: string;
        title: string;
        duration_sec: number;
        tempo_bpm: number;
        key_signature: string;
      }
    >();
    privateUploads.forEach((u) => map.set(u.track_key, u));
    libraryItems.forEach((l) => {
      if (!map.has(l.track_key)) map.set(l.track_key, l);
    });
    return Array.from(map.values()).slice(0, 8);
  }, [privateUploads, libraryItems]);

  const handleQuickOpen = async (trackKey: string) => {
    setLoadingTrackKey(trackKey);
    try {
      const song = await loadCachedSongByTrackKey(trackKey);
      onSongLoaded(song);
    } catch {
      // ignore if session metadata cannot load
    } finally {
      setLoadingTrackKey(null);
    }
  };

  return (
    <main className="m3-main-container m3-welcome-root">
      {/* 1. Welcome Hero */}
      <section className="m3-surface-card m3-welcome-hero">
        <md-elevation></md-elevation>
        <div className="m3-welcome-badge">
          <md-icon style={{ fontSize: '16px' }}>auto_awesome</md-icon>
          <span>{wT.badge}</span>
        </div>
        <h1 className="m3-welcome-title">{wT.title}</h1>
        <p className="m3-welcome-subtitle">{wT.subtitle}</p>
      </section>

      {/* 2. Single Track AI Upload Action Card */}
      <section className="m3-welcome-grid">
        <div className="m3-surface-card m3-welcome-action-card">
          <md-elevation></md-elevation>
          <div className="m3-welcome-card-top">
            <div className="m3-welcome-card-icon">
              <md-icon style={{ fontSize: '26px' }}>audio_file</md-icon>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h2 className="md-typescale-title-medium">{wT.singleCardTitle}</h2>
              <p
                className="md-typescale-body-medium"
                style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0, lineHeight: 1.5 }}
              >
                {wT.singleCardDesc}
              </p>
            </div>
          </div>

          <div className="m3-welcome-card-footer">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="m3-tonal-badge">MP3 / WAV / FLAC / M4A</span>
              <span className="m3-tonal-badge">BPM · Chords · Stems</span>
            </div>
            <md-filled-button onClick={() => onOpenUpload()}>
              <md-icon slot="icon">upload_file</md-icon>
              <span>{wT.singleCardBtn}</span>
            </md-filled-button>
          </div>
        </div>
      </section>

      {/* 3. Recent Projects / Private Uploads with Rename & Delete */}
      {combinedRecent.length > 0 && (
        <section className="m3-surface-card m3-welcome-recent-card">
          <md-elevation></md-elevation>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="md-typescale-title-small">{wT.recentTitle}</span>
            <span
              className="md-typescale-body-small"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              {combinedRecent.length}
            </span>
          </div>
          <div className="m3-upload-manage-list">
            {combinedRecent.map((item) => {
              const isEditing = editingKey === item.track_key;
              const isConfirming = confirmDeleteKey === item.track_key;
              const isBusy = mutatingKey === item.track_key || loadingTrackKey === item.track_key;

              return (
                <div key={item.track_key} className="m3-upload-manage-row">
                  {isEditing ? (
                    <div className="m3-inline-rename-row" style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={editingTitle}
                        autoFocus
                        disabled={isBusy}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && onRenameTrack) {
                            const clean = editingTitle.trim();
                            if (clean) {
                              setMutatingKey(item.track_key);
                              try {
                                await onRenameTrack(item.track_key, clean);
                                setEditingKey(null);
                              } finally {
                                setMutatingKey(null);
                              }
                            }
                          }
                          if (e.key === 'Escape') {
                            setEditingKey(null);
                          }
                        }}
                        placeholder={hT.trackTitlePlaceholder}
                        className="m3-inline-rename-input"
                      />
                      <md-icon-button
                        aria-label={hT.saveTitleBtn}
                        disabled={isBusy || undefined}
                        onClick={async () => {
                          const clean = editingTitle.trim();
                          if (!clean || !onRenameTrack) {
                            setEditingKey(null);
                            return;
                          }
                          setMutatingKey(item.track_key);
                          try {
                            await onRenameTrack(item.track_key, clean);
                            setEditingKey(null);
                          } finally {
                            setMutatingKey(null);
                          }
                        }}
                      >
                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
                      </md-icon-button>
                      <md-icon-button
                        aria-label={hT.cancelActionBtn}
                        disabled={isBusy || undefined}
                        onClick={() => setEditingKey(null)}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleQuickOpen(item.track_key)}
                        className="m3-upload-manage-main"
                      >
                        <div className="m3-source-logo-slot">
                          <SourceOriginIcon source={detectSongSource(item.track_key)} />
                        </div>
                        <div className="m3-upload-manage-text">
                          <span className="m3-upload-manage-title" title={item.title}>
                            {item.title}
                          </span>
                          <span className="m3-upload-manage-sub">
                            {Math.round(item.tempo_bpm)} BPM · {item.key_signature} ·{' '}
                            {formatDurationSec(item.duration_sec)}
                          </span>
                        </div>
                      </button>

                      <div className="m3-track-row-actions">
                        <span className="m3-tonal-badge">
                          {loadingTrackKey === item.track_key ? '...' : hT.readyBadge}
                        </span>
                        {onRenameTrack && (
                          <md-icon-button
                            aria-label={hT.renameTrackTooltip}
                            title={hT.renameTrackTooltip}
                            disabled={isBusy || undefined}
                            onClick={() => {
                              setConfirmDeleteKey(null);
                              setEditingKey(item.track_key);
                              setEditingTitle(item.title);
                            }}
                          >
                            <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                          </md-icon-button>
                        )}
                        {onDeleteTrack && (
                          isConfirming ? (
                            <div className="m3-inline-delete-confirm">
                              <button
                                type="button"
                                disabled={isBusy}
                                className="m3-inline-delete-btn"
                                onClick={async () => {
                                  setMutatingKey(item.track_key);
                                  try {
                                    await onDeleteTrack(item.track_key);
                                    setLibraryItems((prev) =>
                                      prev.filter((l) => l.track_key !== item.track_key)
                                    );
                                  } finally {
                                    setMutatingKey(null);
                                    setConfirmDeleteKey(null);
                                  }
                                }}
                              >
                                {hT.confirmDeleteBtn}
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                className="m3-inline-cancel-btn"
                                onClick={() => setConfirmDeleteKey(null)}
                              >
                                {hT.cancelActionBtn}
                              </button>
                            </div>
                          ) : (
                            <md-icon-button
                              aria-label={hT.deleteTrackTooltip}
                              title={hT.deleteTrackTooltip}
                              disabled={isBusy || undefined}
                              onClick={() => setConfirmDeleteKey(item.track_key)}
                            >
                              <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                            </md-icon-button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};
```

## `production/web/src/hooks/useStemAudio.ts`

```ts
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MixPresetId,
  StemCategory,
  StemChannelState,
  StemId,
  StudioSong
} from '../types/studio';
import { buildStudioHeaders } from '../api/studioApi';
import {
  listCachedChannelIdsForTrack,
  loadAudioBlobFromClientDb,
  saveAudioBlobToClientDb
} from '../utils/clientAudioCache';

const CATEGORY_VISUALS: Record<
  StemCategory,
  { defaultLabel: string; role: string; icon: string; color: string; defaultVolume: number }
> = {
  guitar: { defaultLabel: 'Guitar', role: 'Polyphonic Guitar', icon: 'music_note', color: '#0B57D0', defaultVolume: 0.9 },
  vocals: { defaultLabel: 'Vocals', role: 'Lead & Backing Vocals', icon: 'mic', color: '#B3261E', defaultVolume: 0.85 },
  bass: { defaultLabel: 'Bass', role: 'Harmonic Bassline', icon: 'graphic_eq', color: '#146C2E', defaultVolume: 0.85 },
  drums: { defaultLabel: 'Drums', role: 'Percussion & Transients', icon: 'album', color: '#D97706', defaultVolume: 0.85 },
  piano: { defaultLabel: 'Piano', role: 'Keys & Accompaniment', icon: 'piano', color: '#7C3AED', defaultVolume: 0.8 },
  other: { defaultLabel: 'Other', role: 'Synth & Ambience', icon: 'equalizer', color: '#64748B', defaultVolume: 0.75 },
  metronome: { defaultLabel: 'Metronome', role: 'Beat & Downbeat Click', icon: 'timer', color: '#00639B', defaultVolume: 0.7 }
};

const STANDARD_ORDER: Exclude<StemCategory, 'metronome'>[] = [
  'guitar',
  'vocals',
  'bass',
  'drums',
  'piano',
  'other'
];

function inferCategoryFromChannelId(channelId: string): StemCategory {
  if (STANDARD_ORDER.includes(channelId as any)) {
    return channelId as StemCategory;
  }
  const prefix = channelId.split('_')[0];
  if (STANDARD_ORDER.includes(prefix as any)) {
    return prefix as StemCategory;
  }
  return 'other';
}

function buildChannelsForSong(
  song: StudioSong,
  prev: StemChannelState[],
  isSameSong: boolean
): StemChannelState[] {
  const prevMap = new Map(prev.map((p) => [p.id, p]));
  const stemEntries = song.stems || {};
  const orderedIds =
    song.stemOrder && song.stemOrder.length > 0
      ? song.stemOrder
      : Object.keys(stemEntries).length > 0
      ? Object.keys(stemEntries)
      : STANDARD_ORDER;

  const built: StemChannelState[] = orderedIds.map((id) => {
    const stemMeta = stemEntries[id];
    const category: StemCategory = stemMeta?.category || inferCategoryFromChannelId(id);
    const vis = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.other;
    const prevCh = prevMap.get(id);

    return {
      id,
      category,
      label: stemMeta?.label || vis.defaultLabel,
      role: vis.role,
      icon: vis.icon,
      color: vis.color,
      volume: isSameSong && prevCh ? prevCh.volume : vis.defaultVolume,
      isMuted: isSameSong && prevCh ? prevCh.isMuted : false,
      isSolo: isSameSong && prevCh ? prevCh.isSolo : false,
      detected: stemMeta ? stemMeta.detected : true,
      presenceLabel: stemMeta ? stemMeta.presenceLabel : 'Aktif Sinyal',
      rmsDbfs: stemMeta?.rmsDbfs,
      audioUrl: stemMeta?.url
    };
  });

  const prevMetro = prevMap.get('metronome');
  const metroVis = CATEGORY_VISUALS.metronome;
  built.push({
    id: 'metronome',
    category: 'metronome',
    label: metroVis.defaultLabel,
    role: metroVis.role,
    icon: metroVis.icon,
    color: metroVis.color,
    volume: prevMetro ? prevMetro.volume : metroVis.defaultVolume,
    isMuted: prevMetro ? prevMetro.isMuted : true,
    isSolo: prevMetro ? prevMetro.isSolo : false,
    detected: true,
    presenceLabel: 'Senkron Klik'
  });

  return built;
}

function hasValidAudioSrc(audio: HTMLAudioElement | null | undefined): boolean {
  if (!audio) return false;
  const raw = audio.getAttribute('src');
  return Boolean(raw && raw.trim().length > 0);
}

function clearAudioSrc(audio: HTMLAudioElement | null | undefined): void {
  if (!audio) return;
  audio.removeAttribute('src');
  try {
    audio.load();
  } catch {
    // ignore
  }
}

interface UseStemAudioOptions {
  song: StudioSong;
  playbackSpeed: number;
  loopRangeSec: [number, number] | null;
}

export function useStemAudio({ song, playbackSpeed, loopRangeSec }: UseStemAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [activePreset, setActivePreset] = useState<MixPresetId>('full');
  const [hasReadyMaster, setHasReadyMaster] = useState(false);
  const [hasReadyStems, setHasReadyStems] = useState(false);
  const [channels, setChannels] = useState<StemChannelState[]>(() =>
    buildChannelsForSong(song, [], false)
  );

  const masterAudioRef = useRef<HTMLAudioElement | null>(null);
  const stemRefs = useRef<Record<string, HTMLAudioElement>>({});
  const playPromisesRef = useRef<Record<string, Promise<void> | null>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastClickedBeatIdxRef = useRef<number>(-1);
  const currentTimeRef = useRef(0);
  const prevTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const playbackSpeedRef = useRef(playbackSpeed);
  const prevSongIdRef = useRef<string>('');
  const readyMasterRef = useRef<boolean>(false);
  const readyStemsRef = useRef<boolean>(false);
  const isLoadingMasterRef = useRef<boolean>(false);
  const isLoadingStemsRef = useRef<boolean>(false);
  const masterLoadedKeyRef = useRef<string>('');
  const stemLoadedKeyRef = useRef<Record<string, string>>({});
  const masterFailedRef = useRef<boolean>(false);
  const channelsRef = useRef(channels);
  const isMasterMutedRef = useRef(isMasterMuted);
  const blobUrlsRef = useRef<string[]>([]);
  currentTimeRef.current = currentTimeSec;
  isPlayingRef.current = isPlaying;
  playbackSpeedRef.current = playbackSpeed;
  channelsRef.current = channels;
  isMasterMutedRef.current = isMasterMuted;

  const triggerMetronomeClick = useCallback((isDownbeat: boolean, gainLevel: number) => {
    if (typeof window === 'undefined' || gainLevel <= 0.005) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isDownbeat ? 1200 : 820, now);
      osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 600 : 420, now + 0.045);

      const peakGain = Math.min(1, gainLevel * (isDownbeat ? 0.9 : 0.65));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore WebAudio context restrictions
    }
  }, []);

  const activeStemIds = Object.keys(song.stems || {});
  const stemSignature = (
    song.stemOrder && song.stemOrder.length > 0 ? song.stemOrder : activeStemIds
  ).join('|');
  const hasStemAudio = Boolean(
    hasReadyStems || (song.stage3Status === 'completed' && activeStemIds.length > 0)
  );
  const hasMasterAudio = Boolean(hasReadyMaster || song.masterAudioUrl);

  const applyAudioVolumesAndRate = useCallback(() => {
    const chs = channelsRef.current;
    const masterMuted = isMasterMutedRef.current;
    const speed = playbackSpeedRef.current;
    const isAnySolo = chs.some((c) => c.isSolo);

    chs.forEach((ch) => {
      if (ch.category === 'metronome') return;
      const audio = stemRefs.current[ch.id];
      if (!audio) return;
      let vol = ch.volume;
      if (masterMuted || ch.isMuted || (isAnySolo && !ch.isSolo) || ch.detected === false) {
        vol = 0;
      }
      audio.muted = false;
      audio.volume = Math.max(0, Math.min(1, vol));
      audio.playbackRate = speed;
    });

    if (masterAudioRef.current) {
      const isMetronomeOnlySolo =
        isAnySolo &&
        chs.every((c) => (c.category === 'metronome' ? c.isSolo : !c.isSolo));
      masterAudioRef.current.muted = false;
      masterAudioRef.current.volume = masterMuted || isMetronomeOnlySolo ? 0 : 1;
      masterAudioRef.current.playbackRate = speed;
    }
  }, []);

  const safePlay = useCallback(
    (audio: HTMLAudioElement, id: string, desiredTimeSec?: number) => {
      if (!hasValidAudioSrc(audio)) return;
      const startPlayback = () => {
        if (!isPlayingRef.current) return;
        applyAudioVolumesAndRate();
        if (desiredTimeSec !== undefined && Number.isFinite(desiredTimeSec)) {
          try {
            audio.currentTime = desiredTimeSec;
          } catch {
            // ignore seek error before metadata
          }
        }
        audio.muted = false;
        audio.playbackRate = playbackSpeedRef.current;
        try {
          const p = audio.play();
          if (p !== undefined) {
            playPromisesRef.current[id] = p;
            p.then(() => {
              playPromisesRef.current[id] = null;
            }).catch((err: unknown) => {
              playPromisesRef.current[id] = null;
              if (
                err instanceof Error &&
                (err.name === 'AbortError' || err.message?.includes('interrupted'))
              ) {
                return;
              }
              console.warn(`Channel ${id} playback warning:`, err);
            });
          }
        } catch {
          // ignore AbortError
        }
      };

      if (audio.ended || audio.readyState < 2) {
        const onReady = () => {
          audio.removeEventListener('loadeddata', onReady);
          audio.removeEventListener('canplay', onReady);
          if (isPlayingRef.current) {
            startPlayback();
          }
        };
        audio.addEventListener('loadeddata', onReady);
        audio.addEventListener('canplay', onReady);
        if (audio.ended) {
          try {
            audio.load();
          } catch {
            // ignore
          }
        }
        return;
      }

      startPlayback();
    },
    [applyAudioVolumesAndRate]
  );

  const safePause = useCallback((audio: HTMLAudioElement, id: string) => {
    const p = playPromisesRef.current[id];
    if (p) {
      p.then(() => {
        try {
          audio.pause();
        } catch {
          // ignore
        }
      }).catch(() => {});
    } else {
      try {
        audio.pause();
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync song stems & master audio sources cleanly across song switches & dynamic stem updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSameSong = prevSongIdRef.current === song.id;
    prevSongIdRef.current = song.id;

    if (!isSameSong) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setCurrentTimeSec(0);
      prevTimeRef.current = 0;
      setActivePreset('full');
    }

    setChannels((prev) => buildChannelsForSong(song, prev, isSameSong));

    if (!masterAudioRef.current) {
      masterAudioRef.current = new Audio();
      masterAudioRef.current.preload = 'auto';
    }
    const master = masterAudioRef.current;

    const stemIdList =
      song.stemOrder && song.stemOrder.length > 0
        ? song.stemOrder
        : Object.keys(song.stems || {});
    const stemIdSet = new Set(stemIdList);

    if (!isSameSong) {
      masterLoadedKeyRef.current = '';
      stemLoadedKeyRef.current = {};
      masterFailedRef.current = false;
      readyMasterRef.current = false;
      readyStemsRef.current = false;
      isLoadingMasterRef.current = false;
      isLoadingStemsRef.current = false;
      setHasReadyMaster(false);
      setHasReadyStems(false);

      safePause(master, 'master');
      clearAudioSrc(master);

      // Clear ALL stem elements on project switch so revoked blob URLs never survive
      Object.keys(stemRefs.current).forEach((existingId) => {
        const oldAudio = stemRefs.current[existingId];
        if (oldAudio) {
          safePause(oldAudio, existingId);
          clearAudioSrc(oldAudio);
        }
        delete stemRefs.current[existingId];
      });

      blobUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
      blobUrlsRef.current = [];
    } else if (stemIdList.length > 0) {
      // Clean up obsolete HTMLAudioElements when updating stems on the same track
      Object.keys(stemRefs.current).forEach((existingId) => {
        if (!stemIdSet.has(existingId)) {
          const oldAudio = stemRefs.current[existingId];
          if (oldAudio) {
            safePause(oldAudio, existingId);
            clearAudioSrc(oldAudio);
          }
          delete stemRefs.current[existingId];
          delete stemLoadedKeyRef.current[existingId];
        }
      });
    }

    if (song.source === 'empty') {
      return;
    }

    let cancelled = false;
    const trackKey = song.trackKey || song.id;

    const resolveChannelObjectUrl = async (
      channelId: string,
      remoteUrl?: string
    ): Promise<{ url: string; fromNetwork: boolean }> => {
      const cachedBlob = await loadAudioBlobFromClientDb(trackKey, channelId);
      if (cancelled) return { url: '', fromNetwork: false };
      if (cachedBlob) {
        const objUrl = URL.createObjectURL(cachedBlob);
        blobUrlsRef.current.push(objUrl);
        return { url: objUrl, fromNetwork: false };
      }
      if (!remoteUrl) return { url: '', fromNetwork: false };
      try {
        const resp = await fetch(remoteUrl, { headers: buildStudioHeaders() });
        if (cancelled || !resp.ok) return { url: '', fromNetwork: false };
        const blob = await resp.blob();
        if (cancelled || blob.size <= 0) return { url: '', fromNetwork: false };
        await saveAudioBlobToClientDb(trackKey, channelId, blob);
        if (cancelled) return { url: '', fromNetwork: false };
        const objUrl = URL.createObjectURL(blob);
        blobUrlsRef.current.push(objUrl);
        return { url: objUrl, fromNetwork: true };
      } catch {
        return { url: '', fromNetwork: false };
      }
    };

    // 1. Hydrate Master Audio from IndexedDB or remote stream (works even when song.masterAudioUrl is undefined!)
    const masterKey = `${trackKey}|master|${song.masterAudioUrl || 'idb'}`;
    let masterLoadPromise: Promise<{ ready: boolean; fromNetwork: boolean }> | null = null;
    if (masterLoadedKeyRef.current !== masterKey || !hasValidAudioSrc(master)) {
      isLoadingMasterRef.current = true;
      masterLoadPromise = resolveChannelObjectUrl('master', song.masterAudioUrl).then((resolved) => {
        if (cancelled) return { ready: false, fromNetwork: false };
        isLoadingMasterRef.current = false;
        if (!resolved.url) {
          masterFailedRef.current = true;
          readyMasterRef.current = false;
          setHasReadyMaster(false);
          safePause(master, 'master');
          clearAudioSrc(master);
          return { ready: false, fromNetwork: false };
        }
        masterFailedRef.current = false;
        masterLoadedKeyRef.current = masterKey;
        readyMasterRef.current = true;
        setHasReadyMaster(true);
        if (master.src !== resolved.url) {
          master.src = resolved.url;
          master.load();
        }
        if (isPlayingRef.current && !readyStemsRef.current) {
          applyAudioVolumesAndRate();
          safePlay(master, 'master', currentTimeRef.current);
        }
        return { ready: true, fromNetwork: resolved.fromNetwork };
      });
    } else if (hasValidAudioSrc(master)) {
      readyMasterRef.current = true;
      setHasReadyMaster(true);
    }

    // 2. Hydrate Stem Audio from song.stems OR IndexedDB discovery (for saved projects without active server WAVs)
    const hydrateStemsAndAck = async () => {
      let targetStemIds = stemIdList;
      let discoveredLegacyStems = false;
      if (targetStemIds.length === 0) {
        const cachedIds = await listCachedChannelIdsForTrack(trackKey);
        if (cancelled) return;
        targetStemIds = cachedIds.filter((id) => id !== 'master');
        if (targetStemIds.length > 0) {
          discoveredLegacyStems = true;
        }
      }

      if (discoveredLegacyStems) {
        setChannels((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const missingIds = targetStemIds.filter((id) => !existingIds.has(id));
          if (missingIds.length === 0) return prev;
          const metro = prev.find((c) => c.category === 'metronome');
          const withoutMetro = prev.filter((c) => c.category !== 'metronome');
          const added: StemChannelState[] = missingIds.map((id) => {
            const category = inferCategoryFromChannelId(id);
            const vis = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.other;
            return {
              id,
              category,
              label: vis.defaultLabel,
              role: vis.role,
              icon: vis.icon,
              color: vis.color,
              volume: vis.defaultVolume,
              isMuted: false,
              isSolo: false,
              detected: true,
              presenceLabel: 'Aktif Sinyal'
            };
          });
          return metro ? [...withoutMetro, ...added, metro] : [...withoutMetro, ...added];
        });
      }

      if (targetStemIds.length === 0) {
        isLoadingStemsRef.current = false;
        readyStemsRef.current = false;
        setHasReadyStems(false);
        return;
      }

      isLoadingStemsRef.current = true;
      const stemLoadPromises: Promise<{ ready: boolean; fromNetwork: boolean }>[] = [];

      targetStemIds.forEach((id) => {
        if (!stemRefs.current[id]) {
          const a = new Audio();
          a.preload = 'auto';
          stemRefs.current[id] = a;
        }
        const audio = stemRefs.current[id]!;
        const url = song.stems?.[id]?.url;
        const stemKey = `${trackKey}|${id}|${url || 'idb'}`;
        if (stemLoadedKeyRef.current[id] !== stemKey || !hasValidAudioSrc(audio)) {
          const p = resolveChannelObjectUrl(id, url).then((resolved) => {
            if (cancelled || !resolved.url) return { ready: false, fromNetwork: false };
            stemLoadedKeyRef.current[id] = stemKey;
            if (audio.src !== resolved.url) {
              audio.src = resolved.url;
              audio.load();
            }
            return { ready: resolved.url.startsWith('blob:'), fromNetwork: resolved.fromNetwork };
          });
          stemLoadPromises.push(p);
        }
      });

      if (stemLoadPromises.length > 0) {
        await Promise.all(stemLoadPromises);
      }
      if (cancelled) return;
      isLoadingStemsRef.current = false;

      const loadedCount = targetStemIds.filter((id) => hasValidAudioSrc(stemRefs.current[id])).length;
      const stemsReady = loadedCount > 0;
      const wasReadyBefore = readyStemsRef.current;
      readyStemsRef.current = stemsReady;
      setHasReadyStems(stemsReady);

      if (stemsReady && isPlayingRef.current) {
        const handoffSec =
          !wasReadyBefore && hasValidAudioSrc(master) && !master.paused
            ? master.currentTime || currentTimeRef.current
            : currentTimeRef.current;
        safePause(master, 'master');
        applyAudioVolumesAndRate();
        targetStemIds.forEach((id) => {
          const a = stemRefs.current[id];
          if (a && hasValidAudioSrc(a) && a.paused) {
            safePlay(a, id, handoffSec);
          }
        });
      }

      await Promise.all([...stemLoadPromises, ...(masterLoadPromise ? [masterLoadPromise] : [])]);
      if (cancelled) return;
    };

    hydrateStemsAndAck();

    return () => {
      cancelled = true;
    };
  }, [
    song.id,
    song.trackKey,
    song.masterAudioUrl,
    song.stage3Status,
    song.source,
    stemSignature,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  // Apply volume, mute, solo, master mute, and playbackSpeed across all active audio elements
  useEffect(() => {
    applyAudioVolumesAndRate();
  }, [channels, playbackSpeed, isMasterMuted, applyAudioVolumesAndRate]);

  // Synchronized Metronome Click Trigger on every beat / downbeat
  useEffect(() => {
    if (!isPlaying || isMasterMuted || song.source === 'empty') {
      lastClickedBeatIdxRef.current = -1;
      return;
    }

    const metroCh = channels.find((c) => c.category === 'metronome');
    const isAnySolo = channels.some((c) => c.isSolo);
    const metroAudible =
      metroCh && !metroCh.isMuted && (!isAnySolo || metroCh.isSolo) && metroCh.volume > 0.01;
    if (!metroAudible || !metroCh) return;

    if (song.beats && song.beats.length > 0) {
      let beatIdx = -1;
      for (let i = 0; i < song.beats.length; i++) {
        if (song.beats[i].timeSec <= currentTimeSec + 0.025) {
          beatIdx = i;
        } else {
          break;
        }
      }
      if (beatIdx >= 0 && beatIdx !== lastClickedBeatIdxRef.current) {
        const beat = song.beats[beatIdx];
        if (Math.abs(currentTimeSec - beat.timeSec) < 0.14) {
          triggerMetronomeClick(Boolean(beat.isDownbeat), metroCh.volume);
        }
        lastClickedBeatIdxRef.current = beatIdx;
      }
    } else if (song.tempoBpm > 0) {
      const secPerBeat = 60 / song.tempoBpm;
      const beatIdx = Math.floor(currentTimeSec / secPerBeat);
      if (beatIdx >= 0 && beatIdx !== lastClickedBeatIdxRef.current) {
        triggerMetronomeClick(beatIdx % 4 === 0, metroCh.volume);
        lastClickedBeatIdxRef.current = beatIdx;
      }
    }
  }, [isPlaying, isMasterMuted, currentTimeSec, channels, song.beats, song.tempoBpm, song.source, triggerMetronomeClick]);

  // Time update & section/bar loop watcher (50ms precision so loop boundaries never slip)
  useEffect(() => {
    if (!isPlaying) return;

    const stopPlaybackAtEnd = () => {
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a) {
          safePause(a, id);
          if (hasValidAudioSrc(a)) {
            try {
              a.load();
            } catch {
              a.currentTime = 0;
            }
          }
        }
      });
      if (masterAudioRef.current) {
        safePause(masterAudioRef.current, 'master');
        if (hasValidAudioSrc(masterAudioRef.current)) {
          try {
            masterAudioRef.current.load();
          } catch {
            masterAudioRef.current.currentTime = 0;
          }
        }
      }
      applyAudioVolumesAndRate();
      prevTimeRef.current = 0;
      setCurrentTimeSec(0);
      setIsPlaying(false);
    };

    const enforceLoopOrUpdateTime = () => {
      if (readyStemsRef.current) {
        const leader = Object.values(stemRefs.current).find((a) => hasValidAudioSrc(a));
        if (leader) {
          const t = leader.currentTime;
          const prevT = prevTimeRef.current;
          prevTimeRef.current = t;
          const audioDur =
            Number.isFinite(leader.duration) && leader.duration > 0
              ? leader.duration
              : song.durationSec;
          const reachedEnd =
            leader.ended || (audioDur > 0 && t >= audioDur - 0.05 && leader.paused);

          if (loopRangeSec) {
            const [loopStart, loopEnd] = loopRangeSec;
            if (
              reachedEnd ||
              (prevT <= loopEnd && t >= loopEnd - 0.04) ||
              (t >= loopEnd && t <= loopEnd + 0.5)
            ) {
              Object.entries(stemRefs.current).forEach(([id, a]) => {
                if (a && hasValidAudioSrc(a)) {
                  a.currentTime = loopStart;
                  if (a.paused) {
                    a.playbackRate = playbackSpeed;
                    safePlay(a, id);
                  }
                }
              });
              prevTimeRef.current = loopStart;
              setCurrentTimeSec(loopStart);
              return;
            }
          } else if (reachedEnd) {
            stopPlaybackAtEnd();
            return;
          }

          setCurrentTimeSec(t);
          return;
        }
      }

      if (readyMasterRef.current && masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
        const master = masterAudioRef.current;
        const t = master.currentTime;
        const prevT = prevTimeRef.current;
        prevTimeRef.current = t;
        const audioDur =
          Number.isFinite(master.duration) && master.duration > 0
            ? master.duration
            : song.durationSec;
        const reachedEnd =
          master.ended || (audioDur > 0 && t >= audioDur - 0.05 && master.paused);

        if (loopRangeSec) {
          const [loopStart, loopEnd] = loopRangeSec;
          if (
            reachedEnd ||
            (prevT <= loopEnd && t >= loopEnd - 0.04) ||
            (t >= loopEnd && t <= loopEnd + 0.5)
          ) {
            master.currentTime = loopStart;
            if (master.paused) {
              master.playbackRate = playbackSpeed;
              safePlay(master, 'master');
            }
            prevTimeRef.current = loopStart;
            setCurrentTimeSec(loopStart);
            return;
          }
        } else if (reachedEnd) {
          stopPlaybackAtEnd();
          return;
        }

        setCurrentTimeSec(t);
        return;
      }

      if (isLoadingStemsRef.current || isLoadingMasterRef.current) {
        return;
      }

      if (song.durationSec <= 0) {
        setIsPlaying(false);
        return;
      }

      setCurrentTimeSec((prev) => {
        const next = prev + 0.05 * playbackSpeed;
        if (loopRangeSec) {
          const [loopStart, loopEnd] = loopRangeSec;
          if (prev <= loopEnd && next >= loopEnd) {
            return loopStart;
          }
        }
        if (next >= song.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    };

    const interval = window.setInterval(enforceLoopOrUpdateTime, 50);
    return () => window.clearInterval(interval);
  }, [
    isPlaying,
    hasReadyStems,
    hasReadyMaster,
    loopRangeSec,
    playbackSpeed,
    song.durationSec,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  const togglePlay = useCallback(() => {
    if (song.source === 'empty') return;

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a) safePause(a, id);
      });
      if (masterAudioRef.current) safePause(masterAudioRef.current, 'master');
      return;
    }

    let targetSec = currentTimeRef.current;
    if (loopRangeSec && (targetSec < loopRangeSec[0] || targetSec >= loopRangeSec[1])) {
      targetSec = loopRangeSec[0];
    } else if (!loopRangeSec && song.durationSec > 0 && targetSec >= song.durationSec - 0.15) {
      targetSec = 0;
    }

    if (targetSec !== currentTimeRef.current) {
      currentTimeRef.current = targetSec;
      setCurrentTimeSec(targetSec);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    applyAudioVolumesAndRate();

    if (readyStemsRef.current) {
      if (masterAudioRef.current) safePause(masterAudioRef.current, 'master');
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a && hasValidAudioSrc(a)) {
          safePlay(a, id, targetSec);
        }
      });
      return;
    }

    if (readyMasterRef.current && masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
      safePlay(masterAudioRef.current, 'master', targetSec);
    }
  }, [
    song.source,
    isPlaying,
    loopRangeSec,
    song.durationSec,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  const seekToSec = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, Math.min(sec, song.durationSec || 300));
      setCurrentTimeSec(clamped);
      if (masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
        masterAudioRef.current.currentTime = clamped;
      }
      Object.values(stemRefs.current).forEach((a) => {
        if (a && hasValidAudioSrc(a)) a.currentTime = clamped;
      });
    },
    [song.durationSec]
  );

  const setChannelVolume = useCallback((id: StemId, volume: number) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, volume } : c)));
  }, []);

  const toggleMute = useCallback((id: StemId) => {
    setActivePreset('full');
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, isMuted: !c.isMuted } : c)));
  }, []);

  const toggleSolo = useCallback((id: StemId) => {
    setActivePreset('full');
    setChannels((prev) => {
      const target = prev.find((c) => c.id === id);
      const nextSolo = !target?.isSolo;
      return prev.map((c) => ({ ...c, isSolo: c.id === id ? nextSolo : false }));
    });
  }, []);

  const applyMixPreset = useCallback((preset: MixPresetId) => {
    setActivePreset(preset);
    setChannels((prev) =>
      prev.map((c) => {
        if (c.category === 'metronome') {
          return c;
        }
        if (preset === 'full') {
          return { ...c, isMuted: false, isSolo: false };
        }
        if (preset === 'guitar_backing') {
          return { ...c, isMuted: c.category === 'guitar', isSolo: false };
        }
        if (preset === 'vocal_karaoke') {
          return { ...c, isMuted: c.category === 'vocals', isSolo: false };
        }
        if (preset === 'guitar_focus') {
          return { ...c, isMuted: false, isSolo: c.category === 'guitar' };
        }
        if (preset === 'rhythm_section') {
          return { ...c, isMuted: c.category !== 'bass' && c.category !== 'drums', isSolo: false };
        }
        return c;
      })
    );
  }, []);

  const resetChannels = useCallback(() => {
    setActivePreset('full');
    setChannels((prev) =>
      prev.map((c) => {
        const vis = CATEGORY_VISUALS[c.category] || CATEGORY_VISUALS.other;
        return {
          ...c,
          volume: vis.defaultVolume,
          isMuted: c.category === 'metronome' ? c.isMuted : false,
          isSolo: false
        };
      })
    );
  }, []);

  const isMetronomeActive = Boolean(
    channels.find((c) => c.category === 'metronome' && !c.isMuted)
  );

  const toggleMetronome = useCallback(() => {
    setChannels((prev) =>
      prev.map((c) =>
        c.category === 'metronome'
          ? { ...c, isMuted: !c.isMuted, volume: c.volume <= 0.05 ? 0.7 : c.volume }
          : c
      )
    );
  }, []);

  const toggleMasterMute = useCallback(() => {
    setIsMasterMuted((prev) => !prev);
  }, []);

  return {
    isPlaying,
    isMasterMuted,
    currentTimeSec,
    channels,
    activePreset,
    hasStemAudio,
    hasMasterAudio,
    isMetronomeActive,
    toggleMetronome,
    toggleMasterMute,
    togglePlay,
    seekToSec,
    setChannelVolume,
    toggleMute,
    toggleSolo,
    applyMixPreset,
    resetChannels
  };
}
```

## `production/web/src/i18n/translations.ts`

```ts
import { AppLanguage, InstrumentType, MixPresetId, StemCategory } from '../types/studio';

export const SUPPORTED_LANGUAGES: { id: AppLanguage; label: string; nativeLabel: string }[] = [
  { id: 'en', label: 'English', nativeLabel: 'English' },
  { id: 'tr', label: 'Turkish', nativeLabel: 'Türkçe' }
];

const LANGUAGE_STORAGE_KEY = 'kythra_studio_lang';

export function detectInitialLanguage(): AppLanguage {
  if (typeof window === 'undefined') return 'en';
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as AppLanguage | null;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.id === saved)) {
      return saved;
    }
  } catch {
    // ignore storage access issues
  }

  const navLangs =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || 'en']
      : ['en'];

  for (const raw of navLangs) {
    const code = (raw || '').toLowerCase().split(/[-_]/)[0];
    if (code === 'tr') return 'tr';
    if (code === 'en') return 'en';
  }

  return 'en';
}

export function persistLanguage(lang: AppLanguage): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export interface TranslationCatalog {
  header: {
    searchPlaceholder: string;
    clearSearch: string;
    uploadBtnFull: string;
    uploadBtnShort: string;
    uploadTitle: string;
    close: string;
    dropzoneHeadline: string;
    dropzoneSubtext: string;
    chooseFileBtn: string;
    supportedFormats: string;
    uploadLimits: string;
    replaceAudioBtn: string;
    libraryFoundTitle: string;
    recentReadyTitle: string;
    emptySearchHint: string;
    readyBadge: string;
    analyzeBadge: string;
    loadingStudioTitle: string;
    loadingStudioSub: string;
    analyzingAudioFile: string;
    switchToLight: string;
    switchToDark: string;
    uploadingAudio: string;
    preparingHarmonic: string;
    errSongLoad: string;
    errAudioUpload: string;
    localDeviceNotice: string;
    signInBtn: string;
    signUpTab: string;
    signInTab: string;
    myAccountBtn: string;
    emailLabel: string;
    signUpEmailLabel: string;
    usernameLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    showPasswordTooltip: string;
    hidePasswordTooltip: string;
    passwordMismatchError: string;
    invalidEmailError: string;
    signOutBtn: string;
    favoritesTab: string;
    myUploadsTab: string;
    emptyFavorites: string;
    emptyUploads: string;
    accountSettingsTitle: string;
    newPasswordOptionalLabel: string;
    confirmNewPasswordLabel: string;
    saveProfileBtn: string;
    profileUpdatedMsg: string;
    renameTrackTooltip: string;
    deleteTrackTooltip: string;
    confirmDeleteBtn: string;
    cancelActionBtn: string;
    saveTitleBtn: string;
    trackTitlePlaceholder: string;
  };
  welcome: {
    badge: string;
    title: string;
    subtitle: string;
    singleCardTitle: string;
    singleCardDesc: string;
    singleCardBtn: string;
    recentTitle: string;
  };
  infoStrip: {
    ariaLabel: string;
    barsUnit: string;
    tempoLabel: string;
    keyLabel: string;
    favoriteTooltip: string;
  };
  workspace: {
    sectionFallback: string;
    barLabel: string;
    prevChord: string;
    currentChord: string;
    nextChord: string;
    endChord: string;
    diagramHeaderSuffix: string;
    activeDiagramRole: string;
    nextDiagramRole: string;
    capoBadge: string;
    positionTooltip: (pos: number, fret: number) => string;
    sectionsAria: string;
  };
  karaoke: {
    ariaLabel: string;
    emptyLyrics: string;
    nowBadge: string;
    nextBadge: string;
    vocalCountdown: (timeStr: string) => string;
    seekTooltip: (timeStr: string) => string;
    instrumentalIntro: string;
    editLyricsBtn: string;
    addLyricsBtn: string;
    lockedLrclibBadge: string;
    versionBadge: (ver: number, user?: string | null) => string;
    editorTitle: string;
    sectionSelectLabel: string;
    addLineAtCurrentTime: (timeStr: string) => string;
    addLineToSection: (secName: string) => string;
    stampCurrentTime: string;
    linePlaceholder: string;
    saveLyricsBtn: string;
    cancelBtn: string;
    revisionsTitle: string;
    noRevisionsYet: string;
  };
  docker: {
    ariaLabel: string;
    prevBar: string;
    play: string;
    pause: string;
    nextBar: string;
    loopActive: string;
    loopSectionTooltip: (secName: string) => string;
    loopBarsTooltip: (start: number, end: number) => string;
    loopToggleTooltip: string;
    metronomeActiveTooltip: string;
    metronomeInactiveTooltip: string;
    waveformAria: string;
    instrumentBtnTitle: string;
    speedBtnTitle: string;
    transposeBtnLabel: string;
    transposeBtnTitle: string;
    mixerBtnLabel: string;
    mixerBtnTitle: string;
    masterMuteTitle: string;
    masterUnmuteTitle: string;
    settingsBtnTitle: string;
    popovers: {
      instrumentTitle: string;
      speedTitle: string;
      reset1x: string;
      transposeCapoTitle: string;
      resetBtn: string;
      transposeSemitones: string;
      capoFret: string;
      capoNone: string;
      capoFretValue: (fret: number) => string;
      mixerTitle: (count?: number) => string;
      stage3RunningMsg: string;
      muteTooltip: (ch: string) => string;
      soloTooltip: (ch: string) => string;
      settingsTitle: string;
      languageLabel: string;
      chordVoicingLabel: string;
      chordBasic: string;
      chordAll: string;
      quickMixPresetsLabel: string;
    };
    instruments: Record<InstrumentType, { name: string; tuning: string }>;
    channels: Record<StemCategory, string>;
    presets: Record<MixPresetId, string>;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationCatalog> = {
  en: {
    header: {
      searchPlaceholder: 'Search your library & uploads...',
      clearSearch: 'Clear search',
      uploadBtnFull: 'New Project',
      uploadBtnShort: 'Upload',
      uploadTitle: 'Open Music Studio',
      close: 'Close',
      dropzoneHeadline: 'Drag and drop an audio file here',
      dropzoneSubtext: 'or click to browse from your device',
      chooseFileBtn: 'Choose File',
      supportedFormats: 'Supported Audio Formats',
      uploadLimits: 'Max 100 MB · 10 min',
      replaceAudioBtn: 'Change',
      libraryFoundTitle: 'Matching Songs in Your Library',
      recentReadyTitle: 'Recent & Ready Projects',
      emptySearchHint: 'No saved songs match yet. Upload an audio track to begin.',
      readyBadge: 'Ready',
      analyzeBadge: 'Analyze',
      loadingStudioTitle: 'Preparing song in studio...',
      loadingStudioSub: 'Loading track analysis, please wait...',
      analyzingAudioFile: 'Analyzing audio file...',
      switchToLight: 'Switch to Light Theme',
      switchToDark: 'Switch to Dark Theme',
      uploadingAudio: 'Loading audio file into studio...',
      preparingHarmonic: 'Analyzing tempo, key, structure & chords (Channel separation runs in background)...',
      errSongLoad: 'Could not load song.',
      errAudioUpload: 'Could not upload audio file.',
      localDeviceNotice: 'Note: Uploaded audio files are saved privately in your account storage and cached locally for instant playback.',
      signInBtn: 'Sign In',
      signUpTab: 'Sign Up',
      signInTab: 'Sign In',
      myAccountBtn: 'My Account',
      emailLabel: 'Email Address',
      signUpEmailLabel: 'Email Address',
      usernameLabel: 'Display Name',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      showPasswordTooltip: 'Show password',
      hidePasswordTooltip: 'Hide password',
      passwordMismatchError: 'Passwords do not match.',
      invalidEmailError: 'Please enter a valid email address.',
      signOutBtn: 'Sign Out',
      favoritesTab: 'Favorites',
      myUploadsTab: 'My Uploads',
      emptyFavorites: 'No favorite songs yet. Tap the star icon next to a song title to add it.',
      emptyUploads: 'No private uploaded tracks yet. Uploaded files are visible only to you.',
      accountSettingsTitle: 'Account Settings',
      newPasswordOptionalLabel: 'New Password (optional)',
      confirmNewPasswordLabel: 'Confirm New Password',
      saveProfileBtn: 'Save Changes',
      profileUpdatedMsg: 'Account settings updated successfully.',
      renameTrackTooltip: 'Rename Song',
      deleteTrackTooltip: 'Delete Song',
      confirmDeleteBtn: 'Delete',
      cancelActionBtn: 'Cancel',
      saveTitleBtn: 'Save',
      trackTitlePlaceholder: 'Song title'
    },
    welcome: {
      badge: 'Post-AI Music & Practice Studio',
      title: 'Turn Any Song Into an Interactive Studio',
      subtitle: 'Upload any audio track for automatic BPM, chord, song section detection, and 6-channel AI instrument separation.',
      singleCardTitle: 'Single Track Upload',
      singleCardDesc: 'Upload MP3, WAV, FLAC, OGG, or M4A. Automatically detects BPM, chords, song sections, and splits instruments.',
      singleCardBtn: 'Upload Audio File',
      recentTitle: 'Your Recent Projects'
    },
    infoStrip: {
      ariaLabel: 'Track Metadata',
      barsUnit: 'Bars',
      tempoLabel: 'Tempo:',
      keyLabel: 'Key:',
      favoriteTooltip: 'Toggle Favorite'
    },
    workspace: {
      sectionFallback: 'Section',
      barLabel: 'Bar',
      prevChord: 'Previous',
      currentChord: 'Current Chord',
      nextChord: 'Next',
      endChord: 'End',
      diagramHeaderSuffix: 'Diagram',
      activeDiagramRole: 'Active',
      nextDiagramRole: 'Next',
      capoBadge: 'Capo',
      positionTooltip: (pos, fret) => `Voicing ${pos} (Fret ${fret})`,
      sectionsAria: 'Song Sections'
    },
    karaoke: {
      ariaLabel: 'Synchronized Lyrics',
      emptyLyrics: 'No synchronized lyrics available or instrumental track is playing.',
      nowBadge: 'Now',
      nextBadge: 'Next',
      vocalCountdown: (t) => `Vocals -${t}`,
      seekTooltip: (t) => `Jump to ${t}`,
      instrumentalIntro: '♪ Instrumental Intro ♪',
      editLyricsBtn: 'Edit Lyrics',
      addLyricsBtn: 'Add Lyrics',
      lockedLrclibBadge: 'Verified Synced Lyrics',
      versionBadge: (v, u) => `v${v}${u ? ` · by ${u}` : ''}`,
      editorTitle: 'Section-Based Lyric Studio & Live Sync',
      sectionSelectLabel: 'Song Sections',
      addLineAtCurrentTime: (t) => `+ Add Line at Playhead (${t})`,
      addLineToSection: (s) => `+ Add Line to ${s}`,
      stampCurrentTime: 'Sync to Current Time',
      linePlaceholder: 'Type lyric line...',
      saveLyricsBtn: 'Save Lyrics',
      cancelBtn: 'Close',
      revisionsTitle: 'Revision History',
      noRevisionsYet: 'No revisions recorded yet.'
    },
    docker: {
      ariaLabel: 'Studio Transport & Control Dock',
      prevBar: 'Restart Song',
      play: 'Play (Space)',
      pause: 'Pause (Space)',
      nextBar: 'Next Bar',
      loopActive: 'Loop Active',
      loopSectionTooltip: (sec) => `Loop Active: ${sec}`,
      loopBarsTooltip: (s, e) => `Loop Active: Bar ${s}–${e}`,
      loopToggleTooltip: 'Loop Current Section or Selected Bars',
      metronomeActiveTooltip: 'Metronome On (Click to mute · Volume in Mixer)',
      metronomeInactiveTooltip: 'Turn On Metronome (Adjust volume in Mixer)',
      waveformAria: 'Waveform Timeline Scrubber',
      instrumentBtnTitle: 'Selected Instrument',
      speedBtnTitle: 'Playback Speed',
      transposeBtnLabel: 'Transpose',
      transposeBtnTitle: 'Transpose & Capo',
      mixerBtnLabel: 'Mixer',
      mixerBtnTitle: 'Multi-Track Stem Mixer',
      masterMuteTitle: 'Mute All Audio',
      masterUnmuteTitle: 'Unmute Audio',
      settingsBtnTitle: 'Studio Settings',
      popovers: {
        instrumentTitle: 'Select Instrument',
        speedTitle: 'Playback Speed',
        reset1x: 'Reset 1.0x',
        transposeCapoTitle: 'Transpose & Capo',
        resetBtn: 'Reset',
        transposeSemitones: 'Transpose (Semitones)',
        capoFret: 'Capo Fret (0–12)',
        capoNone: 'None',
        capoFretValue: (f) => `Fret ${f}`,
        mixerTitle: () => 'Studio Mixer',
        stage3RunningMsg: 'Channel separation is running in the background (Master mix playing)...',
        muteTooltip: (ch) => `Mute ${ch}`,
        soloTooltip: (ch) => `Solo ${ch}`,
        settingsTitle: 'Studio Settings',
        languageLabel: 'Language',
        chordVoicingLabel: 'Chord Notation',
        chordBasic: 'Basic (Triads)',
        chordAll: 'Full (7ths / Extensions)',
        quickMixPresetsLabel: 'Quick Mix Presets'
      },
      instruments: {
        guitar: { name: 'Guitar', tuning: '6 Strings · E A D G B e' },
        piano: { name: 'Piano', tuning: '88 Keys · 2-Octave View' },
        ukulele: { name: 'Ukulele', tuning: '4 Strings · G C E A' }
      },
      channels: {
        guitar: 'Guitar',
        vocals: 'Vocals',
        bass: 'Bass',
        drums: 'Drums',
        piano: 'Piano',
        other: 'Other',
        metronome: 'Metronome'
      },
      presets: {
        full: 'Full Mix',
        guitar_backing: 'Guitar Backing',
        guitar_focus: 'Guitar Solo',
        vocal_karaoke: 'Karaoke',
        rhythm_section: 'Rhythm Section'
      }
    }
  },
  tr: {
    header: {
      searchPlaceholder: 'Kütüphanende ve yüklemelerinde ara...',
      clearSearch: 'Aramayı temizle',
      uploadBtnFull: 'Yeni Proje',
      uploadBtnShort: 'Yükle',
      uploadTitle: 'Müzik Stüdyosunu Başlat',
      close: 'Kapat',
      dropzoneHeadline: 'Ses dosyasını buraya sürükleyip bırakın',
      dropzoneSubtext: 'veya cihazınızdan dosya seçmek için tıklayın',
      chooseFileBtn: 'Dosya Seç',
      supportedFormats: 'Desteklenen Ses Formatları',
      uploadLimits: 'Maks. 100 MB · 10 dk',
      replaceAudioBtn: 'Değiştir',
      libraryFoundTitle: 'Kütüphanende Bulunanlar',
      recentReadyTitle: 'Kayıtlı Projelerin & Hazır Şarkılar',
      emptySearchHint: 'Eşleşen kayıtlı şarkı yok. Başlamak için tek bir ses dosyası yükleyin.',
      readyBadge: 'Hazır',
      analyzeBadge: 'Çözümle',
      loadingStudioTitle: 'Şarkı stüdyoya hazırlanıyor...',
      loadingStudioSub: 'Şarkı analizi yükleniyor, lütfen bekleyin...',
      analyzingAudioFile: 'Ses dosyası çözümleniyor...',
      switchToLight: 'Açık Temaya Geç',
      switchToDark: 'Koyu Temaya Geç',
      uploadingAudio: 'Ses dosyası stüdyoya alınıyor...',
      preparingHarmonic: 'Tempo, Ton, Şarkı Bölümleri ve Akorlar hazırlanıyor (Kanal ayrıştırma arka planda başlar)...',
      errSongLoad: 'Şarkı yüklenemedi.',
      errAudioUpload: 'Ses dosyası yüklenemedi.',
      localDeviceNotice: 'Bilgi: Yüklediğiniz ses dosyaları hesabınıza özel olarak kalıcı diskte saklanır ve hızlı oynatma için tarayıcınızda önbelleğe alınır.',
      signInBtn: 'Giriş Yap',
      signUpTab: 'Kayıt Ol',
      signInTab: 'Giriş Yap',
      myAccountBtn: 'Hesabım',
      emailLabel: 'E-posta Adresi',
      signUpEmailLabel: 'E-posta Adresi',
      usernameLabel: 'Görünen Ad',
      passwordLabel: 'Parola',
      confirmPasswordLabel: 'Parolayı Doğrula (Tekrar)',
      showPasswordTooltip: 'Parolayı göster',
      hidePasswordTooltip: 'Parolayı gizle',
      passwordMismatchError: 'Girilen parolalar birbiriyle eşleşmiyor.',
      invalidEmailError: 'Lütfen geçerli bir e-posta adresi girin.',
      signOutBtn: 'Çıkış Yap',
      favoritesTab: 'Favorilerim',
      myUploadsTab: 'Yüklediklerim',
      emptyFavorites: 'Henüz favori şarkınız yok. Şarkı başlığının yanındaki yıldız ikonuna tıklayarak ekleyebilirsiniz.',
      emptyUploads: 'Henüz yüklediğiniz özel bir ses dosyası yok. Yüklediğiniz dosyalar yalnızca size özeldir.',
      accountSettingsTitle: 'Hesap Ayarları',
      newPasswordOptionalLabel: 'Yeni Parola (isteğe bağlı)',
      confirmNewPasswordLabel: 'Yeni Parolayı Doğrula',
      saveProfileBtn: 'Değişiklikleri Kaydet',
      profileUpdatedMsg: 'Hesap bilgileriniz güncellendi.',
      renameTrackTooltip: 'Şarkı Adını Değiştir',
      deleteTrackTooltip: 'Şarkıyı Sil',
      confirmDeleteBtn: 'Sil',
      cancelActionBtn: 'İptal',
      saveTitleBtn: 'Kaydet',
      trackTitlePlaceholder: 'Şarkı adı'
    },
    welcome: {
      badge: 'AI Sonrası Müzik & Pratik Stüdyosu',
      title: 'Kendi Şarkını Etkileşimli Bir Stüdyoya Dönüştür',
      subtitle: 'Tek bir ses dosyası yükleyin; tempo, akorlar, şarkı bölümleri ve 6 kanallı AI enstrüman ayrıştırma otomatik olarak hazırlansın.',
      singleCardTitle: 'Tek Parça Yükle',
      singleCardDesc: 'MP3, WAV, FLAC, OGG veya M4A yükleyin. Tempo, akorlar, şarkı bölümleri ve enstrüman kanalları otomatik çıkarılsın.',
      singleCardBtn: 'Ses Dosyası Yükle',
      recentTitle: 'Son Projelerin'
    },
    infoStrip: {
      ariaLabel: 'Şarkı Bilgileri',
      barsUnit: 'Bar',
      tempoLabel: 'Metronom:',
      keyLabel: 'Ton:',
      favoriteTooltip: 'Favorilere Ekle / Çıkar'
    },
    workspace: {
      sectionFallback: 'Bölüm',
      barLabel: 'Bar',
      prevChord: 'Önceki',
      currentChord: 'Şu Anki Akor',
      nextChord: 'Sıradaki',
      endChord: 'Son',
      diagramHeaderSuffix: 'Diyagramı',
      activeDiagramRole: 'Aktif',
      nextDiagramRole: 'Sıradaki',
      capoBadge: 'Capo',
      positionTooltip: (pos, fret) => `Pozisyon ${pos} (${fret}. Perde)`,
      sectionsAria: 'Şarkı Bölümleri'
    },
    karaoke: {
      ariaLabel: 'Senkronize Şarkı Sözleri',
      emptyLyrics: 'Bu şarkı için senkronize şarkı sözü bulunamadı veya enstrümantal parça çalıyor.',
      nowBadge: 'Şu An',
      nextBadge: 'Sıradaki',
      vocalCountdown: (t) => `Vokal -${t}`,
      seekTooltip: (t) => `${t} konumuna git`,
      instrumentalIntro: '♪ Enstrümantal Giriş (Intro) ♪',
      editLyricsBtn: 'Sözleri Düzenle',
      addLyricsBtn: 'Şarkı Sözü Ekle',
      lockedLrclibBadge: 'Doğrulanmış Senkron Söz',
      versionBadge: (v, u) => `v${v}${u ? ` · ${u}` : ''}`,
      editorTitle: 'Bölüm Bazlı Şarkı Sözü Editörü & Canlı Senkron',
      sectionSelectLabel: 'Şarkı Bölümleri',
      addLineAtCurrentTime: (t) => `+ Çalan Saniyeye Satır Ekle (${t})`,
      addLineToSection: (s) => `+ ${s} Bölümüne Satır Ekle`,
      stampCurrentTime: 'Şu Anki Saniyeye Eşitle',
      linePlaceholder: 'Şarkı sözü satırını yazın...',
      saveLyricsBtn: 'Sözleri Kaydet',
      cancelBtn: 'Kapat',
      revisionsTitle: 'Düzenleme Geçmişi (Log)',
      noRevisionsYet: 'Henüz kullanıcı düzenlemesi kaydı bulunmuyor.'
    },
    docker: {
      ariaLabel: 'Stüdyo Kontrol Merkezi',
      prevBar: 'Şarkının Başına Dön',
      play: 'Oynat (Space)',
      pause: 'Duraklat (Space)',
      nextBar: 'Sonraki Ölçü (Bar)',
      loopActive: 'Loop Aktif',
      loopSectionTooltip: (sec) => `Loop Aktif: ${sec}`,
      loopBarsTooltip: (s, e) => `Loop Aktif: Bar ${s}–${e}`,
      loopToggleTooltip: 'Mevcut Bölümü veya Seçili Barları Döngüye Al (Loop)',
      metronomeActiveTooltip: 'Metronom Açık (Kapatmak için tıklayın · Ses seviyesi Mikser\'de)',
      metronomeInactiveTooltip: 'Metronomu Aç (Ses seviyesi Mikser\'den ayarlanabilir)',
      waveformAria: 'Waveform Zaman Çizelgesi',
      instrumentBtnTitle: 'Seçili Enstrüman',
      speedBtnTitle: 'Çalma Hızı (Tempo)',
      transposeBtnLabel: 'Transpoze',
      transposeBtnTitle: 'Transpoze & Capo',
      mixerBtnLabel: 'Mikser',
      mixerBtnTitle: 'Çok Kanallı Stüdyo Mikseri',
      masterMuteTitle: 'Tüm Sesi Kapat (Sessize Al)',
      masterUnmuteTitle: 'Sesi Aç',
      settingsBtnTitle: 'Stüdyo Ayarları',
      popovers: {
        instrumentTitle: 'Enstrüman Seçimi',
        speedTitle: 'Çalma Hızı',
        reset1x: '1.0x Sıfırla',
        transposeCapoTitle: 'Transpoze & Capo',
        resetBtn: 'Sıfırla',
        transposeSemitones: 'Transpoze (Yarım Ses)',
        capoFret: 'Capo Perdesi (0–12)',
        capoNone: 'Yok',
        capoFretValue: (f) => `${f}. Perde`,
        mixerTitle: () => 'Stüdyo Mikseri',
        stage3RunningMsg: 'Kanal ayrıştırma arka planda sürüyor (Master ses çalıyor)...',
        muteTooltip: (ch) => `${ch} Sustur (Mute)`,
        soloTooltip: (ch) => `${ch} Solo`,
        settingsTitle: 'Stüdyo Ayarları',
        languageLabel: 'Uygulama Dili',
        chordVoicingLabel: 'Akor Gösterimi',
        chordBasic: 'Temel (Basic)',
        chordAll: 'Tam (7\'li / Tüm Akorlar)',
        quickMixPresetsLabel: 'Hızlı Miks Presetleri'
      },
      instruments: {
        guitar: { name: 'Gitar', tuning: '6 Tel · E A D G B e' },
        piano: { name: 'Piyano', tuning: '88 Tuş · 2 Oktav Görünüm' },
        ukulele: { name: 'Ukulele', tuning: '4 Tel · G C E A' }
      },
      channels: {
        guitar: 'Gitar',
        vocals: 'Vokal',
        bass: 'Bas',
        drums: 'Davul',
        piano: 'Piyano',
        other: 'Diğer',
        metronome: 'Metronom'
      },
      presets: {
        full: 'Tam Miks',
        guitar_backing: 'Gitarsız Backing',
        guitar_focus: 'Sadece Gitar',
        vocal_karaoke: 'Karaoke',
        rhythm_section: 'Ritim Grubu'
      }
    }
  }
};
```

## `production/web/src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './material3';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## `production/web/src/material3.ts`

```ts
/**
 * Official Google Material 3 Web Components (@material/web) Registry
 * Reference: https://m3.material.io/develop/web
 */
import '@material/web/typography/md-typescale-styles.css';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/slider/slider.js';
import '@material/web/chips/chip-set.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/tabs/tabs.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/dialog/dialog.js';
import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/ripple/ripple.js';
import '@material/web/elevation/elevation.js';
import '@material/web/divider/divider.js';
```

## `production/web/src/types/studio.ts`

```ts
export type StemCategory = 'guitar' | 'bass' | 'drums' | 'vocals' | 'piano' | 'other' | 'metronome';

export type StemId = string;

export type InstrumentType = 'guitar' | 'piano' | 'ukulele';

export type ChordComplexityMode = 'basic' | 'all';

export type MixPresetId = 'full' | 'guitar_backing' | 'vocal_karaoke' | 'guitar_focus' | 'rhythm_section';

export type DockerPopoverId = 'instrument' | 'speed' | 'pitch_capo' | 'mixer' | 'settings' | null;

export type AppLanguage = 'en' | 'tr';

export interface BeatItem {
  beatNumber: number;
  timeSec: number;
  isDownbeat: boolean;
  barIndex: number;
}

export interface SubChordEvent {
  chord: string;
  startSec: number;
  endSec: number;
  durationSec: number;
}

export interface BarChordItem {
  barNumber: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  chord: string;
  subChords: SubChordEvent[];
}

export interface SongSection {
  id: string;
  name: string;
  rawLabel: string;
  startBar: number;
  endBar: number;
  startSec: number;
  endSec: number;
}

export interface StemChannelState {
  id: StemId;
  category: StemCategory;
  label: string;
  role: string;
  icon: string;
  color: string;
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  detected: boolean;
  presenceLabel: string;
  rmsDbfs?: number;
  audioUrl?: string;
}

export interface LyricWordItem {
  word: string;
  startSec: number;
  endSec: number;
}

export interface LyricLineItem {
  startSec: number;
  endSec: number;
  text: string;
  words?: LyricWordItem[];
}

export type LyricsSourceType = 'lrclib' | 'ai' | 'user' | 'none';

export interface StudioSong {
  id: string;
  trackKey: string;
  isPrivate?: boolean;
  stemOrder?: string[];
  source: 'live' | 'empty';
  title: string;
  artist: string;
  durationSec: number;
  tempoBpm: number;
  timeSignature: string;
  keySignature: string;
  primaryProgression: string;
  totalBars: number;
  sections: SongSection[];
  bars: BarChordItem[];
  beats: BeatItem[];
  lyrics: LyricLineItem[];
  lyricsSource?: LyricsSourceType;
  lyricsLocked?: boolean;
  lyricsVersion?: number;
  lyricsUpdatedBy?: string | null;
  waveformPeaks: number[];
  stage3Status: 'pending' | 'running' | 'completed' | 'error';
  stage4Status?: 'pending' | 'running' | 'completed' | 'error';
  sectionsRefining?: boolean;
  pipelineVersion?: string;
  cacheHit?: boolean;
  masterAudioUrl?: string;
  stems: Record<string, {
    id: string;
    label?: string;
    category: StemCategory;
    url?: string;
    detected: boolean;
    rmsDbfs?: number;
    presenceLabel: string;
  }>;
}

export interface StudioUser {
  id: string;
  email: string;
  username: string;
  role?: 'user' | 'developer';
}

export interface FavoriteSongItem {
  track_key: string;
  title: string;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  is_private?: boolean;
  created_at: string;
}

export interface PrivateUploadedSongItem {
  track_key: string;
  title: string;
  duration_sec: number;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  primary_progression: string;
  pipeline_version: string;
  is_private: boolean;
  updated_at: string;
}

export interface LyricRevisionItem {
  id: number;
  track_key: string;
  version_num: number;
  user_id?: string | null;
  username: string;
  change_summary: string;
  created_at: string;
}

export interface LibrarySongItem {
  track_key: string;
  title: string;
  duration_sec: number;
  tempo_bpm: number;
  key_signature: string;
  time_signature: string;
  primary_progression: string;
  pipeline_version: string;
  is_current_version: boolean;
  is_private?: boolean;
  updated_at: string;
}
```

## `production/web/src/utils/clientAudioCache.ts`

```ts
/**
 * Client-Side Browser Audio Cache (IndexedDB + In-Memory Blob URL Pool)
 * - Caches Master & 6 Separated Stem audio blobs locally on the user's device (IndexedDB)
 *   for instant studio playback and zero redundant network transfers across sessions.
 */

const DB_NAME = 'kythra_client_audio_cache_v1';
const STORE_NAME = 'audio_blobs';
const DB_VERSION = 1;

function openAudioCacheDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveAudioBlobToClientDb(
  trackKey: string,
  channelId: string,
  blob: Blob
): Promise<void> {
  try {
    const db = await openAudioCacheDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({
        cacheKey: `${trackKey}::${channelId}`,
        trackKey,
        channelId,
        blob,
        updatedAt: Date.now()
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore quota or private-browsing IndexedDB restrictions
  }
}

export async function loadAudioBlobFromClientDb(
  trackKey: string,
  channelId: string
): Promise<Blob | null> {
  try {
    const db = await openAudioCacheDb();
    const record = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${trackKey}::${channelId}`);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (record && record.blob instanceof Blob && record.blob.size > 0) {
      return record.blob;
    }
    return null;
  } catch {
    return null;
  }
}

export async function hasCachedTrackInClientDb(trackKey: string): Promise<boolean> {
  const master = await loadAudioBlobFromClientDb(trackKey, 'master');
  if (master) return true;
  const guitar = await loadAudioBlobFromClientDb(trackKey, 'guitar');
  return Boolean(guitar);
}

export async function listCachedChannelIdsForTrack(trackKey: string): Promise<string[]> {
  if (!trackKey) return [];
  try {
    const db = await openAudioCacheDb();
    const channelIds = new Set<string>();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return;
        const val = cursor.value as
          | { cacheKey?: string; trackKey?: string; channelId?: string; blob?: unknown }
          | undefined;
        const matchesTrack =
          val?.trackKey === trackKey ||
          (typeof val?.cacheKey === 'string' && val.cacheKey.startsWith(`${trackKey}::`));
        if (matchesTrack && val?.blob instanceof Blob && val.blob.size > 0) {
          const chId =
            val.channelId ||
            (typeof val.cacheKey === 'string' ? val.cacheKey.slice(trackKey.length + 2) : '');
          if (chId) {
            channelIds.add(chId);
          }
        }
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return Array.from(channelIds);
  } catch {
    return [];
  }
}

export async function deleteCachedTrackFromClientDb(trackKey: string): Promise<void> {
  if (!trackKey) return;
  try {
    const db = await openAudioCacheDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = () => {
        const cursor = req.result;
        if (!cursor) return;
        const val = cursor.value as { cacheKey?: string; trackKey?: string } | undefined;
        if (
          val?.trackKey === trackKey ||
          (typeof val?.cacheKey === 'string' && val.cacheKey.startsWith(`${trackKey}::`))
        ) {
          cursor.delete();
        }
        cursor.continue();
      };
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore IndexedDB unavailability
  }
}
```

## `production/web/src/utils/musicTheory.ts`

```ts
import { AppLanguage, ChordComplexityMode } from '../types/studio';

const NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0, 'B#': 0,
  'C#': 1, Db: 1,
  D: 2,
  'D#': 3, Eb: 3,
  E: 4, Fb: 4,
  F: 5, 'E#': 5,
  'F#': 6, Gb: 6,
  G: 7,
  'G#': 8, Ab: 8,
  A: 9,
  'A#': 10, Bb: 10,
  B: 11, Cb: 11
};

export function transposeNote(note: string, semitones: number, preferFlats = false): string {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note;
  const nextIdx = ((idx + semitones) % 12 + 12) % 12;
  return preferFlats ? NOTES_FLAT[nextIdx] : NOTES_SHARP[nextIdx];
}

export function simplifyChordToBasic(chord: string): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N') return chord || '—';
  const main = chord.split('/')[0];
  const match = main.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return main;
  const [, root, suffix] = match;
  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  if (isDim) return `${root}dim`;
  return `${root}${isMinor ? 'm' : ''}`;
}

export function transposeChord(
  chord: string,
  semitones: number,
  complexity: ChordComplexityMode = 'all'
): string {
  if (!chord || chord === 'N.C.' || chord === '—' || chord === 'N') {
    return '—';
  }
  const baseChord = complexity === 'basic' ? simplifyChordToBasic(chord) : chord;
  if (semitones === 0) return baseChord;

  if (baseChord.includes('/')) {
    const [main, bass] = baseChord.split('/');
    return `${transposeChord(main, semitones, complexity)}/${transposeChord(bass, semitones, complexity)}`;
  }

  const match = baseChord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return baseChord;
  const [, root, suffix] = match;
  const preferFlats = root.includes('b');
  const nextRoot = transposeNote(root, semitones, preferFlats);
  return `${nextRoot}${suffix}`;
}

export function getCapoAdjustedChord(
  chord: string,
  transposeSemitones: number,
  capo: number,
  complexity: ChordComplexityMode = 'all'
): { soundingChord: string; shapeChord: string } {
  const soundingChord = transposeChord(chord, transposeSemitones, complexity);
  const shapeChord = capo > 0 ? transposeChord(soundingChord, -capo, complexity) : soundingChord;
  return { soundingChord, shapeChord };
}

export function transposeKeySignature(
  keySignature: string,
  semitones: number,
  _lang: AppLanguage = 'en'
): string {
  if (!keySignature) return 'C';
  const parts = keySignature.trim().split(/\s+/);
  const root = parts[0] || 'C';
  const modeRaw = (parts[1] || 'major').toLowerCase();
  const isMinor = modeRaw.includes('min') || modeRaw === 'm';
  const transposedRoot = semitones === 0 ? root : transposeNote(root, semitones, root.includes('b'));
  return `${transposedRoot}${isMinor ? 'm' : ''}`;
}

export interface FretPositionVariation {
  frets: Array<number | 'x'>;   // Relative fret numbers (0 = open, 'x' = muted, 1..5 = fret inside box)
  fingers: Array<number | 0>;   // Finger number (1..4, 0 = none)
  baseFret: number;             // Starting fret of diagram box (1..12)
  barre?: { fret: number; fromString: number; toString: number; finger: number };
  stringNotes: string[];        // Sounded note on each string
}

export interface MultiInstrumentChordInfo {
  symbol: string;
  shapeSymbol: string;
  root: string;
  qualityLabel: string;
  notes: string[];
  pianoMidiKeys: number[]; // Relative to C3=0 .. B4=23
  guitarPositions: FretPositionVariation[];
  ukulelePositions: FretPositionVariation[];
}

// Standard tuning open string pitch classes:
// Guitar: E2(4), A2(9), D3(2), G3(7), B3(11), E4(4)
const GUITAR_OPEN_PC = [4, 9, 2, 7, 11, 4];
// Ukulele: G4(7), C4(0), E4(4), A4(9)
const UKULELE_OPEN_PC = [7, 0, 4, 9];

function computeStringNotes(
  openPcs: number[],
  frets: Array<number | 'x'>,
  baseFret: number
): string[] {
  return frets.map((f, idx) => {
    if (f === 'x') return '×';
    const actualFret = f === 0 ? 0 : baseFret + f - 1;
    const pc = (openPcs[idx] + actualFret) % 12;
    return NOTES_SHARP[pc];
  });
}

/**
 * Generates authentic multi-position Guitar (E-form, A-form, open) and Ukulele voicings
 * for any root (0..11) and quality (major, minor, 7, m7, maj7, sus4).
 */
function buildGuitarPositions(rootPc: number, isMinor: boolean, has7: boolean, hasMaj7: boolean): FretPositionVariation[] {
  const variations: FretPositionVariation[] = [];

  // Open standard chord shapes for common roots
  const OPEN_SHAPES: Record<string, { frets: Array<number | 'x'>; fingers: number[]; baseFret: number; barre?: FretPositionVariation['barre'] }> = {
    '0_maj':  { frets: ['x', 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1 }, // C
    '2_maj':  { frets: ['x', 'x', 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1 }, // D
    '2_min':  { frets: ['x', 'x', 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], baseFret: 1 }, // Dm
    '4_maj':  { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1 }, // E
    '4_min':  { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1 }, // Em
    '7_maj':  { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 }, // G
    '9_maj':  { frets: ['x', 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1 }, // A
    '9_min':  { frets: ['x', 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1 }, // Am
  };

  const openKey = `${rootPc}_${isMinor ? 'min' : 'maj'}`;
  if (OPEN_SHAPES[openKey]) {
    const o = OPEN_SHAPES[openKey];
    variations.push({
      frets: o.frets,
      fingers: o.fingers,
      baseFret: o.baseFret,
      barre: o.barre,
      stringNotes: computeStringNotes(GUITAR_OPEN_PC, o.frets, o.baseFret)
    });
  }

  // E-String Root Barre Shape (6th string root at fret = (rootPc - 4 + 12) % 12)
  const eFret = ((rootPc - 4) % 12 + 12) % 12;
  const eBase = eFret === 0 ? 12 : eFret;
  const eFrets: Array<number | 'x'> = isMinor
    ? (has7 ? [1, 3, 1, 1, 1, 1] : [1, 3, 3, 1, 1, 1])
    : (hasMaj7 ? [1, 'x', 2, 2, 1, 'x'] : has7 ? [1, 3, 1, 2, 1, 1] : [1, 3, 3, 2, 1, 1]);
  const eFingers = isMinor
    ? (has7 ? [1, 3, 1, 1, 1, 1] : [1, 3, 4, 1, 1, 1])
    : (has7 ? [1, 3, 1, 2, 1, 1] : [1, 3, 4, 2, 1, 1]);

  variations.push({
    frets: eFrets,
    fingers: eFingers,
    baseFret: eBase,
    barre: { fret: 1, fromString: 0, toString: 5, finger: 1 },
    stringNotes: computeStringNotes(GUITAR_OPEN_PC, eFrets, eBase)
  });

  // A-String Root Barre Shape (5th string root at fret = (rootPc - 9 + 12) % 12)
  const aFret = ((rootPc - 9) % 12 + 12) % 12;
  const aBase = aFret === 0 ? 12 : aFret;
  const aFrets: Array<number | 'x'> = isMinor
    ? (has7 ? ['x', 1, 3, 1, 2, 1] : ['x', 1, 3, 3, 2, 1])
    : (hasMaj7 ? ['x', 1, 3, 2, 3, 1] : has7 ? ['x', 1, 3, 1, 3, 1] : ['x', 1, 3, 3, 3, 1]);
  const aFingers = isMinor
    ? (has7 ? [0, 1, 3, 1, 2, 1] : [0, 1, 3, 4, 2, 1])
    : (hasMaj7 ? [0, 1, 3, 2, 4, 1] : has7 ? [0, 1, 3, 1, 4, 1] : [0, 1, 2, 3, 4, 1]);

  variations.push({
    frets: aFrets,
    fingers: aFingers,
    baseFret: aBase,
    barre: { fret: 1, fromString: 1, toString: 5, finger: 1 },
    stringNotes: computeStringNotes(GUITAR_OPEN_PC, aFrets, aBase)
  });

  return variations;
}

function buildUkulelePositions(rootPc: number, isMinor: boolean): FretPositionVariation[] {
  // Common 4-string Ukulele (G C E A) voicings
  const UKU_TABLE: Record<string, { frets: Array<number | 'x'>; fingers: number[]; baseFret: number; barre?: FretPositionVariation['barre'] }> = {
    '0_maj':  { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3], baseFret: 1 }, // C
    '0_min':  { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3], baseFret: 1 }, // Cm
    '1_maj':  { frets: [1, 1, 1, 4], fingers: [1, 1, 1, 4], baseFret: 1, barre: { fret: 1, fromString: 0, toString: 3, finger: 1 } }, // C#
    '1_min':  { frets: [1, 4, 4, 4], fingers: [1, 2, 3, 4], baseFret: 1 }, // C#m
    '2_maj':  { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0], baseFret: 1 }, // D
    '2_min':  { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0], baseFret: 1 }, // Dm
    '3_maj':  { frets: [0, 3, 3, 1], fingers: [0, 2, 3, 1], baseFret: 1 }, // Eb
    '3_min':  { frets: [3, 3, 2, 1], fingers: [3, 4, 2, 1], baseFret: 1 }, // Ebm
    '4_maj':  { frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1], baseFret: 1 }, // E
    '4_min':  { frets: [0, 4, 3, 2], fingers: [0, 3, 2, 1], baseFret: 1 }, // Em
    '5_maj':  { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0], baseFret: 1 }, // F
    '5_min':  { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4], baseFret: 1 }, // Fm
    '6_maj':  { frets: [3, 1, 2, 1], fingers: [3, 1, 2, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 3, finger: 1 } }, // F#
    '6_min':  { frets: [2, 1, 2, 0], fingers: [2, 1, 3, 0], baseFret: 1 }, // F#m
    '7_maj':  { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2], baseFret: 1 }, // G
    '7_min':  { frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1], baseFret: 1 }, // Gm
    '8_maj':  { frets: [5, 3, 4, 3], fingers: [3, 1, 2, 1], baseFret: 1 }, // G#
    '8_min':  { frets: [4, 3, 4, 2], fingers: [3, 2, 4, 1], baseFret: 1 }, // G#m
    '9_maj':  { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0], baseFret: 1 }, // A
    '9_min':  { frets: [2, 0, 0, 0], fingers: [2, 0, 0, 0], baseFret: 1 }, // Am
    '10_maj': { frets: [3, 2, 1, 1], fingers: [3, 2, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 2, toString: 3, finger: 1 } }, // Bb
    '10_min': { frets: [3, 1, 1, 1], fingers: [3, 1, 1, 1], baseFret: 1, barre: { fret: 1, fromString: 1, toString: 3, finger: 1 } }, // Bbm
    '11_maj': { frets: [4, 3, 2, 2], fingers: [3, 2, 1, 1], baseFret: 1, barre: { fret: 2, fromString: 2, toString: 3, finger: 1 } }, // B
    '11_min': { frets: [4, 2, 2, 2], fingers: [3, 1, 1, 1], baseFret: 1, barre: { fret: 2, fromString: 1, toString: 3, finger: 1 } }  // Bm
  };

  const key = `${rootPc}_${isMinor ? 'min' : 'maj'}`;
  const shape = UKU_TABLE[key] || UKU_TABLE['0_maj'];
  return [
    {
      frets: shape.frets,
      fingers: shape.fingers,
      baseFret: shape.baseFret,
      barre: shape.barre,
      stringNotes: computeStringNotes(UKULELE_OPEN_PC, shape.frets, shape.baseFret)
    }
  ];
}

export function getMultiInstrumentChordInfo(
  chordSymbol: string,
  capo = 0
): MultiInstrumentChordInfo {
  const cleanSounding = (!chordSymbol || chordSymbol === 'N.C.' || chordSymbol === '—') ? 'F#m' : chordSymbol;
  const shapeSymbol = capo > 0 ? transposeChord(cleanSounding, -capo, 'all') : cleanSounding;

  const parseTarget = shapeSymbol.split('/')[0];
  const match = parseTarget.match(/^([A-G][#b]?)(.*)$/);
  const root = match ? match[1] : 'C';
  const suffix = match ? match[2] : '';

  const rootIdx = NOTE_TO_INDEX[root] ?? 0;
  const soundingRootMatch = cleanSounding.split('/')[0].match(/^([A-G][#b]?)(.*)$/);
  const soundingRoot = soundingRootMatch ? soundingRootMatch[1] : root;
  const soundingRootIdx = NOTE_TO_INDEX[soundingRoot] ?? rootIdx;

  const isMinor = suffix.startsWith('m') && !suffix.startsWith('maj');
  const isDim = suffix.startsWith('dim');
  const isAug = suffix.startsWith('aug');
  const isSus4 = suffix.includes('sus4');
  const isSus2 = suffix.includes('sus2');
  const hasMaj7 = suffix.includes('maj7') || suffix.includes('M7');
  const has7 = suffix.includes('7') && !hasMaj7;

  const intervals: number[] = [0];
  if (isSus2) intervals.push(2, 7);
  else if (isSus4) intervals.push(5, 7);
  else if (isDim) intervals.push(3, 6);
  else if (isAug) intervals.push(4, 8);
  else if (isMinor) intervals.push(3, 7);
  else intervals.push(4, 7);

  if (hasMaj7) intervals.push(11);
  else if (has7) intervals.push(10);

  const preferFlats = soundingRoot.includes('b');
  const notes = intervals.map((iv) => {
    const idx = (soundingRootIdx + iv) % 12;
    return preferFlats ? NOTES_FLAT[idx] : NOTES_SHARP[idx];
  });

  // Piano keys in 2-octave range (0..23 where 0 = C3)
  const pianoMidiKeys = intervals.map((iv) => soundingRootIdx + iv);

  let qualityLabel = 'Majör';
  if (isMinor && has7) qualityLabel = 'Minör 7';
  else if (isMinor) qualityLabel = 'Minör';
  else if (hasMaj7) qualityLabel = 'Majör 7';
  else if (has7) qualityLabel = 'Dominant 7';
  else if (isSus4) qualityLabel = 'Sus4';
  else if (isDim) qualityLabel = 'Diminished';

  return {
    symbol: cleanSounding,
    shapeSymbol,
    root: soundingRoot,
    qualityLabel,
    notes,
    pianoMidiKeys,
    guitarPositions: buildGuitarPositions(rootIdx, isMinor, has7, hasMaj7),
    ukulelePositions: buildUkulelePositions(rootIdx, isMinor)
  };
}

export function formatDurationSec(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

## `production/web/src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

## `production/web/vite.config.ts`

```ts
import http from 'node:http';
import https from 'node:https';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const API_PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8001';

function sendOfflineFallback(urlPath: string, method: string, res: http.ServerResponse) {
  if (res.headersSent) {
    res.end();
    return;
  }
  const cleanPath = urlPath.split('?')[0];
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Kythra-Backend-Status', 'offline');

  if (method === 'GET') {
    if (cleanPath === '/api/workbench/library') {
      res.statusCode = 200;
      res.end(JSON.stringify({ songs: [] }));
      return;
    }
    if (cleanPath === '/api/workbench/studio-bundle') {
      res.statusCode = 200;
      res.end(JSON.stringify({ state: { has_session: false, stages: {} } }));
      return;
    }
    if (cleanPath === '/api/workbench/auth/me') {
      res.statusCode = 200;
      res.end(JSON.stringify({ authenticated: false, user: null, favorites: [], private_uploads: [] }));
      return;
    }
    if (cleanPath === '/api/workbench/session' || cleanPath === '/api/workbench/state') {
      res.statusCode = 200;
      res.end(JSON.stringify({ state: { has_session: false, stages: {} } }));
      return;
    }
  }

  res.statusCode = 503;
  res.end(JSON.stringify({ detail: 'Backend API (127.0.0.1:8001) is not running in this environment.' }));
}

function resilientApiProxy(): Plugin {
  const target = new URL(API_PROXY_TARGET);
  const client = target.protocol === 'https:' ? https : http;

  return {
    name: 'kythra-resilient-api-proxy',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const reqUrl = req.url || '';
        if (!reqUrl.startsWith('/api')) {
          return next();
        }

        const method = (req.method || 'GET').toUpperCase();
        const headers: http.OutgoingHttpHeaders = { ...req.headers, host: target.host };

        const upstreamReq = client.request(
          {
            protocol: target.protocol,
            hostname: target.hostname,
            port: target.port || (target.protocol === 'https:' ? 443 : 80),
            path: reqUrl,
            method,
            headers
          },
          (upstreamRes) => {
            if (!res.headersSent) {
              res.writeHead(upstreamRes.statusCode || 502, upstreamRes.headers);
            }
            upstreamRes.pipe(res);
          }
        );

        upstreamReq.on('error', () => {
          sendOfflineFallback(reqUrl, method, res);
        });

        req.on('close', () => {
          if (!upstreamReq.destroyed) {
            upstreamReq.destroy();
          }
        });

        if (method === 'GET' || method === 'HEAD') {
          upstreamReq.end();
        } else {
          req.pipe(upstreamReq);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    resilientApiProxy()
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    conditions: ['production', 'browser', 'module', 'import', 'default']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 3000,
    allowedHosts: true,
    watch: {
      awaitWriteFinish: {
        stabilityThreshold: 80,
        pollInterval: 20
      }
    }
  }
});
```
