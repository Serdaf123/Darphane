import type { Section } from "@/lib/schema";

type FaqData = Extract<Section, { type: "faq" }>;

/** details/summary: JavaScript'siz açılır-kapanır, erişilebilir. */
export function Faq({ section, id }: { section: FaqData; id: string }) {
  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <h2 className="section-title">{section.title}</h2>
        <div className="max-w-3xl">
          {section.items.map((item, index) => (
            <details
              key={index}
              style={{ borderBottom: "1px solid var(--c-border)", padding: "0.25rem 0" }}
            >
              <summary
                className="cursor-pointer py-4 font-medium"
                style={{ listStyle: "revert" }}
              >
                {item.q}
              </summary>
              <p className="muted pb-4 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
