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
  Radio, 
  Sparkles,
  WifiOff
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Visualizer } from './Visualizer';

import { useTheme } from '../context/ThemeContext';

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
    audioQuality,
    setAudioQuality,
    equalizerPreset,
    isOfflineMode,
  } = useMusic();

  const [isHovered, setIsHovered] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo((val / 100) * duration);
  };

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 p-2 sm:p-4 pointer-events-none transition-all duration-300"
    >
      <div 
        className="max-w-6xl mx-auto rounded-3xl glass-panel border border-white/10 shadow-2xl pointer-events-auto backdrop-blur-2xl px-3.5 sm:px-6 py-3 sm:py-3.5 flex flex-col gap-2 relative overflow-hidden"
        style={{
          boxShadow: `0 20px 40px -15px ${currentTheme.glowColor}`
        }}
      >
        
        {/* Aceternity animated top progress glow beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800/80">
          <div 
            className="h-full shadow-md transition-all duration-200"
            style={{ 
              width: `${progressPercent}%`,
              background: `linear-gradient(to right, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor}, ${currentTheme.accentColor})`
            }}
          />
        </div>

        {/* Main Player Row */}
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Track Info & Vinyl Art */}
          <div 
            onClick={onOpenFullPlayer}
            className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs cursor-pointer group flex-shrink-0"
          >
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-purple-500/30 flex-shrink-0 shadow-lg">
              <img
                src={currentTrack.thumbnail}
                alt={currentTrack.title}
                className={`w-full h-full object-cover rounded-xl ${isPlaying ? 'animate-spin-slow' : 'pause-spin'}`}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-slate-950 border border-white/40" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-heading font-semibold text-sm text-slate-100 truncate group-hover:text-purple-300 transition-colors">
                  {currentTrack.title}
                </h4>
              </div>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                <span>{currentTrack.artist}</span>
                {isOfflineMode && <WifiOff className="w-3 h-3 text-emerald-400 inline" />}
              </p>
            </div>
          </div>

          {/* Center: Controls & Audio Waveform Visualizer */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-1">
            <div className="flex items-center gap-3 sm:gap-5">
              
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-xl transition-all ${
                  isShuffled 
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isShuffled ? "Shuffle On" : "Shuffle Off"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Prev */}
              <button
                onClick={playPrevious}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all active:scale-95"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlayPause}
                className="w-11 h-11 rounded-2xl text-slate-950 flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
                  boxShadow: `0 4px 16px -2px ${currentTheme.glowColor}`
                }}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={playNext}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all active:scale-95"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-xl transition-all ${
                  repeatMode !== 'off' 
                    ? 'text-purple-400 bg-purple-950/40 border border-purple-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                <Repeat className="w-4 h-4" />
              </button>

            </div>

            {/* Scrubber & Times */}
            <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
              <span className="w-9 text-right">{formatTime(currentTime)}</span>
              
              <div className="flex-1 relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isNaN(progressPercent) ? 0 : progressPercent}
                  onChange={handleSeekChange}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
                />
              </div>

              <span className="w-9">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Visualizer Preview, Volume & Expand */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Visualizer pill */}
            <div 
              onClick={onOpenFullPlayer} 
              className="w-24 h-8 bg-slate-900/80 rounded-xl px-1.5 border border-purple-500/20 cursor-pointer hover:border-purple-500/50 transition-colors flex items-center justify-center"
              title="Click for Full Immersive Visualizer"
            >
              <Visualizer barCount={18} height={28} />
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
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
                className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Expand Modal */}
            <button
              onClick={onOpenFullPlayer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Full Screen Immersive Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
};
