# Darphane — teknik araştırma (2026-09-07)

Amaç: mevcut sistemi (Next 16.3 · React 19.2 · Tailwind v4 · GSAP 3.15 · Lenis 1.3.26 · OKLCH palet · Playwright · Claude taslak · PostHog · Vercel) **yeniden icat etmeden** neyi alıp neyi atlayacağımızı netleştirmek. README ve NOTLAR.md'de zaten olan şeyler burada yok; olan bir şeye dokunuyorsa "bizde şu var, fark bu" diye yazıldı.

Yıldız / lisans / son commit değerleri GitHub API'den bugün (2026-09-07) çekildi. Fiyatlar resmi fiyat sayfalarından; değişebilir.

---

## 0. Özet — sıralı karar listesi

| Sıra | Ne | Neden | Süre | Karar |
|---|---|---|---|---|
| 1 | GSAP/Lenis katmanını `next/dynamic` ile mobil ve reduced-motion dışında yüklememek (§3.1) | HeroMotion.tsx bugün gsap + ScrollTrigger + SplitText'i statik import ediyor; her ziyaretçi ~110 kB min JS indiriyor, telefonda da | 2 sa | **Şimdi** |
| 2 | `chrome-devtools-mcp` (Google, 51k★) — mobil emülasyonla `performance_start_trace` + `lighthouse_audit` (§4.1) | Lighthouse'u sohbetten koşturup düzeltme döngüsü kurmak; ayrı Lighthouse MCP'ye gerek kalmıyor | 10 dk | **Şimdi** |
| 3 | `sitemap.ts`'e `alternates.languages` (+ `x-default`) ve JSON-LD'ye alt tür + saatler + `sameAs`/`hasMap` (§6) | Satılan sitelerde Google'ın tr/en ilişkisini ve işletme kaydını sayfaya bağlaması | 1 sa | **Şimdi** |
| 4 | `hours.ts`'te saat dilimi `Europe/Istanbul` sabitlemesi kontrolü (§1.4) | Vercel sunucusu UTC; "şu an açık" 3 saat kayabilir | 15 dk | **Şimdi (kontrol)** |
| 5 | Vercel MCP resmi uç noktası (§4.4) | Deploy/log/analytics'i CLI yerine sohbetten; `sell` scriptinin alan adı adımı için token gerekmez | 5 dk | **Şimdi** |
| 6 | `greensock/gsap-skills` (resmi, 15k★) (§4.5) | Kendi yazdığımız ScrollTrigger kodunun doğruluğu; `gsap-performance` skill'i | 5 dk | **Şimdi** |
| 7 | Lighthouse CI (`treosh/lighthouse-ci-action`) mevcut `ci.yml`'e bütçeyle (§3.6) | Perf gerilemesi PR'da yakalansın (yol haritası #11) | 1 sa | **Sonra** (ilk satıştan sonra) |
| 8 | Places API'den yorum: `place_id` sakla, `reviews` alanını 24 saatte bir ISR ile çek, atıf + Maps linki göster (§1.2) | Yorumları JSON'a kopyalamak Places şartlarına aykırı; 5 yorum sınırı; 1000 ücretsiz çağrı/ay yeter | 2 sa | **Sonra** (yol haritası #10, anahtar gelince) |
| 9 | Pexels + Unsplash sektör paketleri; Unsplash'ta hotlink + atıf satırı (§5) | Teklif aşamasında telif temiz; Pexels atıf istemiyor, API'de "Photos provided by Pexels" linki yeter | 2 sa | **Sonra** (yol haritası #12) |
| 10 | HyperUI / Magic UI'dan **tek tek** bölüm fikri (fiyat tablosu, ekip, marquee) (§1.1) | Yeni bölümler için tasarım hammaddesi; kütüphane bağımlılığı yok | bölüm başı 1 sa | **Sonra** (talebe göre) |
| — | Google Maps scraper'ları (gosom, omkarcloud) | ToS ihlali + IP/hesap riski; `find-leads` zaten Places API ile çalışıyor | — | **Atla** |
| — | opening_hours.js, react-floating-whatsapp, react-google-reviews, Puck/GrapesJS/Webstudio | Bizde karşılığı var ya da lisans/ölçek uymuyor | — | **Atla** |
| — | Three.js / WebGL hero (Sky Clinics tarzı) | Esnaf sitesinde telefonda 90+ Lighthouse'u yer; satış argümanı değil | — | **Atla** |

---

## 1. Açık kaynak repo ve paketler

### 1.1 Landing page bölüm kütüphaneleri (React / Tailwind v4)

| Repo | ★ | Lisans | Son push | Ne alınır |
|---|---|---|---|---|
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | 46.8k | **MIT + Commons Clause** | 2026-09-05 | Metin animasyonları (blur reveal, scramble, split), arka plan efektleri. Lisans: "uygulama/site/ürünün parçası olarak" kullanım serbest; bileşenleri **ayrı ürün olarak satmak** yasak. Bizim durumumuz (müşteri sitesi) uygun. CSS/GSAP tabanlı, Framer Motion zorunlu değil. |
| [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | 22.2k | MIT | 2026-09-05 | Marquee, number ticker, blur-in, word pull-up, bento grid. Framer Motion (motion) bağımlılığı — **kopyalarken GSAP'e çevir**, ikinci animasyon motoru ekleme (NOTLAR: GSAP ve motion aynı transform'u yazmasın). |
| [markmead/hyperui](https://github.com/markmead/hyperui) | 12.2k | MIT | 2026-09-06 | **Tailwind v4 native**, saf HTML. Fiyat tablosu, ekip, SSS, footer, "önce/sonra" için en hızlı hammadde (yol haritası #9). Kopyala, JSX'e çevir, token'larımızı bağla. |
| [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) | 6.2k | MIT | 2026-03-19 | Text effect, in-view, image comparison (önce/sonra slider!). `motion` bağımlı; sadece image-comparison'ı GSAP Draggable'la yeniden yaz. |
| [PageAI-Pro/page-ui](https://github.com/PageAI-Pro/page-ui) | 1.7k | MIT | 2026-07-06 | Next.js landing bileşenleri (shadcn tarzı CLI). SaaS odaklı; yalnızca "testimonial grid" ve "feature list" düzen fikri. |
| [htmlstreamofficial/preline](https://github.com/htmlstreamofficial/preline) | 6.4k | MIT + "Fair Use" çift lisans | 2026-08-31 | Tailwind v4 uyumlu HTML blokları. HyperUI yeterliyse gerek yok. |
| [romboHQ/tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) | 3.3k | MIT | 2026-02-12 | `motion-preset-fade` gibi sınıflarla CSS animasyon. **Mobilde GSAP'siz `fade` için** aday: v4'te `@plugin "tailwindcss-motion"` ile yüklenir. Reduced-motion'ı otomatik saygılar. |
| TailGrids/tailgrids | 1.6k | MIT | 2026-08-04 | Genel UI; landing için HyperUI'dan zayıf. Atla. |

**Öneri:** kütüphane kurma, bölüm başına kopyala. Sıra: fiyat tablosu (HyperUI) → ekip (HyperUI) → önce/sonra (motion-primitives image-comparison, GSAP'e çevrilmiş) → sayaçlı istatistik (Magic UI number-ticker → `gsap.to` + `snap`). Mobilde `tailwindcss-motion` ile CSS-only fade, masaüstünde GSAP `rise` (NOTLAR'daki uzlaşma bunu kodlar).

### 1.2 Google Maps / Places: lead, yorum, fotoğraf

**Scraper'lar (doğrulandı, ama atla):**

| Repo | ★ | Lisans | Son push | Not |
|---|---|---|---|---|
| [gosom/google-maps-scraper](https://github.com/gosom/google-maps-scraper) | 5.8k | MIT | 2026-08-22 | Go, en olgunu; e-posta, yorum, koordinat çıkarır. |
| [omkarcloud/google-maps-scraper](https://github.com/omkarcloud/google-maps-scraper) | 3.4k | MIT | 2026-07-27 | Python; 50+ alan, ~120 yer/dk. |
| [georgekhananaev/google-reviews-scraper-pro](https://github.com/georgekhananaev/google-reviews-scraper-pro) | 327 | MIT | 2026-04-23 | Yalnız yorum + görsel; artımlı. |

**Hukuki/ToS:** Google Maps Kullanım Şartları toplu çekmeyi açıkça yasaklıyor; ABD'de hiQ/Van Buren sonrası ceza riski düşük ama **sözleşme ihlali + IP/hesap engeli** gerçek. Türkiye'de şahıs işletmelerinde ad + telefon **kişisel veri** (KVKK) — `leads/` git dışında (zaten), kullanım sonrası sil, ilk mesajda ret cümlesi (NOTLAR'da var). `npm run find-leads` Places API ile çalıştığı için scraper'a ihtiyaç yok. **Atla.**

**Places API (New) — resmi yol, ne kadar tutar:** (fiyat sayfası, 1000 istek başına; aylık ücretsiz: Essentials 10.000 · Pro 5.000 · Enterprise 1.000)

| İş | Alan maskesi | SKU | $ / 1000 |
|---|---|---|---|
| `find-leads` (websiteUri boş mu) | `websiteUri, rating, userRatingCount` → **Enterprise** | Text Search Enterprise | 35 (1.000 ücretsiz/ay) |
| Yorum çekme | `reviews` → **Enterprise + Atmosphere** | Place Details Ent.+Atm. | 25 (1.000 ücretsiz/ay) |
| Saat/telefon | `regularOpeningHours, nationalPhoneNumber` → Enterprise | Place Details Enterprise | 20 |
| Fotoğraf | `photos` (IDs Only SKU'da bedava) + Place Photos | Place Photos | 7 (1.000 ücretsiz/ay) |

Kurallar (Places politikaları sayfası):
- **Önbellek yok**: "must not pre-fetch, cache, or store" — istisna yalnız `place_id` (süresiz saklanabilir). Fotoğraf `name`'i de saklanamaz, süresi dolar.
- Yorum/fotoğraf gösterirken **yazar atıfı zorunlu** (avatar + ad + profil linki; yer darsa en az avatar) ve kullanıcı `googleMapsUri` ile kaynağa gidebilmeli; yorumların nasıl sıralandığı yazılmalı.
- Place Details **en fazla 5 yorum** döner; 2015'ten beri sayfalama yok.
- Kendi konumun için tüm yorumlar: **Business Profile API** (`accounts.locations.reviews.list`, ücretsiz) — ama işletme sahibinin OAuth onayı + Google'ın API erişim başvurusu gerekir. Satış sonrası paket olarak düşünülebilir, teklif aşaması için değil.

**Uygulama (yol haritası #10 için):** JSON'a `business.placeId` ekle; `reviews` bölümünde `source: "places"` ise sunucuda `fetch(..., { next: { revalidate: 86400 } })` ile çek, yalnız `reviews,rating,userRatingCount` maskesi. 30 site × 30 gün = 900 çağrı/ay → ücretsiz dilim içinde. Kart altına "Google'da gör" (`googleMapsUri`) + avatar/ad. `draft` scriptinin Maps metninden yorum kopyalaması ToS açısından gri; Places'e geçince kalkar.

**MCP (bkz. §4.3):** resmi `@modelcontextprotocol/server-google-maps` **arşivlendi** (servers-archived, 2025-05). Google'ın [googlemaps/platform-ai](https://github.com/googlemaps/platform-ai) reposu yalnız doküman-RAG (`gmp-code-assist`), Places sorgusu yapmaz. Topluluk: [cablate/mcp-google-map](https://github.com/cablate/mcp-google-map) 443★ MIT (2026-08-16).

### 1.3 Yorum / fotoğraf içe aktarıcılar

| Repo | ★ | Lisans | Not |
|---|---|---|---|
| [featurable/react-google-reviews](https://github.com/featurable/react-google-reviews) | 73 | MIT | Featurable'ın kendi API'sinden (üçüncü taraf önbellek) yorum çeker — ToS riski onlarda ama bağımlılık bizde. JSON-LD "review" üretiyor; **Google kendi sitene kendi yorumlarını schema olarak koymayı istemiyor** (§6). **Atla.** |

### 1.4 Çalışma saati / "şu an açık"

| Paket | Lisans | Not |
|---|---|---|
| `opening_hours` 3.14 (opening-hours.js, 256★, 2026-09-06) | **LGPL-3.0** | OSM sözdizimi; bizim JSON saatleri için ağır. **Atla.** |
| `@phoenix344/opening-hours` 2.0 | MIT | Bağımsız TS, "yakında kapanıyor" göstergesi var. `lib/hours.ts` zaten var; sadece fikir: **"30 dk içinde kapanıyor"** durumu. |

**Kontrol edilecek (şimdi):** `lib/hours.ts` `new Date()` ile mi hesaplıyor? Vercel'de sunucu saati UTC; statik/ISR sayfada "şu an açık" yanlış çıkar. Doğrusu: istemcide (`useNow`) ve `Intl.DateTimeFormat("tr-TR", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", weekday: "short" })` ile yerel saat üretmek. Places `regularOpeningHours.periods` → `{day, open:{hour,minute}, close:{...}}` biçimi bizim JSON'a birebir çevrilir.

### 1.5 Türkçe yardımcılar

Paket gerekmiyor; yerleşik API'ler yeter:
- Büyük harf: `"istanbul".toLocaleUpperCase("tr-TR")` → İSTANBUL (`toUpperCase()` ı/i'yi bozar). Menü etiketleri ve buton metinlerinde bu kullanılmalı.
- Para: `new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(8500)` → ₺8.500.
- Slug: `slugify` (simov, 1.7k★ MIT) `locale: "tr"` **yok**, ama charmap'i ı→i, İ→I, ş→s, ğ→g, ç→c, ö→o, ü→u doğru eşliyor; `new-site` scriptinde `slugify(name, { lower: true, strict: true })` yeterli.
- Telefon: `libphonenumber-js` (3k★ MIT, 2026-06) — `parsePhoneNumber("0532 123 45 67", "TR").format("E.164")` → `+905321234567` (wa.me için `number.slice(1)`), `.formatNational()` → "0532 123 45 67" (gösterim). `draft` çıktısında telefon normalize etmek için 1 satır.
- Başlık satır dengesi: CSS `text-wrap: balance` (Tailwind `text-balance`) — `react-wrap-balancer` (4.2k★) artık gerekmiyor.

### 1.6 Yapısal veriden tek sayfa üreticiler

| Repo | ★ | Lisans | Not |
|---|---|---|---|
| [puckeditor/puck](https://github.com/puckeditor/puck) | 13.3k | MIT | JSON → React görsel editör. **Sonraki yıl** "müşteri kendi metnini düzeltsin" paneli için tek ciddi aday; zod şemamız Puck config'e çevrilebilir. Şimdi değil. |
| GrapesJS | 26.2k | BSD-3 | HTML üretir, bizim React bileşen modeliyle uyumsuz. Atla. |
| webstudio-is/webstudio | 8.9k | AGPL-3.0 | Webflow alternatifi; AGPL. Atla. |

### 1.7 Görsel işleme

- `sharp` 32.6k★ Apache-2.0 (bizde `npm run webp`). Eklenecek tek şey: **ingest scripti** — uzak fotoğrafı indir → 1600/960/480 px WebP + AVIF → 10 px `blurDataURL` (base64) → JSON'a yaz. `plaiceholder` gibi pakete gerek yok: `sharp(buf).resize(10).webp({quality:30}).toBuffer()` + `data:image/webp;base64,…`. Hero için `placeholder="blur"` CLS ve algılanan LCP'yi düzeltir.
- `unpic-img` (2k★) / `ipx` (2.5k★): next/image varken gereksiz. Squoosh CLI ölü. **Atla.**

### 1.8 OG görseli

- `vercel/satori` 13.9k★ MPL-2.0 — bizde `next/og` üzerinden zaten var. `vercel/og-image` **arşivli** (2023). Alınacak tek şey: Satori discussion #173'teki şablon fikirleri (büyük serif isim + 1 fotoğraf + telefon). Değişiklik gerekmiyor.

### 1.9 WhatsApp

- `react-floating-whatsapp` 96★ — son commit 2023-12. **Atla**; bizim `fab`/`dial` bileşeni daha iyi.
- Link biçimi (WhatsApp SSS): `https://wa.me/905321234567?text=<encodeURIComponent(mesaj)>` — ülke kodu ile, başında `+`, sıfır, parantez, tire yok. `api.whatsapp.com/send?phone=` eş değer; `wa.me` kısa olduğu için QR/OG'de bunu kullan.

---

## 2. Tasarım referansları

Godly (godly.website) **recent.design**'a yönlendiriyor (sayfa botlara 403). Land-book filtreleri: *Local Business*, *Food & Drinks*, *Medical*, *Travel* (elle gez). Aşağıdakiler Awwwards'tan doğrulandı (tarih, ödül, etiketler sayfadan).

### 2.1 Modellenecek gerçek restoran / klinik / otel siteleri

| Site | Ödül | Teknik | Bizde karşılığı / alınacak |
|---|---|---|---|
| **Aventura Dental Arts** — aventuradentalarts.com | SOTD 2026-03-19, Dev 8.11, **WPO 8.6** | 2 renk (#EAE8E8 / #14151D), büyük fotoğraf arka planı, hero scroll etkisi, hizmet slider'ı, **sayaç bloğu** | En yakın "klinik" modelimiz. Alınacak: hizmet bölümünü yatay slider yapma seçeneği; sayaç ("12 yıl · 4.9 puan · 1.240 yorum") → `services.layout: "counters"`. Performans puanı yüksek olan tek ödüllü klinik — ağır WebGL yok. |
| **Grand Hotel Central** — grandhotelcentral.com/en | HM 2025-12-16 | **GSAP + Swiper**, sinematik video, "clean / minimal / photographic" | Otel için video hero (yol haritası #8) referansı: sessiz döngü, üstünde hafif serif, tek CTA "Rezervasyon". |
| **Lasala Plaza Hotel** — lasalaplazahotel.com | HM 2026-06-12 | Saf CSS/HTML5 **parallax**, "dikkat çekmeye çalışmayan" lüks | Kanıt: teknik değil fotoğraf + boşluk satıyor. `hospitality` çifti + `parallax: true` ile aynı dile ulaşıyoruz. |
| **Ballena Fine Dining** — ballenacabo.com | HM 2026-06-17 | **Yatay menü bölümü**, storytelling, terracotta/krem (#C2644F / #F8F2E5), video galeri | Restoran menüsü için yatay kaydırma (ScrollTrigger `pin` + `xPercent`) — masaüstünde; mobilde dikey. |
| **Halo Dental** — halodental.com | SOTD 2024-09-10 | Siyah + mercan (#FF5E2B), header animasyonu, **fiyat sayfası scroll**'u | Fiyat tablosu bölümü (yol haritası #9) için düzen. |
| **Crav Burgers** — cravburgers.shop | SOTD 2026-06-13 (Dev) | **Next.js + GSAP**, 2 renk (#f5e3cd / #f91814), loader, sayfa geçişi | Bizim stack'le SOTD alınabildiğinin kanıtı; loader ve geçiş fikirleri "cesareti tek yerde harca" kuralına aykırı — sadece tipografi cüreti alınır. |
| **Units** — units.gr | SOTD 2026-07-02 | Scrollytelling galeri, hover detay, Lottie | Galeri için "kaydırdıkça büyüyen kart" fikri. |
| Burrito Madre — burritomadre.rs | HM 2026-07-09 | **WordPress + Elementor**, illüstrasyon, metin tasarımı | Teknik olmadan da ödül alınıyor: sesi olan metin + tek illüstrasyon. NOTLAR'daki metin kuralıyla uyumlu. |
| Sky Clinics — skyclinics.al | HM 2026-07-14 | Three.js, gündüz/gece dönüşümü | Etkileyici ama esnaf telefonunda 90+ Lighthouse'u yer. **Atla.** |

Diğer 2025–26 otel HM'leri (gezilecek): Palazzo Sogni, The Pop-Up Hotel, Tandjung Sari, White Desert, Supreme Luxury, Studenterkilden. Diş: South Cliff Dental Group (HM 2026-06), LAVA dental (HM 2026-01), Taravilla Lab (HM 2025-05).

### 2.2 Kopyalanacak teknikler (2025–26 kazananlarından)

| Teknik | Nerede görüldü | Kütüphane | Bizde |
|---|---|---|---|
| **Kinetik tipografi** (harfler esner, kırılır, birleşir) | Mat Voyce — SOTD 2025-01-30, GSAP Site of the Year adayı | GSAP SplitText + timeline | `motion.hero: split` var; **yalnız hero'da**, kaydırmada tekrar etmesin. |
| **Ağırlıklı yumuşak kaydırma + görünmez geçişler** | By-Kin — SOTD + Dev Award; Next.js + GSAP + Strapi | Lenis + GSAP | `motion.smooth` var. By-Kin'in dersi: geçişler "dikkat çekmesin". |
| **Sabitlenmiş (pinned) hero, görsel ölçeklenir** | Aventura, Units | `ScrollTrigger.create({ pin: true, scrub: true })` + `scale 1.15→1` | `parallax` var; pin yok. Masaüstünde `motion.hero: "pin"` eklenebilir (1 sa). |
| **Yatay bölüm** | Ballena (menü), Serkan'ın kişisel sitesi (kartlar) | ScrollTrigger `xPercent: -100 * (n-1)`, `end: () => "+=" + width` | Kişisel sitede var; `menu.layout: "horizontal"` olarak taşınabilir. |
| **Görsel açılışı (clip-path reveal)** | Uncommon Studio, Minh Pham | GSAP `clipPath: inset(0 0 100% 0) → inset(0)` | `motion.scroll: reveal` yok; `slide`'a alternatif olarak 30 dk. |
| **Sayaç** | Aventura | `gsap.to(obj, { val: 1240, snap: { val: 1 }, scrollTrigger })` | Yok; yorum sayısı/puan için (§2.1). |
| **Bölüm geçişleri kamera hareketi gibi** | Uncommon Studio | GSAP timeline, `scrub` | Fazla; esnaf sitesinde atla. |

Site of the Year 2025: Lando Norris (OFF+BRAND) — WebGL, bizim için referans değil.

---

## 3. Performans: GSAP/Lenis'li sayfada mobil Lighthouse ≥ 90

Ölçülen boyutlar (bundlephobia): `gsap` 3.13 çekirdek **68.5 kB min / 26.6 kB gz**; ScrollTrigger + SplitText ile ~110–130 kB min; `lenis` **16.4 kB / 4.7 kB gz**. Snapdragon 695 sınıfı telefonda 100 kB JS ≈ 300–500 ms parse (Build With Umar). Bu yük şu an **her ziyaretçiye, telefonda da** gidiyor (`HeroMotion.tsx` statik import).

### 3.1 JS: hareket katmanını koşullu yükle (en büyük kazanç)
- `components/motion/HeroMotion.tsx` ve `SmoothScroll.tsx`'i `next/dynamic(() => import(...), { ssr: false })` ile yükle; yalnız `theme.motion.hero !== "none"` **ve** `matchMedia("(prefers-reduced-motion: no-preference)")` **ve** (masaüstü ya da `motion.hero` gerçekten mobilde isteniyorsa) koşulunda mount et. Hero HTML'i sunucuda zaten render ediliyor; animasyon sonradan biner (opacity başlangıcını CSS'te `[data-motion="pending"]` ile ver, JS gelmezse görünür kalsın).
- `SplitText`'i ayrı chunk'a al: `const { SplitText } = await import("gsap/SplitText")` yalnız `hero === "split"` iken.
- Tek kayıt noktası: `lib/gsap.ts` içinde `gsap.registerPlugin(ScrollTrigger, useGSAP)`; her bileşen oradan import etsin (GSAP resmi React rehberi: `useGSAP` + `contextSafe`, `"use client"`).
- `ScrollTrigger.matchMedia` / `gsap.matchMedia()` ile `(min-width: 768px)` dışında ScrollTrigger hiç oluşturma; mobilde `Reveal` bileşeni `IntersectionObserver` + CSS transition (ya da `tailwindcss-motion`) ile çalışsın. NOTLAR'daki "mobilde fade, masaüstünde rise" kararı bunu zaten söylüyor — fark: mobilde GSAP **indirilmesin**.
- PostHog: `posthog-js` (~50 kB gz) `afterInteractive` değil, `requestIdleCallback` sonrası ya da ilk etkileşimde yükle; oturum kaydını `disable_session_recording: true` başlatıp `engaged` (30 sn) olayından sonra `startSessionRecording()` — KVKK bandı (#7) ile aynı yerde çözülür.

### 3.2 Lenis
- Lenis dokümanı: `syncTouch: false` varsayılan — dokunmatikte native kaydırma kalır; iOS < 16'da `syncTouch: true` sorunlu. Yani telefonda Lenis fiilen boşta çalışıyor; **dokunmatik cihazda hiç mount etme** (`matchMedia("(hover: none)")`), 5 kB + RAF döngüsü gider.
- GSAP entegrasyonu resmi kalıp: `lenis.on("scroll", ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)` — `SmoothScroll.tsx` bunu yapıyor; `autoRaf` ile çift RAF olmasın.
- Sınırlar: CSS `scroll-snap` çalışmaz (`lenis/snap` gerekir), `position: fixed` eski Safari'de takılabilir — alt bar için `position: sticky` tercih et.
- Edoardo Lunardi (2025): transform+opacity dışına çıkılmaz, aktif trigger < 30, reduced-motion → LCP/CLS'e ölçülebilir etki yok.

### 3.3 LCP görseli
- Hero `next/image`: Next 16'da `priority` → `preload`; ayrıca `fetchPriority="high"`, `sizes="100vw"`, `loading` lazy **değil** (Lighthouse 2025'ten beri LCP görselinde eksik `fetchpriority`'yi ayrıca uyarıyor). Hero dışındaki her görsel lazy.
- Uzak Unsplash yerine satışta yerel WebP/AVIF + `placeholder="blur"` (§1.7). `quality={70–80}` (Next varsayılanı 75).
- Video hero (#8): `<video muted playsInline autoPlay loop preload="metadata" poster={webp}>`; poster LCP olur, video sonradan; mobilde `prefers-reduced-data`/`(max-width: 640px)` → yalnız poster.

### 3.4 Font (latin-ext / Türkçe)
- Türkçe için `latin-ext` **şart** (ı İ ş ğ) — `fonts.ts` doğru. Ekstra alt küme (cyrillic vb.) ekleme; her alt küme ayrı dosya.
- `display: "swap"` + `adjustFontFallback` (varsayılan açık) → metrik uyumlu fallback, CLS ~0 (Chrome "framework tools for font fallbacks"). 72Technologies notu: ağırlık dizisi verilen değişken olmayan fontlarda fallback metrikleri **ilk ağırlığa** göre hesaplanır → değişken font (tek dosya) tercih; Fraunces/Source Serif 4/Bricolage zaten değişken.
- `preload: false` tüm çiftlerde (literal zorunluluğu). Kayıp: seçilen çiftin `<link rel=preload>`'u yok → LCP metni geç boyanır. Çözüm: `SitePage`'de seçili çiftin woff2 yolunu `ReactDOM.preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" })` ile elle preload et; yollar build çıktısından (`.next/static/media`) değil, `next/font` nesnesinin CSS'inden değil… pratik yol: **yalnız display fontunu** (h1) preload et, gövde swap ile gelsin. Alternatif: gövde için `display: "optional"` (ilk görüntülemede gelmezse sistem fontu; tekrar ziyarette web fontu) — teklif linkine bir kez bakan esnafta riskli, satılan sitede iyi.
- İki aileden fazlası yok (Next dokümanı: "use multiple fonts conservatively").

### 3.5 Render
- Aşağıdaki bölümlere `content-visibility: auto; contain-intrinsic-size: auto 600px` (Baseline 2024; web.dev 7× ilk render kazancı). Tailwind v4: `[content-visibility:auto]` ya da global `.section-below-fold`.
- Hero ve ilk ekran Server Component kalsın; etkileşimli parçalar (marquee, galeri) `dynamic` ile (DEV.to 96+ mobil vaka çalışması).
- Üçüncü taraf script yok; Google Maps embed yerine statik harita görseli + "Yol tarifi" linki (bizde öyle).

### 3.6 Ölçüm ve CI
- Yerel döngü: `chrome-devtools-mcp` → `emulate` (mobil, 4× CPU, Slow 4G) → `performance_start_trace` (LCP/CLS/INP kırılımı + render-blocking tasarruf tahmini) → `lighthouse_audit` (erişilebilirlik/SEO/best-practices; performans için trace kullanılır). Ayrıntı §4.1.
- CI (yol haritası #11): `.github/workflows/ci.yml`'e `treosh/lighthouse-ci-action@v12` (1.3k★ MIT, 2026-03) — Vercel preview URL'ini `vercel/kb` rehberindeki gibi alıp 3 koşu, `budget.json` ile `performance ≥ 0.9`, `total-byte-weight`, `largest-contentful-paint ≤ 2500`. Tüm siteleri taramak için `harlan-zw/unlighthouse` (4.8k★ MIT): `npx unlighthouse --site https://darphane-74qr.vercel.app --urls /<slug>,…`.

---

## 4. AI araçları: MCP sunucuları ve Claude Code skill/plugin'leri

Kurulum komutları Claude Code için; `-s user` eklenirse tüm projelerde geçer.

### 4.1 Tarayıcı + performans (resmi, bakımlı)
| Sunucu | ★ / lisans / sürüm | Kurulum | Ne için |
|---|---|---|---|
| **ChromeDevTools/chrome-devtools-mcp** (Google) | 51.2k · Apache-2.0 · 1.8.0 · push 2026-09-06 | `claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest` — ya da resmi plugin: `/plugin install chrome-devtools-mcp@claude-plugins-official` | `performance_start_trace`, `performance_analyze_insight`, `lighthouse_audit`, `emulate` (mobil/CPU/ağ), ağ ve konsol. Node LTS + kurulu Chrome ister (macOS 13'te Playwright'ın Chromium'u yok, bu yüzden bu daha uygun). |
| **microsoft/playwright-mcp** | 36.9k · Apache-2.0 · 0.0.80 · push 2026-09-04 | `claude mcp add playwright -- npx @playwright/mcp@latest --browser chrome` (`--browser chrome` şart: kurulu Chrome'u kullanır) | Erişilebilirlik ağacından etkileşim, ekran görüntüsü, "telefonda alt bar çalışıyor mu" testi. `screenshot.mts` ile örtüşür; otomasyon senaryosu için. |
| priyankark/lighthouse-mcp | 203 · MIT · 0.1.15 · push 2026-05 | `claude mcp add lighthouse -- npx -y lighthouse-mcp` | `run_audit` (device mobile/desktop, throttling, categories). chrome-devtools varsa gereksiz. |
| danielsogl/lighthouse-mcp-server | 70 · MIT · push 2026-08-31 | — | 13 araç; düşük yıldız. Atla. |

### 4.2 Deploy
| Sunucu | Kurulum | Not |
|---|---|---|
| **Vercel MCP** (resmi, uzak, OAuth) | `claude mcp add --transport http vercel https://mcp.vercel.com` → `/mcp` ile giriş | Araç grupları: `deploy`, `get`/`list` (proje, deployment, log, runtime error), `search` (doküman), `web` analytics sorgusu, `add`/`change` (alan adı, env), `buy` (alan adı satın alma). `sell.mts`'in "domain add" adımı token yerine buradan yapılabilir. Vercel: yalnız onaylı istemciler; Claude Code listede. |

### 4.3 Google Places
| Sunucu | Not |
|---|---|
| `@modelcontextprotocol/server-google-maps` | **Arşivli** (2025-05-28). Kurma. |
| [cablate/mcp-google-map](https://github.com/cablate/mcp-google-map) 443★ MIT, `@cablate/mcp-google-map` 0.0.55 | `claude mcp add gmaps -e GOOGLE_MAPS_API_KEY=… -- npx -y @cablate/mcp-google-map` — Places arama/detay, yol tarifi, yükseklik. `find-leads` varken yalnız tekil "bu işletmenin place_id'si ne" sorguları için. **Sonra.** |
| googlemaps/platform-ai (`gmp-code-assist`) | Yalnız Maps dokümanı RAG; Gemini CLI odaklı. Atla. |

### 4.4 Görsel
| Sunucu | Not |
|---|---|
| Higgsfield MCP | Bu oturumda zaten bağlı (`generate_image`, `remove_background`, `upscale_image`, `outpaint_image`). Krediler sınırlı → yalnız hero "atmosfer" görselleri. |
| `claude-seo` içindeki `seo-image-gen` (nanobanana-mcp, Gemini) | Kullanıcı düzeyinde kurulu plugin; `GEMINI_API_KEY` ile OG/hero üretimi. Fiyat §5. |
| [cevatkerim/unsplash-mcp](https://github.com/cevatkerim/unsplash-mcp) 24★ MIT | Her fotoğraf için hazır `attribution_html` döndürür — Unsplash API kuralını (atıf + UTM) otomatik karşılar. `claude mcp add unsplash -e UNSPLASH_ACCESS_KEY=… -- npx -y unsplash-mcp` (paket adını README'den doğrula). Yol haritası #12 ile birlikte. |
| jeanpfs/stock-images-mcp (3★), joelio/stocky (27★) | Pexels+Unsplash+Pixabay; küçük projeler. Atla. |

### 4.5 Skill / plugin
| Kaynak | Kurulum | Not |
|---|---|---|
| **greensock/gsap-skills** (resmi, 15k★ MIT, 2026-07-29) | `/plugin marketplace add greensock/gsap-skills` → `/plugin install gsap-skills` (ya da `npx skills add https://github.com/greensock/gsap-skills`) | 8 skill: core, timeline, **scrolltrigger**, plugins (SplitText), utils, **react (useGSAP)**, **performance**, frameworks. `skills-lock.json`'a ekle. **Şimdi.** |
| anthropics/claude-plugins-official (36k★) | `/plugin install <ad>@claude-plugins-official` | İlgili olanlar: `frontend-design` (bizde var), `chrome-devtools-mcp`, `browser-use`, `figma`, `code-review`. Diğerleri (netlify, cloudflare, exa, brightdata) bize göre değil. |
| freshtechbro/claudedesignskills (849★ MIT, son push 2025-11) | — | 3D/Three.js ağırlıklı, bakımı durmuş görünüyor. Atla. |
| pbakaus/impeccable, Vercel skill'leri, claude-seo | — | Zaten kurulu (README). |

---

## 5. Görsel kaynakları: stok ve AI

### 5.1 Stok (ticari müşteri sitesi için)
| Kaynak | Lisans | API kuralı | Karar |
|---|---|---|---|
| **Pexels** | Pexels License: ticari kullanım serbest, **atıf gerekmiyor**; değiştirilmemiş kopyayı ürün olarak satmak yasak | API: "Photos provided by Pexels" belirgin link + mümkünse fotoğrafçı adı; **200 istek/saat, 20.000/ay**; hotlink/indirme yasağı yok | Sektör paketleri için **birincil** (indir → sharp → yerel WebP; yalnız sayfa altına "Fotoğraflar: Pexels" satırı). |
| **Unsplash** | Unsplash License: ticari serbest, atıf "takdir edilir" (zorunlu değil); satılamaz, servis kopyalanamaz | **API kullanınca** kurallar sıkı: `photo.urls` ile **hotlink zorunlu** (indirip sunmak yok), fotoğrafçı + Unsplash **atıfı zorunlu**, linklerde `?utm_source=darphane&utm_medium=referral`, seçimde `download_location` uç noktasına istek; demo anahtar 50 istek/saat | Teklif aşamasında uzak URL zaten kullanılıyor → next/image `remotePatterns` ile hotlink sayılır; galeri altına "Fotoğraf: Ad / Unsplash" satırı ekle. Satışta işletmenin fotoğrafına geç (NOTLAR kuralı). Unsplash+ ayrı ücretli lisans, gerekmez. |
| Google/Instagram fotoğrafları | Telif işletmede/kullanıcıda | Places fotoğrafı: atıf + önbellek yasağı | Satış öncesi kullanma (NOTLAR); satış sonrası işletme kendi dosyasını verir. |

### 5.2 AI üretim (ticari hak + maliyet)
| Servis | Görsel başı | Ticari hak | Not |
|---|---|---|---|
| **Gemini Nano Banana 2 Lite** (`gemini-3.1-flash-lite-image`) | **$0.0336** (1K), batch $0.0168 | Ücretli API: çıktı sende, ek kısıt yok; **SynthID görünmez damga her zaman** | En ucuz "çok varyant" yolu; ücretsiz katman yok. |
| Nano Banana 2 (`gemini-3.1-flash-image`) | $0.067 (1K) · $0.101 (2K) · $0.151 (4K) | aynı | Hero için 2K yeterli. |
| Nano Banana Pro (`gemini-3-pro-image`) | $0.134 (1K/2K) · $0.24 (4K) | aynı | Metin/logo doğruluğu gerektiğinde. |
| **Higgsfield** (bağlı MCP) | Kredi | Terms (güncelleme 2026-08-27): çıktı senin, **ticari kullanım ve müşteri işi serbest**; içerik varsayılan olarak modeli eğitir (hesap silinince durur); **tazminat yalnız Enterprise** | Kalan krediyi en "atmosferik" 1–2 hero için sakla; toplu üretimde Gemini Lite. |
| FLUX 1.1 [pro] (BFL / fal / Replicate) | $0.04 / $0.05 / $0.055 | pro API ticari; **FLUX.1 [dev] ağırlıkları ticari değil** | Fotogerçekçi mekân/yemek için güçlü; Replicate'te tek anahtar. |
| Ideogram 3 | $0.03 / 0.06 / 0.10 (Turbo/Default/Quality) | ticari | Tipografili görsel (tabela, menü kartı). |
| Recraft V4 | $0.04 raster / $0.08 vektör | Ücretli planlarda ticari; ücretsizde yok | Vektör ikon/monogram üretimi için tek aday. |
| Adobe Firefly | plan | **Tek gerçek IP tazminatlı** seçenek | Kurumsal müşteri isterse. |

Kural (NOTLAR'daki "doğrulanabilir" ilkesinin görsel karşılığı): AI görsel işletmenin **gerçek mekânı gibi sunulmaz**; doku, atmosfer, soyut arka plan, monogram için kullanılır. SynthID/C2PA damgası sorun değil.

---

## 6. Türkiye yerel SEO — satılan siteler

### 6.1 Google İşletme Profili ↔ site
- GBP "Web sitesi" alanı **işletmenin kendi konumunu temsil eden** URL olmalı; yönlendiren/aracı sayfa yasak (GBP yönergeleri). Bizde `ornek.com/` → `/<slug>` rewrite **aynı host içinde** olduğu için sorun yok; `vercel.app` linki satış öncesi geçici.
- Ad · adres · telefon (NAP) GBP ile **birebir** aynı yazılsın (Sterling Sky: bağlanan sayfanın gücü harita sırasını da etkiler). `draft` zaten Maps kaydından alıyor; `business.name`'e "Kuaför Neşe — İstanbul" gibi ekleme yapma.
- Menü URL'si (restoran): üçüncü taraf sipariş sitesi olamaz; `/#menu` ya da PDF kendi alan adında.
- Satış sonrası: Search Console'da alan adını doğrula (DNS TXT — `sell` scriptinin DNS çıktısına eklenebilir), `sitemap.xml` gönder, GBP'de web sitesi alanını güncelle. Bu üçü "Site + GİP + 1 yıl bakım" paketinin (yol haritası #5) somut maddeleri.

### 6.2 LocalBusiness JSON-LD (Google belgesi + bizde eksikler)
Zorunlu: `name`, `address` (PostalAddress: `streetAddress`, `addressLocality` (ilçe), `addressRegion` (il), `postalCode`, `addressCountry: "TR"`). Bizde var.

Önerilen, `components/SitePage.tsx > LocalBusinessJsonLd`'ye eklenecekler:
- `@type`: en özel alt tür — `Restaurant`, `Dentist`, `Hotel`, `HairSalon`, `BeautySalon`, `AutoRepair`, `LegalService`/`Attorney`, `VeterinaryCare`, `Locksmith`, `Plumber`. Kategori → tür eşlemesi `lib/schema.ts`'e küçük bir tablo.
- `telephone`: `+90 532 123 45 67` (E.164 veya boşluklu; libphonenumber `formatInternational()`).
- `url`: satılan alan adı (canonical ile aynı); `image`: 16:9 · 4:3 · 1:1 üç kırpım (OG üreticisi zaten 16:9 veriyor; diğer ikisi sharp ile).
- `openingHoursSpecification[]`: `{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday",…], opens: "09:00", closes: "19:00" }` — `lib/hours.ts` verisinden üret.
- `geo` (5 ondalık) — var; `hasMap`: Google Maps URL'si; `sameAs`: [GBP paylaşım linki, Instagram]; `priceRange`: `"₺₺"` (≤100 karakter).
- Restoran: `servesCuisine`, `menu` (URL), `acceptsReservations`; otel: `Hotel` + `checkinTime`/`checkoutTime`, `amenityFeature`; hizmet bölgesi işletmeler (tesisatçı, çilingir): `areaServed` (ilçe adları).
- **Yapılmayacak:** `aggregateRating` / `review` — Google: bu alanlar "yalnızca başka yerel işletmeler hakkında yorum toplayan siteler için"; kendi puanını kendi sitene koymak "self-serving" sayılır, zengin sonuç vermez, ceza riski. Yorumlar HTML'de kalsın (Places atıfıyla), schema'ya girmesin.
- `inLanguage: "tr"`; `/en`'de aynı JSON-LD İngilizce metinle tekrarlanır.
- `LegalService`: TBB reklam yasağı — `priceRange`, `review` yok (NOTLAR).

### 6.3 hreflang (`/en` olan siteler)
- Google kuralları: her dil sayfası **kendisi dahil** tüm sürümleri listeler; linkler **karşılıklı** olmalı (tek yönlü yok sayılır); `x-default` eşleşmeyen tarayıcı dili için. Kod: `tr`, `en` (bölge şart değil; `tr-TR` de olur ama tutarlı kullan).
- Bizde `lib/site-metadata.ts` `alternates.languages` üretiyor → `x-default` eklenmeli (TR sayfası; hedef kitle Türkiye). Kontrol: EN sayfası da TR'yi listeliyor mu (karşılıklılık).
- **`app/sitemap.ts` eksik:** satılan sitede `alternates.languages: { tr: "https://ornek.com/", en: "https://ornek.com/en", "x-default": "https://ornek.com/" }`. Next 16 `MetadataRoute.Sitemap` bunu `xhtml:link` olarak yazar (resmi örnek). Ayrıca `images: [heroUrl]` ile görsel sitemap bedava.
- Canonical: her dil kendi URL'sine (`/en` → `/en`), TR'ye değil.
- Satılan sitenin sitemap'i **kendi alan adında** (`ornek.com/sitemap.xml`) yalnız kendi URL'lerini içermeli; bugünkü tek `sitemap.ts` tüm satılanları darphane hostunda listeliyor. `robots-open` gibi host'a göre ayır: kendi alan adında `/`, `/en`; darphane hostunda yalnız kök.
- Doğrulama: `@pas7/nextjs-sitemap-hreflang` 0.7.3 MIT (`inject` + `validate`; karşılıklılık/x-default denetimi) — 1 bağımlılık, isteğe bağlı; ya da `claude-seo`'daki `/seo-hreflang`.

### 6.4 Diğer
- `lastModified`: `new Date()` yerine JSON dosyasının git/commit tarihi (her build'de değişen lastmod Google'ın güvenini azaltır).
- Türkçe karakterli alan adı yok (IDN); `www` → apex 301 (Vercel otomatik).
- Bing/Yandex: `IndexNow` (`claude-seo` seo-technical) — Yandex TR'de küçük ama sıfır maliyet.

---

## 7. Kurulum komutları (kopyala-yapıştır)

```bash
# Tarayıcı + performans (Google, resmi)
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest
# Playwright (Microsoft, resmi) — macOS 13'te kurulu Chrome ile
claude mcp add playwright -s user -- npx @playwright/mcp@latest --browser chrome
# Vercel (resmi, OAuth)
claude mcp add --transport http vercel https://mcp.vercel.com   # sonra /mcp ile giriş
# GSAP skill'leri (GreenSock, resmi)
/plugin marketplace add greensock/gsap-skills
/plugin install gsap-skills
# İsteğe bağlı: Places sorgusu
claude mcp add gmaps -e GOOGLE_MAPS_API_KEY=$GOOGLE_PLACES_API_KEY -- npx -y @cablate/mcp-google-map

# Paketler (yalnız gerekince)
npm i libphonenumber-js            # telefon normalize (draft / wa.me)
npm i -D @lhci/cli                 # Lighthouse CI (CI adımı için)
npm i -D tailwindcss-motion        # mobilde CSS-only fade (globals.css: @plugin "tailwindcss-motion")
```

---

## 8. Kaynaklar

**Repo / paket**
- https://github.com/DavidHDev/react-bits · https://github.com/magicuidesign/magicui · https://github.com/markmead/hyperui · https://github.com/ibelick/motion-primitives · https://github.com/PageAI-Pro/page-ui · https://github.com/romboHQ/tailwindcss-motion · https://github.com/htmlstreamofficial/preline
- https://github.com/gosom/google-maps-scraper · https://github.com/omkarcloud/google-maps-scraper · https://github.com/georgekhananaev/google-reviews-scraper-pro
- https://github.com/featurable/react-google-reviews · https://github.com/opening-hours/opening_hours.js · https://www.npmjs.com/package/@phoenix344/opening-hours
- https://github.com/simov/slugify (config/charmap.json) · https://github.com/catamphetamine/libphonenumber-js · https://github.com/puckeditor/puck · https://github.com/lovell/sharp · https://github.com/vercel/satori
- https://github.com/microsoft/playwright-mcp · https://github.com/ChromeDevTools/chrome-devtools-mcp · https://github.com/priyankark/lighthouse-mcp · https://github.com/danielsogl/lighthouse-mcp-server · https://github.com/cablate/mcp-google-map · https://github.com/modelcontextprotocol/servers-archived · https://github.com/googlemaps/platform-ai · https://github.com/cevatkerim/unsplash-mcp
- https://github.com/greensock/gsap-skills · https://github.com/anthropics/claude-plugins-official · https://github.com/treosh/lighthouse-ci-action · https://github.com/harlan-zw/unlighthouse · https://github.com/darkroomengineering/lenis · https://www.npmjs.com/package/@pas7/nextjs-sitemap-hreflang
- Boyutlar: https://bundlephobia.com/package/gsap@3.13.0 · https://bundlephobia.com/package/lenis@1.3.11

**Google (resmi)**
- Places politikaları (önbellek, atıf): https://developers.google.com/maps/documentation/places/web-service/policies
- Place Details alan/SKU grupları: https://developers.google.com/maps/documentation/places/web-service/place-details
- Fiyatlar: https://developers.google.com/maps/billing-and-pricing/pricing · https://developers.google.com/maps/billing-and-pricing/faq
- Business Profile API yorumlar: https://developers.google.com/my-business/content/review-data
- LocalBusiness yapısal veri: https://developers.google.com/search/docs/appearance/structured-data/local-business
- hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions · x-default: https://developers.google.com/search/blog/2023/05/x-default
- GBP yönergeleri (web sitesi alanı): https://support.google.com/business/answer/3038177
- Gemini görsel modelleri ve fiyat: https://ai.google.dev/gemini-api/docs/image-generation · https://ai.google.dev/gemini-api/docs/pricing
- content-visibility: https://web.dev/articles/content-visibility · font fallback: https://developer.chrome.com/blog/framework-tools-font-fallback/

**Next.js / Vercel / GSAP / Lenis**
- next/font: https://nextjs.org/docs/app/api-reference/components/font · sitemap (alternates.languages): https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- next/image LCP tartışması (priority → preload, fetchPriority): https://github.com/vercel/next.js/discussions/90175 · https://www.peal.dev/blog/nextjs-image-component-settings-lcp-optimization
- Vercel MCP: https://vercel.com/docs/agent-resources/vercel-mcp · araçlar: https://vercel.com/docs/agent-resources/vercel-mcp/tools · GitHub Actions + Vercel: https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel
- GSAP React rehberi: https://gsap.com/resources/React/ · dinamik import: https://gsap.com/community/forums/topic/40051-dynamic-import/ · Next 15 kurulum/cleanup: https://medium.com/@thomasaugot/optimizing-gsap-animations-in-next-js-15-best-practices-for-initialization-and-cleanup-2ebaba7d0232 · bundle/parse maliyeti: https://buildwithumar.com/blogs/nextjs-animations-optimization
- Lenis 2025 pratikleri: https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis · https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap
- Mobil 96+ vaka: https://dev.to/trlz/optimizing-nextjs-performance-a-practical-case-study-96-lighthouse-mobile-31da · font/LCP: https://www.72technologies.com/blog/font-loading-nextjs-lcp-debugging
- Playwright MCP + Claude Code: https://www.builder.io/blog/playwright-mcp-server-claude-code · chrome-devtools-mcp ile Lighthouse: https://www.seo-kreativ.de/en/blog/seo-audits-with-ai-agents-chrome-devtools-mcp/

**Tasarım**
- Awwwards otel/restoran: https://www.awwwards.com/websites/hotel-restaurant/ · https://www.awwwards.com/inspiration_search/hotel-restaurant/ · diş: https://www.awwwards.com/inspiration_search/dental/
- Site sayfaları: https://www.awwwards.com/sites/aventura-dental-arts · https://www.awwwards.com/sites/grand-hotel-central · https://www.awwwards.com/sites/lasala-plaza-hotel · https://www.awwwards.com/sites/ballena-fine-dining · https://www.awwwards.com/sites/halo-dental · https://www.awwwards.com/sites/crav-burgers · https://www.awwwards.com/sites/units · https://www.awwwards.com/sites/mat-voyce · https://www.awwwards.com/sites/sky-clinics · https://www.awwwards.com/sites/burrito-madre
- 2026 ödüllü siteler ve teknikleri (By-Kin, Uncommon, Minh Pham): https://www.hontran.dev/blog/best-award-winning-websites-2026 · Annual Awards 2025: https://www.awwwards.com/annual-awards-2025/
- Land-book kategorileri: https://land-book.com/ · Siteinspire otel: https://www.siteinspire.com/websites?q=hotel
- Kütüphane karşılaştırması: https://www.pkgpulse.com/guides/react-bits-vs-aceternity-magic-ui-2026

**Stok / AI görsel**
- Unsplash License: https://unsplash.com/license · API yönergeleri: https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines · hotlink: https://help.unsplash.com/en/articles/2511271-guideline-hotlinking-images
- Pexels License: https://www.pexels.com/license/ · API: https://www.pexels.com/api/documentation/
- Higgsfield sahiplik/ticari kullanım: https://higgsfield.ai/creator-hub/help-center/account/who-owns-my-generations-and-can-i-use-them-commercially · şart güncellemesi özeti: https://www.aitoolcurator.com/learn/higgsfield-guide/terms-privacy-policy-update/
- Fiyat karşılaştırmaları: https://www.buildmvpfast.com/api-costs/ai-image · https://techsifted.com/posts/flux-ai-pricing-2026/ · https://kie.ai/blog/ideogram-v4-pricing · https://www.prismposter.com/blog/best-ai-image-generator-2026

**Yerel SEO / hukuk**
- GBP landing page etkisi: https://www.sterlingsky.ca/google-business-profile-landing-pages/ · sameAs/hasMap: https://schemavalidator.org/guides/local-business-schema-guide · TR rehber: https://kreativty.com/blog/google-isletme-profili-optimizasyonu-yerel-seo-rehberi
- Maps scraping hukuku: https://thunderbit.com/blog/is-scraping-google-maps-legal · https://scrap.io/scrape-google-gaps-legal
- WhatsApp click-to-chat: https://faq.whatsapp.com/5913398998672934
