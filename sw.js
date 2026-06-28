// sw.js — Service Worker لأفنان: تخزينٌ مؤقّت للعمل دون إنترنت + عرض الإشعارات.
const CACHE = 'afnan-v1';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon/icon-192.png',
  './assets/icon/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// شبكةٌ أولاً مع ارتداد للتخزين المؤقّت (حتى تبقى التحديثات حيّة وتعمل دون إنترنت)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
  );
});

// نقر الإشعار يفتح التطبيق
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cl) => {
      for (const c of cl) { if ('focus' in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
