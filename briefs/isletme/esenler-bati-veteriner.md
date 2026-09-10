Sen bir web tasarımcısı ve Türkçe metin yazarısın. Aşağıdaki işletme için tek sayfalık sitenin ikinci tasarımını (Tasarım B) seçecek ve sitenin bütün metinlerini yazacaksın.

Cevabın yalnız istenen JSON olsun. Öncesinde ve sonrasında açıklama yazma.

# Görev: Esenler Batı Veteriner Kliniği için Tasarım B ve metinler

### Doğrulanmış olgular (yalnız bunlar; yenisini ekleme)

- Ad: Esenler Batı Veteriner Kliniği
- Kategori: Veteriner kliniği
- Adres: Turgut Reis Mah., Cengiz Topel Cd. No:9B, Esenler/İstanbul
- Telefon: 0541 179 99 82 · WhatsApp: 905411799982
- Google puanı: 4,6 (95 yorum)
- Çalışma saatleri: Her gün 12:00–00:00 (adında '7/24 acil' yazıyor; acil için arayın)
- Hekim: Halil hoca (yorumlarda geçiyor, soyadı bilinmiyor)
- Hizmetler: Muayene, aşı, kısırlaştırma, yavru bakımı, acil müdahale (yorumlardan)
- Elimizdeki fotoğraflar (kliniğin kendi Google Maps fotoğrafları): Kırmızı-beyaz tabela; içeride gri-kırmızı resepsiyon, cam bölmeli muayene odası; çok sayıda kedi ve küçük köpek fotoğrafı.
- Google yorumlarından (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  - "Kızımız Kestane'yi kısırlaştırdık. Tüm süreç boyunca detaylı bilgi verildi ve devamlı iletişim halinde kaldık. (Melda Kuşcu)"
  - "Halil hoca ve ekibine çok teşekkür ederiz. Endişe ile gittik ama bizi çok rahatlattılar. Tertemiz bir klinikti. (Helen)"
  - "Hiçbir yara izi olmaması toparlanma sürecini fazlasıyla hızlandırdı. (Aleyna Korkmaz)"
  - "Sokaktan almıştık, kötü bir durumdaydı; onu sağlığına kavuşturdu. Klinik olması gerektiği gibi çok hijyenik. (Fulya Ulutaş)"

### Tasarım A (zaten yapıldı; B bunun kopyası olmasın)

Açık zemin (porcelain), vurgu kırmızı #c62828, Noto Serif/Sans, ikiye bölünmüş hero (sol metin, sağ resepsiyon fotoğrafı), kart hizmetler, masonry galeri, yorum kartları.

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

Tek bir JSON, şu biçimde (`{slug}` yerine `esenler-bati-veteriner` yaz):

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
    "primaryCta": "...", "whatsappCta": "WhatsApp'tan yazın", "whatsappPrefill": "Merhaba, Esenler Batı Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: "
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
