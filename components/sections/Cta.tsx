import { ActionButtons } from "@/components/ActionButtons";
import { Reveal } from "@/components/motion/Reveal";
import type { Business, Section } from "@/lib/schema";

type CtaData = Extract<Section, { type: "cta" }>;

export function Cta({
  section,
  business,
  id,
}: {
  section: CtaData;
  business: Business;
  id: string;
}) {
  return (
    <section id={id} className="section">
      <div className="container">
        <Reveal
          className="flex flex-col items-start gap-[var(--stack-gap)] p-8 md:items-center md:p-14 md:text-center"
          style={{
            background: "var(--c-accent-soft)",
            border: "1px solid var(--c-border)",
            borderRadius: "var(--radius)",
          }}
        >
          <h2 className="section-title">{section.headline}</h2>
          {section.subline ? <p className="section-intro">{section.subline}</p> : null}
          <ActionButtons
            actions={section.actions}
            business={business}
            className="md:justify-center"
          />
        </Reveal>
      </div>
    </section>
  );
}
