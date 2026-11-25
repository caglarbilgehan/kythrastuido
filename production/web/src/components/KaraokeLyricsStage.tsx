import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppLanguage,
  LyricLineItem,
  LyricRevisionItem,
  LyricsSourceType,
  SongSection
} from '../types/studio';
import { formatDurationSec } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchLyricRevisions, saveSongLyricsEdit } from '../api/studioApi';

interface KaraokeLyricsStageProps {
  language: AppLanguage;
  trackKey: string;
  sections: SongSection[];
  lyrics: LyricLineItem[];
  lyricsSource?: LyricsSourceType;
  lyricsLocked?: boolean;
  lyricsVersion?: number;
  lyricsUpdatedBy?: string | null;
  currentTimeSec: number;
  onSeekSec?: (sec: number) => void;
  onLyricsUpdated?: (
    nextLyrics: LyricLineItem[],
    nextVersion: number,
    updatedBy: string
  ) => void;
}

export const KaraokeLyricsStage: React.FC<KaraokeLyricsStageProps> = ({
  language,
  trackKey,
  sections,
  lyrics,
  lyricsSource = 'none',
  lyricsLocked = false,
  lyricsVersion = 1,
  lyricsUpdatedBy = null,
  currentTimeSec,
  onSeekSec,
  onLyricsUpdated
}) => {
  const t = TRANSLATIONS[language].karaoke;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const windowFirstRef = useRef<HTMLDivElement>(null);
  const windowSecondRef = useRef<HTMLDivElement>(null);
  const windowThirdRef = useRef<HTMLDivElement>(null);

  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draftLines, setDraftLines] = useState<LyricLineItem[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [revisions, setRevisions] = useState<LyricRevisionItem[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (sections.length > 0 && !sections.some((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(sections[0].id);
    }
  }, [sections, selectedSectionId]);

  const activeLineIndex = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return -1;
    if (currentTimeSec < lyrics[0].startSec) {
      return 0;
    }
    let foundIdx = 0;
    for (let i = 0; i < lyrics.length; i++) {
      if (currentTimeSec >= lyrics[i].startSec) {
        foundIdx = i;
      } else {
        break;
      }
    }
    return foundIdx;
  }, [lyrics, currentTimeSec]);

  const windowStartIdx = useMemo(() => {
    if (!lyrics || lyrics.length === 0) return 0;
    const maxStart = Math.max(0, lyrics.length - 3);
    return activeLineIndex <= 0 ? 0 : Math.min(maxStart, activeLineIndex - 1);
  }, [lyrics, activeLineIndex]);

  // Auto-scroll the 3-line viewport (Previous -> Current -> Next) and resize dynamically for wrapped lyrics!
  useEffect(() => {
    const measureAndScroll = () => {
      const container = scrollContainerRef.current;
      const firstEl = windowFirstRef.current;
      if (!container || !firstEl || isEditorOpen) return;

      const els = [
        windowFirstRef.current,
        windowSecondRef.current,
        windowThirdRef.current
      ].filter((el): el is HTMLDivElement => Boolean(el));

      const cs = window.getComputedStyle(container);
      const padTop = parseFloat(cs.paddingTop) || 8;
      const padBottom = parseFloat(cs.paddingBottom) || 8;
      const rowGap = parseFloat(cs.rowGap || cs.gap) || 6;

      const totalHeight =
        els.reduce((acc, el) => acc + el.offsetHeight, 0) +
        rowGap * Math.max(0, els.length - 1) +
        padTop +
        padBottom;

      setViewportHeight((prev) => {
        const nextH = Math.max(56, Math.ceil(totalHeight));
        return prev === nextH ? prev : nextH;
      });

      const targetTop = Math.max(0, firstEl.offsetTop - padTop);
      if (Math.abs(container.scrollTop - targetTop) > 3) {
        container.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    };

    const rafId = requestAnimationFrame(measureAndScroll);
    window.addEventListener('resize', measureAndScroll);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', measureAndScroll);
    };
  }, [activeLineIndex, windowStartIdx, lyrics, isEditorOpen]);

  const isOfficialLocked = Boolean(lyricsLocked && lyricsSource === 'lrclib' && lyrics.length > 0);

  const handleOpenEditor = () => {
    if (isOfficialLocked) return;
    const initial = lyrics.map((l) => ({ ...l }));
    setDraftLines(initial);
    const currentSec =
      sections.find((s) => currentTimeSec >= s.startSec && currentTimeSec <= s.endSec) ||
      sections[0];
    if (currentSec) {
      setSelectedSectionId(currentSec.id);
    }
    setIsEditorOpen(true);
    setSaveError(null);
    fetchLyricRevisions(trackKey).then(setRevisions);
  };

  const selectedSection = sections.find((s) => s.id === selectedSectionId) || sections[0];

  const handleAddLineAtCurrentTime = () => {
    const startSec = Number(currentTimeSec.toFixed(2));
    const endSec = Number((startSec + 4.0).toFixed(2));
    setDraftLines((prev) => {
      const next = [...prev, { startSec, endSec, text: '' }];
      next.sort((a, b) => a.startSec - b.startSec);
      return next;
    });
  };

  const handleAddLineToSection = (sec: SongSection) => {
    const sectionLines = draftLines.filter(
      (l) => l.startSec >= sec.startSec - 0.1 && l.startSec <= sec.endSec + 0.1
    );
    const lastLine = sectionLines[sectionLines.length - 1];
    const startSec = lastLine
      ? Number(Math.min(sec.endSec - 0.5, lastLine.startSec + 3.5).toFixed(2))
      : Number(sec.startSec.toFixed(2));
    const endSec = Number(Math.min(sec.endSec, startSec + 3.5).toFixed(2));
    setDraftLines((prev) => {
      const next = [...prev, { startSec, endSec, text: '' }];
      next.sort((a, b) => a.startSec - b.startSec);
      return next;
    });
  };

  const handleStampLineToCurrentTime = (index: number) => {
    const stamped = Number(currentTimeSec.toFixed(2));
    setDraftLines((prev) => {
      const copy = prev.map((l, idx) =>
        idx === index
          ? {
              ...l,
              startSec: stamped,
              endSec: Math.max(stamped + 2.5, l.endSec)
            }
          : l
      );
      copy.sort((a, b) => a.startSec - b.startSec);
      return copy;
    });
  };

  const handleSaveLyrics = async () => {
    const cleaned = draftLines
      .map((l) => ({
        startSec: Number(l.startSec),
        endSec: Number(Math.max(l.startSec + 0.8, l.endSec)),
        text: l.text.trim()
      }))
      .filter((l) => l.text.length > 0)
      .sort((a, b) => a.startSec - b.startSec);

    // Automatically chain endSec to next line's startSec for smooth karaoke progress fill
    for (let i = 0; i < cleaned.length - 1; i++) {
      cleaned[i].endSec = Number(Math.max(cleaned[i].startSec + 0.5, cleaned[i + 1].startSec).toFixed(2));
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await saveSongLyricsEdit(trackKey, cleaned);
      onLyricsUpdated?.(cleaned, res.lyrics_version, res.lyrics_updated_by);
      setRevisions(res.revisions || []);
      setIsEditorOpen(false);
    } catch (err: any) {
      setSaveError(err?.message || 'Could not save lyrics.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section aria-label={t.ariaLabel} className="m3-karaoke-card">
      <md-elevation></md-elevation>

      {/* Top Mini Toolbar inside Lyrics Card: Only shown when lyrics are NOT locked by verified LRCLIB */}
      {!isOfficialLocked && (
        <div className="m3-karaoke-header-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <md-icon style={{ fontSize: '16px', color: 'var(--md-sys-color-primary)' }}>
              lyrics
            </md-icon>
            <span className="md-typescale-label-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
              {t.versionBadge(lyricsVersion, lyricsUpdatedBy)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => (isEditorOpen ? setIsEditorOpen(false) : handleOpenEditor())}
              className="m3-karaoke-edit-pill"
            >
              <md-icon style={{ fontSize: '14px' }}>{isEditorOpen ? 'close' : 'edit_note'}</md-icon>
              <span>
                {isEditorOpen
                  ? t.cancelBtn
                  : lyrics.length > 0
                  ? t.editLyricsBtn
                  : t.addLyricsBtn}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION-BASED LIVE LYRIC EDITOR PANEL */}
      {isEditorOpen && !isOfficialLocked && (
        <div className="m3-lyric-editor-panel">
          <div className="m3-lyric-editor-top">
            <span className="md-typescale-title-small">{t.editorTitle}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="m3-mini-action-pill"
                onClick={() => {
                  setShowRevisions((v) => !v);
                  fetchLyricRevisions(trackKey).then(setRevisions);
                }}
              >
                <md-icon style={{ fontSize: '14px' }}>history</md-icon>
                <span>{t.revisionsTitle} ({revisions.length})</span>
              </button>
              <button
                type="button"
                className="m3-mini-action-pill primary"
                onClick={handleAddLineAtCurrentTime}
              >
                <md-icon style={{ fontSize: '14px' }}>add_circle</md-icon>
                <span>{t.addLineAtCurrentTime(formatDurationSec(currentTimeSec))}</span>
              </button>
            </div>
          </div>

          {/* Section Filter Chips so user can jump & add lines per Song Section (Intro, Verse A, Chorus 1...) */}
          {sections.length > 0 && (
            <div className="m3-lyric-editor-sections">
              {sections.map((sec) => {
                const isSecSelected = selectedSection?.id === sec.id;
                const countInSec = draftLines.filter(
                  (l) => l.startSec >= sec.startSec - 0.2 && l.startSec < sec.endSec + 0.2
                ).length;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    className={`m3-account-seg-btn ${isSecSelected ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedSectionId(sec.id);
                      onSeekSec?.(sec.startSec);
                    }}
                  >
                    {sec.name} ({countInSec})
                  </button>
                );
              })}

              {selectedSection && (
                <button
                  type="button"
                  className="m3-mini-action-pill"
                  onClick={() => handleAddLineToSection(selectedSection)}
                >
                  {t.addLineToSection(selectedSection.name)}
                </button>
              )}
            </div>
          )}

          {saveError && (
            <div
              className="md-typescale-label-medium"
              style={{
                backgroundColor: 'var(--md-sys-color-error-container)',
                color: 'var(--md-sys-color-on-error-container)',
                padding: '8px 12px',
                borderRadius: '10px'
              }}
            >
              {saveError}
            </div>
          )}

          {/* Editable Lines List */}
          <div className="m3-lyric-editor-rows">
            {draftLines.map((line, idx) => {
              const secForLine = sections.find(
                (s) => line.startSec >= s.startSec - 0.2 && line.startSec <= s.endSec + 0.2
              );
              return (
                <div key={idx} className="m3-lyric-edit-row">
                  <div className="m3-lyric-edit-meta">
                    <button
                      type="button"
                      className="m3-lyric-stamp-btn"
                      title={t.stampCurrentTime}
                      onClick={() => handleStampLineToCurrentTime(idx)}
                    >
                      <md-icon style={{ fontSize: '14px' }}>timer</md-icon>
                      <span>{formatDurationSec(line.startSec)}</span>
                    </button>

                    {secForLine && (
                      <span className="m3-lyric-sec-tag">{secForLine.name}</span>
                    )}
                  </div>

                  <input
                    type="text"
                    value={line.text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDraftLines((prev) =>
                        prev.map((item, i) => (i === idx ? { ...item, text: val } : item))
                      );
                    }}
                    placeholder={t.linePlaceholder}
                    className="m3-clean-text-input m3-lyric-edit-input"
                    style={{ flex: 1 }}
                  />

                  <button
                    type="button"
                    className="m3-playlist-remove-btn"
                    onClick={() =>
                      setDraftLines((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Revision Audit Log Drawer */}
          {showRevisions && (
            <div className="m3-lyric-revisions-box">
              <div className="md-typescale-label-medium" style={{ marginBottom: '6px' }}>
                {t.revisionsTitle}
              </div>
              {revisions.length === 0 ? (
                <div className="md-typescale-body-small" style={{ color: 'var(--md-sys-color-on-surface-variant)' }}>
                  {t.noRevisionsYet}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {revisions.map((rev) => (
                    <div key={rev.id} className="m3-lyric-rev-item">
                      <strong>v{rev.version_num}</strong> · {rev.username} ·{' '}
                      <span style={{ opacity: 0.8 }}>{rev.change_summary}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <md-text-button onClick={() => setIsEditorOpen(false)}>
              {t.cancelBtn}
            </md-text-button>
            <md-filled-button
              disabled={isSaving || undefined}
              onClick={handleSaveLyrics}
            >
              {t.saveLyricsBtn}
            </md-filled-button>
          </div>
        </div>
      )}

      {/* 2-Row Auto-Scrolling Karaoke Viewport (Top row: Current Lyric, Bottom row: Next Lyric) */}
      {!lyrics || lyrics.length === 0 ? (
        <div className="m3-karaoke-empty-row" style={{ padding: '12px 16px' }}>
          <span className="md-typescale-body-medium">
            {t.emptyLyrics}
          </span>
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          className="m3-karaoke-scroll-viewport"
          style={viewportHeight ? { maxHeight: `${viewportHeight}px` } : undefined}
        >
          {lyrics.map((line, idx) => {
            const isCurrent = idx === activeLineIndex;
            const isNext = idx === activeLineIndex + 1;
            const isBeforeFirstVocal =
              idx === 0 && currentTimeSec < line.startSec - 0.5;
            const remainingIntroSec = isBeforeFirstVocal
              ? Math.max(1, Math.ceil(line.startSec - currentTimeSec))
              : 0;

            const lineDuration = Math.max(0.4, line.endSec - line.startSec);
            const progressPct = isCurrent
              ? Math.min(
                  100,
                  Math.max(0, ((currentTimeSec - line.startSec) / lineDuration) * 100)
                )
              : idx < activeLineIndex
              ? 100
              : 0;

            const rowClass = [
              'm3-karaoke-line',
              isCurrent ? 'is-current' : '',
              isNext ? 'is-next' : '',
              idx < activeLineIndex ? 'is-past' : ''
            ]
              .filter(Boolean)
              .join(' ');

            const displayText =
              line.text.includes('Enstrümantal') || line.text.includes('Instrumental')
                ? t.instrumentalIntro
                : line.text;

            const rowRef =
              idx === windowStartIdx
                ? windowFirstRef
                : idx === windowStartIdx + 1
                ? windowSecondRef
                : idx === windowStartIdx + 2
                ? windowThirdRef
                : undefined;

            return (
              <div
                key={`${line.startSec}-${idx}`}
                ref={rowRef}
                role="button"
                tabIndex={0}
                onClick={() => onSeekSec && onSeekSec(line.startSec)}
                title={t.seekTooltip(formatDurationSec(line.startSec))}
                className={rowClass}
              >
                <md-ripple></md-ripple>

                {/* Left Status / Countdown / Timestamp Pill */}
                <div className="m3-karaoke-line-meta">
                  {isCurrent ? (
                    <span className="m3-karaoke-badge active">
                      <md-icon style={{ fontSize: '15px' }}>
                        {isBeforeFirstVocal ? 'timer' : 'mic'}
                      </md-icon>
                      <span>
                        {isBeforeFirstVocal
                          ? t.vocalCountdown(formatDurationSec(remainingIntroSec))
                          : t.nowBadge}
                      </span>
                    </span>
                  ) : isNext ? (
                    <span className="m3-karaoke-badge next">{t.nextBadge}</span>
                  ) : (
                    <span className="m3-karaoke-time">{formatDurationSec(line.startSec)}</span>
                  )}
                </div>

                {/* Center Karaoke Lyric Text (Word-Level Highlight when MMS_FA word bounds exist) */}
                <div className="m3-karaoke-line-text">
                  {isCurrent && !isBeforeFirstVocal && line.words && line.words.length > 0 ? (
                    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.28em' }}>
                      {line.words.map((w, wIdx) => {
                        const isWordActive =
                          currentTimeSec >= w.startSec && currentTimeSec <= w.endSec;
                        const isWordSung = currentTimeSec > w.endSec;
                        return (
                          <span
                            key={`${wIdx}-${w.startSec}`}
                            style={{
                              color: isWordActive
                                ? 'var(--md-sys-color-primary)'
                                : isWordSung
                                ? 'var(--md-sys-color-on-surface)'
                                : 'var(--md-sys-color-on-surface-variant)',
                              fontWeight: isWordActive ? 700 : isWordSung ? 600 : 500,
                              opacity: isWordActive || isWordSung ? 1 : 0.65,
                              transition: 'color 80ms linear, opacity 80ms linear'
                            }}
                          >
                            {w.word}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    displayText
                  )}
                </div>

                {/* Bottom Karaoke Progress Fill inside active line */}
                {isCurrent && !isBeforeFirstVocal && (
                  <div
                    className="m3-karaoke-progress-bar"
                    style={{ width: `${progressPct}%` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
