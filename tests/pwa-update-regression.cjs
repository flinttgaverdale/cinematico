'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
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
let rejectedEngine = 0;
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = assets.get(pathname);
  if (!asset || (update && pathname === '/engine.js')) {
    if (asset) rejectedEngine++;
    response.writeHead(asset ? 503 : 404).end();
    return;
  }
  const [filename, mime] = asset;
  let data = fs.readFileSync(path.join(root, filename));
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
    await page.goto('http://127.0.0.1:' + server.address().port + '/');
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const initial = await page.evaluate(async () => ({
      keys: await caches.keys(),
      engine: !!(await caches.match('/engine.js')),
    }));
    assert.equal(initial.engine, true);
    assert.equal(initial.keys.length, 1);
    update = true;
    const outcome = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready;
      const state = new Promise((resolve) => {
        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker.addEventListener('statechange', () => {
            if (['activated', 'redundant'].includes(worker.state)) resolve(worker.state);
          });
        }, { once: true });
      });
      await registration.update();
      return state;
    });
    assert.ok(rejectedEngine > 0);
    assert.equal(outcome, 'redundant', 'An incomplete worker must not activate');
    assert.ok(await page.evaluate(async (key) => {
      const cache = await caches.open(key);
      return !!(await cache.match('/engine.js'));
    }, initial.keys[0]), 'The active cache must keep the motor');
    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('#simpleChords').fill('Am F C G');
    await page.locator('#simpleExplore').click();
    assert.equal(await page.locator('.simple-path').count(), 3);
    assert.deepEqual(errors, []);
    console.log('PASS PWA update: failed engine precache preserves the offline app');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => server.close());
