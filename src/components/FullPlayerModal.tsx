import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Heart, 
  Share2, 
  Moon, 
  Sliders, 
  ListMusic, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  DownloadCloud,
  CheckCircle2,
  Disc3,
  Layers,
  Radio,
  Flame,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { Visualizer } from './Visualizer';

interface FullPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullPlayerModal: React.FC<FullPlayerModalProps> = ({ isOpen, onClose }) => {
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
    queue,
    playTrack,
    favoriteTrackIds,
    toggleFavorite,
    equalizerPreset,
    setEqualizerPreset,
    toggleOfflineCache,
    downloadProgress,
    isOfflineMode,
  } = useMusic();

  const { currentTheme } = useTheme();

  const [activeView, setActiveView] = useState<'player' | 'queue' | 'visualizer' | 'equalizer'>('player');
  const [artDisplayMode, setArtDisplayMode] = useState<'card' | 'vinyl'>('vinyl');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favoriteTrackIds.includes(currentTrack.id);
  const progress = downloadProgress[currentTrack.id];
  const isDownloading = typeof progress === 'number' && progress < 100;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo((val / 100) * duration);
  };

  const handleHeartClick = () => {
    toggleFavorite(currentTrack.id);
    if (!isFav) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8']
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTrack.title,
        text: `🎵 Listening to "${currentTrack.title}" by ${currentTrack.artist} on Smart Subha Beats!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2200);
    }
  };

  const handleSetSleepTimer = (mins: number) => {
    setSleepTimerMinutes(mins);
    setShowSleepTimerModal(false);
    setTimeout(() => {
      if (isPlaying) togglePlayPause();
      setSleepTimerMinutes(null);
    }, mins * 60 * 1000);
  };

  const presets = [
    { name: 'Bass Boost', icon: '🔊', desc: 'Punchy low ends' },
    { name: 'Electronic', icon: '⚡', desc: 'Synth & EDM drive' },
    { name: 'Vocal', icon: '🎤', desc: 'Crystal clear voice' },
    { name: 'Acoustic', icon: '🎸', desc: 'Warm acoustic depth' },
    { name: 'Rock', icon: '🥁', desc: 'Dynamic mids & treble' },
    { name: 'Flat', icon: '✨', desc: 'Pure studio reference' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#05070D] text-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      
      {/* Dynamic multi-layer backdrop radiance */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-[100px] pointer-events-none scale-125 transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentTrack.thumbnail})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{ backgroundColor: currentTheme.primaryColor }}
      />
      <div 
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[140px] opacity-25 pointer-events-none"
        style={{ backgroundColor: currentTheme.secondaryColor }}
      />

      {/* Top Header Navigation */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-3 pb-2 border-b border-white/5 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="p-2 sm:p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all border border-white/10 text-slate-300 hover:text-white cursor-pointer"
          title="Minimize to Floating Player"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Center Title & Live Stream Indicator */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs sm:text-sm font-heading font-black tracking-wider uppercase bg-gradient-to-r from-purple-300 via-cyan-200 to-white bg-clip-text text-transparent">
              Smart Subha Beats
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-medium flex items-center gap-1">
            <span>320kbps Master HD</span>
            <span>•</span>
            <span className="text-cyan-400">YouTube Audio</span>
          </span>
        </div>

        {/* Art Display Toggle (Vinyl Record vs Glossy 3D Card) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setArtDisplayMode(artDisplayMode === 'vinyl' ? 'card' : 'vinyl')}
            className={`p-2 sm:p-2.5 rounded-2xl transition-all border cursor-pointer ${
              artDisplayMode === 'vinyl'
                ? 'bg-purple-600/30 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={artDisplayMode === 'vinyl' ? "Switch to 3D Glass Cover" : "Switch to Vinyl Disc Mode"}
          >
            <Disc3 className={`w-4 h-4 sm:w-5 sm:h-5 ${isPlaying ? 'animate-spin-slow' : ''}`} />
          </button>
        </div>
      </header>

      {/* View Switcher Tabs (Player / Equalizer / Visualizer / Queue) */}
      <div className="relative z-10 px-4 pt-2 pb-1 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl">
          {[
            { id: 'player', label: 'Player', icon: Play },
            { id: 'equalizer', label: 'Equalizer', icon: Sliders },
            { id: 'visualizer', label: 'Visualizer', icon: Sparkles },
            { id: 'queue', label: `Queue (${queue.length})`, icon: ListMusic },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})` 
                    : undefined,
                  boxShadow: isActive ? `0 4px 15px -3px ${currentTheme.glowColor}` : undefined
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Viewport Content */}
      <main className={`relative z-10 flex-1 min-h-0 flex flex-col ${activeView === 'player' ? 'justify-between overflow-y-auto' : 'overflow-hidden'} max-w-md sm:max-w-xl mx-auto w-full px-4 sm:px-6 py-2 sm:py-4 no-scrollbar`}>

        {/* 1. MAIN PLAYER VIEW */}
        {activeView === 'player' && (
          <div className="flex-1 flex flex-col justify-between gap-4">
            
            {/* Center Album Artwork & Vinyl Disc Stage */}
            <div className="flex-1 flex items-center justify-center py-2 relative">
              
              {artDisplayMode === 'vinyl' ? (
                /* Interactive Vinyl Stage */
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  
                  {/* Subtle pulsing background aura */}
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-40 transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, transparent)`
                    }}
                  />

                  {/* Vinyl Record Disc (slides out and rotates when playing) */}
                  <div 
                    className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-[#0a0a0e] border-4 border-slate-800 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-center transition-all duration-700 ease-out ${
                      isPlaying 
                        ? 'translate-x-8 sm:translate-x-12 rotate-45 animate-spin-slow' 
                        : 'translate-x-0'
                    }`}
                    style={{
                      background: 'radial-gradient(circle, #1a1a24 0%, #0d0d14 30%, #08080c 60%, #030306 100%)',
                    }}
                  >
                    {/* Vinyl Grooves */}
                    <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-5 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-8 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                    <div className="absolute inset-16 rounded-full border border-white/5 pointer-events-none" />
                    
                    {/* Vinyl Center Label */}
                    <div 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/60 shadow-inner relative flex items-center justify-center p-1"
                      style={{
                        background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
                      }}
                    >
                      <img 
                        src={currentTrack.thumbnail} 
                        alt="" 
                        className="w-full h-full object-cover rounded-full opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#05070d] border border-white/50 shadow" />
                      </div>
                    </div>
                  </div>

                  {/* Front Album Sleeve / Cover */}
                  <div 
                    className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 z-10 transition-transform duration-500 ${
                      isPlaying ? '-translate-x-6 sm:-translate-x-8 scale-95' : 'translate-x-0'
                    }`}
                  >
                    <img
                      src={currentTrack.thumbnail}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Gradient sheen */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/10 pointer-events-none" />
                    
                    {/* Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[10px] font-bold text-cyan-300 shadow">
                      STUDIO HQ
                    </div>

                    {/* Playing wave tag */}
                    {isPlaying && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 flex items-center gap-1 shadow">
                        <span className="w-1.5 h-3 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                        <span className="w-1.5 h-4 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
                        <span className="w-1.5 h-2.5 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* Glossy 3D Card Display */
                <div className="relative aspect-square w-full max-w-[280px] sm:max-w-[320px] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.85)] border border-white/15 group">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                  
                  {/* Real-time spectrum bars dancing at the bottom of the card */}
                  <div className="absolute bottom-3 inset-x-4 h-10 flex items-end justify-center gap-1.5">
                    <Visualizer barCount={18} height={36} className="w-full opacity-90" />
                  </div>
                </div>
              )}

            </div>

            {/* Song Meta Information & Quick Interactive Controls */}
            <div className="space-y-3.5">
              
              {/* Title & Artist Row with Like & Share & Offline */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-xl">
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading font-black text-lg sm:text-xl text-white truncate tracking-tight">
                    {currentTrack.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-cyan-300 truncate mt-0.5 font-semibold flex items-center gap-1.5">
                    <span>{currentTrack.artist}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-mono">
                      {currentTrack.category.toUpperCase()}
                    </span>
                  </p>
                </div>

                {/* Right Interactive Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  
                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/5 cursor-pointer"
                    title="Share song link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  {/* Offline Cache Download button */}
                  <button
                    onClick={() => toggleOfflineCache(currentTrack)}
                    disabled={isDownloading}
                    className={`p-2.5 rounded-xl transition-all active:scale-95 border cursor-pointer ${
                      currentTrack.isOfflineCached
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                        : isDownloading
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-white/5'
                    }`}
                    title={currentTrack.isOfflineCached ? "Cached offline" : "Save for offline listening"}
                  >
                    {currentTrack.isOfflineCached ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <DownloadCloud className="w-4 h-4" />
                    )}
                  </button>

                  {/* Like / Heart Button */}
                  <button
                    onClick={handleHeartClick}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 border cursor-pointer ${
                      isFav
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-md shadow-rose-500/20'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-white/5'
                    }`}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                </div>
              </div>

              {/* Progress Scrubber with Glowing Gradient Track */}
              <div className="space-y-1.5 px-1">
                <div className="relative flex items-center py-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isNaN(progressPercent) ? 0 : progressPercent}
                    onChange={handleSeekChange}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all shadow-inner"
                    style={{ 
                      accentColor: currentTheme.primaryColor 
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold px-0.5">
                  <span className="text-cyan-300">{formatTime(currentTime)}</span>
                  <span className="text-slate-500">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Primary Transport Controls (Vibrant, Iconic, Ergonomic) */}
              <div className="flex items-center justify-between gap-3 px-2 py-1">
                
                {/* Shuffle Button */}
                <button
                  onClick={toggleShuffle}
                  className={`p-3 rounded-2xl transition-all active:scale-90 border cursor-pointer ${
                    isShuffled
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                  title={isShuffled ? "Shuffle Enabled" : "Shuffle Off"}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                {/* Skip Previous Button */}
                <button
                  onClick={playPrevious}
                  className="w-12 h-12 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer hover:border-purple-500/40"
                  title="Previous Track"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Big Vibrant Glowing Master Play / Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl text-slate-950 flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative group"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`,
                    boxShadow: `0 8px 30px -4px ${currentTheme.glowColor}`
                  }}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {/* Subtle inner pulse ring */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-white/40 pointer-events-none" />
                  {isPlaying ? (
                    <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />
                  ) : (
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white ml-1" />
                  )}
                </button>

                {/* Skip Next Button */}
                <button
                  onClick={playNext}
                  className="w-12 h-12 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-white flex items-center justify-center transition-all active:scale-90 shadow-md cursor-pointer hover:border-cyan-500/40"
                  title="Next Track"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Repeat Button */}
                <button
                  onClick={toggleRepeat}
                  className={`p-3 rounded-2xl transition-all active:scale-90 border cursor-pointer ${
                    repeatMode !== 'off'
                      ? 'bg-purple-500/25 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/20'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Repeat Mode: ${repeatMode.toUpperCase()}`}
                >
                  <Repeat className="w-5 h-5" />
                </button>

              </div>

              {/* Bottom Quick Feature Strip (Equalizer, Sleep Timer, Volume) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                
                {/* Equalizer Quick Tab */}
                <button
                  onClick={() => setActiveView('equalizer')}
                  className="p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/5 hover:border-purple-500/40 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">{equalizerPreset}</span>
                </button>

                {/* Sleep Timer */}
                <button
                  onClick={() => setShowSleepTimerModal(true)}
                  className={`p-2.5 rounded-2xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    sleepTimerMinutes !== null
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                      : 'bg-slate-900/70 hover:bg-slate-800/80 border-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-amber-400" />
                  <span>{sleepTimerMinutes !== null ? `${sleepTimerMinutes}m` : 'Sleep'}</span>
                </button>

                {/* Volume Quick Mute / Unmute */}
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-2xl bg-slate-900/70 hover:bg-slate-800/80 border border-white/5 hover:border-cyan-500/40 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  <span>{isMuted ? 'Muted' : `${volume}%`}</span>
                </button>

              </div>

            </div>

          </div>
        )}

        {/* 2. SOUND EQUALIZER VIEW */}
        {activeView === 'equalizer' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-200 p-2">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  Master Sound Equalizer
                </h3>
                <p className="text-xs text-slate-400">Audio mastering tuned for Smart Subha Beats</p>
              </div>
              <button
                onClick={() => setActiveView('player')}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
              >
                Done
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((p) => {
                const isSelected = equalizerPreset === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => setEqualizerPreset(p.name)}
                    className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-400 text-white shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/50'
                        : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{p.icon}</span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                    <p className="font-bold text-xs text-white">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{p.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Master Volume Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2 mt-auto">
              <div className="flex items-center justify-between text-xs text-slate-200 font-bold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  Master Studio Volume
                </span>
                <span className="font-mono text-cyan-300">{isMuted ? 'Muted' : `${volume}%`}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: currentTheme.secondaryColor }}
              />
            </div>

          </div>
        )}

        {/* 3. VISUALIZER & LYRICS VIEW */}
        {activeView === 'visualizer' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-200 text-center p-3">
            
            <div className="w-full max-w-sm h-36 flex items-center justify-center p-4 rounded-3xl bg-slate-900/70 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
              <Visualizer barCount={32} height={90} className="w-full" />
            </div>

            <div className="space-y-2 max-w-xs">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Audio Frequency Stream</span>
              </div>
              <h4 className="font-heading font-black text-lg text-white">
                "{currentTrack.title}"
              </h4>
              <p className="text-xs text-slate-400">
                Performed by <strong className="text-purple-300">{currentTrack.artist}</strong>
              </p>
            </div>

            <button
              onClick={() => setActiveView('player')}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              Return to Player
            </button>
          </div>
        )}

        {/* 4. PLAYING QUEUE VIEW */}
        {activeView === 'queue' && (
          <div className="flex-1 min-h-0 flex flex-col gap-3 animate-in fade-in duration-200 h-full">
            
            <div className="flex items-center justify-between pb-2 border-b border-white/10 shrink-0">
              <div>
                <h3 className="font-heading font-bold text-base text-white">Playing Queue ({queue.length})</h3>
                <p className="text-xs text-slate-400">Tap any song to play next</p>
              </div>
              <button
                onClick={() => setActiveView('player')}
                className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
              >
                Back to Player
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 no-scrollbar pb-16">
              {queue.map((track, idx) => {
                const isItemActive = currentTrack.id === track.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${
                      isItemActive
                        ? 'bg-purple-950/60 border-purple-500/50 text-white shadow-md'
                        : 'bg-slate-900/50 hover:bg-slate-900/80 border-white/5 text-slate-300'
                    }`}
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold truncate ${isItemActive ? 'text-cyan-300' : 'text-white'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{track.durationFormatted}</span>
                  </div>
                );
              })}
            </div>

          </div>
        )}

      </main>

      {/* Sleep Timer Picker Modal */}
      {showSleepTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-white/10 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                Audio Sleep Timer
              </h4>
              <button onClick={() => setShowSleepTimerModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[5, 15, 30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center transition-all border cursor-pointer ${
                    sleepTimerMinutes === mins
                      ? 'bg-amber-500/25 border-amber-500 text-amber-300'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-white/5 text-slate-200'
                  }`}
                >
                  {mins} Minutes
                </button>
              ))}
            </div>

            {sleepTimerMinutes !== null && (
              <button
                onClick={() => {
                  setSleepTimerMinutes(null);
                  setShowSleepTimerModal(false);
                }}
                className="w-full py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
              >
                Cancel Timer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Track link copied to clipboard!</span>
        </div>
      )}

    </div>
  );
};
