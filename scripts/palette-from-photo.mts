/**
 * Hero fotoğrafından vurgu rengi → OKLCH palet önerisi.
 *
 *   npm run palette -- <slug> [--apply] [--dark] [--tint 0.35]
 *
 * Fotoğrafın baskın rengini (sharp) alır, OKLCH'de kromayı işletme için makul
 * bir aralığa çeker, paletFromAccent ile tam paleti ve kontrast raporunu basar.
 * --apply: theme.accent / mode / neutralTint'i JSON'a yazar (preset kalır ama
 * accent onu geçersiz kılar).
 *
 * Neden: sitenin rengi fotoğrafıyla akraba olunca "uyum" kendiliğinden gelir;
 * elle preset seçmek yerine görselden türetiyoruz.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { converter, formatHex, clampChroma } from "culori";
import { auditPalette, paletteFromAccent } from "../lib/palette.ts";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--") && args[args.indexOf(a) - 1] !== "--tint");
const apply = args.includes("--apply");
const dark = args.includes("--dark");
const tint = args.includes("--tint") ? Number(args[args.indexOf("--tint") + 1]) : 0.35;

if (!slug) {
  console.error("Kullanım: npm run palette -- <slug> [--apply] [--dark] [--tint 0.35]");
  process.exit(1);
}
const file = path.join(process.cwd(), "data", "sites", `${slug}.json`);
const site = JSON.parse(fs.readFileSync(file, "utf8"));
const hero = site.sections?.find((s: { type: string }) => s.type === "hero");
const src: string | undefined = hero?.image?.src;
if (!src) {
  console.error("Hero görseli yok; önce sections[0].image.src ver.");
  process.exit(1);
}

const buf = src.startsWith("http")
  ? Buffer.from(await (await fetch(src)).arrayBuffer())
  : fs.readFileSync(path.join(process.cwd(), "public", src));

const toOklch = converter("oklch");
const { data, info } = await sharp(buf).resize(96, 96, { fit: "inside" }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
// Her pikseli OKLCH'e çevir; gri/çok koyu/çok açık olanları at; kalanların
// ortanca tonu ve ortalama kroması "fotoğrafın rengi". Baskın renk (stats)
// gece fotoğrafında siyah, gri fotoğrafta gri döner — işe yaramaz.
const pts: Array<{ l: number; c: number; h: number }> = [];
for (let i = 0; i < data.length; i += 3) {
  const o = toOklch({ mode: "rgb", r: data[i] / 255, g: data[i + 1] / 255, b: data[i + 2] / 255 });
  if (o && o.h !== undefined && o.c > 0.04 && o.l > 0.15 && o.l < 0.9) pts.push({ l: o.l, c: o.c, h: o.h });
}
const { dominant } = await sharp(buf).resize(64, 64, { fit: "inside" }).stats();
let d: { l: number; c: number; h: number | undefined };
if (pts.length > info.width * info.height * 0.03) {
  // dairesel ortanca yerine en kalabalık 30°'lik ton dilimi
  const bins = new Array(12).fill(0);
  for (const p of pts) bins[Math.floor(p.h / 30) % 12] += p.c;
  const top = bins.indexOf(Math.max(...bins));
  const sel = pts.filter((p) => Math.floor(p.h / 30) % 12 === top);
  const avg = (k: "l" | "c" | "h") => sel.reduce((a, p) => a + p[k], 0) / sel.length;
  d = { l: avg("l"), c: avg("c"), h: avg("h") };
  console.log(`Renkli piksel: %${Math.round((100 * pts.length) / (info.width * info.height))}, ton dilimi ${top * 30}–${top * 30 + 30}°`);
} else {
  d = toOklch({ mode: "rgb", r: dominant.r / 255, g: dominant.g / 255, b: dominant.b / 255 })! as typeof d;
  console.log("Fotoğraf neredeyse tek ton; baskın renk kullanıldı");
}

// Fotoğraftaki renk çoğu zaman soluk ya da çok koyu; vurgu için kromayı ve
// açıklığı kullanılabilir aralığa çek. Gri fotoğrafta (c < 0.02) ton yine de
// alınır, kroma yükseltilir — "fotoğrafın altındaki ton".
const h = d.h ?? 30;
const c = Math.min(0.16, Math.max(0.09, d.c * 1.6));
const l = Math.min(0.62, Math.max(0.42, d.l));
const accent = formatHex(clampChroma({ mode: "oklch", l, c, h }, "oklch"))!;

const palette = paletteFromAccent(accent, { mode: dark ? "dark" : "light", neutralTint: tint });
const audit = auditPalette(palette);

console.log(`Fotoğraf baskın: ${formatHex({ mode: "rgb", r: dominant.r / 255, g: dominant.g / 255, b: dominant.b / 255 })}  →  oklch(${d.l.toFixed(2)} ${d.c.toFixed(3)} ${h.toFixed(0)})`);
console.log(`Vurgu önerisi:   ${accent}  (${dark ? "koyu" : "açık"} dünya, nötr boyası ${tint})\n`);
for (const [k, v] of Object.entries(palette)) if (k !== "overlay") console.log(`  ${k.padEnd(11)} ${v}`);
console.log("\nKontrast (WCAG / APCA Lc):");
for (const r of audit) console.log(`  ${r.ok ? "✓" : "✗"} ${r.name.padEnd(18)} ${String(r.wcag).padStart(5)}  ${String(r.apca).padStart(5)}   (min ${r.min})`);

if (apply) {
  site.theme = { ...site.theme, accent, mode: dark ? "dark" : "light", neutralTint: tint };
  fs.writeFileSync(file, JSON.stringify(site, null, 2) + "\n");
  console.log(`\nYazıldı: data/sites/${slug}.json → theme.accent ${accent}`);
} else {
  console.log("\n--apply ile JSON'a yaz.");
}
