# 04 — Kimler İçindir, Ekosistem ve Gelecek Vizyonu

## Kimler İçindir?

**KythraStudio Versiyon 1**, bir şarkıyı yalnızca dinlemekle kalmayıp onunla birlikte çalmak, söylemek, prova etmek veya müzikal yapısını hızla çözmek isteyen herkes için tasarlanmıştır:

* **Gitaristler, Piyanistler ve Ukulele Çalanlar:**
  Şarkının temposunu, tonunu, bölümlerini ve ölçülere hizalanmış akorlarını görsel diyagramlarla takip etmek; kapo ve transpoze ayarlarıyla kendi rahat pozisyonunda çalmak ve kendi enstrümanını kapatıp backing track üzerine pratik yapmak isteyen icracılar.
* **Vokalistler ve Şarkı Söyleyenler:**
  Orijinal kayıttan vokali kapatarak temiz bir eşlik elde etmek, izole vokalden üretilen kelime bazlı karaoke sözleriyle senkron prova yapmak ve gerektiğinde sözleri düzenleyip kendi repertuvarında saklamak isteyenler.
* **Bas Gitaristler ve Davulcular:**
  6 kanallı mikserle bas veya davulu tek başına dinleyip ritim/groove yapısını çözmek, kendi kanalını susturup grubun geri kalanıyla senkron metronom ve bölüm döngüsü eşliğinde çalışmak isteyen müzisyenler.
* **Müzik Öğrencileri ve Eğitmenler:**
  Gerçek şarkılar üzerinden tempo, ölçü, akor geçişi ve şarkı formu (Intro/Verse/Chorus/Bridge) çalışmak; zor pasajları yavaşlatıp belirli ölçü aralıklarını tekrar ederek adım adım ilerlemek isteyenler.
* **Müzik Grupları:**
  Prova edilecek parçalar için ortak bir tempo, akor yürüyüşü ve bölüm haritası etrafında hızla hizalanmak ve favori/çalma listeleriyle ortak çalışma repertuvarı oluşturmak isteyen ekipler.

---

## Mevcut Uygulama Ekosistemi (V1)

KythraStudio, tek bir çekirdek çözümleme servisi etrafında üç farklı arayüz katmanıyla geliştirilir:

1. **Web Studio (Ana Kullanıcı Stüdyosu):**
   Şarkı yükleme, 4 aşamalı analiz, akor zaman çizelgesi, gitar/piyano/ukulele diyagramları, 6 kanallı stem mikser, kelime bazlı karaoke, söz düzenleme/revizyon takibi ve kullanıcı kütüphanesi (favoriler, çalma listeleri, özel yüklemeler) sunan ana deneyim.
2. **Developer Workbench (Geliştirici ve Tanı Paneli):**
   4 aşamayı tek tek veya paralel akışla çalıştırma, her aşamanın ham çıktılarını ve sürelerini inceleme, canlı sistem loglarını izleme, aktif Web Studio oturumlarına bağlanıp çoklu oturumlar arasında geçiş yapma ve canlı API istek/hata trafiğini takip etme ortamı.
3. **Mobil Uygulama (Geliştirilme Aşamasında):**
   Akor akışı, bölüm geçişleri, bölüm döngüsü, transpoze ve 6 kanallı mikser deneyimini Android ve iOS cihazlara taşıyan mobil istemci.

---

## Gelecek Vizyonu ve Yol Haritası (V2 ve Ötesi)

Versiyon 1'de kurulan 4 aşamalı çekirdek (ölçü/tempo, akor/yapı, 6-kanal ayırma, söz/karaoke) tüm gelecek özelliklerin temelidir. V1 olgunlaştıktan sonra hedeflenen sonraki adımlar şunlardır:

1. **Enstrüman Bazlı Otomatik Notasyon ve Tablatür (V2+):**
   V1'in ayrıştırdığı temiz 6 ses kanalı ve ölçü/tempo ızgarası üzerine inşa edilecek otomatik nota çıkarımı (AMT):
   * **Gitar ve Bas Gitar:** Standart porte (sheet) + çalım fiziğine uygun tablatür (TAB).
   * **Piyano ve Klavye:** Sağ ve sol el ayrımlı çift porte (Grand Staff).
   * **Davul:** Perküsyon notasyonu ile ritim partisyonu.
   * **Vokal ve Melodik Enstrümanlar:** Standart porte nota yerleşimi ve açık notasyon/MIDI dışa aktarımı.
2. **Genişletilmiş Kaynak Girişleri:**
   Yerel ses dosyalarına ek olarak çevrimiçi müzik bağlantılarından doğrudan çözümleme akışlarının güvenli biçimde devreye alınması.
3. **İfade Zenginliği ve Genişletilmiş Düzenleme:**
   Şu an şarkı sözlerinde bulunan kullanıcı düzenleme ve sürüm geçmişi yaklaşımının akorlara ve şarkı bölümlerine genişletilmesi; özel akortlar, karmaşık ölçüler ve ileri seviye pratik araçlarıyla yaşayan bir kişisel müzik atölyesine dönüşmek.
