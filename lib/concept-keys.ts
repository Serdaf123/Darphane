/** Konsept anahtarları: site JSON'unda `concept` alanı bunlardan birini alır (bileşenler components/konsept/). */
export const CONCEPT_KEYS = ["nobet", "kartvizit", "fis", "duvar", "album", "defter", "sohbet", "harita", "manset", "perde", "rozet", "bosluk", "tabela", "takvim", "katalog"] as const;
export type ConceptKey = (typeof CONCEPT_KEYS)[number];
export function isConceptKey(key: string): key is ConceptKey {
  return (CONCEPT_KEYS as readonly string[]).includes(key);
}
