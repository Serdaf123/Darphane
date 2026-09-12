import Link from "next/link";
import { FONT_PAIRINGS as FONT_DEFS } from "@/lib/fonts";
import { CONCEPTS } from "@/components/konsept/registry";
import { listSiteSlugs } from "@/lib/sites";

export const dynamic = "force-dynamic";

const DEFAULT_SITE = "pisi-veteriner";

export default function KonseptIndex() {
  const slugs = listSiteSlugs();
  const sample = slugs.includes(DEFAULT_SITE) ? DEFAULT_SITE : slugs[0];
  return (
    <div className={`lib ${FONT_DEFS.clean.className}`}>
      <div className="lib-wrap">
        <header className="lib-top">
          <h1>15 konsept</h1>
          <nav aria-label="Bağlantılar"><Link href="/kutuphane">Kütüphane</Link></nav>
        </header>
        <p className="lib-intro">
          Her konsept ayrı bir dünya: kendi bileşeni, kendi CSS&apos;i, tek bir güçlü fikir. Hepsi aynı gerçek işletme verisiyle çizilir; üst çubuktan örnek site değişir.
          Telefon önizlemeleri gerçek sayfadır.
        </p>
        <div className="lib-grid" style={{ marginTop: "1.5rem" }}>
          {CONCEPTS.map((c, i) => {
            const open = `/konsept/${c.key}?site=${sample}`;
            return (
              <article key={c.key} className="lib-recipe">
                <div>
                  <h3>{i + 1}. {c.name}</h3>
                  <p className="world">{c.idea}</p>
                  <p className="fits">Uyar: {c.fits}</p>
                  <div className="lib-links">
                    <Link href={open} className="primary">Aç</Link>
                    <a href={`${open}&frame=1`} target="_blank" rel="noopener">Yeni sekmede</a>
                  </div>
                </div>
                <div className="lib-phone" aria-hidden>
                  <iframe src={`${open}&frame=1`} title={`${c.name} önizleme`} loading="lazy" tabIndex={-1} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
