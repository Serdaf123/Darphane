/**
 * Sitenin mutlak adresi. Sıra: kendi alan adımız (NEXT_PUBLIC_SITE_URL) →
 * Vercel'in kalıcı üretim adresi → önizleme adresi → localhost.
 * Boş değer "yok" sayılır (Vercel .env.example'dan boş değişken ekleyebiliyor).
 */
export function siteUrl(): string {
  const own = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (own) return own.startsWith("http") ? own : `https://${own}`;
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (prod) return `https://${prod}`;
  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview}`;
  return "http://localhost:3000";
}
