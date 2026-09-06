/**
 * Arayüz metinleri. İçerik JSON'dan gelir; buradakiler bileşenlerin kendi
 * kelimeleri (buton adları, gün adları, "şu an açık"…).
 *
 * İngilizce sürüm: data/sites/<slug>.en.json (kısmi, TR üstüne biner)
 * + bu sözlük. Turistik işletmelerde (otel, restoran) EN sayfa /en altında.
 */

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
    closedNow: "Şu an kapalı",
    closedOpensAt: (at: string) => `Şu an kapalı · ${at}'de açılıyor`,
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
    closedNow: "Closed now",
    closedOpensAt: (at: string) => `Closed now · opens at ${at}`,
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
