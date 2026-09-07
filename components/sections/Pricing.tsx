import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import { actionHref } from "@/lib/actions";
import type { Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";

type PricingData = Extract<Section, { type: "pricing" }>;

/** Fiyat tablosu. Bir plan öne çıkarılabilir; her planın kendi eylemi olabilir (WhatsApp/ara). */
export function Pricing({ section, business, id, locale = "tr" }: { section: PricingData; business: Business; id: string; locale?: Locale }) {
  const cols = section.plans.length;
  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}
        </Reveal>

        <Stagger className={`mt-2 grid gap-4 ${cols >= 3 ? "lg:grid-cols-3" : ""} ${cols === 2 || cols === 4 ? "sm:grid-cols-2" : ""} ${cols === 4 ? "lg:grid-cols-4" : ""}`}>
          {section.plans.map((plan) => {
            const href = plan.action ? actionHref(plan.action, business, locale) : undefined;
            return (
              <Item
                key={plan.name}
                className={`card flex flex-col gap-3${plan.featured ? " pricing-featured" : ""}`}
                style={plan.featured ? { borderColor: "var(--c-accent)", borderWidth: 2 } : undefined}
              >
                <div>
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.description ? <p className="muted mt-1 text-sm leading-relaxed">{plan.description}</p> : null}
                </div>
                <p className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold tabular-nums" style={{ letterSpacing: "-0.02em" }}>
                    {plan.price}
                  </span>
                  {plan.period ? <span className="muted text-sm">{plan.period}</span> : null}
                </p>
                {plan.features.length > 0 ? (
                  <ul className="flex flex-col gap-1.5 text-sm" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {plan.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: "0.2rem" }}>
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {href && plan.action ? (
                  <a
                    href={href}
                    className={`btn mt-auto ${plan.featured ? "btn-primary" : "btn-secondary"}`}
                    target={plan.action.kind === "call" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    {plan.action.label}
                  </a>
                ) : null}
              </Item>
            );
          })}
        </Stagger>
        {section.note ? <p className="muted text-sm">{section.note}</p> : null}
      </div>
    </section>
  );
}
