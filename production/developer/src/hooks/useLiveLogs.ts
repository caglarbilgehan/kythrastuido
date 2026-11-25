import { useState, useEffect, useRef, useCallback } from 'react';
import { LogEntry } from '../types/workbench';
import * as api from '../api/workbenchApi';

interface UseLiveLogsOptions {
  isExecuting?: boolean;
}

export function useLiveLogs({ isExecuting = false }: UseLiveLogsOptions = {}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterStage, setFilterStage] = useState<number | 'all'>('all');
  const [filterLevel, setFilterLevel] = useState<'all' | 'INFO' | 'WARNING' | 'ERROR'>('all');
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
    if (filterStage !== 'all' && entry.stage_num !== filterStage) {
      return false;
    }
    if (filterLevel !== 'all' && entry.level !== filterLevel) {
      return false;
    }
    return true;
  });

  const stageLogs = useCallback(
    (stageNum: number) => logs.filter((l) => l.stage_num === stageNum),
    [logs]
  );

  return {
    logs: filteredLogs,
    allLogsCount: logs.length,
    stageLogs,
    filterStage,
    setFilterStage,
    filterLevel,
    setFilterLevel,
    isOpen,
    setIsOpen,
    toggleOpen: () => setIsOpen((prev) => !prev),
    autoScroll,
    setAutoScroll,
    clearAllLogs,
    fetchNewLogs
  };
}
