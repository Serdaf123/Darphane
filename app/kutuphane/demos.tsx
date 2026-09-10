"use client";

import { useState, type CSSProperties } from "react";
import { ContactFab } from "@/components/ContactFab";
import { HeroItem, HeroMedia, HeroPhone } from "@/components/motion/HeroMotion";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import type { Business, Motion } from "@/lib/schema";

/** Demolar motorun gerçek bileşenlerini kullanır (HeroItem, HeroMedia, Reveal, ContactFab): sitede ne varsa o. */

const IMG = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=900&q=60&auto=format&fit=crop";

function Replay({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="lib-replay" onClick={onClick}>
      Tekrar oynat
    </button>
  );
}

export function HeroDemo({ preset, style, title }: { preset: Motion["hero"]; style: CSSProperties; title: string }) {
  const [run, setRun] = useState(0);
  const motion: Motion = { hero: preset, scroll: "none", smooth: false, parallax: false };
  return (
    <div className="lib-demo">
      <div key={run} className="site-root lib-hero" style={style}>
        <MotionProvider motion={motion}>
          <HeroMedia className="lib-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG} alt="" loading="lazy" />
          </HeroMedia>
          <div className="lib-hero-scrim" aria-hidden />
          <div className="lib-hero-copy">
            <HeroItem order={0} part="badges" replay>
              <span className="lib-pill">Şu an açık · 24 saat</span>
            </HeroItem>
            <HeroItem order={1} part="headline" replay>
              <h3>{preset === "counter" ? <HeroPhone phone="0532 570 77 32" /> : title}</h3>
            </HeroItem>
            <HeroItem order={2} part="subline" replay>
              <p>Adnan Menderes Caddesi&apos;nde, haftanın yedi günü açık.</p>
            </HeroItem>
            <HeroItem order={3} part="actions" replay>
              <span className="lib-btn">WhatsApp&apos;tan yazın</span>
            </HeroItem>
          </div>
        </MotionProvider>
      </div>
      <Replay onClick={() => setRun((r) => r + 1)} />
    </div>
  );
}

export function ScrollDemo({ preset, style }: { preset: Motion["scroll"]; style: CSSProperties }) {
  const [run, setRun] = useState(0);
  const motion: Motion = { hero: "none", scroll: preset, smooth: false, parallax: false };
  return (
    <div className="lib-demo">
      <div key={run} className="site-root lib-scroll" style={style}>
        <MotionProvider motion={motion}>
          <Reveal>
            <h3>Kaydırınca beliren başlık</h3>
          </Reveal>
          <Stagger className="lib-cards">
            {["Muayene", "Aşı", "Ameliyat"].map((t) => (
              <Item key={t} className="lib-card">
                <strong>{t}</strong>
                <span>Kısa açıklama satırı.</span>
              </Item>
            ))}
          </Stagger>
        </MotionProvider>
      </div>
      <Replay onClick={() => setRun((r) => r + 1)} />
    </div>
  );
}

export function FabDemo({ style, business, fab }: { style: CSSProperties; business: Business; fab: "dial" | "pill" }) {
  const motion: Motion = { hero: "none", scroll: "none", smooth: false, parallax: false };
  return (
    <div className="site-root lib-fab" style={style}>
      <MotionProvider motion={motion}>
        <p className="lib-fab-hint">Sağ alttaki butona dokun</p>
        <ContactFab business={business} style={fab} whatsappMessage="Merhaba, kütüphane denemesi." />
      </MotionProvider>
    </div>
  );
}
