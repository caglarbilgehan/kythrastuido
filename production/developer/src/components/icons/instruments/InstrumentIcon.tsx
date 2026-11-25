import React from 'react';
import { IconProps } from '../SvgIconBase';
import { GuitarIcon } from './GuitarIcon';
import { PianoIcon } from './PianoIcon';
import { UkuleleIcon } from './UkuleleIcon';

  export type StudioInstrumentKind = 'guitar' | 'piano' | 'ukulele';

  const INSTRUMENT_ICON_REGISTRY: Record<StudioInstrumentKind, React.ComponentType < IconProps >> = {
    guitar: GuitarIcon,
    piano: PianoIcon,
    ukulele: UkuleleIcon
  };

export interface InstrumentIconProps extends IconProps {
  instrument: StudioInstrumentKind;
}

/**
 * Strategy selector rendering the pure SVG icon for the active instrument type.
 */
export const InstrumentIcon: React.FC<InstrumentIconProps> = React.memo(({
  instrument,
  ...rest
}) => {
  const Icon = INSTRUMENT_ICON_REGISTRY[instrument] ?? GuitarIcon;
  return <Icon {...rest} />;
});

InstrumentIcon.displayName = 'InstrumentIcon';
