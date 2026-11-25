import React, { useState } from 'react';

interface RawJsonViewerProps {
  fileName: string;
  data: any;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({ fileName, data }) => {
  const [copied, setCopied] = useState(false);

  const jsonText = data
    ? JSON.stringify(data, null, 2)
    : '// Bu aşama için henüz JSON çıktısı üretilmedi.\n// Çalıştırmak için yukarıdaki "Aşama Çalıştır" düğmesini kullanın.';

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="m3-surface-card dev-section-block">
      <md-elevation></md-elevation>

      <div className="dev-section-header">
        <div className="dev-section-header-title">
          <span className="m3-mono">/session/{fileName}</span>
          <span className="m3-tonal-badge sm success">Canlı Oturum JSON</span>
        </div>

        {data && (
          <md-filled-tonal-button onClick={handleCopy}>
            <md-icon slot="icon">{copied ? 'check' : 'content_copy'}</md-icon>
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </md-filled-tonal-button>
        )}
      </div>

      <pre className="dev-json-pre">{jsonText}</pre>
    </div>
  );
};
