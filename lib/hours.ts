import { DAY_KEYS, DAY_LABELS, type DayKey, type Hours, type TimeRange } from "./schema";

/**
 * "Şu an açık" rozeti — işletme sahibini en çok etkileyen detaylardan biri
 * ve maliyeti sıfır. Hesap işletmenin kendi saat diliminde yapılır.
 */

export type OpenState =
  | { status: "open"; label: string; until: string }
  | { status: "closed"; label: string; nextOpen?: string }
  | { status: "unknown"; label: string };

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Verilen saat diliminde o anki gün ve gün içi dakika. */
export function nowInTimezone(timezone: string, now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = get("weekday").toLowerCase().slice(0, 3) as DayKey;
  // 24:00 gece yarısını 0 olarak normalize et
  const hour = Number(get("hour")) % 24;
  return { day, minutes: hour * 60 + Number(get("minute")) };
}

/** close <= open ise aralık gece yarısını aşıyor (ör. 20:00 - 02:00). */
function spansMidnight(range: TimeRange) {
  return toMinutes(range.close) <= toMinutes(range.open);
}

export function getOpenState(hours: Hours | undefined, now: Date = new Date()): OpenState {
  if (!hours) return { status: "unknown", label: "" };

  const { day, minutes } = nowInTimezone(hours.timezone, now);
  const previousDay = DAY_KEYS[(DAY_KEYS.indexOf(day) + 6) % 7];

  // Dün gece açılıp bu sabaha sarkan bir aralık var mı?
  for (const range of hours.days[previousDay] ?? []) {
    if (spansMidnight(range) && minutes < toMinutes(range.close)) {
      return { status: "open", label: "Şu an açık", until: range.close };
    }
  }

  const today = hours.days[day];
  if (!today) return { status: "unknown", label: "" };

  for (const range of today) {
    const open = toMinutes(range.open);
    const close = toMinutes(range.close);
    const isOpen = spansMidnight(range) ? minutes >= open : minutes >= open && minutes < close;
    if (isOpen) return { status: "open", label: "Şu an açık", until: range.close };
  }

  const nextOpen = today
    .map((r) => r.open)
    .filter((open) => toMinutes(open) > minutes)
    .sort()[0];

  if (nextOpen) {
    return { status: "closed", label: `Şu an kapalı · ${nextOpen}'de açılıyor`, nextOpen };
  }
  return { status: "closed", label: "Şu an kapalı" };
}

/** "09:00 - 18:00" veya birden fazla aralıkta "09:00 - 13:00, 14:00 - 19:00" */
export function formatRanges(ranges: TimeRange[] | undefined): string {
  if (ranges === undefined) return "—";
  if (ranges.length === 0) return "Kapalı";
  return ranges.map((r) => `${r.open} - ${r.close}`).join(", ");
}

/** Çalışma saatleri tablosu: her gün için etiket + aralık + bugün mü. */
export function hoursTable(hours: Hours, now: Date = new Date()) {
  const { day: today } = nowInTimezone(hours.timezone, now);
  return DAY_KEYS.map((day) => ({
    day,
    label: DAY_LABELS[day],
    value: formatRanges(hours.days[day]),
    isToday: day === today,
    isClosed: hours.days[day]?.length === 0,
  }));
}
