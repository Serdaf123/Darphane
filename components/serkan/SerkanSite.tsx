"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { whatsappUrl } from "@/lib/actions";
import "./serkan.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * serkanoral.com.tr — ısmarlama tanıtım sayfası. Kaydırdıkça anlatır:
 * dev isim → manifesto (kelime kelime) → sabit telefonda üç adım →
 * yatay kayan "her sitede olanlar" → örnekler → SSS → kapanış.
 * "Hareketi azalt" açıksa her şey durağan ve okunur kalır.
 */

const WHATSAPP = "905078463929";
const PHONE = "0507 846 39 29";
const MSG = "Merhaba Serkan, işletmem için site istiyorum.\nİşletme adı: \nŞehir: ";
const CYCLE = ["Restoranınız", "Kliniğiniz", "Oteliniz", "Büronuz", "Salonunuz", "Atölyeniz"];

const CARDS = [
  { t: "Önce telefon", d: "Müşteriniz sizi telefondan buluyor. Site önce telefon ekranı için tasarlanır ve hızlı açılır." },
  { t: "Ara · WhatsApp · Yol tarifi", d: "Ekranın altında her zaman duran üç düğme. Form yok; mesaj doğrudan WhatsApp'ınıza düşer." },
  { t: "Google yorumlarınız", d: "Haritalar'daki yorumlarınız ve puanınız siteye taşınır; açık/kapalı durumu saatlerinize göre canlı görünür." },
  { t: "İngilizce sürüm", d: "Turist müşterisi olan işletmeler için aynı sitenin İngilizcesi ayrı bir adreste." },
  { t: "Alan adı ve SSL", d: "ornek.com sizin adınıza alınır ve bağlanır. Kilit simgesi, WhatsApp'ta link önizleme görseli hazır gelir." },
  { t: "Google'a kayıt", d: "Satıştan sonra site arama motorlarına açılır; işletme bilgileriniz Google'ın anladığı biçimde işaretlenir." },
];

const FAQ = [
  ["Ücret ne kadar?", "Tek seferlik. Rakam, size gönderdiğim teklif mesajında yazar; aylık ödeme yoktur."],
  ["Ben istemeden neden site yaptınız?", "Anlatmak yerine göstermek daha dürüst. Bitmiş siteyi görürsünüz; beğenmezseniz kaldırırım, size bir maliyeti olmaz."],
  ["Bazı yerleri değiştirmek istiyorum.", "Satın almadan önce de değişiklik isteyebilirsiniz; yazın, düzeltip aynı linkten gösteririm."],
  ["Alan adı kimin üzerine olur?", "Sizin. Alan adı sizin adınıza alınır; siteyi ileride başka yere taşımak isterseniz engel yok."],
  ["Kendi fotoğraflarımı kullanabilir misiniz?", "Teklif aşamasında telifsiz görsellerle çalışırım. Satıştan sonra kendi fotoğraflarınızı gönderirsiniz, onları koyarım."],
  ["Örnekler gerçek müşteri mi?", "Örneklerdeki iki site tanıtım amaçlı hazırlanmış demolardır. Gerçek işletmelerin siteleri satışa kadar yalnızca sahiplerine gösterilir."],
] as const;

export function SerkanSite() {
  const root = useRef<HTMLDivElement>(null);
  const wa = whatsappUrl(WHATSAPP, MSG);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);

      /* Üst çubuk: aşağı inerken saklan, yukarı çıkarken gel */
      const header = q<HTMLElement>(".so-header")[0];
      ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
          header.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 200);
          header.classList.toggle("is-solid", self.scroll() > 80);
        },
        onLeaveBack: () => header.classList.remove("is-hidden", "is-solid"),
      });

      if (reduced) {
        q(".so-screen")[0]?.classList.add("is-on");
        q(".so-step")[0]?.classList.add("is-active");
        return;
      }

      /* Hero: harfler yükselir */
      const title = q(".so-hero-title")[0];
      const split = SplitText.create(title, { type: "lines,chars", linesClass: "line", charsClass: "char" });
      gsap.from(split.chars, { yPercent: 110, rotate: 4, duration: 1.1, ease: "power4.out", stagger: 0.035, delay: 0.1 });
      gsap.from(q(".so-hero-bottom > *, .so-scrollcue"), { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 });

      /* Işık: fareyi izler (masaüstü) */
      const glow = q(".so-glow")[0];
      const xTo = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3" });
      const yTo = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo(e.clientX - window.innerWidth * 0.5);
        yTo(e.clientY - window.innerHeight * 0.5);
      };
      window.addEventListener("pointermove", onMove);

      /* Dönen kelime */
      const track = q(".so-cycle-track")[0];
      const win = q(".so-cycle-win")[0];
      const words = Array.from(track.children) as HTMLElement[];
      gsap.set(win, { width: words[0].offsetWidth });
      const cycle = gsap.timeline({ repeat: -1 });
      [...CYCLE.keys(), 0].forEach((i, k) => {
        if (k === 0) return;
        cycle
          .to(track, { yPercent: (-100 / CYCLE.length) * i, duration: 0.7, ease: "power3.inOut" }, "+=1.6")
          .to(win, { width: words[i].offsetWidth, duration: 0.5, ease: "power3.inOut" }, "<");
      });

      /* Manifesto: kelimeler kaydırdıkça dolar */
      gsap.to(q(".so-manifesto .w"), {
        opacity: 1,
        stagger: 0.08,
        ease: "none",
        scrollTrigger: { trigger: q(".so-manifesto")[0], start: "top 70%", end: "bottom 60%", scrub: 0.4 },
      });

      /* Süreç: sabit telefon, üç adım */
      const steps = q(".so-step");
      const screens = q(".so-screen");
      const bars = q(".so-step-bar i");
      const setStep = (p: number) => {
        const idx = Math.min(2, Math.floor(p * 3));
        steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
        screens.forEach((s, i) => s.classList.toggle("is-on", i === idx));
        bars.forEach((b, i) => gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, p * 3 - i) }));
      };
      ScrollTrigger.create({
        trigger: q(".so-process")[0],
        start: "top top",
        end: "+=220%",
        pin: q(".so-process-inner")[0],
        scrub: true,
        onUpdate: (self) => setStep(self.progress),
        onRefresh: (self) => setStep(self.progress),
      });
      gsap.from(q(".so-phone")[0], { y: 60, rotate: -3, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: q(".so-process")[0], start: "top 70%" } });

      /* Yatay kaydırma: sadece geniş ekran */
      const mm = gsap.matchMedia();
      mm.add("(min-width: 60rem)", () => {
        const viewport = q(".so-hs-viewport")[0];
        const hsTrack = q(".so-hs-track")[0];
        const distance = () => hsTrack.scrollWidth - viewport.clientWidth;
        gsap.to(hsTrack, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: q(".so-hs")[0], start: "top 12%", end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
      });

      /* Genel: bölüm başlıkları ve kartlar yumuşak girer */
      q(".so-works h2, .so-works .lead, .so-work, .so-faq h2, .so-faq details, .so-hs-head > *").forEach((el) => {
        gsap.from(el, { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      /* Kapanış: dev başlık kaydırdıkça hafif sıkışır */
      const endTitle = q(".so-end h2")[0];
      const endSplit = SplitText.create(endTitle, { type: "chars", charsClass: "char" });
      gsap.from(endSplit.chars, { yPercent: 80, opacity: 0, stagger: 0.03, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: q(".so-end")[0], start: "top 70%" } });

      /* Mıknatıs buton (masaüstü) */
      q<HTMLElement>(".so-magnet").forEach((btn) => {
        const bx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
        const by = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
        btn.addEventListener("pointermove", (e) => {
          if (e.pointerType !== "mouse") return;
          const r = btn.getBoundingClientRect();
          bx((e.clientX - (r.left + r.width / 2)) * 0.25);
          by((e.clientY - (r.top + r.height / 2)) * 0.25);
        });
        btn.addEventListener("pointerleave", () => { bx(0); by(0); });
      });

      return () => {
        window.removeEventListener("pointermove", onMove);
        split.revert();
        endSplit.revert();
        mm.revert();
      };
    },
    { scope: root }
  );

  const manifesto =
    "İşletmenizin sitesini siz istemeden yapıyorum. Linkini gönderiyorum. Beğenirseniz tek seferlik ücretle sizin; beğenmezseniz kaldırıyorum.";
  const highlight = new Set(["sizin;", "kaldırıyorum."]);

  return (
    <div className="so" ref={root}>
      <div className="so-grain" aria-hidden />

      <header className="so-header">
        <a href="#ust" className="so-brand">Serkan Oral</a>
        <a href={wa} className="so-pill" target="_blank" rel="noreferrer">Bana yazın</a>
      </header>

      <section id="ust" className="so-hero">
        <div className="so-hero-grid" aria-hidden />
        <div className="so-glow" aria-hidden style={{ left: "20%", top: "10%" }} />
        <div className="so-wrap">
          <h1 className="so-hero-title">
            Serkan
            <br />
            Oral
          </h1>
          <div className="so-hero-bottom">
            <div>
              <p className="so-cycle">
                <span className="so-cycle-win" aria-hidden>
                  <span className="so-cycle-track">
                    {CYCLE.map((w) => (
                      <span key={w}>{w}</span>
                    ))}
                  </span>
                </span>
                <span className="sr-only">İşletmeniz</span> için site hazır. Siz daha istemeden.
              </p>
              <div className="so-hero-actions">
                <a href={wa} className="so-pill so-pill-accent so-pill-lg so-magnet" target="_blank" rel="noreferrer">
                  WhatsApp’tan yazın
                </a>
                <a href="#surec" className="so-pill so-pill-ghost so-pill-lg">Nasıl çalışıyor?</a>
              </div>
            </div>
            <p className="so-hero-aside">
              Web sitesi olmayan işletmeler için siteyi önce yapıyor, sonra gösteriyorum. Beğenirseniz tek seferlik ücretle sizin; alan adı kurulumu dahil.
            </p>
          </div>
          <div className="so-scrollcue" aria-hidden>
            <i /> Kaydırın
          </div>
        </div>
      </section>

      <div className="so-marquee" aria-hidden>
        <div className="so-marquee-track">
          {[...Array(2)].map((_, k) => (
            <span key={k} style={{ display: "contents" }}>
              <span>Site önce, söz sonra</span>
              <span>Tek seferlik ücret</span>
              <span>Alan adı dahil</span>
              <span>Aylık ödeme yok</span>
              <span>Beğenmezseniz kaldırırım</span>
            </span>
          ))}
        </div>
      </div>

      <section className="so-manifesto">
        <div className="so-wrap">
          <p>
            {manifesto.split(" ").map((w, i) => (
              <span key={i} className={`w${highlight.has(w) ? " hi" : ""}`}>
                {w}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </section>

      <section id="surec" className="so-process">
        <div className="so-process-inner">
          <>
            <div className="so-steps">
              <div className="so-step is-active">
                <h3>Buluyorum</h3>
                <p>Google Haritalar’da web sitesi olmayan işletmeleri arıyorum. Telefon, adres, saatler, yorumlar orada hazır.</p>
                <div className="so-step-bar"><i /></div>
              </div>
              <div className="so-step">
                <h3>Kuruyorum</h3>
                <p>Bu gerçek bilgilerle tek sayfalık, telefonda önce çalışan bir site. Sizden hiçbir şey istemeden.</p>
                <div className="so-step-bar"><i /></div>
              </div>
              <div className="so-step">
                <h3>Gönderiyorum</h3>
                <p>Linki WhatsApp’tan atıyorum; site o an canlı. Beğenirseniz sizin, beğenmezseniz belirttiğim gün kaldırıyorum.</p>
                <div className="so-step-bar"><i /></div>
              </div>
            </div>
            <div className="so-phone-wrap">
              <div className="so-phone" aria-hidden>
                <div className="so-screen is-on">
                  <div className="so-maps">
                    <div className="so-maps-map"><div className="so-maps-pin" /></div>
                    <div className="so-maps-card">
                      <b>Ocakbaşı Şahin</b>
                      <span className="stars">★★★★★</span> 4,8 · Ocakbaşı
                      <div className="row">Bornova, İzmir · Açık</div>
                      <div className="row no">Web sitesi: yok</div>
                      <div className="so-maps-btns"><span>Ara</span><span>Yol tarifi</span></div>
                    </div>
                  </div>
                </div>
                <div className="so-screen">
                  <Image src="/sites/serkan-oral/ocakbasi-sahin-ekran.webp" alt="" width={800} height={1760} sizes="300px" />
                </div>
                <div className="so-screen">
                  <div className="so-wa">
                    <div className="so-wa-bar"><i />Ocakbaşı Şahin</div>
                    <div className="so-wa-msg">
                      Merhaba, Ocakbaşı Şahin için bir şey hazırladım. Siteniz yoktu, ben kurdum; telefonunuzdan açabilirsiniz:
                      <div className="so-wa-link">
                        <div className="img" />
                        <div className="t">Ocakbaşı Şahin — Ateşin başında geçen otuz yıl</div>
                        <div className="u">serkanoral.com.tr</div>
                      </div>
                      Beğenirseniz sizin, beğenmezseniz Cuma kaldırıyorum.
                      <small>21:04 ✓✓</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      </section>

      <section className="so-hs">
        <div className="so-wrap so-hs-head">
          <h2>Her sitede olanlar</h2>
          <p>Şablon değil, çalışan bir sistem. Aşağıdakiler her sitede hazır gelir.</p>
        </div>
        <div className="so-hs-viewport">
          <div className="so-hs-track">
            {CARDS.map((c) => (
              <article key={c.t} className="so-card">
                <span className="ic" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12l5 5L20 7" /></svg>
                </span>
                <div>
                  <h3>{c.t}</h3>
                  <p style={{ marginTop: "0.75rem" }}>{c.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="isler" className="so-works">
        <div className="so-wrap">
          <h2>Örnek çalışmalar</h2>
          <p className="lead">İki demo site. Üzerine gelince sayfa kendiliğinden kayar; telefonunuzdan açıldığında da böyle görünür.</p>
          <div className="so-works-grid">
            <figure className="so-work" style={{ margin: 0 }}>
              <Image src="/sites/serkan-oral/ocakbasi-sahin.webp" alt="Ocakbaşı restoranı için hazırlanan demo sitenin telefon görünümü" width={900} height={1800} sizes="(min-width: 48rem) 40vw, 90vw" />
              <figcaption>Ocakbaşı Şahin<small>Restoran demosu · İzmir</small></figcaption>
            </figure>
            <figure className="so-work" style={{ margin: 0 }}>
              <Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="Diş kliniği için hazırlanan demo sitenin telefon görünümü" width={900} height={1800} sizes="(min-width: 48rem) 40vw, 90vw" />
              <figcaption>Dt. Elif Yarar<small>Klinik demosu · İstanbul</small></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="so-wrap so-faq">
        <h2>Sık sorulan sorular</h2>
        <div>
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="iletisim" className="so-end">
        <div className="so-glow" aria-hidden style={{ right: "-10%", bottom: "-20%", left: "auto" }} />
        <div className="so-wrap">
          <h2>Bir mesaj yeter.</h2>
          <p className="sub">İşletmenizin adını ve şehrini yazın; siteyi hazırlayıp linkini WhatsApp’tan gönderirim.</p>
          <div className="so-end-actions">
            <a href={wa} className="so-pill so-pill-accent so-pill-lg so-magnet" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
            <a href={`tel:+${WHATSAPP}`} className="so-pill so-pill-ghost so-pill-lg">{PHONE}</a>
          </div>
          <footer className="so-footer">
            <span>© {new Date().getFullYear()} Serkan Oral</span>
            <span>fourpear</span>
          </footer>
        </div>
      </section>
    </div>
  );
}
