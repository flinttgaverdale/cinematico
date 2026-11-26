'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.CINEMATICO_TEST_URL||'http://127.0.0.1:4173/';
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const width of [320,1280]){
   const page=await browser.newPage({viewport:{width,height:850}});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.locator('#simpleChords').fill('Am F C G');
   await page.locator('#simpleExplore').click();
   assert.equal(await page.locator('.simple-path').count(),3);
   assert.equal(await page.locator('[data-composer-experiment]').count(),0);
   await page.locator('#simpleNuances > summary').click();
   await page.locator('#simpleReference').selectOption('herrmann');
   assert.equal(await page.locator('.simple-path').count(),0);
   await page.locator('#simpleExplore').click();
   const cards=page.locator('.simple-path');
   assert.equal(await cards.count(),3);
   assert.match(await cards.nth(0).textContent(),/Continuidad/);
   assert.match(await cards.nth(1).textContent(),/Transformación/);
   assert.match(await cards.nth(2).textContent(),/Contraste/);
   const before=await cards.locator('.simple-chips').allTextContents();
   await page.getByRole('button',{name:'▶ Original',exact:true}).click();
   assert.match(await page.locator('#simpleListenStatus').textContent(),/Escuchando Original/);
   await cards.first().getByRole('button',{name:'▶ Continuación',exact:true}).click();
   assert.match(await page.locator('#simpleListenStatus').textContent(),/Escuchando Continuación/);
   await cards.first().getByRole('button',{name:'▶ Todo',exact:true}).click();
   assert.match(await page.locator('#simpleListenStatus').textContent(),/Escuchando Todo/);
   await cards.first().locator('summary').click();
   assert.match(await cards.first().textContent(),/Ejercicio original/);
   assert.equal(await page.locator('#simpleChords').inputValue(),'Am F C G');
   await page.locator('#simpleReference').selectOption('goransson');
   await page.locator('#simpleExplore').click();
   assert.notDeepEqual(await cards.locator('.simple-chips').allTextContents(),before);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   await page.locator('#workspaceAdvanced').click();
   await page.locator('[data-study-open="chords"]').click();
   await page.locator('#studyProcedureDetails > summary').click();
   assert.match(await page.locator('#studyProcedure').textContent(),/Cambia energía sin reharmonizar/);
   assert.equal(await page.locator('#userChords').inputValue(),'Am F C G');
   await page.locator('#workspaceExplore').click();
   await page.locator('#simpleReference').selectOption('williams');
   await page.locator('#simpleExplore').click();
   assert.match(await page.locator('.simple-path').first().textContent(),/Continuidad/);
   await page.locator('[data-quick-intent="suspense"]').click();
   await page.locator('#workspaceAdvanced').click();
   await page.locator('[data-study-open="chords"]').click();
   assert.match(await page.locator('#studyProcedure').textContent(),/Da más espacio a la llegada/);
   assert.deepEqual(errors,[]);
   console.log('PASS contextual composer UI '+width+' px: optional lens, real Web Audio A/B, unchanged input and advanced evidence');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
