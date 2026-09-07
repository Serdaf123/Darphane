import Link from "next/link";
import { formatPrice, purchaseUrl } from "@/lib/offer";
import type { Site } from "@/lib/schema";
import type { DomainCandidate } from "@/lib/domains";

/**
 * /[slug]/teklif — "Peki ne alıyorum?" sayfası. Sitenin değil bizim dilimizle:
 * teklif şeridiyle aynı koyu zemin, yeşil eylem rengi. Karar burada verilir.
 */

const BG = "#0f1115";
const CARD = "#171a20";
const LINE = "#262a33";
const FG = "#f5f6f7";
const MUTED = "#9aa1ad";
const GREEN = "#22c55e";

const INCLUDED = [
  ["Tek sayfa, telefonda önce", "Müşteriniz sizi telefondan buluyor; site önce telefon ekranı için tasarlandı, hızlı açılır."],
  ["Ara · WhatsApp · Yol tarifi", "Ekranın altında her zaman duran üç düğme. Form doldurmak yok; mesaj doğrudan WhatsApp'ınıza düşer."],
  ["Google yorumlarınız ve puanınız", "Haritalar'daki yorumlarınız sitede; açık/kapalı durumu çalışma saatlerinize göre canlı görünür."],
  ["Alan adı ve SSL", "ornek.com sizin adınıza alınır, bağlanır; kilit simgesi ve WhatsApp'ta link önizleme görseli hazır."],
  ["Google'a kayıt", "Satıştan sonra site arama motorlarına açılır; işletme bilgileriniz Google'ın anladığı biçimde işaretlenir."],
  ["Bilgi güncellemeleri", "Telefon, saat, fiyat gibi bilgiler değişince yazmanız yeterli; güncellerim."],
] as const;

const STEPS = [
  ["Beğenin", "Siteyi telefonunuzdan açın, gezin. Değişiklik istediğiniz yer varsa yazın; satın almadan önce düzeltirim."],
  ["Ödeyin", "Tek seferlik ücret. Ödeme linkinden kartla ya da havaleyle; fatura kesilir."],
  ["Yayına girsin", "1 iş günü içinde alan adı sizin adınıza alınır, site ona bağlanır ve Google'a açılır. Alan adı sizin mülkünüzdür."],
] as const;

const FAQ = [
  ["Aylık ücret var mı?", "Yok. Tek seferlik ödeme; barındırma ve SSL ilk yıl dahildir. Sonraki yıllar alan adı yenileme ücreti (yıllık, alan adı şirketine) sizin adınıza ödenir; istersen ben takip ederim."],
  ["Siteyi beğendim ama değişiklik istiyorum.", "Satın almadan önce de değişiklik isteyebilirsiniz. Yazın; düzeltip aynı linkten gösteririm."],
  ["Kendi fotoğraflarımı koyabilir misiniz?", "Evet. Satıştan sonra WhatsApp'tan gönderin, aynı gün yerleştiririm."],
  ["Alan adı kimin üzerine olur?", "Sizin. Alan adı sizin adınıza alınır; siteyi ileride başka yere taşımak isterseniz engel yok."],
  ["Süre dolarsa ne olur?", "Site yayından kalkar, hiçbir yükümlülük doğmaz. Sonradan isterseniz yeniden açabiliriz."],
  ["Fatura kesiliyor mu?", "Evet, fourpear tarafından e-fatura/e-arşiv fatura kesilir."],
] as const;

function deadlineText(iso?: string): { date: string; daysLeft: number } | null {
  if (!iso) return null;
  const d = new Date(iso);
  const days = Math.ceil((d.getTime() - Date.now()) / 86_400_000);
  return {
    date: d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", weekday: "long" }),
    daysLeft: days,
  };
}

export function OfferPage({ site, domains, variant }: { site: Site; domains: DomainCandidate[]; variant?: "a" | "b" }) {
  const { slug, business, offer } = site;
  const price = formatPrice(offer);
  const wa = purchaseUrl(offer, business.name, variant);
  const deadline = deadlineText(offer.expiresAt);
  const siteHref = variant === "b" ? `/${slug}/b` : `/${slug}`;

  return (
    <main style={{ minHeight: "100dvh", background: BG, color: FG, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif", lineHeight: 1.55 }}>
      <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "1.25rem 1.25rem 4rem" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", fontSize: "0.875rem", color: MUTED }}>
          <span>{offer.seller?.name ?? "fourpear"} · teklif</span>
          <Link href={siteHref} style={{ color: FG, textDecoration: "none", border: `1px solid ${LINE}`, borderRadius: "999px", padding: "0.4rem 0.9rem" }}>
            Siteye dön
          </Link>
        </header>

        <section style={{ marginTop: "2.5rem" }}>
          <h1 style={{ fontSize: "clamp(1.9rem, 6vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0 }}>
            {business.name} için hazırlanan site sizin olsun.
          </h1>
          <p style={{ color: MUTED, marginTop: "1rem", fontSize: "1.05rem" }}>
            Site şu an canlı. Beğenirseniz tek seferlik ücretle sizin olur, alan adı ve kurulum dahil.
            {deadline ? ` Beğenmezseniz ${deadline.date} günü yayından kaldırıyorum.` : ""}
          </p>
          <p style={{ color: MUTED, marginTop: "0.75rem", fontSize: "0.9375rem" }}>
            Bu önizleme talep edilmeden, Google Haritalar’daki açık işletme bilgilerinizle hazırlandı; hiçbir borç ya da yükümlülük doğurmaz. İstemezseniz WhatsApp’tan “hayır” yazmanız yeterli: site kaldırılır, bilgileriniz silinir, bir daha yazılmaz.
          </p>

          <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))" }}>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: "14px", padding: "1.1rem 1.25rem" }}>
              <div style={{ fontSize: "0.8125rem", color: MUTED }}>Tek seferlik ücret</div>
              <div style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{price ?? "Sorun"}</div>
              <div style={{ fontSize: "0.8125rem", color: MUTED }}>Alan adı + kurulum + ilk yıl barındırma dahil</div>
            </div>
            {deadline ? (
              <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: "14px", padding: "1.1rem 1.25rem" }}>
                <div style={{ fontSize: "0.8125rem", color: MUTED }}>Son gün</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, lineHeight: 1.2 }}>{deadline.date}</div>
                <div style={{ fontSize: "0.8125rem", color: deadline.daysLeft <= 2 ? "#fbbf24" : MUTED }}>
                  {deadline.daysLeft > 0 ? `${deadline.daysLeft} gün kaldı` : "bugün son"}
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
            {offer.paymentUrl ? (
              <a href={offer.paymentUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: GREEN, color: "#07130b", fontWeight: 700 }}>
                Ödemeye Geç
              </a>
            ) : null}
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: offer.paymentUrl ? "transparent" : GREEN, color: offer.paymentUrl ? FG : "#07130b", border: offer.paymentUrl ? `1px solid ${LINE}` : undefined, fontWeight: 700 }}>
                {offer.paymentUrl ? "WhatsApp'tan Sor" : "WhatsApp'tan Satın Al"}
              </a>
            ) : null}
          </div>
        </section>

        {offer.packages && offer.packages.length > 0 ? (
          <section style={{ marginTop: "3rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>Paketler</h2>
            <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: `repeat(auto-fit, minmax(14rem, 1fr))` }}>
              {offer.packages.map((pk) => {
                const pay = pk.paymentUrl ?? offer.paymentUrl;
                const waPk = offer.seller
                  ? `https://wa.me/${offer.seller.whatsapp}?text=${encodeURIComponent(`Merhaba, ${business.name} için "${pk.name}" paketini istiyorum (${pk.price.toLocaleString("tr-TR")} ₺).`)}`
                  : undefined;
                return (
                  <div key={pk.name} style={{ background: CARD, border: `1px solid ${pk.featured ? GREEN : LINE}`, borderRadius: "14px", padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{pk.name}</div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{pk.price.toLocaleString("tr-TR")} ₺</div>
                      <div style={{ fontSize: "0.8125rem", color: MUTED }}>tek seferlik</div>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.35rem", fontSize: "0.9375rem" }}>
                      {pk.includes.map((i) => (
                        <li key={i} style={{ display: "flex", gap: "0.5rem" }}>
                          <span aria-hidden style={{ color: GREEN }}>✓</span>
                          <span>{i}</span>
                        </li>
                      ))}
                    </ul>
                    <div style={{ marginTop: "auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {pay ? (
                        <a href={pay} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: GREEN, color: "#07130b", fontWeight: 700, padding: "0.6rem 1rem", fontSize: "0.9rem" }}>
                          Ödemeye Geç
                        </a>
                      ) : null}
                      {waPk ? (
                        <a href={waPk} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: pay ? "transparent" : GREEN, color: pay ? FG : "#07130b", border: pay ? `1px solid ${LINE}` : undefined, fontWeight: 700, padding: "0.6rem 1rem", fontSize: "0.9rem" }}>
                          {pay ? "Sor" : "Bu paketi istiyorum"}
                        </a>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}

        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>Ne dahil</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
            {INCLUDED.map(([t, d]) => (
              <li key={t} style={{ display: "grid", gridTemplateColumns: "1.5rem 1fr", gap: "0.75rem", alignItems: "start" }}>
                <span aria-hidden style={{ width: "1.5rem", height: "1.5rem", borderRadius: "50%", background: "rgba(34,197,94,.18)", color: GREEN, display: "grid", placeItems: "center", fontSize: "0.9rem", fontWeight: 700 }}>✓</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{t}</div>
                  <div style={{ color: MUTED, fontSize: "0.9375rem" }}>{d}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {domains.length > 0 ? (
          <section style={{ marginTop: "3rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Alan adı</h2>
            <p style={{ color: MUTED, margin: "0 0 1rem", fontSize: "0.9375rem" }}>Sizin adınıza alınır. Adaylar ve şu anki durum:</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
              {domains.map((d) => (
                <li key={d.domain} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", background: CARD, border: `1px solid ${LINE}`, borderRadius: "10px", padding: "0.7rem 1rem", fontVariantNumeric: "tabular-nums" }}>
                  <span style={{ fontWeight: 600 }}>{d.domain}</span>
                  <span style={{ color: d.status === "available" ? GREEN : d.status === "taken" ? "#f87171" : MUTED, fontSize: "0.9rem" }}>
                    {d.status === "available" ? "müsait" : d.status === "taken" ? "alınmış" : d.whois ? <a href={d.whois} target="_blank" rel="noreferrer" style={{ color: MUTED }}>sorgula</a> : "kontrol edilemedi"}
                  </span>
                </li>
              ))}
            </ul>
            <p style={{ color: MUTED, margin: "0.75rem 0 0", fontSize: "0.8125rem" }}>Başka bir ad isterseniz yazın; müsaitliğine birlikte bakarız.</p>
          </section>
        ) : null}

        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>Nasıl olur</h2>
          <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: "0.75rem" }}>
            {STEPS.map(([t, d], i) => (
              <li key={t} style={{ display: "grid", gridTemplateColumns: "2rem 1fr", gap: "0.75rem", alignItems: "start" }}>
                <span aria-hidden style={{ width: "2rem", height: "2rem", borderRadius: "50%", border: `1px solid ${LINE}`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: "0.9rem" }}>{i + 1}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{t}</div>
                  <div style={{ color: MUTED, fontSize: "0.9375rem" }}>{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section style={{ marginTop: "3rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem" }}>Sorular</h2>
          <div>
            {FAQ.map(([q, a]) => (
              <details key={q} style={{ borderTop: `1px solid ${LINE}`, padding: "0.75rem 0" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>{q}</summary>
                <p style={{ color: MUTED, margin: "0.5rem 0 0", fontSize: "0.9375rem" }}>{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section style={{ marginTop: "3rem", background: CARD, border: `1px solid ${LINE}`, borderRadius: "14px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>Karar vermek için yazın</h2>
          <p style={{ color: MUTED, margin: "0 0 1rem", fontSize: "0.9375rem" }}>
            Soru, değişiklik isteği ya da onay; hepsi WhatsApp’tan. {offer.seller?.name ?? "fourpear"} · {offer.seller?.whatsapp ? `0${offer.seller.whatsapp.slice(2, 5)} ${offer.seller.whatsapp.slice(5, 8)} ${offer.seller.whatsapp.slice(8, 10)} ${offer.seller.whatsapp.slice(10)}` : ""}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {wa ? (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: GREEN, color: "#07130b", fontWeight: 700 }}>
                WhatsApp’tan Yazın
              </a>
            ) : null}
            <Link href={siteHref} className="btn" style={{ background: "transparent", color: FG, border: `1px solid ${LINE}` }}>
              Siteyi tekrar aç
            </Link>
          </div>
          <dl style={{ margin: "1.25rem 0 0", display: "grid", gridTemplateColumns: "max-content 1fr", gap: "0.25rem 1rem", fontSize: "0.8125rem", color: MUTED }}>
            <dt>Gönderen</dt>
            <dd style={{ margin: 0 }}>Serkan Oral · {offer.seller?.name ?? "fourpear"}</dd>
            <dt>Telefon</dt>
            <dd style={{ margin: 0 }}>{offer.seller?.whatsapp ? `+${offer.seller.whatsapp}` : "—"}</dd>
            <dt>Web</dt>
            <dd style={{ margin: 0 }}>serkanoral.com.tr</dd>
          </dl>
        </section>
      </div>
    </main>
  );
}
