self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('ps4-cache').then(c =>
      c.addAll([
        './',
        './index.html',
        './loader.js'
      ])
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
