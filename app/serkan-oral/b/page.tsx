import type { Metadata } from "next";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { SerkanB } from "@/components/serkan-b/SerkanB";

/**
 * Kişisel sayfanın B tasarımı (Claude). Açık zemin, serif, telefon vitrini, JS yok.
 * Seçilene kadar noindex; seçilirse köke taşınır. Codex'in konseptleri kendi dalında
 * (/b/portre, /b/galeri, /b/afis) durur.
 */
export const metadata: Metadata = {
  title: "Serkan Oral — Tasarım B",
  robots: { index: false, follow: false, nocache: true },
};

export default function SerkanOralB() {
  return (
    <main className={FONT_PAIRINGS.soft.className} style={{ background: "#f2f4f0" }}>
      <SerkanB year={new Date().getFullYear()} />
    </main>
  );
}
