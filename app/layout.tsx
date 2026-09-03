import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// latin-ext Türkçe karakterler (ı ş ğ ç ö ü) için gerekli.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "fourpear",
  // Varsayılan: her şey kapalı. Sadece satılan siteler bunu geçersiz kılar.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${sans.variable} ${display.variable} antialiased`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
