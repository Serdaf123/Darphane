"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

/**
 * Oturum kaydı + olaylar. Anahtar yoksa hiçbir şey yüklenmez (yerel geliştirme).
 *
 * Neden: Vercel Analytics "sayfa açıldı" der; PostHog esnafın siteyi NASIL
 * gezdiğini gösterir — kaç saniye baktı, menüye indi mi, fiyata döndü mü.
 * Takip mesajının zamanını ve içeriğini bu belirler.
 *
 * İstekler /ingest üzerinden geçer (next.config rewrites): reklam engelleyici
 * takılmaz. AB sunucusu (KVKK için yakın yargı alanı).
 */
const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!KEY || posthog.__loaded) return;
    posthog.init(KEY, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com",
      defaults: "2025-05-24",
      capture_pageview: false, // SiteAnalytics slug'lı pageview atar
      capture_pageleave: true,
      autocapture: true,
      session_recording: {
        maskAllInputs: true, // formdaki telefon/isim kayda girmesin
        maskTextSelector: "[data-ph-mask]",
      },
      persistence: "localStorage+cookie",
    });
  }, []);

  if (!KEY) return <>{children}</>;
  return <Provider client={posthog}>{children}</Provider>;
}
