import type { CSSProperties } from "react";
import { FONT_PAIRINGS } from "./fonts";
import { paletteFromAccent } from "./palette";
import { PALETTES, type Palette } from "./palettes";
export { PALETTES } from "./palettes";
import type { Theme, ThemePreset } from "./schema";
import { typeScaleVars } from "./typescale";

/**
 * Sabit şablonlar yerine tema tokenları: aynı bölüm kütüphanesi
 * JSON'daki birkaç satır değişince tamamen farklı bir site gibi görünür.
 */

const RADIUS: Record<Theme["radius"], string> = {
  none: "0px",
  sm: "4px",
  md: "10px",
  lg: "20px",
};

/** Bölüm arası dikey boşluk — sitenin "nefes alma" karakteri. */
const DENSITY: Record<Theme["density"], { section: string; gap: string }> = {
  tight: { section: "3rem", gap: "1rem" },
  normal: { section: "4.5rem", gap: "1.5rem" },
  airy: { section: "6.5rem", gap: "2rem" },
};

/** Tema → sitenin kök elemanına verilecek CSS değişkenleri. */
/** Preset ya da (verilmişse) vurgu renginden üretilmiş palet. */
export function resolvePalette(theme: Theme): Palette {
  if (theme.accent) {
    return paletteFromAccent(theme.accent, { mode: theme.mode, neutralTint: theme.neutralTint });
  }
  return PALETTES[theme.preset];
}

export function themeStyle(theme: Theme): CSSProperties {
  const palette = resolvePalette(theme);
  const density = DENSITY[theme.density];
  const fonts = FONT_PAIRINGS[theme.fonts];

  return {
    ...typeScaleVars(theme.typeScale),
    "--font-sans": fonts.sans,
    "--font-display": fonts.display,
    "--c-bg": palette.bg,
    "--c-surface": palette.surface,
    "--c-surface-alt": palette.surfaceAlt,
    "--c-text": palette.text,
    "--c-muted": palette.muted,
    "--c-border": palette.border,
    "--c-accent": palette.accent,
    "--c-accent-text": palette.accentText,
    "--c-accent-soft": palette.accentSoft,
    "--c-overlay": palette.overlay,
    "--radius": RADIUS[theme.radius],
    "--section-y": density.section,
    "--stack-gap": density.gap,
    "--font-heading":
      theme.headingFont === "display" ? "var(--font-display)" : "var(--font-sans)",
  } as CSSProperties;
}

/** Font çiftinin CSS değişkenlerini tanımlayan sınıflar — site köküne verilir. */
export function themeFontClass(theme: Theme): string {
  return FONT_PAIRINGS[theme.fonts].className;
}

/** Koyu temalarda tarayıcı arayüzü de koyu olmalı. */
export function isDarkPreset(preset: ThemePreset) {
  return preset === "ember" || preset === "midnight" || preset === "graphite";
}

export function isDarkTheme(theme: Theme) {
  return theme.accent ? theme.mode === "dark" : isDarkPreset(theme.preset);
}
