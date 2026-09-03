/**
 * Yeni bir işletme sitesi iskeleti oluşturur.
 *
 *   npm run new-site -- <slug> "<İşletme Adı>" "<Kategori>" [tema]
 *   npm run new-site -- kuafor-nese "Kuaför Neşe" "Kadın Kuaförü" sage
 *
 * Sonrası: data/sites/<slug>.json dosyasını doldur, `npm run dev` ile bak.
 */

import fs from "node:fs";
import path from "node:path";

const [slug, name, category, preset = "porcelain"] = process.argv.slice(2);

if (!slug || !name || !category) {
  console.error(
    'Kullanım: npm run new-site -- <slug> "<İşletme Adı>" "<Kategori>" [tema]\n' +
      "Temalar: porcelain, ember, sage, midnight, cobalt, sand"
  );
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Geçersiz slug: "${slug}". Sadece küçük harf, rakam ve tire kullan.`);
  process.exit(1);
}

const file = path.join(process.cwd(), "data", "sites", `${slug}.json`);

if (fs.existsSync(file)) {
  console.error(`Bu dosya zaten var: data/sites/${slug}.json`);
  process.exit(1);
}

// Teklif varsayılan olarak 7 gün sonra dolar.
const expiresAt = new Date(Date.now() + 7 * 86_400_000);
expiresAt.setHours(21, 0, 0, 0);

const skeleton = {
  slug,
  business: {
    name,
    category,
    tagline: "",
    phone: "",
    whatsapp: "",
    address: "",
    district: "",
    city: "",
    social: { instagram: "" },
    hours: {
      timezone: "Europe/Istanbul",
      days: {
        mon: [{ open: "09:00", close: "18:00" }],
        tue: [{ open: "09:00", close: "18:00" }],
        wed: [{ open: "09:00", close: "18:00" }],
        thu: [{ open: "09:00", close: "18:00" }],
        fri: [{ open: "09:00", close: "18:00" }],
        sat: [{ open: "10:00", close: "16:00" }],
        sun: [],
      },
    },
  },
  theme: {
    preset,
    headingFont: "sans",
    radius: "md",
    density: "normal",
    // glass | solid | minimal | none
    header: "glass",
    // hero: rise | reveal | blur | curtain | zoom | none · scroll: rise | fade | slide | scale | none
    motion: { hero: "rise", scroll: "rise" },
  },
  sections: [
    {
      type: "hero",
      id: "ust",
      variant: "image",
      headline: "",
      subline: "",
      image: { src: "", alt: "" },
      badges: [],
      actions: [
        { label: "Ara", kind: "call", style: "primary" },
        { label: "WhatsApp", kind: "whatsapp", style: "secondary" },
        { label: "Yol Tarifi", kind: "directions", style: "ghost" },
      ],
    },
    { type: "about", id: "hakkinda", title: "Hakkımızda", body: "", highlights: [] },
    {
      type: "services",
      id: "hizmetler",
      title: "Hizmetlerimiz",
      layout: "cards",
      items: [{ name: "", description: "", price: "" }],
    },
    { type: "gallery", id: "galeri", title: "Galeri", layout: "grid", images: [] },
    { type: "reviews", id: "yorumlar", title: "Müşterilerimiz ne diyor?", items: [] },
    { type: "hours", id: "saatler" },
    { type: "location", id: "konum", showMap: true },
    {
      type: "cta",
      id: "iletisim",
      headline: "",
      subline: "",
      actions: [
        { label: "WhatsApp'tan Yaz", kind: "whatsapp", style: "primary" },
        { label: "Telefonla Ara", kind: "call", style: "ghost" },
      ],
    },
  ],
  offer: {
    status: "draft",
    expiresAt: expiresAt.toISOString(),
    price: 8500,
    currency: "TRY",
    seller: { name: "fourpear", whatsapp: "" },
  },
  seo: { title: "", description: "" },
};

fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, `${JSON.stringify(skeleton, null, 2)}\n`, "utf8");

console.log(`Oluşturuldu: data/sites/${slug}.json

Sıradaki adımlar:
  1. Dosyayı doldur (telefon, adres, içerik, görseller)
  2. offer.seller.whatsapp alanına kendi numaranı yaz
  3. npm run dev  →  http://localhost:3000/${slug}
  4. Hazır olunca offer.status'ü "pitched" yap ve teklifi gönder`);
