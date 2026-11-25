import React from 'react';
import { StageMetadata } from '../../types/workbench';
import { formatStageDuration } from '../../constants/stages';

interface InspectorHeaderProps {
  stage: StageMetadata;
  isRunning: boolean;
  onRunStage: () => void;
  rawJsonData: any;
  activeTab: 'diagnostic' | 'json' | 'console';
  onTabChange: (tab: 'diagnostic' | 'json' | 'console') => void;
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
