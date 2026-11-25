import React, { useState, useEffect, useRef } from 'react';
import { StageMetadata, LogEntry } from '../../types/workbench';

interface StageExecutingViewProps {
  stage: StageMetadata;
  logs: LogEntry[];
  onOpenConsole?: () => void;
}

const STAGE_SUB_STEPS: Record<number, { title: string; desc: string }[]> = {
  1: [
    { title: 'Kaynak Ses Okuma', desc: '44.1 kHz stereo PCM dalga formu diskten okunuyor' },
    { title: 'Madmom RNN Çıkarımı', desc: 'Derin öğrenme vuruş ve downbeat olasılık matrisi hesaplanıyor' },
    { title: 'Metrik Izgara Eşleme', desc: 'BPM, ölçü başları ve süreklilik katsayıları hesaplanıyor' },
    { title: 'Çıktı & Doğrulama', desc: 'beats.json oluşturuluyor ve oturum güncelleniyor' }
  ],
  2: [
    { title: 'Zaman-Frekans Dönüşümü', desc: 'Chromagram ve harmonik spektrum vektörleri çıkarılıyor' },
    { title: 'BTC-CNN Akor Sınıflandırma', desc: 'Akor türleri ve bas dereceleri zaman damgalarıyla etiketleniyor' },
    { title: 'Form & Bölüm Segmentasyonu', desc: 'Intro, Verse, Chorus, Solo bölümleri yapılandırılıyor' },
    { title: 'Lead Sheet Çıktısı', desc: 'chords.json formatında oturuma işleniyor' }
  ],
  3: [
    { title: 'Frekans Ayrıştırma Girişi', desc: 'BS-RoFormer-SW frekans domeninde çok kanallı modele besleniyor' },
    { title: 'Derin Model Çıkarımı', desc: 'İzole enstrüman ve vokal kanalları üretiliyor' },
    { title: 'Dalga Formu Normalizasyonu', desc: 'Her kanal 44.1 kHz 16-bit WAV formatına kodlanıyor' },
    { title: 'Mikser Kanalları Kaydı', desc: 'İzole stem WAV akışları mikserde kullanıma hazır hale getiriliyor' }
  ],
  4: [
    { title: 'İzole Vokal Okuma', desc: 'BS-RoFormer tarafından ayrılan stems/vocals.wav sinyali taranıyor' },
    { title: 'stable-ts Transkripsiyon', desc: 'Şarkı sözleri VAD gürültü filtresi ile kelimelere dönüştürülüyor' },
    { title: 'Meta MMS_FA CTC Hizalama', desc: 'Her kelime vokal dalga formuna milisaniye hassasiyetinde hizalanıyor' },
    { title: 'Karaoke Çıktısı Kaydı', desc: 'lyrics.json oluşturuluyor ve veritabanına işleniyor' }
  ]
};

export const StageExecutingView: React.FC<StageExecutingViewProps> = ({
  stage,
  logs,
  onOpenConsole
}) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startTime = Date.now();
    const timer = window.setInterval(() => {
      setElapsedSec((Date.now() - startTime) / 1000);
    }, 100);
    return () => window.clearInterval(timer);
  }, [stage.id]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const steps = STAGE_SUB_STEPS[stage.id] || [
    { title: 'Girdi Verileri Hazırlığı', desc: 'Önceki aşama çıktıları ve ses kanalları taranıyor' },
    { title: 'Yapay Zeka Motoru Çıkarımı', desc: 'Derin öğrenme modeli hesaplama yapıyor' },
    { title: 'Müzikal Optimizasyon', desc: 'Çıktılar doğrulanıyor ve standart formatlanıyor' },
    { title: 'Çıktı Kaydı', desc: 'Sonuçlar oturum deposuna kaydediliyor' }
  ];

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSec = (sec % 60).toFixed(1);
    return `${mins > 0 ? `${mins}m ` : ''}${remainingSec}s`;
  };

  return (
    <div className="dev-stack">
      {/* 1. Primary Executing Card */}
      <section className="m3-surface-card dev-inspector-card">
        <md-elevation></md-elevation>
        <div className="dev-status-banner">
          <div className="dev-hero-copy">
            <div className="dev-hero-badges">
              <span className="m3-tonal-badge primary m3-tabular">Aşama 0{stage.id}</span>
              <span className="m3-tonal-badge secondary">
                <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
                <span>Yürütülüyor...</span>
              </span>
              <span className="m3-tonal-badge m3-mono m3-tabular">
                <md-icon style={{ fontSize: '15px' }}>schedule</md-icon>
                <span>Geçen Süre: {formatTimer(elapsedSec)}</span>
              </span>
            </div>

            <h3 className="md-typescale-headline-small">{stage.title} Çözümleniyor</h3>
            <p className="dev-body-muted">
              Bu aşamanın müzikal çıkarım motoru şu anda aktif olarak çalışıyor. İşlem
              tamamlandığında bu alan otomatik olarak canlı tanı görünümüne geçecektir.
            </p>
          </div>

          <div className="dev-modal-track-meta" style={{ alignItems: 'flex-end', gap: '8px' }}>
            <span className="m3-tonal-badge secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>İşlem Sürüyor</span>
            </span>
            <code className="dev-code-pill is-output">{stage.output}</code>
          </div>
        </div>
        <md-linear-progress indeterminate={true}></md-linear-progress>
      </section>

      {/* 2. Sub-Step Progress Matrix */}
      <section className="dev-grid-4">
        {steps.map((st, idx) => (
          <div key={idx} className="m3-surface-card dev-substep-card">
            <md-elevation></md-elevation>
            <div className="dev-card-head-row" style={{ marginBottom: 0 }}>
              <span className="m3-mono m3-tabular" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--md-sys-color-primary)' }}>
                0{idx + 1} · Adım
              </span>
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
            </div>
            <h4 className="md-typescale-title-small">{st.title}</h4>
            <p className="dev-aside-copy">{st.desc}</p>
          </div>
        ))}
      </section>

      {/* 3. Embedded Live Telemetry Stream */}
      <section className="m3-surface-card dev-section-block">
        <md-elevation></md-elevation>
        <div className="dev-section-header">
          <div className="dev-section-header-title">
            <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
              terminal
            </md-icon>
            <span>Aşama 0{stage.id} Anlık Telemetri Akışı</span>
            <span className="m3-tonal-badge sm primary m3-tabular">{logs.length} satır</span>
          </div>

          {onOpenConsole && (
            <md-text-button onClick={onOpenConsole}>
              <span>Konsol Görünümünü Aç</span>
              <md-icon slot="icon">arrow_forward</md-icon>
            </md-text-button>
          )}
        </div>

        <div ref={logContainerRef} className="dev-terminal-viewport is-compact">
          {logs.length === 0 ? (
            <div className="dev-io-flow" style={{ color: '#94A3B8', fontStyle: 'italic' }}>
              <md-circular-progress
                indeterminate={true}
                style={{ '--md-circular-progress-size': '16px', width: '16px', height: '16px' } as React.CSSProperties}
              ></md-circular-progress>
              <span>Yapay zeka motoru başlatılıyor, tensörler işleniyor...</span>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="dev-log-row">
                <span className="dev-log-ts m3-tabular">[{log.timestamp}]</span>
                <span className="dev-log-lvl">Aşama {stage.id}</span>
                <span className="dev-log-msg">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
