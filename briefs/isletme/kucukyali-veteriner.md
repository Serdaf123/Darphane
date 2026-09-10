Sen bir web tasarımcısı ve Türkçe metin yazarısın. Aşağıdaki işletme için tek sayfalık sitenin ikinci tasarımını (Tasarım B) seçecek ve sitenin bütün metinlerini yazacaksın.

Cevabın yalnız istenen JSON olsun. Öncesinde ve sonrasında açıklama yazma.

# Görev: Küçükyalı Veteriner Kliniği için Tasarım B ve metinler

### Doğrulanmış olgular (yalnız bunlar; yenisini ekleme)

- Ad: Küçükyalı Veteriner Kliniği
- Kategori: Veteriner kliniği (mahalle kliniği)
- Adres: Çınar Mah., Mızrak Sk. No:3/A, Maltepe/İstanbul
- Telefon: 0216 417 03 19 (sabit hat) · WhatsApp YOK (sabit hat). whatsappCta ve whatsappPrefill boş string kalsın; primaryCta arama olsun.
- Google puanı: 4,3 (84 yorum)
- Çalışma saatleri: Hafta içi 11:00–20:00, cumartesi 11:00–18:00, pazar kapalı
- Hekim: Mustafa Bey (yorumlarda 'yıllardır' ifadesiyle geçiyor)
- Hizmetler: Muayene, aşı, tedavi ve uzun süreli takip (yorumlardan)
- Elimizdeki fotoğraflar (kliniğin kendi Google Maps fotoğrafları): Sokak arası dükkan, beyaz tabelada kırmızı 'VETERİNER'; sadece 3 kullanılabilir fotoğraf (dış cephe, sokak, bir kedi). Az görsel; tipografi ağırlıklı tasarım gerekir.
- Google yorumlarından (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  - "İki kedim var, sahiplendiğimden beri Mustafa hocama geliyoruz. Kanal yolunda sorun olan kedimi sonda takmadan iyileştirdi. (Umut Ön)"
  - "Pendik'ten Mustafa Bey için geliyoruz; yıllardır güvenerek geldiğimiz biricik veterinerimiz. (Muhammet Hilmi Enes Aracı)"
  - "Mustafa Bey senelerden beri benim canlarımın doktorudur. (Serap Lang)"

### Tasarım A (zaten yapıldı; B bunun kopyası olmasın)

Kum zemin (sand), vurgu koyu kırmızı #a4161a, Fraunces + DM Sans (soft), ikiye bölünmüş hero, liste hizmetler, şerit galeri, alıntı tipi yorumlar, minimal header.

Senden istenen Tasarım B: aynı olgularla farklı bir dünya. Başka zemin, başka font ailesi, başka hero düzeni.

## Seçim listeleri (yalnız bunlardan seç, başka değer yazma)

- preset: porcelain | ember | sage | midnight | cobalt | sand | bosphorus | graphite | ink
- accent: #rrggbb (kliniğin tabelası veya cephesiyle uyumlu bir vurgu rengi)
- mode: light | dark
- fonts: classic | hospitality | clean | craft | soft | bold | editorial | plex | noto
- headingFont: sans | display
- typeScale: compact | normal | display
- radius: none | sm | md | lg
- density: tight | normal | airy
- header: glass | solid | minimal | none
- photos: color | mono
- hero.variant: image | split | minimal | statement
- motion.hero: rise | reveal | blur | curtain | zoom | split | none

## Metin kuralları

- Yalnız yukarıdaki doğrulanmış olgular. "En iyi", "uzman kadro", müşteri sayısı, yıl, yüzde, ödül gibi hiçbir iddia ekleme. Yorum uydurma; verilen yorumlar kısaltılabilir, değiştirilemez.
- Ton: sakin, kendine güvenen, esnafın diliyle. "Siz" hitabı. Ünlem yok. İngilizce pazarlama kelimesi yok (premium, profesyonel çözüm, inovatif, dijital…).
- Başlık tek fikir, en fazla 6 kelime. Alt satır en fazla 2 cümle. Buton metni fiil + ne alacağı ("WhatsApp'tan yazın", "Hemen arayın").
- Türkçe imla; kesme işareti doğru ("WhatsApp'tan", "Google'da").
- Hayvan sahibi gece 02:00'de telefondan bakıyor: ilk ekran "açık mı, nerede, nasıl ulaşırım" sorularını cevaplamalı.

## İstenen çıktı

Tek bir JSON, şu biçimde (`{slug}` yerine `kucukyali-veteriner` yaz):

```json
{
  "slug": "{slug}",
  "why": "Bu dünyayı neden seçtin, 2 cümle.",
  "theme": {
    "preset": "...", "accent": "#......", "mode": "...", "fonts": "...", "headingFont": "...",
    "typeScale": "...", "radius": "...", "density": "...", "header": "...", "photos": "...",
    "motion": { "hero": "..." }
  },
  "hero": {
    "variant": "...", "headline": "...", "subline": "...", "badges": ["...", "..."],
    "primaryCta": "...", "whatsappCta": "", "whatsappPrefill": ""
  },
  "about": {
    "title": "...", "body": "2-3 cümle; paragraf arası \n\n",
    "highlights": [{ "label": "...", "value": "..." }, { "label": "...", "value": "..." }, { "label": "...", "value": "..." }]
  },
  "services": [{ "name": "...", "description": "tek cümle" }],
  "faq": [{ "q": "...", "a": "..." }],
  "cta": { "headline": "...", "subline": "tek cümle", "button": "..." },
  "seoTitle": "en fazla 60 karakter",
  "seoDescription": "en fazla 155 karakter"
}
```
