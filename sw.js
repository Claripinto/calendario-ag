// Prima la rete (gli aggiornamenti arrivano subito); senza connessione usa l'ultima copia salvata.
// Solo file dello stesso sito: le chiamate a GitHub per la sincronizzazione non vengono mai messe in cache.
const CACHE = "calendario-agende-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => e.waitUntil((async () => {
  for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
  await self.clients.claim();
})()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request, { cache: "no-store" }).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match(e.request).then(m => m || caches.match("./index.html") || caches.match("./"))));
});
