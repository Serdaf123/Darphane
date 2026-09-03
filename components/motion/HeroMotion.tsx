"use client";

import { motion, type TargetAndTransition, type Transition, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useSiteMotion } from "./MotionProvider";

/**
 * Hero giriş animasyonu. Sayfa açılır açılmaz bir kez oynar.
 *   <HeroItem order={n}>  metin blokları — order sırayla gecikme verir
 *   <HeroMedia>           görsel katmanı — preset'e göre yaklaşır / açılır / netleşir
 *
 * Stil theme.motion.hero'dan gelir. "none" veya "hareketi azalt" → düz çizim.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP = 0.09;

const ITEM: Record<string, Variants> = {
  rise: {
    hidden: { opacity: 0, y: 26 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay: 0.15 + i * STEP },
    }),
  },
  reveal: {
    // Dış sarmalayıcı overflow:hidden; içerik alttan perde arkasından çıkar
    hidden: { y: "110%" },
    show: (i: number) => ({
      y: "0%",
      transition: { duration: 0.9, ease: EASE, delay: 0.25 + i * STEP },
    }),
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(14px)", scale: 1.02 },
    show: (i: number) => ({
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      transition: { duration: 1, ease: "easeOut", delay: 0.1 + i * STEP },
    }),
  },
  curtain: {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      // Perde 0.9 sn'de kalkar, metinler onun ardından gelir
      transition: { duration: 0.7, ease: EASE, delay: 0.75 + i * STEP },
    }),
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.96 },
    show: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: EASE, delay: 0.3 + i * STEP },
    }),
  },
};

export function HeroItem({
  children,
  order = 0,
  className,
  style,
}: {
  children: ReactNode;
  order?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { hero, reduced } = useSiteMotion();

  if (hero === "none" || reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const inner = (
    <motion.div
      className={hero === "reveal" ? undefined : className}
      style={hero === "reveal" ? undefined : style}
      custom={order}
      variants={ITEM[hero]}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );

  // reveal: maske, iç blok maskeden yukarı kayar
  return hero === "reveal" ? (
    <div className={className} style={{ ...style, overflow: "hidden", paddingBottom: "0.1em" }}>
      {inner}
    </div>
  ) : (
    inner
  );
}

export function HeroMedia({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const { hero, reduced } = useSiteMotion();

  if (hero === "none" || reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const media: Record<
    string,
    { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition }
  > = {
    rise: { initial: { scale: 1.06 }, animate: { scale: 1 }, transition: { duration: 1.6, ease: EASE } },
    reveal: {
      initial: { clipPath: "inset(0 100% 0 0)" },
      animate: { clipPath: "inset(0 0% 0 0)" },
      transition: { duration: 1.1, ease: EASE },
    },
    blur: {
      initial: { filter: "blur(10px)", scale: 1.04 },
      animate: { filter: "blur(0px)", scale: 1 },
      transition: { duration: 1.3, ease: "easeOut" },
    },
    curtain: { initial: { scale: 1.04 }, animate: { scale: 1 }, transition: { duration: 1.6, ease: EASE } },
    zoom: { initial: { scale: 1.28 }, animate: { scale: 1 }, transition: { duration: 1.8, ease: EASE } },
  };
  const m = media[hero];

  return (
    <motion.div
      className={className}
      style={{ ...style, willChange: "transform" }}
      initial={m.initial}
      animate={m.animate}
      transition={m.transition}
    >
      {children}
      {hero === "curtain" ? (
        <motion.div
          aria-hidden
          style={{ position: "absolute", inset: 0, background: "var(--c-bg)", transformOrigin: "top", zIndex: 2 }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        />
      ) : null}
    </motion.div>
  );
}
