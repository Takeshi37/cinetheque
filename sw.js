// Cinéthèque — service worker (app hors ligne + cache des images)
const APP = 'cine-app-v1', IMGS = 'cine-img-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if(u.origin === location.origin){
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(APP).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
  } else if(/(^|\.)image\.tmdb\.org$|(^|\.)media\.rawg\.io$/.test(u.hostname)){
    e.respondWith(caches.open(IMGS).then(async x => { const m = await x.match(e.request); if(m) return m; const r = await fetch(e.request); if(r.ok || r.type === 'opaque') x.put(e.request, r.clone()); return r; }));
  }
});