import type { Metadata } from "next";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { siteUrl } from "@/lib/site-url";
import { SerkanSite } from "@/components/serkan/SerkanSite";

/**
 * Serkan'ın kişisel tanıtım sayfası. Kök (/) bunu yeniden dışa aktarır ve
 * kanonik olan odur; bu yol (/serkan-oral) yalnız alan adı yönlendirmesi ve
 * paylaşım linkleri için durur, indekslenmez. data/sites/serkan-oral.json
 * yalnız alan adı / robots ayarlarını taşır.
 */

const TITLE = "Serkan Oral | İşletmeniz için hazır site";
const DESC = "Serkan Oral, işletmeniz için siteyi önce hazırlar. Beğenirseniz tek seferlik ücretle yayınlar; alan adı kurulumu dahildir.";

export function serkanMetadata(indexable: boolean): Metadata {
  const base = siteUrl();
  return {
    title: TITLE,
    description: DESC,
    robots: indexable ? { index: true, follow: true } : { index: false, follow: true },
    alternates: { canonical: `${base}/` },
    openGraph: { title: TITLE, description: DESC, type: "website", locale: "tr_TR", url: `${base}/` },
  };
}

export const metadata: Metadata = serkanMetadata(false);

export function SerkanOralPage() {
  const base = siteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${base}/#business`,
        name: "Serkan Oral",
        alternateName: "fourpear",
        url: `${base}/`,
        telephone: "+905078463929",
        areaServed: { "@type": "Country", name: "Türkiye" },
        founder: { "@id": `${base}/#person` },
        description: DESC,
      },
      {
        "@type": "Person",
        "@id": `${base}/#person`,
        name: "Serkan Oral",
        url: `${base}/`,
        telephone: "+905078463929",
        image: `${base}/sites/serkan-oral/serkan.webp`,
        worksFor: { "@id": `${base}/#business` },
      },
    ],
  };
  return (
    <main className={FONT_PAIRINGS.craft.className} style={{ background: "#0b0e17", colorScheme: "dark" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SerkanSite year={new Date().getFullYear()} />
    </main>
  );
}

export default SerkanOralPage;
