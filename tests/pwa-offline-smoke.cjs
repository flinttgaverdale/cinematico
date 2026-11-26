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
  await page.locator('#simpleChords').fill('Am F C G');
  await page.locator('#simpleExplore').click();
  assert.equal(await page.locator('.simple-path').count(),3,'Offline engine must still create three paths');
  await page.locator('#workspaceAdvanced').click();
  assert.equal(await page.locator('body').getAttribute('data-study'),'home','Offline advanced chooser remains independent');
  await page.locator('[data-study-open="inspire"]').click();
  assert.ok(await page.locator('#circle').isVisible(),'Offline reference wheel should render');
  assert.deepEqual(failures,[],'No errors during offline navigation');
  await ctx.close();
  console.log('PASS Android-size PWA offline: registered SW, precached HTML+engine, 3 proposals and reference navigation');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
