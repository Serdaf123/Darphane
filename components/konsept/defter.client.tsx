"use client";

import { useEffect, useState } from "react";

export type DefterTab = { id: string; label: string };

/**
 * Defterin sekmeleri: sayfa içi çapalar. Görünen bölüm IntersectionObserver ile
 * izlenir, aktif sekme kalınlaşır. JS yoksa sekmeler düz bağlantı olarak çalışır.
 */
export function DefterTabs({ tabs }: { tabs: DefterTab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        let best: string | undefined;
        let bestRatio = 0;
        for (const t of tabs) {
          const r = visible.get(t.id) ?? 0;
          if (r > bestRatio) { bestRatio = r; best = t.id; }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    for (const t of tabs) {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [tabs]);

  return (
    <nav className="tabs" aria-label="Defter sekmeleri">
      {tabs.map((t) => (
        <a key={t.id} href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined}>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
