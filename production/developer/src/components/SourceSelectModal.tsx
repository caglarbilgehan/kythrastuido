import React from 'react';
import { AudioDropzone } from './ui/AudioDropzone';

interface SourceSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  onUpload: (file: File) => void;
}

export const SourceSelectModal: React.FC<SourceSelectModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  onUpload
}) => {
  if (!isOpen) return null;

  const handleUploadFile = (file: File) => {
    onUpload(file);
    onClose();
  };

  return (
    <div
      className="dev-modal-scrim"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="source-modal-title"
        className="dev-modal-card"
      >
        <md-elevation></md-elevation>

        <div className="dev-modal-header">
          <div className="dev-modal-title-wrap">
            <div className="dev-modal-icon-badge">
              <md-icon style={{ fontSize: '18px' }}>audio_file</md-icon>
            </div>
            <h2 id="source-modal-title" className="md-typescale-title-medium">
              Ses Dosyası Yükle
            </h2>
          </div>
          <md-icon-button onClick={onClose} aria-label="Pencereyi kapat">
            <md-icon>close</md-icon>
          </md-icon-button>
        </div>

        <div className="dev-modal-body">
          <AudioDropzone onUpload={handleUploadFile} />
        </div>
      </div>
    </div>
  );
};
