// Browser smoke tests: run with a local HTTP server on port 4173.
// npm install --no-save playwright && npx playwright install chromium
// node tests/browser-smoke.cjs
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const BASE = process.env.CINEMATICO_TEST_URL || 'http://127.0.0.1:4173/';
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{width:1280,height:900},{width:390,height:844}]) {
      const context = await browser.newContext({viewport,serviceWorkers:'block'});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(BASE, {waitUntil:'domcontentloaded'});
      // Regression: the public landing page must show the complete studio.
      assert.equal(await page.locator('body').getAttribute('data-workspace'), 'advanced');
      assert.ok(await page.locator('#circle').isVisible(), 'Circle of fifths must be visible');
      assert.ok(await page.locator('#userChords').isVisible(), 'User progression editor must be visible');
      assert.ok(await page.locator('.reference-flow').isVisible(), 'Reference column must be visible');
      assert.ok(await page.locator('#keyCaption').isVisible(), 'Reference key must be visible');
      assert.ok(await page.locator('#composer').count(), 'Composer reference selector must exist');
      assert.ok(await page.locator('#userTonalReading').count(), 'Tonal analysis panel must exist');
      // Deep composer-lens regression: independent reference, transposed and changing automatically.
      assert.equal(await page.locator('.composer-path-card').count(),2);
      for(const composer of ['williams','herrmann','zimmer','giacchino','elfman','silvestri','horner','shore','morricone','newman','goransson']){
        await page.locator('#composer').selectOption(composer);
        assert.equal(await page.locator('.composer-path-card').count(),2,composer);
        assert.ok((await page.locator('#composerExplorations').innerText()).includes('Dos caminos para explorar'),composer);
        assert.equal(await page.locator('#composerHere').inputValue(),composer);
      }
      await page.locator('#composer').selectOption('silvestri');
      const originalRoute=await page.locator('.composer-path-card').first().innerText();
      assert.ok(originalRoute.includes('Cmaj7#11'),originalRoute);
      await page.locator('#quickKey').selectOption('G');
      assert.ok((await page.locator('.composer-path-card').first().innerText()).includes('Gmaj7#11'));
      assert.ok(!(await page.locator('.composer-path-card').first().innerText()).includes('Cmaj7#11'));
      await page.locator('#quickKey').selectOption('C');
      await page.locator('#composerHere').selectOption('horner');
      assert.ok((await page.locator('.composer-path-card').first().innerText()).includes('Em'),'Horner transforms a C triad to Em');
      assert.equal(await page.locator('#composer').inputValue(),'horner');
      assert.equal(await page.locator('#userChords').inputValue(),'','Reference exercises must not overwrite the user's progressions');

      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('#simpleMood').selectOption('misterio');
      // Direct navigation must carry unsent edits into advanced mode.
      await page.locator('#simpleChords').fill('Dm G7 C');
      await page.locator('#workspaceAdvanced').click();
      assert.equal(await page.locator('#userChords').inputValue(), 'Dm G7 C');
      assert.ok(await page.locator('#circle').isVisible(), 'Circle must return after switching workspaces');
      assert.ok((await page.locator('#userTonalReading').innerText()).includes('Do') || (await page.locator('#userTonalReading').innerText()).includes('C mayor'), 'Cadential tonal hypothesis must render');
      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      await page.locator('.simple-path [data-open-advanced]').first().click();
      assert.equal(await page.locator('body').getAttribute('data-workspace'), 'advanced');
      assert.equal((await page.locator('#userChords').inputValue()).split(' ').length, 7);
      assert.equal((await page.locator('#simpleChords').inputValue()).split(' ').length, 7);
      await page.locator('#save').click();
      assert.ok((await page.locator('#savedList').innerText()).length > 0);
      await page.reload({waitUntil:'domcontentloaded'});
      await page.locator('#workspaceAdvanced').click();
      await page.locator('#savedList [data-load]').first().click();
      assert.equal((await page.locator('#userChords').inputValue()).split(' ').length, 7);
      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('C G Am F');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      await page.locator('#simpleMood').selectOption('calma');
      assert.equal(await page.locator('.simple-path').count(), 0, 'Old paths must be cleared');
      await page.locator('#simpleChords').fill('H invalid');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 0);
      assert.ok((await page.locator('#simpleFeedback').innerText()).length > 0);
      await page.locator('#simpleChords').fill(Array(6).fill('Am').join(' '));
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
      assert.equal(await page.locator('.simple-path [data-open-advanced]:disabled').count(), 3);
      assert.deepEqual(errors, [], 'Browser errors: ' + errors.join('; '));
      await context.close();
      console.log('PASS browser',viewport.width,'px');
    }
  } finally { await browser.close(); }
})().catch(err=>{console.error(err);process.exitCode=1;});
