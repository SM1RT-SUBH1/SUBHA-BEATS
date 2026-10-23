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

interface TrackCardProps {
  track: Track;
  index: number;
}

export const TrackCard: React.FC<TrackCardProps> = ({ track, index }) => {
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
      className={`group relative rounded-2xl p-3.5 transition-all duration-300 cursor-pointer overflow-hidden border ${
        isCurrent
          ? 'bg-gradient-to-b from-purple-900/40 to-slate-900/90 border-purple-500/60 shadow-xl shadow-purple-950/40 ring-1 ring-purple-500/30'
          : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800/80 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/50'
      }`}
    >
      {/* Background glow on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/0 via-purple-600/10 to-cyan-500/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Thumbnail + Play Overlay */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 mb-3 shadow-md">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Dark overlay */}
        <div className={`absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center ${
          isCurrent && isPlaying ? 'bg-black/60' : ''
        }`}>
          {/* Active wave animation */}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-purple-950/50 backdrop-blur-[2px]">
              <span className="w-1.5 h-6 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-8 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 h-10 bg-indigo-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }} />
            </div>
          )}

          <button
            onClick={handlePlayClick}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${
              isCurrent
                ? 'bg-gradient-to-tr from-purple-500 to-cyan-400 text-slate-950 scale-100'
                : 'bg-white/90 text-slate-950 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100'
            }`}
            title={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Quality & Featured Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap items-center gap-1">
          {track.isFeatured && (
            <span className="flex items-center gap-0.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 shadow">
              <Star className="w-2.5 h-2.5 fill-current" /> Featured
            </span>
          )}
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
            320k Ultra HD
          </span>
        </div>

        {/* Duration / Real Offline indicator */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
          {track.isOfflineCached && (
            <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              Cached
            </span>
          )}
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-slate-200">
            {track.durationFormatted}
          </span>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-heading font-semibold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
          {track.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p className="truncate max-w-[160px] font-medium">{track.artist}</p>
          <span className="capitalize text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50">
            {track.category}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={handleFavoriteClick}
            className={`p-1.5 rounded-lg transition-colors ${
              isFav ? 'text-rose-400 hover:text-rose-300' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isFav ? "Remove Favorite" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          </button>

          {/* Real Offline Download Button with Progress */}
          <button
            onClick={handleOfflineClick}
            disabled={isDownloading}
            className={`p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs ${
              track.isOfflineCached 
                ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30' 
                : isDownloading
                ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title={track.isOfflineCached ? "Cached in Offline Storage (click to remove)" : "Save Offline to IndexedDB"}
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="text-[10px] font-mono font-bold">{progress}%</span>
              </>
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
              title="Delete Track (Admin Only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="text-[10px] text-slate-500 font-mono">
            #{index + 1}
          </span>
        </div>
      </div>
    </div>
  );
};
