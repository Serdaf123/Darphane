import { ActionButtons } from "@/components/ActionButtons";
import { Reveal } from "@/components/motion/Reveal";
import { OpenBadge } from "@/components/OpenBadge";
import type { Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";

type CtaData = Extract<Section, { type: "cta" }>;

export function Cta({
  section,
  business,
  id,
  locale = "tr",
  serverNow,
}: {
  section: CtaData;
  business: Business;
  id: string;
  locale?: Locale;
  serverNow?: number;
}) {
  if (section.layout === "tabela") {
    const address = [business.address, business.district, business.city].filter(Boolean).join(", ");
    return (
      <section id={id} className="section cta-tabela">
        <div className="container">
          <Reveal className="cta-tabela-inner">
            <div className="cta-tabela-sign" aria-hidden>
              <span className="cta-tabela-post" /><span className="cta-tabela-post right" />
              <p className="cta-tabela-name">{business.name}</p>
              <p className="cta-tabela-cat">{business.category}</p>
            </div>
            <h2 className="section-title section-title-sm cta-tabela-head">{section.headline}</h2>
            {section.subline ? <p className="section-intro">{section.subline}</p> : null}
            <div className="cta-tabela-row">
              {business.hours ? <div className="cta-tabela-door"><OpenBadge hours={business.hours} locale={locale} serverNow={serverNow} /></div> : null}
              <ActionButtons actions={section.actions} business={business} locale={locale} />
            </div>
            {address ? <p className="cta-tabela-plate">{address}</p> : null}
          </Reveal>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="section cta-band" style={{ background: "var(--c-accent-soft)" }}>
      <div className="container">
        <Reveal className="flex flex-col items-start gap-[var(--stack-gap)] md:items-center md:text-center">
          <h2 className="section-title">{section.headline}</h2>
          {section.subline ? <p className="section-intro">{section.subline}</p> : null}
          <ActionButtons
            actions={section.actions}
            business={business}
            className="md:justify-center"
            locale={locale}
          />
        </Reveal>
      </div>
    </section>
  );
}
