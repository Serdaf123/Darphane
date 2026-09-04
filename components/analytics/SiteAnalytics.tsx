"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

/**
 * İşletme sitesi için satış sinyalleri:
 *   site_viewed     slug + teklif durumu (hangi aday, hangi aşamada)
 *   scroll_depth    25 / 50 / 75 / 100 — nereye kadar indi
 *   cta_click       ara / whatsapp / yol tarifi / satın al — hangisine bastı
 *   engaged         30 sn kaldı — ciddi ilgi
 *
 * Kayıt (session replay) PostHogProvider'da açık; buradakiler kaydın
 * yanına etiket düşer, listede filtrelenir.
 */
export function SiteAnalytics({ slug, status }: { slug: string; status: string }) {
  useEffect(() => {
    if (!posthog.__loaded) return;

    posthog.group("site", slug);
    posthog.capture("site_viewed", { slug, offer_status: status });

    // Kaydırma derinliği
    const marks = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = Math.round((window.scrollY / max) * 100);
      for (const mark of [25, 50, 75, 100]) {
        if (pct >= mark && !marks.has(mark)) {
          marks.add(mark);
          posthog.capture("scroll_depth", { slug, depth: mark });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Dönüşüm butonları
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const href = link.href;
      const kind = href.startsWith("tel:")
        ? "call"
        : href.includes("wa.me")
          ? link.closest("[data-offer-bar]")
            ? "buy"
            : "whatsapp"
          : href.includes("google.com/maps") || href.includes("maps.apple")
            ? "directions"
            : href.startsWith("mailto:")
              ? "email"
              : null;
      if (kind) posthog.capture("cta_click", { slug, kind, label: link.textContent?.trim() });
    };
    document.addEventListener("click", onClick, true);

    // 30 sn kaldıysa ciddi
    const timer = window.setTimeout(() => posthog.capture("engaged", { slug, seconds: 30 }), 30_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      window.clearTimeout(timer);
    };
  }, [slug, status]);

  return null;
}
