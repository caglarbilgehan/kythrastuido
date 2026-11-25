import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

/**
 * Option A: Dynamic Mechanical Metronome Icon (Studio Standard)
 * Features an open-pyramid body, center tempo guide, and an angled swinging pendulum arm
 * with a high-readability counterweight bob.
 *
 * Explicit `fill="none"` and `style={{ fill: 'none' }}` guarantees that web-component host
 * styles (like `<md-icon>`'s `fill: currentColor`) will never fill the body into a solid block.
 */
const METRONOME_PATHS = (
  <g style={{ fill: 'none' }}>
    {/* Center tempo scale guide */}
    <path
      d="M12 11.5V9"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Swinging pendulum arm */}
    <path
      d="M12 17.2L18.8 10.4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      style={{ fill: 'none' }}
    />

    {/* Open Pyramid Metronome Frame */}
    <path
      d="M15.1 5.7L14.85 4.98C14.4 3.75 13.25 3 12 3C10.75 3 9.6 3.75 9.15 4.98L4.42 19.69C4.15 20.5 4.76 21 5.37 21H18.63C19.24 21 19.85 20.5 19.58 19.69L18.45 16.2"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ fill: 'none' }}
    />

    {/* Counterweight Bob (Pirinç Ağırlık) */}
    <circle
      cx="19.8"
      cy="9.4"
      r="2"
      fill="currentColor"
      stroke="none"
      style={{ fill: 'currentColor' }}
    />
  </g>
);

/**
 * Classic mechanical pyramid metronome icon with angled swinging pendulum and weight.
 */
export const MetronomeIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {METRONOME_PATHS}
  </SvgIconBase>
));

MetronomeIcon.displayName = 'MetronomeIcon';

