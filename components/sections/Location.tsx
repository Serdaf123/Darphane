import { Reveal } from "@/components/motion/Reveal";
import { directionsUrl, mapEmbedUrl, normalizePhone } from "@/lib/actions";
import { t, type Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";

type LocationData = Extract<Section, { type: "location" }>;

export function Location({
  section,
  business,
  id,
  locale = "tr",
}: {
  section: LocationData;
  business: Business;
  id: string;
  locale?: Locale;
}) {
  const address = [business.address, business.district, business.city]
    .filter(Boolean)
    .join(", ");
  const directions = directionsUrl(business);
  const embed = section.showMap ? mapEmbedUrl(business) : undefined;

  if (!address && !embed) return null;

  return (
    <section id={id} className="section">
      <div className="container grid gap-8 md:grid-cols-2 md:items-center">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title section-title-sm">{section.title}</h2>
          {address ? <p className="text-lg" style={{ color: "var(--c-text)" }}>{address}</p> : null}
          {section.note ? <p className="muted text-sm leading-relaxed">{section.note}</p> : null}

          <div className="flex flex-wrap gap-3">
            {directions ? (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {t(locale).location.directions}
              </a>
            ) : null}
            {business.phone ? (
              <a href={`tel:${normalizePhone(business.phone)}`} className="btn btn-ghost">
                {business.phone}
              </a>
            ) : null}
          </div>
        </Reveal>

        {embed ? (
          <Reveal
            delay={0.15}
            className="overflow-hidden"
            style={{ borderRadius: "var(--radius)", border: "1px solid var(--c-border)" }}
          >
            <iframe
              src={embed}
              title={`${business.name} konumu`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full md:h-80"
              style={{ border: 0 }}
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
