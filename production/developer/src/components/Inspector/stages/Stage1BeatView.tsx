import React, { useMemo, useState } from 'react';
import { Stage1BeatData } from '../../../types/stages';
import { MetricCard } from '../../ui/MetricCard';

interface Stage1BeatViewProps {
  data?: Stage1BeatData;
  currentTime?: number;
  onSeek?: (sec: number) => void;
}

interface BarData {
  barNumber: number;
  startTime: number;
  endTime: number;
  beats: Array<{
    beat_number: number;
    time_sec: number;
    is_downbeat: boolean;
  }>;
}

export const Stage1BeatView: React.FC<Stage1BeatViewProps> = ({
  data,
  currentTime = 0,
  onSeek
}) => {
  const tempo = data?.tempo_bpm || 0;
  const timeSig = data?.time_signature || '4/4';
  const beatCount = data?.beat_count || (data?.beats ? data.beats.length : 0);
  const downbeats = data?.downbeat_count || Math.floor(beatCount / 4);

  const [searchBar, setSearchBar] = useState<string>('');

  const bars: BarData[] = useMemo(() => {
    const rawBeats = data?.beats || [];
    if (!rawBeats.length) return [];

    const grouped: BarData[] = [];
    let currentBar: BarData | null = null;
    let barCounter = 1;

    for (let i = 0; i < rawBeats.length; i++) {
      const b = rawBeats[i];
      const isDown = b.is_downbeat || b.beat_number === 1;

      if (isDown || !currentBar) {
        if (currentBar) {
          currentBar.endTime = b.time_sec;
          grouped.push(currentBar);
        }
        currentBar = {
          barNumber: barCounter++,
          startTime: b.time_sec,
          endTime: b.time_sec + 2.0,
          beats: []
        };
      }

      currentBar.beats.push({
        beat_number: b.beat_number || currentBar.beats.length + 1,
        time_sec: b.time_sec,
        is_downbeat: Boolean(isDown)
      });
    }

    if (currentBar && currentBar.beats.length > 0) {
      currentBar.endTime = currentBar.startTime + 2.0;
      grouped.push(currentBar);
    }

    return grouped;
  }, [data?.beats]);

  const filteredBars = useMemo(() => {
    if (!searchBar.trim()) return bars;
    const q = searchBar.toLowerCase().replace(/ölçü|bar/gi, '').trim();
    const num = parseInt(q, 10);
    if (isNaN(num)) return bars;
    return bars.filter((b) => b.barNumber === num);
  }, [bars, searchBar]);

  const activeBarNumber = useMemo(() => {
    if (!bars.length || currentTime === undefined) return -1;
    const found = bars.find((b) => currentTime >= b.startTime && currentTime < b.endTime);
    return found ? found.barNumber : -1;
  }, [bars, currentTime]);

  return (
        <div className="dev-stack">
          <div className="dev-grid-4">
            <MetricCard
              label="Tespit Edilen Tempo"
              icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>speed</md-icon>}
              value={
                <>
                  {tempo} <span className="dev-aside-copy">BPM</span>
                </>
              }
            />
            <MetricCard
              label="Ölçü Birimi"
              icon={<md-icon style={{ color: 'var(--md-sys-color-tertiary)' }}>music_note</md-icon>}
              tone="tertiary"
              value={timeSig}
            />
            <MetricCard
              label="Vuruş Sayısı"
              icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>graphic_eq</md-icon>}
              value={beatCount}
            />
            <MetricCard
              label="Toplam Ölçü"
              icon={<md-icon style={{ color: 'var(--md-sys-color-secondary)' }}>schedule</md-icon>}
              tone="secondary"
              value={
                <>
                  {bars.length || downbeats} <span className="dev-aside-copy">Ölçü</span>
                </>
              }
            />
          </div>

                  <div className="m3-surface-card dev-section-block">
                    <md-elevation></md-elevation>

                    <div className="dev-section-header">
                      <div className="dev-section-header-title">
                        <md-icon style={{ color: 'var(--md-sys-color-tertiary)', fontSize: '18px' }}>
                          podcasts
                        </md-icon>
                        <span className="m3-tabular">
                          Şarkı Ölçü Zaman Çizelgesi · {bars.length} Ölçü · Atlamak İçin Tıklayın
                        </span>
                      </div>

                          <div className="dev-section-header-actions">
                            <div className="dev-search-pill">
                              <md-icon>search</md-icon>
                              <input
                                type="text"
                                placeholder="Ölçü # ara..."
                                value={searchBar}
                                onChange={(e) => setSearchBar(e.target.value)}
                                className="dev-search-input m3-tabular"
                              />
                            </div>
                            {searchBar && (
              <md-text-button onClick={() => setSearchBar('')}>Temizle</md-text-button>
                            )}
                          </div>
                        </div>

                          <div className="dev-timeline-list">
                            {filteredBars.length === 0 ? (
                                <div style={{ padding: '32px', textAlign: 'center' }} className="dev-aside-copy">
                                  {bars.length === 0
                                    ? 'Henüz metrik vuruş verisi bulunamadı. Vuruş ızgarasını oluşturmak için "Aşama 01 Çalıştır" düğmesine tıklayın.'
                                    : `"${searchBar}" aramasıyla eşleşen ölçü bulunamadı.`}
                                </div>
                                ) : (
            filteredBars.map((bar) => {
              const isActive = activeBarNumber === bar.barNumber;
                                return (
                                <div
                                  key={bar.barNumber}
                                  onClick={() => onSeek?.(bar.startTime)}
                                  className={`dev-beat-row ${isActive ? 'is-active' : ''}`}
                                  title={`Oynatmayı Ölçü ${bar.barNumber} (${bar.startTime.toFixed(3)} sn) noktasına atlat`}
                                >
                                        <div className="dev-beat-bar-info">
                                          <div className="dev-bar-circle m3-tabular">{bar.barNumber}</div>
                                          <div className="dev-modal-track-meta">
                                            <span className="m3-tabular" style={{ fontSize: '12.5px', fontWeight: 600 }}>
                                              Ölçü {bar.barNumber}{' '}
                                              {isActive && <span className="m3-status-dot secondary is-pulsing" />}
                                            </span>
                                              <span className="m3-tabular" style={{ fontSize: '11px', color: 'var(--md-sys-color-tertiary)', fontWeight: 600 }}>
                                                {bar.startTime.toFixed(3)} sn
                                              </span>
                                          </div>
                                        </div>

                                          <div className="dev-subbeat-grid m3-tabular">
                                            {bar.beats.map((b) => {
                                              const isSubBeatActive =
                                                currentTime >= b.time_sec && currentTime < b.time_sec + 0.5;
                                              const chipCls = [
                                                'dev-subbeat-chip',
                                                isSubBeatActive ? 'is-sub-active' : b.is_downbeat ? 'is-downbeat' : ''
                                              ]
                                                .filter(Boolean)
                                                .join(' ');

                                              return (
                                                <div
                                                  key={b.beat_number}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSeek?.(b.time_sec);
                                                  }}
                                                  className={chipCls}
                                                  title={`Vuruş ${bar.barNumber}.${b.beat_number} (${b.time_sec.toFixed(3)} sn) noktasına git`}
                                                >
                                                  <span>{b.is_downbeat ? `.${b.beat_number} (Baş)` : `.${b.beat_number}`}</span>
                                                  <span>{b.time_sec.toFixed(2)}s</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>
                                        );
            })
          )}
                                    </div>
                                  </div>
                                </div>
                                );
};
