import { directionsUrl, mapEmbedUrl, normalizePhone, whatsappUrl } from "@/lib/actions";
import { getOpenState, hoursTable, type OpenState } from "@/lib/hours";
import type { Hours, Site, SiteImage } from "@/lib/schema";

/**
 * Konsept bileşenlerinin tek girdisi. Her konsept aynı olgulardan kendi dünyasını kurar;
 * JSON'daki bölüm yapısını bilmek zorunda değildir. Sunucuda hesaplanır (hook yok).
 */
export type Facts = {
  slug: string;
  name: string;
  category: string;
  tagline?: string;
  phone?: string;
  telHref?: string;
  whatsappHref?: string;
  whatsappMessage?: string;
  directionsHref?: string;
  mapEmbedSrc?: string;
  address?: string;
  district?: string;
  city?: string;
  coords?: { lat: number; lng: number };
  hours?: Hours;
  hoursRows?: ReturnType<typeof hoursTable>;
  open?: OpenState;
  rating?: { value: number; count: number; source: string };
  headline: string;
  subline?: string;
  badges: string[];
  heroImage?: SiteImage;
  images: SiteImage[];
  urgent?: { title: string; note?: string; whatsappMessage?: string };
  about?: { title: string; body: string; highlights: { label: string; value: string }[] };
  services: { name: string; description?: string }[];
  servicesIntro?: string;
  reviews: { author: string; rating: number; text: string }[];
  faq: { q: string; a: string }[];
  team: { name: string; role?: string; bio?: string; image?: SiteImage }[];
  cta?: { headline: string; subline?: string };
  footerNote?: string;
};

export function siteFacts(site: Site, now: Date = new Date()): Facts {
  const b = site.business;
  const hero = site.sections.find((s) => s.type === "hero");
  const about = site.sections.find((s) => s.type === "about");
  const services = site.sections.find((s) => s.type === "services");
  const gallery = site.sections.find((s) => s.type === "gallery");
  const reviews = site.sections.find((s) => s.type === "reviews");
  const faq = site.sections.find((s) => s.type === "faq");
  const team = site.sections.find((s) => s.type === "team");
  const cta = site.sections.find((s) => s.type === "cta");
  const waMessage = hero?.actions.find((a) => a.kind === "whatsapp")?.value;
  const wa = b.whatsapp ? whatsappUrl(b.whatsapp, waMessage ?? `Merhaba, ${b.name} için yazıyorum.`) : undefined;
  const address = [b.address, b.district, b.city].filter(Boolean).join(", ");
  const images: SiteImage[] = [];
  if (hero?.image) images.push(hero.image);
  if (gallery) images.push(...gallery.images);
  const seen = new Set<string>();
  const unique = images.filter((i) => (seen.has(i.src) ? false : (seen.add(i.src), true)));
  return {
    slug: site.slug,
    name: b.name,
    category: b.category,
    tagline: b.tagline,
    phone: b.phone,
    telHref: b.phone ? `tel:${normalizePhone(b.phone)}` : undefined,
    whatsappHref: wa,
    whatsappMessage: waMessage,
    directionsHref: directionsUrl(b),
    mapEmbedSrc: mapEmbedUrl(b),
    address: address || undefined,
    district: b.district,
    city: b.city,
    coords: b.coords,
    hours: b.hours,
    hoursRows: b.hours ? hoursTable(b.hours, now) : undefined,
    open: b.hours ? getOpenState(b.hours, now) : undefined,
    rating: reviews?.summary ? { value: reviews.summary.rating, count: reviews.summary.count, source: reviews.summary.source } : undefined,
    headline: hero?.headline ?? b.name,
    subline: hero?.subline ?? b.tagline,
    badges: hero?.badges ?? [],
    heroImage: hero?.image ?? unique[0],
    images: unique,
    urgent: hero?.urgent ? { title: hero.urgent.title, note: hero.urgent.note, whatsappMessage: hero.urgent.whatsappMessage } : undefined,
    about: about ? { title: about.title, body: about.body, highlights: about.highlights ?? [] } : undefined,
    services: services?.items.map((i) => ({ name: i.name, description: i.description })) ?? [],
    servicesIntro: services?.intro,
    reviews: reviews?.items.map((r) => ({ author: r.author, rating: r.rating, text: r.text })) ?? [],
    faq: faq?.items.map((i) => ({ q: i.q, a: i.a })) ?? [],
    team: team?.members.map((m) => ({ name: m.name, role: m.role, bio: m.bio, image: m.image })) ?? [],
    cta: cta ? { headline: cta.headline, subline: cta.subline } : undefined,
    footerNote: b.footerNote,
  };
}
