import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import type { Facts } from "./facts";
import type { ConceptProps } from "./registry";
import "./rozet.css";

/**
 * Rozet — etiketler duvarı. Doygun tek renk zemin (şeftali-turuncu), her olgu hafif döndürülmüş
 * bir yapışkan etiket; telefon etiketi en büyük; fotoğraflar yuvarlak "pul". Etiketler yüklenirken
 * sırayla "yapışır" (scale 1.15 → 1 + dönme); hareketi azalt açıkken durağan.
 */

const ROT = ["-3deg", "2deg", "-1.5deg", "3deg", "-2.5deg", "1.5deg", "-2deg", "2.5deg"];
/** Geniş etiketlerde açı küçük: 1000px genişlikte 3° satırları kaydırıp "hizasız" okunuyordu. */
const ROT_WIDE = ["-1deg", "0.8deg", "-0.7deg", "1deg"];
const SHORT: Record<string, string> = { mon: "Pzt", tue: "Sal", wed: "Çar", thu: "Per", fri: "Cum", sat: "Cmt", sun: "Paz" };

/** Ardışık aynı saatli günleri birleştirir: "Pzt–Cmt 10:00 - 20:00", "Paz 13:00 - 20:00". */
function compactHours(rows: NonNullable<Facts["hoursRows"]>) {
  const groups: { from: string; to: string; value: string; today: boolean }[] = [];
  for (const r of rows) {
    const last = groups[groups.length - 1];
    if (last && last.value === r.value) {
      last.to = r.day;
      last.today ||= r.isToday;
    } else groups.push({ from: r.day, to: r.day, value: r.value, today: r.isToday });
  }
  return groups.map((g) => ({ label: g.from === g.to ? SHORT[g.from] : `${SHORT[g.from]}–${SHORT[g.to]}`, value: g.value, today: g.today }));
}

type Sticker = { cls: string; m: number; d: number; node: React.ReactNode; key: string };

export default function Concept({ facts }: ConceptProps) {
  const f = facts;
  const rating = f.rating ? String(f.rating.value).replace(".", ",") : undefined;
  const imgs = f.images.slice(0, 4);
  const hours = f.hoursRows?.length ? compactHours(f.hoursRows) : [];
  const stickers: Sticker[] = [];
  const add = (s: Sticker) => stickers.push(s);
  const pul = (i: number, m = 1, d = 2) =>
    imgs[i]
      ? add({
          key: `pul-${i}`,
          cls: "pul",
          m,
          d,
          node: <SiteImage image={imgs[i]} sizes="(min-width: 900px) 33vw, 50vw" priority={i === 0} />,
        })
      : null;

  add({
    key: "name",
    cls: "stk name",
    m: 2,
    d: 4,
    node: (
      <>
        <h1>{f.name}</h1>
        <p className="cat">
          {f.category}
          {f.district ? ` · ${f.district}` : ""}
        </p>
      </>
    ),
  });
  if (f.open && f.open.status !== "unknown") {
    add({ key: "open", cls: `stk ${f.open.status === "open" ? "mint" : "rose"} open`, m: 1, d: 2, node: <p>{f.open.label}</p> });
  }
  pul(0, f.open && f.open.status !== "unknown" ? 1 : 2, 2);
  if (f.phone && f.telHref) {
    add({
      key: "phone",
      cls: "stk yellow phone",
      m: 2,
      d: 6,
      node: (
        <a href={f.telHref}>
          <span className="lbl">Ara</span>
          <span className="num">{f.phone}</span>
        </a>
      ),
    });
  }
  if (f.whatsappHref) {
    add({
      key: "wa",
      cls: "stk black wa",
      m: f.rating ? 1 : 2,
      d: 4,
      node: (
        <a href={f.whatsappHref} target="_blank" rel="noopener noreferrer">
          WhatsApp&apos;tan yazın
        </a>
      ),
    });
  }
  if (f.rating) {
    add({
      key: "rating",
      cls: "stk rating",
      m: f.whatsappHref ? 1 : 2,
      d: 4,
      node: (
        <p>
          <span className="num">{rating} ★</span>
          <span className="sub">
            {f.rating.count} yorum · {f.rating.source}
          </span>
        </p>
      ),
    });
  }
  if (hours.length) {
    add({
      key: "hours",
      cls: "stk hours",
      m: 2,
      d: 4,
      node: (
        <>
          <p className="lbl">Saatler</p>
          <ul>
            {hours.map((h) => (
              <li key={h.label} className={h.today ? "today" : undefined}>
                <span>{h.label}</span>
                <span>{h.value}</span>
              </li>
            ))}
          </ul>
          {f.hours?.note ? <p className="note">{f.hours.note}</p> : null}
        </>
      ),
    });
  } else if (f.footerNote) {
    add({ key: "note", cls: "stk hours", m: 2, d: 4, node: <p className="note">{f.footerNote}</p> });
  }
  pul(1, 1, 3);
  f.services.forEach((s, i) => {
    add({
      key: `svc-${i}`,
      cls: `stk svc ${i % 3 === 1 ? "yellow" : i % 3 === 2 ? "mint" : ""}`,
      m: 1,
      d: 2,
      node: (
        <>
          <p className="sname">{s.name}</p>
          {s.description ? <p className="sdesc">{s.description}</p> : null}
        </>
      ),
    });
    if (i === 1) pul(2, 1, 2);
  });
  if (f.services.length < 2) pul(2, 1, 2);
  f.reviews.slice(0, 2).forEach((r, i) => {
    add({
      key: `rev-${i}`,
      cls: "stk review",
      m: 2,
      d: 3,
      node: (
        <blockquote>
          <p>{r.text}</p>
          <footer>
            {"★".repeat(Math.max(0, Math.min(5, Math.round(r.rating))))} {r.author}
          </footer>
        </blockquote>
      ),
    });
  });
  pul(3, 1, 2);
  if (f.address) {
    add({
      key: "addr",
      cls: "stk addr",
      m: f.mapEmbedSrc ? 1 : 2,
      d: f.mapEmbedSrc ? 2 : 4,
      node: (
        <>
          <p className="lbl">Adres</p>
          <p className="text">{f.address}</p>
          {f.directionsHref ? (
            <a className="btn" href={f.directionsHref} target="_blank" rel="noopener noreferrer">
              Yol tarifi
            </a>
          ) : null}
        </>
      ),
    });
  }
  if (f.mapEmbedSrc) {
    add({
      key: "map",
      cls: "pul map",
      m: f.address ? 1 : 2,
      d: 2,
      node: <iframe loading="lazy" title="Harita" src={f.mapEmbedSrc} referrerPolicy="no-referrer-when-downgrade" />,
    });
  }
  if (f.cta) {
    add({
      key: "cta",
      cls: "stk cta",
      m: 2,
      d: 6,
      node: (
        <>
          <p className="head">{f.cta.headline}</p>
          <div className="acts">
            {f.telHref ? (
              <a className="btn big" href={f.telHref}>
                Ara
              </a>
            ) : null}
            {f.whatsappHref ? (
              <a className="btn big" href={f.whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            ) : null}
            {f.directionsHref ? (
              <a className="btn big ghost" href={f.directionsHref} target="_blank" rel="noopener noreferrer">
                Yol tarifi
              </a>
            ) : null}
          </div>
        </>
      ),
    });
  }

  return (
    <main className={`k-rozet ${FONT_PAIRINGS.craft.className}`}>
      <div className="wall">
        {stickers.map((s, i) => (
          <div
            key={s.key}
            className={s.cls}
            style={{ "--m": s.m, "--d": s.d, "--r": s.d >= 4 ? ROT_WIDE[i % ROT_WIDE.length] : ROT[i % ROT.length], "--i": i } as React.CSSProperties}
          >
            {s.node}
          </div>
        ))}
      </div>
      {f.footerNote && hours.length ? <p className="foot">{f.footerNote}</p> : null}
    </main>
  );
}
