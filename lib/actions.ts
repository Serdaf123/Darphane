import { t, type Locale } from "./i18n";
import type { Business, Section, SiteAction } from "./schema";

/** Tüm eylemler sunucusuz: telefon, WhatsApp, harita, çapa. Backend yok. */

export function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function whatsappUrl(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${query}`;
}

export function directionsUrl(business: Business): string | undefined {
  if (business.mapsUrl) return business.mapsUrl;
  const destination = business.coords
    ? `${business.coords.lat},${business.coords.lng}`
    : [business.address, business.district, business.city].filter(Boolean).join(", ");
  if (!destination) return undefined;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function instagramUrl(handle: string): string {
  if (handle.startsWith("http")) return handle;
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Bölüm çapası: JSON'da id verilmediyse tipten türetilir. */
export function sectionId(section: Section, index: number): string {
  return section.id ?? `${section.type}-${index}`;
}

/** Eylemi gerçek bir href'e çevirir. Gerekli bilgi yoksa undefined döner ve buton çizilmez. */
export function actionHref(
  action: SiteAction,
  business: Business,
  locale: Locale = "tr"
): string | undefined {
  switch (action.kind) {
    case "call":
      return business.phone ? `tel:${normalizePhone(business.phone)}` : undefined;

    case "whatsapp": {
      const number = business.whatsapp ?? business.phone;
      if (!number) return undefined;
      const message = action.value ?? t(locale).whatsappDefault(business.name);
      return whatsappUrl(number, message);
    }

    case "directions":
      return directionsUrl(business);

    case "instagram":
      return business.social.instagram ? instagramUrl(business.social.instagram) : undefined;

    case "email":
      return business.email ? `mailto:${business.email}` : undefined;

    case "scroll":
      return action.value ? `#${action.value}` : undefined;

    case "link":
      return action.value;
  }
}

/** Harita gömme: API anahtarı gerektirmeyen klasik embed. */
export function mapEmbedUrl(business: Business): string | undefined {
  const query = business.coords
    ? `${business.coords.lat},${business.coords.lng}`
    : [business.name, business.address, business.district, business.city]
        .filter(Boolean)
        .join(", ");
  if (!query) return undefined;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}
