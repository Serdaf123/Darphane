import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { siteMetadata } from "@/lib/site-metadata";
import { getSite, listSiteSlugs, siteLocales } from "@/lib/sites";
import { PALETTES } from "@/lib/theme";

// Bilinmeyen slug'lar 404 döner — sadece data/sites'taki dosyalar yayınlanır.
export const dynamicParams = false;

// Statik sayfa 5 dakikada bir yeniden üretilir: süre dolduğunda içerik
// yeniden deploy gerekmeden kendiliğinden kalkar.
export const revalidate = 300;

export function generateStaticParams() {
  return listSiteSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug);
  return site ? siteMetadata(site, "tr") : {};
}

/** Tarayıcı çubuğu sayfanın zeminiyle aynı renkte olsun. */
export async function generateViewport({ params }: PageProps<"/[slug]">): Promise<Viewport> {
  const { slug } = await params;
  const site = getSite(slug);
  return { themeColor: site ? PALETTES[site.theme.preset].bg : undefined };
}

export default async function TurkishSitePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const site = getSite(slug, "tr");
  if (!site) notFound();
  return <SitePage site={site} locale="tr" locales={siteLocales(slug)} />;
}
