import type { Metadata } from "next";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { Concepts } from "@/components/serkan-b/Concepts";
import "@/components/serkan-b/concepts.css";
import "@/components/serkan-b/finished.css";

export const metadata: Metadata = {
  title: "Serkan Oral — Galeri",
  description: "İşletmeniz için web sitesi. Önce görün, sonra karar verin. Tek seferlik ücret; alan adı kurulumu dahil.",
  robots: { index: false, follow: false, nocache: true },
};

export default function Page() {
  return <div className={FONT_PAIRINGS.craft.className}><Concepts variant="galeri" /></div>;
}
