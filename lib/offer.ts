import { whatsappUrl } from "./actions";
import type { Offer } from "./schema";

/** Teklif şeridi ve süre dolumu ekranı ortak kullanır. */

export function formatPrice(offer: Offer): string | null {
  if (!offer.price) return null;
  const currency = offer.currency === "TRY" ? "₺" : offer.currency;
  return `${offer.price.toLocaleString("tr-TR")} ${currency}`;
}

export function purchaseUrl(offer: Offer, businessName: string, variant?: "a" | "b"): string | undefined {
  if (!offer.seller) return undefined;
  const price = formatPrice(offer);
  return whatsappUrl(
    offer.seller.whatsapp,
    `Merhaba, ${businessName} için hazırladığınız web sitesini satın almak istiyorum${
      price ? ` (${price})` : ""
    }.${variant ? ` Tasarım ${variant.toUpperCase()}'yi istiyorum.` : ""}`
  );
}
