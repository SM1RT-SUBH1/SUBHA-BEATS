import React from 'react';
import { 
  Home, 
  Music, 
  Compass, 
  Heart, 
  DownloadCloud, 
  ListMusic,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';

interface FloatingNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { currentTheme } = useTheme();
  const { isPlaying, tracks, favoriteTrackIds, ytSavedTracks, devicePlaylistTrackIds } = useMusic();

  const savedCount = tracks.filter((t) => t.isOfflineCached).length;
  const totalPlaylistSongs = devicePlaylistTrackIds.length + ytSavedTracks.length;

  const navItems = [
    {
      id: 'featured',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'playlists',
      label: 'Playlists',
      icon: ListMusic,
      badge: totalPlaylistSongs > 0 ? `${totalPlaylistSongs}` : null,
      badgeColor: 'bg-purple-500 text-white',
    },
    {
      id: 'ytexplore',
      label: 'YT Music',
      icon: Compass,
      badge: 'LIVE',
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'downloads',
      label: 'Downloads',
      icon: DownloadCloud,
      badge: savedCount > 0 ? `${savedCount}` : null,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      badge: null,
    },
  ];

  return (
    <nav 
      aria-label="Floating Aceternity Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[96vw] w-fit sm:w-auto"
    >
      {/* Aceternity Glowing Background Glass Container - Strictly Center Aligned */}
      <div 
        className="relative rounded-2xl p-1 sm:p-1.5 backdrop-blur-2xl bg-[#080B15]/92 border border-white/10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.85)] flex items-center justify-center gap-0.5 sm:gap-1.5 overflow-hidden transition-all duration-300"
        style={{
          boxShadow: `0 12px 32px -6px ${currentTheme.glowColor}`
        }}
      >
        {/* Subtle Aceternity Border Glow Line */}
        <div 
          className="absolute inset-x-0 -top-px h-[1.5px] opacity-70"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, transparent)`
          }}
        />

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-xl transition-all duration-200 cursor-pointer select-none group flex-shrink-0 ${
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Aceternity Active Pill Indicator */}
              {isActive && (
                <motion.div
                  layoutId="floatingNavbarActiveIndicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: item.id === 'ytexplore'
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(185, 28, 28, 0.15))'
                      : `linear-gradient(135deg, ${currentTheme.glowColor.replace('0.35', '0.25')}, rgba(255, 255, 255, 0.05))`,
                    border: item.id === 'ytexplore'
                      ? '1px solid rgba(239, 68, 68, 0.4)'
                      : `1px solid ${currentTheme.primaryColor}55`,
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon & Live Badges */}
              <div className="relative z-10 flex items-center justify-center">
                <Icon 
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive 
                      ? item.id === 'ytexplore' 
                        ? 'text-red-400' 
                        : 'text-cyan-300' 
                      : 'text-slate-400'
                  }`}
                  style={{
                    color: isActive && item.id !== 'ytexplore' ? currentTheme.primaryColor : undefined
                  }}
                />

                {/* Live Music Equalizer Visualizer on active tab if playing */}
                {isActive && isPlaying && (
                  <div className="absolute -top-1 -right-2 flex items-end gap-[1px] h-2">
                    <span className="w-[1.5px] h-2 bg-emerald-400 rounded-full animate-wave" style={{ animationDelay: '0s' }} />
                    <span className="w-[1.5px] h-3 bg-cyan-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }} />
                  </div>
                )}

                {/* Badge (e.g. LIVE on YT Explore, Count on Playlists) */}
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full text-[8px] font-black uppercase tracking-wider ${item.badgeColor || 'bg-white/10 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span className={`relative z-10 text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-medium transition-colors ${
                isActive ? 'font-bold text-white' : 'text-slate-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
