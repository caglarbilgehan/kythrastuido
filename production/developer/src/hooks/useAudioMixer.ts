import { useState, useEffect, useRef, useCallback } from 'react';
import { SessionState, StemChannel } from '../types/workbench';
import { Stage3MssData } from '../types/stages';
import { DEFAULT_STEMS } from '../constants/instruments';

interface UseAudioMixerOptions {
  session: SessionState | null;
  stage3Output?: Stage3MssData;
}

export function useAudioMixer({ session, stage3Output }: UseAudioMixerOptions) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [stemChannels, setStemChannels] = useState<StemChannel[]>(DEFAULT_STEMS);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stemAudioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const currentTimeRef = useRef<number>(0);
  const playPromisesRef = useRef<Record<string, Promise<void> | null>>({});

  const safePlay = useCallback((audio: HTMLAudioElement, id: string) => {
    if (!audio.src) return;
    try {
      const p = audio.play();
      if (p !== undefined) {
        playPromisesRef.current[id] = p;
        p.then(() => {
          playPromisesRef.current[id] = null;
        }).catch((err: unknown) => {
          playPromisesRef.current[id] = null;
          // AbortError is thrown when pause() interrupts play() - standard browser behavior, ignore safely
          if (err instanceof Error && (err.name === 'AbortError' || err.message?.includes('interrupted'))) {
            return;
          }
          console.warn(`Kanal ${id} oynatma hatası:`, err);
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.warn(`Kanal ${id} başlatma hatası:`, err);
    }
  }, []);

  const safePause = useCallback((audio: HTMLAudioElement, id: string) => {
    const p = playPromisesRef.current[id];
    if (p) {
      p.then(() => {
        try {
          audio.pause();
        } catch {
          // ignore
        }
      }).catch(() => {
        // ignore
      });
    } else {
      try {
        audio.pause();
      } catch {
        // ignore
      }
    }
  }, []);

  currentTimeRef.current = currentTime;
  const audioDuration = session?.duration_sec || 0;
  const isStage3Done = session?.stages?.['3']?.status === 'completed';

  // Bind master HTML5 Audio element
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;

      audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
    }

    const audio = audioRef.current;
    if (session?.has_session) {
      const srcUrl = `/api/workbench/stream/master?track=${encodeURIComponent(session.track_name || 'track')}`;
      if (!audio.src.includes('/api/workbench/stream/master')) {
        audio.src = srcUrl;
        audio.load();
      }
    } else {
      safePause(audio, 'master');
      audio.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [session?.has_session, session?.track_name, safePause]);

  // Bind isolated stem audio elements and remove obsolete ones
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentChannelIds = new Set(stemChannels.map((c) => c.id));
    // Clean up audio elements for channels that were removed
    Object.keys(stemAudioRefs.current).forEach((id) => {
      if (!currentChannelIds.has(id)) {
        const obsoleteAudio = stemAudioRefs.current[id];
        safePause(obsoleteAudio, id);
        obsoleteAudio.src = '';
        delete stemAudioRefs.current[id];
      }
    });

    stemChannels.forEach((ch) => {
      const stemId = ch.id;
      if (!stemAudioRefs.current[stemId]) {
        const audio = new Audio();
        audio.preload = 'auto';
        stemAudioRefs.current[stemId] = audio;
      }
      const audio = stemAudioRefs.current[stemId];
      if (isStage3Done) {
        const srcUrl = `/api/workbench/stream/${stemId}?track=${encodeURIComponent(session?.track_name || 'stem')}`;
        if (!audio.src.includes(srcUrl)) {
          audio.src = srcUrl;
          audio.load();
        }
      } else {
        safePause(audio, stemId);
        audio.src = '';
      }
    });
  }, [stemChannels, isStage3Done, session?.track_name, safePause]);

  // Update stem metadata: standart BS-RoFormer 6 kanal
  useEffect(() => {
    if (!stage3Output) return;

    setStemChannels((prev) => {
      const prevMap = new Map(prev.map((p) => [p.id, p]));
      const stemsObj = stage3Output.stems || {};
      const order =
        stage3Output.channel_order && stage3Output.channel_order.length > 0
          ? stage3Output.channel_order
          : Object.keys(stemsObj).length > 0
          ? Object.keys(stemsObj)
          : DEFAULT_STEMS.map((d) => d.id);

      return order.map((id) => {
        const def = DEFAULT_STEMS.find((d) => d.id === id);
        const prevCh = prevMap.get(id);
        const stemInfo = stemsObj[id];
        const category = stemInfo?.category || def?.id || 'other';
        const isDetected =
          typeof stemInfo?.detected === 'boolean'
            ? stemInfo.detected
            : stemInfo?.rms_dbfs !== undefined
            ? stemInfo.rms_dbfs > -48 && (stemInfo.peak_dbfs ?? -60) > -40
            : false;

        const resolvedName = def?.name || id;
        return {
          id,
          category,
          name: resolvedName,
          fileName: resolvedName,
          sizeBytes: stemInfo?.buffer_size_mb
            ? Math.round(stemInfo.buffer_size_mb * 1024 * 1024)
            : stemInfo?.size_bytes,
          volume: prevCh ? prevCh.volume : def?.volume ?? 0.8,
          isMuted: prevCh ? prevCh.isMuted : false,
          isSolo: prevCh ? prevCh.isSolo : false,
          isGuitar: category === 'guitar',
          detected: isDetected,
          presenceLabel: isDetected ? 'Aktif Sinyal' : 'Ses Bulunmadı'
        };
      });
    });
  }, [stage3Output]);

  // Synchronize playback, solo, mute, and volume across stem elements
  useEffect(() => {
    const isAnySolo = stemChannels.some((c) => c.isSolo);
    const shouldPlayStems = isStage3Done && isPlaying;

    stemChannels.forEach((ch) => {
      const audio = stemAudioRefs.current[ch.id];
      if (!audio || !audio.src) return;

      let effectiveVol = ch.volume;
      if (ch.isMuted || (isAnySolo && !ch.isSolo) || ch.detected === false) {
        effectiveVol = 0;
      }
      audio.volume = Math.max(0, Math.min(1, effectiveVol));

      if (shouldPlayStems) {
        if (audio.paused && !playPromisesRef.current[ch.id]) {
          audio.currentTime = currentTimeRef.current;
          safePlay(audio, ch.id);
        }
      } else if (!audio.paused) {
        safePause(audio, ch.id);
      }
    });
  }, [isPlaying, isStage3Done, stemChannels, safePlay, safePause]);

  // Keep master timeline synced to stem playback leader
  useEffect(() => {
    if (!isStage3Done || !isPlaying) return;

    const leader =
      stemAudioRefs.current['guitar'] ||
      Object.values(stemAudioRefs.current)[0];
    if (!leader) return;

    const onTime = () => setCurrentTime(leader.currentTime);
    const onEnded = () => setIsPlaying(false);

    leader.addEventListener('timeupdate', onTime);
    leader.addEventListener('ended', onEnded);
    return () => {
      leader.removeEventListener('timeupdate', onTime);
      leader.removeEventListener('ended', onEnded);
    };
  }, [isPlaying, isStage3Done, stemChannels]);

  const seekAudio = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, Math.min(sec, audioDuration || 300));
      setCurrentTime(clamped);
      if (audioRef.current) {
        audioRef.current.currentTime = clamped;
      }
      Object.values(stemAudioRefs.current).forEach((a) => {
        if (a && a.src) a.currentTime = clamped;
      });
    },
    [audioDuration]
  );

  const toggleMasterPlay = useCallback(() => {
    if (!session?.has_session) {
      setIsPlaying((prev) => !prev);
      return;
    }

    if (isStage3Done) {
      if (isPlaying) {
        Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
          if (a) safePause(a, id);
        });
        if (audioRef.current) safePause(audioRef.current, 'master');
        setIsPlaying(false);
      } else {
        if (audioRef.current) safePause(audioRef.current, 'master');
        Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
          if (a && a.src) {
            if (a.error || a.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
              a.load();
            }
            a.currentTime = currentTimeRef.current;
            safePlay(a, id);
          }
        });
        setIsPlaying(true);
      }
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.currentTime = currentTimeRef.current;
      safePlay(audio, 'master');
      setIsPlaying(true);
    } else {
      safePause(audio, 'master');
      setIsPlaying(false);
    }
  }, [session?.has_session, isStage3Done, isPlaying, safePlay, safePause]);

  const toggleStemSolo = useCallback((channelId: string) => {
    setStemChannels((prev) => {
      const target = prev.find((c) => c.id === channelId);
      const isCurrentlySolo = target?.isSolo;
      return prev.map((c) => ({
        ...c,
        isSolo: c.id === channelId ? !isCurrentlySolo : false
      }));
    });
  }, []);

  const toggleStemMute = useCallback((channelId: string) => {
    setStemChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, isMuted: !c.isMuted } : c))
    );
  }, []);

  const setStemVolume = useCallback((channelId: string, vol: number) => {
    setStemChannels((prev) =>
      prev.map((c) => (c.id === channelId ? { ...c, volume: vol } : c))
    );
  }, []);

  const resetStemMixer = useCallback(() => {
    setStemChannels((prev) =>
      prev.map((c) => ({
        ...c,
        volume: c.id === 'guitar' ? 0.85 : 0.7,
        isMuted: false,
        isSolo: false
      }))
    );
  }, []);

  const stopAndResetAudio = useCallback(() => {
    if (audioRef.current) {
      safePause(audioRef.current, 'master');
      audioRef.current.src = '';
    }
    Object.entries(stemAudioRefs.current).forEach(([id, a]) => {
      if (a) {
        safePause(a, id);
        a.src = '';
      }
    });
    setIsPlaying(false);
    setCurrentTime(0);
  }, [safePause]);

  return {
    isPlaying,
    currentTime,
    audioDuration,
    seekAudio,
    toggleMasterPlay,
    stemChannels,
    toggleStemSolo,
    toggleStemMute,
    setStemVolume,
    resetStemMixer,
    stopAndResetAudio
  };
}
