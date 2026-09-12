import { sectionSchema, siteOverlaySchema, siteSchema, type Site } from './schema.ts';

/** Stable legacy patching, with optional explicit order, additions and removals. */
export function mergeSiteOverlay(site: Site, input: unknown): Site {
  const overlay = siteOverlaySchema.parse(input);
  const unique = (values: string[], field: string) => {
    if (new Set(values).size !== values.length) throw new Error(`${field}: yinelenen bölüm id`);
  };
  const ids = site.sections.map((s, i) => s.id ?? `${s.type}-${i}`);
  unique(ids, 'site.sections');
  unique((overlay.sections ?? []).map(s => s.id), 'sections');
  unique(overlay.sectionOrder ?? [], 'sectionOrder');
  unique(overlay.remove ?? [], 'remove');
  const sections = new Map(ids.map((id, i) => [id, site.sections[i]]));
  const removed = new Set(overlay.remove ?? []);
  for (const patch of overlay.sections ?? []) {
    if (removed.has(patch.id)) throw new Error(`${patch.id}: hem yama hem remove olamaz`);
    const original = sections.get(patch.id);
    if (original && patch.type !== undefined && original.type !== patch.type) {
      throw new Error(`${patch.id}: bölüm türü değiştirilemez; yeni id kullanın`);
    }
    const merged: Record<string, unknown> = { ...original, ...patch };
    for (const key of Object.keys(merged)) if (merged[key] === null) delete merged[key];
    sections.set(patch.id, sectionSchema.parse(merged));
  }
  for (const id of removed) {
    if (!sections.delete(id)) throw new Error(`remove: bilinmeyen id ${id}`);
  }
  for (const id of overlay.sectionOrder ?? []) {
    if (!sections.has(id)) throw new Error(`sectionOrder: bilinmeyen veya çıkarılmış id ${id}`);
  }
  const order = [...(overlay.sectionOrder ?? []), ...[...sections.keys()].filter(id => !overlay.sectionOrder?.includes(id))];
  return siteSchema.parse({
    ...site,
    ...(overlay.recipe !== undefined || site.recipe !== undefined
      ? { recipe: overlay.recipe ?? site.recipe }
      : {}),
    ...(overlay.concept === null
      ? { concept: undefined }
      : overlay.concept !== undefined || site.concept !== undefined
        ? { concept: overlay.concept ?? site.concept }
        : {}),
    business: { ...site.business, ...overlay.business },
    seo: { ...site.seo, ...overlay.seo },
    theme: overlay.theme ?? site.theme,
    sections: order.map(id => sections.get(id)),
  });
}
