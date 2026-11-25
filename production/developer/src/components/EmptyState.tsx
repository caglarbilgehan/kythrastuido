import React from 'react';
import { AudioDropzone } from './ui/AudioDropzone';

interface EmptyStateProps {
  onUpload: (file: File) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onUpload }) => {
  return (
    <div className="dev-empty-container">
      {/* 1. Welcome Hero Card */}
      <section className="m3-surface-card dev-hero-card">
        <md-elevation></md-elevation>
        <div className="dev-hero-copy">
          <div className="dev-hero-badges">
            <span className="m3-tonal-badge success">
              <span className="m3-status-dot success is-pulsing" aria-hidden="true" />
              <span>Faz 01 · Hazır</span>
            </span>
            <span className="m3-tonal-badge">Hedef: 44.1 kHz Stereo PCM WAV</span>
          </div>

          <h1 className="dev-hero-title">Çözümlemeyi Başlatmak İçin Ses Dosyası Yükleyin</h1>
          <p className="dev-body-muted">
            Tek parça bir ses kaydı yükleyerek 4 aşamalı AI boru hattını başlatın ve her aşamanın
            çıktısını canlı olarak inceleyin.
          </p>
        </div>

        <div className="dev-hero-aside">
          <span className="dev-aside-title">Ses Alımı Bekleniyor</span>
          <p className="dev-aside-copy">
            Yüklenen tek parça ses dosyası otomatik olarak tempo, akor, BS-RoFormer 6-kanal
            ayrıştırma ve söz/karaoke aşamalarından geçirilir.
          </p>
        </div>
      </section>

      {/* 2. Single Track Ingestion Card */}
      <section className="m3-surface-card dev-ingest-card">
        <md-elevation></md-elevation>
        <div>
          <div className="dev-card-head-row">
            <span className="dev-card-title">01 · Tek Parça Ses Dosyası Yükle</span>
            <span className="m3-tonal-badge sm">WAV / MP3 / FLAC / M4A</span>
          </div>
          <p className="dev-aside-copy">
            Tüm dosyalar otomatik olarak 44.1 kHz 16-bit stereo standardına dönüştürülür ve 3
            aşamalı AI boru hattıyla işlenir.
          </p>
        </div>

        <AudioDropzone
          onUpload={onUpload}
          compact={true}
          title="Dosya seçmek için tıklayın veya buraya sürükleyip bırakın"
          subtitle="100 MB’a kadar ses dosyaları desteklenir"
        />
      </section>
    </div>
  );
};
