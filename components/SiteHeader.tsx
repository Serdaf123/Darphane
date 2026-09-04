"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { t, type Locale } from "@/lib/i18n";
import type { Business, Theme } from "@/lib/schema";
import type { NavCta, NavItem } from "@/lib/nav";

/**
 * Header. Teklif şeridinin hemen altına yapışır (top: --offer-h).
 *
 * glass: görselli hero'nun üstünde saydam ve beyaz yazılı başlar; 24px
 * kaydırınca buzlu cam zemine geçer. Diğer hero'larda baştan cam.
 * solid: hep dolu. minimal: menü yok, isim + buton. none: çizilmez.
 *
 * Mobilde menü gizli — tek sayfalık sitede alttaki Ara/Yol Tarifi/WhatsApp
 * barı zaten var; header'da isim ve tek buton yeter.
 */
export function SiteHeader({
  business,
  nav,
  cta,
  style,
  overImage,
  topHref,
  locale = "tr",
  switchHref,
}: {
  business: Business;
  nav: NavItem[];
  cta?: NavCta;
  style: Theme["header"];
  overImage: boolean;
  /** Marka tıklanınca gidilecek çapa (hero id'si) */
  topHref: string;
  locale?: Locale;
  /** Diğer dilin sayfası varsa oraya bağlantı (TR ⇄ EN) */
  switchHref?: string;
}) {
  const s = t(locale).header;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menüdeki bölümlerden ekranın üst yarısında olanı vurgula
  useEffect(() => {
    const targets = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [nav]);

  if (style === "none") return null;

  const transparent = style === "glass" && overImage && !scrolled;
  const showNav = style !== "minimal" && nav.length > 0;

  return (
    <header
      className={`site-header ${transparent ? "site-header-transparent" : "site-header-solid"} ${overImage ? "site-header-over" : ""}`}
      data-scrolled={scrolled || undefined}
    >
      <div className="container flex items-center justify-between gap-4">
        <a href={topHref} className="site-header-brand" aria-label={`${business.name} — ${s.backToTop}`}>
          {business.logo ? (
            <Image
              src={business.logo.src}
              alt={business.logo.alt}
              width={36}
              height={36}
              className="site-header-logo"
            />
          ) : null}
          <span className="site-header-name">{business.name}</span>
        </a>

        {showNav ? (
          <nav aria-label={s.sections} className="site-header-nav">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={active === item.href ? "location" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-3">
        {switchHref ? (
          <a href={switchHref} className="site-header-lang" aria-label={s.switchAria} hrefLang={locale === "tr" ? "en" : "tr"}>
            {s.switchTo}
          </a>
        ) : null}
        {cta ? (
          <a
            href={cta.href}
            className="btn btn-primary site-header-cta"
            {...(cta.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="sm:hidden">{cta.shortLabel}</span>
            <span className="hidden sm:inline">{cta.label}</span>
          </a>
        ) : null}
        </div>
      </div>
    </header>
  );
}
