import React, { useState } from 'react';
import { StemChannel } from '../types/workbench';
import { StemMixerPopover } from './AudioPlayer/StemMixerPopover';
import { WaveformScrubber } from './AudioPlayer/WaveformScrubber';
import { MixerIcon } from './icons';

interface MasterAudioPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  trackName?: string | null;
  isStage3Completed?: boolean;
  stemChannels?: StemChannel[];
  onToggleSolo?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onSetVolume?: (id: string, vol: number) => void;
  onResetStems?: () => void;
  initialMixerOpen?: boolean;
}

function formatTime(sec: number): string {
  const mins = Math.floor(sec / 60);
  const secs = (sec % 60).toFixed(1);
  return `${mins.toString().padStart(2, '0')}:${secs.padStart(4, '0')}`;
}

export const MasterAudioPlayer: React.FC<MasterAudioPlayerProps> = ({
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  trackName,
  isStage3Completed = false,
  stemChannels = [],
  onToggleSolo,
  onToggleMute,
  onSetVolume,
  onResetStems,
  initialMixerOpen = false
}) => {
  const [isMixerOpen, setIsMixerOpen] = useState(initialMixerOpen);

  const displayName = (trackName || 'Oturum Sesi (Hafıza)').replace(
    /\s*\(\d+(\.\d+)?\s*BPM\)/i,
    ''
  );
  const activeChannels = stemChannels.filter((c) => c.detected !== false);
  const hasActiveSoloOrMute = activeChannels.some((c) => c.isSolo || c.isMuted);

  return (
      <div className="m3-footer-dock-outer">
        <div className="m3-footer-dock-inner">
          {isMixerOpen && isStage3Completed && (
            <StemMixerPopover
              channels={activeChannels}
              onClose={() => setIsMixerOpen(false)}
              onToggleSolo={onToggleSolo}
              onToggleMute={onToggleMute}
              onSetVolume={onSetVolume}
              onResetStems={onResetStems}
            />
          )}

              <footer aria-label="Ana Ses Oynatıcısı" className="m3-footer-bar">
                <md-elevation></md-elevation>

                        < div className="m3-player-track-meta">
                    <md-filled-icon-button
                      onClick={onTogglePlay}
                      aria-label={isPlaying ? 'Sesi duraklat' : 'Sesi oynat'}
                      title={isPlaying ? 'Sesi duraklat' : 'Sesi oynat'}
                    >
                      <md-icon>{isPlaying ? 'pause' : 'play_arrow'}</md-icon>
                    </md-filled-icon-button>

                    <div className="m3-player-titles">
                      <span className="m3-player-title" title={displayName}>
                        {displayName}
                      </span>
                      <span className="m3-player-sub">
                        {isStage3Completed
                          ? 'Kanallar Ayrıştırıldı · Mikser Aktif'
                          : 'Ana Ses · 44.1 kHz Stereo'}
                  </span>
                </div>
            </div>

        <span className="m3-tabular md-typescale-label-medium" style={{ color: 'var(--md-sys-color-primary)' }}>
          {formatTime(currentTime)}
        </span>

        <WaveformScrubber currentTime={currentTime} duration={duration} onSeek={onSeek} />

        <span className="m3-tabular md-typescale-label-medium" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
          {formatTime(duration)}
        </span>

      {isStage3Completed ? (
        <md-filled-tonal-button
          data-role="mixer-btn"
          data-active={isMixerOpen || hasActiveSoloOrMute ? 'true' : 'false'}
          onClick={() => setIsMixerOpen((prev) => !prev)}
          title="Stüdyo Mikserini Aç / Kapat"
        >
          <md-icon slot="icon">
            <MixerIcon size={18} />
          </md-icon>
          <span>Mikser</span>
        </md-filled-tonal-button>
      ) : (
        <span className="m3-tonal-badge success">
          <span className="m3-status-dot success is-pulsing" aria-hidden="true" />
          <span>Disk Aktif</span>
        </span>
      )}
    </footer>
      </div >
    </div >
  );
};
