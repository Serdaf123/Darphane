/**
 * Sunum kartı: masaüstü ilk ekran + mobil tam sayfa (kırpılmış) yan yana, üstte başlık.
 *   node scripts/konsept-kart.mts <key> "<başlık>"   → docs/qa/konsept/<key>-kart.jpg
 */
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const sharp = require("sharp");
const [key, title = key] = process.argv.slice(2);
const dir = "docs/qa/konsept";
const desk = `${dir}/${key}-desktop.png`, mob = `${dir}/${key}-mobile-full.png`;
if (!fs.existsSync(desk) || !fs.existsSync(mob)) { console.error("önce konsept-shot çalıştır"); process.exit(1); }
const W = 1600, H = 1000, pad = 24, head = 72;
const deskImg = await sharp(desk).resize({ width: 1180, height: H - head - pad * 2, fit: "inside" }).toBuffer();
const dm = await sharp(deskImg).metadata();
const mobImg = await sharp(mob).resize({ width: 330 }).extract({ left: 0, top: 0, width: 330, height: Math.min(H - head - pad * 2, Math.floor((await sharp(mob).metadata()).height! * 330 / (await sharp(mob).metadata()).width!)) }).toBuffer();
const mm = await sharp(mobImg).metadata();
const label = await sharp({ text: { text: `<span foreground="#111" size="30000" weight="bold">${title.replace(/&/g, "&amp;")}</span>`, rgba: true, dpi: 150, width: 1500 } }).png().toBuffer();
await sharp({ create: { width: W, height: H, channels: 3, background: "#f2f1ec" } })
  .composite([
    { input: label, top: 22, left: pad },
    { input: deskImg, top: head + pad, left: pad },
    { input: mobImg, top: head + pad, left: pad + 1180 + 30 },
  ])
  .jpeg({ quality: 82 })
  .toFile(`${dir}/${key}-kart.jpg`);
console.log(`${dir}/${key}-kart.jpg (masaüstü ${dm.width}x${dm.height}, mobil ${mm.width}x${mm.height})`);
