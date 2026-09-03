import fs from "node:fs";
import path from "node:path";
import { siteSchema, type Site } from "./schema";

/**
 * Site üretmek = data/sites/<slug>.json dosyası oluşturmak.
 * Veritabanı yok: JSON + git yeterli, sıfır maliyet, versiyonlu.
 */

const SITES_DIR = path.join(process.cwd(), "data", "sites");

function readSiteFile(slug: string): Site {
  const file = path.join(SITES_DIR, `${slug}.json`);
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const parsed = siteSchema.safeParse(raw);

  if (!parsed.success) {
    // Bozuk JSON build'i patlatsın — hatalı bir siteyi müşteriye göstermekten iyidir.
    const issues = parsed.error.issues
      .map((issue) => `  · ${issue.path.join(".") || "(kök)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Geçersiz site dosyası: data/sites/${slug}.json\n${issues}`);
  }

  if (parsed.data.slug !== slug) {
    throw new Error(
      `data/sites/${slug}.json içindeki slug "${parsed.data.slug}" — dosya adıyla aynı olmalı.`
    );
  }

  return parsed.data;
}

export function listSiteSlugs(): string[] {
  if (!fs.existsSync(SITES_DIR)) return [];
  return fs
    .readdirSync(SITES_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
}

export function getSite(slug: string): Site | null {
  if (!listSiteSlugs().includes(slug)) return null;
  return readSiteFile(slug);
}

export function getAllSites(): Site[] {
  return listSiteSlugs().map(readSiteFile);
}

/** Satılan siteler arama motorlarına açılır; diğer her şey kapalı kalır. */
export function isPubliclyIndexable(site: Site): boolean {
  return site.offer.status === "sold";
}

/**
 * Teklif süresi doldu mu? Sunucu tarafında ilk kontrol;
 * canlı geri sayım istemci tarafında ayrıca çalışır.
 */
export function isOfferExpired(site: Site, now: Date = new Date()): boolean {
  if (site.offer.status === "sold") return false;
  if (site.offer.status === "expired") return true;
  if (!site.offer.expiresAt) return false;
  return new Date(site.offer.expiresAt).getTime() <= now.getTime();
}
