// Service Worker for EcoLogic push notifications
const CACHE_NAME = 'ecologic-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data || {};
  const type = data.type;
  
  // Define routes based on notification type
  const routes = {
    water: '/habits',
    energy: '/challenges',
    recycling: '/challenges',
    challenge: '/challenges',
    streak: '/dashboard'
  };
  
  const url = routes[type] || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url === self.location.origin + url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if no existing window found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Handle push messages (for future server-sent notifications)
self.addEventListener('push', (event) => {
  let options = {
    body: 'New eco-friendly update!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/favicon.ico'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.ico'
      }
    ]
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      options = { ...options, ...payload };
    } catch (error) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification('🌱 EcoLogic', options)
  );
});

// Handle notification actions
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'eco-action-sync') {
    event.waitUntil(
      // Sync eco actions when back online
      syncEcoActions()
    );
  }
});

// Sync function for eco actions
async function syncEcoActions() {
  try {
    // In a real app, this would sync with the server
    const offlineActions = await getOfflineActions();
    
    if (offlineActions.length > 0) {
      console.log('Syncing eco actions:', offlineActions);
      
      // Show success notification
      self.registration.showNotification('✅ Actions Synced!', {
        body: `${offlineActions.length} eco actions synchronized successfully.`,
        tag: 'sync-complete',
        icon: '/favicon.ico'
      });
    }
  } catch (error) {
    console.error('Failed to sync eco actions:', error);
  }
}

// Get offline actions from IndexedDB (placeholder)
async function getOfflineActions() {
  // This would retrieve actions stored offline
  return [];
}