import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferPage } from "@/components/OfferPage";
import { checkDomains } from "@/lib/domains";
import { getSite, listSiteSlugs } from "@/lib/sites";

/**
 * Teklif sayfası: "peki ne alıyorum?" Satılmamış siteler için vardır;
 * satılan sitede 404 (işletme artık müşteri). Arama motorlarına kapalı.
 */
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return listSiteSlugs().map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ tasarim?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug);
  return {
    title: site ? `${site.business.name} — site teklifi` : "Teklif",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function TeklifPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tasarim } = await searchParams;
  const site = getSite(slug);
  if (!site || site.offer.status === "sold") notFound();
  const domains = site.business.domain ? [] : await checkDomains(site.business.name);
  return <OfferPage site={site} domains={domains} variant={tasarim === "b" ? "b" : undefined} />;
}
