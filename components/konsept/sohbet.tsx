import type { CSSProperties, ReactNode } from "react";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { SiteImage } from "@/components/SiteImage";
import type { ConceptProps } from "./registry";
import { SohbetComposer } from "./sohbet.client";
import "./sohbet.css";

/**
 * Sohbet — sayfa bir mesajlaşma ekranı. İşletme sırayla yazar (baloncuklar CSS gecikmesiyle
 * belirir), ziyaretçi alttaki kutuya yazar ve "Gönder" gerçek WhatsApp sohbetini açar.
 * Marka yeşili yok: sakin çivit + kâğıt tonu; zemin deseni ince noktalı kumaş.
 */
function waNumber(href?: string): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href).pathname.replace(/\D/g, "") || undefined;
  } catch {
    return undefined;
  }
}

type Bubble = { key: string; className?: string; body: ReactNode };

export default function Concept({ facts }: ConceptProps) {
  const number = waNumber(facts.whatsappHref);
  const status = facts.open?.label;
  const review = facts.reviews[0];
  const photo = facts.images[0];
  const initial = facts.name.trim().charAt(0).toUpperCase();

  // Baloncuk sırası: her biri yalnız verisi varsa çizilir; sırası CSS gecikmesi olur.
  const bubbles: Bubble[] = [
    {
      key: "hi",
      body: (
        <>
          <p className="lead">Merhaba, biz {facts.name}.</p>
          {facts.subline ? <p>{facts.subline}</p> : null}
        </>
      ),
    },
  ];

  if (facts.hoursRows) {
    bubbles.push({
      key: "hours",
      body: (
        <>
          <p className="lead">Çalışma saatlerimiz</p>
          <table className="hours">
            <tbody>
              {facts.hoursRows.map((r) => (
                <tr key={r.day} className={r.isToday ? "today" : undefined}>
                  <th scope="row">{r.label}</th>
                  <td>{r.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {facts.hours?.note ? <p className="note">{facts.hours.note}</p> : null}
        </>
      ),
    });
  }

  if (facts.services.length) {
    bubbles.push({
      key: "services",
      body: (
        <>
          <p className="lead">Verdiğimiz hizmetler</p>
          <ul className="services">
            {facts.services.map((s) => (
              <li key={s.name}>{s.name}</li>
            ))}
          </ul>
        </>
      ),
    });
  }

  if (photo) {
    bubbles.push({
      key: "photo",
      className: "photo",
      body: (
        <div className="frame">
          <SiteImage image={photo} sizes="(min-width: 720px) 420px, 80vw" priority />
        </div>
      ),
    });
  }

  if (facts.mapEmbedSrc || facts.address) {
    bubbles.push({
      key: "where",
      className: "map",
      body: (
        <>
          {facts.mapEmbedSrc ? (
            <div className="frame">
              <iframe src={facts.mapEmbedSrc} title="Harita" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : null}
          <div className="map-text">
            {facts.address ? <p>{facts.address}</p> : null}
            {facts.directionsHref ? (
              <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer" className="pill">
                Yol tarifi
              </a>
            ) : null}
          </div>
        </>
      ),
    });
  }

  if (review) {
    bubbles.push({
      key: "review",
      body: (
        <>
          <p className="lead">
            {facts.rating
              ? `${facts.rating.source}'da ${facts.rating.value.toLocaleString("tr-TR")} · ${facts.rating.count} yorum`
              : "Bir yorum"}
          </p>
          <blockquote>
            <p>“{review.text}”</p>
            <footer>{review.author}</footer>
          </blockquote>
        </>
      ),
    });
  }

  if (facts.phone) {
    bubbles.push({
      key: "phone",
      body: (
        <>
          <p className="lead">Acilse arayın</p>
          <a href={facts.telHref} className="pill">
            {facts.phone}
          </a>
        </>
      ),
    });
  }

  return (
    <main className={`k-sohbet ${FONT_PAIRINGS.clean.className}`}>
      <div className="screen">
        <header className="bar">
          <span className="avatar" aria-hidden="true">
            {initial}
          </span>
          <div className="who">
            <h1>{facts.name}</h1>
            <p className="status">
              {status ? (
                <>
                  <span className={`dot ${facts.open?.status === "open" ? "on" : ""}`} aria-hidden="true" />
                  {status}
                </>
              ) : (
                facts.category
              )}
            </p>
          </div>
          {facts.telHref ? (
            <a href={facts.telHref} className="call">
              Ara
            </a>
          ) : null}
        </header>

        <ol className="thread" aria-label="Sohbet">
          <li className="day" aria-hidden="true">
            Bugün
          </li>
          {bubbles.map((b, i) => (
            <li key={b.key} className={`msg ${b.className ?? ""}`} style={{ "--i": i } as CSSProperties}>
              {b.body}
            </li>
          ))}
        </ol>

        <SohbetComposer number={number} defaultText={facts.whatsappMessage} telHref={facts.telHref} phone={facts.phone} />
      </div>
    </main>
  );
}
