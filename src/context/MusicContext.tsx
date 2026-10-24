import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, PlaybackState } from '../types';
import { DEFAULT_TRACKS, DEFAULT_PLAYLISTS } from '../data/defaultTracks';
import { getOfflineTracks } from '../lib/db';
import { downloadTrackForOffline, deleteOfflineTrack } from '../lib/cache';
import { 
  getActiveSyncKey, 
  getActiveRoomCode, 
  setCustomSyncRoom, 
  isRemotePlaybackEnabled, 
  setRemotePlaybackEnabled, 
  pushRealtimeSync, 
  subscribeToRealtimeSync,
  SyncPayload
} from '../lib/realtimeSync';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isBuffering: boolean;
  playbackState: PlaybackState;
  repeatMode: 'off' | 'track' | 'queue';
  isShuffled: boolean;
  queue: Track[];
  queueIndex: number;
  audioQuality: 'standard' | 'high' | 'ultra_hd';
  equalizerPreset: string;
  isOfflineMode: boolean;
  visualizerData: number[];
  
  // Track Collections & Featured
  tracks: Track[];
  playlists: Playlist[];
  savedTrackIds: string[];
  favoriteTrackIds: string[];
  featuredTrackIds: string[];
  downloadProgress: Record<string, number>;
  
  // Player Controls
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlayPause: () => void;
  seekTo: (timeInSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  setAudioQuality: (quality: 'standard' | 'high' | 'ultra_hd') => void;
  setEqualizerPreset: (preset: string) => void;
  toggleOfflineMode: () => void;
  
  // Track and Playlist actions
  addCustomTrack: (track: Track) => Promise<void>;
  toggleFavorite: (trackId: string) => void;
  toggleSaveTrack: (trackId: string) => void;
  toggleOfflineCache: (track: Track) => Promise<void>;
  toggleFeatured: (trackId: string) => void;
  createPlaylist: (title: string, description: string, initialTracks?: string[]) => Playlist;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  deleteTrack: (trackId: string) => void;

  // Real-Time Cross-Device Cloud Sync
  realtimeSyncInfo: {
    isConnected: boolean;
    lastSyncedAt: number;
    lastSyncedDevice: string;
    roomCode: string;
    remotePlaybackActive: boolean;
  };
  setSyncRoomCode: (code: string) => void;
  toggleRemotePlayback: () => void;
  triggerCloudSync: () => Promise<void>;
}

const STORAGE_KEY_CUSTOM_TRACKS = 'smart_subha_custom_tracks';
const STORAGE_KEY_PLAYLISTS = 'smart_subha_playlists';
const STORAGE_KEY_FAVORITES = 'smart_subha_favorites';
const STORAGE_KEY_SAVED = 'smart_subha_saved';
const STORAGE_KEY_FEATURED = 'smart_subha_featured_ids';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [featuredTrackIds, setFeaturedTrackIds] = useState<string[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_FEATURED);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_TRACKS.slice(0, 16).map((t) => t.id);
  });

  const [tracks, setTracks] = useState<Track[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_CUSTOM_TRACKS);
    let allTracks = DEFAULT_TRACKS;
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        allTracks = [...DEFAULT_TRACKS, ...parsed];
      } catch (e) {
        allTracks = DEFAULT_TRACKS;
      }
    }

    return allTracks.map((t) => ({
      ...t,
      isOfflineCached: false,
      isFeatured: featuredTrackIds.includes(t.id),
    }));
  });

  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return DEFAULT_PLAYLISTS;
      }
    }
    return DEFAULT_PLAYLISTS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_FAVORITES);
    return cached ? JSON.parse(cached) : ['RFaUZWdczvk', '8y3-kf7uPMQ', '1E-ZSGWK6g0'];
  });

  const [savedTracks, setSavedTracks] = useState<string[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_SAVED);
    return cached ? JSON.parse(cached) : [];
  });

  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [currentTrack, setCurrentTrack] = useState<Track | null>(DEFAULT_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(DEFAULT_TRACKS[0]?.duration || 225);
  const [volume, setVolumeState] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('unstarted');
  
  // Default repeatMode is 'queue' (NOT single track) so it plays continuously song after song
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'queue'>('queue');
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [queue, setQueue] = useState<Track[]>(DEFAULT_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [audioQuality, setAudioQuality] = useState<'standard' | 'high' | 'ultra_hd'>('ultra_hd');
  const [equalizerPreset, setEqualizerPreset] = useState<string>('Bass Boost');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [visualizerData, setVisualizerData] = useState<number[]>(new Array(32).fill(20));

  const playerRef = useRef<any>(null);
  const ytReadyRef = useRef<boolean>(false);
  const offlineAudioRef = useRef<HTMLAudioElement | null>(null);
  const silentAudioAnchorRef = useRef<HTMLAudioElement | null>(null);
  const isUsingOfflineAudioRef = useRef<boolean>(false);
  const timeUpdateIntervalRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastAdvanceTimeRef = useRef<number>(0);
  const userWantsPlayRef = useRef<boolean>(false);
  const wakeLockSentinelRef = useRef<any>(null);
  const bgResumeTimeoutRef = useRef<any>(null);

  // Real-Time Cross-Device Sync State
  const [syncRoomCode, setSyncRoomCodeState] = useState<string>(() => getActiveRoomCode());
  const [syncKey, setSyncKey] = useState<string>(() => {
    try {
      const userProf = localStorage.getItem('smart_subha_user_profile');
      if (userProf) {
        const parsed = JSON.parse(userProf);
        return getActiveSyncKey(parsed?.email);
      }
    } catch (e) {}
    return getActiveSyncKey();
  });
  const [remotePlaybackActive, setRemotePlaybackActive] = useState<boolean>(() => isRemotePlaybackEnabled());
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(Date.now());
  const [lastSyncedDevice, setLastSyncedDevice] = useState<string>('Cloud Network');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const localLastUpdatedRef = useRef<number>(Date.now());

  // Subscribe to Real-Time Cross-Device Cloud Sync
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeSync(syncKey, (remoteData: SyncPayload) => {
      if (!remoteData || remoteData.lastUpdated <= localLastUpdatedRef.current) {
        return;
      }
      localLastUpdatedRef.current = remoteData.lastUpdated;
      setLastSyncedAt(remoteData.lastUpdated);
      setLastSyncedDevice(remoteData.deviceLabel || 'Other Device');
      setIsConnected(true);

      // Sync Favorites in Real-Time
      if (remoteData.favoriteTrackIds && Array.isArray(remoteData.favoriteTrackIds)) {
        setFavorites(remoteData.favoriteTrackIds);
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(remoteData.favoriteTrackIds));
      }

      // Sync Saved Tracks in Real-Time
      if (remoteData.savedTrackIds && Array.isArray(remoteData.savedTrackIds)) {
        setSavedTracks(remoteData.savedTrackIds);
        localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(remoteData.savedTrackIds));
      }

      // Sync Featured Tracks in Real-Time
      if (remoteData.featuredTrackIds && Array.isArray(remoteData.featuredTrackIds)) {
        setFeaturedTrackIds(remoteData.featuredTrackIds);
        localStorage.setItem(STORAGE_KEY_FEATURED, JSON.stringify(remoteData.featuredTrackIds));
      }

      // Sync Playlists in Real-Time
      if (remoteData.playlists && Array.isArray(remoteData.playlists)) {
        setPlaylists(remoteData.playlists);
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(remoteData.playlists));
      }

      // Sync Custom Tracks in Real-Time
      if (remoteData.customTracks && Array.isArray(remoteData.customTracks)) {
        setTracks((curr) => {
          const defaultIds = new Set(DEFAULT_TRACKS.map((t) => t.id));
          const existingIds = new Set(curr.map((t) => t.id));
          const newRemoteCustom = remoteData.customTracks.filter((t) => !existingIds.has(t.id));
          if (newRemoteCustom.length > 0) {
            const combined = [...newRemoteCustom, ...curr];
            const customOnly = combined.filter((t) => !defaultIds.has(t.id));
            localStorage.setItem(STORAGE_KEY_CUSTOM_TRACKS, JSON.stringify(customOnly));
            return combined;
          }
          return curr;
        });
      }

      // Remote Playback Live Sync (Listen Together mode)
      if (isRemotePlaybackEnabled() && remoteData.activeTrackId) {
        if (currentTrack?.id !== remoteData.activeTrackId) {
          const match = tracks.find((t) => t.id === remoteData.activeTrackId);
          if (match && remoteData.isPlaying) {
            playTrack(match);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [syncKey]);

  // Helper to push state changes to all connected devices in real time
  const syncToCloud = (partial: Partial<SyncPayload> = {}) => {
    const now = Date.now();
    localLastUpdatedRef.current = now;
    setLastSyncedAt(now);
    setLastSyncedDevice('This Device');
    const customOnly = tracks.filter((t) => !DEFAULT_TRACKS.some((dt) => dt.id === t.id));

    pushRealtimeSync({
      favoriteTrackIds: favorites,
      savedTrackIds: savedTracks,
      customTracks: customOnly,
      playlists,
      featuredTrackIds,
      activeTrackId: currentTrack?.id || null,
      isPlaying,
      currentTime,
      roomCode: syncRoomCode,
      ...partial,
    }, syncKey);
  };

  const setSyncRoomCode = (code: string) => {
    const newKey = setCustomSyncRoom(code);
    setSyncRoomCodeState(code.toUpperCase());
    setSyncKey(newKey);
    syncToCloud({ roomCode: code.toUpperCase() });
  };

  const toggleRemotePlayback = () => {
    const next = !remotePlaybackActive;
    setRemotePlaybackActive(next);
    setRemotePlaybackEnabled(next);
  };

  const triggerCloudSync = async () => {
    syncToCloud();
  };

  // Reconcile real offline tracks from IndexedDB
  useEffect(() => {
    const verifyRealOfflineCache = async () => {
      try {
        const offlineTracks = await getOfflineTracks();
        const offlineIds = new Set(offlineTracks.map((t) => t.id));
        setTracks((prev) =>
          prev.map((t) => ({
            ...t,
            isOfflineCached: offlineIds.has(t.id),
            isFeatured: featuredTrackIds.includes(t.id),
          }))
        );
      } catch (e) {
        console.warn('Real offline verification notice:', e);
      }
    };
    verifyRealOfflineCache();
  }, [featuredTrackIds]);

  // Request screen/audio wake lock during playback
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator && !wakeLockSentinelRef.current) {
        wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
        wakeLockSentinelRef.current.addEventListener('release', () => {
          wakeLockSentinelRef.current = null;
        });
      }
    } catch (e) {
      // WakeLock not supported or allowed
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockSentinelRef.current) {
      try {
        wakeLockSentinelRef.current.release();
      } catch (e) {}
      wakeLockSentinelRef.current = null;
    }
  };

  const playSilentAnchor = () => {
    if (silentAudioAnchorRef.current) {
      silentAudioAnchorRef.current.play().catch(() => {});
    }
  };

  const pauseSilentAnchor = () => {
    if (silentAudioAnchorRef.current) {
      silentAudioAnchorRef.current.pause();
    }
  };

  // Keep-alive AudioContext for uninterrupted background playback
  const enableBackgroundAudioKeepAlive = () => {
    playSilentAnchor();
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          gain.gain.value = 0.00001; // Inaudible, keeps audio thread active in background
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          audioContextRef.current = ctx;
        }
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } catch (e) {
      console.warn('Background audio keep-alive note:', e);
    }
  };

  // Resilient background service check: keeps music playing even when screen is locked or tab is switched
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab went to background or screen was locked: maintain audio stream
        enableBackgroundAudioKeepAlive();
        if (userWantsPlayRef.current) {
          playSilentAnchor();
          if (playerRef.current?.getPlayerState) {
            const state = playerRef.current.getPlayerState();
            if (state !== 1) {
              playerRef.current.playVideo();
            }
          }
        }
      } else {
        // Tab returned to active foreground: check state and re-acquire wakelock
        if (userWantsPlayRef.current) {
          requestWakeLock();
          if (playerRef.current?.getPlayerState) {
            const state = playerRef.current.getPlayerState();
            if (state === 2) {
              playerRef.current.playVideo();
            }
          }
        }
      }
    };

    const handleWindowBlur = () => {
      if (userWantsPlayRef.current) {
        playSilentAnchor();
        enableBackgroundAudioKeepAlive();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);

  // Register MediaSession API for OS background & lock-screen playback controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentTrack) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentTrack.title,
          artist: currentTrack.artist,
          album: 'Smart Subha Beats',
          artwork: [
            { src: currentTrack.thumbnail, sizes: '96x96', type: 'image/jpeg' },
            { src: currentTrack.thumbnail, sizes: '128x128', type: 'image/jpeg' },
            { src: currentTrack.thumbnail, sizes: '256x256', type: 'image/jpeg' },
            { src: currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' },
          ]
        });

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => {
          userWantsPlayRef.current = true;
          togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          userWantsPlayRef.current = false;
          togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          userWantsPlayRef.current = false;
          togglePlayPause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) seekTo(details.seekTime);
        });
        navigator.mediaSession.setActionHandler('seekforward', (details) => {
          const skip = details.seekOffset || 10;
          seekTo(Math.min(duration, currentTime + skip));
        });
        navigator.mediaSession.setActionHandler('seekbackward', (details) => {
          const skip = details.seekOffset || 10;
          seekTo(Math.max(0, currentTime - skip));
        });

        if ('setPositionState' in navigator.mediaSession && duration > 0 && currentTime >= 0) {
          navigator.mediaSession.setPositionState({
            duration: Math.max(0, duration),
            playbackRate: 1,
            position: Math.min(duration, Math.max(0, currentTime)),
          });
        }
      } catch (e) {
        console.warn('MediaSession notice:', e);
      }
    }
  }, [currentTrack, isPlaying, duration, currentTime]);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    const checkYT = () => {
      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        setTimeout(checkYT, 300);
      }
    };

    const initPlayer = () => {
      if (playerRef.current) return;
      try {
        playerRef.current = new window.YT.Player('subha-hidden-yt-player', {
          height: '240',
          width: '240',
          videoId: currentTrack ? currentTrack.id : DEFAULT_TRACKS[0].id,
          playerVars: {
            playsinline: 1,
            controls: 0,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            rel: 0,
            autoplay: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              ytReadyRef.current = true;
              event.target.setVolume(volume);
            },
            onStateChange: (event: any) => {
              // event.data: 0 = ENDED, 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING
              switch (event.data) {
                case 1:
                  setIsPlaying(true);
                  setIsBuffering(false);
                  setPlaybackState('playing');
                  userWantsPlayRef.current = true;
                  enableBackgroundAudioKeepAlive();
                  requestWakeLock();
                  if (playerRef.current?.getDuration) {
                    const dur = playerRef.current.getDuration();
                    if (dur > 0) setDuration(dur);
                  }
                  break;
                case 2:
                  // If browser backgrounding/screen lock throttled the video but user didn't hit pause
                  if (userWantsPlayRef.current) {
                    if (bgResumeTimeoutRef.current) clearTimeout(bgResumeTimeoutRef.current);
                    bgResumeTimeoutRef.current = setTimeout(() => {
                      if (userWantsPlayRef.current && playerRef.current?.playVideo) {
                        playerRef.current.playVideo();
                        playSilentAnchor();
                      }
                    }, 120);
                    // Keep active playing state in UI & lock screen
                    setIsPlaying(true);
                    setPlaybackState('playing');
                  } else {
                    // Genuine user pause
                    setIsPlaying(false);
                    setIsBuffering(false);
                    setPlaybackState('paused');
                    pauseSilentAnchor();
                    releaseWakeLock();
                  }
                  break;
                case 3:
                  setIsBuffering(true);
                  setPlaybackState('buffering');
                  break;
                case 0:
                  // SONG ENDED: Immediately advance to next song sequentially!
                  setIsPlaying(false);
                  setPlaybackState('ended');
                  handleTrackEnded();
                  break;
                default:
                  break;
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Player notice, advancing to next song:', err);
              setIsBuffering(false);
              setTimeout(() => playNext(), 1000);
            }
          }
        });
      } catch (err) {
        console.warn('Failed to init YT player:', err);
      }
    };

    checkYT();

    return () => {
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (bgResumeTimeoutRef.current) clearTimeout(bgResumeTimeoutRef.current);
      releaseWakeLock();
    };
  }, []);

  // Update current playback time and watchdog for smooth auto-advance
  useEffect(() => {
    if (isPlaying) {
      timeUpdateIntervalRef.current = setInterval(() => {
        if (playerRef.current && playerRef.current.getCurrentTime) {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time || 0);

          // Watchdog: If track is within 0.8s of end and hasn't triggered event 0, advance to next
          if (duration > 5 && time >= duration - 0.8) {
            handleTrackEnded();
          }
        }
      }, 500);
    } else {
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
    }
    return () => {
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
    };
  }, [isPlaying, duration]);

  // Dynamic Audio Visualizer frequency simulation
  useEffect(() => {
    let phase = 0;
    const generateVisualizerFrame = () => {
      if (isPlaying) {
        phase += 0.15;
        const bars: number[] = [];
        for (let i = 0; i < 32; i++) {
          const bassBoost = i < 8 ? 1.6 : 1.0;
          const noise = Math.sin(phase + i * 0.4) * Math.cos(phase * 0.7 + i * 0.2);
          const raw = 35 + noise * 30 * bassBoost + (Math.random() * 15);
          bars.push(Math.max(10, Math.min(100, raw)));
        }
        setVisualizerData(bars);
      } else {
        setVisualizerData((prev) => prev.map((v) => Math.max(12, v * 0.92)));
      }
      animFrameRef.current = requestAnimationFrame(generateVisualizerFrame);
    };

    animFrameRef.current = requestAnimationFrame(generateVisualizerFrame);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Smart Auto-Advance: Once a song ends, do NOT repeat it; play the next song in sequence!
  const handleTrackEnded = () => {
    const now = Date.now();
    if (now - lastAdvanceTimeRef.current < 1800) {
      return; // Prevent duplicate rapid skip triggers
    }
    lastAdvanceTimeRef.current = now;

    if (repeatMode === 'track') {
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      // Advance to next song in queue continuously
      playNext();
    }
  };

  const playTrack = (track: Track, newQueue?: Track[]) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    const targetQueue = newQueue || queue;
    if (newQueue) {
      setQueue(newQueue);
    }
    const idx = targetQueue.findIndex((t) => t.id === track.id);
    setQueueIndex(idx !== -1 ? idx : 0);

    enableBackgroundAudioKeepAlive();

    const shouldUseOfflineAudio = isOfflineMode || !navigator.onLine || (track.isOfflineCached && (!playerRef.current || !navigator.onLine));

    if (shouldUseOfflineAudio) {
      isUsingOfflineAudioRef.current = true;
      if (playerRef.current?.pauseVideo) {
        try { playerRef.current.pauseVideo(); } catch (e) {}
      }
      if (!offlineAudioRef.current) {
        offlineAudioRef.current = new Audio();
      }
      const audio = offlineAudioRef.current;
      audio.preload = 'auto';
      audio.src = `/offline-audio/${track.id}`;
      audio.volume = isMuted ? 0 : volume / 100;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        }
      };
      audio.ontimeupdate = () => {
        setCurrentTime(audio.currentTime);
      };
      audio.onended = () => {
        handleTrackEnded();
      };
      audio.onerror = () => {
        console.warn('Offline audio notice, trying next track');
        setTimeout(() => playNext(), 800);
      };

      audio.play().then(() => {
        userWantsPlayRef.current = true;
        playSilentAnchor();
        requestWakeLock();
        setIsPlaying(true);
        setPlaybackState('playing');
      }).catch((err) => {
        console.warn('Audio play request notice:', err);
      });
    } else {
      userWantsPlayRef.current = true;
      playSilentAnchor();
      requestWakeLock();
      isUsingOfflineAudioRef.current = false;
      if (offlineAudioRef.current) {
        try { offlineAudioRef.current.pause(); } catch (e) {}
      }
      if (playerRef.current && playerRef.current.loadVideoById) {
        playerRef.current.loadVideoById(track.id);
        playerRef.current.playVideo();
        setIsPlaying(true);
      } else {
        console.warn('Player loading video queue');
      }
    }
  };

  const togglePlayPause = () => {
    enableBackgroundAudioKeepAlive();
    if (isUsingOfflineAudioRef.current && offlineAudioRef.current) {
      if (isPlaying) {
        userWantsPlayRef.current = false;
        pauseSilentAnchor();
        releaseWakeLock();
        offlineAudioRef.current.pause();
        setIsPlaying(false);
        setPlaybackState('paused');
      } else {
        userWantsPlayRef.current = true;
        playSilentAnchor();
        requestWakeLock();
        offlineAudioRef.current.play();
        setIsPlaying(true);
        setPlaybackState('playing');
      }
      return;
    }

    if (!playerRef.current) return;
    if (isPlaying) {
      userWantsPlayRef.current = false;
      pauseSilentAnchor();
      releaseWakeLock();
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      setPlaybackState('paused');
    } else {
      userWantsPlayRef.current = true;
      playSilentAnchor();
      requestWakeLock();
      playerRef.current.playVideo();
      setIsPlaying(true);
      setPlaybackState('playing');
    }
  };

  const seekTo = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    if (isUsingOfflineAudioRef.current && offlineAudioRef.current) {
      offlineAudioRef.current.currentTime = timeInSeconds;
      return;
    }
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (offlineAudioRef.current) {
      offlineAudioRef.current.volume = isMuted ? 0 : vol / 100;
    }
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(vol);
      if (vol > 0 && isMuted) {
        setIsMuted(false);
        playerRef.current.unMute();
      }
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (offlineAudioRef.current) offlineAudioRef.current.volume = volume / 100;
      if (playerRef.current && playerRef.current.unMute) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } else {
      setIsMuted(true);
      if (offlineAudioRef.current) offlineAudioRef.current.volume = 0;
      if (playerRef.current && playerRef.current.mute) {
        playerRef.current.mute();
      }
    }
  };

  // Continuous sequential autoplay
  const playNext = () => {
    if (queue.length === 0) return;
    let nextIdx: number;
    if (isShuffled && queue.length > 1) {
      // Choose random song different from current index
      do {
        nextIdx = Math.floor(Math.random() * queue.length);
      } while (nextIdx === queueIndex);
    } else {
      // Step to next consecutive song (loops back to start of queue smoothly)
      nextIdx = (queueIndex + 1) % queue.length;
    }
    setQueueIndex(nextIdx);
    const nextTrack = queue[nextIdx];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  };

  const playPrevious = () => {
    if (queue.length === 0) return;
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    const prevIdx = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIdx);
    playTrack(queue[prevIdx]);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('queue');
    else if (repeatMode === 'queue') setRepeatMode('track');
    else setRepeatMode('off');
  };

  const toggleShuffle = () => {
    setIsShuffled((prev) => !prev);
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode((prev) => !prev);
  };

  // Real offline caching implementation
  const toggleOfflineCache = async (track: Track) => {
    const isAlreadyCached = !!track.isOfflineCached;

    if (isAlreadyCached) {
      await deleteOfflineTrack(track.id, track.thumbnail);
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, isOfflineCached: false } : t))
      );
      setDownloadProgress((prev) => {
        const copy = { ...prev };
        delete copy[track.id];
        return copy;
      });
    } else {
      setDownloadProgress((prev) => ({ ...prev, [track.id]: 10 }));
      
      const success = await downloadTrackForOffline(track, (p) => {
        setDownloadProgress((prev) => ({ ...prev, [track.id]: p }));
      });

      if (success) {
        setTracks((prev) =>
          prev.map((t) => (t.id === track.id ? { ...t, isOfflineCached: true } : t))
        );
        setTimeout(() => {
          setDownloadProgress((prev) => {
            const copy = { ...prev };
            delete copy[track.id];
            return copy;
          });
        }, 1200);
      } else {
        setDownloadProgress((prev) => {
          const copy = { ...prev };
          delete copy[track.id];
          return copy;
        });
        alert('Could not save offline audio. Check storage permissions.');
      }
    }
  };

  // Toggle Featured status (for Admin)
  const toggleFeatured = (trackId: string) => {
    setFeaturedTrackIds((prev) => {
      const isCurrentlyFeatured = prev.includes(trackId);
      const next = isCurrentlyFeatured ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY_FEATURED, JSON.stringify(next));

      setTracks((currTracks) =>
        currTracks.map((t) => (t.id === trackId ? { ...t, isFeatured: !isCurrentlyFeatured } : t))
      );

      syncToCloud({ featuredTrackIds: next });
      return next;
    });
  };

  const addCustomTrack = async (newTrack: Track) => {
    const updated = [newTrack, ...tracks];
    setTracks(updated);
    
    const customOnly = updated.filter((t) => !DEFAULT_TRACKS.some((dt) => dt.id === t.id));
    localStorage.setItem(STORAGE_KEY_CUSTOM_TRACKS, JSON.stringify(customOnly));

    if (newTrack.isFeatured) {
      toggleFeatured(newTrack.id);
    } else {
      syncToCloud({ customTracks: customOnly });
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      syncToCloud({ favoriteTrackIds: next });
      return next;
    });
  };

  const toggleSaveTrack = (trackId: string) => {
    setSavedTracks((prev) => {
      const next = prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(next));
      syncToCloud({ savedTrackIds: next });
      return next;
    });
  };

  const createPlaylist = (title: string, description: string, initialTracks?: string[]): Playlist => {
    const newPlaylist: Playlist = {
      id: 'pl_' + Date.now(),
      title,
      description,
      trackIds: initialTracks || [],
      createdBy: 'user',
      createdByName: 'My Playlist',
      isPublic: true,
      updatedAt: Date.now(),
      syncedOffline: false,
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    };
    const updated = [newPlaylist, ...playlists];
    setPlaylists(updated);
    localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    syncToCloud({ playlists: updated });
    return newPlaylist;
  };

  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists((prev) => {
      const next = prev.map((pl) => {
        if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId], updatedAt: Date.now() };
        }
        return pl;
      });
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(next));
      syncToCloud({ playlists: next });
      return next;
    });
  };

  const deleteTrack = (trackId: string) => {
    const updated = tracks.filter((t) => t.id !== trackId);
    setTracks(updated);
    const customOnly = updated.filter((t) => !DEFAULT_TRACKS.some((dt) => dt.id === t.id));
    localStorage.setItem(STORAGE_KEY_CUSTOM_TRACKS, JSON.stringify(customOnly));
    syncToCloud({ customTracks: customOnly });
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isBuffering,
        playbackState,
        repeatMode,
        isShuffled,
        queue,
        queueIndex,
        audioQuality,
        equalizerPreset,
        isOfflineMode,
        visualizerData,
        tracks: isOfflineMode ? tracks.filter((t) => t.isOfflineCached) : tracks,
        playlists,
        savedTrackIds: savedTracks,
        favoriteTrackIds: favorites,
        featuredTrackIds,
        downloadProgress,
        playTrack,
        togglePlayPause,
        seekTo,
        setVolume,
        toggleMute,
        playNext,
        playPrevious,
        toggleRepeat,
        toggleShuffle,
        setAudioQuality,
        setEqualizerPreset,
        toggleOfflineMode,
        addCustomTrack,
        toggleFavorite,
        toggleSaveTrack,
        toggleOfflineCache,
        toggleFeatured,
        createPlaylist,
        addTrackToPlaylist,
        deleteTrack,
        realtimeSyncInfo: {
          isConnected,
          lastSyncedAt,
          lastSyncedDevice,
          roomCode: syncRoomCode,
          remotePlaybackActive,
        },
        setSyncRoomCode,
        toggleRemotePlayback,
        triggerCloudSync,
      }}
    >
      {/* Background audio silent anchor element keeps the Android/iOS media player session and lock-screen active */}
      <audio
        ref={silentAudioAnchorRef}
        loop
        playsInline
        preload="auto"
        src="data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAA="
        style={{ position: 'fixed', opacity: 0, pointerEvents: 'none', zIndex: -9999 }}
      />

      {/* Hidden YouTube audio player rendered with active viewport size to prevent background throttling */}
      <div 
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: 240,
          height: 240,
          opacity: 0.001,
          pointerEvents: 'none',
          zIndex: -9999,
          transform: 'translate3d(-2000px, 0, 0)',
        }}
      >
        <div id="subha-hidden-yt-player"></div>
      </div>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
