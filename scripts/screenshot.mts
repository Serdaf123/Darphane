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

// 2) Çerçeve: CSS ile çizilen iPhone gövdesi, içine ham görüntü.
// Üstte 54px durum çubuğu: Dynamic Island sayfa içeriğinin üstüne binmez,
// rengi sayfanın üst kenarından alınır (koyu site → koyu çubuk).
const raw = fs.readFileSync(rawPath).toString("base64");
const probe = await browser.newPage();
await probe.setContent(`<img id="i" src="data:image/png;base64,${raw}">`);
const topColor = await probe.evaluate(() => {
  const img = document.getElementById("i") as HTMLImageElement;
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = 1;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, 1).data;
  let r = 0, g = 0, b = 0, n = 0;
  for (let x = 0; x < d.length; x += 4 * 8) { r += d[x]; g += d[x + 1]; b += d[x + 2]; n++; }
  r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return { bg: `rgb(${r},${g},${b})`, fg: lum > 0.55 ? "#111" : "#fff" };
});
await probe.close();
const frameHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;background:transparent}
  .stage{width:520px;height:1040px;display:grid;place-items:center;
    background:radial-gradient(circle at 50% 30%, #2a2f3a 0%, #0f1115 70%)}
  .phone{position:relative;width:393px;height:852px;border-radius:56px;background:#0b0b0d;
    box-shadow:0 0 0 2px #3a3d45, 0 0 0 5px #17181c, 0 40px 80px rgba(0,0,0,.6)}
  .screen{position:absolute;inset:10px;border-radius:46px;overflow:hidden;background:${topColor.bg}}
  .status{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;
    justify-content:space-between;padding:12px 34px 0;color:${topColor.fg};
    font:600 15px -apple-system,system-ui,sans-serif;letter-spacing:.01em}
  .status .r{display:flex;gap:6px;align-items:center}
  .status .bat{width:26px;height:12px;border:1.5px solid currentColor;border-radius:4px;position:relative;opacity:.9}
  .status .bat::after{content:"";position:absolute;inset:2px;right:6px;background:currentColor;border-radius:2px}
  .screen img{display:block;width:100%;height:calc(100% - 54px);margin-top:54px;object-fit:cover;object-position:top}
  .island{position:absolute;top:22px;left:50%;transform:translateX(-50%);
    width:120px;height:34px;border-radius:20px;background:#000}
</style></head><body><div class="stage"><div class="phone">
  <div class="screen"><img src="data:image/png;base64,${raw}"><div class="status"><span>9:41</span><span class="r">●●●● <span class="bat"></span></span></div></div><div class="island"></div>
</div></div></body></html>`;

const desktop = await browser.newContext({ viewport: { width: 520, height: 1040 }, deviceScaleFactor: 2 });
const framePage = await desktop.newPage();
await framePage.setContent(frameHtml);
await framePage.locator(".stage").screenshot({ path: framedPath, omitBackground: false });
await desktop.close();

await browser.close();

console.log(`Kaydedildi:\n  shots/${path.basename(rawPath)}\n  shots/${path.basename(framedPath)}`);
