import React from 'react';
import { StageMetadata } from '../../types/workbench';

interface StagePendingViewProps {
  stage: StageMetadata;
  onRunStage?: () => void;
  missingDependency?: string | null;
}

export const StagePendingView: React.FC<StagePendingViewProps> = ({
  stage,
  onRunStage,
  missingDependency
}) => {
  return (
    <div className="dev-stack">
      {/* 1. Primary Pending Status Card */}
      <section className="m3-surface-card dev-status-banner">
        <md-elevation></md-elevation>
        <div className="dev-hero-copy">
          <div className="dev-hero-badges">
            <span className="m3-tonal-badge primary m3-tabular">Aşama 0{stage.id}</span>
            <span className="dev-aside-copy">Çalıştırılmayı Bekliyor</span>
          </div>

          <h3 className="md-typescale-headline-small">{stage.title} Henüz Çalıştırılmadı</h3>

          <p className="dev-body-muted">
            Bu oturumda ilgili aşama için henüz üretilmiş bir çözümleme verisi bulunmuyor. Tek
            başına yürütmek için <strong>Aşama 0{stage.id} Çalıştır</strong> düğmesini, tüm akışı
            başlatmak için üst çubuktaki <strong>Tümünü Çözümle</strong> düğmesini
            kullanabilirsiniz.
          </p>

          {missingDependency && (
            <div className="dev-missing-dep-row" style={{ borderRadius: '12px' }}>
              <div className="dev-io-flow">
                <md-icon style={{ fontSize: '18px' }}>warning</md-icon>
                <span>{missingDependency}</span>
              </div>
            </div>
          )}
        </div>

        <div className="dev-inspector-controls">
          <span className="m3-tonal-badge secondary">
            <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
            <span>Çalıştırma Bekleniyor</span>
          </span>

          {onRunStage && !missingDependency && (
            <md-filled-button onClick={onRunStage}>
              <md-icon slot="icon">play_arrow</md-icon>
              <span>Aşama 0{stage.id} Çalıştır</span>
            </md-filled-button>
          )}
        </div>
      </section>

      {/* 2. Stage Contract Specification (3 Cards) */}
      <section className="dev-grid-3">
        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">01 · Girdi Bağımlılığı</span>
          <code className="dev-code-pill">{stage.input}</code>
          <p className="dev-aside-copy">
            Çıkarım işlemi için gereken kaynak ses kanalı veya önceki aşama çıktıları.
          </p>
        </div>

        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">02 · Motor İşlemi</span>
          <strong className="md-typescale-title-small" style={{ color: 'var(--md-sys-color-primary)' }}>
            {stage.operation}
          </strong>
          <p className="dev-aside-copy">
            Zaman-frekans ayrıştırma, nota/vuruş tespiti veya harmonik analiz adımı.
          </p>
        </div>

        <div className="m3-surface-card dev-substep-card">
          <md-elevation></md-elevation>
          <span className="dev-aside-copy">03 · Hedef Çıktı</span>
          <code className="dev-code-pill is-output">{stage.output}</code>
          <p className="dev-aside-copy">
            Kalıcı diske kaydedilen standartlaştırılmış JSON çözümleme çıktısı.
          </p>
        </div>
      </section>

      {/* 3. Diagnostic Guidance */}
      <section className="dev-guidance-banner">
        <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
          schedule
        </md-icon>
        <div className="dev-modal-track-meta">
          <span className="dev-aside-title">Aşama Teşhis Rehberi ve Doğrulama Odağı</span>
          <p className="dev-aside-copy">{stage.diagnosticFocus}</p>
        </div>
      </section>
    </div>
  );
};
