/**
 * Teklif paketi tek komutta:
 *   npm run pitch -- <slug> [--url https://...] [--b]
 *
 * 1. Telefon çerçeveli ekran görüntüsü (temiz, şeritsiz)  → shots/<slug>-telefon.png
 * 2. OG kartı                                            → shots/<slug>-og.png
 * 3. Gönderim metni panoya (content/pitch/gonderim/<slug>.txt), yoksa şablondan üretir
 * 4. shots/ klasörünü Finder'da açar
 * WhatsApp'ta sıra: önce görsel, sonra metin (link önizlemesi metinle gelir).
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--url");
const flag = (n: string) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const base = (flag("--url") ?? "https://darphane-74qr.vercel.app").replace(/\/$/, "");
const variantB = args.includes("--b");

if (!slug) {
  console.error("Kullanım: npm run pitch -- <slug> [--url https://...] [--b]");
  process.exit(1);
}
const file = path.join("data", "sites", `${slug}.json`);
if (!fs.existsSync(file)) { console.error(`Site yok: ${file}`); process.exit(1); }
const site = JSON.parse(fs.readFileSync(file, "utf8"));
const pageUrl = `${base}/${slug}${variantB ? "/b" : ""}`;

/* 1. ekran görüntüsü */
execSync(`node scripts/screenshot.mts ${slug}${variantB ? "/b" : ""} ${base} --clean`, { stdio: "inherit" });

/* 2. OG kartı */
fs.mkdirSync("shots", { recursive: true });
const og = await fetch(`${base}/${slug}/opengraph-image`);
if (og.ok) {
  fs.writeFileSync(path.join("shots", `${slug}-og.png`), Buffer.from(await og.arrayBuffer()));
  console.log(`OG kartı: shots/${slug}-og.png`);
}

/* 3. metin */
const txt = path.join("content", "pitch", "gonderim", `${slug}.txt`);
let message: string;
if (fs.existsSync(txt)) {
  message = fs.readFileSync(txt, "utf8");
} else {
  const price = site.offer?.price ? `${Number(site.offer.price).toLocaleString("tr-TR")} ₺` : "tek seferlik ücret";
  const deadline = site.offer?.expiresAt
    ? new Date(site.offer.expiresAt).toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" })
    : "belirttiğim gün";
  message = `Merhaba, ${site.business.name} için bir şey hazırladım.

Sitenizin olmadığını fark ettim, ben de bir tane kurdum. Google'daki bilgilerinizle (telefon, adres, saatler, yorumlar) tek sayfalık bir site; WhatsApp'tan doğrudan mesaj alıyor. Şu an canlı, telefonunuzdan açabilirsiniz:

${pageUrl}

Bu bir teklif sunumu değil, bitmiş bir iş. Beğenirseniz ${price} karşılığında sizin oluyor, alan adını da ben ayarlarım. Beğenmezseniz ${deadline} siteyi kaldırıyorum, kimsenin bir yükümlülüğü olmuyor.

İlgilenmiyorsanız "çıkar" yazmanız yeterli, bir daha yazmam.

Serkan — fourpear`;
  fs.mkdirSync(path.dirname(txt), { recursive: true });
  fs.writeFileSync(txt, message);
  console.log(`Metin şablondan üretildi: ${txt} (düzenleyip tekrar çalıştırabilirsin)`);
}
try {
  execSync("pbcopy", { input: message });
  console.log("Gönderim metni panoya kopyalandı.");
} catch {
  console.log("Pano yok; metin:\n" + message);
}

/* 4. klasörü aç */
try { execSync("open shots"); } catch { /* macOS dışı */ }
console.log(`\nSıra: 1) shots/${slug}-telefon.png gönder  2) metni yapıştır  3) panelde "Teklif gönderildi" → ${base}/panel/${slug}`);
