import { directionsUrl, normalizePhone, whatsappUrl } from "@/lib/actions";
import { t, type Locale } from "@/lib/i18n";
import type { Business } from "@/lib/schema";

/**
 * Dönüşümün belkemiği: esnaf siteyi WhatsApp'tan, telefonundan açacak.
 * Ara / Yol Tarifi / WhatsApp her zaman parmağının altında olmalı.
 */

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20.5l1.8-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 9c0 3 2.2 5.2 5.2 5.2" />
    </svg>
  );
}

export function StickyMobileBar({ business, locale = "tr" }: { business: Business; locale?: Locale }) {
  const s = t(locale);
  const items = [
    business.phone && {
      href: `tel:${normalizePhone(business.phone)}`,
      label: s.bar.call,
      icon: <PhoneIcon />,
      external: false,
    },
    directionsUrl(business) && {
      href: directionsUrl(business)!,
      label: s.bar.directions,
      icon: <PinIcon />,
      external: true,
    },
    (business.whatsapp ?? business.phone) && {
      href: whatsappUrl(
        (business.whatsapp ?? business.phone)!,
        s.whatsappDefault(business.name)
      ),
      label: s.bar.whatsapp,
      icon: <WhatsappIcon />,
      external: true,
    },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; external: boolean }[];

  if (items.length === 0) return null;

  return (
    <>
      {/* Sayfanın son bölümü barın arkasında kalmasın */}
      <div aria-hidden style={{ height: "4.75rem" }} className="md:hidden" />

      <nav
        aria-label={s.bar.aria}
        className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        style={{
          background: "var(--c-bg)",
          borderTop: "1px solid var(--c-border)",
          paddingBottom: "env(safe-area-inset-bottom)",
          boxShadow: "0 -8px 24px rgba(0,0,0,.08)",
        }}
      >
        <ul
          className="m-0 grid list-none p-0"
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex flex-col items-center justify-center gap-1 py-3 text-xs font-semibold"
                style={{ color: "var(--c-text)", textDecoration: "none", minHeight: "3.5rem" }}
              >
                <span style={{ color: "var(--c-accent)" }}>{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
