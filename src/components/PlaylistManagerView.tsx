import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Sparkles, 
  ListMusic, 
  Compass, 
  Music, 
  Clock, 
  Check, 
  Shuffle,
  Disc3,
  ExternalLink
} from 'lucide-react';
import { Track } from '../types';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

export const PlaylistManagerView: React.FC<{ onNavigateToYtExplore: () => void }> = ({
  onNavigateToYtExplore,
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    togglePlayPause, 
    tracks, 
    ytSavedTracks, 
    removeTrackFromYtPlaylist 
  } = useMusic();
  const { currentTheme } = useTheme();

  const [activeSection, setActiveSection] = useState<'subha' | 'yt'>('subha');

  // Subha's curated tracks from master catalog
  const subhaCuratedTracks = tracks.filter((t) => t.isCurated || t.category === 'bengali' || t.isFeatured);

  const handlePlaySubhaAll = () => {
    if (subhaCuratedTracks.length === 0) return;
    playTrack(subhaCuratedTracks[0], subhaCuratedTracks);
  };

  const handlePlayYtAll = () => {
    if (ytSavedTracks.length === 0) return;
    playTrack(ytSavedTracks[0], ytSavedTracks);
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), ${currentTheme.glowColor.replace('0.35', '0.15')}, rgba(3, 7, 18, 0.98))`
        }}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide">
              <ListMusic className="w-3.5 h-3.5" />
              <span>Smart Playlist & Queues</span>
            </div>

            <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
              Playlist <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Hub</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Manage your curated studio playlists and custom YouTube saved tracks with sequential playback.
            </p>
          </div>

          {/* Quick Play All Action */}
          <div className="flex items-center gap-2">
            {activeSection === 'subha' ? (
              <button
                onClick={handlePlaySubhaAll}
                disabled={subhaCuratedTracks.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play Subha Playlist ({subhaCuratedTracks.length})</span>
              </button>
            ) : (
              <button
                onClick={handlePlayYtAll}
                disabled={ytSavedTracks.length === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Play YouTube Playlist ({ytSavedTracks.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div 
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: currentTheme.primaryColor }}
        />
      </div>

      {/* Two Section Switcher Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-900/80 border border-white/10 max-w-md mx-auto shadow-inner">
        <button
          onClick={() => setActiveSection('subha')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'subha'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Subha Curated Playlist</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {subhaCuratedTracks.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSection('yt')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSection === 'yt'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>YouTube Saved Playlist</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
            {ytSavedTracks.length}
          </span>
        </button>
      </div>

      {/* SECTION 1: Subha's Curated Library Playlist */}
      {activeSection === 'subha' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>Curated Songs Queue ({subhaCuratedTracks.length})</span>
            </h2>
            <button
              onClick={handlePlaySubhaAll}
              className="text-xs text-cyan-300 hover:underline font-semibold cursor-pointer"
            >
              Play All Sequentially →
            </button>
          </div>

          <div className="space-y-2">
            {subhaCuratedTracks.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;
              return (
                <div
                  key={`${track.id}-${idx}`}
                  onClick={() => playTrack(track, subhaCuratedTracks)}
                  className={`group relative rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all duration-200 border flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-slate-900/95 border-purple-500/60 shadow-xl'
                      : 'bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="text-xs font-mono text-slate-500 w-5 text-center flex-shrink-0">
                      {idx + 1}
                    </span>

                    <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 shadow">
                      <img
                        src={track.thumbnail}
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                      {isCurrent && isPlaying && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
                          <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                          <span className="w-0.5 h-4 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className={`font-semibold text-xs sm:text-sm truncate ${
                        isCurrent ? 'text-cyan-300 font-bold' : 'text-slate-100 group-hover:text-purple-200'
                      }`}>
                        {track.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {track.artist}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      {track.durationFormatted || '3:30'}
                    </span>
                    <button
                      onClick={() => playTrack(track, subhaCuratedTracks)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                      title={isCurrent && isPlaying ? "Pause" : "Play"}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: YouTube Saved Playlist */}
      {activeSection === 'yt' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>YouTube Saved Songs ({ytSavedTracks.length})</span>
            </h2>
            {ytSavedTracks.length > 0 && (
              <button
                onClick={handlePlayYtAll}
                className="text-xs text-red-300 hover:underline font-semibold cursor-pointer"
              >
                Play All Sequentially →
              </button>
            )}
          </div>

          {ytSavedTracks.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
              <Compass className="w-10 h-10 text-red-400 mx-auto animate-pulse" />
              <h3 className="text-sm font-bold text-white">No YouTube songs saved yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search any song in the YT Explore tab and tap the <strong>+</strong> button to add it to your YouTube Playlist!
              </p>
              <button
                onClick={onNavigateToYtExplore}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                Go to YT Explore
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {ytSavedTracks.map((track, idx) => {
                const isCurrent = currentTrack?.id === track.id;
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    onClick={() => playTrack(track, ytSavedTracks)}
                    className={`group relative rounded-xl p-2.5 sm:p-3 cursor-pointer transition-all duration-200 border flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-slate-900/95 border-red-500/60 shadow-xl'
                        : 'bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span className="text-xs font-mono text-slate-500 w-5 text-center flex-shrink-0">
                        {idx + 1}
                      </span>

                      {/* Real YouTube Thumbnail */}
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 shadow">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${track.id}/hqdefault.jpg`;
                          }}
                        />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
                            <span className="w-0.5 h-3 bg-red-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }} />
                            <span className="w-0.5 h-4 bg-rose-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className={`font-semibold text-xs sm:text-sm truncate ${
                          isCurrent ? 'text-red-300 font-bold' : 'text-slate-100 group-hover:text-purple-200'
                        }`}>
                          {track.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                        {track.durationFormatted || '3:30'}
                      </span>

                      {/* Play Button */}
                      <button
                        onClick={() => playTrack(track, ytSavedTracks)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                        title={isCurrent && isPlaying ? "Pause" : "Play"}
                      >
                        {isCurrent && isPlaying ? (
                          <Pause className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        )}
                      </button>

                      {/* Remove from Playlist */}
                      <button
                        onClick={() => removeTrackFromYtPlaylist(track.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Remove from YouTube Playlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
