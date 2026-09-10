import type { Metadata } from "next";
import "./kutuphane.css";

export const metadata: Metadata = {
  title: "Tasarım kütüphanesi — Darphane",
  robots: { index: false, follow: false, nocache: true },
};

/** İç araç: reçeteler ve animasyonlar canlı görülür. Arama motorlarına kapalı (meta + X-Robots-Tag). */
export default function KutuphaneLayout({ children }: { children: React.ReactNode }) {
  return children;
}
