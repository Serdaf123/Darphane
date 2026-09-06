import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

/**
 * Görünmezliğin üçüncü katmanı.
 * Katman 1: her sayfanın metadata robots alanı
 * Katman 2: app/robots.ts
 * Katman 3: burada üretilen X-Robots-Tag başlığı
 *
 * Üçü de aynı kuralı uygular: satılmamış hiçbir site indekslenmez.
 * Biri gözden kaçarsa diğerleri tutar.
 */

const SITES_DIR = path.join(process.cwd(), "data", "sites");

type SiteLite = { slug: string; status: string; domain?: string; hasEn: boolean };

function readSites(): SiteLite[] {
  if (!fs.existsSync(SITES_DIR)) return [];
  const files = fs.readdirSync(SITES_DIR);
  return files
    .filter((file) => /^[a-z0-9-]+\.json$/.test(file))
    .map((file) => {
      const slug = file.replace(/\.json$/, "");
      try {
        const site = JSON.parse(fs.readFileSync(path.join(SITES_DIR, file), "utf8"));
        return {
          slug,
          status: String(site?.offer?.status ?? "draft"),
          domain: site?.business?.domain as string | undefined,
          hasEn: files.includes(`${slug}.en.json`),
        };
      } catch {
        // Okunamayan dosyayı güvenli tarafta tut: kapalı say.
        return { slug, status: "draft", hasEn: false };
      }
    });
}

function unsoldSlugs(): string[] {
  return readSites()
    .filter((site) => site.status !== "sold")
    .map((site) => site.slug);
}

/**
 * Satılan site kendi alan adına bağlanınca: ornek.com/ → /<slug>, ornek.com/en → /<slug>/en.
 * Alan adı Vercel'e scripts/sell.mts ile eklenir; burası sadece yönlendirme.
 */
function domainRewrites() {
  return readSites()
    .filter((site) => site.status === "sold" && site.domain)
    .flatMap((site) => {
      const hosts = [site.domain!, `www.${site.domain!}`];
      return hosts.flatMap((host) => [
        { source: "/", has: [{ type: "host" as const, value: host }], destination: `/${site.slug}` },
        ...(site.hasEn
          ? [{ source: "/en", has: [{ type: "host" as const, value: host }], destination: `/${site.slug}/en` }]
          : []),
      ]);
    });
}

const nextConfig: NextConfig = {
  // Panel çalışma anında bu dosyaları okur; Vercel paketine dahil olsunlar.
  outputFileTracingIncludes: {
    "/panel": ["./data/sites/**", "./content/pitch/gonderim/**"],
    "/panel/[slug]": ["./data/sites/**", "./content/pitch/gonderim/**"],
  },
  images: {
    remotePatterns: [
      // Unsplash: ticari kullanıma açık, teklif aşamasında telif riski yok.
      { protocol: "https", hostname: "images.unsplash.com" },
      // picsum: sadece örnek sitelerdeki yer tutucular için.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  // PostHog istekleri kendi alan adımızdan geçer: reklam engelleyici takılmaz
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_POSTHOG_INGEST ?? "https://eu.i.posthog.com";
    const assets = host.replace("://eu.i.", "://eu-assets.i.").replace("://us.i.", "://us-assets.i.");
    return [
      { source: "/ingest/static/:path*", destination: `${assets}/static/:path*` },
      { source: "/ingest/:path*", destination: `${host}/:path*` },
      ...domainRewrites(),
    ];
  },
  // PostHog'un /ingest/… yolları sondaki eğik çizgiyle çalışır
  skipTrailingSlashRedirect: true,

  async headers() {
    const noindex = {
      key: "X-Robots-Tag",
      value: "noindex, nofollow, noarchive, nosnippet",
    };

    return [
      // fourpear iç paneli
      { source: "/", headers: [noindex] },
      { source: "/panel/:path*", headers: [noindex] },
      { source: "/giris", headers: [noindex] },
      // Satılmamış her işletme sitesi
      ...unsoldSlugs().map((slug) => ({
        source: `/${slug}`,
        headers: [noindex],
      })),
    ];
  },
};

export default nextConfig;
