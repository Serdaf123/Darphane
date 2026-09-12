# Görev (Codex): Excel'deki bütün siteleri reçete tabanına taşı (A ve B, zıt aileler)

Önce `AGENTS.md` ve `DARPHANE.md`'yi oku; `docs/tasarim-kutuphanesi.md` ve canlı vitrini (https://fourpear.vercel.app/kutuphane) incele. Çalışma yeri: **`~/Desktop/darphane-codex` worktree'si** (önce `git pull --ff-only origin main`), dal `codex/excel-recete`, PR hedefi `main`. Ana klasöre dokunma.

## Kapsam: Drive'daki `sitesiz-lead` tablosundaki altı işletme

| slug | Kategori | A bugün | B bugün |
|---|---|---|---|
| `esatpasa-veteriner` | 7/24 veteriner, Ataşehir | elle (image hero, clean, glass, both/dial) | senin katmanın (midnight, statement/compact, fab) |
| `esenler-bati-veteriner` | veteriner, Esenler, 12–24 | elle (split, noto, solid, both) | senin katmanın (graphite, statement/compact, fab) |
| `kucukyali-veteriner` | mahalle veterineri, Maltepe, WhatsApp yok | elle (split, soft, minimal header, bar) | senin katmanın (porcelain, minimal, fab tek eylem) |
| `adraga-veteriner` | veteriner, Maltepe sahil | elle (image, craft, glass, both/pill) | senin katmanın (ink, split/compact, fab) |
| `pisi-veteriner` | veteriner, Beylikdüzü, kuş/tavşan da | elle (split, clean, solid, both/dial) | `npm run recipe -- pisi-veteriner afis` (Claude, hızlı) |
| `polen-veteriner` | veteriner, Maltepe Cevizli, egzotik; saatler eksik, yorum yok | elle (image, soft, glass, both/dial) | `npm run recipe -- polen-veteriner sahne` (Claude, hızlı) |

Serkan'ın kararı: "Excel'deki tüm tasarımları bu yönde düzenle" = her sitenin A'sı ve B'si **kütüphanedeki bir reçeteye** oturur, ikisi **zıt aileden** olur, animasyonlar ve yüzen buton kütüphanedeki gibi çalışır. Elle yapılmış A'lar reçeteye "çevrilir": metinler, fotoğraflar ve olgular aynen kalır; iskelet (hero varyantı, bölüm sırası, düzenler, hareket, header, iletişim, tipografi) reçeteden gelir.

## Yapılacaklar

1. **A'yı reçeteye oturt.** Her site için A'ya en yakın açık aileli reçeteyi seç (`klinik`, `tezgah`, `vitrin`, `atolye`; Küçükyalı için `sessiz` olabilir). `npm run recipe -- <slug> <key>` çıktısını **A dosyasının kendisine** işle (A katman değil, tam dosya: `data/sites/<slug>.json` tema + bölüm sırası/düzenleri reçeteyle eşleşsin). Metin ve görsel değişmez. `recipe` alanı A'da da tutulacaksa `lib/schema.ts`'e `recipe?: string` ekle (isteğe bağlı, sadece kayıt).
2. **B'yi zıt aileden reçeteyle yeniden üret.** Kütüphanedeki eşleme tablosuna göre: 24 saat açık Esatpaşa → `gece-nobeti` (`counter` girişi, telefon önce); Esenler → `afis` (`split` girişi); Adraga → `defter` ya da `sahne`; Küçükyalı → `sessiz` (WhatsApp yok: tek eylem Ara); Pisi → `afis` (Claude'unki kalabilir, gözden geçir); Polen → `sahne` (yorum yok, `reviews` atlanır). Bugünkü B metinleri (`<slug>.b.json` içindeki ChatGPT metinleri) **korunur**: reçete çıktısını mevcut B katmanıyla birleştir (tema + sıra reçeteden, metin katmandan).
3. **Mobil hero girişleri:** en az iki B'de `stack`, 24 saat açık olanlarda `counter`. Reçete JSON'larında `motion.hero` bunu yansıtsın; `docs/tasarim-kutuphanesi.md`'de "Sıradaki genişletmeler" bölümündeki yaptıklarını işaretle.
4. **Kapı (her site için):** A ve B mobil ilk ekran yan yana gri tonda 2 saniyede ayırt edilmeli; 360/390px'te yatay taşma yok; ilk ekranda "açık mı · nerede · nasıl ulaşırım" cevaplı; B'de yüzen buton dial animasyonlu ve CTA'yı örtmüyor; "hareketi azalt" açıkken her şey görünür (bkz. NOTLAR §Teknik hidrasyon notu). Lighthouse mobil ≥ 95 en az iki sitede ölç ve PR'a yaz.
5. **Kütüphane kaydı:** `docs/tasarim-kutuphanesi.md`'ye "Kullanım" tablosu ekle: site → A reçetesi · B reçetesi · notlar. Reçete değiştirdiysen JSON + belge birlikte.
6. **Teslim:** `npm run typecheck && npm run lint && npm run build && npm run test:recipes` temiz; PR açıklamasında 12 ekran görüntüsü (6 site × A/B mobil) + gri ton kompozitler; `DARPHANE.md` İş günlüğü'ne satır (tarih · Codex · ne · commit). Görsel dosyaları `docs/qa/excel-recete/` altına **WebP** olarak koy (`npm run webp -- docs/qa/excel-recete`), PNG commit etme.

## Dokunma
`app/serkan-oral/**`, `components/serkan/**`, `noyavet*` (Serkan teklif verdi, değişmesin), `next.config.ts`, `proxy.ts`, panel.
