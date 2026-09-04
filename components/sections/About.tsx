import { Reveal } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/SiteImage";
import type { Section } from "@/lib/schema";

type AboutData = Extract<Section, { type: "about" }>;

export function About({ section, id }: { section: AboutData; id: string }) {
  const hasImage = Boolean(section.image);

  return (
    <section id={id} className="section">
      <div
        className={`container grid gap-10 ${hasImage ? "md:grid-cols-2 md:items-center" : ""}`}
      >
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.body.split("\n\n").map((paragraph, index) => (
            <p key={index} className="section-intro">
              {paragraph}
            </p>
          ))}

          {section.highlights.length > 0 ? (
            <dl className="mt-2 grid grid-cols-2 gap-6 sm:grid-cols-3">
              {section.highlights.map((highlight) => (
                <div key={highlight.label}>
                  <dt className="muted text-sm">{highlight.label}</dt>
                  <dd
                    className="mt-1 text-2xl font-semibold"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {highlight.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Reveal>

        {hasImage ? (
          <Reveal
            delay={0.15}
            className="about-photo relative aspect-4/3 overflow-hidden"
            style={{ borderRadius: "var(--radius)" }}
          >
            <SiteImage
              image={section.image}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full"
            />
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
