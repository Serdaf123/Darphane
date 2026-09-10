# Aday görev dosyaları (ChatGPT: Tasarım B + metinler)

Her dosya doğrudan **ChatGPT'ye hitap eder**; Serkan dosyayı ChatGPT'ye ekler ve yalnız şunu yazar:

> Ekteki dosyayı oku ve içindeki görevi yap. Cevap olarak yalnız istenen JSON'u ver.

Dönen JSON Claude'a yapıştırılır; Claude `data/sites/<slug>.b.json` ve metinleri işler, canlıya alır. Dosyalar `briefs/05-yeni-isletme-chatgpt.md` şablonundan Claude tarafından üretilir.

| Dosya | Ne |
|---|---|
| [2026-09-10-dort-veteriner.md](2026-09-10-dort-veteriner.md) | Dördü tek seferde (tek JSON dizisi döner) |
| [esatpasa-veteriner.md](esatpasa-veteriner.md) | Esatpaşa Veteriner (Ataşehir, 7/24) — tek tek yapmak için |
| [esenler-bati-veteriner.md](esenler-bati-veteriner.md) | Esenler Batı Veteriner (Esenler) |
| [kucukyali-veteriner.md](kucukyali-veteriner.md) | Küçükyalı Veteriner (Maltepe; sabit hat, WhatsApp yok) |
| [adraga-veteriner.md](adraga-veteriner.md) | Adraga Veteriner (Maltepe sahil) |
