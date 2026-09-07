"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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

type VariantLinks = { a: string; b: string };

/** "Tasarım A · B" — işletme sahibi tek linkten iki dünyayı gezer; seçim mesaja yazılır */
function VariantSwitch({ variant, links }: { variant: "a" | "b"; links: VariantLinks }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 text-xs" aria-label="Tasarım seçenekleri">
      <span className="hidden sm:inline" style={{ color: "rgba(245,246,247,.6)" }}>
        Tasarım
      </span>
      {(["a", "b"] as const).map((v) => (
        <a
          key={v}
          href={links[v]}
          aria-current={v === variant ? "page" : undefined}
          className="rounded px-1.5 py-0.5 font-semibold"
          style={{
            color: v === variant ? "#07130b" : BAR_TEXT,
            background: v === variant ? "#22c55e" : "rgba(245,246,247,.12)",
            textDecoration: "none",
          }}
        >
          {v.toUpperCase()}
        </a>
      ))}
    </span>
  );
}

function CountdownBar({
  offer,
  businessName,
  slug,
  now,
  variant,
  variantLinks,
}: {
  offer: Offer;
  businessName: string;
  slug: string;
  now: number | null;
  variant: "a" | "b";
  variantLinks?: VariantLinks;
}) {
  const deadline = offer.expiresAt ? new Date(offer.expiresAt).getTime() : null;
  const left = deadline !== null && now !== null ? remaining(deadline, now) : null;
  const href = purchaseUrl(offer, businessName, variantLinks ? variant : undefined);
  const price = formatPrice(offer);

  return (
    <div
      data-offer-bar
      style={{ background: BAR_BG, color: BAR_TEXT }}
      role="region"
      aria-label="Teklif bilgisi"
    >
      {/* Telefonda buton alta düşmesin: metin sütunu daralır, buton sabit kalır */}
      <div className="offer-bar-inner container flex items-center justify-between gap-3 py-2.5">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[0.9375rem] font-semibold leading-tight">
            <span className="hidden sm:inline">Bu site </span>
            {businessName} için hazırlandı
            {price ? ` · ${price}` : ""}
          </p>
          {/* Bu satır SSR'da "Son gün", hidrasyonda geri sayım gösterir. İkisi de
              TEK satır kalmalı — taşarsa şerit büyür, altındaki her şey kayar (CLS). */}
          <p
            className="truncate text-xs leading-tight tabular-nums"
            style={{ color: "rgba(245,246,247,.68)", minHeight: "1rem", whiteSpace: "nowrap" }}
          >
            {left ? (
              <>
                <span className="hidden sm:inline">Yayından kalkmasına </span>
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

        <div className="offer-bar-actions flex shrink-0 items-center gap-2">
          {variantLinks ? <VariantSwitch variant={variant} links={variantLinks} /> : null}
          {/* "Ne alıyorum?" sayfası: fiyat, dahil olanlar, alan adı, süreç — parmakla tutulur buton */}
          <a
            href={`/${slug}/teklif${variant === "b" ? "?tasarim=b" : ""}`}
            className="btn whitespace-nowrap"
            style={{ background: "transparent", color: BAR_TEXT, border: "1px solid rgba(245,246,247,.35)", minHeight: "2.75rem", padding: "0.5rem 0.9rem", fontSize: "0.875rem" }}
          >
            Detaylar
          </a>

          {/* Ödeme linki varsa karar anında ödeme; WhatsApp soru için kalır */}
          {offer.paymentUrl ? (
            <a
              href={offer.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn whitespace-nowrap"
              style={{
                background: "#22c55e",
                color: "#07130b",
                minHeight: "2.75rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
              }}
            >
              Ödemeye Geç
            </a>
          ) : null}
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn whitespace-nowrap"
              style={{
                background: offer.paymentUrl ? "transparent" : "#22c55e",
                color: offer.paymentUrl ? BAR_TEXT : "#07130b",
                border: offer.paymentUrl ? "1px solid rgba(245,246,247,.35)" : undefined,
                minHeight: "2.75rem",
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
              }}
            >
              {offer.paymentUrl ? (
                <>
                  <span className="sm:hidden">Sor</span>
                  <span className="hidden sm:inline">Soru Sor</span>
                </>
              ) : (
                "Sitemi Satın Al"
              )}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DraftBar({
  businessName,
  variant,
  variantLinks,
}: {
  businessName: string;
  variant: "a" | "b";
  variantLinks?: VariantLinks;
}) {
  return (
    <div
      data-offer-bar
      style={{ background: "#7c2d12", color: "#fff7ed" }}
      role="region"
      aria-label="İç önizleme"
    >
      <div className="container flex items-center justify-between gap-3 py-2 text-sm font-semibold">
        <span className="min-w-0">TASLAK · {businessName} · henüz gönderilmedi, teklif şeridi kapalı</span>
        {variantLinks ? <VariantSwitch variant={variant} links={variantLinks} /> : null}
      </div>
    </div>
  );
}

export function OfferLayer({
  offer,
  businessName,
  slug,
  children,
  variant = "a",
  variantLinks,
}: {
  offer: Offer;
  businessName: string;
  /** /[slug]/teklif bağlantısı için */
  slug: string;
  children: ReactNode;
  variant?: "a" | "b";
  /** İki tasarım varsa şeritte A · B geçişi */
  variantLinks?: VariantLinks;
}) {
  const now = useNow();
  const deadline =
    offer.status === "pitched" && offer.expiresAt ? new Date(offer.expiresAt).getTime() : null;
  const expired = deadline !== null && now !== null && deadline <= now;

  // Şeridin yüksekliği --offer-h olarak yayınlanır: header onun altına yapışır,
  // çapalar onun altında kalmaz. Şerit yoksa 0.
  const barRef = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) {
      setBarHeight(0);
      return;
    }
    const update = () => setBarHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [offer.status]);

  if (expired) return <OfferExpired offer={offer} businessName={businessName} />;

  const bar =
    offer.status === "draft" ? (
      <DraftBar businessName={businessName} variant={variant} variantLinks={variantLinks} />
    ) : offer.status === "pitched" ? (
      <CountdownBar
        offer={offer}
        businessName={businessName}
        slug={slug}
        now={now}
        variant={variant}
        variantLinks={variantLinks}
      />
    ) : null;

  return (
    <div style={{ "--offer-h": `${barHeight}px` } as React.CSSProperties}>
      {bar ? (
        <div ref={barRef} className="sticky top-0 z-50">
          {bar}
        </div>
      ) : null}
      {children}
    </div>
  );
}
