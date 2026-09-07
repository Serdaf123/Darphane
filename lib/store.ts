import fs from "node:fs";
import path from "node:path";
import { siteSchema, type Site } from "./schema";

/**
 * Panelin veri kaynağı. Siteler repo'da JSON; canlıda (Vercel) dosya sistemi
 * salt okunur ve build anındaki hali gösterir. Bu yüzden:
 *   - DARPHANE_GITHUB_TOKEN varsa: GitHub Contents API üzerinden okur/yazar.
 *     Yazma = commit → Vercel yeniden deploy eder (1-2 dk). Okuma her zaman taze.
 *   - yoksa (yerel geliştirme): dosyaya doğrudan yazar.
 */

const REPO = process.env.DARPHANE_GITHUB_REPO?.trim() || "Serdaf123/Darphane";
const BRANCH = process.env.DARPHANE_GITHUB_BRANCH?.trim() || "main";
const TOKEN = process.env.DARPHANE_GITHUB_TOKEN?.trim();
const SITES_DIR = path.join(process.cwd(), "data", "sites");
const AUTHOR = { name: "Serdaf123", email: "161323711+Serdaf123@users.noreply.github.com" };

export type StoreMode = "github" | "fs";
export const storeMode: StoreMode = TOKEN ? "github" : "fs";
/** Canlıda token yoksa panel salt okunur: dosya sistemi kalıcı değil (EROFS). */
export const storeReadOnly = !TOKEN && Boolean(process.env.VERCEL);

/** Şemadan geçmemiş ham JSON: dosyadaki alan sırası ve isteğe bağlı alanlar korunur. */
export type RawSite = Record<string, unknown> & { slug: string };

type GhFile = { sha: string; content: string; encoding: string; name: string; type: string };

async function gh(pathname: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  return res;
}

export async function listSlugs(): Promise<string[]> {
  if (storeMode === "github") {
    const res = await gh(`data/sites?ref=${BRANCH}`);
    if (res.status === 404) return [];
    const files = (await res.json()) as GhFile[];
    return files
      .filter((f) => f.type === "file" && /^[a-z0-9-]+\.json$/.test(f.name))
      .map((f) => f.name.replace(/\.json$/, ""))
      .sort();
  }
  if (!fs.existsSync(SITES_DIR)) return [];
  return fs
    .readdirSync(SITES_DIR)
    .filter((f) => /^[a-z0-9-]+\.json$/.test(f))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

/** Yardımcı dosyalar var mı (<slug>.b.json, <slug>.en.json)? Sadece isim listesi. */
export async function listAllFiles(): Promise<string[]> {
  if (storeMode === "github") {
    const res = await gh(`data/sites?ref=${BRANCH}`);
    if (res.status === 404) return [];
    return ((await res.json()) as GhFile[]).map((f) => f.name);
  }
  return fs.existsSync(SITES_DIR) ? fs.readdirSync(SITES_DIR) : [];
}

async function readRaw(slug: string): Promise<{ raw: RawSite; sha?: string } | null> {
  if (storeMode === "github") {
    const res = await gh(`data/sites/${slug}.json?ref=${BRANCH}`);
    if (res.status === 404) return null;
    const file = (await res.json()) as GhFile;
    const text = Buffer.from(file.content, "base64").toString("utf8");
    return { raw: JSON.parse(text) as RawSite, sha: file.sha };
  }
  const file = path.join(SITES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return { raw: JSON.parse(fs.readFileSync(file, "utf8")) as RawSite };
}

export async function readSite(slug: string): Promise<{ site: Site; raw: RawSite; sha?: string } | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const found = await readRaw(slug);
  if (!found) return null;
  const parsed = siteSchema.safeParse(found.raw);
  if (!parsed.success) throw new Error(`Geçersiz site: ${slug}`);
  return { site: parsed.data, raw: found.raw, sha: found.sha };
}

export async function readAllSites(): Promise<Site[]> {
  const slugs = await listSlugs();
  const all = await Promise.all(slugs.map((s) => readSite(s)));
  return all.flatMap((x) => (x ? [x.site] : []));
}

export type SaveResult = { mode: StoreMode; commitUrl?: string; sha?: string };

/** Ham JSON'u şemadan geçirip yazar. Dönüş: commit linki (github) ya da sadece mod (fs). */
const ON_VERCEL = Boolean(process.env.VERCEL);
const NO_TOKEN_MSG = "Canlıda kayıt için GitHub token gerekli: Vercel → Settings → Environment Variables → DARPHANE_GITHUB_TOKEN (fine-grained, yalnız Darphane repo, Contents: Read and write), sonra yeniden deploy. Ayrıntı README → Panel.";

export async function writeSite(slug: string, raw: RawSite, message: string, sha?: string): Promise<SaveResult> {
  if (storeMode === "fs" && ON_VERCEL) throw new Error(NO_TOKEN_MSG);
  const parsed = siteSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Şema hatası: ${issues}`);
  }
  const text = JSON.stringify(raw, null, 2) + "\n";

  if (storeMode === "github") {
    const put = (fileSha?: string) =>
      fetch(`https://api.github.com/repos/${REPO}/contents/data/sites/${slug}.json`, {
        method: "PUT",
        cache: "no-store",
        headers: { Authorization: `Bearer ${TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
        body: JSON.stringify({
          message: `${message}\n\nPanelden. Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`,
          content: Buffer.from(text, "utf8").toString("base64"),
          branch: BRANCH,
          sha: fileSha,
          committer: AUTHOR,
          author: AUTHOR,
        }),
      });
    let res = await put(sha);
    if (res.status === 409 || res.status === 422) {
      // Aynı dosyaya art arda iki kayıt (çift tık, iki sekme): güncel sha'yı alıp bir kez daha dene
      const fresh = await gh(`data/sites/${slug}.json?ref=${BRANCH}`);
      const freshSha = fresh.status === 200 ? ((await fresh.json()) as GhFile).sha : undefined;
      res = await put(freshSha);
    }
    if (!res.ok) throw new Error(`GitHub ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const body = (await res.json()) as { commit?: { sha: string; html_url: string } };
    return { mode: "github", commitUrl: body.commit?.html_url, sha: body.commit?.sha?.slice(0, 7) };
  }

  fs.writeFileSync(path.join(SITES_DIR, `${slug}.json`), text);
  return { mode: "fs" };
}

/**
 * Siteyi tamamen kaldırır (JSON + varyant/dil katmanları). Ret gelince söz verdiğimiz
 * "bilgileriniz silinir" bununla yerine gelir. GitHub'da her dosya ayrı commit.
 */
export async function deleteSite(slug: string, message: string): Promise<SaveResult & { removed: string[] }> {
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error("Geçersiz slug");
  if (storeMode === "fs" && ON_VERCEL) throw new Error(NO_TOKEN_MSG);
  const files = (await listAllFiles()).filter((f) => f === `${slug}.json` || f.startsWith(`${slug}.`));
  if (files.length === 0) throw new Error("Site bulunamadı");

  if (storeMode === "github") {
    let last: { html_url: string; sha: string } | undefined;
    for (const f of files) {
      const meta = await gh(`data/sites/${f}?ref=${BRANCH}`);
      if (meta.status === 404) continue;
      const { sha } = (await meta.json()) as GhFile;
      const res = await gh(`data/sites/${f}`, {
        method: "DELETE",
        body: JSON.stringify({ message: `${message} (${f})\n\nPanelden. Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, sha, branch: BRANCH, committer: AUTHOR, author: AUTHOR }),
      });
      const body = (await res.json()) as { commit?: { sha: string; html_url: string } };
      if (body.commit) last = body.commit;
    }
    return { mode: "github", commitUrl: last?.html_url, sha: last?.sha?.slice(0, 7), removed: files };
  }
  for (const f of files) fs.unlinkSync(path.join(SITES_DIR, f));
  return { mode: "fs", removed: files };
}
