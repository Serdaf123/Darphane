// Same factual copy as Design A; no new claims or customer stories.
export const FEATURES = [
  { t: "Önce telefon", d: "Müşteriniz sizi telefondan buluyor. Site önce telefon ekranı için tasarlanır ve hızlı açılır." },
  { t: "Ara · WhatsApp · Yol tarifi", d: "Ekranın altında her zaman duran üç düğme. Form yok; mesaj doğrudan WhatsApp’ınıza düşer." },
  { t: "Google yorumlarınız", d: "Haritalar’daki yorumlarınız ve puanınız siteye taşınır; açık/kapalı durumu saatlerinize göre canlı görünür." },
  { t: "İngilizce sürüm", d: "Turist müşterisi olan işletmeler için aynı sitenin İngilizcesi ayrı bir adreste." },
  { t: "Alan adı ve kilit simgesi", d: "ornek.com sizin adınıza alınır ve bağlanır. Tarayıcıda kilit, WhatsApp’ta link önizleme görseli hazır gelir." },
  { t: "Google’a kayıt", d: "Satıştan sonra site arama motorlarına açılır; işletme bilgileriniz Google’ın anladığı biçimde işaretlenir." },
] as const;
export const FAQ = [
  ["Ücret ne kadar?", "Tek seferlik. Rakamı işletmenize göre belirler, WhatsApp’tan yazarım; aylık ödeme yoktur."],
  ["Ben istemeden neden site yaptınız?", "Anlatmak yerine göstermek daha dürüst. Bitmiş siteyi görürsünüz; beğenmezseniz kaldırırım, size bir maliyeti olmaz."],
  ["Bazı yerleri değiştirmek istiyorum.", "Satın almadan önce de değişiklik isteyebilirsiniz; yazın, düzeltip aynı linkten gösteririm."],
  ["Alan adı kimin üzerine olur?", "Sizin. Alan adı sizin adınıza alınır; siteyi ileride başka yere taşımak isterseniz engel yok."],
  ["Kendi fotoğraflarımı kullanabilir misiniz?", "Teklif aşamasında telifsiz görsellerle çalışırım. Satıştan sonra kendi fotoğraflarınızı gönderirsiniz, onları koyarım."],
  ["Örnekler gerçek müşteri mi?", "Örneklerdeki iki site tanıtım amaçlı hazırlanmış demolardır. Gerçek işletmelerin siteleri satışa kadar yalnızca sahiplerine gösterilir."],
] as const;
export const STEPS = [{"t": "Buluyorum", "d": "Google Haritalar’da web sitesi olmayan işletmeleri arıyorum. Telefon, adres, saatler, yorumlar orada hazır."}, {"t": "Kuruyorum", "d": "Bu gerçek bilgilerle tek sayfalık, telefonda önce çalışan bir site. Sizden hiçbir şey istemeden."}, {"t": "Gönderiyorum", "d": "Linki WhatsApp’tan atıyorum; site o an canlı. Beğenirseniz sizin, beğenmezseniz belirttiğim gün kaldırıyorum."}] as const;
