'use strict';
/* Screenshot-free geometric regression against the real Chromium layout.
   Run after python3 -m http.server 4173 && npm install playwright. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';

async function check(page,selector,minimum,viewport,label){
 const info=await page.locator(selector).evaluate(el=>{
   const r=el.getBoundingClientRect();
   const style=getComputedStyle(el);
   return {left:r.left,right:r.right,width:r.width,visible:style.display!=='none'};
 });
 assert.ok(info.visible,label+': '+selector+' should be visible');
 assert.ok(info.left>=minimum-1,label+': '+selector+' touches left edge '+JSON.stringify(info));
 assert.ok(info.right<=viewport-minimum+1,label+': '+selector+' touches right edge '+JSON.stringify(info));
}
async function overflow(page,where){
 const d=await page.evaluate(()=>({
   width:window.innerWidth,htmlWidth:document.documentElement.scrollWidth,
   bodyWidth:document.body.scrollWidth,
   suspects:Array.from(document.querySelectorAll('*')).filter(el=>{
     const rect=el.getBoundingClientRect(),cs=getComputedStyle(el);
     return cs.display!=='none'&&rect.width>0&&(rect.left< -2||rect.right>innerWidth+2);
   }).slice(0,8).map(el=>({tag:el.tagName,className:typeof el.className==='string'?el.className.slice(0,70):'',rect:Math.round(el.getBoundingClientRect().right)}))
 }));
 assert.ok(d.htmlWidth<=d.width+1&&d.bodyWidth<=d.width+1,
   where+' horizontal document overflow '+JSON.stringify(d));
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,360,390,430,768,1024,1440]){
   const page=await browser.newPage({viewport:{width,height:850},deviceScaleFactor:width<=430?2:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(BASE,{waitUntil:'domcontentloaded'});
   const gutter=await page.locator('.shell').evaluate(el=>parseFloat(getComputedStyle(el).paddingLeft));
   assert.ok(gutter>=20,'Outer gutter must never collapse below 20px: '+width+' => '+gutter);
   await check(page,'.simple-create',20,width,'Create');
   await check(page,'.workspace-switch',20,width,'Workspace switch');
   await check(page,'#simpleChords',width<=430?35:20,width,'Progression input');
   await overflow(page,'Create '+width);
   await page.locator('#simpleChords').fill('Am F C G');
   await page.locator('#simpleExplore').click();
   assert.equal(await page.locator('.simple-path').count(),3,'Three musical routes still appear');
   await check(page,'.simple-path',20,width,'Route cards');
   await overflow(page,'Suggestions '+width);
   await page.locator('#workspaceAdvanced').click();
   await check(page,'.advanced-navigation',20,width,'Advanced choice');
   await overflow(page,'Advanced home '+width);
   for(const mode of ['chords','inspire','tools']){
     await page.locator('[data-study-open="'+mode+'"]').click();
     await overflow(page,'Advanced '+mode+' '+width);
     await page.locator('#workspaceAdvanced').click();
   }
   assert.deepEqual(errors,[],'Runtime errors at '+width+': '+errors.join('; '));
   await page.close();
   console.log('PASS responsive viewport',width,'px · gutters, input, routes, advanced views, no document overflow');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
