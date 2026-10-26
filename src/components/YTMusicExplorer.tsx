import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Play, 
  Pause, 
  Plus, 
  Zap, 
  Disc3, 
  Loader2, 
  X, 
  ExternalLink, 
  Music, 
  Check, 
  Sparkles 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

const QUICK_SEARCH_CHIPS = [
  'Arijit Singh Latest',
  'Coke Studio Bangla',
  'Shreya Ghoshal Hits',
  'Jeet Gannguli Melodies',
  'Anupam Roy Songs',
  'Fossils Rupam Islam',
  'Bollywood Romantic Songs',
  'Ed Sheeran Top Tracks',
  'Lofi Chill Hindi Beats',
  'Rabindra Sangeet Acoustic',
];

interface YTResultItem {
  id: string;
  title: string;
  artist: string;
  durationFormatted: string;
  duration: number;
  thumbnail: string;
  category: string;
}

export const YTMusicExplorer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    addCustomTrack, 
    addTrackToYtPlaylist,
    ytSavedTracks 
  } = useMusic();
  const { currentTheme } = useTheme();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<YTResultItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Set of IDs already in YouTube saved playlist
  const ytSavedSet = useMemo(() => new Set(ytSavedTracks.map((t) => t.id)), [ytSavedTracks]);

  // Debounce search input by 350ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  // Extract YouTube ID from link or raw ID
  const parseYouTubeId = (input: string): string | null => {
    const trimmed = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Perform live YouTube search
  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setHasSearched(true);
    const ytId = parseYouTubeId(debouncedQuery);

    if (ytId) {
      setIsSearching(true);
      fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ytId}`)
        .then((res) => res.json())
        .then((data) => {
          const directItem: YTResultItem = {
            id: ytId,
            title: data?.title || `YouTube Video (${ytId})`,
            artist: data?.author_name || 'YouTube Music Artist',
            thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
            durationFormatted: '3:30',
            duration: 210,
            category: 'Direct YouTube Stream',
          };
          setSearchResults([directItem]);
        })
        .catch(() => {
          const fallbackItem: YTResultItem = {
            id: ytId,
            title: `YouTube Audio (${ytId})`,
            artist: 'YouTube Studio Stream',
            thumbnail: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
            durationFormatted: '3:30',
            duration: 210,
            category: 'Direct YouTube Stream',
          };
          setSearchResults([fallbackItem]);
        })
        .finally(() => setIsSearching(false));
      return;
    }

    // Live search on YouTube for ANY song name
    setIsSearching(true);
    fetch(`/api/search-yt?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then((data: YTResultItem[]) => {
        if (Array.isArray(data)) {
          // Guarantee real YouTube thumbnail for each item
          const sanitized = data.map((item) => ({
            ...item,
            thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          }));
          setSearchResults(sanitized);
        } else {
          setSearchResults([]);
        }
      })
      .catch((err) => {
        console.warn('Search notice:', err);
        setSearchResults([]);
      })
      .finally(() => setIsSearching(false));
  }, [debouncedQuery]);

  // Convert search results to Track format for the player queue
  const onlineTrackQueue: Track[] = useMemo(() => {
    return searchResults.map((item) => ({
      id: item.id,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      duration: item.duration || 210,
      durationFormatted: item.durationFormatted || '3:30',
      category: 'youtube-stream',
      isOfflineCached: false,
      isFeatured: false,
      isCurated: false,
      addedAt: Date.now(),
    }));
  }, [searchResults]);

  // When playing from YT section: The queue becomes the online search results!
  const handlePlay = (item: YTResultItem) => {
    const isCurrent = currentTrack?.id === item.id;
    if (isCurrent) {
      togglePlayPause();
      return;
    }

    const trackObj: Track = {
      id: item.id,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      duration: item.duration || 210,
      durationFormatted: item.durationFormatted || '3:30',
      category: 'youtube-stream',
      isOfflineCached: false,
      isFeatured: false,
      isCurated: false,
      addedAt: Date.now(),
    };

    // Pass the online search results as the new queue so online songs play next!
    playTrack(trackObj, onlineTrackQueue);
  };

  const handleAddToYtPlaylist = async (item: YTResultItem) => {
    const trackObj: Track = {
      id: item.id,
      title: item.title,
      artist: item.artist,
      thumbnail: item.thumbnail || `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
      duration: item.duration || 210,
      durationFormatted: item.durationFormatted || '3:30',
      category: 'youtube-stream',
      isOfflineCached: false,
      isFeatured: false,
      isCurated: false,
      addedAt: Date.now(),
    };

    // Add to dedicated YouTube Saved Playlist and custom master list
    addTrackToYtPlaylist(trackObj);
    await addCustomTrack(trackObj);

    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#ef4444', '#8b5cf6', '#06b6d4'],
    });
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-in fade-in duration-300">
      
      {/* Hero Banner: YouTube Audio Studio */}
      <div 
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), ${currentTheme.glowColor.replace('0.35', '0.15')}, rgba(3, 7, 18, 0.98))`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-red-400" />
              <span>YouTube Global Audio Search</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-emerald-300 font-semibold">Ad-Free Stream</span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              YouTube Music <span className="bg-gradient-to-r from-red-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">Direct Search</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Search by name for <strong>any song on YouTube</strong>. Playing a song queues all search results so online tracks play continuously!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2 shadow-inner">
              <Disc3 className="w-4 h-4 text-red-400 animate-spin-slow" />
              <span>Online Queue Connected</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow decoration */}
        <div 
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: currentTheme.primaryColor }}
        />
      </div>

      {/* Universal Instant Live Search Bar */}
      <div className="space-y-3">
        <div className="relative w-full flex items-center">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-cyan-400">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <Search className="w-4 h-4 text-red-400" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any song name (e.g. Kesariya, Shada Shada Kala Kala, Shape of You, Arijit)..."
            className="w-full pl-11 pr-24 py-3 sm:py-3.5 rounded-2xl bg-slate-900/90 border border-white/15 focus:border-red-400 text-xs sm:text-sm text-white placeholder-slate-400 outline-none shadow-2xl transition-all"
          />

          {query ? (
            <button
              onClick={() => {
                setQuery('');
                setDebouncedQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          ) : (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-[11px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <span>Any song name</span>
            </div>
          )}
        </div>

        {/* Quick Search Suggestions Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-semibold text-slate-500 pl-1 pr-1 flex-shrink-0">
            Search:
          </span>
          {QUICK_SEARCH_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setQuery(chip);
                setDebouncedQuery(chip);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                query.toLowerCase() === chip.toLowerCase()
                  ? 'bg-red-500 text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header & Grid */}
      <div className="space-y-3">
        {hasSearched && (
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>
                Search Results for "{debouncedQuery}" ({searchResults.length})
              </span>
              {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />}
            </h2>
            <span className="text-xs text-slate-400">Streams online queue without ads</span>
          </div>
        )}

        {/* Initial Clean State: Before searching, don't show uploaded tracks */}
        {!hasSearched ? (
          <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-6">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto shadow-inner">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-white">Search Any Song on YouTube</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              No local library songs are mixed here. Type any song title, singer, or film name above to stream directly from YouTube with genuine album artwork!
            </p>
            <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
              {QUICK_SEARCH_CHIPS.slice(0, 4).map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setQuery(chip);
                    setDebouncedQuery(chip);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 cursor-pointer"
                >
                  "{chip}"
                </button>
              ))}
            </div>
          </div>
        ) : searchResults.length === 0 && !isSearching ? (
          <div className="py-14 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Music className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No YouTube songs found for "{debouncedQuery}"</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Please check spelling or try searching with artist or film name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {searchResults.map((item) => {
              const isCurrent = currentTrack?.id === item.id;
              const isSaved = ytSavedSet.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handlePlay(item)}
                  className={`group relative rounded-xl p-2.5 cursor-pointer transition-all duration-200 border flex items-center gap-2.5 ${
                    isCurrent
                      ? 'bg-slate-900/95 border-red-500/60 shadow-xl'
                      : 'bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20 hover:shadow-md'
                  }`}
                  style={{
                    boxShadow: isCurrent ? `0 6px 20px -3px ${currentTheme.glowColor}` : undefined
                  }}
                >
                  {/* Real YouTube High-Quality Artwork */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 shadow-md">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`;
                      }}
                    />

                    {/* Play Overlay */}
                    <div className={`absolute inset-0 bg-black/30 group-hover:bg-black/55 transition-colors flex items-center justify-center ${
                      isCurrent && isPlaying ? 'bg-black/60' : ''
                    }`}>
                      {isCurrent && isPlaying ? (
                        <div className="flex items-center gap-0.5">
                          <span className="w-0.5 h-3 bg-red-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                          <span className="w-0.5 h-4 bg-rose-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                        </div>
                      ) : (
                        <Play className="w-4 h-4 fill-white text-white opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Song Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className={`font-semibold text-xs leading-snug truncate ${
                      isCurrent ? 'text-red-300 font-bold' : 'text-slate-100 group-hover:text-purple-200'
                    }`}>
                      {item.title}
                    </h4>

                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.artist}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 border border-white/10 text-slate-300">
                        {item.durationFormatted}
                      </span>
                      <span className="text-[9px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> Ad-Free
                      </span>
                    </div>
                  </div>

                  {/* Quick Action: Add to YouTube Saved Playlist */}
                  <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAddToYtPlaylist(item)}
                      disabled={isSaved}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isSaved
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                      title={isSaved ? "Saved to YouTube Playlist" : "Add to YouTube Playlist"}
                    >
                      {isSaved ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Open on YouTube"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
