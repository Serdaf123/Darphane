import { purchaseUrl } from "@/lib/offer";
import type { Offer } from "@/lib/schema";

/**
 * Teklif süresi dolduğunda sitenin yerine geçen ekran.
 * Sunucu tarafında da çizilebilsin diye ayrı dosyada: süresi dolmuş bir sitede
 * işletmenin içeriği HTML'e hiç girmez.
 */
export function OfferExpired({
  offer,
  businessName,
}: {
  offer: Offer;
  businessName: string;
}) {
  const href = purchaseUrl(offer, businessName);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "#0f1115", color: "#f5f6f7" }}
    >
      <div className="flex w-full max-w-lg flex-col gap-5 text-center">
        <p
          className="text-xs font-semibold uppercase"
          style={{ letterSpacing: "0.16em", color: "rgba(245,246,247,.55)" }}
        >
          Teklif süresi doldu
        </p>
        <h1
          style={{
            fontSize: "var(--step-4)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          {businessName} için hazırlanan site yayından kaldırıldı
        </h1>
        <p style={{ color: "rgba(245,246,247,.72)", lineHeight: 1.65, margin: 0 }}>
          Tanıtım süresi bitti. Siteyi yeniden yayına almak isterseniz bize yazmanız yeterli.
        </p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mx-auto"
            style={{ background: "#22c55e", color: "#07130b" }}
          >
            Yeniden Yayına Al
          </a>
        ) : null}
        {offer.seller ? (
          <p className="text-sm" style={{ color: "rgba(245,246,247,.5)", margin: 0 }}>
            {offer.seller.name}
          </p>
        ) : null}
      </div>
    </main>
  );
}
