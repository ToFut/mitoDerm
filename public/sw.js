// MitoDerm Progressive Web App Service Worker
// Version 1.0.0 - Enhanced with AI-powered features

const CACHE_NAME = 'mitoderm-v1.0.0';
const STATIC_CACHE = 'mitoderm-static-v1.0.0';
const DYNAMIC_CACHE = 'mitoderm-dynamic-v1.0.0';
const API_CACHE = 'mitoderm-api-v1.0.0';
const IMAGE_CACHE = 'mitoderm-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline',
  '/products',
  '/events',
  '/about',
  '/contact',
  // Core CSS and JS files will be added by Next.js build process
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/products',
  '/api/events',
  '/api/gallery'
];

// Network-first strategy for these patterns
const NETWORK_FIRST_PATTERNS = [
  /\/api\/admin/,
  /\/api\/auth/,
  /\/api\/upload/
];

// Cache-first strategy for these patterns
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/,
  /\/api\/products/,
  /\/api\/events/
];

// Stale-while-revalidate for these patterns
const STALE_WHILE_REVALIDATE_PATTERNS = [
  /\/products\/.*/,
  /\/events\/.*/,
  /\/about/,
  /\/contact/
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache critical API data
      caches.open(API_CACHE).then(async (cache) => {
        console.log('[SW] Pre-caching API data');
        for (const endpoint of API_ENDPOINTS) {
          try {
            const response = await fetch(endpoint);
            if (response.ok) {
              await cache.put(endpoint, response);
            }
          } catch (error) {
            console.warn(`[SW] Failed to pre-cache ${endpoint}:`, error);
          }
        }
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(handleRequest(request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Network-first strategy (admin, auth, uploads)
    if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(pathname))) {
      return await networkFirst(request);
    }
    
    // Cache-first strategy (static assets, stable APIs)
    if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(pathname))) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate (content pages)
    if (STALE_WHILE_REVALIDATE_PATTERNS.some(pattern => pattern.test(pathname))) {
      return await staleWhileRevalidate(request);
    }
    
    // Default to network-first for everything else
    return await networkFirst(request);
    
  } catch (error) {
    console.error('[SW] Request handling error:', error);
    return await handleOffline(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await getAppropriateCache(request);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await getCachedResponse(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function cacheFirst(request) {
  const cachedResponse = await getCachedResponse(request);
  
  if (cachedResponse) {
    // Update cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await getAppropriateCache(request);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

async function staleWhileRevalidate(request) {
  const cachedResponse = await getCachedResponse(request);
  
  // Always try to update from network
  const networkResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await getAppropriateCache(request);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network if no cache
  return await networkResponsePromise || handleOffline(request);
}

async function getCachedResponse(request) {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE];
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const response = await cache.match(request);
    if (response) {
      return response;
    }
  }
  
  return null;
}

async function getAppropriateCache(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  if (pathname.startsWith('/api/')) {
    return caches.open(API_CACHE);
  }
  
  if (/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/.test(pathname)) {
    return caches.open(IMAGE_CACHE);
  }
  
  if (STATIC_ASSETS.includes(pathname)) {
    return caches.open(STATIC_CACHE);
  }
  
  return caches.open(DYNAMIC_CACHE);
}

async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await getAppropriateCache(request);
      await cache.put(request, response);
    }
  } catch (error) {
    console.warn('[SW] Background cache update failed:', error);
  }
}

async function handleOffline(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Return offline page for navigation requests
  if (request.mode === 'navigate') {
    const offlineResponse = await caches.match('/offline');
    if (offlineResponse) {
      return offlineResponse;
    }
  }
  
  // Return placeholder for images
  if (/\.(?:png|jpg|jpeg|svg|gif|webp)$/.test(pathname)) {
    const placeholderResponse = await caches.match('/images/offline-placeholder.svg');
    if (placeholderResponse) {
      return placeholderResponse;
    }
  }
  
  // Return offline API response for API requests
  if (pathname.startsWith('/api/')) {
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This feature requires an internet connection',
        offline: true
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 503,
        statusText: 'Service Unavailable'
      }
    );
  }
  
  // Default offline response
  return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'form-submission') {
    event.waitUntil(syncFormSubmissions());
  }
  
  if (event.tag === 'analytics-data') {
    event.waitUntil(syncAnalyticsData());
  }
});

async function syncFormSubmissions() {
  // Handle queued form submissions when back online
  const queuedSubmissions = await getQueuedSubmissions();
  
  for (const submission of queuedSubmissions) {
    try {
      const response = await fetch(submission.url, {
        method: submission.method,
        headers: submission.headers,
        body: submission.body
      });
      
      if (response.ok) {
        await removeQueuedSubmission(submission.id);
        console.log('[SW] Synced queued submission:', submission.id);
      }
    } catch (error) {
      console.warn('[SW] Failed to sync submission:', error);
    }
  }
}

async function syncAnalyticsData() {
  // Handle queued analytics data when back online
  const queuedAnalytics = await getQueuedAnalytics();
  
  for (const data of queuedAnalytics) {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await removeQueuedAnalytics(data.id);
        console.log('[SW] Synced analytics data:', data.id);
      }
    } catch (error) {
      console.warn('[SW] Failed to sync analytics:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    title: 'MitoDerm',
    body: 'You have new updates!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'mitoderm-notification',
    requireInteraction: false,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-action.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-action.png'
      }
    ],
    data: {
      url: '/',
      timestamp: Date.now()
    }
  };
  
  if (event.data) {
    try {
      const payload = event.data.json();
      Object.assign(options, payload);
    } catch (error) {
      console.warn('[SW] Failed to parse push payload:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window if available
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Utility functions for IndexedDB operations
async function getQueuedSubmissions() {
  // Implement IndexedDB operations for queued submissions
  return [];
}

async function removeQueuedSubmission(id) {
  // Implement IndexedDB operations
}

async function getQueuedAnalytics() {
  // Implement IndexedDB operations for queued analytics
  return [];
}

async function removeQueuedAnalytics(id) {
  // Implement IndexedDB operations
}

// Periodic background sync for cache updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-update') {
    event.waitUntil(updateCriticalCaches());
  }
});

async function updateCriticalCaches() {
  console.log('[SW] Updating critical caches...');
  
  const criticalEndpoints = ['/api/products', '/api/events'];
  const cache = await caches.open(API_CACHE);
  
  for (const endpoint of criticalEndpoints) {
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        await cache.put(endpoint, response);
      }
    } catch (error) {
      console.warn(`[SW] Failed to update cache for ${endpoint}:`, error);
    }
  }
}

console.log('[SW] Service Worker loaded');