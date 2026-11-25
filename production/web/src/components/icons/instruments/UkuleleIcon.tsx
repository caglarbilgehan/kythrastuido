import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Solid Silhouette Soprano/Concert Ukulele Icon
 * Matches the guitar's modern filled silhouette aesthetic:
 * - Solid figure-8 body with negative space (evenodd) cutout soundhole and bridge
 * - Neck with 2 frets and rounded heel
 * - Crown headstock with 4 tuning pegs (2 per side)
 * - Cohesive 43-degree diagonal studio angle
 */
const UKULELE_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Solid Ukulele Body with Negative-Space Soundhole & Bridge (evenodd) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.8,9.5 C9.8,9.2 7.6,9.5 6.6,11.2 C5.6,12.8 6.4,14.5 5.5,16 C4.2,18 4.8,21.5 8,22.8 C10.5,23.5 13.5,23.5 16,22.8 C19.2,21.5 19.8,18 18.5,16 C17.6,14.5 18.4,12.8 17.4,11.2 C16.4,9.5 14.2,9.2 13.2,9.5 V10.5 C13.2,11.8 10.8,11.8 10.8,10.5 Z M12,14.5 C10.9,14.5 10,15.4 10,16.5 C10,17.6 10.9,18.5 12,18.5 C13.1,18.5 14,17.6 14,16.5 C14,15.4 13.1,14.5 12,14.5 Z M9.5,20.2 H14.5 V21.2 H9.5 Z"
    />

    {/* Neck & Frets */}
    <path
      d="M10.8,4.5 V9.5 M13.2,4.5 V9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="10.8" y1="6.2" x2="13.2" y2="6.2" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <line x1="10.8" y1="7.8" x2="13.2" y2="7.8" stroke="currentColor" strokeWidth="1.4" fill="none" />
    <path d="M10.8,9.5 C10.8,11 13.2,11 13.2,9.5" stroke="currentColor" strokeWidth="1.5" fill="none" />

    {/* Crown Headstock */}
    <path d="M10.4,4.5 C9.8,3.5 10.2,1.8 12,1.2 C13.8,1.8 14.2,3.5 13.6,4.5 Z" />

    {/* 4 Tuning Pegs (2 Left, 2 Right) */}
    <line x1="10.6" y1="2.5" x2="9.2" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="10.8" y1="3.8" x2="9.4" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.4" y1="2.5" x2="14.8" y2="2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="13.2" y1="3.8" x2="14.6" y2="3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </g>
);

/**
 * 4-peg rounded figure-8 ukulele icon matching the 24x24 studio outline grid.
 */
export const UkuleleIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {UKULELE_PATHS}
  </SvgIconBase>
));

UkuleleIcon.displayName = 'UkuleleIcon';


