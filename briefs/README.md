# Görev brifleri (orkestra: Claude → Manus / ChatGPT / Codex)

Claude görevleri buraya yazar; Manus (metin), ChatGPT (görsel) ve Codex (kod) bu brifleri uygular. Her brifin sonunda **teslim yolu** var: çıktı oraya konur, Claude oradan alıp entegre eder. Sıra: 01 metin → 02 görsel → 03 tasarım B.

| # | Brif | Kim | Teslim |
|---|---|---|---|
| 01 | [Metinler](01-metinler.md) | Manus | `content/serkan/copy.md` |
| 02 | [Görseller](02-gorseller.md) | ChatGPT (görsel üretimi) | `public/sites/serkan-oral/*.webp` |
| 03 | [Tasarım B](03-tasarim-b.md) | Codex | `app/serkan-oral/b` + `components/serkan-b` (PR) |
| 04 | [ChatGPT görevleri](04-chatgpt-gorevleri.md) | ChatGPT | görsel klasörü / `docs/ab-degerlendirme-chatgpt.md` / mesaj kısaltma |
| 05 | [Yeni işletme: Tasarım B + metinler](05-yeni-isletme-chatgpt.md) | ChatGPT | `data/sites/<slug>.b.json` + metinler (Claude işler); gerçek fotoğraf, WebP |
