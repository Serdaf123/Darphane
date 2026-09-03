/**
 * Bir sitenin telefon ekranı görüntüsünü alır ve iPhone çerçevesine oturtur.
 * WhatsApp'ta linkten önce bu görseli atmak açılma oranını ciddi artırır.
 *
 *   npm run screenshot -- <slug> [baseUrl] [--clean]
 *   npm run screenshot -- ocakbasi-sahin
 *   npm run screenshot -- ocakbasi-sahin https://alanadi.com --clean   # teklif şeridi olmadan
 *
 * Çıktı: shots/<slug>-mobil.png (ham) ve shots/<slug>-telefon.png (çerçeveli)
 * Gereksinim: kurulu Google Chrome (Playwright onu sürer, ayrıca indirme gerekmez)
 */

import fs from "node:fs";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const args = process.argv.slice(2);
const clean = args.includes("--clean"); // teklif şeridini gizle, "gerçek site" gibi görünsün
const [slug, baseUrl = "http://localhost:3000"] = args.filter((a) => !a.startsWith("--"));
if (!slug) {
  console.error("Kullanım: npm run screenshot -- <slug> [baseUrl] [--clean]");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "shots");
fs.mkdirSync(outDir, { recursive: true });

const rawPath = path.join(outDir, `${slug}-mobil.png`);
const framedPath = path.join(outDir, `${slug}-telefon.png`);

// macOS 13'te Playwright'ın kendi Chromium'u yok; kurulu Google Chrome kullanılır.
const browser = await chromium.launch({ channel: "chrome" });

// 1) Gerçek telefon görünümü — hero + ilk bölümler
// Playwright'ın iPhone tanımı 393×659 (Safari çubuğu düşülmüş) — çerçeve tam ekran 393×852 bekler.
const phone = await browser.newContext({
  ...devices["iPhone 14 Pro"],
  viewport: { width: 393, height: 852 },
  locale: "tr-TR",
});
const page = await phone.newPage();
await page.goto(`${baseUrl}/${slug}`, { waitUntil: "networkidle" });
// Next dev göstergesi ve (istenirse) teklif şeridi görselde çıkmasın
await page.addStyleTag({
  content: `nextjs-portal{display:none!important}${clean ? "[data-offer-bar]{display:none!important}" : ""}`,
});
await page.waitForTimeout(800); // fontlar ve görseller otursun
await page.screenshot({ path: rawPath, fullPage: false });
await phone.close();

// 2) Çerçeve: CSS ile çizilen iPhone gövdesi, içine ham görüntü
const raw = fs.readFileSync(rawPath).toString("base64");
const frameHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;background:transparent}
  .stage{width:520px;height:1040px;display:grid;place-items:center;
    background:radial-gradient(circle at 50% 30%, #2a2f3a 0%, #0f1115 70%)}
  .phone{position:relative;width:393px;height:852px;border-radius:56px;background:#0b0b0d;
    box-shadow:0 0 0 2px #3a3d45, 0 0 0 5px #17181c, 0 40px 80px rgba(0,0,0,.6)}
  .screen{position:absolute;inset:10px;border-radius:46px;overflow:hidden;background:#000}
  .screen img{display:block;width:100%;height:100%;object-fit:cover;object-position:top}
  .island{position:absolute;top:22px;left:50%;transform:translateX(-50%);
    width:120px;height:34px;border-radius:20px;background:#000}
</style></head><body><div class="stage"><div class="phone">
  <div class="screen"><img src="data:image/png;base64,${raw}"></div><div class="island"></div>
</div></div></body></html>`;

const desktop = await browser.newContext({ viewport: { width: 520, height: 1040 }, deviceScaleFactor: 2 });
const framePage = await desktop.newPage();
await framePage.setContent(frameHtml);
await framePage.locator(".stage").screenshot({ path: framedPath, omitBackground: false });
await desktop.close();

await browser.close();

console.log(`Kaydedildi:\n  shots/${path.basename(rawPath)}\n  shots/${path.basename(framedPath)}`);
