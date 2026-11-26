// Service Worker — Cinemático Studio
// Cada publicación del shell debe incrementar CACHE y el registro en index.html.
const CACHE = "cinematico-studio-v53";
const ASSETS = ["./", "./index.html", "./engine.js", "./manifest.json", "./icon-192.png", "./icon-512.png"];
const SHELL = new Map(ASSETS.map(path => {
  const url = new URL(path, self.registration.scope);
  return [url.pathname, url.href];
}));

self.addEventListener("install", event => {
  const requests = [...SHELL.values()].map(url => new Request(url, {cache: "reload"}));
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(requests)));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith("cinematico-studio-") && key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  const key = SHELL.get(url.pathname);
  if (!key) return;
  // La versión activa sirve HTML y motor de la misma precarga. Una versión
  // nueva espera a que se cierren las pestañas que siguen usando la anterior.
  event.respondWith(caches.open(CACHE).then(cache => cache.match(key)).then(response => response || fetch(request)));
});
