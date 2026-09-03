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

function unsoldSlugs(): string[] {
  if (!fs.existsSync(SITES_DIR)) return [];
  return fs
    .readdirSync(SITES_DIR)
    .filter((file) => file.endsWith(".json"))
    .filter((file) => {
      try {
        const site = JSON.parse(fs.readFileSync(path.join(SITES_DIR, file), "utf8"));
        return site?.offer?.status !== "sold";
      } catch {
        // Okunamayan dosyayı güvenli tarafta tut: kapalı say.
        return true;
      }
    })
    .map((file) => file.replace(/\.json$/, ""));
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash: ticari kullanıma açık, teklif aşamasında telif riski yok.
      { protocol: "https", hostname: "images.unsplash.com" },
      // picsum: sadece örnek sitelerdeki yer tutucular için.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },

  async headers() {
    const noindex = {
      key: "X-Robots-Tag",
      value: "noindex, nofollow, noarchive, nosnippet",
    };

    return [
      // fourpear iç sayfası
      { source: "/", headers: [noindex] },
      // Satılmamış her işletme sitesi
      ...unsoldSlugs().map((slug) => ({
        source: `/${slug}`,
        headers: [noindex],
      })),
    ];
  },
};

export default nextConfig;
