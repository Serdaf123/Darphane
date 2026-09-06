<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Darphane — bu repoda çalışan her ajan için kurallar

Bu repo iki ajan tarafından geliştiriliyor: Claude Code (Serkan'ın Mac'inde) ve Codex (GitHub üzerinden). Aynı dosyalara dokunmamak için aşağıdaki bölüşüm geçerlidir.

## Repo nedir
- Next.js 16 (App Router, `proxy.ts` = middleware), React 19, Tailwind v4, TypeScript, zod.
- İşletme siteleri veriden üretilir: `data/sites/<slug>.json` → `/<slug>` (`app/[slug]/`). Şema `lib/schema.ts`, bölümler `components/sections/`.
- `/panel` iç yönetim paneli (giriş korumalı), `/giris` giriş, `lib/store.ts` GitHub'a yazan kayıt katmanı.
- `serkanoral.com.tr` Serkan'ın kişisel tanıtım sayfası. **Tasarım A:** `app/serkan-oral/page.tsx` + `components/serkan/` (Claude yaptı, dokunma).
- Kurallar, kararlar ve yol haritası `NOTLAR.md`'de; metin kuralları oradaki "Öğrendiklerimiz" bölümünde (uydurma iddia, yorum, rakam yok; her cümle doğrulanabilir olmalı).

## Codex için görev alanı: Tasarım B
- Kişisel sayfanın ikinci tasarımı **yalnız** şu yollarda yaşar: `app/serkan-oral/b/page.tsx` ve `components/serkan-b/**` (kendi CSS'i dahil). Görseller `public/sites/serkan-oral-b/**` altında ve **WebP** (`npm run webp` dönüştürür).
- Başka dosyaya dokunma: `app/globals.css`, `proxy.ts`, `next.config.ts`, `lib/**`, `components/sections/**`, `components/serkan/**`, `data/**`, `app/[slug]/**`, `app/panel/**`, `package.json` (yeni bağımlılık gerekiyorsa PR açıklamasında gerekçesiyle yaz; GSAP, motion, lenis zaten kurulu).
- `/serkan-oral/b` sayfası **noindex** kalır (metadata `robots: { index: false }`); seçilen tasarım daha sonra köke taşınır.
- İçerik: Tasarım A'daki metinler ve olgular (isim, telefon 0507 846 39 29, WhatsApp 905078463929, tek seferlik ücret, alan adı dahil, iki demo örnek) aynen kullanılabilir; yeni iddia, müşteri, rakam, yorum **ekleme**.
- Erişilebilirlik ve hareket: `prefers-reduced-motion` açıkken sayfa durağan ve okunur olmalı; klavye odağı görünür; mobil 390px'te yatay taşma yok.

## Her değişiklikten önce
```
npm run typecheck && npm run lint && npm run build
```
Üçü de temiz geçmeden push etme.

## Git ve Vercel
- Ana dal `main`; her push Vercel'de üretim deploy'u tetikler. Codex **branch + PR** ile çalışsın; PR'lar önizleme adresi alır.
- Vercel Hobby, commit yazarı `Serdaf123` değilse deploy'u sessizce bloklar. Codex GitHub'a Serdaf123 hesabıyla bağlı olmalı.
- Repo private kalır (gerçek işletme telefonları var). Sır yok: parola ve token'lar yalnız Vercel env'inde (`.env.example`'a bak, `.env.local` git'e girmez).
