import type { MetadataRoute } from "next";
import { getAllSites, isPubliclyIndexable } from "@/lib/sites";

/**
 * Varsayılan: her şey kapalı.
 * Sadece satılan siteler açılır — robots.txt'te daha özel kural
 * genel Disallow'u geçersiz kılar.
 */
export default function robots(): MetadataRoute.Robots {
  const sold = getAllSites().filter(isPubliclyIndexable).map((site) => `/${site.slug}`);

  return {
    rules: {
      userAgent: "*",
      // "/$" yalnız kök sayfa (Serkan'ın sitesi); satılan siteler kendi yolundan
      allow: ["/$", ...sold],
      disallow: "/",
    },
  };
}
