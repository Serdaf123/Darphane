/**
 * Tüm sitelerin paletlerini kontrast açısından denetler (preset ya da accent).
 *   npm run check:palettes
 * Bir çift WCAG eşiğinin altındaysa çıkış kodu 1 — CI'da kapı olarak kullan.
 */
import fs from "node:fs";
import path from "node:path";
import { auditPalette, paletteFromAccent } from "../lib/palette.ts";
import { PALETTES } from "../lib/palettes.ts";

const dir = path.join(process.cwd(), "data", "sites");
let failed = 0;
for (const f of fs.readdirSync(dir).filter((x) => /^[a-z0-9-]+\.json$/.test(x))) {
  const site = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
  const t = site.theme ?? {};
  const palette = t.accent
    ? paletteFromAccent(t.accent, { mode: t.mode ?? "light", neutralTint: t.neutralTint ?? 0.35 })
    : PALETTES[(t.preset ?? "porcelain") as keyof typeof PALETTES];
  const audit = auditPalette(palette);
  const bad = audit.filter((r) => !r.ok);
  console.log(`${bad.length ? "✗" : "✓"} ${f.replace(".json", "").padEnd(24)} ${t.accent ? `accent ${t.accent}` : `preset ${t.preset ?? "porcelain"}`}${bad.length ? "  →  " + bad.map((r) => `${r.name} ${r.wcag}<${r.min}`).join(", ") : ""}`);
  if (bad.length) failed++;
}
console.log("\nPresetler:");
for (const [name, p] of Object.entries(PALETTES)) {
  const bad = auditPalette(p).filter((r) => !r.ok);
  console.log(`${bad.length ? "✗" : "✓"} ${name.padEnd(12)}${bad.length ? bad.map((r) => `${r.name} ${r.wcag}<${r.min}`).join(", ") : ""}`);
  if (bad.length) failed++;
}
process.exit(failed ? 1 : 0);
