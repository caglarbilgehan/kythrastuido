import React, { useEffect, useRef, useState } from 'react';
import {
  AppLanguage,
  BarChordItem,
  ChordComplexityMode,
  InstrumentType,
  SongSection
} from '../types/studio';
import {
  formatDurationSec,
  transposeChord
} from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { InstrumentChordDiagram } from './InstrumentChordDiagram';
import { InstrumentIcon } from './icons';

interface FocusedChordWorkspaceProps {
  language: AppLanguage;
  sections: SongSection[];
  bars: BarChordItem[];
  activeSection?: SongSection;
  focusedSection?: SongSection;
  loopedSection?: SongSection;
  activeBar: BarChordItem;
  prevBar?: BarChordItem;
  nextBar?: BarChordItem;
  activeBeatInBar: number;
  currentTimeSec: number;
  durationSec: number;
  waveformPeaks: number[];
  loopRangeSec?: [number, number] | null;
  isPlaying: boolean;
  instrument: InstrumentType;
  transposeSemitones: number;
  capo: number;
  chordComplexity: ChordComplexityMode;
  autoFollowSection: boolean;
  isLoopActive: boolean;
  customBarLoopRange: [number, number] | null;
  onSelectSection: (section: SongSection) => void;
  onSelectBar: (bar: BarChordItem) => void;
  onSeekSec?: (sec: number) => void;
  onSetCustomBarLoopRange: (range: [number, number] | null) => void;
  onToggleLoopCurrentSection: () => void;
}

export const FocusedChordWorkspace: React.FC<FocusedChordWorkspaceProps> = ({
  language,
  sections,
  bars,
  activeSection,
  focusedSection,
  loopedSection,
  activeBar,
  prevBar,
  nextBar,
  activeBeatInBar,
  currentTimeSec,
  durationSec,
  waveformPeaks,
  loopRangeSec,
  instrument,
  transposeSemitones,
  capo,
  chordComplexity,
  isLoopActive,
  customBarLoopRange,
  onSelectSection,
  onSelectBar,
  onSeekSec,
  onSetCustomBarLoopRange
}) => {
  const t = TRANSLATIONS[language].workspace;
  const instT = TRANSLATIONS[language].docker.instruments;
  const dockerT = TRANSLATIONS[language].docker;
  const [firstSelectedBarNum, setFirstSelectedBarNum] = useState<number | null>(null);
  const barGridScrollRef = useRef<HTMLDivElement>(null);
  const activeBarCellRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  const sectionTabsBarRef = useRef<HTMLDivElement>(null);
  const activeSectionTabRef = useRef<HTMLElement | null>(null);
  const tabDragStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startScrollLeft: number;
    hasDragged: boolean;
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false
  });

  const displayedSection = focusedSection || activeSection || sections[0];

  // Clear pending first-bar click when loop is turned off
  useEffect(() => {
    if (!isLoopActive) {
      setFirstSelectedBarNum(null);
    }
  }, [isLoopActive]);

  // Auto-scroll the horizontal section tabs bar so the active section tab is ALWAYS centered
  // whenever it reaches or passes the horizontal middle of the bar!
  useEffect(() => {
    const container = sectionTabsBarRef.current;
    const activeTabEl = activeSectionTabRef.current;
    if (!container || !activeTabEl) return;

    const containerWidth = container.clientWidth;
    if (container.scrollWidth <= containerWidth) return;

    const tabCenter = activeTabEl.offsetLeft + activeTabEl.offsetWidth / 2;
    const targetLeft = Math.max(
      0,
      Math.min(
        container.scrollWidth - containerWidth,
        tabCenter - containerWidth / 2
      )
    );

    if (Math.abs(container.scrollLeft - targetLeft) > 4) {
      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth'
      });
    }
  }, [displayedSection?.id, sections.length]);

  const handleTabsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = sectionTabsBarRef.current;
    if (!container) return;
    tabDragStateRef.current = {
      isDown: true,
      startX: e.pageX - container.offsetLeft,
      startScrollLeft: container.scrollLeft,
      hasDragged: false
    };
  };

  const handleTabsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const st = tabDragStateRef.current;
    const container = sectionTabsBarRef.current;
    if (!st.isDown || !container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = x - st.startX;
    if (Math.abs(walk) > 6) {
      st.hasDragged = true;
      e.preventDefault();
      container.scrollLeft = st.startScrollLeft - walk;
    }
  };

  const handleTabsMouseUpOrLeave = () => {
    tabDragStateRef.current.isDown = false;
  };

  // Auto-scroll the 2-row bar grid so the currently playing bar's row is at the TOP
  // and the upcoming row is directly BELOW it!
  useEffect(() => {
    const container = barGridScrollRef.current;
    const activeEl = activeBarCellRef.current;
    if (!container || !activeEl) return;

    const targetTop = Math.max(0, activeEl.offsetTop - 10);
    if (Math.abs(container.scrollTop - targetTop) > 4) {
      container.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  }, [activeBar?.barNumber, displayedSection?.id]);

  const sectionBars = bars.filter((b) =>
    displayedSection
      ? b.barNumber >= displayedSection.startBar && b.barNumber <= displayedSection.endBar
      : true
  );

  const activeChordDisplay = transposeChord(
    activeBar?.chord || 'N',
    transposeSemitones,
    chordComplexity
  );
  const prevChordDisplay = prevBar
    ? transposeChord(prevBar.chord, transposeSemitones, chordComplexity)
    : '—';
  const nextChordDisplay = nextBar
    ? transposeChord(nextBar.chord, transposeSemitones, chordComplexity)
    : t.endChord;

  const handleBarClick = (bar: BarChordItem, e: React.MouseEvent) => {
    // When Loop is active (or Shift key is held), clicking bars selects the loop bar range
    // instead of seeking playback time!
    if (isLoopActive || e.shiftKey) {
      if (firstSelectedBarNum === null) {
        setFirstSelectedBarNum(bar.barNumber);
        onSetCustomBarLoopRange([bar.barNumber, bar.barNumber]);
      } else {
        const start = Math.min(firstSelectedBarNum, bar.barNumber);
        const end = Math.max(firstSelectedBarNum, bar.barNumber);
        onSetCustomBarLoopRange([start, end]);
        setFirstSelectedBarNum(null);
      }
      return;
    }
    onSelectBar(bar);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || durationSec <= 0 || !onSeekSec) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeekSec(ratio * durationSec);
  };

  const progressRatio = durationSec > 0 ? Math.min(1, Math.max(0, currentTimeSec / durationSec)) : 0;
  const loopStartRatio =
    loopRangeSec && durationSec > 0 ? Math.max(0, loopRangeSec[0] / durationSec) : null;
  const loopEndRatio =
    loopRangeSec && durationSec > 0 ? Math.min(1, loopRangeSec[1] / durationSec) : null;

  return (
    <div className="m3-workspace-root">
      {/* 1. CANLI AKOR & ÇOKLU ENSTRÜMAN DİYAGRAMI (Gitar / Piyano / Ukulele) */}
      <section aria-label="Canlı Akor ve Enstrüman Diyagramı" className="m3-hero-grid">
        {/* Sol: Önceki -> ŞU ANKİ -> Sıradaki Bar */}
        <div
          className="m3-surface-card m3-chord-flow-card"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}
        >
          <md-elevation></md-elevation>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div className="m3-chord-stage-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="m3-tonal-badge primary">
                {displayedSection?.name || t.sectionFallback}
              </span>
              <span
                className="md-typescale-label-large m3-chord-stage-bar-label"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.barLabel} {activeBar?.barNumber || 1} ·{' '}
                <span className="m3-desktop-bar-time">
                  {formatDurationSec(activeBar?.startSec || 0)}
                </span>
                <span className="m3-mobile-song-time">
                  <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                    {formatDurationSec(currentTimeSec)}
                  </strong>{' '}
                  / {formatDurationSec(durationSec)}
                </span>
              </span>
            </div>

            <div className="m3-beat-dots">
              {[1, 2, 3, 4].map((beat) => {
                const isBeatActive = activeBeatInBar === beat;
                const cls = isBeatActive
                  ? beat === 1
                    ? 'm3-beat-dot active-downbeat'
                    : 'm3-beat-dot active-beat'
                  : 'm3-beat-dot';
                return (
                  <div key={beat} className={cls}>
                    {beat}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="m3-chord-flow-grid">
            <div className="m3-chord-box">
              <span
                className="md-typescale-label-small"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.prevChord} {prevBar ? `#${prevBar.barNumber}` : ''}
              </span>
              <span className="md-typescale-headline-small" style={{ marginTop: '4px' }}>
                {prevChordDisplay}
              </span>
            </div>

            <div className="m3-chord-box active">
              <span className="md-typescale-label-medium">
                {t.currentChord} · {t.barLabel} {activeBar?.barNumber || 1}
              </span>
              <div
                className="md-typescale-display-medium"
                style={{ color: 'var(--md-sys-color-primary)', margin: '4px 0' }}
              >
                {activeChordDisplay}
              </div>
            </div>

            <div className="m3-chord-box next">
              <span className="md-typescale-label-small">
                {t.nextChord} {nextBar ? `#${nextBar.barNumber}` : ''}
              </span>
              <span className="md-typescale-headline-small" style={{ marginTop: '4px' }}>
                {nextChordDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Sağ: Enstrüman Akor Diyagramları */}
        <div
          className="m3-surface-card m3-diagram-stage-card"
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}
        >
          <md-elevation></md-elevation>

          {/* Mobil Durum Başlığı: Bölüm + Bar · Canlı Süre / Toplam Süre + 1-2-3-4 Beat Noktaları */}
          <div className="m3-mobile-diagram-status-row">
            <div className="m3-chord-stage-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="m3-tonal-badge primary">
                {displayedSection?.name || t.sectionFallback}
              </span>
              <span
                className="md-typescale-label-large m3-chord-stage-bar-label"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.barLabel} {activeBar?.barNumber || 1} ·{' '}
                <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                  {formatDurationSec(currentTimeSec)}
                </strong>{' '}
                / {formatDurationSec(durationSec)}
              </span>
            </div>

            <div className="m3-beat-dots">
              {[1, 2, 3, 4].map((beat) => {
                const isBeatActive = activeBeatInBar === beat;
                const cls = isBeatActive
                  ? beat === 1
                    ? 'm3-beat-dot active-downbeat'
                    : 'm3-beat-dot active-beat'
                  : 'm3-beat-dot';
                return (
                  <div key={beat} className={cls}>
                    {beat}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="m3-diagram-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <InstrumentIcon instrument={instrument} size={18} />
              </md-icon>
              <span className="md-typescale-title-small">
                {instT[instrument].name} {t.diagramHeaderSuffix}
              </span>
            </div>
            {capo > 0 && instrument !== 'piano' && (
              <span className="m3-tonal-badge secondary">{t.capoBadge} {capo}</span>
            )}
          </div>

          <div className="m3-diagram-pair">
            <InstrumentChordDiagram
              chordSymbol={activeChordDisplay}
              instrument={instrument}
              language={language}
              capo={capo}
              size="sm"
              labelBadge={t.activeDiagramRole}
              highlighted={true}
            />
            <InstrumentChordDiagram
              chordSymbol={nextBar ? nextChordDisplay : activeChordDisplay}
              instrument={instrument}
              language={language}
              capo={capo}
              size="sm"
              labelBadge={t.nextDiagramRole}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* MOBİL WAVEFORM: Akor diyagramları ile şarkı bölüm sekmeleri arasında */}
      <div className="m3-mobile-mid-waveform">
        <div
          ref={waveformRef}
          onClick={handleWaveformClick}
          role="slider"
          aria-label={dockerT.waveformAria}
          aria-valuemin={0}
          aria-valuemax={Math.round(durationSec)}
          aria-valuenow={Math.round(currentTimeSec)}
          tabIndex={0}
          className="m3-waveform-track"
        >
          {loopStartRatio !== null && loopEndRatio !== null && (
            <div
              className="m3-waveform-loop-overlay"
              style={{
                left: `${loopStartRatio * 100}%`,
                width: `${Math.max(1, (loopEndRatio - loopStartRatio) * 100)}%`
              }}
            />
          )}

          <div className="m3-waveform-bars">
            {waveformPeaks.map((peak, idx) => {
              const barRatio = idx / Math.max(1, waveformPeaks.length - 1);
              const isPlayed = barRatio <= progressRatio;
              const heightPct = Math.max(20, Math.min(92, Math.round(peak * 92)));
              return (
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    height: `${heightPct}%`,
                    borderRadius: '999px',
                    backgroundColor: isPlayed
                      ? 'var(--md-sys-color-primary)'
                      : 'var(--md-sys-color-outline-variant)'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. BİRLEŞTİRİLMİŞ ŞARKI BÖLÜMLERİ (<md-chip-set>) + AKTİF BÖLÜM COMPACT AKOR IZGARASI */}
      <section aria-label={t.sectionsAria} className="m3-unified-section-card">
        <md-elevation></md-elevation>

        {/* Üst Şerit: Resmi Google <md-tabs> & <md-primary-tab> Tek Satır Yatay Otomatik Ortalanan & Sürüklenebilir Sekme Çubuğu */}
        <div
          ref={sectionTabsBarRef}
          className="m3-section-tabs-bar"
          onMouseDown={handleTabsMouseDown}
          onMouseMove={handleTabsMouseMove}
          onMouseUp={handleTabsMouseUpOrLeave}
          onMouseLeave={handleTabsMouseUpOrLeave}
        >
          <md-tabs
            aria-label={t.sectionsAria}
            className="m3-section-md-tabs"
          >
            {sections.map((sec) => {
              const isSelected = displayedSection?.id === sec.id;
              const isSectionLooped =
                isLoopActive &&
                (customBarLoopRange !== null
                  ? customBarLoopRange[0] <= sec.endBar && customBarLoopRange[1] >= sec.startBar
                  : loopedSection?.id === sec.id);

              return (
                <md-primary-tab
                  key={sec.id}
                  ref={(el: HTMLElement | null) => {
                    if (isSelected) {
                      activeSectionTabRef.current = el;
                    }
                  }}
                  active={isSelected || undefined}
                  data-looped={isSectionLooped ? 'true' : 'false'}
                  onClick={(e: React.MouseEvent) => {
                    if (tabDragStateRef.current.hasDragged) {
                      e.preventDefault();
                      e.stopPropagation();
                      tabDragStateRef.current.hasDragged = false;
                      return;
                    }
                    onSelectSection(sec);
                  }}
                >
                  <span>{sec.name}</span>
                  <span
                    className="md-typescale-label-small m3-section-tab-bars"
                    style={{
                      opacity: 0.75,
                      marginLeft: '6px',
                      fontWeight: 400
                    }}
                  >
                    {sec.startBar}–{sec.endBar}
                  </span>
                </md-primary-tab>
              );
            })}
          </md-tabs>
        </div>

        {/* Alt Gövde: Maksimum 2 Satır Görünür, Mevcut Satır Üstte + Sonraki Satır Altta Otomatik Kayan Kompakt 12-Sütunlu Bar Izgarası */}
        <div ref={barGridScrollRef} className="m3-bar-grid">
          {sectionBars.map((bar) => {
            const isCurrentBar = activeBar?.barNumber === bar.barNumber;
            const isNextBar = nextBar?.barNumber === bar.barNumber;
            const isInCustomLoop =
              customBarLoopRange !== null &&
              bar.barNumber >= customBarLoopRange[0] &&
              bar.barNumber <= customBarLoopRange[1];

            const chordLabel = transposeChord(
              bar.chord,
              transposeSemitones,
              chordComplexity
            );

            const barProgressPct = isCurrentBar
              ? Math.min(
                  100,
                  Math.max(
                    0,
                    ((currentTimeSec - bar.startSec) / Math.max(0.1, bar.durationSec)) * 100
                  )
                )
              : 0;

            const isInSectionLoop =
              isLoopActive &&
              customBarLoopRange === null &&
              loopedSection !== undefined &&
              bar.barNumber >= loopedSection.startBar &&
              bar.barNumber <= loopedSection.endBar;

            const isBarLooped = isInCustomLoop || isInSectionLoop;

            const cellClass = [
              'm3-bar-cell',
              isBarLooped ? 'is-looped' : '',
              isCurrentBar ? 'is-current' : '',
              !isCurrentBar && isNextBar ? 'is-next' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={bar.barNumber}
                ref={isCurrentBar ? activeBarCellRef : undefined}
                role="button"
                tabIndex={0}
                onClick={(e) => handleBarClick(bar, e)}
                className={cellClass}
              >
                <md-ripple></md-ripple>
                {isCurrentBar && (
                  <div
                    className="m3-bar-progress-fill"
                    style={{ width: `${barProgressPct}%` }}
                  />
                )}

                <span className="md-typescale-title-medium">{chordLabel}</span>
                <span className="md-typescale-label-small" style={{ opacity: 0.65 }}>
                  #{bar.barNumber}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
