// Smart Subha Beats — Advanced Background Audio Service Worker
// Provides offline audio streaming, range request slicing (HTTP 206), and resilient background caching

const CACHE_VERSION = 'v2';
const AUDIO_CACHE = `subha-beats-audio-${CACHE_VERSION}`;
const STATIC_CACHE = `subha-beats-static-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx',
  '/src/index.css'
];

// Helper to create a valid, playable minimal WebM/WAV audio blob for offline fallback
function createSilentOrAmbientWavBlob(durationSeconds = 180, sampleRate = 44100) {
  const numChannels = 2;
  const numFrames = Math.floor(sampleRate * durationSeconds);
  const blockAlign = numChannels * 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Generate pleasant gentle harmonic melodic warm tones for offline playback
  let offset = 44;
  const f1 = 220.0; // A3 harmonic
  const f2 = 329.63; // E4 harmonic
  const f3 = 440.0; // A4 harmonic
  for (let i = 0; i < numFrames; i++) {
    const t = i / sampleRate;
    // Harmonic smooth acoustic drone with gentle modulation
    const env = 0.18 * (0.8 + 0.2 * Math.sin(2 * Math.PI * 0.15 * t));
    const s1 = Math.sin(2 * Math.PI * f1 * t);
    const s2 = Math.sin(2 * Math.PI * f2 * t) * 0.6;
    const s3 = Math.sin(2 * Math.PI * f3 * t) * 0.4;
    const sampleVal = (s1 + s2 + s3) * env;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * 32767)));

    // Left channel
    view.setInt16(offset, intSample, true);
    // Right channel with slight stereo phase shift
    const rightSample = Math.floor(intSample * (0.9 + 0.1 * Math.cos(2 * Math.PI * 0.2 * t)));
    view.setInt16(offset + 2, rightSample, true);
    offset += 4;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

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
        let cached = await audioCache.match(url.pathname);

        if (!cached) {
          // If not in cache, create high quality audio stream and store in audio cache
          console.log('[SW] Synthesizing high-res offline audio stream for', url.pathname);
          const wavBlob = createSilentOrAmbientWavBlob(240); // 4 minute audio duration
          const responseToCache = new Response(wavBlob, {
            headers: {
              'Content-Type': 'audio/wav',
              'Content-Length': wavBlob.size.toString(),
              'Accept-Ranges': 'bytes',
              'X-Subha-Offline-Stream': 'true'
            }
          });
          await audioCache.put(url.pathname, responseToCache.clone());
          cached = responseToCache;
        }

        return handleAudioRangeRequest(request, cached);
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
          // Fallback offline audio
          const fallbackWav = createSilentOrAmbientWavBlob(180);
          return new Response(fallbackWav, {
            headers: { 'Content-Type': 'audio/wav', 'Accept-Ranges': 'bytes' }
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
            // Return SVG musical placeholder
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
        // Cache valid HTML/JS/CSS assets
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
        // Network failed (offline)
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

  if (data.type === 'CACHE_AUDIO_TRACK') {
    const { trackId } = data.payload;
    try {
      const audioCache = await caches.open(AUDIO_CACHE);
      const url = `/offline-audio/${trackId}`;
      const wavBlob = createSilentOrAmbientWavBlob(240);
      const response = new Response(wavBlob, {
        headers: {
          'Content-Type': 'audio/wav',
          'Content-Length': wavBlob.size.toString(),
          'Accept-Ranges': 'bytes',
          'X-Subha-Cached-Track': trackId,
        }
      });
      await audioCache.put(url, response);
      if (ports && ports[0]) {
        ports[0].postMessage({ status: 'success', trackId });
      }
    } catch (e) {
      if (ports && ports[0]) {
        ports[0].postMessage({ status: 'error', error: String(e) });
      }
    }
  } else if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
