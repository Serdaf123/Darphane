import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import type { Section } from "@/lib/schema";

type ReviewsData = Extract<Section, { type: "reviews" }>;

function Stars({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <span aria-label={`${rating} / 5 puan`} style={{ color: "var(--c-accent)", letterSpacing: "0.1em" }}>
      {"★".repeat(rounded)}
      <span className="muted">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}

export function Reviews({ section, id }: { section: ReviewsData; id: string }) {
  return (
    <section id={id} className="section section-surface">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">{section.title}</h2>
          {section.summary ? (
            <p className="pill">
              <Stars rating={section.summary.rating} />
              <strong>{section.summary.rating.toFixed(1)}</strong>
              <span>
                · {section.summary.count} değerlendirme · {section.summary.source}
              </span>
            </p>
          ) : null}
        </Reveal>

        <Stagger className="grid gap-4 md:grid-cols-3">
          {section.items.map((review, index) => (
            <Item as="figure" key={index} className="card m-0 flex flex-col gap-3">
              <Stars rating={review.rating} />
              <blockquote className="m-0 leading-relaxed">“{review.text}”</blockquote>
              <figcaption className="muted mt-auto text-sm">
                {review.author}
                {review.source ? ` · ${review.source}` : ""}
              </figcaption>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
