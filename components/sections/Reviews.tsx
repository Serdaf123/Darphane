import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import { t, type Locale } from "@/lib/i18n";
import type { Section } from "@/lib/schema";

type ReviewsData = Extract<Section, { type: "reviews" }>;

/** Beş çizili yıldız; dolu olanlar vurgu renginde, boşlar soluk. Glif değil ikon. */
function Stars({ rating, locale = "tr" }: { rating: number; locale?: Locale }) {
  const rounded = Math.round(rating);
  return (
    <span
      role="img"
      aria-label={t(locale).reviews.ratingAria(rating)}
      className="inline-flex items-center gap-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          aria-hidden
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ color: i < rounded ? "var(--c-accent)" : "var(--c-border)" }}
        >
          <path d="M12 2.6l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17.4l-6 3.3 1.3-6.6L2.4 9.5l6.7-.8L12 2.6z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews({
  section,
  id,
  locale = "tr",
}: {
  section: ReviewsData;
  id: string;
  locale?: Locale;
}) {
  return (
    <section id={id} className="section section-surface">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">{section.title}</h2>
          {section.summary ? (
            <p className="pill">
              <Stars rating={section.summary.rating} locale={locale} />
              <strong>{section.summary.rating.toFixed(1)}</strong>
              <span className="muted">
                {t(locale).reviews.summary(section.summary.count, section.summary.source)}
              </span>
            </p>
          ) : null}
        </Reveal>

        {section.layout === "marquee" ? (
          // Akan şerit: kartlar iki kez dizilir, ikinci kopya aria-hidden. Üzerine gelince durur,
          // "hareketi azalt" açıksa CSS'te animasyon kapanır ve yatay kaydırılır.
          <div
            className="marquee"
            style={
              {
                "--marquee-duration": `${Math.max(18, section.items.length * 9)}s`,
              } as React.CSSProperties
            }
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="marquee-track"
                aria-hidden={copy === 1 || undefined}
              >
                {section.items.map((review, index) => (
                  <figure
                    key={index}
                    className="card marquee-item m-0 flex flex-col gap-3"
                  >
                    <Stars rating={review.rating} locale={locale} />
                    <blockquote className="m-0 leading-relaxed">
                      “{review.text}”
                    </blockquote>
                    <figcaption className="muted mt-auto text-sm">
                      {review.author}
                      {review.source ? ` — ${review.source}` : ""}
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        ) : section.layout === "quotes" ? (
          // Kutusuz: az sayıda yorumda kartlar boş kalır, alıntı büyür ve nefes alır
          <Stagger step={0.12} className="grid gap-10 md:grid-cols-2">
            {section.items.map((review, index) => (
              <Item
                as="figure"
                key={index}
                className="m-0 flex max-w-2xl flex-col gap-4"
              >
                <blockquote
                  className="m-0"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "clamp(1.25rem, 1rem + 1vw, 1.75rem)",
                    lineHeight: 1.35,
                    textWrap: "pretty",
                  }}
                >
                  “{review.text}”
                </blockquote>
                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <Stars rating={review.rating} locale={locale} />
                  <span className="font-medium">{review.author}</span>
                  {review.source ? (
                    <span className="muted">{review.source}</span>
                  ) : null}
                </figcaption>
              </Item>
            ))}
          </Stagger>
        ) : (
          <Stagger className="grid gap-4 md:grid-cols-3">
            {section.items.map((review, index) => (
              <Item
                as="figure"
                key={index}
                className="card m-0 flex flex-col gap-3"
              >
                <Stars rating={review.rating} locale={locale} />
                <blockquote className="m-0 leading-relaxed">
                  “{review.text}”
                </blockquote>
                <figcaption className="muted mt-auto text-sm">
                  {review.author}
                  {review.source ? ` — ${review.source}` : ""}
                </figcaption>
              </Item>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
