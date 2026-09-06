import fs from "node:fs";
import path from "node:path";
import type { Site } from "./schema";

/** Panel yardımcıları: etiketler, süreler, teklif metni. */

export const STATUS_META: Record<Site["offer"]["status"], { label: string; tone: string }> = {
  draft: { label: "Taslak", tone: "draft" },
  pitched: { label: "Teklifte", tone: "pitched" },
  sold: { label: "Satıldı", tone: "sold" },
  expired: { label: "Süre doldu", tone: "expired" },
};

export function effectiveStatus(site: Site, now = Date.now()): Site["offer"]["status"] {
  if (site.offer.status === "sold") return "sold";
  if (site.offer.status === "expired") return "expired";
  if (site.offer.expiresAt && new Date(site.offer.expiresAt).getTime() <= now) return "expired";
  return site.offer.status;
}

export function timeLeft(expiresAt: string, now = Date.now()): string {
  const diff = new Date(expiresAt).getTime() - now;
  if (diff <= 0) return "doldu";
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  if (d > 0) return `${d} g ${h} s`;
  const m = Math.floor((diff / 60_000) % 60);
  return h > 0 ? `${h} s ${m} dk` : `${m} dk`;
}

const TZ = "Europe/Istanbul";

export function formatTr(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    timeZone: TZ,
    day: "numeric",
    month: "long",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** ISO → datetime-local değeri (İstanbul saatiyle) */
export function toLocalInput(iso?: string): string {
  if (!iso) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** datetime-local (İstanbul) → ISO +03:00 */
export function fromLocalInput(value: string): string | undefined {
  if (!value) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return undefined;
  return `${value}:00+03:00`;
}

/** Verilen günün 21:00 İstanbul karşılığı (ISO +03:00) */
export function at21(date: Date): string {
  return `${toLocalInput(date.toISOString()).slice(0, 10)}T21:00:00+03:00`;
}

/** Şu andan n gün sonra, 21:00 İstanbul */
export function daysFromNowAt21(days: number): string {
  return at21(new Date(Date.now() + days * 86_400_000));
}

export function pitchText(slug: string): string | null {
  const file = path.join(process.cwd(), "content", "pitch", "gonderim", `${slug}.txt`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}

export function formatPriceNumber(site: Site): string {
  if (!site.offer.price) return "—";
  const cur = site.offer.currency === "TRY" ? "₺" : site.offer.currency;
  return `${site.offer.price.toLocaleString("tr-TR")} ${cur}`;
}
