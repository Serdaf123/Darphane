import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { siteMetadata } from "@/lib/site-metadata";
import { getSite, listSiteSlugs, siteLocales, siteVariants } from "@/lib/sites";
import { resolvePalette } from "@/lib/theme";

/**
 * Tasarım B: yalnızca data/sites/<slug>.b.json olan siteler. Aynı içerik,
 * farklı tema/hero; işletme sahibi şeritteki A · B geçişiyle ikisini gezer.
 */
export const dynamicParams = false;
export const revalidate = 300;

type BPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSiteSlugs()
    .filter((slug) => siteVariants(slug).includes("b"))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug, "tr", "b");
  return site ? siteMetadata(site, "tr") : {};
}

export async function generateViewport({ params }: BPageProps): Promise<Viewport> {
  const { slug } = await params;
  const site = getSite(slug, "tr", "b");
  return { themeColor: site ? resolvePalette(site.theme).bg : undefined };
}

export default async function VariantBPage({ params }: BPageProps) {
  const { slug } = await params;
  if (!siteVariants(slug).includes("b")) notFound();
  const site = getSite(slug, "tr", "b");
  if (!site) notFound();
  return (
    <SitePage site={site} locale="tr" locales={siteLocales(slug)} variant="b" variants={siteVariants(slug)} />
  );
}
