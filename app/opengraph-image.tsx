import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Serkan Oral — İşletmeler için web sitesi";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(135deg, #0b0e17 0%, #101a3a 100%)",
          color: "#f2f4f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", right: -80, top: -120, width: 520, height: 520, borderRadius: 999, background: "rgba(59,108,255,0.35)", filter: "blur(80px)" }} />
        <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -6, lineHeight: 0.95 }}>Serkan Oral</div>
        <div style={{ width: 120, height: 4, background: "#3b6cff", margin: "28px 0" }} />
        <div style={{ fontSize: 36, color: "#c9d0e0", maxWidth: 900 }}>İşletmeniz için site hazır. Siz daha istemeden.</div>
        <div style={{ position: "absolute", right: 72, bottom: 72, fontSize: 28, color: "#8b93a7" }}>serkanoral.com.tr</div>
      </div>
    ),
    size
  );
}
