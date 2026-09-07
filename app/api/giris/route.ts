import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken } from "@/lib/admin-auth";

/** Giriş formu buraya POST eder; parola doğruysa imzalı çerez yazılır (30 gün). */
export async function POST(request: Request) {
  const form = await request.formData();
  const given = String(form.get("parola") ?? "");
  const expected = process.env.DARPHANE_ADMIN_PASSWORD?.trim();
  const base = new URL(request.url);

  if (!expected || given !== expected) {
    return NextResponse.redirect(new URL("/giris?hata=1", base), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/panel", base), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, await adminToken(expected), {
    httpOnly: true,
    secure: base.protocol === "https:",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
