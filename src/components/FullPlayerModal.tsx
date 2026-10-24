import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Heart, 
  DownloadCloud, 
  Sliders, 
  ListMusic, 
  Disc, 
  Sparkles,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
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
    audioQuality,
    setAudioQuality,
    equalizerPreset,
    setEqualizerPreset,
    queue,
    playTrack,
    favoriteTrackIds,
    toggleFavorite,
    toggleOfflineCache,
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'visualizer' | 'queue' | 'equalizer'>('visualizer');
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave'>('bars');

  if (!isOpen || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isFav = favoriteTrackIds.includes(currentTrack.id);

  const presets = ['Bass Boost', 'Electronic', 'Vocal', 'Acoustic', 'Rock', 'Flat'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      
      {/* Dynamic blurred ambient glow behind player */}
      <div 
        className="absolute inset-0 opacity-25 filter blur-[100px] pointer-events-none scale-125"
        style={{
          backgroundImage: `url(${currentTrack.thumbnail})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover'
        }}
      />

      <div className="relative w-full max-w-4xl h-[92vh] max-h-[820px] rounded-3xl glass-panel border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-300">
              Smart Subha Studio Player
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'visualizer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visualizer
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'queue' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Queue ({queue.length})
            </button>
            <button
              onClick={() => setActiveTab('equalizer')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'equalizer' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Equalizer
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
          
          {activeTab === 'visualizer' && (
            <div className="w-full max-w-lg flex flex-col items-center gap-6">
              
              {/* Spinning Vinyl Cover Art */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/40 via-cyan-500/30 to-pink-500/40 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse-slow pointer-events-none" />

                <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-slate-950 p-3 shadow-2xl border-4 border-slate-800/80 ring-2 ring-purple-500/40 flex items-center justify-center overflow-hidden">
                  <img
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title}
                    className={`w-full h-full object-cover rounded-full ${
                      isPlaying ? 'animate-spin-slow' : 'pause-spin'
                    }`}
                  />
                  {/* Vinyl grooves overlay */}
                  <div className="absolute inset-0 rounded-full border-8 border-black/30 pointer-events-none" />
                  <div className="absolute inset-4 rounded-full border-2 border-white/10 pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-white/5 pointer-events-none" />
                  {/* Spindle hole */}
                  <div className="absolute w-8 h-8 rounded-full bg-slate-950 border-2 border-white/50 shadow-inner flex items-center justify-center">
                    <Disc className="w-4 h-4 text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Track Title & Artist */}
              <div className="text-center">
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-white tracking-tight">
                  {currentTrack.title}
                </h2>
                <p className="text-sm text-purple-300 font-medium mt-1">
                  {currentTrack.artist}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
                    {currentTrack.category.toUpperCase()}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    {audioQuality === 'ultra_hd' ? '320kbps Master' : '256kbps HQ'}
                  </span>
                </div>
              </div>

              {/* Immersive Waveform Visualizer */}
              <div className="w-full bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-inner flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Real-time Audio Spectrum
                  </span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setVisualizerMode('bars')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${visualizerMode === 'bars' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    >
                      Bars
                    </button>
                    <button 
                      onClick={() => setVisualizerMode('wave')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${visualizerMode === 'wave' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                    >
                      Wave
                    </button>
                  </div>
                </div>

                <Visualizer 
                  mode={visualizerMode}
                  barCount={32}
                  height={56}
                  className="w-full"
                />
              </div>

            </div>
          )}

          {activeTab === 'queue' && (
            <div className="w-full max-w-xl h-full flex flex-col gap-2">
              <h3 className="font-heading font-semibold text-sm text-slate-300 uppercase tracking-wider mb-2">
                Up Next ({queue.length} Tracks)
              </h3>
              <div className="space-y-2 overflow-y-auto max-h-[460px] pr-2">
                {queue.map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    onClick={() => playTrack(t)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      currentTrack.id === t.id
                        ? 'bg-purple-950/60 border-purple-500/60 text-purple-200'
                        : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="w-6 text-center text-xs font-mono text-slate-500">
                      {idx + 1}
                    </span>
                    <img
                      src={t.thumbnail}
                      alt={t.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-slate-500 truncate">{t.artist}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {t.durationFormatted}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'equalizer' && (
            <div className="w-full max-w-md flex flex-col gap-6">
              <div>
                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  Audio Engine & Equalizer
                </h3>
                <p className="text-xs text-slate-400">
                  Select tuned DSP presets and playback fidelity for YouTube audio streams.
                </p>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setEqualizerPreset(preset)}
                    className={`p-3 rounded-xl border text-sm font-semibold transition-all ${
                      equalizerPreset === preset
                        ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white border-transparent shadow-lg shadow-purple-600/30'
                        : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Quality Switcher */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Streaming Audio Fidelity
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: '128k STD' },
                    { id: 'high', label: '256k HQ' },
                    { id: 'ultra_hd', label: '320k Ultra HD' },
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setAudioQuality(q.id as any)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        audioQuality === q.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-white'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Scrubber & Controls */}
        <div className="px-6 py-5 bg-slate-950/90 border-t border-white/10 flex flex-col gap-3">
          
          {/* Scrubber */}
          <div className="w-full flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={isNaN(progressPercent) ? 0 : progressPercent}
              onChange={(e) => seekTo((parseFloat(e.target.value) / 100) * duration)}
              className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(currentTrack.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isFav
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isFav ? "Favorited" : "Add to Favorites"}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => toggleOfflineCache(currentTrack)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  currentTrack.isOfflineCached
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={currentTrack.isOfflineCached ? "Saved Offline" : "Sync Offline"}
              >
                <DownloadCloud className="w-5 h-5" />
              </button>
            </div>

            {/* Core Playback Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl transition-all ${
                  isShuffled ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button
                onClick={playPrevious}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-transform active:scale-95"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlayPause}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-slate-950 flex items-center justify-center shadow-xl shadow-purple-600/30 transition-transform hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
              </button>

              <button
                onClick={playNext}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 transition-transform active:scale-95"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2.5 rounded-xl transition-all ${
                  repeatMode !== 'off' ? 'text-purple-400 bg-purple-950/40 border border-purple-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
