// Smart Subha Beats — Advanced Background Audio Service Worker
// Provides offline audio streaming, range request slicing (HTTP 206), and resilient background caching

const CACHE_VERSION = 'v3';
const AUDIO_CACHE = `subha-beats-audio-${CACHE_VERSION}`;
const STATIC_CACHE = `subha-beats-static-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon.svg',
  '/maskable-icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Precache partial error (ignored):', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== AUDIO_CACHE && key !== STATIC_CACHE)
            .map((key) => caches.delete(key))
        );
      })
    ])
  );
});

// Handle Range Requests for HTML5 Audio playback (HTTP 206 Partial Content)
async function handleAudioRangeRequest(request, cachedResponse) {
  const rangeHeader = request.headers.get('range');
  if (!rangeHeader) {
    return cachedResponse;
  }

  const arrayBuffer = await cachedResponse.arrayBuffer();
  const totalLength = arrayBuffer.byteLength;

  const match = /bytes=(\d+)-(\d+)?/.exec(rangeHeader);
  if (!match) {
    return cachedResponse;
  }

  const start = parseInt(match[1], 10);
  const end = match[2] ? parseInt(match[2], 10) : totalLength - 1;
  const safeEnd = Math.min(end, totalLength - 1);
  const chunkLength = safeEnd - start + 1;

  const slicedData = arrayBuffer.slice(start, safeEnd + 1);

  return new Response(slicedData, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Content-Type': cachedResponse.headers.get('Content-Type') || 'audio/wav',
      'Content-Range': `bytes ${start}-${safeEnd}/${totalLength}`,
      'Content-Length': chunkLength.toString(),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000'
    }
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Intercept Offline Audio Requests: /offline-audio/:id
  if (url.pathname.startsWith('/offline-audio/')) {
    event.respondWith(
      (async () => {
        const audioCache = await caches.open(AUDIO_CACHE);
        const cached = await audioCache.match(url.pathname);
        if (cached) {
          return handleAudioRangeRequest(request, cached);
        }
        return new Response('Offline audio requires internet connection for YouTube streaming.', {
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      })()
    );
    return;
  }

  // 2. Intercept audio/video or media extensions
  if (
    request.destination === 'audio' ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.wav') ||
    url.pathname.endsWith('.webm') ||
    url.pathname.endsWith('.m4a')
  ) {
    event.respondWith(
      (async () => {
        const audioCache = await caches.open(AUDIO_CACHE);
        const cached = await audioCache.match(request);
        if (cached) {
          return handleAudioRangeRequest(request, cached);
        }
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            audioCache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return new Response('Audio file unavailable offline.', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      })()
    );
    return;
  }

  // 3. Cache YouTube Thumbnails for offline view
  if (url.hostname.includes('ytimg.com') || url.hostname.includes('youtube.com')) {
    if (url.pathname.includes('/vi/') || url.pathname.includes('hqdefault') || url.pathname.includes('maxresdefault')) {
      event.respondWith(
        (async () => {
          const staticCache = await caches.open(STATIC_CACHE);
          const cached = await staticCache.match(request);
          if (cached) return cached;
          try {
            const res = await fetch(request, { mode: 'no-cors' });
            if (res) staticCache.put(request, res.clone());
            return res;
          } catch (e) {
            if (cached) return cached;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360" viewBox="0 0 480 360"><rect width="100%" height="100%" fill="#111827"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8B5CF6" font-family="sans-serif" font-size="24" font-weight="bold">Smart Subha Beats (Offline)</text></svg>`;
            return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
          }
        })()
      );
      return;
    }
  }

  // 4. Default network-first for navigation and shell, with cache fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          request.method === 'GET' &&
          !url.pathname.startsWith('/api') &&
          !url.hostname.includes('firebase') &&
          !url.hostname.includes('firestore')
        ) {
          const cache = await caches.open(STATIC_CACHE);
          cache.put(request, networkResponse.clone()).catch(() => {});
        }
        return networkResponse;
      } catch (err) {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
        }
        throw err;
      }
    })()
  );
});

// Communication with client app
self.addEventListener('message', async (event) => {
  const { data, ports } = event;
  if (!data) return;
  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
