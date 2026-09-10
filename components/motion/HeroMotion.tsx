"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useSiteMotion } from "./MotionProvider";

/**
 * Hero giriş animasyonu. Sayfa açılır açılmaz bir kez oynar.
 *   <HeroItem order={n}>  metin blokları — order sırayla gecikme verir
 *   <HeroMedia>           görsel katmanı — preset'e göre yaklaşır / açılır / netleşir
 *
 * CSS ile çalışır (app/globals.css: .hero-item-*, .hero-media-*): sunucu HTML'i
 * görünür gelir, animasyon ilk boyamada başlar, JS beklemez → LCP gecikmez.
 * Yalnız "split" (harf harf) ve parallax GSAP ister; o da gerektiğinde yüklenir.
 * Stil theme.motion.hero'dan gelir. "none" veya "hareketi azalt" → düz çizim.
 */

export function HeroItem({
  children,
  order = 0,
  className,
  style,
  part,
  replay = false,
}: {
  children: ReactNode;
  order?: number;
  part?: "badges" | "headline" | "subline" | "actions";
  className?: string;
  style?: CSSProperties;
  /** Kütüphane demoları: sayfa açılalı 2,5 sn geçse de split animasyonu oynasın */
  replay?: boolean;
}) {
  const { hero, reduced } = useSiteMotion();

  const step = hero === "stack" && part ? { badges: 0, headline: 1, subline: 2, actions: 3 }[part] : Math.min(order, 3);
  const orderedStyle = hero === "stack" && part ? { ...style, order: step } : style;

  if (hero === "none" || reduced) {
    return (
      <div className={className} style={orderedStyle}>
        {children}
      </div>
    );
  }

  if (hero === "split") {
    return (
      <SplitItem order={order} className={className} style={style} force={replay}>
        {children}
      </SplitItem>
    );
  }

  const vars = { "--i": hero === "stack" || hero === "counter" ? step : order, ...(hero === "stack" && part ? { order: step } : {}) } as CSSProperties;

  // reveal: maske, iç blok maskeden yukarı kayar
  if (hero === "reveal") {
    return (
      <div className={className} style={{ ...style, overflow: "hidden", paddingBottom: "0.1em" }}>
        <div className="hero-item hero-item-reveal" style={vars}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`hero-item hero-item-${hero}${className ? ` ${className}` : ""}`} style={{ ...style, ...vars }}>
      {children}
    </div>
  );
}

/**
 * split: başlıklar harf harf, maskeli satırlardan yükselir; diğer bloklar
 * kelime kelime. GSAP + SplitText gerektiğinde yüklenir; hidrasyon geç
 * geldiyse (yavaş bağlantı) okunmuş içeriği yeniden oynatmaz.
 */
function SplitItem({
  children,
  order,
  className,
  style,
  force = false,
}: {
  children: ReactNode;
  order: number;
  className?: string;
  style?: CSSProperties;
  force?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || (!force && performance.now() > 2500)) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    Promise.all([import("gsap"), import("gsap/SplitText")]).then(([{ gsap }, { SplitText }]) => {
      if (cancelled) return;
      gsap.registerPlugin(SplitText);
      const heading = el.querySelector("h1, h2");
      const target = heading ?? el.querySelector("p") ?? null;

      if (target) {
        const isHeading = target === heading;
        // <p> üzerinde aria-label yasak (ARIA): paragraf için metni gizli kopyada bırak, parçaları gizle
        if (!isHeading) {
          const sr = document.createElement("span");
          sr.className = "sr-only";
          sr.textContent = target.textContent;
          target.parentElement?.insertBefore(sr, target);
        }
        const split = SplitText.create(target, {
          type: isHeading ? "lines,words,chars" : "lines,words",
          mask: "lines",
          aria: isHeading ? "auto" : "hidden",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(isHeading ? self.chars : self.words, {
              yPercent: 110,
              opacity: isHeading ? 1 : 0,
              duration: isHeading ? 1 : 0.8,
              ease: "power4.out",
              stagger: isHeading ? 0.018 : 0.03,
              delay: 0.15 + order * 0.12,
            }),
        });
        cleanup = () => split.revert();
      } else {
        const tween = gsap.from(el, { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.35 + order * 0.12 });
        cleanup = () => tween.kill();
      }
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [order, force]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
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
  const { hero, reduced, parallax } = useSiteMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Görsel kaydırırken içerikten yavaş gider: derinlik hissi, layout etkisi yok.
  // GSAP yalnız parallax açıksa ve ilk boyamadan sonra yüklenir.
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el || !parallax || reduced) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const section = el.closest("section") ?? el.parentElement;
      const tween = gsap.to(el, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [parallax, reduced]);

  // Parallax dış katmanda, giriş animasyonu iç katmanda: aynı transform'u yazmasınlar.
  if (hero === "none") {
    return (
      <div ref={parallaxRef} className={className} style={style}>
        {children}
      </div>
    );
  }

  const preset = hero === "split" ? "zoom" : hero;
  return (
    <div ref={parallaxRef} className={className} style={style}>
      <div className={`hero-media hero-media-${preset}`} style={{ position: "absolute", inset: 0 }}>
        {children}
      </div>
      {hero === "curtain" ? <div aria-hidden className="hero-curtain" /> : null}
    </div>
  );
}


/** The whole number remains one accessible name; digits animate in server HTML. */
export function HeroPhone({ phone }: { phone: string }) {
  const { hero } = useSiteMotion();
  if (hero !== "counter") return <>{phone}</>;
  return <><span className="sr-only">{phone}</span><span aria-hidden="true" className="hero-phone-digits">{Array.from(phone).map((char, i) =>
    <span key={i} className="hero-phone-digit" style={{ "--digit": Math.min(i, 13) } as CSSProperties}>{char === " " ? "\u00a0" : char}</span>
  )}</span></>;
}
