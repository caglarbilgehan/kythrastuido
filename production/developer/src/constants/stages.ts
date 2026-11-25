import { StageMetadata } from '../types/workbench';

export const DEFAULT_STAGES: StageMetadata[] = [
  {
    id: 1,
    title: 'Ölçü ve Tempo Tespiti',
    operation: 'Vuruş gücü ve metrik ızgara çıkarımı',
    input: 'Oturum Sesi (Disk)',
    output: 'beats.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Yok',
    diagnosticFocus:
      'Temponun yarıya veya iki katına kaymadığını ve ölçü başlarının (downbeat) bar çizgileriyle hizalandığını doğrulayın.'
  },
  {
    id: 2,
    title: 'Akor Tanıma ve Şarkı Yapısı',
    operation: 'Armonik akor tahmini, şarkı tonu ve yapısal bölümleme',
    input: 'Oturum Sesi + beats.json',
    output: 'chords.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Aşama 1 (bölümler için)',
    diagnosticFocus:
      'Şarkı tonunu (Key), akor geçiş doğruluğunu ve Giriş/Kıta/Nakarat sınırlarını kontrol edin.'
  },
  {
    id: 3,
    title: 'Makro Kanal Ayırma (BS-RoFormer)',
    operation: 'Çok kanallı zaman-frekans makro kaynak ayrıştırma',
    input: 'Oturum Sesi (Disk)',
    output: 'stems.json + İzole Kanallar',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Yok',
    diagnosticFocus:
      'Ayrıştırılan enstrüman kanallarını, akustik sızma (bleed) ve izolasyon skorlarını inceleyin. Miksaj için alt oynatıcıdaki Mikser butonunu kullanın.'
  },
  {
    id: 4,
    title: 'Otomatik Şarkı Sözü & Karaoke',
    operation: 'İzole vokal transkripsiyonu ve milisaniyelik CTC hizalama',
    input: 'İzole Vokal (stems/vocals.wav)',
    output: 'lyrics.json',
    status: 'pending',
    durationMs: 0,
    prerequisites: 'Aşama 3 (Vokal Kanalı)',
    diagnosticFocus:
      'Çıkarılan sözlerin doğruluğunu, dil tespitini ve kelime bazlı milisaniye zaman damgalarını kontrol edin.'
  }
];

export const STAGE_DEPENDENCIES: Record<number, { required: number[]; message: string }> = {
  4: {
    required: [3],
    message: 'Önce Aşama 3 (Makro Kanal Ayırma) çalıştırılarak izole vokal üretilmelidir.'
  }
};

export function formatStageDuration(ms: number): string {
  if (!ms || ms <= 0) return '0 sn';
  const sec = ms / 1000;
  if (sec < 60) {
    return `${sec.toFixed(1)} sn`;
  }
  const min = Math.floor(sec / 60);
  const remSec = Math.round(sec % 60);
  return `${min} dk ${remSec} sn`;
}
