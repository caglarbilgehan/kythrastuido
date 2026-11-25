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
