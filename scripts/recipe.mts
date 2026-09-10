import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteSchema } from '../lib/schema.ts';
import { generateRecipeOverlay, recipeSchema } from '../lib/recipe.ts';

export { generateRecipeOverlay, recipeSchema } from '../lib/recipe.ts';

/**
 * Reçeteyi bir siteye uygular ve katman (<slug>.<variant>.json) üretir.
 *   npm run recipe -- <slug> <key> [--variant b|c] [--apply]
 *   npm run recipe -- --check      # data/recipes/*.json şemadan geçer mi
 * Mantık lib/recipe.ts'te (kütüphane sayfası /kutuphane da aynı kodu kullanır).
 */
function main(args: string[]) {
  const recipes = path.join(process.cwd(), 'data/recipes');
  if (args.length === 1 && args[0] === '--check') {
    const files = fs.readdirSync(recipes).filter(f => f.endsWith('.json')).sort();
    for (const file of files) {
      const recipe = recipeSchema.parse(JSON.parse(fs.readFileSync(path.join(recipes, file), 'utf8')));
      if (file !== `${recipe.key}.json`) throw new Error(`${file}: key dosya adıyla eşleşmiyor`);
    }
    console.log(`${files.length} reçete doğrulandı.`); return;
  }
  const [slug, key, ...flags] = args;
  if (!slug || !key || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error('Kullanım: npm run recipe -- <slug> <key> [--variant b|c] [--apply] veya --check');
  let variant = 'b'; let apply = false;
  for (let i=0; i<flags.length; i++) {
    if (flags[i] === '--apply') apply = true;
    else if (flags[i] === '--variant' && ['b','c'].includes(flags[i+1])) variant = flags[++i];
    else throw new Error(`Geçersiz seçenek: ${flags[i]}`);
  }
  const file = path.join(process.cwd(), 'data/sites', `${slug}.json`);
  const site = siteSchema.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (site.slug !== slug) throw new Error('Site slug dosya adıyla eşleşmiyor');
  const output = generateRecipeOverlay(site, JSON.parse(fs.readFileSync(path.join(recipes, `${key}.json`), 'utf8')));
  const json = JSON.stringify(output, null, 2) + '\n';
  if (apply) {
    const target = path.join(process.cwd(), 'data/sites', `${slug}.${variant}.json`);
    fs.writeFileSync(target, json);
    console.error(`Yazıldı: ${target}`);
  } else process.stdout.write(json);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode=1; }
}
