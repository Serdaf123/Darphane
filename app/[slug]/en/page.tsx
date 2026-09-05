import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { siteMetadata } from "@/lib/site-metadata";
import { getSite, listSiteSlugs, siteLocales } from "@/lib/sites";
import { resolvePalette } from "@/lib/theme";

/**
 * İngilizce sürüm: yalnızca data/sites/<slug>.en.json olan siteler.
 * Turistik işletmeler (otel, restoran) için; teklif şeridi Türkçe kalır,
 * o işletme sahibine hitap ediyor.
 */
export const dynamicParams = false;
export const revalidate = 300;

// Next'in ürettiği rota tipleri bu iç içe rotayı henüz tanımıyor; açık tip
type EnPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSiteSlugs()
    .filter((slug) => siteLocales(slug).includes("en"))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: EnPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug, "en");
  return site ? siteMetadata(site, "en") : {};
}

export async function generateViewport({ params }: EnPageProps): Promise<Viewport> {
  const { slug } = await params;
  const site = getSite(slug);
  return { themeColor: site ? resolvePalette(site.theme).bg : undefined };
}

export default async function EnglishSitePage({ params }: EnPageProps) {
  const { slug } = await params;
  if (!siteLocales(slug).includes("en")) notFound();
  const site = getSite(slug, "en");
  if (!site) notFound();
  return <SitePage site={site} locale="en" locales={siteLocales(slug)} />;
}
