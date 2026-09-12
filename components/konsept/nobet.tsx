import { FONT_PAIRINGS } from "@/lib/fonts";
import { NobetDial } from "./nobet.client";
import type { ConceptProps } from "./registry";
import "./nobet.css";

/** Nöbet: telefon numarası sayfanın kendisi; 24 saatlik kadran şu anki saati gösterir. */
export default function Concept({ facts }: ConceptProps) {
  const isOpen = facts.open?.status === "open";
  const allDay = facts.hoursRows?.every((r) => r.value === "24 saat açık" || r.value.includes("24"));
  return (
    <main className={`k-nobet ${FONT_PAIRINGS.plex.className}`}>
      <header className="top">
        <p className="status">
          {facts.open ? (
            <>
              <span className={`dot${isOpen ? " on" : ""}`} aria-hidden />
              {facts.open.label}
            </>
          ) : (
            <>{facts.category}</>
          )}
        </p>
        <p className="name">{facts.name}</p>
      </header>

      <section className="phone-block" aria-label="Telefon">
        <p className="lead">{facts.urgent?.title ?? "Acil için önce arayın"}</p>
        {facts.phone ? (
          <a className="phone" href={facts.telHref}>{facts.phone}</a>
        ) : null}
        <p className="under">
          {allDay ? "Haftanın yedi günü, gece gündüz." : facts.subline}
        </p>
        <div className="acts">
          {facts.telHref ? <a className="btn primary" href={facts.telHref}>Hemen ara</a> : null}
          {facts.whatsappHref ? <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp&apos;tan yaz</a> : null}
        </div>
      </section>

      {facts.hours ? (
        <section className="dial-block" aria-label="Çalışma saatleri">
          <NobetDial hours={facts.hours} />
          <ul className="hours">
            {facts.hoursRows?.map((r) => (
              <li key={r.day} className={r.isToday ? "today" : undefined}>
                <span>{r.label}</span>
                <span>{r.value}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {facts.services.length ? (
        <section className="list" aria-label="Hizmetler">
          <h1 className="h">{facts.headline}</h1>
          <ol>
            {facts.services.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                {s.description ? <span>{s.description}</span> : null}
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <h1 className="h sr">{facts.headline}</h1>
      )}

      {facts.reviews.length ? (
        <section className="quotes" aria-label="Yorumlar">
          {facts.rating ? <p className="rating">{facts.rating.value.toLocaleString("tr-TR")} · {facts.rating.count} yorum · {facts.rating.source}</p> : null}
          {facts.reviews.slice(0, 2).map((r) => (
            <blockquote key={r.author}>
              <p>{r.text}</p>
              <cite>{r.author}</cite>
            </blockquote>
          ))}
        </section>
      ) : null}

      <section className="where" aria-label="Adres">
        {facts.address ? <p className="addr">{facts.address}</p> : null}
        <div className="acts">
          {facts.directionsHref ? <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a> : null}
          {facts.telHref ? <a className="btn primary" href={facts.telHref}>{facts.phone}</a> : null}
        </div>
        {facts.footerNote ? <p className="note">{facts.footerNote}</p> : null}
      </section>
    </main>
  );
}
