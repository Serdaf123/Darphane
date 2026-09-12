import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import type { ConceptProps } from "./registry";
import "./perde.css";

/** Perde: sinema. Siyah bantlar, tam ekran sahneler, altyazı gibi yazılar; sonda "Ara". */
export default function Concept({ facts }: ConceptProps) {
  const imgs = facts.images;
  const scenes: { img?: typeof imgs[number]; body: React.ReactNode; kind: string }[] = [];
  scenes.push({ img: imgs[0], kind: "title", body: (
    <>
      <h1 className="title typed">{facts.name}</h1>
      <p className="sub">{facts.category}{facts.district ? ` · ${facts.district}` : ""}</p>
    </>
  ) });
  if (facts.subline) scenes.push({ img: imgs[1], kind: "line", body: <p className="sub big">{facts.subline}</p> });
  if (facts.services.length) scenes.push({ kind: "cast", body: (
    <div className="cast">
      <p className="cast-head">Hizmetler</p>
      {facts.services.map((s) => (
        <p key={s.name} className="cast-row"><span>{s.name}</span>{s.description ? <span className="muted">{s.description}</span> : null}</p>
      ))}
    </div>
  ) });
  if (facts.reviews[0]) scenes.push({ img: imgs[2], kind: "quote", body: (
    <blockquote className="quote">
      <p className="sub big">“{facts.reviews[0].text}”</p>
      <cite>{facts.reviews[0].author}{facts.rating ? ` · ${facts.rating.source} ${facts.rating.value.toLocaleString("tr-TR")}` : ""}</cite>
    </blockquote>
  ) });
  if (facts.hoursRows || facts.address) scenes.push({ img: imgs[3], kind: "where", body: (
    <div className="where">
      {facts.open ? <p className="sub">{facts.open.label}</p> : null}
      {facts.hoursRows ? (
        <ul className="hours">
          {facts.hoursRows.map((r) => <li key={r.day} className={r.isToday ? "today" : undefined}><span>{r.label}</span><span>{r.value}</span></li>)}
        </ul>
      ) : null}
      {facts.address ? <p className="sub">{facts.address}</p> : null}
    </div>
  ) });
  scenes.push({ kind: "end", body: (
    <div className="end">
      <p className="sub">Bir sorunuz varsa</p>
      {facts.phone ? <a className="phone" href={facts.telHref}>{facts.phone}</a> : null}
      <div className="acts">
        {facts.telHref ? <a className="btn primary" href={facts.telHref}>Ara</a> : null}
        {facts.whatsappHref ? <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a> : null}
        {facts.directionsHref ? <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a> : null}
      </div>
      {facts.footerNote ? <p className="sub small">{facts.footerNote}</p> : null}
    </div>
  ) });
  const total = scenes.length;
  return (
    <main className={`k-perde ${FONT_PAIRINGS.hospitality.className}`}>
      <div className="bar top" aria-hidden />
      <div className="bar bottom" aria-hidden />
      <div className="progress" aria-hidden><span /></div>
      {scenes.map((s, i) => (
        <section key={i} className={`scene scene-${s.kind}`} aria-label={`Sahne ${i + 1}`}>
          {s.img ? (
            <div className="frame">
              <SiteImage image={s.img} priority={i === 0} sizes="100vw" />
              <div className="tint" aria-hidden />
            </div>
          ) : null}
          <p className="counter" aria-hidden>Sahne {i + 1}/{total}</p>
          <div className="caption">{s.body}</div>
        </section>
      ))}
    </main>
  );
}
