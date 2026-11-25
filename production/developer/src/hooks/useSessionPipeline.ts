import { useState, useEffect, useCallback } from 'react';
import { SessionState } from '../types/workbench';
import { StageOutputMap } from '../types/stages';
import * as api from '../api/workbenchApi';

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
  const [session, setSession] = useState<SessionState | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<number>(getInitialStageId);
  const [activeInspectorTab, setActiveInspectorTab] = useState<
    'diagnostic' | 'json' | 'console'
  >('diagnostic');

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

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

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
    selectedStageId,
    selectedStageMeta?.status,
    selectedStageMeta?.durationMs,
    (selectedStageMeta as any)?.timings_ms,
    loadStageData
  ]);

  // Mikser ve oynatıcı için Aşama 3 çıktısının hazır olduğundan emin ol
  useEffect(() => {
    if (session?.stages?.['3']?.status === 'completed' && !stageOutputs[3]) {
      loadStageData(3);
    }
  }, [session?.stages?.['3']?.status, stageOutputs, loadStageData]);

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
      } catch (err: any) {
        setError(err?.message || fallbackMsg);
      } finally {
        setIsLoading(false);
      }
    },
    [onBeforeSourceChange]
  );

  const handleUpload = useCallback(
    (file: File) => runSourceTransition(() => api.uploadAudio(file), 'Ses dosyası yüklenemedi'),
    [runSourceTransition]
  );

  const handleReset = useCallback(
    () => runSourceTransition(() => api.resetSession(), 'Oturum sıfırlanamadı'),
    [runSourceTransition]
  );

  const handleRunStage = useCallback(async (stageNum: number) => {
    setRunningStage(stageNum);
    setError(null);
    try {
      const res = await api.runStage(stageNum);
      setSession(res.state);
      setStageOutputs((prev) => ({ ...prev, [stageNum]: res.data }));
    } catch (err: any) {
      setError(err?.message || `Aşama ${stageNum} çalıştırma hatası`);
    } finally {
      setRunningStage(null);
    }
  }, []);

  const handleRunAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const stagesToRun = [1, 2, 3];
      if (executionMode === 'parallel') {
        setRunningStage(1);
        const pollTimer = window.setInterval(() => {
          refreshSession();
        }, 500);
        try {
          const dagRes = await api.runAllStages();
          if (dagRes?.state) {
            setSession(dagRes.state);
          }
          const [d1, d2, d3] = await Promise.all([
            api.getStageData(1).catch(() => undefined),
            api.getStageData(2).catch(() => undefined),
            api.getStageData(3).catch(() => undefined)
          ]);
          setStageOutputs((prev) => ({
            ...prev,
            ...(d1 ? { 1: d1 } : {}),
            ...(d2 ? { 2: d2 } : {}),
            ...(d3 ? { 3: d3 } : {})
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
    } catch (err: any) {
      setError(err?.message || 'Çözümleme boru hattı çalıştırılamadı');
    } finally {
      setIsLoading(false);
      setRunningStage(null);
    }
  }, [executionMode, refreshSession]);

  return {
    session,
    selectedStageId,
    setSelectedStageId,
    activeInspectorTab,
    setActiveInspectorTab,
    stageOutputs,
    isLoading,
    runningStage,
    error,
    setError,
    clearError: useCallback(() => setError(null), []),
    executionMode,
    setExecutionMode,
    handleUpload,
    handleReset,
    handleRunStage,
    handleRunAll
  };
}
