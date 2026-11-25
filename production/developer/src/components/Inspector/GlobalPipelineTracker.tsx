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
