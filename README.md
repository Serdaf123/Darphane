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

**2. Site oluştur.**

```bash
npm run new-site -- kuafor-nese "Kuaför Neşe" "Kadın Kuaförü" sage
```

Oluşan `data/sites/kuafor-nese.json` dosyasını doldur. `offer.seller.whatsapp` senin numaran. Tema seçenekleri: `porcelain` `ember` `sage` `midnight` `cobalt` `sand`. Örnek olarak `ocakbasi-sahin.json` (restoran, koyu) ve `dishekimi-elif-yarar.json` (klinik, açık) dosyalarına bak.

**3. Kontrol et.**

```bash
npm run dev      # http://localhost:3000/kuafor-nese
```

Telefondan da aç: alttaki Ara / Yol Tarifi / WhatsApp barı çalışıyor mu.

**4. Gönder.** `offer.status` → `"pitched"`, `expiresAt` ayarla (varsayılan 7 gün), commit + push. Vercel deploy eder. Mesaj şablonları: [`content/pitch/mesajlar.md`](content/pitch/mesajlar.md). Gönderim **elle, kişisel WhatsApp'tan.**

**5. Takip et.** Vercel Analytics'te `/kuafor-nese` görüntülenmişse link açılmıştır → aynı gün takip mesajı.

**6. Satış.** `offer.status` → `"sold"`. Alan adını Vercel'e bağla. Site arama motorlarına açılır.

## Komutlar

```bash
npm run dev          # geliştirme
npm run build        # üretim derlemesi — bozuk JSON burada patlar
npm run typecheck    # tip kontrolü
npm run lint
npm run new-site -- <slug> "<İşletme>" "<Kategori>" [tema]
```

## Yapı

```
app/[slug]/page.tsx       işletme sitesi (statik, 5 dk'da bir yenilenir)
app/page.tsx              iç liste: hangi site hangi aşamada
app/robots.ts             satılanlar hariç her şey kapalı
components/sections/      Hero, About, Services, Menu, Gallery, Reviews, Hours, Location, Contact, Faq, Cta
components/OfferLayer     taslak / geri sayım şeritleri
components/OfferExpired   süre doldu ekranı
components/StickyMobileBar
lib/schema.ts             zod şeması — JSON'un tek doğruluk kaynağı
lib/theme.ts              tema paletleri → CSS değişkenleri
lib/hours.ts              "şu an açık" hesabı
lib/actions.ts            tel: / wa.me / harita linkleri
content/pitch/            teklif mesajları
scripts/new-site.mts      iskelet üretici
```

## Görseller

Teklif aşamasında işletmenin kendi Instagram/Google fotoğraflarını kullanmak telif açısından gri alan. Şimdilik Unsplash (ticari kullanıma açık) veya üretilmiş görsel; satıştan sonra işletmenin kendi fotoğraflarına geçilir. Örnek sitelerdeki `picsum.photos` görselleri yer tutucudur.

Yerel görseller `public/sites/<slug>/` altına konur ve JSON'da `/sites/<slug>/dosya.jpg` olarak yazılır.
