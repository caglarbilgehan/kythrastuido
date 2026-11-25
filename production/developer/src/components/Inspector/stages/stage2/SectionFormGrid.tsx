import React from 'react';
import { ChordSectionItem } from '../../../../types/stages';
import { SECTION_TONE_MAP } from '../../../../constants/instruments';

interface SectionFormGridProps {
  sections: ChordSectionItem[];
  activeSectionIdx: number;
  selectedSectionFilter: number | 'all';
  onSelectSection: (idx: number | 'all', startSec?: number) => void;
  safeSec: (val: unknown) => number;
}

export const SectionFormGrid: React.FC<SectionFormGridProps> = ({
  sections,
  activeSectionIdx,
  selectedSectionFilter,
  onSelectSection,
  safeSec
}) => {
  return (
          <div className="m3-surface-card dev-section-block">
            <md-elevation></md-elevation>

            <div className="dev-section-header">
              <div className="dev-section-header-title">
                <md-icon style={{ color: 'var(--md-sys-color-secondary)', fontSize: '18px' }}>
                  bookmark
                </md-icon>
                <span>Şarkı Formu ve Bölümleme (allin1 MSA)</span>
                <span className="dev-aside-copy">· Tıklayarak oynatıcıyı bölüme atlatın</span>
              </div>

                <div className="dev-section-header-actions">
                  {selectedSectionFilter !== 'all' && (
                      <md-text-button onClick={() => onSelectSection('all')}>
                        Filtreyi Sıfırla (Tümü)
            </md-text-button>
          )}
                  <span className="m3-tonal-badge sm secondary m3-tabular">
                    {sections.length} Bölüm Tespit Edildi
                  </span>
              </div>
            </div>

              <div className="dev-section-grid">
                {sections.map((sec, idx) => {
                  const secStart = safeSec(sec.start_sec);
                  const secEnd = safeSec(sec.end_sec);
                  const dur = Math.max(0, secEnd - secStart).toFixed(1);
                  const isActive = idx === activeSectionIdx;
                  const isFilterSelected = selectedSectionFilter === idx;
                  const tone = (sec.raw_label && SECTION_TONE_MAP[sec.raw_label]) || 'neutral';

                  const tileClass = [
                    'dev-section-tile',
                    tone !== 'neutral' ? `tone-${tone}` : '',
                    isActive ? 'is-active' : '',
                    isFilterSelected ? 'is-filtered' : ''
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <button
                      type="button"
                      key={`${sec.name || 'section'}-${idx}`}
                      onClick={() => onSelectSection(idx, secStart)}
                      className={tileClass}
                      title={`Oynatmayı ${sec.name || 'Bölüm'} (${secStart.toFixed(1)} sn · Ölçü ${sec.start_bar || 1}) noktasına atlat ve filtrele`}
                    >
                          <div className="dev-benchmark-top">
                            <span className="dev-benchmark-name-wrap" style={{ fontSize: '12.5px', fontWeight: 600 }}>
                              {isActive ? (
                    <span className="m3-status-dot is-pulsing" aria-hidden="true" />
                              ) : (
                    <md-icon style={{ fontSize: '16px' }}>play_arrow</md-icon>
                              )}
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {sec.name || `Bölüm ${idx + 1}`}
                              </span>
                            </span>
                              <span className={`m3-tonal-badge sm m3-tabular ${isActive ? 'primary' : isFilterSelected ? 'secondary' : ''}`}>
                                Ölçü {sec.start_bar || 1}–{sec.end_bar || 1}
                              </span>
                          </div>

                              <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '11.5px', opacity: 0.85 }}>
                                <span>
                                  {secStart.toFixed(1)}s – {secEnd.toFixed(1)}s
                                </span>
                                <span>({dur} sn)</span>
                              </div>
                            </button>
                            );
        })}
                          </div>
                      </div>
                      );
};
