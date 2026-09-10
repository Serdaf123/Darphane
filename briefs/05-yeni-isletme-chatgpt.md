# Brif 05 — Yeni işletme: Tasarım B + metinler (ChatGPT)

Her yeni aday için Claude bu şablondan **doğrudan ChatGPT'ye hitap eden** bir görev dosyası üretir: `briefs/isletme/<slug>.md` (birden çok adayda ek olarak tek bir toplu dosya: `briefs/isletme/<tarih>-<grup>.md`). Serkan dosyayı ChatGPT'ye ekler ve yalnız şunu yazar:

> Ekteki dosyayı oku ve içindeki görevi yap. Cevap olarak yalnız istenen JSON'u ver.

Uzun metin yapıştırma yok; kural bu (Serkan, 10.09). ChatGPT'nin JSON cevabı Claude'a geri gelir; Claude `.b.json` ve metinleri işler, canlıya alır.

## Görsel kuralı (değişmez)
- Görseller **gerçek fotoğraf** olmalı: üretilmiş/yapay görsel yok, illüstrasyon yok.
- Kaynak: işletmenin izinli kendi fotoğrafları ya da lisansı serbest gerçek fotoğraf (Pexels / Unsplash). Başka bir işletmenin fotoğrafı asla.
- Repo'ya **yalnız WebP** girer (`public/sites/<slug>/`, `npm run webp` çevirir). PNG/JPG commit edilmez; CI reddeder.
- ChatGPT görsel **üretmez**; en fazla arama anahtar kelimesi ve kadraj önerir. Fotoğrafı Claude bulur, WebP'ye çevirir, bağlar.

## ChatGPT'ye verilecek istem (Claude doldurur)

```
İşletme: {ad} — {kategori}, {ilçe}/{şehir}
Doğrulanmış olgular (yalnız bunları kullan, yenisini ekleme):
{olgular: puan, yorum sayısı, adres, telefon, saatler, hizmetler, Maps'ten alınan 3-5 yorum cümlesi}

Tasarım A (Claude yaptı) şu dünyada: {A: preset, vurgu, font, hero tipi, tek cümle}.
Senden Tasarım B: A'nın kopyası olmayan, aynı olgularla farklı bir dünya. Sadece aşağıdaki
listelerden seç, başka değer yazma.

  preset: porcelain | ember | sage | midnight | cobalt | sand | bosphorus | graphite | ink
  accent: #rrggbb (isteğe bağlı; verilirse palet bundan üretilir)
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

Metin kuralları: yalnız doğrulanabilir olgu; rakam, yıl, "en iyi", müşteri sayısı, yorum
uydurma yok. Ton sakin, esnafın diliyle, "siz" hitabı, ünlem yok, İngilizce pazarlama
kelimesi yok. Başlık tek fikir (en fazla 6 kelime). Alt satır en fazla 2 cümle.
Buton metni fiil + ne alacağı. Türkçe kesme işareti doğru.

Çıktı: tek bir JSON, başka açıklama yok:
{
  "why": "bu dünyayı neden seçtin, 2 cümle",
  "theme": { "preset": "...", "accent": "#...", "mode": "...", "fonts": "...", "headingFont": "...",
             "typeScale": "...", "radius": "...", "density": "...", "header": "...", "photos": "...",
             "motion": { "hero": "..." } },
  "hero": { "variant": "...", "headline": "...", "subline": "...", "badges": ["...", "..."],
            "primaryCta": "...", "whatsappCta": "...", "whatsappPrefill": "Merhaba, {ad} için yazıyorum.\n..." },
  "about": { "title": "...", "body": "2-3 cümle", "highlights": ["...", "...", "..."] },
  "services": [ { "title": "...", "desc": "tek cümle" } ],
  "faq": [ { "q": "...", "a": "..." } ],
  "cta": { "title": "...", "body": "tek cümle", "button": "..." },
  "photoSearch": { "hero": "pexels arama ifadesi (İngilizce)", "gallery": ["...", "..."] },
  "seoTitle": "en fazla 60 karakter", "seoDescription": "en fazla 155 karakter"
}
```

## Claude'un yapacağı
1. Google Drive sayfasından satırı oku → Maps linkini aç → olguları çıkar (ad, kategori, adres, telefon, puan, yorum sayısı, saatler, yorumlar).
2. Tasarım A: `data/sites/<slug>.json` (status `draft`, teklif alanları `.env`den).
3. Brifi doldur → `briefs/isletme/<slug>.md`; Serkan'a ver.
4. Cevap gelince: `data/sites/<slug>.b.json` (theme + hero + hizmetler tonu) ve metinleri işle.
5. Gerçek fotoğraf bul (Pexels/Unsplash), `npm run webp`, bağla; `focal` ayarla.
6. `npm run typecheck && npm run lint && npm run build` → push → canlı kontrol (A, B, mobil, noindex).
7. `npm run pitch -- <slug>` ile teklif metni; DARPHANE.md günlüğüne işle.
