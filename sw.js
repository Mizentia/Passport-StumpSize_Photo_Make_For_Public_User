const CACHE_NAME = 'passport-studio-cache-v9';

const CORE_ASSETS = [
  './', './index.html', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png',
  './css/variables.css', './css/base.css', './css/header-nav.css',
  './css/upload-section.css', './css/editor-workspace.css',
  './css/canvas-workspace.css', './css/toolbars.css',
  './css/sheet-panel.css', './css/history-tab.css', './css/modals.css', './css/toast.css', './css/responsive.css',
  './css/responsive-tablets.css', './css/responsive-mobile-core.css',
  './css/responsive-mobile-canvas.css', './css/responsive-mobile-panels.css',
  './css/responsive-small.css',
  './js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetchPromise = fetch(e.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => (e.request.headers.get('accept')?.includes('text/html') ? caches.match('./index.html') : null));

      return cached || fetchPromise;
    })
  );
});
