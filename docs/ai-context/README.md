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
Mevcut Web Studio ekranlarını prompt yazmadan birebir Stitch'e (veya Figma'ya) aktarmanın **iki hazır yolu** var:

#### A) Tek Dosya Statik HTML/CSS Ekran Paketleri (`docs/ai-context/stitch/html/`)
Gerçek Web Studio React bileşenlerinden ve Material 3 CSS token'larından otomatik üretilen **6 bağımsız HTML dosyası** (her biri sıfır JS ile tarayıcıda, Google Stitch'te ve Figma `html.to.design` eklentisinde birebir açılır):
- `web-studio-active-light.html` / `web-studio-active-dark.html` *(Aktif Stüdyo)*
- `web-studio-mixer-light.html` / `web-studio-mixer-dark.html` *(6-Kanal Stem Mikser Açık)*
- `web-studio-welcome-light.html` / `web-studio-welcome-dark.html` *(Karşılama & Kütüphane)*
- `index.html` *(Tüm 6 ekranı tek sayfada önizleme galerisi)*

#### B) Canlı Demo URL'leri (Showcase Modu — Backend Gerektirmez)
Uygulama adresinin sonuna aşağıdaki parametreleri ekleyerek doğrudan Stitch'e URL olarak verebilir veya yüksek çözünürlüklü ekran görüntüsü alabilirsin:
- `?showcase=studio&theme=light` | `?showcase=studio&theme=dark`
- `?showcase=mixer&theme=light` | `?showcase=mixer&theme=dark`
- `?showcase=welcome&theme=light` | `?showcase=welcome&theme=dark`
*(İsteğe bağlı `&lang=en` veya `&instrument=piano|ukulele` parametreleri de desteklenir.)*

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
npm run export:stitch   # 6 tek-dosya Stitch HTML/CSS ekranını gerçek bileşenlerden yeniden üretir
npm run export:context  # NotebookLM & Gemini kod paketlerini yeniler
```
