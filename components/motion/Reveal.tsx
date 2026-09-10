"use client";

import { m, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useSiteMotion } from "./MotionProvider";

/**
 * Kaydırınca beliren içerik. Üç parça:
 *   <Reveal>   tek blok (başlık, paragraf, görsel)
 *   <Stagger>  içindeki <Item>'ları sırayla getirir (kartlar, liste satırları)
 *
 * Stil theme.motion.scroll'dan gelir; "none" ise düz çizilir, client yükü yok.
 * Hareket sadece transform + opacity: yerleşim değişmez, CLS doğurmaz.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const VARIANTS: Record<string, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
  },
  slide: {
    hidden: { opacity: 0, x: -36 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.94 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: EASE } },
  },
};

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export function Reveal({
  children,
  className,
  style,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  as?: "div" | "section" | "figure" | "li";
}) {
  const { scroll, reduced, hero } = useSiteMotion();
  const recipeReveal = hero === "stack" || hero === "counter" || undefined;
  const Tag = as;

  if (scroll === "none" || reduced) {
    return (
      <Tag data-recipe-reveal={recipeReveal} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = m[Tag];
  return (
    <MotionTag
      data-recipe-reveal={recipeReveal}
      className={className}
      style={style}
      variants={VARIANTS[scroll]}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  style,
  step = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Öğeler arası gecikme (sn) */
  step?: number;
  as?: "div" | "ul" | "dl";
}) {
  const { scroll, reduced, hero } = useSiteMotion();
  const recipeReveal = hero === "stack" || hero === "counter" || undefined;
  const Tag = as;

  if (scroll === "none" || reduced) {
    return (
      <Tag data-recipe-reveal={recipeReveal} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = m[Tag];
  return (
    <MotionTag
      data-recipe-reveal={recipeReveal}
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
    >
      {children}
    </MotionTag>
  );
}

/** Stagger'ın çocuğu. Kendi variant'ını ebeveynden alır. */
export function Item({
  children,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "li" | "figure";
}) {
  const { scroll, reduced, hero } = useSiteMotion();
  const recipeReveal = hero === "stack" || hero === "counter" || undefined;
  const Tag = as;

  if (scroll === "none" || reduced) {
    return (
      <Tag data-recipe-reveal={recipeReveal} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const MotionTag = m[Tag];
  return (
    <MotionTag data-recipe-reveal={recipeReveal} className={className} style={style} variants={VARIANTS[scroll]}>
      {children}
    </MotionTag>
  );
}
