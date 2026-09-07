"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { whatsappUrl } from "@/lib/actions";
import "./serkan.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * serkanoral.com.tr — ısmarlama tanıtım sayfası. İki hareket anı var: açılışta
 * isim, kaydırdıkça sabit telefonda üç adım. Gerisi sakin. JS/hareket yoksa
 * her şey okunur kalır (durağan hâller CSS'te varsayılan).
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
  { t: "Alan adı ve kilit simgesi", d: "ornek.com sizin adınıza alınır ve bağlanır. Tarayıcıda kilit, WhatsApp'ta link önizleme görseli hazır gelir." },
  { t: "Google'a kayıt", d: "Satıştan sonra site arama motorlarına açılır; işletme bilgileriniz Google'ın anladığı biçimde işaretlenir." },
];

const FAQ = [
  ["Ücret ne kadar?", "Tek seferlik. Rakamı işletmenize göre belirler, WhatsApp'tan yazarım; aylık ödeme yoktur."],
  ["Ben istemeden neden site yaptınız?", "Anlatmak yerine göstermek daha dürüst. Bitmiş siteyi görürsünüz; beğenmezseniz kaldırırım, size bir maliyeti olmaz."],
  ["Bazı yerleri değiştirmek istiyorum.", "Satın almadan önce de değişiklik isteyebilirsiniz; yazın, düzeltip aynı linkten gösteririm."],
  ["Alan adı kimin üzerine olur?", "Sizin. Alan adı sizin adınıza alınır; siteyi ileride başka yere taşımak isterseniz engel yok."],
  ["Kendi fotoğraflarımı kullanabilir misiniz?", "Teklif aşamasında telifsiz görsellerle çalışırım. Satıştan sonra kendi fotoğraflarınızı gönderirsiniz, onları koyarım."],
  ["Örnekler gerçek müşteri mi?", "Örneklerdeki iki site tanıtım amaçlı hazırlanmış demolardır. Gerçek işletmelerin siteleri satışa kadar yalnızca sahiplerine gösterilir."],
] as const;

const MANIFESTO =
  "İşletmenizin sitesini siz istemeden yapıyorum. Linkini gönderiyorum. Beğenirseniz tek seferlik ücretle sizin; beğenmezseniz kaldırıyorum.";
const HIGHLIGHT = new Set(["sizin;", "kaldırıyorum."]);

export function SerkanSite({ year }: { year: number }) {
  const root = useRef<HTMLDivElement>(null);
  const wa = whatsappUrl(WHATSAPP, MSG);

  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const q = gsap.utils.selector(root);
      const el = root.current!;

      /* Üst çubuk ve mobil alt çubuk: kaydırma yönüne göre */
      const header = q<HTMLElement>(".so-header")[0];
      const dock = q<HTMLElement>(".so-dock")[0];
      ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
          header.classList.toggle("is-hidden", self.direction === 1 && self.scroll() > 200);
          header.classList.toggle("is-solid", self.scroll() > 80);
          dock.classList.toggle("is-visible", self.scroll() > window.innerHeight * 0.6);
        },
        onLeaveBack: () => {
          header.classList.remove("is-hidden", "is-solid");
          dock.classList.remove("is-visible");
        },
      });
      /* Kapanış düğmeleri görünürken alt çubuk çekilir */
      ScrollTrigger.create({
        trigger: q(".so-end-actions")[0],
        start: "top 90%",
        end: "bottom top",
        onToggle: (self) => dock.classList.toggle("is-suppressed", self.isActive),
        onUpdate: (self) => { if (self.isActive) dock.classList.remove("is-visible"); },
      });

      if (reduced) {
        q(".so-screen")[0]?.classList.add("is-on");
        return;
      }

      const late = performance.now() > 2500; // yavaş bağlantıda giriş animasyonu okunmuş içeriği yeniden oynatmasın

      /* Açılış: harfler yükselir */
      const title = q(".so-hero-title")[0];
      const split = SplitText.create(title, { type: "lines,chars", linesClass: "line", charsClass: "char" });
      if (!late) {
        gsap.from(split.chars, { yPercent: 110, rotate: 4, duration: 1.1, ease: "power4.out", stagger: 0.035, delay: 0.1 });
        gsap.from(q(".so-hero-bottom > *"), { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, delay: 0.7 });
        gsap.from(q(".so-portrait-desktop")[0], { y: 60, opacity: 0, duration: 1.3, ease: "power3.out", delay: 0.35 });
      }

      /* Işık fareyi izler (yalnız fare) */
      const glow = q(".so-glow")[0];
      const xTo = gsap.quickTo(glow, "x", { duration: 1.2, ease: "power3" });
      const yTo = gsap.quickTo(glow, "y", { duration: 1.2, ease: "power3" });
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo(e.clientX - window.innerWidth * 0.5);
        yTo(e.clientY - window.innerHeight * 0.5);
      };
      window.addEventListener("pointermove", onMove);

      /* Dönen kelime: pencere, kelimenin gerçek genişliğine göre daralıp genişler */
      const track = q(".so-cycle-track")[0];
      const win = q(".so-cycle-win")[0];
      const words = Array.from(track.children) as HTMLElement[];
      const fit = (i: number, animate: boolean) =>
        animate ? gsap.to(win, { width: words[i].offsetWidth, duration: 0.5, ease: "power3.inOut" }) : gsap.set(win, { width: words[i].offsetWidth });
      let current = 0;
      fit(0, false);
      const refit = () => fit(current, false);
      document.fonts?.ready.then(() => { refit(); setTimeout(refit, 400); });
      window.addEventListener("load", refit);
      window.addEventListener("resize", refit);
      const cycle = gsap.timeline({ repeat: -1 });
      [...CYCLE.keys(), 0].forEach((i, k) => {
        if (k === 0) return;
        cycle.to(track, { yPercent: (-100 / CYCLE.length) * i, duration: 0.7, ease: "power3.inOut" }, "+=1.8").add(() => { current = i; fit(i, true); }, "<");
      });

      /* Manifesto: kelimeler kaydırdıkça dolar (durağan hâl: tam görünür) */
      /* Renk üzerinden (opaklık değil): sönük hâl de 6:1 kontrastı korur */
      const manifestoWords = q<HTMLElement>(".so-manifesto .w");
      gsap.fromTo(
        manifestoWords,
        { color: "#98a0b3" },
        {
          color: (i, el) => ((el as HTMLElement).classList.contains("hi") ? "#9db4ff" : "#f2f4f8"),
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: q(".so-manifesto")[0], start: "top 70%", end: "bottom 60%", scrub: 0.4 },
        }
      );

      /* Süreç: sabit telefon, üç adım. Kısa/yatay ekranda sabitleme yok, adımlar alt alta. */
      const steps = q(".so-step");
      const screens = q(".so-screen");
      const bars = q(".so-step-bar i");
      const setStep = (p: number) => {
        const idx = Math.min(2, Math.floor(p * 3));
        steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
        screens.forEach((s, i) => s.classList.toggle("is-on", i === idx));
        bars.forEach((b, i) => gsap.set(b, { scaleX: gsap.utils.clamp(0, 1, p * 3 - i) }));
      };
      const mm = gsap.matchMedia();
      mm.add("(min-height: 36rem)", () => {
        el.classList.add("is-pinned");
        setStep(0);
        ScrollTrigger.create({
          trigger: q(".so-process")[0],
          start: "top top",
          end: "+=200%",
          pin: q(".so-process-inner")[0],
          scrub: true,
          onUpdate: (self) => setStep(self.progress),
          onRefresh: (self) => setStep(self.progress),
        });
        return () => el.classList.remove("is-pinned");
      });
      mm.add("(max-height: 35.99rem)", () => {
        screens.forEach((s, i) => s.classList.toggle("is-on", i === 1));
      });

      /* Yatay kaydırma: sadece geniş ekran */
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

      /* Kapanış: dev başlık harf harf */
      const endTitle = q(".so-end h2")[0];
      const endSplit = SplitText.create(endTitle, { type: "chars", charsClass: "char" });
      gsap.from(endSplit.chars, { yPercent: 80, opacity: 0, stagger: 0.03, duration: 0.9, ease: "power4.out", scrollTrigger: { trigger: q(".so-end")[0], start: "top 70%" } });

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("load", refit);
        window.removeEventListener("resize", refit);
        split.revert();
        endSplit.revert();
        mm.revert();
      };
    },
    { scope: root }
  );

  const plus = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  return (
    <div className="so" ref={root}>
      <div className="so-grain" aria-hidden />

      <header className="so-header">
        <a href="#ust" className="so-brand">Serkan Oral</a>
        <a href={wa} className="so-pill so-pill-accent" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
      </header>

      {/* Mobil alt çubuk: sattığımız şeyin kendisi */}
      <nav className="so-dock" aria-label="Hızlı iletişim">
        <a href={wa} className="so-pill so-pill-accent" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
        <a href={`tel:+${WHATSAPP}`} className="so-pill so-pill-ghost">Ara</a>
      </nav>

      <section id="ust" className="so-hero">
        <div className="so-hero-grid" aria-hidden />
        <div className="so-glow" aria-hidden style={{ left: "20%", top: "10%" }} />
        <div className="so-portrait so-portrait-desktop">
          <Image src="/sites/serkan-oral/serkan.webp" alt="" width={900} height={900} priority sizes="(min-width: 60rem) 30vw, 6rem" />
        </div>
        <div className="so-wrap">
          <h1 className="so-hero-title">
            Serkan
            <br />
            Oral
          </h1>
          <div className="so-hero-bottom">
            <p className="so-cycle">
              <span className="so-cycle-win" aria-hidden>
                <span className="so-cycle-track">
                  {CYCLE.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </span>
              </span>
              <span className="so-sr">İşletmeniz</span> için site hazır. Siz daha istemeden.
            </p>
            <div className="so-hero-aside">
              <div className="so-portrait so-portrait-mobile">
                <Image src="/sites/serkan-oral/serkan.webp" alt="Serkan Oral" width={900} height={900} sizes="6rem" />
              </div>
              <p>
                Web sitesi olmayan işletmeler için siteyi önce yapıyor, sonra gösteriyorum. Beğenirseniz tek seferlik ücretle sizin; alan adı kurulumu dahil.
              </p>
            </div>
            <div className="so-hero-actions">
              <a href={wa} className="so-pill so-pill-accent so-pill-lg" target="_blank" rel="noreferrer">
                WhatsApp’tan yazın
              </a>
              <a href="#surec" className="so-pill so-pill-ghost so-pill-lg">Nasıl çalışıyor?</a>
            </div>
          </div>
        </div>
      </section>

      <section className="so-manifesto" aria-label="Kısaca">
        <div className="so-wrap">
          <p>
            {MANIFESTO.split(" ").map((w, i) => (
              <span key={i} className={`w${HIGHLIGHT.has(w) ? " hi" : ""}`}>
                {w}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </section>

      <section id="surec" className="so-process">
        <div className="so-process-inner">
          <div>
            <h2>Nasıl çalışıyor</h2>
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
          </div>
          <div className="so-phone-wrap">
            <div className="so-phone" aria-hidden>
              <div className="so-screen is-on">
                <div className="so-maps">
                  <div className="so-maps-map"><div className="so-maps-pin" /></div>
                  <div className="so-maps-card">
                    <b>Ocakbaşı Şahin</b>
                    <span className="stars">4,8 ★</span> · Ocakbaşı
                    <div className="row">Alsancak, İzmir · Açık</div>
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
                      <div className="u">ocakbasisahin.com</div>
                    </div>
                    Beğenirseniz sizin, beğenmezseniz Cuma kaldırıyorum.
                    <small>21:04 ✓✓</small>
                  </div>
                </div>
              </div>
            </div>
            <p className="so-phone-caption">Örnek: kurgusal bir işletme, gerçek akış.</p>
          </div>
        </div>
      </section>

      <section className="so-hs" aria-labelledby="olanlar">
        <div className="so-wrap so-hs-head">
          <h2 id="olanlar">Her sitede olanlar</h2>
          <p>Şablon değil, çalışan bir sistem. Aşağıdakiler her sitede hazır gelir.</p>
        </div>
        <div className="so-hs-viewport">
          <div className="so-hs-track">
            {CARDS.map((c, i) => (
              <article key={c.t} className="so-card">
                <span className="ix" aria-hidden>{String(i + 1).padStart(2, "0")} / 06</span>
                <div>
                  <h3>{c.t}</h3>
                  <p style={{ marginTop: "0.5rem" }}>{c.d}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="isler" className="so-works">
        <div className="so-wrap">
          <h2>Örnek çalışmalar</h2>
          <p className="lead">İki demo site. Açıp telefonunuzdan gezebilirsiniz; işletmelere giden siteler tam olarak böyle çalışır.</p>
          <div className="so-works-grid">
            <Link href="/ocakbasi-sahin" className="so-work" target="_blank">
              <Image src="/sites/serkan-oral/ocakbasi-sahin.webp" alt="Ocakbaşı restoranı için hazırlanan demo sitenin telefon görünümü" width={900} height={1800} sizes="(min-width: 48rem) 40vw, 90vw" />
              <figcaption>
                <span>Ocakbaşı Şahin<small>Restoran demosu · İzmir</small></span>
                <span className="open">Siteyi aç →</span>
              </figcaption>
            </Link>
            <Link href="/dishekimi-elif-yarar" className="so-work" target="_blank">
              <Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="Diş kliniği için hazırlanan demo sitenin telefon görünümü" width={900} height={1800} sizes="(min-width: 48rem) 40vw, 90vw" />
              <figcaption>
                <span>Dt. Elif Yarar<small>Klinik demosu · İstanbul</small></span>
                <span className="open">Siteyi aç →</span>
              </figcaption>
            </Link>
          </div>
        </div>
      </section>

      <section className="so-wrap so-faq" aria-labelledby="sss">
        <h2 id="sss">Sık sorulan sorular</h2>
        <div>
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}{plus}</summary>
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
            <a href={wa} className="so-pill so-pill-accent so-pill-lg" target="_blank" rel="noreferrer">WhatsApp’tan yazın</a>
            <a href={`tel:+${WHATSAPP}`} className="so-pill so-pill-ghost so-pill-lg">{PHONE}</a>
          </div>
          <footer className="so-footer">
            <span>© {year} Serkan Oral</span>
            <a href="https://fourpear.com.tr" target="_blank" rel="noreferrer">Tasarım: fourpear</a>
          </footer>
        </div>
      </section>
    </div>
  );
}
