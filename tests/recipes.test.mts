import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { siteSchema } from '../lib/schema.ts';
import { mergeSiteOverlay } from '../lib/site-overlay.ts';
import { generateRecipeOverlay, recipeSchema } from '../scripts/recipe.mts';
const read = (file: string) => JSON.parse(fs.readFileSync(file, 'utf8'));
const site = siteSchema.parse(read('data/sites/esatpasa-veteriner.json'));

test('legacy overlays including Noyavet B/C are unchanged', () => {
  for (const suffix of ['b','c']) {
    const a = siteSchema.parse(read('data/sites/noyavet.json'));
    const b = read(`data/sites/noyavet.${suffix}.json`);
    const legacy = siteSchema.parse({...a, business:{...a.business,...b.business},seo:{...a.seo,...b.seo},theme:b.theme ?? a.theme,sections:a.sections.map((s,i)=>({...s,...b.sections?.find((p: {id:string})=>p.id===(s.id??`${s.type}-${i}`))}))});
    assert.deepEqual(mergeSiteOverlay(a,b), legacy);
  }
});
test('add, remove and partial order are stable without mutating A', () => {
  const original=structuredClone(site);
  const b=mergeSiteOverlay(site,{sections:[{id:'ekip',type:'team',members:[{name:'Osman Kısa'}]}],remove:['galeri'],sectionOrder:['ust','ekip','konum']});
  assert.deepEqual(b.sections.slice(0,3).map(s=>s.id),['ust','ekip','konum']);
  assert.equal(b.sections.some(s=>s.id==='galeri'),false);
  assert.deepEqual(site,original);
  assert.deepEqual(b.sections.slice(3).map(s=>s.id),site.sections.filter(s=>!['ust','galeri','konum'].includes(s.id!)).map(s=>s.id));
});
test('null clears optional data, required omissions and bad references fail', () => {
  const b=mergeSiteOverlay(site,{sections:[{id:'ust',image:null,urgent:null}]});
  assert.equal('image' in b.sections[0],false);
  assert.equal('urgent' in b.sections[0],false);
  for(const patch of [
    {sections:[{id:'ust',headline:null}]}, {sections:[{id:'new',type:'team'}]},
    {sectionOrder:['missing']},{remove:['missing']},{sectionOrder:['ust','ust']},
    {sections:[{id:'ust'},{id:'ust'}]}, {sections:[{id:'ust',type:'hours'}]},
    {sections:[{id:'ust'}],remove:['ust']}, {remove:['ust'],sectionOrder:['ust']},
  ]) assert.throws(()=>mergeSiteOverlay(site,patch));
});
test('all recipes validate and generate valid overlays for every clinic', () => {
  for(const file of fs.readdirSync('data/recipes')) {
    const recipe=recipeSchema.parse(read(`data/recipes/${file}`));
    for(const slug of ['esatpasa-veteriner','esenler-bati-veteriner','kucukyali-veteriner','adraga-veteriner']) {
      const a=siteSchema.parse(read(`data/sites/${slug}.json`));
      const before=structuredClone(a);
      const overlay=generateRecipeOverlay(a,recipe,()=>{});
      assert.equal(mergeSiteOverlay(a,overlay).sections[0].type,'hero');
      assert.deepEqual(a,before);
    }
  }
});
test('missing content is skipped and landline never becomes WhatsApp', () => {
  const a=siteSchema.parse(read('data/sites/kucukyali-veteriner.json'));
  const warnings:string[]=[];
  const b=mergeSiteOverlay(a,generateRecipeOverlay(a,read('data/recipes/sessiz.json'),s=>warnings.push(s)));
  assert.ok(warnings.some(s=>s.includes('ekip')));
  assert.equal(b.sections.some(s=>s.type==='team'),false);
  assert.equal(b.sections[0].type,'hero');
  if(b.sections[0].type==='hero')assert.deepEqual(b.sections[0].actions.map(a=>a.kind),['call']);
});
test('recipe enum errors, wrong layouts and missing family/mobile fail', () => {
  const recipe=read('data/recipes/afis.json');
  for(const invalid of [
    {...recipe,family:''},{...recipe,mobile:''},{...recipe,theme:{...recipe.theme,fonts:'invented'}},
    {...recipe,sections:[{id:'ust',type:'hero',variant:'unknown'}]},
    {...recipe,sections:[recipe.sections[0],{id:'services',type:'services',layout:'masonry'}]},
  ])assert.throws(()=>recipeSchema.parse(invalid));
});
test('CLI dry-run makes no writes; --apply writes only selected variant', () => {
  const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'recipe-test-'));
  try {
    fs.mkdirSync(path.join(cwd,'data/sites'),{recursive:true});fs.mkdirSync(path.join(cwd,'data/recipes'));
    fs.copyFileSync('data/sites/esatpasa-veteriner.json',path.join(cwd,'data/sites/esatpasa-veteriner.json'));
    fs.copyFileSync('data/recipes/gece-nobeti.json',path.join(cwd,'data/recipes/gece-nobeti.json'));
    const cli=path.resolve('scripts/recipe.mts');const args=[cli,'esatpasa-veteriner','gece-nobeti'];
    const json=execFileSync(process.execPath,args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']});
    assert.equal(JSON.parse(json).recipe,'gece-nobeti');assert.equal(fs.readdirSync(path.join(cwd,'data/sites')).length,1);
    execFileSync(process.execPath,[...args,'--variant','c','--apply'],{cwd,stdio:'pipe'});
    assert.ok(fs.existsSync(path.join(cwd,'data/sites/esatpasa-veteriner.c.json')));
    assert.throws(()=>execFileSync(process.execPath,[...args,'--variant','a','--apply'],{cwd,stdio:'pipe'}));
    assert.throws(()=>execFileSync(process.execPath,[cli,'../outside','gece-nobeti','--apply'],{cwd,stdio:'pipe'}));
  } finally {fs.rmSync(cwd,{recursive:true,force:true});}
});
test('four B designs meet every structural contrast requirement', () => {
  for(const slug of ['esatpasa-veteriner','esenler-bati-veteriner','kucukyali-veteriner','adraga-veteriner']) {
    const a=siteSchema.parse(read(`data/sites/${slug}.json`));
    const b=mergeSiteOverlay(a,read(`data/sites/${slug}.b.json`));
    assert.equal(b.sections[0].type,'hero');
    if(a.sections[0].type==='hero'&&b.sections[0].type==='hero')assert.notEqual(a.sections[0].variant,b.sections[0].variant);
    assert.notEqual(a.theme.mode,b.theme.mode);assert.notEqual(a.theme.header,b.theme.header);
    assert.equal(b.theme.contact,'fab');assert.equal(b.theme.fabStyle,'dial');
    assert.notEqual(b.theme.motion.hero,'none');assert.notEqual(a.theme.motion.hero,b.theme.motion.hero);
    assert.notEqual(b.theme.motion.scroll,'none');assert.equal(b.theme.motion.smooth,true);
    assert.ok(['headingFont','typeScale','density','radius'].filter(k=>a.theme[k as keyof typeof a.theme]!==b.theme[k as keyof typeof b.theme]).length>=2);
    assert.ok(['services','gallery','reviews'].filter(type=>{const sa=a.sections.find(s=>s.type===type);const sb=b.sections.find(s=>s.type===type);return sa&&sb&&'layout' in sa&&'layout' in sb&&sa.layout!==sb.layout;}).length>=2);
    assert.ok(b.sections.filter((s,i)=>a.sections.findIndex(a=>a.id===s.id)!==i).length>=2);
    assert.ok(a.sections.some(s=>!b.sections.some(p=>p.id===s.id))||b.sections.some(s=>!a.sections.some(p=>p.id===s.id)));
    assert.equal(b.offer.status,a.offer.status);
  }
});
