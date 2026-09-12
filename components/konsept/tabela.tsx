import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import type { ConceptProps } from "./registry";
import "./tabela.css";

/** "Şu an açık · 20:00'ye kadar" → "20:00'ye kadar" (büyük yüz zaten AÇIK/KAPALI der). */
function tail(label: string) {
  const parts = label.split(" · ");
  return parts.length > 1 ? parts.slice(1).join(" · ") : undefined;
}

/**
 * Tabela — dükkânın cephesi siteye taşınır: ışıklı isim tabelası, kapı etiketi (AÇIK/KAPALI),
 * mavi-beyaz sokak levhası; altında vitrin panelleri (fotoğraf, hizmetler, saatler, yorumlar, harita).
 */
export default function Concept({ facts }: ConceptProps) {
  const open = facts.open;
  const status: "acik" | "kapali" | "yok" = open?.status === "open" ? "acik" : open?.status === "closed" ? "kapali" : "yok";
  const parts = (facts.address ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((p) => p && p !== facts.district && p !== facts.city);
  const plaqueTop = parts.length > 1 ? parts[0] : undefined;
  const plaqueMain = parts.length > 1 ? parts.slice(1).join(", ") : parts[0];
  const plaqueFoot = [facts.district, facts.city].filter(Boolean).join(" / ");
  const reviews = facts.reviews.slice(0, 3);

  return (
    <main className={`k-tabela ${FONT_PAIRINGS.bold.className}`} lang="tr">
      <section className="cephe">
        <div className="tabela">
          <h1 className="isik">{facts.name}</h1>
          <p className="kategori">{facts.category}</p>
        </div>

        <div className="kapi-satir">
          <div className={`etiket ${status}`} aria-live="off">
            <span className="ip" aria-hidden />
            <div className="etiket-yuz">
              <strong>{status === "acik" ? "AÇIK" : status === "kapali" ? "KAPALI" : "SAATLER İÇİN ARAYIN"}</strong>
              {open && status !== "yok" && tail(open.label) ? <span>{tail(open.label)}</span> : null}
              {status === "yok" && facts.phone ? <span>{facts.phone}</span> : null}
            </div>
          </div>

          <div className="dugmeler">
            {facts.telHref && facts.phone ? (
              <a className="btn ara" href={facts.telHref}>
                <span>Ara</span>
                <strong>{facts.phone}</strong>
              </a>
            ) : null}
            {facts.whatsappHref ? (
              <a className="btn wa" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">
                <span>Yazın</span>
                <strong>WhatsApp</strong>
              </a>
            ) : facts.directionsHref ? (
              <a className="btn wa" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
                <span>Harita</span>
                <strong>Yol tarifi</strong>
              </a>
            ) : null}
          </div>

          {plaqueMain ? (
            <a className="levha" href={facts.directionsHref} target={facts.directionsHref ? "_blank" : undefined} rel="noopener noreferrer">
              <span className="levha-ic">
                {plaqueTop ? <span className="levha-ust">{plaqueTop}</span> : null}
                <span className="levha-ana">{plaqueMain}</span>
                {plaqueFoot ? <span className="levha-alt">{plaqueFoot}</span> : null}
                {facts.directionsHref ? <span className="levha-yol">Yol tarifi</span> : null}
              </span>
            </a>
          ) : null}
        </div>
      </section>

      <section className="vitrinler">
        {facts.heroImage ? (
          <figure className="vitrin foto">
            <div className="cam">
              <SiteImage image={facts.heroImage} priority sizes="(min-width: 900px) 60rem, 100vw" />
            </div>
            <figcaption>{facts.heroImage.alt}</figcaption>
          </figure>
        ) : null}

        {facts.services.length ? (
          <div className="vitrin">
            <h2>Hizmetler</h2>
            {facts.servicesIntro ? <p className="giris">{facts.servicesIntro}</p> : null}
            <ul className="hizmetler">
              {facts.services.map((s) => (
                <li key={s.name}>
                  <strong>{s.name}</strong>
                  {s.description ? <span>{s.description}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="vitrin saatler">
          <h2>Çalışma saatleri</h2>
          {facts.hoursRows ? (
            <table>
              <tbody>
                {facts.hoursRows.map((r) => (
                  <tr key={r.day} className={r.isToday ? "bugun" : r.isClosed ? "kapali" : undefined}>
                    <th scope="row">{r.label}</th>
                    <td>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="giris">{facts.footerNote ?? "Çalışma saatleri için arayın."}</p>
          )}
          {facts.hours?.note ? <p className="not">{facts.hours.note}</p> : null}
        </div>

        {facts.rating || reviews.length ? (
          <div className="vitrin yorumlar">
            <h2>Yorumlar</h2>
            {facts.rating ? (
              <p className="puan">
                <strong>{facts.rating.value.toLocaleString("tr-TR")}</strong>
                <span>
                  {facts.rating.source}, {facts.rating.count} yorum
                </span>
              </p>
            ) : null}
            {reviews.length ? (
              <ul>
                {reviews.map((r) => (
                  <li key={r.author}>
                    <p>{r.text}</p>
                    <cite>{r.author}</cite>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {facts.mapEmbedSrc ? (
          <div className="vitrin harita">
            <h2>Konum</h2>
            <div className="cam">
              <iframe src={facts.mapEmbedSrc} loading="lazy" title="Harita" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            </div>
            <p className="giris">
              {facts.address}
              {facts.directionsHref ? (
                <>
                  {" "}
                  <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
                    Yol tarifi
                  </a>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </section>

      <footer className="alt">
        <p>
          <strong>{facts.name}</strong>
          {facts.phone && facts.telHref ? (
            <>
              {" "}
              <a href={facts.telHref}>{facts.phone}</a>
            </>
          ) : null}
        </p>
        {facts.footerNote && facts.hoursRows ? <p>{facts.footerNote}</p> : null}
      </footer>
    </main>
  );
}
