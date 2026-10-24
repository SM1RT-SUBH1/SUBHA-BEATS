import React, { useState, useMemo } from 'react';
import { 
  History, 
  TrendingUp, 
  Users, 
  Radio, 
  Shuffle, 
  Play, 
  Pause, 
  Crown, 
  Sparkles, 
  Heart,
  ChevronRight,
  Download,
  WifiOff
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { useInstall } from '../context/InstallContext';
import { useTheme } from '../context/ThemeContext';
import { SUBHA_IMAGE_URL } from './BrandLogo';
import { Track } from '../types';
import confetti from 'canvas-confetti';

interface SpeedDialHomeProps {
  onOpenAccountModal: () => void;
  onOpenSyncModal: () => void;
  onOpenInstallModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenTrendingModal: () => void;
}

export const SpeedDialHome: React.FC<SpeedDialHomeProps> = ({
  onOpenAccountModal,
  onOpenSyncModal,
  onOpenInstallModal,
  onOpenHistoryModal,
  onOpenTrendingModal,
}) => {
  const { tracks, playlists, currentTrack, isPlaying, playTrack, togglePlayPause, favoriteTrackIds } = useMusic();
  const { user } = useAuth();
  const { isInstalled, promptInstall } = useInstall();
  const { theme } = useTheme();

  const [activeCategory, setActiveCategory] = useState<string>('Romance');
  const [speedDialPage, setSpeedDialPage] = useState<number>(0);

  const categories = [
    'Podcasts',
    'Relax',
    'Romance',
    'Feel good',
    'Bengali Melodies',
    'Workout',
    'Party',
    'Lofi',
    'Bollywood',
  ];

  // 9 speed dial items per page
  const speedDialTracks = useMemo(() => {
    let pool = tracks;
    if (activeCategory === 'Romance') {
      pool = tracks.filter((t) => t.category === 'romantic' || t.title.toLowerCase().includes('love') || t.title.toLowerCase().includes('tere'));
    } else if (activeCategory === 'Bengali Melodies') {
      pool = tracks.filter((t) => t.category === 'bengali');
    } else if (activeCategory === 'Lofi') {
      pool = tracks.filter((t) => t.category === 'lofi');
    } else if (activeCategory === 'Party' || activeCategory === 'Workout') {
      pool = tracks.filter((t) => t.category === 'electronic' || t.category === 'workout' || t.title.toLowerCase().includes('dance'));
    }
    if (pool.length < 9) {
      pool = tracks;
    }
    return pool;
  }, [tracks, activeCategory]);

  const displayedSpeedDial = speedDialTracks.slice(speedDialPage * 9, (speedDialPage + 1) * 9);

  const handleShufflePlay = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#A5D6A7', '#66BB6A', '#81C784', '#388E3C']
    });
    const shuffled = [...speedDialTracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  const userAvatar = user?.email === 'iamsubha4200@gmail.com'
    ? SUBHA_IMAGE_URL
    : (user?.photoURL || SUBHA_IMAGE_URL);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-3 pb-40 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header matching Screenshot 1 */}
      <header className="flex items-center justify-between pt-1">
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
          Home
        </h1>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* History Icon */}
          <button
            onClick={onOpenHistoryModal}
            className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Listening History"
          >
            <History className="w-5 h-5" />
          </button>

          {/* Trending Icon */}
          <button
            onClick={onOpenTrendingModal}
            className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Trending Beats"
          >
            <TrendingUp className="w-5 h-5" />
          </button>

          {/* Collaborative Cloud Sync Icon */}
          <button
            onClick={onOpenSyncModal}
            className="p-2 sm:p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95"
            title="Real-Time Cross-Device Sync"
          >
            <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          </button>

          {/* User Profile Avatar with Online Ring matching Screenshot 1 */}
          <div 
            onClick={onOpenAccountModal}
            className="relative cursor-pointer ml-1 group"
            title="Account & Settings (Meld)"
          >
            <img
              src={userAvatar}
              alt="Subhajit Sanpui"
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400/80 shadow group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = SUBHA_IMAGE_URL;
              }}
            />
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#06080F]" />
          </div>
        </div>
      </header>

      {/* Pill Category Filter Chips matching Screenshot 1 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSpeedDialPage(0);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                isActive
                  ? 'bg-[#2E3C30] text-[#A5D6A7] border-emerald-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Speed Dial Section matching Screenshot 1 */}
      <section className="space-y-3 relative">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
            Speed dial
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Tap any cover to play
          </span>
        </div>

        {/* 3-Column Square Grid matching Screenshot 1 */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          {displayedSpeedDial.map((track) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isCurrent) {
                    togglePlayPause();
                  } else {
                    playTrack(track, speedDialTracks);
                  }
                }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/5 transition-all duration-300 transform active:scale-95 hover:shadow-2xl"
              >
                {/* Full cover album art */}
                <img
                  src={track.thumbnail}
                  alt={track.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Dark bottom gradient overlay with text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5 sm:p-3">
                  <p className="font-heading font-bold text-xs sm:text-sm text-white truncate drop-shadow-md">
                    {track.title}
                  </p>
                </div>

                {/* Active Play Indicator Ring */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-9 h-9 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg">
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel indicator dots + Floating Shuffle FAB matching Screenshot 1 */}
        <div className="flex items-center justify-between pt-2">
          {/* Pagination dots */}
          <div className="flex items-center gap-1.5 pl-1">
            {[0, 1, 2].map((p) => (
              <button
                key={p}
                onClick={() => setSpeedDialPage(p)}
                className={`w-2 h-2 rounded-full transition-all ${
                  speedDialPage === p ? 'w-5 bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Floating Shuffle FAB matching Screenshot 1 */}
          <button
            onClick={handleShufflePlay}
            className="w-12 h-12 rounded-2xl bg-[#3B5441] hover:bg-[#48674F] text-[#A5D6A7] hover:text-white flex items-center justify-center shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-90 border border-emerald-500/30"
            title="Shuffle play speed dial"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Recently Played Section matching Screenshot 1 */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
            Recently Played
          </h2>
          <span className="text-xs text-slate-400">
            {tracks.length} HD Master Beats
          </span>
        </div>

        <div className="space-y-2">
          {tracks.slice(0, 8).map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={`recent-${track.id}-${idx}`}
                onClick={() => {
                  if (isCurrent) {
                    togglePlayPause();
                  } else {
                    playTrack(track);
                  }
                }}
                className={`flex items-center justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#223024] text-white shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200'
                }`}
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 shadow">
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

                <div className="min-w-0 flex-1">
                  <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'text-emerald-300 font-bold' : 'text-white'}`}>
                    {track.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>

                <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                  {track.durationFormatted}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curated Playlists Row */}
      <section className="space-y-3 pt-2">
        <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-400" />
          Subha Master Playlists
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {playlists.map((pl) => (
            <div
              key={pl.id}
              onClick={() => {
                const plTracks = tracks.filter((t) => pl.trackIds.includes(t.id));
                if (plTracks.length > 0) playTrack(plTracks[0], plTracks);
              }}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all flex items-center gap-3"
            >
              <img
                src={pl.coverImage || SUBHA_IMAGE_URL}
                alt={pl.title}
                className="w-12 h-12 rounded-xl object-cover shadow flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-white truncate">{pl.title}</h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{pl.trackIds.length} Songs</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mandatory Creator Attribution Footer */}
      <footer className="pt-6 pb-4 border-t border-white/5 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <img
            src={SUBHA_IMAGE_URL}
            alt="Subhajit Sanpui"
            className="w-6 h-6 rounded-full object-cover border border-emerald-400"
          />
          <span className="text-xs font-semibold text-slate-300">
            Crafted by <a href="https://smartsubhaportfolio.netlify.app" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-bold">Smart Subha</a> (Subhajit Sanpui)
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          All Copyright Reserved © Smart Subha • Official Studio
        </p>
      </footer>

    </div>
  );
};
