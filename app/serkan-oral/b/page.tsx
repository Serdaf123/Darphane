import type { Metadata } from "next";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { Concepts } from "@/components/serkan-b/Concepts";
import "@/components/serkan-b/concepts.css";

export const metadata: Metadata = {
  title: "Serkan Oral — Üç tasarım yönü",
  robots: { index: false, follow: false, nocache: true },
};

export default function SerkanOralB() {
  return <div className={FONT_PAIRINGS.craft.className}><Concepts /></div>;
}
