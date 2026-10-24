import React, { useRef, useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  DownloadCloud, 
  CheckCircle2, 
  Trash2, 
  Star,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();

  const isCurrent = currentTrack?.id === track.id;
  const isFav = favoriteTrackIds.includes(track.id);
  const progress = downloadProgress[track.id];
  const isDownloading = typeof progress === 'number' && progress < 100;

  // 3D Tilt perspective effect (Aceternity 3D Card style)
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((y - centerY) / centerY) * -6);
    setRotateY(((x - centerX) / centerX) * 6);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

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
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => playTrack(track)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'transform 0.15s ease-out',
        borderColor: isCurrent ? theme.secondary : undefined,
        boxShadow: isCurrent ? `0 0 30px ${theme.glow}` : undefined,
      }}
      className={`group relative rounded-3xl p-4 cursor-pointer overflow-hidden backdrop-blur-xl transition-all duration-300 border ${
        isCurrent
          ? 'bg-slate-900/90 shadow-2xl ring-1'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-white/10 hover:border-white/20'
      }`}
    >
      {/* Dynamic radiant spotlight background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/0 via-cyan-500/10 to-indigo-500/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Thumbnail + Aceternity Play Overlay */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3.5 shadow-lg border border-white/5">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Overlay */}
        <div className={`absolute inset-0 bg-black/30 group-hover:bg-black/55 transition-colors flex items-center justify-center ${
          isCurrent && isPlaying ? 'bg-black/60' : ''
        }`}>
          {/* Active Audio Visualizer Wave */}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-slate-950/60 backdrop-blur-sm">
              <span className="w-1.5 h-6 rounded-full animate-wave" style={{ backgroundColor: theme.secondary, animationDelay: '0.1s' }} />
              <span className="w-1.5 h-10 rounded-full animate-wave" style={{ backgroundColor: theme.primary, animationDelay: '0.3s' }} />
              <span className="w-1.5 h-8 rounded-full animate-wave" style={{ backgroundColor: theme.accent, animationDelay: '0.2s' }} />
              <span className="w-1.5 h-5 rounded-full animate-wave" style={{ backgroundColor: theme.secondary, animationDelay: '0.4s' }} />
            </div>
          )}

          {/* Aceternity Glowing Play Button - Visible on mobile touch screens and on hover */}
          <button
            onClick={handlePlayClick}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 ${
              isCurrent
                ? 'scale-100 text-slate-950'
                : 'bg-white/95 text-slate-950 opacity-90 sm:opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 hover:scale-110'
            }`}
            style={{
              background: isCurrent ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` : undefined,
              boxShadow: isCurrent ? `0 0 20px ${theme.glow}` : undefined,
            }}
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
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          {track.isFeatured && (
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-md">
              <Star className="w-2.5 h-2.5 fill-current" /> Featured
            </span>
          )}
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-500/40 shadow-sm">
            320k Ultra HD
          </span>
        </div>

        {/* Duration / Offline status badge */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
          {track.isOfflineCached && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Cached
            </span>
          )}
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-200 border border-white/5">
            {track.durationFormatted}
          </span>
        </div>
      </div>

      {/* Track Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-heading font-bold text-sm text-slate-100 truncate group-hover:text-cyan-300 transition-colors">
          {track.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-slate-400">
          <p className="truncate max-w-[170px] font-medium text-slate-400 group-hover:text-slate-300">{track.artist}</p>
          <span className="capitalize text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950/40 text-purple-300 border border-purple-500/30 font-medium">
            {track.category}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        
        {/* Heart / Favorite */}
        <button
          onClick={handleFavoriteClick}
          className={`flex items-center gap-1.5 p-1.5 rounded-xl transition-all ${
            isFav 
              ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30' 
              : 'hover:text-rose-400 hover:bg-slate-800/60'
          }`}
          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          <span className="text-[11px] font-semibold">{isFav ? 'Favorited' : 'Favorite'}</span>
        </button>

        <div className="flex items-center gap-1">
          {/* Offline Cache Button */}
          <button
            onClick={handleOfflineClick}
            disabled={isDownloading}
            className={`p-1.5 rounded-xl transition-all ${
              track.isOfflineCached
                ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30'
                : isDownloading
                ? 'text-cyan-400 bg-cyan-500/10'
                : 'hover:text-cyan-400 hover:bg-slate-800/60'
            }`}
            title={
              track.isOfflineCached
                ? "Cached in IndexedDB (Click to remove)"
                : isDownloading
                ? `Downloading (${progress}%)`
                : "Cache to IndexedDB for offline play"
            }
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : track.isOfflineCached ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <DownloadCloud className="w-4 h-4" />
            )}
          </button>

          {/* Admin delete button */}
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-xl hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Track (Admin Only)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
