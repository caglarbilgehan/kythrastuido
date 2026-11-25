# Harici Sistem Araştırması: Tablatür, DAW ve Ritim Projeleri

**Tarih:** 23 Kasım 2026  
**Konu:** KythraStudio için incelenen açık kaynaklı tablatür, egzersiz ve ritim kütüphaneleri.

---

## 1. LIUBINfighter / Obsidian-Tab-Flow
- **Depo Linki:** [https://github.com/LIUBINfighter/Obsidian-Tab-Flow](https://github.com/LIUBINfighter/Obsidian-Tab-Flow)
- **Teknoloji:** TypeScript, **AlphaTab.js**, AlphaTex, CodeMirror
- **Özet:** Obsidian içinde `.gp`, `.gp3`, `.gp4`, `.gp5`, `.gpx` ve `.atex` (AlphaTex) dosyalarını render eden, ses sentezleyici ile çalan ve metin tabanlı tab yazımı sağlayan açık kaynaklı eklenti.

### KythraStudio İçin Kazanımlar:
1. **Guitar Pro Dosyalarını Doğrudan Yükleme:**
   - AlphaTab'in yerleşik ikili yükleyicisi (`api.load(arrayBuffer)`) kullanılarak kullanıcının sürükleyip bıraktığı `.gp / .gp5 / .gpx` dosyalarının doğrudan stüdyoda tüm kanallarıyla açılması.
2. **Paylaşım Kartı (PNG Share-Card) & PDF:**
   - Notasyon tuvalini yüksek kaliteli görsel kart veya yazdırılabilir/paylaşılabilir PDF olarak dışa aktarma mekanizması.
3. **AlphaTex Syntax Highlighter:**
   - İleride kullanıcıya notayı metin olarak düzenleme olanağı sunmak istediğimizde CodeMirror tabanlı AlphaTex renklendirme motoru.

---

## 2. mbalyi / Smart Beat
- **Depo Linki:** [https://github.com/mbalyi/smart-beat](https://github.com/mbalyi/smart-beat)
- **Teknoloji:** TypeScript, Rust, Tauri, Web Audio, Guitar Pro / MusicXML / MIDI motoru
- **Özet:** Masaüstü platformlar için geliştirilmiş, Guitar Pro muadili modern, açık kaynaklı tam teşekküllü bir tablatür düzenleyicisi, mikser ve pratik stüdyosu.

### KythraStudio İçin Kazanımlar:
1. **Speed Trainer (Hız Eğitmeni):**
   - Loop modunda çalışırken her döngüde tempoyu otomatik olarak belirli bir oranda (örneğin her turda +%2 veya +%5) artıran hız geliştirme algoritması.
2. **İnteraktif Sanal Klavye (Virtual Fretboard) & Davul Kiti (Virtual Drumkit):**
   - Çalınan notaları gerçek zamanlı olarak gitar klavyesinde (fret/tel üzerinde) ve davul setinde (zil/trampet üzerinde) ışıklandıran etkileşimli görsel bileşenler.
3. **Masaüstü DAW Mikser Mimarisi:**
   - Mute/Solo, pan, ses seviyesi ve stem izolasyonunun tablatürle hassas zaman çizelgesi senkronizasyonu.
4. **AI Audio-to-Tab Akışı:**
   - Bizim Python backend'deki Demucs + Basic Pitch / Omnizart hattının modern masaüstü kullanıcı deneyimi karşılığı.

---

## 3. bali182 / Gonb (Game of Note Blossom)
- **Depo Linki:** [https://github.com/bali182/gonb](https://github.com/bali182/gonb)
- **Teknoloji:** TypeScript, **React**, **Vite**, **@coderline/alphatab**
- **Özet:** AlphaTab kullanarak nota okumayı (bono/solfej, bas ve sol anahtarı) kademeli adımlarla öğreten interaktif web uygulaması.

### KythraStudio İçin Kazanımlar:
1. **Akıllı Müzikal Egzersiz Üretici (Harmonic Generator):**
   - Rastgele anlamsız sesler yerine, armonik olarak tutarlı akor dizilimleri (I-IV-V, ii-V-I vb.) oluşturup üzerine seçilen gam ve nota sınırlarına göre ezgiler türeterek dinamik **AlphaTex** oluşturan algoritma.
2. **Kişiselleştirilmiş Pratik / Isınma Modu:**
   - Kullanıcının "Şu gamda egzersiz yapmak istiyorum" veya "Bas gitarda arpej çalışmak istiyorum" isteğine göre tek tıkla canlı tab üretebilen antrenman modülü.
3. **Vite + React + AlphaTab Entegrasyon Referansı:**
   - KythraStudio web istemcisiyle birebir aynı teknoloji yığınına sahip olduğu için temiz ve optimize entegrasyon referansı.

---

## 4. narghev / Drumforge
- **Depo Linki:** [https://github.com/narghev/drumforge](https://github.com/narghev/drumforge)
- **Teknoloji:** TypeScript, React, Web Audio API
- **Özet:** Davulcular için interaktif, kayan notasyonlu egzersizler (Double Bass Pyramid, paradiddles, rudiments), metronom alt bölümleri ve pratik zamanlayıcısı sunan web uygulaması.

### KythraStudio İçin Kazanımlar:
1. **Düşük Gecikmeli Web Audio Ritim Motoru:**
   - `AudioContext.currentTime` ile donanım saatine kilitlenerek tarayıcıda sıfır gecikmeli ve kayma yapmayan (jitter-free) metronom ve vuruş zamanlayıcısı.
2. **Davul Notasyonu & Rudiment Kütüphanesi:**
   - Davul kanalında ritim kalıplarını (Kick, Snare, Hi-hat, Tom) görsel olarak zenginleştirmek için pratik veri modelleri.
3. **Odak & Pratik Takip Sayacı (Practice Timer):**
   - Müzisyenin belirli bir şarkıda, soloda veya loop'ta ne kadar süre aralıksız pratik yaptığını ölçen şık odaklanma sayacı.

---

## Gelecek Entegrasyon Yol Haritası Önerisi:
- [ ] **Aşama 1 (Dosya Formatları):** Obsidian-Tab-Flow yaklaşımıyla `.gp / .gp5 / .gpx` dosyalarının sürükle-bırak desteği.
- [ ] **Aşama 2 (Pratik Araçları):** Smart Beat'ten esinlenilen **Speed Trainer** (loop başı tempo artırma) ve odak sayacı.
- [ ] **Aşama 3 (Görsel Rehber):** Nota altı dinamik **Fretboard (Gitar Klavyesi)** görselleştirmesi.
- [ ] **Aşama 4 (Eğitim Modu):** Gonb mimarisiyle akıllı armonik etüt & egzersiz türetici.
