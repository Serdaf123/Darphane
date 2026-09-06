# Darphane — çalışma notları

Bu dosya makinenin hafızası: kurallar, yol haritası, kararlar. README "nasıl çalışır"ı anlatır; burası "neden böyle" ve "sırada ne var". Her turdan sonra güncellenir.

---

## 1. Öğrendiklerimiz — kurallar

### Metin
- **Her cümle Google kaydından doğrulanabilir olmalı.** Puan, yorum sayısı, adres, telefon, saat, olanak, fiyat: kaynaktan. Kaynakta yoksa yazma, "teyit gerek" notu düş.
- **Yorum uydurma.** Gerçek yorum yoksa bölüm boş kalır.
- İşletme sahibine ders veren cümle yok ("aracı siteler pay alır"). Zorlama espri yok ("doğrudur"). Reklam dili yok (fırsat, kampanya, eşsiz, kusursuz). Ünlem yok.
- CTA ne alacağını söyler: "WhatsApp'tan Fiyat Al", "Randevu Talep Et", "Masa Ayırt". "Gönder", "İletişim" yok.
- WhatsApp hazır mesajı boş alanlarla gelir (tarih / kişi / konu). "Şimdi lazım" mesleklerde ikinci bir **acil** mesaj kapısı.
- Aynı eylem her yerde aynı etiket ve aynı mesajla (alt bar, header, hero, CTA).
- Kaynak: Serkan'ın "metinler çok saçma" geri bildirimi (2026-09-04) + copywriting/copy-editing skill'leri.

### Tasarım
- Klişe listesi (frontend-design skill), bizde yakalananlar ve çözümleri:
  - krem zemin + serif + kiremit vurgu → paleti işletmenin konusundan türet (`bosphorus`, `ink`…)
  - Inter + Playfair → sektöre göre font çifti (`hospitality`, `craft`, `editorial`…)
  - BÜYÜK HARFLİ etiket, "A · B · C" meta → cümle düzeni, virgül/parantez
  - her şey aynı kartta → `grid` / `quotes` / `list` kutusuz düzenler
  - başlık üstü eyebrow → **yasak** (craft-floor); başlık kendi yükünü taşır
  - Unicode glif ikon (★) → çizili SVG
- **Fotoğraf her şeyi değiştirir.** Referans avukat/otel siteleri: tam kesit alacakaranlık fotoğraf + hafif ağırlıkta (400–500) büyük serif + tek vurgu + koyu/açık bölüm ritmi. Fotoğrafsız meslek → `statement` hero + `photos: mono`.
- Cesareti tek yerde harca; gerisi sessiz. Bir sayfada en az bir bölüm kutusuz.
- Tarayıcı yüzeyleri (seçim, imleç, kaydırma çubuğu, odak) temadan gelir; koyu zeminde odak halkası açık renk.
- Hareket: transform + opacity dışına çıkma (CLS), "hareketi azalt" her zaman saygı görür. Serkan hero + scroll animasyonu istiyor; skill "tek orkestre an" der — mobilde `fade`, masaüstünde `rise` uzlaşması.
- Mobil: hero'da en fazla 2 buton (acil blok varsa 1); alt bar Ara/Yol Tarifi/WhatsApp; header butonu yalnız masaüstü.

### Satış / operasyon
- Önce görsel, sonra link (WhatsApp'ta telefon çerçeveli görsel → OG kartı → mesaj).
- **İki tasarım sun:** `<slug>.b.json` + `/slug/b`; şeritte A · B geçişi; `npm run duo` ile çift telefon görseli. "Hangisi?" sorusu "beğendiniz mi?"den iyi (2026-09-05).
- Gönderim elle, kişisel WhatsApp'tan; her mesajda ret cümlesi (ticari iletişim mevzuatı, ban riski).
- Link açıldı = sıcak lead = aynı gün takip. PostHog oturum kaydı "nasıl baktı"yı gösterir.
- Teklif şeridi Türkçe kalır, işletme sahibine hitap eder; İngilizce sayfada bile.
- Fiyat tek seferlik; ödeme linki gelince `sell` scripti.

### Hukuki
- **Avukat siteleri:** TBB Reklam Yasağı Yönetmeliği — yorum, puan, başarı vaadi, "en iyi" yok. Sicil no, fakülte, yıl, saat, fotoğraf olgudur, serbesttir. Sitede yönetmeliğe uygunluk cümlesi güven verir.
- **Fotoğraf:** işletmenin Google/Instagram fotoğrafları satıştan önce telif riski; Unsplash geçici, satışta işletmenin kendi fotoğrafı.
- **PostHog oturum kaydı** için KVKK çerez onayı gerekir (yapılacak #7).
- Google Maps scraping ToS ihlali; Places API resmi yol (anahtar gerek).

### Tipografi ve renk (2026-09-05 araştırması)
- **Renk uyumu hesaptır:** OKLCH'de aynı L aynı kontrast demek; nötrleri vurgu tonuna c≈0.01 boyayınca palet tek aileden çıkar (saf gri yasak). `lib/palette.ts` tek renkten tam palet üretir, WCAG eşiklerini zorlar, APCA Lc raporlar. Referans: LogRocket OKLCH, Design Tokens Color Module 2025.10.
- **Fotoğraf → palet:** `npm run palette` hero fotoğrafının renkli piksellerinden en kalabalık 30°'lik ton dilimini alır (baskın renk gece fotoğrafında siyah döner, işe yaramaz). Sitenin rengi fotoğrafıyla akraba olur.
- **Kontrast standardı:** hukuken WCAG 2.2 AA (4.5:1 / 3:1); tasarım için APCA (Lc 60+ gövde, 75+ küçük). İkisini de ölçüyoruz; AA kapı, APCA bilgi.
- **Tip ölçeği:** Utopia akışkan ölçek (`utopia-core`), 360→1440 px, 1.2→1.333; roller `--step-n`. Elle clamp yok. Uyarı: clamp zoom'u kısıtlayabilir; rem tabanlı olduğu için kullanıcı font ayarına saygılı.
- **İzleme (tracking):** display ≥ step-4 −0.02em, antet −0.03em; küçük metin +0.01em. Koyu zeminde açık yazıya bir adım ağırlık + biraz satır aralığı.
- **Font eşleme kuralı:** iki aile yeter; ya süper aile (Plex Serif+Sans, Noto) ya da net zıtlık (Garamond+Plex, Cormorant+Manrope). Türkçe için latin-ext şart; Noto en güvenli. Kaynaklar: Typewolf lookbook'ları, Fontpair.
- Sırada değerlendirilecek: Fraunces/Source Serif 4 `opsz` optik boyut, Radix Colors tarzı 12 adımlı skala, Color Thief v3 (OKLCH kümeleme) ile çoklu renk çıkarma, Leonardo (Adobe) kontrast-öncelikli skala.

### Teknik
- macOS 13: Playwright'ın Chromium/ffmpeg'i yok → `channel: "chrome"`; video için WebCodecs (planlı).
- next/font: seçenekler literal olmalı (spread yok); tüm çiftler `preload: false`.
- `.btn`'nin `display`'i Tailwind `hidden`'ı ezer → görünürlük için özel sınıf (`btn-desktop-only`).
- GSAP ve motion aynı elemanın transform'unu yazmasın → iç/dış katman.
- Sticky şerit yüksekliği `--offer-h` ile yayınlanır; header ve çapalar ona göre.
- ux-skill lint'in bilinen yanlış pozitifleri: spread `aria-hidden`, h2 altındaki h3, cam blur.

---

## 2. Yol haritası

Durum: ✅ bitti · 🔧 sırada · ⏳ dış girdi bekliyor · 💡 fikir

### Tamamlananlar
- ✅ Veri odaklı üretim (JSON → site), tema + font çiftleri, bölüm kütüphanesi
- ✅ Teklif mekaniği: şerit, geri sayım, süre dolumu, noindex üç katman
- ✅ Header, hero girişleri (rise/reveal/blur/curtain/zoom/split), scroll animasyonları, Lenis, parallax, marquee
- ✅ PostHog sinyalleri (anahtar bekliyor), OG kartı, telefon çerçeveli görsel
- ✅ Claude ile taslak (`draft`), İngilizce katman (`/en`), satış scripti (`sell`), ödeme linki, alan adı yönlendirmesi
- ✅ Slop kontrolü: Impeccable critique/audit, ux-skill lint
- ✅ Statement hero (fotoğraflı, acil bloklu), mono fotoğraf, koyu panel
- ✅ OKLCH palet motoru (`theme.accent`), fotoğraftan palet, kontrast denetimi, Utopia tip ölçeği, plex/noto çiftleri

### Sırada — para getirenler
| # | İş | Neden | Süre | Durum |
|---|---|---|---|---|
| 7 | KVKK çerez onayı bandı (PostHog için zorunlu) | Kayıt onaysız başlamasın | 2 sa | 🔧 |
| 1 | PostHog → Telegram anlık uyarı ("X açtı, 52 sn, fiyata 2 kez döndü") | Sinyal panelde kalmasın, o dakika ara | 2 sa | 🔧 |
| 2 | Teklif sayfası `/<slug>/teklif` — ne dahil, süreç, fiyat, esnaf SSS'si, ödeme linki | "Peki ne alıyorum?" cevabı; karar orada verilir | 3 sa | 🔧 |
| 3 | `npm run pitch` — görsel + OG + mesaj (pano) + 15 sn MP4 (WebCodecs) tek komut | Video görselden çok açılır; üç işi bire indir | 3 sa | 🔧 |
| 4 | Alan adı önerici (RDAP, anahtarsız) — teklif sayfasında "ornek.com müsait" | Somutlaştırır, karar hızlanır | 1 sa | 🔧 |
| 5 | İki paket: Site / Site + Google İşletme Profili + 1 yıl bakım | "Hangisi" sorusu "evet/hayır"dan iyi | 1 sa | 💡 |
| 6 | Notion pipeline: aday → gönderildi → açtı → konuştu → satıldı | 10 adaydan sonra kafada tutulmaz | 1 sa | 💡 |

### Sırada — siteyi güçlendirenler
| # | İş | Süre | Durum |
|---|---|---|---|
| 8 | Video hero (sessiz mp4 döngü) — restoran, kafe, spor | 2 sa | 💡 |
| 9 | Yeni bölümler: fiyat tablosu, ekip, önce/sonra, fotoğraflı menü | 2 sa/bölüm | 💡 talebe göre |
| 10 | Places API ile gerçek yorum + fotoğraf çekme | 2 sa | ⏳ anahtar |
| 11 | Lighthouse + axe her build'de | 1 sa | 💡 |
| 12 | Unsplash API ile sektör fotoğraf paketleri | 2 sa | ⏳ anahtar |

### Dış girdi bekleyenler (Serkan)
- ~~Serkan'ın WhatsApp numarası~~ ✅ girildi (2026-09-05)
- Alan adı (önizleme linkleri). ~~Vercel~~ ✅ bağlı: proje `darphane` (Serdaf123 / team), CLI oturumu bu Mac'te açık (`npx vercel`), `.vercel/project.json` yerel
- PostHog anahtarı (eu.posthog.com) · `ANTHROPIC_API_KEY` (taslak üretici)
- Fiyat kararı (şeritte 8.500 ₺ örnekten kalma)
- Olympos: 2-3 Google yorumu, fotoğraf · Avukat: sicil no, fakülte, hafta içi saatleri, fotoğraf

---

## 3. Karar günlüğü
- **2026-09-03** İş modeli: tek seferlik ücret; önce şablon+üretici, panel sonra; lead'i Serkan elle bulur; Vercel. Veritabanı yok, JSON + git.
- **2026-09-03** Site tarafı Claude'da, lead bulma Serkan'da.
- **2026-09-04** Metin kuralı: yalnızca doğrulanabilir bilgi ("metinler çok saçma").
- **2026-09-04** Görsel kimlik: font çiftleri + konudan türeyen paletler; klişe listesi referans.
- **2026-09-04** Beş adımlı sistem onayı ("sırayla git"): PostHog → GSAP/Lenis → Claude taslak → EN → ödeme/alan adı. Hepsi bitti.
- **2026-09-04** Impeccable + ux-skill kuruldu; her yeni sitede critique koşulur.
- **2026-09-05** Avukat: ilk ekran gece kullanıcısı için numara-önce; WhatsApp'a iki kapı (acil / randevu).
- **2026-09-05** Yol haritası bu dosyada tutulur; sohbet notu kaybolmaz.
- **2026-09-05** Strateji: özellik geliştirme durdu; bugün yayın + akşam 2 teklif, hafta sonuna 10 teklif. Sonuç gelmeden yeni özellik yok. Seller numarası girildi; Olympos + avukat `pitched`, son gün 12 Eylül 21:00. Alan adı ilk satıştan sonra; şimdilik vercel.app.
- **2026-09-05** Repo GitHub'da: `Serdaf123/Darphane` (private tutulacak). Bu Mac'ten ayrı SSH anahtarıyla (`github-serdaf` host takma adı) push edilir. Vercel Serdaf123 hesabından bağlanacak.
- **2026-09-05** Canlı: https://darphane-74qr.vercel.app (Vercel, Serdaf123). robots/noindex/OG canlıda doğrulandı. Kök sayfa giriş ekranı `/giris` (imzalı çerez; parola Vercel env `DARPHANE_ADMIN_PASSWORD`).
- **2026-09-05** Vercel CLI bu Mac'te Serdaf123 ile oturum açık; env değişkenleri ve redeploy buradan yönetilir. Import'un `.env.example`'dan eklediği boş env'ler silindi; `DARPHANE_ADMIN_PASSWORD` prod+preview'a girildi (kök sayfa Basic Auth, kullanıcı `fourpear`; parola repo'da YOK). `sell.mts` ileride token yerine `vercel domains add` ile CLI oturumunu kullanabilir.
- **2026-09-05** Vercel'de yanlışlıkla ikinci proje (`darphane`) açılmıştı, silindi; CLI `darphane-74qr`'ye bağlı. Not: `vercel redeploy` eski build'i geri getirebilir — env değişince yeni commit push'la.
- **2026-09-06** Vercel Hobby, commit yazarı hesap sahibi değilse deploy'u BLOCKED yapıyor ("commit author doesn't have permission"). Bu repoda git yazarı `Serdaf123 <161323711+Serdaf123@users.noreply.github.com>` (repo-local config). Yazar Serkanoral45 olan 5 push sessizce bloklandı; `vercel ls` bunu "UNKNOWN" gösterir, gerçek durum `api.vercel.com/v6/deployments`'ta.
- **2026-09-06** `serkanoral.com.tr` Serkan'ın kişisel sitesi olacak, Darphane'ye BAĞLANMAYACAK (projeye eklenmişti, çıkarıldı). Darphane alan adı hâlâ açık; teklif linkleri vercel.app'te kalıyor.
- **2026-09-06** Panel geldi: `/panel` liste + `/panel/<slug>` detay (teklif alanları, hızlı işlemler, linkler, gönderim metni). Yazma katmanı `lib/store.ts`: `DARPHANE_GITHUB_TOKEN` varsa GitHub'a commit (canlı için şart), yoksa yerel dosya. Kök `/` panele yönlendirir; `/giris` + çerez korur. Serkan'dan bekleniyor: fine-grained GitHub token → Vercel env.
- **2026-09-06** `serkanoral.com.tr` = Serkan'ın kişisel tanıtım sayfası; Darphane motoruyla yapıldı: `data/sites/serkan-oral.json` (status sold, domain serkanoral.com.tr; porcelain + accent #2f6fed + craft fontları, statement hero monogram S). Alan adı Vercel projesine yeniden eklendi; DNS Serkan'da (NS ns1/ns2.vercel-dns.com ya da A 76.76.21.21). Alan adı kökü panele değil siteye gider: proxy Host başlığına bakar, `next.config` rewrite'ları beforeFiles. Kendi alan adında robots.txt `/robots-open`'a gider (kök açık, panel kapalı); canonical satılan sitede alan adıdır.
- **2026-09-06** Görsel kuralı: public/ altında PNG/JPG yok, hepsi WebP (`npm run webp` sharp ile çevirir, orijinali siler, referansları günceller). shots/ PNG kalır: WhatsApp WebP'yi çıkartma sanıyor. Uzak Unsplash görsellerini next/image zaten WebP/AVIF sunuyor.
