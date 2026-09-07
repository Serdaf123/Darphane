import Image from "next/image";
import Link from "next/link";
import { whatsappUrl } from "@/lib/actions";
import "./b.css";

/**
 * Tasarım B — sunucu bileşeni, JS yok. A'nın tersi: açık kâğıt zemin, Fraunces serif,
 * telefon vitrini. Olgular A ile aynı; yeni iddia yok.
 */

const WHATSAPP = "905078463929";
const PHONE = "0507 846 39 29";
const MSG = "Merhaba Serkan, işletmem için site istiyorum.\nİşletme adı: \nŞehir: ";

const STEPS = [
  ["Buluyorum", "Google Haritalar’da web sitesi olmayan işletmeleri arıyorum. Telefon, adres, saatler, yorumlar orada hazır."],
  ["Kuruyorum", "Bu gerçek bilgilerle tek sayfalık, telefonda önce çalışan bir site. Sizden hiçbir şey istemeden."],
  ["Gönderiyorum", "Linki WhatsApp’tan atıyorum; site o an canlı. Beğenirseniz sizin, beğenmezseniz belirttiğim gün kaldırıyorum."],
] as const;

const ITEMS = [
  ["Önce telefon", "Müşteriniz sizi telefondan buluyor. Site önce telefon ekranı için tasarlanır ve hızlı açılır."],
  ["Ara · WhatsApp · Yol tarifi", "Ekranın altında her zaman duran üç düğme. Form yok; mesaj doğrudan WhatsApp’ınıza düşer."],
  ["Google yorumlarınız", "Haritalar’daki yorumlarınız ve puanınız siteye taşınır; açık/kapalı durumu saatlerinize göre canlı görünür."],
  ["İngilizce sürüm", "Turist müşterisi olan işletmeler için aynı sitenin İngilizcesi ayrı bir adreste."],
  ["Alan adı ve kilit simgesi", "ornek.com sizin adınıza alınır ve bağlanır. Tarayıcıda kilit, WhatsApp’ta link önizleme görseli hazır gelir."],
  ["Google’a kayıt", "Satıştan sonra site arama motorlarına açılır; işletme bilgileriniz Google’ın anladığı biçimde işaretlenir."],
] as const;

const FAQ = [
  ["Ücret ne kadar?", "Tek seferlik. Rakamı işletmenize göre belirler, WhatsApp’tan yazarım; aylık ödeme yoktur."],
  ["Ben istemeden neden site yaptınız?", "Anlatmak yerine göstermek daha dürüst. Bitmiş siteyi görürsünüz; beğenmezseniz kaldırırım, size bir maliyeti olmaz."],
  ["Bazı yerleri değiştirmek istiyorum.", "Satın almadan önce de değişiklik isteyebilirsiniz; yazın, düzeltip aynı linkten gösteririm."],
  ["Alan adı kimin üzerine olur?", "Sizin. Alan adı sizin adınıza alınır; siteyi ileride başka yere taşımak isterseniz engel yok."],
  ["Kendi fotoğraflarımı kullanabilir misiniz?", "Teklif aşamasında telifsiz görsellerle çalışırım. Satıştan sonra kendi fotoğraflarınızı gönderirsiniz, onları koyarım."],
  ["Örnekler gerçek müşteri mi?", "Örneklerdeki iki site tanıtım amaçlı hazırlanmış demolardır. Gerçek işletmelerin siteleri satışa kadar yalnızca sahiplerine gösterilir."],
] as const;

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);
const Plus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export function SerkanB({ year }: { year: number }) {
  const wa = whatsappUrl(WHATSAPP, MSG);
  return (
    <div className="sb">
      <div className="sb-wrap">
        <header className="sb-header">
          <a href="#ust" className="sb-brand">
            Serkan Oral<small>fourpear</small>
          </a>
          <a href={wa} className="sb-btn" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
        </header>

        <section id="ust" className="sb-hero">
          <div>
            <h1>
              İşletmenizin sitesi hazır. <em>Siz daha istemeden.</em>
            </h1>
            <p className="lead">Web sitesi olmayan işletmeler için siteyi önce yapıyor, sonra gösteriyorum. Beğenirseniz tek seferlik ücretle sizin; alan adı kurulumu dahil.</p>
            <div className="actions">
              <a href={wa} className="sb-btn sb-btn-lg" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
              <a href="#nasil" className="sb-btn sb-btn-ghost sb-btn-lg">Nasıl çalışıyor?</a>
            </div>
            <div className="who">
              <Image src="/sites/serkan-oral/serkan.webp" alt="" width={104} height={104} sizes="52px" />
              <span>
                <b>Serkan Oral</b>
                fourpear · web tasarımı
              </span>
            </div>
          </div>
          <div className="sb-phones" aria-hidden>
            <div className="sb-phone sb-phone-a">
              <Image src="/sites/serkan-oral/ocakbasi-sahin.webp" alt="" width={900} height={1800} sizes="(min-width: 60rem) 22vw, 50vw" priority />
            </div>
            <div className="sb-phone sb-phone-b">
              <Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="" width={900} height={1800} sizes="(min-width: 60rem) 22vw, 50vw" priority />
            </div>
          </div>
        </section>
      </div>

      <div className="sb-band">
        <div className="sb-wrap">
          <p>
            Linki gönderiyorum, siteyi telefonunuzdan açıyorsunuz. <mark>Beğenmezseniz kaldırıyorum;</mark> hiçbir borç ya da yükümlülük yok.
          </p>
        </div>
      </div>

      <div className="sb-wrap">
        <section id="nasil" className="sb-section">
          <h2>Nasıl çalışıyor</h2>
          <p className="intro">Üç adım. Sizden bir şey istemeden başlıyor, siz karar verince bitiyor.</p>
          <ol className="sb-steps" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {STEPS.map(([t, d], i) => (
              <li key={t} className="sb-step">
                <div className="n" aria-hidden>{i + 1}</div>
                <h3>{t}</h3>
                <p>{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="sb-section" aria-labelledby="olanlar">
          <h2 id="olanlar">Her sitede olanlar</h2>
          <p className="intro">Şablon değil, çalışan bir sistem. Aşağıdakiler her sitede hazır gelir.</p>
          <div className="sb-list">
            {ITEMS.map(([t, d]) => (
              <div key={t} className="sb-item">
                <Check />
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="isler" className="sb-section">
          <h2>Örnek çalışmalar</h2>
          <p className="intro">İki demo site. Açıp telefonunuzdan gezebilirsiniz; işletmelere giden siteler tam olarak böyle çalışır.</p>
          <Link href="/ocakbasi-sahin" className="sb-work" target="_blank">
            <div className="shot"><Image src="/sites/serkan-oral/ocakbasi-sahin.webp" alt="Ocakbaşı restoranı demo sitesinin telefon görünümü" width={900} height={1800} sizes="176px" /></div>
            <div>
              <h3>Ocakbaşı Şahin</h3>
              <p>Restoran demosu, İzmir. Menü, rezervasyon WhatsApp’ı, açık/kapalı rozeti, Google yorumları.</p>
            </div>
            <span className="go">Siteyi aç →</span>
          </Link>
          <Link href="/dishekimi-elif-yarar" className="sb-work" target="_blank">
            <div className="shot"><Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="Diş kliniği demo sitesinin telefon görünümü" width={900} height={1800} sizes="176px" /></div>
            <div>
              <h3>Dt. Elif Yarar</h3>
              <p>Klinik demosu, İstanbul. Randevu WhatsApp’ı, hizmetler, SSS, konum.</p>
            </div>
            <span className="go">Siteyi aç →</span>
          </Link>
          <p className="sb-note">Bu iki site tanıtım amaçlı hazırlanmış demolardır; gerçek müşteri çalışması değildir.</p>
        </section>

        <section className="sb-section sb-faq" aria-labelledby="sss">
          <h2 id="sss">Sık sorulan sorular</h2>
          <div>
            {FAQ.map(([q, a]) => (
              <details key={q}>
                <summary>{q}<Plus /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="iletisim" className="sb-end">
          <h2>Bir mesaj yeter.</h2>
          <p className="sub">İşletmenizin adını ve şehrini yazın; siteyi hazırlayıp linkini WhatsApp’tan gönderirim.</p>
          <div className="actions">
            <a href={wa} className="sb-btn sb-btn-lg" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
            <a href={`tel:+${WHATSAPP}`} className="sb-btn sb-btn-ghost sb-btn-lg">{PHONE}</a>
          </div>
          <footer className="sb-footer">
            <span>© {year} Serkan Oral</span>
            <a href="https://fourpear.com.tr" target="_blank" rel="noreferrer">Tasarım: fourpear</a>
          </footer>
        </section>
      </div>

      <nav className="sb-dock" aria-label="Hızlı iletişim">
        <a href={wa} className="sb-btn" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
        <a href={`tel:+${WHATSAPP}`} className="sb-btn sb-btn-ghost">Ara</a>
      </nav>
    </div>
  );
}
