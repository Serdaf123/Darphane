import { instagramUrl, normalizePhone } from "@/lib/actions";
import { t, type Locale } from "@/lib/i18n";
import type { Business } from "@/lib/schema";

export function SiteFooter({ business, locale = "tr" }: { business: Business; locale?: Locale }) {
  const address = [business.address, business.district, business.city]
    .filter(Boolean)
    .join(", ");

  return (
    <footer className="section-surface" style={{ borderTop: "1px solid var(--c-border)" }}>
      <div className="container flex flex-col gap-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="font-semibold" style={{ fontFamily: "var(--font-heading)" }}>
              {business.name}
            </p>
            {address ? <p className="muted mt-1 text-sm">{address}</p> : null}
          </div>

          <div className="flex flex-col gap-1 text-sm">
            {business.phone ? (
              <a href={`tel:${normalizePhone(business.phone)}`} style={{ color: "inherit" }}>
                {business.phone}
              </a>
            ) : null}
            {business.email ? (
              <a href={`mailto:${business.email}`} style={{ color: "inherit" }}>
                {business.email}
              </a>
            ) : null}
            {business.social.instagram ? (
              <a
                href={instagramUrl(business.social.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>

        <p className="muted text-xs">
          © {new Date().getFullYear()} {business.name} · {t(locale).footer.madeBy}
        </p>
      </div>
    </footer>
  );
}
