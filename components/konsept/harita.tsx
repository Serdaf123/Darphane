import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { MapToggle } from "./harita.client";
import type { ConceptProps } from "./registry";
import "./harita.css";

/**
 * Harita — önce nerede. Google embed tam ekran arkada sabit; üstte yüzen kart
 * (isim, açık/kapalı, Yol tarifi birincil). Kaydırınca beyaz panel haritanın üstüne çıkar.
 * Harita yoksa (koordinat/adres yok) düz düzen.
 */
export default function Concept({ facts }: ConceptProps) {
  const hasMap = !!facts.mapEmbedSrc;
  const photos = facts.images.slice(0, 3);
  const rating = facts.rating
    ? `${facts.rating.source}'da ${facts.rating.count} yorum, ortalama ${facts.rating.value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
    : undefined;

  const actions = (
    <div className="acts">
      {facts.directionsHref ? (
        <a className="btn primary" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
          Yol tarifi
        </a>
      ) : null}
      <div className="row">
        {facts.telHref ? (
          <a className="btn" href={facts.telHref}>
            Ara
          </a>
        ) : null}
        {facts.whatsappHref ? (
          <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );

  return (
    <main className={`k-harita ${FONT_PAIRINGS.clean.className} ${hasMap ? "" : "no-map"}`} data-map="locked">
      {hasMap ? (
        <div className="map">
          <iframe src={facts.mapEmbedSrc} loading="eager" title="Harita" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      ) : null}

      <div className="stage">
        <section className="card">
          <p className="cat">{facts.category}</p>
          <h1>{facts.name}</h1>
          {facts.open?.label ? <p className={`state ${facts.open.status}`}>{facts.open.label}</p> : null}
          {!facts.open && facts.hours?.note ? <p className="state unknown">{facts.hours.note}</p> : null}
          {facts.address ? <p className="addr">{facts.address}</p> : null}
          {actions}
          {facts.phone ? <p className="phone">{facts.phone}</p> : null}
          {hasMap ? <MapToggle /> : null}
        </section>
      </div>

      <div className="panel">
        <div className="handle" aria-hidden="true" />
        <div className="inner">
          {facts.subline ? <p className="lead">{facts.subline}</p> : null}

          {facts.services.length ? (
            <section className="sec">
              <h2>Hizmetler</h2>
              {facts.servicesIntro ? <p className="muted">{facts.servicesIntro}</p> : null}
              <ul className="services">
                {facts.services.map((s) => (
                  <li key={s.name}>
                    <strong>{s.name}</strong>
                    {s.description ? <span>{s.description}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {facts.hoursRows?.length ? (
            <section className="sec">
              <h2>Çalışma saatleri</h2>
              <ul className="hours">
                {facts.hoursRows.map((r) => (
                  <li key={r.day} className={`${r.isToday ? "today" : ""} ${r.isClosed ? "closed" : ""}`}>
                    <span>{r.label}</span>
                    <span>{r.value}</span>
                  </li>
                ))}
              </ul>
              {facts.hours?.note ? <p className="muted">{facts.hours.note}</p> : null}
            </section>
          ) : null}

          {photos.length ? (
            <section className="sec">
              <h2>Fotoğraflar</h2>
              <div className="photos">
                {photos.map((img, i) => (
                  <figure key={img.src} className="ph">
                    <SiteImage image={img} sizes="(min-width: 48rem) 22rem, 100vw" priority={i === 0} />
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {facts.reviews.length ? (
            <section className="sec">
              <h2>Yorumlar</h2>
              {rating ? <p className="muted">{rating}</p> : null}
              <div className="reviews">
                {facts.reviews.map((r) => (
                  <blockquote key={r.author + r.text.slice(0, 12)}>
                    <p>{r.text}</p>
                    <footer>{r.author}</footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}

          <section className="sec contact">
            <h2>Adres</h2>
            {facts.address ? <p className="addr-big">{facts.address}</p> : null}
            {facts.phone ? <p className="phone">{facts.phone}</p> : null}
            {actions}
            {facts.footerNote ? <p className="muted">{facts.footerNote}</p> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
