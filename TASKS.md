# Görev panosu — Claude ↔ Codex

İki ajan aynı repoda çalışıyor. Bu dosya kimin ne üzerinde olduğunu söyler; bir işi almadan önce buraya yaz, bitince ✅ yap ve PR linkini ekle. Kurallar ve dosya bölüşümü AGENTS.md'de, ürün kararları NOTLAR.md'de.

Durum: 🔧 üzerinde çalışılıyor · 🕐 sırada · ✅ bitti · ⛔ bloklu

## Claude (Serkan'ın Mac'i)
| Durum | İş | Not |
|---|---|---|
| ✅ | Kişisel site Tasarım A (`app/serkan-oral`, `components/serkan`) | canlı: `/` ve `/serkan-oral` |
| ✅ | Panel (`/panel`), GitHub'a yazan kayıt katmanı | token bekliyor |
| 🕐 | KVKK çerez bandı + PostHog açılışı | anahtar gelince |
| 🕐 | Yellow Bull teklif paketi | A/B kararı + yorum sayısı bekliyor |
| ⛔ | serkanoral.com.tr DNS | Turhost glue IP düzeltmesi (TRABİS) |

## Codex (GitHub)
| Durum | İş | Not |
|---|---|---|
| 🕐 | Kişisel site Tasarım B (`app/serkan-oral/b`, `components/serkan-b`) | Tasarım A'nın olgularını kullan, yeni iddia yok; PR ile |
| 🕐 | (B onaylanırsa) Tasarım B'yi köke taşıma | Serkan seçer |

## Karşılaştırma ölçütleri (A vs B)
Mobil 390px'te okunurluk · Lighthouse mobil perf/a11y · reduced-motion davranışı · metin doğruluğu · ilk ekranın "ne iş yapıyor" sorusuna 3 saniyede cevap vermesi · WhatsApp'a giden tıklama sayısı (PostHog gelince).
