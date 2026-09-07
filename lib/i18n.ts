/**
 * Arayüz metinleri. İçerik JSON'dan gelir; buradakiler bileşenlerin kendi
 * kelimeleri (buton adları, gün adları, "şu an açık"…).
 *
 * İngilizce sürüm: data/sites/<slug>.en.json (kısmi, TR üstüne biner)
 * + bu sözlük. Turistik işletmelerde (otel, restoran) EN sayfa /en altında.
 */

/** "10:00'da", "18:00'de", "13:00'te": saat için Türkçe bulunma eki (ünlü uyumu + sertleşme) */
function saatEki(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const dk = m % 60;
  if (dk) {
    const birler = dk % 10, onlar = dk - birler;
    const son = birler || onlar; // 30 → "otuz", 45 → "beş", 15 → "beş"
    const map: Record<number, string> = { 1: "de", 2: "de", 3: "te", 4: "te", 5: "te", 6: "da", 7: "de", 8: "de", 9: "da", 10: "da", 20: "de", 30: "da", 40: "ta", 50: "de" };
    return map[son] ?? "de";
  }
  const map: Record<number, string> = { 0: "da", 1: "de", 2: "de", 3: "te", 4: "te", 5: "te", 6: "da", 7: "de", 8: "de", 9: "da", 10: "da", 11: "de", 12: "de", 13: "te", 14: "te", 15: "te", 16: "da", 17: "de", 18: "de", 19: "da", 20: "de", 21: "de", 22: "de", 23: "te" };
  return map[h % 24] ?? "de";
}

export const LOCALES = ["tr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "tr";

const tr = {
  lang: "tr-TR",
  nav: {
    about: "Hakkında",
    services: "Hizmetler",
    menu: "Menü",
    gallery: "Galeri",
    reviews: "Yorumlar",
    hours: "Saatler",
    location: "Konum",
    contact: "İletişim",
    faq: "SSS",
    pricing: "Fiyatlar",
    team: "Ekip",
    beforeAfter: "Önce / Sonra",
  },
  header: { sections: "Bölümler", backToTop: "başa dön", switchTo: "EN", switchAria: "English version" },
  skipToContent: "İçeriğe atla",
  bar: { call: "Ara", directions: "Yol Tarifi", whatsapp: "WhatsApp", aria: "Hızlı iletişim" },
  cta: { whatsapp: "WhatsApp", call: "Ara", directions: "Yol Tarifi", email: "E-posta", instagram: "Instagram" },
  days: { mon: "Pazartesi", tue: "Salı", wed: "Çarşamba", thu: "Perşembe", fri: "Cuma", sat: "Cumartesi", sun: "Pazar" },
  hours: {
    today: "bugün",
    closed: "Kapalı",
    unknown: "—",
    schedule: "Çalışma saatleri",
    openUntil: (until: string) => `Şu an açık · ${until}'ye kadar`,
    open24: "Şu an açık · 24 saat",
    allDay: "24 saat açık",
    closedNow: "Şu an kapalı",
    closedOpensAt: (at: string) => `Şu an kapalı · ${at}'${saatEki(at)} açılıyor`,
    closedOpens: (day: string, at: string) => `Bugün kapalı · ${day} ${at}'${saatEki(at)} açılıyor`,
    caption: (name: string) => `${name} çalışma saatleri`,
  },
  reviews: {
    ratingAria: (r: number) => `${r} / 5 puan`,
    summary: (count: number, source: string) => `${count} değerlendirme, ${source}`,
  },
  location: { directions: "Yol Tarifi Al" },
  contact: {
    select: "Seçiniz",
    note: "Gönder'e bastığınızda mesajınız WhatsApp'ta hazır olarak açılır.",
    fromSite: (name: string) => `${name} — web sitesi üzerinden mesaj`,
  },
  footer: { madeBy: "Site fourpear tarafından hazırlandı" },
  whatsappDefault: (name: string) => `Merhaba, ${name} hakkında bilgi almak istiyorum.`,
  metaDescription: (name: string, place: string, category: string) =>
    `${name}, ${place} bölgesinde ${category.toLowerCase()}.`,
};

const en: typeof tr = {
  lang: "en-US",
  nav: {
    about: "About",
    services: "Services",
    menu: "Menu",
    gallery: "Gallery",
    reviews: "Reviews",
    hours: "Hours",
    location: "Location",
    contact: "Contact",
    faq: "FAQ",
    pricing: "Pricing",
    team: "Team",
    beforeAfter: "Before / After",
  },
  header: { sections: "Sections", backToTop: "back to top", switchTo: "TR", switchAria: "Türkçe sürüm" },
  skipToContent: "Skip to content",
  bar: { call: "Call", directions: "Directions", whatsapp: "WhatsApp", aria: "Quick contact" },
  cta: { whatsapp: "WhatsApp", call: "Call", directions: "Directions", email: "Email", instagram: "Instagram" },
  days: { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" },
  hours: {
    today: "today",
    closed: "Closed",
    unknown: "—",
    schedule: "Opening hours",
    openUntil: (until: string) => `Open now · until ${until}`,
    open24: "Open now · 24 hours",
    allDay: "Open 24 hours",
    closedNow: "Closed now",
    closedOpensAt: (at: string) => `Closed now · opens at ${at}`,
    closedOpens: (day: string, at: string) => `Closed today · opens ${day} at ${at}`,
    caption: (name: string) => `${name} opening hours`,
  },
  reviews: {
    ratingAria: (r: number) => `${r} out of 5`,
    summary: (count: number, source: string) => `${count} reviews on ${source}`,
  },
  location: { directions: "Get Directions" },
  contact: {
    select: "Select",
    note: "When you press send, your message opens in WhatsApp ready to go.",
    fromSite: (name: string) => `${name} — message from the website`,
  },
  footer: { madeBy: "Website by fourpear" },
  whatsappDefault: (name: string) => `Hello, I'd like some information about ${name}.`,
  metaDescription: (name: string, place: string, category: string) => `${name} — ${category} in ${place}.`,
};

const DICT: Record<Locale, typeof tr> = { tr, en };

export function t(locale: Locale = DEFAULT_LOCALE) {
  return DICT[locale];
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
