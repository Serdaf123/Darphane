"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import type { Motion } from "@/lib/schema";

/**
 * Sitenin hareket tercihleri (JSON: theme.motion) bölümlere buradan ulaşır.
 * Kullanıcı sistemde "hareketi azalt" demişse her şey anında görünür.
 */
type MotionContextValue = Motion & { reduced: boolean };

const MotionContext = createContext<MotionContextValue>({
  hero: "rise",
  scroll: "rise",
  reduced: false,
});

export function MotionProvider({ motion, children }: { motion: Motion; children: ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  return (
    <MotionContext.Provider value={{ ...motion, reduced }}>{children}</MotionContext.Provider>
  );
}

export function useSiteMotion() {
  return useContext(MotionContext);
}
