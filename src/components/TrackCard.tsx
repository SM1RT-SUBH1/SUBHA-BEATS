import React from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  CheckCircle2, 
  ListPlus,
  ListCheck
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
    toggleDevicePlaylist,
    isInDevicePlaylist,
  } = useMusic();
  const { currentTheme } = useTheme();

  const isCurrent = currentTrack?.id === track.id;
  const isFav = favoriteTrackIds.includes(track.id);
  const inDevicePlaylist = isInDevicePlaylist(track.id);

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

  const handlePlaylistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleDevicePlaylist(track.id);
  };

  return (
    <div
      onClick={() => playTrack(track)}
      className={`group relative rounded-xl p-1.5 sm:p-2 cursor-pointer transition-all duration-200 border ${
        isCurrent
          ? 'bg-slate-900/95 border-purple-500/60 shadow-lg scale-[1.01]'
          : 'bg-[#0D111D]/80 hover:bg-[#13192B]/90 border-white/5 hover:border-white/20 hover:shadow-md'
      }`}
      style={{
        boxShadow: isCurrent ? `0 6px 20px -3px ${currentTheme.glowColor}` : undefined
      }}
    >
      {/* Compact Album Artwork Cover */}
      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950 mb-1.5 shadow-inner">
        <img
          src={track.thumbnail}
          alt={track.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`;
          }}
        />

        {/* Ambient Dark Gradient on Hover */}
        <div className={`absolute inset-0 bg-black/25 group-hover:bg-black/45 transition-colors flex items-center justify-center ${
          isCurrent && isPlaying ? 'bg-black/55' : ''
        }`}>
          {/* Animated Wave Indicator if Currently Playing */}
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-0.5 bg-black/40 backdrop-blur-[2px]">
              <span className="w-0.5 h-3 rounded-full bg-cyan-400 animate-wave" style={{ animationDelay: '0.1s' }} />
              <span className="w-0.5 h-4.5 rounded-full bg-purple-400 animate-wave" style={{ animationDelay: '0.3s' }} />
              <span className="w-0.5 h-3 rounded-full bg-indigo-400 animate-wave" style={{ animationDelay: '0.2s' }} />
            </div>
          )}

          {/* Floating Action Play Button */}
          <button
            onClick={handlePlayClick}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 transform ${
              isCurrent
                ? 'scale-100 opacity-100 text-white'
                : 'bg-white text-slate-950 opacity-90 sm:opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 hover:scale-105'
            }`}
            style={{
              background: isCurrent 
                ? `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})` 
                : undefined,
            }}
            title={isCurrent && isPlaying ? "Pause" : "Play"}
          >
            {isCurrent && isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Featured Badges */}
        {track.isFeatured && (
          <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-amber-500/90 text-slate-950 text-[8px] font-black uppercase tracking-wider shadow">
            Featured
          </div>
        )}

        {/* Offline cached badge */}
        {track.isOfflineCached && (
          <div className="absolute top-1 right-1 p-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 backdrop-blur-md">
            <CheckCircle2 className="w-2 h-2 text-emerald-400" />
          </div>
        )}

        {/* Add to Device Playlist Quick Icon on Artwork (Bottom Left) */}
        <button
          onClick={handlePlaylistClick}
          className={`absolute bottom-1 left-1 p-1 rounded-full backdrop-blur-md transition-all ${
            inDevicePlaylist
              ? 'bg-cyan-500/40 text-cyan-300 opacity-100 ring-1 ring-cyan-400/50'
              : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:text-cyan-300'
          }`}
          title={inDevicePlaylist ? "In Device Playlist (Tap to remove)" : "Add to Device Playlist"}
        >
          {inDevicePlaylist ? (
            <ListCheck className="w-3 h-3 text-cyan-400" />
          ) : (
            <ListPlus className="w-3 h-3" />
          )}
        </button>

        {/* Quick Heart on Artwork (Bottom Right) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute bottom-1 right-1 p-1 rounded-full backdrop-blur-md transition-all ${
            isFav 
              ? 'bg-rose-500/30 text-rose-400 opacity-100' 
              : 'bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:text-rose-400'
          }`}
          title={isFav ? "Favorited" : "Like"}
        >
          <Heart className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Track Details */}
      <div className="space-y-0.5 px-0.5">
        <h4 
          className={`font-semibold text-[11px] sm:text-xs leading-tight line-clamp-1 transition-colors ${
            isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-100 group-hover:text-purple-200'
          }`}
          title={track.title}
        >
          {track.title}
        </h4>
        
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400">
          <span className="truncate max-w-[60%]" title={track.artist}>
            {track.artist}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handlePlaylistClick}
              className={`transition-colors cursor-pointer ${
                inDevicePlaylist ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={inDevicePlaylist ? "In Device Playlist" : "Add to Device Playlist"}
            >
              {inDevicePlaylist ? (
                <ListCheck className="w-3 h-3 text-cyan-400" />
              ) : (
                <ListPlus className="w-3 h-3" />
              )}
            </button>
            <span className="font-mono text-[8px] sm:text-[9px] text-slate-500">
              {track.durationFormatted || '3:30'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
