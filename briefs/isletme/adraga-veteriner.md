Sen bir web tasarımcısı ve Türkçe metin yazarısın. Aşağıdaki işletme için tek sayfalık sitenin ikinci tasarımını (Tasarım B) seçecek ve sitenin bütün metinlerini yazacaksın.

Cevabın yalnız istenen JSON olsun. Öncesinde ve sonrasında açıklama yazma.

# Görev: Adraga Veteriner Kliniği için Tasarım B ve metinler

### Doğrulanmış olgular (yalnız bunlar; yenisini ekleme)

- Ad: Adraga Veteriner Kliniği
- Kategori: Veteriner kliniği
- Adres: Yalı Mah., Sahilyolu Cd. No:8, Maltepe/İstanbul (sahil)
- Telefon: 0552 799 98 89 (sabit: 0216 352 95 98) · WhatsApp: 905527999889
- Google puanı: 4,8 (112 yorum)
- Çalışma saatleri: Pazartesi–cumartesi 10:00–19:30, pazar kapalı
- Hekim: Özüm Bey ve Ece Hanım (yorumlarda geçiyor)
- Hizmetler: Tabeladan: dahiliye, cerrahi, doğum ve jinekoloji, laboratuvar, X-ray bilgisayarlı röntgen, aşılama, koruyucu hekimlik, diş temizliği, tıraş-banyo
- Elimizdeki fotoğraflar (kliniğin kendi Google Maps fotoğrafları): Yeşil cepheli bina, siyah tabelada beyaz 'VETERİNER' ve turuncu 'Kliniği'; içeride hardal sarısı duvar, gri resepsiyon, laboratuvar cihazları, çelik ameliyat masası, kedi-köpek duvar logosu.
- Google yorumlarından (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  - "Kedimizi hızlıca muayene edip röntgen çekip yardımcı oldular. Özüm Bey'in yaklaşımı gerçekten güven vericiydi. (Tarık Yanova)"
  - "Kimsenin koyamadığı tanıyı anında koyup ona uygun tedaviyi titizlikle uyguladılar. (Merve Karakuş)"
  - "Ampute etmeden önce bir tedavi deneyelim dedi ve kedi şu an yürüyor. (Hamide Bıyıklı)"
  - "Yüksekten düşme yaşadık, bizimle çok ilgilendiler; Ece hoca ameliyatını yaptı. (Sinem Akdağ)"

### Tasarım A (zaten yapıldı; B bunun kopyası olmasın)

Adaçayı zemin (sage), vurgu turuncu #e0862a, Bricolage + Source Serif (craft), fotoğraflı tam ekran hero (resepsiyon), koyu hizmet ızgarası (8 hizmet), 6'lı galeri, yorum kartları.

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

Tek bir JSON, şu biçimde (`{slug}` yerine `adraga-veteriner` yaz):

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
    "primaryCta": "...", "whatsappCta": "WhatsApp'tan yazın", "whatsappPrefill": "Merhaba, Adraga Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: "
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
