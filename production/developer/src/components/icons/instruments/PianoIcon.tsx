import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

const PIANO_PATHS = (
  <g style={{ fill: 'none' }}>
    <rect
      x="2"
      y="4"
      width="20"
      height="16"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.8"
      style={{ fill: 'none' }}
    />
    <line x1="7" y1="4" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <line x1="17" y1="4" x2="17" y2="20" stroke="currentColor" strokeWidth="1.5" />
    <rect x="5.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="10.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
    <rect x="15.4" y="4" width="3.2" height="9.5" rx="0.8" fill="currentColor" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-black / 5-white piano keyboard icon matching the 24x24 studio outline grid.
 */
export const PianoIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {PIANO_PATHS}
  </SvgIconBase>
));

PianoIcon.displayName = 'PianoIcon';
