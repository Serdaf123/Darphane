import type { Metadata } from "next";
import { t, type Locale } from "./i18n";
import type { Site } from "./schema";
import { isPubliclyIndexable, siteLocales } from "./sites";

/** /[slug] ve /[slug]/en için ortak metadata: başlık, açıklama, robots, dil alternatifleri. */
export function siteMetadata(site: Site, locale: Locale): Metadata {
  const { slug, business, seo } = site;
  const place = [business.district, business.city].filter(Boolean).join(", ");
  const title = seo.title ?? `${business.name} — ${business.category}`;
  const description =
    seo.description ?? business.tagline ?? t(locale).metaDescription(business.name, place, business.category);

  const indexable = isPubliclyIndexable(site);
  const locales = siteLocales(slug);
  // Satılan site kendi alan adına bağlıysa kanonik adres o alan adıdır; yoksa /slug yolu.
  const pathFor = (l: Locale) =>
    indexable && business.domain
      ? `https://${business.domain}${l === "tr" ? "/" : `/${l}`}`
      : l === "tr"
        ? `/${slug}`
        : `/${slug}/${l}`;
  const languages = locales.length > 1 ? Object.fromEntries(locales.map((l) => [l, pathFor(l)])) : undefined;

  return {
    title,
    description,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
    alternates: { canonical: pathFor(locale), languages },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      // Verilmezse app/[slug]/opengraph-image.tsx otomatik kullanılır
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
  };
}
