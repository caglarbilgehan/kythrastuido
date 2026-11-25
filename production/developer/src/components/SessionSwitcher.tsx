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
