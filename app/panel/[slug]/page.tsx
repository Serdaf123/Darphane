import Link from "next/link";
import { notFound } from "next/navigation";
import { readSite, listAllFiles, storeMode } from "@/lib/store";
import { OFFER_STATUSES } from "@/lib/schema";
import { STATUS_META, effectiveStatus, formatPriceNumber, formatTr, pitchText, timeLeft, toLocalInput } from "@/lib/panel";
import { purchaseUrl } from "@/lib/offer";
import { saveOffer, quickAction, declineAndDelete } from "./actions";
import { CopyButton } from "./CopyButton";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ok?: string; hata?: string; commit?: string; url?: string }>;
};

/** Tek site: teklif alanları, hızlı işlemler, linkler, gönderim metni. */
export default async function SitePanelPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { ok, hata, commit, url } = await searchParams;
  const [found, files] = await Promise.all([readSite(slug), listAllFiles()]);
  if (!found) notFound();
  const { site } = found;
  const st = effectiveStatus(site);
  const hasB = files.includes(`${slug}.b.json`);
  const hasEn = files.includes(`${slug}.en.json`);
  const pitch = pitchText(slug);
  const wa = purchaseUrl(site.offer, site.business.name);

  return (
    <main>
      <p style={{ margin: "1rem 0 0", fontSize: "0.8125rem" }}>
        <Link href="/panel" style={{ color: "var(--muted)", textDecoration: "none" }}>
          ← Tüm siteler
        </Link>
      </p>

      <div className="detail-head">
        <div>
          <h2>{site.business.name}</h2>
          <div className="sub">
            {site.business.category}
            {site.business.city ? ` · ${site.business.city}` : ""} · /{slug}
          </div>
        </div>
        <span className={`pill pill-${STATUS_META[st].tone}`}>
          {STATUS_META[st].label}
          {st === "pitched" && site.offer.expiresAt ? ` · ${timeLeft(site.offer.expiresAt)} kaldı` : ""}
        </span>
      </div>

      {ok ? (
        <p className="notice">
          {ok}.{" "}
          {storeMode === "github"
            ? url
              ? (
                <>
                  GitHub&apos;a yazıldı (<a href={url}>{commit}</a>); Vercel 1–2 dakika içinde yayınlar.
                </>
              )
              : "GitHub'a yazıldı; Vercel 1–2 dakika içinde yayınlar."
            : "Yerel dosya güncellendi; canlıya çıkması için commit + push gerekir."}
        </p>
      ) : null}
      {hata ? <p className="notice notice-err">Kaydedilemedi: {hata}</p> : null}

      <div className="links">
        <a href={`/${slug}`} target="_blank" rel="noreferrer">
          Siteyi aç{hasB ? " (A)" : ""}
        </a>
        {hasB ? (
          <a href={`/${slug}/b`} target="_blank" rel="noreferrer">
            Tasarım B
          </a>
        ) : null}
        {hasEn ? (
          <a href={`/${slug}/en`} target="_blank" rel="noreferrer">
            English
          </a>
        ) : null}
        <a href={`/${slug}/opengraph-image`} target="_blank" rel="noreferrer">
          OG görseli
        </a>
        {site.business.whatsapp || site.business.phone ? (
          <a
            href={`https://wa.me/${(site.business.whatsapp ?? site.business.phone ?? "").replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            İşletmeye WhatsApp
          </a>
        ) : null}
        {site.business.phone ? <a href={`tel:${site.business.phone.replace(/[^\d+]/g, "")}`}>Ara</a> : null}
      </div>

      <div className="grid-2">
        <section className="card">
          <h3>Teklif</h3>
          <form action={saveOffer}>
            <input type="hidden" name="slug" value={slug} />
            <div className="field-row">
              <label className="field">
                Durum
                <select name="status" defaultValue={site.offer.status}>
                  {OFFER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_META[s].label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Fiyat (₺)
                <input name="price" inputMode="numeric" defaultValue={site.offer.price ?? ""} placeholder="8500" />
              </label>
            </div>
            <label className="field">
              Son gün (İstanbul saati)
              <input type="datetime-local" name="expiresAt" defaultValue={toLocalInput(site.offer.expiresAt)} />
            </label>
            <label className="field">
              Ödeme linki (iyzico / PayTR, isteğe bağlı)
              <input name="paymentUrl" type="url" defaultValue={site.offer.paymentUrl ?? ""} placeholder="https://" />
            </label>
            <div className="field-row">
              <label className="field">
                Satıcı WhatsApp
                <input name="sellerWhatsapp" inputMode="numeric" defaultValue={site.offer.seller?.whatsapp ?? ""} placeholder="905078463929" />
              </label>
              <label className="field">
                Alan adı (satışta)
                <input name="domain" defaultValue={site.business.domain ?? ""} placeholder="ornek.com" />
              </label>
            </div>
            <button type="submit" className="btn btn-primary">
              Kaydet
            </button>
          </form>
        </section>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <section className="card">
            <h3>Hızlı işlemler</h3>
            <div className="quick">
              {(
                [
                  ["pitch", "Teklif gönderildi (+7 gün)", ""],
                  ["extend3", "3 gün uzat", ""],
                  ["sold", "Satıldı", "btn-primary"],
                  ["expire", "Yayından kaldır", "btn-danger"],
                  ["draft", "Taslağa al", ""],
                ] as const
              ).map(([action, label, cls]) => (
                <form action={quickAction} key={action}>
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="action" value={action} />
                  <button type="submit" className={`btn ${cls}`}>
                    {label}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section className="card">
            <h3>Özet</h3>
            <dl className="kv">
              <dt>Fiyat</dt>
              <dd>{formatPriceNumber(site)}</dd>
              <dt>Son gün</dt>
              <dd>{site.offer.expiresAt ? formatTr(site.offer.expiresAt) : "—"}</dd>
              <dt>Telefon</dt>
              <dd>{site.business.phone ?? "—"}</dd>
              <dt>Bölümler</dt>
              <dd>{site.sections.map((s) => s.type).join(", ")}</dd>
              <dt>Tema</dt>
              <dd>
                {site.theme.preset}
                {site.theme.accent ? ` · ${site.theme.accent}` : ""} · {site.theme.fonts}
              </dd>
              {wa ? (
                <>
                  <dt>Satın alma linki</dt>
                  <dd>
                    <a href={wa} target="_blank" rel="noreferrer">
                      wa.me
                    </a>
                  </dd>
                </>
              ) : null}
            </dl>
            {/* eslint-disable-next-line @next/next/no-img-element -- dinamik OG rotası, önizleme */}
            <img className="og" src={`/${slug}/opengraph-image`} alt="" width={600} height={315} />
          </section>
        </div>
      </div>

      {st !== "sold" ? (
        <section className="card" style={{ marginTop: "1rem", borderColor: "var(--expired-bg)" }}>
          <h3>Reddetti → kaydı sil</h3>
          <p style={{ margin: "0 0 0.75rem", color: "var(--muted)", fontSize: "0.875rem" }}>
            Mesajdaki söz: &ldquo;siteyi kaldırır, bilgilerinizi siler&rdquo;. Bu işlem JSON’u ve varsa B/EN katmanlarını tamamen siler; geri alınamaz (git geçmişinde kalır). Onay için slug’ı yaz.
          </p>
          <form action={declineAndDelete} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <input type="hidden" name="slug" value={slug} />
            <input name="onay" placeholder={slug} className="" style={{ font: "inherit", padding: "0.5rem 0.7rem", border: "1px solid var(--line)", borderRadius: "8px", minWidth: "14rem" }} />
            <button type="submit" className="btn btn-danger">Sil</button>
          </form>
        </section>
      ) : null}

      <section className="card" style={{ marginTop: "1rem" }}>
        <h3 style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Gönderim metni
          {pitch ? <CopyButton text={pitch} /> : null}
        </h3>
        {pitch ? (
          <pre className="pitch">{pitch}</pre>
        ) : (
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.875rem" }}>
            Henüz yok: content/pitch/gonderim/{slug}.txt dosyası oluşturulunca burada görünür.
          </p>
        )}
      </section>
    </main>
  );
}
