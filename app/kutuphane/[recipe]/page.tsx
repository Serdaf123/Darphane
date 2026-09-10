import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SitePage } from "@/components/SitePage";
import { applyRecipe, getRecipe, loadRecipes } from "@/lib/recipe";
import { HEADER_STYLES, HERO_MOTIONS, SCROLL_MOTIONS, type Site } from "@/lib/schema";
import { getSite, listSiteSlugs } from "@/lib/sites";

export const dynamic = "force-dynamic";

type Query = Record<string, string | string[] | undefined>;
const DEFAULT_SITE = "adraga-veteriner";
const FABS = ["dial", "pill"] as const;
const CONTACTS = ["fab", "bar", "both"] as const;

function pick<T extends readonly string[]>(value: string | string[] | undefined, list: T): T[number] | undefined {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T[number]) : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ recipe: string }> }): Promise<Metadata> {
  const { recipe } = await params;
  const r = getRecipe(recipe);
  return { title: r ? `${r.name} — kütüphane` : "Kütüphane", robots: { index: false, follow: false, nocache: true } };
}

/** Reçete + örnek site + çubuktan seçilen hareket/buton/header → gerçek SitePage. ?frame=1 çubuğu gizler (telefon önizlemesi). */
export default async function RecipePage({ params, searchParams }: { params: Promise<{ recipe: string }>; searchParams: Promise<Query> }) {
  const { recipe: key } = await params;
  const sp = await searchParams;
  const recipe = getRecipe(key);
  if (!recipe) notFound();

  const slugs = listSiteSlugs();
  const slug = typeof sp.site === "string" && slugs.includes(sp.site) ? sp.site : slugs.includes(DEFAULT_SITE) ? DEFAULT_SITE : slugs[0];
  const base = getSite(slug, "tr", "a");
  if (!base) notFound();

  const hero = pick(sp.hero, HERO_MOTIONS);
  const scroll = pick(sp.scroll, SCROLL_MOTIONS);
  const fab = pick(sp.fab, FABS);
  const contact = pick(sp.contact, CONTACTS);
  const header = pick(sp.header, HEADER_STYLES);

  const applied = applyRecipe(base, recipe);
  const site: Site = {
    ...applied,
    // Kütüphanede teklif şeridi olmasın: demo gibi çizilir
    offer: { ...applied.offer, status: "demo" },
    theme: {
      ...applied.theme,
      ...(header ? { header } : {}),
      ...(contact ? { contact } : {}),
      ...(fab ? { fabStyle: fab } : {}),
      motion: { ...applied.theme.motion, ...(hero ? { hero } : {}), ...(scroll ? { scroll } : {}) },
    },
  };

  const current = { site: slug, hero: site.theme.motion.hero, scroll: site.theme.motion.scroll, fab: site.theme.fabStyle, contact: site.theme.contact, header: site.theme.header };
  const href = (patch: Partial<typeof current>, r = key) => {
    const q = new URLSearchParams();
    const merged = { ...current, ...patch };
    q.set("site", merged.site);
    q.set("hero", merged.hero);
    q.set("scroll", merged.scroll);
    q.set("fab", merged.fab);
    q.set("contact", merged.contact);
    q.set("header", merged.header);
    return `/kutuphane/${r}?${q.toString()}`;
  };
  const frame = sp.frame === "1";

  return (
    <>
      {frame ? null : (
        <div className="lib-bar">
          <Link href="/kutuphane">← Kütüphane</Link>
          <strong>{recipe.name}</strong>
          <span>{recipe.family}</span>
          <span className="group">
            <span>Reçete</span>
            {loadRecipes().map((r) => (
              <Link key={r.key} href={href({}, r.key)} aria-current={r.key === key ? "true" : undefined}>{r.name}</Link>
            ))}
          </span>
          <span className="group">
            <span>Örnek</span>
            {slugs.map((s) => (
              <Link key={s} href={href({ site: s })} aria-current={s === slug ? "true" : undefined}>{s}</Link>
            ))}
          </span>
          <span className="group">
            <span>Hero girişi</span>
            {HERO_MOTIONS.map((m) => (
              <Link key={m} href={href({ hero: m })} aria-current={m === current.hero ? "true" : undefined}>{m}</Link>
            ))}
          </span>
          <span className="group">
            <span>Kaydırma</span>
            {SCROLL_MOTIONS.map((m) => (
              <Link key={m} href={href({ scroll: m })} aria-current={m === current.scroll ? "true" : undefined}>{m}</Link>
            ))}
          </span>
          <span className="group">
            <span>İletişim</span>
            {CONTACTS.map((c) => (
              <Link key={c} href={href({ contact: c })} aria-current={c === current.contact ? "true" : undefined}>{c}</Link>
            ))}
            {FABS.map((f) => (
              <Link key={f} href={href({ fab: f })} aria-current={f === current.fab ? "true" : undefined}>{f}</Link>
            ))}
          </span>
          <span className="group">
            <span>Header</span>
            {HEADER_STYLES.map((h) => (
              <Link key={h} href={href({ header: h })} aria-current={h === current.header ? "true" : undefined}>{h}</Link>
            ))}
          </span>
        </div>
      )}
      <SitePage site={site} locale="tr" locales={["tr"]} variant="a" variants={["a"]} />
    </>
  );
}
