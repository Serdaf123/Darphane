import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteSchema } from '../lib/schema.ts';
import { applyRecipeToBase, generateRecipeOverlay, generateRecipeVariantOverlay, recipeSchema } from '../lib/recipe.ts';

export { applyRecipeToBase, generateRecipeOverlay, generateRecipeVariantOverlay, recipeSchema } from '../lib/recipe.ts';

/**
 * Reçeteyi bir siteye uygular ve katman (<slug>.<variant>.json) üretir.
 *   npm run recipe -- <slug> <key> [--variant a|b|c] [--apply]
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
  if (!slug || !key || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error('Kullanım: npm run recipe -- <slug> <key> [--variant a|b|c] [--apply] veya --check');
  let variant = 'b'; let apply = false;
  for (let i=0; i<flags.length; i++) {
    if (flags[i] === '--apply') apply = true;
    else if (flags[i] === '--variant' && ['a','b','c'].includes(flags[i+1])) variant = flags[++i];
    else throw new Error(`Geçersiz seçenek: ${flags[i]}`);
  }
  const file = path.join(process.cwd(), 'data/sites', `${slug}.json`);
  const site = siteSchema.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (site.slug !== slug) throw new Error('Site slug dosya adıyla eşleşmiyor');
  const recipe = JSON.parse(fs.readFileSync(path.join(recipes, `${key}.json`), 'utf8'));
  const target = path.join(process.cwd(), 'data/sites', variant === 'a' ? `${slug}.json` : `${slug}.${variant}.json`);
  const output = variant === 'a'
    ? applyRecipeToBase(site, recipe)
    : fs.existsSync(target)
      ? generateRecipeVariantOverlay(site, JSON.parse(fs.readFileSync(target, 'utf8')), recipe)
      : generateRecipeOverlay(site, recipe);
  const json = JSON.stringify(output, null, 2) + '\n';
  if (apply) {
    fs.writeFileSync(target, json);
    console.error(`Yazıldı: ${target}`);
  } else process.stdout.write(json);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error instanceof Error ? error.message : String(error)); process.exitCode=1; }
}
