"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { SiteImage as SiteImageData } from "@/lib/schema";

/**
 * Önce/sonra kaydırıcı: range input erişilebilir omurga (klavye, ekran okuyucu),
 * üstteki görsel clip-path ile kesilir. Sürükleme = input'un kendi davranışı.
 */
export function CompareSlider({
  before,
  after,
  labels,
}: {
  before: SiteImageData;
  after: SiteImageData;
  labels: { before: string; after: string; aria: string };
}) {
  const [pos, setPos] = useState(50);
  const id = useId();
  return (
    <div className="compare relative aspect-4/3 select-none overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
      <Image src={after.src} alt={after.alt} fill sizes="(min-width: 640px) 45vw, 90vw" style={{ objectFit: "cover" }} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before.src} alt={before.alt} fill sizes="(min-width: 640px) 45vw, 90vw" style={{ objectFit: "cover" }} />
      </div>
      <span className="compare-label" style={{ left: "0.75rem" }}>{labels.before}</span>
      <span className="compare-label" style={{ right: "0.75rem" }}>{labels.after}</span>
      <div aria-hidden className="compare-handle" style={{ left: `${pos}%` }}>
        <span className="compare-knob">⇔</span>
      </div>
      <label htmlFor={id} className="sr-only">
        {labels.aria}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="compare-input"
        aria-valuetext={`${labels.before} %${pos}`}
      />
    </div>
  );
}
