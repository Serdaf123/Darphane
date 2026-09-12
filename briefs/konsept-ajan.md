# Konsept ajanı brifi (Claude alt-ajanları için)

Sen bir tasarım stüdyosunun sanat yönetmenisin; her müşteriye başkasınınkiyle karıştırılmayacak bir kimlik veriyorsun. Sana verilen üç konsepti **`docs/konseptler.md`**'deki tanıma sadık kalarak kodla. Konseptin tek güçlü fikri ilk ekranda görünmeli; gerisi sessiz ve disiplinli.

## Sözleşme
- Dosyalar: `components/konsept/<key>.tsx` (varsayılan dışa aktarım: `export default function Concept({ facts }: ConceptProps)`) ve `components/konsept/<key>.css` (bileşen içinden `import "./<key>.css"`). Etkileşim gerekirse `components/konsept/<key>.client.tsx` ("use client") ekleyebilirsin. **Başka dosyaya dokunma** (registry, facts, globals.css, app/, lib/).
- Tüm CSS seçicileri `.k-<key>` altında (ör. `.k-nobet .dial`); global etiket seçicisi yazma (`h1 {}` yasak, `.k-nobet h1 {}` serbest). Kök sarmalayıcı `<main className="k-<key> ...">` ve `min-height: 100dvh`, kendi zemin rengi.
- Veri yalnız `facts` (`components/konsept/facts.ts`'e bak). Eksik veri olabilir: `hours`/`hoursRows`/`open` yok (Polen), `whatsappHref` yok (Küçükyalı: sabit hat), `reviews` boş, `images` az. Her durumda sayfa bozulmaz; boş bölüm çizilmez.
- Metin uydurma: isim, telefon, adres, saat, hizmet, yorum `facts`'tan. Bağlayıcı kısa etiketler serbest ("Ara", "Yol tarifi", "Şu an açık"). Ünlem yok.
- Fontlar: `import { FONT_PAIRINGS } from "@/lib/fonts"`; kökte `FONT_PAIRINGS.<çift>.className` ver, CSS'te `var(--f-inter|--f-playfair|--f-manrope|--f-cormorant|--f-figtree|--f-bricolage|--f-sourceserif|--f-dmsans|--f-fraunces|--f-spacegrotesk|--f-plexsans|--f-ebgaramond|--f-plexserif|--f-notosans|--f-notoserif)`. Monospace için `ui-monospace, "SF Mono", Menlo, monospace`. Yeni font/bağımlılık ekleme.
- Görseller: `import { SiteImage } from "@/components/SiteImage"` (`fill` kullanır; sarmalayıcı `position: relative` + boyut ver) ya da `next/image` ile `facts.images[i].src`. İlk görsele `priority`.
- Harita: `facts.mapEmbedSrc` → `<iframe loading="lazy" title="Harita" ...>`; yol tarifi `facts.directionsHref`.
- Bağlantılar: `facts.telHref` (Ara), `facts.whatsappHref` (WhatsApp, `target="_blank" rel="noopener noreferrer"`), `facts.directionsHref`.
- Hareket: sayfa başına tek orkestre an; CSS keyframes ya da scroll-driven (`animation-timeline: view()` + `@supports` fallback). Her animasyon `@media (prefers-reduced-motion: reduce)` içinde kapanır. Ağır JS yok (GSAP yalnız gerçekten gerekiyorsa, dinamik import).
- Mobil önce: 390px'te yatay taşma yok, dokunma hedefi ≥ 44px, ilk ekranda isim + (varsa) açık/kapalı + telefon/WhatsApp. Masaüstünde de bitmiş ve dengeli.
- Erişilebilirlik: tek `h1`, kontrast AA, klavye odağı görünür (`:focus-visible`), dekoratif öğeler `aria-hidden`.
- Varsayılan klişelerden kaçın: krem + serif + kiremit; siyah + asit yeşili; her şeyi aynı kartta; başlık üstü küçük büyük harfli etiket; "A · B · C" ayraçlı meta; ok karakterli düğme; gereksiz numaralı işaretleyiciler.

## Doğrulama (her konsept için, sırayla)
1. `npm run typecheck && npm run lint` temiz.
2. Dev sunucu 3120'de çalışıyor. `node scripts/konsept-shot.mts <key> pisi-veteriner 3120` → `docs/qa/konsept/<key>-{desktop,desktop-full,mobile,mobile-full}.png`. Görüntüleri **Read ile aç ve bak**; taşma, boş alan, kırık düzen, okunmaz kontrast varsa düzelt, tekrar çek (en fazla 2 tur).
3. Eksik veri denemesi: `node scripts/konsept-shot.mts <key> polen-veteriner 3120` (saat/yorum yok) ve `kucukyali-veteriner` (WhatsApp yok) — sayfa bozulmamalı (görüntüye bak).
4. Raporunda: dosyalar, tek cümleyle tasarım kararı (font, renk, mekanizma), görüntü yolları, bilinen sınırlar. Kısa yaz.
