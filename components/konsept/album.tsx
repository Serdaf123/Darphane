import { SiteImage } from "@/components/SiteImage";
import { FONT_PAIRINGS } from "@/lib/fonts";
import type { SiteImage as SiteImageData } from "@/lib/schema";
import type { Facts } from "./facts";
import type { ConceptProps } from "./registry";
import "./album.css";

/**
 * Albüm — aralıksız kare fotoğraf duvarı. Header yok; ilk karo siyah isim+telefon karosu,
 * fotoğraflar etiketli, metin karoları (saatler, harita, yorum, puan) ızgaranın içinde.
 * Sabit alt çubuk: Ara · WhatsApp · Yol tarifi. Karolar görüş alanına girerken "banyo edilir"
 * (gri → renk, scroll-driven; desteklenmeyen tarayıcıda durağan).
 */

type Tile =
  | { kind: "name" }
  | { kind: "photo"; image: SiteImageData; label?: string; href?: string; priority?: boolean }
  | { kind: "hours" }
  | { kind: "map" }
  | { kind: "address" }
  | { kind: "rating" }
  | { kind: "about" }
  | { kind: "review"; review: Facts["reviews"][number] }
  | { kind: "service"; service: Facts["services"][number] }
  | { kind: "faq"; item: Facts["faq"][number] }
  | { kind: "cta" };

const COLUMNS = 4; // masaüstü sütun sayısı; mobil 2'ye de bölünür

function buildTiles(f: Facts): Tile[] {
  const hasHours = Boolean(f.hoursRows?.length);
  const hasReviews = f.reviews.length > 0;

  // Fotoğraf etiketleri: hizmet adları arasına "Yorumlar" ve "Saatler" çapaları serpiştirilir.
  const labels: { label: string; href?: string }[] = [];
  const services = [...f.services];
  const take = () => {
    const s = services.shift();
    return s ? { label: s.name } : undefined;
  };
  const push = (l?: { label: string; href?: string }) => l && labels.push(l);
  push(take());
  if (hasReviews) labels.push({ label: "Yorumlar", href: "#yorumlar" });
  push(take());
  if (hasHours) labels.push({ label: "Saatler", href: "#saatler" });
  while (services.length) push(take());

  const photos: Tile[] = f.images.map((image, i) => ({ kind: "photo", image, ...labels[i], priority: i < 2 }));

  const texts: Tile[] = [];
  if (hasHours) texts.push({ kind: "hours" });
  if (f.rating) texts.push({ kind: "rating" });
  f.reviews.slice(0, 3).forEach((review) => texts.push({ kind: "review", review }));
  if (f.mapEmbedSrc) texts.push({ kind: "map" });
  if (f.address) texts.push({ kind: "address" });
  if (f.about?.body) texts.push({ kind: "about" });

  // Örgü: fotoğraf, fotoğraf, metin, fotoğraf, metin …
  const tiles: Tile[] = [{ kind: "name" }];
  const pattern = ["p", "p", "t", "p", "t"];
  let k = 0;
  while (photos.length || texts.length) {
    const want = pattern[k++ % pattern.length];
    const next = want === "p" ? photos.shift() ?? texts.shift() : texts.shift() ?? photos.shift();
    if (next) tiles.push(next);
  }

  // Dolgu: etiketlenmeyen hizmetler, sık sorulanlar, sonra fotoğraflar tekrar — son sıra hiç boş kalmaz.
  const fillers: Tile[] = [
    ...f.services.slice(labels.filter((l) => !l.href).length).map((service): Tile => ({ kind: "service", service })),
    ...f.faq.map((item): Tile => ({ kind: "faq", item })),
    ...f.images.map((image): Tile => ({ kind: "photo", image })),
  ];
  const cells = () => tiles.length + 3; // isim karosu 2×2 = 4 hücre
  while ((cells() + 1) % COLUMNS !== 0 && fillers.length) tiles.push(fillers.shift()!);
  tiles.push({ kind: "cta" });
  return tiles;
}

function Stars({ n }: { n: number }) {
  return (
    <span className="stars" aria-label={`${n} yıldız`}>
      {"★★★★★".slice(0, Math.max(0, Math.min(5, Math.round(n))))}
    </span>
  );
}

export default function Concept({ facts }: ConceptProps) {
  const f = facts;
  const tiles = buildTiles(f);
  const rating = f.rating ? String(f.rating.value).replace(".", ",") : undefined;

  return (
    <main className={`k-album ${FONT_PAIRINGS.soft.className}`}>
      <div className="grid">
        {tiles.map((t, i) => {
          switch (t.kind) {
            case "name":
              return (
                <section key={i} className="tile name" aria-label="İşletme">
                  <p className="cat">{f.category}</p>
                  <h1>{f.name}</h1>
                  {f.open && f.open.status !== "unknown" ? (
                    <p className={`open ${f.open.status}`}>
                      <span className="dot" aria-hidden />
                      {f.open.label}
                    </p>
                  ) : null}
                  {f.phone && f.telHref ? (
                    <a className="phone" href={f.telHref}>
                      {f.phone}
                    </a>
                  ) : null}
                  {f.district || f.city ? <p className="where">{[f.district, f.city].filter(Boolean).join(", ")}</p> : null}
                </section>
              );
            case "photo": {
              const Tag = t.href ? "a" : "span";
              return (
                <figure key={i} className="tile photo">
                  <SiteImage image={t.image} sizes="(min-width: 900px) 25vw, 50vw" priority={t.priority} />
                  {t.label ? (
                    <figcaption>
                      <Tag className="tag" href={t.href}>
                        {t.label}
                      </Tag>
                    </figcaption>
                  ) : null}
                </figure>
              );
            }
            case "hours":
              return (
                <section key={i} id="saatler" className="tile text hours">
                  <h2>Saatler</h2>
                  <ul>
                    {f.hoursRows!.map((r) => (
                      <li key={r.day} className={r.isToday ? "today" : undefined}>
                        <span>{r.label}</span>
                        <span>{r.value}</span>
                      </li>
                    ))}
                  </ul>
                  {f.hours?.note ? <p className="note">{f.hours.note}</p> : null}
                </section>
              );
            case "rating":
              return (
                <section key={i} className="tile text rating" aria-label="Puan">
                  <p className="big">{rating}</p>
                  <p>
                    <Stars n={f.rating!.value} />
                    <br />
                    {f.rating!.count} yorum · {f.rating!.source}
                  </p>
                </section>
              );
            case "review":
              return (
                <blockquote key={i} id={tiles.findIndex((x) => x.kind === "review") === i ? "yorumlar" : undefined} className="tile text review">
                  <p className="q">{t.review.text}</p>
                  <footer>
                    <Stars n={t.review.rating} /> {t.review.author}
                  </footer>
                </blockquote>
              );
            case "map":
              return (
                <div key={i} id="konum" className="tile map">
                  <iframe loading="lazy" title="Harita" src={f.mapEmbedSrc} referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
                  {f.directionsHref ? (
                    <a className="tag" href={f.directionsHref} target="_blank" rel="noopener noreferrer">
                      Yol tarifi
                    </a>
                  ) : null}
                </div>
              );
            case "address":
              return (
                <section key={i} className="tile text address">
                  <h2>Adres</h2>
                  <p className="addr">{f.address}</p>
                  {f.directionsHref ? (
                    <a className="btn" href={f.directionsHref} target="_blank" rel="noopener noreferrer">
                      Yol tarifi
                    </a>
                  ) : null}
                </section>
              );
            case "about":
              return (
                <section key={i} className="tile text about">
                  <h2>{f.about!.title}</h2>
                  <p className="q">{f.about!.body}</p>
                </section>
              );
            case "service":
              return (
                <section key={i} className="tile text service">
                  <h2>{t.service.name}</h2>
                  {t.service.description ? <p className="q">{t.service.description}</p> : null}
                </section>
              );
            case "faq":
              return (
                <section key={i} className="tile text faq">
                  <h2>{t.item.q}</h2>
                  <p className="q">{t.item.a}</p>
                </section>
              );
            case "cta":
              return (
                <section key={i} className="tile cta" aria-label="İletişim">
                  <h2>{f.cta?.headline ?? f.name}</h2>
                  <div className="acts">
                    {f.whatsappHref ? (
                      <a className="btn fill" href={f.whatsappHref} target="_blank" rel="noopener noreferrer">
                        WhatsApp
                      </a>
                    ) : null}
                    {f.telHref ? (
                      <a className="btn" href={f.telHref}>
                        Ara
                      </a>
                    ) : null}
                  </div>
                </section>
              );
          }
        })}
      </div>

      <nav className="bar" aria-label="Hızlı iletişim">
        {f.telHref ? (
          <a href={f.telHref}>Ara</a>
        ) : null}
        {f.whatsappHref ? (
          <a className="fill" href={f.whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        ) : null}
        {f.directionsHref ? (
          <a href={f.directionsHref} target="_blank" rel="noopener noreferrer">
            Yol tarifi
          </a>
        ) : null}
      </nav>
    </main>
  );
}
