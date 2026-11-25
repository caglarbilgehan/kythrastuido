import React from 'react';

const WAVEFORM_HEIGHTS = [
  5, 8, 12, 7, 16, 22, 11, 19, 24, 15, 9, 17, 21, 12, 6, 18,
  23, 10, 14, 20, 13, 8, 16, 24, 18, 11, 20, 24, 14, 8, 18, 12
];

interface WaveformScrubberProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export const WaveformScrubber: React.FC<WaveformScrubberProps> = ({
  currentTime,
  duration,
  onSeek
}) => {
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
    onSeek(ratio * duration);
  };

  return (
    <div
      onClick={handleWaveformClick}
      role="slider"
      aria-label="Dalga Formu İlerleme Çubuğu"
      aria-valuemin={0}
      aria-valuemax={Math.round(duration)}
      aria-valuenow={Math.round(currentTime)}
      tabIndex={0}
      className="m3-waveform-track"
      title="İlerlemek için dalga formuna tıklayın"
    >
      <div
        className="m3-waveform-playhead"
        style={{ left: `${progressPercent}%` }}
      />

      <div className="m3-waveform-bars">
        {Array.from({ length: 84 }).map((_, i) => {
          const h = WAVEFORM_HEIGHTS[i % WAVEFORM_HEIGHTS.length];
          const isPast = (i / 84) * 100 <= progressPercent;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}px`,
                borderRadius: '9999px',
                backgroundColor: isPast
                  ? 'var(--md-sys-color-primary)'
                  : 'var(--md-sys-color-outline-variant)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
