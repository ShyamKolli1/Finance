// Service Worker for Finance Tracker - Offline Support
const CACHE_NAME = 'finance-tracker-v2';
const urlsToCache = [
  './',
  './index.html',
  './storage.js',
  './firebase-config.js',
  './firebase-sync.js',
  './styles/main.css',
  './js/utils.js',
  './js/charts.js',
  './pages/labels.html',
  './pages/analytics/index.html',
  './pages/analytics/monthly.html',
  './pages/analytics/compare.html',
  'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
];

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.warn('Some assets failed to cache:', err);
        // Don't fail install if CDN is unreachable
        return cache.addAll(urlsToCache.filter(url => !url.includes('cdn')));
      });
    })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Return a simple offline page
        if (event.request.destination === 'document') {
          return new Response('<h1>Offline</h1><p>Local data is still available. Changes will sync when online.</p>', {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
