"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

/**
 * Oturum kaydı + olaylar. Anahtar yoksa posthog-js paketi hiç indirilmez
 * (≈90 KB); varsa istemci ayrı parça olarak ilk boyamadan sonra gelir.
 *
 * Neden: Vercel Analytics "sayfa açıldı" der; PostHog esnafın siteyi NASIL
 * gezdiğini gösterir — kaç saniye baktı, menüye indi mi, fiyata döndü mü.
 * İstekler /ingest üzerinden geçer (next.config rewrites). AB sunucusu (KVKK).
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

const PostHogClient = dynamic(() => import("./PostHogClient"), { ssr: false, loading: () => null });

export function PostHogProvider({ children }: { children: ReactNode }) {
  if (!KEY) return <>{children}</>;
  return <PostHogClient apiKey={KEY}>{children}</PostHogClient>;
}
