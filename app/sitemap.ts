import type { MetadataRoute } from "next";
import { getAllSites, isPubliclyIndexable } from "@/lib/sites";
import { siteUrl } from "@/lib/site-url";

/** Kök (Serkan'ın sitesi) + satılan işletme siteleri. Satılmamışlar hiç girmez. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const sold = getAllSites().filter(isPubliclyIndexable).filter((s) => s.slug !== "serkan-oral");
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    ...sold.map((s) => ({
      url: s.business.domain ? `https://${s.business.domain}/` : `${base}/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
