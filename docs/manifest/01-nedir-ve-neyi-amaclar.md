# 01 — KythraStudio Nedir ve Neyi Amaçlar?

## Varoluş Amacı

Bir müzisyen bir şarkıyı beğendiğinde ve o şarkıya eşlik etmek istediğinde önünde her zaman aynı engel durur: **Pasif biçimde dinlenen ses kaydı ile aktif olarak çalınabilir, çalışılabilir müzikal yapı arasındaki boşluk.**

**KythraStudio**, bu boşluğu ortadan kaldırmak için tasarlanmıştır. Amacı; elinizdeki herhangi bir ses dosyasını (`.wav`, `.mp3`, `.flac`, `.ogg`, `.m4a`) alıp birkaç saniye içinde temposu, ölçüleri, akorları, şarkı bölümleri, 6 ayrı ses kanalı ve kelime bazlı senkron sözleriyle **doğrudan pratik yapılabilir bir stüdyo ortamına** dönüştürmektir.

Kısacası KythraStudio V1, *"Bu şarkının temposu ve tonu ne, hangi ölçüde hangi akor geliyor, bölümler nerede değişiyor, kendi enstrümanımı kapatıp üzerine nasıl çalarım ve sözleri anlık nasıl takip ederim?"* sorularına tek bir çatı altında yanıt verir.

---

## Versiyon 1'de Çözdüğü Somut Sorunlar

KythraStudio V1, müzisyenlerin, vokalistlerin ve müzik öğrencilerinin günlük pratikte yaşadığı dört temel soruna doğrudan çözüm sunar:

1. **Belirsiz Tempo, Ton ve Akor Akışı:**
   İnternette her şarkının doğru akorları, tonu veya ölçü zamanlaması bulunmaz; bulunanlar da çoğu zaman kayıtla senkron değildir. KythraStudio, şarkının kendi sesinden yola çıkarak BPM değerini, ölçü yapısını, tonunu ve her ölçüye hizalanmış akorlarını otomatik olarak çıkarır.
2. **Karışık Kayıtta Kendi Enstrümanını Ayırt Edememe:**
   Bir stüdyo ya da canlı kayıtta vokal, gitar, bas gitar, davul ve piyano aynı anda duyulur. Kulakla dinlerken tek bir enstrümanı seçmek ya da kendi enstrümanını kapatıp şarkıya eşlik etmek mümkün değildir. Sistem, kaydı **6 bağımsız ses kanalına** ayırarak hem izole dinleme hem de gerçek backing track (eşlik) pratiği sağlar.
3. **Şarkının Bölümlerine ve Zor Pasajlarına Odaklanamama:**
   Bir şarkıyı baştan sona sürekli geri sararak çalışmak zaman kaybettirir. Sistem; giriş (Intro), kıta (Verse), nakarat (Chorus), köprü (Bridge) ve bitiş (Outro) gibi bölümleri otomatik işaretler; müzisyenin tek bir bölümü veya kendi seçtiği ölçü aralığını döngüye (loop) alıp istediği hızda çalışmasını sağlar.
4. **Senkronize Olmayan veya Bulunmayan Şarkı Sözleri:**
   Özellikle kişisel kayıtlarda, provalarda veya niş parçalarda zaman kodlu söz bulmak zordur. KythraStudio, ayrıştırdığı izole vokal kanalından şarkı sözlerini otomatik çözer, kelime düzeyinde zamanlar ve gerektiğinde kullanıcının sürüm geçmişiyle düzenleyebileceği canlı bir karaoke sahnesi sunar.

---

## Temel İlkeler

KythraStudio V1'in tasarım ve çalışma yaklaşımı dört temel ilkeye dayanır:

* **Bekletmeden Çalışmaya Başlatma (Aşamalı Akış):**
  Müzisyen dakikalarca boş ekran beklemek zorunda kalmamalıdır. Sistem önce tempo/ölçü ve akor analizini hızla tamamlayıp stüdyoyu saniyeler içinde kullanıma açar; 6 kanallı ses ayrıştırması, şarkı bölümlerinin keskinleştirilmesi ve otomatik söz çıkarımı arka planda kesintisiz tamamlanır. Daha önce çözümlenmiş şarkılar ise önbellekten anında açılır.
* **Tek Ortak Zaman Ekseni:**
  Tempo, ölçüler, akorlar, akor diyagramları, şarkı bölümleri, 6 ses kanalı ve kelime bazlı karaoke sözleri aynı zaman çizgisinde birbirine tam kilitli çalışır.
* **Kişisel ve Düzenli Repertuvar:**
  Her kullanıcının izole çalışma oturumu, kendi özel yüklemeleri, favorileri, çalma listeleri ve gerektiğinde düzenleyebileceği söz revizyon geçmişi bulunur.
* **Önce Sağlam V1 Çekirdeği, Sonra Notasyon (V2+):**
  KythraStudio ilk sürümde enstrüman bazlı nota (porte) veya tablatür (TAB) dökümüne odaklanmaz. Bunun yerine tüm müzikal çözümlemenin temeli olan **4 ana aşamayı** (tempo/ölçü, akor/yapı, 6-kanal ayırma, söz/karaoke) üretim kalitesinde kusursuzlaştırmayı hedefler; notasyon ve TAB yetenekleri bu sağlam temel üzerine sonraki sürümlerde eklenecektir.
