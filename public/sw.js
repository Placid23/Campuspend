// CafePay Wallet Service Worker v1.0
const CACHE_NAME = 'cafepay-v1';
const ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Simple cache-first strategy for branding assets
  if (event.request.url.includes('logo.png')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TEST_NOTIFY') {
    self.registration.showNotification('CafePay Wallet', {
      body: 'Background protocol active. You are now synched with PBL nodes.',
      icon: '/logo.png',
      badge: '/logo.png'
    });
  }
});

// Handle push events (for real background push when backend is added)
self.addEventListener('push', (event) => {
  let data = { title: 'Notification', body: 'New update from CafePay.' };
  if (event.data) {
    data = event.data.json();
  }
  
  const options = {
    body: data.body,
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: { url: '/' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
