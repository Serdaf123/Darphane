"use client";

import { createContext, useContext, type ReactNode } from "react";
import { LazyMotion, domAnimation, useReducedMotion } from "motion/react";
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
  const reduced = useReducedMotion() ?? false;
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
