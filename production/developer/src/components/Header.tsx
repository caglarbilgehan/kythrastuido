import React from 'react';
import { SessionState, TelemetrySessionSummary } from '../types/workbench';
import { BrandLogoIcon } from './icons';
import { SessionSwitcher } from './SessionSwitcher';

interface HeaderProps {
  session: SessionState | null;
  activeSessionId: string;
  telemetrySessions: TelemetrySessionSummary[];
  onSelectSession: (sessionId: string) => void;
  onRefreshSessions: () => void;
  onRunAll: () => void;
  onReset: () => void;
  onOpenSourceModal: () => void;
  isLoading: boolean;
  runningStage: number | null;
  mode: 'sequential' | 'parallel';
  onModeChange: (mode: 'sequential' | 'parallel') => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  activeSessionId,
  telemetrySessions,
  onSelectSession,
  onRefreshSessions,
  onRunAll,
  onReset,
  onOpenSourceModal,
  isLoading,
  runningStage,
  mode,
  onModeChange,
  isDarkMode,
  onToggleTheme
}) => {
  const hasSession = Boolean(session?.has_session);

  return (
    <header className="m3-top-app-bar">
      <div className="m3-top-app-bar-inner">
        {/* 1. Brand Lockup + Live Session Switcher + Segmented Execution Mode */}
        <div className="m3-header-left">
          <div className="m3-brand-lockup">
            <div className="m3-brand-logo">
              <BrandLogoIcon size={20} />
            </div>
            <span className="m3-brand-title">
              Kythra <span className="m3-brand-subtitle">Developer</span>
            </span>
          </div>

          <div className="m3-header-divider" aria-hidden="true" />

          <SessionSwitcher
            activeSessionId={activeSessionId}
            sessions={telemetrySessions}
            onSelectSession={onSelectSession}
            onRefresh={onRefreshSessions}
          />

          <div className="m3-header-divider" aria-hidden="true" />

          <div role="group" aria-label="Çalıştırma Modu" className="m3-segmented-group">
            <button
              type="button"
              onClick={() => onModeChange('sequential')}
              className={`m3-segmented-btn ${mode === 'sequential' ? 'is-active' : ''}`}
              title="Adım Adım Mod: Her aşamayı (01 → 04) tek tek manuel veya sıralı çalıştırıp hata ayıkla"
            >
              <md-icon>commit</md-icon>
              <span>Adım Adım</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('parallel')}
              className={`m3-segmented-btn ${mode === 'parallel' ? 'is-active is-secondary' : ''}`}
              title="Üretim Akışı Modu: Web Studio kullanıcı akışını birebir simüle et ve test et"
            >
              <md-icon>bolt</md-icon>
              <span>Üretim Akışı</span>
            </button>
          </div>
        </div>

        {/* 2. Live Pipeline Execution Badge */}
        <div className="m3-header-center">
          {runningStage && (
            <span className="m3-tonal-badge secondary">
              <span className="m3-status-dot secondary is-pulsing" aria-hidden="true" />
              <span>
                {mode === 'parallel'
                  ? 'Üretim Akışı: Aşamalar eşzamanlı çalışıyor...'
                  : `Adım Adım: Aşama 0${runningStage} çalışıyor...`}
              </span>
            </span>
          )}
        </div>

        {/* 3. Official Material 3 Action Buttons & Theme Switcher */}
        <div className="m3-header-actions">
          <md-filled-tonal-button
            onClick={onOpenSourceModal}
            disabled={isLoading || undefined}
            title="Yeni Ses Dosyası Yükle"
          >
            <md-icon slot="icon">audio_file</md-icon>
            <span>Kaynağı Değiştir</span>
          </md-filled-tonal-button>

          <md-outlined-button
            onClick={onReset}
            disabled={isLoading || !hasSession || undefined}
            title="Oturumu ve Aşama Çıktılarını Sıfırla"
          >
            <md-icon slot="icon">restart_alt</md-icon>
            <span>Sıfırla</span>
          </md-outlined-button>

          <md-filled-button
            onClick={onRunAll}
            disabled={isLoading || !hasSession || undefined}
            title={
              mode === 'parallel'
                ? 'Seçili oturumda Web Studio üretim akışını birebir test et'
                : 'Tüm aşamaları (01 → 04) adım adım sırayla çözümle'
            }
          >
            <md-icon slot="icon">{mode === 'parallel' ? 'bolt' : 'play_arrow'}</md-icon>
            <span>{mode === 'parallel' ? 'Üretim Akışını Test Et' : 'Adım Adım Çalıştır'}</span>
          </md-filled-button>

          <md-icon-button
            onClick={onToggleTheme}
            aria-label={isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
            title={isDarkMode ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
          >
            <md-icon>{isDarkMode ? 'light_mode' : 'dark_mode'}</md-icon>
          </md-icon-button>
        </div>
      </div>
    </header>
  );
};
