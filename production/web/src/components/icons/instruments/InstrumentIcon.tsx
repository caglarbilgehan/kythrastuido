import React from 'react';
import { InstrumentType } from '../../../types/studio';
import { IconProps } from '../SvgIconBase';
import { GuitarIcon } from './GuitarIcon';
import { PianoIcon } from './PianoIcon';
import { UkuleleIcon } from './UkuleleIcon';

const INSTRUMENT_ICON_REGISTRY: Record<InstrumentType, React.ComponentType<IconProps>> = {
  guitar: GuitarIcon,
  piano: PianoIcon,
  ukulele: UkuleleIcon
};

export interface InstrumentIconProps extends IconProps {
  instrument: InstrumentType;
}

/**
 * Strategy selector rendering the pure SVG icon for the active InstrumentType.
 */
export const InstrumentIcon: React.FC<InstrumentIconProps> = React.memo(({
  instrument,
  ...rest
}) => {
  const Icon = INSTRUMENT_ICON_REGISTRY[instrument] ?? GuitarIcon;
  return <Icon {...rest} />;
});

InstrumentIcon.displayName = 'InstrumentIcon';
