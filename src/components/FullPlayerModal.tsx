import React, { useState } from 'react';
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
  MoreVertical,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Check
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { Visualizer } from './Visualizer';
import confetti from 'canvas-confetti';

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
  } = useMusic();

  const { theme } = useTheme();

  const [activeView, setActiveView] = useState<'player' | 'queue' | 'lyrics' | 'equalizer'>('player');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [showSleepTimerModal, setShowSleepTimerModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  if (!isOpen || !currentTrack) return null;

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentTrack.title,
        text: `Listen to "${currentTrack.title}" by ${currentTrack.artist} on Smart Subha Beats!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
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

  const presets = ['Bass Boost', 'Electronic', 'Vocal', 'Acoustic', 'Rock', 'Flat'];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080B0F] text-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-300">
      
      {/* Dynamic blurred ambient glow behind player matching album artwork & theme */}
      <div 
        className="absolute inset-0 opacity-20 filter blur-[120px] pointer-events-none scale-125 transition-all duration-700"
        style={{
          backgroundImage: `url(${currentTrack.thumbnail})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />
      
      {/* Top Header Bar matching Screenshot 4 */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-4 pb-2">
        <button
          onClick={onClose}
          className="p-2.5 rounded-full hover:bg-white/10 active:scale-95 transition-all"
          title="Minimize player"
        >
          <ChevronDown className="w-6 h-6 text-slate-300" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-sm font-semibold tracking-wide text-white">Now Playing</span>
          <span className="text-xs text-slate-400 font-medium">Liked • Smart Subha Beats</span>
        </div>

        <button
          onClick={() => setActiveView(activeView === 'queue' ? 'player' : 'queue')}
          className={`p-2.5 rounded-full transition-all ${
            activeView === 'queue' ? 'bg-white/20 text-white' : 'text-slate-300 hover:bg-white/10'
          }`}
          title="Toggle Queue"
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </header>

      {/* Main Viewport Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-between max-w-md mx-auto w-full px-6 py-4 overflow-y-auto no-scrollbar">
        
        {activeView === 'player' && (
          <>
            {/* Massive Album Artwork matching Screenshot 4 */}
            <div className="flex-1 flex items-center justify-center py-2 sm:py-6">
              <div className="relative aspect-square w-full max-w-[340px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group">
                <img
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Ambient Visualizer Overlay when playing */}
                {isPlaying && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-3.5 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-5 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }} />
                    <span className="w-1.5 h-4 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                    <span className="text-[10px] font-mono text-emerald-300 font-bold ml-1">320k HD</span>
                  </div>
                )}
              </div>
            </div>

            {/* Track Info Row + Share & Like Action matching Screenshot 4 */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading font-black text-xl sm:text-2xl text-white truncate tracking-tight">
                    {currentTrack.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 truncate mt-0.5 font-medium">
                    {currentTrack.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
                    title="Share track"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => toggleFavorite(currentTrack.id)}
                    className={`p-3 rounded-full transition-all active:scale-90 ${
                      isFav 
                        ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white/5 text-slate-300 hover:text-white'
                    }`}
                    title={isFav ? "Favorited" : "Like Song"}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Progress Scrubber Slider matching Screenshot 4 */}
              <div className="space-y-1">
                <div className="relative flex items-center py-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isNaN(progressPercent) ? 0 : progressPercent}
                    onChange={handleSeekChange}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    style={{ accentColor: '#A5D6A7' }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Primary Transport Controls matching Screenshot 4 */}
              <div className="flex items-center justify-between gap-4 py-3">
                
                {/* Previous Button */}
                <button
                  onClick={playPrevious}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
                  title="Previous Track"
                >
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>

                {/* Big Pill Play / Pause Button in Soft Mint Green */}
                <button
                  onClick={togglePlayPause}
                  className="flex-1 py-4 px-6 rounded-full bg-[#A5D6A7] hover:bg-[#B9E4BB] text-slate-950 font-black text-base flex items-center justify-center gap-2.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-emerald-900/30 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-6 h-6 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                      <span>Play</span>
                    </>
                  )}
                </button>

                {/* Next Button */}
                <button
                  onClick={playNext}
                  className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
                  title="Next Track"
                >
                  <SkipForward className="w-6 h-6 fill-current" />
                </button>

              </div>

              {/* Bottom Toolbar Row matching Screenshot 4 */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-slate-400">
                <button
                  onClick={() => setActiveView('lyrics')}
                  className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                  title="Lyrics & Visualizer"
                >
                  <ListMusic className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setShowSleepTimerModal(true)}
                  className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
                    sleepTimerMinutes ? 'text-amber-400' : ''
                  }`}
                  title={sleepTimerMinutes ? `Sleep timer: ${sleepTimerMinutes}m` : "Sleep Timer"}
                >
                  <Moon className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleShuffle}
                  className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
                    isShuffled ? 'text-emerald-400' : ''
                  }`}
                  title={isShuffled ? "Shuffle Enabled" : "Shuffle Off"}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveView('equalizer')}
                  className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                  title="Equalizer & Audio Master"
                >
                  <Sliders className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleRepeat}
                  className={`p-2.5 rounded-full hover:bg-white/10 transition-colors ${
                    repeatMode !== 'off' ? 'text-emerald-400' : ''
                  }`}
                  title={`Repeat: ${repeatMode}`}
                >
                  <Repeat className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveView('queue')}
                  className="p-2.5 rounded-full hover:bg-white/10 transition-colors"
                  title="More Options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

            </div>
          </>
        )}

        {/* Queue View matching Screenshot 5 */}
        {activeView === 'queue' && (
          <div className="flex-1 flex flex-col gap-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-bold text-lg text-white">Current Playing Queue</h3>
              <button
                onClick={() => setActiveView('player')}
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                Back to Player
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {queue.map((track, idx) => {
                const isItemActive = currentTrack.id === track.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track)}
                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                      isItemActive 
                        ? 'bg-[#1F2E23] border border-emerald-500/40 text-white' 
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border border-transparent text-slate-300'
                    }`}
                  >
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${isItemActive ? 'text-emerald-300' : 'text-white'}`}>
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

        {/* Lyrics & Spectrum View */}
        {activeView === 'lyrics' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-200 text-center p-4">
            <div className="w-full max-w-sm h-32 flex items-center justify-center">
              <Visualizer barCount={32} height={80} className="w-full" />
            </div>
            <div className="space-y-3">
              <h4 className="text-base font-bold text-white flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Live 320kbps Audio Stream
              </h4>
              <p className="text-sm text-slate-300 italic max-w-xs mx-auto leading-relaxed">
                "{currentTrack.title}" by {currentTrack.artist}
              </p>
              <p className="text-xs text-slate-500">
                AI Bengali/Hindi Audio Translation Active
              </p>
            </div>
            <button
              onClick={() => setActiveView('player')}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
            >
              Back to Player
            </button>
          </div>
        )}

        {/* Equalizer View */}
        {activeView === 'equalizer' && (
          <div className="flex-1 flex flex-col gap-5 animate-in fade-in duration-200 p-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-bold text-lg text-white">Master Sound Equalizer</h3>
              <button
                onClick={() => setActiveView('player')}
                className="text-xs text-emerald-400 font-semibold hover:underline"
              >
                Back to Player
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setEqualizerPreset(preset)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border ${
                    equalizerPreset === preset
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 shadow-lg'
                      : 'bg-slate-900/60 border-white/5 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Volume Slider in Full Player */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 mt-auto">
              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                <span>Master Volume</span>
                <span>{volume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                style={{ accentColor: '#A5D6A7' }}
              />
            </div>
          </div>
        )}

      </main>

      {/* Sleep Timer Picker Modal */}
      {showSleepTimerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xs rounded-3xl bg-slate-900 border border-white/10 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                Sleep Timer
              </h4>
              <button onClick={() => setShowSleepTimerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[5, 15, 30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleSetSleepTimer(mins)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-center transition-all"
                >
                  {mins} Minutes
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xl animate-in fade-in slide-in-from-bottom">
          Link copied to clipboard!
        </div>
      )}

    </div>
  );
};
