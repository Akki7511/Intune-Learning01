// ============================================================
// INTUNE LEARNING HUB — SERVICE WORKER
// Enables offline use after first load
// ============================================================

const CACHE  = 'intune-hub-v5';
const ASSETS = [
  './',
  './index.html',
  './content.js',
  './quiz.js',
  './app.js',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './updates.json',
];

// Install: cache all app shell assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
