import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const base=process.env.SERKAN_B_BASE_URL ?? 'http://localhost:3101';
const output=fileURLToPath(new URL('./review', import.meta.url));
await mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
for(const [slug,path] of [['portre','/serkan-oral/b'],['galeri','/serkan-oral/b/galeri'],['afis','/serkan-oral/b/afis']]) {
 for(const [device,width,height,motion] of [['desktop',1440,1000,'no-preference'],['mobile',390,844,'no-preference'],['reduced',320,740,'reduce']]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:motion});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base+path,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('.finished-steps li').count(),3);
  assert.equal(await page.locator('.finished-feature-grid article').count(),6);
  assert.equal(await page.locator('.finished-work-grid>a').count(),2);
  assert.equal(await page.locator('.finished-faq details').count(),6);
  assert.equal(await page.locator('.concept-picker').count(),0);
  assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
  await page.keyboard.press('Tab');assert.equal(await page.locator('.concept-skip').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Enter');
  for(const summary of await page.locator('.finished-faq summary').all()){await summary.click();assert.equal(await summary.evaluate(e=>e.parentElement.open),true);await summary.click();}
  await page.locator('.finished-closing').scrollIntoViewIfNeeded();
  await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  const wa=await page.locator('a[href^="https://wa.me"]').evaluateAll(es=>es.map(e=>e.href));assert.equal(new Set(wa).size,1);assert(wa[0].includes('905078463929'));
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);assert.equal(overflow,0);
  if(width<700){assert.equal(await page.locator('.finished-dock').evaluate(e=>getComputedStyle(e).position),'fixed');const rect=await page.locator('.finished-dock').boundingBox();assert(rect.y+rect.height<=height+1);}
  if(motion==='reduce') assert.equal(await page.locator('.concept-entrance').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.deepEqual(errors,[]);
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(200);
  if(device!=='reduced') await page.screenshot({path:`${output}/${slug}-${device}.png`,fullPage:true});
  const images=await page.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0));assert(images);
  results.push({slug,device,width,status:response.status(),overflow,images,consoleErrors:errors.length});await page.close();
 }
 const page=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await page.goto(base+path);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('.finished-faq details').count(),6);assert(await page.locator('.finished-dock').isVisible());await page.close();
}
for(const path of ['/ocakbasi-sahin','/dishekimi-elif-yarar']){const p=await browser.newPage();const r=await p.goto(base+path);assert.equal(r.status(),200);await p.close();}
await writeFile(`${output}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close();}
