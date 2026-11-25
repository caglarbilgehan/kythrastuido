# 03 — Enstrümanlar ve Pratik Deneyimi

Her müzisyen bir şarkıyı kendi enstrümanının alışkanlıklarıyla öğrenir ve çalışır. **KythraStudio Versiyon 1**, enstrüman bazlı nota (porte) veya tablatür (TAB) üretmek yerine; akor eşliği, görsel akor diyagramları, 6 kanallı ses ayrıştırma ve ritim/bölüm takibi üzerinden farklı enstrüman ailelerine doğrudan uygulanabilir bir çalışma ortamı sunar.

---

## 1. V1'de Görsel Akor Diyagramı Sunulan Enstrümanlar

Stüdyoda şarkı akarken hem o an çalan hem de sıradaki ölçüde gelecek akor, seçilen enstrümana özel görsel diyagramla anlık gösterilir:

| Enstrüman | V1'de Sunulan Görsel Rehber | Pratikte Sağladığı Değer |
| :--- | :--- | :--- |
| **Gitar** *(6 Telli)* | **6 Telli Klavye Akor Diyagramı + Bare & Parmak Numaraları** | Akorun tel/perde basılışını, susturulan ve boş telleri, bare pozisyonunu gösterir. Kapo değerine göre basılış şeklini otomatik günceller; tıklama veya kaydırma ile alternatif pozisyon varyasyonları arasında geçiş yapılabilir. |
| **Piyano ve Klavye** | **2 Oktavlık Görsel Tuş Takımı Diyagramı** | Aktif akorun bastığı beyaz ve siyah tuşları nota adlarıyla vurgulayarak akor yürüyüşünü klavyede anında görmeyi sağlar; transpoze değişikliğine anlık uyum sağlar. |
| **Ukulele** *(4 Telli)* | **4 Telli Klavye Akor Diyagramı + Pozisyon Varyasyonları** | 4 telli ukulele düzenine uygun akor pozisyonlarını, parmak numaralarını ve kapo uyarlamasını sade biçimde sunar. |

---

## 2. 6 Kanallı Ayrıştırma ile Enstrüman Odaklı Pratik

Aşama 03 (BS-RoFormer 6-Kanal Ayırma) sayesinde yalnızca akor diyagramı olan enstrümanlar değil, bir grubun tüm ana katmanları ayrı ayrı çalışılabilir:

| Ayrıştırılan Kanal | Müzisyen İçin Kullanım Senaryosu |
| :--- | :--- |
| **Gitar** | Gitarı **Solo** alıp ritim/akor vuruşlarını net duyma veya **Mute** edip şarkının geri kalanına gitarla eşlik etme (*Gitar Eşliği* / *Gitar Odağı* ön ayarları). |
| **Vokal** | Vokali kapatıp kendi sesinizle çalışma (*Vokal Karaoke* ön ayarı) ve Aşama 04'ün kelime bazlı karaoke sözleriyle senkron söyleme. |
| **Bas Gitar** | Bas hattını tek başına dinleyerek yürüyüşü kulaktan çözme veya bası kapatıp davul ve diğer enstrümanlar eşliğinde çalma. |
| **Davul** | Davul ritmini izole etme ya da **Ritim Bölümü** ön ayarıyla yalnızca davul + bas eşliğinde zamanlama (groove) çalışması yapma. |
| **Piyano** | Piyano ve tuşlu eşlik katmanını diğer seslerin altından çıkarıp net biçimde duyma veya susturup kendi klavyenizle çalma. |
| **Diğer** | Yaylılar, synth pedleri ve ambiyans katmanlarının ses düzeyini dengeleyerek temiz bir çalışma miksi oluşturma. |

---

## 3. Ortak Zaman Ekseni ve Akıllı Çalışma Kontrolleri

KythraStudio V1'de tüm pratik araçları tek bir zaman ekseninde birbirine bağlıdır:
* **Ölçü ve Vuruş Takibi:** Şarkı akarken aktif ölçü, içindeki vuruş nabzı (`1 · 2 · 3 · 4`) ve ölçü içi alt akor değişimleri anlık vurgulanır.
* **Temel / Tüm Akor Modu:** Yeni başlayanlar için karmaşık akorları sadeleştirme (`Temel`) veya şarkının tüm armonik renklerini görme (`Tümü`) seçeneği.
* **Transpoze ve Kapo:** Şarkının ses perdesini veya akor gösterimini yarım ton adımlarıyla kaydırma; gitar ve ukulelede kapo pozisyonuna uygun kolay akor şekillerini anında hesaplama.
* **Hız, Döngü (Loop) ve Metronom:** Oynatma hızını değiştirme, tek bir şarkı bölümünü ya da özel bir ölçü aralığını döngüye alma ve şarkının temposuyla tam senkron metronom açma.

---

## 4. Kapsam Sınırı: Notasyon ve TAB Hakkında

**Versiyon 1'de otomatik porte (sheet music) ve tablatür (TAB) dökümü yer almaz.** V1'in amacı; ritim/ölçü ızgarasını, akor ve şarkı bölümlerini, 6 kanallı ses ayrıştırmasını ve senkron şarkı sözlerini yüksek doğrulukla çalışır hale getirmektir. Gitar/bas tablatürü, piyano çift portesi, davul notasyonu ve melodi portesi, bu çekirdek üzerine inşa edilecek **sonraki sürümlerin (V2+)** hedefidir.
