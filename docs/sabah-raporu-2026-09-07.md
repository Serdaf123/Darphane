# Sabah raporu — 7 Eylül 2026 (02:00–03:00 gece vardiyası)

Her şey `main`'de ve canlıda: https://darphane-74qr.vercel.app · Panel: /panel

## Bu gece ne yapıldı

### Satışı hızlandıranlar
- **Teklif sayfası** `/<slug>/teklif`: fiyat, son gün, ne dahil, alan adı adayları (RDAP ile .com müsaitliği canlı), 3 adım, esnaf SSS'si, ödeme/WhatsApp. Şeritteki "Detaylar" linki oraya gider. Satılan sitede 404, hep noindex.
- **`npm run pitch -- <slug>`**: telefon görüntüsü + OG kartı + gönderim metni panoya, tek komut.
- **KVKK çerez bandı** + `/gizlilik` aydınlatma taslağı: PostHog yalnız "Kabul" sonrası başlar; anahtar yoksa paket hiç inmez.
- **PostHog → Telegram köprüsü** `/api/uyari`: "👀 açtı — olympos · Mobile · İstanbul", "👆 bastı → whatsapp". Bot token + PostHog anahtarı gelince açılır.

### Site yapma motoru
- Menü bölümüne fotoğraflı düzen (`layout: "photos"`, ürün başına `image`); grup başlıkları büyük harfli eyebrow'dan normal başlığa çevrildi.
- Yellow Bull için A/B teklif metni ve görseller hazır (`content/pitch/gonderim/yellow-bull-istanbul.txt`, `shots/yellow-bull-istanbul-telefon.png`, `-b-telefon.png`, `-og.png`).
- Yeni bölümler: **fiyat tablosu** (`pricing`), **ekip** (`team`), **önce/sonra kaydırıcı** (`beforeAfter`), **video hero** (`hero.video`). Kuaför demosu `/salon-ada` hepsini gösterir.
- Yeni teklif durumu `demo`: şerit yok, süre yok, indeks kapalı. Ocakbaşı ve diş demoları bu durumda; kişisel siteden linkleniyor.
- **Performans**: hero giriş animasyonları CSS'e taşındı (JS beklemeden başlar, LCP'yi bloklamaz), GSAP yalnız gerektiğinde iniyor, PostHog yalnız anahtarla, motion → LazyMotion, kök font ön yüklemesi kapalı. Canlı Lighthouse mobil (03:10): kişisel site performans 79→**99**, Olympos 75→**97** (SEO 69 noindex'ten, beklenen).
- Lighthouse CI GitHub Actions'ta (erişilebilirlik ≥ 93 zorunlu, performans ≥ 80 uyarı).

### Kişisel site (serkanoral.com.tr)
Impeccable kritik + SEO denetimi + Lighthouse sonrası: mobil alt çubuk (WhatsApp/Ara), sabit telefon kısa ekranda kilitlenmiyor, kontrastlı buton rengi, klavye odağı, başlık sırası, kartlar telefonda liste, örnekler demo sitelere açılıyor, "kurgusal işletme" notu, kök OG görseli, JSON-LD (Person + ProfessionalService), sitemap, güvenlik başlıkları. `/serkan-oral` artık noindex; kanonik kök.

### Ajan düzeni
- `briefs/04-chatgpt-gorevleri.md`: ChatGPT'nin üç işi ve kopyala-yapıştır istemleri (görseller, esnaf gözüyle A/B, mesaj denetimi).
- Codex için ayrı klasör `~/Desktop/darphane-codex` (dal `codex/serkan-design-b`). Codex'i o klasörde aç.
- Manus köprüsü hazır (`npm run manus`), anahtar bekliyor.

## Araştırma — karar isteyen bulgular
Tam raporlar: `docs/arastirma-satis-2026-09-07.md` (satış/hukuk/ödeme), `docs/arastirma-teknik-2026-09-07.md` (repo/araç/performans).

1. **Avukata soğuk WhatsApp atma.** KVKK Kurulu 2022/861: avukat "tacir/esnaf" sayılmadı, 150.000 ₺ ceza. Av. Özge Nur Şafak teklifi için önce telefonla izin al ("WhatsApp'a atayım mı?") ya da tanıdık üzerinden git. Esnaf/tacire ön onaysız ileti yasal; ama kimlik + iletişim + ret satırı şart, ret gelince 3 iş günü içinde dur.
2. **Önce 30 saniyelik arama, sonra WhatsApp.** Meta'nın opt-in şartını karşılar, ban riskini düşürür, yanıt oranını katlar (sıcak temas %10–34, soğuk %3–5). Günde en fazla 10–15 yeni numara, bire bir, elle.
3. **Fiyat bandı doğru** (8.500 ₺: şablon 3.500–5.000+KDV ile ajans 20.000+ arası). Öneri: iki paket 7.900 / 9.900 + 2. yıldan 2.500 ₺/yıl. Karar senin; teklif sayfası tek fiyatla çalışıyor, iki pakete 1 saatte geçer.
4. **Ödeme:** şirket olmadan en hızlı yol iyzico Link (bireysel, 24 saatte onay, %4,49+0,25 ₺). PayTR link için vergi levhası gerekir. Papara'yı şimdilik kullanma.
5. **Vercel Hobby ticari kullanıma kapalı** (fair-use). Satılan siteler için Pro (20 $/ay) gerekecek; ilk satışla birlikte geç.
6. **Fotoğraf:** teklif aşamasında Google/Instagram'dan fotoğraf çekme (FSEK md. 68: rayiç bedelin 3 katı). İlk cevapta "3–4 fotoğraf atın, akşama koyarım" de; bu aynı zamanda ilk etkileşim.
7. **Alan adı müşteri adına açılmalı**; bizim hesapta açılırsa 60 gün transfer kilidi.
8. Teknik: Places API'den yorum çekmek için `place_id` sakla, 24 saatlik ISR, atıf zorunlu, en fazla 5 yorum (anahtar gelince). Google Maps scraper'ları atla (ToS + KVKK). `chrome-devtools-mcp` ve resmi Vercel MCP kurulmaya değer.

## Senden bekleyenler
- **Manus API anahtarı** → `.env.local` (satır hazır). Sonra `npm run manus -- briefs/01-metinler.md --out content/serkan/copy.md`.
- **GitHub fine-grained token** (Darphane repo, Contents: read/write) → Vercel env `DARPHANE_GITHUB_TOKEN`; panel kayıtları canlıda kalıcı olsun.
- **PostHog anahtarı** + **Telegram bot token / chat id** → uyarılar telefona düşsün.
- **Turhost DNS**: nameserver satırlarındaki IP alanları (198.51.44.13 / 198.51.45.13) ya da Turhost desteğine glue düzeltme talebi.
- Kararlar: fiyat merdiveni (tek/çift paket), avukat teklifine arama-önce yaklaşımı, iyzico Link başvurusu.
- Yellow Bull: A/B seçimi, yorum sayısı, otel fotoğrafları.

## Bilinen eksikler
- `/gizlilik` metninde veri sorumlusu unvan/adres yok; hukuki gözden geçirme gerekir.
- `salon-ada` önce/sonra görselleri Unsplash yer tutucu (gerçek çift değil).
- Avukat sitesinde Google Maps embed ve EB Garamond ağır; Lighthouse 80. İstenirse statik harita görseline geçilir.
- Lighthouse CI ilk çalışmasında GitHub Actions'ın Chrome ortamına göre eşik ayarı gerekebilir.
