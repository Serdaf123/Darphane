import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { siteSchema, sectionSchema, siteOverlaySchema, type Site, type SiteOverlay } from './schema.ts';
import { mergeSiteOverlay } from './site-overlay.ts';

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

const SECTION_DESIGN_FIELDS = new Set(['variant', 'layout', 'tone', 'compact', 'image', 'video']);

/** Mevcut varyantın metnini korur; tema, sıra ve bölüm düzenini yeni reçeteden alır. */
export function generateRecipeVariantOverlay(
  site: Site,
  existingInput: unknown,
  input: unknown,
  warn: (message: string) => void = console.error,
): SiteOverlay {
  const existing = siteOverlaySchema.parse(existingInput);
  const contentSections: NonNullable<SiteOverlay['sections']> = (existing.sections ?? []).map((section) => {
    const content: { id: string; [key: string]: unknown } = { id: section.id };
    for (const [key, value] of Object.entries(section)) {
      if (key !== 'id' && !SECTION_DESIGN_FIELDS.has(key)) content[key] = value;
    }
    return content;
  });
  const contentOverlay: SiteOverlay = {
    business: existing.business,
    seo: existing.seo,
    sections: contentSections,
  };
  const contentSite = mergeSiteOverlay(site, contentOverlay);
  const generated = generateRecipeOverlay(contentSite, input, warn);
  const baseIds = new Set(site.sections.map((section, index) => section.id ?? `${section.type}-${index}`));
  const contentById = new Map(contentSections.map((section) => [section.id as string, section]));
  const generatedById = new Map((generated.sections ?? []).map((section) => [section.id, section]));
  const contentSiteById = new Map(contentSite.sections.map((section, index) => [section.id ?? `${section.type}-${index}`, section]));
  const recipeOrder = generated.sectionOrder ?? [];
  const preservedIds = contentSections
    .filter((section) => Object.keys(section).some((key) => key !== 'id' && key !== 'type'))
    .map((section) => section.id)
    .filter((id) => !recipeOrder.includes(id) && !existing.remove?.includes(id));
  const order = insertBeforeClosing(recipeOrder, preservedIds, (id) => contentSiteById.get(id)?.type);

  return siteOverlaySchema.parse({
    recipe: generated.recipe,
    theme: generated.theme,
    business: existing.business,
    seo: existing.seo,
    sectionOrder: order,
    remove: (generated.remove ?? []).filter((id) => baseIds.has(id) && !preservedIds.includes(id)),
    sections: order.map((id) => {
      if (!baseIds.has(id)) {
        return sectionSchema.parse({ ...contentSiteById.get(id), ...generatedById.get(id) });
      }
      return { ...generatedById.get(id), ...contentById.get(id), id };
    }),
  });
}

/** Reçeteyi A'nın tam dosyasına uygular; reçetede olmayan mevcut içerik sonda korunur. */
export function applyRecipeToBase(site: Site, input: unknown, warn: (message: string) => void = console.error): Site {
  const overlay = generateRecipeOverlay(site, input, warn);
  // Reçetede olmayan mevcut bölümler silinmez; kapanış (cta/contact) en sonda kalsın diye onun önüne girer
  const ids = site.sections.map((section, index) => section.id ?? `${section.type}-${index}`);
  const typeOf = (id: string) => site.sections[ids.indexOf(id)]?.type;
  overlay.sectionOrder = insertBeforeClosing(overlay.sectionOrder ?? [], (overlay.remove ?? []).filter((id) => ids.includes(id)), typeOf);
  delete overlay.remove;
  const sections = overlay.sections?.map((section) => {
    const source = site.sections.find((candidate, index) => (candidate.id ?? `${candidate.type}-${index}`) === section.id);
    if (source?.type !== 'hero') return section;
    const design = { ...section };
    delete design.badges;
    delete design.actions;
    return design;
  });
  return mergeSiteOverlay(site, { ...overlay, sections });
}


/** Sıraya girmeyen bölümleri sona değil, kapanış bölümünün (cta/contact) önüne koyar. */
function insertBeforeClosing(order: string[], extra: string[], typeOf: (id: string) => string | undefined): string[] {
  if (!extra.length) return order;
  const last = order[order.length - 1];
  const closing = last !== undefined && (typeOf(last) === 'cta' || typeOf(last) === 'contact');
  return closing ? [...order.slice(0, -1), ...extra, last] : [...order, ...extra];
}

export type Recipe = z.infer<typeof recipeSchema>;

/** Kütüphanedeki sıra: docs/tasarim-kutuphanesi.md ile aynı. */
export const RECIPE_ORDER = ['gece-nobeti', 'vitrin', 'defter', 'kartpostal', 'klinik', 'atolye', 'sahne', 'tezgah', 'sessiz'];
const RECIPES_DIR = path.join(process.cwd(), 'data', 'recipes');

export function loadRecipes(): Recipe[] {
  if (!fs.existsSync(RECIPES_DIR)) return [];
  const list = fs.readdirSync(RECIPES_DIR).filter((f) => f.endsWith('.json'))
    .map((f) => recipeSchema.parse(JSON.parse(fs.readFileSync(path.join(RECIPES_DIR, f), 'utf8'))));
  const rank = (k: string) => { const i = RECIPE_ORDER.indexOf(k); return i < 0 ? 99 : i; };
  return list.sort((a, b) => rank(a.key) - rank(b.key) || a.key.localeCompare(b.key));
}

export function getRecipe(key: string): Recipe | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) return null;
  const file = path.join(RECIPES_DIR, `${key}.json`);
  if (!fs.existsSync(file)) return null;
  return recipeSchema.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
}

/** Reçeteyi bir sitenin üstüne uygular; içeriği olmayan bölümler sessizce atlanır. */
export function applyRecipe(site: Site, recipe: Recipe): Site {
  return mergeSiteOverlay(site, generateRecipeOverlay(site, recipe, () => {}));
}
