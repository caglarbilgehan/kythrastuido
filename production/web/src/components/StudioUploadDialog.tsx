import React, { useRef, useState } from 'react';
import {
  AppLanguage,
  StudioSong
} from '../types/studio';
import { TRANSLATIONS } from '../i18n/translations';
import { loadAndPrepareUploadedFile } from '../api/studioApi';
import { saveAudioBlobToClientDb } from '../utils/clientAudioCache';

interface StudioUploadDialogProps {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  onSongLoaded: (song: StudioSong) => void;
  onAuthChanged: () => void;
  initialLoading?: boolean;
  initialLoadingMessage?: string;
}

const SUPPORTED_FORMATS = ['WAV', 'MP3', 'FLAC', 'OGG', 'M4A'];

export const StudioUploadDialog: React.FC<StudioUploadDialogProps> = ({
  isOpen,
  language,
  onClose,
  onSongLoaded,
  onAuthChanged,
  initialLoading = false,
  initialLoadingMessage = ''
}) => {
  const t = TRANSLATIONS[language].header;

  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoadingSong, setIsLoadingSong] = useState(initialLoading);
  const [loadingMessage, setLoadingMessage] = useState(initialLoadingMessage);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const singleFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSingleFileUpload = async (file: File) => {
    setIsLoadingSong(true);
    setUploadError(null);
    setLoadingMessage(t.uploadingAudio);
    try {
      const loaded = await loadAndPrepareUploadedFile(file, (step) => {
        if (step === 'upload') setLoadingMessage(t.uploadingAudio);
        else setLoadingMessage(t.preparingHarmonic);
      });
      await saveAudioBlobToClientDb(loaded.trackKey, 'master', file);
      onSongLoaded(loaded);
      onAuthChanged();
      onClose();
    } catch (err: any) {
      setUploadError(err?.message || t.errAudioUpload);
    } finally {
      setIsLoadingSong(false);
      setLoadingMessage('');
    }
  };

  return (
    <div
      className="m3-dialog-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoadingSong) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="studio-upload-dialog-title"
        className="m3-upload-dialog-card"
      >
        <md-elevation></md-elevation>

        {/* Dialog Header */}
        <div className="m3-upload-dialog-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div className="m3-upload-dialog-badge">
              <md-icon style={{ fontSize: '20px' }}>audio_file</md-icon>
            </div>
            <span id="studio-upload-dialog-title" className="md-typescale-title-medium">
              {t.uploadTitle}
            </span>
          </div>
          <md-icon-button
            aria-label={t.close}
            disabled={isLoadingSong || undefined}
            onClick={() => !isLoadingSong && onClose()}
          >
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        {uploadError && (
          <div className="m3-dialog-error-banner md-typescale-label-medium">
            <md-icon style={{ fontSize: '18px' }}>error</md-icon>
            <span>{uploadError}</span>
          </div>
        )}

        {isLoadingSong ? (
          <div style={{ padding: '24px 8px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <md-circular-progress indeterminate={true}></md-circular-progress>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="md-typescale-title-small">
                  {loadingMessage || t.analyzingAudioFile}
                </span>
                <span
                  className="md-typescale-body-small"
                  style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                >
                  {t.loadingStudioSub}
                </span>
              </div>
            </div>
            <md-linear-progress indeterminate={true}></md-linear-progress>
          </div>
        ) : (
          <div className="m3-upload-card-body">
            <input
              ref={singleFileInputRef}
              type="file"
              accept=".wav,.mp3,.flac,.ogg,.m4a,audio/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleSingleFileUpload(f);
                e.target.value = '';
              }}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => singleFileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleSingleFileUpload(f);
              }}
              className={`m3-upload-dropzone ${isDragOver ? 'is-dragover' : ''}`}
            >
              <md-ripple></md-ripple>
              <div className="m3-upload-dropzone-icon">
                <md-icon style={{ fontSize: '28px', color: 'var(--md-sys-color-primary)' }}>
                  cloud_upload
                </md-icon>
              </div>
              <span className="md-typescale-title-small">{t.dropzoneHeadline}</span>
              <span
                className="md-typescale-body-small"
                style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
              >
                {t.dropzoneSubtext}
              </span>
              <md-filled-tonal-button style={{ marginTop: '4px' }}>
                <md-icon slot="icon">folder_open</md-icon>
                {t.chooseFileBtn}
              </md-filled-tonal-button>
            </div>

            <div className="m3-upload-meta-col">
              <div className="m3-dialog-info-box md-typescale-body-small">
                {t.localDeviceNotice}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    className="md-typescale-label-medium"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {t.supportedFormats}
                  </span>
                  <span
                    className="md-typescale-label-small"
                    style={{ color: 'var(--md-sys-color-on-surface-variant)' }}
                  >
                    {t.uploadLimits}
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {SUPPORTED_FORMATS.map((fmt) => (
                    <span key={fmt} className="m3-tonal-badge">
                      .{fmt.toLowerCase()} ({fmt})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
