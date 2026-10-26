export interface Track {
  id: string; // YouTube Video ID
  title: string;
  artist: string;
  thumbnail: string;
  duration: number; // in seconds
  durationFormatted: string;
  youtubeUrl?: string;
  isCurated?: boolean; // added by Subha Admin
  isFeatured?: boolean; // featured on homepage
  addedBy?: string; // username or user email
  addedAt: number;
  category: 'lofi' | 'bengali' | 'edm' | 'trending' | 'pop' | 'custom' | string;
  audioQuality?: 'standard' | 'high' | 'ultra_hd';
  isOfflineCached?: boolean;
}

export interface LoggedInUserRecord {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLoginAt: number;
  loginCount: number;
  deviceInfo: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  trackIds: string[];
  createdBy: string;
  createdByName: string;
  isOfficial?: boolean;
  isPublic: boolean;
  updatedAt: number;
  syncedOffline?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
  savedTrackIds: string[];
  favoriteTrackIds: string[];
  recentTrackIds: string[];
  offlineSyncEnabled: boolean;
  equalizerPreset: string;
  audioQuality: 'standard' | 'high' | 'ultra_hd';
}

export type PlaybackState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';
