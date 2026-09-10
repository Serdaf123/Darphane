import Link from "next/link";
import { FONT_PAIRINGS as FONT_DEFS } from "@/lib/fonts";
import { loadRecipes } from "@/lib/recipe";
import { FONT_PAIRINGS, HEADER_STYLES, HERO_MOTIONS, SCROLL_MOTIONS, THEME_PRESETS, siteSchema } from "@/lib/schema";
import { getSite, listSiteSlugs } from "@/lib/sites";
import { themeStyle } from "@/lib/theme";
import { FabDemo, HeroDemo, ScrollDemo } from "./demos";

export const dynamic = "force-dynamic";

const DEFAULT_SITE = "adraga-veteriner";

const HERO_NOTES: Record<(typeof HERO_MOTIONS)[number], string> = {
  rise: "Metinler alttan sırayla yükselir, görsel hafif yaklaşır. Varsayılan.",
  reveal: "Satırlar maskeden çıkar; görsel yavaşça küçülür. Ağırbaşlı.",
  blur: "Bulanıktan netleşir. Sakin, klinik ve spa.",
  curtain: "Perde yukarı kalkar, sonra metin gelir. Otel, manzara.",
  zoom: "Görsel içeriden dışa açılır. Restoran, vitrin.",
  split: "Başlık harf harf, paragraf kelime kelime (GSAP). Afiş.",
  stack: "Rozet → başlık → alt satır → buton, üç kısa adım. Mobil için.",
  counter: "Telefon numarası rakam rakam belirir. 7/24 acil.",
  none: "Hareket yok; sayfa anında durağan.",
};
const SCROLL_NOTES: Record<(typeof SCROLL_MOTIONS)[number], string> = {
  rise: "Alttan yükselerek belirir. Varsayılan.",
  fade: "Yalnız saydamlık; en sakin.",
  slide: "Soldan kayar. Enerjik.",
  scale: "Hafif büyüyerek gelir. Ürün kartları.",
  none: "Kaydırma animasyonu yok.",
};
const HEADER_NOTES: Record<(typeof HEADER_STYLES)[number], string> = {
  glass: "Hero görselinin üstünde saydam, kaydırınca buzlu cam.",
  solid: "Her zaman dolu zemin.",
  minimal: "Yalnız isim + tek buton, menü yok.",
  none: "Header yok; afiş tarzı.",
};

export default function KutuphanePage() {
  const recipes = loadRecipes();
  const slugs = listSiteSlugs();
  const sample = slugs.includes(DEFAULT_SITE) ? DEFAULT_SITE : slugs[0];
  const sites = slugs.map((slug) => ({ slug, name: getSite(slug)?.business.name ?? slug }));
  const theme = (preset: (typeof THEME_PRESETS)[number], extra: Record<string, unknown> = {}) =>
    themeStyle(siteSchema.shape.theme.parse({ preset, ...extra }));
  const business = siteSchema.shape.business.parse({ name: "Örnek İşletme", category: "Demo", phone: "0532 000 00 00", whatsapp: "905320000000" });
  const phoneOnly = siteSchema.shape.business.parse({ name: "Örnek İşletme", category: "Demo", phone: "0216 000 00 00" });
  const heroThemes = ["ember", "cobalt", "sage", "midnight", "bosphorus", "graphite", "ink", "sand", "porcelain"] as const;

  return (
    <div className={`lib ${FONT_DEFS.clean.className}`}>
      <div className="lib-wrap">
        <header className="lib-top">
          <h1>Tasarım kütüphanesi</h1>
          <nav aria-label="Bölümler">
            <a href="#receteler">Reçeteler</a>
            <a href="#hero">Hero girişi</a>
            <a href="#kaydirma">Kaydırma</a>
            <a href="#buton">Yüzen buton</a>
            <a href="#header">Header</a>
            <a href="#palet">Palet ve font</a>
          </nav>
        </header>
        <p className="lib-intro">
          Motorun bütün kombinasyonları tek yerde. <strong>Reçete</strong> = hero düzeni + giriş animasyonu + bölüm sırası ve düzenleri + iletişim deseni + header + tipografi.
          Her reçete gerçek bir siteye uygulanmış halde açılır; sayfanın üstündeki çubuktan hero girişi, kaydırma animasyonu, buton ve header anında değiştirilir.
          Kaynak: <code>data/recipes/*.json</code> ve <code>docs/tasarim-kutuphanesi.md</code>.
        </p>

        <h2 id="receteler">Reçeteler</h2>
        <p>Telefon önizlemesi örnek siteyle çizilir. Aile etiketi: mode · öncelik · iletişim. A ve B aynı aileden olamaz.</p>
        <div className="lib-grid">
          {recipes.map((r) => {
            const t = r.theme;
            const hero = r.sections[0];
            const open = `/kutuphane/${r.key}?site=${sample}`;
            return (
              <article key={r.key} className="lib-recipe">
                <div>
                  <h3>{r.name}</h3>
                  <span className="fam">{r.family}</span>
                  <p className="world">{r.world}</p>
                  <p className="fits">Uyar: {r.fits.join(", ")}</p>
                  <ul className="lib-chips" aria-label="Tema">
                    <li>{t.preset} · {t.mode}</li>
                    <li>{t.fonts} / {t.headingFont}</li>
                    <li>hero {hero.variant}{hero.urgent ? " + acil" : ""}</li>
                    <li>giriş {t.motion.hero} · kaydırma {t.motion.scroll}</li>
                    <li>header {t.header}</li>
                    <li>{t.contact} · {t.fabStyle}</li>
                    <li>köşe {t.radius} · {t.density}</li>
                  </ul>
                  <div className="lib-links">
                    <Link href={open} className="primary">Tam sayfa aç</Link>
                    <a href={`${open}&frame=1`} target="_blank" rel="noopener">Yeni sekmede</a>
                  </div>
                </div>
                <div className="lib-phone" aria-hidden>
                  <iframe src={`${open}&frame=1`} title={`${r.name} önizleme`} loading="lazy" tabIndex={-1} />
                </div>
              </article>
            );
          })}
        </div>
        <ul className="lib-sites" aria-label="Örnek site">
          {sites.map((s) => (
            <li key={s.slug}>
              <Link href={`/kutuphane/${recipes[0]?.key ?? "vitrin"}?site=${s.slug}`}>{s.name}</Link>
            </li>
          ))}
        </ul>

        <h2 id="hero">Hero giriş animasyonları</h2>
        <p>Sayfa açılınca bir kez oynar; CSS ile çalışır, LCP&apos;yi beklemez. &quot;Hareketi azalt&quot; açıkken hepsi kapalıdır.</p>
        <div className="lib-demos">
          {HERO_MOTIONS.filter((m) => m !== "none").map((m, i) => (
            <div key={m} className="lib-demo-card">
              <h3>{m}</h3>
              <p className="note">{HERO_NOTES[m]}</p>
              <HeroDemo preset={m} style={theme(heroThemes[i % heroThemes.length])} title="Esatpaşa Veteriner" />
            </div>
          ))}
        </div>

        <h2 id="kaydirma">Kaydırma animasyonları</h2>
        <p>Bölümler görünür alana girince bir kez belirir. Yalnız transform + opacity; yerleşim oynamaz.</p>
        <div className="lib-demos">
          {SCROLL_MOTIONS.filter((m) => m !== "none").map((m, i) => (
            <div key={m} className="lib-demo-card">
              <h3>{m}</h3>
              <p className="note">{SCROLL_NOTES[m]}</p>
              <ScrollDemo preset={m} style={theme(heroThemes[(i + 3) % heroThemes.length])} />
            </div>
          ))}
        </div>

        <h2 id="buton">Yüzen iletişim butonu</h2>
        <p>Noyavet&apos;te kullanılan ikon animasyonu &quot;dial&quot;: dokununca WhatsApp ve Ara yay efektiyle yukarı açılır. &quot;pill&quot; yana uzar. Tek numara varsa buton doğrudan arar.</p>
        <div className="lib-demos">
          <div className="lib-demo-card">
            <h3>dial</h3>
            <p className="note">Yukarı açılan hızlı arama, yeşil; ilk açılışta üç kez nabız.</p>
            <FabDemo fab="dial" style={theme("porcelain", { accent: "#1f7a6d" })} business={business} />
          </div>
          <div className="lib-demo-card">
            <h3>pill</h3>
            <p className="note">Sola uzayan hap, tema renginde; editoryal sayfalar.</p>
            <FabDemo fab="pill" style={theme("porcelain", { accent: "#b5123f" })} business={business} />
          </div>
          <div className="lib-demo-card">
            <h3>tek eylem</h3>
            <p className="note">WhatsApp yoksa (sabit hat) etiketli tek buton: Ara.</p>
            <FabDemo fab="dial" style={theme("sand", { accent: "#a4161a" })} business={phoneOnly} />
          </div>
        </div>

        <h2 id="header">Header stilleri ve hero düzenleri</h2>
        <p>Tam sayfada dene: reçete sayfasının üst çubuğundan header değişir; hero düzeni reçeteden gelir (image, split, minimal, statement).</p>
        <ul className="lib-chips">
          {HEADER_STYLES.map((h) => (
            <li key={h}><Link href={`/kutuphane/${recipes[0]?.key ?? "vitrin"}?site=${sample}&header=${h}`}>{h}</Link> — {HEADER_NOTES[h]}</li>
          ))}
        </ul>

        <h2 id="palet">Paletler ve font çiftleri</h2>
        <p>Preset paleti ya da tek vurgu renginden OKLCH ile üretilen palet (kontrast garantili). Fontlar sektöre göre seçilir.</p>
        <div className="lib-swatches">
          {THEME_PRESETS.map((p) => (
            <div key={p} className="lib-swatch" style={theme(p)}>
              <div className="top">
                <span style={{ background: "var(--c-bg)" }} />
                <span style={{ background: "var(--c-surface)" }} />
                <span style={{ background: "var(--c-text)" }} />
                <span style={{ background: "var(--c-accent)" }} />
              </div>
              <div className="name">{p}<small>zemin · yüzey · metin · vurgu</small></div>
            </div>
          ))}
        </div>
        <div className="lib-fonts" style={{ marginTop: "1rem" }}>
          {FONT_PAIRINGS.map((k) => (
            <div key={k} className={`lib-font ${FONT_DEFS[k].className}`}>
              <div className="d" style={{ fontFamily: FONT_DEFS[k].display }}>Esatpaşa Veteriner</div>
              <div className="s" style={{ fontFamily: FONT_DEFS[k].sans }}>Haftanın yedi günü 24 saat açık nöbetçi klinik.</div>
              <div className="k">{k} · {FONT_DEFS[k].note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
