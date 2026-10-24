import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  User, 
  WifiOff,
  Maximize2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

interface MusicPlayerProps {
  onOpenFullPlayer: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onOpenFullPlayer }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlayPause,
    favoriteTrackIds,
    toggleFavorite,
    isOfflineMode,
  } = useMusic();

  const { theme } = useTheme();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favoriteTrackIds.includes(currentTrack.id);

  return (
    <div className="fixed bottom-[64px] sm:bottom-[70px] left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none">
      <div 
        onClick={onOpenFullPlayer}
        className="max-w-md sm:max-w-lg mx-auto rounded-full bg-[#1C201A]/95 border border-[#3A4535]/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto backdrop-blur-2xl p-1.5 sm:p-2 pr-3 sm:pr-4 flex items-center justify-between gap-3 cursor-pointer group relative overflow-hidden transition-all duration-300 transform active:scale-[0.99]"
        style={{
          boxShadow: `0 8px 25px ${theme.glow}`,
        }}
      >
        
        {/* Subtle top progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-black/40">
          <div 
            className="h-full bg-[#A5D6A7] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Left: Circular Artwork with Mini Play/Pause Button */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-slate-950 flex-shrink-0 shadow-md group/art"
            title={isPlaying ? "Pause" : "Play"}
          >
            <img
              src={currentTrack.thumbnail}
              alt={currentTrack.title}
              className={`w-full h-full object-cover rounded-full ${
                isPlaying ? 'animate-spin-slow' : 'pause-spin'
              }`}
            />
            {/* Play/Pause overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover/art:bg-black/60 flex items-center justify-center transition-colors">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white fill-current" />
              ) : (
                <Play className="w-4 h-4 text-white fill-current ml-0.5" />
              )}
            </div>
          </div>

          {/* Center: Track Title & Artist */}
          <div className="min-w-0 flex-1">
            <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-100 truncate group-hover:text-emerald-300 transition-colors">
              {currentTrack.title}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate flex items-center gap-1">
              <span>{currentTrack.artist}</span>
              {isOfflineMode && <WifiOff className="w-2.5 h-2.5 text-emerald-400 inline" />}
            </p>
          </div>
        </div>

        {/* Right Action Icons matching Screenshot 1: Singer / Profile icon + Heart Like */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenFullPlayer();
            }}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Artist details"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(currentTrack.id);
            }}
            className={`p-2 rounded-full hover:bg-white/10 transition-transform active:scale-90 ${
              isFav ? 'text-rose-400' : 'text-slate-400 hover:text-white'
            }`}
            title={isFav ? "Favorited" : "Like Song"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
