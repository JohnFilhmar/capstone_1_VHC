/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'notification-sound-cache-v1';
const urlsToCache = [
  '/notif_sound.mp3',
  '/queue_change.mp3',
  '/MHO_logo.png',
  '/report_template.docx'
];

self.addEventListener('activate', (event) => {
  if (self.registration.navigationPreload) {
    self.registration.navigationPreload.enable();
  }
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const preloadResponse = await event.preloadResponse;
      if (preloadResponse) {
        return preloadResponse;
      }
      return caches.match(event.request) || fetch(event.request);
    })()
  );
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
