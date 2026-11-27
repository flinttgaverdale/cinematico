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
  viewports.push({width:844,height:390},{width:400,height:340},{width:390,height:844,fontScale:1.25});
  for(const {width,height,fontScale=1} of viewports){
   const deviceScaleFactor=width<=430?(width===320||width===412?2:3):1;
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(BASE,{waitUntil:'domcontentloaded'});
   if(fontScale!==1)await page.evaluate(scale=>{
    document.documentElement.style.fontSize=(scale*100)+'%';
   },fontScale);
   const gutter=await page.locator('.shell').evaluate(el=>parseFloat(getComputedStyle(el).paddingLeft));
   assert.ok(gutter>=20,'Outer gutter must never collapse below 20px: '+width+' => '+gutter);
   await check(page,'.simple-create',20,width,'Create');
   await check(page,'.workspace-switch',20,width,'Workspace switch');
   await check(page,'#simpleChords',width<=430?35:20,width,'Progression input');
   const form=await page.locator('#simpleChords').evaluate(el=>{
    const style=getComputedStyle(el);
    return {font:style.fontFamily,weight:style.fontWeight,size:parseFloat(style.fontSize),height:el.offsetHeight};
   });
   assert.match(form.font,/^Inter\b/,'The progression keeps the chord typeface');
   assert.equal(form.weight,'600');
   assert.ok(form.size>=24*fontScale,'Chord input uses a large size that follows the text scale');
   assert.ok(form.height>=44,'Progression input reaches 44px');
   const brokenIntentWords=await page.locator('.simple-intent-pills button span').evaluateAll(labels=>labels.flatMap(label=>{
    const wordRange=document.createRange();
    const source=label.firstChild;
    const button=label.closest('button').getBoundingClientRect();
    return [...source.textContent.matchAll(/\p{L}+/gu)].flatMap(match=>{
     wordRange.setStart(source,match.index);
     wordRange.setEnd(source,match.index+match[0].length);
     const boxes=[...wordRange.getClientRects()];
     const clipped=boxes.some(box=>box.left<button.left||box.right>button.right);
     return boxes.length===1&&!clipped?[]:[match[0]];
    });
   }));
   assert.deepEqual(brokenIntentWords,[],'Intent labels stay readable without word splitting');
   const nuances=page.locator('#simpleNuances > summary');
   await nuances.focus();
   await page.keyboard.press('Enter');
   assert.ok(await page.locator('#simpleMood').isVisible(),'The disclosure opens with Enter');
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.activeElement.id),'simpleMood','The select follows its summary in keyboard order');
   const focusedSelect=await page.locator('#simpleMood').evaluate(el=>({
    outline:getComputedStyle(el).outlineWidth,
    height:el.offsetHeight,
   }));
   assert.equal(focusedSelect.outline,'2px','The focused select has an outline');
   assert.ok(focusedSelect.height>=44,'Nuance select reaches 44px');
   await nuances.focus();
   await page.keyboard.press('Space');
   assert.ok(!(await page.locator('#simpleMood').isVisible()),'Space closes the disclosure');
   await overflow(page,'Create '+width);
   await page.locator('#simpleChords').fill('Am F C G');
   await page.locator('#simpleExplore').click();
   assert.equal(await page.locator('.simple-path').count(),3,'Three musical routes still appear');
   await check(page,'.simple-path',20,width,'Route cards');
   await overflow(page,'Suggestions '+width);
   await page.locator('#simpleReference').selectOption('horner');
   assert.ok(await page.locator('#simpleEnding').isVisible(),'Conditional phrase direction visible');
   await page.locator('#simpleExplore').click();
   assert.equal(await page.locator('.simple-path').count(),3);
   await check(page,'#simpleReference',20,width,'Composer selection');
   for(const card of await page.locator('.simple-path').all()){
    const action=card.locator('.simple-audio-row');
    assert.ok(await action.isVisible());
    if(width<=430)for(const button of await action.locator('button').all())assert.ok((await button.boundingBox()).height>=44,'Audio touch target');
   }
   await page.locator('.simple-path').first().locator(':scope > details > summary').click();
   await overflow(page,'Expanded composer result '+width);

   await page.locator('#workspaceAdvanced').click();
   await check(page,'.advanced-navigation',20,width,'Advanced choice');
   assert.equal(await page.locator('#studioGuide').count(),0,'Advanced study should start with the area chooser');
   await overflow(page,'Advanced home '+width);
   for(const mode of ['chords','inspire','tools']){
     await page.locator('[data-study-open="'+mode+'"]').click();
     if(mode==='chords'&&width<=430){
       await page.locator('#studyVoicesDetails > summary').click();
       for(const selector of ['#labVoiceCount','#labVoiceStyle']){
         const select=page.locator(selector);
         assert.ok((await select.boundingBox()).height>=44,'Voice select reaches 44px');
         assert.ok(await select.evaluate(el=>{
           const style=getComputedStyle(el);
           const context=document.createElement('canvas').getContext('2d');
           context.font=style.font;
           const label=context.measureText(el.selectedOptions[0].text).width;
           const available=el.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)-14;
           return label<=available;
         }),selector+' selected label fits next to the native arrow');
       }
     }
     if(mode==='inspire'){
       const wheel=page.locator('#circle [data-key]');
       for(const [index,key] of [[1,'Enter'],[2,'Space']]){
         const note=wheel.nth(index);
         const name=await note.getAttribute('data-key');
         await note.focus();
         await page.keyboard.press(key);
         assert.equal(await note.locator('.node-disc').evaluate(el=>getComputedStyle(el).outlineWidth),'2px','The focused note has its own ring');
         assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-key')),name,'Wheel activation retains keyboard focus');
         assert.equal(await note.getAttribute('aria-pressed'),'true');
         await page.keyboard.press('Tab');
         assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-key')),await wheel.nth(index+1).getAttribute('data-key'));
       }
       if(width<=430){
         const note=wheel.first();
         const target=note.locator('.node-hit');
         await target.scrollIntoViewIfNeeded();
         const hitBox=await target.boundingBox();
         assert.ok(hitBox.width>=44&&hitBox.height>=44,'Wheel note touch target reaches 44px');
         await page.mouse.click(hitBox.x+hitBox.width/2,hitBox.y+2);
         assert.equal(await note.getAttribute('aria-pressed'),'true','The area beyond the visible disc selects the note');
       }
     }
     if(mode==='tools'){
       for(const panel of await page.locator('.study-tool > summary').all()) await panel.click();
       const chart=page.getByRole('region',{name:'Gráfico de conducción de voces'});
       assert.ok(await chart.isVisible());
       if(width<=430){
         const help=page.locator('[data-study-panel="tools"] .help-details > summary:visible').first();
         assert.ok((await help.boundingBox()).height>=44,'Contextual help reaches 44px on mobile');
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
   console.log('PASS responsive viewport',width+'×'+height,'DPR '+deviceScaleFactor,'text ×'+fontScale);
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
