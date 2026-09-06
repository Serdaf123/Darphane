# Darphane — satış, fiyat, hukuk ve ödeme araştırması (2026-09-07)

Kapsam: "önce yap, sonra sat" modelinin dünyadaki örnekleri, Türkiye tek sayfa site fiyatları, ticari ileti / KVKK / WhatsApp ban / telif, dönüşüm taktikleri, ödeme linki seçenekleri, satış sonrası devir ve bakım. Yalnızca bizim için eyleme dönüşen bulgular alındı. Pazarlama dili olan iddialar **[satıcı iddiası]**, teyit edilemeyenler **[belirsiz]** diye işaretlendi. Bu bir hukuki görüş değildir; kritik noktalarda (avukat/doktor hedefleri, vergi) bir uzmana sorulmalı.

---

## 0. Bir bakışta: en önemli 10 bulgu

1. **Esnaf ve tacire ön onaysız ticari ileti göndermek yasal** (6563 md. 6 ve Yönetmelik md. 6). Ama iletide gönderen kimliği + iletişim bilgisi + kolay ret yolu şart; ret gelince 3 iş günü içinde durmak şart. 2026 ceza bandı ileti başına 2.859–14.309 ₺; toplu gönderimde 10 kata kadar. Bizim hacimde asıl risk ceza değil, WhatsApp numarasının kapanması.
2. **Avukat ve doktor "tacir/esnaf" değil.** KVKK Kurulu 2022/861: arama motorundan bulunan avukat e-postasına pazarlama iletisi gönderen firmaya 150.000 ₺ ceza; "esnaf/tacir istisnası" avukat için geçersiz sayıldı. Pipeline'daki avukat sitesine **soğuk WhatsApp atılmamalı**; telefonla izin alınıp gönderilmeli ya da tanıdık üzerinden gidilmeli.
3. **Google Haritalar'daki telefon numarası şahıs işletmesinde kişisel veridir.** Kurul "alenileştirme"yi amaçla sınırlı sayıyor. Uygulama: bire bir, işletmeye yönelik teklif, kısa aydınlatma cümlesi ("numaranızı Google Haritalar kaydınızdan aldım"), ret gelince veriyi silmek. Liste biriktirmemek.
4. **WhatsApp'ta soğuk gönderim için yayın listesi işe yaramaz**: yayın listeleri yalnızca numaranızı kaydetmiş kişilere düşer. Tek yol bire bir elle mesaj. Vendor kaynakları (Meta teyidi yok) şu eşikleri veriyor: saatte 60+ mesaj, %2+ engellenme oranı, %15 altı yanıt oranı → kısıtlama. Kısa sürede 20–30 yeni kişiye mesaj "cooldown" tetikleyebiliyor. Güvenli pratik: günde ≤10–15 yeni numara, gün içine yayılmış, her mesaj farklı ilk cümleyle, engelleyene bir daha yazmamak.
5. **En güçlü hamle: önce 30 saniyelik telefon, sonra WhatsApp.** "Siteyi WhatsApp'a atayım mı?" sorusuna "evet" hem Meta'nın opt-in şartını karşılar hem ban riskini sıfıra yakın yapar hem yanıt oranını katlar (kişiselleştirilmiş/sıcak temasta %10–34 yanıt; jenerik soğuk temasta %3–5).
6. **"Önce yap, sonra sat" ABD'de bir kategori haline geldi** (ReadyWeb AI 297 $/yıl, WeGotSites 0 $ peşin + abonelik, Oddology 650 $ landing / 1.295 $ site, BuiltByM, ReadyMadeSites). Ortak formül: gerçek çalışan sayfa (mockup değil), 24–48 saatte önizleme, "beğenirsen öde". Hiçbiri "süre dolunca site kaldırılır" baskısı kullanmıyor; hepsi önce kısa form/görüşme ile bilgi alıyor (yani bizden farklı olarak istenmeden yapmıyorlar). Reddit/IndieHackers'ta ölçülmüş "istenmeden site yapıp gönderdim" vakası bulunamadı; bu modelin gerçek yanıt oranı **[belirsiz]** — kendi 10 teklifimiz ilk veri olacak.
7. **Türkiye fiyat merdiveni:** hazır şablon site 3.500–5.000 ₺ + KDV (yıllık yenileme ~2.790 ₺ + KDV), tek sayfa freelancer/ajans 4.900–8.000 ₺ (+KDV, ilk yıl alan adı/hosting dahil), paketçi "ekonomik" 17.000 ₺, kurumsal ajans 20.000–45.000 ₺. **8.500 ₺ doğru bantta**: şablonun üstünde, ajansın altında. Öneri: iki paket (7.900 / 9.900) + 2. yıldan itibaren 2.500 ₺ yıllık yenileme.
8. **Ödeme:** şirket olmadan en hızlı yol **iyzico Link** (bireysel başvuru, ilk link 24 saatte onay, %4,49 + 0,25 ₺, ödeme satıştan 7 gün sonraki ilk çarşamba). Şahıs şirketi varsa **PayTR link** (%1,45–1,95 tek çekim, vergi levhası şart, ~2 saatte açılış). Havale her zaman ikinci seçenek; fatura/vergi tarafı mali müşavire sorulmalı.
9. **Alan adı müşteri adına açılmalı** (.com.tr 2022'den beri belgesiz, herkes alabilir). Darphane hesabında açılırsa ICANN kuralı gereği 60 gün transfer kilidi var; Vercel transfer-out ücretsiz, auth code panelden alınıyor. Vercel Hobby planı ticari kullanıma kapalı → satılan siteler için Pro (20 $/ay) gerekir **[Vercel fair-use kuralı; teyit et]**.
10. **TÜİK 2025:** 10+ çalışanlı girişimlerin %56,5'i web sitesine sahip; 10–49 çalışanlı grupta %52,4. 1–9 çalışanlı esnaf için resmi veri yok; oran belirgin biçimde daha düşük olmalı **[çıkarım]**. Teklif sayfasında kullanılabilecek tek "olgu": "Her iki küçük işletmeden birinin sitesi yok."

---

## 1. Darphane için öneriler — etkiye göre sıralı

| # | Öneri | Neden | Maliyet |
|---|---|---|---|
| 1 | **Arama → WhatsApp sırası.** Haritalardaki numarayı ara: "Merhaba, ben Serkan Oral. İşletmeniz için bir tanıtım sayfası hazırladım, WhatsApp'a atayım mı, hangi numaraya?" Evet → mesaj. Hayır → teşekkür, kapat, kaydı sil. | Opt-in alınmış olur (Meta politikası + 6563 ret riski), ban riski düşer, karar vericiye ulaşılır, yanıt oranı katlanır. | 0 ₺, aday başına 1 dk |
| 2 | **Avukat/doktor/diş hekimi/mimar gibi serbest meslek sahiplerine soğuk mesaj yok.** Bunlar tacir/esnaf sayılmıyor; KVKK 2022/861 emsali doğrudan bu senaryo. Yalnızca arama ile izin ya da tanıdık referansı. | 150.000 ₺'lik emsal karar. | 0 |
| 3 | **Her mesajda üç zorunlu satır:** kimlik (ad soyad + telefon), veri kaynağı cümlesi, ret cümlesi ("İstemezseniz 'hayır' yazın, silerim, bir daha yazmam"). Ret gelince aynı gün sil, `pitch` panelde `declined` durumu. | Yönetmelik md. 8–9, KVKK aydınlatma, WhatsApp kalite puanı. | Şablona ekle |
| 4 | **Teklif sayfasına "Gönderen" künyesi** (ad soyad, telefon, e-posta, varsa vergi no/MERSİS) ve "Bu önizleme talep edilmeden hazırlandı, hiçbir yükümlülük doğurmaz" cümlesi. | Yönetmelik md. 8 kimlik şartı (esnaf gönderen için ad soyad + TCKN istiyor; TCKN'yi WhatsApp'a yazmak yerine sayfada künye — **[hukuki gri, sor]**). 6502 md. 7 esnafa uygulanmaz ama "borç yok" cümlesi güveni artırır. | 30 dk |
| 5 | **Günlük gönderim tavanı 10–15 yeni numara**, saat 10:00–12:00 ve 18:00–20:30 arası, her mesajda işletmeye özgü ilk cümle (puan, yorum sayısı, mahalle). Kişisel numaradan, WhatsApp Business uygulaması değil de olur; asıl kural bire bir ve yavaş. | Vendor eşikleri (60/saat, %2 engel) ve 20–30 yeni kişi "cooldown" iddiası. | 0 |
| 6 | **Fiyat merdiveni:** "Site" 7.900 ₺ (site + alan adı + 1 yıl yayın + 3 düzeltme) / "Site + Google" 9.900 ₺ (+ Google İşletme Profili düzenleme ve site linki, İngilizce sayfa, 1 yıl ayda 1 değişiklik). 2. yıldan 2.500 ₺/yıl yenileme. Kartla 3 taksit seçeneği. | "Hangisi?" sorusu "evet/hayır"dan iyi; piyasa bandına oturuyor; taksit esnafın alışkanlığı. | Teklif sayfası + `sell` |
| 7 | **Süre kuralını olguya bağla:** "Önizleme 7 gün yayında kalıyor; sonra alan adı ve sunucu ayrılmadığı için yayından kalkıyor." Geri sayım gerçek, süre dolunca gerçekten kaldır, tekrar açmak için ek ücret koyma ama "yeniden sıraya alınır, 2–3 gün sürer" de. | Etik aciliyet kaynakları: sebep verilmiş, gerçek, tutarlı süre çalışır; blöf bir kez yakalanınca marka biter. | Metin |
| 8 | **Önizleme fotoğrafı için Google/Instagram'dan çekme.** Unsplash/mono ile gönder, ilk cevapta "3–4 fotoğraf atarsanız akşama yerleştiririm" de. | FSEK md. 68: izinsiz ticari kullanımda rayiç bedelin 3 katına kadar tazminat; Places API fotoğrafları önbelleklenemez, atıf ister. Fotoğraf isteme aynı zamanda ilk etkileşim. | 0 |
| 9 | **Ödeme: bugün iyzico Link (bireysel) + havale.** 5+ satış/ay olunca şahıs şirketi + PayTR link (komisyon ~3 puan düşer, satış başına ~250 ₺). Papara'yı lisans belirsizliği geçene kadar kullanma. | Kurulum süresi 1 gün vs şirket 1–2 hafta. | iyzico: 8.500 ₺'de ~382 ₺ komisyon |
| 10 | **Alan adını müşteri adına aç** (Turhost/İsimtescil/Natro hesabı müşterinin, NS → Vercel). Teklif sayfasında "Alan adı sizin adınıza; biz sadece yönetiriz." | Devir sorunu, 60 gün kilidi, güven. | 10 dk/müşteri |
| 11 | **Takip ritmi 5 temas, sonra dur:** G0 görsel+link · G1 (açtıysa) tek soru · G3 15 sn video · G5 "iki gün kaldı" + fiyat · G7 sabah "bugün son gün". G8 "yayından kaldırdım" tek satır. Her "hayır"da anında dur. | Kapanışlar 3–5. temasta; 5'ten sonrası spam sinyali. | `pitch` scripti |
| 12 | **Vercel Pro'ya geç** ya da satılan siteleri Pro projeye taşı. | Hobby "non-commercial" **[teyit et]**. | 20 $/ay |
| 13 | **Google İşletme Profili sahipliği yoksa** ("Bu işletmenin sahibi misiniz?") paketin içine "profili sizin adınıza doğrulayıp site linkini ekliyoruz" maddesi koy. | Site linki ancak doğrulanmış profile eklenir; incelemesi 3 güne kadar sürer. | Süreç |

---

## 2. "Önce yap, sonra sat" — dünyada ne var, ne işe yarıyor

### 2.1 Önizleme-önce servisler (ABD)

| Servis | Model | Fiyat | Süre | Öne çıkan |
|---|---|---|---|---|
| ReadyWeb AI | Form (2 dk) → ücretsiz önizleme → beğenirsen yayın | 297 $/yıl (hosting, güncelleme, destek dahil) | Saatler içinde önizleme, aynı gün yayın | "60 günde 2,4× daha fazla gelen talep" **[satıcı iddiası]** |
| WeGotSites | "Görmeden ödeme yok", 0 $ peşin, sonra tek abonelik | Açıklanmıyor | ~24 saat | "300+ site, %98 önizleme onayı" **[satıcı iddiası]**; alan adı satın alma/yenileme "sonsuza dek" onlarda |
| Oddology | 15 dk görüşme → gerçek çalışan sayfa linki | Landing 650 $, site 1.295 $, plus 2.500 $; bakım 49–99 $/ay opsiyonel | — | "Beğenmezsen fatura yok, kırgınlık yok"; süre sınırı koymuyor |
| BuiltByM | 48 saatte önizleme, kayıt/kart yok | — | 48 saat | — |
| ReadyMadeSites | Mevcut siteyi baştan yapar, özel önizleme gönderir | — | — | Retainer/sözleşme yok |

Ortak dersler:
- **Gerçek sayfa, mockup değil.** Hepsi "gerçek içerik, gerçek tasarım, canlı çalışıyor" vurgusu yapıyor. Bizim telefon çerçeveli görsel + canlı link yaklaşımı bununla uyumlu.
- **Hız bir satış argümanı:** 24–48 saat vs. ajansların 4–12 haftası.
- **Risk sıfırlama dili:** "kart yok, form yok, beğenmezsen fatura yok". Bizim teklif sayfasında bu cümle olmalı.
- **Hiçbiri kaldırma tehdidi kullanmıyor.** Süre baskısını biz ekliyoruz; bunun etik olması için gerekçe (sunucu/alan adı ayrılmıyor) ve tutarlılık gerekir (bkz. 4.1).
- **Fark:** Hepsi işletmeden önce 2–15 dakikalık bilgi alıyor. Biz istenmeden yapıyoruz; bu yüzden arama-önce (öneri #1) onların form adımının yerine geçer.

### 2.2 Yanıt / dönüşüm kıyas noktaları

- Web ajansları için Google Haritalar kaynaklı "sitesi yok" filtresiyle arama: **%12 dönüşüm vs filtresiz %3**; 60–80 aramada 1 müşteri; kapanışların çoğu **3–5. temasta** (Get Map Leads, ajans blogu — ölçüm yöntemi belirsiz).
- Soğuk e-posta ortalama yanıt %3–5 (jenerik) → **%19** (derin kişiselleştirme); sıcak temasta %10–34.
- **Kişiselleştirilmiş video** ile yanıt %10–16, en iyi %25–30 (Sendspark/Vidyard, satıcı verisi). Loom'la Intercom soğuk e-posta yanıtı %19 artış.
- WhatsApp'ta görselli mesaj **3,2× tıklama**, videolu **2,8×**; medyalı mesajlarda satın alma %46 daha yüksek **[satıcı istatistiği]**. Yani: ilk temasta görsel, ikinci temasta video — mevcut sıramız doğru.
- "İstenmeden site yapıp gönderdim" için Reddit/IH/HN'de ölçülmüş bir vaka bulunamadı (çok sayıda sorgu). Türkçe forumlarda (R10, Technopat, Donanım Arşivi) da yok; oradaki tavsiye "önce müşteri sonra site, kapora al". **Bu modelin gerçek dönüşümü bizim 10 teklifimizden çıkacak** — panelde açıldı/konuştu/satıldı sayımı bu yüzden önemli.

### 2.3 İtiraz cevapları (esnaf diliyle)

| İtiraz | Cevap |
|---|---|
| "Instagram yeterli." | "Instagram'ı Google'da arayan görmüyor. 'Kaş butik otel' yazan kişi Google'da sizi bulunca tıklayacağı bir sayfa lazım; bu sayfa o." Ek olgu: erişim algoritmaya bağlı, hesap kapanınca her şey gidiyor. |
| "Müşterim zaten var." | "O zaman sayfa yeni müşteri için değil, aramaya gelenin kapıdan dönmemesi için: telefon, yol tarifi, WhatsApp tek dokunuş." |
| "Pahalı." | Merdiven: 7.900 / 9.900; 3 taksit; yıllık 2.500. Kıyas: hazır şablon 3.500–5.000 + KDV + yıllık 2.790 + KDV, ajans 20.000+. |
| "Kendim yaparım / Wix." | Wix en düşük plan ~17 $/ay ≈ yılda ~7.000 ₺ ve zamanınız. "Bu sayfa hazır, bugün açılıyor." |
| "Sonra kim güncelleyecek?" | 1 yıl 3 düzeltme dahil; sonrası yıllık 2.500 ₺ içinde. WhatsApp'tan yazıyorsunuz, aynı gün yapılıyor. |
| "Fotoğraflar bizim değil." | "Doğru, geçici. 3–4 fotoğraf atın, akşama sizinkilerle yayında." |
| "Bunu kim istedi?" | "Kimse. Siteniz olmadığını görüp hazırladım. Beğenmezseniz 7 gün sonra kalkıyor, size hiçbir borç yok." |

---

## 3. Fiyat kıyasları (Türkiye, 2026)

### 3.1 Tek sayfa / küçük işletme sitesi

| Kaynak | Ürün | Fiyat |
|---|---|---|
| R10 forum | Taksici kartvizit sitesi, alan adı + hosting dahil | ~3.000 ₺ |
| Bulutweb (hazır site) | Standart 3.500 ₺ + KDV (liste 7.500), Kurumsal 5.000 + KDV | **Yıllık yenileme 2.790 ₺ + KDV** |
| websitesifiyatlari.com | Tek sayfa, CMS, ilk yıl alan adı/hosting/SSL dahil, 2 iş günü | 4.900 ₺ + KDV; "Esnaf paketi" 9.900 + KDV; yıllık 500–1.500 ₺ |
| ILS Dijital | Tek sayfa ortalama | 5.000–8.000 ₺ (aralık 2.500–15.000) |
| Armut ortalama | Web tasarım / site yapımı | 3.500 – 111.000 ₺ (alt uç tek sayfaya yakın) |
| websitesipaketi.com | "Ekonomik" tek sayfa, 1 yıl alan adı/hosting/SSL, 3–7 iş günü | 16.999 ₺ |
| Doruk Sucuka (ajans) | Tek sayfa/tanıtım | 20.000–45.000 ₺ |
| Çeşitli ajans blogları | Kurumsal site başlangıç | 12.000–35.000 ₺ |
| Bionluk | Listeler düşük görünür, gerçek teklif çok daha yüksek (Ekşi yorumları); liste fiyatı alınamadı | **[belirsiz]** |
| Instagram ajansları | Erişilemedi | **[belirsiz]** |

### 3.2 Alan adı + hosting

- **.com**: kayıt ~557 ₺ / yenileme ~390 ₺ (Karekod) ; İnetmar 12 $/yıl.
- **.com.tr**: İnetmar 1,49 $/yıl (~70 ₺) vs Karekod 900–1.100 ₺ — kaynaklar çelişiyor **[belirsiz; TRABİS yetkili kayıt kuruluşundan bak]**. Sektör bloglarında 150–250 ₺/yıl.
- **.com.tr belgesiz**: TRABİS ile 2022'den beri "ilk gelen alır", şirket şartı yok, bireyler alabilir.
- Paylaşımlı hosting 500–2.500 ₺/yıl; basit site toplam yıllık 700–3.000 ₺.
- Bizde hosting Vercel: Hobby ücretsiz ama ticari kullanım dışı **[teyit]**; Pro 20 $/ay tüm siteleri kapsar.

### 3.3 Bakım

- Blog başlıkları 500–5.000 ₺/ay diyor ama küçük tanıtım sitesi için rakam vermiyor; Netora yıllık teknik bakım 3.000–24.000 ₺, küçük işletme sitesi toplam yıllık 5.000–12.000 ₺.
- Sosyal medya yönetimi paketleri 600–1.500 ₺/ay (websitesipaketi) — Google İşletme Profili bakımı için kıyas noktası.
- ABD önizleme-önce servisleri: bakım 49–99 $/ay ya da yıllık tek ücret (297 $).

### 3.4 Önerilen merdiven ve gerekçe

| Paket | Fiyat | İçerik |
|---|---|---|
| **Site** | 7.900 ₺ | Tek sayfa site, 2 tasarımdan seçim, alan adı (müşteri adına) + 1 yıl yayın + SSL, WhatsApp/Ara/Yol tarifi, 3 metin/fotoğraf düzeltmesi |
| **Site + Google** | 9.900 ₺ | + Google İşletme Profili doğrulama/düzenleme ve site linki, İngilizce sayfa (`/en`), 1 yıl ayda 1 değişiklik, Telegram/WhatsApp destek |
| **Yıllık yenileme** (2. yıldan) | 2.500 ₺ | Alan adı + yayın + SSL + 3 değişiklik |
| Meslek katsayısı | Avukat/klinik/mimar +%50, kafe/berber −%10 | Gelir ve beklenti farkı **[varsayım]** |

- 8.500 ₺ tek fiyatı 7.900/9.900 ikilisine bölmek "hangisi?" sorusunu açar; orta değer aynı kalır.
- KDV: Serkan mükellefse fiyatlar KDV dahil yazılmalı (esnaf "+KDV" görünce %20 ekliyor); mükellef değilse fatura kesilemez, bkz. 6.
- Kartla 3 taksit (iyzico Link destekliyor) esnafın alışkanlığı; komisyon farkını fiyata yedir.

---

## 4. Hukuk ve operasyon

### 4.1 Ticari elektronik ileti (6563 + Yönetmelik)

- **Tanım:** "Telefon, çağrı merkezleri, faks, otomatik arama makineleri, akıllı ses kaydedici sistemler, elektronik posta, kısa mesaj hizmeti **gibi** vasıtalar" — liste örnekleyici; WhatsApp'ın kapsamda olduğu görüşü yaygın (Cenuta, d-dat), bir kaynak (Lebib Yalkın) sayılmadığı için kapsam dışı görünebileceğini yazıyor. **Kapsamda kabul edip uy.** İYS'nin teknik kanalları SMS/e-posta/arama; WhatsApp kanalı yok → İYS'ye "esnaf/tacir adresini yükleme" yükümlülüğünün WhatsApp'ta nasıl yerine getirileceği **[belirsiz]**. Hacim büyürse İYS'ye hizmet sağlayıcı kaydı yapıp numaraları "mesaj" kanalına yüklemek en temkinli yol.
- **Madde 6:** "Tacir veya esnaf olan alıcıların elektronik iletişim adreslerine gönderilen ticari elektronik iletiler için önceden onay alınması zorunlu değildir." Ret hakkını kullananlara onay olmadan tekrar gönderilemez.
- **Madde 8 (içerik):** tacir gönderen için MERSİS no + ticaret unvanı; **esnaf/gerçek kişi gönderen için ad soyad + T.C. kimlik no**; en az bir erişilebilir iletişim bilgisi; iletinin ticari olduğu belli olmalı. TCKN'yi WhatsApp mesajına yazmak pratik değil; teklif sayfasında künye ile karşılamak öneriliyor **[hukuki gri]**.
- **Madde 9 (ret):** gerekçesiz, kolay, aynı kanaldan ret; hizmet sağlayıcı 3 iş günü içinde durdurur.
- **2026 cezaları (Tebliğ, RG 25.12.2025/33118):** onaysız ileti 2.859–14.309 ₺; gönderen/içerik bilgisi eksik 2.859–28.620 ₺; ret yükümlülüğüne uymama 5.723–42.930 ₺. Kanun md. 12: bir defada birden fazla kişiye gönderimde 10 kata kadar (iletiniz.com: üst sınır 143.090 ₺). Şikâyet Ticaret İl Müdürlüğü'ne gidiyor; bizde tetikleyici tek şey kızgın bir esnafın şikâyeti — ret cümlesi + anında durmak bunu sıfırlar.
- **Yasak olan tek şey:** ret edene tekrar yazmak, kimliksiz yazmak. Her iki riski şablon kapatıyor.

### 4.2 KVKK

- Kurul yaklaşımı: pazarlama amaçlı işleme için mutlaka açık rıza gerekmez; md. 5/2 şartları (meşru menfaat vb.) incelenir; ama **aydınlatma her durumda** zorunlu (Gün + Partners özeti).
- **2022/861:** arama motorundan bulunan avukat iş e-postasına ticari ileti → 150.000 ₺ ceza; "alenileştirme amaçla sınırlıdır"; 6563 esnaf/tacir istisnası avukat için geçersiz (1136 sayılı Avukatlık Kanunu ticari faaliyeti yasaklar). Aynı mantık doktor, diş hekimi, mimar, mali müşavir gibi serbest meslekler için de geçerli olabilir **[çıkarım]**.
- **2018/119 ilke kararı:** rıza ya da md. 5/2 şartı olmadan SMS/arama/e-posta ile reklam gönderenler işlemeyi derhal durdurur.
- **Uygulama:** (1) Yalnızca tacir/esnaf sayılan işletmelere (kafe, otel, berber, atölye, servis) soğuk mesaj; (2) mesajda veri kaynağı cümlesi; (3) yanıt yoksa 8. günde numarayı panelden sil ya da anonimleştir; (4) PostHog oturum kaydı için çerez onayı (yol haritası #7) satıştan önce bitmeli — şu anda her açılan link kayıt yapıyorsa risk.

### 4.3 Google Haritalar verisi ve fotoğraf telifi

- Maps Platform Şartları: içerik dışa aktarılamaz/kazınamaz; Places API'de yalnızca place_id süresiz, koordinat 30 gün saklanabilir; ad, puan, yorum, **fotoğraf** canlı çekilip Google atfıyla gösterilmeli, depolanamaz. Yani Places fotoğraflarını sitemize gömmek de şartlara aykırı; **fotoğraf her zaman işletmeden ya da stok**.
- FSEK: ticari kullanımda kaynak göstermek yetmez, yazılı izin/lisans gerekir; md. 68 ile rayiç bedelin 3 katına kadar tazminat. Instagram'da hesap sahibi telif sahibidir; Instagram'ın lisansı üçüncü kişilere kullanım hakkı vermez.
- Satıştan önce Unsplash/mono, satışta işletmenin fotoğrafı — NOTLAR kuralı doğru; ek olarak Unsplash görsellerinde de lisansa uygun (atıfsız ticari kullanım serbest) olduğundan emin ol.

### 4.4 Tüketici hukuku ve aciliyet dili

- 6502 md. 7 (sipariş edilmeyen hizmete ücret istenemez) yalnızca tüketiciyi korur; esnaf tüketici değil. Yine de "borç yok" cümlesi güveni artırır, kullan.
- Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği: süre/stok sınırı varsa açıkça belirtilir; "son, tek sefer, sınırlı" gibi baskı ifadeleri tüketiciye yasak. B2B'de bağlayıcı değil ama ölçüt olarak al: **tarih ve saat yaz, sebep yaz, süre dolunca uygula.**

### 4.5 WhatsApp hesap güvenliği

- Meta politikası (Kasım 2024 güncellemesi): mesaj için opt-in gerekir; opt-in WhatsApp'a özgü olmak zorunda değil, "genel" bir izin yeter (telefonda "atayım mı? — evet" bunu karşılar **[yorum]**).
- WhatsApp'ın Hindistan raporlarına göre banların %95'i otomatik/toplu gönderimden ve büyük çoğunluğu şikâyet olmadan proaktif.
- Vendor eşikleri (Meta teyidi yok): >60 mesaj/saat, engellenme >%2, yanıt oranı <%15; 20–30 yeni kişiye kısa sürede yazınca "cooldown" (mevcut sohbetlere cevap verebilir, yeni kişi açamazsın); geçici ban 24 saat–1 hafta; Mart 2026 "preemptive enforcement" (tek kaynak) **[belirsiz]**.
- Yayın listesi: 256 kişi, **yalnızca numaranı kaydetmiş olanlara düşer** → soğuk temas için kullanılamaz.
- Pratik kurallar: bire bir, elle; günde ≤10–15 yeni numara; farklı ilk cümle; medyayı tek mesajda; gelen her mesaja cevap ver (yanıt oranı); engelleyene asla tekrar yazma; kişisel numarada geçmiş sohbet olması iyi; ikinci bir "yedek" numara kurma — yeni numara daha çabuk banlanır.
- Link önizlemesi: OG görseli ≤600 KB, ≥100×100, ideal 1200×630, `https`, etiketler sunucu tarafında (SSR) — Next.js metadata bunu sağlıyor. WhatsApp önizlemeyi cihazda önbellekler; site güncellenince linke `?v=2` ekle.

---

## 5. Dönüşüm taktikleri (bu modele özel)

1. **Sıra:** arama (30 sn) → görsel (telefon çerçeveli, A·B ikili) → link → 24 saat sonra tek soru → 15 sn video → fiyat + kalan süre.
2. **Aciliyet olguyla:** "7 gün yayında, sonra alan adı/sunucu ayrılmadığı için kalkıyor." Sayfadaki geri sayım ve mesajdaki tarih aynı olsun. Dolan süreyi hep uygula; "tekrar açalım" istenirse sıraya al, 2–3 gün.
3. **Bonus-tarih:** "Bu hafta içinde onaylarsanız İngilizce sayfa dahil" — tehdit yerine bonus, en etik aciliyet biçimi.
4. **Görsel vs video:** ilk temas görsel (tıklama daha yüksek), ikinci temas video (kişisel, "sizin için yaptım" hissi). Video 15 sn, sessiz, altyazılı, telefonda kaydırma.
5. **Saat:** 10:00–12:00 ve 18:00–20:30 (Türkçe kaynaklar); 08:00 öncesi ve 21:00 sonrası yok. Sektöre göre **[çıkarım]**: restoran 15:00–17:00 (servis arası), berber pazartesi (kapalı gün) ya da 10:00, otel/pansiyon 11:00 (check-out sonrası).
6. **Karar verici:** Haritalardaki numarayı ara, "işletme sahibi ya da yetkilisiyle görüşebilir miyim?"; yorumlara "sahip" olarak cevap veren profil = dijitalde aktif sahip; sahiplenilmemiş profil ("Bu işletmenin sahibi misiniz?") = daha az dijital, ama paket içine "profili doğrularız" koymak için fırsat.
7. **Sinyal → arama:** link açıldı bildirimi geldiğinde 10 dakika içinde ara (yol haritası #1 Telegram uyarısı bunun için).
8. **Tek soru tekniği:** "Hangisini beğendiniz, A mı B mi?" sonra "Fotoğrafları siz mi atarsınız, ben mi çekeyim?" — her adım küçük evet.
9. **Sosyal kanıt:** ilk 2 satıştan sonra teklif sayfasına "Kaş'ta yayında: X, Y" satırı. Satıştan önce uydurma referans yok.
10. **Teklif sayfası (yol haritası #2) içeriği:** ne dahil, süreç (onay → fotoğraf → alan adı → 24 saatte yayın), 2 paket, SSS (10 madde), gönderen künyesi, "borç yok" cümlesi, ödeme linki, ret yolu.

---

## 6. Ödeme

| Yol | Şirket şartı | Komisyon | Kurulum | Ödeme günü | Not |
|---|---|---|---|---|---|
| **iyzico Link** | Yok (bireysel başvuru) | Bireysel %4,49 + 0,25 ₺; şirket %4,29 + 0,25 ₺ (eski sayfada %4,19/%3,99 — oran değişken) | İlk link 24 saatte onay; ek belge istenebilir | Bireysel: satıştan 7 gün sonraki ilk çarşamba; şirket: haftalık çarşamba, başta 3 hafta blokaj | Taksit açılabilir; "e-ticarete giriş paketi" 3 ay 5.000 ₺ komisyonsuz (Link'e uygulanıyor mu **[belirsiz]**). 8.500 ₺ → ~382 ₺ kesinti |
| **PayTR Link** | Vergi levhası şart (şahıs şirketi olur) | Tek çekim %1,45–1,95 (ideasoft); sabit ücret yok | ~2 saat | — | 8.500 ₺ → ~125–165 ₺. Şirket kurulunca geç |
| **Papara Link** | Papara Ticari (şirket) | Açıklanmıyor | — | — | Lisans 30.10.2025 iptal → 09.12.2025 yürütmeyi durdurma → 21.01.2026 iptal kararı kaldırıldı. Çalışıyor ama itibar/istikrar riski; şimdilik kullanma |
| **Shopier** | Yok | %2,99–5,99 + 0,49 ₺ (yeni satıcı %5,99) | Hızlı | — | Mağaza görünümü hizmet satışına uymuyor; yedek |
| **Havale/EFT** | — | 0 | — | Anında | Esnafın en sevdiği yol. Fatura: mükellefsen e-Arşiv zorunlu (2026'da e-Fatura mükellefi olmayan alıcıya tutar sınırı kalktı — Paraşüt **[teyit]**); mükellef değilsen gelir yine vergiye tabi (GVK serbest meslek) → mali müşavire sor |

- Şahıs şirketi kuruluşu 8.000–13.500 ₺ + aylık muhasebe; ayda 5+ satışta PayTR'nin komisyon farkı (satış başına ~250 ₺) ile başa baş **[kabaca]**.
- Öneri: Faz 1 iyzico Link bireysel + havale; Faz 2 şahıs şirketi + PayTR Link. `sell` scriptine her iki linki de yaz; mesajda "havale ya da kartla 3 taksit".

---

## 7. Satış sonrası

### 7.1 Google İşletme Profili
- Site linki yalnızca **doğrulanmış** profilde düzenlenir; "Profili düzenle → Web sitesi" alanı; `https://` ile tam adres; ana sayfa linki. İnceleme 3 güne kadar sürebilir; site adı/işletme adı uyumsuzsa reddedilebilir.
- WhatsApp click-to-chat ve mesaj linkleri de profile eklenebilir (Google My Business API dokümanı).
- Doğrulanmamış profil için paket maddesi: "profili sizin Google hesabınızla doğrularız" (posta/telefon/video doğrulama; süre 1–7 gün **[değişken]**).

### 7.2 Alan adı sahipliği
- **Tercih:** müşteri adına, müşterinin hesabında (Türk kayıt kuruluşu; .com.tr belgesiz). Darphane yalnızca NS/A kaydını Vercel'e çevirir. Sözleşme cümlesi: "Alan adı sizin adınıza; yenileme hatırlatmasını biz yaparız."
- Darphane hesabında alınırsa: ICANN 60 gün transfer kilidi; Vercel'de "Transfer out" ile auth code panelden alınır, Vercel ücret almaz, alıcı kuruluş 1 yıllık yenileme ücreti alır. Vercel içinde başka takıma devir de mümkün (müşteri Vercel kullanıyorsa).
- Vercel Hobby ticari kullanım dışı **[teyit]** → satılan siteler Pro'da.

### 7.3 Bakım ve ek satış (işe yarayanlar)
- **Yıllık yenileme 2.500 ₺** (alan adı + yayın + SSL + 3 değişiklik). Piyasa: Bulutweb 2.790 ₺ + KDV; ABD servisleri 297 $/yıl. Esnafa aylık değil yıllık — tahsilat kovalamaca azalır.
- **Google İşletme Profili bakımı 750–1.000 ₺/ay**: yorumlara 24 saatte cevap, haftalık fotoğraf/gönderi, saat/tatil güncellemesi. Kıyas: sosyal medya paketleri 600–1.500 ₺/ay.
- **İngilizce sayfa +1.500 ₺** (motorda hazır, turistik bölgede güçlü).
- **Menü / fiyat listesi / ekip bölümü** 500–1.000 ₺ (yol haritası #9 bölümleri).
- **Hizmete göre paket:** otel → rezervasyon linki (Booking/WhatsApp), restoran → QR menü sayfası, servis işleri → "acil" WhatsApp kapısı. Her biri mevcut bölüm kütüphanesinden.
- Çalışmayan: aylık küçük tutarlı "bakım aboneliği" (esnaf iptal eder), SEO vaadi (ölçülemez, TBB gibi kısıtlı mesleklerde yasak).

---

## 8. WhatsApp mesaj şablonları (kopyala-yapıştır)

Kurallar: her mesajda ad soyad + telefon, veri kaynağı, ret cümlesi; ünlem yok; reklam sıfatı yok; tek link; görsel önce.

**V1 — İlk mesaj, arama sonrası (esnaf/tacir: kafe, otel, berber, atölye)**
```
Merhaba [Ad] Bey/Hanım, az önce telefonda görüştüğümüz gibi [İşletme] için hazırladığım sayfa:
[link]

Ben Serkan Oral (0[5xx xxx xx xx]). Bilgileri Google Haritalar'daki işletme kaydınızdan aldım; puan, saat, adres ve telefon oradaki gibi. Fotoğraflar geçici, sizinkilerle değişecek.

Sayfa [gün ay] [saat]'e kadar yayında kalıyor; sonra alan adı ve sunucu ayrılmadığı için yayından kalkıyor. Beğenirseniz alan adı sizin adınıza açılıyor, aynı gün yayına giriyor. Ücret tek seferlik, sayfanın altındaki "Teklif"te yazıyor. Hiçbir yükümlülüğünüz yok.

Bu tür mesaj istemiyorsanız "hayır" yazmanız yeterli; numaranızı silerim, bir daha yazmam.
```

**V2 — İlk mesaj, arama yapılamadıysa (yalnızca tacir/esnaf; avukat/doktor için kullanma)**
```
Merhaba, ben Serkan Oral (0[5xx xxx xx xx]). Google Haritalar'da [İşletme]'nin [4,7] puanla [128] yorumu olduğunu ama web sitesi olmadığını gördüm; bir sayfa hazırladım:
[link]

Bilgiler Google kaydınızdan; fotoğraflar geçici. Sayfa [gün ay] [saat]'e kadar yayında, sonra kalkıyor. Beğenirseniz tek seferlik ücretle sizin adınıza açılıyor; beğenmezseniz hiçbir borcunuz yok.

İstemiyorsanız "hayır" yazın, silerim ve bir daha yazmam.
```

**V3 — Takip, G+1 (link açıldı, cevap yok)**
```
Merhaba [Ad] Bey/Hanım, sayfaya baktığınızı gördüm. İki tasarım var: A mı B mi? Tek kelime yeter, gerisini ben hallederim. İstemiyorsanız "hayır" da yeter.
```

**V4 — Takip, G+3 (video ile)**
```
[15 sn video]
[İşletme]'nin sayfası telefonda böyle görünüyor. Fotoğraflarınızı atarsanız akşama yerleştiririm. Yayın süresi [gün ay]'a kadar. — Serkan Oral
```

**V5 — G+5, fiyat ve kalan süre**
```
[Ad] Bey/Hanım, iki gün kaldı; [gün ay] [saat]'te sayfa yayından kalkıyor.
Site: 7.900 ₺ (alan adı sizin adınıza, 1 yıl yayın, 3 düzeltme)
Site + Google İşletme Profili + İngilizce: 9.900 ₺
Havale ya da kartla 3 taksit: [ödeme linki]
Detay: [link]/teklif
İstemiyorsanız "hayır" yazın, konu kapanır.
```

**V6 — Son gün sabahı**
```
Günaydın [Ad] Bey/Hanım, bugün son gün; [saat]'te sayfa kapanıyor. Onay için "tamam" yazmanız yeterli; alan adı ve fotoğraflar için size iki soru soracağım. — Serkan Oral
```

**V7 — Süre doldu (tek mesaj, sonra dur)**
```
[İşletme] sayfasını yayından kaldırdım. İleride isterseniz yeniden sıraya alırım, 2–3 gün sürer. Numaranızı siliyorum; iyi çalışmalar. — Serkan Oral
```

**V8 — "Hayır" cevabına**
```
Anlaşıldı, numaranızı sildim, bir daha yazmayacağım. Zaman ayırdığınız için teşekkürler.
```

**V9 — Telefon açılış metni (30 sn)**
```
Merhaba, ben Serkan Oral, Antalya'dan. [İşletme]'nin sahibi ya da yetkilisiyle görüşebilir miyim? ... Google Haritalar'da sizi gördüm, siteniz olmadığı için bir tanıtım sayfası hazırladım; bakmanız 1 dakika sürer. WhatsApp'a atayım mı, bu numaraya mı? ... Teşekkürler, iki dakikaya gelir; beğenmezseniz hiçbir borcunuz yok.
```

**V10 — Avukat / doktor / serbest meslek (yalnızca telefonda izin alındıktan sonra)**
```
Merhaba Av. [Ad Soyad], telefonda görüştüğümüz gibi büronuz için hazırladığım sayfa: [link]
Sayfa TBB Reklam Yasağı Yönetmeliği'ne göre düzenlendi: yorum, puan ve başarı ifadesi yok; sicil no, fakülte, çalışma saatleri ve iletişim bilgisi var. Bilgileri sizin teyidinizle tamamlayacağım.
Ben Serkan Oral (0[5xx xxx xx xx]). İstemezseniz "hayır" yazın; verilerinizi silerim.
```

---

## 9. Açık sorular (Serkan)

1. Vergi durumu: mükellef mi? Cevap fiyat gösterimini (KDV) ve ödeme yolunu belirliyor.
2. Vercel Hobby → Pro geçişi onayı (satılan siteler için).
3. Avukat teklifi: telefonla izin alındı mı? Alınmadıysa gönderme.
4. PostHog çerez bandı satıştan önce bitecek mi (yol haritası #7)?
5. İYS kaydı: şimdilik gerek yok (hacim düşük, kanal WhatsApp) — ayda 50+ ilk mesaj olunca tekrar bak.

---

## 10. Kaynaklar

### Önce yap, sonra sat / outreach
- Get Map Leads — Cold Outreach Strategy for Web Agencies: https://getmapleads.io/blog/cold-outreach-strategy-web-agencies
- ReadyWeb AI — Free preview: https://readywebai.com/free-preview
- WeGotSites: https://wegotsites.com/
- Oddology — Why we build a free preview: https://oddologyllc.com/blog/free-website-preview-explained
- BuiltByM: http://builtbymmm.com/ · ReadyMadeSites: https://readymadesites.com/
- Growleads — Warm vs cold reply rates: https://growleads.io/blog/warm-outreach-vs-cold-email/
- Search Engine Land — outreach personalization reply rates: https://searchengineland.com/guest-post-outreach-proven-scalable-process-473497
- Sendspark — Cold email vs video email: https://blog.sendspark.com/cold-email-vs-video-email-replies
- Loom × Intercom case: https://www.loom.com/customers/intercom
- Searchlab — WhatsApp Business statistics 2026: https://searchlab.nl/en/statistics/whatsapp-business-statistics-2026
- Jovan Cicmil — local outreach pros/cons: https://jovancicmil.com/blog/should-you-use-local-outreach-to-find-freelance-clients-pros-and-cons
- Ethical scarcity: https://www.membershipgeeks.com/ethical-scarcity-and-urgency · https://www.blab.co/blog/scarcity-drive-sales-without-hurting-trust
- WhatsApp gönderim saatleri (TR): https://epiked.com/blog/whatsapp/whatsapp-mesaj-gonderim-saatlerini-dogru-ayarlamanin-onemi/ · (EN) https://www.chatmaid.net/blog/the-best-time-to-send-whatsapp-messages-for-business-data-backed-guide
- Esnaf itirazları: https://www.in-wo.com/instagramdan-satis-yerine-web-sitesi-esnaf-rehberi/ · https://escmedya.com/instagrama-guvenen-isletmelerin-buyuk-yanilgisi-neden-kendi-web-sitenize-yatirim-yapmalisiniz/
- Türkçe forumlar (önce müşteri, kapora): https://www.technopat.net/sosyal/konu/web-sitesi-tasarimlari-nasil-satilir.1224640/ · https://www.r10.net/yeni-baslayanlar/4451437-web-tasarim-isine-girmek.html

### Fiyat
- websitesifiyatlari.com: https://www.websitesifiyatlari.com/
- ILS — Tek sayfa fiyatları 2026: https://ils.com.tr/tek-sayfa-web-sitesi-fiyatlari-2026/
- Bulutweb hazır site: https://www.bulutwebsite.com/fiyatlar.html
- websitesipaketi.com: https://www.websitesipaketi.com/
- Doruk Sucuka 2026: https://doruksucuka.com.tr/blog/web-sitesi-fiyatlari-2026
- Armut web tasarım: https://armut.com/fiyatlari/web-tasarim_718 · https://armut.com/fiyatlari/web-site-yapimi_271
- Karekod — domain fiyatları: https://www.karekod.org/blog/domain-fiyatlari/ · İnetmar: https://www.inetmar.com/domain/domain-fiyatlari/
- Vulut — site maliyeti 2026: https://www.vulut.com/blog/web-sitesi-maliyeti-2026 · Netora yıllık: https://netorabilisim.com/web-sitesi-yillik-ucretleri/
- ilkkod bakım: https://www.ilkkod.com/blog/web-sitesi-bakim-maliyetleri
- .com.tr belgesiz (TRABİS): https://www.lexology.com/library/detail.aspx?g=13d1f6c1-07c0-4b55-981f-6c6dbb351e2f · https://www.reklam5.com/en/blog/domain-name-guide/the-comtr-domain-guide-what-it-is-how-to-get-it-and-who-can-register
- Wix fiyat: https://www.websitebuilderexpert.com/website-builders/wix-pricing/
- TÜİK 2025 Girişimlerde BT Kullanımı (özet): https://www.alomaliye.com/2025/09/11/girisimlerde-bilisim-teknolojileri-kullanim-arastirmasi-2025/ · bülten: https://data.tuik.gov.tr/Bulten/Index?p=Girisimlerde-Bilisim-Teknolojileri-Kullanim-Arastirmasi-2025-54012&dil=1
- Ekşi — Bionluk fiyat gerçeği: https://eksisozluk.com/bionluk-com--4360934?p=3

### Hukuk
- Yönetmelik metni (md. 6, 8, 9): https://kayseri.ticaret.gov.tr/yayinlar/tuketici/ticari-iletisim-ve-ticari-elektronik-iletiler-hakkinda-yonetmelik
- 6563 Kanun: https://mevzuat.gov.tr/MevzuatMetin/1.5.6563.pdf
- Tacir/esnaf onay istisnası ve İYS'ye yükleme: https://jetiys.com/ileti-yonetim-sistemi/tacir-veya-esnafa-ticari-ileti-gonderirken-onay-almak-zorunlu-mu/
- 2026 cezaları (Erdem & Erdem): https://www.erdem-erdem.av.tr/bilgi-bankasi/elektronik-ticaret-kanunu-kapsaminda-idari-para-cezalari-2026-yili-icin-guncellendi · 10 kat: https://iletiniz.com/blog/ticari-elektronik-ileti-cezalari-2026
- WhatsApp kapsam tartışması: https://www.cenuta.com/blog/6563-sayili-kanun-ve-iys-nedir-ticari-elektronik-ileti-yukumlulukleri-ve-ceza-rehberi-2026/ · https://lebibyalkin.com.tr/makale/ticari-elektronik-ileti-yonetim-sistemi-iys-hakkinda-degerlendirmeler · https://cebimedya.com/blog/whatsapp-toplu-mesaj-yasal-mi
- KVKK 2022/861 (avukat e-postası, 150.000 ₺): https://www.kvkk.gov.tr/Icerik/7580/2022-861
- KVKK kararları özeti (Gün + Partners): https://gun.av.tr/tr/goruslerimiz/guncel-yazilar/ticari-elektronik-ileti-gonderimi-hakkinda-kisisel-verileri-koruma-kurulu-kararlari
- KVKK 2020/966: https://www.kvkk.gov.tr/Icerik/6858/2020-966
- 6502 md. 7: https://mevzuat.gov.tr/mevzuatmetin/1.5.6502.pdf
- Ticari Reklam ve Haksız Ticari Uygulamalar Yönetmeliği: https://www.mevzuat.gov.tr/File/GeneratePdf?mevzuatNo=20435&mevzuatTur=KurumVeKurulusYonetmeligi&mevzuatTertip=5
- Google Places API policies: https://developers.google.com/maps/documentation/places/web-service/policies · Place Photos: https://developers.google.com/maps/documentation/places/web-service/place-photos · ToS/scraping özeti: https://bizcollect.dev/blog/google-places-api-terms
- FSEK md. 68 / izinsiz fotoğraf: https://www.duralhukuk.com/blog-detay/izinsiz-urun-fotografi-kullanimi · https://aygulhukukburosu.com/haberdetay/az%C4%B1l%C4%B1m-foto%C4%9Fraf-ve-i%CC%87%C3%A7erik-h%C4%B1rs%C4%B1zl%C4%B1%C4%9F%C4%B1nda-tazminat-kabusu-fsek
- Instagram telif: https://www.copyrightlaws.com/instagram-and-copyright/

### WhatsApp güvenliği
- Meta — Get opt-in: https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in
- WhatsApp Business Messaging Policy: https://whatsappbusiness.com/policy/
- Whatsable — spam policy 2026 (vendor eşikleri): https://whatsable.app/blog/whatsapp-spam-policy-explained-for-businesses-in-2026
- Wetarseel — policy violations & tiers: https://wetarseel.ai/whatsapp-business-policy-violations/
- Trengo — banned reasons/cooldown: https://trengo.com/blog/whatsapp-business-banned · Deccan Herald (banların %95'i otomatik): https://www.deccanherald.com/technology/whatsapp-banned-20-lakh-indian-accounts-during-may15-june-15-period-1009057.html
- Broadcast 256 / kayıtlı numara kuralı: https://blueticks.co/blog/whatsapp-broadcast-limit · https://zepic.com/article/whatsapp-broadcast-limits-2026-why-youre-stuck-at-256-and-how-to-break-it
- d-dat WhatsApp toplu mesaj rehberi: https://d-dat.com/rehber/whatsapp-toplu-mesaj · whapi: https://whapi.cloud/blog/tr/whatsapp-bulk-messaging-not-working-2026
- Link önizleme kuralları: https://wha.tools/blog/whatsapp-link-preview-not-working · https://www.techcompare.app/open-graph-viewer/whatsapp-link-previews

### Ödeme
- iyzico Link yardım: https://www.iyzico.com/destek/yardim-merkezi/urunler-ve-ozellikler/link-ile-odeme-al · Başvuru: https://www.iyzico.com/destek/yardim-merkezi/basvuru · Fiyatlandırma: https://www.iyzico.com/destek/yardim-merkezi/genel-bilgiler/fiyatlandirma
- PayTR link entegrasyon: https://dev.paytr.com/en/home/link-odeme-entegrasyon-sureci · komisyon: https://www.ideasoft.com.tr/paytr-komisyon-oranlari/ · başvuru belgeleri: https://www.bulutwebsite.com/blog/paytr-basvuru-sartlari.html
- Papara Link: https://www.papara.com/link-checkout-lp · lisans süreci: https://webrazzi.com/2025/12/16/papara-lisans-iptaline-iliskin-yurutmenin-durdurulmasindan-sonra-faaliyetlerine-devam-edecek/ · https://eticaretradari.com/vendor-watch/
- Shopier komisyon: https://www.ideasoft.com.tr/shopier-komisyon-oranlari/
- Freelancer vergi 2026: https://www.muhasebementor.com/freelancer-vergi-rehberi-2026/ · e-Arşiv sınırı: https://www.parasut.com/blog/e-arsiv-fatura-limitleri · şahıs şirketi maliyeti: https://mukellef.co/blog/sahis-sirketi-kurma-maliyeti/

### Satış sonrası
- GBP düzenleme: https://support.google.com/business/answer/3039617?hl=tr · site ekleme rehberi: https://cozysites.me/blog/add-website-to-google-business-profile · https://firstplaceseo.co.uk/gbp-help/how-to-change-or-update-your-url-in-google-business-profile/
- GBP WhatsApp linki: https://developers.google.com/my-business/content/whatsapp-text?hl=tr
- Vercel transfer-out: https://vercel.com/kb/guide/how-do-i-transfer-my-domain-out-of-vercel · takıma devir: https://vercel.com/docs/domains/working-with-domains/transfer-your-domain
- GBP siteleri kapandı (Mart 2024, 21M+ site): https://www.searchenginejournal.com/websites-created-with-google-business-profiles-to-shut-down-in-march/509794/
- Birdeye/GBP doğrulama oranları: https://searchendurance.com/google-business-profile-statistics/
