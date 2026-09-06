import type { Metadata } from "next";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { SerkanSite } from "@/components/serkan/SerkanSite";

/**
 * serkanoral.com.tr — Serkan'ın kişisel tanıtım sayfası. Motorun bölüm
 * sisteminden ayrı, ısmarlama bir sayfa. data/sites/serkan-oral.json yalnız
 * alan adı / robots / canonical ayarlarını taşır (status sold + domain).
 */

const TITLE = "Serkan Oral — İşletmeler için web sitesi";
const DESC = "Web sitesi olmayan işletmeler için siteyi önce yapıp sonra gösteriyorum. Beğenirseniz tek seferlik ücretle sizin; alan adı kurulumu dahil.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: true, follow: true },
  alternates: { canonical: "https://serkanoral.com.tr" },
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "tr_TR", url: "https://serkanoral.com.tr" },
};

export default function SerkanOralPage() {
  return (
    <main className={FONT_PAIRINGS.craft.className} style={{ background: "#0b0e17", colorScheme: "dark" }}>
      <SerkanSite />
    </main>
  );
}
