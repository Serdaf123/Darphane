import { NextResponse, type NextRequest } from "next/server";

/**
 * Kök sayfa (/) fourpear'ın iç listesi: hangi site hangi aşamada, fiyatlar,
 * süreler. Dışarıya kapalı olmalı — HTTP Basic Auth ile korunur.
 * İşletme sayfaları (/<slug>, /<slug>/en, /<slug>/b) açık kalır; onlar teklif.
 *
 * Parola: Vercel → Settings → Environment Variables → DARPHANE_ADMIN_PASSWORD
 * (kullanıcı adı: fourpear). Yerelde (next dev) sorulmaz.
 */
export const config = {
  matcher: ["/"],
};

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  const expected = process.env.DARPHANE_ADMIN_PASSWORD?.trim();
  const header = request.headers.get("authorization") ?? "";
  if (expected && header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const [user, ...rest] = decoded.split(":");
    if (user === "fourpear" && rest.join(":") === expected) return NextResponse.next();
  }

  return new NextResponse(expected ? "Giriş gerekli" : "DARPHANE_ADMIN_PASSWORD tanımlı değil", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="darphane", charset="UTF-8"' },
  });
}
