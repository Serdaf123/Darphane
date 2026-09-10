# Adraga Veteriner Kliniği — ChatGPT görevi: Tasarım B + metinler

Aşağıdaki bloğu olduğu gibi ChatGPT'ye yapıştır. Cevabı (tek JSON) Claude'a geri ver.

```
Sen bir web tasarımcısı ve Türkçe metin yazarısın. Bir veteriner kliniği için tek sayfalık sitenin
ikinci tasarımını (Tasarım B) seçecek ve tüm metinleri yazacaksın.

İşletme: Adraga Veteriner Kliniği — Veteriner kliniği
Doğrulanmış olgular (yalnız bunları kullan, yenisini ekleme, rakam/yıl/ünvan uydurma):
- Ad: Adraga Veteriner Kliniği · Kategori: Veteriner kliniği
- Adres: Yalı Mah., Sahilyolu Cd. No:8, Maltepe/İstanbul (sahil)
- Telefon: 0552 799 98 89 (sabit: 0216 352 95 98) · WhatsApp: 905527999889
- Google puanı: 4,8 (112 yorum)
- Çalışma saatleri: Pazartesi–cumartesi 10:00–19:30, pazar kapalı
- Hekim: Özüm Bey ve Ece Hanım (yorumlarda geçiyor)
- Hizmetler: Tabeladan: dahiliye, cerrahi, doğum ve jinekoloji, laboratuvar, X-ray bilgisayarlı röntgen, aşılama, koruyucu hekimlik, diş temizliği, tıraş-banyo
- Fotoğraf dünyası (gerçek klinik fotoğrafları, Google Maps'ten; elimizde bunlar var): Yeşil cepheli bina, siyah tabelada beyaz 'VETERİNER' ve turuncu 'Kliniği'; içeride hardal sarısı duvar, gri resepsiyon, laboratuvar cihazları, çelik ameliyat masası, kedi-köpek duvar logosu.
- Yorumlardan (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  · "Kedimizi hızlıca muayene edip röntgen çekip yardımcı oldular. Özüm Bey'in yaklaşımı gerçekten güven vericiydi. (Tarık Yanova)"
  · "Kimsenin koyamadığı tanıyı anında koyup ona uygun tedaviyi titizlikle uyguladılar. (Merve Karakuş)"
  · "Ampute etmeden önce bir tedavi deneyelim dedi ve kedi şu an yürüyor. (Hamide Bıyıklı)"
  · "Yüksekten düşme yaşadık, bizimle çok ilgilendiler; Ece hoca ameliyatını yaptı. (Sinem Akdağ)"

Tasarım A (zaten yapıldı) şu dünyada: Adaçayı zemin (sage), vurgu turuncu #e0862a, Bricolage + Source Serif (craft), fotoğraflı tam ekran hero (resepsiyon), koyu hizmet ızgarası (8 hizmet), 6'lı galeri, yorum kartları.
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
            "primaryCta": "...", "whatsappCta": "...", "whatsappPrefill": "Merhaba, Adraga Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: " },
  "about": { "title": "...", "body": "2-3 cümle, paragraflar \n\n ile", "highlights": [{"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}] },
  "services": [ { "name": "...", "description": "tek cümle" } ],
  "faq": [ { "q": "...", "a": "..." } ],
  "cta": { "headline": "...", "subline": "tek cümle", "button": "..." },
  "seoTitle": "en fazla 60 karakter", "seoDescription": "en fazla 155 karakter"
}
```
