"use client";

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
}: {
  section: HoursData;
  business: Business;
  id: string;
  locale?: Locale;
}) {
  const now = useNow();
  const hours = business.hours;
  if (!hours) return null;
  const s = t(locale).hours;

  const rows = hoursTable(hours, now === null ? undefined : new Date(now), locale).map((row) => ({
    ...row,
    isToday: now !== null && row.isToday,
  }));

  return (
    <section id={id} className="section">
      <Reveal className="container flex flex-col gap-[var(--stack-gap)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="section-title">{section.title}</h2>
          <OpenBadge hours={hours} locale={locale} />
        </div>

        <table
          className="w-full max-w-xl border-collapse text-left"
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
