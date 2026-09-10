Sen bir web tasarımcısı ve Türkçe metin yazarısın. Aşağıdaki işletme için tek sayfalık sitenin ikinci tasarımını (Tasarım B) seçecek ve sitenin bütün metinlerini yazacaksın.

Cevabın yalnız istenen JSON olsun. Öncesinde ve sonrasında açıklama yazma.

# Görev: Esatpaşa Veteriner Kliniği için Tasarım B ve metinler

### Doğrulanmış olgular (yalnız bunlar; yenisini ekleme)

- Ad: Esatpaşa Veteriner Kliniği
- Kategori: Veteriner kliniği (7/24 nöbetçi)
- Adres: Esatpaşa Mah., Adnan Menderes Cd. No:108A, Ataşehir/İstanbul
- Telefon: 0532 570 77 32 · WhatsApp: 905325707732
- Google puanı: 4,9 (114 yorum)
- Çalışma saatleri: Her gün 24 saat açık
- Hekim: Veteriner Hekim Osman Kısa (tabelada ve yorumlarda geçiyor)
- Hizmetler: Acil müdahale, muayene ve tahlil, aşı, kısırlaştırma ve ameliyat, mama/bakım ürünleri satışı (yorumlar ve fotoğraflardan)
- Elimizdeki fotoğraflar (kliniğin kendi Google Maps fotoğrafları): Sarı cepheli bina, siyah tabelada bordo 'VETERİNER' yazısı; içeride yeşil duvarlar, çelik muayene masası, mama rafları. Müşteri hayvan fotoğrafları (köpek, kedi).
- Google yorumlarından (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  - "Kedim Ayşegül'e mantar teşhisi konuldu ve hızlıca tedavisine başlandı. Özenli bir şekilde tedavi edildi ve evde uygulayacağım bakım detaylıca anlatıldı. (Melissa Nur Gün)"
  - "1,5 yaşındaki Şivava köpeğim Berlin için ilk günden itibaren çok ilgili ve güven veren bir süreç yaşadık. Sadece tedavi değil, doğru yönlendirme ve açık iletişim de sundular. (Cilem Cal)"
  - "Gece geç saat olmasına rağmen panikle hemen kliniği aradım ve Osman hocam çok sakin bir şekilde olabilecek tüm senaryoları bana açıkladı. (Elifcan Çağdaş)"
  - "Kedim Mia'yı 40 derece ateşle çok zor bir durumda götürdük. Sadece tedaviye ve Mia'nın sağlığına odaklanan, maddi kaygıyı ikinci planda tutan bir hekimle karşılaştık. (Nazlıcan Kurt)"

### Tasarım A (zaten yapıldı; B bunun kopyası olmasın)

Açık zemin (ink preset), vurgu bordo #b5123f, Figtree (clean), fotoğraflı tam ekran hero (tabela fotoğrafı), 'acil' şeridi, koyu hizmet bloğu, 6'lı galeri, Google yorum kartları.

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

Tek bir JSON, şu biçimde (`{slug}` yerine `esatpasa-veteriner` yaz):

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
    "primaryCta": "...", "whatsappCta": "WhatsApp'tan yazın", "whatsappPrefill": "Merhaba, Esatpaşa Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: "
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
