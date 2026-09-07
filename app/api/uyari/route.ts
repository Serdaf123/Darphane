import { NextResponse } from "next/server";

/**
 * PostHog → Telegram anlık uyarı köprüsü.
 * PostHog'da Data pipeline → Destinations → Webhook: URL
 *   https://<site>/api/uyari?s=<DARPHANE_WEBHOOK_SECRET>
 * olaylar: site_viewed, cta_click, engaged, scroll_depth (istenirse filtre PostHog'da).
 * Env: TELEGRAM_BOT_TOKEN (BotFather), TELEGRAM_CHAT_ID (kendi sohbetin), DARPHANE_WEBHOOK_SECRET.
 * Sinyal panelde kalmasın: "Olympos açtı, 52 sn kaldı, WhatsApp'a bastı" o dakika telefona düşer.
 */
export const runtime = "nodejs";

const LABEL: Record<string, string> = {
  site_viewed: "👀 açtı",
  scroll_depth: "📜 kaydırdı",
  cta_click: "👆 bastı",
  engaged: "⏱️ 30 sn kaldı",
};

type PostHogWebhook = {
  event?: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  // PostHog'un yeni webhook biçimi: { event: { event, properties, ... } }
  [k: string]: unknown;
};

function pick(body: PostHogWebhook) {
  const inner = (body.event && typeof body.event === "object" ? (body.event as PostHogWebhook) : body) as PostHogWebhook;
  const name = String(inner.event ?? body.event ?? "olay");
  const p = (inner.properties ?? {}) as Record<string, unknown>;
  return { name, p };
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.DARPHANE_WEBHOOK_SECRET?.trim();
  if (secret && url.searchParams.get("s") !== secret) {
    return NextResponse.json({ ok: false, error: "yetkisiz" }, { status: 401 });
  }
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chat = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chat) {
    return NextResponse.json({ ok: false, error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID yok" }, { status: 503 });
  }

  let body: PostHogWebhook;
  try {
    body = (await request.json()) as PostHogWebhook;
  } catch {
    return NextResponse.json({ ok: false, error: "json değil" }, { status: 400 });
  }
  const { name, p } = pick(body);
  const slug = String(p.slug ?? p.$current_url ?? "?");
  const detail = [
    p.kind ? `→ ${p.kind}` : "",
    p.depth ? `%${p.depth}` : "",
    p.seconds ? `${p.seconds} sn` : "",
    p.variant && p.variant !== "a" ? `tasarım ${String(p.variant).toUpperCase()}` : "",
    p.$device_type ? String(p.$device_type) : "",
    p.$geoip_city_name ? String(p.$geoip_city_name) : "",
  ]
    .filter(Boolean)
    .join(" · ");
  const text = `${LABEL[name] ?? name} — ${slug}${detail ? `\n${detail}` : ""}`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: `telegram ${res.status}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
