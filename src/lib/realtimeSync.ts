import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Track, Playlist } from '../types';

export interface SyncPayload {
  syncKey: string;
  roomCode: string;
  favoriteTrackIds: string[];
  savedTrackIds: string[];
  customTracks: Track[];
  playlists: Playlist[];
  featuredTrackIds: string[];
  activeTrackId: string | null;
  isPlaying: boolean;
  currentTime: number;
  lastUpdated: number;
  deviceLabel: string;
}

const STORAGE_SYNC_KEY = 'smart_subha_sync_key';
const STORAGE_SYNC_ROOM = 'smart_subha_sync_room_code';
const STORAGE_REMOTE_PLAYBACK = 'smart_subha_remote_playback_enabled';
const BROADCAST_CHANNEL_NAME = 'smart_subha_realtime_sync_channel';

// Setup local broadcast channel for 0ms same-device / multi-window sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

// Generate human-friendly 6-digit sync PIN or room code
export const generateRoomCode = (): string => {
  const pin = Math.floor(100000 + Math.random() * 900000).toString();
  return pin;
};

// Detect friendly device name (e.g. "Android Mobile", "Windows PC", "iPhone", "Mac")
export const getDeviceLabel = (): string => {
  if (typeof navigator === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'Android Device';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'Apple iOS Device';
  if (/Windows/i.test(ua)) return 'Windows PC';
  if (/Mac/i.test(ua)) return 'macOS Workstation';
  if (/Linux/i.test(ua)) return 'Linux Machine';
  return 'Smart Beats Client';
};

// Get or initialize persistent Sync Key
export const getActiveSyncKey = (userEmail?: string | null): string => {
  if (userEmail && userEmail.trim().length > 0) {
    const sanitized = userEmail.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `user_${sanitized}`;
  }
  const cached = localStorage.getItem(STORAGE_SYNC_KEY);
  if (cached) return cached;
  const newKey = `room_${generateRoomCode()}`;
  localStorage.setItem(STORAGE_SYNC_KEY, newKey);
  return newKey;
};

export const getActiveRoomCode = (): string => {
  const cached = localStorage.getItem(STORAGE_SYNC_ROOM);
  if (cached) return cached;
  const code = 'SUBHA-7742';
  localStorage.setItem(STORAGE_SYNC_ROOM, code);
  return code;
};

export const setCustomSyncRoom = (code: string): string => {
  const clean = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  const key = `room_${clean}`;
  localStorage.setItem(STORAGE_SYNC_KEY, key);
  localStorage.setItem(STORAGE_SYNC_ROOM, clean);
  return key;
};

// Check if Remote Playback / Listen Together is enabled
export const isRemotePlaybackEnabled = (): boolean => {
  return localStorage.getItem(STORAGE_REMOTE_PLAYBACK) === 'true';
};

export const setRemotePlaybackEnabled = (enabled: boolean): void => {
  localStorage.setItem(STORAGE_REMOTE_PLAYBACK, enabled ? 'true' : 'false');
};

// Push local state update to Cloud Firestore and local BroadcastChannel
let debounceTimer: any = null;

export const pushRealtimeSync = async (payload: Partial<SyncPayload>, syncKey: string): Promise<boolean> => {
  if (!syncKey) return false;

  const deviceLabel = getDeviceLabel();
  const fullPayload = {
    ...payload,
    syncKey,
    deviceLabel,
    lastUpdated: Date.now(),
  };

  // 1. Instant local BroadcastChannel broadcast (0ms across tabs/PWA)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(fullPayload);
    } catch (e) {
      console.warn('BroadcastChannel post notice:', e);
    }
  }

  // 2. Cloud Firestore Realtime Sync (across phones, PCs, tablets)
  return new Promise((resolve) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      try {
        if (db) {
          const docRef = doc(db, 'device_sync_rooms', syncKey);
          await setDoc(docRef, fullPayload, { merge: true });
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.warn('Firestore realtime sync push notice:', err);
        resolve(false);
      }
    }, 250);
  });
};

// Listen to incoming real-time updates from other devices via Firestore snapshot & BroadcastChannel
export const subscribeToRealtimeSync = (
  syncKey: string,
  onRemoteUpdate: (data: SyncPayload) => void
): (() => void) => {
  let unsubscribeFirestore = () => {};

  // 1. Subscribe to Cloud Firestore snapshot listener
  try {
    if (db && syncKey) {
      const docRef = doc(db, 'device_sync_rooms', syncKey);
      unsubscribeFirestore = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SyncPayload;
          onRemoteUpdate(data);
        }
      }, (error) => {
        console.warn('Firestore snapshot listener note:', error);
      });
    }
  } catch (err) {
    console.warn('Error setting up Firestore listener:', err);
  }

  // 2. Subscribe to local BroadcastChannel
  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data && event.data.syncKey === syncKey) {
      onRemoteUpdate(event.data as SyncPayload);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  return () => {
    unsubscribeFirestore();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
};

export interface AdminGlobalPayload {
  allTracks?: Track[];
  customTracks: Track[];
  deletedTrackIds?: string[];
  featuredTrackIds: string[];
  playlists: Playlist[];
  announcement?: string;
  lastUpdated: number;
  updatedBy: string;
}

export const pushAdminGlobalSync = async (payload: Partial<AdminGlobalPayload>): Promise<boolean> => {
  try {
    if (db) {
      const docRef = doc(db, 'admin_master_broadcast', 'global');
      await setDoc(docRef, {
        ...payload,
        lastUpdated: Date.now(),
        updatedBy: 'SUBHA MASTER ADMIN',
      }, { merge: true });

      // Also broadcast locally across all tabs and PWA instances
      if (broadcastChannel) {
        broadcastChannel.postMessage({
          type: 'ADMIN_GLOBAL_SYNC',
          data: payload,
          lastUpdated: Date.now(),
        });
      }
      return true;
    }
  } catch (err) {
    console.warn('Admin global sync push notice:', err);
  }
  return false;
};

export const subscribeToAdminGlobalSync = (
  onAdminUpdate: (data: AdminGlobalPayload) => void
): (() => void) => {
  let unsubscribeFirestore = () => {};

  try {
    if (db) {
      const docRef = doc(db, 'admin_master_broadcast', 'global');
      unsubscribeFirestore = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as AdminGlobalPayload;
          onAdminUpdate(data);
        }
      }, (err) => {
        console.warn('Admin snapshot error:', err);
      });
    }
  } catch (e) {
    console.warn('Error setting up admin global listener:', e);
  }

  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === 'ADMIN_GLOBAL_SYNC' && event.data.data) {
      onAdminUpdate(event.data.data as AdminGlobalPayload);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  return () => {
    unsubscribeFirestore();
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
};

