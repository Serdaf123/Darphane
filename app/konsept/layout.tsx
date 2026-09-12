import type { Metadata } from "next";
import "../kutuphane/kutuphane.css";

export const metadata: Metadata = {
  title: "Konseptler — Darphane",
  robots: { index: false, follow: false, nocache: true },
};

/** 15 tasarım konsepti; iç araç, arama motorlarına kapalı. */
export default function KonseptLayout({ children }: { children: React.ReactNode }) {
  return children;
}
