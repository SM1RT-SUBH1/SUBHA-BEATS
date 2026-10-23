import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  DownloadCloud, 
  CheckCircle2, 
  Trash2, 
  Crown, 
  Star,
  Loader2
} from 'lucide-react';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';

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
    deleteTrack,
  } = useMusic();
  const { isAdmin } = useAuth();

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Remove "${track.title}" from library?`)) {
      deleteTrack(track.id);
    }
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
        isCurrent
          ? 'bg-purple-950/50 border-purple-500/50 text-white shadow-lg shadow-purple-950/30'
          : 'bg-slate-900/40 hover:bg-slate-800/70 border-slate-800/60 hover:border-slate-700/80 text-slate-300'
      }`}
    >
      {/* Index & Play Button */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-7 text-center text-xs font-mono text-slate-500 group-hover:hidden flex items-center justify-center">
          {isCurrent && isPlaying ? (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          ) : (
            index + 1
          )}
        </div>

        <button
          onClick={handlePlayClick}
          className="w-7 h-7 rounded-lg bg-purple-600/30 group-hover:flex items-center justify-center hidden text-purple-300 hover:text-white hover:bg-purple-600 transition-colors"
          title={isCurrent && isPlaying ? "Pause" : "Play"}
        >
          {isCurrent && isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-current" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          )}
        </button>

        {/* Thumbnail */}
        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {track.isFeatured && (
            <div className="absolute top-0 right-0 p-0.5 bg-amber-500 text-slate-950 rounded-bl" title="Featured">
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-purple-300' : 'text-slate-100 group-hover:text-purple-200'}`}>
              {track.title}
            </h4>
            {track.isOfflineCached && (
              <span className="flex items-center text-[10px] text-emerald-400" title="Offline Synced">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
            <span>{track.artist}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 uppercase">
              {track.category}
            </span>
          </p>
        </div>
      </div>

      {/* Actions & Duration */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-lg transition-colors ${
            isFav ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'
          }`}
          title={isFav ? "Favorited" : "Add to Favorites"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleOfflineClick}
          disabled={isDownloading}
          className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs ${
            track.isOfflineCached 
              ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' 
              : isDownloading
              ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
              : 'text-slate-500 hover:text-slate-300'
          }`}
          title={track.isOfflineCached ? "Cached in Offline Storage" : "Save Offline to IndexedDB"}
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
          ) : (
            <DownloadCloud className="w-4 h-4" />
          )}
        </button>

        {isAdmin && (
          <button
            onClick={handleDeleteClick}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
            title="Delete (Admin Only)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        <span className="text-xs font-mono text-slate-400 w-10 text-right">
          {track.durationFormatted}
        </span>
      </div>
    </div>
  );
};
