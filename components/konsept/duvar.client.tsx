"use client";

import { useEffect } from "react";

/**
 * Mobilde belge düzeyinde kaydırma-yakalama: afişler tam ekran, her kaydırma bir afişe oturur.
 * Kök elemana (html) yalnız bu konsept açıkken uygulanır; ayrılınca temizlenir.
 */
export function SnapRoot() {
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(max-width: 899px)");
    const prev = root.style.scrollSnapType;
    const apply = () => {
      root.style.scrollSnapType = mq.matches ? "y mandatory" : prev;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      root.style.scrollSnapType = prev;
    };
  }, []);
  return null;
}
