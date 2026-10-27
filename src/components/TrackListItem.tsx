import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  CheckCircle2, 
  DownloadCloud,
  Loader2,
  WifiOff,
  ListPlus,
  ListCheck
} from 'lucide-react';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

interface TrackListItemProps {
  track: Track;
  index: number;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({ track, index }) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    toggleFavorite, 
    favoriteTrackIds,
    toggleOfflineCache,
    downloadProgress,
    toggleDevicePlaylist,
    isInDevicePlaylist,
  } = useMusic();
  const { currentTheme } = useTheme();

  const isCurrent = currentTrack?.id === track.id;
  const isFav = favoriteTrackIds.includes(track.id);
  const progress = downloadProgress[track.id];
  const isDownloading = typeof progress === 'number' && progress < 100;

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

  const handleOfflineClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;
    await toggleOfflineCache(track);
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group flex items-center justify-between gap-3 px-3 py-2 sm:py-2.5 rounded-xl transition-colors cursor-pointer border ${
        isCurrent
          ? 'bg-purple-950/40 border-purple-500/40 text-white'
          : 'bg-transparent hover:bg-white/5 border-transparent text-slate-300'
      }`}
    >
      {/* Index & Thumbnail & Title */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        
        {/* Track Number / Playing Animation / Hover Play Button */}
        <div className="w-6 text-center text-xs font-mono text-slate-500 flex-shrink-0 flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          ) : (
            <span className="group-hover:hidden">{index + 1}</span>
          )}
          <button
            onClick={handlePlayClick}
            className="hidden group-hover:flex items-center justify-center text-white"
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current text-cyan-300" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>
        </div>

        {/* Thumbnail */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 shadow">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Title and Artist */}
        <div className="min-w-0 flex-1">
          <h4 className={`text-xs sm:text-sm font-semibold truncate ${
            isCurrent ? 'text-cyan-300' : 'text-slate-100 group-hover:text-white'
          }`}>
            {track.title}
          </h4>
          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
            <span>{track.artist}</span>
            <span className="text-slate-600">·</span>
            <span className="capitalize text-slate-500">{track.category}</span>
          </p>
        </div>

      </div>

      {/* Right Actions: Add to Playlist, Favorite, Offline & Duration */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0 text-xs">
        
        {/* Add to Device Playlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDevicePlaylist(track.id);
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isInDevicePlaylist(track.id)
              ? 'text-cyan-400 bg-cyan-950/40'
              : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
          }`}
          title={isInDevicePlaylist(track.id) ? "In Device Playlist (Tap to remove)" : "Add to Device Playlist"}
        >
          {isInDevicePlaylist(track.id) ? (
            <ListCheck className="w-4 h-4 text-cyan-400" />
          ) : (
            <ListPlus className="w-4 h-4" />
          )}
        </button>

        {/* Heart / Favorite */}
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isFav ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
          }`}
          title={isFav ? "Favorited" : "Like"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Offline Cache */}
        <button
          onClick={handleOfflineClick}
          disabled={isDownloading}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            track.isOfflineCached 
              ? 'text-emerald-400' 
              : isDownloading 
              ? 'text-cyan-400' 
              : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
          }`}
          title={track.isOfflineCached ? "Cached offline" : "Save offline"}
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : track.isOfflineCached ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <DownloadCloud className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Duration */}
        <span className="w-10 text-right font-mono text-[11px] text-slate-500">
          {track.durationFormatted}
        </span>

      </div>
    </div>
  );
};
