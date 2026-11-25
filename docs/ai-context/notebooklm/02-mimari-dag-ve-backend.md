# 02 — KythraStudio: Teknik Mimari, Paralel DAG Motoru ve Backend API

> **Hedef Kullanım:** NotebookLM & Gemini için sistem mimarisi, 4 aşamalı paralel akış, 8GB VRAM RTX 4060 güvenliği, SQLite şeması, API sözleşmesi ve canlı gözlemleme katmanı referansı.

---

## 1. Teknoloji Yığını & Çalışma Topolojisi

- **Backend:** Python 3.11+, FastAPI, Uvicorn (`127.0.0.1:8001`), PyTorch (CUDA / CPU fallback), SQLite (`storage/kythra_library.db`), FFmpeg.
- **Web Studio:** React 18, TypeScript, Vite (port `3000`), Pure Google Material 3 (`@material/web` — Tailwind kullanılmaz).
- **Developer Workbench:** React 18, TypeScript, Vite (port `5174`), Pure Google Material 3 (`@material/web`).
- **Mobile:** React Native / Expo (`production/mobile`).
- **Dağıtım:** `production/start.sh` (yerel GPU geliştirme) ve `production/docker-compose.yml` + `production/docker/api-gateway.conf` (Nginx + container topolojisi).
- **Pipeline Sürümü:** `APP_PIPELINE_VERSION = "1.2.0"` (kalıcı önbellek sürüm kontrolü için).
- **Yükleme Sınırları:** `.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a` | Maks. **100 MB** | Maks. **10 dakika (600 sn)**.

---

## 2. Birleşik Aşamalı Paralel DAG Motoru (`dag_orchestrator.py`)

Web Studio (`POST /api/workbench/prepare-studio`) ve Developer Workbench (`POST /api/workbench/run-all` / Üretim Akışı) birebir aynı hızlandırılmış DAG orkestratörünü kullanır:

### 4 Dalgalı Yürütme Akışı
1. **Dalga 1 (`t = 0 sn` — CPU + GPU Eşzamanlı):**
   - **CPU Thread 1:** Aşama 1 (`beat_madmom.py` — madmom DBN Beat/Downbeat Tracking).
   - **CPU Thread 2:** Aşama 2a ön işleme (`chords_btc.py` — BTC CQT özellik çıkarımı, model ağırlıkları başlangıçta CPU'da tutulur, CUDA çakışması yapmaz).
   - **GPU Thread:** Aşama 3 (`mss_demux.py` — BS-RoFormer SW 6-Kanal Ayırma: `vocals`, `guitar`, `bass`, `drums`, `piano`, `other`).
2. **⚡ İlk Stüdyo Açılışı / TTFO (`t ≈ 12–15 sn`):**
   - Aşama 1 + BTC akor çıkarımı + ton/ölçü hizalaması tamamlanır.
   - Hızlı başlangıç için `build_provisional_sections` ile geçici bölüm taslağı üretilir (`sections_refined: false`, `sections_refining: true`). `allin1` için gereksiz Demucs kesinlikle çalıştırılmaz.
   - Stüdyo kullanıcıya anında açılır (eski ~50 sn yerine 3–4 kat daha hızlı).
3. **Dalga 2 (`t ≈ 28–35 sn`):**
   - Arka plandaki Aşama 3 (BS-RoFormer 6-Stem) tamamlanır ve 6 WAV stem diske yazılır → Web Studio'da mikser kanalları canlı açılır.
4. **Dalga 3 & 4 (`t ≈ 35–48 sn` — Stem Paylaşımı):**
   - **Aşama 2b:** Aşama 3'ün ürettiği stem'ler doğrudan `allin1` bölüm analizine aktarılır (~3–4 sn), bölüm sınırları keskinleştirilir (`sections_refined: true`). Aşama 3 hata verirse pahalı Demucs fallback'e düşülmez, geçici bölümler korunur.
   - **Aşama 4:** `sections_refining` kapanmadan önce Aşama 4 `running` olarak işaretlenir (Web Studio polling boşluğunu önlemek için). İzole vokal stem'i `lyrics_hybrid.py` (`faster-whisper` `large-v3-turbo` + `torchaudio MMS_FA` zorunlu kelime hizalama) motorundan geçer (~7–10 sn). Genel kütüphane şarkılarında LRCLIB ile desteklenir.
- **Toplam Duvar Süresi:** ~115 sn → **~40–48 sn**. Önbellekteki şarkılarda **< 10 ms**.

---

## 3. RTX 4060 (8GB VRAM) Güvenlik Mimarisi

8GB VRAM'li kartlarda OOM ve 500 hatalarını kalıcı olarak önleyen katmanlar:
- **Tekil `GPU_LOCK` (`stages/registry.py`):** Aynı anda yalnızca tek bir CUDA inference işlemi çalışır (BS-RoFormer, BTC Transformer veya Whisper/MMS_FA birbirinin belleğini ezmez).
- **Otomatik CPU Offload (`gpu_guard.py` & engine'ler):** `mss_demux.py`, `chords_btc.py` ve `lyrics_hybrid.py` modelleri iş bitiminde (`finally:` bloğunda) ağırlıkları CPU RAM'e indirip `torch.cuda.empty_cache()` çağırır.
- **Otomatik VRAM Batch Boyutu & OOM Backoff (`mss_demux.py`):** `KYTHRA_MSS_BATCH_SIZE=0` (auto) modunda VRAM ≤9.5GB için `batch_size=2`, ≤16.5GB için `4`, >16.5GB için `8` seçilir; yine de CUDA OOM oluşursa otomatik daha düşük batch boyutuna düşer (`effective_batch_size` takip edilir).
- **AMP (FP16):** `KYTHRA_MSS_USE_AMP=1` ile yarı hassasiyetli bellek tasarrufu.
- **Hata İzolasyonu (`dag_orchestrator.py`):** Aşama 1 veya 3 çökerse kontrolsüz HTTP 500 yerine ilgili aşamanın durumu `error` olarak işaretlenir, loga yazılır ve istemciye temiz durum döner.

---

## 4. Kalıcı Depolama ve SQLite Şeması (`song_database.py`)

- **Disk Yapısı (`storage/`):**
  - `storage/kythra_library.db` — SQLite meta veri ve kullanıcı veritabanı.
  - `storage/tracks/<audio_hash>/` — Normalize edilmiş master WAV + 6 stem WAV dosyaları.
  - `storage/sessions/<session_id>/state.json` — Her kullanıcı oturumunun izole aşama durumları, aktif şarkısı, `last_active_at`, istemci kaynağı (`web`/`developer`) ve kullanıcı meta verisi.

### SQLite Tabloları (8 Tablo)
1. `analyzed_songs` — `audio_hash` anahtarıyla analiz edilmiş şarkıların meta verisi ve 1–4 aşama JSON önbellekleri.
2. `users` — Kullanıcı hesapları (`id`, `username`, `email`, `password_hash`, `role`: `'user'` veya `'developer'`).
3. `auth_tokens` — Bearer oturum belirteçleri.
4. `user_private_songs` — Kullanıcılara özel yüklemeler (yeniden adlandırma, silme).
5. `user_favorites` — Favori şarkılar.
6. `user_playlists` — Özel çalma listeleri.
7. `user_playlist_items` — Çalma listesi şarkı eşleşmeleri.
8. `lyric_revisions` — Şarkı sözü düzenleme sürüm geçmişi.

---

## 5. Canlı Gözlemleme (Observability) & Trafik İzleme Katmanı

- **`request_trace_service.py` + `api/main.py` Middleware:**
  - Thread-safe bellek içi halka tampon (son 500 HTTP isteği, sıfır disk yükü).
  - Her `/api/workbench/*` isteği için zaman, HTTP metodu, uç nokta, durum kodu, süre (ms), `X-Session-Id`, `X-Client-App` (`web` / `developer`), kullanıcı bilgisi/rolü, aktif şarkı ve hata detayını kaydeder.
  - **Gürültü Filtreleme (`_should_skip_trace`):** Developer telemetri polling'i ve Web Studio'nun `X-Request-Poll: 1` başlığıyla attığı başarılı (`status < 400`) arka plan polling istekleri izleme akışını kirletmez; ancak hata veren (`>= 400`) her istek mutlaka kaydedilir.
- **Oturum Bazlı Loglar (`log_service.py`):** Her log satırı `session_id` etiketi taşır; Developer Workbench ister tüm logları ister yalnızca seçili oturumun loglarını filtreleyebilir.

---

## 6. REST API Uç Noktaları (`/api/workbench/*`)

### Oturum, Analiz ve Kütüphane
- `GET /session` | `GET /state` — Aktif oturum durumunu ve aşama özetlerini döner.
- `POST /session/reset` — Oturumu sıfırlar.
- `POST /session/upload` — Ses dosyası yükler, FFmpeg ile normalize eder, hash üretir.
- `POST /session/load-track` — Kütüphane/benchmark şarkısını oturuma yükler.
- `POST /prepare-studio` — Web Studio birleşik aşamalı paralel akışı başlatır (önbellek varsa anında döner).
- `POST /run-all` — Developer Workbench paralel/tam akışı çalıştırır.
- `POST /stage/{stage_num}/run` | `POST /run/{stage_num}` — Tek bir aşamayı (1–4) bağımsız çalıştırır.
- `GET /stage/{stage_num}/data` — İlgili aşamanın ham JSON çıktısını döner.
- `GET /studio-bundle` — Web Studio için şarkı + tüm hazır aşama verilerini tek pakette döner.
- `GET /library` — Genel kütüphane + kullanıcının özel şarkılarını listeler.

### Kimlik Doğrulama & Kişisel Repertuvar
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PUT /auth/profile`
- `POST /account/favorites/toggle`
- `POST /account/playlists`, `DELETE /account/playlists/{playlist_id}`
- `POST /account/playlists/{playlist_id}/items`, `DELETE /account/playlists/{playlist_id}/items`
- `PUT /account/uploads/rename`, `DELETE /account/uploads`

### Şarkı Sözleri & Revizyonlar
- `PUT /lyrics` — Zaman damgalı şarkı sözü düzenlemesini kaydeder.
- `GET /lyrics/revisions` — Söz sürüm geçmişini döner.

### Developer Gözlemleme & Loglar
- `GET /telemetry/sessions` — Sunucudaki tüm aktif/son oturumları (kullanıcı, rol, istemci, şarkı, 1–4 aşama durumları) listeler.
- `GET /telemetry/requests` — Canlı HTTP istek & hata akışını (`since_id`, `session_id`, `only_errors`) döner.
- `POST /telemetry/requests/clear` — İstek akışını temizler.
- `GET /logs`, `POST /logs/clear` — Canlı sistem loglarını getirir/temizler.

---

## 7. Backend Modül Haritası (`production/backend/`)
- `api/main.py` — FastAPI uygulaması, CORS, HTTP Request Trace middleware, statik ses sunumu.
- `api/routes/workbench.py` — Tüm `/api/workbench/*` rotaları.
- `services/dag_orchestrator.py` — 4 dalgalı paralel DAG yürütücü.
- `services/workbench_service.py` — Oturum koordinasyonu, önbellek eşleştirme, stüdyo paketi.
- `services/ingestion_service.py` — Dosya doğrulama, FFmpeg normalizasyon, SHA-256 audio hash.
- `services/song_database.py` — SQLite veri erişim katmanı.
- `services/session_repository.py` — `storage/sessions/<id>/state.json` yönetimi.
- `services/lyrics_service.py` — LRCLIB entegrasyonu ve söz hizalama yardımcıları.
- `services/gpu_guard.py` — CUDA bellek boşaltma ve güvenlik yardımcıları.
- `services/request_trace_service.py` & `services/log_service.py` — Canlı izleme ve log servisleri.
- `engines/` — `beat_madmom.py`, `chords_btc.py`, `mss_demux.py`, `lyrics_hybrid.py`.
- `stages/` — `beat_tracking.py`, `chord_recognition.py`, `source_separation.py`, `lyrics_alignment.py`, `registry.py`.
- `domain/` — `chords.py`, `tunings.py`.
- `production/tests/` — API, DAG orkestratör, ingestion, lyrics/cache, repository, stage factory ve observability testleri.
