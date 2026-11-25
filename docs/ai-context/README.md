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

### 2. Google Stitch (UI / UX Tasarım & Ekran Prototipleme)
Stitch kod tabanından ziyade **Tasarım Sistemi + Ekran Prompt'ları + Referans Görseller** ile en iyi sonucu verir:
1. `docs/ai-context/stitch/stitch-design-system-and-prompts.md` dosyasını aç.
2. Tasarlamak istediğin ekranın **hazır Stitch prompt'unu** kopyala.
3. İlgili ekran için `docs/references/` klasöründeki (Moises, Songsterr, ChordMini, Guitar Ultimate) referans ekran görüntülerinden 1–2 tanesini Stitch'e görsel referans olarak ekle.

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

Kod tabanında büyük değişiklik yaptıktan sonra `codebase-backend.md` ve `codebase-frontend.md` dosyalarını tek komutla tazeleyebilirsin:

```bash
npm run export:context
```

Bu komut; fontları, soundfont'ları, `node_modules`, `dist`, `__pycache__`, lock dosyalarını ve görselleri otomatik dışarıda bırakarak tertemiz, AI bağlam penceresine uygun tek parça Markdown kod paketleri üretir.
