"use client";

import { HoursDial } from "@/components/HoursDial";
import { Reveal } from "@/components/motion/Reveal";
import { OpenBadge } from "@/components/OpenBadge";
import { hoursTable } from "@/lib/hours";
import { t, type Locale } from "@/lib/i18n";
import type { Business, Section } from "@/lib/schema";
import { useNow } from "@/lib/useNow";

type HoursData = Extract<Section, { type: "hours" }>;

/**
 * Tablo statik; yalnızca "bugün" vurgusu saate bağlı.
 * Saat bilinmeden (SSR) vurgu yok, hidrasyondan sonra belirir.
 */
export function HoursSection({
  section,
  business,
  id,
  locale = "tr",
  serverNow,
}: {
  section: HoursData;
  business: Business;
  id: string;
  locale?: Locale;
  serverNow?: number;
}) {
  const now = useNow();
  const hours = business.hours;
  if (!hours) return null;
  const s = t(locale).hours;

  const rows = hoursTable(hours, now === null ? undefined : new Date(now), locale).map((row) => ({
    ...row,
    isToday: now !== null && row.isToday,
  }));

  const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  // strip: gün başına dikey çubuk; ölçek günlerin en erken açılış ve en geç kapanışına göre
  const ranges = rows.map((r) => (hours.days[r.day] ?? []).map((x) => { const a = toMin(x.open); let b = toMin(x.close); if (b <= a) b = 1440; return [a, b] as const; }));
  const flat = ranges.flat();
  const lo = flat.length ? Math.min(...flat.map((x) => x[0])) : 0;
  const hi = flat.length ? Math.max(...flat.map((x) => x[1])) : 1440;
  const span = Math.max(60, hi - lo);

  return (
    <section id={id} className={`section${section.layout === "dial" ? " hours-layout-dial" : ""}`}>
      <Reveal className="container flex flex-col gap-[var(--stack-gap)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="section-title section-title-sm">{section.title}</h2>
          <OpenBadge hours={hours} locale={locale} serverNow={serverNow} />
        </div>

        {section.layout === "dial" ? <div className="hours-dial-wrap"><HoursDial hours={hours} /></div> : null}

        {section.layout === "strip" ? (
          <ol className="hours-strip" aria-label={s.caption(business.name)}>
            {rows.map((row, i) => (
              <li key={row.day} className={row.isToday ? "today" : row.isClosed ? "closed" : undefined}>
                <span className="hours-strip-day">{row.label.slice(0, 3)}</span>
                <span className="hours-strip-track" aria-hidden>
                  {ranges[i].map(([a, b], j) => (
                    <span key={j} className="hours-strip-bar" style={{ top: `${((a - lo) / span) * 100}%`, height: `${((b - a) / span) * 100}%` }} />
                  ))}
                </span>
                <span className="hours-strip-val">{row.value}</span>
              </li>
            ))}
          </ol>
        ) : null}

        <table
          className={`w-full max-w-xl border-collapse text-left${section.layout === "strip" ? " hours-table-compact" : ""}`}
          style={{ borderRadius: "var(--radius)" }}
        >
          <caption className="visually-hidden">{s.caption(business.name)}</caption>
          <tbody>
            {rows.map((row) => (
              <tr key={row.day} style={{ borderBottom: "1px solid var(--c-border)" }}>
                <th
                  scope="row"
                  className="py-3 pr-4"
                  style={{ fontWeight: row.isToday ? 700 : 500 }}
                >
                  {row.label}
                  {row.isToday ? (
                    <span className="muted text-sm font-normal"> · {s.today}</span>
                  ) : null}
                </th>
                <td
                  className="py-3 text-right tabular-nums"
                  style={{ color: row.isClosed ? "var(--c-muted)" : "var(--c-text)" }}
                >
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {hours.note ? <p className="muted text-sm">{hours.note}</p> : null}
      </Reveal>
    </section>
  );
}
