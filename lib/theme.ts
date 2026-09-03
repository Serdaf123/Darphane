import type { CSSProperties } from "react";
import type { Theme, ThemePreset } from "./schema";

/**
 * Sabit şablonlar yerine tema tokenları: aynı bölüm kütüphanesi
 * JSON'daki birkaç satır değişince tamamen farklı bir site gibi görünür.
 */

type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  /** Hero görselinin üstüne binen katman */
  overlay: string;
};

export const PALETTES: Record<ThemePreset, Palette> = {
  // Nötr, editoryal. Klinik, estetik, kurumsal.
  porcelain: {
    bg: "#ffffff",
    surface: "#f7f7f5",
    surfaceAlt: "#efefec",
    text: "#17171b",
    muted: "#6c6c78",
    border: "#e4e4de",
    accent: "#17171b",
    accentText: "#ffffff",
    accentSoft: "#e9e9e4",
    overlay: "linear-gradient(180deg, rgba(0,0,0,.15) 0%, rgba(0,0,0,.62) 100%)",
  },
  // Sıcak, koyu, iştah açıcı. Restoran, ocakbaşı, kahve.
  ember: {
    bg: "#12100e",
    surface: "#1c1916",
    surfaceAlt: "#262119",
    text: "#f6f1e8",
    muted: "#a89e90",
    border: "#332c23",
    accent: "#d4763a",
    accentText: "#14110e",
    accentSoft: "#2a2118",
    overlay: "linear-gradient(180deg, rgba(18,16,14,.25) 0%, rgba(18,16,14,.85) 100%)",
  },
  // Yumuşak, sakin. Spa, güzellik, organik.
  sage: {
    bg: "#fbfaf6",
    surface: "#f0f2ea",
    surfaceAlt: "#e4e8dc",
    text: "#1f2a20",
    muted: "#5f6b5f",
    border: "#d9dfd0",
    accent: "#4a6b4f",
    accentText: "#ffffff",
    accentSoft: "#e2e9dd",
    overlay: "linear-gradient(180deg, rgba(20,30,22,.12) 0%, rgba(20,30,22,.6) 100%)",
  },
  // Koyu lacivert + altın. Fine dining, berber, tattoo.
  midnight: {
    bg: "#0d1117",
    surface: "#151b24",
    surfaceAlt: "#1d2530",
    text: "#eef2f7",
    muted: "#94a0b0",
    border: "#242e3b",
    accent: "#c9a227",
    accentText: "#0d1117",
    accentSoft: "#1c2431",
    overlay: "linear-gradient(180deg, rgba(13,17,23,.3) 0%, rgba(13,17,23,.88) 100%)",
  },
  // Temiz, güven veren mavi. Diş hekimi, sağlık, teknik servis.
  cobalt: {
    bg: "#ffffff",
    surface: "#f2f6fc",
    surfaceAlt: "#e6eefa",
    text: "#111a2b",
    muted: "#5a667d",
    border: "#d8e4f5",
    accent: "#1d4ed8",
    accentText: "#ffffff",
    accentSoft: "#e3ecfd",
    overlay: "linear-gradient(180deg, rgba(10,20,40,.2) 0%, rgba(10,20,40,.68) 100%)",
  },
  // Sıcak açık bej. Fırın, kahve, butik otel.
  sand: {
    bg: "#fdfbf7",
    surface: "#f5efe4",
    surfaceAlt: "#ece3d3",
    text: "#241c12",
    muted: "#6f6252",
    border: "#e3d8c5",
    accent: "#a8642a",
    accentText: "#ffffff",
    accentSoft: "#f0e6d6",
    overlay: "linear-gradient(180deg, rgba(36,28,18,.15) 0%, rgba(36,28,18,.66) 100%)",
  },
};

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
export function themeStyle(theme: Theme): CSSProperties {
  const palette = PALETTES[theme.preset];
  const density = DENSITY[theme.density];

  return {
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

/** Koyu temalarda tarayıcı arayüzü de koyu olmalı. */
export function isDarkPreset(preset: ThemePreset) {
  return preset === "ember" || preset === "midnight";
}
