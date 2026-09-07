import { ActionButtons } from "@/components/ActionButtons";
import { Reveal } from "@/components/motion/Reveal";
import type { Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";

type CtaData = Extract<Section, { type: "cta" }>;

export function Cta({
  section,
  business,
  id,
  locale = "tr",
}: {
  section: CtaData;
  business: Business;
  id: string;
  locale?: Locale;
}) {
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
