import type { SVGProps } from "react";
import Image from "next/image";
import { FEATURES, FAQ, STEPS } from "./content";

const wa = `https://wa.me/905078463929?text=${encodeURIComponent("Merhaba Serkan, işletmem için site istiyorum.\nİşletme adı: \nŞehir: ")}`;

type IconProps = SVGProps<SVGSVGElement> & { size?: number };
function ArrowUpRight({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" {...props}><path d="M5 19 19 5M5 5h14v14" /></svg>;
}
function ArrowDown({ size = 24, strokeWidth = 1.5, ...props }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" {...props}><path d="M12 4v16M5 13l7 7 7-7" /></svg>;
}
function ContactLink({ className = "" }: { className?: string }) {
  return <a className={`concept-contact ${className}`} href={wa} target="_blank" rel="noreferrer">WhatsApp’tan yazın <ArrowUpRight size={21} strokeWidth={1.5} aria-hidden="true" /></a>;
}
function Header() {
  return <header className="concept-header"><a className="concept-logo" href="#concept-top">Serkan Oral<span>fourpear</span></a><nav aria-label="Site menüsü"><a href="#concept-process">Nasıl çalışıyor?</a><a href="#concept-demos">Örnek işler</a><ContactLink /></nav></header>;
}
function Portrait() {
  return <section className="portrait-hero" aria-labelledby="portrait-heading">
    <div className="portrait-heading-wrap"><h1 id="portrait-heading">Serkan Oral</h1></div>
    <div className="portrait-stage">
      <div className="portrait-intro"><p>İşletmeniz için<br />web siteleri<br />tasarlıyorum.</p><span>Önce görün.<br />Sonra karar verin.</span></div>
      <div className="portrait-photo"><div className="portrait-oval" aria-hidden="true" /><Image src="/sites/serkan-oral/serkan.webp" alt="Serkan Oral" width={900} height={900} sizes="(max-width: 700px) 95vw, 560px" priority /></div>
      <div className="portrait-action"><span>Bir işletmeniz var.<br />Bir de sitesi olsun.</span><ContactLink /><a className="portrait-down" href="#concept-demos" aria-label="Demo çalışmalarına git"><ArrowDown size={26} strokeWidth={1.25} aria-hidden="true" /></a></div>
    </div>
    <div className="portrait-foot"><span>Web tasarımı & geliştirme</span><span>Tek seferlik ücret. Alan adı kurulumu dahil.</span></div>
  </section>;
}
function Gallery() {
  return <section className="gallery-hero" aria-labelledby="gallery-heading">
    <div className="gallery-intro"><h1 id="gallery-heading">Anlatmak<br />yerine,<br />göstereyim.</h1><div><p>Ben Serkan. İşletmeniz için siteyi hazırlıyor, linkini gönderiyorum. Beğenirseniz sizin.</p><ContactLink /></div></div>
    <div className="gallery-exhibit">
      <a className="gallery-main" href="/ocakbasi-sahin" target="_blank" rel="noreferrer"><div className="gallery-art"><div className="gallery-art-type" aria-hidden="true">Ateşin<br />başında.</div><Image src="/sites/serkan-oral/ocakbasi-sahin-ekran.webp" alt="Ocakbaşı Şahin restoran demo sitesinin önizlemesi" width={800} height={1760} sizes="(max-width: 700px) 55vw, 270px" /></div><div className="gallery-caption"><span>Ocakbaşı Şahin<small>Restoran için demo</small></span><ArrowUpRight aria-label="Demoyu aç" size={25} strokeWidth={1.25} /></div></a>
      <a className="gallery-secondary" href="/dishekimi-elif-yarar" target="_blank" rel="noreferrer"><div className="gallery-small-art"><Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="Dt. Elif Yarar klinik demo sitesinin önizlemesi" width={900} height={1800} sizes="(max-width: 700px) 40vw, 200px" /></div><div className="gallery-caption"><span>Dt. Elif Yarar<small>Klinik için demo</small></span><ArrowUpRight aria-label="Demoyu aç" size={22} strokeWidth={1.25} /></div></a>
    </div>
    <p className="gallery-disclosure">Bu çalışmalar tanıtım için hazırlanmış demolardır.</p>
  </section>;
}
function Poster() {
  return <section className="poster-hero" aria-labelledby="poster-heading">
    <div className="poster-meta"><span>Serkan Oral / Web tasarımı</span><span>İşletmeniz için.</span></div>
    <h1 id="poster-heading"><span>Önce site.</span><span>Sonra karar.</span></h1>
    <div className="poster-lower"><div className="poster-note"><p>Bir sunum değil,<br />açıp bakacağınız<br />bir web sitesi.</p><a href="#concept-demos">Demo çalışmaları görün <ArrowDown size={18} aria-hidden="true" /></a></div><div className="poster-signature"><Image src="/sites/serkan-oral/serkan.webp" width={900} height={900} alt="Serkan Oral" sizes="150px" /><span>Ben Serkan.<br />Tanışalım.</span></div><a className="poster-circle" href={wa} target="_blank" rel="noreferrer"><ArrowUpRight size={42} strokeWidth={1.2} aria-hidden="true" /><span>WhatsApp’tan<br />yazın</span></a></div>
  </section>;
}


function Process() {
  return <section className="finished-process finished-section" id="concept-process" aria-labelledby="process-title">
    <div className="finished-heading"><h2 id="process-title">Site önce,<br />karar sonra.</h2><p>İşletmenizin sitesini siz istemeden yapıyorum. Linkini gönderiyorum. Beğenirseniz tek seferlik ücretle sizin; beğenmezseniz kaldırıyorum.</p></div>
    <ol className="finished-steps">{STEPS.map((step, i) => <li key={step.t}><span aria-hidden="true">0{i + 1}</span><div><h3>{step.t}</h3><p>{step.d}</p></div></li>)}</ol>
  </section>;
}
function Features() {
  return <section className="finished-features finished-section" aria-labelledby="features-title"><div className="finished-heading"><h2 id="features-title">Her sitede<br />olanlar.</h2></div><div className="finished-feature-grid">{FEATURES.map(item => <article key={item.t}><h3>{item.t}</h3><p>{item.d}</p></article>)}</div></section>;
}
function WorkSamples() {
  return <section className="finished-works finished-section" id="concept-demos" aria-labelledby="works-title"><div className="finished-heading"><h2 id="works-title">Örnek<br />çalışmalar.</h2><p>İki demo site. Tanıtım amaçlı hazırlanmıştır; gerçek müşteri çalışması değildir.</p></div><div className="finished-work-grid">
    <a href="/ocakbasi-sahin" target="_blank" rel="noreferrer"><div className="finished-work-image finished-work-food"><Image src="/sites/serkan-oral/ocakbasi-sahin.webp" alt="Ocakbaşı Şahin restoran demo sitesinin telefon görünümü" width={900} height={1800} sizes="(max-width: 700px) 70vw, 340px" /></div><div className="finished-work-label"><div><h3>Ocakbaşı Şahin</h3><p>Restoran demosu · İzmir</p></div><ArrowUpRight /></div></a>
    <a href="/dishekimi-elif-yarar" target="_blank" rel="noreferrer"><div className="finished-work-image finished-work-clinic"><Image src="/sites/serkan-oral/dishekimi-elif-yarar.webp" alt="Dt. Elif Yarar klinik demo sitesinin telefon görünümü" width={900} height={1800} sizes="(max-width: 700px) 70vw, 340px" /></div><div className="finished-work-label"><div><h3>Dt. Elif Yarar</h3><p>Klinik demosu · İstanbul</p></div><ArrowUpRight /></div></a>
  </div></section>;
}
function Questions() {
  return <section className="finished-faq finished-section" aria-labelledby="faq-title"><div className="finished-heading"><h2 id="faq-title">Sık sorulan<br />sorular.</h2></div><div>{FAQ.map(([question, answer]) => <details key={question}><summary>{question}<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5v14" /></svg></summary><p>{answer}</p></details>)}</div></section>;
}
function Closing() {
  return <section className="finished-closing" id="concept-contact" aria-labelledby="contact-title"><h2 id="contact-title">Bir mesaj<br />yeter.</h2><div><p>İşletmenizin adını ve şehrini yazın; siteyi hazırlayıp linkini WhatsApp’tan gönderirim.</p><ContactLink /><a className="finished-phone" href="tel:+905078463929">0507 846 39 29</a></div></section>;
}
export type ConceptVariant = "portre" | "galeri" | "afis";
export function Concepts({ variant }: { variant: ConceptVariant }) {
  return <div className={`concepts direction-${variant}`}>
    <a className="concept-skip" href="#concept-top">İçeriğe geç</a>
    <Header />
    <main id="concept-top" className="concept-page">
      <div className="concept-entrance">{variant === "portre" ? <Portrait /> : variant === "galeri" ? <Gallery /> : <Poster />}</div>
      <Process /><Features /><WorkSamples /><Questions /><Closing />
    </main>
    <footer className="concept-footer"><span>Serkan Oral / fourpear</span><a href="tel:+905078463929">0507 846 39 29</a><ContactLink /></footer>
    <nav className="finished-dock" aria-label="Hızlı iletişim"><ContactLink /><a href="tel:+905078463929">Ara</a></nav>
  </div>;
}
