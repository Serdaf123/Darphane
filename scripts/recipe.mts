import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { z } from 'zod';
import { siteSchema, sectionSchema, type Site, type SiteOverlay } from '../lib/schema.ts';
import { mergeSiteOverlay } from '../lib/site-overlay.ts';

const nonempty = z.string().min(1);
const sectionOptions = sectionSchema.options;
const hero = sectionOptions[0];
const recipeSectionSchema = z.object({
  id: nonempty,
  type: z.enum(sectionOptions.map(s => s.shape.type.value) as [string, ...string[]]),
  variant: hero.shape.variant.removeDefault().optional(),
  urgent: z.boolean().optional(),
  image: z.boolean().optional(),
  compact: z.boolean().optional(),
  badges: z.number().int().min(0).max(2).optional(),
  actions: z.array(z.enum(['call','whatsapp','directions','link','scroll','instagram','email'])).max(2).optional(),
  layout: z.string().optional(),
}).strict().superRefine((section, ctx) => {
  const schema = sectionOptions.find(s => s.shape.type.value === section.type)!;
  if (section.layout !== undefined) {
    const field = 'layout' in schema.shape ? schema.shape.layout : undefined;
    if (!field?.safeParse(section.layout).success) ctx.addIssue({ code: 'custom', path: ['layout'], message: `${section.type}: geçersiz düzen` });
  }
  if (section.type !== 'hero' && ['variant','urgent','image','compact','badges','actions'].some(k => section[k as keyof typeof section] !== undefined)) {
    ctx.addIssue({ code: 'custom', message: 'Hero alanları yalnız hero bölümünde kullanılabilir' });
  }
});
export const recipeSchema = z.object({
  key: nonempty.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), name: nonempty, world: nonempty,
  family: nonempty, fits: z.array(nonempty).min(1), avoid: z.array(nonempty),
  mobile: nonempty, desktop: nonempty,
  theme: siteSchema.shape.theme.unwrap().strict(),
  sections: z.array(recipeSectionSchema).min(1),
}).strict().superRefine((recipe, ctx) => {
  if (recipe.sections[0].type !== 'hero') ctx.addIssue({ code: 'custom', path: ['sections'], message: 'İlk bölüm hero olmalı' });
  if (new Set(recipe.sections.map(s => s.id)).size !== recipe.sections.length) ctx.addIssue({ code: 'custom', path: ['sections'], message: 'Bölüm id yineleniyor' });
});

export function generateRecipeOverlay(site: Site, input: unknown, warn: (message: string) => void = console.error): SiteOverlay {
  const recipe = recipeSchema.parse(input);
  const sections: NonNullable<SiteOverlay['sections']> = [];
  const used = new Set<string>();
  const baseIds = site.sections.map((s, i) => s.id ?? `${s.type}-${i}`);
  for (const spec of recipe.sections) {
    const index = site.sections.findIndex((s, i) => !used.has(baseIds[i]) && s.type === spec.type && baseIds[i] === spec.id);
    const fallback = index < 0 ? site.sections.findIndex((s, i) => !used.has(baseIds[i]) && s.type === spec.type) : index;
    if (fallback < 0) { warn(`${recipe.key}: ${spec.id} (${spec.type}) için içerik yok; atlandı.`); continue; }
    const source = site.sections[fallback];
    const id = baseIds[fallback];
    used.add(id);
    const patch: NonNullable<SiteOverlay['sections']>[number] = { id };
    if (spec.layout) patch.layout = spec.layout;
    if (source.type === 'hero') {
      patch.variant = spec.variant ?? source.variant;
      if (spec.compact !== undefined) patch.compact = spec.compact;
      // Count includes the live open/closed badge added by the renderer.
      patch.badges = source.badges.slice(0, Math.max(0, (spec.badges ?? 2) - (site.business.hours ? 1 : 0)));
      if (spec.image === false || patch.variant === 'minimal') { patch.image = null; patch.video = null; }
      if (spec.urgent === false) patch.urgent = null;
      if (spec.urgent === true && !source.urgent) warn(`${recipe.key}: acil blok için metin yok; eklenmedi.`);
      if (spec.actions) {
        const actions = spec.actions.flatMap(kind => {
          if ((kind === 'whatsapp' && !site.business.whatsapp) || (kind === 'call' && !site.business.phone)) return [];
          const existing = source.actions.find(a => a.kind === kind);
          if (existing) return [existing];
          if (kind === 'call') return [{ kind, label: 'Kliniği arayın', style: 'primary' as const }];
          if (kind === 'directions' && (site.business.address || site.business.mapsUrl || site.business.coords)) return [{ kind, label: 'Yol tarifi alın', style: 'primary' as const }];
          warn(`${recipe.key}: ${kind} eylemi için içerik yok; atlandı.`); return [];
        });
        if (!actions.length && site.business.phone) actions.push({ kind: 'call', label: source.actions.find(a => a.kind === 'call')?.label ?? 'Arayın', style: 'primary' });
        patch.actions = actions.map((a, i) => ({ ...a, style: i === 0 ? 'primary' : 'ghost' }));
      }
    }
    sections.push(patch);
  }
  const overlay: SiteOverlay = { recipe: recipe.key, theme: recipe.theme, sections, sectionOrder: [...used], remove: baseIds.filter(id => !used.has(id)) };
  mergeSiteOverlay(site, overlay);
  return overlay;
}

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
