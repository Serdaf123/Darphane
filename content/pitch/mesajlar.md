# Teklif mesajları

Değişkenler: `{isletme}` `{link}` `{fiyat}` `{gun}` `{tarih}`

**Kurallar**

1. Gönderim **elle, kişisel WhatsApp'tan.** Toplu gönderim aracı yok — hesap banı bu işin en büyük operasyonel riski.
2. Her mesajda **ret cümlesi** var. Ticari iletişim mevzuatı esnaf ve tacire gönderimde bile ret hakkı istiyor; ayrıca şikâyeti ve banı düşürüyor.
3. "Kampanya", "fırsat", "size özel indirim" gibi kelimeler yok. Bunlar mesajı reklama benzetir, reklam silinir.
4. Karar vericiye ulaş. İşletme numarasında çalışan varsa "sahibiyle mi görüşüyorum" diye sor.
5. Mesajı **akşam 19:00-21:00 arası** gönder — esnaf o saatte telefonuna bakar.
6. **Önce 30 saniyelik arama, sonra WhatsApp.** Haritalardaki numarayı ara: "Merhaba, ben Serkan Oral. İşletmeniz için bir tanıtım sayfası hazırladım, WhatsApp'a atayım mı, hangi numaraya?" Evet → mesaj. Hayır → teşekkür, kaydı sil. Bu hem Meta'nın opt-in şartını karşılar hem yanıt oranını katlar (araştırma: `docs/arastirma-satis-2026-09-07.md`).
7. **Avukat, doktor, diş hekimi, mimar gibi serbest meslek sahiplerine soğuk mesaj yok.** Bunlar "tacir/esnaf" sayılmıyor; KVKK Kurulu 2022/861 emsalinde 150.000 ₺ ceza var. Yalnızca arama ile izin ya da tanıdık referansı.
8. **Her mesajda üç zorunlu satır:** kimlik (ad soyad + fourpear), veri kaynağı cümlesi ("numaranızı Google Haritalar kaydınızdan aldım"), ret cümlesi. Ret gelince aynı gün panelde "Yayından kaldır" ve kaydı sil.
9. **Günde en fazla 10–15 yeni numara**, saat 10:00–12:00 ve 18:00–20:30 arası; her mesajda işletmeye özgü ilk cümle. Engelleyene bir daha yazma.
10. **Önce görsel, sonra mesaj.** `npm run screenshot -- <slug> https://alanadi.com --clean` ile üretilen telefon görselini (`shots/<slug>-telefon.png`) ilk mesajdan hemen önce gönder. Link tıklanmadan site görülür; "bu benim dükkânım" hissi mesajın kalanını okutur.

---

## 1. İlk mesaj (WhatsApp)

> Merhaba, ben Serkan Oral (fourpear). {isletme} için bir şey hazırladım.
>
> Google Haritalar'da sitenizin olmadığını fark ettim, oradaki bilgilerinizle (telefon, adres, saatler, yorumlar) bir tane kurdum. Şu an canlı, telefonunuzdan açabilirsiniz:
>
> {link}
>
> Bu bir teklif sunumu değil, bitmiş bir iş. Beğenirseniz {fiyat} karşılığında sizin oluyor, alan adını da sizin adınıza ben alırım. Beğenmezseniz {tarih} tarihinde siteyi kaldırıyorum; hiçbir borç ya da yükümlülük yok.
>
> Numaranızı Haritalar kaydınızdan aldım. İstemezseniz "hayır" yazmanız yeterli: siteyi kaldırır, bilgilerinizi siler, bir daha yazmam.

**Neden böyle:** İlk cümle işletmenin adını söylüyor, şablon mesaj olmadığını belli ediyor. İkinci paragraf ürünü gösteriyor, anlatmıyor. Üçüncüsü baskıyı kaldırıyor — baskıyı kaldırmak dönüşümü artırıyor, çünkü karşı taraf savunmaya geçmiyor. Son satır hem yasal hem de ban kalkanı.

---

## 2. Link açıldı, cevap yok (aynı gün akşam)

Vercel Analytics'te o sayfanın görüntülendiğini gördüğünde gönder. Açtı ama yazmadı = ilgilendi ama karar vermedi.

> Siteyi açtığınızı gördüm. Aklınıza yatmayan bir yer varsa söyleyin, değiştirelim — yazı, fotoğraf, renk, hepsi oynar.
>
> Merak ederseniz: telefondan açıldığında alttaki "Ara" ve "Yol Tarifi" butonları direkt çalışıyor. Google'da aranınca da çıkması için ayrıca ayar yapıyorum, o da fiyatın içinde.

---

## 3. Son gün hatırlatması

> {isletme} için hazırladığım site bu akşam yayından kalkacak. Kaldırmadan önce bir kez daha soruyorum: devam edelim mi?
>
> Devam ederseniz alan adını bugün alıp yarın yayına alırım. Etmezseniz sorun değil, siteyi kaldırıp sizi rahat bırakıyorum.

---

## 4. E-posta versiyonu

**Konu satırı seçenekleri** (ikisi de işletme adını içerir, "reklam" gibi durmaz):

- `{isletme} için hazırladığım web sitesi`
- `{isletme} — sitenizi kurdum, bakar mısınız?`

> Merhaba,
>
> {isletme} için bir web sitesi hazırladım. İstenmeden yapılmış bir iş olduğunun farkındayım, o yüzden kısa tutuyorum.
>
> Site şu an canlı: {link}
>
> İçinde ne var: işletmenizin tanıtımı, hizmet/menü listesi, çalışma saatleri, konum ve yol tarifi, Google yorumlarınız, telefon ve WhatsApp butonları. Mobil uyumlu, hızlı.
>
> Beğenirseniz {fiyat} karşılığında sizin oluyor; alan adı kurulumunu da ben yapıyorum. Beğenmezseniz {tarih} tarihinde siteyi kaldırıyorum.
>
> İlgilenmiyorsanız bu e-postayı yanıtlayıp "çıkar" yazmanız yeterli, listeden çıkarırım.
>
> Kolay gelsin,
> Serkan — fourpear

---

## 5. Sık gelen itirazlar

**"Instagram'ım var, siteye ne gerek?"**
> Instagram'da sizi zaten tanıyanlar buluyor. Google'da "{ilçe} {kategori}" yazan kişi ise sizi bulamıyor — o kişi rakibinize gidiyor. Site o aramaları karşılamak için.

**"Pahalı."**
> Tek seferlik. Aylık ödeme yok, komisyon yok. {fiyat}, sizde bir akşamın cirosu kadar. Site orada durdukça çalışıyor.

**"Düşüneyim."**
> Tabii. Siteyi {tarih}'e kadar açık tutuyorum, o zamana kadar bakabilirsiniz. Sonrasında kaldırıyorum ama tekrar isterseniz yeniden açmak bir dakikalık iş.

**"Fotoğraflar bize ait değil."**
> Doğru, onlar geçici. Anlaşırsak sizin kendi fotoğraflarınızı koyuyoruz; yoksa mekân için çekim de ayarlayabilirim.

**"Nereden buldunuz numaramı?"**
> Google Haritalar'daki işletme kaydınızdan. Sitenizin olmadığını orada gördüm. Rahatsız ettiysem kusura bakmayın, "çıkar" derseniz bir daha yazmam.
