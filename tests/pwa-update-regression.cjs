'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const scope = "/cinematico/";
const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/index.html', ['index.html', 'text/html']],
  ['/engine.js', ['engine.js', 'text/javascript']],
  ['/manifest.json', ['manifest.json', 'application/manifest+json']],
  ['/icon-192.png', ['icon-192.png', 'image/png']],
  ['/icon-512.png', ['icon-512.png', 'image/png']],
  ['/service-worker.js', ['service-worker.js', 'text/javascript']],
]);
const updatedCache = 'cinematico-studio-audit-update';
let update = false;
let broken = false;
let rejectedEngine = 0;
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length - 1) : '';
  const asset = assets.get(pathname);
  if (!asset || (broken && pathname === '/engine.js')) {
    if (asset) rejectedEngine++;
    response.writeHead(asset ? 503 : 404).end();
    return;
  }
  const [filename, mime] = asset;
  let data = fs.readFileSync(path.join(root, filename));
  if (update && filename === 'index.html') {
    data = data.toString().replace('<head>', '<head><meta name="test-version" content="next">');
  }
  if (update && filename === 'engine.js') {
    data = data.toString() + '\nwindow.testEngineVersion = "next";';
  }
  if (update && filename === 'service-worker.js') {
    data = data.toString().replace(/const CACHE = "[^"]+";/, 'const CACHE = "' + updatedCache + '";');
  }
  response.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store' }).end(data);
});

async function main() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port + scope);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const engineUrl = scope + 'engine.js';
    const initial = await page.evaluate(async (url) => ({
      keys: await caches.keys(),
      engine: !!(await caches.match(url)),
    }), engineUrl);
    assert.equal(initial.engine, true);
    assert.equal(initial.keys.length, 1);
    const requestUpdate = () => page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const state = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('No update state')), 10000);
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker.addEventListener('statechange', () => {
            if (['installed', 'redundant'].includes(worker.state)) {
              clearTimeout(timer);
              resolve(worker.state);
            }
          });
        }, { once: true });
      });
      await registration.update();
      return state;
    });
    update = true;
    broken = true;
    const outcome = await requestUpdate();
    assert.ok(rejectedEngine > 0);
    assert.equal(outcome, 'redundant', 'An incomplete worker must not activate');
    assert.ok(await page.evaluate(async ({key, url}) => {
      const cache = await caches.open(key);
      return !!(await cache.match(url));
    }, {key: initial.keys[0], url: engineUrl}), 'The active cache must keep the motor');
    for (const offline of [false, true]) {
      await context.setOffline(offline);
      await page.reload({ waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('meta[name="test-version"]').count(), 0);
      assert.equal(await page.evaluate(() => window.testEngineVersion), undefined);
      await page.locator('#simpleChords').fill('Am F C G');
      await page.locator('#simpleExplore').click();
      assert.equal(await page.locator('.simple-path').count(), 3);
    }
    assert.deepEqual(errors, []);

    broken = false;
    await context.setOffline(false);
    assert.equal(await requestUpdate(), 'installed', 'A restored server should install the update');
    assert.ok(await page.evaluate(async () => (await navigator.serviceWorker.ready).waiting));
    const url = page.url();
    await page.close();
    const updated = await context.newPage();
    await updated.goto(url, {waitUntil:'domcontentloaded'});
    await updated.evaluate(() => navigator.serviceWorker.ready);
    await context.setOffline(true);
    await updated.reload({waitUntil:'domcontentloaded'});
    assert.equal(await updated.locator('meta[name="test-version"]').getAttribute('content'), 'next');
    assert.equal(await updated.evaluate(() => window.testEngineVersion), 'next');
    console.log('PASS PWA update: HTTP 503 preserves the old shell, then HTML and engine update together');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => server.close());
