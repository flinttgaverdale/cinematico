'use strict';
/* Screenshot-free geometric regression against the real Chromium layout.
   Run after python3 -m http.server 4173 && npm install playwright. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const BASE=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';

async function check(page,selector,minimum,viewport,label){
 const info=await page.locator(selector).first().evaluate(el=>{
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
   }).slice(0,8).map(el=>({tag:el.tagName,id:el.id,text:(el.textContent||'').trim().slice(0,45),className:typeof el.className==='string'?el.className.slice(0,70):'',rect:Math.round(el.getBoundingClientRect().right)}))
 }));
 assert.ok(d.htmlWidth<=d.width+1&&d.bodyWidth<=d.width+1,
   where+' horizontal document overflow '+JSON.stringify(d));
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const viewports=[320,360,375,390,412,430,768,1024,1440,1920].map(width=>({width,height:850}));
  viewports.push({width:844,height:390},{width:400,height:340});
  for(const {width,height} of viewports){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:width<=430?2:1});
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
     if(mode==='inspire'){
       const wheel=page.locator('#circle [data-key]');
       for(const [index,key] of [[1,'Enter'],[2,'Space']]){
         const note=wheel.nth(index);
         const name=await note.getAttribute('data-key');
         await note.focus();
         await page.keyboard.press(key);
         assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-key')),name,'Wheel activation retains keyboard focus');
         assert.equal(await note.getAttribute('aria-pressed'),'true');
         await page.keyboard.press('Tab');
         assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-key')),await wheel.nth(index+1).getAttribute('data-key'));
       }
     }
     if(mode==='tools'){
       for(const panel of await page.locator('.study-tool > summary').all()) await panel.click();
       const chart=page.getByRole('region',{name:'Gráfico de conducción de voces'});
       assert.ok(await chart.isVisible());
       if(width<=430){
         const help=page.locator('[data-study-panel="tools"] .help-details > summary:visible').first();
         for(const target of [help,page.locator('#guideToggle')]){
           assert.ok((await target.boundingBox()).height>=44,'Mobile help control reaches 44px');
         }
         await chart.focus();
         await page.keyboard.press('ArrowRight');
         await page.waitForFunction(()=>document.querySelector('#voiceLeading').scrollLeft>0);
       }
     }
     await overflow(page,'Advanced '+mode+' '+width);
     await page.locator('#workspaceAdvanced').click();
   }
   assert.deepEqual(errors,[],'Runtime errors at '+width+': '+errors.join('; '));
   await page.close();
   console.log('PASS responsive viewport',width+'×'+height,'· gutters, keyboard, controls and expanded panels');
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
