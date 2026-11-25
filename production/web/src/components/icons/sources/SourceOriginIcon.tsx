import React from 'react';

export type SongSourceOrigin = 'upload' | 'audio';

/**
 * Determines the origin badge type for a song from its track key.
 */
export function detectSongSource(
  trackKey?: string
): SongSourceOrigin {
  if (trackKey && trackKey.startsWith('sha256:')) {
    return 'upload';
  }
  return 'audio';
}

const SOURCE_ICON_REGISTRY: Record<SongSourceOrigin, React.ReactElement> = {
  upload: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>audio_file</md-icon>,
  audio: <md-icon style={{ color: 'var(--md-sys-color-primary)' }}>music_note</md-icon>
};

/**
 * Renders the visual source indicator (uploaded audio file or music note).
 */
export const SourceOriginIcon: React.FC<{ source: SongSourceOrigin }> = React.memo(({ source }) => (
  SOURCE_ICON_REGISTRY[source] ?? SOURCE_ICON_REGISTRY.audio
));

SourceOriginIcon.displayName = 'SourceOriginIcon';
