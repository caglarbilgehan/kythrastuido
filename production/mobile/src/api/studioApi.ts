import {
  BarChordItem,
  BeatItem,
  PipelineProgressStep,
  SongSection,
  StemId,
  StudioSong
} from '../types/studio';

// Configurable Production API Host for Android & iOS devices over LAN / Wi-Fi
let apiBaseUrl = 'http://localhost:8001';

export function setMobileApiBaseUrl(url: string) {
  apiBaseUrl = url.replace(/\/+$/, '');
}

export function getMobileApiBaseUrl(): string {
  return apiBaseUrl;
}

export const MOBILE_DEMO_SONG: StudioSong = {
  id: 'demo-billie-jean',
  source: 'demo',
  title: 'Michael Jackson — Billie Jean',
  artist: 'Michael Jackson',
  durationSec: 295.8,
  tempoBpm: 117.6,
  timeSignature: '4/4',
  keySignature: 'F# minor',
  primaryProgression: 'F#m → G#m → A → G#m → Bm → C#',
  totalBars: 32,
  sections: [
    { id: 'sec-1', name: 'Giriş (Intro)', rawLabel: 'intro', startBar: 1, endBar: 8, startSec: 0, endSec: 16.3 },
    { id: 'sec-2', name: 'Verse 1', rawLabel: 'verse', startBar: 9, endBar: 16, startSec: 16.3, endSec: 32.6 },
    { id: 'sec-3', name: 'Pre-Chorus', rawLabel: 'bridge', startBar: 17, endBar: 24, startSec: 32.6, endSec: 49.0 },
    { id: 'sec-4', name: 'Nakarat (Chorus)', rawLabel: 'chorus', startBar: 25, endBar: 32, startSec: 49.0, endSec: 65.3 }
  ],
  bars: Array.from({ length: 32 }, (_, idx) => {
    const barNum = idx + 1;
    const barDur = 2.04;
    const startSec = Number((idx * barDur).toFixed(2));
    const endSec = Number(((idx + 1) * barDur).toFixed(2));
    const cycle = ['F#m', 'G#m', 'A', 'G#m', 'F#m', 'G#m', 'Bm', 'C#'];
    const chord = cycle[idx % cycle.length];
    return {
      barNumber: barNum,
      startSec,
      endSec,
      durationSec: barDur,
      chord,
      subChords: [{ chord, startSec, endSec, durationSec: barDur }]
    };
  }),
  beats: Array.from({ length: 128 }, (_, bIdx) => ({
    beatNumber: (bIdx % 4) + 1,
    timeSec: Number((bIdx * 0.51).toFixed(2)),
    isDownbeat: bIdx % 4 === 0,
    barIndex: Math.floor(bIdx / 4)
  })),
  stems: {}
};

function cleanChord(raw: string | undefined): string {
  if (!raw || raw === 'N' || raw === 'N.C.') return 'N.C.';
  return raw.replace(':min', 'm').replace(':maj', '').replace(':', '');
}

export async function fetchMobileStudioSong(): Promise<StudioSong | null> {
  try {
    const res = await fetch(`${apiBaseUrl}/api/workbench/studio-bundle`);
    if (!res.ok) return null;
    const bundle = await res.json();
    const state = bundle?.state;
    if (!state?.has_session) return null;

    const s1 = bundle?.stage1 || {};
    const s2 = bundle?.stage2 || {};
    const s3 = bundle?.stage3 || {};

    const trackName = String(state.track_name || 'Stüdyo Oturumu');
    const durationSec = Number(state.duration_sec || 180);
    const tempoBpm = Number(s1.tempo_bpm ? Number(s1.tempo_bpm).toFixed(1) : 120.0);
    const timeSignature = String(s1.time_signature || '4/4');
    const keySignature = String(s2.key_signature || 'F# minor');

    const beats: BeatItem[] = Array.isArray(s1.beats)
      ? s1.beats.map((b: any, idx: number) => ({
          beatNumber: Number(b.beat_number || (idx % 4) + 1),
          timeSec: Number(b.time_sec || 0),
          isDownbeat: Boolean(b.is_downbeat || b.beat_number === 1),
          barIndex: Number(b.bar_index ?? Math.floor(idx / 4))
        }))
      : [];

    const rawBars = Array.isArray(s2.bars) ? s2.bars : [];
    const bars: BarChordItem[] = rawBars.map((b: any, idx: number) => ({
      barNumber: Number(b.bar_number || idx + 1),
      startSec: Number(b.start_sec || 0),
      endSec: Number(b.end_sec || 0),
      durationSec: Number(b.duration_sec || 2.0),
      chord: cleanChord(b.chord),
      subChords: []
    }));

    const rawSections = Array.isArray(s2.sections) ? s2.sections : [];
    const sections: SongSection[] = rawSections.map((sec: any, idx: number) => ({
      id: `sec-${idx + 1}`,
      name: String(sec.name || `Bölüm ${idx + 1}`),
      rawLabel: String(sec.raw_label || 'verse'),
      startBar: Number(sec.start_bar || 1),
      endBar: Number(sec.end_bar || bars.length),
      startSec: Number(sec.start_sec || 0),
      endSec: Number(sec.end_sec || durationSec)
    }));

    const stemIds: StemId[] = ['guitar', 'bass', 'drums', 'vocals', 'piano', 'other'];
    const stems: StudioSong['stems'] = {};
    const cacheBust = encodeURIComponent(trackName);
    const s3Stems = s3?.stems || {};

    for (const id of stemIds) {
      const info = s3Stems[id];
      const detected =
        typeof info?.detected === 'boolean'
          ? info.detected
          : info?.rms_dbfs !== undefined
          ? info.rms_dbfs > -48
          : true;
      stems[id] = {
        url: `${apiBaseUrl}/api/workbench/stream/${id}?track=${cacheBust}`,
        detected,
        rmsDbfs: info?.rms_dbfs,
        presenceLabel: detected ? 'Aktif Sinyal' : 'Ses Bulunmadı'
      };
    }

    return {
      id: `live-${trackName}`,
      source: 'live',
      title: trackName,
      artist: 'KythraStudio Mobile',
      durationSec,
      tempoBpm,
      timeSignature,
      keySignature,
      primaryProgression: s2.primary_progression || 'F#m → G#m → A',
      totalBars: bars.length,
      sections,
      bars,
      beats,
      masterAudioUrl: `${apiBaseUrl}/api/workbench/stream/master?track=${cacheBust}`,
      stems
    };
  } catch {
    return null;
  }
}

export async function analyzeYoutubeFromMobile(
  youtubeUrl: string,
  onStatus: (steps: PipelineProgressStep[], text: string) => void
): Promise<StudioSong> {
  const steps: PipelineProgressStep[] = [
    { stageNum: 1, title: '01 · Ölçü ve Tempo Tespiti', subtitle: 'BPM & Bar Izgarası', status: 'pending' },
    { stageNum: 2, title: '02 · Akor, Ton ve Şarkı Yapısı', subtitle: 'BTC Akor & Ton Analizi', status: 'pending' },
    { stageNum: 3, title: '03 · Makro Kanal Ayırma (6-Kanal)', subtitle: 'BS-RoFormer 6-Stem', status: 'pending' }
  ];

  onStatus([...steps], 'YouTube ses akışı indiriliyor...');
  const ingRes = await fetch(`${apiBaseUrl}/api/workbench/session/youtube`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: youtubeUrl.trim() })
  });
  if (!ingRes.ok) {
    throw new Error('YouTube bağlantısı indirilemedi.');
  }

  for (let i = 0; i < 3; i++) {
    steps[i] = { ...steps[i], status: 'running' };
  }
  onStatus([...steps], 'Paralel DAG Motoru çalışıyor (CPU + GPU eşzamanlı)...');
  const r = await fetch(`${apiBaseUrl}/api/workbench/run-all`, { method: 'POST' });
  if (!r.ok) throw new Error('Paralel DAG çözümleme hatası');
  const dagJson = await r.json();
  const resMap = dagJson?.results || {};
  for (let i = 0; i < 3; i++) {
    steps[i] = { ...steps[i], status: 'completed', summary: resMap[i + 1]?.summary };
  }
  onStatus([...steps], 'Paralel DAG çözümlemesi tamamlandı.');

  const song = await fetchMobileStudioSong();
  if (!song) throw new Error('Şarkı verisi alınamadı.');
  return song;
}
