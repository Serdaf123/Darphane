import { SiteAnalytics } from "@/components/analytics/SiteAnalytics";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { OfferExpired } from "@/components/OfferExpired";
import { OfferLayer } from "@/components/OfferLayer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Sections } from "@/components/sections";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { sectionId } from "@/lib/actions";
import { t, type Locale } from "@/lib/i18n";
import { navCta, navItems } from "@/lib/nav";
import type { Site } from "@/lib/schema";
import { isOfferExpired, isPubliclyIndexable } from "@/lib/sites";
import { isDarkPreset, themeFontClass, themeStyle } from "@/lib/theme";

/**
 * Bir işletme sitesinin gövdesi. /[slug] (TR) ve /[slug]/en aynı bileşeni
 * farklı locale ile çizer; içerik farkı lib/sites.ts'teki dil katmanından gelir.
 */
export function SitePage({
  site,
  locale,
  locales,
}: {
  site: Site;
  locale: Locale;
  /** Bu sitenin sayfası olan diller; ikiden fazlaysa header'da geçiş çıkar */
  locales: Locale[];
}) {
  const { slug, business, theme, sections, offer } = site;

  // Süresi dolmuş sitede işletme içeriği HTML'e hiç girmez.
  if (isOfferExpired(site)) {
    return <OfferExpired offer={offer} businessName={business.name} />;
  }

  // Header görselli hero'nun üstüne biner; diğer hero'larda kendi zeminiyle durur.
  const first = sections[0];
  const overImage =
    first.type === "hero" && (first.variant === "image" || first.variant === "statement");

  // Alt bar ve header, hero'daki WhatsApp şablonunu paylaşır: avukata/işletmeye gelen her mesaj aynı biçimde
  const heroWhatsapp =
    first.type === "hero" ? first.actions.find((a) => a.kind === "whatsapp")?.value : undefined;

  const other = locales.find((l) => l !== locale);
  const switchHref = other ? (other === "tr" ? `/${slug}` : `/${slug}/${other}`) : undefined;

  return (
    <div
      lang={t(locale).lang}
      className={`site-root ${themeFontClass(theme)}${theme.photos === "mono" ? " photos-mono" : ""}`}
      style={{ ...themeStyle(theme), colorScheme: isDarkPreset(theme.preset) ? "dark" : "light" }}
    >
      <MotionProvider motion={theme.motion}>
        <SmoothScroll>
          <OfferLayer offer={offer} businessName={business.name}>
            <a href="#icerik" className="skip-link">
              {t(locale).skipToContent}
            </a>
            <SiteHeader
              business={business}
              nav={navItems(sections, locale)}
              cta={navCta(sections, business, locale)}
              style={theme.header}
              overImage={overImage}
              topHref={`#${sectionId(first, 0)}`}
              locale={locale}
              switchHref={switchHref}
              ctaAccent={first.type === "hero" && first.variant === "statement"}
            />
            <main id="icerik" tabIndex={-1}>
              <Sections sections={sections} business={business} locale={locale} />
            </main>
            <SiteFooter business={business} locale={locale} />
            <StickyMobileBar business={business} locale={locale} whatsappMessage={heroWhatsapp} />

            {isPubliclyIndexable(site) ? <LocalBusinessJsonLd site={site} /> : null}
            <SiteAnalytics slug={slug} status={offer.status} />
          </OfferLayer>
        </SmoothScroll>
      </MotionProvider>
    </div>
  );
}

/** Yapısal veri sadece satılan sitelerde: öncesinde arama motorunda görünmesini istemiyoruz. */
function LocalBusinessJsonLd({ site }: { site: Site }) {
  const { business } = site;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.tagline,
    telephone: business.phone,
    email: business.email,
    address: business.address
      ? {
          "@type": "PostalAddress",
          streetAddress: business.address,
          addressLocality: business.district ?? business.city,
          addressRegion: business.city,
          addressCountry: "TR",
        }
      : undefined,
    geo: business.coords
      ? { "@type": "GeoCoordinates", latitude: business.coords.lat, longitude: business.coords.lng }
      : undefined,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
