// Service Worker — Cinemático Studio
// Network-first para evitar que una instalación PWA conserve indefinidamente el motor anterior.
const CACHE = "cinematico-studio-v17";
const ASSETS = ["./", "./index.html", "./engine.js", "./manifest.json"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => Promise.all(ASSETS.map(url => cache.add(url).catch(() => undefined))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("cinematico-studio-") && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const pathname = new URL(request.url).pathname;
  const isAppShell = request.mode === "navigate" || /\/(?:index\.html|engine\.js|manifest\.json)$/.test(pathname);
  if (!isAppShell) return;
  event.respondWith(fetch(request).then(response => {
    if (response && response.status === 200 && response.type === "basic") {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request).then(cached => cached || caches.match("./index.html"))));
});
