# Görev panosu — Claude ↔ Codex

İki ajan aynı repoda çalışıyor. Bu dosya kimin ne üzerinde olduğunu söyler; bir işi almadan önce buraya yaz, bitince ✅ yap ve PR linkini ekle. Kurallar ve dosya bölüşümü AGENTS.md'de, ürün kararları NOTLAR.md'de.

Durum: 🔧 üzerinde çalışılıyor · 🕐 sırada · ✅ bitti · ⛔ bloklu

## Claude (Serkan'ın Mac'i)
| Durum | İş | Not |
|---|---|---|
| ✅ | Kişisel site Tasarım A (`app/serkan-oral`, `components/serkan`) | canlı: `/` ve `/serkan-oral`; portre eklendi |
| ✅ | Kişisel site Tasarım B (Claude) `/serkan-oral/b` | 07.09; Serkan A / B / Codex konseptleri arasında seçecek |
| 🕐 | ChatGPT metin/görselleri Tasarım A'ya entegre etme | `content/serkan/copy.md` dolunca |
| 🕐 | A ve B karşılaştırma raporu | B PR'ı gelince |
| ✅ | Panel (`/panel`), GitHub'a yazan kayıt katmanı | canlıda yazıyor (07.09 11:00) |
| ✅ | KVKK çerez bandı + PostHog kapısı | anahtar gelince açılır |
| ✅ | Teklif sayfası, pricing/team/beforeAfter, performans turu, `npm run pitch`, Lighthouse CI | 07.09 gece |
| ✅ | Site temizliği (08.09): Olympos, avukat, Yellow Bull, Salon Ada, av-varyantlar silindi | kalan: noyavet (A/B/C), Ocakbaşı ve Diş demoları, kişisel site |
| 🕐 | Fiyat merdiveni kararı | teknik hazır: `offer.packages`, örnek silindi, `offer.packages` şemada duruyor |
| ⛔ | serkanoral.com.tr DNS | Turhost glue IP düzeltmesi (TRABİS) |

## Manus (metin)
| Durum | İş | Brif | Teslim |
|---|---|---|---|
| ✅ | Kişisel site metinleri | `briefs/01-metinler.md` | `content/serkan/copy.md` · 08.09 `--profile lite` ile geldi; Claude denetledi, entegrasyon Serkan'ın kararını bekliyor |

## ChatGPT (görsel)
| Durum | İş | Brif | Teslim |
|---|---|---|---|
| 🕐 | Kişisel site görselleri | `briefs/02-gorseller.md` | `public/sites/serkan-oral/*.webp` |

## Codex (GitHub)
| Durum | İş | Not |
|---|---|---|
| 🔧 | Kişisel site Tasarım B konseptleri (Portre/Galeri/Afiş) | dalda tamam (`origin/codex/serkan-design-b`), PR bekleniyor; birleştirmede Portre → `/b/portre` |
| 🕐 | (B onaylanırsa) Tasarım B'yi köke taşıma | Serkan seçer |

## Karşılaştırma ölçütleri (A vs B)
Mobil 390px'te okunurluk · Lighthouse mobil perf/a11y · reduced-motion davranışı · metin doğruluğu · ilk ekranın "ne iş yapıyor" sorusuna 3 saniyede cevap vermesi · WhatsApp'a giden tıklama sayısı (PostHog gelince).
