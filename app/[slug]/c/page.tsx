import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { siteMetadata } from "@/lib/site-metadata";
import { getSite, listSiteSlugs, siteLocales, siteVariants } from "@/lib/sites";
import { resolvePalette } from "@/lib/theme";

export const dynamicParams = false;
export const revalidate = 300;
type CPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listSiteSlugs().filter((slug) => siteVariants(slug).includes("c")).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CPageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug, "tr", "c");
  return site ? siteMetadata(site, "tr") : {};
}

export async function generateViewport({ params }: CPageProps): Promise<Viewport> {
  const { slug } = await params;
  const site = getSite(slug, "tr", "c");
  return { themeColor: site ? resolvePalette(site.theme).bg : undefined };
}

export default async function VariantCPage({ params }: CPageProps) {
  const { slug } = await params;
  if (!siteVariants(slug).includes("c")) notFound();
  const site = getSite(slug, "tr", "c");
  if (!site) notFound();
  return <SitePage site={site} locale="tr" locales={siteLocales(slug)} variant="c" variants={siteVariants(slug)} />;
}
