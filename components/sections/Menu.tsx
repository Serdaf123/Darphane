import type { Section } from "@/lib/schema";

type MenuData = Extract<Section, { type: "menu" }>;

export function Menu({ section, id }: { section: MenuData; id: string }) {
  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <h2 className="section-title">{section.title}</h2>
        {section.intro ? <p className="section-intro">{section.intro}</p> : null}

        <div className="mt-2 grid gap-10 md:grid-cols-2">
          {section.groups.map((group) => (
            <div key={group.name}>
              <h3
                className="pb-3 text-sm font-semibold uppercase"
                style={{
                  letterSpacing: "0.12em",
                  color: "var(--c-accent)",
                  borderBottom: "1px solid var(--c-border)",
                }}
              >
                {group.name}
              </h3>
              <ul className="flex flex-col" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {group.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-4 py-3"
                    style={{ borderBottom: "1px dashed var(--c-border)" }}
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.description ? (
                        <p className="muted mt-0.5 text-sm leading-snug">{item.description}</p>
                      ) : null}
                    </div>
                    {item.price ? (
                      <p className="shrink-0 font-semibold tabular-nums">{item.price}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
