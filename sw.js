const CACHE_NAME = 'goldpro-v4'; // Incremented version
const APP_PREFIX = '/vit/'; // Your GitHub repository name

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './index.css',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Myanmar:wght@300;400;500;600;700&display=swap'
];

// Install: Cache all essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use relative paths in ASSETS which works with the SW location
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Take control of all open clients immediately
});

// Fetch: Strategy handler
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 1. External Gold Price API: Network First, then Cache Fallback
  if (url.includes('goldprice.org')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. General Assets: Cache First, then Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
