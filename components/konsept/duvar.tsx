import { FONT_PAIRINGS } from "@/lib/fonts";
import type { ConceptProps } from "./registry";
import { SnapRoot } from "./duvar.client";
import "./duvar.css";

/**
 * Duvar — üç afiş. Mobilde üst üste, tam ekran, kaydırma-yakalamalı; masaüstünde yan yana üç sütun.
 * (1) isim + tek cümle + telefon, (2) hizmetler dev liste, (3) yorumlar + adres + saatler.
 * Her afiş kendi zemin rengi; dev sıkışık grotesk; metin kenara dayalı.
 * Hareket: afiş içeri girerken hafif eğik yapıştırılmış kâğıt düzelir (scroll-driven; fallback durağan).
 */
export default function Concept({ facts }: ConceptProps) {
  const f = facts;
  const rating = f.rating ? String(f.rating.value).replace(".", ",") : undefined;
  const reviews = f.reviews.slice(0, 2);
  const today = f.hoursRows?.find((r) => r.isToday);

  return (
    <main className={`k-duvar ${FONT_PAIRINGS.bold.className}`}>
      <SnapRoot />
      <div className="wall">
        {/* 1 — kim, açık mı, nasıl ulaşırım */}
        <section className="poster p1" style={{ "--i": 0 } as React.CSSProperties} aria-label="İşletme">
          <div className="sheet">
            <div className="top">
              <p className="cat">{f.category}</p>
              {f.open && f.open.status !== "unknown" ? (
                <p className={`open ${f.open.status}`}>{f.open.label}</p>
              ) : today ? (
                <p className="open">Bugün {today.value}</p>
              ) : null}
            </div>
            <div className="bottom">
              <h1>{f.name}</h1>
              {f.subline ? <p className="lead">{f.subline}</p> : null}
              {f.phone && f.telHref ? (
                <a className="phone" href={f.telHref}>
                  {f.phone}
                </a>
              ) : null}
              <div className="acts">
                {f.telHref ? (
                  <a className="btn" href={f.telHref}>
                    Ara
                  </a>
                ) : null}
                {f.whatsappHref ? (
                  <a className="btn" href={f.whatsappHref} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* 2 — hizmetler dev liste */}
        {f.services.length ? (
          <section className="poster p2" style={{ "--i": 1 } as React.CSSProperties} aria-labelledby="k-duvar-hizmetler">
            <div className="sheet">
              <h2 id="k-duvar-hizmetler" className="cat">
                Hizmetler
              </h2>
              <ol className="services">
                {f.services.map((s) => (
                  <li key={s.name}>
                    <span className="sname">{s.name}</span>
                    {s.description ? <span className="sdesc">{s.description}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {/* 3 — yorumlar, saatler, adres */}
        <section className="poster p3" style={{ "--i": 2 } as React.CSSProperties} aria-label="Yorumlar ve adres">
          <div className="sheet">
            <div className="top">
              {f.rating ? (
                <p className="score">
                  <span className="num">{rating}</span>
                  <span className="of">
                    {f.rating.count} yorum
                    <br />
                    {f.rating.source}
                  </span>
                </p>
              ) : null}
              {reviews.length ? (
                <ul className="reviews">
                  {reviews.map((r) => (
                    <li key={r.author}>
                      <blockquote>
                        <p>{r.text}</p>
                        <footer>{r.author}</footer>
                      </blockquote>
                    </li>
                  ))}
                </ul>
              ) : f.about?.body ? (
                <p className="about">{f.about.body}</p>
              ) : null}
            </div>
            <div className="bottom">
              {f.hoursRows?.length ? (
                <ul className="hours" aria-label="Çalışma saatleri">
                  {f.hoursRows.map((r) => (
                    <li key={r.day} className={r.isToday ? "today" : undefined}>
                      <span>{r.label}</span>
                      <span>{r.value}</span>
                    </li>
                  ))}
                </ul>
              ) : f.footerNote ? (
                <p className="note">{f.footerNote}</p>
              ) : null}
              {f.address ? <p className="addr">{f.address}</p> : null}
              <div className="acts">
                {f.directionsHref ? (
                  <a className="btn" href={f.directionsHref} target="_blank" rel="noopener noreferrer">
                    Yol tarifi
                  </a>
                ) : null}
                {f.telHref ? (
                  <a className="btn ghost" href={f.telHref}>
                    Ara
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
