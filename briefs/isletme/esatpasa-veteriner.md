# Esatpaşa Veteriner Kliniği — ChatGPT görevi: Tasarım B + metinler

Aşağıdaki bloğu olduğu gibi ChatGPT'ye yapıştır. Cevabı (tek JSON) Claude'a geri ver.

```
Sen bir web tasarımcısı ve Türkçe metin yazarısın. Bir veteriner kliniği için tek sayfalık sitenin
ikinci tasarımını (Tasarım B) seçecek ve tüm metinleri yazacaksın.

İşletme: Esatpaşa Veteriner Kliniği — Veteriner kliniği (7/24 nöbetçi)
Doğrulanmış olgular (yalnız bunları kullan, yenisini ekleme, rakam/yıl/ünvan uydurma):
- Ad: Esatpaşa Veteriner Kliniği · Kategori: Veteriner kliniği (7/24 nöbetçi)
- Adres: Esatpaşa Mah., Adnan Menderes Cd. No:108A, Ataşehir/İstanbul
- Telefon: 0532 570 77 32 · WhatsApp: 905325707732
- Google puanı: 4,9 (114 yorum)
- Çalışma saatleri: Her gün 24 saat açık
- Hekim: Veteriner Hekim Osman Kısa (tabelada ve yorumlarda geçiyor)
- Hizmetler: Acil müdahale, muayene ve tahlil, aşı, kısırlaştırma ve ameliyat, mama/bakım ürünleri satışı (yorumlar ve fotoğraflardan)
- Fotoğraf dünyası (gerçek klinik fotoğrafları, Google Maps'ten; elimizde bunlar var): Sarı cepheli bina, siyah tabelada bordo 'VETERİNER' yazısı; içeride yeşil duvarlar, çelik muayene masası, mama rafları. Müşteri hayvan fotoğrafları (köpek, kedi).
- Yorumlardan (aynen kullanılabilir, kısaltılabilir, değiştirilemez):
  · "Kedim Ayşegül'e mantar teşhisi konuldu ve hızlıca tedavisine başlandı. Özenli bir şekilde tedavi edildi ve evde uygulayacağım bakım detaylıca anlatıldı. (Melissa Nur Gün)"
  · "1,5 yaşındaki Şivava köpeğim Berlin için ilk günden itibaren çok ilgili ve güven veren bir süreç yaşadık. Sadece tedavi değil, doğru yönlendirme ve açık iletişim de sundular. (Cilem Cal)"
  · "Gece geç saat olmasına rağmen panikle hemen kliniği aradım ve Osman hocam çok sakin bir şekilde olabilecek tüm senaryoları bana açıkladı. (Elifcan Çağdaş)"
  · "Kedim Mia'yı 40 derece ateşle çok zor bir durumda götürdük. Sadece tedaviye ve Mia'nın sağlığına odaklanan, maddi kaygıyı ikinci planda tutan bir hekimle karşılaştık. (Nazlıcan Kurt)"

Tasarım A (zaten yapıldı) şu dünyada: Açık zemin (ink preset), vurgu bordo #b5123f, Figtree (clean), fotoğraflı tam ekran hero (tabela fotoğrafı), 'acil' şeridi, koyu hizmet bloğu, 6'lı galeri, Google yorum kartları.
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
            "primaryCta": "...", "whatsappCta": "...", "whatsappPrefill": "Merhaba, Esatpaşa Veteriner Kliniği için yazıyorum.\nHayvan (tür/yaş): \nŞikâyet: " },
  "about": { "title": "...", "body": "2-3 cümle, paragraflar \n\n ile", "highlights": [{"label": "...", "value": "..."}, {"label": "...", "value": "..."}, {"label": "...", "value": "..."}] },
  "services": [ { "name": "...", "description": "tek cümle" } ],
  "faq": [ { "q": "...", "a": "..." } ],
  "cta": { "headline": "...", "subline": "tek cümle", "button": "..." },
  "seoTitle": "en fazla 60 karakter", "seoDescription": "en fazla 155 karakter"
}
```
