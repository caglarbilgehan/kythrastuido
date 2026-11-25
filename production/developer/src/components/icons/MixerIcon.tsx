import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Clean 3-Channel Studio Fader Icon
 * Spacious vertical rails with staggered horizontal slider caps:
 * - Zero sub-pixel gaps or cluttered backing boxes at 18px-20px
 * - Explicit fill overrides guard against <md-icon> host CSS fill inheritance
 */
const MIXER_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* 3 Spacious Vertical Fader Rails */}
    <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />
    <line x1="18" y1="4" x2="18" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={{ fill: 'none' }} />

    {/* 3 Staggered Horizontal Studio Fader Caps */}
    <rect x="3.7" y="7.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="9.7" y="13.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
    <rect x="15.7" y="6.6" width="4.6" height="2.8" rx="1.1" fill="currentColor" stroke="none" style={{ fill: 'currentColor' }} />
  </g>
);

/**
 * 3-fader studio mixer icon matching the 24x24 studio outline grid.
 */
export const MixerIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {MIXER_PATHS}
  </SvgIconBase>
));

MixerIcon.displayName = 'MixerIcon';
