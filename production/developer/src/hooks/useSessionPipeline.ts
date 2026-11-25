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
