import React from 'react';
import { resolveInstrumentMeta } from '../../constants/instruments';
import { InstrumentIcon } from './instruments/InstrumentIcon';

interface StemChannelIconProps {
  channelId: string;
  category?: string;
  size?: number;
  color?: string;
}

/**
 * Unified channel icon resolver for the Developer Workbench:
 * - Reuses shared custom SVG icons (`InstrumentIcon`) for Guitar and Piano channels
 * - Renders official Material Symbols (`<md-icon>`) for Vocals, Bass, Drums, Other
 */
export const StemChannelIcon: React.FC<StemChannelIconProps> = React.memo(({
  channelId,
  category,
  size = 18,
  color
}) => {
  const effectiveKey = category || channelId;
  const meta = resolveInstrumentMeta(effectiveKey);
  const resolvedColor = color ?? meta.color;

  if (effectiveKey === 'guitar' || channelId === 'guitar' || channelId.startsWith('guitar_')) {
    return (
      <span
        className="m3-inline-icon-slot"
        style={{ color: resolvedColor, width: size, height: size }}
        aria-hidden="true"
      >
        <InstrumentIcon instrument="guitar" size={size} />
      </span>
    );
  }

  if (effectiveKey === 'piano' || channelId === 'piano') {
    return (
      <span
        className="m3-inline-icon-slot"
        style={{ color: resolvedColor, width: size, height: size }}
        aria-hidden="true"
      >
        <InstrumentIcon instrument="piano" size={size} />
      </span>
    );
  }

  return (
    <md-icon
      style={{
        color: resolvedColor,
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {meta.materialIcon}
    </md-icon>
  );
});

StemChannelIcon.displayName = 'StemChannelIcon';
