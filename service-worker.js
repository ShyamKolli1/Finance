// Service Worker for Finance Tracker - Offline Support
const CACHE_VERSION = '2026-02-15-v5';
const STATIC_CACHE_NAME = `finance-static-${CACHE_VERSION}`;

const urlsToPrecache = [
  './',
  './index.html',
  './login.html',
  './payables-receivables.html',
  './storage.js',
  './firebase-config.js',
  './firebase-sync.js',
  './styles/main.css',
  './js/utils.js',
  './js/charts.js',
  './js/ui-enhancements.js',
  './js/app-shell.js',
  './pages/labels.html',
  './pages/analytics/index.html',
  './pages/analytics/monthly.html',
  './pages/analytics/compare.html',
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToPrecache).catch((err) => {
        console.warn('Some assets failed to cache:', err);
        return cache.addAll(urlsToPrecache.filter((url) => !url.includes('cdn')));
      });
    })
  );

  self.skipWaiting();
});

async function networkFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    const fallback = await cache.match('./index.html');
    if (fallback) return fallback;

    return new Response('<h1>Offline</h1><p>Local data is still available. Changes will sync when online.</p>', {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || fetchPromise;
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Never interfere with Firebase and auth network calls.
  if (
    requestUrl.hostname.includes('googleapis.com') ||
    requestUrl.hostname.includes('gstatic.com') ||
    requestUrl.hostname.includes('firebase')
  ) {
    return;
  }

  const isDocument = event.request.mode === 'navigate' || event.request.destination === 'document';

  if (isDocument) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
