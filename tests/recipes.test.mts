import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { siteSchema } from '../lib/schema.ts';
import { mergeSiteOverlay } from '../lib/site-overlay.ts';
import { applyRecipeToBase, generateRecipeOverlay, generateRecipeVariantOverlay, recipeSchema } from '../scripts/recipe.mts';
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
  const recipe=read('data/recipes/sahne.json');
  for(const invalid of [
    {...recipe,family:''},{...recipe,mobile:''},{...recipe,theme:{...recipe.theme,fonts:'invented'}},
    {...recipe,sections:[{id:'ust',type:'hero',variant:'unknown'}]},
    {...recipe,sections:[recipe.sections[0],{id:'services',type:'services',layout:'masonry'}]},
  ])assert.throws(()=>recipeSchema.parse(invalid));
});
test('A recipe writes a full site and B recipe preserves existing copy', () => {
  const recipe=read('data/recipes/sahne.json');
  const existing={sections:[{id:'ust',headline:'Korunan başlık',subline:'Korunan alt satır',badges:['Korunan rozet']},{id:'hizmetler',title:'Korunan hizmet başlığı'},{id:'hakkinda',title:'Reçetede olmayan korunan bölüm'}]};
  const variant=generateRecipeVariantOverlay(site,existing,recipe,()=>{});
  const b=mergeSiteOverlay(site,variant);
  assert.equal(b.recipe,'sahne');
  assert.equal(b.sections[0].type,'hero');
  if(b.sections[0].type==='hero')assert.equal(b.sections[0].headline,'Korunan başlık');
  if(b.sections[0].type==='hero')assert.deepEqual(b.sections[0].badges,['Korunan rozet']);
  const services=b.sections.find(s=>s.id==='hizmetler');
  assert.ok(services&&services.type==='services');
  assert.equal(services.title,'Korunan hizmet başlığı');
  const about=b.sections.find(s=>s.id==='hakkinda');
  assert.ok(about&&about.type==='about');
  assert.equal(about.title,'Reçetede olmayan korunan bölüm');
  const a=applyRecipeToBase(site,read('data/recipes/klinik.json'),()=>{});
  assert.equal(a.recipe,'klinik');
  assert.equal(a.sections.length,site.sections.length);
});
test('CLI dry-run makes no writes; --apply writes A or selected variant', () => {
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
    execFileSync(process.execPath,[...args,'--variant','a','--apply'],{cwd,stdio:'pipe'});
    assert.equal(JSON.parse(fs.readFileSync(path.join(cwd,'data/sites/esatpasa-veteriner.json'),'utf8')).recipe,'gece-nobeti');
    assert.throws(()=>execFileSync(process.execPath,[cli,'../outside','gece-nobeti','--apply'],{cwd,stdio:'pipe'}));
  } finally {fs.rmSync(cwd,{recursive:true,force:true});}
});
test('six Excel sites use contrasting A/B recipe families', () => {
  const mappings:Record<string,[string,string]>={
    'esatpasa-veteriner':['klinik','gece-nobeti'],
    'esenler-bati-veteriner':['klinik','gece-nobeti'],
    'kucukyali-veteriner':['tezgah','sessiz'],
    'adraga-veteriner':['vitrin','defter'],
    'pisi-veteriner':['klinik','sahne'],
    'polen-veteriner':['tezgah','sahne'],
  };
  let stackCount=0;
  for(const [slug,[aKey,bKey]] of Object.entries(mappings)) {
    const a=siteSchema.parse(read(`data/sites/${slug}.json`));
    const overlay=read(`data/sites/${slug}.b.json`);
    const b=mergeSiteOverlay(a,overlay);
    const aRecipe=recipeSchema.parse(read(`data/recipes/${aKey}.json`));
    assert.equal(a.recipe,aKey);assert.deepEqual(a.theme,aRecipe.theme);
    assert.equal(b.sections[0].type,'hero');
    assert.equal(b.offer.status,a.offer.status);
    // B bir konseptle çiziliyorsa (concept alanı) reçete/tema kuralları uygulanmaz; konsept anahtarı geçerli olmalı
    if(overlay.concept){assert.equal(typeof b.concept,'string');continue;}
    const bRecipe=recipeSchema.parse(read(`data/recipes/${bKey}.json`));
    assert.equal(overlay.recipe,bKey);assert.deepEqual(b.theme,bRecipe.theme);
    const aAxes=aRecipe.family.split(' · ');const bAxes=bRecipe.family.split(' · ');
    assert.ok(aAxes.filter((axis,index)=>axis!==bAxes[index]).length>=2);
    assert.equal(b.theme.contact,'fab');assert.equal(b.theme.fabStyle,'dial');
    assert.notEqual(b.theme.motion.hero,'none');assert.notEqual(b.theme.motion.scroll,'none');
    if(b.theme.motion.hero==='stack')stackCount++;
  }
  void stackCount;
  const esat=mergeSiteOverlay(site,read('data/sites/esatpasa-veteriner.b.json'));
  assert.ok(esat.concept==='nobet'||esat.theme.motion.hero==='counter');
  const kucuk=siteSchema.parse(read('data/sites/kucukyali-veteriner.json'));
  const kucukB=mergeSiteOverlay(kucuk,read('data/sites/kucukyali-veteriner.b.json'));
  assert.equal(kucuk.business.whatsapp,undefined);assert.equal(kucukB.theme.contact,'fab');
  const polen=siteSchema.parse(read('data/sites/polen-veteriner.json'));
  const polenB=mergeSiteOverlay(polen,read('data/sites/polen-veteriner.b.json'));
  assert.equal(polenB.sections.some(section=>section.type==='reviews'),false);
});

test('kural: A ve B reçeteleri konsept detayı (dial/strip/fis/card/tabela) kullanmaz; C bir konsepttir', () => {
  const isDetail=(s:{type?:string;layout?:string})=>(s.type==='hours'&&(s.layout==='dial'||s.layout==='strip'))||(s.type==='services'&&s.layout==='fis')||(s.type==='location'&&s.layout==='card')||(s.type==='cta'&&s.layout==='tabela');
  const offenders:string[]=[];
  for(const file of fs.readdirSync('data/recipes').filter(f=>f.endsWith('.json'))){
    const r=read(`data/recipes/${file}`);
    for(const s of r.sections){ if(isDetail(s)) offenders.push(`${file}:${s.id}`); }
  }
  for(const file of fs.readdirSync('data/sites').filter(f=>f.endsWith('.json')&&!f.endsWith('.c.json'))){
    const d=read(`data/sites/${file}`);
    const base=file.endsWith('.b.json')?siteSchema.parse(read(`data/sites/${file.replace('.b.json','.json')}`)):null;
    const full=base?mergeSiteOverlay(base,d):d;
    for(const s of full.sections??[]){ if(isDetail(s)) offenders.push(`${file}:${s.id}`); }
    if(d.concept) offenders.push(`${file}:concept`);
  }
  assert.deepEqual(offenders,[]);
  for(const file of fs.readdirSync('data/sites').filter(f=>f.endsWith('.c.json'))){
    assert.equal(typeof read(`data/sites/${file}`).concept,'string',`${file} bir konsept taşımalı`);
  }
});
