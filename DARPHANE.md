# DARPHANE — tek dosyada her şey

> Bu dosya projenin **ana kaydıdır**. Repoya bağlanan her ajan (Claude, Codex, Manus, ChatGPT, insan) önce bunu okur; yaptığı her işi en alttaki **İş günlüğü**'ne tarih, ajan adı, ne yapıldığı ve commit'iyle işler. Kural: günlüğe işlenmemiş iş yapılmamış sayılır.

Son güncelleme: 2026-09-07 08:40 · Canlı: https://fourpear.vercel.app · Panel: /panel · Repo: `Serdaf123/Darphane` (private)

---

## 1. Ne bu?

**Darphane**, fourpear'ın (Serkan Oral) hızlı gelir işi: web sitesi olmayan yerel işletmeleri Google Haritalar'da bulup, **istenmeden** tek sayfalık kaliteli bir site kurup, linki WhatsApp'tan **son günlü** bir teklifle göndermek. Beğenirse tek seferlik ücret (şu an 8.500 ₺; 7.900/9.900 iki paket önerisi kararda), alan adı kurulumu dahil; beğenmezse site son günde yayından kalkar. Satılana kadar siteler arama motorlarına kapalıdır.

Aynı repo Serkan'ın kişisel tanıtım sitesini de (`serkanoral.com.tr`, kök `/`) ve iç yönetim panelini (`/panel`) barındırır.

Kararlar: tek seferlik ücret · hız önce · aday bulma elle (Serkan) · Vercel · İlk sektör kararı verilmedi, iki-üç sektörden test.

## 2. Nasıl çalışır (uçtan uca)

1. **Aday**: Serkan Google Haritalar'da sitesi olmayan işletme bulur (`npm run find-leads` Places API ile yardım eder, anahtar gerek).
2. **Site**: `data/sites/<slug>.json` yazılır (elle ya da `npm run draft` ile Claude API'den taslak). Push → Vercel deploy → `/<slug>` canlı, noindex, üstte teklif şeridi (geri sayım, fiyat, "Detaylar" → `/<slug>/teklif`, "Sitemi Satın Al" → WhatsApp).
3. **Teklif paketi**: `npm run pitch -- <slug>` → telefon çerçeveli görsel + OG kartı + mesaj panoya. Kural: **önce 30 sn arama** ("WhatsApp'a atayım mı?"), sonra görsel, sonra metin. Panelde "Teklif gönderildi (+7 gün)".
4. **Sinyal**: PostHog (anahtar gelince) site_viewed / scroll_depth / cta_click / engaged; `/api/uyari` bunları Telegram'a düşürür. KVKK bandı onay vermeden hiçbir şey kaydedilmez.
5. **Karar**: `/<slug>/teklif` sayfası ne dahil, alan adı müsaitliği, süreç, SSS, ödeme/WhatsApp. "Hayır" gelirse panelde **Reddetti → kaydı sil** (mesajdaki "bilgilerinizi silerim" sözü).
6. **Satış**: panelde "Satıldı" ya da `npm run sell -- <slug> --domain ornek.com` → şerit kalkar, noindex kalkar, sitemap/JSON-LD açılır, alan adı müşteri adına, host yönlendirmesi.
7. **Süre dolumu**: `expiresAt` geçince sayfa kendini "teklif süresi doldu" ekranına çevirir (ISR 5 dk).

## 3. Teknik yapı

- **Next.js 16** (App Router, Turbopack, `proxy.ts` = middleware), React 19, Tailwind v4, TypeScript, zod 4 (`lib/schema.ts` tek doğruluk kaynağı).
- **Veri**: `data/sites/<slug>.json`; katmanlar `<slug>.en.json` (İngilizce, `/slug/en`) ve `<slug>.b.json` (ikinci tasarım, `/slug/b`). `lib/sites.ts` okur/birleştirir.
- **Rotalar**: `/` kişisel site · `/serkan-oral` (noindex, alan adı yönlendirmesi) · `/[slug]`, `/[slug]/en`, `/[slug]/b`, `/[slug]/teklif`, `/[slug]/opengraph-image` · `/panel`, `/panel/[slug]` (giriş korumalı) · `/giris`, `/api/giris`, `/api/cikis` · `/api/uyari` · `/gizlilik` · `/robots.txt`, `/robots-open` (satılan alan adında), `/sitemap.xml`.
- **Bölüm kütüphanesi** (`components/sections/`): hero (image · split · minimal · statement; `urgent` blok; `video`), about, services (cards/list/grid, tone dark), menu (list/photos), gallery (grid/masonry/strip), reviews (cards/quotes/marquee), hours (açık/kapalı rozeti), location (harita), contact (WhatsApp'a giden form), faq, cta, **pricing**, **team**, **beforeAfter**. Menü otomatik (`lib/nav.ts`).
- **Tema**: 9 preset (porcelain, ember, sage, midnight, cobalt, sand, bosphorus, graphite, ink) ya da `theme.accent` ile OKLCH palet motoru (`lib/palette.ts`, WCAG 7/4.5/3 zorunlu, APCA raporlu), `neutralTint`, `mode`, 9 font çifti (`lib/fonts.ts`), Utopia tip ölçeği, `photos: mono`, header glass/solid/minimal/none, contact bar/fab/both, fabStyle dial/pill, motion (hero rise/reveal/blur/curtain/zoom/split; scroll; smooth Lenis; parallax). Bölüm zeminleri hero sonrası otomatik dönüşümlü.
- **Hareket**: hero girişleri CSS (JS beklemez, LCP'yi bloklamaz); GSAP yalnız split/parallax/kişisel sitede ve gerektiğinde iner; motion → LazyMotion.
- **Teklif mekaniği**: `offer.status` draft · pitched · sold · expired · **demo** (şerit yok, süre yok, indeks kapalı); `expiresAt`, `price`, `paymentUrl`, `packages[]`, `seller`. Noindex üç katman (metadata, robots.ts, X-Robots-Tag).
- **Panel** (`app/panel`): liste + detay (teklif alanları, hızlı işlemler, linkler, gönderim metni, sil). Kayıt katmanı `lib/store.ts`: `DARPHANE_GITHUB_TOKEN` varsa GitHub Contents API ile commit (canlıda şart), yoksa yerel dosya.
- **Kişisel site** (`app/serkan-oral/page.tsx`, `components/serkan/`): ısmarlama; GSAP isim, sabit telefonda üç adım, yatay kartlar, mobil alt çubuk, JSON-LD, kök OG. Tasarım B Codex'te (`app/serkan-oral/b`, `components/serkan-b`).
- **Analitik**: PostHog (isteğe bağlı yüklenir, KVKK onaylı), Vercel Analytics.
- **CI**: `.github/workflows/ci.yml` (typecheck, lint, build, WebP denetimi), `lighthouse.yml` (a11y ≥ 93 zorunlu, perf ≥ 80 uyarı).
- **Deploy**: Vercel `darphane-74qr`, her `main` push'u; commit yazarı **Serdaf123** olmalı (Hobby aksi hâlde sessizce bloklar). Vercel Hobby ticari kullanıma kapalı → ilk satışta Pro.

## 4. Komutlar

| Komut | Ne yapar |
|---|---|
| `npm run dev` / `build` / `start` | Geliştirme / derleme / üretim |
| `npm run typecheck && npm run lint && npm run build` | Push öncesi zorunlu üçlü |
| `npm run new-site` | Boş site iskeleti |
| `npm run draft -- <maps-metni.txt>` | Claude API'den taslak JSON (ANTHROPIC_API_KEY) |
| `npm run find-leads` | Places API ile sitesiz işletmeler (GOOGLE_PLACES_API_KEY) |
| `npm run screenshot -- <slug> [url] [--clean]` | Telefon çerçeveli görüntü (sistem Chrome) |
| `npm run pitch -- <slug> [--b]` | Görsel + OG + mesaj panoya |
| `npm run duo -- <slug>` | A/B yan yana görsel |
| `npm run sell -- <slug> --domain ornek.com` | Satış: status sold, alan adı, push |
| `npm run palette -- <foto>` | Fotoğraftan OKLCH accent |
| `npm run check:palettes` | Tüm paletlerde kontrast denetimi |
| `npm run webp` | public/ altındaki PNG/JPG → WebP, referansları günceller |
| `npm run manus -- <brif.md> --out <dosya.md>` | Manus'a görev (MANUS_API_KEY) |

Env: `.env.example` (anahtarlar yalnız `.env.local` ve Vercel env'inde; repoya asla).

## 5. Kurallar (kısa; tam liste NOTLAR.md §1)

- **Metin**: yalnız Google kaydından doğrulanabilir olgular. Uydurma yorum, rakam, yıl, "en iyi" yok. Reklam dili, ünlem, büyük harfli etiket yok. Avukat/doktor sitelerinde reklam yasağı (yorum, başarı iddiası yok).
- **Tasarım**: krem+serif+terracotta, Inter+Playfair, eyebrow etiket, numaralı kartlar, tek renk vurgulanmış kelime, glif ikon (✓ ⇔ ★) yok. Her siteye konudan gelen palet/font. Hareket tek orkestrasyon, reduced-motion'a saygı. Telefonda ilk ekranda birincil buton.
- **Satış/hukuk**: esnaf/tacire ön onaysız ileti yasal ama kimlik + veri kaynağı + ret satırı şart; ret gelince 3 iş günü içinde dur, veriyi sil. **Avukat, doktor, mimar gibi serbest meslek sahiplerine soğuk WhatsApp yok** (KVKK 2022/861). Günde ≤10–15 yeni numara, bire bir, elle. Teklif aşamasında işletmenin kendi fotoğrafını kullanma (FSEK).
- **Teknik**: public/ altında yalnız WebP. Şerit büyümesin (CLS). GSAP ve motion aynı transform'u yazmasın. Commit yazarı Serdaf123. Push'tan önce üçlü temiz.
- **Ajan bölüşümü** (AGENTS.md): Claude motor/panel/satış/kişisel site A; Codex kişisel site B (`app/serkan-oral/b`, `components/serkan-b`, ayrı worktree `~/Desktop/darphane-codex`); ChatGPT görseller + esnaf gözüyle değerlendirme (`briefs/04`); Manus metinler (`briefs/01`). Kimse başkasının klasörüne dokunmaz; ortak dosya değişikliği PR'da gerekçeyle.

## 6. Şu ana kadar yapılanlar (3–7 Eylül 2026)

**03.09** İskelet: JSON → site motoru, zod şeması, bölüm kütüphanesi, teklif şeridi + geri sayım + süre dolumu, noindex üç katman, mobil alt bar, açık/kapalı rozeti, WhatsApp formu. Araç seti: skill'ler, sitesiz işletme bulucu, telefon çerçeveli ekran görüntüsü. Header, hero giriş ve kaydırma animasyonları. İlk gerçek aday Olympos Garden Hotel; metinler olgusal yeniden yazıldı. Font çiftleri, yeni paletler, kutusuz düzenler, OG kartı.

**04.09** PostHog sinyalleri, GSAP SplitText/Lenis/parallax/marquee; Claude API taslak üretici; İngilizce katman; satış scripti + ödeme linki + alan adı yönlendirmesi. Avukat sitesi (TBB'ye uygun), statement hero, ink/editorial. Impeccable + ux-skill slop kontrolü; kritik sonrası düzeltmeler; fotoğraflı antet, mono fotoğraf, koyu panel.

**05.09** Gerçek fotoğraflar, SVG yıldızlar. NOTLAR.md (kurallar/yol haritası/karar günlüğü) ve CLAUDE.md. Satıcı numarası; Olympos ve avukat `pitched` (son gün 12 Eylül 21:00); ilk teklif mesajları. OKLCH palet motoru, fotoğraftan renk, Utopia tip ölçeği. Yellow Bull İstanbul Hotel A/B; yüzen iletişim butonu (dial/pill). GitHub `Serdaf123/Darphane`, Vercel deploy, env düzeni, kök sayfa girişi (`/giris`, imzalı çerez).

**06.09** Vercel yazar kuralı bulundu (Serdaf123). Panel (`/panel`) + GitHub'a commit eden kayıt katmanı. `serkanoral.com.tr` Serkan'ın kişisel sitesi olarak kararlaştırıldı; önce motorla, sonra ısmarlama (GSAP, sabit telefon, yatay kaydırma, portre). WebP kuralı ve `npm run webp`. AGENTS.md ile Claude/Codex bölüşümü, Codex'e ayrı worktree.

**07.09 (00–09)** Kök = kişisel site. CI, PR şablonu, TASKS.md, brifler (Manus metin, ChatGPT görsel/değerlendirme, Codex tasarım B). Manus köprüsü. **Teklif sayfası** `/<slug>/teklif` (RDAP alan adı müsaitliği, paketler, künye, yükümlülük yok notu). Kişisel site kritik turu (mobil alt çubuk, kontrast, başlık sırası, JSON-LD, sitemap, kök OG, güvenlik başlıkları), `demo` durumu. Motor: pricing/team/beforeAfter/menü fotoğraf/video hero, kuaför demosu. Performans: CSS hero girişleri, isteğe bağlı GSAP/PostHog, LazyMotion → canlı Lighthouse 95–100. KVKK bandı + /gizlilik, `npm run pitch`, Lighthouse CI, PostHog→Telegram, panelde ret→sil, mesaj şablonlarında zorunlu satırlar. Araştırma raporları (satış/hukuk/ödeme; teknik). Motor kritik turu (mobil ilk ekran, header gizleme, kapalı gün rozeti sunucu saatiyle, zemin ritmi, SVG ikonlar, ekip listesi, odak noktası, CTA bandı). Codex'e sonraki adım.

## 7. Durum ve bekleyenler

**Siteler**: Olympos (pitched, 12.09), Av. Özge Nur Şafak (pitched — gönderimden önce telefonla izin!), Yellow Bull (draft, A/B, paket örneği), demolar: Ocakbaşı Şahin, Dt. Elif Yarar, Salon Ada; kişisel site (sold+domain).

**Serkan'dan**: Manus API anahtarı · PostHog anahtarı + Telegram bot/chat id · Turhost DNS glue düzeltmesi (ns1/ns2.vercel-dns.com → 198.51.44.13 / 198.51.45.13) · ANTHROPIC_API_KEY · fiyat kararı (tek/çift paket) · iyzico Link başvurusu · Yellow Bull A/B seçimi + yorum sayısı + fotoğraflar · avukat için arama-önce.

**Yol haritası**: NOTLAR.md §2 (Places yorum çekme, Pexels/Unsplash paketleri, Notion pipeline, 15 sn MP4, Vercel Pro).

## 8. Diğer dosyalar

`README.md` işletme kılavuzu (komut/tema detayları) · `NOTLAR.md` kurallar + yol haritası + karar günlüğü · `AGENTS.md` ajan kuralları ve dosya bölüşümü · `TASKS.md` görev panosu · `briefs/` ajan brifleri · `docs/` araştırma ve sabah raporu · `content/pitch/` mesaj şablonları ve gönderimler.

---

## 9. İş günlüğü (her ajan buraya yazar)

Biçim: `- **tarih saat · ajan** — ne yapıldı (dosya/rota) · commit · varsa açık konu`. En yeni en altta. Güncelleme yapmadan önce `git pull`; çakışırsa kendi satırını en alta ekle.

- **2026-09-03 → 09-07 08:40 · Claude** — Yukarıdaki §6'daki her şey; son commit `6b1108f`. Açık: Codex PR'ı bekleniyor; Serkan'ın anahtar/kararları §7.
- **2026-09-07 (gece) · Codex** — `codex/serkan-design-b` dalında `components/serkan-b/Concepts.tsx` + `concepts.css` (Portre/Galeri/Afiş konseptleri), henüz commit yok; sonraki adım `darphane-codex/CODEX-GOREV.md`. *(Claude tarafından gözlemden yazıldı; Codex kendi satırını eklesin.)*
- **2026-09-07 09:30 · Claude** — Noyavet 7/24 veteriner sitesi (`/noyavet`, taslak, acil blok; 24 saat açık desteği `00:00–00:00`), teklif metni `content/pitch/gonderim/noyavet.txt`. Kişisel site **Tasarım B (Claude)**: `/serkan-oral/b` — açık kâğıt zemin, Fraunces + DM Sans, telefon vitrini, yeşil bant, JS yok (`components/serkan-b/SerkanB.tsx`, `b.css`). Codex'in üç konsepti kendi dalında (`origin/codex/serkan-design-b`: Portre `/b`, Galeri `/b/galeri`, Afiş `/b/afis`; ayrıca `Hero.tsx`, `sections/index.tsx`, `package.json`, `lib/server-time.ts` gibi ortak dosyalara dokunmuş — PR'da incelenecek). Birleştirmede Codex'in Portre'si `/b/portre`'ye taşınır. Commit: bu.
- **2026-09-07 10:30 · Codex (ana klasörde, gözlemden)** — Üçüncü tasarım varyantı: `app/[slug]/c/page.tsx`, `siteVariants` a/b/c, şeritte A·B·C geçişi, `lib/server-time.ts` ile tek sunucu saati. *Not: bu değişiklikler Codex'in kendi worktree'si yerine ana klasörde yapıldı; Claude eksik `lib/server-time.ts`'i tamamlayıp build doğruladı ve push etti.*
- **2026-09-07 10:35 · Claude** — Vercel projesi `fourpear` adına alındı; yeni adres **https://fourpear.vercel.app** (eski adres de çalışır). Teklif metinleri, README, CI ve pitch varsayılanı yeni adrese geçti. Noyavet A/B canlı.
- **2026-09-07 11:00 · Claude** — `DARPHANE_GITHUB_TOKEN` Vercel'e girildi (prod+preview); panel canlıda GitHub'a commit ederek yazıyor (test: `f9614ab`). Token yalnız Vercel env'inde; repoda yok. Panel token yokken salt okunur uyarısı gösterir.
- **2026-09-07 11:30 · Claude** — Panel canlı testi: fiyat ve durum değişiklikleri GitHub'a commit oluyor, panel anında gösteriyor; site 1–2 dk sonra yenileniyor. Art arda kayıtta sha çakışması için tek yeniden deneme eklendi (`lib/store.ts`). Test sırasında `salon-ada` teklife alınmıştı, demoya geri alındı. Serkan Noyavet'i panelden `pitched` yaptı (fiyat 17.999 ₺, son gün 14.09); teklif metni fiyatla eşitlendi.
- **2026-09-07 14:00 · Claude** — Durum incelemesi: GitHub SSH (`github-serdaf`) ve main↔origin eşit, panel token'ı Vercel'de, canlı 200. CI'ın hiç geçmediği görüldü; `typecheck` → `next typegen && tsc`, `.lighthouserc.json`'dan geçersiz `preset: mobile` kaldırıldı, `.lighthouseci/` gitignore'a. Açık: **repo public** (karar private) — Serkan çevirmeli; PR #1 (Codex Tasarım B) hâlâ açık; MANUS_API_KEY `.env.local`'de boş.
