import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, PlaybackState } from '../types';
import { DEFAULT_TRACKS, DEFAULT_PLAYLISTS } from '../data/defaultTracks';
import { getOfflineTracks } from '../lib/db';
import { downloadTrackForOffline, deleteOfflineTrack } from '../lib/cache';

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
  const timeUpdateIntervalRef = useRef<any>(null);
  const animFrameRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  // Keep-alive AudioContext for uninterrupted background playback
  const enableBackgroundAudioKeepAlive = () => {
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

        navigator.mediaSession.setActionHandler('play', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('pause', () => togglePlayPause());
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrevious());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNext());
        navigator.mediaSession.setActionHandler('seekto', (details) => {
          if (details.seekTime !== undefined) seekTo(details.seekTime);
        });
      } catch (e) {
        console.warn('MediaSession notice:', e);
      }
    }
  }, [currentTrack, isPlaying]);

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
          height: '2',
          width: '2',
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
                  enableBackgroundAudioKeepAlive();
                  if (playerRef.current?.getDuration) {
                    const dur = playerRef.current.getDuration();
                    if (dur > 0) setDuration(dur);
                  }
                  break;
                case 2:
                  setIsPlaying(false);
                  setIsBuffering(false);
                  setPlaybackState('paused');
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
              // Auto-advance if track is blocked/unavailable
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

  // Requirement: Once a song ends, do NOT repeat it; play the next song in sequence!
  const handleTrackEnded = () => {
    if (repeatMode === 'track') {
      if (playerRef.current && playerRef.current.seekTo) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      // Advance to next song in queue
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

    if (playerRef.current && playerRef.current.loadVideoById) {
      playerRef.current.loadVideoById(track.id);
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else {
      console.warn('Player loading video queue');
    }
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    enableBackgroundAudioKeepAlive();
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const seekTo = (timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(timeInSeconds, true);
    }
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(vol);
      if (vol > 0 && isMuted) {
        setIsMuted(false);
        playerRef.current.unMute();
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  // Continuous sequential autoplay
  const playNext = () => {
    if (queue.length === 0) return;
    let nextIdx: number;
    if (isShuffled) {
      // Choose random index different from current
      nextIdx = (queueIndex + 1 + Math.floor(Math.random() * (queue.length - 1))) % queue.length;
    } else {
      // Step to next consecutive song
      nextIdx = (queueIndex + 1) % queue.length;
    }
    setQueueIndex(nextIdx);
    playTrack(queue[nextIdx]);
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
    }
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      return next;
    });
  };

  const toggleSaveTrack = (trackId: string) => {
    setSavedTracks((prev) => {
      const next = prev.includes(trackId) ? prev.filter((id) => id !== trackId) : [...prev, trackId];
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(next));
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
      return next;
    });
  };

  const deleteTrack = (trackId: string) => {
    const updated = tracks.filter((t) => t.id !== trackId);
    setTracks(updated);
    const customOnly = updated.filter((t) => !DEFAULT_TRACKS.some((dt) => dt.id === t.id));
    localStorage.setItem(STORAGE_KEY_CUSTOM_TRACKS, JSON.stringify(customOnly));
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
      }}
    >
      {/* Background audio container with proper non-zero dimensions & audio session */}
      <div 
        style={{
          position: 'fixed',
          bottom: 2,
          right: 2,
          width: 4,
          height: 4,
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -9999,
          overflow: 'hidden'
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
