import {
  Bricolage_Grotesque,
  Cormorant_Garamond,
  DM_Sans,
  EB_Garamond,
  Figtree,
  Fraunces,
  IBM_Plex_Sans,
  IBM_Plex_Serif,
  Inter,
  Noto_Sans,
  Noto_Serif,
  Manrope,
  Playfair_Display,
  Source_Serif_4,
  Space_Grotesk,
} from "next/font/google";

/**
 * Font çiftleri. Tipografi sayfanın kişiliğidir; aynı bölümler farklı
 * çiftle bambaşka bir işletmeye ait görünür.
 *
 * Hepsi preload:false — yalnızca sitenin seçtiği çift indirilir, diğerleri
 * sadece @font-face tanımı olarak durur. latin-ext Türkçe için şart.
 */


const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--f-inter", display: "swap", preload: false });
const playfair = Playfair_Display({ subsets: ["latin", "latin-ext"], variable: "--f-playfair", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--f-manrope", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--f-cormorant",
  display: "swap",
  preload: false,
});
const figtree = Figtree({ subsets: ["latin", "latin-ext"], variable: "--f-figtree", display: "swap", preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--f-bricolage", display: "swap", preload: false });
const sourceSerif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--f-sourceserif", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin", "latin-ext"], variable: "--f-fraunces", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin", "latin-ext"], variable: "--f-dmsans", display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--f-spacegrotesk", display: "swap", preload: false });
const ebGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--f-ebgaramond",
  display: "swap",
  preload: false,
});
const plexSerif = IBM_Plex_Serif({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--f-plexserif",
  display: "swap",
  preload: false,
});
const notoSans = Noto_Sans({ subsets: ["latin", "latin-ext"], variable: "--f-notosans", display: "swap", preload: false });
const notoSerif = Noto_Serif({ subsets: ["latin", "latin-ext"], variable: "--f-notoserif", display: "swap", preload: false });
const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--f-plexsans",
  display: "swap",
  preload: false,
});

export const FONT_PAIRINGS = {
  /** Nötr, tanıdık. Eski siteler için geriye uyumluluk. */
  classic: { className: `${inter.variable} ${playfair.variable}`, sans: "var(--f-inter)", display: "var(--f-playfair)", note: "Inter + Playfair Display" },
  /** Otel, restoran, konaklama: zarif, geniş nefesli serif. */
  hospitality: { className: `${manrope.variable} ${cormorant.variable}`, sans: "var(--f-manrope)", display: "var(--f-cormorant)", note: "Manrope + Cormorant Garamond" },
  /** Klinik, teknik servis, muhasebe: tek aile, temiz, güven veren. */
  clean: { className: figtree.variable, sans: "var(--f-figtree)", display: "var(--f-figtree)", note: "Figtree" },
  /** Ocakbaşı, kasap, zanaat: karakterli grotesk + okunaklı serif gövde. */
  craft: { className: `${sourceSerif.variable} ${bricolage.variable}`, sans: "var(--f-sourceserif)", display: "var(--f-bricolage)", note: "Bricolage Grotesque + Source Serif 4" },
  /** Fırın, kafe, spa, çiçekçi: yumuşak, sıcak serif. */
  soft: { className: `${dmSans.variable} ${fraunces.variable}`, sans: "var(--f-dmsans)", display: "var(--f-fraunces)", note: "DM Sans + Fraunces" },
  /** Berber, dövme, oto servis, spor salonu: sert, teknik. */
  bold: { className: spaceGrotesk.variable, sans: "var(--f-spacegrotesk)", display: "var(--f-spacegrotesk)", note: "Space Grotesk" },
  /** Avukat, muhasebe, mimar, danışman: antetli kâğıt — Garamond başlık, Plex gövde. */
  editorial: { className: `${ebGaramond.variable} ${plexSans.variable}`, sans: "var(--f-plexsans)", display: "var(--f-ebgaramond)", note: "EB Garamond + IBM Plex Sans" },
  /** Süper aile: aynı iskeletten serif + sans. Gazete/editoryal, muhasebe, danışmanlık (Pitta & Baione dünyası). */
  plex: { className: `${plexSerif.variable} ${plexSans.variable}`, sans: "var(--f-plexsans)", display: "var(--f-plexserif)", note: "IBM Plex Serif + IBM Plex Sans" },
  /** En geniş Türkçe ve çok dilli kapsama; ı/İ/ş/ğ sorunsuz. Güvenli, nötr. */
  noto: { className: `${notoSerif.variable} ${notoSans.variable}`, sans: "var(--f-notosans)", display: "var(--f-notoserif)", note: "Noto Serif + Noto Sans" },
} as const;

export type FontPairing = keyof typeof FONT_PAIRINGS;
export const FONT_PAIRING_KEYS = Object.keys(FONT_PAIRINGS) as FontPairing[];
