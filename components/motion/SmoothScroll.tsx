"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect, type ReactNode } from "react";
import { useSiteMotion } from "./MotionProvider";

/**
 * Lenis yumuşak kaydırma (theme.motion.smooth). Doğal scroll'un üstünde
 * çalışır: sticky şerit/header, çapalar ve erişilebilirlik bozulmaz.
 * "Hareketi azalt" açıksa devreye girmez.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const { smooth, reduced } = useSiteMotion();
  if (!smooth || reduced) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.1, smoothWheel: true }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}

/** ScrollTrigger'ı Lenis'e bağlar; çapa tıklamalarını yumuşak kaydırmaya çevirir. */
function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    // ScrollTrigger yalnız yüklüyse güncellenir; yoksa (parallax kapalı) hiç indirilmez
    let update: (() => void) | undefined;
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      update = () => ScrollTrigger.update();
      lenis.on("scroll", update);
    });

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link || link.getAttribute("href") === "#") return;
      const target = document.querySelector<HTMLElement>(link.getAttribute("href")!);
      if (!target) return;
      event.preventDefault();
      // Şerit + header'ın altında kalmasın
      const offerH = parseFloat(getComputedStyle(target).getPropertyValue("--offer-h")) || 0;
      const headerH = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      lenis.scrollTo(target, { offset: -(offerH + headerH + 12), duration: 1.2 });
      history.replaceState(null, "", link.getAttribute("href"));
    };
    document.addEventListener("click", onClick);

    return () => {
      if (update) lenis.off("scroll", update);
      document.removeEventListener("click", onClick);
    };
  }, [lenis]);

  return null;
}
