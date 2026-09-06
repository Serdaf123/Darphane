import type { Metadata } from "next";
import Link from "next/link";
import "./panel.css";
import { storeMode } from "@/lib/store";

export const metadata: Metadata = {
  title: "Panel — Darphane",
  robots: { index: false, follow: false, nocache: true },
};

/** Panel çatısı: üst çubuk + çıkış. Kimlik kontrolü proxy.ts'te (/panel/* korumalı). */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel">
      <div className="panel-wrap">
        <header className="panel-top">
          <h1>
            <Link href="/panel" style={{ textDecoration: "none" }}>
              Darphane
            </Link>
          </h1>
          <nav aria-label="Panel">
            <span title={storeMode === "github" ? "Değişiklikler GitHub'a commit edilir" : "Değişiklikler yerel dosyaya yazılır"}>
              {storeMode === "github" ? "GitHub" : "yerel"}
            </span>
            {/* API yolu: Link prefetch etmesin */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/cikis">Çıkış</a>
          </nav>
        </header>
        {children}
      </div>
    </div>
  );
}
