"use client";

import { useEffect, useState } from "react";

/**
 * Arka plandaki harita varsayılan olarak kilitli (pointer-events yok) ki sayfa kaydırması
 * haritaya takılmasın. Bu düğme kilidi açıp kapatır; durum köke data-map ile yazılır.
 */
export function MapToggle() {
  const [live, setLive] = useState(false);
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".k-harita");
    if (root) root.dataset.map = live ? "live" : "locked";
  }, [live]);
  return (
    <button type="button" className="toggle" aria-pressed={live} onClick={() => setLive((v) => !v)}>
      {live ? "Haritayı kilitle" : "Haritayı gezin"}
    </button>
  );
}
