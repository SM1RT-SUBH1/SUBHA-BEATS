import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  CheckCircle2, 
  WifiOff
} from 'lucide-react';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

interface TrackCardProps {
  track: Track;
  index: number;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    toggleFavorite, 
    favoriteTrackIds,
  } = useMusic();
  const { currentTheme } = useTheme();

  const isCurrent = currentTrack?.id === track.id;
  const isFav = favoriteTrackIds.includes(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track.id);
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group relative rounded-2xl p-2.5 sm:p-3 cursor-pointer transition-all duration-200 border ${
        isCurrent
          ? 'bg-slate-900/90 border-purple-500/50 shadow-xl'
          : 'bg-[#0E131F]/60 hover:bg-[#141B2B]/80 border-white/5 hover:border-white/15'
      }`}
      style={{
        boxShadow: isCurrent ? `0 10px 25px -5px ${currentTheme.glowColor}` : undefined
      }}
    >
      {/* Album Artwork Cover */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-2.5 shadow-md">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className={`absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center ${
          isCurrent && isPlaying ? 'bg-black/50' : ''
        }`}>
          {/* Animated Wave Indicator if Currently Playing */}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 backdrop-blur-[2px]">
              <span className="w-1 h-5 rounded-full bg-cyan-400 animate-wave" style={{ animationDelay: '0.1s' }} />
              <span className="w-1 h-8 rounded-full bg-purple-400 animate-wave" style={{ animationDelay: '0.3s' }} />
              <span className="w-1 h-6 rounded-full bg-indigo-400 animate-wave" style={{ animationDelay: '0.2s' }} />
            </div>
          )}

          {/* Spotify-style Floating Action Play Button */}
          <button
            onClick={handlePlayClick}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform ${
              isCurrent
                ? 'scale-100 opacity-100 text-white'
                : 'bg-white text-slate-950 opacity-90 sm:opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 hover:scale-105 hover:bg-white'
            }`}
            style={{
              background: isCurrent 
                ? `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})` 
                : undefined,
            }}
            title={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current text-white" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Quiet Top Corner Badges (No loud pills, clean typography) */}
        {track.isFeatured && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-500/90 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
            Featured
          </div>
        )}

        {/* Offline cached badge */}
        {track.isOfflineCached && (
          <div className="absolute top-2 right-2 p-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          </div>
        )}

        {/* Quick Heart on Artwork */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
            isFav 
              ? 'bg-rose-500/20 text-rose-400 opacity-100' 
              : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:text-rose-400'
          }`}
          title={isFav ? "Favorited" : "Like"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Track Details */}
      <div className="space-y-0.5">
        <h4 
          className={`font-semibold text-xs sm:text-sm truncate transition-colors ${
            isCurrent ? 'text-cyan-300' : 'text-slate-100 group-hover:text-purple-200'
          }`}
          title={track.title}
        >
          {track.title}
        </h4>
        
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate max-w-[70%]">{track.artist}</span>
          <span className="font-mono text-[10px] text-slate-500 flex-shrink-0">
            {track.durationFormatted}
          </span>
        </div>
      </div>
    </div>
  );
};
