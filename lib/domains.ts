/**
 * Alan adı adayları ve müsaitlik: teklif sayfasında "ornek.com müsait" satırı
 * kararı somutlaştırır. RDAP anahtarsızdır; .com için Verisign, .com.tr için
 * nic.tr'nin RDAP'ı yok → "kontrol edilemedi" + whois linki.
 */

const STOP = new Set(["ve", "the", "and", "of", "-"]);

export function domainBase(name: string): string {
  return name
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .join("-");
}

export type DomainCandidate = { domain: string; status: "available" | "taken" | "unknown"; whois?: string };

export function domainCandidates(name: string): string[] {
  const base = domainBase(name);
  if (!base) return [];
  const compact = base.replace(/-/g, "");
  const out = [`${compact}.com`, `${compact}.com.tr`];
  if (compact !== base) out.push(`${base}.com`);
  return Array.from(new Set(out)).slice(0, 3);
}

async function rdapCom(domain: string): Promise<DomainCandidate["status"]> {
  try {
    const res = await fetch(`https://rdap.verisign.com/com/v1/domain/${domain}`, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    return "unknown";
  } catch {
    return "unknown";
  }
}

export async function checkDomains(name: string): Promise<DomainCandidate[]> {
  const list = domainCandidates(name);
  return Promise.all(
    list.map(async (domain) => {
      if (domain.endsWith(".com.tr")) {
        return { domain, status: "unknown" as const, whois: `https://www.trabis.gov.tr/whois?domain=${domain}` };
      }
      return { domain, status: await rdapCom(domain) };
    })
  );
}
