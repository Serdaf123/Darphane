import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidAdminToken } from "@/lib/admin-auth";

/**
 * /panel fourpear'ın iç paneli: hangi site hangi aşamada, fiyatlar, süreler,
 * durum değişiklikleri. Kök (/) Serkan'ın açık tanıtım sitesidir. Dışarıya kapalı: geçerli oturum çerezi yoksa /giris'e yönlendirir.
 * İşletme sayfaları (/<slug>, /<slug>/en, /<slug>/b) açık kalır; onlar teklif.
 * Yerelde (next dev) sorulmaz.
 */
export const config = {
  matcher: ["/panel", "/panel/:path*"],
};

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "development") return NextResponse.next();

  const ok = await isValidAdminToken(
    request.cookies.get(ADMIN_COOKIE)?.value,
    process.env.DARPHANE_ADMIN_PASSWORD?.trim()
  );
  if (ok) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/giris";
  return NextResponse.redirect(url);
}
