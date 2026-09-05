/**
 * İç sayfa (/) girişi. Parola Vercel env'de (DARPHANE_ADMIN_PASSWORD); giriş
 * yapılınca parola değil, ondan türetilmiş bir imza çerezde tutulur.
 * Web Crypto kullanılır: hem edge (proxy) hem node (route) tarafında çalışır.
 */
export const ADMIN_COOKIE = "darphane_admin";
export const ADMIN_USER = "fourpear";

async function hmacHex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Çerezde saklanacak imza — parola değişince eski oturumlar düşer. */
export async function adminToken(password: string): Promise<string> {
  return hmacHex(password, `${ADMIN_USER}:darphane-admin:v1`);
}

export async function isValidAdminToken(token: string | undefined, password: string | undefined): Promise<boolean> {
  if (!token || !password) return false;
  const expected = await adminToken(password);
  if (expected.length !== token.length) return false;
  // sabit zamanlı karşılaştırma
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}
