/**
 * Manus'a görev verir, bitmesini bekler, cevabı dosyaya yazar.
 *
 *   npm run manus -- briefs/01-metinler.md --out content/serkan/copy.md
 *   npm run manus -- briefs/01-metinler.md --out content/serkan/copy.md --profile max --dry
 *
 * Gerekli: .env.local içinde MANUS_API_KEY (manus.im → Settings → Integrations → API → Create API Key).
 * Akış: POST /v2/task.create → GET /v2/task.detail (durum) → GET /v2/task.listMessages (cevap).
 * Cevapta .md eki varsa o indirilir; yoksa son assistant mesajının metni yazılır.
 */
import fs from "node:fs";
import path from "node:path";

const API = "https://api.manus.ai";
const KEY = process.env.MANUS_API_KEY?.trim();
const args = process.argv.slice(2);
const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const briefPath = args.find((a) => !a.startsWith("--") && !["--out", "--profile", "--locale"].includes(args[args.indexOf(a) - 1] ?? ""));
const out = flag("--out");
const profile = flag("--profile") ?? "standard";
const locale = flag("--locale") ?? "tr";
const dry = args.includes("--dry");

if (!briefPath || !out) {
  console.error("Kullanım: npm run manus -- <brif.md> --out <cikti.md> [--profile standard|lite|max] [--locale tr] [--dry]");
  process.exit(1);
}
if (!KEY && !dry) {
  console.error("MANUS_API_KEY yok. .env.local'a ekle: manus.im → Settings → Integrations → API → Create API Key");
  process.exit(1);
}

const brief = fs.readFileSync(briefPath, "utf8");
const prompt = `${brief}

---
Teslim biçimi: Cevabını YALNIZ Markdown olarak ver; brifteki başlık sırasını koru. Açıklama, giriş cümlesi, "işte metinler" gibi eklemeler yapma. Dosya olarak da ekleyebilirsin (copy.md).`;

console.log(`brif: ${briefPath} (${brief.length} karakter) → ${out} · profil ${profile} · dil ${locale}`);
if (dry) { console.log("--dry: gönderilmedi. İlk 400 karakter:\n" + prompt.slice(0, 400)); process.exit(0); }

const headers = { "Content-Type": "application/json", "x-manus-api-key": KEY! };

async function api<T>(pathname: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${pathname}`, { ...init, headers: { ...headers, ...(init?.headers ?? {}) } });
  const body = (await res.json()) as T & { ok?: boolean; error?: { message?: string } };
  if (!res.ok || body.ok === false) throw new Error(`Manus ${res.status} ${pathname}: ${JSON.stringify(body).slice(0, 300)}`);
  return body;
}

/* 1. görev aç */
const created = await api<{ task_id: string; task_url: string; task_title: string }>("/v2/task.create", {
  method: "POST",
  body: JSON.stringify({
    message: { content: prompt },
    locale,
    agent_profile: profile,
    interactive_mode: false,
    hide_in_task_list: false,
    title: `Darphane: ${path.basename(briefPath)}`,
  }),
});
console.log(`görev açıldı: ${created.task_id}\n${created.task_url}`);

/* 2. bitmesini bekle */
const started = Date.now();
let status = "running";
while (status === "running") {
  if (Date.now() - started > 25 * 60_000) throw new Error("25 dakikada bitmedi; task_url'den bak.");
  await new Promise((r) => setTimeout(r, 10_000));
  const d = await api<{ task: { status: string } }>(`/v2/task.detail?task_id=${created.task_id}`);
  status = d.task.status;
  process.stdout.write(`\r${Math.round((Date.now() - started) / 1000)} sn · ${status}   `);
}
console.log();
if (status === "error") throw new Error("Manus görevi hata verdi; task_url'den bak.");
if (status === "waiting") console.warn("Manus soru sordu (waiting). interactive_mode kapalıydı; task_url'den cevapla ya da tekrar çalıştır.");

/* 3. cevabı al */
type Part = { type?: string; text?: string };
type Att = { type: string; filename: string; url: string; content_type?: string };
type Ev = { type: string; assistant_message?: { content?: string | Part[]; attachments?: Att[] } };
const list = await api<{ messages: Ev[] }>(`/v2/task.listMessages?task_id=${created.task_id}&order=asc&limit=200`);
const assistant = list.messages.filter((m) => m.type === "assistant_message" && m.assistant_message);
if (assistant.length === 0) throw new Error("Cevap yok; task_url'den bak.");

const textOf = (c?: string | Part[]) => (typeof c === "string" ? c : (c ?? []).map((p) => p.text ?? "").join("\n"));
let result = "";
const md = assistant.flatMap((m) => m.assistant_message!.attachments ?? []).find((a) => /\.md$/i.test(a.filename));
if (md) {
  result = await (await fetch(md.url)).text();
  console.log(`ek indirildi: ${md.filename}`);
} else {
  result = textOf(assistant[assistant.length - 1].assistant_message!.content);
}
result = result.replace(/^```(?:markdown|md)?\n([\s\S]*?)\n```\s*$/m, "$1").trim() + "\n";

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, result);
console.log(`yazıldı: ${out} (${result.length} karakter)\nGörev: ${created.task_url}`);
