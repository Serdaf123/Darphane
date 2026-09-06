# Brif 03 — serkanoral.com.tr Tasarım B (Codex)

Önce `AGENTS.md`'yi oku. Çalışma alanın **yalnız** `app/serkan-oral/b/page.tsx` ve `components/serkan-b/**`; görseller `public/sites/serkan-oral-b/**` (WebP). Branch aç, PR gönder; CI (typecheck, lint, build, WebP denetimi) yeşil olmalı.

## Girdi
- Metinler: `content/serkan/copy.md` (Manus yazdı; yoksa Tasarım A'daki metinleri kullan). **Yeni iddia ekleme.**
- Olgular ve kurallar: `briefs/01-metinler.md`.
- Tasarım A referans olarak: `/serkan-oral` (koyu, dev tipografi, GSAP scroll). **B, A'nın kopyası olmasın**; farklı bir dünya seç.

## B için yön (A'nın tersi)
- **Açık zemin.** Kırık beyaz/kemik (#f3efe7 civarı) + koyu mürekkep metin + tek sıcak vurgu (kendi seçtiğin, terracotta/turuncu **değil**).
- Tipografi: tek aile, ağırlık ve boyutla hiyerarşi (öneri: `Bricolage Grotesque` zaten kurulu; ya da `Fraunces` display + `DM Sans`, ikisi de `lib/fonts.ts`'te var — oradan `FONT_PAIRINGS.<ad>.className` ile al).
- Hareket: kaydırmayla **tek** orkestrasyon (ör. telefon çerçevesinin sayfa boyunca sabit kalıp içeriğin değişmesi ya da yatay şerit); her bölüme ayrı fade koyma. `motion`, `gsap`, `lenis` kurulu.
- Açılış 3 saniyede "ne iş yapıyor" sorusuna cevap vermeli: isim + tek cümle + WhatsApp butonu ilk ekranda.
- Mobil 390px'te yatay taşma yok; `prefers-reduced-motion` açıkken durağan ve okunur; klavye odağı görünür.
- Sayfa `noindex` kalır (iskelet dosyada zaten var). Seçilirse köke Claude taşır.

## Teslim
PR açıklamasında: masaüstü + mobil ekran görüntüsü, kullanılan font/renk kararı 3 satır, dokunulan dosya listesi. Şablon otomatik gelir.
