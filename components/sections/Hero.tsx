import { ActionButtons } from "@/components/ActionButtons";
import { OpenBadge } from "@/components/OpenBadge";
import { SiteImage } from "@/components/SiteImage";
import type { Business, Section } from "@/lib/schema";

type HeroData = Extract<Section, { type: "hero" }>;

export function Hero({
  section,
  business,
  id,
}: {
  section: HeroData;
  business: Business;
  id: string;
}) {
  const badges = (
    <>
      {business.hours ? <OpenBadge hours={business.hours} /> : null}
      {section.badges.map((badge) => (
        <span key={badge} className="pill">
          {badge}
        </span>
      ))}
    </>
  );

  if (section.variant === "minimal") {
    return (
      <section id={id} className="section section-surface">
        <div className="container flex flex-col gap-[var(--stack-gap)]">
          <p className="eyebrow">{business.category}</p>
          <h1 style={{ fontSize: "clamp(2.25rem, 1.5rem + 4vw, 4.5rem)" }}>
            {section.headline}
          </h1>
          {section.subline ? (
            <p className="section-intro text-lg">{section.subline}</p>
          ) : null}
          <div className="flex flex-wrap gap-2">{badges}</div>
          <ActionButtons actions={section.actions} business={business} className="mt-2" />
        </div>
      </section>
    );
  }

  if (section.variant === "split") {
    return (
      <section id={id} className="section">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-[var(--stack-gap)]">
            <p className="eyebrow">{business.category}</p>
            <h1 style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.5rem)" }}>
              {section.headline}
            </h1>
            {section.subline ? <p className="section-intro">{section.subline}</p> : null}
            <div className="flex flex-wrap gap-2">{badges}</div>
            <ActionButtons actions={section.actions} business={business} className="mt-1" />
          </div>
          <div
            className="relative aspect-4/3 overflow-hidden md:aspect-square"
            style={{ borderRadius: "var(--radius)" }}
          >
            <SiteImage
              image={section.image}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full"
            />
          </div>
        </div>
      </section>
    );
  }

  // variant: image — tam genişlik görsel, üstünde katman
  return (
    <section id={id} className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
      <SiteImage
        image={section.image}
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 h-full w-full"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--c-overlay)" }}
      />
      <div className="on-image container pb-14 pt-28 text-white">
        <div className="flex max-w-3xl flex-col gap-[var(--stack-gap)]">
          <p
            className="eyebrow"
            style={{ color: "rgba(255,255,255,.85)" }}
          >
            {business.category}
          </p>
          <h1
            style={{
              fontSize: "clamp(2.25rem, 1.5rem + 4vw, 4rem)",
              color: "#fff",
              textShadow: "0 2px 24px rgba(0,0,0,.35)",
            }}
          >
            {section.headline}
          </h1>
          {section.subline ? (
            <p
              className="text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,.92)", maxWidth: "42rem" }}
            >
              {section.subline}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">{badges}</div>
          <ActionButtons actions={section.actions} business={business} className="mt-2" />
        </div>
      </div>
    </section>
  );
}
