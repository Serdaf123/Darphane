import { ImageResponse } from "next/og";
import { getSite } from "@/lib/sites";
import { PALETTES } from "@/lib/theme";

/**
 * Link önizleme görseli (WhatsApp, iMessage, Twitter). Teklif mesajında
 * link atıldığında bu kart çıkar: hero görseli + işletme adı. Fotoğrafı
 * görmeden linki açmayan esnaf için ilk izlenim burası.
 */

export const alt = "Site önizlemesi";
export const size = { width: 600, height: 315 };
export const contentType = "image/png";

/** Google Fonts'tan TTF: Satori'ye Türkçe karakterli font lazım. */
async function loadFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  ).then((r) => r.text());
  // latin-ext bloğu ı ş ğ için gerekir; yoksa ilk url
  const block = css.split("/* latin-ext */")[1] ?? css;
  const url = block.match(/src: url\(([^)]+)\)/)?.[1] ?? css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!url) return null;
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) return new Response("Not found", { status: 404 });

  const { business, sections, theme } = site;
  const palette = PALETTES[theme.preset];
  const hero = sections.find((s) => s.type === "hero");
  const image = hero?.type === "hero" ? hero.image?.src : undefined;
  const place = [business.district, business.city].filter(Boolean).join(", ");

  const [bold, regular] = await Promise.all([loadFont("Manrope", 700), loadFont("Manrope", 500)]);
  const fonts = [
    bold ? { name: "Manrope", data: bold, weight: 700 as const } : null,
    regular ? { name: "Manrope", data: regular, weight: 500 as const } : null,
  ].filter((f): f is NonNullable<typeof f> => f !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: palette.bg,
          fontFamily: "Manrope",
        }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            width={600}
            height={315}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: image
              ? "linear-gradient(180deg, rgba(0,0,0,0.02) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.88) 100%)"
              : "transparent",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            bottom: 28,
            display: "flex",
            flexDirection: "column",
            gap: 5,
            color: image ? "#fff" : palette.text,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 500, opacity: 0.95 }}>{business.category}</div>
          <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.05, letterSpacing: -0.5 }}>
            {business.name}
          </div>
          {place ? <div style={{ fontSize: 14, fontWeight: 500, opacity: 0.85 }}>{place}</div> : null}
        </div>
        <div
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            padding: "5px 9px",
            borderRadius: 999,
            background: palette.accent,
            color: palette.accentText,
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {business.phone ?? "Web sitesi"}
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
