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
