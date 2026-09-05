"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
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
}: {
  business: Business;
  locale?: Locale;
  whatsappMessage?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { reduced } = useSiteMotion();
  const s = t(locale);

  const wa = (business.whatsapp ?? business.phone)
    ? whatsappUrl((business.whatsapp ?? business.phone)!, whatsappMessage ?? s.whatsappDefault(business.name))
    : undefined;
  const tel = business.phone ? `tel:${normalizePhone(business.phone)}` : undefined;

  // Esc kapatır; dışarı tıklama kapatır
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
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
        className={`contact-fab contact-fab-main ${className}`}
        aria-label={items[0].label}
        {...(items[0].external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {items[0].icon}
      </a>
    );
  }

  return (
    <div className={`contact-fab ${className}`}>
      <AnimatePresence>
        {open ? (
          <motion.ul
            key="menu"
            className="contact-fab-menu"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            role="menu"
          >
            {items.map((item, i) => (
              <motion.li
                key={item.label}
                role="none"
                initial={reduced ? false : { opacity: 0, y: 16, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { ...SPRING, delay: (items.length - 1 - i) * 0.05 } }}
                exit={{ opacity: 0, y: 10, scale: 0.7, transition: { duration: 0.12 } }}
              >
                <a
                  href={item.href}
                  role="menuitem"
                  className="contact-fab-item"
                  onClick={() => setOpen(false)}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="contact-fab-label">{item.label}</span>
                  <span className="contact-fab-circle" style={{ background: item.tone, color: "#fff" }}>
                    {item.icon}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="contact-fab-main"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? "Kapat" : `${s.bar.whatsapp} / ${s.bar.call}`}
        onClick={() => setOpen((v) => !v)}
        whileTap={reduced ? undefined : { scale: 0.92 }}
        animate={reduced ? undefined : { rotate: open ? 90 : 0 }}
        transition={SPRING}
      >
        <motion.span
          className="contact-fab-icon"
          initial={false}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.4 : 1 }}
          transition={{ duration: 0.18 }}
        >
          <WhatsappIcon />
        </motion.span>
        <motion.span
          className="contact-fab-icon"
          initial={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.4, rotate: open ? -90 : 0 }}
          transition={{ duration: 0.18 }}
          aria-hidden
        >
          <CloseIcon />
        </motion.span>
        {/* Kapalıyken dikkat çekmek için tek seferlik halka */}
        {!open && !reduced ? <span className="contact-fab-pulse" aria-hidden /> : null}
      </motion.button>
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
