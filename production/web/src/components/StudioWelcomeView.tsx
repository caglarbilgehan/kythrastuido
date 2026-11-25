import React, { useEffect, useState } from 'react';
import {
  AppLanguage,
  LibrarySongItem,
  PrivateUploadedSongItem,
  StudioSong
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { fetchLibrarySongs, loadCachedSongByTrackKey } from '../api/studioApi';
import { formatDurationSec } from '../utils/musicTheory';
import { SourceOriginIcon, detectSongSource } from './icons';

interface StudioWelcomeViewProps {
  language: AppLanguage;
  privateUploads: PrivateUploadedSongItem[];
  initialLibrarySongs?: LibrarySongItem[];
  onOpenUpload: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onRenameTrack?: (trackKey: string, newTitle: string) => Promise<void>;
  onDeleteTrack?: (trackKey: string) => Promise<void>;
  onShowcaseQuickOpen?: (trackKey: string) => void;
}

export const StudioWelcomeView: React.FC<StudioWelcomeViewProps> = ({
  language,
  privateUploads,
  initialLibrarySongs,
  onOpenUpload,
  onSongLoaded,
  onRenameTrack,
  onDeleteTrack,
  onShowcaseQuickOpen
}) => {
  const wT = TRANSLATIONS[language].welcome;
  const hT = TRANSLATIONS[language].header;
  const [libraryItems, setLibraryItems] = useState<LibrarySongItem[]>(
    () => initialLibrarySongs || []
  );
  const [loadingTrackKey, setLoadingTrackKey] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [mutatingKey, setMutatingKey] = useState<string | null>(null);

  useEffect(() => {
    if (initialLibrarySongs && initialLibrarySongs.length > 0) {
      setLibraryItems(initialLibrarySongs);
      return;
    }
    fetchLibrarySongs().then(setLibraryItems);
  }, [privateUploads.length, initialLibrarySongs]);

  const combinedRecent = React.useMemo(() => {
    const map = new Map<
      string,
      {
        track_key: string;
        title: string;
        duration_sec: number;
        tempo_bpm: number;
        key_signature: string;
      }
    >();
    privateUploads.forEach((u) => map.set(u.track_key, u));
    libraryItems.forEach((l) => {
      if (!map.has(l.track_key)) map.set(l.track_key, l);
    });
    return Array.from(map.values()).slice(0, 8);
  }, [privateUploads, libraryItems]);

  const handleQuickOpen = async (trackKey: string) => {
    if (onShowcaseQuickOpen) {
      onShowcaseQuickOpen(trackKey);
      return;
    }
    setLoadingTrackKey(trackKey);
    try {
      const song = await loadCachedSongByTrackKey(trackKey);
      onSongLoaded(song);
    } catch {
      // ignore if session metadata cannot load
    } finally {
      setLoadingTrackKey(null);
    }
  };

  return (
    <main className="m3-main-container m3-welcome-root">
      {/* 1. Welcome Hero */}
      <section className="m3-surface-card m3-welcome-hero">
        <md-elevation></md-elevation>
        <div className="m3-welcome-badge">
          <md-icon style={{ fontSize: '16px' }}>auto_awesome</md-icon>
          <span>{wT.badge}</span>
        </div>
        <h1 className="m3-welcome-title">{wT.title}</h1>
        <p className="m3-welcome-subtitle">{wT.subtitle}</p>
      </section>

      {/* 2. Single Track AI Upload Action Card */}
      <section className="m3-welcome-grid">
        <div className="m3-surface-card m3-welcome-action-card">
          <md-elevation></md-elevation>
          <div className="m3-welcome-card-top">
            <div className="m3-welcome-card-icon">
              <md-icon style={{ fontSize: '26px' }}>audio_file</md-icon>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h2 className="md-typescale-title-medium">{wT.singleCardTitle}</h2>
              <p
                className="md-typescale-body-medium"
                style={{ color: 'var(--md-sys-color-on-surface-variant)', margin: 0, lineHeight: 1.5 }}
              >
                {wT.singleCardDesc}
              </p>
            </div>
          </div>

          <div className="m3-welcome-card-footer">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="m3-tonal-badge">MP3 / WAV / FLAC / M4A</span>
              <span className="m3-tonal-badge">BPM · Chords · Stems</span>
            </div>
            <md-filled-button onClick={() => onOpenUpload()}>
              <md-icon slot="icon">upload_file</md-icon>
              <span>{wT.singleCardBtn}</span>
            </md-filled-button>
          </div>
        </div>
      </section>

      {/* 3. Recent Projects / Private Uploads with Rename & Delete */}
      {combinedRecent.length > 0 && (
        <section className="m3-surface-card m3-welcome-recent-card">
          <md-elevation></md-elevation>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span className="md-typescale-title-small">{wT.recentTitle}</span>
            <span
              className="md-typescale-body-small"
              style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
            >
              {combinedRecent.length}
            </span>
          </div>
          <div className="m3-upload-manage-list">
            {combinedRecent.map((item) => {
              const isEditing = editingKey === item.track_key;
              const isConfirming = confirmDeleteKey === item.track_key;
              const isBusy = mutatingKey === item.track_key || loadingTrackKey === item.track_key;

              return (
                <div key={item.track_key} className="m3-upload-manage-row">
                  {isEditing ? (
                    <div className="m3-inline-rename-row" style={{ flex: 1 }}>
                      <input
                        type="text"
                        value={editingTitle}
                        autoFocus
                        disabled={isBusy}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={async (e) => {
                          if (e.key === 'Enter' && onRenameTrack) {
                            const clean = editingTitle.trim();
                            if (clean) {
                              setMutatingKey(item.track_key);
                              try {
                                await onRenameTrack(item.track_key, clean);
                                setEditingKey(null);
                              } finally {
                                setMutatingKey(null);
                              }
                            }
                          }
                          if (e.key === 'Escape') {
                            setEditingKey(null);
                          }
                        }}
                        placeholder={hT.trackTitlePlaceholder}
                        className="m3-inline-rename-input"
                      />
                      <md-icon-button
                        aria-label={hT.saveTitleBtn}
                        disabled={isBusy || undefined}
                        onClick={async () => {
                          const clean = editingTitle.trim();
                          if (!clean || !onRenameTrack) {
                            setEditingKey(null);
                            return;
                          }
                          setMutatingKey(item.track_key);
                          try {
                            await onRenameTrack(item.track_key, clean);
                            setEditingKey(null);
                          } finally {
                            setMutatingKey(null);
                          }
                        }}
                      >
                        <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>check</md-icon>
                      </md-icon-button>
                      <md-icon-button
                        aria-label={hT.cancelActionBtn}
                        disabled={isBusy || undefined}
                        onClick={() => setEditingKey(null)}
                      >
                        <md-icon>close</md-icon>
                      </md-icon-button>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleQuickOpen(item.track_key)}
                        className="m3-upload-manage-main"
                      >
                        <div className="m3-source-logo-slot">
                          <SourceOriginIcon source={detectSongSource(item.track_key)} />
                        </div>
                        <div className="m3-upload-manage-text">
                          <span className="m3-upload-manage-title" title={item.title}>
                            {item.title}
                          </span>
                          <span className="m3-upload-manage-sub">
                            {Math.round(item.tempo_bpm)} BPM · {item.key_signature} ·{' '}
                            {formatDurationSec(item.duration_sec)}
                          </span>
                        </div>
                      </button>

                      <div className="m3-track-row-actions">
                        <span className="m3-tonal-badge">
                          {loadingTrackKey === item.track_key ? '...' : hT.readyBadge}
                        </span>
                        {onRenameTrack && (
                          <md-icon-button
                            aria-label={hT.renameTrackTooltip}
                            title={hT.renameTrackTooltip}
                            disabled={isBusy || undefined}
                            onClick={() => {
                              setConfirmDeleteKey(null);
                              setEditingKey(item.track_key);
                              setEditingTitle(item.title);
                            }}
                          >
                            <md-icon style={{ fontSize: '18px' }}>edit</md-icon>
                          </md-icon-button>
                        )}
                        {onDeleteTrack && (
                          isConfirming ? (
                            <div className="m3-inline-delete-confirm">
                              <button
                                type="button"
                                disabled={isBusy}
                                className="m3-inline-delete-btn"
                                onClick={async () => {
                                  setMutatingKey(item.track_key);
                                  try {
                                    await onDeleteTrack(item.track_key);
                                    setLibraryItems((prev) =>
                                      prev.filter((l) => l.track_key !== item.track_key)
                                    );
                                  } finally {
                                    setMutatingKey(null);
                                    setConfirmDeleteKey(null);
                                  }
                                }}
                              >
                                {hT.confirmDeleteBtn}
                              </button>
                              <button
                                type="button"
                                disabled={isBusy}
                                className="m3-inline-cancel-btn"
                                onClick={() => setConfirmDeleteKey(null)}
                              >
                                {hT.cancelActionBtn}
                              </button>
                            </div>
                          ) : (
                            <md-icon-button
                              aria-label={hT.deleteTrackTooltip}
                              title={hT.deleteTrackTooltip}
                              disabled={isBusy || undefined}
                              onClick={() => setConfirmDeleteKey(item.track_key)}
                            >
                              <md-icon style={{ fontSize: '18px' }}>delete_outline</md-icon>
                            </md-icon-button>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
};
