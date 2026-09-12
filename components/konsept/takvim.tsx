import type { CSSProperties } from "react";
import { FONT_PAIRINGS } from "@/lib/fonts";
import { whatsappUrl } from "@/lib/actions";
import type { DayKey } from "@/lib/schema";
import type { ConceptProps } from "./registry";
import "./takvim.css";

/**
 * Takvim — ilk ekran haftalık şerit. Her gün bir sütun; açık saatler bir blok olarak
 * gün eksenine oturur, bugün vurgulu, kapalı gün çizili. Güne dokununca WhatsApp'a
 * "… günü için randevu istiyorum" metni hazır gider (düz bağlantı, JS yok).
 */
const SHORT: Record<DayKey, string> = { mon: "Pzt", tue: "Sal", wed: "Çar", thu: "Per", fri: "Cum", sat: "Cmt", sun: "Paz" };

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function waNumber(href?: string): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href).pathname.replace(/\D/g, "") || undefined;
  } catch {
    return undefined;
  }
}

export default function Concept({ facts }: ConceptProps) {
  const number = waNumber(facts.whatsappHref);
  const rows = facts.hoursRows;
  const days = facts.hours?.days;

  // Eksen: haftanın en erken açılışı ile en geç kapanışı, tam saate yuvarlanmış.
  let axisMin = 24 * 60;
  let axisMax = 0;
  if (days) {
    for (const key of Object.keys(days) as DayKey[]) {
      for (const r of days[key] ?? []) {
        const o = toMin(r.open);
        const c = r.close <= r.open ? 24 * 60 : toMin(r.close);
        axisMin = Math.min(axisMin, o);
        axisMax = Math.max(axisMax, c);
      }
    }
  }
  if (axisMin >= axisMax) {
    axisMin = 8 * 60;
    axisMax = 20 * 60;
  }
  axisMin = Math.floor(axisMin / 60) * 60;
  axisMax = Math.ceil(axisMax / 60) * 60;
  const span = axisMax - axisMin;
  const ticks: number[] = [];
  for (let t = axisMin; t <= axisMax; t += 60) ticks.push(t);
  const tickStep = ticks.length > 9 ? 2 : 1;

  return (
    <main className={`k-takvim ${FONT_PAIRINGS.plex.className}`}>
      <header className="top">
        <div className="title">
          <h1>{facts.name}</h1>
          <p className="cat">{facts.category}</p>
        </div>
        <div className="now">
          {facts.open ? (
            <p className={`state ${facts.open.status}`}>
              <span className="dot" aria-hidden="true" />
              {facts.open.label}
            </p>
          ) : null}
          <div className="actions">
            {facts.telHref ? (
              <a href={facts.telHref} className="btn ghost">
                Ara
              </a>
            ) : null}
            {facts.whatsappHref ? (
              <a href={facts.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn solid">
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <section className="week-wrap" aria-labelledby="k-takvim-hafta">
        <h2 id="k-takvim-hafta">{rows ? "Bu hafta" : "Çalışma saatleri"}</h2>
        {rows && days ? (
          <>
            <p className="hint">{number ? "Bir güne dokunun, o gün için randevu mesajı hazır gelsin." : "Randevu için arayın."}</p>
            <div className="week" style={{ "--rows": ticks.length - 1 } as CSSProperties}>
              <ol className="axis" aria-hidden="true">
                {ticks.map((t, i) => (
                  <li key={t} style={{ top: `${((t - axisMin) / span) * 100}%` }} className={i % tickStep ? "minor" : undefined}>
                    {String(t / 60).padStart(2, "0")}
                  </li>
                ))}
              </ol>
              <ol className="days">
                {rows.map((r, i) => {
                  const ranges = days[r.day] ?? [];
                  const closed = ranges.length === 0;
                  const label = `${r.label}: ${r.value}${r.isToday ? " (bugün)" : ""}`;
                  const body = (
                    <>
                      <span className="d">{SHORT[r.day]}</span>
                      <span className="track">
                        {ranges.map((rg, j) => {
                          const allDay = rg.open === "00:00" && rg.close === "00:00";
                          const o = allDay ? axisMin : toMin(rg.open);
                          const c = allDay ? axisMax : rg.close <= rg.open ? axisMax : toMin(rg.close);
                          return (
                            <span
                              key={j}
                              className="block"
                              style={{ top: `${((o - axisMin) / span) * 100}%`, height: `${((c - o) / span) * 100}%`, "--i": i } as CSSProperties}
                            />
                          );
                        })}
                        {closed ? <span className="x" aria-hidden="true" /> : null}
                      </span>
                      <span className="t">{closed ? "Kapalı" : ranges.map((rg) => `${rg.open}–${rg.close}`).join(" · ")}</span>
                    </>
                  );
                  const cls = `day${r.isToday ? " today" : ""}${closed ? " closed" : ""}`;
                  return (
                    <li key={r.day} className={cls}>
                      {number && !closed ? (
                        <a
                          href={whatsappUrl(number, `Merhaba, ${r.label} günü için randevu istiyorum.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${label} — bu gün için randevu iste`}
                        >
                          {body}
                        </a>
                      ) : (
                        <div aria-label={label}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
            {facts.hours?.note ? <p className="note">{facts.hours.note}</p> : null}
          </>
        ) : (
          <div className="no-hours">
            <p>Saatler için arayın.</p>
            {facts.telHref ? (
              <a href={facts.telHref} className="btn solid big">
                {facts.phone}
              </a>
            ) : null}
          </div>
        )}
      </section>

      {facts.services.length ? (
        <section className="services" aria-labelledby="k-takvim-hizmet">
          <h2 id="k-takvim-hizmet">Hizmetler</h2>
          {facts.servicesIntro ? <p className="intro">{facts.servicesIntro}</p> : null}
          <ul>
            {facts.services.map((s) => (
              <li key={s.name}>
                <strong>{s.name}</strong>
                {s.description ? <span>{s.description}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {facts.team.length ? (
        <section className="team" aria-labelledby="k-takvim-ekip">
          <h2 id="k-takvim-ekip">{facts.team.length === 1 ? "Hekim" : "Ekip"}</h2>
          <ul>
            {facts.team.map((m) => (
              <li key={m.name}>
                <strong>{m.name}</strong>
                {m.role ? <span className="role">{m.role}</span> : null}
                {m.bio ? <p>{m.bio}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {facts.reviews.length ? (
        <section className="reviews" aria-labelledby="k-takvim-yorum">
          <h2 id="k-takvim-yorum">
            {facts.rating ? `${facts.rating.source}'da ${facts.rating.value.toLocaleString("tr-TR")} · ${facts.rating.count} yorum` : "Yorumlar"}
          </h2>
          <ul>
            {facts.reviews.slice(0, 3).map((r) => (
              <li key={r.author}>
                <blockquote>
                  <p>{r.text}</p>
                  <footer>{r.author}</footer>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {facts.address || facts.mapEmbedSrc ? (
        <section className="where" aria-labelledby="k-takvim-konum">
          <h2 id="k-takvim-konum">Konum</h2>
          <div className="where-grid">
            <div className="addr">
              {facts.address ? <p>{facts.address}</p> : null}
              <div className="actions">
                {facts.directionsHref ? (
                  <a href={facts.directionsHref} target="_blank" rel="noopener noreferrer" className="btn solid">
                    Yol tarifi
                  </a>
                ) : null}
                {facts.telHref ? (
                  <a href={facts.telHref} className="btn ghost">
                    {facts.phone}
                  </a>
                ) : null}
              </div>
            </div>
            {facts.mapEmbedSrc ? (
              <div className="map">
                <iframe src={facts.mapEmbedSrc} title="Harita" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <footer className="foot">
        <p>{facts.name}</p>
        {facts.footerNote ? <p>{facts.footerNote}</p> : null}
      </footer>
    </main>
  );
}
