import React from 'react';
import { IconProps, SvgIconBase } from './SvgIconBase';

const BRAND_LOGO_PATHS = (
  <path
    d="M5 12V7M9 17V5M13 19V3M17 15V8M21 12V10"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  />
);

/**
 * Kythra Studio equalizer waveform brand mark.
 */
export const BrandLogoIcon: React.FC<IconProps> = React.memo(({ size = 20, ...props }) => (
  <SvgIconBase size={size} {...props}>
    {BRAND_LOGO_PATHS}
  </SvgIconBase>
));

BrandLogoIcon.displayName = 'BrandLogoIcon';
