import React from 'react';
import { StemChannel } from '../../../types/workbench';
import { Stage3MssData } from '../../../types/stages';
import { STEM_CHANNEL_ORDER, resolveInstrumentMeta } from '../../../constants/instruments';
import { MetricCard } from '../../ui/MetricCard';
import { MixerIcon, StemChannelIcon } from '../../icons';

interface Stage3MixerViewProps {
  channels?: StemChannel[];
  data?: Stage3MssData;
}

export const Stage3MixerView: React.FC<Stage3MixerViewProps> = ({ data }) => {
  const stemsData = data?.stems || {};
  const channelKeys =
    data?.channel_order && data.channel_order.length > 0
      ? data.channel_order
      : Object.keys(stemsData).length > 0
      ? Object.keys(stemsData)
      : STEM_CHANNEL_ORDER;
  const totalCount = channelKeys.length;
  const detectedCount =
    data?.detected_count ??
    Object.values(stemsData).filter((s) => s.detected !== false).length;
  const absentCount = Math.max(0, totalCount - (detectedCount || totalCount));
  const guitarSdr = data?.diagnostics?.guitar_sdr_db;
  const guitarIsolation = stemsData['guitar']?.isolation_confidence_pct;

  return (
      <div className="dev-stack">
        {/* 1. Studio Status & Navigation Banner */}
                <section className="m3-surface-card dev-status-banner">
                  <md-elevation></md-elevation>
                  <div className="dev-hero-copy">
                    <div className="dev-hero-badges">
                      <span className="m3-tonal-badge sm success">
                        BS-RoFormer-SW · {((data?.sampling_rate_hz || 44100) / 1000).toFixed(1)} kHz Hi-Fi
                      </span>
                      <span className="dev-aside-copy">Kalıcı Disk Oturumu</span>
                    </div>
                      <h3 className="md-typescale-title-large">
                        Akustik Kaynak Ayrıştırması & Varlık Tespiti
                      </h3>
                        <p className="dev-body-muted">
                          Yapay zeka ses motoru kanalları bağımsız olarak analiz etti. Parçada gerçek sinyali
                          bulunan enstrümanlar miksere aktarılırken, ses bulunmayan kanallar otomatik olarak devre
                          dışı bırakıldı.
                        </p>
                      </div>

                        <span className="m3-tonal-badge primary" style={{ height: 'auto', padding: '10px 14px', borderRadius: '14px' }}>
                          <MixerIcon size={18} />
                          <span>
                            Aktif kanalları mikslemek için alt oynatıcıdaki <strong>Mikser</strong>&apos;i açın
                          </span>
                    </span>
                </section>

                {/* 2. Telemetry Quick Stats Cards */}
                  <section className="dev-grid-4">
                    <MetricCard
                      label="Tespit Edilen Enstrümanlar"
                      icon={<md-icon style={{ color: 'var(--md-sys-color-primary)' }}>podcasts</md-icon>}
                      compactValue={true}
                      value={`${detectedCount} Aktif Kanal`}
                      subtitle={
            absentCount > 0 ? `${absentCount} kanalda ses bulunmadı` : 'Tüm enstrümanlar mevcut'
          }
        />
                      <MetricCard
                        label="Depolama Modu"
                        icon={<md-icon style={{ color: 'var(--md-sys-color-secondary)' }}>storage</md-icon>}
                        compactValue={true}
                        value="Kalıcı Disk"
                        subtitle="Kalıcı WAV Depolama"
                      />
                      <MetricCard
                        label="Gitar SDR Kazancı"
                        icon={<md-icon style={{ color: 'var(--md-sys-color-tertiary)' }}>developer_board</md-icon>}
                        tone="primary"
                        compactValue={true}
                        value={guitarSdr !== undefined ? `+${guitarSdr} dB SDR` : 'Hesaplandı'}
                        subtitle={
            guitarIsolation !== undefined ? `%${guitarIsolation} İzolasyon Skoru` : 'İzole Edildi'
          }
        />
                      <MetricCard
                        label="Sinyal Hazırlığı"
                        icon={<md-icon style={{ color: 'var(--dev-color-success)' }}>verified</md-icon>}
                        compactValue={true}
                        value={
                          data?.diagnostics?.amt_readiness === 'no_guitar_signal'
                            ? 'Sinyal Zayıf'
                            : 'Kullanıma Hazır'
                        }
                        subtitle="Temiz Transient Hattı"
                      />
                  </section>

                    {/* 3. Isolated Channel Cards Grid */}
                    <section className="dev-grid-3">
                      {channelKeys.map((key) => {
                        const stem = stemsData[key];
                        const categoryKey = stem?.category || key;
                        const meta = resolveInstrumentMeta(categoryKey);
                        const isDetected =
                          stem?.detected ??
                          (stem?.rms_dbfs !== undefined
                            ? stem.rms_dbfs > -48 && (stem.peak_dbfs ?? -60) > -40
                            : true);
                        const label = meta.label;
                        const role = stem?.role || meta.role;
                        const rms = stem?.rms_dbfs;
                        const peak = stem?.peak_dbfs;
                        const bufferMb = stem?.buffer_size_mb;
                        const isolation = stem?.isolation_confidence_pct;

                        return (
                          <div
                            key={key}
                            className={`m3-surface-card dev-stem-card ${!isDetected ? 'is-muted-stem' : ''}`}
                          >
                                  <md-elevation></md-elevation>

                                  <div className="dev-benchmark-top">
                                    <div className="dev-benchmark-name-wrap">
                                      <div className="dev-stem-icon-box">
                                        {isDetected ? (
                      <StemChannelIcon channelId={key} category={categoryKey} size={18} />
                                        ) : (
                      <md-icon style={{ color: 'var(--md-sys-color-outline)', fontSize: '18px' }}>
                        volume_off
                      </md-icon>
                                        )}
                                      </div>
                                        <div className="dev-modal-track-meta">
                                          <span className="dev-benchmark-name">{label}</span>
                                          <span className="dev-aside-copy" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {role}
                                          </span>
                                        </div>
                                      </div>

                                        <span className={`m3-tonal-badge sm ${isDetected ? 'success' : ''}`}>
                                          {isDetected ? '● Aktif Sinyal' : '○ Ses Bulunmadı'}
                                        </span>
                                    </div>

                                          <div className="dev-stem-metrics-box m3-tabular">
                                            <div className="dev-modal-track-meta">
                                              <span className="dev-aside-copy">RMS Enerji</span>
                                              <strong>
                                                {rms !== undefined ? (isDetected ? `${rms} dBFS` : `${rms} dBFS (Sessiz)`) : '-'}
                                            </strong>
                                          </div>
                                            <div className="dev-modal-track-meta">
                                              <span className="dev-aside-copy">Tepe (Peak)</span>
                                              <strong>{peak !== undefined ? `${peak} dBFS` : '-'}</strong>
                                            </div>
                                              <div className="dev-modal-track-meta">
                                                <span className="dev-aside-copy">Dosya Boyutu</span>
                                                <strong>{bufferMb !== undefined ? `${bufferMb} MB` : '-'}</strong>
                                              </div>
                                                  <div className="dev-modal-track-meta">
                                                    <span className="dev-aside-copy">İzolasyon Skoru</span>
                                                    <strong style={{ color: isDetected ? 'var(--dev-color-success)' : undefined }}>
                                                      {isDetected ? (isolation !== undefined ? `%${isolation}` : '-') : 'Sinyal Yok'}
                                                  </strong>
                                              </div>
                                            </div>

                                              <div className="dev-stem-footer">
                                                {isDetected ? (
                                                  <>
                                                      <code className="m3-mono dev-stage-op">/api/workbench/stream/{key}</code>
                                                      <span className="dev-io-flow" style={{ color: 'var(--dev-color-success)', fontWeight: 600 }}>
                                                        <md-icon style={{ fontSize: '15px' }}>check_circle</md-icon>
                                                        <span>Mikserde</span>
                                                      </span>
                                                    </>
                                                    ) : (
                                                    <>
                                                        <span className="dev-io-flow dev-aside-copy">
                                                          <md-icon style={{ fontSize: '15px' }}>volume_off</md-icon>
                                                          <span>Parçada Sinyal Yok</span>
                                                        </span>
                                                        <span className="dev-aside-copy">Çıkarıldı</span>
                                                      </>
                )}
                                                    </div>
                                                  </div>
                                                );
        })}
                                              </section>

                                                  <section className="m3-surface-card dev-ingest-card" style={{ gap: '10px' }}>
                                                    <md-elevation></md-elevation>
                                                    <div className="dev-section-header-title">
                                                      <md-icon style={{ color: 'var(--md-sys-color-primary)', fontSize: '18px' }}>
                                                        verified_user
                                                      </md-icon>
                                                      <span>Akustik Sızma (Bleed) ve İzolasyon Doğrulama Raporu</span>
                                                    </div>
                                                      <p className="dev-body-muted">
                                                        BS-RoFormer-SW modeli, sinyalsiz kanalları otomatik algılayarak{' '}
                                                        <strong>-48 dBFS eşiği altında</strong> kalan enstrümanları mikser konsoluna dahil etmez.
                                                        Bu filtreleme sayesinde yalnızca parçada gerçekten çalan enstrümanlar mikslenir.
                                                      </p>
                                                  </section>
                                                </div>
                                                );
};
