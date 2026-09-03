import type { Business, Section, SiteAction } from "./schema";
import { actionHref, sectionId } from "./actions";

/**
 * Header menüsü JSON'dan değil bölümlerden türer: site kurarken ayrıca
 * menü yazmak gerekmez. En fazla 4 madde, sayfa sırasına göre.
 */

const NAV_LABELS: Partial<Record<Section["type"], string>> = {
  about: "Hakkında",
  services: "Hizmetler",
  menu: "Menü",
  gallery: "Galeri",
  reviews: "Yorumlar",
  hours: "Saatler",
  location: "Konum",
  contact: "İletişim",
  faq: "SSS",
};

/** Menüde en çok işe yarayanlar önce; sonra sayfa sırasına dizilir. */
const PRIORITY: Section["type"][] = [
  "menu",
  "services",
  "gallery",
  "reviews",
  "contact",
  "location",
  "about",
  "hours",
  "faq",
];

export type NavItem = { label: string; href: string };

export function navItems(sections: Section[], max = 4): NavItem[] {
  const candidates = sections
    .map((section, index) => ({ section, index }))
    .filter(({ section }) => section.type !== "hero" && section.type !== "cta")
    .filter(({ section }) => !section.hideFromNav)
    .filter(({ section }) => section.navLabel || NAV_LABELS[section.type]);

  const chosen = [...candidates]
    .sort((a, b) => PRIORITY.indexOf(a.section.type) - PRIORITY.indexOf(b.section.type))
    .slice(0, max)
    .sort((a, b) => a.index - b.index);

  return chosen.map(({ section, index }) => ({
    label: section.navLabel ?? NAV_LABELS[section.type]!,
    href: `#${sectionId(section, index)}`,
  }));
}

export type NavCta = { label: string; href: string; external: boolean };

/** Header'daki tek buton: hero'nun ilk çalışan eylemi; yoksa WhatsApp ya da telefon. */
export function navCta(sections: Section[], business: Business): NavCta | undefined {
  const hero = sections.find((s) => s.type === "hero");
  const actions: SiteAction[] = hero?.type === "hero" ? hero.actions : [];

  const fallback: SiteAction[] = [
    { label: "WhatsApp", kind: "whatsapp", style: "primary" },
    { label: "Ara", kind: "call", style: "primary" },
  ];

  for (const action of [...actions, ...fallback]) {
    if (action.kind === "scroll") continue;
    const href = actionHref(action, business);
    if (href) {
      return {
        label: action.label,
        href,
        external: action.kind !== "call" && action.kind !== "email",
      };
    }
  }
  return undefined;
}
