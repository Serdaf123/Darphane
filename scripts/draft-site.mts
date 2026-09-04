/**
 * Google Maps metninden site taslağı üretir (Claude API).
 *
 *   npm run draft -- <slug> <maps-metni.txt> [--photos url1,url2,...] [--dry]
 *   npm run draft -- kuafor-nese leads/kuafor-nese.txt
 *
 * Girdi: Google Maps işletme sayfasından kopyalanan ham metin (ad, puan,
 * yorum sayısı, adres, telefon, saatler, olanaklar, birkaç yorum). Nasıl
 * gelirse gelsin; Claude içinden doğrulanabilir bilgiyi ayıklar.
 *
 * Çıktı: data/sites/<slug>.json — status "draft", teklif alanları .env'den.
 * Sonra `npm run dev` ile bak, düzelt, `pitched` yap.
 *
 * ANTHROPIC_API_KEY .env.local'da olmalı. --dry: API'ye gitmeden istemi göster.
 */

import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { siteSchema } from "../lib/schema.ts";

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const photosArg = args[args.indexOf("--photos") + 1];
const photos = args.includes("--photos") && photosArg ? photosArg.split(",").map((s) => s.trim()) : [];
const [slug, inputPath] = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--photos");

if (!slug || !inputPath) {
  console.error("Kullanım: npm run draft -- <slug> <maps-metni.txt> [--photos url1,url2] [--dry]");
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Geçersiz slug: "${slug}". Küçük harf, rakam ve tire.`);
  process.exit(1);
}
const outFile = path.join(process.cwd(), "data", "sites", `${slug}.json`);
if (fs.existsSync(outFile)) {
  console.error(`Zaten var: data/sites/${slug}.json — silip tekrar dene ya da başka slug ver.`);
  process.exit(1);
}
const source = fs.readFileSync(inputPath, "utf8").trim();
if (source.length < 40) {
  console.error("Girdi çok kısa. Google Maps sayfasındaki metni olduğu gibi yapıştır.");
  process.exit(1);
}

/* ------------------------------------------------------------------------ */
/* Modelin dolduracağı şema: siteSchema'nın regex/default içermeyen alt kümesi.
   Teklif (offer) ve slug bizden gelir; model içerik ve tema seçer.          */

const image = z.object({ src: z.string(), alt: z.string() });
const action = z.object({
  label: z.string(),
  kind: z.enum(["call", "whatsapp", "directions", "link", "scroll", "instagram", "email"]),
  value: z.string().nullable(),
  style: z.enum(["primary", "secondary", "ghost"]),
});
const timeRange = z.object({ open: z.string(), close: z.string() });
const dayRanges = z.array(timeRange);

const draftSchema = z.object({
  business: z.object({
    name: z.string(),
    category: z.string(),
    tagline: z.string(),
    phone: z.string().nullable(),
    whatsapp: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    district: z.string().nullable(),
    city: z.string().nullable(),
    instagram: z.string().nullable(),
    hours: z
      .object({
        note: z.string().nullable(),
        mon: dayRanges,
        tue: dayRanges,
        wed: dayRanges,
        thu: dayRanges,
        fri: dayRanges,
        sat: dayRanges,
        sun: dayRanges,
      })
      .nullable(),
  }),
  theme: z.object({
    preset: z.enum(["porcelain", "ember", "sage", "midnight", "cobalt", "sand", "bosphorus", "graphite"]),
    fonts: z.enum(["classic", "hospitality", "clean", "craft", "soft", "bold"]),
    headingFont: z.enum(["sans", "display"]),
    radius: z.enum(["none", "sm", "md", "lg"]),
    density: z.enum(["tight", "normal", "airy"]),
    header: z.enum(["glass", "solid", "minimal"]),
    heroMotion: z.enum(["rise", "reveal", "blur", "curtain", "zoom", "split"]),
    scrollMotion: z.enum(["rise", "fade", "slide", "scale"]),
  }),
  hero: z.object({
    variant: z.enum(["image", "split", "minimal"]),
    headline: z.string(),
    subline: z.string(),
    badges: z.array(z.string()),
    actions: z.array(action),
    imageAlt: z.string(),
  }),
  about: z.object({
    title: z.string(),
    body: z.string(),
    highlights: z.array(z.object({ label: z.string(), value: z.string() })),
  }),
  services: z
    .array(
      z.object({
        title: z.string(),
        navLabel: z.string(),
        intro: z.string().nullable(),
        layout: z.enum(["cards", "list", "grid"]),
        items: z.array(z.object({ name: z.string(), description: z.string().nullable(), price: z.string().nullable() })),
      })
    )
    .describe("Hizmetler, odalar, olanaklar gibi listeler. Menü yerine geçmez."),
  menu: z
    .object({
      title: z.string(),
      intro: z.string().nullable(),
      groups: z.array(
        z.object({
          name: z.string(),
          items: z.array(z.object({ name: z.string(), description: z.string().nullable(), price: z.string().nullable() })),
        })
      ),
    })
    .nullable()
    .describe("Sadece yeme-içme işletmeleri ve kaynakta gerçek menü bilgisi varsa"),
  reviews: z.object({
    title: z.string(),
    layout: z.enum(["cards", "quotes", "marquee"]),
    summary: z.object({ rating: z.number(), count: z.number(), source: z.string() }).nullable(),
    items: z.array(z.object({ author: z.string(), rating: z.number(), text: z.string(), source: z.string() })),
  }),
  faq: z.array(z.object({ q: z.string(), a: z.string() })),
  location: z.object({ title: z.string(), note: z.string().nullable() }),
  cta: z.object({ headline: z.string(), subline: z.string(), actions: z.array(action) }),
  whatsappMessage: z.string().describe("WhatsApp butonlarına önceden dolan mesaj; boş doldurulacak alanlarla"),
  seo: z.object({ title: z.string(), description: z.string() }),
  notes: z.array(z.string()).describe("Serkan'a notlar: teyit edilmesi gerekenler, kaynakta eksik olanlar"),
});
type Draft = z.infer<typeof draftSchema>;

/* ------------------------------------------------------------------------ */

const SYSTEM = `Sen fourpear'ın site yazarısın. Görev: web sitesi olmayan bir yerel işletme için, Google Maps'ten kopyalanmış ham metne dayanarak tek sayfa bir sitenin içeriğini ve tema seçimini üretmek. Site işletme sahibine "bu sizin siteniz, beğenirseniz satın alın" diye gösterilecek; sahibi okuduğunda "ben böyle konuşmam" dememeli.

YAZIM KURALLARI (en önemli kısım)
- Yalnızca kaynakta doğrulanabilir bilgi. Puan, yorum sayısı, adres, telefon, saatler, olanaklar, fiyatlar kaynaktan. Kaynakta olmayan hiçbir sayı, yıl, kapasite, ödül, "en iyi" iddiası, fiyat yazma. Kaynakta yoksa alanı null bırak ya da notes'a "teyit gerek" yaz.
- Yorum uydurma. Sadece kaynaktaki gerçek yorumları, hafifçe noktalayarak kullan. Yorum yoksa items boş kalsın, notes'a yaz.
- Sade, olgusal, sıcak ama abartısız Türkçe. Ders veren cümleler yok ("aracı siteler pay alır" gibi). Reklam dili yok ("fırsat", "kampanya", "eşsiz", "kusursuz", "lezzet şöleni"). Ünlem yok. Büyük harfli etiket yok. "A · B · C" gibi orta noktalı meta yok.
- İkinci tekil/çoğul şahıs, etken çatı. Kısa cümleler. Başlıklar cümle düzeninde.
- Hero başlığı: işletmenin en somut, doğrulanabilir üstünlüğü (konum, süre, dahil olanlar). Klişe değil, iddia değil.
- CTA etiketleri ne alınacağını söyler: "WhatsApp'tan Fiyat Al", "Masa Ayırt", "Randevu Al", "Yol Tarifi". "Gönder", "İletişim" gibi belirsizler yok.
- whatsappMessage: "Merhaba, {İşletme} için ... öğrenmek istiyorum.\\nTarih: \\nKişi: " gibi, doldurulacak boş alanlarla; işletmeye göre uyarla (randevu: tarih/saat; restoran: kişi/saat; otel: giriş/çıkış/kişi).
- Bölüm sırası sabittir (kod belirler): hero → hakkında → yorumlar → hizmetler/menü → SSS → konum → CTA. Sen içerik verirsin.
- SSS: 4-6 soru, hepsi kaynaktan cevaplanabilir olmalı (saatler, otopark, ödeme, ulaşım, kahvaltı dahil mi gibi). Bilinmeyen şeyi "rezervasyonda bildiririz" gibi dürüst ifadeyle geçiştir.
- Yorumlar düzeni: 0-2 yorum → "quotes", 3 → "cards", 4+ → "marquee".
- Fiyat kaynakta varsa yaz ("340 ₺" biçimi); yoksa null.

TEMA SEÇİMİ (işletme türünden)
- Restoran/ocakbaşı/kasap: ember + craft + display; hero image; heroMotion zoom
- Fırın/kafe/pastane/çiçekçi/spa: sand veya sage + soft + display
- Otel/pansiyon/butik: bosphorus + hospitality + display; hero image; heroMotion split
- Diş/klinik/estetik/muhasebe/avukat: cobalt veya porcelain + clean + sans; hero split; header solid
- Berber/dövme/oto servis/spor salonu: graphite veya midnight + bold + sans; heroMotion reveal
- Kuaför/güzellik: sage veya porcelain + soft + display
- Emin değilsen porcelain + classic.
- header: hero image ise "glass", değilse "solid". scrollMotion: koyu temalarda "rise", açıkta "fade".

GÖRSELLER
- imageAlt alanına görselin ne olması gerektiğini yaz (ör. "kömür ateşinde kebap"); src'yi kod doldurur.

NOTES
- Serkan'ın teyit etmesi gerekenleri madde madde yaz: giriş saati, fiyatlar, sahibin adı, eksik yorumlar, olanaklarda şüpheli olanlar.`;

const example = fs.existsSync(path.join(process.cwd(), "data/sites/olympos-garden-hotel.json"))
  ? fs.readFileSync(path.join(process.cwd(), "data/sites/olympos-garden-hotel.json"), "utf8")
  : "";

const userPrompt = `İşletme için site içeriği üret.

<kaynak_metin>
${source}
</kaynak_metin>

${example ? `Kalite referansı — daha önce yazdığımız bir otel sitesi (biçim değil, ton ve kural örneği):\n<ornek>\n${example}\n</ornek>` : ""}`;

if (dry) {
  console.log("--- SYSTEM ---\n" + SYSTEM + "\n\n--- USER (ilk 1500) ---\n" + userPrompt.slice(0, 1500));
  console.log("\n--- şema anahtarları ---", Object.keys(draftSchema.shape).join(", "));
  process.exit(0);
}

const client = new Anthropic();
console.log(`Claude taslağı yazıyor… (${source.length} karakter kaynak)`);

const response = await client.messages.parse({
  model: "claude-opus-5",
  max_tokens: 16000,
  thinking: { type: "adaptive" },
  system: [{ type: "text", text: SYSTEM, cache_control: { type: "ephemeral" } }],
  messages: [{ role: "user", content: userPrompt }],
  output_config: { format: zodOutputFormat(draftSchema) },
});

if (response.stop_reason === "refusal") {
  console.error("Model isteği reddetti:", response.stop_details?.explanation ?? "");
  process.exit(1);
}
const draft: Draft | null = response.parsed_output;
if (!draft) {
  console.error("Yanıt şemaya uymadı; stop_reason:", response.stop_reason);
  process.exit(1);
}

/* ------------------------------------------------------------------------ */
/* Taslağı site JSON'una çevir */

const b = draft.business;
const wa = (n: string | null) => {
  if (!n) return undefined;
  const d = n.replace(/\D/g, "");
  return d.startsWith("90") ? d : d.startsWith("0") ? `90${d.slice(1)}` : `90${d}`;
};
const withMsg = (a: z.infer<typeof action>) => ({
  label: a.label,
  kind: a.kind,
  style: a.style,
  ...(a.kind === "whatsapp" ? { value: draft.whatsappMessage } : a.value ? { value: a.value } : {}),
});
const pick = (i: number, fallbackAlt: string) =>
  photos[i] ? { src: photos[i], alt: fallbackAlt } : undefined;

const sections: unknown[] = [
  {
    type: "hero",
    id: "ust",
    variant: draft.hero.variant,
    headline: draft.hero.headline,
    subline: draft.hero.subline,
    ...(pick(0, draft.hero.imageAlt) ? { image: pick(0, draft.hero.imageAlt) } : {}),
    badges: draft.hero.badges,
    actions: draft.hero.actions.map(withMsg),
  },
  {
    type: "about",
    id: "hakkinda",
    title: draft.about.title,
    body: draft.about.body,
    ...(pick(1, b.name) ? { image: pick(1, b.name) } : {}),
    highlights: draft.about.highlights,
  },
];
if (draft.reviews.items.length > 0 || draft.reviews.summary) {
  sections.push({
    type: "reviews",
    id: "yorumlar",
    title: draft.reviews.title,
    layout: draft.reviews.layout,
    ...(draft.reviews.summary ? { summary: draft.reviews.summary } : {}),
    items: draft.reviews.items,
  });
}
if (draft.menu) {
  sections.push({
    type: "menu",
    id: "menu",
    title: draft.menu.title,
    ...(draft.menu.intro ? { intro: draft.menu.intro } : {}),
    groups: draft.menu.groups.map((g) => ({
      name: g.name,
      items: g.items.map((it) => ({ name: it.name, ...(it.description ? { description: it.description } : {}), ...(it.price ? { price: it.price } : {}) })),
    })),
  });
}
draft.services.forEach((svc, i) => {
  sections.push({
    type: "services",
    id: i === 0 ? "hizmetler" : `hizmetler-${i + 1}`,
    navLabel: svc.navLabel,
    ...(i > 0 ? { hideFromNav: true } : {}),
    title: svc.title,
    ...(svc.intro ? { intro: svc.intro } : {}),
    layout: svc.layout,
    items: svc.items.map((it) => ({ name: it.name, ...(it.description ? { description: it.description } : {}), ...(it.price ? { price: it.price } : {}) })),
  });
});
if (photos.length > 2) {
  sections.push({
    type: "gallery",
    id: "galeri",
    title: "Fotoğraflar",
    layout: "grid",
    images: photos.slice(2).map((src) => ({ src, alt: b.name })),
  });
}
if (draft.faq.length > 0) sections.push({ type: "faq", id: "sss", title: "Sık sorulan sorular", items: draft.faq });
if (b.hours) sections.push({ type: "hours", id: "saatler", title: "Çalışma saatleri" });
sections.push({ type: "location", id: "konum", title: draft.location.title, showMap: true, ...(draft.location.note ? { note: draft.location.note } : {}) });
sections.push({ type: "cta", id: "iletisim", headline: draft.cta.headline, subline: draft.cta.subline, actions: draft.cta.actions.map(withMsg) });

const expiresAt = new Date(Date.now() + 7 * 86_400_000);
expiresAt.setHours(21, 0, 0, 0);

const site = {
  slug,
  business: {
    name: b.name,
    category: b.category,
    tagline: b.tagline,
    ...(b.phone ? { phone: b.phone } : {}),
    ...(wa(b.whatsapp ?? b.phone) ? { whatsapp: wa(b.whatsapp ?? b.phone) } : {}),
    ...(b.email ? { email: b.email } : {}),
    ...(b.address ? { address: b.address } : {}),
    ...(b.district ? { district: b.district } : {}),
    ...(b.city ? { city: b.city } : {}),
    social: b.instagram ? { instagram: b.instagram } : {},
    ...(b.hours
      ? {
          hours: {
            timezone: "Europe/Istanbul",
            ...(b.hours.note ? { note: b.hours.note } : {}),
            days: { mon: b.hours.mon, tue: b.hours.tue, wed: b.hours.wed, thu: b.hours.thu, fri: b.hours.fri, sat: b.hours.sat, sun: b.hours.sun },
          },
        }
      : {}),
  },
  theme: {
    preset: draft.theme.preset,
    fonts: draft.theme.fonts,
    headingFont: draft.theme.headingFont,
    radius: draft.theme.radius,
    density: draft.theme.density,
    header: draft.theme.header,
    motion: { hero: draft.theme.heroMotion, scroll: draft.theme.scrollMotion, smooth: true, parallax: draft.hero.variant === "image" },
  },
  sections,
  offer: {
    status: "draft",
    expiresAt: expiresAt.toISOString().replace(/\.\d{3}Z$/, "+00:00"),
    ...(process.env.OFFER_PRICE ? { price: Number(process.env.OFFER_PRICE) } : {}),
    currency: "TRY",
    seller: { name: "fourpear", whatsapp: process.env.SELLER_WHATSAPP ?? "905550000000" },
  },
  seo: draft.seo,
};

const parsed = siteSchema.safeParse(site);
if (!parsed.success) {
  console.error("Üretilen site şemaya uymadı:\n", z.prettifyError(parsed.error));
  fs.writeFileSync(outFile + ".hatali.json", JSON.stringify(site, null, 2));
  console.error(`Ham çıktı: data/sites/${slug}.json.hatali.json`);
  process.exit(1);
}

fs.writeFileSync(outFile, JSON.stringify(site, null, 2) + "\n");
const u = response.usage;
console.log(`\nYazıldı: data/sites/${slug}.json`);
console.log(`Token: ${u.input_tokens} giriş (${u.cache_read_input_tokens ?? 0} önbellek) · ${u.output_tokens} çıkış`);
if (draft.notes.length) {
  console.log("\nTeyit edilecekler:");
  for (const n of draft.notes) console.log("  •", n);
}
if (photos.length === 0) console.log("\nGörsel verilmedi: hero ve galeri boş. --photos url1,url2 ile ekle ya da JSON'da doldur.");
console.log(`\nSonra: npm run dev → http://localhost:3000/${slug}`);
