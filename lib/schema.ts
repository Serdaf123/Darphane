import { z } from "zod";

/**
 * Tek doğruluk kaynağı: bir işletme sitesi bu şemaya uyan tek bir JSON dosyasıdır.
 * data/sites/<slug>.json
 */

export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABELS: Record<DayKey, string> = {
  mon: "Pazartesi",
  tue: "Salı",
  wed: "Çarşamba",
  thu: "Perşembe",
  fri: "Cuma",
  sat: "Cumartesi",
  sun: "Pazar",
};

const time = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Saat 'HH:MM' biçiminde olmalı");

const timeRange = z.object({ open: time, close: time });
export type TimeRange = z.infer<typeof timeRange>;

/** Boş dizi = o gün kapalı. Alan yok = bilinmiyor. */
const dayRanges = z.array(timeRange);

const hoursSchema = z.object({
  timezone: z.string().default("Europe/Istanbul"),
  note: z.string().optional(),
  days: z.object({
    mon: dayRanges.optional(),
    tue: dayRanges.optional(),
    wed: dayRanges.optional(),
    thu: dayRanges.optional(),
    fri: dayRanges.optional(),
    sat: dayRanges.optional(),
    sun: dayRanges.optional(),
  }),
});
export type Hours = z.infer<typeof hoursSchema>;

const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  /** Galeride öne çıkarmak için */
  featured: z.boolean().optional(),
});
export type SiteImage = z.infer<typeof imageSchema>;

/** Buton eylemleri — hepsi sunucusuz çalışır. */
const actionSchema = z.object({
  label: z.string(),
  kind: z.enum(["call", "whatsapp", "directions", "link", "scroll", "instagram", "email"]),
  /** kind=link için URL, kind=scroll için bölüm id'si, diğerleri işletme bilgisinden türetilir */
  value: z.string().optional(),
  style: z.enum(["primary", "secondary", "ghost"]).default("primary"),
});
export type SiteAction = z.infer<typeof actionSchema>;

const businessSchema = z.object({
  name: z.string(),
  /** "Restoran", "Diş Kliniği", "Kuaför" — başlıklarda ve SEO'da kullanılır */
  category: z.string(),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  /** Uluslararası biçim, + ve boşluk olmadan: 905xxxxxxxxx */
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  coords: z.object({ lat: z.number(), lng: z.number() }).optional(),
  /** Google Haritalar paylaşım linki; yoksa adresten türetilir */
  mapsUrl: z.string().optional(),
  social: z
    .object({
      instagram: z.string().optional(),
      facebook: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .prefault({}),
  hours: hoursSchema.optional(),
  logo: imageSchema.optional(),
});
export type Business = z.infer<typeof businessSchema>;

export const THEME_PRESETS = [
  "porcelain",
  "ember",
  "sage",
  "midnight",
  "cobalt",
  "sand",
] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

const themeSchema = z.object({
  preset: z.enum(THEME_PRESETS).default("porcelain"),
  /** Başlık fontu */
  headingFont: z.enum(["sans", "display"]).default("sans"),
  radius: z.enum(["none", "sm", "md", "lg"]).default("md"),
  density: z.enum(["tight", "normal", "airy"]).default("normal"),
});
export type Theme = z.infer<typeof themeSchema>;

/* ---------------------------------- Bölümler --------------------------------- */

const sectionBase = {
  /** Sayfa içi bağlantı için; verilmezse tipten türetilir */
  id: z.string().optional(),
};

const heroSection = z.object({
  ...sectionBase,
  type: z.literal("hero"),
  variant: z.enum(["image", "split", "minimal"]).default("image"),
  headline: z.string(),
  subline: z.string().optional(),
  image: imageSchema.optional(),
  actions: z.array(actionSchema).default([]),
  /** "20 yıllık tecrübe" gibi kısa güven işaretleri */
  badges: z.array(z.string()).default([]),
});

const aboutSection = z.object({
  ...sectionBase,
  type: z.literal("about"),
  title: z.string().default("Hakkımızda"),
  body: z.string(),
  image: imageSchema.optional(),
  highlights: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
});

const servicesSection = z.object({
  ...sectionBase,
  type: z.literal("services"),
  title: z.string().default("Hizmetlerimiz"),
  intro: z.string().optional(),
  layout: z.enum(["cards", "list"]).default("cards"),
  items: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      price: z.string().optional(),
    })
  ),
});

const menuSection = z.object({
  ...sectionBase,
  type: z.literal("menu"),
  title: z.string().default("Menü"),
  intro: z.string().optional(),
  groups: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.string().optional(),
        })
      ),
    })
  ),
});

const gallerySection = z.object({
  ...sectionBase,
  type: z.literal("gallery"),
  title: z.string().default("Galeri"),
  layout: z.enum(["grid", "masonry", "strip"]).default("grid"),
  images: z.array(imageSchema),
});

const reviewsSection = z.object({
  ...sectionBase,
  type: z.literal("reviews"),
  title: z.string().default("Müşterilerimiz ne diyor?"),
  /** Google puanı gibi bir özet */
  summary: z.object({ rating: z.number(), count: z.number(), source: z.string() }).optional(),
  items: z.array(
    z.object({
      author: z.string(),
      rating: z.number().min(1).max(5).default(5),
      text: z.string(),
      source: z.string().optional(),
    })
  ),
});

const hoursSection = z.object({
  ...sectionBase,
  type: z.literal("hours"),
  title: z.string().default("Çalışma Saatleri"),
});

const locationSection = z.object({
  ...sectionBase,
  type: z.literal("location"),
  title: z.string().default("Nasıl Gelinir?"),
  /** Haritayı gömmek gizlilik/hız açısından maliyetli; varsayılan kapalı */
  showMap: z.boolean().default(true),
  note: z.string().optional(),
});

const contactSection = z.object({
  ...sectionBase,
  type: z.literal("contact"),
  title: z.string().default("İletişim"),
  intro: z.string().optional(),
  /** Form gönderimi WhatsApp'a önceden doldurulmuş mesaj olarak gider */
  form: z
    .object({
      enabled: z.boolean().default(true),
      submitLabel: z.string().default("WhatsApp'tan Gönder"),
      fields: z
        .array(
          z.object({
            name: z.string(),
            label: z.string(),
            type: z.enum(["text", "tel", "email", "textarea", "date", "select"]).default("text"),
            required: z.boolean().default(false),
            options: z.array(z.string()).optional(),
          })
        )
        .default([]),
    })
    .prefault({}),
});

const faqSection = z.object({
  ...sectionBase,
  type: z.literal("faq"),
  title: z.string().default("Sıkça Sorulan Sorular"),
  items: z.array(z.object({ q: z.string(), a: z.string() })),
});

const ctaSection = z.object({
  ...sectionBase,
  type: z.literal("cta"),
  headline: z.string(),
  subline: z.string().optional(),
  actions: z.array(actionSchema).default([]),
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSection,
  aboutSection,
  servicesSection,
  menuSection,
  gallerySection,
  reviewsSection,
  hoursSection,
  locationSection,
  contactSection,
  faqSection,
  ctaSection,
]);
export type Section = z.infer<typeof sectionSchema>;
export type SectionType = Section["type"];

/* ----------------------------------- Teklif ---------------------------------- */

/**
 * draft   → hazırlanıyor, kimseye gösterilmedi
 * pitched → teklif gönderildi, geri sayım işliyor
 * sold    → satıldı: geri sayım kalkar, arama motorlarına açılır
 * expired → süre doldu, elle kapatıldı
 */
export const OFFER_STATUSES = ["draft", "pitched", "sold", "expired"] as const;

const offerSchema = z.object({
  status: z.enum(OFFER_STATUSES).default("draft"),
  /** ISO tarih; geçtiğinde site kendini kapatır */
  expiresAt: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().default("TRY"),
  /** Teklifi gönderen bizim taraf — geri sayım şeridindeki butonlar buraya gider */
  seller: z
    .object({
      name: z.string().default("fourpear"),
      whatsapp: z.string(),
      email: z.string().optional(),
    })
    .optional(),
});
export type Offer = z.infer<typeof offerSchema>;

/* ------------------------------------ Site ----------------------------------- */

export const siteSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug küçük harf ve tire içermeli"),
  business: businessSchema,
  theme: themeSchema.prefault({}),
  sections: z.array(sectionSchema).min(1),
  offer: offerSchema.prefault({}),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      ogImage: z.string().optional(),
    })
    .prefault({}),
});

export type Site = z.infer<typeof siteSchema>;
