import { clampChroma, converter, formatHex, wcagContrast, type Oklch } from "culori";
import { APCAcontrast, sRGBtoY } from "apca-w3";

/**
 * Tek vurgu renginden tam palet — OKLCH'de.
 *
 * Neden: elle seçilen presetler ya birbirine benziyor ya da uyumsuz kalıyor.
 * OKLCH'de açıklık (L) algısal olduğu için aynı L'deki iki renk aynı kontrastı
 * verir; nötrleri vurgu rengine hafifçe boyayınca (c ≈ 0.01) sayfa tek bir
 * renk ailesinden çıkmış gibi durur — craft-floor'un "saf gri yok" kuralı.
 *
 * Garanti: text/bg ≥ 7:1, muted/bg ≥ 4.5:1, accent/bg ≥ 3:1, accentText/accent ≥ 4.5:1.
 * Tutmazsa L kaydırılarak zorlanır. APCA Lc bilgi amaçlı raporlanır.
 */

export type PaletteTokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  overlay: string;
};

const toOklch = converter("oklch");

function hex(l: number, c: number, h: number): string {
  return formatHex(clampChroma({ mode: "oklch", l, c, h } as Oklch, "oklch"))!;
}

function rgb(hexStr: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hexStr.slice(i, i + 2), 16)) as [number, number, number];
}

/** APCA Lc (mutlak). 60+ gövde metni, 75+ küçük metin için rahat. */
export function apcaLc(fg: string, bg: string): number {
  return Math.abs(Number(APCAcontrast(sRGBtoY(rgb(fg)), sRGBtoY(rgb(bg)))));
}

/** fg'nin L'sini bg'den uzağa kaydırarak hedef WCAG oranını yakala. */
function ensureContrast(l: number, c: number, h: number, bg: string, min: number, direction: "darker" | "lighter"): string {
  let cur = l;
  for (let i = 0; i < 40; i++) {
    const candidate = hex(cur, c, h);
    if (wcagContrast(candidate, bg) >= min) return candidate;
    cur += direction === "darker" ? -0.015 : 0.015;
    if (cur < 0.05 || cur > 0.99) break;
  }
  return hex(cur, c, h);
}

export function paletteFromAccent(
  accentHex: string,
  options: { mode?: "light" | "dark"; neutralTint?: number } = {}
): PaletteTokens {
  const mode = options.mode ?? "light";
  // 0 = saf gri, 1 = belirgin boyalı nötr. 0.35 çoğu işletme için doğru.
  const tint = Math.min(1, Math.max(0, options.neutralTint ?? 0.35));
  const a = toOklch(accentHex);
  if (!a) throw new Error(`Geçersiz renk: ${accentHex}`);
  const h = a.h ?? 0;
  const nc = 0.03 * tint; // nötrlerin kroması

  if (mode === "light") {
    const bg = hex(0.975, nc * 0.6, h);
    const surface = hex(0.95, nc * 0.8, h);
    const surfaceAlt = hex(0.915, nc, h);
    const border = hex(0.86, nc * 1.2, h);
    const text = ensureContrast(0.2, nc * 1.5, h, bg, 7, "darker");
    const muted = ensureContrast(0.47, nc * 2, h, bg, 4.5, "darker");
    // Vurgu: kendi kroması, açıklık gerekirse koyulaştırılır (bg'ye 3:1)
    let accent = ensureContrast(Math.min(a.l, 0.6), Math.min(a.c, 0.2), h, bg, 3, "darker");
    // Turuncu/sarı gibi orta açıklıkta vurgularda ne beyaz ne koyu metin 4.5'i tutmaz:
    // vurguyu beyaz yazı okunana kadar koyulaştır
    if (wcagContrast("#ffffff", accent) < 4.5 && wcagContrast(text, accent) < 4.5) {
      accent = ensureContrast(toOklch(accent)!.l, Math.min(a.c, 0.2), h, "#ffffff", 4.5, "darker");
    }
    const accentText = wcagContrast("#ffffff", accent) >= 4.5 ? "#ffffff" : text;
    const accentSoft = hex(0.93, Math.min(0.06, a.c * 0.5), h);
    const overlayBase = toOklch(text)!;
    return {
      bg,
      surface,
      surfaceAlt,
      text,
      muted,
      border,
      accent,
      accentText,
      accentSoft,
      overlay: `linear-gradient(180deg, ${rgba(overlayBase, 0.18)} 0%, ${rgba(overlayBase, 0.72)} 100%)`,
    };
  }

  const bg = hex(0.17, nc * 0.8, h);
  const surface = hex(0.215, nc, h);
  const surfaceAlt = hex(0.26, nc * 1.1, h);
  const border = hex(0.31, nc * 1.2, h);
  const text = ensureContrast(0.95, nc * 0.5, h, bg, 7, "lighter");
  const muted = ensureContrast(0.7, nc * 1.2, h, bg, 4.5, "lighter");
  const accent = ensureContrast(Math.max(a.l, 0.68), Math.min(a.c, 0.18), h, bg, 3, "lighter");
  const accentText = wcagContrast(accent, "#0b0b0d") >= 4.5 ? hex(0.12, nc, h) : "#ffffff";
  const accentSoft = hex(0.27, Math.min(0.07, a.c * 0.5), h);
  const overlayBase = toOklch(bg)!;
  return {
    bg,
    surface,
    surfaceAlt,
    text,
    muted,
    border,
    accent,
    accentText,
    accentSoft,
    overlay: `linear-gradient(180deg, ${rgba(overlayBase, 0.3)} 0%, ${rgba(overlayBase, 0.88)} 100%)`,
  };
}

function rgba(c: Oklch, alpha: number): string {
  const [r, g, b] = rgb(formatHex(clampChroma(c, "oklch"))!);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Paletin kontrast raporu — build'de ve scripts/check-palettes.mts'te kullanılır. */
export function auditPalette(p: PaletteTokens) {
  const pairs: Array<[string, string, string, number]> = [
    ["text/bg", p.text, p.bg, 7],
    ["muted/bg", p.muted, p.bg, 4.5],
    ["text/surface", p.text, p.surface, 7],
    ["muted/surface", p.muted, p.surface, 4.5],
    ["accent/bg", p.accent, p.bg, 3],
    ["accentText/accent", p.accentText, p.accent, 4.5],
  ];
  return pairs.map(([name, fg, bg, min]) => {
    const wcag = wcagContrast(fg, bg);
    return { name, fg, bg, wcag: Number(wcag.toFixed(2)), apca: Number(apcaLc(fg, bg).toFixed(1)), min, ok: wcag >= min };
  });
}
