import React from 'react';
import { 
  Lock, 
  Play, 
  Pause, 
  MoreVertical, 
  Menu as MenuIcon, 
  Shuffle, 
  Repeat, 
  Heart,
  Music,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

export const LibraryView: React.FC = () => {
  const { 
    tracks, 
    favoriteTrackIds, 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause,
    toggleShuffle,
    isShuffled,
    repeatMode,
    toggleRepeat
  } = useMusic();

  const { theme } = useTheme();

  // Favorite tracks or all library tracks
  const likedTracks = tracks.filter((t) => favoriteTrackIds.includes(t.id));
  const displayTracks = likedTracks.length > 0 ? likedTracks : tracks.slice(0, 30);

  const totalSeconds = displayTracks.reduce((acc, t) => acc + (t.duration || 210), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);
  const durationFormatted = `${totalHours > 0 ? totalHours + ':' : ''}${totalMins < 10 ? '0' : ''}${totalMins}:00`;

  const handleShufflePlay = () => {
    if (displayTracks.length === 0) return;
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
    });
    const shuffled = [...displayTracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 pb-36 animate-in fade-in duration-200">
      
      {/* Top Header matching Screenshot 5 */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
            Liked
            <span className="p-1 rounded-full bg-white/10 text-slate-300">
              <Lock className="w-3.5 h-3.5" />
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {displayTracks.length} songs • {durationFormatted}
          </p>
        </div>

        {/* Quick Shuffle & Repeat icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShufflePlay}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 shadow"
            title="Shuffle play"
          >
            <Shuffle className="w-4 h-4 text-emerald-400" />
          </button>
          <button
            onClick={toggleRepeat}
            className={`p-2.5 rounded-full transition-all active:scale-95 ${
              repeatMode !== 'off' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Song List matching Screenshot 5 */}
      <div className="divide-y divide-white/5 mt-3">
        {displayTracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          return (
            <div
              key={`${track.id}-${idx}`}
              onClick={() => {
                if (isCurrent) {
                  togglePlayPause();
                } else {
                  playTrack(track, displayTracks);
                }
              }}
              className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-200 group ${
                isCurrent
                  ? 'bg-[#212E23] text-white shadow-md'
                  : 'hover:bg-white/5 text-slate-200'
              }`}
            >
              {/* Thumbnail with active play indicator */}
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

              {/* Title & Artist */}
              <div className="min-w-0 flex-1">
                <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-emerald-300 font-bold' : 'text-white'}`}>
                  {track.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {track.artist} • {track.durationFormatted}
                </p>
              </div>

              {/* 3-dots and Drag handle */}
              <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="p-1.5 text-slate-600 group-hover:text-slate-400 cursor-grab">
                  <MenuIcon className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
