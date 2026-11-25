# KythraStudio — AI Bağlam Paketleri (NotebookLM · Google Stitch · Gemini)

Bu klasör, **KythraStudio** projesini **NotebookLM**, **Google Stitch** ve **Gemini (veya özel Gem)** ile kesintisiz ve yüksek bağlam doğruluğuyla konuşabilmen için hazırlanmış, yüklemeye hazır dosyaları içerir.

---

## Hangi Araca Hangi Dosyaları Yüklemelisin?

### 1. NotebookLM (Ürün, Strateji, Mimari & Doküman Merkezi)
Yeni bir Notebook oluştur ve şu dosyaları doğrudan **Kaynak (Source)** olarak yükle:
1. `docs/ai-context/notebooklm/01-urun-vizyon-ve-arastirma.md`
2. `docs/ai-context/notebooklm/02-mimari-dag-ve-backend.md`
3. `docs/ai-context/notebooklm/03-arayuzler-ve-kullanici-akislari.md`
4. *(İsteğe bağlı — kod detaylarına da soru sorabilmek için)*:
   - `docs/ai-context/gemini/codebase-backend.md`
   - `docs/ai-context/gemini/codebase-frontend.md`

> **İpucu:** NotebookLM'de *"V1 ile V2+ kapsam sınırı nedir?"*, *"8GB VRAM koruması nasıl çalışıyor?"* veya *"Sesli özet (Audio Overview) çıkar"* gibi akışlar için bu 3 özet dosya en yüksek kaliteyi verir.

---

### 2. Google Stitch (UI / UX Tasarım — Doğrudan Arayüz Aktarımı)
Hem **Web Studio** hem **Developer Workbench** uygulamalarındaki **tüm sayfaları, bileşenleri, tıklanınca açılan modalları, popover'ları, açılır menüleri, satır içi editörleri ve çalışma durumlarını** prompt yazmadan birebir Stitch'e (veya Figma'ya) aktarmanın **iki hazır yolu** var:

#### A) Tek Dosya Statik HTML/CSS Ekran Paketleri (`docs/ai-context/stitch/html/`)
Gerçek React bileşenlerinden ve Material 3 CSS token'larından otomatik üretilen **68 bağımsız HTML dosyası** (her biri sıfır JS ile tarayıcıda, Google Stitch'te ve Figma `html.to.design` eklentisinde birebir açılır — tümü hem `light` hem `dark` temada):

**Web Studio — 19 Etkileşimli Ekran × Açık/Koyu Tema (38 HTML Dosyası):**
- **Ana Ekranlar:**
  - `web-studio-active-{light|dark}.html` *(Aktif Stüdyo — Gitar Diyagramları & Karaoke)*
  - `web-studio-piano-{light|dark}.html` *(Aktif Stüdyo — Piyano 2-Oktav Diyagramı)*
  - `web-studio-ukulele-{light|dark}.html` *(Aktif Stüdyo — Ukulele + Capo 2)*
  - `web-studio-welcome-{light|dark}.html` *(Karşılama & Kütüphane Ekranı)*
- **Modallar & Açılır Menüler:**
  - `web-modal-upload-{light|dark}.html` *(Ses Dosyası Yükleme Diyaloğu)*
  - `web-modal-upload-loading-{light|dark}.html` *(Ses Dosyası Analiz İlerleme Diyaloğu)*
  - `web-dropdown-omnibox-{light|dark}.html` *(Omnibox Kütüphane Arama Açılır Menüsü)*
  - `web-dropdown-account-auth-{light|dark}.html` *(Hesap Kartı: Giriş Yap — Misafir)*
  - `web-dropdown-account-signup-{light|dark}.html` *(Hesap Kartı: Kayıt Ol — Yeni Hesap)*
  - `web-dropdown-account-user-{light|dark}.html` *(Hesap Kartı: Favorilerim)*
  - `web-dropdown-account-uploads-{light|dark}.html` *(Hesap Kartı: Özel Yüklemelerim)*
  - `web-dropdown-account-profile-{light|dark}.html` *(Hesap Kartı: Profil & Şifre Ayarları)*
- **Alt Docker Popover'lar, Editörler & Satır İçi Durumlar:**
  - `web-popover-mixer-{light|dark}.html` *(6-Kanal BS-RoFormer Stem Mikser Popover)*
  - `web-popover-instrument-{light|dark}.html` *(Enstrüman Seçici Popover)*
  - `web-popover-speed-{light|dark}.html` *(Oynatma Hızı Kontrol Popover)*
  - `web-popover-settings-{light|dark}.html` *(Transpoze, Kapo, Akor Modu & Dil Popover)*
  - `web-panel-lyrics-editor-{light|dark}.html` *(Şarkı Sözü Düzenleyici & Revizyon Geçmişi)*
  - `web-inline-rename-loop-{light|dark}.html` *(Satır İçi Başlık Düzenleme + Özel Ölçü Döngüsü)*
  - `web-inline-confirm-delete-{light|dark}.html` *(Satır İçi Parça Silme Onayı)*

**Developer Workbench — 15 Etkileşimli Ekran × Açık/Koyu Tema (30 HTML Dosyası):**
- **Ana Ekranlar, Modallar & Popover'lar:**
  - `dev-empty-home-{light|dark}.html` *(Başlangıç Ekranı & Canlı İstek Akışı)*
  - `dev-modal-source-{light|dark}.html` *(Yeni Ses Kaynağı Yükleme Modalı)*
  - `dev-modal-source-loading-{light|dark}.html` *(Ses Kaynağı Yükleniyor Modalı)*
  - `dev-dropdown-sessions-{light|dark}.html` *(Çoklu Canlı Oturum Seçici Menüsü)*
  - `dev-popover-mixer-{light|dark}.html` *(Master Oynatıcı 6-Kanal Stem Mikser Popover)*
- **4 Aşama Tanı Görünümleri:**
  - `dev-stage1-beats-{light|dark}.html` *(Aşama 1: Ölçü & Tempo Zaman Çizelgesi — madmom)*
  - `dev-stage2-chords-{light|dark}.html` *(Aşama 2: Bölüm Haritası & Akor Izgarası — BTC + allin1)*
  - `dev-stage3-stems-{light|dark}.html` *(Aşama 3: 6-Kanal Stem & SDR Analizi — BS-RoFormer)*
  - `dev-stage4-lyrics-{light|dark}.html` *(Aşama 4: Kelime Bazlı Söz & Hizalama — Whisper + MMS_FA)*
- **Gözlemleme & Çalışma Durumları:**
  - `dev-tab-raw-json-{light|dark}.html` *(Ham JSON Çıktı İnceleyici)*
  - `dev-tab-console-{light|dark}.html` *(Canlı Sistem Konsolu)*
  - `dev-tab-requests-{light|dark}.html` *(Canlı API İstek & Açık Hata Detay Satırı)*
  - `dev-state-running-{light|dark}.html` *(Aşama Çalışıyor — Canlı İlerleme & Log)*
  - `dev-state-pending-{light|dark}.html` *(Aşama Beklemede & Eksik Bağımlılık Uyarısı)*
  - `dev-state-error-{light|dark}.html` *(Hata Şeridi & Başarısız Aşama Tanısı)*

- `index.html` *(Tüm 68 ekranı kategori bazlı tek sayfada önizleme galerisi)*

#### B) Canlı Demo URL'leri (Showcase Modu — Backend Gerektirmez)
- **Web Studio (`:3000`):** `?showcase=studio|piano|ukulele|welcome|upload|upload-loading|omnibox|account-auth|account-signup|account-user|account-uploads|account-profile|mixer|instrument|speed|settings|lyrics-editor|inline-rename|confirm-delete&theme=light|dark` *(isteğe bağlı `&lang=en`)*
- **Developer Workbench (`:5174`):** `?showcase=empty|source-modal|source-modal-loading|sessions-menu|mixer-popover|stage1|stage2|stage3|stage4|json|console|requests|running|pending|error&theme=light|dark`

*(İstersen yeni ekran varyasyonları üretmek için `docs/ai-context/stitch/stitch-design-system-and-prompts.md` içindeki tasarım sistemi özetini de yanına ekleyebilirsin.)*

---

### 3. Gemini & Özel Gem (Teknik Tartışma, Planlama & Kod İnceleme)
En akıcı kullanım için Gemini'de **"KythraStudio Mimarı"** adında bir **Gem** oluştur:
1. **Gem Talimatları (Instructions)** alanına `docs/ai-context/gemini/GEM_INSTRUCTIONS.md` içeriğini yapıştır.
2. **Bilgi (Knowledge) / Dosyalar** bölümüne şu dosyaları ekle:
   - `docs/ai-context/notebooklm/02-mimari-dag-ve-backend.md`
   - `docs/ai-context/notebooklm/03-arayuzler-ve-kullanici-akislari.md`
   - `docs/ai-context/gemini/codebase-backend.md`
   - `docs/ai-context/gemini/codebase-frontend.md`
   *(Alternatif olarak projen GitHub'daysa doğrudan Gemini sohbetine GitHub reponu da bağlayabilirsin.)*

---

## Kod Değiştikçe Paketleri Tek Komutla Güncelleme

```bash
npm run export:stitch   # 68 tek-dosya Stitch HTML/CSS ekranını (Web Studio + Developer) yeniden üretir
npm run export:context  # NotebookLM & Gemini kod paketlerini yeniler
```
