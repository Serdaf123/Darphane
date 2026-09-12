"use client";

import { useState, type ReactNode } from "react";

/** Kartvizit: dokununca döner. Reduced-motion'da iki yüz alt alta (CSS). */
export function FlipCard({ front, back }: { front: ReactNode; back: ReactNode }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`card${flipped ? " flipped" : ""}`}>
      <div className="face front" aria-hidden={flipped}>{front}</div>
      <div className="face back" aria-hidden={!flipped}>{back}</div>
      <button type="button" className="flip" aria-pressed={flipped} onClick={() => setFlipped((v) => !v)}>
        {flipped ? "Ön yüz" : "Kartı çevir"}
      </button>
    </div>
  );
}
