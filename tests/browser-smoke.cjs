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
      await page.locator('#workspaceExplore').click();
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('#simpleMood').selectOption('misterio');
      // Direct navigation must carry unsent edits into advanced mode.
      await page.locator('#simpleChords').fill('Dm G7 C');
      await page.locator('#workspaceAdvanced').click();
      assert.equal(await page.locator('#userChords').inputValue(), 'Dm G7 C');
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
