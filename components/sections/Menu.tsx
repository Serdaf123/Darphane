import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/SiteImage";
import type { Section } from "@/lib/schema";

type MenuData = Extract<Section, { type: "menu" }>;

/**
 * Menü / fiyat listesi. list: klasik satırlar; photos: görseli olan ürünler kart,
 * olmayanlar satır olarak aynı grup içinde.
 */
export function Menu({ section, id }: { section: MenuData; id: string }) {
  const photos = section.layout === "photos";
  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}
        </Reveal>

        <Stagger step={0.12} className={`mt-2 grid gap-10 ${photos ? "" : "md:grid-cols-2"}`}>
          {section.groups.map((group) => {
            const withImage = photos ? group.items.filter((i) => i.image) : [];
            const rows = photos ? group.items.filter((i) => !i.image) : group.items;
            return (
              <Item key={group.name}>
                <h3
                  className="pb-3 text-xl font-semibold"
                  style={{ borderBottom: "1px solid var(--c-border)" }}
                >
                  {group.name}
                </h3>

                {withImage.length > 0 ? (
                  <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" style={{ listStyle: "none", padding: 0, margin: "1rem 0 0" }}>
                    {withImage.map((item) => (
                      <li key={item.name} className="flex flex-col gap-2">
                        <div className="relative aspect-4/3 overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                          <SiteImage image={item.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="font-medium">{item.name}</p>
                          {item.price ? <p className="shrink-0 font-semibold tabular-nums">{item.price}</p> : null}
                        </div>
                        {item.description ? <p className="muted -mt-1 text-sm leading-snug">{item.description}</p> : null}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {rows.length > 0 ? (
                  <ul className="flex flex-col" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {rows.map((item) => (
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
                ) : null}
              </Item>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
