import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { DefterTabs, type DefterTab } from "./defter.client";
import type { ConceptProps } from "./registry";
import "./defter.css";

/**
 * Defter — muayenehane defteri. Çizgili kâğıt, sol kırmızı marj, sağda dikey sekmeler.
 * Her satır çizgi adımına (--step) kilitli; hareket yok, aktif sekme kalınlaşır.
 */
export default function Concept({ facts }: ConceptProps) {
  const hasServices = facts.services.length > 0;
  const hasHours = !!facts.hoursRows?.length;
  const hasReviews = facts.reviews.length > 0;
  const hasLocation = !!(facts.address || facts.mapEmbedSrc);
  const tabs: DefterTab[] = [
    { id: "bilgi", label: "Bilgi" },
    ...(hasServices ? [{ id: "hizmetler", label: "Hizmetler" }] : []),
    ...(hasHours ? [{ id: "saatler", label: "Saatler" }] : []),
    ...(hasReviews ? [{ id: "yorumlar", label: "Yorumlar" }] : []),
    ...(hasLocation ? [{ id: "konum", label: "Konum" }] : []),
  ];
  // Masaüstünde ilk görsel başlığın yanında yüzer; mobilde şeritte gösterilir (CSS seçer).
  const photos = facts.images.slice(0, 4);
  const rating = facts.rating
    ? `${facts.rating.source}'da ${facts.rating.count} yorum, ortalama ${facts.rating.value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
    : undefined;

  return (
    <main className={`k-defter ${FONT_PAIRINGS.noto.className}`}>
      <div className="sheet">
        <DefterTabs tabs={tabs} />
        <article className="paper">
          <section id="bilgi" className="sec">
            <p className="cat">{facts.category}</p>
            <h1>{facts.name}</h1>
            {facts.heroImage ? (
              <figure className="photo photo-hero">
                <div className="ph"><SiteImage image={facts.heroImage} sizes="(min-width: 60rem) 16rem, 100vw" priority /></div>
              </figure>
            ) : null}
            {facts.subline ? <p className="lead">{facts.subline}</p> : null}
            {facts.open?.label ? <p className={`state ${facts.open.status}`}>{facts.open.label}</p> : null}
            {facts.hours?.note && !facts.open ? <p className="muted">{facts.hours.note}</p> : null}
            <div className="acts">
              {facts.telHref ? (
                <a className="btn primary" href={facts.telHref}>
                  Ara <span className="num">{facts.phone}</span>
                </a>
              ) : null}
              {facts.whatsappHref ? (
                <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              ) : null}
              {facts.directionsHref ? (
                <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
                  Yol tarifi
                </a>
              ) : null}
            </div>
            {facts.address ? <p className="muted">{facts.address}</p> : null}
            {facts.about?.body ? <p>{facts.about.body}</p> : null}
            {photos.length ? (
              <div className="strip">
                {photos.map((img, i) => (
                  <figure key={img.src} className={`photo ${i === 0 ? "is-hero" : ""}`}>
                    <div className="ph"><SiteImage image={img} sizes="(min-width: 60rem) 14rem, 33vw" /></div>
                  </figure>
                ))}
              </div>
            ) : null}
          </section>

          {hasServices ? (
            <section id="hizmetler" className="sec">
              <h2>Hizmetler</h2>
              {facts.servicesIntro ? <p className="muted">{facts.servicesIntro}</p> : null}
              <ul className="list">
                {facts.services.map((s) => (
                  <li key={s.name}>
                    <strong>{s.name}</strong>
                    {s.description ? <span> {s.description}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hasHours ? (
            <section id="saatler" className="sec">
              <h2>Çalışma saatleri</h2>
              <table className="hours">
                <tbody>
                  {facts.hoursRows!.map((r) => (
                    <tr key={r.day} className={`${r.isToday ? "today" : ""} ${r.isClosed ? "closed" : ""}`}>
                      <th scope="row">{r.label}{r.isToday ? <em> bugün</em> : null}</th>
                      <td>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facts.hours?.note ? <p className="muted">{facts.hours.note}</p> : null}
            </section>
          ) : null}

          {hasReviews ? (
            <section id="yorumlar" className="sec">
              <h2>Yorumlar</h2>
              {rating ? <p className="muted">{rating}</p> : null}
              {facts.reviews.map((r) => (
                <blockquote key={r.author + r.text.slice(0, 12)} className="quote">
                  <p>{r.text}</p>
                  <footer>{r.author}</footer>
                </blockquote>
              ))}
            </section>
          ) : null}

          {hasLocation ? (
            <section id="konum" className="sec">
              <h2>Konum</h2>
              {facts.address ? <p>{facts.address}</p> : null}
              {facts.directionsHref ? (
                <p>
                  <a className="link" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi al</a>
                </p>
              ) : null}
              {facts.mapEmbedSrc ? (
                <div className="map">
                  <iframe src={facts.mapEmbedSrc} loading="lazy" title="Harita" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                </div>
              ) : null}
            </section>
          ) : null}

          <footer className="foot">
            {facts.footerNote ? <p className="muted">{facts.footerNote}</p> : null}
            <p className="muted">{facts.name}{facts.phone ? `, ${facts.phone}` : ""}</p>
          </footer>
        </article>
      </div>
    </main>
  );
}
