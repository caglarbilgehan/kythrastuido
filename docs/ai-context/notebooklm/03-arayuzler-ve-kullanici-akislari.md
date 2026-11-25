# 03 — KythraStudio: Web Studio, Developer Workbench ve Mobil Arayüz Haritası

> **Hedef Kullanım:** NotebookLM, Stitch ve Gemini için tüm istemci uygulamaları, ekran akışları, bileşen yapıları ve tasarım dili referansı.

---

## 1. Ortak Tasarım Sistemi (Pure Google Material 3)

Hem **Web Studio** (`production/web`) hem **Developer Workbench** (`production/developer`) aynı tasarım sistemini paylaşır:
- **Çerçeve:** `%100` Saf Google Material 3 (`@material/web` web bileşenleri) — sıfır Tailwind, sıfır üçüncü parti CSS framework.
- **Estetik Referans:** Google Workspace / Drive / Docs / Vids / Gemini yüzey hiyerarşisi.
- **Tipografi:** Brand: `Google Sans / Plus Jakarta Sans`, Body: `Google Sans Text / Plus Jakarta Sans`, Mono (Dev): `Roboto Mono`, İkonlar: `Material Symbols Outlined`.
- **Tema:** Açık (Light) ve Koyu (Dark) tema desteği (`data-theme="dark"`).
- **Dil:** Web Studio'da Türkçe (`tr`) ve İngilizce (`en`) tam çeviri desteği (`i18n/translations.ts`).

### Temel Renk Token'ları
| Token | Light Mode | Dark Mode | Kullanım |
| :--- | :--- | :--- | :--- |
| `primary` | `#0B57D0` | `#A8C7FA` | Ana vurgu, aktif akor, play butonu |
| `primary-container` | `#D3E3FD` | `#0842A0` | Aktif ölçü, aktif karaoke satırı, seçili aşama |
| `secondary` | `#00639B` | `#7FCFFF` | Sıradaki (next) akor, kapo etiketi |
| `tertiary` | `#E65100` | `#FFB74D` | Aktif Loop (döngü), aktif metronom, favori yıldız |
| `error` | `#B3261E` | `#F2B8B5` | Hata banner'ı, Master Mute aktif durumu |
| `surface` | `#F8FAFD` | `#131314` | Ana sayfa zemini |
| `surface-container-lowest` | `#FFFFFF` | `#0E0E0E` | Kart yüzeyleri, Footer Docker, Top Bar |
| `surface-container` | `#EEF0F4` | `#1E1F20` | Omnibox arama, nötr butonlar, segmented grup |
| `dev-success` *(Dev)* | `#146C2E` | `#81C995` | Tamamlanan aşama & QC geçiş rozeti |

---

## 2. Web Studio (`production/web`) — Ana Kullanıcı Uygulaması

### Kimlik & Ağ İletişimi
- Her istek `X-Client-App: web` ve oturuma özel `X-Session-Id` başlıklarıyla gönderilir.
- Arka planda Aşama 3, Aşama 2b (`sections_refining`) veya Aşama 4 devam ederken 1.5 sn aralıklı polling otomatik sürer ve bu istekler `X-Request-Poll: 1` ile işaretlenir; tamamlanan aşama sayfa yenilenmeden canlı yansır.
- Yerel Python backend (`127.0.0.1:8001`) kapalıyken Vite `resilientApiProxy` middleware'i hata fırlatmadan temiz çevrimdışı yanıt döner.

### Ana Ekranlar & Bileşenler
1. **`StudioHeader.tsx` (Üst Çubuk — Google Drive Tarzı):**
   - Marka logosu, **Omnibox arama çubuğu** (kütüphane ve özel yüklemelerde canlı arama + hazır durum rozeti), **Şarkı Yükle** açılır kartı/butonu, dil/tema seçici ve **Hesap açılır menüsü** (Giriş/Kayıt, Profil, Favoriler, Çalma Listeleri, Özel Yüklemelerim).
2. **`StudioWelcomeView.tsx` (Karşılama & Hızlı Başlangıç):**
   - Şarkı seçili değilken kullanıcıya kütüphane kartları, sürükle-bırak yükleme alanı ve 4 aşamalı akış özeti sunar.
3. **`StudioUploadDialog.tsx` (Yükleme Kartı):**
   - Sürükle-bırak ses dosyası seçimi, şarkı adı/sanatçı meta verisi, dosya boyutu/format doğrulama ve aşamalı yükleme geri bildirimi.
4. **`SongInfoStrip.tsx` (Şarkı Bilgi Şeridi):**
   - Şarkı adı, favori yıldızı, BPM, Ton (Key), Ölçü Birimi (`4/4`), analiz durumu rozetleri (ör. kanallar ayrıştırılıyor / sözler hazırlanıyor).
5. **`FocusedChordWorkspace.tsx` + `InstrumentChordDiagram.tsx` (Canlı Akor Sahnesi & Zaman Çizelgesi):**
   - **Üst 2 Sütunlu Hero Grid (7fr / 5fr):**
     - Sol: **Önceki / Aktif / Sıradaki Akor** akışı + canlı vuruş nabzı (`1 · 2 · 3 · 4`).
     - Sağ: Seçili enstrümana göre (Gitar 6 tel, Piyano 2 oktav, Ukulele 4 tel) **Aktif & Sıradaki Görsel Akor Diyagramı** (kapo etiketi, tıklama/kaydırma ile alternatif pozisyon noktaları).
   - **Alt Birleşik Bölüm & Ölçü Kartı:**
     - Yatay kaydırılabilir **Bölüm Sekmeleri** (Intro, Verse, Chorus, Bridge, Outro — döngüdeki bölüm turuncu `tertiary` vurgulu).
     - 12 sütunlu kompakt **Ölçü/Akor Izgarası** (tıkla-atla, ölçü aralığı döngüsü, aktif ölçü ilerleme çubuğu).
6. **`KaraokeLyricsStage.tsx` (Kelime Bazlı Karaoke & Söz Düzenleyici):**
   - Otomatik kayan satır görünümü, aktif satırda kelime/ilerleme vurgusu, tıklayınca o ana atlama.
   - Dahili **Söz Düzenleme Paneli:** Zaman damgası basma, bölüm etiketleme, kaydetme ve revizyon geçmişini görüntüleme.
7. **`FooterDockerControlCenter.tsx` + `useStemAudio.ts` (Sabit Alt Kontrol Merkezi — Google Vids Tarzı):**
   - Yüzen tam yuvarlak (pill) kontrol çubuğu: Oynat/Duraklat, Geri/İleri, **Loop**, **Metronom**, etkileşimli **Dalga Formu (Waveform) Scrubber** (loop bölgesi vurgulu).
   - Yukarı açılan **Popover Kartları:**
     - **6-Kanal Stem Mikser:** Vokal, Gitar, Bas, Davul, Piyano, Diğer için ses sürgüsü, Solo/Mute ve tek tık hazır miks profilleri.
     - **Enstrüman & Akor Ayarları:** Gitar/Piyano/Ukulele seçimi, Transpoze (± yarım ton), Kapo (0–11), Temel/Tümü akor modu.
     - **Oynatma Hızı:** %50–%125 hız kontrolü.
   - `useStemAudio.ts` + `clientAudioCache.ts`: Web Audio API tabanlı senkron çoklu kanal oynatma, tarayıcı içi ses önbelleği ve donanım saatine bağlı metronom.

---

## 3. Developer Workbench (`production/developer`) — Gözlemleme & Tanı Merkezi

Developer uygulaması izole bir test aracı değil, **Web Studio'da kullanıcıların (ve developer hesabının) yaptığı tüm oturumları ve 4 aşamalı analizleri canlı izleyip hata ayıklayabileceğin Gözlemleme Konsolu**dur.

### Yerleşim & Ana Bileşenler
- **`Header.tsx` + `SessionSwitcher.tsx`:**
  - Sunucudaki tüm oturumları (`sess_...`, `default`) kullanıcı adı, **Developer** rozeti, istemci türü (`web`/`developer`), aktif şarkı ve aşama durumuyla listeler; tek tıkla o oturuma bağlanılır.
  - Üst çubukta hızlı **Üretim Akışı (Paralel)** çalıştırma, tema değiştirme ve kaynak seçim modalı (`SourceSelectModal.tsx`).
- **Sol Ray — `PipelineRail.tsx` (300px):**
  - 4 aşamanın (01 Ölçü/Tempo, 02 Akor/Yapı, 03 6-Kanal Ayırma, 04 Söz/Karaoke) durum, süre ve bağımlılık göstergeleri + hızlı geçiş.
- **Sağ İnceleme Alanı (`Inspector/`):**
  - **`GlobalPipelineTracker.tsx` & `InspectorHeader.tsx`:** Aşama girdi/çıktı akışı, tek aşama çalıştırma, eksik bağımlılık uyarısı, sekmeler: **Görsel İnceleme**, **Ham JSON (`RawJsonViewer.tsx`)**, **Canlı Konsol**, **İstekler (Telemetry)**.
  - **Aşama Görünümleri (`Inspector/stages/`):**
    - `Stage1BeatView.tsx`: Ölçü/vuruş zaman çizelgesi ve alt vuruş çipleri.
    - `Stage2ChordView.tsx` (`SectionFormGrid.tsx` + `LeadSheetChordGrid.tsx`): Bölüm haritası ve lead-sheet akor ızgarası.
    - `Stage3MixerView.tsx`: 6 kanalın RMS/aktiflik metrikleri ve izole dinleme kartları.
    - `Stage4LyricsView.tsx`: Zaman damgalı satırlar, kelime güven/hizalama incelemesi.
  - **`StudioConsoleView.tsx`:** Gerçek zamanlı terminal log akışı + seviye filtresi + arama + **"Sadece Seçili Oturum" / "Tüm Oturumlar"** oturum bazlı filtre düğmesi.
  - **`RequestTraceView.tsx`:** Canlı HTTP istek & hata trafiği tablosu (zaman, metot, endpoint, HTTP durum kodu, gecikme ms, oturum, kullanıcı/rol, hata detayı) + **"Sadece Hatalar"** filtresi ve temizleme.
- **Alt Oynatıcı — `MasterAudioPlayer.tsx` (`WaveformScrubber.tsx`, `StemMixerPopover.tsx`):**
  - Seçili oturumun şarkısını dalga formu ve 6-kanal mikserle canlı dinleyip tüm aşama görünümleriyle senkron test etme.

---

## 4. Mobil Uygulama (`production/mobile`) — Prototip Durumu

React Native / Expo tabanlı mobil istemci (`production/mobile/src/`):
- **Tema:** Web Studio ile aynı Material 3 renk token'ları (`src/theme/material3.ts`).
- **Mevcut Bileşenler:**
  - `MobileLiveChordCard.tsx` — Canlı aktif & sıradaki akor kartı.
  - `MobileSectionPills.tsx` — Yatay bölüm geçiş ve döngü çipleri.
  - `MobileChordGrid.tsx` — Mobil uyumlu ölçü/akor ızgarası.
  - `MobileStemMixerSheet.tsx` — Aşağıdan açılan 6-kanal stem mikser sayfası.
- **API & Müzik Teorisi:** `studioApi.ts` ve `musicTheory.ts` ile Web Studio veri sözleşmesini paylaşır.
