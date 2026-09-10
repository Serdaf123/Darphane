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
  /** Kırpmada korunacak nokta: "50% 20%" (yüz üstteyse), "center", "left top" */
  focal: z.string().optional(),
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
  /** Footer'da küçük punto yasal/bilgi notu (ör. avukat reklam yasağı cümlesi) */
  footerNote: z.string().optional(),
  /** Satışta bağlanan alan adı (www'suz): "olymposgardenhotel.com". next.config host'a göre yönlendirir. */
  domain: z
    .string()
    .regex(/^(?!www\.)[a-z0-9-]+(\.[a-z0-9-]+)+$/, "Alan adı küçük harf, www'suz: ornek.com")
    .optional(),
});
export type Business = z.infer<typeof businessSchema>;

export const THEME_PRESETS = [
  "porcelain",
  "ember",
  "sage",
  "midnight",
  "cobalt",
  "sand",
  "bosphorus",
  "graphite",
  "ink",
] as const;

/** Font çiftleri — tanımlar lib/fonts.ts'te */
export const FONT_PAIRINGS = ["classic", "hospitality", "clean", "craft", "soft", "bold", "editorial", "plex", "noto"] as const;
export type ThemePreset = (typeof THEME_PRESETS)[number];

export const HERO_MOTIONS = ["rise", "reveal", "blur", "curtain", "zoom", "split", "stack", "counter", "none"] as const;
export const SCROLL_MOTIONS = ["rise", "fade", "slide", "scale", "none"] as const;
export const HEADER_STYLES = ["glass", "solid", "minimal", "none"] as const;

/**
 * Hareket: hero girişi ve kaydırınca beliren bölümler.
 * hero   rise    → metinler alttan sırayla, görsel hafif yaklaşır (varsayılan)
 *        reveal  → satırlar perde arkasından çıkar, görsel soldan açılır
 *        blur    → netleşerek belirir
 *        curtain → tema renginde perde yukarı kalkar, sonra metinler
 *        zoom    → görsel uzaktan yaklaşır, metinler yumuşak belirir
 * scroll rise / fade / slide / scale / none
 *        split   → başlık harf harf, maskeli satırlardan yükselir (GSAP SplitText)
 * smooth   → Lenis yumuşak kaydırma
 * parallax → hero görseli kaydırırken içerikten yavaş hareket eder
 */
const motionSchema = z.object({
  hero: z.enum(HERO_MOTIONS).default("rise"),
  scroll: z.enum(SCROLL_MOTIONS).default("rise"),
  smooth: z.boolean().default(false),
  parallax: z.boolean().default(false),
});
export type Motion = z.infer<typeof motionSchema>;

const themeSchema = z.object({
  preset: z.enum(THEME_PRESETS).default("porcelain"),
  /**
   * Verilirse preset yerine bu vurgu renginden OKLCH ile tam palet üretilir
   * (nötrler de bu renge boyanır, kontrast garanti). Fotoğraftan çıkarmak için:
   * npm run palette -- <slug> [--apply]
   */
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, "accent #rrggbb olmalı").optional(),
  /** accent ile birlikte: açık mı koyu mu dünya */
  mode: z.enum(["light", "dark"]).default("light"),
  /** Nötrlerin vurgu rengine boyanma derecesi 0–1 (0 saf gri) */
  neutralTint: z.number().min(0).max(1).default(0.35),
  /** Akışkan tip ölçeği: compact 1.15→1.25 · normal 1.2→1.333 · display 1.25→1.414 */
  typeScale: z.enum(["compact", "normal", "display"]).default("normal"),
  /**
   * classic     Inter + Playfair · nötr
   * hospitality Manrope + Cormorant · otel, restoran
   * clean       Figtree · klinik, teknik servis
   * craft       Bricolage + Source Serif · ocakbaşı, zanaat
   * soft        DM Sans + Fraunces · fırın, kafe, spa
   * bold        Space Grotesk · berber, oto, spor
   * editorial   EB Garamond + IBM Plex Sans · avukat, muhasebe, mimar, danışman
   * plex        IBM Plex Serif + Sans · gazete/editoryal, muhasebe, danışmanlık
   * noto        Noto Serif + Noto Sans · en geniş Türkçe/çok dilli destek, güvenli
   */
  fonts: z.enum(FONT_PAIRINGS).default("classic"),
  /** Başlıklar çiftin display yüzünü mü, gövde yüzünü mü kullansın */
  headingFont: z.enum(["sans", "display"]).default("sans"),
  radius: z.enum(["none", "sm", "md", "lg"]).default("md"),
  density: z.enum(["tight", "normal", "airy"]).default("normal"),
  /**
   * glass   → hero görselinin üstünde saydam, kaydırınca buzlu cam (varsayılan)
   * solid   → her zaman dolu zemin
   * minimal → sadece isim + tek buton, menü yok
   * none    → header yok
   */
  header: z.enum(HEADER_STYLES).default("glass"),
  /** mono: fotoğraflar tek ton, üzerine gelince renklenir (avukat, mimar, editoryal) */
  photos: z.enum(["color", "mono"]).default("color"),
  /** bar: mobilde alt bar · fab: yüzen WhatsApp/Ara butonu (her ekran) · both: mobilde bar + masaüstünde fab */
  contact: z.enum(["bar", "fab", "both"]).default("both"),
  /** dial: yukarı açılan hızlı arama (yeşil) · pill: yana uzayan hap, tema vurgu renginde (editoryal) */
  fabStyle: z.enum(["dial", "pill"]).default("dial"),
  motion: motionSchema.prefault({}),
});
export type Theme = z.infer<typeof themeSchema>;

/* ---------------------------------- Bölümler --------------------------------- */

const sectionBase = {
  /** Sayfa içi bağlantı için; verilmezse tipten türetilir */
  id: z.string().optional(),
  /** Header menüsündeki kısa ad; verilmezse tipten türetilir ("Menü", "Galeri"…) */
  navLabel: z.string().optional(),
  /** Header menüsünde görünmesin */
  hideFromNav: z.boolean().optional(),
};

const heroSection = z.object({
  ...sectionBase,
  type: z.literal("hero"),
  /** image: tam görsel · split: metin + görsel · minimal: sade · statement: koyu antet, büyük isim, fotoğrafsız meslekler */
  variant: z.enum(["image", "split", "minimal", "statement"]).default("image"),
  /** Opt-in compact first screen; existing sites keep their layout. */
  compact: z.boolean().optional(),
  headline: z.string(),
  subline: z.string().optional(),
  image: imageSchema.optional(),
  /** image hero'da sessiz döngü video (mp4/webm); image poster olarak kalır. "Hareketi azalt" → yalnız poster. */
  video: z.object({ src: z.string(), type: z.string().default("video/mp4") }).optional(),
  actions: z.array(actionSchema).default([]),
  /** "20 yıllık tecrübe" gibi kısa güven işaretleri */
  badges: z.array(z.string()).default([]),
  /**
   * Gece 02:00 kullanıcısı için: statement hero'da ismin ÜSTÜNDE büyük telefon
   * numarası + tek satır yönlendirme. Avukat, veteriner, çilingir, tesisatçı gibi
   * "şimdi lazım" mesleklerde ilk ekran numaradır.
   */
  urgent: z
    .object({
      /** "Gözaltı veya tutuklama mı var?" */
      title: z.string(),
      /** Numaranın altındaki satır: "Ulaşamazsanız WhatsApp'a 'acil' yazın" */
      note: z.string().optional(),
      /** Acil WhatsApp kapısının hazır mesajı; verilirse note bir wa.me bağlantısı olur */
      whatsappMessage: z.string().optional(),
    })
    .optional(),
  /** Statement hero'daki arka plan monogramı; verilmezse isimden türer */
  monogram: z.string().optional(),
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
  /** cards: kutulu · list: tek sütun satırlar · grid: iki sütun, kutusuz */
  layout: z.enum(["cards", "list", "grid"]).default("cards"),
  /** dark: bölüm mürekkep zeminli koyu panel olur — sayfaya koyu/açık ritmi verir */
  tone: z.enum(["light", "dark"]).default("light"),
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
  /** list: fiyat listesi satırları · photos: fotoğraflı kartlar (görseli olan ürünler) */
  layout: z.enum(["list", "photos"]).default("list"),
  groups: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.string().optional(),
          image: imageSchema.optional(),
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
  /** cards: kutulu ızgara · quotes: kutusuz büyük alıntılar (az yorumda) · marquee: akan şerit (4+ yorumda) */
  layout: z.enum(["cards", "quotes", "marquee"]).default("cards"),
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

/** Fiyat tablosu: kuaför, spor salonu, klinik paketleri. En fazla 4 plan. */
const pricingSection = z.object({
  ...sectionBase,
  type: z.literal("pricing"),
  title: z.string().default("Fiyatlar"),
  intro: z.string().optional(),
  /** "Fiyatlar KDV dahildir" gibi dipnot */
  note: z.string().optional(),
  plans: z
    .array(
      z.object({
        name: z.string(),
        price: z.string(),
        /** "/ ay", "/ seans" */
        period: z.string().optional(),
        description: z.string().optional(),
        features: z.array(z.string()).default([]),
        /** Öne çıkan plan vurgu renginde çerçeve alır */
        featured: z.boolean().optional(),
        action: actionSchema.optional(),
      })
    )
    .min(1)
    .max(4),
});

/** Ekip: klinik, büro, salon. Fotoğraf yoksa baş harf rozeti. */
const teamSection = z.object({
  ...sectionBase,
  type: z.literal("team"),
  title: z.string().default("Ekip"),
  intro: z.string().optional(),
  members: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        bio: z.string().optional(),
        image: imageSchema.optional(),
      })
    )
    .min(1),
});

/** Önce / sonra: klinik, kuaför, tadilat, detailing. Kaydırmalı karşılaştırma. */
const beforeAfterSection = z.object({
  ...sectionBase,
  type: z.literal("beforeAfter"),
  title: z.string().default("Önce / Sonra"),
  intro: z.string().optional(),
  pairs: z
    .array(
      z.object({
        label: z.string().optional(),
        before: imageSchema,
        after: imageSchema,
      })
    )
    .min(1),
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
  pricingSection,
  teamSection,
  beforeAfterSection,
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
 * demo    → bizim örnek sitemiz: şerit yok, süre yok, indeks kapalı (kişisel sitede gösterilir)
 */
export const OFFER_STATUSES = ["draft", "pitched", "sold", "expired", "demo"] as const;

const offerSchema = z.object({
  status: z.enum(OFFER_STATUSES).default("draft"),
  /** ISO tarih; geçtiğinde site kendini kapatır */
  expiresAt: z.string().optional(),
  price: z.number().optional(),
  currency: z.string().default("TRY"),
  /** Ödeme linki (iyzico iyzilink / PayTR link). Varsa şeritteki ana buton buraya gider, WhatsApp ikinci buton olur. */
  paymentUrl: z.string().url().optional(),
  /**
   * İki paket sunmak için (teklif sayfasında): "hangisi?" sorusu "evet/hayır"dan iyi.
   * Verilmezse tek fiyat (price) gösterilir. price yine şeritte kalır (ilk paketin fiyatı olmalı).
   */
  packages: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        includes: z.array(z.string()).min(1),
        featured: z.boolean().optional(),
        paymentUrl: z.string().url().optional(),
      })
    )
    .max(3)
    .optional(),
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


/** Partial sections are validated as complete sections after merging. Null clears
 * an optional field (image/urgent, for example); required fields still fail. */
export const siteOverlaySchema = z.object({
  recipe: z.string().optional(),
  business: businessSchema.partial().optional(),
  seo: z.object({ title: z.string().optional(), description: z.string().optional(), ogImage: z.string().optional() }).optional(),
  theme: themeSchema.partial().optional(),
  sections: z.array(z.object({ id: z.string().min(1) }).catchall(z.unknown())).optional(),
  sectionOrder: z.array(z.string().min(1)).optional(),
  remove: z.array(z.string().min(1)).optional(),
}).strict();
export type SiteOverlay = z.infer<typeof siteOverlaySchema>;
