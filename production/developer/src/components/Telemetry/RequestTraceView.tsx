import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RequestTraceEntry } from '../../types/workbench';
import * as api from '../../api/workbenchApi';

interface RequestTraceViewProps {
  activeSessionId: string;
  onSelectSession: (sessionId: string) => void;
  initialRequests?: RequestTraceEntry[];
  initialExpandedId?: number | null;
}

export const RequestTraceView: React.FC<RequestTraceViewProps> = ({
  activeSessionId,
  onSelectSession,
  initialRequests,
  initialExpandedId = null
}) => {
  const [requests, setRequests] = useState<RequestTraceEntry[]>(
    () => initialRequests || []
  );
  const [onlyErrors, setOnlyErrors] = useState(false);
  const [onlyActiveSession, setOnlyActiveSession] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(initialExpandedId);
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
    if (initialRequests) {
      setRequests(initialRequests);
      return;
    }
    fetchTraces(true);
    const id = window.setInterval(() => fetchTraces(false), 1500);
    return () => window.clearInterval(id);
  }, [fetchTraces, initialRequests]);

  const handleClear = async () => {
    if (!initialRequests) {
      await api.clearTelemetryRequests().catch(() => undefined);
    }
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
