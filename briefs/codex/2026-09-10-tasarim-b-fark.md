# Görev (Codex): Dört veteriner sitesinde Tasarım B'yi A'dan gerçekten farklı yap

Önce `AGENTS.md` ve `DARPHANE.md`'yi oku. Çalışma yeri: **`~/Desktop/darphane-codex` worktree'si**, dal `codex/veteriner-b-fark`, PR hedefi `main`. Ana klasörde (`~/Desktop/darphane`) dal açma, dosya değiştirme.

## Sorun

Bugün yazılan `data/sites/<slug>.b.json` katmanları A'nın **renk ve font değiştirilmiş kopyası** oldu: aynı bölüm sırası, aynı düzenler, aynı iletişim deseni, hareket kapalı. Serkan'ın kararı: böyle bir B'nin anlamı yok; B başka bir sayfa gibi durmalı.

Etkilenen siteler: `esatpasa-veteriner`, `esenler-bati-veteriner`, `kucukyali-veteriner`, `adraga-veteriner` (A: `/<slug>`, B: `/<slug>/b`; canlı: https://fourpear.vercel.app).

## Zorunlu farklar (her site için hepsi)

1. **Hero varyantı** A'dan farklı (`image | split | minimal | statement`). A'nın kullandığını B kullanmaz.
2. **Bölüm kompozisyonu:** en az iki bölüm A'ya göre farklı sırada; en az bir bölüm B'de olup A'da olmayan ya da tersi. Örnek: 24 saat açık klinikte hero'nun hemen altına `hours` + `location`; yorumları en üste; `faq`'ı atıp `team` (fotoğrafsız liste: yorumlarda geçen hekim adları, olgudan öte iddia yok) ya da `cta` bandını ortaya koy. Bölüm `id`'leri A'dakilerle eşleşmek zorunda değil: katman `sections` dizisinde yeni `id` ile tam bölüm tanımlayabilir; motorun katman mantığına bak (`lib/sites.ts` `applyOverlay`) ve **sıra/ekle/çıkar desteği yoksa ekle** (ör. katmanda `sectionOrder: string[]` ve `remove: string[]`; şema `lib/schema.ts`, uygulama `lib/sites.ts`; `noyavet.b.json` ve `.c.json` bozulmamalı).
3. **İletişim deseni:** A `contact: both` (mobilde alt bar). B'de **`contact: "fab"` + `fabStyle: "dial"`**: her ekranda yüzen tek WhatsApp ikonu, dokununca yay animasyonuyla yukarı açılan "WhatsApp / Ara" (`components/ContactFab.tsx` zaten var). Alt bar yok. `contact-fab-pulse` açılışta çalışsın. WhatsApp'ı olmayan Küçükyalı'da tek eylem (Ara) doğrudan bağlantı olur; orada FAB'a küçük "Ara" etiketi eklemek serbest.
4. **Header stili** farklı (`glass | solid | minimal | none`).
5. **Düzenler:** `services` (`grid | list | cards`), `gallery` (`grid | masonry | strip`), `reviews` (`cards | quotes | marquee`) üçünden en az ikisi A'dan farklı.
6. **Hareket B'de açık:** `motion.hero` ≠ `none` ve A'dakinden farklı (`curtain`, `zoom`, `split`, `blur`…), `motion.scroll` ≠ `none`, `smooth: true`, görselli hero'da `parallax: true`. "Hareketi azalt" açıkken durağan kalır (motor zaten yapıyor).
7. **Tipografi/doku:** `headingFont`, `typeScale`, `density`, `radius` dördünden en az ikisi farklı; `mode` (light/dark) A'dan farklı.

Metinler: bugünkü B metinleri korunur (ChatGPT yazdı, olgular doğrulandı). Yeni bölüm eklersen metni aynı kurallarla yaz: yalnız olgu, ünlem yok, "siz" hitabı, "en iyi/uzman" yok (`NOTLAR.md` §1). Yorumlar yalnız `data/sites/<slug>.json`'dakiler.

## Motorda değişiklik serbest, sınırlı

Gerekirse `lib/schema.ts`, `lib/sites.ts`, `components/sections/**`, `components/ContactFab.tsx`, `app/globals.css` dokunulabilir. Kural: **A sayfaları piksel piksel aynı kalır** (değişiklik öncesi/sonrası A ekran görüntüsü PR'da). Yeni bağımlılık yok (motion, gsap, lenis kurulu).

## Kabul ölçütü

- `npm run typecheck && npm run lint && npm run build` temiz.
- Her site için A ve B'nin masaüstü + mobil (390px) ekran görüntüleri PR açıklamasında yan yana. Test: görüntüleri gri tona çevirince iki sayfa **2 saniyede** ayırt edilebilmeli. Ayırt edilemiyorsa iş bitmemiştir.
- `/<slug>/b` noindex kalır (meta + header zaten var, bozma).
- `DARPHANE.md` İş günlüğü'ne satır: tarih · Codex · ne · commit.

## Teslim

PR: `codex/veteriner-b-fark` → `main`. Açıklamada: değişen dosyalar, motor değişikliği varsa gerekçe, 8 ekran görüntüsü (4 site × A/B, mobil öncelikli).

---

## Ek (aynı gün, Serkan): ortak tasarım kütüphanesi

Serkan'ın isteği: "farklı farklı kombinasyonlar yazın, sadece bu tasarım için değil; hero giriş animasyonu; mobil taraf önemli; web ve mobil her zaman üst düzey UI/UX; kendinize bir kütüphane oluşturun, ikiniz birlikte çalışıyorsunuz."

Claude başlangıcı yazdı: **`docs/tasarim-kutuphanesi.md`** (kurallar + 10 reçete + A/B eşleme) ve makine okunur hali **`data/recipes/<key>.json`**. Reçete = tema + hareket + header + iletişim deseni + bölüm sırası/düzenleri + mobil/masaüstü notları.

Codex'in bu görevdeki payı (aynı PR'da ya da ikinci PR):

1. **`scripts/recipe.mts`** → `npm run recipe -- <slug> <key> [--variant b|c] [--apply]`: `data/recipes/<key>.json` + `data/sites/<slug>.json`'dan katman üretir (`<slug>.<variant>.json`): tema reçeteden; hero `variant`/rozet sayısı/eylemler reçeteden (metinler A'dan); bölüm sırası reçetedeki `sections` sırasına göre; A'da olmayan bölüm (ör. `team`, `pricing`, `beforeAfter`, `menu`) için içerik yoksa **atlanır** ve uyarı basılır; `layout` alanları reçeteden. `--apply` yoksa stdout'a yazar. `--check` tüm reçeteleri `lib/schema.ts` enum'larına karşı doğrular.
2. **Katmanda sıra/ekle/çıkar desteği** (`lib/sites.ts` `applyOverlay`): `sectionOrder?: string[]`, `remove?: string[]`, `id`'si A'da olmayan tam bölüm nesneleri. `noyavet.b/.c.json` ve mevcut testler bozulmaz; A sayfaları aynı kalır.
3. **Dört veteriner B'si bu araçla**: A'nın ailesinden farklı reçete (kütüphanedeki eşleme tablosu). Öneri: Esatpaşa A "Klinik/Vitrin" gibi → B `gece-nobeti`; Esenler A split → B `afis`; Küçükyalı A split → B `sessiz` (fotoğraf az, WhatsApp yok); Adraga A image → B `defter` ya da `sahne`. Reçete uygulandıktan sonra bugünkü B metinleri korunur.
4. **Hero giriş animasyonu, mobil odaklı** (isteğe bağlı ama istenen): `HERO_MOTIONS`'a `stack` (rozet → başlık → alt satır → buton, alttan 3 adım, 90ms aralık) ve `counter` (statement'ta numaranın rakam rakam belirmesi, ≤ 700ms) ekle; `components/motion/HeroMotion.tsx` + `app/globals.css` (CSS-öncelikli, JS'siz LCP). "Hareketi azalt" saygı. Reçetelerde Claude günceller; sen `docs/tasarim-kutuphanesi.md` "Sıradaki genişletmeler" bölümüne yaptığını işaretle.

Kütüphane kuralı: bir reçete değişince hem JSON hem belge güncellenir; yeni reçete eklerken aile etiketi ve mobil notu zorunlu.
