import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../../types/workbench';

interface StudioConsoleViewProps {
  logs: LogEntry[];
  filterStage: number | 'all';
  onFilterStageChange: (stage: number | 'all') => void;
  filterLevel: 'all' | 'INFO' | 'WARNING' | 'ERROR';
  onFilterLevelChange: (lvl: 'all' | 'INFO' | 'WARNING' | 'ERROR') => void;
  onClear: () => void;
  autoScroll: boolean;
  onToggleAutoScroll: () => void;
  isExecuting?: boolean;
  activeStageNum?: number | null;
}

const CONSOLE_STAGES: Array<{ id: number; label: string }> = [
  { id: 1, label: '01 Ölçü' },
  { id: 2, label: '02 Akor' },
  { id: 3, label: '03 Kanal' }
];

export const StudioConsoleView: React.FC<StudioConsoleViewProps> = ({
  logs,
  filterStage,
  onFilterStageChange,
  filterLevel,
  onFilterLevelChange,
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
