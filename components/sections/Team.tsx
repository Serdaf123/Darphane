import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/SiteImage";
import type { Section } from "@/lib/schema";

type TeamData = Extract<Section, { type: "team" }>;

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => !/^(av|dr|dt|op|prof|doç|uzm)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]?.toLocaleUpperCase("tr-TR") ?? "")
    .join("");
}

/** Ekip kartları: fotoğraf varsa 4:5, yoksa baş harf rozeti. */
export function Team({ section, id }: { section: TeamData; id: string }) {
  const n = section.members.length;
  const anyPhoto = section.members.some((m) => m.image);
  if (!anyPhoto) {
    // Fotoğraf yoksa dev boş kutular yerine satır düzeni: baş harf rozeti + isim/rol
    return (
      <section id={id} className="section">
        <div className="container flex flex-col gap-[var(--stack-gap)]">
          <Reveal className="flex flex-col gap-[var(--stack-gap)]">
            <h2 className="section-title">{section.title}</h2>
            {section.intro ? <p className="section-intro">{section.intro}</p> : null}
          </Reveal>
          <Stagger as="ul" className="mt-2 flex max-w-3xl flex-col" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {section.members.map((m) => (
              <Item as="li" key={m.name} className="flex items-start gap-4 py-4" style={{ borderBottom: "1px solid var(--c-border)" }}>
                <span
                  aria-hidden
                  className="grid shrink-0 place-items-center rounded-full font-semibold"
                  style={{ width: "3rem", height: "3rem", background: "var(--c-surface-alt)", color: "var(--c-accent)", fontFamily: "var(--font-heading)" }}
                >
                  {initials(m.name)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{m.name}</h3>
                  {m.role ? <p className="muted text-sm">{m.role}</p> : null}
                  {m.bio ? <p className="mt-1 text-sm leading-relaxed">{m.bio}</p> : null}
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>
    );
  }
  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal className="flex flex-col gap-[var(--stack-gap)]">
          <h2 className="section-title">{section.title}</h2>
          {section.intro ? <p className="section-intro">{section.intro}</p> : null}
        </Reveal>
        <Stagger className={`mt-2 grid gap-6 ${n === 1 ? "max-w-md" : n === 2 ? "sm:grid-cols-2 max-w-3xl" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {section.members.map((m) => (
            <Item key={m.name} className="flex flex-col gap-3">
              {m.image ? (
                <div className="relative aspect-4/5 overflow-hidden" style={{ borderRadius: "var(--radius)" }}>
                  <SiteImage image={m.image} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="flex aspect-4/5 items-center justify-center text-5xl font-semibold"
                  style={{ borderRadius: "var(--radius)", background: "var(--c-surface-alt)", color: "var(--c-accent)", fontFamily: "var(--font-heading)" }}
                >
                  {initials(m.name)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{m.name}</h3>
                {m.role ? <p className="muted text-sm">{m.role}</p> : null}
                {m.bio ? <p className="mt-2 text-sm leading-relaxed">{m.bio}</p> : null}
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
