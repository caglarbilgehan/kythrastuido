# 02 — KythraStudio Ne İşe Yarar? (4 Aşamalı Çözümleme Akışı)

KythraStudio'ya bir ses dosyası (`.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a` — en fazla 100 MB ve 10 dakika) yüklendiğinde, sistem şarkıyı **4 temel aşamalı üretim hattı** üzerinden çözümleyerek etkileşimli bir çalışma stüdyosuna dönüştürür.

---

## 4 Temel Çözümleme Aşaması

### 01 · Ölçü ve Tempo Tespiti
Her sağlıklı müzik çalışması sağlam bir ritim iskeleti gerektirir.
* Şarkının temposunu (**BPM**), vuruş noktalarını (**beats**), ölçü başlarını (**downbeats**) ve ölçü yapısını (ör. `4/4`, `3/4`) çıkarır.
* Stüdyodaki senkron metronom, ölçü numaraları, anlık vuruş nabzı ve ölçü bazlı döngü (loop) mekanizması bu aşamanın ürettiği zaman ekseni üzerinde çalışır.

### 02 · Akor Tanıma, Ton ve Şarkı Yapısı
Parçanın armonik haritasını ve genel formunu görünür kılar.
* Şarkı boyunca geçen akorları zaman damgalarıyla tespit eder; yalnızca temel majör/minör akorları değil, yedili ve uzantılı zengin akor yapılarını da yakalar.
* Şarkının genel tonunu (**key signature**) ve baskın akor yürüyüşünü belirler; akorları ölçülere ve ölçü içi alt geçişlere (sub-chords) hizalar.
* Şarkıyı **Intro, Verse, Chorus, Bridge, Outro** gibi yapısal bölümlere ayırır. Stüdyonun hızla açılması için önce hızlı bir bölüm taslağı sunar; 3. aşamada enstrüman kanalları ayrıştırıldığında bu kanalları kullanarak bölüm sınırlarını otomatik olarak daha hassas biçimde keskinleştirir.

### 03 · Makro Kanal Ayırma (BS-RoFormer · 6 Kanal)
Karışık bir kaydı tek bir ses yığını olarak bırakmaz; parçayı **6 bağımsız enstrüman/ses kanalına** ayırır:
* **Vokal**, **Gitar**, **Bas Gitar**, **Davul**, **Piyano** ve **Diğer (Ambiyans / Eşlik)**.
* Hangi kanallarda gerçek enstrüman sinyali bulunduğunu ses enerjisiyle analiz ederek bildirir.
* Bu sayede istediğiniz enstrümanı **Solo** alarak net biçimde dinleyebilir, kendi çaldığınız enstrümanı **Mute (Sessiz)** yaparak şarkının geri kalanıyla gerçek eşlik (backing track) üzerinde pratik yapabilir ya da tek tıkla hazır miks profillerini (*Tam Miks, Gitar Eşliği, Vokal Karaoke, Gitar Odağı, Ritim Bölümü*) kullanabilirsiniz.

### 04 · Otomatik Şarkı Sözü & Karaoke
Ayrıştırılmış temiz vokal kanalı üzerinden parçanın sözlerini çözümler ve şarkıyla birebir senkronize eder.
* İzole vokal kanalındaki aktif vokal aralıklarını algılar; tamamen enstrümantal parçaları ayırt ederek gereksiz halüsinasyon üretmez.
* Sözleri **kelime düzeyinde** zaman damgalarıyla hizalayarak canlı karaoke akışı oluşturur; tıklanan satırdan anında şarkının o anına atlama imkânı verir.
* Genel kütüphane şarkılarında senkronize söz kaynaklarıyla (LRCLIB) entegre çalışır; özel yüklemelerde veya sözü eksik parçalarda kullanıcıların sözleri düzenleyip sürüm geçmişiyle (revizyon kaydıyla) saklamasına olanak tanır.

---

## Aşamalı (Progresif) Çalışma ve Önbellek Avantajı

KythraStudio, bu 4 aşamayı kullanıcıyı bekletmeyecek şekilde akıllı bir akışla yürütür:
1. **Hızlı Açılış:** Yeni bir şarkı yüklendiğinde tempo/ölçü (Aşama 01) ve akor çözümlemesi (Aşama 02) tamamlanır tamamlanmaz stüdyo açılır; kullanıcı hemen akorları takip edip çalmaya başlayabilir.
2. **Arka Planda Tamamlama:** Kullanıcı stüdyodayken 6 kanallı ses ayrıştırması (Aşama 03), bölüm sınırlarının keskinleştirilmesi ve izole vokalden karaoke söz çıkarımı (Aşama 04) arka planda tamamlanıp arayüze canlı yansır.
3. **Anında Tekrar Açılış:** Bir kez analiz edilmiş parçalar hem veritabanı hem de kalıcı disk önbelleğinde saklanır; aynı şarkı tekrar açıldığında tüm aşamalar yeniden hesaplanmadan anında yüklenir.

---

## Stüdyoda Sunulan Günlük Pratik Araçları

4 aşamalı analizin üzerine müzisyenin günlük çalışma akışını tamamlayan araçlar eklenir:
* **Anlık Akor Diyagramları:** Gitar, piyano ve ukulele için çalan ve sıradaki akorun görsel basılış rehberi.
* **Transpoze, Kapo ve Akor Sadeleştirme:** Şarkıyı kendi ses veya çalım aralığınıza göre yarım tonlarla transpoze etme, kapo perdesine göre akor şekillerini otomatik uyarlama ve isterseniz karmaşık akorları temel akor görünümüne sadeleştirme.
* **Hız Kontrolü, Bölüm/Ölçü Döngüsü ve Metronom:** Zor pasajları yavaşlatma, tek bir bölümü veya özel ölçü aralığını sürekli tekrar etme ve şarkının temposuna kilitli metronomla çalışma.
* **Kişisel Kütüphane:** Kullanıcı hesabı, özel yüklenen parçaları yeniden adlandırma/silme, favoriler, özel çalma listeleri (playlist), Türkçe/İngilizce dil desteği ve açık/koyu tema.
