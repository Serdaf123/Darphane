import { calculateTypeScale } from "utopia-core";

/**
 * Akışkan tip ölçeği (Utopia). Bütün puntolar tek bir orandan türer:
 * 360px'te 1.2 (minor third), 1440px'te 1.333 (perfect fourth).
 * --step--2 … --step-6 CSS değişkenleri site köküne yazılır; bileşenler
 * elle clamp() yazmaz, rol seçer: gövde 0, giriş 1, h2 4, h1 5/6.
 *
 * Erişilebilirlik: clamp yakınlaştırmayı kısıtlar; rem tabanlı olduğu için
 * kullanıcı font boyutu ayarına saygılı, %400 zoom'da yine büyür.
 */

export const TYPE_SCALES = {
  /** Sık ve yoğun: klinik, teknik servis */
  compact: { minTypeScale: 1.15, maxTypeScale: 1.25 },
  /** Varsayılan */
  normal: { minTypeScale: 1.2, maxTypeScale: 1.333 },
  /** Görsel ağırlıklı, büyük başlık: otel, restoran, avukat antet */
  display: { minTypeScale: 1.25, maxTypeScale: 1.414 },
} as const;
export type TypeScaleName = keyof typeof TYPE_SCALES;

const cache = new Map<TypeScaleName, Record<string, string>>();

export function typeScaleVars(name: TypeScaleName = "normal"): Record<string, string> {
  const hit = cache.get(name);
  if (hit) return hit;
  const steps = calculateTypeScale({
    minWidth: 360,
    maxWidth: 1440,
    minFontSize: 16,
    maxFontSize: 18,
    positiveSteps: 6,
    negativeSteps: 2,
    ...TYPE_SCALES[name],
  });
  const vars: Record<string, string> = {};
  for (const s of steps) vars[`--step-${s.step}`.replace("--step--", "--step-n")] = s.clamp;
  cache.set(name, vars);
  return vars;
}
