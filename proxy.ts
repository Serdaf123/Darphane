import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

/**
 * Kök sayfa (/) ve /panel fourpear'ın iç paneli: hangi site hangi aşamada,
 * fiyatlar, süreler, durum değişiklikleri. Dışarıya kapalı: geçerli oturum çerezi yoksa /giris'e yönlendirir.
 * İşletme sayfaları (/<slug>, /<slug>/en, /<slug>/b) açık kalır; onlar teklif.
 * Yerelde (next dev) sorulmaz.
 */
export const config = {
  matcher: ["/", "/panel", "/panel/:path*"],
};

/** Satılan bir sitenin kendi alan adında "/" o siteye rewrite edilir (next.config); orada panel yok. */
function isOurHost(hostname: string): boolean {
  const own = [
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
    "localhost",
    "127.0.0.1",
  ].filter(Boolean) as string[];
  return own.some((h) => hostname === h) || hostname.endsWith(".vercel.app");
}

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next();
  // nextUrl.hostname yerel/proxy arkasında bağlantı adresini verebilir; Host başlığı esas.
  const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.hostname).split(":")[0];
  if (request.nextUrl.pathname === "/" && !isOurHost(host)) return NextResponse.next();

  const ok = await isValidAdminToken(
    request.cookies.get(ADMIN_COOKIE)?.value,
    process.env.DARPHANE_ADMIN_PASSWORD?.trim()
  );
  if (ok) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/giris";
  return NextResponse.redirect(url);
}
