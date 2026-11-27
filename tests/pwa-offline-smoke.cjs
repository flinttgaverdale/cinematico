'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'allow'});
  const page=await ctx.newPage();
  const failures=[];
  page.on('pageerror',e=>failures.push(e.message));
  await page.goto(BASE,{waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('#simpleChords').isVisible(),true,'App must start online');
  const info=await page.evaluate(async()=>{
   if(!('serviceWorker' in navigator))return {supported:false};
   const registration=await navigator.serviceWorker.ready;
   return {supported:true,scope:registration.scope,active:!!registration.active,keys:await caches.keys()};
  });
  assert.ok(info.supported&&info.active,'Registered SW required for installation');
  assert.ok(info.keys.some(x=>x.startsWith('cinematico-studio-')),'SW should precache shell');
  await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,{timeout:10000});
  await ctx.setOffline(true);
  await page.reload({waitUntil:'domcontentloaded'});
  assert.ok(await page.locator('#simpleChords').isVisible(),'Offline install must render Create');
  const typography=await page.evaluate(async()=>{
   const loaded=await Promise.all([
    document.fonts.load('650 24px Manrope','Cinemático'),
    document.fonts.load('600 16px Inter','Am F C G'),
    document.fonts.load('400 12px "IBM Plex Mono"','semitonos'),
   ]);
   return loaded.map(faces=>faces.map(face=>face.status));
  });
  assert.deepEqual(typography,[['loaded'],['loaded'],['loaded']],'All three local font families must load offline');
  await page.locator('#simpleChords').fill('Am F C G');
  await page.locator('#simpleExplore').click();
  assert.equal(await page.locator('.simple-path').count(),3,'Offline engine must still create three paths');
  const audio=page.locator('[data-simple-preview="0"]');
  await audio.click();
  assert.equal(await audio.getAttribute('aria-pressed'),'true','The cached piano preview starts offline');
  assert.match(await page.locator('#simpleListenStatus').textContent(),/piano sintetizado/);
  await audio.click();
  assert.equal(await audio.getAttribute('aria-pressed'),'false','The user can stop playback offline');
  await page.locator('#workspaceAdvanced').click();
  assert.equal(await page.locator('body').getAttribute('data-study'),'home','Offline advanced chooser remains independent');
  await page.locator('[data-study-open="inspire"]').click();
  assert.ok(await page.locator('#circle').isVisible(),'Offline reference wheel should render');
  await page.goto(new URL('actualizar.html',BASE).href,{waitUntil:'domcontentloaded'});
  assert.ok(await page.locator('#update').isVisible(),'The update screen is part of the offline shell');
  await page.locator('#update').click();
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Comprueba la conexión'));
  assert.ok(await page.locator('#update').isEnabled(),'A network failure should allow a retry');
  await page.getByRole('link',{name:'Abrir el estudio'}).click();
  assert.ok(await page.locator('#workspaceAdvanced').isVisible(),'The update screen can return to the cached studio');
  assert.deepEqual(failures,[],'No errors during offline navigation');
  await ctx.close();
  console.log('PASS Android-size PWA offline: cached HTML, engine and fonts, 3 proposals, piano playback and reference navigation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
