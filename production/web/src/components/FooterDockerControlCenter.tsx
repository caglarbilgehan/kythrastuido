import React, { useEffect, useRef } from 'react';
import {
  AppLanguage,
  ChordComplexityMode,
  DockerPopoverId,
  InstrumentType,
  MixPresetId,
  SongSection,
  StemChannelState,
  StemId
} from '../types/studio';
import { formatDurationSec, transposeKeySignature } from '../utils/musicTheory';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { InstrumentIcon, MetronomeIcon, MixerIcon } from './icons';

interface FooterDockerControlCenterProps {
  language: AppLanguage;
  songTitle: string;
  timeSignature: string;
  tempoBpm: number;
  keySignature: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isPlaying: boolean;
  currentTimeSec: number;
  durationSec: number;
  waveformPeaks: number[];
  sections: SongSection[];
  activeSection?: SongSection;
  activeBarNumber: number;
  totalBars: number;
  instrument: InstrumentType;
  playbackSpeed: number;
  transposeSemitones: number;
  capo: number;
  chordComplexity: ChordComplexityMode;
  autoFollowSection: boolean;
  isLoopActive: boolean;
  isMetronomeActive: boolean;
  isMasterMuted: boolean;
  loopRangeSec: [number, number] | null;
  customBarLoopRange: [number, number] | null;
  openPopover: DockerPopoverId;
  stage3Status: 'pending' | 'running' | 'completed' | 'error';
  channels: StemChannelState[];
  activePreset: MixPresetId;
  onChangeLanguage: (lang: AppLanguage) => void;
  onTogglePlay: () => void;
  onPrevBar: () => void;
  onSeekSec: (sec: number) => void;
  onToggleLoop: () => void;
  onToggleMetronome: () => void;
  onToggleMasterMute: () => void;
  onClearCustomBarLoop: () => void;
  onSetOpenPopover: (id: DockerPopoverId) => void;
  onChangeInstrument: (inst: InstrumentType) => void;
  onChangeSpeed: (speed: number) => void;
  onChangeTranspose: (semitones: number) => void;
  onChangeCapo: (capo: number) => void;
  onChangeChordComplexity: (mode: ChordComplexityMode) => void;
  onToggleAutoFollowSection: () => void;
  onSetChannelVolume: (id: StemId, volume: number) => void;
  onToggleChannelMute: (id: StemId) => void;
  onToggleChannelSolo: (id: StemId) => void;
  onResetChannels: () => void;
  onApplyMixPreset: (preset: MixPresetId) => void;
}

const SPEED_OPTIONS = [0.5, 0.75, 0.85, 1.0, 1.15, 1.25, 1.5];

export const FooterDockerControlCenter: React.FC<FooterDockerControlCenterProps> = ({
  language,
  songTitle,
  timeSignature,
  tempoBpm,
  keySignature,
  isFavorite = false,
  onToggleFavorite,
  isPlaying,
  currentTimeSec,
  durationSec,
  waveformPeaks,
  activeSection,
  instrument,
  playbackSpeed,
  transposeSemitones,
  capo,
  chordComplexity,
  isLoopActive,
  isMetronomeActive,
  isMasterMuted,
  loopRangeSec,
  customBarLoopRange,
  openPopover,
  stage3Status,
  channels,
  activePreset,
  onChangeLanguage,
  onTogglePlay,
  onPrevBar,
  onSeekSec,
  onToggleLoop,
  onToggleMetronome,
  onToggleMasterMute,
  onSetOpenPopover,
  onChangeInstrument,
  onChangeSpeed,
  onChangeTranspose,
  onChangeCapo,
  onChangeChordComplexity,
  onSetChannelVolume,
  onToggleChannelMute,
  onToggleChannelSolo,
  onResetChannels,
  onApplyMixPreset
}) => {
  const t = TRANSLATIONS[language].docker;
  const popT = t.popovers;
  const wsT = TRANSLATIONS[language].workspace;
  const infoT = TRANSLATIONS[language].infoStrip;
  const dockerRef = useRef<HTMLDivElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-popover-trigger="true"]')) return;
      if (dockerRef.current && !dockerRef.current.contains(target as Node)) {
        onSetOpenPopover(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [onSetOpenPopover]);

  const togglePopover = (id: DockerPopoverId) => {
    onSetOpenPopover(openPopover === id ? null : id);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!waveformRef.current || durationSec <= 0) return;
    const rect = waveformRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeekSec(ratio * durationSec);
  };

  const progressRatio = durationSec > 0 ? Math.min(1, Math.max(0, currentTimeSec / durationSec)) : 0;
  const loopStartRatio =
    loopRangeSec && durationSec > 0 ? Math.max(0, loopRangeSec[0] / durationSec) : null;
  const loopEndRatio =
    loopRangeSec && durationSec > 0 ? Math.min(1, loopRangeSec[1] / durationSec) : null;

  const detectedChannels = channels.filter((c) => c.detected !== false);

  return (
    <footer
      ref={dockerRef}
      aria-label={t.ariaLabel}
      className={`m3-footer-dock-outer ${openPopover ? 'has-open-card' : ''}`}
    >
      {openPopover && (
        <div
          className="m3-card-scrim"
          onClick={() => onSetOpenPopover(null)}
        />
      )}
      <div className="m3-footer-dock-inner">
        {/* =================================================================== */}
        {/* UPWARD POPOVER CARDS (100% @material/web Components)                */}
        {/* =================================================================== */}

        {/* 1. Enstrüman Seçimi Kartı (<md-list> & <md-list-item>) */}
        {openPopover === 'instrument' && (
          <div className="m3-upward-card instrument-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="md-typescale-title-small">{popT.instrumentTitle}</span>
              <md-icon-button onClick={() => onSetOpenPopover(null)}>
                <md-icon>close</md-icon>
              </md-icon-button>
            </div>
            <md-list>
              {(['guitar', 'piano', 'ukulele'] as InstrumentType[]).map((inst) => {
                const meta = t.instruments[inst];
                const isSelected = instrument === inst;
                return (
                  <md-list-item
                    key={inst}
                    type="button"
                    onClick={() => {
                      onChangeInstrument(inst);
                      onSetOpenPopover(null);
                    }}
                  >
                    <md-icon slot="start">
                      <InstrumentIcon instrument={inst} size={22} />
                    </md-icon>
                    <div slot="headline">{meta.name}</div>
                    <div slot="supporting-text">{meta.tuning}</div>
                    {isSelected && <md-icon slot="end">check</md-icon>}
                  </md-list-item>
                );
              })}
            </md-list>
          </div>
        )}

        {/* 2. Çalma Hızı Kartı (Tek Satır Yatay Kaydırılabilir Hap Butonlar) */}
        {openPopover === 'speed' && (
          <div className="m3-upward-card speed-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ fontSize: '20px', color: 'var(--md-sys-color-primary)' }}>
                  speed
                </md-icon>
                <span className="md-typescale-title-small">{popT.speedTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {Math.abs(playbackSpeed - 1.0) > 0.01 && (
                  <md-text-button onClick={() => onChangeSpeed(1.0)}>{popT.reset1x}</md-text-button>
                )}
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>
            <div className="m3-speed-pill-row">
              {SPEED_OPTIONS.map((spd) => (
                <button
                  key={spd}
                  type="button"
                  className={`m3-settings-pill-btn ${Math.abs(playbackSpeed - spd) < 0.01 ? 'is-active' : ''}`}
                  onClick={() => onChangeSpeed(spd)}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Stüdyo Mikseri Kartı (Resmi <md-slider> + Kompakt M/S Butonları, İzole Kelimesi Yok) */}
        {openPopover === 'mixer' && (
          <div className="m3-upward-card mixer-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ color: 'var(--md-sys-color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MixerIcon size={20} />
                </md-icon>
                <span className="md-typescale-title-small">
                  {popT.mixerTitle()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <md-text-button onClick={onResetChannels}>{popT.resetBtn}</md-text-button>
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>

            {stage3Status === 'running' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span className="md-typescale-body-small">
                  {popT.stage3RunningMsg}
                </span>
                <md-linear-progress indeterminate={true}></md-linear-progress>
              </div>
            )}

            <div className="m3-mixer-rows">
              {detectedChannels.map((ch) => {
                const effectiveVolPct = Math.round((ch.isMuted ? 0 : ch.volume) * 100);
                const standardChannelIds = ['guitar', 'vocals', 'bass', 'drums', 'piano', 'other'];
                const isLegacyOrDefaultLabel =
                  !ch.label ||
                  standardChannelIds.includes(ch.id) ||
                  /^(İzole|Kompozit)/i.test(ch.label);
                const channelName =
                  ch.category === 'metronome'
                    ? t.channels.metronome
                    : isLegacyOrDefaultLabel
                    ? t.channels[ch.category] || ch.label
                    : ch.label;
                const rowClass = [
                  'm3-mixer-row',
                  ch.isSolo ? 'is-solo' : '',
                  ch.isMuted ? 'is-muted' : ''
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <div key={ch.id} className={rowClass}>
                    <div className="m3-mixer-channel-name">
                      <md-icon style={{ color: ch.color, fontSize: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        {ch.category === 'guitar' ? (
                          <InstrumentIcon instrument="guitar" size={18} />
                        ) : ch.category === 'piano' ? (
                          <InstrumentIcon instrument="piano" size={18} />
                        ) : ch.category === 'metronome' ? (
                          <MetronomeIcon size={18} />
                        ) : (
                          ch.icon
                        )}
                      </md-icon>
                      <span className="md-typescale-label-large" title={channelName}>
                        {channelName}
                      </span>
                    </div>

                    <div className="m3-mixer-slider-wrap">
                      <md-slider
                        min={0}
                        max={100}
                        value={effectiveVolPct}
                        onInput={(e: any) => {
                          const val = Number(e.target?.value ?? effectiveVolPct);
                          onSetChannelVolume(ch.id, val / 100);
                        }}
                      ></md-slider>
                      <span className="m3-mixer-vol-pct">
                        %{effectiveVolPct}
                      </span>
                    </div>

                    <div className="m3-mixer-ms-group">
                      <div
                        role="button"
                        tabIndex={0}
                        title={popT.muteTooltip(channelName)}
                        onClick={() => onToggleChannelMute(ch.id)}
                        className={`m3-mixer-ms-btn ${ch.isMuted ? 'is-muted-active' : ''}`}
                      >
                        <md-ripple></md-ripple>
                        M
                      </div>

                      <div
                        role="button"
                        tabIndex={0}
                        title={popT.soloTooltip(channelName)}
                        onClick={() => onToggleChannelSolo(ch.id)}
                        className={`m3-mixer-ms-btn ${ch.isSolo ? 'is-solo-active' : ''}`}
                      >
                        <md-ripple></md-ripple>
                        S
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. Stüdyo Ayarları Kartı (Satır Satır Tek Satır: Transpoze + Capo + Akor + Hızlı Miks + Dil) */}
        {openPopover === 'settings' && (
          <div className="m3-upward-card settings-card">
            <md-elevation></md-elevation>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <md-icon style={{ fontSize: '20px', color: 'var(--md-sys-color-primary)' }}>
                  settings
                </md-icon>
                <span className="md-typescale-title-small">{popT.settingsTitle}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {(transposeSemitones !== 0 || capo > 0 || Math.abs(playbackSpeed - 1.0) > 0.01) && (
                  <md-text-button
                    onClick={() => {
                      onChangeTranspose(0);
                      onChangeCapo(0);
                      onChangeSpeed(1.0);
                    }}
                  >
                    {popT.resetBtn}
                  </md-text-button>
                )}
                <md-icon-button onClick={() => onSetOpenPopover(null)}>
                  <md-icon>close</md-icon>
                </md-icon-button>
              </div>
            </div>

            <div className="m3-settings-rows">
              {/* Mobil Özel Satır: Çalma Hızı */}
              <div className="m3-settings-row m3-mobile-only-settings-row">
                <span className="m3-settings-row-label">{t.speedBtnTitle}</span>
                <div className="m3-settings-row-controls">
                  {SPEED_OPTIONS.map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      className={`m3-settings-pill-btn ${Math.abs(playbackSpeed - spd) < 0.01 ? 'is-active' : ''}`}
                      onClick={() => onChangeSpeed(spd)}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Satır 1: Transpoze */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{t.transposeBtnLabel}</span>
                <div className="m3-settings-row-controls">
                  <div className="m3-settings-stepper">
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={transposeSemitones <= -6}
                      onClick={() => onChangeTranspose(Math.max(-6, transposeSemitones - 1))}
                      aria-label={`${t.transposeBtnLabel} -1`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="m3-settings-value-pill"
                      data-active={transposeSemitones !== 0 ? 'true' : 'false'}
                      title={popT.resetBtn}
                      onClick={() => onChangeTranspose(0)}
                    >
                      {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones} ST
                    </button>
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={transposeSemitones >= 6}
                      onClick={() => onChangeTranspose(Math.min(6, transposeSemitones + 1))}
                      aria-label={`${t.transposeBtnLabel} +1`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Satır 2: Capo */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{wsT.capoBadge}</span>
                <div className="m3-settings-row-controls">
                  <div className="m3-settings-stepper">
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={capo <= 0}
                      onClick={() => onChangeCapo(Math.max(0, capo - 1))}
                      aria-label={`${wsT.capoBadge} -1`}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      className="m3-settings-value-pill"
                      data-active={capo > 0 ? 'true' : 'false'}
                      title={popT.resetBtn}
                      onClick={() => onChangeCapo(0)}
                    >
                      {capo === 0 ? popT.capoNone : popT.capoFretValue(capo)}
                    </button>
                    <button
                      type="button"
                      className="m3-settings-step-btn"
                      disabled={capo >= 12}
                      onClick={() => onChangeCapo(Math.min(12, capo + 1))}
                      aria-label={`${wsT.capoBadge} +1`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Satır 3: Akor Gösterimi */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.chordVoicingLabel}</span>
                <div className="m3-settings-row-controls">
                  <button
                    type="button"
                    className={`m3-settings-pill-btn ${chordComplexity === 'basic' ? 'is-active' : ''}`}
                    onClick={() => onChangeChordComplexity('basic')}
                  >
                    {popT.chordBasic}
                  </button>
                  <button
                    type="button"
                    className={`m3-settings-pill-btn ${chordComplexity === 'all' ? 'is-active' : ''}`}
                    onClick={() => onChangeChordComplexity('all')}
                  >
                    {popT.chordAll}
                  </button>
                </div>
              </div>

              {/* Satır 4: Hızlı Miks Presetleri */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.quickMixPresetsLabel}</span>
                <div className="m3-settings-row-controls">
                  {(['full', 'guitar_backing', 'guitar_focus', 'vocal_karaoke'] as MixPresetId[]).map(
                    (presetId) => (
                      <button
                        key={presetId}
                        type="button"
                        className={`m3-settings-pill-btn ${activePreset === presetId ? 'is-active' : ''}`}
                        onClick={() => onApplyMixPreset(presetId)}
                      >
                        {t.presets[presetId]}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Satır 5: Uygulama Dili */}
              <div className="m3-settings-row">
                <span className="m3-settings-row-label">{popT.languageLabel}</span>
                <div className="m3-settings-row-controls">
                  {SUPPORTED_LANGUAGES.map((langItem) => (
                    <button
                      key={langItem.id}
                      type="button"
                      className={`m3-settings-pill-btn ${language === langItem.id ? 'is-active' : ''}`}
                      onClick={() => onChangeLanguage(langItem.id)}
                    >
                      {langItem.nativeLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MAIN GOOGLE VIDS SINGLE-ROW FOOTER BAR (100% <md-*> Buttons)        */}
        {/* =================================================================== */}
        <div className="m3-footer-bar">
          <md-elevation></md-elevation>

          {/* Mobil Spotify Tarzı Mini Player (Sol: Favori Yıldız + 2 Satırlı Şarkı Adı & 4/4 / BPM / Ton) */}
          <div className="m3-mobile-mini-player">
            {onToggleFavorite && (
              <button
                type="button"
                onClick={onToggleFavorite}
                title={infoT.favoriteTooltip}
                aria-label={infoT.favoriteTooltip}
                className={`m3-fav-star-btn ${isFavorite ? 'is-fav' : ''}`}
              >
                <md-icon style={{ fontSize: '20px' }}>{isFavorite ? 'star' : 'star_outline'}</md-icon>
              </button>
            )}
            <div className="m3-mini-player-info">
              <div className="m3-mini-player-title" title={songTitle}>
                {songTitle}
              </div>
              <div className="m3-mini-player-meta">
                <span className="m3-mini-meta-text">{timeSignature}</span>
                <span className="m3-mini-meta-dot" aria-hidden="true" />
                <span className="m3-mini-meta-text">{Math.round(tempoBpm)} BPM</span>
                <span className="m3-mini-meta-dot" aria-hidden="true" />
                <span className="m3-mini-meta-text is-key">
                  {transposeKeySignature(keySignature, transposeSemitones, language)}
                </span>
              </div>
            </div>
          </div>

          {/* 1. Transport Controls (<md-icon-button> & <md-filled-icon-button>) */}
          <div className="m3-transport-group">
            <div className="m3-playback-core">
              <md-icon-button
                data-role="restart-btn"
                aria-label={t.prevBar}
                title={t.prevBar}
                onClick={onPrevBar}
              >
                <md-icon>skip_previous</md-icon>
              </md-icon-button>

              <md-filled-icon-button
                data-role="play-btn"
                aria-label={isPlaying ? t.pause : t.play}
                title={isPlaying ? t.pause : t.play}
                onClick={onTogglePlay}
              >
                <md-icon>{isPlaying ? 'pause' : 'play_arrow'}</md-icon>
              </md-filled-icon-button>
            </div>

            <div className="m3-practice-toggles">
              {isLoopActive ? (
                <md-filled-icon-button
                  data-loop="active"
                  aria-label={t.loopActive}
                  title={
                    customBarLoopRange
                      ? t.loopBarsTooltip(customBarLoopRange[0], customBarLoopRange[1])
                      : t.loopSectionTooltip(activeSection?.name || wsT.sectionFallback)
                  }
                  onClick={onToggleLoop}
                >
                  <md-icon>repeat</md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-loop="inactive"
                  aria-label="Loop"
                  title={t.loopToggleTooltip}
                  onClick={onToggleLoop}
                >
                  <md-icon>repeat</md-icon>
                </md-filled-tonal-icon-button>
              )}

              {/* Loop Butonunun Sağında Metronom Aç/Kapat İkon Butonu */}
              {isMetronomeActive ? (
                <md-filled-icon-button
                  data-metronome="active"
                  aria-label={t.channels.metronome}
                  title={t.metronomeActiveTooltip}
                  onClick={onToggleMetronome}
                >
                  <md-icon>
                    <MetronomeIcon size={19} />
                  </md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-metronome="inactive"
                  aria-label={t.channels.metronome}
                  title={t.metronomeInactiveTooltip}
                  onClick={onToggleMetronome}
                >
                  <md-icon>
                    <MetronomeIcon size={19} />
                  </md-icon>
                </md-filled-tonal-icon-button>
              )}
            </div>
          </div>

          {/* 2. Center Waveform Scrubber + Google Vids Timestamp */}
          <div className="m3-waveform-group">
            <span className="md-typescale-label-medium" style={{ whiteSpace: 'nowrap' }}>
              <strong style={{ color: 'var(--md-sys-color-primary)' }}>
                {formatDurationSec(currentTimeSec)}
              </strong>{' '}
              / {formatDurationSec(durationSec)}
            </span>

            <div
              ref={waveformRef}
              onClick={handleWaveformClick}
              role="slider"
              aria-label={t.waveformAria}
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

          {/* 3. Right Official M3 Tool Buttons (Desktop Pill Buttons; Mobile uses SongInfoStrip.m3-mobile-tools-strip) */}
          <div className="m3-tools-group">
            <div className="m3-sound-tools">
              {/* 1. Enstrüman Seçimi */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={openPopover === 'instrument' ? 'true' : 'false'}
                title={`${t.instrumentBtnTitle}: ${t.instruments[instrument].name}`}
                onClick={() => togglePopover('instrument')}
              >
                <md-icon slot="icon">
                  <InstrumentIcon instrument={instrument} size={18} />
                </md-icon>
                <span>{t.instruments[instrument].name}</span>
              </md-filled-tonal-button>

              {/* 2. Hız Ayarı (Sadece masaüstünde ayrı buton; mobilde Ayarlar kartı içinde tek satırda!) */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={
                  openPopover === 'speed' || Math.abs(playbackSpeed - 1.0) > 0.01 ? 'true' : 'false'
                }
                title={t.speedBtnTitle}
                onClick={() => togglePopover('speed')}
              >
                <md-icon slot="icon">speed</md-icon>
                <span>{playbackSpeed}x</span>
              </md-filled-tonal-button>

              {/* 4. Stüdyo Mikseri */}
              <md-filled-tonal-button
                data-role="desktop-tool"
                data-active={openPopover === 'mixer' ? 'true' : 'false'}
                title={t.mixerBtnTitle}
                onClick={() => togglePopover('mixer')}
              >
                <md-icon slot="icon">
                  <MixerIcon size={18} />
                </md-icon>
                <span>{t.mixerBtnLabel}</span>
              </md-filled-tonal-button>

              {/* 5. Genel Sesi Aç / Kapat (Master Mute) İkon Butonu */}
              {isMasterMuted ? (
                <md-filled-icon-button
                  data-master-mute="active"
                  aria-label={t.masterUnmuteTitle}
                  title={t.masterUnmuteTitle}
                  onClick={onToggleMasterMute}
                >
                  <md-icon>volume_off</md-icon>
                </md-filled-icon-button>
              ) : (
                <md-filled-tonal-icon-button
                  data-master-mute="inactive"
                  aria-label={t.masterMuteTitle}
                  title={t.masterMuteTitle}
                  onClick={onToggleMasterMute}
                >
                  <md-icon>volume_off</md-icon>
                </md-filled-tonal-icon-button>
              )}
            </div>

            {/* 6. Stüdyo Ayarları */}
            <div className="m3-settings-trigger">
              <md-icon-button
                aria-label={t.settingsBtnTitle}
                title={t.settingsBtnTitle}
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
        </div>
      </div>
    </footer>
  );
};
