// APIPulse Service Worker v1.0
const CACHE = 'apipulse-v1';
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Syne:wght@400;500;600;700;800&display=swap',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(STATIC.map(url => c.add(url).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // For same-origin navigation requests, serve the app shell
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('/index.html').then(r => r || fetch(e.request))
    );
    return;
  }

  // Cache-first for static assets
  const url = new URL(e.request.url);
  const isStatic = STATIC.some(s => e.request.url.includes(s) || url.pathname.match(/\.(html|js|css|svg|png|json|woff2?)$/));

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => caches.match('/index.html'));
      })
    );
    return;
  }

  // Network-first for API calls
  e.respondWith(
    fetch(e.request).catch(() => {
      return new Response(JSON.stringify({ error: 'Offline', message: 'APIPulse is offline. Please reconnect.' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 503
      });
    })
  );
});
