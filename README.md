# darphane

Web sitesi olmayan işletmeler için hazır landing page üretip süreli teklifle satan sistem. fourpear.

## Nasıl çalışır

Her işletme = `data/sites/<slug>.json`. Tek bir Next.js uygulaması bu dosyaları okuyup statik sayfa üretir. Site kurmak dosya yazmaktan ibaret; deploy yok, veritabanı yok.

```
data/sites/<slug>.json   →   alanadi.com/<slug>
```

Her JSON'da `offer.status` sayfanın davranışını belirler:

| status    | Ne olur                                                                   |
| --------- | ------------------------------------------------------------------------- |
| `draft`   | Üstte turuncu TASLAK şeridi. Sadece bize görünür, yanlışlıkla göndermeyi önler. |
| `pitched` | Siyah şerit: canlı geri sayım + "Sitemi Satın Al" (WhatsApp'a gider). `expiresAt` geçince site yerine "süre doldu" ekranı çıkar. |
| `sold`    | Şerit kalkar. Site arama motorlarına açılır (robots, meta, header, JSON-LD). |
| `expired` | Elle kapatma. "Süre doldu" ekranı. |

Satılmamış hiçbir site indekslenmez — üç katman: sayfa metadata'sı, `robots.txt`, `X-Robots-Tag` başlığı.

## Günlük iş akışı

**1. İşletme bul.** Google Haritalar'da web sitesi alanı boş, en az 20-30 yorumu olan, fotoğrafı bulunan işletmeler. Telefon numarası olsun.

**2. Site oluştur.** İki yol:

```bash
# a) Claude ile taslak: Google Maps sayfasındaki metni bir dosyaya yapıştır, 2 dakikada JSON çıkar
npm run draft -- kuafor-nese leads/kuafor-nese.txt --photos https://…/1.jpg,https://…/2.jpg

# b) Boş iskelet, elle doldur
npm run new-site -- kuafor-nese "Kuaför Neşe" "Kadın Kuaförü" sage
```

`draft` yalnızca kaynakta doğrulanabilir bilgiyi yazar (puan, adres, saatler, olanaklar, gerçek yorumlar); uyduramadığı şeyi `null` bırakıp sonunda "teyit edilecekler" listesi verir. Temayı ve font çiftini işletme türünden seçer, WhatsApp mesajını doldurulacak alanlarla hazırlar. `ANTHROPIC_API_KEY`, `SELLER_WHATSAPP` ve `OFFER_PRICE` `.env.local`'da. Çıktı `draft` durumunda gelir; tarayıcıda oku, düzelt, sonra `pitched`.

Oluşan `data/sites/kuafor-nese.json` dosyasını doldur. `offer.seller.whatsapp` senin numaran. Örnek olarak `ocakbasi-sahin.json` (restoran, koyu), `dishekimi-elif-yarar.json` (klinik, açık) ve `olympos-garden-hotel.json` (otel) dosyalarına bak.

**Palet** (`theme.preset`): `porcelain` nötr · `ember` sıcak koyu · `sage` yumuşak yeşil · `midnight` lacivert+altın · `cobalt` güven mavisi · `sand` bej+ceviz · `bosphorus` taş+Boğaz yeşili · `graphite` kurşuni+buz mavisi · `ink` kâğıt+mürekkep+bordo (avukat, noter, muhasebe)

**Fotoğraftan palet** (`theme.accent`): preset seçmek yerine tek vurgu rengi ver, gerisi OKLCH'de üretilir — nötrler bile o renge boyanır (saf gri yok), kontrast garantili (metin 7:1, ikincil 4.5:1, vurgu 3:1). Rengi hero fotoğrafından çıkarmak için:

```bash
npm run palette -- <slug>            # öneri + kontrast raporu (WCAG ve APCA)
npm run palette -- <slug> --dark --apply   # koyu dünya, JSON'a yaz
npm run check:palettes               # tüm siteler ve presetler; eşik altı varsa çıkış 1
```

`mode` açık/koyu, `neutralTint` nötrlerin boyanma derecesi (0 gri, 0.35 varsayılan).

**Tip ölçeği** (`theme.typeScale`): `compact` · `normal` · `display` — Utopia akışkan ölçeği, 360→1440 px arası 1.2→1.333 oranı. Bileşenler `--step-n2 … --step-6` değişkenlerini kullanır; elle `clamp()` yazılmaz. h2 = step 4, h1 = step 5–6, gövde = step 0.

**Font çifti** (`theme.fonts`) — sayfanın kişiliğini en çok bu belirler:

| Çift | Fontlar | Kime |
| --- | --- | --- |
| `classic` | Inter + Playfair Display | nötr, varsayılan |
| `hospitality` | Manrope + Cormorant Garamond | otel, restoran, konaklama |
| `clean` | Figtree | klinik, teknik servis, muhasebe |
| `craft` | Bricolage Grotesque + Source Serif 4 | ocakbaşı, kasap, zanaat |
| `soft` | DM Sans + Fraunces | fırın, kafe, spa, çiçekçi |
| `bold` | Space Grotesk | berber, dövme, oto servis, spor |
| `editorial` | EB Garamond + IBM Plex Sans | avukat, muhasebe, mimar, danışman — antetli kâğıt |
| `plex` | IBM Plex Serif + IBM Plex Sans | süper aile; gazete/editoryal, danışmanlık |
| `noto` | Noto Serif + Noto Sans | en geniş Türkçe kapsama; ı/İ/ş/ğ sorunsuz, güvenli |

`headingFont: "display"` başlıkları çiftin display yüzüyle, `"sans"` gövde yüzüyle yazar. Fontlar `preload: false` — yalnızca sitenin seçtiği çift indirilir.

**Hero varyantları** (`sections[0].variant`): `image` tam görsel · `split` metin + görsel · `minimal` sade · `statement` koyu antet, büyük hafif serif isim, arka planda monogram; `image` verilirse fotoğraf mürekkep tonuyla arkaya biner (avukat örneği: alacakaranlık İstanbul).

**Acil blok** (`hero.urgent`, yalnızca `statement`): ismin üstünde büyük telefon numarası + "ulaşamazsanız WhatsApp'a acil yazın" satırı (ayrı hazır mesajla). "Şimdi lazım" meslekler için — ceza avukatı, veteriner, çilingir, tesisatçı. Telefonda hero'da tek buton kalır; `hero.monogram` ile arka plan harfi elle verilebilir.

**Fotoğraf tonu** (`theme.photos`): `color` · `mono` — tüm fotoğraflar tek ton, üzerine gelince renklenir. Referans avukat/mimar sitelerinin dili; fotoğraflar birbirine uymuyorsa da kurtarır.

**İletişim düzeni** (`theme.contact`): `both` (varsayılan) mobilde alt bar + masaüstünde sağ altta yüzen WhatsApp butonu · `bar` yalnız alt bar · `fab` her ekranda yüzen buton. Butonun açılışı `theme.fabStyle`: `dial` yukarı açılan hızlı arama (yeşil) · `pill` yana uzayan hap, tema vurgu renginde (editoryal dünyalar). A/B tasarımlarında farklı stil vererek iki dünyayı bu ayrıntıda da ayırın.

**Koyu panel** (`services.tone: "dark"`): bölüm mürekkep zeminli olur; sayfaya koyu/açık ritmi verir (Roy Black'in altın paneli gibi).

**Kutusuz düzenler:** `services.layout: "grid"` (iki sütun, kart yok), `reviews.layout: "quotes"` (büyük alıntı, az yorumda kartlardan iyi), `reviews.layout: "marquee"` (akan şerit, 4+ yorumda; üzerine gelince durur). Her şeyi karta koymak "şablon" hissi verir; her sitede en az bir bölümü kutusuz bırak.

`theme` içinde iki alan daha siteyi başka bir siteye çevirir:

| Alan | Seçenekler | Ne yapar |
| --- | --- | --- |
| `header` | `glass` `solid` `minimal` `none` | glass: görselli hero'nun üstünde saydam, kaydırınca buzlu cam · solid: hep dolu · minimal: isim + tek buton |
| `motion.hero` | `rise` `reveal` `blur` `curtain` `zoom` `split` `none` | Giriş animasyonu: alttan sırayla · perde arkasından · netleşerek · perde kalkar · görsel yaklaşır · **harf harf** (GSAP SplitText) |
| `motion.scroll` | `rise` `fade` `slide` `scale` `none` | Kaydırınca bölümlerin belirme biçimi; kartlar ve satırlar sırayla gelir |
| `motion.smooth` | `true` / `false` | Lenis yumuşak kaydırma; çapa tıklamaları da yumuşak gider |
| `motion.parallax` | `true` / `false` | Hero görseli kaydırırken içerikten yavaş hareket eder (GSAP ScrollTrigger) |

Header menüsü otomatik: bölümlerden türer (en fazla 4). Bir bölümü menüden çıkarmak için `"hideFromNav": true`, adını değiştirmek için `"navLabel": "Fiyatlar"`. Header butonu hero'nun ilk eylemidir. Sistemde "hareketi azalt" açıksa hiçbir animasyon oynamaz.

**3. Kontrol et.**

```bash
npm run dev      # http://localhost:3000/kuafor-nese
```

Telefondan da aç: alttaki Ara / Yol Tarifi / WhatsApp barı çalışıyor mu.

**4. Gönder.** `offer.status` → `"pitched"`, `expiresAt` ayarla (varsayılan 7 gün), commit + push. Vercel deploy eder. Mesaj şablonları: [`content/pitch/mesajlar.md`](content/pitch/mesajlar.md). Gönderim **elle, kişisel WhatsApp'tan.**

**5. Takip et.** PostHog'da (eu.posthog.com) `site_viewed` olayını slug'a göre filtrele: kim açtı, kaç saniye kaldı (`engaged`), nereye kadar indi (`scroll_depth`), hangi butona bastı (`cta_click`: call / whatsapp / directions / buy). **Oturum kaydını izle** — esnaf menüye inip fiyata iki kez döndüyse o an ara. Anahtar yoksa Vercel Analytics'teki sayfa görüntülemesiyle idare et.

**6. Satış.** Tek komut:

```bash
npm run sell -- kuafor-nese --domain kuafornese.com
```

`status: sold` yazar, süreyi siler, commit + push eder (Vercel deploy eder; noindex kalkar, JSON-LD ve hreflang açılır), `DARPHANE_VERCEL_TOKEN` varsa alan adını ve `www`'yi projeye ekler, işletmeye verilecek DNS kayıtlarını yazdırır. `ornek.com/` otomatik olarak `/<slug>`'a, `ornek.com/en` de `/<slug>/en`'e gider (next.config host yönlendirmesi). `--dry` ile önce bak.

**Ödeme linki.** iyzico (iyzilink) ya da PayTR panelinden tek seferlik ödeme linki oluşturup JSON'da `offer.paymentUrl`'a yaz: şeritteki ana buton "Ödemeye Geç" olur, WhatsApp "Soru Sor"a düşer. Ödeme gelince `npm run sell`.

## Komutlar

```bash
npm run dev          # geliştirme
npm run build        # üretim derlemesi — bozuk JSON burada patlar
npm run typecheck    # tip kontrolü
npm run lint
npm run new-site -- <slug> "<İşletme>" "<Kategori>" [tema]
npm run draft -- <slug> <maps-metni.txt> [--photos u1,u2] [--dry]   # Claude ile taslak (ANTHROPIC_API_KEY)
npm run sell -- <slug> [--domain ornek.com] [--payment-url url] [--dry] # satış: sold + push + Vercel alan adı + DNS
npm run find-leads -- "<kategori>" "<ilçe, şehir>" [minYorum]   # sitesiz işletme listesi → leads/*.csv
npm run screenshot -- <slug> [baseUrl] [--clean]                # iPhone çerçeveli görsel → shots/ (--clean: teklif şeridi gizli)
```

### İşletme bulma (`find-leads`)

Google Places API (New) ile arar, `websiteUri` alanı boş olanları süzer, yorum sayısı / puan / fotoğraf / telefon üzerinden skorlar ve CSV yazar. `cp .env.example .env.local` yapıp `GOOGLE_PLACES_API_KEY` gir. `leads/` klasörü telefon numarası içerdiği için git dışında.

### Telefon görseli (`screenshot`)

WhatsApp'ta linkten önce görsel atmak açılma oranını artırır. Kurulu Google Chrome'u Playwright ile sürer, iPhone görünümünü alır, CSS çerçeveye oturtur. Dev sunucu açıkken çalıştır.

## Claude Code skill'leri

`.claude/skills/` altında, repo ile birlikte gelir (`skills-lock.json` kaynakları tutar):

| Skill | Ne için |
| --- | --- |
| `frontend-design` (Anthropic) | Şablon gibi durmayan, işletmeye özgü tasarım kararları |
| `web-design-guidelines`, `vercel-react-best-practices` (Vercel) | Erişilebilirlik/UX denetimi, React-Next performans kuralları |
| `deploy-to-vercel` (Vercel) | Deploy akışı |
| `copywriting`, `copy-editing`, `cro`, `offers`, `pricing` | Site metinleri, dönüşüm, teklif ve fiyat kurgusu |
| `cold-email`, `prospecting`, `sales-enablement` | İlk mesaj, takip, itiraz cevapları, aday bulma |

| `ui-ux-pro-max` | 79 stil, 192 palet, 74 font çifti, 119 UX kuralı; Python'lu arama. Örn. `python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hotel mobile cta" --domain ux` |
| `ui-styling`, `design-system` | ui-ux-pro-max ile gelen yardımcılar (shadcn/Tailwind kalıpları, token mimarisi) |

Kullanıcı düzeyinde ayrıca `claude-seo` eklentisi kurulu (`/seo` komutları; `seo-local`, `seo-schema` satış sonrası LocalBusiness/SEO için).

| `impeccable` (pbakaus, 65k★) | Tasarım yönetmeni: `/impeccable critique` (Nielsen puanı + 61 deterministik "üretilmiş tasarım" kontrolü, iki ayrı alt ajan), `audit`, `polish`, `typeset`, `layout`, `distill`, `bolder`, `quieter`. Edit sonrası otomatik dedektör kancası `.claude/settings.local.json`'da |

**Slop kontrolü (kod tarayan lint):** `~/Library/Python/3.9/bin/uxskill lint app components` — 152 regex kural, LLM yok, ~1 sn. Bilinen yanlış pozitifler: spread ile gelen `aria-hidden`'lı SVG'ler, h2 altındaki h3'ler, cam header'ın blur'u.

**Tasarım kararı verirken sıra:** önce `frontend-design` (klişe listesi ve "tek bir yerde cesur ol" ilkesi), sonra `ui-ux-pro-max` UX kuralları için; ui-ux-pro-max'ın palet/font önerileri jenerik (otele "lacivert + altın" der), o kısmı kendi tema sistemimizle çözüyoruz.

## Yapı

```
app/[slug]/page.tsx       işletme sitesi (statik, 5 dk'da bir yenilenir)
app/[slug]/en/page.tsx    İngilizce sürüm (<slug>.en.json varsa)
components/SitePage.tsx   iki rotanın ortak gövdesi
lib/i18n.ts               arayüz metinleri tr/en
app/page.tsx              iç liste: hangi site hangi aşamada
app/robots.ts             satılanlar hariç her şey kapalı
components/sections/      Hero, About, Services, Menu, Gallery, Reviews, Hours, Location, Contact, Faq, Cta
components/SiteHeader     yapışkan header (şeridin altında), menü bölümlerden türer
components/motion/        Reveal/Stagger (kaydırma), HeroItem/HeroMedia (giriş), MotionProvider
components/OfferLayer     taslak / geri sayım şeritleri; yüksekliğini --offer-h olarak yayınlar
components/OfferExpired   süre doldu ekranı
components/StickyMobileBar
lib/schema.ts             zod şeması — JSON'un tek doğruluk kaynağı
lib/theme.ts              tema paletleri → CSS değişkenleri
lib/hours.ts              "şu an açık" hesabı
lib/actions.ts            tel: / wa.me / harita linkleri
lib/nav.ts                header menüsü ve butonu
content/pitch/            teklif mesajları
scripts/new-site.mts      iskelet üretici
```

## Canlı ve iç sayfa

Canlı: `https://darphane-74qr.vercel.app` (Vercel, her `main` push'unda otomatik deploy). Kök sayfa `/` fourpear'ın iç listesidir; canlıda **Basic Auth** ister (kullanıcı `fourpear`, parola Vercel env `DARPHANE_ADMIN_PASSWORD`). İşletme sayfaları açıktır. Env/redeploy/log için Vercel CLI bu makinede oturum açık: `npx vercel env ls`, `npx vercel redeploy <url>`, `npx vercel logs <url>`.

## İki tasarım sunmak (A · B)

`data/sites/<slug>.b.json` (tema + hero farkı, kısmi) varsa `/<slug>/b` açılır; teklif şeridinde **Tasarım A · B** geçişi çıkar, "Sitemi Satın Al" mesajına seçilen harf yazılır, PostHog `site_viewed.variant` ile hangisine bakıldığı görülür. Satışta kazanan katman ana dosyaya taşınır.

```bash
npm run duo -- <slug>     # shots/<slug>-ab.png — iki telefon yan yana, WhatsApp'a
```

Neden: "beğendiniz mi?" evet/hayır sorusudur; "hangisi?" seçim sorusudur — cevap vermek satın alma yolunun ilk adımı olur.

## İngilizce sürüm

Turistik işletmelerde (otel, restoran, tur) `data/sites/<slug>.en.json` eklenince `/<slug>/en` sayfası açılır, header'da TR ⇄ EN geçişi çıkar, `hreflang` alternatifleri yazılır. Dosya **kısmi**dir: `business` alanları, `seo` ve `id`'si eşleşen bölümler TR'nin üstüne biner; tema ve teklif değişmez. Arayüz metinleri (Ara / Directions, gün adları, "şu an açık") `lib/i18n.ts`'ten gelir. Teklif şeridi Türkçe kalır — o işletme sahibine hitap ediyor. Örnek: `olympos-garden-hotel.en.json`.

## Satış sinyalleri (PostHog)

`NEXT_PUBLIC_POSTHOG_KEY` verilince her işletme sitesinde oturum kaydı ve şu olaylar açılır: `site_viewed` (slug, teklif durumu), `scroll_depth` (25/50/75/100), `cta_click` (call / whatsapp / directions / email / buy), `engaged` (30 sn). Form alanları kayda maskelenmiş girer. İstekler `/ingest` üzerinden kendi alan adımızdan geçer (reklam engelleyici takılmaz). AB sunucusu.

## Link önizlemesi (og:image)

Her site için `app/[slug]/opengraph-image.tsx` otomatik kart üretir: hero görseli + işletme adı + telefon, 600×315, ~400 KB. WhatsApp'a link atıldığında çıkan kart budur; `seo.ogImage` verilirse onun yerine o kullanılır. Canlıda mutlak URL için `NEXT_PUBLIC_SITE_URL` (Vercel'de `VERCEL_URL` otomatik).

## Görseller

Teklif aşamasında işletmenin kendi Instagram/Google fotoğraflarını kullanmak telif açısından gri alan. Şimdilik Unsplash (ticari kullanıma açık) veya üretilmiş görsel; satıştan sonra işletmenin kendi fotoğraflarına geçilir. Örnek sitelerdeki `picsum.photos` görselleri yer tutucudur.

Yerel görseller `public/sites/<slug>/` altına konur ve JSON'da `/sites/<slug>/dosya.jpg` olarak yazılır.
