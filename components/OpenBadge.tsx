"use client";

import { getOpenState } from "@/lib/hours";
import { t, type Locale } from "@/lib/i18n";
import type { Hours } from "@/lib/schema";
import { useNow } from "@/lib/useNow";

/**
 * Statik HTML'de saat bilinmez; rozet yine de çizilir (nötr etiketle) ki
 * hidrasyonda belirip alttaki her şeyi itmesin — hero'da 0.2'lik CLS'nin
 * sebebi buydu. Gerçek durum hidrasyondan sonra yerine oturur.
 */
export function OpenBadge({ hours, locale = "tr" }: { hours: Hours; locale?: Locale }) {
  const now = useNow();
  const state = now === null ? null : getOpenState(hours, new Date(now), locale);

  if (state?.status === "unknown") return null;

  const isOpen = state?.status === "open";
  const label = state === null ? t(locale).hours.schedule : state.label;

  // Etiket hidrasyonda değişir ("Çalışma saatleri" → "Şu an kapalı"); genişlik sabit kalsın ki
  // yanındaki rozetler satır atlamasın (CLS).
  return (
    <span className="pill" style={{ minWidth: "8.75rem", justifyContent: "center" }}>
      <span
        aria-hidden
        style={{
          width: "0.5rem",
          height: "0.5rem",
          borderRadius: "999px",
          background: isOpen ? "#22c55e" : "#9ca3af",
          boxShadow: isOpen ? "0 0 0 3px rgba(34,197,94,.22)" : "none",
        }}
      />
      {label}
    </span>
  );
}
