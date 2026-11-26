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
   const trial=page.locator('[data-composer-experiment="internal-tension"]');
   assert.equal(await page.locator('.simple-path').count(),3);
   assert.match(await trial.textContent(),/AmMaj7/);
   await trial.getByRole('button',{name:'Original'}).click();
   assert.match(await page.locator('#simpleListenStatus').textContent(),/Escuchando Original/);
   await trial.getByRole('button',{name:'Variante'}).click();
   assert.match(await page.locator('#simpleListenStatus').textContent(),/Escuchando Variante/);
   assert.equal(await trial.getByRole('button',{name:'Original'}).getAttribute('aria-pressed'),'false');
   await trial.locator('summary').click();
   assert.match(await trial.textContent(),/hipótesis D/);
   assert.equal(await page.locator('#simpleChords').inputValue(),'Am F C G');
   await page.locator('#simpleReference').selectOption('goransson');
   await page.locator('#simpleExplore').click();
   const rhythm=page.locator('[data-composer-experiment="rhythmic-energy"]');
   assert.equal(await rhythm.locator('[data-simple-preview]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth),width);
   await page.locator('#workspaceAdvanced').click();
   await page.locator('[data-study-open="chords"]').click();
   await page.locator('#studyProcedureDetails > summary').click();
   assert.match(await page.locator('#studyProcedure').textContent(),/Cambia energía sin reharmonizar/);
   assert.equal(await page.locator('#userChords').inputValue(),'Am F C G');
   await page.locator('#workspaceExplore').click();
   await page.locator('#simpleReference').selectOption('williams');
   await page.locator('#simpleExplore').click();
   assert.match(await page.locator('[data-composer-experiment="prepare-arrival"]').textContent(),/Prepara una llegada/);
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
