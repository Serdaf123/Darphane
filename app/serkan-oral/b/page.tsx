import type { Metadata } from "next";

/**
 * Kişisel sayfanın B tasarımı — Codex'in alanı (bkz. AGENTS.md).
 * Bu dosya ve components/serkan-b/** Codex tarafından doldurulur.
 * Seçilen tasarım sonra köke (/serkan-oral) taşınır. Seçilene kadar noindex.
 */
export const metadata: Metadata = {
  title: "Serkan Oral — Tasarım B",
  robots: { index: false, follow: false, nocache: true },
};

export default function SerkanOralB() {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#111", color: "#eee", fontFamily: "system-ui, sans-serif" }}>
      <p>
        Tasarım B henüz yok. Kaynak: <code>app/serkan-oral/b/page.tsx</code> + <code>components/serkan-b/</code>. Tasarım A: <a href="/serkan-oral" style={{ color: "#9db4ff" }}>/serkan-oral</a>
      </p>
    </main>
  );
}
