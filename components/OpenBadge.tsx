"use client";

import { getOpenState } from "@/lib/hours";
import type { Hours } from "@/lib/schema";
import { useNow } from "@/lib/useNow";

/**
 * Statik HTML'de rozet yoktur (saat bilinmez); hidrasyondan sonra gerçek
 * zamanla belirir ve saniyelik saatle birlikte güncel kalır.
 */
export function OpenBadge({ hours }: { hours: Hours }) {
  const now = useNow();
  if (now === null) return null;

  const state = getOpenState(hours, new Date(now));
  if (state.status === "unknown") return null;

  const isOpen = state.status === "open";
  const label = isOpen ? `Şu an açık · ${state.until}'ye kadar` : state.label;

  return (
    <span className="pill">
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
