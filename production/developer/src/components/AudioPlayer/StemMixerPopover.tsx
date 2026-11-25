import React from 'react';
import { StemChannel } from '../../types/workbench';
import { MixerIcon, StemChannelIcon } from '../icons';

interface StemMixerPopoverProps {
  channels: StemChannel[];
  onClose: () => void;
  onToggleSolo?: (id: string) => void;
  onToggleMute?: (id: string) => void;
  onSetVolume?: (id: string, vol: number) => void;
  onResetStems?: () => void;
}

export const StemMixerPopover: React.FC<StemMixerPopoverProps> = ({
  channels,
  onClose,
  onToggleSolo,
  onToggleMute,
  onSetVolume,
  onResetStems
}) => {
  const channelsToRender = channels.filter((c) => c.detected !== false);

  return (
    <div className="m3-upward-card mixer-card">
      <md-elevation></md-elevation>

      {/* Popover Header */}
      <div className="dev-benchmark-top" style={{ paddingBottom: '10px', borderBottom: '1px solid var(--md-sys-color-outline-variant)' }}>
        <div className="dev-io-flow">
          <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <MixerIcon size={20} />
          </md-icon>
          <span className="md-typescale-title-small">Stüdyo Mikseri</span>
        </div>

        <div className="dev-inspector-controls" style={{ gap: '4px' }}>
          {onResetStems && (
            <md-text-button onClick={onResetStems} title="Mikseri Varsayılan Düzeye Sıfırla">
              Sıfırla
            </md-text-button>
          )}
          <md-icon-button onClick={onClose} aria-label="Mikseri Kapat" title="Mikseri Kapat">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Stem Rows with Official <md-slider> */}
      <div className="m3-mixer-rows">
        {channelsToRender.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' }} className="dev-aside-copy">
            Aktif ses kanalı bulunamadı.
          </div>
        ) : (
          channelsToRender.map((ch) => {
            const effectiveVolPct = Math.round((ch.isMuted ? 0 : ch.volume) * 100);
            const rowClass = [
              'm3-mixer-row',
              ch.isSolo ? 'is-solo' : '',
              ch.isMuted ? 'is-muted' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={ch.id} className={rowClass}>
                <div className="m3-mixer-channel-name">
                  <StemChannelIcon channelId={ch.id} category={ch.category} size={18} />
                  <div className="dev-modal-track-meta">
                    <span className="md-typescale-label-large" title={ch.name}>
                      {ch.name}
                    </span>
                    {ch.panningDesc && (
                      <span className="dev-aside-copy m3-mono" style={{ fontSize: '10px' }}>
                        {ch.panningDesc}
                      </span>
                    )}
                  </div>
                </div>

                <div className="m3-mixer-slider-wrap">
                  <md-slider
                    min={0}
                    max={100}
                    value={effectiveVolPct}
                    onInput={(e: any) => {
                      const val = Number(e.target?.value ?? effectiveVolPct);
                      onSetVolume?.(ch.id, val / 100);
                    }}
                  ></md-slider>
                  <span className="m3-mixer-vol-pct m3-tabular">%{effectiveVolPct}</span>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleMute?.(ch.id)}
                  className={`m3-mixer-ms-btn ${ch.isMuted ? 'is-mute-active' : ''}`}
                  title={`${ch.name} Sustur (Mute)`}
                >
                  M
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSolo?.(ch.id)}
                  className={`m3-mixer-ms-btn ${ch.isSolo ? 'is-solo-active' : ''}`}
                  title={`${ch.name} Solo`}
                >
                  S
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
