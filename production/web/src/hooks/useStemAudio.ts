import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MixPresetId,
  StemCategory,
  StemChannelState,
  StemId,
  StudioSong
} from '../types/studio';
import { buildStudioHeaders } from '../api/studioApi';
import {
  listCachedChannelIdsForTrack,
  loadAudioBlobFromClientDb,
  saveAudioBlobToClientDb
} from '../utils/clientAudioCache';

const CATEGORY_VISUALS: Record<
  StemCategory,
  { defaultLabel: string; role: string; icon: string; color: string; defaultVolume: number }
> = {
  guitar: { defaultLabel: 'Guitar', role: 'Polyphonic Guitar', icon: 'music_note', color: '#0B57D0', defaultVolume: 0.9 },
  vocals: { defaultLabel: 'Vocals', role: 'Lead & Backing Vocals', icon: 'mic', color: '#B3261E', defaultVolume: 0.85 },
  bass: { defaultLabel: 'Bass', role: 'Harmonic Bassline', icon: 'graphic_eq', color: '#146C2E', defaultVolume: 0.85 },
  drums: { defaultLabel: 'Drums', role: 'Percussion & Transients', icon: 'album', color: '#D97706', defaultVolume: 0.85 },
  piano: { defaultLabel: 'Piano', role: 'Keys & Accompaniment', icon: 'piano', color: '#7C3AED', defaultVolume: 0.8 },
  other: { defaultLabel: 'Other', role: 'Synth & Ambience', icon: 'equalizer', color: '#64748B', defaultVolume: 0.75 },
  metronome: { defaultLabel: 'Metronome', role: 'Beat & Downbeat Click', icon: 'timer', color: '#00639B', defaultVolume: 0.7 }
};

const STANDARD_ORDER: Exclude<StemCategory, 'metronome'>[] = [
  'guitar',
  'vocals',
  'bass',
  'drums',
  'piano',
  'other'
];

function inferCategoryFromChannelId(channelId: string): StemCategory {
  if (STANDARD_ORDER.includes(channelId as any)) {
    return channelId as StemCategory;
  }
  const prefix = channelId.split('_')[0];
  if (STANDARD_ORDER.includes(prefix as any)) {
    return prefix as StemCategory;
  }
  return 'other';
}

function buildChannelsForSong(
  song: StudioSong,
  prev: StemChannelState[],
  isSameSong: boolean
): StemChannelState[] {
  const prevMap = new Map(prev.map((p) => [p.id, p]));
  const stemEntries = song.stems || {};
  const orderedIds =
    song.stemOrder && song.stemOrder.length > 0
      ? song.stemOrder
      : Object.keys(stemEntries).length > 0
      ? Object.keys(stemEntries)
      : STANDARD_ORDER;

  const built: StemChannelState[] = orderedIds.map((id) => {
    const stemMeta = stemEntries[id];
    const category: StemCategory = stemMeta?.category || inferCategoryFromChannelId(id);
    const vis = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.other;
    const prevCh = prevMap.get(id);

    return {
      id,
      category,
      label: stemMeta?.label || vis.defaultLabel,
      role: vis.role,
      icon: vis.icon,
      color: vis.color,
      volume: isSameSong && prevCh ? prevCh.volume : vis.defaultVolume,
      isMuted: isSameSong && prevCh ? prevCh.isMuted : false,
      isSolo: isSameSong && prevCh ? prevCh.isSolo : false,
      detected: stemMeta ? stemMeta.detected : true,
      presenceLabel: stemMeta ? stemMeta.presenceLabel : 'Aktif Sinyal',
      rmsDbfs: stemMeta?.rmsDbfs,
      audioUrl: stemMeta?.url
    };
  });

  const prevMetro = prevMap.get('metronome');
  const metroVis = CATEGORY_VISUALS.metronome;
  built.push({
    id: 'metronome',
    category: 'metronome',
    label: metroVis.defaultLabel,
    role: metroVis.role,
    icon: metroVis.icon,
    color: metroVis.color,
    volume: prevMetro ? prevMetro.volume : metroVis.defaultVolume,
    isMuted: prevMetro ? prevMetro.isMuted : true,
    isSolo: prevMetro ? prevMetro.isSolo : false,
    detected: true,
    presenceLabel: 'Senkron Klik'
  });

  return built;
}

function hasValidAudioSrc(audio: HTMLAudioElement | null | undefined): boolean {
  if (!audio) return false;
  const raw = audio.getAttribute('src');
  return Boolean(raw && raw.trim().length > 0);
}

function clearAudioSrc(audio: HTMLAudioElement | null | undefined): void {
  if (!audio) return;
  audio.removeAttribute('src');
  try {
    audio.load();
  } catch {
    // ignore
  }
}

interface UseStemAudioOptions {
  song: StudioSong;
  playbackSpeed: number;
  loopRangeSec: [number, number] | null;
  initialTimeSec?: number;
}

export function useStemAudio({
  song,
  playbackSpeed,
  loopRangeSec,
  initialTimeSec = 0
}: UseStemAudioOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(initialTimeSec);
  const [activePreset, setActivePreset] = useState<MixPresetId>('full');
  const [hasReadyMaster, setHasReadyMaster] = useState(false);
  const [hasReadyStems, setHasReadyStems] = useState(false);
  const [channels, setChannels] = useState<StemChannelState[]>(() =>
    buildChannelsForSong(song, [], false)
  );

  const masterAudioRef = useRef<HTMLAudioElement | null>(null);
  const stemRefs = useRef<Record<string, HTMLAudioElement>>({});
  const playPromisesRef = useRef<Record<string, Promise<void> | null>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastClickedBeatIdxRef = useRef<number>(-1);
  const currentTimeRef = useRef(0);
  const prevTimeRef = useRef(0);
  const isPlayingRef = useRef(false);
  const playbackSpeedRef = useRef(playbackSpeed);
  const prevSongIdRef = useRef<string>('');
  const readyMasterRef = useRef<boolean>(false);
  const readyStemsRef = useRef<boolean>(false);
  const isLoadingMasterRef = useRef<boolean>(false);
  const isLoadingStemsRef = useRef<boolean>(false);
  const masterLoadedKeyRef = useRef<string>('');
  const stemLoadedKeyRef = useRef<Record<string, string>>({});
  const masterFailedRef = useRef<boolean>(false);
  const channelsRef = useRef(channels);
  const isMasterMutedRef = useRef(isMasterMuted);
  const blobUrlsRef = useRef<string[]>([]);
  currentTimeRef.current = currentTimeSec;
  isPlayingRef.current = isPlaying;
  playbackSpeedRef.current = playbackSpeed;
  channelsRef.current = channels;
  isMasterMutedRef.current = isMasterMuted;

  const triggerMetronomeClick = useCallback((isDownbeat: boolean, gainLevel: number) => {
    if (typeof window === 'undefined' || gainLevel <= 0.005) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isDownbeat ? 1200 : 820, now);
      osc.frequency.exponentialRampToValueAtTime(isDownbeat ? 600 : 420, now + 0.045);

      const peakGain = Math.min(1, gainLevel * (isDownbeat ? 0.9 : 0.65));
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(peakGain, now + 0.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore WebAudio context restrictions
    }
  }, []);

  const activeStemIds = Object.keys(song.stems || {});
  const stemSignature = (
    song.stemOrder && song.stemOrder.length > 0 ? song.stemOrder : activeStemIds
  ).join('|');
  const hasStemAudio = Boolean(
    hasReadyStems || (song.stage3Status === 'completed' && activeStemIds.length > 0)
  );
  const hasMasterAudio = Boolean(hasReadyMaster || song.masterAudioUrl);

  const applyAudioVolumesAndRate = useCallback(() => {
    const chs = channelsRef.current;
    const masterMuted = isMasterMutedRef.current;
    const speed = playbackSpeedRef.current;
    const isAnySolo = chs.some((c) => c.isSolo);

    chs.forEach((ch) => {
      if (ch.category === 'metronome') return;
      const audio = stemRefs.current[ch.id];
      if (!audio) return;
      let vol = ch.volume;
      if (masterMuted || ch.isMuted || (isAnySolo && !ch.isSolo) || ch.detected === false) {
        vol = 0;
      }
      audio.muted = false;
      audio.volume = Math.max(0, Math.min(1, vol));
      audio.playbackRate = speed;
    });

    if (masterAudioRef.current) {
      const isMetronomeOnlySolo =
        isAnySolo &&
        chs.every((c) => (c.category === 'metronome' ? c.isSolo : !c.isSolo));
      masterAudioRef.current.muted = false;
      masterAudioRef.current.volume = masterMuted || isMetronomeOnlySolo ? 0 : 1;
      masterAudioRef.current.playbackRate = speed;
    }
  }, []);

  const safePlay = useCallback(
    (audio: HTMLAudioElement, id: string, desiredTimeSec?: number) => {
      if (!hasValidAudioSrc(audio)) return;
      const startPlayback = () => {
        if (!isPlayingRef.current) return;
        applyAudioVolumesAndRate();
        if (desiredTimeSec !== undefined && Number.isFinite(desiredTimeSec)) {
          try {
            audio.currentTime = desiredTimeSec;
          } catch {
            // ignore seek error before metadata
          }
        }
        audio.muted = false;
        audio.playbackRate = playbackSpeedRef.current;
        try {
          const p = audio.play();
          if (p !== undefined) {
            playPromisesRef.current[id] = p;
            p.then(() => {
              playPromisesRef.current[id] = null;
            }).catch((err: unknown) => {
              playPromisesRef.current[id] = null;
              if (
                err instanceof Error &&
                (err.name === 'AbortError' || err.message?.includes('interrupted'))
              ) {
                return;
              }
              console.warn(`Channel ${id} playback warning:`, err);
            });
          }
        } catch {
          // ignore AbortError
        }
      };

      if (audio.ended || audio.readyState < 2) {
        const onReady = () => {
          audio.removeEventListener('loadeddata', onReady);
          audio.removeEventListener('canplay', onReady);
          if (isPlayingRef.current) {
            startPlayback();
          }
        };
        audio.addEventListener('loadeddata', onReady);
        audio.addEventListener('canplay', onReady);
        if (audio.ended) {
          try {
            audio.load();
          } catch {
            // ignore
          }
        }
        return;
      }

      startPlayback();
    },
    [applyAudioVolumesAndRate]
  );

  const safePause = useCallback((audio: HTMLAudioElement, id: string) => {
    const p = playPromisesRef.current[id];
    if (p) {
      p.then(() => {
        try {
          audio.pause();
        } catch {
          // ignore
        }
      }).catch(() => {});
    } else {
      try {
        audio.pause();
      } catch {
        // ignore
      }
    }
  }, []);

  // Sync song stems & master audio sources cleanly across song switches & dynamic stem updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isSameSong = prevSongIdRef.current === song.id;
    prevSongIdRef.current = song.id;

    if (!isSameSong) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setCurrentTimeSec(initialTimeSec);
      prevTimeRef.current = initialTimeSec;
      setActivePreset('full');
    }

    setChannels((prev) => buildChannelsForSong(song, prev, isSameSong));

    if (!masterAudioRef.current) {
      masterAudioRef.current = new Audio();
      masterAudioRef.current.preload = 'auto';
    }
    const master = masterAudioRef.current;

    const stemIdList =
      song.stemOrder && song.stemOrder.length > 0
        ? song.stemOrder
        : Object.keys(song.stems || {});
    const stemIdSet = new Set(stemIdList);

    if (!isSameSong) {
      masterLoadedKeyRef.current = '';
      stemLoadedKeyRef.current = {};
      masterFailedRef.current = false;
      readyMasterRef.current = false;
      readyStemsRef.current = false;
      isLoadingMasterRef.current = false;
      isLoadingStemsRef.current = false;
      setHasReadyMaster(false);
      setHasReadyStems(false);

      safePause(master, 'master');
      clearAudioSrc(master);

      // Clear ALL stem elements on project switch so revoked blob URLs never survive
      Object.keys(stemRefs.current).forEach((existingId) => {
        const oldAudio = stemRefs.current[existingId];
        if (oldAudio) {
          safePause(oldAudio, existingId);
          clearAudioSrc(oldAudio);
        }
        delete stemRefs.current[existingId];
      });

      blobUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
      blobUrlsRef.current = [];
    } else if (stemIdList.length > 0) {
      // Clean up obsolete HTMLAudioElements when updating stems on the same track
      Object.keys(stemRefs.current).forEach((existingId) => {
        if (!stemIdSet.has(existingId)) {
          const oldAudio = stemRefs.current[existingId];
          if (oldAudio) {
            safePause(oldAudio, existingId);
            clearAudioSrc(oldAudio);
          }
          delete stemRefs.current[existingId];
          delete stemLoadedKeyRef.current[existingId];
        }
      });
    }

    if (song.source === 'empty') {
      return;
    }

    let cancelled = false;
    const trackKey = song.trackKey || song.id;

    const resolveChannelObjectUrl = async (
      channelId: string,
      remoteUrl?: string
    ): Promise<{ url: string; fromNetwork: boolean }> => {
      const cachedBlob = await loadAudioBlobFromClientDb(trackKey, channelId);
      if (cancelled) return { url: '', fromNetwork: false };
      if (cachedBlob) {
        const objUrl = URL.createObjectURL(cachedBlob);
        blobUrlsRef.current.push(objUrl);
        return { url: objUrl, fromNetwork: false };
      }
      if (!remoteUrl) return { url: '', fromNetwork: false };
      try {
        const resp = await fetch(remoteUrl, { headers: buildStudioHeaders() });
        if (cancelled || !resp.ok) return { url: '', fromNetwork: false };
        const blob = await resp.blob();
        if (cancelled || blob.size <= 0) return { url: '', fromNetwork: false };
        await saveAudioBlobToClientDb(trackKey, channelId, blob);
        if (cancelled) return { url: '', fromNetwork: false };
        const objUrl = URL.createObjectURL(blob);
        blobUrlsRef.current.push(objUrl);
        return { url: objUrl, fromNetwork: true };
      } catch {
        return { url: '', fromNetwork: false };
      }
    };

    // 1. Hydrate Master Audio from IndexedDB or remote stream (works even when song.masterAudioUrl is undefined!)
    const masterKey = `${trackKey}|master|${song.masterAudioUrl || 'idb'}`;
    let masterLoadPromise: Promise<{ ready: boolean; fromNetwork: boolean }> | null = null;
    if (masterLoadedKeyRef.current !== masterKey || !hasValidAudioSrc(master)) {
      isLoadingMasterRef.current = true;
      masterLoadPromise = resolveChannelObjectUrl('master', song.masterAudioUrl).then((resolved) => {
        if (cancelled) return { ready: false, fromNetwork: false };
        isLoadingMasterRef.current = false;
        if (!resolved.url) {
          masterFailedRef.current = true;
          readyMasterRef.current = false;
          setHasReadyMaster(false);
          safePause(master, 'master');
          clearAudioSrc(master);
          return { ready: false, fromNetwork: false };
        }
        masterFailedRef.current = false;
        masterLoadedKeyRef.current = masterKey;
        readyMasterRef.current = true;
        setHasReadyMaster(true);
        if (master.src !== resolved.url) {
          master.src = resolved.url;
          master.load();
        }
        if (isPlayingRef.current && !readyStemsRef.current) {
          applyAudioVolumesAndRate();
          safePlay(master, 'master', currentTimeRef.current);
        }
        return { ready: true, fromNetwork: resolved.fromNetwork };
      });
    } else if (hasValidAudioSrc(master)) {
      readyMasterRef.current = true;
      setHasReadyMaster(true);
    }

    // 2. Hydrate Stem Audio from song.stems OR IndexedDB discovery (for saved projects without active server WAVs)
    const hydrateStemsAndAck = async () => {
      let targetStemIds = stemIdList;
      let discoveredLegacyStems = false;
      if (targetStemIds.length === 0) {
        const cachedIds = await listCachedChannelIdsForTrack(trackKey);
        if (cancelled) return;
        targetStemIds = cachedIds.filter((id) => id !== 'master');
        if (targetStemIds.length > 0) {
          discoveredLegacyStems = true;
        }
      }

      if (discoveredLegacyStems) {
        setChannels((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const missingIds = targetStemIds.filter((id) => !existingIds.has(id));
          if (missingIds.length === 0) return prev;
          const metro = prev.find((c) => c.category === 'metronome');
          const withoutMetro = prev.filter((c) => c.category !== 'metronome');
          const added: StemChannelState[] = missingIds.map((id) => {
            const category = inferCategoryFromChannelId(id);
            const vis = CATEGORY_VISUALS[category] || CATEGORY_VISUALS.other;
            return {
              id,
              category,
              label: vis.defaultLabel,
              role: vis.role,
              icon: vis.icon,
              color: vis.color,
              volume: vis.defaultVolume,
              isMuted: false,
              isSolo: false,
              detected: true,
              presenceLabel: 'Aktif Sinyal'
            };
          });
          return metro ? [...withoutMetro, ...added, metro] : [...withoutMetro, ...added];
        });
      }

      if (targetStemIds.length === 0) {
        isLoadingStemsRef.current = false;
        readyStemsRef.current = false;
        setHasReadyStems(false);
        return;
      }

      isLoadingStemsRef.current = true;
      const stemLoadPromises: Promise<{ ready: boolean; fromNetwork: boolean }>[] = [];

      targetStemIds.forEach((id) => {
        if (!stemRefs.current[id]) {
          const a = new Audio();
          a.preload = 'auto';
          stemRefs.current[id] = a;
        }
        const audio = stemRefs.current[id]!;
        const url = song.stems?.[id]?.url;
        const stemKey = `${trackKey}|${id}|${url || 'idb'}`;
        if (stemLoadedKeyRef.current[id] !== stemKey || !hasValidAudioSrc(audio)) {
          const p = resolveChannelObjectUrl(id, url).then((resolved) => {
            if (cancelled || !resolved.url) return { ready: false, fromNetwork: false };
            stemLoadedKeyRef.current[id] = stemKey;
            if (audio.src !== resolved.url) {
              audio.src = resolved.url;
              audio.load();
            }
            return { ready: resolved.url.startsWith('blob:'), fromNetwork: resolved.fromNetwork };
          });
          stemLoadPromises.push(p);
        }
      });

      if (stemLoadPromises.length > 0) {
        await Promise.all(stemLoadPromises);
      }
      if (cancelled) return;
      isLoadingStemsRef.current = false;

      const loadedCount = targetStemIds.filter((id) => hasValidAudioSrc(stemRefs.current[id])).length;
      const stemsReady = loadedCount > 0;
      const wasReadyBefore = readyStemsRef.current;
      readyStemsRef.current = stemsReady;
      setHasReadyStems(stemsReady);

      if (stemsReady && isPlayingRef.current) {
        const handoffSec =
          !wasReadyBefore && hasValidAudioSrc(master) && !master.paused
            ? master.currentTime || currentTimeRef.current
            : currentTimeRef.current;
        safePause(master, 'master');
        applyAudioVolumesAndRate();
        targetStemIds.forEach((id) => {
          const a = stemRefs.current[id];
          if (a && hasValidAudioSrc(a) && a.paused) {
            safePlay(a, id, handoffSec);
          }
        });
      }

      await Promise.all([...stemLoadPromises, ...(masterLoadPromise ? [masterLoadPromise] : [])]);
      if (cancelled) return;
    };

    hydrateStemsAndAck();

    return () => {
      cancelled = true;
    };
  }, [
    song.id,
    song.trackKey,
    song.masterAudioUrl,
    song.stage3Status,
    song.source,
    stemSignature,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  // Apply volume, mute, solo, master mute, and playbackSpeed across all active audio elements
  useEffect(() => {
    applyAudioVolumesAndRate();
  }, [channels, playbackSpeed, isMasterMuted, applyAudioVolumesAndRate]);

  // Synchronized Metronome Click Trigger on every beat / downbeat
  useEffect(() => {
    if (!isPlaying || isMasterMuted || song.source === 'empty') {
      lastClickedBeatIdxRef.current = -1;
      return;
    }

    const metroCh = channels.find((c) => c.category === 'metronome');
    const isAnySolo = channels.some((c) => c.isSolo);
    const metroAudible =
      metroCh && !metroCh.isMuted && (!isAnySolo || metroCh.isSolo) && metroCh.volume > 0.01;
    if (!metroAudible || !metroCh) return;

    if (song.beats && song.beats.length > 0) {
      let beatIdx = -1;
      for (let i = 0; i < song.beats.length; i++) {
        if (song.beats[i].timeSec <= currentTimeSec + 0.025) {
          beatIdx = i;
        } else {
          break;
        }
      }
      if (beatIdx >= 0 && beatIdx !== lastClickedBeatIdxRef.current) {
        const beat = song.beats[beatIdx];
        if (Math.abs(currentTimeSec - beat.timeSec) < 0.14) {
          triggerMetronomeClick(Boolean(beat.isDownbeat), metroCh.volume);
        }
        lastClickedBeatIdxRef.current = beatIdx;
      }
    } else if (song.tempoBpm > 0) {
      const secPerBeat = 60 / song.tempoBpm;
      const beatIdx = Math.floor(currentTimeSec / secPerBeat);
      if (beatIdx >= 0 && beatIdx !== lastClickedBeatIdxRef.current) {
        triggerMetronomeClick(beatIdx % 4 === 0, metroCh.volume);
        lastClickedBeatIdxRef.current = beatIdx;
      }
    }
  }, [isPlaying, isMasterMuted, currentTimeSec, channels, song.beats, song.tempoBpm, song.source, triggerMetronomeClick]);

  // Time update & section/bar loop watcher (50ms precision so loop boundaries never slip)
  useEffect(() => {
    if (!isPlaying) return;

    const stopPlaybackAtEnd = () => {
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a) {
          safePause(a, id);
          if (hasValidAudioSrc(a)) {
            try {
              a.load();
            } catch {
              a.currentTime = 0;
            }
          }
        }
      });
      if (masterAudioRef.current) {
        safePause(masterAudioRef.current, 'master');
        if (hasValidAudioSrc(masterAudioRef.current)) {
          try {
            masterAudioRef.current.load();
          } catch {
            masterAudioRef.current.currentTime = 0;
          }
        }
      }
      applyAudioVolumesAndRate();
      prevTimeRef.current = 0;
      setCurrentTimeSec(0);
      setIsPlaying(false);
    };

    const enforceLoopOrUpdateTime = () => {
      if (readyStemsRef.current) {
        const leader = Object.values(stemRefs.current).find((a) => hasValidAudioSrc(a));
        if (leader) {
          const t = leader.currentTime;
          const prevT = prevTimeRef.current;
          prevTimeRef.current = t;
          const audioDur =
            Number.isFinite(leader.duration) && leader.duration > 0
              ? leader.duration
              : song.durationSec;
          const reachedEnd =
            leader.ended || (audioDur > 0 && t >= audioDur - 0.05 && leader.paused);

          if (loopRangeSec) {
            const [loopStart, loopEnd] = loopRangeSec;
            if (
              reachedEnd ||
              (prevT <= loopEnd && t >= loopEnd - 0.04) ||
              (t >= loopEnd && t <= loopEnd + 0.5)
            ) {
              Object.entries(stemRefs.current).forEach(([id, a]) => {
                if (a && hasValidAudioSrc(a)) {
                  a.currentTime = loopStart;
                  if (a.paused) {
                    a.playbackRate = playbackSpeed;
                    safePlay(a, id);
                  }
                }
              });
              prevTimeRef.current = loopStart;
              setCurrentTimeSec(loopStart);
              return;
            }
          } else if (reachedEnd) {
            stopPlaybackAtEnd();
            return;
          }

          setCurrentTimeSec(t);
          return;
        }
      }

      if (readyMasterRef.current && masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
        const master = masterAudioRef.current;
        const t = master.currentTime;
        const prevT = prevTimeRef.current;
        prevTimeRef.current = t;
        const audioDur =
          Number.isFinite(master.duration) && master.duration > 0
            ? master.duration
            : song.durationSec;
        const reachedEnd =
          master.ended || (audioDur > 0 && t >= audioDur - 0.05 && master.paused);

        if (loopRangeSec) {
          const [loopStart, loopEnd] = loopRangeSec;
          if (
            reachedEnd ||
            (prevT <= loopEnd && t >= loopEnd - 0.04) ||
            (t >= loopEnd && t <= loopEnd + 0.5)
          ) {
            master.currentTime = loopStart;
            if (master.paused) {
              master.playbackRate = playbackSpeed;
              safePlay(master, 'master');
            }
            prevTimeRef.current = loopStart;
            setCurrentTimeSec(loopStart);
            return;
          }
        } else if (reachedEnd) {
          stopPlaybackAtEnd();
          return;
        }

        setCurrentTimeSec(t);
        return;
      }

      if (isLoadingStemsRef.current || isLoadingMasterRef.current) {
        return;
      }

      if (song.durationSec <= 0) {
        setIsPlaying(false);
        return;
      }

      setCurrentTimeSec((prev) => {
        const next = prev + 0.05 * playbackSpeed;
        if (loopRangeSec) {
          const [loopStart, loopEnd] = loopRangeSec;
          if (prev <= loopEnd && next >= loopEnd) {
            return loopStart;
          }
        }
        if (next >= song.durationSec) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    };

    const interval = window.setInterval(enforceLoopOrUpdateTime, 50);
    return () => window.clearInterval(interval);
  }, [
    isPlaying,
    hasReadyStems,
    hasReadyMaster,
    loopRangeSec,
    playbackSpeed,
    song.durationSec,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  const togglePlay = useCallback(() => {
    if (song.source === 'empty') return;

    if (isPlaying) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a) safePause(a, id);
      });
      if (masterAudioRef.current) safePause(masterAudioRef.current, 'master');
      return;
    }

    let targetSec = currentTimeRef.current;
    if (loopRangeSec && (targetSec < loopRangeSec[0] || targetSec >= loopRangeSec[1])) {
      targetSec = loopRangeSec[0];
    } else if (!loopRangeSec && song.durationSec > 0 && targetSec >= song.durationSec - 0.15) {
      targetSec = 0;
    }

    if (targetSec !== currentTimeRef.current) {
      currentTimeRef.current = targetSec;
      setCurrentTimeSec(targetSec);
    }

    isPlayingRef.current = true;
    setIsPlaying(true);
    applyAudioVolumesAndRate();

    if (readyStemsRef.current) {
      if (masterAudioRef.current) safePause(masterAudioRef.current, 'master');
      Object.entries(stemRefs.current).forEach(([id, a]) => {
        if (a && hasValidAudioSrc(a)) {
          safePlay(a, id, targetSec);
        }
      });
      return;
    }

    if (readyMasterRef.current && masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
      safePlay(masterAudioRef.current, 'master', targetSec);
    }
  }, [
    song.source,
    isPlaying,
    loopRangeSec,
    song.durationSec,
    applyAudioVolumesAndRate,
    safePlay,
    safePause
  ]);

  const seekToSec = useCallback(
    (sec: number) => {
      const clamped = Math.max(0, Math.min(sec, song.durationSec || 300));
      setCurrentTimeSec(clamped);
      if (masterAudioRef.current && hasValidAudioSrc(masterAudioRef.current)) {
        masterAudioRef.current.currentTime = clamped;
      }
      Object.values(stemRefs.current).forEach((a) => {
        if (a && hasValidAudioSrc(a)) a.currentTime = clamped;
      });
    },
    [song.durationSec]
  );

  const setChannelVolume = useCallback((id: StemId, volume: number) => {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, volume } : c)));
  }, []);

  const toggleMute = useCallback((id: StemId) => {
    setActivePreset('full');
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, isMuted: !c.isMuted } : c)));
  }, []);

  const toggleSolo = useCallback((id: StemId) => {
    setActivePreset('full');
    setChannels((prev) => {
      const target = prev.find((c) => c.id === id);
      const nextSolo = !target?.isSolo;
      return prev.map((c) => ({ ...c, isSolo: c.id === id ? nextSolo : false }));
    });
  }, []);

  const applyMixPreset = useCallback((preset: MixPresetId) => {
    setActivePreset(preset);
    setChannels((prev) =>
      prev.map((c) => {
        if (c.category === 'metronome') {
          return c;
        }
        if (preset === 'full') {
          return { ...c, isMuted: false, isSolo: false };
        }
        if (preset === 'guitar_backing') {
          return { ...c, isMuted: c.category === 'guitar', isSolo: false };
        }
        if (preset === 'vocal_karaoke') {
          return { ...c, isMuted: c.category === 'vocals', isSolo: false };
        }
        if (preset === 'guitar_focus') {
          return { ...c, isMuted: false, isSolo: c.category === 'guitar' };
        }
        if (preset === 'rhythm_section') {
          return { ...c, isMuted: c.category !== 'bass' && c.category !== 'drums', isSolo: false };
        }
        return c;
      })
    );
  }, []);

  const resetChannels = useCallback(() => {
    setActivePreset('full');
    setChannels((prev) =>
      prev.map((c) => {
        const vis = CATEGORY_VISUALS[c.category] || CATEGORY_VISUALS.other;
        return {
          ...c,
          volume: vis.defaultVolume,
          isMuted: c.category === 'metronome' ? c.isMuted : false,
          isSolo: false
        };
      })
    );
  }, []);

  const isMetronomeActive = Boolean(
    channels.find((c) => c.category === 'metronome' && !c.isMuted)
  );

  const toggleMetronome = useCallback(() => {
    setChannels((prev) =>
      prev.map((c) =>
        c.category === 'metronome'
          ? { ...c, isMuted: !c.isMuted, volume: c.volume <= 0.05 ? 0.7 : c.volume }
          : c
      )
    );
  }, []);

  const toggleMasterMute = useCallback(() => {
    setIsMasterMuted((prev) => !prev);
  }, []);

  return {
    isPlaying,
    isMasterMuted,
    currentTimeSec,
    channels,
    activePreset,
    hasStemAudio,
    hasMasterAudio,
    isMetronomeActive,
    toggleMetronome,
    toggleMasterMute,
    togglePlay,
    seekToSec,
    setChannelVolume,
    toggleMute,
    toggleSolo,
    applyMixPreset,
    resetChannels
  };
}
