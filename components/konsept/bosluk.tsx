import { FONT_PAIRINGS } from "@/lib/fonts";
import type { ConceptProps } from "./registry";
import "./bosluk.css";

/** Boşluk: her ekranda tek cümle, çok boşluk; sonunda telefon. */
export default function Concept({ facts }: ConceptProps) {
  const lines: { text: string; kind?: string }[] = [];
  lines.push({ text: facts.name, kind: "name" });
  if (facts.subline) lines.push({ text: facts.subline });
  if (facts.address) lines.push({ text: facts.address, kind: "addr" });
  if (facts.open) lines.push({ text: facts.open.label, kind: facts.open.status === "open" ? "open" : "closed" });
  else if (facts.footerNote) lines.push({ text: facts.footerNote });
  if (facts.services.length) lines.push({ text: facts.services.map((s) => s.name).join(", ") + ".", kind: "services" });
  if (facts.reviews[0]) lines.push({ text: `“${facts.reviews[0].text}”`, kind: "quote" });
  const total = lines.length + 1;
  return (
    <main className={`k-bosluk ${FONT_PAIRINGS.soft.className}`}>
      <ol className="dots" aria-hidden>
        {Array.from({ length: total }, (_, i) => <li key={i} />)}
      </ol>
      {lines.map((l, i) => (
        <section key={i} className={`screen ${l.kind ?? ""}`} aria-label={`${i + 1}. cümle`}>
          {l.kind === "name" ? <h1>{l.text}</h1> : l.kind === "quote" ? (
            <blockquote><p>{l.text}</p><cite>{facts.reviews[0].author}</cite></blockquote>
          ) : <p>{l.text}</p>}
        </section>
      ))}
      <section className="screen last" aria-label="İletişim">
        {facts.phone ? <a className="phone" href={facts.telHref}>{facts.phone}</a> : <p>{facts.name}</p>}
        <div className="acts">
          {facts.telHref ? <a className="btn" href={facts.telHref}>Arayın</a> : null}
          {facts.whatsappHref ? <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp&apos;tan yazın</a> : null}
          {facts.directionsHref ? <a className="btn quiet" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a> : null}
        </div>
        {facts.hoursRows ? (
          <details className="hours">
            <summary>Çalışma saatleri</summary>
            <ul>{facts.hoursRows.map((r) => <li key={r.day} className={r.isToday ? "today" : undefined}><span>{r.label}</span><span>{r.value}</span></li>)}</ul>
          </details>
        ) : null}
      </section>
    </main>
  );
}
