import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { PostHogProvider } from "@/components/analytics/PostHogProvider";
import "./globals.css";
import { siteUrl } from "@/lib/site-url";

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
  // og:image gibi bağıl adresler bununla mutlak olur. Sıra: kendi alan adımız →
  // Vercel'in kalıcı üretim adresi → önizleme adresi → localhost. Boş değer "yok" sayılır
  // (Vercel .env.example'dan boş değişken ekleyebiliyor).
  metadataBase: new URL(siteUrl()),
  title: "fourpear",
  // Varsayılan: her şey kapalı. Sadece satılan siteler bunu geçersiz kılar.
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${sans.variable} ${display.variable} antialiased`}>
      <body>
        <PostHogProvider>{children}</PostHogProvider>
        <Analytics />
      </body>
    </html>
  );
}
