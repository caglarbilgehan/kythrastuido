import React from 'react';

type MdBaseProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  disabled?: boolean;
  slot?: string;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'md-filled-button': MdBaseProps & { href?: string; type?: string };
      'md-filled-tonal-button': MdBaseProps & { href?: string; type?: string };
      'md-outlined-button': MdBaseProps & { href?: string; type?: string };
      'md-text-button': MdBaseProps & { href?: string; type?: string };
      'md-icon-button': MdBaseProps & { 'aria-label'?: string; toggle?: boolean; selected?: boolean };
      'md-filled-icon-button': MdBaseProps & { 'aria-label'?: string; toggle?: boolean; selected?: boolean };
      'md-filled-tonal-icon-button': MdBaseProps & { 'aria-label'?: string; toggle?: boolean; selected?: boolean };
      'md-outlined-icon-button': MdBaseProps & { 'aria-label'?: string; toggle?: boolean; selected?: boolean };
      'md-icon': MdBaseProps;
      'md-slider': MdBaseProps & {
        min?: number | string;
        max?: number | string;
        step?: number | string;
        value?: number | string;
        labeled?: boolean;
        ticks?: boolean;
        'aria-label'?: string;
        onInput?: (e: any) => void;
        onChange?: (e: any) => void;
      };
      'md-chip-set': MdBaseProps;
      'md-filter-chip': MdBaseProps & {
        label?: string;
        selected?: boolean;
        elevated?: boolean;
        removable?: boolean;
      };
      'md-assist-chip': MdBaseProps & {
        label?: string;
        elevated?: boolean;
      };
      'md-tabs': MdBaseProps & {
        'active-tab-index'?: number;
        onChange?: (e: any) => void;
      };
      'md-primary-tab': MdBaseProps & {
        active?: boolean;
        'inline-icon'?: boolean;
      };
      'md-outlined-text-field': MdBaseProps & {
        label?: string;
        value?: string;
        type?: string;
        placeholder?: string;
        'supporting-text'?: string;
        onInput?: (e: any) => void;
      };
      'md-linear-progress': MdBaseProps & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
        'four-color'?: boolean;
      };
      'md-circular-progress': MdBaseProps & {
        value?: number;
        max?: number;
        indeterminate?: boolean;
        'four-color'?: boolean;
      };
      'md-dialog': MdBaseProps & {
        open?: boolean;
        type?: string;
        onClose?: (e: any) => void;
      };
      'md-list': MdBaseProps;
      'md-list-item': MdBaseProps & {
        type?: 'text' | 'button' | 'link';
        href?: string;
      };
      'md-ripple': MdBaseProps;
      'md-elevation': MdBaseProps;
      'md-divider': MdBaseProps & { inset?: boolean };
    }
  }
}
