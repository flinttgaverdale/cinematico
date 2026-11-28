// Service Worker — Cinemático Studio
// Cada publicación del shell debe incrementar CACHE y el registro en index.html.
const CACHE = "cinematico-studio-v79";
const ASSETS = [
  "./", "./index.html", "./actualizar.html", "./engine.js", "./studio.css", "./manifest.json",
  "./icon-192.png", "./icon-512.png",
  "./assets/fonts/manrope-latin-wght-normal.woff2",
  "./assets/fonts/manrope-latin-ext-wght-normal.woff2",
  "./assets/fonts/manrope-OFL.txt",
  "./assets/fonts/inter-latin-wght-normal.woff2",
  "./assets/fonts/inter-latin-ext-wght-normal.woff2",
  "./assets/fonts/inter-OFL.txt",
  "./assets/fonts/ibm-plex-mono-latin-400-normal.woff2",
  "./assets/fonts/ibm-plex-mono-latin-ext-400-normal.woff2",
  "./assets/fonts/ibm-plex-mono-OFL.txt",
];
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

self.addEventListener("message", event => {
  if (event.data !== "cinematico:activate-update" || !event.source?.url) return;
  const client = new URL(event.source.url);
  const updatePage = new URL("actualizar.html", self.registration.scope);
  if (client.origin === updatePage.origin && client.pathname === updatePage.pathname) {
    event.waitUntil(self.skipWaiting());
  }
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  const key = SHELL.get(url.pathname);
  if (!key) return;
  // La versión activa sirve HTML y motor de la misma precarga. Una versión
  // nueva espera al cierre de las pestañas o a la activación desde actualizar.html.
  event.respondWith(caches.open(CACHE).then(cache => cache.match(key)).then(response => response || fetch(request)));
});
