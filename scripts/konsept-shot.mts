/**
 * Konsept ekran görüntüsü: masaüstü ilk ekran + tam sayfa, mobil ilk ekran + tam sayfa.
 *   node scripts/konsept-shot.mts <key> [site] [port]
 * Çıktı: docs/qa/konsept/<key>-{desktop,desktop-full,mobile,mobile-full}.png
 * Gereksinim: çalışan dev/prod sunucu (varsayılan port 3120).
 */
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const [key, site = "pisi-veteriner", port = "3120"] = process.argv.slice(2);
if (!key) { console.error("Kullanım: node scripts/konsept-shot.mts <key> [site] [port]"); process.exit(1); }
const out = "docs/qa/konsept"; fs.mkdirSync(out, { recursive: true });
const url = `http://localhost:${port}/konsept/${key}?site=${site}&frame=1`;
const browser = await chromium.launch({ channel: "chrome" });
const errors: string[] = [];
async function walk(page: import("@playwright/test").Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(400);
}
const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
d.on("pageerror", (e) => errors.push("desktop pageerror: " + e.message.slice(0, 200)));
await d.goto(url, { waitUntil: "networkidle", timeout: 90000 }); await d.waitForTimeout(1200);
await d.screenshot({ path: `${out}/${key}-desktop.png` });
await walk(d); await d.screenshot({ path: `${out}/${key}-desktop-full.png`, fullPage: true });
const overflowD = await d.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await d.close();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const m = await ctx.newPage();
m.on("pageerror", (e) => errors.push("mobile pageerror: " + e.message.slice(0, 200)));
await m.goto(url, { waitUntil: "networkidle", timeout: 90000 }); await m.waitForTimeout(1200);
await m.screenshot({ path: `${out}/${key}-mobile.png` });
await walk(m); await m.screenshot({ path: `${out}/${key}-mobile-full.png`, fullPage: true });
const overflowM = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await ctx.close(); await browser.close();
console.log(`${key}: yatay taşma masaüstü ${overflowD}px · mobil ${overflowM}px · hatalar: ${errors.length ? errors.join(" | ") : "yok"}`);
console.log(`görüntüler: ${out}/${key}-{desktop,desktop-full,mobile,mobile-full}.png`);
