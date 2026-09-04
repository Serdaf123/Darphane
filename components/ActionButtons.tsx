import { actionHref } from "@/lib/actions";
import type { Locale } from "@/lib/i18n";
import type { Business, SiteAction } from "@/lib/schema";

/** Gerekli bilgisi olmayan eylem (ör. telefon yok) hiç çizilmez. */
export function ActionButtons({
  actions,
  business,
  className = "",
  locale = "tr",
  mobileLimit,
}: {
  actions: SiteAction[];
  business: Business;
  className?: string;
  locale?: Locale;
  /** Telefonda ilk N buton görünür; gerisi sm ve üstünde. Alt bar zaten Ara/Yol Tarifi/WhatsApp taşıyor. */
  mobileLimit?: number;
}) {
  const resolved = actions
    .map((action) => ({ action, href: actionHref(action, business, locale) }))
    .filter((entry): entry is { action: SiteAction; href: string } => Boolean(entry.href));

  if (resolved.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {resolved.map(({ action, href }, index) => (
        <a
          key={`${action.kind}-${index}`}
          href={href}
          className={`btn btn-${action.style}${
            mobileLimit !== undefined && index >= mobileLimit ? " btn-desktop-only" : ""
          }`}
          {...(action.kind === "link" || action.kind === "whatsapp" || action.kind === "directions" || action.kind === "instagram"
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {action.label}
        </a>
      ))}
    </div>
  );
}
