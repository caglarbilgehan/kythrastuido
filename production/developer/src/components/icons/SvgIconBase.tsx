import React from 'react';

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'children'> {
  size?: number;
  title?: string;
}

interface SvgIconBaseProps extends IconProps {
  children: React.ReactNode;
}

/**
 * Shared accessible SVG primitive enforcing consistent viewBox, sizing,
 * stroke-less defaults, and automatic ARIA attributes across studio icons.
 */
export const SvgIconBase: React.FC<SvgIconBaseProps> = React.memo(({
  size = 20,
  width,
  height,
  viewBox = '0 0 24 24',
  fill = 'none',
  title,
  children,
  ...rest
}) => (
  <svg
    width={width ?? size}
    height={height ?? size}
    viewBox={viewBox}
    fill={fill}
    role={title ? 'img' : undefined}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : true}
    {...rest}
  >
    {children}
  </svg>
));

SvgIconBase.displayName = 'SvgIconBase';
