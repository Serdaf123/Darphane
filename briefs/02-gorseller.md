# Brif 02 — serkanoral.com.tr görselleri (ChatGPT görsel üretimi)

## Amaç
Sayfa koyu (#0b0e17) zemin, elektrik mavisi (#3b6cff) vurgu, beyaz büyük tipografi. Görseller bu dünyayı **bozmadan** derinlik katmalı. Stok "gülen esnaf" fotoğrafı istemiyoruz; soyut, malzeme hissi olan, ışıklı görseller.

## İstenenler
| Dosya | Boyut | Ne |
|---|---|---|
| `hero-glow.webp` | 1600×1000 | Koyu lacivert zemin üzerinde yumuşak mavi ışık lekesi, hafif tane (grain), metin yok. Açılışta arka plan olacak; solda üstte boş alan bırak (isim oraya geliyor). |
| `texture-paper.webp` | 1200×1200 | Çok koyu, ince dokulu kâğıt/kumaş hissi; tekrar edebilir (seamless). Opaklık %6 ile kullanılacak. |
| `og.webp` | 1200×630 | Paylaşım kartı zemini: koyu lacivert, sağ üstte mavi ışık, sol altta boş alan (isim ve slogan kodla yazılacak). Metin yok. |
| `icon-phone.webp`, `icon-chat.webp`, `icon-map.webp`, `icon-globe.webp`, `icon-lock.webp`, `icon-search.webp` | 256×256, şeffaf | "Her sitede olanlar" kartları için tek renk (#9db4ff) çizgi ikonlar, 2px çizgi, köşeleri yumuşak. Aynı aile gibi dursun. |

## Kurallar
- Görsellerde **yazı, logo, insan yüzü, marka** olmasın.
- Fotoğraf değil, üretilmiş/soyut. Gerçek bir işletmenin fotoğrafı asla.
- Format **WebP** (PNG/JPG üretildiyse `npm run webp` ile çevrilir, repo'ya PNG girmez).
- Dosya adları yukarıdaki gibi, küçük harf, Türkçe karakter yok.
- Teslim: `public/sites/serkan-oral/` altına. Codex üzerinden gidiyorsa PR'a ekle; ChatGPT üzerinden gidiyorsa Serkan indirip klasöre koyar, Claude bağlar.

## Üretim ipucu (prompt iskeleti)
"Dark navy background (#0b0e17), soft electric-blue light bloom (#3b6cff) upper right, subtle film grain, no text, no objects, minimal, cinematic, 16:10" — her görsel için boyutu ve boş alan yönünü değiştir.
