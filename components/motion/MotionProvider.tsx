"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import type { Motion } from "@/lib/schema";

/**
 * Sitenin hareket tercihleri (JSON: theme.motion) bölümlere buradan ulaşır.
 * Kullanıcı sistemde "hareketi azalt" demişse her şey anında görünür.
 */
type MotionContextValue = Motion & { reduced: boolean };

const MotionContext = createContext<MotionContextValue>({
  hero: "rise",
  scroll: "rise",
  smooth: false,
  parallax: false,
  reduced: false,
});

export function MotionProvider({ motion, children }: { motion: Motion; children: ReactNode }) {
  // Hidrasyon güvenli: ilk istemci çizimi sunucuyla aynı (false), tercih effect'te okunur.
  // Aksi halde "hareketi azalt" açık kullanıcıda sunucu m.div, istemci düz div çizer;
  // React uyuşmazlığı yamamaz ve SSR'daki opacity:0 kalır (bölümler görünmez).
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  // LazyMotion: motion'ın tam paketi yerine yalnız DOM animasyon özellikleri (~15 KB) gelir.
  // strict: içeride yanlışlıkla <motion.*> kullanılırsa geliştirmede hata verir; <m.*> kullanılmalı.
  return (
    <MotionContext.Provider value={{ ...motion, reduced }}>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionContext.Provider>
  );
}

export function useSiteMotion() {
  return useContext(MotionContext);
}
