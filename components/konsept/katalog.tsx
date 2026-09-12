import type { CSSProperties, ReactNode } from "react";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { SiteImage } from "@/components/SiteImage";
import type { ConceptProps } from "./registry";
import "./katalog.css";

/**
 * Katalog — her şey tek ekranda, bento ızgara. Büyük karo isim + telefon; diğer karolar
 * açık/saat, puan, harita, hizmetler, iki fotoğraf, bir yorum, adres. Genişleyen karolar
 * <details>/<summary> ile açılır; JS yok. Mobilde 2, masaüstünde 4 sütun.
 */
type Tile = { key: string; className: string; body: ReactNode };

export default function Concept({ facts }: ConceptProps) {
  const review = facts.reviews[0];
  // Tek sütunlu karolar (açık/saat, puan) + fotoğraflar çift sayıda olsun ki ızgarada delik kalmasın.
  const singles = (facts.hoursRows && facts.open ? 1 : facts.telHref ? 1 : 0) + (facts.rating ? 1 : 0);
  const photoCount = singles % 2 === 0 ? 2 : facts.images.length >= 3 ? 3 : 1;
  const photos = facts.images.slice(0, photoCount);
  const moreReviews = facts.reviews.slice(1, 3);
  const today = facts.hoursRows?.find((r) => r.isToday);
  const tiles: Tile[] = [];

  tiles.push({
    key: "hero",
    className: "hero",
    body: (
      <>
        <p className="cat">{facts.category}</p>
        <h1>{facts.name}</h1>
        {facts.subline ? <p className="sub">{facts.subline}</p> : null}
        <div className="cta">
          {facts.telHref ? (
            <a href={facts.telHref} className="phone">
              {facts.phone}
            </a>
          ) : null}
          {facts.whatsappHref ? (
            <a href={facts.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn">
              WhatsApp
            </a>
          ) : null}
        </div>
      </>
    ),
  });

  if (facts.hoursRows && facts.open) {
    tiles.push({
      key: "open",
      className: "open",
      body: (
        <details>
          <summary>
            <span className={`state ${facts.open.status}`}>
              <span className="dot" aria-hidden="true" />
              {facts.open.status === "open" ? "Şu an açık" : "Şu an kapalı"}
            </span>
            <span className="big">{today?.value ?? facts.open.label}</span>
            <span className="small">{today ? `Bugün · ${today.label}` : ""}</span>
            <span className="more" aria-hidden="true" />
          </summary>
          <table>
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
        </details>
      ),
    });
  } else if (facts.telHref) {
    tiles.push({
      key: "open",
      className: "open",
      body: (
        <div className="stack">
          <span className="small">Çalışma saatleri</span>
          <span className="mid">Saatler için arayın</span>
          <a href={facts.telHref} className="link">
            {facts.phone}
          </a>
        </div>
      ),
    });
  }

  if (facts.rating) {
    tiles.push({
      key: "rating",
      className: "rating",
      body: (
        <div className="stack">
          <span className="score">{facts.rating.value.toLocaleString("tr-TR", { minimumFractionDigits: 1 })}</span>
          <span className="small">
            {facts.rating.count} {facts.rating.source} yorumu
          </span>
        </div>
      ),
    });
  }

  photos.forEach((img, i) => {
    tiles.push({
      key: `photo${i}`,
      className: "photo",
      body: <SiteImage image={img} sizes="(min-width: 64rem) 25vw, 50vw" priority={i === 0} />,
    });
  });

  if (facts.mapEmbedSrc) {
    tiles.push({
      key: "map",
      className: "map",
      body: (
        <>
          <iframe src={facts.mapEmbedSrc} title="Harita" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          {facts.directionsHref ? (
            <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer" className="btn float">
              Yol tarifi
            </a>
          ) : null}
        </>
      ),
    });
  }

  if (facts.services.length) {
    const head = facts.services.slice(0, 3);
    const rest = facts.services.length - head.length;
    tiles.push({
      key: "services",
      className: "services",
      body: (
        <details>
          <summary>
            <span className="small">Hizmetler</span>
            <span className="list">
              {head.map((s) => (
                <span key={s.name} className="chip">
                  {s.name}
                </span>
              ))}
              {rest > 0 ? <span className="chip ghost">+{rest}</span> : null}
            </span>
            <span className="more" aria-hidden="true" />
          </summary>
          <ul>
            {facts.services.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                {s.description ? <span>{s.description}</span> : null}
              </li>
            ))}
          </ul>
        </details>
      ),
    });
  }

  if (review) {
    tiles.push({
      key: "review",
      className: "review",
      body: (
        <details>
          <summary>
            <span className="small">
              {facts.rating ? `${facts.rating.source} yorumu` : "Yorum"}
            </span>
            <span className="quote">“{review.text}”</span>
            <span className="author">{review.author}</span>
            <span className="more" aria-hidden="true" />
          </summary>
          <ul>
            {moreReviews.map((r) => (
              <li key={r.author}>
                <p>“{r.text}”</p>
                <span className="author">{r.author}</span>
              </li>
            ))}
            {moreReviews.length === 0 ? <li className="empty">Tam metin yukarıda.</li> : null}
          </ul>
        </details>
      ),
    });
  }

  if (facts.address) {
    tiles.push({
      key: "address",
      className: "address",
      body: (
        <div className="stack">
          <span className="small">Adres</span>
          <span className="mid">{facts.address}</span>
          {facts.directionsHref ? (
            <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer" className="link">
              Yol tarifi
            </a>
          ) : null}
        </div>
      ),
    });
  }

  return (
    <main className={`k-katalog ${FONT_PAIRINGS.soft.className}`}>
      <div className="grid">
        {tiles.map((t, i) => (
          <section key={t.key} className={`tile ${t.className}`} style={{ "--i": i } as CSSProperties}>
            {t.body}
          </section>
        ))}
      </div>
      {facts.footerNote ? <p className="foot">{facts.footerNote}</p> : null}
    </main>
  );
}
