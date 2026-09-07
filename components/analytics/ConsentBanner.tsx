"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

/**
 * KVKK çerez onayı. PostHog (oturum kaydı + olaylar) yalnız "Kabul" sonrası başlar.
 * Karar localStorage'da 6 ay tutulur. Reddedilirse hiçbir şey yüklenmez.
 */
export const CONSENT_KEY = "darphane_consent";
export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const { value, at } = JSON.parse(raw) as { value: Consent; at: number };
    if (Date.now() - at > 183 * 86_400_000) return null;
    return value;
  } catch {
    return null;
  }
}

export function writeConsent(value: Exclude<Consent, null>) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, at: Date.now() }));
  } catch {
    /* özel pencere */
  }
  window.dispatchEvent(new CustomEvent("darphane:consent", { detail: value }));
}

function subscribe(cb: () => void) {
  window.addEventListener("darphane:consent", cb);
  return () => window.removeEventListener("darphane:consent", cb);
}

export function ConsentBanner() {
  // Sunucuda kapalı, istemcide karar yoksa açık; karar verilince olayla kapanır
  const show = useSyncExternalStore(subscribe, () => readConsent() === null, () => false);
  if (!show) return null;

  const decide = (value: "granted" | "denied") => writeConsent(value);

  return (
    <div
      role="dialog"
      aria-label="Çerez bildirimi"
      style={{
        position: "fixed",
        left: "1rem",
        right: "1rem",
        bottom: "calc(4.75rem + env(safe-area-inset-bottom))",
        zIndex: 60,
        margin: "0 auto",
        maxWidth: "34rem",
        background: "#0f1115",
        color: "#f5f6f7",
        borderRadius: "14px",
        padding: "0.9rem 1rem",
        boxShadow: "0 12px 40px rgba(0,0,0,.35)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        fontSize: "0.875rem",
        lineHeight: 1.45,
        display: "flex",
        flexWrap: "wrap",
        gap: "0.6rem 1rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <p style={{ margin: 0, flex: "1 1 16rem" }}>
        Ziyaretinizi anlamak için çerez kullanıyoruz (hangi bölümler açıldı, ne kadar kalındı).{" "}
        <Link href="/gizlilik" style={{ color: "#9db4ff" }}>
          Aydınlatma metni
        </Link>
      </p>
      <span style={{ display: "flex", gap: "0.5rem" }}>
        <button
          type="button"
          onClick={() => decide("denied")}
          style={{ font: "inherit", padding: "0.5rem 0.9rem", borderRadius: "999px", border: "1px solid rgba(245,246,247,.3)", background: "transparent", color: "inherit", cursor: "pointer" }}
        >
          Reddet
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          style={{ font: "inherit", fontWeight: 600, padding: "0.5rem 0.9rem", borderRadius: "999px", border: 0, background: "#22c55e", color: "#07130b", cursor: "pointer" }}
        >
          Kabul
        </button>
      </span>
    </div>
  );
}
