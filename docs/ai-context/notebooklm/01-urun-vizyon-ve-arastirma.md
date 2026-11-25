# 01 — KythraStudio: Ürün Vizyonu, Kapsam ve Harici Araştırmalar

> **Hedef Kullanım:** NotebookLM & Gemini için ürün vizyonu, V1 kapsam sınırları, kullanıcı profilleri ve V2+ yol haritası ana kaynağı.

---

## 1. KythraStudio Nedir ve Neyi Amaçlar?

Bir müzisyen bir şarkıyı beğendiğinde ve o şarkıya eşlik etmek istediğinde önünde her zaman aynı engel durur: **Pasif biçimde dinlenen ses kaydı ile aktif olarak çalınabilir, çalışılabilir müzikal yapı arasındaki boşluk.**

**KythraStudio**, bu boşluğu ortadan kaldırmak için tasarlanmıştır. Herhangi bir ses dosyasını (`.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a` — maks. 100 MB ve 10 dakika) alıp saniyeler içinde temposu, ölçüleri, akorları, şarkı bölümleri, 6 ayrı ses kanalı ve kelime bazlı senkron sözleriyle **doğrudan pratik yapılabilir bir stüdyo ortamına** dönüştürür.

### V1'de Çözdüğü 4 Somut Sorun
1. **Belirsiz Tempo, Ton ve Akor Akışı:** Şarkının sesinden doğrudan BPM, ölçü yapısı (`4/4`, `3/4`), ton (key signature) ve her ölçüye/alt geçişe hizalanmış akorları çıkarır.
2. **Karışık Kayıtta Kendi Enstrümanını Ayırt Edememe:** Kaydı **6 bağımsız ses kanalına** (*Vokal, Gitar, Bas Gitar, Davul, Piyano, Diğer*) ayırarak hem izole dinleme (Solo) hem gerçek eşlik/backing track (Mute) pratiği sunar.
3. **Bölümlere ve Zor Pasajlara Odaklanamama:** Intro, Verse, Chorus, Bridge, Outro bölümlerini otomatik işaretler; tek bir bölümü veya özel ölçü aralığını döngüye (loop) alıp hız kontrolü ve metronomla çalışmayı sağlar.
4. **Senkronize Olmayan veya Bulunmayan Şarkı Sözleri:** Ayrıştırılan izole vokalden kelime bazlı karaoke zamanlaması üretir; LRCLIB entegrasyonu ve revizyon geçmişli kullanıcı düzenleme desteği sunar.

### 4 Temel Tasarım İlkesi
- **Bekletmeden Çalışmaya Başlatma (Aşamalı / Progresif Akış):** Önce tempo/ölçü + akor analizini ~12–15 saniyede tamamlayıp stüdyoyu anında açar; 6-kanal ayırma, bölüm keskinleştirme ve söz çıkarımı arka planda canlı tamamlanır. Önbellekli şarkılar <10 ms'de açılır.
- **Tek Ortak Zaman Ekseni:** Tempo, ölçüler, akorlar, diyagramlar, şarkı bölümleri, 6 stem kanalı ve karaoke sözleri tek bir zaman eksenine kilitlidir.
- **Kişisel ve Düzenli Repertuvar:** İzole çalışma oturumları, kullanıcı hesapları (user/developer rolleri), özel yüklemeler, favoriler, çalma listeleri (playlist) ve söz revizyon geçmişi.
- **Önce Sağlam V1 Çekirdeği, Sonra Notasyon (V2+):** V1'de porte/sheet music ve tablatür (TAB) üretimi **kapsam dışıdır**; V1 tamamen 4 ana aşamayı üretim kalitesinde kusursuzlaştırmaya odaklanır.

---

## 2. 4 Aşamalı Çözümleme Akışı (V1 Çekirdeği)

| Aşama | Adı | Ne Üretir? | Stüdyo Karşılığı |
| :--- | :--- | :--- | :--- |
| **01** | **Ölçü ve Tempo Tespiti** | BPM, vuruş noktaları (`beats`), ölçü başları (`downbeats`), ölçü birimi (`4/4`, `3/4`) | Senkron metronom, vuruş nabzı (`1·2·3·4`), ölçü bazlı döngü |
| **02** | **Akor Tanıma, Ton ve Şarkı Yapısı** | Zengin/yedili akorlar (BTC Large Voca), şarkı tonu, ölçü içi alt akorlar (`sub-chords`), bölümler (önce hızlı taslak, Aşama 3 sonrası `allin1` ile keskinleştirilmiş) | Akor zaman çizelgesi, bölüm sekmeleri, Temel/Tümü akor sadeleştirme, transpoze & kapo |
| **03** | **Makro Kanal Ayırma (BS-RoFormer · 6 Kanal)** | Vokal, Gitar, Bas Gitar, Davul, Piyano, Diğer kanalları + kanal enerji/aktiflik tespiti | 6 kanallı mikser (Solo/Mute/Ses), hazır miks profilleri (*Tam Miks, Gitar Eşliği, Vokal Karaoke, Gitar Odağı, Ritim Bölümü*) |
| **04** | **Otomatik Şarkı Sözü & Karaoke** | İzole vokal üzerinden aktif vokal tespiti, kelime bazlı zaman damgaları, enstrümantal ayrımı | Canlı karaoke sahnesi, tıkla-atla, LRCLIB eşleşmesi, sürüm geçmişli söz düzenleyici |

---

## 3. Enstrümanlar ve Pratik Deneyimi (V1)

### Görsel Akor Diyagramı Sunulan Enstrümanlar
- **Gitar (6 Telli):** Klavye akor diyagramı, bare & parmak numaraları, kapo uyarlaması, pozisyon varyasyonları (kaydırma/tıklama ile).
- **Piyano & Klavye:** 2 oktavlık tuş takımı diyagramı, aktif nota vurgusu, transpoze uyumu.
- **Ukulele (4 Telli):** 4 telli klavye diyagramı, parmak numaraları, kapo uyarlaması ve varyasyonlar.

### Hedef Kullanıcılar
- **Gitaristler, Piyanistler, Ukulele Çalanlar:** Görsel akor rehberi, kapo/transpoze, kendi enstrümanını susturup çalma.
- **Vokalistler:** Vokali susturup kelime bazlı senkron karaoke ile çalışma ve söz düzenleme.
- **Bas Gitaristler & Davulcular:** 6-kanal mikserde izole ritim/groove dinleme, Ritim Bölümü ön ayarı, metronom ve loop.
- **Müzik Öğrencileri, Eğitmenler & Gruplar:** Hız kontrolü, bölüm/ölçü döngüsü ve ortak çalışma listeleri.

---

## 4. Uygulama Ekosistemi (3 İstemci + 1 Çekirdek)

1. **Web Studio (`production/web`):** Ana son kullanıcı stüdyosu (Google Material 3 tasarımı, TR/EN, açık/koyu tema).
2. **Developer Workbench (`production/developer`):** 4 aşamayı tek tek veya paralel çalıştırma, ham JSON/metrik inceleme, çoklu Web Studio oturumlarını canlı izleme (Session Switcher), canlı sistem logları ve canlı HTTP istek/hata trafiği gözlemleme merkezi.
3. **Mobil Uygulama (`production/mobile`):** Geliştirilme aşamasında (React Native / Expo); akor ızgarası, canlı akor kartı, bölüm geçişleri ve 6-kanal mikser alt sayfası.

---

## 5. V2+ Yol Haritası ve Harici Açık Kaynak Araştırmaları

V1 olgunlaştıktan sonra notasyon, tablatür ve ileri egzersiz yetenekleri için incelenen 4 açık kaynak referans:

1. **LIUBINfighter / Obsidian-Tab-Flow** *(TypeScript, AlphaTab.js, AlphaTex)*
   - Kazanım: `.gp / .gp5 / .gpx` Guitar Pro dosyalarını sürükle-bırak açma, PNG paylaşım kartı / PDF dışa aktarım, AlphaTex sözdizimi düzenleyici.
2. **mbalyi / Smart Beat** *(TypeScript, Rust, Tauri, Web Audio)*
   - Kazanım: **Speed Trainer** (her döngü turunda tempoyu +%2/+%5 otomatik artırma), etkileşimli **Virtual Fretboard** ve **Virtual Drumkit**, DAW mikser zaman çizelgesi.
3. **bali182 / Gonb (Game of Note Blossom)** *(React, Vite, @coderline/alphatab)*
   - Kazanım: Armonik olarak tutarlı (I-IV-V, ii-V-I) dinamik AlphaTex egzersiz/etüt üreteci; Vite+React+AlphaTab entegrasyon referansı.
4. **narghev / Drumforge** *(TypeScript, React, Web Audio API)*
   - Kazanım: `AudioContext.currentTime` tabanlı sıfır gecikmeli (jitter-free) ritim motoru, davul rudiment veri modeli ve pratik odak sayacı (Practice Timer).

### V2+ Hedefleri
- Enstrüman bazlı otomatik notasyon ve TAB (Gitar/Bas TAB, Piyano Grand Staff, Davul perküsyon notasyonu, Vokal/Melodi portesi + MIDI dışa aktarım).
- Çevrimiçi müzik kaynaklarından doğrudan çözümleme.
- Akor ve şarkı bölümleri için kullanıcı düzenleme + revizyon geçmişi.
