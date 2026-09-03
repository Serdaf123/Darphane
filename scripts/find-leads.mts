/**
 * Web sitesi olmayan işletmeleri bulur — Google Places API (New), Text Search.
 *
 *   GOOGLE_PLACES_API_KEY=... npm run find-leads -- "kuaför" "Kadıköy, İstanbul" [minYorum]
 *
 * Çıktı: leads/<tarih>-<sorgu>.csv  (Excel/Sheets'e açılır)
 *
 * Not: websiteUri, telefon ve puan alanları "Enterprise" SKU'ya girer.
 * Ayda 60 sonuçlu birkaç yüz arama bedava kotayı aşmaz; yine de
 * console.cloud.google.com'da bütçe uyarısı kur.
 */

import fs from "node:fs";
import path from "node:path";

const [query, area, minReviewsArg = "10"] = process.argv.slice(2);
const apiKey = process.env.GOOGLE_PLACES_API_KEY;

if (!apiKey) {
  console.error("GOOGLE_PLACES_API_KEY tanımlı değil. .env.local dosyasına ekle veya komutun önüne yaz.");
  process.exit(1);
}
if (!query || !area) {
  console.error('Kullanım: npm run find-leads -- "<kategori>" "<ilçe, şehir>" [minYorum]');
  process.exit(1);
}

const minReviews = Number(minReviewsArg);

type Place = {
  id: string;
  displayName?: { text: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  primaryType?: string;
  location?: { latitude: number; longitude: number };
  photos?: unknown[];
  regularOpeningHours?: { weekdayDescriptions?: string[] };
};

const FIELDS = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.internationalPhoneNumber",
  "places.websiteUri",
  "places.rating",
  "places.userRatingCount",
  "places.googleMapsUri",
  "places.primaryType",
  "places.location",
  "places.photos",
  "places.regularOpeningHours",
  "nextPageToken",
].join(",");

async function searchPage(pageToken?: string) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
      "X-Goog-FieldMask": FIELDS,
    },
    body: JSON.stringify({
      textQuery: `${query} ${area}`,
      languageCode: "tr",
      regionCode: "TR",
      pageSize: 20,
      pageToken,
    }),
  });

  if (!res.ok) {
    throw new Error(`Places API ${res.status}: ${await res.text()}`);
  }
  return (await res.json()) as { places?: Place[]; nextPageToken?: string };
}

/** Telefonu WhatsApp biçimine çevir: 90 ile başlayan rakam dizisi. */
function toWhatsapp(phone?: string) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("90")) return digits;
  if (digits.startsWith("0")) return `90${digits.slice(1)}`;
  return `90${digits}`;
}

function slugify(text: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };
  return text
    .toLowerCase()
    .replace(/[çğıöşüİ]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function csvCell(value: unknown) {
  const s = String(value ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const all: Place[] = [];
let token: string | undefined;
do {
  const page = await searchPage(token);
  all.push(...(page.places ?? []));
  token = page.nextPageToken;
} while (token && all.length < 60);

const noSite = all.filter((p) => !p.websiteUri);
const qualified = noSite.filter((p) => (p.userRatingCount ?? 0) >= minReviews);

// Uygunluk puanı: çok yorum + iyi puan + fotoğraf + telefon → önce bunlara git.
const scored = qualified
  .map((p) => {
    let score = 0;
    score += Math.min(p.userRatingCount ?? 0, 300) / 10;
    score += ((p.rating ?? 0) - 3.5) * 10;
    score += (p.photos?.length ?? 0) > 3 ? 8 : 0;
    score += p.nationalPhoneNumber ? 10 : -20;
    return { p, score: Math.round(score) };
  })
  .sort((a, b) => b.score - a.score);

const header = [
  "skor",
  "isletme",
  "kategori",
  "puan",
  "yorum",
  "telefon",
  "whatsapp",
  "adres",
  "maps",
  "onerilen_slug",
  "lat",
  "lng",
];
const rows = scored.map(({ p, score }) =>
  [
    score,
    p.displayName?.text,
    p.primaryType,
    p.rating,
    p.userRatingCount,
    p.nationalPhoneNumber,
    toWhatsapp(p.internationalPhoneNumber ?? p.nationalPhoneNumber),
    p.formattedAddress,
    p.googleMapsUri,
    slugify(p.displayName?.text ?? ""),
    p.location?.latitude,
    p.location?.longitude,
  ]
    .map(csvCell)
    .join(",")
);

const outDir = path.join(process.cwd(), "leads");
fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const file = path.join(outDir, `${stamp}-${slugify(`${query}-${area}`)}.csv`);
fs.writeFileSync(file, `﻿${[header.join(","), ...rows].join("\n")}\n`, "utf8");

console.log(
  `${all.length} işletme tarandı → ${noSite.length} sitesiz → ${qualified.length} tanesi en az ${minReviews} yorumlu\n` +
    `Kaydedildi: leads/${path.basename(file)}\n`
);
for (const { p, score } of scored.slice(0, 10)) {
  console.log(
    `  ${String(score).padStart(3)}  ${p.displayName?.text}  ·  ${p.rating ?? "-"}★ (${p.userRatingCount ?? 0})  ·  ${p.nationalPhoneNumber ?? "telefon yok"}`
  );
}
