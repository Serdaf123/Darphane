import Image from "next/image";
import type { SiteImage as SiteImageData } from "@/lib/schema";

/**
 * Görsel yoksa site bozulmasın: tema renginden bir dolgu blok çizilir.
 * Böylece içerik hazır olmadan da site sunulabilir hale gelir.
 */
export function SiteImage({
  image,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  image?: SiteImageData;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!image) {
    return (
      <div
        aria-hidden
        className={className}
        style={{
          background:
            "linear-gradient(135deg, var(--c-surface-alt) 0%, var(--c-surface) 100%)",
        }}
      />
    );
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      fetchPriority={priority ? "high" : undefined}
      className={className}
      style={{ objectFit: "cover", objectPosition: image.focal ?? "center" }}
    />
  );
}
