import { Item, Reveal, Stagger } from "@/components/motion/Reveal";
import { SiteImage } from "@/components/SiteImage";
import type { Section } from "@/lib/schema";

type GalleryData = Extract<Section, { type: "gallery" }>;

export function Gallery({ section, id }: { section: GalleryData; id: string }) {
  if (section.images.length === 0) return null;

  // strip: yatay kaydırmalı şerit — mobilde çok az yer kaplar
  if (section.layout === "strip") {
    return (
      <section id={id} className="section">
        <Reveal className="container">
          <h2 className="section-title">{section.title}</h2>
        </Reveal>
        <Reveal
          delay={0.1}
          className="mt-6 flex gap-4 overflow-x-auto px-5 pb-4 md:px-8"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {section.images.map((image, index) => (
            <div
              key={image.src + index}
              className="relative aspect-3/4 shrink-0 overflow-hidden"
              style={{
                width: "min(72vw, 20rem)",
                borderRadius: "var(--radius)",
                scrollSnapAlign: "center",
              }}
            >
              <SiteImage image={image} sizes="72vw" className="h-full w-full" />
            </div>
          ))}
        </Reveal>
      </section>
    );
  }

  const isMasonry = section.layout === "masonry";

  return (
    <section id={id} className="section">
      <div className="container flex flex-col gap-[var(--stack-gap)]">
        <Reveal>
          <h2 className="section-title">{section.title}</h2>
        </Reveal>
        <Stagger step={0.06} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {section.images.map((image, index) => (
            <Item
              key={image.src + index}
              className="relative overflow-hidden"
              style={{
                borderRadius: "var(--radius)",
                // masonry hissi: öne çıkarılanlar iki kat yer kaplar
                aspectRatio: isMasonry && image.featured ? "1 / 1" : "4 / 3",
                gridColumn: isMasonry && image.featured ? "span 2" : undefined,
              }}
            >
              <SiteImage
                image={image}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-full w-full"
              />
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
