import type { ConceptProps } from "./registry";
import "./fis.css";

/**
 * Fiş — kasa fişi. Beyaz dar şerit, monospace, zikzak kenar; hizmetler noktalı kılavuzla satır satır,
 * "TOPLAM" yerine ARA ve WHATSAPP; alt bilgi adres, saatler, teşekkür. Yüklenirken yukarıdan yazdırılır.
 */
export default function Concept({ facts }: ConceptProps) {
  const now = new Date();
  const tz = facts.hours?.timezone ?? "Europe/Istanbul";
  const date = new Intl.DateTimeFormat("tr-TR", { timeZone: tz, day: "2-digit", month: "2-digit", year: "numeric" }).format(now);
  const time = new Intl.DateTimeFormat("tr-TR", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
  const ymd = Object.fromEntries(
    new Intl.DateTimeFormat("en", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now).map((x) => [x.type, x.value]),
  );
  const receiptNo = `${ymd.year}${ymd.month}${ymd.day}`; // fiş no = günün tarihi, uydurma sayı yok
  const open = facts.open && facts.open.status !== "unknown" ? facts.open : undefined;
  const reviews = facts.reviews.slice(0, 2);

  return (
    <main className="k-fis" lang="tr">
      <div className="tezgah">
        <div className="yuva" aria-hidden />
        <article className="fis">
          <header className="baslik">
            <h1>{facts.name}</h1>
            <p className="kat">{facts.category}</p>
            {facts.address ? <p className="adres">{facts.address}</p> : null}
            {facts.phone && facts.telHref ? (
              <a className="tel" href={facts.telHref}>
                TEL {facts.phone}
              </a>
            ) : null}
          </header>

          <p className="cizgi" aria-hidden />

          <dl className="meta">
            <div>
              <dt>FİŞ NO</dt>
              <dd>{receiptNo}</dd>
            </div>
            <div>
              <dt>TARİH</dt>
              <dd>{date}</dd>
            </div>
            <div>
              <dt>SAAT</dt>
              <dd>{time}</dd>
            </div>
            {open ? (
              <div className={`durum ${open.status}`}>
                <dt>DURUM</dt>
                <dd>{open.label.toLocaleUpperCase("tr-TR")}</dd>
              </div>
            ) : null}
          </dl>

          {facts.services.length ? (
            <>
              <p className="cizgi" aria-hidden />
              <h2>HİZMETLER</h2>
              <ul className="kalemler">
                {facts.services.map((s) => (
                  <li key={s.name}>
                    <span className="satir">
                      <span className="ad">{s.name.toLocaleUpperCase("tr-TR")}</span>
                      <span className="isaret" aria-hidden>
                        ✓
                      </span>
                    </span>
                    {s.description ? <span className="aciklama">{s.description}</span> : null}
                  </li>
                ))}
              </ul>
              {facts.servicesIntro ? <p className="dip">{facts.servicesIntro}</p> : null}
            </>
          ) : null}

          {facts.rating || reviews.length ? (
            <>
              <p className="cizgi" aria-hidden />
              {facts.rating ? (
                <p className="satir puan">
                  <span className="ad">
                    {facts.rating.source.toLocaleUpperCase("tr-TR")} {facts.rating.count} YORUM
                  </span>
                  <span className="deger">{facts.rating.value.toLocaleString("tr-TR")}</span>
                </p>
              ) : null}
              {reviews.length ? (
                <ul className="yorumlar">
                  {reviews.map((r) => (
                    <li key={r.author}>
                      <p>&ldquo;{r.text}&rdquo;</p>
                      <span>{r.author}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          ) : null}

          <p className="cizgi kalin" aria-hidden />
          <div className="toplam">
            {facts.telHref && facts.phone ? (
              <a className="btn" href={facts.telHref}>
                <span>ARA</span>
                <span>{facts.phone}</span>
              </a>
            ) : null}
            {facts.whatsappHref ? (
              <a className="btn" href={facts.whatsappHref} target="_blank" rel="noopener noreferrer">
                <span>WHATSAPP</span>
                <span>YAZIN</span>
              </a>
            ) : facts.directionsHref ? (
              <a className="btn" href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
                <span>YOL TARİFİ</span>
                <span>HARİTA</span>
              </a>
            ) : null}
          </div>
          <p className="cizgi kalin" aria-hidden />

          <footer className="alt">
            {facts.hoursRows ? (
              <>
                <h2>ÇALIŞMA SAATLERİ</h2>
                <ul className="saatler">
                  {facts.hoursRows.map((r) => (
                    <li key={r.day} className={`satir${r.isToday ? " bugun" : ""}`}>
                      <span className="ad">{r.label.toLocaleUpperCase("tr-TR")}</span>
                      <span className="deger">{r.value}</span>
                    </li>
                  ))}
                </ul>
                {facts.hours?.note ? <p className="dip">{facts.hours.note}</p> : null}
              </>
            ) : facts.footerNote ? (
              <p className="dip">{facts.footerNote}</p>
            ) : null}
            {facts.address ? (
              <p className="adres">
                {facts.address}
                {facts.directionsHref ? (
                  <>
                    <br />
                    <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer">
                      YOL TARİFİ
                    </a>
                  </>
                ) : null}
              </p>
            ) : null}
            <p className="tesekkur">TEŞEKKÜRLER</p>
            <div className="barkod" aria-hidden />
            {facts.phone ? <p className="barkod-yazi">{facts.phone}</p> : null}
          </footer>
        </article>
      </div>
    </main>
  );
}
