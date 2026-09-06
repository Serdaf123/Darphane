import type { Business, Section, SiteAction } from "./schema";
import { actionHref, sectionId } from "./actions";
import { t, type Locale } from "./i18n";

/**
 * Header menüsü JSON'dan değil bölümlerden türer: site kurarken ayrıca
 * menü yazmak gerekmez. En fazla 4 madde, sayfa sırasına göre.
 */

const NAV_TYPES = new Set<Section["type"]>([
  "about",
  "services",
  "menu",
  "gallery",
  "reviews",
  "hours",
  "location",
  "contact",
  "faq",
  "pricing",
  "team",
  "beforeAfter",
]);

/** Menüde en çok işe yarayanlar önce; sonra sayfa sırasına dizilir. */
const PRIORITY: Section["type"][] = [
  "menu",
  "services",
  "pricing",
  "beforeAfter",
  "gallery",
  "reviews",
  "contact",
  "location",
  "about",
  "hours",
  "team",
  "faq",
];

export type NavItem = { label: string; href: string };

export function navItems(sections: Section[], locale: Locale = "tr", max = 4): NavItem[] {
  const labels = t(locale).nav as Record<string, string>;
  const candidates = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type !== "hero" && section.type !== "cta")
    .filter(({ section }) => !section.hideFromNav)
    .filter(({ section }) => section.navLabel || NAV_TYPES.has(section.type));

  const chosen = [...candidates]
    .sort((a, b) => PRIORITY.indexOf(a.section.type) - PRIORITY.indexOf(b.section.type))
    .slice(0, max)
    .sort((a, b) => a.index - b.index);

  return chosen.map(({ section, index }) => ({
    label: section.navLabel ?? labels[section.type],
    href: `#${sectionId(section, index)}`,
  }));
}

export type NavCta = { label: string; shortLabel: string; href: string; external: boolean };



/** Header'daki tek buton: hero'nun ilk çalışan eylemi; yoksa WhatsApp ya da telefon. */
export function navCta(
  sections: Section[],
  business: Business,
  locale: Locale = "tr"
): NavCta | undefined {
  // Mobil header dar: uzun buton metni yerine eylemin kısa adı
  const short = t(locale).cta as Record<string, string>;
  const hero = sections.find((s) => s.type === "hero");
  const actions: SiteAction[] = hero?.type === "hero" ? hero.actions : [];

  const fallback: SiteAction[] = [
    { label: "WhatsApp", kind: "whatsapp", style: "primary" },
    { label: "Ara", kind: "call", style: "primary" },
  ];

  for (const action of [...actions, ...fallback]) {
    if (action.kind === "scroll") continue;
    const href = actionHref(action, business, locale);
    if (href) {
      return {
        label: action.label,
        shortLabel: short[action.kind] ?? action.label,
        href,
        external: action.kind !== "call" && action.kind !== "email",
      };
    }
  }
  return undefined;
}
