import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteFacts } from "@/components/konsept/facts";
import { CONCEPTS, CONCEPT_LOADERS, isConceptKey } from "@/components/konsept/registry";
import { getSite, listSiteSlugs } from "@/lib/sites";

export const dynamic = "force-dynamic";

const DEFAULT_SITE = "pisi-veteriner";
type Query = Record<string, string | string[] | undefined>;

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  const c = CONCEPTS.find((x) => x.key === key);
  return { title: c ? `${c.name} — konsept` : "Konsept", robots: { index: false, follow: false, nocache: true } };
}

/** Konsept + örnek site. ?frame=1 çubuğu gizler (telefon önizlemesi). */
export default async function KonseptPage({ params, searchParams }: { params: Promise<{ key: string }>; searchParams: Promise<Query> }) {
  const { key } = await params;
  const sp = await searchParams;
  if (!isConceptKey(key)) notFound();
  const slugs = listSiteSlugs();
  const slug = typeof sp.site === "string" && slugs.includes(sp.site) ? sp.site : slugs.includes(DEFAULT_SITE) ? DEFAULT_SITE : slugs[0];
  const site = getSite(slug, "tr", "a");
  if (!site) notFound();
  const facts = siteFacts(site);
  const { default: Concept } = await CONCEPT_LOADERS[key]();
  const index = CONCEPTS.findIndex((c) => c.key === key);
  const prev = CONCEPTS[(index + CONCEPTS.length - 1) % CONCEPTS.length];
  const next = CONCEPTS[(index + 1) % CONCEPTS.length];
  const frame = sp.frame === "1";
  return (
    <>
      {frame ? null : (
        <div className="lib-bar">
          <Link href="/konsept">← Konseptler</Link>
          <strong>{index + 1}/15 · {CONCEPTS[index].name}</strong>
          <span>{CONCEPTS[index].idea}</span>
          <span className="group">
            <Link href={`/konsept/${prev.key}?site=${slug}`}>← {prev.name}</Link>
            <Link href={`/konsept/${next.key}?site=${slug}`}>{next.name} →</Link>
          </span>
          <span className="group">
            <span>Örnek</span>
            {slugs.map((s) => (
              <Link key={s} href={`/konsept/${key}?site=${s}`} aria-current={s === slug ? "true" : undefined}>{s}</Link>
            ))}
          </span>
        </div>
      )}
      <Concept facts={facts} />
    </>
  );
}
