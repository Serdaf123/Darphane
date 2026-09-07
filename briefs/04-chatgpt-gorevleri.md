# Brif 04 — ChatGPT'nin görevleri (net liste)

ChatGPT üç işte kullanılır. Her görevin kopyala-yapıştır istemi aşağıda; çıktı nereye gidecek yazılı. Claude entegre eder, Codex kodlar.

## Görev 1 — Görseller (brif 02)
`briefs/02-gorseller.md`'deki tabloyu ve prompt iskeletini kullan. Her görsel için ChatGPT'ye (görsel üretimi açık):

```
Şu görseli üret: [tablodaki satır]. Kurallar: yazı yok, logo yok, yüz yok, marka yok; koyu lacivert (#0b0e17) zemin, elektrik mavisi (#3b6cff) ışık, ince tane. Boyut: [WxH]. Boş alan: [yön].
```
Teslim: indirilen PNG'leri `public/sites/serkan-oral/` altına at; `npm run webp` WebP'ye çevirir.

## Görev 2 — Esnaf gözüyle A/B değerlendirme
Tasarım A (`/`) ve Tasarım B (`/serkan-oral/b`) linklerini ve ekran görüntülerini ver, şu istemi kullan:

```
Sen İstanbul'da 45 yaşında bir restoran sahibisin; web siten yok, telefondan bakıyorsun, 20 saniyen var. İki sayfayı sırayla aç. Her biri için: (1) 3 saniyede ne iş yaptığını anladın mı, tek cümleyle yaz; (2) sana güven verdi mi, neden; (3) hangi düğmeye basardın; (4) seni rahatsız eden bir şey var mı. Sonunda birini seç ve tek cümlede gerekçe ver. Tasarım terimi kullanma, esnaf gibi konuş.
```
Teslim: cevabı `docs/ab-degerlendirme-chatgpt.md` dosyasına yapıştır (ya da Claude'a gönder).

## Görev 3 — Teklif mesajı denetimi
`content/pitch/gonderim/<slug>.txt` metnini ver:

```
Bu WhatsApp mesajını alan bir esnafsın. Mesajı oku ve söyle: (1) spam mı gerçek mi hissettirdi, neden; (2) hangi cümle güveni artırdı, hangisi düşürdü; (3) eksik olan tek bilgi ne; (4) daha kısa bir versiyon yaz, aynı olguları koru, yeni iddia ekleme, "çıkar" satırını koru.
```
Teslim: kısa versiyonu Claude'a gönder; uygunsa dosyaya işlenir.

## Yapmaması gerekenler
- Yeni olgu, rakam, müşteri, yorum uydurmak (metin kuralı: `briefs/01-metinler.md`).
- Koda dokunmak (o Codex'in işi) ve tasarım kararı vermek (o Serkan'ın).
