import Link from "next/link";
import { getAllSites, isOfferExpired } from "@/lib/sites";
import type { Site } from "@/lib/schema";

/** fourpear iç sayfası: hangi site hangi aşamada. Dışarıya kapalı. */

// Geri sayımlar her açılışta güncel olsun; build anında donmasın.
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<Site["offer"]["status"], { label: string; color: string }> = {
  draft: { label: "Taslak", color: "#a16207" },
  pitched: { label: "Teklif gönderildi", color: "#1d4ed8" },
  sold: { label: "Satıldı", color: "#15803d" },
  expired: { label: "Süre doldu", color: "#7f1d1d" },
};

function timeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "süre doldu";
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff / 3_600_000) % 24);
  if (days > 0) return `${days} gün ${hours} saat kaldı`;
  return `${hours} saat kaldı`;
}

export default function HomePage() {
  const sites = getAllSites();
  const counts = sites.reduce<Record<string, number>>((acc, site) => {
    const key = isOfferExpired(site) ? "expired" : site.offer.status;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main
      style={{
        maxWidth: "56rem",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        fontFamily: "var(--font-sans)",
        color: "#17171b",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "1rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0, letterSpacing: "-0.02em" }}>darphane</h1>
        <a href="/api/cikis" style={{ fontSize: "0.875rem", color: "inherit", opacity: 0.7 }}>
          Çıkış
        </a>
      </div>
      <p style={{ color: "#6c6c78", marginTop: "0.5rem" }}>
        {sites.length} site ·{" "}
        {Object.entries(counts)
          .map(([status, count]) => `${count} ${STATUS_LABELS[status as Site["offer"]["status"]].label.toLowerCase()}`)
          .join(" · ") || "henüz site yok"}
      </p>

      {sites.length === 0 ? (
        <p style={{ marginTop: "2.5rem", color: "#6c6c78" }}>
          İlk siteyi oluşturmak için: <code>npm run new-site</code>
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, marginTop: "2.5rem" }}>
          {sites.map((site) => {
            const expired = isOfferExpired(site);
            const status = STATUS_LABELS[expired ? "expired" : site.offer.status];

            return (
              <li
                key={site.slug}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  padding: "1rem 0",
                  borderBottom: "1px solid #e4e4de",
                }}
              >
                <div>
                  <Link
                    href={`/${site.slug}`}
                    style={{ color: "inherit", fontWeight: 600, fontSize: "1.0625rem" }}
                  >
                    {site.business.name}
                  </Link>
                  <p style={{ color: "#6c6c78", fontSize: "0.875rem", margin: "0.25rem 0 0" }}>
                    {site.business.category}
                    {site.business.city ? ` · ${site.business.city}` : ""} · /{site.slug}
                  </p>
                </div>

                <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
                  <span style={{ color: status.color, fontWeight: 600 }}>{status.label}</span>
                  {site.offer.expiresAt && !expired && site.offer.status === "pitched" ? (
                    <p style={{ color: "#6c6c78", margin: "0.25rem 0 0" }}>
                      {timeLeft(site.offer.expiresAt)}
                    </p>
                  ) : null}
                  {site.offer.price ? (
                    <p style={{ color: "#6c6c78", margin: "0.25rem 0 0" }}>
                      {site.offer.price.toLocaleString("tr-TR")}{" "}
                      {site.offer.currency === "TRY" ? "₺" : site.offer.currency}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
