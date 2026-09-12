"use client";

import { useEffect, useState } from "react";
import type { Hours } from "@/lib/schema";

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
const R = 100;
const C = 2 * Math.PI * R;
const r2 = (n: number) => Math.round(n * 100) / 100;
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

function nowIn(timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: timezone, weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = get("weekday").toLowerCase().slice(0, 3) as (typeof DAYS)[number];
  return { day: DAYS.includes(wd) ? wd : "mon", minutes: (Number(get("hour")) % 24) * 60 + Number(get("minute")) };
}

/** 24 saatlik kadran: bugünün açık aralıkları yay, şu anki saat ibre (istemcide). Renkler temadan. */
export function HoursDial({ hours }: { hours: Hours }) {
  const [now, setNow] = useState<{ day: (typeof DAYS)[number]; minutes: number } | null>(null);
  useEffect(() => {
    const tick = () => setNow(nowIn(hours.timezone));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [hours.timezone]);
  const day = now?.day ?? "mon";
  const arcs = (hours.days[day] ?? []).map((r) => {
    const s = toMin(r.open);
    let e = toMin(r.close);
    if (e <= s) e = 1440;
    return { start: r2((s / 1440) * C), len: r2(((e - s) / 1440) * C) };
  });
  const angle = now ? (now.minutes / 1440) * 360 : 0;
  return (
    <svg className="hours-dial" viewBox="-16 -16 292 292" role="img" aria-label="24 saatlik açık saat kadranı">
      <circle cx="130" cy="130" r={R} className="hours-dial-track" />
      {arcs.map((a, i) => (
        <circle key={i} cx="130" cy="130" r={R} className="hours-dial-arc" style={{ strokeDasharray: `${a.len} ${r2(C)}`, strokeDashoffset: -a.start }} />
      ))}
      {Array.from({ length: 24 }, (_, h) => {
        const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
        const major = h % 6 === 0;
        return <line key={h} x1={r2(130 + Math.cos(a) * (R + 10))} y1={r2(130 + Math.sin(a) * (R + 10))} x2={r2(130 + Math.cos(a) * (R + (major ? 20 : 15)))} y2={r2(130 + Math.sin(a) * (R + (major ? 20 : 15)))} className={major ? "hours-dial-tick major" : "hours-dial-tick"} />;
      })}
      {[0, 6, 12, 18].map((h) => {
        const a = (h / 24) * 2 * Math.PI - Math.PI / 2;
        return <text key={h} x={r2(130 + Math.cos(a) * (R + 30))} y={r2(130 + Math.sin(a) * (R + 30) + 4)} className="hours-dial-num" textAnchor="middle">{String(h).padStart(2, "0")}</text>;
      })}
      {now ? (
        <g className="hours-dial-hand" style={{ transform: `rotate(${angle}deg)`, transformOrigin: "130px 130px" }}>
          <line x1="130" y1="130" x2="130" y2={130 - R - 4} />
          <circle cx="130" cy="130" r="4" />
        </g>
      ) : null}
    </svg>
  );
}
