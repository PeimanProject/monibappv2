// Service Worker for Monib AI PWA
// Handles background audio and PWA launch events

const CACHE_NAME = 'monib-ai-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Background sync for audio
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-audio') {
    event.waitUntil(
      // Handle background audio sync
      console.log('Background audio sync event')
    );
  }
});

// Handle push notifications (for audio controls)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Audio is playing in background',
    icon: '/android-icon-96x96.png',
    badge: '/android-icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'play',
        title: 'Play',
        icon: '/icons/light/play.svg'
      },
      {
        action: 'pause',
        title: 'Pause',
        icon: '/icons/light/play.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Monib AI', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'play') {
    // Handle play action
    event.waitUntil(
      clients.openWindow('/?audio-session=play')
    );
  } else if (event.action === 'pause') {
    // Handle pause action
    event.waitUntil(
      clients.openWindow('/?audio-session=pause')
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/?audio-session=true')
    );
  }
});

// Handle app launch from background audio
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'AUDIO_SESSION') {
    // Handle audio session events
    console.log('Audio session event:', event.data);
  }
}); 