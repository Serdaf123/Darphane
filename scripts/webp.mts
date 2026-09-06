/**
 * public/ altındaki PNG/JPG görselleri WebP'ye çevirir (sharp), orijinali siler,
 * data/ ve components/ içindeki yolları .webp'ye günceller.
 *
 *   npm run webp            # public/ tamamı
 *   npm run webp -- --keep  # orijinalleri silme
 *   npm run webp -- shots   # başka bir klasör (yalnız dönüştürür, referans değiştirmez)
 *
 * Not: Uzak görseller (Unsplash) next/image tarafından zaten WebP/AVIF sunulur.
 * WhatsApp'a atılan ekran görüntüleri (shots/) PNG kalmalı: WebP'yi çıkartma sanır.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const args = process.argv.slice(2);
const keep = args.includes("--keep");
const root = args.find((a) => !a.startsWith("--")) ?? "public";
const dir = path.join(process.cwd(), root);
const QUALITY = 82;

function walk(d: string): string[] {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    return e.isDirectory() ? walk(p) : /\.(png|jpe?g)$/i.test(e.name) ? [p] : [];
  });
}

if (!fs.existsSync(dir)) {
  console.error(`Klasör yok: ${root}`);
  process.exit(1);
}

const files = walk(dir);
if (files.length === 0) {
  console.log(`${root}/ içinde PNG/JPG yok; her şey zaten WebP.`);
  process.exit(0);
}

let saved = 0;
const renamed: Array<[string, string]> = [];
for (const file of files) {
  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  const before = fs.statSync(file).size;
  await sharp(file).webp({ quality: QUALITY }).toFile(out);
  const after = fs.statSync(out).size;
  saved += before - after;
  if (!keep) fs.unlinkSync(file);
  renamed.push([path.relative(process.cwd(), file), path.relative(process.cwd(), out)]);
  console.log(`${path.relative(process.cwd(), file)} → .webp  ${(before / 1024) | 0} KB → ${(after / 1024) | 0} KB`);
}

/* Referansları güncelle: public/x/y.png → /x/y.webp */
if (root === "public") {
  const targets = ["data", "components", "app", "content"].flatMap((d) =>
    fs.existsSync(d) ? walkText(d) : []
  );
  let touched = 0;
  for (const t of targets) {
    let text = fs.readFileSync(t, "utf8");
    const orig = text;
    for (const [from, to] of renamed) {
      text = text.split(from.replace(/^public/, "")).join(to.replace(/^public/, ""));
    }
    if (text !== orig) {
      fs.writeFileSync(t, text);
      touched++;
      console.log(`referans güncellendi: ${t}`);
    }
  }
  if (touched === 0) console.log("Kod/veri içinde değişen referans yok.");
}

console.log(`\n${files.length} görsel dönüştürüldü, toplam ${(saved / 1024) | 0} KB kazanıldı.`);

function walkText(d: string): string[] {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) return e.name === "node_modules" ? [] : walkText(p);
    return /\.(json|tsx?|md|txt|css)$/.test(e.name) ? [p] : [];
  });
}
