/**
 * Satış: siteyi "sold" yapar, alan adını bağlar, yayına alır.
 *
 *   npm run sell -- <slug> [--domain ornek.com] [--payment-url https://…] [--dry] [--no-push]
 *   npm run sell -- noyavet --domain ornek.com
 *
 * Yaptıkları, sırayla:
 *   1. data/sites/<slug>.json: status → sold, expiresAt silinir, business.domain yazılır
 *   2. git commit + push → Vercel yeniden deploy eder; robots/noindex kalkar,
 *      LocalBusiness JSON-LD ve hreflang açılır, alan adı yönlendirmesi devreye girer
 *   3. DARPHANE_VERCEL_TOKEN + DARPHANE_VERCEL_PROJECT_ID varsa alan adını (ve www'sini) Vercel projesine ekler
 *   4. İşletmeye/registrar'a verilecek DNS kayıtlarını yazdırır
 *
 * --dry: dosyayı değiştirmeden ne yapacağını gösterir.
 */

import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name: string) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);
const dry = args.includes("--dry");
const noPush = args.includes("--no-push");
const domain = flag("--domain")?.toLowerCase().replace(/^www\./, "");
const paymentUrl = flag("--payment-url");
const slug = args.find((a, i) => !a.startsWith("--") && !["--domain", "--payment-url"].includes(args[i - 1] ?? ""));

if (!slug) {
  console.error("Kullanım: npm run sell -- <slug> [--domain ornek.com] [--payment-url url] [--dry] [--no-push]");
  process.exit(1);
}
const file = path.join(process.cwd(), "data", "sites", `${slug}.json`);
if (!fs.existsSync(file)) {
  console.error(`Yok: data/sites/${slug}.json`);
  process.exit(1);
}
if (domain && !/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(domain)) {
  console.error(`Geçersiz alan adı: ${domain}`);
  process.exit(1);
}

const site = JSON.parse(fs.readFileSync(file, "utf8"));
const before = { status: site.offer?.status, domain: site.business?.domain };

site.offer = { ...site.offer, status: "sold" };
delete site.offer.expiresAt;
if (paymentUrl) site.offer.paymentUrl = paymentUrl;
if (domain) site.business.domain = domain;

console.log(`${slug}: ${before.status ?? "draft"} → sold${domain ? ` · alan adı ${domain}` : ""}`);

if (dry) {
  console.log("\n--dry: dosya değişmedi. Yazılacak offer:", JSON.stringify(site.offer), "\nbusiness.domain:", site.business.domain ?? "(yok)");
  printDns(domain);
  process.exit(0);
}

/* 1. dosya */
fs.writeFileSync(file, JSON.stringify(site, null, 2) + "\n");

/* 2. git */
try {
  execSync(`git add "${path.relative(process.cwd(), file)}"`, { stdio: "inherit" });
  execSync(
    `git commit -q -m "Satış: ${slug} yayında${domain ? ` (${domain})` : ""}" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"`,
    { stdio: "inherit" }
  );
  if (!noPush) execSync("git push", { stdio: "inherit" });
  console.log(noPush ? "Commit atıldı (push yok)." : "Push edildi; Vercel deploy ediyor.");
} catch {
  console.error("git adımı başarısız — dosya yazıldı, elle commit/push et.");
}

/* 3. Vercel alan adı */
if (domain) {
  const token = process.env.DARPHANE_VERCEL_TOKEN;
  const project = process.env.DARPHANE_VERCEL_PROJECT_ID;
  const team = process.env.DARPHANE_VERCEL_TEAM_ID;
  if (!token || !project) {
    console.log("\nDARPHANE_VERCEL_TOKEN / DARPHANE_VERCEL_PROJECT_ID yok: alan adını Vercel panelinden ekle (Project → Settings → Domains).");
  } else {
    for (const name of [domain, `www.${domain}`]) {
      const res = await fetch(
        `https://api.vercel.com/v10/projects/${project}/domains${team ? `?teamId=${team}` : ""}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          // www → çıplak alan adına yönlensin
          body: JSON.stringify(name.startsWith("www.") ? { name, redirect: domain, redirectStatusCode: 308 } : { name }),
        }
      );
      const body = (await res.json()) as { error?: { code?: string; message?: string }; verified?: boolean };
      if (res.ok) console.log(`Vercel: ${name} eklendi${body.verified ? " (doğrulandı)" : " (DNS bekleniyor)"}`);
      else if (body.error?.code === "domain_already_in_use" || body.error?.code === "domain_exists")
        console.log(`Vercel: ${name} zaten ekli`);
      else console.error(`Vercel: ${name} eklenemedi — ${body.error?.code ?? res.status}: ${body.error?.message ?? ""}`);
    }
  }
}

/* 4. DNS */
printDns(domain);
console.log(`\nYayında: https://${domain ?? "<vercel-adresi>"}/  ·  yol tabanlı adres de çalışmaya devam eder: /${slug}`);

function printDns(d?: string) {
  if (!d) return;
  console.log(`
DNS kayıtları (alan adının alındığı yerde — GoDaddy, Natro, İsimtescil…):
  A      @      76.76.21.21
  CNAME  www    cname.vercel-dns.com
Yayılması genelde 5-30 dk. Kontrol: https://vercel.com/docs/domains`);
}
