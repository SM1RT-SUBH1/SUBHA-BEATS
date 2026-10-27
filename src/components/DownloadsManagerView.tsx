import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Play, 
  Trash2, 
  Music, 
  Sparkles, 
  Disc3, 
  HardDrive, 
  ExternalLink,
  CheckCircle2,
  FolderDown,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { Track } from '../types';

interface DownloadsManagerViewProps {
  onNavigateToExplore?: () => void;
  onNavigateToCatalog?: () => void;
}

export const DownloadsManagerView: React.FC<DownloadsManagerViewProps> = ({
  onNavigateToExplore,
  onNavigateToCatalog,
}) => {
  const { 
    tracks, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlayPause,
    toggleOfflineCache,
    ytDownloadedTracks,
    removeDownloadedYtTrack
  } = useMusic();
  const { currentTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<'library' | 'youtube'>('library');

  // Filter library tracks that have been offline cached
  const libraryDownloadedTracks = tracks.filter((t) => t.isOfflineCached);

  const totalOfflineCount = libraryDownloadedTracks.length + ytDownloadedTracks.length;
  const estimatedStorageMb = (totalOfflineCount * 4.2).toFixed(1);

  const handlePlayAllLibraryDownloads = () => {
    if (libraryDownloadedTracks.length === 0) return;
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#06b6d4', '#8b5cf6']
    });
    playTrack(libraryDownloadedTracks[0], libraryDownloadedTracks);
  };

  const handlePlayAllYtDownloads = () => {
    if (ytDownloadedTracks.length === 0) return;
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ef4444', '#f59e0b', '#ec4899']
    });
    playTrack(ytDownloadedTracks[0], ytDownloadedTracks);
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(6, 12, 24, 0.95), ${currentTheme.glowColor.replace('0.35', '0.15')}, rgba(3, 7, 18, 0.98))`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>Offline Music Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
              <span className="text-emerald-300 font-semibold">{totalOfflineCount} Offline Saved</span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Downloaded <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">Songs</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Listen to your music offline without internet. Playlists play sequentially song-after-song directly from your device storage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 flex items-center gap-2 shadow-inner">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>~{estimatedStorageMb} MB Cached</span>
            </div>
          </div>
        </div>

        <div 
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: currentTheme.primaryColor }}
        />
      </div>

      {/* Two-Section Switcher Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 rounded-2xl bg-slate-900/80 border border-white/10 max-w-md mx-auto">
        <button
          onClick={() => setActiveSection('library')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'library'
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Library Downloads</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSection === 'library' ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
          }`}>
            {libraryDownloadedTracks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('youtube')}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSection === 'youtube'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>YouTube Downloads</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
            activeSection === 'youtube' ? 'bg-white/25 text-white' : 'bg-white/10 text-slate-400'
          }`}>
            {ytDownloadedTracks.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: LIBRARY DOWNLOADS */}
      {activeSection === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Curated Library Offline Songs ({libraryDownloadedTracks.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Downloaded from the Subha Beats main curated library
              </p>
            </div>

            {libraryDownloadedTracks.length > 0 && (
              <button
                onClick={handlePlayAllLibraryDownloads}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Library Downloads Queue</span>
              </button>
            )}
          </div>

          {libraryDownloadedTracks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                <FolderDown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Library Songs Downloaded Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                To download songs for offline playback, tap the Download icon on any track card in "All Songs".
              </p>
              {onNavigateToCatalog && (
                <button
                  onClick={onNavigateToCatalog}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Browse All Songs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {libraryDownloadedTracks.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, libraryDownloadedTracks)}
                    className={`group relative rounded-xl p-2.5 cursor-pointer transition-all border flex items-center gap-2.5 ${
                      isCurrent
                        ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg'
                        : 'bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isCurrent && isPlaying ? 'bg-black/60' : ''}`}>
                        {isCurrent && isPlaying ? (
                          <div className="flex items-center gap-0.5">
                            <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-wave" />
                            <span className="w-0.5 h-4 bg-teal-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                          </div>
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-white text-white opacity-80 group-hover:opacity-100 ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className={`font-semibold text-xs truncate ${isCurrent ? 'text-emerald-300 font-bold' : 'text-slate-100'}`}>
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {track.artist}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Offline Ready · {track.durationFormatted || '3:30'}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOfflineCache(track);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete offline download"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: YOUTUBE DOWNLOADS */}
      {activeSection === 'youtube' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>YouTube Offline Downloads ({ytDownloadedTracks.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Downloaded from YouTube Explorer for offline listening
              </p>
            </div>

            {ytDownloadedTracks.length > 0 && (
              <button
                onClick={handlePlayAllYtDownloads}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 hover:bg-red-400 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play YouTube Downloads Queue</span>
              </button>
            )}
          </div>

          {ytDownloadedTracks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-6">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No YouTube Songs Downloaded Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search any song on the "YT Music" explorer and tap the Download button to keep it offline.
              </p>
              {onNavigateToExplore && (
                <button
                  onClick={onNavigateToExplore}
                  className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/30"
                >
                  <span>Go to YouTube Music</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {ytDownloadedTracks.map((track) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track, ytDownloadedTracks)}
                    className={`group relative rounded-xl p-2.5 cursor-pointer transition-all border flex items-center gap-2.5 ${
                      isCurrent
                        ? 'bg-slate-900/95 border-red-500/60 shadow-lg'
                        : 'bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isCurrent && isPlaying ? 'bg-black/60' : ''}`}>
                        {isCurrent && isPlaying ? (
                          <div className="flex items-center gap-0.5">
                            <span className="w-0.5 h-3 bg-red-400 rounded-full animate-wave" />
                            <span className="w-0.5 h-4 bg-rose-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                          </div>
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-white text-white opacity-80 group-hover:opacity-100 ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <h4 className={`font-semibold text-xs truncate ${isCurrent ? 'text-red-300 font-bold' : 'text-slate-100'}`}>
                        {track.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {track.artist}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] text-red-400">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>YouTube Offline · {track.durationFormatted || '3:30'}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeDownloadedYtTrack(track.id);
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete offline download"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
