import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import type { ConceptProps } from "./registry";
import "./manset.css";

/**
 * Manşet — gazete ilk sayfası. Serif başlık (nameplate), kesik grotesk manşet, üç sütun
 * düz metin, "Okur mektupları" kutusu, saat tablosu, tek kırmızı çizgi.
 */
export default function Concept({ facts }: ConceptProps) {
  const date = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long", timeZone: "Europe/Istanbul" }).format(new Date());
  const headline = facts.subline ?? facts.tagline ?? [facts.category, facts.district].filter(Boolean).join(", ");
  const stamp = facts.open ? (facts.open.status === "open" ? "Bugün açık" : facts.open.status === "closed" ? "Bugün kapalı" : undefined) : undefined;
  const rightEar = facts.whatsappHref
    ? { href: facts.whatsappHref, small: "WhatsApp", big: "Yazın", ext: true }
    : facts.directionsHref
      ? { href: facts.directionsHref, small: "Adres", big: "Yol tarifi", ext: true }
      : undefined;
  const rating = facts.rating
    ? `${facts.rating.source}'da ${facts.rating.count} yorum, ortalama ${facts.rating.value.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`
    : undefined;
  const photos = facts.images.slice(0, 2);

  return (
    <main className={`k-manset ${FONT_PAIRINGS.craft.className}`}>
      <header className="mast">
        <div className="folio">
          <time>{date}</time>
          <span className="folio-mid">{facts.category}{facts.district ? `, ${facts.district}` : ""}</span>
          {stamp ? <span className={`stamp ${facts.open?.status}`}>{stamp}</span> : null}
        </div>
        <div className="nameplate">
          {facts.telHref ? (
            <a className="ear" href={facts.telHref}>
              <small>Ara</small>
              <b>{facts.phone}</b>
            </a>
          ) : (
            <span className="ear ear-empty" aria-hidden="true" />
          )}
          <h1>{facts.name}</h1>
          {rightEar ? (
            <a className="ear" href={rightEar.href} target="_blank" rel="noopener noreferrer">
              <small>{rightEar.small}</small>
              <b>{rightEar.big}</b>
            </a>
          ) : (
            <span className="ear ear-empty" aria-hidden="true" />
          )}
        </div>
        <div className="rule" aria-hidden="true" />
      </header>

      <section className="lead">
        <h2 className="headline">{headline}</h2>
        {facts.open?.label || facts.address ? (
          <p className="deck">
            {facts.open?.label ? <strong>{facts.open.label}. </strong> : null}
            {facts.address ? <span>{facts.address}.</span> : null}
          </p>
        ) : null}
      </section>

      <section className="body">
        {facts.heroImage ? (
          <figure className="fig">
            <div className="ph">
              <SiteImage image={facts.heroImage} sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 100vw" priority />
            </div>
            <figcaption>{facts.heroImage.alt}</figcaption>
          </figure>
        ) : null}

        {facts.about ? (
          <article className="story">
            <h3>{facts.about.title}</h3>
            <p>{facts.about.body}</p>
            {facts.about.highlights.length ? (
              <dl className="facts">
                {facts.about.highlights.map((h) => (
                  <div key={h.label}>
                    <dt>{h.label}</dt>
                    <dd>{h.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </article>
        ) : null}

        {facts.services.length ? (
          <article className="story">
            <h3>Hizmetler</h3>
            {facts.servicesIntro ? <p>{facts.servicesIntro}</p> : null}
            <ul className="services">
              {facts.services.map((s) => (
                <li key={s.name}>
                  <strong>{s.name}.</strong>
                  {s.description ? <span> {s.description}</span> : null}
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        {facts.team.length ? (
          <article className="story">
            <h3>{facts.team.length > 1 ? "Ekip" : "Hekim"}</h3>
            {facts.team.map((m) => (
              <p key={m.name}>
                <strong>{m.name}</strong>
                {m.role ? <span>, {m.role}</span> : null}
                {m.bio ? <span>. {m.bio}</span> : null}
              </p>
            ))}
          </article>
        ) : null}

        {photos[1] ? (
          <figure className="fig">
            <div className="ph">
              <SiteImage image={photos[1]} sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 45vw, 100vw" />
            </div>
            <figcaption>{photos[1].alt}</figcaption>
          </figure>
        ) : null}

        {facts.faq.length ? (
          <article className="story">
            <h3>Soru, cevap</h3>
            {facts.faq.map((f) => (
              <p key={f.q}>
                <strong>{f.q}</strong> {f.a}
              </p>
            ))}
          </article>
        ) : null}
      </section>

      {facts.reviews.length || facts.hoursRows?.length ? (
        <section className="boxes">
          {facts.reviews.length ? (
            <aside className="letters">
              <h3>Okur mektupları</h3>
              {rating ? <p className="note">{rating}</p> : null}
              {facts.reviews.map((r) => (
                <blockquote key={r.author + r.text.slice(0, 12)}>
                  <p>{r.text}</p>
                  <footer>{r.author}</footer>
                </blockquote>
              ))}
            </aside>
          ) : null}
          {facts.hoursRows?.length ? (
            <aside className="timetable">
              <h3>Çalışma saatleri</h3>
              <table>
                <tbody>
                  {facts.hoursRows.map((r) => (
                    <tr key={r.day} className={`${r.isToday ? "today" : ""} ${r.isClosed ? "closed" : ""}`}>
                      <th scope="row">{r.label}</th>
                      <td>{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {facts.hours?.note ? <p className="note">{facts.hours.note}</p> : null}
            </aside>
          ) : null}
        </section>
      ) : null}

      <footer className="kunye">
        <div className="where">
          <h3>Nerede</h3>
          {facts.address ? <p>{facts.address}</p> : null}
          {facts.mapEmbedSrc ? (
            <div className="map">
              <iframe src={facts.mapEmbedSrc} loading="lazy" title="Harita" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          ) : null}
        </div>
        <div className="reach">
          <h3>Ulaşın</h3>
          {facts.phone ? <p className="phone">{facts.phone}</p> : null}
          <div className="acts">
            {facts.telHref ? <a className="btn" href={facts.telHref}>Ara</a> : null}
            {facts.whatsappHref ? (
              <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            ) : null}
            {facts.directionsHref ? (
              <a className="btn ghost" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">Yol tarifi</a>
            ) : null}
          </div>
          {facts.footerNote ? <p className="note">{facts.footerNote}</p> : null}
          <p className="note">{facts.name}, {date}</p>
        </div>
      </footer>
    </main>
  );
}
