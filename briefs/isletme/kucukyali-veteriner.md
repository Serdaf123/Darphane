# Küçükyalı Veteriner Kliniği — ChatGPT görevi: Tasarım B + metinler

Aşağıdaki bloğu olduğu gibi ChatGPT'ye yapıştır. Cevabı (tek JSON) Claude'a geri ver.

```
Sen bir web tasarımcısı ve Türkçe metin yazarısın. Bir veteriner kliniği için tek sayfalık sitenin
ikinci tasarımını (Tasarım B) seçecek ve tüm metinleri yazacaksın.

İşletme: Küçükyalı Veteriner Kliniği — Veteriner kliniği (mahalle kliniği)
Doğrulanmış olgular (yalnız bunları kullan, yenisini ekleme, rakam/yıl/ünvan uydurma):
- Ad: Küçükyalı Veteriner Kliniği · Kategori: Veteriner kliniği (mahalle kliniği)
- Adres: Çınar Mah., Mızrak Sk. No:3/A, Maltepe/İstanbul
- Telefon: 0216 417 03 19 (sabit hat; WhatsApp yok) · WhatsApp YOK (sabit hat) — whatsappCta ve whatsappPrefill alanlarını boş string bırak, primaryCta 'Ara' olsun
- Google puanı: 4,3 (84 yorum)
- Çalışma saatleri: Hafta içi 11:00–20:00, cumartesi 11:00–18:00, pazar kapalı
- Hekim: Mustafa Bey (yorumlarda 'yıllardır' ifadesiyle geçiyor)
- Hizmetler: Muayene, aşı, tedavi ve uzun süreli takip (yorumlardan)
- Fotoğraf dünyası (gerçek klinik fotoğrafları, Google Maps'ten; elimizde bunlar var): Sokak arası dükkan, beyaz tabelada kırmızı 'VETERİNER'; sadece 3 kullanılabilir fotoğraf (dış cephe, sokak, bir kedi). Az görsel → tipografi ağırlıklı tasarım gerekir.
- Yorumlardan (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  · "İki kedim var, sahiplendiğimden beri Mustafa hocama geliyoruz. Kanal yolunda sorun olan kedimi sonda takmadan iyileştirdi. (Umut Ön)"
  · "Pendik'ten Mustafa Bey için geliyoruz; yıllardır güvenerek geldiğimiz biricik veterinerimiz. (Muhammet Hilmi Enes Aracı)"
  · "Mustafa Bey senelerden beri benim canlarımın doktorudur. (Serap Lang)"

Tasarım A (zaten yapıldı) şu dünyada: Kum zemin (sand), vurgu koyu kırmızı #a4161a, Fraunces + DM Sans (soft), ikiye bölünmüş hero, liste hizmetler, şerit galeri, alıntı tipi yorumlar, minimal header.
Senden Tasarım B: A'nın kopyası olmayan, aynı olgularla FARKLI bir dünya (başka zemin, başka font
ailesi, başka hero düzeni). Sadece aşağıdaki listelerden seç, başka değer yazma:

  preset: porcelain | ember | sage | midnight | cobalt | sand | bosphorus | graphite | ink
  accent: #rrggbb (klinik tabelasının/cephesinin rengiyle uyumlu bir vurgu seç)
  mode: light | dark
  fonts: classic | hospitality | clean | craft | soft | bold | editorial | plex | noto
  headingFont: sans | display
  typeScale: compact | normal | display
  radius: none | sm | md | lg
  density: tight | normal | airy
  header: glass | solid | minimal | none
  photos: color | mono
  hero.variant: image | split | minimal | statement
  motion.hero: rise | reveal | blur | curtain | zoom | split | none

Metin kuralları: yalnız doğrulanabilir olgu; "en iyi", "uzman kadro", müşteri sayısı, yıl, yüzde
uydurma yok; yorum uydurma yok. Ton sakin, esnafın diliyle, "siz" hitabı, ünlem yok, İngilizce
pazarlama kelimesi yok (premium, profesyonel çözüm, inovatif…). Başlık tek fikir, en fazla 6 kelime.
Alt satır en fazla 2 cümle. Buton metni fiil + ne alacağı ("WhatsApp'tan yazın"). Türkçe kesme
işareti doğru. Hayvan sahibinin gece 02:00'de telefondan baktığını düşün: ilk ekranda "açık mı,
nerede, nasıl ulaşırım" cevaplanmalı.

Çıktı: tek bir JSON, öncesinde/sonrasında açıklama yok:
{
  "why": "bu dünyayı neden seçtin, 2 cümle",
  "theme": { "preset": "...", "accent": "#......", "mode": "...", "fonts": "...", "headingFont": "...",
             "typeScale": "...", "radius": "...", "density": "...", "header": "...", "photos": "...",
             "motion": { "hero": "..." } },
  "hero": { "variant": "...", "headline": "...", "subline": "...", "badges": ["...", "..."],
            "primaryCta": "...", "whatsappCta": "...", "whatsappPrefill": "Merhaba, Küçükyalı Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: " },
  "about": { "title": "...", "body": "2-3 cümle, paragraflar \n\n ile", "highlights": [{"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}] },
  "services": [ { "name": "...", "description": "tek cümle" } ],
  "faq": [ { "q": "...", "a": "..." } ],
  "cta": { "headline": "...", "subline": "tek cümle", "button": "..." },
  "seoTitle": "en fazla 60 karakter", "seoDescription": "en fazla 155 karakter"
}
```
