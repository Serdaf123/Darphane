"use client";

import posthog from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

/** Anahtar varsa yüklenen gerçek istemci (PostHogProvider bunu dinamik getirir). */
export default function PostHogClient({ apiKey, children }: { apiKey: string; children: ReactNode }) {
  useEffect(() => {
    if (posthog.__loaded) return;
    posthog.init(apiKey, {
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
  }, [apiKey]);

  return <Provider client={posthog}>{children}</Provider>;
}
