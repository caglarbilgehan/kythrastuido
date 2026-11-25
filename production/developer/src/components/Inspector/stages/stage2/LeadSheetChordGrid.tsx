import React from 'react';
import { BarChordItem, ChordSectionItem } from '../../../../types/stages';

export interface SectionBarGroup {
  idx: number;
  section: ChordSectionItem;
  bars: BarChordItem[];
}

interface LeadSheetChordGridProps {
  totalBars: number;
  groups: SectionBarGroup[];
  activeSectionIdx: number;
  activeBarNumber: number;
  searchBar: string;
  onSearchBarChange: (val: string) => void;
  onSeek?: (sec: number) => void;
  safeSec: (val: unknown) => number;
}

export const LeadSheetChordGrid: React.FC<LeadSheetChordGridProps> = ({
  totalBars,
  groups,
  activeSectionIdx,
  activeBarNumber,
  searchBar,
  onSearchBarChange,
  onSeek,
  safeSec
}) => {
  return (
          <div className="m3-surface-card dev-section-block">
            <md-elevation></md-elevation>

            <div className="dev-section-header">
              <div className="dev-section-header-title">
                <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
                  grid_view
                </md-icon>
                <span>Ölçü Bazlı Akor Şeması (Lead Sheet Grid)</span>
                  <span className="dev-aside-copy m3-tabular">
                    · Toplam {totalBars} Ölçü · Standart Görünüm
                  </span>
              </div>

                  <div className="dev-section-header-actions">
                    <div className="dev-search-pill">
                      <md-icon>search</md-icon>
                      <input
                        type="text"
                        placeholder="Ölçü Ara (örn: 14)"
                        value={searchBar}
                        onChange={(e) => onSearchBarChange(e.target.value)}
                        className="dev-search-input m3-tabular"
                      />
                    </div>
                    {searchBar && (
            <md-text-button onClick={() => onSearchBarChange('')}>Temizle</md-text-button>
                    )}
                  </div>
                </div>

                  <div className="dev-chords-scroll">
                    {groups.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center' }} className="dev-aside-copy">
                          Arama kriterlerine uyan ölçü bulunamadı.
                        </div>
                        ) : (
          groups.map((group, gIdx) => {
            const sec = group.section;
                        const isGroupActive = activeSectionIdx === group.idx;
                        const secStart = safeSec(sec?.start_sec);
                        const secEnd = safeSec(sec?.end_sec);

                        return (
                              <div key={`${sec.name || 'grp'}-${gIdx}`} className="dev-stack" style={{ gap: '12px' }}>
                                <div className="dev-chord-group-header">
                                  <div className="dev-io-flow">
                                    <span
                                      className={`m3-status-dot ${isGroupActive ? 'is-pulsing' : 'neutral'}`}
                                      aria-hidden="true"
                                    />
                                      <span className="md-typescale-title-small">{sec.name || 'Bölüm'}</span>
                                      <span className="dev-aside-copy m3-tabular">
                                        (Ölçü {sec.start_bar || 1}–{sec.end_bar || 1} · {secStart.toFixed(1)}s–
                                        {secEnd.toFixed(1)}s)
                                      </span>
                                  </div>

                                    <md-text-button onClick={() => onSeek?.(secStart)}>
                                      <md-icon slot="icon">play_arrow</md-icon>
                                      <span>Bu Bölümü Çal</span>
                                </md-text-button>
                              </div>

                                <div className="dev-chord-bar-grid">
                                  {group.bars.map((bar) => {
                                    const isActive = activeBarNumber === bar.bar_number;
                                    const bStart = safeSec(bar.start_sec);
                                    const bDur = safeSec(bar.duration_sec);

                                    return (
                                      <button
                                        type="button"
                                        key={bar.bar_number}
                                        onClick={() => onSeek?.(bStart)}
                                        className={`dev-chord-bar-card ${isActive ? 'is-active' : ''}`}
                                        title={`Ölçü ${bar.bar_number}: ${bar.chord} (${bStart.toFixed(2)} sn) noktasına atlat`}
                                      >
                                            <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '11px', opacity: 0.85 }}>
                                              <span className="dev-io-flow">
                                                {isActive && <span className="m3-status-dot is-pulsing" aria-hidden="true" />}
                                                <strong>Ölçü {bar.bar_number}</strong>
                                              </span>
                                              <span>{bStart.toFixed(1)}s</span>
                                            </div>

                                              <div className="dev-benchmark-top">
                                                <span className="dev-chord-symbol">{bar.chord}</span>
                                                {bar.chords && bar.chords.length > 1 && (
                            <span className="dev-aside-copy" style={{ fontWeight: 600 }}>
                              {bar.chords.map((c) => c.chord).join(' / ')}
                            </span>
                                                )}
                                              </div>

                                                <div className="dev-benchmark-top m3-tabular" style={{ fontSize: '10.5px', opacity: 0.78, paddingTop: '4px', borderTop: '1px solid var(--md-sys-color-outline-variant)' }}>
                                                  <span>{bDur.toFixed(2)} sn</span>
                                                  <md-icon style={{ fontSize: '14px' }}>play_arrow</md-icon>
                                                </div>
                                              </button>
                                              );
                  })}
                                            </div>
                                        </div>
                                        );
          })
        )}
                                      </div>
    </div>
                                );
};
