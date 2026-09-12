# Darphane tasarım kütüphanesi — kombinasyonlar (reçeteler)

İki ajanın (Claude + Codex) ortak kütüphanesi. Her yeni site bir **reçeteden** başlar; reçete = hero varyantı + giriş animasyonu + kaydırma animasyonu + bölüm sırası ve düzenleri + iletişim deseni + header + tipografi/doku + mode. Makine okur: `data/recipes/<key>.json` (bu belge o dosyalardan üretilir; ikisini birlikte güncelle). **Afiş reçetesi 12.09.2026'da kaldırıldı** (Serkan beğenmedi: Esenler ve Pisi B'leri). Uygulama aracı: `npm run recipe -- <slug> <key> [--variant b]` (uygulama: `scripts/recipe.mts`).

## Konseptler reçete olarak (12.09.2026)

Serkan'ın kararı: reçete gibi tek anahtarla uygulanan ama tasarım detayı taşıyan sistem. 15 konsept (`docs/konseptler.md`, `/konsept`) artık `concept` alanıyla siteye/katmana uygulanır: `npm run recipe -- <slug> tabela --variant b --apply`. Konsept sayfada bölüm yığınının yerini alır; veri `facts.ts` üzerinden `sections`'tan gelir; teklif şeridi, A/B geçişi, analitik ve noindex aynen çalışır. Bu bölümdeki tema/sıra reçeteleri klasik bölüm yığını için kalır.

## Kurallar

- **A ve B farklı aileden.** Aile etiketi: `mode · öncelik · iletişim` (ör. "koyu · tip-öncelikli · fab"). En az iki eksen farklı olmalı: açık↔koyu, fotoğraf↔tip, bar↔fab. Aynı aileden A/B yasak (NOTLAR §1 A/B fark kuralı).
- **Mobil önce.** 390px'te ilk ekran üç soruyu cevaplar: açık mı · nerede · nasıl ulaşırım. En fazla 2 buton (acil blokta 1), en fazla 2 rozet. Dokunma hedefi ≥ 44px; yüzen buton baş parmak alanında ve CTA'yı örtmez (safe-area).
- **Masaüstü de üst düzey.** İçerik ≤ 1200px, satır ≤ 75ch, hover/odak durumları görünür, bölüm tonları dönüşümlü (açık/koyu ritmi), hero ≤ 90svh.
- **Hareket:** hero girişi tek orkestre an (≤ 900ms), kaydırma animasyonu transform+opacity, "hareketi azalt" açıkken tamamı kapalı. `none` yalnız çok hafif sayfada (Tezgâh smooth kapalı ama hero rise açık).
- **Performans/erişilebilirlik kapısı:** Lighthouse mobil ≥ 95, LCP görseli `priority` + `focal`, CLS < 0.05, kontrast AA, klavye odağı, 360px'te yatay taşma yok.
- **Preset ve mode uyumu:** koyu zemin veren presetler yalnız `ember`, `midnight`, `graphite`; `ink` açık kâğıttır. `accent` verilirse palet `mode`'a göre üretilir, preset'in koyuluğu geçersizdir. Koyu aile reçeteleri bu üçünden birini (ya da accent + mode: dark) kullanır (2026-09-12 düzeltmesi: Sahne ink→graphite, Atölye ember→bosphorus).
- **Kütüphaneyi büyütmek:** yeni reçete = yeni JSON + bu belgede satır; bir sektörde iki kez kullanılan kombinasyon reçeteye dönüştürülür. Aynı reçeteyi bir sektörde üst üste 3 adayda kullanma; varyasyon üret (preset/accent/font çifti değişir, iskelet kalır).

## Reçeteler

| Key | Ad | Aile | Uyar | Hero · giriş · kaydırma | Header · iletişim |
|---|---|---|---|---|---|
| `gece-nobeti` | Gece Nöbeti | koyu · tip-öncelikli · fab | 7/24 veteriner, nöbetçi eczane, çilingir, oto kurtarma, acil tesisat | statement · counter · fade | minimal · fab/dial |
| `vitrin` | Vitrin | açık · fotoğraf-öncelikli · bar | restoran, kafe, pastane, çiçekçi, butik | image · zoom · rise | glass · both/dial |
| `defter` | Defter | açık · tip-öncelikli · fab | avukat, mali müşavir, mimar, danışman, noter | split · stack · rise | solid · fab/dial |
| `kartpostal` | Kartpostal | açık · fotoğraf-öncelikli · bar | otel, pansiyon, bungalov, kamp, tur | image · curtain · fade | glass · both/dial |
| `klinik` | Klinik | açık · fotoğraf+metin · bar | diş, fizyoterapi, güzellik, gündüz veteriner, optik | split · rise · fade | solid · both/dial |
| `atolye` | Atölye | açık · fotoğraf+metin · fab | mobilya, tamir, tesisat, oto servis, terzi, anahtarcı | image · reveal · rise | solid · fab/dial |
| `sahne` | Sahne | koyu · fotoğraf-öncelikli · fab | düğün salonu, fotoğrafçı, DJ, organizasyon, gece kulübü | image · zoom · scale | minimal · fab/dial |
| `tezgah` | Tezgâh | açık · metin-öncelikli · bar | market, manav, kasap, şarküteri, pet shop, eczane | split · rise · scale | solid · both/dial |
| `sessiz` | Sessiz | açık · tip-öncelikli · fab | psikolog, yoga, spa, diyetisyen, cenaze hizmetleri | minimal · stack · fade | minimal · fab/dial |

### Gece Nöbeti (`gece-nobeti`)

Koyu zemin, ekranın en üstünde büyük telefon numarası; 02:00'de tek elle aranacak sayfa.

- **Aile:** koyu · tip-öncelikli · fab · **Uyar:** 7/24 veteriner, nöbetçi eczane, çilingir, oto kurtarma, acil tesisat · **Kaçın:** gündüz saatli işletme, fotoğrafı güçlü restoran
- **Tema:** midnight · dark · plex / başlık sans · ölçek display · köşe sm · yoğunluk tight · fotoğraf color
- **Hareket:** hero `counter`, kaydırma `fade`, smooth açık, paralaks kapalı
- **Header / iletişim:** minimal · fab (dial)
- **Sıra:** ust(statement, acil) → saatler → konum → hizmetler(list) → yorumlar(marquee) → sss → iletisim
- **Mobil:** İlk ekran: telefon numarası (büyük), isim, 'şu an açık' rozeti, tek buton Ara. WhatsApp yüzen butonda (nabız animasyonu 3 kez). Alt bar yok; FAB baş parmak alanında, safe-area boşluğu.
- **Masaüstü:** Numara 8–10rem, isim altında; sağda hafif soluk klinik fotoğrafı (statement arka planı %25 opaklık). Bölümler tek sütun, 72ch.

### Vitrin (`vitrin`)

Fotoğraf her şey: tam ekran görsel, cam header, yemek/ürün önce.

- **Aile:** açık · fotoğraf-öncelikli · bar · **Uyar:** restoran, kafe, pastane, çiçekçi, butik · **Kaçın:** fotoğrafsız meslek, gece acil
- **Tema:** sand · light · hospitality / başlık display · ölçek normal · köşe md · yoğunluk normal · fotoğraf color
- **Hareket:** hero `zoom`, kaydırma `rise`, smooth açık, paralaks açık
- **Header / iletişim:** glass · both (dial)
- **Sıra:** ust(image) → menu(photos) → galeri(masonry) → hakkinda → yorumlar(cards) → saatler → konum → iletisim
- **Mobil:** Hero görseli 72svh, odak noktası (`focal`) yemeğe; başlık altta solda; 2 buton. Menü fotoğraflı liste yatay kaydırılabilir. Alt bar Ara/Yol/WhatsApp.
- **Masaüstü:** Hero 88svh, paralaks. Galeri masonry 3 sütun; menü iki sütun.

### Defter (`defter`)

Kâğıt beyazı, serif, fotoğraf tek ton; ağırbaşlı ve kısa.

- **Aile:** açık · tip-öncelikli · fab · **Uyar:** avukat, mali müşavir, mimar, danışman, noter · **Kaçın:** restoran, hızlı tüketim
- **Tema:** porcelain · light · editorial / başlık display · ölçek normal · köşe none · yoğunluk airy · fotoğraf mono
- **Hareket:** hero `stack`, kaydırma `rise`, smooth açık, paralaks kapalı
- **Header / iletişim:** solid · fab (dial)
- **Sıra:** ust(split) → hakkinda → hizmetler(list) → ekip → sss → konum → saatler → iletisim
- **Mobil:** Split hero mobilde metin üstte, tek ton portre altta (max 40svh). 1 rozet. Yüzen dial butonu, alt bar yok.
- **Masaüstü:** Metin sol %55, portre sağ; başlık 400 ağırlık, 4.5rem. Satır 68ch.


### Kartpostal (`kartpostal`)

Manzara fotoğrafı perde gibi açılır; yumuşak köşeler, ferah boşluk.

- **Aile:** açık · fotoğraf-öncelikli · bar · **Uyar:** otel, pansiyon, bungalov, kamp, tur · **Kaçın:** acil hizmet, koyu marka
- **Tema:** sage · light · soft / başlık display · ölçek normal · köşe lg · yoğunluk airy · fotoğraf color
- **Hareket:** hero `curtain`, kaydırma `fade`, smooth açık, paralaks açık
- **Header / iletişim:** glass · both (dial)
- **Sıra:** ust(image) → hakkinda → galeri(grid) → hizmetler(cards) → konum → yorumlar(cards) → sss → iletisim
- **Mobil:** Hero 68svh, perde animasyonu 700ms; 2 rozet (puan, konum). Olanaklar 2 sütun kart. Harita erken (yol tarifi turistin ilk sorusu).
- **Masaüstü:** Hero 90svh paralaks; galeri 3 sütun 4:3; olanaklar 3 sütun.

### Klinik (`klinik`)

Temiz, açık, düzenli: fotoğraf sağda, hizmet ızgarası, önce/sonra.

- **Aile:** açık · fotoğraf+metin · bar · **Uyar:** diş, fizyoterapi, güzellik, gündüz veteriner, optik · **Kaçın:** gece acil, poster tarzı markalar
- **Tema:** porcelain · light · clean / başlık sans · ölçek normal · köşe md · yoğunluk normal · fotoğraf color
- **Hareket:** hero `rise`, kaydırma `fade`, smooth açık, paralaks kapalı
- **Header / iletişim:** solid · both (dial)
- **Sıra:** ust(split) → hizmetler(grid) → ekip → oncesonra → yorumlar(cards) → sss → saatler → konum → iletisim
- **Mobil:** Split hero: metin üstte, fotoğraf altta 44svh. Hizmet ızgarası 2 sütun, kısa açıklama. Alt bar.
- **Masaüstü:** Hero %50/%50; hizmetler 3 sütun; önce/sonra kaydırıcı 960px.

### Atölye (`atolye`)

Sıcak, elle yapılmış his: sıcak nötrler, zanaat fontu, uzun hizmet listesi.

- **Aile:** açık · fotoğraf+metin · fab · **Uyar:** mobilya, tamir, tesisat, oto servis, terzi, anahtarcı · **Kaçın:** lüks/ince markalar
- **Tema:** bosphorus · light · craft / başlık display · ölçek normal · köşe sm · yoğunluk normal · fotoğraf color
- **Hareket:** hero `reveal`, kaydırma `rise`, smooth açık, paralaks açık
- **Header / iletişim:** solid · fab (dial)
- **Sıra:** ust(image) → hizmetler(list) → oncesonra → hakkinda → yorumlar(quotes) → konum → saatler → iletisim
- **Mobil:** Hero 60svh, ilk buton Ara (usta telefonla konuşur). Hizmet listesi tek sütun, fiyat notu varsa sağda.
- **Masaüstü:** Hero 80svh; hizmet listesi iki sütun; önce/sonra tam genişlik.

### Sahne (`sahne`)

Siyah zemin, büyük fotoğraf, akan yorum şeridi; etkinlik enerjisi.

- **Aile:** koyu · fotoğraf-öncelikli · fab · **Uyar:** düğün salonu, fotoğrafçı, DJ, organizasyon, gece kulübü · **Kaçın:** sağlık, hukuk
- **Tema:** graphite · dark · hospitality / başlık display · ölçek display · köşe lg · yoğunluk normal · fotoğraf color
- **Hareket:** hero `zoom`, kaydırma `scale`, smooth açık, paralaks açık
- **Header / iletişim:** minimal · fab (dial)
- **Sıra:** ust(image) → galeri(masonry) → hizmetler(cards) → fiyat → yorumlar(marquee) → sss → konum → iletisim
- **Mobil:** Hero 80svh, tek buton WhatsApp (tarih sorulur). Masonry galeri 2 sütun. Yorum şeridi otomatik akar, dokununca durur.
- **Masaüstü:** Hero 100svh zoom; galeri 4 sütun; paket kartları 3'lü.

### Tezgâh (`tezgah`)

Mahalle esnafı: önce 'açık mı', ürün grupları, harita; sade ve hızlı.

- **Aile:** açık · metin-öncelikli · bar · **Uyar:** market, manav, kasap, şarküteri, pet shop, eczane · **Kaçın:** lüks, etkinlik
- **Tema:** sage · light · noto / başlık sans · ölçek compact · köşe md · yoğunluk tight · fotoğraf color
- **Hareket:** hero `rise`, kaydırma `scale`, smooth kapalı, paralaks kapalı
- **Header / iletişim:** solid · both (dial)
- **Sıra:** ust(split) → saatler → hizmetler(grid) → galeri(grid) → yorumlar(cards) → konum → iletisim
- **Mobil:** İlk ekranda 'şu an açık · 21:00'e kadar' rozeti ve Ara; saat tablosu hemen altında. Hafif sayfa (smooth kapalı), 3G'de hızlı.
- **Masaüstü:** Split hero düşük (56svh); ürün grupları 4 sütun; harita geniş.

### Sessiz (`sessiz`)

Çok boşluk, yumuşak serif, az renk; güven ve sükûnet.

- **Aile:** açık · tip-öncelikli · fab · **Uyar:** psikolog, yoga, spa, diyetisyen, cenaze hizmetleri · **Kaçın:** gürültülü markalar, acil
- **Tema:** porcelain · light · soft / başlık display · ölçek normal · köşe lg · yoğunluk airy · fotoğraf mono
- **Hareket:** hero `stack`, kaydırma `fade`, smooth açık, paralaks kapalı
- **Header / iletişim:** minimal · fab (dial)
- **Sıra:** ust(minimal) → hakkinda → hizmetler(list) → ekip → sss → konum → saatler → iletisim
- **Mobil:** Minimal hero: tek cümle, tek buton, 1 rozet. Hiç fotoğraf yoksa da tam görünür. Dial butonu sağ altta, sessiz renk.
- **Masaüstü:** Metin 60ch ortalanmış, 1.4 satır aralığı; bölümler arası 8rem.

## A/B eşleme önerileri

| A | B (zıt aile) |
|---|---|
| Klinik (açık · foto+metin · bar) | Gece Nöbeti (koyu · tip · fab) ya da Sahne |
| Vitrin (açık · foto · bar) | Sahne (koyu · foto · fab) ya da Defter |
| Defter (açık · tip · fab) | Klinik (açık · foto+metin · bar) ya da Sahne |
| Tezgâh (açık · metin · bar) | Gece Nöbeti ya da Atölye |
| Kartpostal (açık · foto · bar) | Sahne ya da Sessiz |
| Atölye (açık · foto+metin · fab) | Sahne ya da Tezgâh |

## Sıradaki genişletmeler (ikimiz)

- [x] `stack`: rozet → başlık → alt satır → buton; 90ms aralık, toplam 630ms, CSS ile. `counter`: statement telefonunun rakamları, en fazla 670ms. Sunucu HTML’i okunur; hareket azaltmada animasyon yok, sıra aynı. Excel grubunda iki B `stack`, 7/24 B `counter` kullanır.
- [ ] `wipe`: görselin soldan açılması.
- [x] Tek eylemli FAB: WhatsApp yoksa doğrudan etiketli Ara bağlantısı; sabit hat WhatsApp’a dönüştürülmez.
- `menu` için yatay kaydırmalı fotoğraflı şerit (Vitrin mobil).
- [x] `npm run recipe -- --check`: on reçetenin tema, bölüm türü/düzeni, aile ve mobil notu doğrulanır. `npm run test:recipes`: katman, CLI ve altı A/B farkı regresyonları.


## Reçete aracı ve katman sözleşmesi

```sh
npm run recipe -- --check
npm run --silent recipe -- esatpasa-veteriner gece-nobeti > /tmp/gece.json
npm run recipe -- esatpasa-veteriner klinik --variant a --apply
npm run recipe -- esatpasa-veteriner gece-nobeti --variant b --apply
npm run test:recipes
```

`--apply` verilmedikçe dosya yazılmaz; JSON stdout’a, uyarılar stderr’e gider. `--variant a --apply` A'nın tam dosyasını yazar ve reçetede bulunmayan mevcut içerik bölümlerini sonda korur. B/C uygulanırken mevcut katmanın metinleri, işletme bilgileri ve SEO alanları korunur; tema, sıra ve bölüm düzenleri yeni reçeteden gelir. İçeriksiz ekip, fiyat, menü ve önce/sonra bölümleri atlanır ve uyarılır. Hero eylemlerinden WhatsApp, yalnız gerçek `business.whatsapp` varsa seçilir; uygun eylem kalmazsa telefon kullanılır. Rozet sayısı canlı açık/kapalı rozetini de kapsar.

Katman alanları:

- `sections`: eşleşen `id` alanlarını yamalar; yeni `id` tam ve geçerli bir bölüm olmalıdır. Dizi/nesne alanları sığ olarak değiştirilir. `image: null`, `urgent: null` gibi değerler isteğe bağlı alanı temizler; zorunlu alanı silmek doğrulama hatasıdır.
- `sectionOrder`: belirtilen bölümler bu sırada gelir; listede olmayanlar eski sıralarıyla sona eklenir. Kesin kompozisyon için `remove` kullanın.
- `remove`: çıkarılacak mevcut bölüm id’leri. Bilinmeyen/yinelenen id, aynı bölümü hem yamalayıp hem çıkarma veya türünü değiştirme hata verir.
- `recipe`: başlangıç reçetesinin anahtarı. Katmana sonradan yapılan işletmeye özel uyarlamaları kilitlemez.

Bu alanları kullanmayan eski katmanlar aynı davranır; Noyavet B/C için önceki birleştirmeyle birebir veri eşitliği test edilir.

## Kullanım — Excel siteleri, 12 Eylül 2026

| Site | A reçetesi | B reçetesi | Notlar |
|---|---|---|---|
| Esatpaşa Veteriner | `klinik` | `gece-nobeti` | Açık split/bar ile koyu statement/fab ayrımı; 7/24 telefon `counter` ile önce gelir. |
| Esenler Batı Veteriner | `klinik` | `gece-nobeti` | Açık klinik ızgarasına karşı koyu antet, telefon önce (`counter`); adında 7/24 acil. |
| Küçükyalı Veteriner | `tezgah` | `sessiz` | Mahalle tipi split/bar ile fotoğrafsız minimal/fab; WhatsApp yok, tek eylem Ara; B hero `stack`. |
| Adraga Veteriner | `vitrin` | `defter` | Fotoğraf ve bar öncelikli A ile tek ton, tip öncelikli fab B; B hero `stack`. |
| Pisi Veteriner | `klinik` | `sahne` | Açık klinik ızgarası ile koyu tam ekran fotoğraf, masonry galeri, akan yorumlar; kuş ve tavşan içeriği korunur. |
| Polen Veteriner | `tezgah` | `sahne` | Açık split/bar ile koyu tam ekran fotoğraf/fab; çalışma saatleri ve yorum verisi olmadığı için bu bölümler üretilmez. |

Altı çiftte A tam dosyada, B katmanda `recipe` taşır. B katmanı yeniden üretildiğinde mevcut işletmeye özel metinler ve SEO korunur; reçete tema, bölüm sırası, düzen ve hareketi belirler. Tüm B’lerde dial FAB kullanılır ve hareket azaltma açıkken sunucu/istemci yapısı değişmez.
