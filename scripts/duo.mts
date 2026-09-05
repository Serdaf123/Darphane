/**
 * İki tasarımı yan yana tek görselde: shots/<slug>-ab.png
 *   npm run duo -- <slug> [baseUrl]
 * Önce iki telefon görselini üretir (screenshot --clean), sonra "A mı, B mi?" düzeniyle birleştirir.
 * WhatsApp'ta bu görsel + "iki tasarım hazırladım, hangisi?" mesajı gider.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [slug, baseUrl = "http://localhost:3000"] = process.argv.slice(2);
if (!slug) { console.error("Kullanım: npm run duo -- <slug> [baseUrl]"); process.exit(1); }
for (const v of ["", "/b"]) execSync(`node scripts/screenshot.mts ${slug}${v} ${baseUrl} --clean`, { stdio: "inherit" });

const a = fs.readFileSync(path.join("shots", `${slug}-telefon.png`)).toString("base64");
const b = fs.readFileSync(path.join("shots", `${slug}-b-telefon.png`)).toString("base64");
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;background:radial-gradient(circle at 50% 30%,#2a2f3a,#0f1115 70%);font:600 40px -apple-system,system-ui,sans-serif;color:#fff}
  .wrap{display:flex;gap:40px;padding:56px 64px;align-items:flex-start}
  figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:18px}
  img{width:520px;display:block}
  figcaption span{display:inline-block;background:#22c55e;color:#07130b;border-radius:999px;padding:6px 22px;margin-right:14px}
</style></head><body><div class="wrap">
  <figure><img src="data:image/png;base64,${a}"><figcaption><span>A</span></figcaption></figure>
  <figure><img src="data:image/png;base64,${b}"><figcaption><span>B</span></figcaption></figure>
</div></body></html>`;
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1248, height: 1240 }, deviceScaleFactor: 2 });
await page.setContent(html);
await page.locator("body").screenshot({ path: path.join("shots", `${slug}-ab.png`) });
await browser.close();
console.log(`Kaydedildi: shots/${slug}-ab.png`);
