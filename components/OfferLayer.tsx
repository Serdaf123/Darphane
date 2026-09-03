"use client";

import type { ReactNode } from "react";
import { OfferExpired } from "@/components/OfferExpired";
import { formatPrice, purchaseUrl } from "@/lib/offer";
import type { Offer } from "@/lib/schema";
import { useNow } from "@/lib/useNow";

/**
 * Teklif katmanı. İşletme sitesinin kendisinden görsel olarak ayrışır:
 * işletme sahibi bu şeridin bizden geldiğini anlamalı, sitenin parçası sanmamalı.
 *
 * - draft   → sadece bize görünen önizleme şeridi (yanlışlıkla göndermeyi önler)
 * - pitched → canlı geri sayım + satın alma butonu
 * - sold    → hiçbir şey; site artık işletmenin
 *
 * Süresi dolmuş siteyi sunucu zaten hiç çizmez (app/[slug]/page.tsx).
 * Buradaki kontrol, sayfa açıkken sürenin dolduğu anı yakalar.
 */

const BAR_BG = "#0f1115";
const BAR_TEXT = "#f5f6f7";

function remaining(deadline: number, now: number) {
  const diff = deadline - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function CountdownBar({
  offer,
  businessName,
  now,
}: {
  offer: Offer;
  businessName: string;
  now: number | null;
}) {
  const deadline = offer.expiresAt ? new Date(offer.expiresAt).getTime() : null;
  const left = deadline !== null && now !== null ? remaining(deadline, now) : null;
  const href = purchaseUrl(offer, businessName);
  const price = formatPrice(offer);

  return (
    <div
      className="sticky top-0 z-50"
      style={{ background: BAR_BG, color: BAR_TEXT }}
      role="region"
      aria-label="Teklif bilgisi"
    >
      <div className="container flex flex-wrap items-center justify-between gap-3 py-2.5">
        <div className="flex flex-col">
          <p className="text-[0.9375rem] font-semibold leading-tight">
            Bu site {businessName} için hazırlandı
            {price ? ` · ${price}` : ""}
          </p>
          {/* Saat henüz yokken (SSR/hidrasyon) satır boş ama yükseklik sabit: zıplama olmaz */}
          <p
            className="text-xs leading-tight tabular-nums"
            style={{ color: "rgba(245,246,247,.68)", minHeight: "1rem" }}
          >
            {left ? (
              <>
                Yayından kalkmasına{" "}
                <span className="font-semibold" style={{ color: BAR_TEXT }}>
                  {left.days > 0 ? `${left.days} gün ` : ""}
                  {String(left.hours).padStart(2, "0")}:
                  {String(left.minutes).padStart(2, "0")}:
                  {String(left.seconds).padStart(2, "0")}
                </span>{" "}
                kaldı
              </>
            ) : deadline !== null ? (
              <>
                Son gün:{" "}
                {new Date(deadline).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                })}
              </>
            ) : null}
          </p>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: "#22c55e",
              color: "#07130b",
              minHeight: "2.5rem",
              padding: "0.5rem 1.125rem",
              fontSize: "0.875rem",
            }}
          >
            Sitemi Satın Al
          </a>
        ) : null}
      </div>
    </div>
  );
}

function DraftBar({ businessName }: { businessName: string }) {
  return (
    <div
      className="sticky top-0 z-50"
      style={{ background: "#7c2d12", color: "#fff7ed" }}
      role="region"
      aria-label="İç önizleme"
    >
      <div className="container py-2 text-sm font-semibold">
        TASLAK · {businessName} · henüz gönderilmedi, teklif şeridi kapalı
      </div>
    </div>
  );
}

export function OfferLayer({
  offer,
  businessName,
  children,
}: {
  offer: Offer;
  businessName: string;
  children: ReactNode;
}) {
  const now = useNow();
  const deadline =
    offer.status === "pitched" && offer.expiresAt ? new Date(offer.expiresAt).getTime() : null;
  const expired = deadline !== null && now !== null && deadline <= now;

  if (expired) return <OfferExpired offer={offer} businessName={businessName} />;

  return (
    <>
      {offer.status === "draft" ? <DraftBar businessName={businessName} /> : null}
      {offer.status === "pitched" ? (
        <CountdownBar offer={offer} businessName={businessName} now={now} />
      ) : null}
      {children}
    </>
  );
}
