import React, { useMemo, useState } from 'react';
import { BarChordItem, ChordSectionItem, Stage2ChordData } from '../../../types/stages';
import { MetricCard } from '../../ui/MetricCard';
import { SectionFormGrid } from './stage2/SectionFormGrid';
import { LeadSheetChordGrid, SectionBarGroup } from './stage2/LeadSheetChordGrid';

interface Stage2ChordViewProps {
  data?: Stage2ChordData;
  currentTime?: number;
  onSeek?: (sec: number) => void;
}

function safeSec(val: unknown): number {
  if (typeof val === 'number' && !isNaN(val)) return val;
  if (typeof val === 'string') {
    const p = parseFloat(val);
    if (!isNaN(p)) return p;
  }
  return 0;
}

export const Stage2ChordView: React.FC<Stage2ChordViewProps> = ({
  data,
  currentTime = 0,
  onSeek
}) => {
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<number | 'all'>('all');
  const [searchBar, setSearchBar] = useState<string>('');

  const chordCount = data?.chord_count || (data?.chords ? data.chords.length : 0);

  const primaryProgression =
    data?.primary_progression ||
    (Array.isArray(data?.bars) && data.bars.length > 0
        ? Array.from(new Set(data.bars.map((b) => b.chord).filter((c) => c !== 'N.C.')))
          .slice(0, 8)
          .join(' → ')
        : 'Yok');

  const sections: ChordSectionItem[] = useMemo(() => {
    return data?.sections && data.sections.length > 0 ? data.sections : [];
  }, [data?.sections]);

  const bars: BarChordItem[] = useMemo(() => {
    if (Array.isArray(data?.bars) && data.bars.length > 0) {
      return data.bars;
    }
    const raw = data?.chords || [];
    return raw.map((c, i) => {
      const sStart = safeSec(c.start_sec);
      const sEnd = safeSec(c.end_sec);
      const formatted = (c.chord || 'N').replace(':min', 'm').replace(':maj', '');
      return {
        bar_number: i + 1,
        start_sec: sStart,
        end_sec: sEnd,
        duration_sec: Math.max(0, sEnd - sStart),
        chord: formatted,
        chord_raw: c.chord || 'N',
        chords: [
          {
            chord: formatted,
            chord_raw: c.chord || 'N',
            start_sec: sStart,
            end_sec: sEnd,
            duration_sec: Math.max(0, sEnd - sStart)
          }
        ]
      };
    });
  }, [data?.bars, data?.chords]);

  const activeSectionIdx = useMemo(() => {
    if (!sections.length) return -1;
    return sections.findIndex(
      (sec) => currentTime >= safeSec(sec?.start_sec) && currentTime < safeSec(sec?.end_sec)
    );
  }, [sections, currentTime]);

  const activeBarNumber = useMemo(() => {
    if (!bars.length) return -1;
    const found = bars.find(
      (b) => currentTime >= safeSec(b?.start_sec) && currentTime < safeSec(b?.end_sec)
    );
    return found ? found.bar_number : -1;
  }, [bars, currentTime]);

  const sectionGroups: SectionBarGroup[] = useMemo(() => {
    if (!sections.length || !bars.length) {
      const firstBar = bars[0];
      const lastBar = bars[bars.length - 1];
      return [
        {
          idx: 0,
          section: {
            name: 'Tüm Şarkı',
            start_bar: 1,
            end_bar: Math.max(1, bars.length),
            start_sec: firstBar ? safeSec(firstBar.start_sec) : 0.0,
            end_sec: lastBar ? safeSec(lastBar.end_sec) : 0.0
          },
          bars
        }
      ];
    }

    return sections.map((sec, idx) => {
      const sStartBar = Number(sec?.start_bar ?? 1);
      const sEndBar = Number(sec?.end_bar ?? 1);
      return {
        idx,
        section: sec,
        bars: bars.filter((b) => b.bar_number >= sStartBar && b.bar_number <= sEndBar)
      };
    });
  }, [sections, bars]);

  const filteredSectionGroups = useMemo(() => {
    let groups = sectionGroups;
    if (selectedSectionFilter !== 'all') {
      groups = groups.filter((g) => g.idx === selectedSectionFilter);
    }
    if (searchBar.trim()) {
      const q = parseInt(searchBar.trim(), 10);
      if (!isNaN(q)) {
        groups = groups
          .map((g) => ({
            ...g,
            bars: g.bars.filter((b) => b.bar_number === q)
          }))
          .filter((g) => g.bars.length > 0);
      }
    }
    return groups;
  }, [sectionGroups, selectedSectionFilter, searchBar]);

  const handleSelectSection = (idx: number | 'all', startSec?: number) => {
    if (idx !== 'all' && typeof startSec === 'number') {
      onSeek?.(startSec);
    }
    setSelectedSectionFilter(idx);
  };

  return (
        <div className="dev-stack">
          <div className="dev-grid-4">
            <MetricCard
              label="Şarkı Tonu (Key)"
              tone="primary"
              value={data?.key_signature || 'C major'}
              subtitle="Krumhansl-Schmuckler Armonik Ton Analizi"
            />
            <MetricCard
              label="Metrik Ölçü Kapsamı"
              value={
                <>
                  {bars.length} <span className="dev-aside-copy">Ölçü (Bar)</span>
                </>
              }
              subtitle={
            <span style={{ color: 'var(--md-sys-color-primary)', fontWeight: 600 }}>
              Aşama 01 Vuruş Izgarası ile Senkronize
            </span>
              }
            />
            <MetricCard
              label="Armonik Değişim Olayları"
              tone="secondary"
              value={
                <>
                  {chordCount} <span className="dev-aside-copy">Akor (BTC)</span>
                </>
              }
              subtitle="Majority Voting ile Barlara Kuantize Edildi"
            />
            <MetricCard
              label="Baskın Akor Yürüyüşü"
              tone="tertiary"
              compactValue={true}
              value={<span title={primaryProgression}>{primaryProgression}</span>}
              subtitle="Şarkı Boyunca Ana Armonik Dizi"
            />
          </div>

          {sections.length > 0 && (
            <SectionFormGrid
              sections={sections}
              activeSectionIdx={activeSectionIdx}
              selectedSectionFilter={selectedSectionFilter}
              onSelectSection={handleSelectSection}
              safeSec={safeSec}
            />
          )}

          <LeadSheetChordGrid
            totalBars={bars.length}
            groups={filteredSectionGroups}
            activeSectionIdx={activeSectionIdx}
            activeBarNumber={activeBarNumber}
            searchBar={searchBar}
            onSearchBarChange={setSearchBar}
            onSeek={onSeek}
            safeSec={safeSec}
          />
        </div>
        );
};
