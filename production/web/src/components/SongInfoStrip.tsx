import React, { useEffect, useRef, useState } from 'react';
import {
  AppLanguage,
  ChordComplexityMode,
  DockerPopoverId,
  InstrumentType,
  SongSection,
  StudioSong
} from '../types/studio';
import { transposeKeySignature } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';
import { InstrumentIcon, MetronomeIcon, MixerIcon } from './icons';

interface SongInfoStripProps {
  song: StudioSong;
  language: AppLanguage;
  instrument: InstrumentType;
  transposeSemitones: number;
  capo: number;
  playbackSpeed: number;
  chordComplexity: ChordComplexityMode;
  currentTimeSec: number;
  durationSec: number;
  loopRangeSec?: [number, number] | null;
  activeSection?: SongSection;
  isLoopActive: boolean;
  isMetronomeActive: boolean;
  isMasterMuted: boolean;
  customBarLoopRange: [number, number] | null;
  openPopover: DockerPopoverId;
  onSeekSec?: (sec: number) => void;
  onToggleLoop: () => void;
  onToggleMetronome: () => void;
  onToggleMasterMute: () => void;
  onSetOpenPopover: (id: DockerPopoverId) => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
  initialEditingTitle?: boolean;
  initialConfirmDelete?: boolean;
}

export const SongInfoStrip: React.FC<SongInfoStripProps> = ({
  song,
  language,
  instrument,
  transposeSemitones,
  capo,
  playbackSpeed,
  currentTimeSec,
  durationSec,
  loopRangeSec,
  activeSection,
  isLoopActive,
  isMetronomeActive,
  isMasterMuted,
  customBarLoopRange,
  openPopover,
  onSeekSec,
  onToggleLoop,
  onToggleMetronome,
  onToggleMasterMute,
  onSetOpenPopover,
  isFavorite = false,
  onToggleFavorite,
  onRenameTrack,
  onDeleteTrack,
  initialEditingTitle = false,
  initialConfirmDelete = false
}) => {
  const t = TRANSLATIONS[language].infoStrip;
  const hT = TRANSLATIONS[language].header;
  const dockerT = TRANSLATIONS[language].docker;
  const wsT = TRANSLATIONS[language].workspace;
  const formattedKey = transposeKeySignature(song.keySignature, transposeSemitones, language);
  const waveformRef = useRef<HTMLDivElement>(null);

  const [isEditingTitle, setIsEditingTitle] = useState(initialEditingTitle);
  const [titleDraft, setTitleDraft] = useState(song.title);
  const [isConfirmDelete, setIsConfirmDelete] = useState(initialConfirmDelete);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setIsEditingTitle(initialEditingTitle);
    setIsConfirmDelete(initialConfirmDelete);
    setTitleDraft(song.title);
  }, [song.trackKey, song.title, initialEditingTitle, initialConfirmDelete]);

  const submitRename = async () => {
    const clean = titleDraft.trim();
    if (!clean || !onRenameTrack || clean === song.title) {
      setIsEditingTitle(false);
      setTitleDraft(song.title);
      return;
    }
    setIsMutating(true);
    try {
      await onRenameTrack(song.trackKey, clean);
      setIsEditingTitle(false);
    } finally {
      setIsMutating(false);
    }
  };

  const submitDelete = async () => {
    if (!onDeleteTrack) return;
    setIsMutating(true);
    try {
      await onDeleteTrack(song.trackKey);
    } finally {
      setIsMutating(false);
      setIsConfirmDelete(false);
    }
  };

  const togglePopover = (id: DockerPopoverId) => {
    onSetOpenPopover(openPopover === id ? null : id);
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
    <section aria-label={t.ariaLabel} className="m3-info-strip">
      <md-elevation></md-elevation>

      {/* Masaüstü Üst Satır: Favori Yıldız + Şarkı Başlığı | 4/4 · BPM · Ton */}
      <div className="m3-info-top-row">
        <div className="m3-info-left">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              title={t.favoriteTooltip}
              aria-label={t.favoriteTooltip}
              className={`m3-fav-star-btn ${isFavorite ? 'is-fav' : ''}`}
            >
              <md-icon style={{ fontSize: '20px' }}>{isFavorite ? 'star' : 'star_outline'}</md-icon>
            </button>
          )}
          {isEditingTitle ? (
            <div className="m3-inline-rename-row">
              <input
                type="text"
                value={titleDraft}
                autoFocus
                disabled={isMutating}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitRename();
                  if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                    setTitleDraft(song.title);
                  }
                }}
                placeholder={hT.trackTitlePlaceholder}
                className="m3-inline-rename-input"
              />
              <md-icon-button
                aria-label={hT.saveTitleBtn}
                title={hT.saveTitleBtn}
                disabled={isMutating || undefined}
                onClick={submitRename}
              >
                <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
              </md-icon-button>
              <md-icon-button
                aria-label={hT.cancelActionBtn}
                title={hT.cancelActionBtn}
                disabled={isMutating || undefined}
                onClick={() => {
                  setIsEditingTitle(false);
                  setTitleDraft(song.title);
                }}
              >
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
          ) : (
            <div className="m3-info-title-actions-wrap">
              <span className="md-typescale-title-medium m3-info-song-title" title={song.title}>
                {song.title}
              </span>
              {song.trackKey && (onRenameTrack || onDeleteTrack) && (
                <div className="m3-track-row-actions">
                  {onRenameTrack && (
                    <md-icon-button
                      aria-label={hT.renameTrackTooltip}
                      title={hT.renameTrackTooltip}
                      disabled={isMutating || undefined}
                      onClick={() => {
                        setIsConfirmDelete(false);
                        setTitleDraft(song.title);
                        setIsEditingTitle(true);
                      }}
                    >
                      <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                    </md-icon-button>
                  )}
                  {onDeleteTrack && (
                    isConfirmDelete ? (
                      <div className="m3-inline-delete-confirm">
                        <button
                          type="button"
                          disabled={isMutating}
                          className="m3-inline-delete-btn"
                          onClick={submitDelete}
                        >
                          {hT.confirmDeleteBtn}
                        </button>
                        <button
                          type="button"
                          disabled={isMutating}
                          className="m3-inline-cancel-btn"
                          onClick={() => setIsConfirmDelete(false)}
                        >
                          {hT.cancelActionBtn}
                        </button>
                      </div>
                    ) : (
                      <md-icon-button
                        aria-label={hT.deleteTrackTooltip}
                        title={hT.deleteTrackTooltip}
                        disabled={isMutating || undefined}
                        onClick={() => setIsConfirmDelete(true)}
                      >
                        <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                      </md-icon-button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="m3-info-right">
          <span className="m3-tonal-badge">
            {song.timeSignature}
          </span>
          <span className="m3-tonal-badge primary">
            <strong>{Math.round(song.tempoBpm)} BPM</strong>
          </span>
          <span className="m3-tonal-badge secondary">
            <strong>{formattedKey}</strong>
          </span>
        </div>
      </div>

      {/* Mobil Üst Araç Şeridi: Sol [Enstrüman + Adı, Mikser, Sessize Al] | Sağ [Döngü, Metronom, Ayarlar] */}
      <div className="m3-mobile-tools-strip">
        <div className="m3-top-tools-left">
          <md-filled-tonal-button
            data-role="mobile-instrument-pill"
            data-popover-trigger="true"
            data-active={openPopover === 'instrument' ? 'true' : 'false'}
            title={`${dockerT.instrumentBtnTitle}: ${dockerT.instruments[instrument].name}`}
            onClick={() => togglePopover('instrument')}
          >
            <md-icon slot="icon">
              <InstrumentIcon instrument={instrument} size={18} />
            </md-icon>
            <span>{dockerT.instruments[instrument].name}</span>
          </md-filled-tonal-button>

          <md-filled-tonal-icon-button
            data-role="mobile-tool"
            data-popover-trigger="true"
            data-active={openPopover === 'mixer' ? 'true' : 'false'}
            aria-label={dockerT.mixerBtnTitle}
            title={dockerT.mixerBtnTitle}
            onClick={() => togglePopover('mixer')}
          >
            <md-icon>
              <MixerIcon size={19} />
            </md-icon>
          </md-filled-tonal-icon-button>

          {isMasterMuted ? (
            <md-filled-icon-button
              data-master-mute="active"
              aria-label={dockerT.masterUnmuteTitle}
              title={dockerT.masterUnmuteTitle}
              onClick={onToggleMasterMute}
            >
              <md-icon>volume_off</md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-master-mute="inactive"
              aria-label={dockerT.masterMuteTitle}
              title={dockerT.masterMuteTitle}
              onClick={onToggleMasterMute}
            >
              <md-icon>volume_off</md-icon>
            </md-filled-tonal-icon-button>
          )}
        </div>

        <div className="m3-top-tools-right">
          {isLoopActive ? (
            <md-filled-icon-button
              data-loop="active"
              aria-label={dockerT.loopActive}
              title={
                customBarLoopRange
                  ? dockerT.loopBarsTooltip(customBarLoopRange[0], customBarLoopRange[1])
                  : dockerT.loopSectionTooltip(activeSection?.name || wsT.sectionFallback)
              }
              onClick={onToggleLoop}
            >
              <md-icon>repeat</md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-loop="inactive"
              aria-label="Loop"
              title={dockerT.loopToggleTooltip}
              onClick={onToggleLoop}
            >
              <md-icon>repeat</md-icon>
            </md-filled-tonal-icon-button>
          )}

          {isMetronomeActive ? (
            <md-filled-icon-button
              data-metronome="active"
              aria-label={dockerT.channels.metronome}
              title={dockerT.metronomeActiveTooltip}
              onClick={onToggleMetronome}
            >
              <md-icon>
                <MetronomeIcon size={19} />
              </md-icon>
            </md-filled-icon-button>
          ) : (
            <md-filled-tonal-icon-button
              data-metronome="inactive"
              aria-label={dockerT.channels.metronome}
              title={dockerT.metronomeInactiveTooltip}
              onClick={onToggleMetronome}
            >
              <md-icon>
                <MetronomeIcon size={19} />
              </md-icon>
            </md-filled-tonal-icon-button>
          )}

          <md-icon-button
            data-popover-trigger="true"
            aria-label={dockerT.settingsBtnTitle}
            title={dockerT.settingsBtnTitle}
            style={{
              color:
                openPopover === 'settings' ||
                transposeSemitones !== 0 ||
                capo > 0 ||
                Math.abs(playbackSpeed - 1.0) > 0.01
                  ? 'var(--md-sys-color-primary)'
                  : undefined,
            }}
            onClick={() => togglePopover('settings')}
          >
            <md-icon>settings</md-icon>
          </md-icon-button>
        </div>
      </div>

      {/* Mobil Waveform (Sadece <= 640px ve yatay telefon ekranlarında üst araçların altında/yanında görünür) */}
      <div className="m3-mobile-song-waveform">
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
            {song.waveformPeaks.map((peak, idx) => {
              const barRatio = idx / Math.max(1, song.waveformPeaks.length - 1);
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
    </section>
  );
};
