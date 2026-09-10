# Esenler Batı Veteriner Kliniği — ChatGPT görevi: Tasarım B + metinler

Aşağıdaki bloğu olduğu gibi ChatGPT'ye yapıştır. Cevabı (tek JSON) Claude'a geri ver.

```
Sen bir web tasarımcısı ve Türkçe metin yazarısın. Bir veteriner kliniği için tek sayfalık sitenin
ikinci tasarımını (Tasarım B) seçecek ve tüm metinleri yazacaksın.

İşletme: Esenler Batı Veteriner Kliniği — Veteriner kliniği
Doğrulanmış olgular (yalnız bunları kullan, yenisini ekleme, rakam/yıl/ünvan uydurma):
- Ad: Esenler Batı Veteriner Kliniği · Kategori: Veteriner kliniği
- Adres: Turgut Reis Mah., Cengiz Topel Cd. No:9B, Esenler/İstanbul
- Telefon: 0541 179 99 82 · WhatsApp: 905411799982
- Google puanı: 4,6 (95 yorum)
- Çalışma saatleri: Her gün 12:00–00:00 (adında '7/24 acil' yazıyor; acil için arayın)
- Hekim: Halil hoca (yorumlarda geçiyor, soyadı bilinmiyor)
- Hizmetler: Muayene, aşı, kısırlaştırma, yavru bakımı, acil müdahale (yorumlardan)
- Fotoğraf dünyası (gerçek klinik fotoğrafları, Google Maps'ten; elimizde bunlar var): Kırmızı-beyaz tabela; içeride gri-kırmızı resepsiyon, cam bölmeli muayene odası; çok sayıda kedi ve küçük köpek fotoğrafı.
- Yorumlardan (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  · "Kızımız Kestane'yi kısırlaştırdık. Tüm süreç boyunca detaylı bilgi verildi ve devamlı iletişim halinde kaldık. (Melda Kuşcu)"
  · "Halil hoca ve ekibine çok teşekkür ederiz. Endişe ile gittik ama bizi çok rahatlattılar. Tertemiz bir klinikti. (Helen)"
  · "Hiçbir yara izi olmaması toparlanma sürecini fazlasıyla hızlandırdı. (Aleyna Korkmaz)"
  · "Sokaktan almıştık, kötü bir durumdaydı; onu sağlığına kavuşturdu. Klinik olması gerektiği gibi çok hijyenik. (Fulya Ulutaş)"

Tasarım A (zaten yapıldı) şu dünyada: Açık zemin (porcelain), vurgu kırmızı #c62828, Noto Serif/Sans, ikiye bölünmüş hero (sol metin, sağ resepsiyon fotoğrafı), kart hizmetler, masonry galeri, yorum kartları.
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
            "primaryCta": "...", "whatsappCta": "...", "whatsappPrefill": "Merhaba, Esenler Batı Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: " },
  "about": { "title": "...", "body": "2-3 cümle, paragraflar \n\n ile", "highlights": [{"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}] },
  "services": [ { "name": "...", "description": "tek cümle" } ],
  "faq": [ { "q": "...", "a": "..." } ],
  "cta": { "headline": "...", "subline": "tek cümle", "button": "..." },
  "seoTitle": "en fazla 60 karakter", "seoDescription": "en fazla 155 karakter"
}
```
