import fs from "node:fs";
import path from "node:path";
import { DEFAULT_LOCALE, type Locale } from "./i18n";
import { siteSchema, type Section, type Site } from "./schema";

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
    // <slug>.json — dil ve varyant katmanları (<slug>.en.json, <slug>.b.json) ayrı sayılır
    .filter((file) => /^[a-z0-9-]+\.json$/.test(file))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();
}

/** Bu sitenin hangi dillerde sayfası var: tr her zaman, en varsa <slug>.en.json */
export function siteLocales(slug: string): Locale[] {
  const locales: Locale[] = [DEFAULT_LOCALE];
  if (fs.existsSync(path.join(SITES_DIR, `${slug}.en.json`))) locales.push("en");
  return locales;
}

/**
 * Tasarım varyantları: <slug>.b.json varsa işletmeye iki tasarım sunulur
 * ("hangisi?" sorusu "evet/hayır"dan iyi). "a" her zaman ana dosya.
 */
export type Variant = "a" | "b";
export function siteVariants(slug: string): Variant[] {
  return fs.existsSync(path.join(SITES_DIR, `${slug}.b.json`)) ? ["a", "b"] : ["a"];
}

/**
 * Dil katmanı: <slug>.en.json kısmi bir site JSON'udur; business/seo alanları
 * ve id'si eşleşen bölümler TR'nin üstüne biner. Tema ve teklif değişmez.
 * Sonuç yine tam şemadan geçer — yarım çeviri build'de yakalanır.
 */
/** Kısmi JSON katmanını (dil ya da tasarım varyantı) sitenin üstüne bindirir; sonuç tam şemadan geçer. */
function applyOverlay(site: Site, slug: string, suffix: string): Site {
  const file = path.join(SITES_DIR, `${slug}.${suffix}.json`);
  if (!fs.existsSync(file)) return site;
  const overlay = JSON.parse(fs.readFileSync(file, "utf8")) as {
    business?: Partial<Site["business"]>;
    seo?: Partial<Site["seo"]>;
    theme?: Partial<Site["theme"]>;
    sections?: Array<Partial<Section> & { id: string }>;
  };

  const sections = site.sections.map((section, index) => {
    const id = section.id ?? `${section.type}-${index}`;
    const patch = overlay.sections?.find((s) => s.id === id);
    return patch ? { ...section, ...patch } : section;
  });

  const merged = {
    ...site,
    business: { ...site.business, ...overlay.business },
    seo: { ...site.seo, ...overlay.seo },
    // Varyant katmanı temayı bütünüyle değiştirir (accent vs preset karışmasın)
    theme: overlay.theme ? { ...overlay.theme } : site.theme,
    sections,
  };
  const parsed = siteSchema.safeParse(merged);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  · ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Geçersiz katman: data/sites/${slug}.${suffix}.json\n${issues}`);
  }
  return parsed.data;
}

export function getSite(slug: string, locale: Locale = DEFAULT_LOCALE, variant: Variant = "a"): Site | null {
  if (!listSiteSlugs().includes(slug)) return null;
  let site = readSiteFile(slug);
  if (variant !== "a") site = applyOverlay(site, slug, variant);
  if (locale !== DEFAULT_LOCALE) site = applyOverlay(site, slug, locale);
  return site;
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
