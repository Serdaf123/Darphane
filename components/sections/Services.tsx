import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import type { Section } from "@/lib/schema";

type ServicesData = Extract<Section, { type: "services" }>;

export function Services({ section, id }: { section: ServicesData; id: string }) {
  return (
    <section id={id} className={`section ${section.tone === "dark" ? "section-dark" : "section-surface"}`}>
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}
        </Reveal>

        {section.layout === "list" ? (
          <Stagger as="ul" className="mt-2 flex flex-col" style={{ listStyle: "none", padding: 0 }}>
            {section.items.map((item) => (
              <Item
                as="li"
                key={item.name}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-4"
                style={{ borderBottom: "1px solid var(--c-border)" }}
              >
                <div className="flex-1" style={{ minWidth: "14rem" }}>
                  <p className="font-semibold">{item.name}</p>
                  {item.description ? (
                    <p className="muted mt-1 max-w-[38rem] text-sm leading-relaxed">{item.description}</p>
                  ) : null}
                </div>
                {item.price ? (
                  <p className="font-semibold" style={{ color: "var(--c-accent)" }}>
                    {item.price}
                  </p>
                ) : null}
              </Item>
            ))}
          </Stagger>
        ) : section.layout === "grid" ? (
          <Stagger className="mt-2 grid gap-x-12 gap-y-7 sm:grid-cols-2">
            {section.items.map((item) => (
              <Item key={item.name} className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                {item.description ? (
                  <p className="muted leading-relaxed">{item.description}</p>
                ) : null}
                {item.price ? (
                  <p className="font-semibold" style={{ color: "var(--c-accent)" }}>
                    {item.price}
                  </p>
                ) : null}
              </Item>
            ))}
          </Stagger>
        ) : (
          <Stagger className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <Item key={item.name} className="card flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                {item.description ? (
                  <p className="muted text-sm leading-relaxed">{item.description}</p>
                ) : null}
                {item.price ? (
                  <p className="mt-auto pt-2 font-semibold" style={{ color: "var(--c-accent)" }}>
                    {item.price}
                  </p>
                ) : null}
              </Item>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
