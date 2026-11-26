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
  ['/studio.css', ['studio.css', 'text/css']],
  ['/actualizar.html', ['actualizar.html', 'text/html']],
  ['/preview/', ['preview/index.html', 'text/html']],
  ['/manifest.json', ['manifest.json', 'application/manifest+json']],
  ['/icon-192.png', ['icon-192.png', 'image/png']],
  ['/icon-512.png', ['icon-512.png', 'image/png']],
  ['/service-worker.js', ['service-worker.js', 'text/javascript']],
]);
for (const font of fs.readdirSync(path.join(root, 'assets/fonts'))) {
  const file = 'assets/fonts/' + font;
  assets.set('/' + file, [file, font.endsWith('.woff2') ? 'font/woff2' : 'text/plain']);
}
let update = 0;
let broken = false;
let rejectNavigation = false;
let rejectedEngine = 0;
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname.startsWith(scope) ? url.pathname.slice(scope.length - 1) : '';
  const asset = assets.get(pathname);
  if (!asset) {
    response.writeHead(404).end();
    return;
  }
  const [filename, mime] = asset;
  if (broken && filename === 'engine.js') {
    rejectedEngine++;
    response.writeHead(503).end();
    return;
  }
  if (rejectNavigation && filename === 'index.html') {
    response.writeHead(503).end();
    return;
  }
  let data = fs.readFileSync(path.join(root, filename));
  if (update && filename === 'index.html') {
    data = data.toString().replace('<head>', '<head><meta name="test-version" content="next-' + update + '">');
  }
  if (update && filename === 'engine.js') {
    data = data.toString() + '\nwindow.testEngineVersion = "next-' + update + '";';
  }
  if (update && filename === 'service-worker.js') {
    data = data.toString().replace(/const CACHE = "[^"]+";/, 'const CACHE = "cinematico-studio-audit-update-' + update + '";');
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
    update = 1;
    broken = true;
    const outcome = await requestUpdate();
    assert.ok(rejectedEngine > 0);
    assert.equal(outcome, 'redundant', 'An incomplete worker must not activate');
    assert.ok(await page.evaluate(async ({key, url}) => {
      const cache = await caches.open(key);
      return !!(await cache.match(url));
    }, {key: initial.keys[0], url: engineUrl}), 'The active cache must keep the motor');
    rejectNavigation = true;
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
    rejectNavigation = false;
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
    assert.equal(await updated.locator('meta[name="test-version"]').getAttribute('content'), 'next-1');
    assert.equal(await updated.evaluate(() => window.testEngineVersion), 'next-1');

    await context.setOffline(false);
    await updated.locator('#simpleChords').fill('Am F C G');
    update = 2;
    broken = true;
    const other = await context.newPage();
    const updatePage = new URL('actualizar.html', url).href;
    await other.goto(updatePage);
    await other.getByRole('button', {name:'Actualizar y abrir'}).click();
    await other.getByText('No se pudo aplicar la actualización.', {exact:false}).waitFor();
    assert.equal(other.url(), updatePage, 'An incomplete update must keep the recovery page open');
    assert.equal(await updated.evaluate(() => window.testEngineVersion), 'next-1');

    broken = false;
    await updated.evaluate(async () => (await navigator.serviceWorker.ready).update());
    await updated.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).waiting));
    await other.goto(url + '?version=2');
    assert.equal(await other.locator('meta[name="test-version"]').getAttribute('content'), 'next-1');
    await other.goto(new URL('preview/', url).href);
    await other.waitForURL(updatePage);
    await other.getByRole('button', {name:'Actualizar y abrir'}).click();
    await other.waitForURL(url);
    assert.equal(await other.locator('meta[name="test-version"]').getAttribute('content'), 'next-2');
    assert.equal(await other.evaluate(() => window.testEngineVersion), 'next-2');
    assert.match(await other.locator('footer').innerText(), /0\.2\.0-beta\.3/);
    assert.equal(await updated.locator('#simpleChords').inputValue(), 'Am F C G', 'Another tab retains its progression');
    await context.setOffline(true);
    await other.reload({waitUntil:'domcontentloaded'});
    assert.equal(await other.locator('meta[name="test-version"]').getAttribute('content'), 'next-2');
    assert.equal(await other.evaluate(() => window.testEngineVersion), 'next-2');
    console.log('PASS PWA update: HTTP 503 preserves the old shell, then passive and explicit updates switch HTML and engine together');
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => server.close());
