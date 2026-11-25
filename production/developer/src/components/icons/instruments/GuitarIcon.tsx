import React from 'react';
import { IconProps, SvgIconBase } from '../SvgIconBase';

/**
 * Iconic Electric Guitar (Fender Stratocaster Silhouette)
 * Features:
 * - Asymmetric double-cutaway horns
 * - Cutout negative-space pickguard (fillRule="evenodd")
 * - 3 single-coil pickups and tone/volume control knobs
 * - Signature 6-in-line headstock with tuning pegs
 */
const GUITAR_PATHS = (
  <g fill="currentColor" transform="rotate(43 12 12)">
    {/* Body with Cutout Pickguard (evenodd creates the negative space pickguard) */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2,5 V12.2 C10,12 8.5,11.2 7.6,11.6 C6.7,12 6.6,13.2 7.1,14.6 C7.7,16 7.4,17.2 6.6,18.4 C5.4,20 6.4,22.6 9.4,22.9 C11.5,23.1 13.5,23.1 15.2,22.3 C17.5,21.1 17.8,18.5 16.7,17 C15.9,15.8 15.7,14.8 16.4,13.8 C17.1,12.8 16.6,12.2 15.6,12.5 C14.6,12.8 13.6,13 12.8,12.2 V5 H11.2 Z M11.5,13.5 C10.8,13.5 10.2,13.8 9.8,14.2 C9.3,14.8 9.5,15.8 9.2,16.8 C8.8,17.8 8.8,18.8 9.5,19.8 C10.2,20.6 11.8,20.8 13.2,20.5 C14.6,20.2 15.2,19.2 15.2,18.2 C15.2,16.8 14.8,15.5 14.2,14.5 C13.6,13.8 12.5,13.5 11.5,13.5 Z"
    />

    {/* Stratocaster 6-in-line Headstock */}
    <path d="M11.2,5 L10.8,1.7 C10.8,1.2 11.3,0.8 11.8,0.8 C12.6,0.8 13.2,1.1 13.6,1.4 C14.3,1.9 14.1,2.8 13.3,3.3 C12.8,3.6 12.8,4.3 12.8,5 H11.2 Z" />

    {/* 6 Tuning Pegs in a row on the left */}
    <circle cx="10.2" cy="1.5" r="0.45" />
    <circle cx="10.2" cy="2.1" r="0.45" />
    <circle cx="10.2" cy="2.7" r="0.45" />
    <circle cx="10.2" cy="3.3" r="0.45" />
    <circle cx="10.2" cy="3.9" r="0.45" />
    <circle cx="10.2" cy="4.5" r="0.45" />

    {/* 3 Single-Coil Pickups inside the Pickguard */}
    <rect x="10.8" y="14.8" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="16.3" width="2.4" height="0.7" rx="0.3" />
    <rect x="10.8" y="17.8" width="2.4" height="0.7" rx="0.3" />

    {/* Control Knobs (Potanslar) */}
    <circle cx="13.8" cy="18.5" r="0.4" />
    <circle cx="13.2" cy="19.5" r="0.4" />
  </g>
);

/**
 * Electric guitar (Stratocaster) icon matching the 24x24 studio outline grid.
 */
export const GuitarIcon: React.FC<IconProps> = React.memo(({ size = 18, ...props }) => (
  <SvgIconBase size={size} fill="none" {...props}>
    {GUITAR_PATHS}
  </SvgIconBase>
));

GuitarIcon.displayName = 'GuitarIcon';


