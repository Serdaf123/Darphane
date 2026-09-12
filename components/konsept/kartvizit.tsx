import { FONT_PAIRINGS } from "@/lib/fonts";
import { FlipCard } from "./kartvizit.client";
import type { ConceptProps } from "./registry";
import "./kartvizit.css";

/** Kartvizit: ilk ekran bir kartvizit; arkası harita ve saatler. */
export default function Concept({ facts }: ConceptProps) {
  const front = (
    <>
      <p className="cat">{facts.category}</p>
      <h1 className="name">{facts.name}</h1>
      <div className="lines">
        {facts.phone ? <a href={facts.telHref} className="line phone">{facts.phone}</a> : null}
        {facts.address ? <p className="line">{facts.address}</p> : null}
        {facts.open ? <p className={`line ${facts.open.status}`}>{facts.open.label}</p> : null}
      </div>
    </>
  );
  const back = (
    <>
      {facts.mapEmbedSrc ? <iframe className="map" src={facts.mapEmbedSrc} title="Harita" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : null}
      <div className="back-body">
        {facts.hoursRows ? (
          <ul className="hours">
            {facts.hoursRows.map((r) => <li key={r.day} className={r.isToday ? "today" : undefined}><span>{r.label}</span><span>{r.value}</span></li>)}
          </ul>
        ) : facts.footerNote ? <p className="note">{facts.footerNote}</p> : null}
        <div className="acts">
          {facts.whatsappHref ? <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
          {facts.directionsHref ? <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a> : null}
        </div>
      </div>
    </>
  );
  return (
    <main className={`k-kartvizit ${FONT_PAIRINGS.editorial.className}`}>
      <section className="stage" aria-label="Kartvizit">
        <FlipCard front={front} back={back} />
      </section>
      <section className="rest" aria-label="Ayrıntılar">
        {facts.services.length ? (
          <p className="row"><span className="k">Hizmetler</span><span>{facts.services.map((s) => s.name).join(", ")}</span></p>
        ) : null}
        {facts.rating ? (
          <p className="row"><span className="k">{facts.rating.source}</span><span>{facts.rating.value.toLocaleString("tr-TR")} · {facts.rating.count} yorum</span></p>
        ) : null}
        {facts.reviews[0] ? (
          <p className="row"><span className="k">Bir yorum</span><span>“{facts.reviews[0].text}” — {facts.reviews[0].author}</span></p>
        ) : null}
        {facts.team.length ? (
          <p className="row"><span className="k">Hekim</span><span>{facts.team.map((m) => m.name).join(", ")}</span></p>
        ) : null}
        <div className="acts bottom">
          {facts.telHref ? <a className="btn primary" href={facts.telHref}>Ara</a> : null}
          {facts.whatsappHref ? <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
          {facts.directionsHref ? <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a> : null}
        </div>
      </section>
    </main>
  );
}
