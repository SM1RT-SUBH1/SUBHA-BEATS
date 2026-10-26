import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Maximize2, 
  Sliders, 
  Heart,
  ChevronUp,
  WifiOff
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { Visualizer } from './Visualizer';

interface MusicPlayerProps {
  onOpenFullPlayer: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onOpenFullPlayer }) => {
  const { currentTheme } = useTheme();
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlayPause,
    seekTo,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    repeatMode,
    toggleRepeat,
    isShuffled,
    toggleShuffle,
    favoriteTrackIds,
    toggleFavorite,
    equalizerPreset,
    isOfflineMode,
  } = useMusic();

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favoriteTrackIds.includes(currentTrack.id);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo((val / 100) * duration);
  };

  return (
    <>
      {/* =========================================================================
          DESKTOP BOTTOM PLAYER BAR (Spotify / Apple Music Studio Architecture)
          ========================================================================= */}
      <div 
        className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-[#090C15]/95 border-t border-white/10 backdrop-blur-2xl transition-all duration-300"
        style={{
          boxShadow: `0 -10px 30px -10px ${currentTheme.glowColor}`
        }}
      >
        {/* Subtle Top 2px Progress Indicator */}
        <div className="w-full h-[2px] bg-white/5 relative">
          <div 
            className="h-full transition-all duration-200"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(to right, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Left: Track Information & Like */}
          <div className="flex items-center gap-3.5 min-w-0 w-72 flex-shrink-0">
            <div 
              onClick={onOpenFullPlayer}
              className="relative w-13 h-13 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex-shrink-0 shadow-md cursor-pointer group"
            >
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                <ChevronUp className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h4 
                onClick={onOpenFullPlayer}
                className="font-bold text-sm text-white truncate cursor-pointer hover:text-cyan-300 transition-colors"
                title={currentTrack.title}
              >
                {currentTrack.title}
              </h4>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                <span>{currentTrack.artist}</span>
                {isOfflineMode && (
                  <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                    <WifiOff className="w-3 h-3" /> Offline
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isFav 
                  ? 'text-rose-400 hover:text-rose-300' 
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isFav ? "Favorited" : "Add to favorites"}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Center: Controls & Audio Scrubber */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1.5">
            
            {/* Transport Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  isShuffled 
                    ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title={isShuffled ? "Shuffle On" : "Shuffle Off"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={playPrevious}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                title="Previous Track"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-950 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
                  boxShadow: `0 0 20px ${currentTheme.glowColor}`
                }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current text-white" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-white ml-0.5" />
                )}
              </button>

              <button
                onClick={playNext}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                title="Next Track"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  repeatMode !== 'off' 
                    ? 'text-purple-400 bg-purple-950/50 border border-purple-500/30' 
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat className="w-4 h-4" />
              </button>
            </div>

            {/* Scrubber Slider & Monospace Times */}
            <div className="w-full flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span className="w-8 text-right font-medium text-slate-400">
                {formatTime(currentTime)}
              </span>

              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isNaN(progressPercent) ? 0 : progressPercent}
                  onChange={handleSeekChange}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{ accentColor: currentTheme.primaryColor }}
                />
              </div>

              <span className="w-8 font-medium text-slate-500">
                {formatTime(duration)}
              </span>
            </div>

          </div>

          {/* Right: Audio Features, Volume & Full Player launcher */}
          <div className="flex items-center justify-end gap-3 w-72 flex-shrink-0">
            
            {/* Equalizer Preset Pill */}
            <button
              onClick={onOpenFullPlayer}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors"
              title="Sound Preset"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>{equalizerPreset}</span>
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: currentTheme.secondaryColor }}
              />
            </div>

            {/* Maximize to Studio Full Modal */}
            <button
              onClick={onOpenFullPlayer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Open Immersive Studio Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>

      {/* =========================================================================
          MOBILE SLEEK MINI PLAYER (Sits right above mobile bottom dock)
          ========================================================================= */}
      <div 
        className="md:hidden fixed bottom-[72px] inset-x-3 z-40 bg-[#0B0F1A]/95 border border-white/15 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.85)] backdrop-blur-2xl p-2.5 transition-all"
        style={{
          boxShadow: `0 8px 26px -4px ${currentTheme.glowColor}`
        }}
      >
        {/* Top 2px progress bar */}
        <div className="absolute top-0 inset-x-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-200"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(to right, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-2.5 pt-0.5">
          
          {/* Left: Tappable Track Artwork & Info to Open Full Player */}
          <div 
            onClick={onOpenFullPlayer}
            className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer group"
          >
            {/* Spinning Vinyl Album Disc */}
            <div className="relative w-11 h-11 rounded-full overflow-hidden bg-slate-950 border border-white/20 flex-shrink-0 shadow-lg p-0.5">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`w-full h-full rounded-full object-cover ${isPlaying ? 'animate-spin-slow' : 'pause-spin'}`}
              />
              <div className="absolute inset-0 m-auto w-2.5 h-2.5 bg-black rounded-full border border-white/40" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs text-white truncate">
                  {currentTrack.title}
                </h4>
                {isPlaying && (
                  <div className="flex items-end gap-[1.5px] h-2.5 flex-shrink-0">
                    <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.5 h-3 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                <span>{currentTrack.artist}</span>
                {isOfflineMode && <WifiOff className="w-2.5 h-2.5 text-emerald-400 inline" />}
              </p>
            </div>
          </div>

          {/* Right: Quick Touch Playback Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => toggleFavorite(currentTrack.id)}
              className="p-2 text-slate-400 hover:text-rose-400 active:scale-90 transition-all cursor-pointer"
              title="Like"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>

            <button
              onClick={togglePlayPause}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 shadow-md transition-transform active:scale-95 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current text-white" />
              ) : (
                <Play className="w-4 h-4 fill-current text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={onOpenFullPlayer}
              className="p-2 text-slate-400 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Expand"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
