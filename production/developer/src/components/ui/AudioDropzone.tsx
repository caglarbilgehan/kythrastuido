import React, { useId, useState } from 'react';

interface AudioDropzoneProps {
  onUpload: (file: File) => void;
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const AudioDropzone: React.FC<AudioDropzoneProps> = ({
  onUpload,
  title = 'Dosya seçmek için tıklayın veya sürükleyip bırakın',
  subtitle = 'WAV, MP3, FLAC, OGG ve M4A desteklenir (Azami 100 MB)',
  compact = false
}) => {
  const inputId = useId();
  const [dragActive, setDragActive] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        id={inputId}
        accept=".wav,.mp3,.flac,.ogg,.m4a"
        className="dev-hidden-input"
        onChange={handleFileInput}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(inputId)?.click()}
        className={`m3-upload-dropzone ${compact ? 'is-compact' : ''} ${dragActive ? 'is-dragging' : ''
          }`}
      >
          <div className="m3-upload-dropzone-icon">
            <md-icon>cloud_upload</md-icon>
          </div>
          <span className="md-typescale-title-small">{title}</span>
          <span className="dev-aside-copy m3-tabular">{subtitle}</span>
        </div>
      </>
      );
};
