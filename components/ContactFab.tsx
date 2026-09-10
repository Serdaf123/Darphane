"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState, useRef, useId } from "react";
import { normalizePhone, whatsappUrl } from "@/lib/actions";
import { t, type Locale } from "@/lib/i18n";
import type { Business } from "@/lib/schema";
import { useSiteMotion } from "./motion/MotionProvider";

/**
 * Yüzen iletişim butonu (sağ alt). Kapalıyken tek yuvarlak WhatsApp ikonu;
 * dokununca yay efektiyle yukarı doğru "WhatsApp" ve "Ara" açılır, ikon ×'e döner.
 *
 * theme.contact:
 *   bar  → yalnızca alt bar (mobil)            fab  → yalnızca bu buton (her ekran)
 *   both → mobilde bar, masaüstünde bu buton (varsayılan)
 */
const SPRING = { type: "spring", stiffness: 520, damping: 30, mass: 0.7 } as const;

export function ContactFab({
  business,
  locale = "tr",
  whatsappMessage,
  className = "",
  style = "dial",
}: {
  business: Business;
  locale?: Locale;
  whatsappMessage?: string;
  className?: string;
  /** dial: yukarı açılan hızlı arama · pill: yana uzayan hap (tema rengi) */
  style?: "dial" | "pill";
}) {
  const [open, setOpen] = useState(false);
  const [openedOnce, setOpenedOnce] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const { reduced } = useSiteMotion();
  const s = t(locale);

  const wa = business.whatsapp
    ? whatsappUrl(business.whatsapp, whatsappMessage ?? s.whatsappDefault(business.name))
    : undefined;
  const tel = business.phone ? `tel:${normalizePhone(business.phone)}` : undefined;

  // Esc kapatır; dışarı tıklama kapatır
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); } };
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".contact-fab")) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("click", onClick);
    };
  }, [open]);

  if (!wa && !tel) return null;
  const items = [
    wa && { href: wa, label: s.bar.whatsapp, icon: <WhatsappIcon />, external: true, tone: "#22c55e" },
    tel && { href: tel, label: s.bar.call, icon: <PhoneIcon />, external: false, tone: "var(--c-accent)" },
  ].filter(Boolean) as { href: string; label: string; icon: React.ReactNode; external: boolean; tone: string }[];

  // Tek seçenek varsa açılır menüye gerek yok: doğrudan bağlantı
  if (items.length === 1) {
    return (
      <a
        href={items[0].href}
        className={`contact-fab contact-fab-main contact-fab-single ${className}`}
        aria-label={items[0].label}
        {...(items[0].external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {items[0].icon}
        <span>{items[0].label}</span>
      </a>
    );
  }

  if (style === "pill") {
    // Hap: ikon dokununca sola doğru uzar, içinde iki eylem belirir
    return (
      <div className={`contact-fab contact-fab-pill-wrap ${className}`}>
        <m.div
          className="contact-fab-pill"
          initial={false}
          animate={{ width: open ? "auto" : "3.75rem" }}
          transition={reduced ? { duration: 0 } : SPRING}
        >
          <AnimatePresence initial={false}>
            {open ? (
              <m.div
                key="acts"
                className="contact-fab-pill-actions"
                id={menuId} aria-label="İletişim seçenekleri"
                initial={reduced ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0, transition: reduced ? { duration: 0 } : { delay: 0.08, ...SPRING } }}
                exit={{ opacity: 0, x: reduced ? 0 : 12, transition: { duration: reduced ? 0 : 0.12 } }}
              >
                {items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}

                    className="contact-fab-pill-item"
                    onClick={() => setOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                ))}
              </m.div>
            ) : null}
          </AnimatePresence>
          <m.button
            type="button"
            className="contact-fab-pill-main"
            aria-expanded={open}
            aria-controls={open ? menuId : undefined}
        ref={trigger}
            aria-label={open ? "Kapat" : `${s.bar.whatsapp} / ${s.bar.call}`}
            onClick={() => { setOpenedOnce(true); setOpen((v) => !v); }}
            whileTap={reduced ? undefined : { scale: 0.94 }}
          >
            <m.span className="contact-fab-icon" initial={false} animate={{ opacity: open ? 0 : 1, rotate: open ? 90 : 0 }} transition={{ duration: reduced ? 0 : 0.18 }}>
              <WhatsappIcon />
            </m.span>
            <m.span className="contact-fab-icon" initial={false} animate={{ opacity: open ? 1 : 0, rotate: open ? 0 : -90 }} transition={{ duration: reduced ? 0 : 0.18 }} aria-hidden>
              <CloseIcon />
            </m.span>
          </m.button>
        </m.div>
      </div>
    );
  }

  return (
    <div className={`contact-fab ${className}`}>
      <AnimatePresence>
        {open ? (
          <m.ul
            key="menu"
            className="contact-fab-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15 } }}
            id={menuId} aria-label="İletişim seçenekleri"
          >
            {items.map((item, i) => (
              <m.li
                key={item.label}

                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: reduced ? { duration: 0 } : { ...SPRING, delay: (items.length - 1 - i) * 0.05 } }}
                exit={{ opacity: 0, y: reduced ? 0 : 10, scale: reduced ? 1 : 0.95, transition: { duration: reduced ? 0 : 0.12 } }}
              >
                <a
                  href={item.href}

                  className="contact-fab-item"
                  onClick={() => setOpen(false)}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="contact-fab-label">{item.label}</span>
                  <span className="contact-fab-circle" style={{ background: item.tone, color: "#fff" }}>
                    {item.icon}
                  </span>
                </a>
              </m.li>
            ))}
          </m.ul>
        ) : null}
      </AnimatePresence>

      <m.button
        type="button"
        className="contact-fab-main"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        ref={trigger}
        aria-label={open ? "Kapat" : `${s.bar.whatsapp} / ${s.bar.call}`}
        onClick={() => { setOpenedOnce(true); setOpen((v) => !v); }}
        whileTap={reduced ? undefined : { scale: 0.92 }}
        animate={reduced ? undefined : { rotate: open ? 90 : 0 }}
        transition={reduced ? { duration: 0 } : SPRING}
      >
        <m.span
          className="contact-fab-icon"
          initial={false}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          <WhatsappIcon />
        </m.span>
        <m.span
          className="contact-fab-icon"
          initial={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.4, rotate: open ? -90 : 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          aria-hidden
        >
          <CloseIcon />
        </m.span>
        {/* Kapalıyken dikkat çekmek için tek seferlik halka */}
        {!openedOnce && !open && !reduced ? <span className="contact-fab-pulse" aria-hidden /> : null}
      </m.button>
    </div>
  );
}

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
function WhatsappIcon() {
  return (
    <svg {...iconProps}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 20.5l1.8-5A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.8 9c0 3 2.2 5.2 5.2 5.2" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
