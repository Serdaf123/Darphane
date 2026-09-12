import type { ComponentType } from "react";
import type { Facts } from "./facts";

export type ConceptProps = { facts: Facts };

/** 15 konsept: her biri kendi bileşeni ve CSS'iyle ayrı bir dünya. Sıra sunum sırasıdır. */
export const CONCEPTS = [
  { key: "nobet", name: "Nöbet", idea: "Telefon numarası sayfanın kendisi; 24 saatlik kadran şu anki saati gösterir.", fits: "7/24 acil, nöbetçi eczane, çilingir" },
  { key: "kartvizit", name: "Kartvizit", idea: "İlk ekran bir kartvizit; dokununca arkası (harita, saatler) döner.", fits: "avukat, muhasebeci, usta, küçük ofis" },
  { key: "fis", name: "Fiş", idea: "Kasa fişi: hizmetler satır satır, noktalı kılavuz, yırtık kenar.", fits: "kafe, büfe, berber, tamirci" },
  { key: "duvar", name: "Duvar", idea: "Üç afiş, üç bölüm: kaydırdıkça bir sonraki afiş öne gelir.", fits: "spor salonu, müzik, etkinlik, dövme" },
  { key: "album", name: "Albüm", idea: "Aralıksız fotoğraf duvarı; yazı yalnız etiket kadar.", fits: "restoran, pastane, çiçekçi, kuaför" },
  { key: "defter", name: "Defter", idea: "Çizgili defter sayfaları, sağda sekmeler; muayenehane kaydı gibi.", fits: "klinik, veteriner, diş, fizyoterapi" },
  { key: "sohbet", name: "Sohbet", idea: "Sayfa bir WhatsApp sohbeti gibi açılır; alttaki kutu gerçek WhatsApp'a bağlar.", fits: "her esnaf; özellikle randevulu işler" },
  { key: "harita", name: "Harita", idea: "Harita tam ekran, işletme üstünde yüzen bir kart: önce 'nerede'.", fits: "mahalle esnafı, otopark, servis, market" },
  { key: "manset", name: "Manşet", idea: "Gazete ilk sayfası: manşet, sütunlar, okur mektubu gibi yorumlar.", fits: "kasap, fırın, lokanta, eski esnaf" },
  { key: "perde", name: "Perde", idea: "Sinema perdesi: siyah bantlar, altyazı gibi yazılar, sahne sahne ilerleme.", fits: "bar, restoran, gece kulübü, fotoğrafçı" },
  { key: "rozet", name: "Rozet", idea: "Renkli duvara yapıştırılmış etiketler; her olgu bir rozet.", fits: "veteriner, pet shop, çocuk, oyun" },
  { key: "bosluk", name: "Boşluk", idea: "Her ekranda tek cümle, çok boşluk; sonunda telefon.", fits: "psikolog, spa, yoga, mimar" },
  { key: "tabela", name: "Tabela", idea: "Dükkânın tabelası ve sokak levhası siteye taşınır; ışıklı isim, kapı etiketi saatler.", fits: "her esnaf; tabelası olan herkes" },
  { key: "takvim", name: "Takvim", idea: "Haftalık şerit ilk ekran; güne dokununca o gün için WhatsApp mesajı hazır.", fits: "klinik, kuaför, güzellik, servis" },
  { key: "katalog", name: "Katalog", idea: "Her şey tek ekranda: bento karolar (saat, puan, harita, hizmet, fotoğraf).", fits: "hızlı karar isteyen her işletme" },
] as const;

export type ConceptKey = (typeof CONCEPTS)[number]["key"];

export function isConceptKey(key: string): key is ConceptKey {
  return CONCEPTS.some((c) => c.key === key);
}

/** Her konsept ayrı parça: yalnız açılan konseptin kodu iner. */
export const CONCEPT_LOADERS: Record<ConceptKey, () => Promise<{ default: ComponentType<ConceptProps> }>> = {
  nobet: () => import("./nobet"),
  kartvizit: () => import("./kartvizit"),
  fis: () => import("./fis"),
  duvar: () => import("./duvar"),
  album: () => import("./album"),
  defter: () => import("./defter"),
  sohbet: () => import("./sohbet"),
  harita: () => import("./harita"),
  manset: () => import("./manset"),
  perde: () => import("./perde"),
  rozet: () => import("./rozet"),
  bosluk: () => import("./bosluk"),
  tabela: () => import("./tabela"),
  takvim: () => import("./takvim"),
  katalog: () => import("./katalog"),
};
