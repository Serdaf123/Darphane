import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { OfferExpired } from "@/components/OfferExpired";
import { OfferLayer } from "@/components/OfferLayer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { Sections } from "@/components/sections";
import { StickyMobileBar } from "@/components/StickyMobileBar";
import { sectionId } from "@/lib/actions";
import { navCta, navItems } from "@/lib/nav";
import { getSite, isOfferExpired, isPubliclyIndexable, listSiteSlugs } from "@/lib/sites";
import { isDarkPreset, themeStyle } from "@/lib/theme";

// Bilinmeyen slug'lar 404 döner — sadece data/sites'taki dosyalar yayınlanır.
export const dynamicParams = false;

// Statik sayfa 5 dakikada bir yeniden üretilir: süre dolduğunda içerik
// yeniden deploy gerekmeden kendiliğinden kalkar.
export const revalidate = 300;

export function generateStaticParams() {
  return listSiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) return {};

  const { business, seo } = site;
  const title = seo.title ?? `${business.name} — ${business.category}`;
  const description =
    seo.description ??
    business.tagline ??
    `${business.name}, ${[business.district, business.city].filter(Boolean).join(" ")} bölgesinde ${business.category.toLowerCase()}.`;

  // Satılmadan önce hiçbir site indekslenmez.
  const indexable = isPubliclyIndexable(site);

  return {
    title,
    description,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "tr_TR",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
  };
}

export default async function SitePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();

  const { business, theme, sections, offer } = site;

  // Süresi dolmuş sitede işletme içeriği HTML'e hiç girmez.
  if (isOfferExpired(site)) {
    return <OfferExpired offer={offer} businessName={business.name} />;
  }

  // Header görselli hero'nun üstüne biner; diğer hero'larda kendi zeminiyle durur.
  const first = sections[0];
  const overImage = first.type === "hero" && first.variant === "image";

  return (
    <div
      className="site-root"
      style={{ ...themeStyle(theme), colorScheme: isDarkPreset(theme.preset) ? "dark" : "light" }}
    >
      <MotionProvider motion={theme.motion}>
        <OfferLayer offer={offer} businessName={business.name}>
          <SiteHeader
            business={business}
            nav={navItems(sections)}
            cta={navCta(sections, business)}
            style={theme.header}
            overImage={overImage}
            topHref={`#${sectionId(first, 0)}`}
          />
          <main>
            <Sections sections={sections} business={business} />
          </main>
          <SiteFooter business={business} />
          <StickyMobileBar business={business} />

          {isPubliclyIndexable(site) ? <LocalBusinessJsonLd site={site} /> : null}
        </OfferLayer>
      </MotionProvider>
    </div>
  );
}

/** Yapısal veri sadece satılan sitelerde: öncesinde arama motorunda görünmesini istemiyoruz. */
function LocalBusinessJsonLd({ site }: { site: ReturnType<typeof getSite> }) {
  if (!site) return null;
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
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
