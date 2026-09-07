"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteSite, readSite, writeSite, type RawSite } from "@/lib/store";
import { at21, daysFromNowAt21, fromLocalInput } from "@/lib/panel";
import { OFFER_STATUSES } from "@/lib/schema";

/**
 * Panel yazma işlemleri. Kimlik: proxy.ts /panel/* için çerez ister; server action
 * aynı yola POST ettiği için o kontrolden geçer.
 */

type Offer = Record<string, unknown>;
type Business = Record<string, unknown>;

function patchOffer(raw: RawSite, patch: Offer): RawSite {
  const offer = { ...((raw.offer as Offer | undefined) ?? {}), ...patch };
  for (const k of Object.keys(offer)) if (offer[k] === undefined) delete offer[k];
  return { ...raw, offer };
}

function done(slug: string, result: { sha?: string; commitUrl?: string; mode: string }, msg: string) {
  revalidatePath("/panel");
  revalidatePath(`/panel/${slug}`);
  revalidatePath(`/${slug}`);
  const q = new URLSearchParams({ ok: msg });
  if (result.sha) q.set("commit", result.sha);
  if (result.commitUrl) q.set("url", result.commitUrl);
  redirect(`/panel/${slug}?${q}`);
}

function fail(slug: string, error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  redirect(`/panel/${slug}?hata=${encodeURIComponent(message.slice(0, 200))}`);
}

export async function saveOffer(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const found = await readSite(slug);
  if (!found) return fail(slug, "Site bulunamadı");

  const status = String(formData.get("status") ?? "draft");
  if (!(OFFER_STATUSES as readonly string[]).includes(status)) return fail(slug, "Geçersiz durum");
  const priceRaw = String(formData.get("price") ?? "").replace(/[^\d]/g, "");
  const price = priceRaw ? Number(priceRaw) : undefined;
  const expiresAt = status === "sold" ? undefined : fromLocalInput(String(formData.get("expiresAt") ?? ""));
  const paymentUrl = String(formData.get("paymentUrl") ?? "").trim() || undefined;
  const whatsapp = String(formData.get("sellerWhatsapp") ?? "").replace(/\D/g, "");
  const domain = String(formData.get("domain") ?? "").trim().toLowerCase().replace(/^www\./, "") || undefined;

  const seller = whatsapp
    ? { ...((found.raw.offer as Offer | undefined)?.seller as Record<string, unknown> | undefined), whatsapp }
    : undefined;

  let raw = patchOffer(found.raw, { status, expiresAt, price, paymentUrl, seller });
  const business = { ...((raw.business as Business | undefined) ?? {}) };
  if (domain) business.domain = domain;
  else delete business.domain;
  raw = { ...raw, business };

  // redirect() fırlatarak çalışır; try içinde çağrılırsa catch onu hata sanır.
  let result;
  try {
    result = await writeSite(slug, raw, `Panel: ${slug} teklif güncellendi (${status})`, found.sha);
  } catch (e) {
    return fail(slug, e);
  }
  return done(slug, result, "Kaydedildi");
}

export async function quickAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const action = String(formData.get("action") ?? "");
  const found = await readSite(slug);
  if (!found) return fail(slug, "Site bulunamadı");

  const current = (found.raw.offer as Offer | undefined) ?? {};
  let patch: Offer;
  let label: string;
  switch (action) {
    case "pitch":
      patch = { status: "pitched", expiresAt: daysFromNowAt21(7) };
      label = "Teklifte · 7 gün";
      break;
    case "extend3": {
      // Mevcut son günden (geçmişse bugünden) 3 gün sonra, 21:00
      const base = Math.max(current.expiresAt ? Date.parse(String(current.expiresAt)) : 0, Date.now());
      patch = { status: "pitched", expiresAt: at21(new Date(base + 3 * 86_400_000)) };
      label = "3 gün uzatıldı";
      break;
    }
    case "sold":
      patch = { status: "sold", expiresAt: undefined };
      label = "Satıldı";
      break;
    case "expire":
      patch = { status: "expired" };
      label = "Yayından kaldırıldı";
      break;
    case "draft":
      patch = { status: "draft", expiresAt: undefined };
      label = "Taslağa alındı";
      break;
    default:
      return fail(slug, "Bilinmeyen işlem");
  }

  let result;
  try {
    result = await writeSite(slug, patchOffer(found.raw, patch), `Panel: ${slug} → ${String(patch.status)}`, found.sha);
  } catch (e) {
    return fail(slug, e);
  }
  return done(slug, result, label);
}

/** "Hayır" dedi: siteyi ve tüm verisini sil (mesajdaki sözümüz), listeye dön. */
export async function declineAndDelete(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (String(formData.get("onay") ?? "") !== slug) return fail(slug, "Silmek için kutuya slug'ı yaz");
  let result;
  try {
    result = await deleteSite(slug, `Ret: ${slug} kaldırıldı, veriler silindi`);
  } catch (e) {
    return fail(slug, e);
  }
  revalidatePath("/panel");
  revalidatePath(`/${slug}`);
  const q = new URLSearchParams({ silindi: slug, dosya: String(result.removed.length) });
  if (result.commitUrl) q.set("url", result.commitUrl);
  redirect(`/panel?${q}`);
}
