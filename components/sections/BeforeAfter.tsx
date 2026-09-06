import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import type { Locale } from "@/lib/i18n";
import type { Section } from "@/lib/schema";
import { CompareSlider } from "./CompareSlider";

type BeforeAfterData = Extract<Section, { type: "beforeAfter" }>;

/** Önce/sonra çiftleri; her biri kaydırmalı karşılaştırma. */
export function BeforeAfter({ section, id, locale = "tr" }: { section: BeforeAfterData; id: string; locale?: Locale }) {
  const labels = locale === "tr" ? { before: "Önce", after: "Sonra", aria: "Önce/sonra karşılaştırma kaydırıcısı" } : { before: "Before", after: "After", aria: "Before/after comparison slider" };
  return (
    <section id={id} className="section section-surface">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}
        </Reveal>
        <Stagger className={`mt-2 grid gap-6 ${section.pairs.length > 1 ? "sm:grid-cols-2" : "max-w-3xl"}`}>
          {section.pairs.map((pair, i) => (
            <Item key={i} className="flex flex-col gap-2">
              <CompareSlider before={pair.before} after={pair.after} labels={labels} />
              {pair.label ? <p className="muted text-sm">{pair.label}</p> : null}
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
