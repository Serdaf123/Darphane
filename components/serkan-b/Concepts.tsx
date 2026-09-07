"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const options = [
  { name: "Portre", note: "İsim, portre ve boşluk. Kişisel tarafı önde." },
  { name: "Galeri", note: "Önce yapılan iş. Daha sakin, portfolyo odaklı." },
  { name: "Afiş", note: "Büyük tipografi, güçlü renk alanı. Daha deneysel." },
];
const wa = `https://wa.me/905078463929?text=${encodeURIComponent("Merhaba Serkan, işletmem için site istiyorum.\nİşletme adı: \nŞehir: ")}`;

function ContactLink({ className = "" }: { className?: string }) {
  return <a className={`concept-contact ${className}`} href={wa} target="_blank" rel="noreferrer">WhatsApp’tan yazın <ArrowUpRight size={21} strokeWidth={1.5} aria-hidden="true" /></a>;
}
function Header() {
  return <header className="concept-header"><a className="concept-logo" href="#concept-top">Serkan Oral<span>fourpear</span></a><nav aria-label="Site menüsü"><a href="#concept-demos">Örnek işler</a><ContactLink /></nav></header>;
}
function Portrait() {
  return <section className="portrait-hero" aria-labelledby="portrait-heading">
    <div className="portrait-heading-wrap"><h1 id="portrait-heading">Serkan Oral</h1></div>
    <div className="portrait-stage">
      <div className="portrait-intro"><p>İşletmeniz için<br />web siteleri<br />tasarlıyorum.</p><span>Önce görün.<br />Sonra karar verin.</span></div>
      <div className="portrait-photo"><div className="portrait-oval" aria-hidden="true" /><Image src="/sites/serkan-oral-b/serkan.webp" alt="Serkan Oral" width={900} height={900} sizes="(max-width: 700px) 95vw, 560px" preload /></div>
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
    <div className="poster-lower"><div className="poster-note"><p>Bir sunum değil,<br />açıp bakacağınız<br />bir web sitesi.</p><a href="#concept-demos">Demo çalışmaları görün <ArrowDown size={18} aria-hidden="true" /></a></div><div className="poster-signature"><Image src="/sites/serkan-oral-b/serkan.webp" width={900} height={900} alt="Serkan Oral" sizes="150px" /><span>Ben Serkan.<br />Tanışalım.</span></div><a className="poster-circle" href={wa} target="_blank" rel="noreferrer"><ArrowUpRight size={42} strokeWidth={1.2} aria-hidden="true" /><span>WhatsApp’tan<br />yazın</span></a></div>
  </section>;
}

export function Concepts() {
  const [selected, setSelected] = useState(0);
  return <div className="concepts">
    <a className="concept-skip" href="#concept-top">İçeriğe geç</a>
    <div className="concept-picker"><div><strong>Üç farklı yön</strong><span>Aynı renkler. Farklı karakter.</span></div><div className="concept-options" role="group" aria-label="Açılış tasarımı seçimi">{options.map((option, index) => <button key={option.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}><span>0{index+1}</span>{option.name}</button>)}</div></div>
    <main id="concept-top" className={`concept-page direction-${selected}`}>
      <Header />
      <div key={selected} className="concept-entrance">{selected === 0 ? <Portrait /> : selected === 1 ? <Gallery /> : <Poster />}</div>
    </main>
    <aside className="concept-rationale" aria-live="polite"><span>{options[selected].name}</span><p>{options[selected].note}</p><span>Açılış tasarımı denemesi</span></aside>
    <section className="concept-demo-list" id="concept-demos" aria-labelledby="demo-heading"><h2>Demolara yakından bakın.</h2><p>İki örnek site. Gerçek müşteri çalışması değil.</p><div><a href="/ocakbasi-sahin" target="_blank" rel="noreferrer">Ocakbaşı Şahin <ArrowUpRight size={23} aria-hidden="true" /></a><a href="/dishekimi-elif-yarar" target="_blank" rel="noreferrer">Dt. Elif Yarar <ArrowUpRight size={23} aria-hidden="true" /></a></div></section>
    <footer className="concept-footer"><span>Serkan Oral / fourpear</span><a href="tel:+905078463929">0507 846 39 29</a><ContactLink /></footer>
  </div>;
}
