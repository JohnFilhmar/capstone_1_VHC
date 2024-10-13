/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'notification-sound-cache-v1';
const urlsToCache = [
  '/notif_sound.mp3',
  '/queue_change.mp3',
  '/MHO_logo.png'
];

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
