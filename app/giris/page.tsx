import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giriş — fourpear",
  robots: { index: false, follow: false, nocache: true },
};

/** İç sayfa girişi. Tek alan: parola. Kullanıcı adı sabit (fourpear). */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ hata?: string }>;
}) {
  const { hata } = await searchParams;

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "#0f1115",
        color: "#f5f6f7",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "1.5rem",
      }}
    >
      <form
        method="post"
        action="/api/giris"
        style={{
          width: "100%",
          maxWidth: "22rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "2rem",
          borderRadius: "14px",
          background: "#171a20",
          border: "1px solid #262a33",
        }}
      >
        <div>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "#8b93a1", letterSpacing: "0.02em" }}>fourpear</p>
          <h1 style={{ margin: "0.25rem 0 0", fontSize: "1.375rem", fontWeight: 600 }}>Darphane</h1>
        </div>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.375rem", fontSize: "0.875rem" }}>
          Parola
          <input
            type="password"
            name="parola"
            autoComplete="current-password"
            autoFocus
            required
            style={{
              font: "inherit",
              fontSize: "1rem",
              padding: "0.75rem 0.875rem",
              borderRadius: "10px",
              border: `1px solid ${hata ? "#ef4444" : "#2f3440"}`,
              background: "#0f1115",
              color: "inherit",
              outline: "none",
            }}
          />
        </label>

        {hata ? (
          <p role="alert" style={{ margin: 0, fontSize: "0.875rem", color: "#f87171" }}>
            Parola yanlış. Vercel'deki DARPHANE_ADMIN_PASSWORD ile aynı olmalı.
          </p>
        ) : null}

        <button
          type="submit"
          style={{
            font: "inherit",
            fontWeight: 600,
            padding: "0.8rem 1rem",
            borderRadius: "10px",
            border: 0,
            background: "#22c55e",
            color: "#07130b",
            cursor: "pointer",
          }}
        >
          Giriş Yap
        </button>

        <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>
          Bu sayfa fourpear'ın iç panelidir. İşletme siteleri parolasız açılır.
        </p>
      </form>
    </main>
  );
}
