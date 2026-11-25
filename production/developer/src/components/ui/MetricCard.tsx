import React from 'react';

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'error';
  compactValue?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  tone = 'default',
  compactValue = false
}) => {
  const containerTone =
    tone === 'tertiary' ? 'tone-tertiary' : tone === 'error' ? 'tone-error' : '';
  const valueTone = tone !== 'default' ? `tone-${tone}` : '';

  return (
        <div className={`m3-surface-card dev-metric-card ${containerTone}`}>
          <md-elevation></md-elevation>
          <div className="dev-metric-label">
            {icon}
            <span>{label}</span>
          </div>
            <div className={`dev-metric-value m3-tabular ${valueTone} ${compactValue ? 'is-compact' : ''}`}>
              {value}
            </div>
            {subtitle && <div className="dev-metric-sub">{subtitle}</div>}
          </div>
          );
};
