import { ActionButtons } from "@/components/ActionButtons";
import { HeroItem, HeroMedia } from "@/components/motion/HeroMotion";
import { OpenBadge } from "@/components/OpenBadge";
import { SiteImage } from "@/components/SiteImage";
import { normalizePhone, whatsappUrl } from "@/lib/actions";
import type { Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";

type HeroData = Extract<Section, { type: "hero" }>;

/**
 * Giriş animasyonu HeroItem/HeroMedia ile gelir; stil theme.motion.hero.
 * order: metinler bu sırayla belirir (göz de bu sırayla okur).
 */
export function Hero({
  section,
  business,
  id,
  locale = "tr",
}: {
  section: HeroData;
  business: Business;
  id: string;
  locale?: Locale;
}) {
  const badges = (
    <>
      {business.hours ? <OpenBadge hours={business.hours} locale={locale} /> : null}
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
          <HeroItem order={0}>
            <p className="eyebrow">{business.category}</p>
          </HeroItem>
          <HeroItem order={1}>
            <h1 style={{ fontSize: "clamp(2.25rem, 1.5rem + 4vw, 4.5rem)" }}>
              {section.headline}
            </h1>
          </HeroItem>
          {section.subline ? (
            <HeroItem order={2}>
              <p className="section-intro text-lg">{section.subline}</p>
            </HeroItem>
          ) : null}
          <HeroItem order={3}>
            <div className="flex flex-wrap gap-2">{badges}</div>
          </HeroItem>
          <HeroItem order={4}>
            <ActionButtons actions={section.actions} business={business} className="mt-2" locale={locale} mobileLimit={2} />
          </HeroItem>
        </div>
      </section>
    );
  }

  // statement: koyu antet — büyük isim, ince çizgi, arka planda monogram.
  // Fotoğrafı olmayan meslekler (avukat, muhasebe, mimar) için "kartvizit" hissi.
  if (section.variant === "statement") {
    // JSON'da verilmişse olduğu gibi (Ş gibi tek harf); yoksa isimden türet ve
    // Ö/Ş/Ç işaretlerini at — dev boyutta harften kopuk duruyorlardı
    const monogram =
      section.monogram ??
      business.name
        .split(/\s+/)
        .filter((w) => !/^(av|dr|dt|op|prof|doç)\.?$/i.test(w))
        .map((w) => w[0]?.toLocaleUpperCase("tr-TR") ?? "")
        .join("")
        .slice(0, 3)
        .normalize("NFD")
        .replace(/\p{M}/gu, "");

    return (
      <section id={id} className="hero-statement relative isolate overflow-hidden">
        {/* Fotoğraf varsa koyu mürekkep tonuyla arkaya: referans avukat siteleri gibi
            alacakaranlık şehir / cam cephe — metin okunur kalsın diye ağır katman */}
        {section.image ? (
          <>
            <HeroMedia className="absolute inset-0 -z-20">
              <SiteImage
                image={section.image}
                priority
                sizes="100vw"
                className="absolute inset-0 h-full w-full hero-statement-photo"
              />
            </HeroMedia>
            <div aria-hidden className="hero-statement-tint absolute inset-0 -z-10" />
          </>
        ) : null}
        <span aria-hidden className="hero-statement-monogram">
          {monogram}
        </span>
        <div className="on-image container relative pb-16 pt-28 md:pb-24 md:pt-36">
          <div className="flex max-w-4xl flex-col gap-[var(--stack-gap)]">
            {section.urgent && business.phone ? (
              <HeroItem order={0}>
                <div className="hero-urgent">
                  <p className="hero-urgent-title">{section.urgent.title}</p>
                  <a href={`tel:${normalizePhone(business.phone)}`} className="hero-urgent-phone">
                    {business.phone}
                  </a>
                  {section.urgent.note ? (
                    section.urgent.whatsappMessage && (business.whatsapp ?? business.phone) ? (
                      <a
                        href={whatsappUrl((business.whatsapp ?? business.phone)!, section.urgent.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hero-urgent-note"
                      >
                        {section.urgent.note}
                      </a>
                    ) : (
                      <p className="hero-urgent-note">{section.urgent.note}</p>
                    )
                  ) : null}
                </div>
              </HeroItem>
            ) : null}
            <HeroItem order={1}>
              <h1 className={`hero-statement-title${section.urgent ? " hero-statement-title-secondary" : ""}`}>
                {section.headline}
              </h1>
            </HeroItem>
            <HeroItem order={2}>
              <hr className="hero-statement-rule" />
            </HeroItem>
            {section.subline ? (
              <HeroItem order={3}>
                <p className="hero-statement-subline">{section.subline}</p>
              </HeroItem>
            ) : null}
            <HeroItem order={4}>
              <div className="flex flex-wrap gap-2">{badges}</div>
            </HeroItem>
            <HeroItem order={5}>
              {/* Acil blok varsa telefonda numara birincil: tek buton yeter */}
              <ActionButtons
                actions={section.actions}
                business={business}
                className="mt-3"
                locale={locale}
                mobileLimit={section.urgent ? 1 : 2}
              />
            </HeroItem>
          </div>
        </div>
      </section>
    );
  }

  if (section.variant === "split") {
    return (
      <section id={id} className="section">
        <div className="container grid items-center gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-[var(--stack-gap)]">
            <HeroItem order={0}>
              <p className="eyebrow">{business.category}</p>
            </HeroItem>
            <HeroItem order={1}>
              <h1 style={{ fontSize: "clamp(2rem, 1.4rem + 3vw, 3.5rem)" }}>
                {section.headline}
              </h1>
            </HeroItem>
            {section.subline ? (
              <HeroItem order={2}>
                <p className="section-intro">{section.subline}</p>
              </HeroItem>
            ) : null}
            <HeroItem order={3}>
              <div className="flex flex-wrap gap-2">{badges}</div>
            </HeroItem>
            <HeroItem order={4}>
              <ActionButtons actions={section.actions} business={business} className="mt-1" locale={locale} mobileLimit={2} />
            </HeroItem>
          </div>
          <div
            className="relative aspect-4/3 overflow-hidden md:aspect-square"
            style={{ borderRadius: "var(--radius)" }}
          >
            <HeroMedia className="absolute inset-0">
              <SiteImage
                image={section.image}
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-full w-full"
              />
            </HeroMedia>
          </div>
        </div>
      </section>
    );
  }

  // variant: image — tam genişlik görsel, üstünde katman
  return (
    <section id={id} className="relative isolate flex min-h-[78svh] items-end overflow-hidden">
      <HeroMedia className="absolute inset-0 -z-20">
        <SiteImage
          image={section.image}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
        />
      </HeroMedia>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--c-overlay)" }}
      />
      <div className="on-image container pb-14 pt-28 text-white">
        <div className="flex max-w-3xl flex-col gap-[var(--stack-gap)]">
          <HeroItem order={0}>
            <p className="eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>
              {business.category}
            </p>
          </HeroItem>
          <HeroItem order={1}>
            <h1
              style={{
                fontSize: "clamp(2.25rem, 1.5rem + 4vw, 4rem)",
                color: "#fff",
                textShadow: "0 2px 24px rgba(0,0,0,.35)",
              }}
            >
              {section.headline}
            </h1>
          </HeroItem>
          {section.subline ? (
            <HeroItem order={2}>
              <p
                className="text-lg leading-relaxed"
                style={{ color: "rgba(255,255,255,.92)", maxWidth: "42rem" }}
              >
                {section.subline}
              </p>
            </HeroItem>
          ) : null}
          <HeroItem order={3}>
            <div className="flex flex-wrap gap-2">{badges}</div>
          </HeroItem>
          <HeroItem order={4}>
            <ActionButtons actions={section.actions} business={business} className="mt-2" locale={locale} mobileLimit={2} />
          </HeroItem>
        </div>
      </div>
    </section>
  );
}
