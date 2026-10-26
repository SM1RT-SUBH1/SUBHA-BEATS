import { Track } from '../types';
import { saveTrackOffline, removeTrackOffline, getOfflineTracks } from './db';

const AUDIO_CACHE_NAME = 'subha-beats-audio-v2';
const STATIC_CACHE_NAME = 'subha-beats-static-v2';

export interface DownloadProgress {
  trackId: string;
  progress: number; // 0 to 100
  status: 'idle' | 'downloading' | 'completed' | 'error';
}

/**
 * Cache track metadata and artwork in IndexedDB and CacheStorage for offline access.
 * Does not synthesize fake frequency tones. Real audio streams via YouTube when connected.
 */
export async function downloadTrackForOffline(
  track: Track,
  onProgress?: (progress: number) => void
): Promise<boolean> {
  try {
    if (onProgress) onProgress(20);

    // 1. Fetch thumbnail image and cache it in Static Cache
    if ('caches' in window) {
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      try {
        const thumbResponse = await fetch(track.thumbnail, { mode: 'no-cors' });
        await staticCache.put(track.thumbnail, thumbResponse);
      } catch (err) {
        console.warn('Could not cache thumbnail image, continuing offline save:', err);
      }
    }

    if (onProgress) onProgress(60);

    // 2. Inform Service Worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_AUDIO_TRACK',
        payload: { trackId: track.id, title: track.title, artist: track.artist }
      });
    }

    if (onProgress) onProgress(85);

    // 3. Save full track metadata to IndexedDB for offline library persistence
    await saveTrackOffline({
      ...track,
      isOfflineCached: true,
    });

    if (onProgress) onProgress(100);
    return true;
  } catch (error) {
    console.error('Offline caching failed for track:', track.id, error);
    return false;
  }
}

/**
 * Remove cached audio and metadata from CacheStorage and IndexedDB
 */
export async function deleteOfflineTrack(trackId: string, thumbnailUrl?: string): Promise<void> {
  try {
    if ('caches' in window) {
      const audioCache = await caches.open(AUDIO_CACHE_NAME);
      await audioCache.delete(`/offline-audio/${trackId}`);
      if (thumbnailUrl) {
        const staticCache = await caches.open(STATIC_CACHE_NAME);
        await staticCache.delete(thumbnailUrl);
      }
    }
    await removeTrackOffline(trackId);
  } catch (e) {
    console.warn('Error deleting offline cache:', e);
  }
}
