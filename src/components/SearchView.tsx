import React, { useState, useMemo } from 'react';
import { Search, X, Music, Play, Pause, Sparkles } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

export const SearchView: React.FC = () => {
  const { tracks, playTrack, currentTrack, isPlaying, togglePlayPause } = useMusic();
  const { theme } = useTheme();

  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('ALL');

  const topCategories = ['ALL', 'Romantic', 'Bengali', 'Bollywood', 'Lo-Fi', 'Workout', 'Chill'];
  const topArtists = ['ALL', 'Arijit Singh', 'Jeet Gannguli', 'Raj Barman', 'Atif Aslam', 'Mohit Chauhan', 'Monali Thakur'];

  const searchResults = useMemo(() => {
    let list = tracks;

    if (selectedTag !== 'ALL') {
      const tagLower = selectedTag.toLowerCase();
      list = list.filter((t) => 
        t.category.toLowerCase().includes(tagLower) || 
        t.artist.toLowerCase().includes(tagLower)
      );
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tracks, query, selectedTag]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-36 animate-in fade-in duration-200 space-y-5">
      
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, moods..."
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#141814] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all shadow-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Tag Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {topCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedTag(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedTag === cat
                ? 'bg-[#3A4B3D] text-[#A5D6A7] border border-emerald-500/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Artist Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {topArtists.map((artist) => (
          <button
            key={artist}
            onClick={() => setSelectedTag(artist)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedTag === artist
                ? 'bg-[#3A4B3D] text-[#A5D6A7]'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {artist}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>{searchResults.length} Tracks Available</span>
        <span className="font-mono text-emerald-400">320kbps YouTube HQ</span>
      </div>

      {/* Results List */}
      <div className="divide-y divide-white/5">
        {searchResults.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          return (
            <div
              key={`${track.id}-${idx}`}
              onClick={() => {
                if (isCurrent) {
                  togglePlayPause();
                } else {
                  playTrack(track, searchResults);
                }
              }}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                isCurrent
                  ? 'bg-[#212E23] text-white shadow-md'
                  : 'hover:bg-white/5 text-slate-200'
              }`}
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 shadow">
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                {isCurrent && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-emerald-300 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 text-emerald-300 fill-current ml-0.5" />
                    )}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-emerald-300 font-bold' : 'text-white'}`}>
                  {track.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                {track.durationFormatted}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
