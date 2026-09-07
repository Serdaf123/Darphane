import Link from "next/link";
import { readAllSites, listAllFiles } from "@/lib/store";
import { STATUS_META, effectiveStatus, formatPriceNumber, timeLeft } from "@/lib/panel";

export const dynamic = "force-dynamic";

/** Site listesi: durum, süre, fiyat. Satır → detay sayfası. */
export default async function PanelPage({ searchParams }: { searchParams: Promise<{ silindi?: string; dosya?: string; url?: string }> }) {
  const { silindi, dosya, url } = await searchParams;
  const [sites, files] = await Promise.all([readAllSites(), listAllFiles()]);
  const counts: Record<string, number> = {};
  for (const s of sites) counts[effectiveStatus(s)] = (counts[effectiveStatus(s)] ?? 0) + 1;

  const order = { pitched: 0, draft: 1, sold: 2, demo: 3, expired: 4 } as const;
  const sorted = [...sites].sort((a, b) => order[effectiveStatus(a)] - order[effectiveStatus(b)]);

  return (
    <main>
      {silindi ? (
        <p className="notice notice-warn">
          {silindi} silindi ({dosya} dosya).{url ? <> <a href={url}>commit</a></> : null}
        </p>
      ) : null}
      <ul className="panel-summary">
        <li>
          <strong>{sites.length}</strong> site
        </li>
        {(["pitched", "draft", "sold", "demo", "expired"] as const).map((k) =>
          counts[k] ? (
            <li key={k}>
              <strong>{counts[k]}</strong> {STATUS_META[k].label.toLowerCase()}
            </li>
          ) : null
        )}
      </ul>

      {sorted.length === 0 ? (
        <p className="empty">Henüz site yok. Yeni site: `npm run new-site` ya da `npm run draft`.</p>
      ) : (
        <ul className="site-list">
          {sorted.map((site) => {
            const st = effectiveStatus(site);
            const hasB = files.includes(`${site.slug}.b.json`);
            const hasEn = files.includes(`${site.slug}.en.json`);
            return (
              <li key={site.slug}>
                <Link href={`/panel/${site.slug}`} className="site-row">
                  <div>
                    <div className="name">{site.business.name}</div>
                    <div className="meta">
                      {site.business.category}
                      {site.business.city ? ` · ${site.business.city}` : ""} · /{site.slug}
                      {hasB ? " · A/B" : ""}
                      {hasEn ? " · EN" : ""}
                    </div>
                  </div>
                  <div className="right">
                    <span className={`pill pill-${STATUS_META[st].tone}`}>{STATUS_META[st].label}</span>
                    {st === "pitched" && site.offer.expiresAt ? <span>{timeLeft(site.offer.expiresAt)} kaldı</span> : null}
                    <span>{formatPriceNumber(site)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
