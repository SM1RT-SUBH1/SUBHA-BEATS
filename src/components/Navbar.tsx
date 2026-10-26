import React, { useState } from 'react';
import { 
  Music, 
  Search, 
  Wifi, 
  WifiOff, 
  PlusCircle, 
  Radio, 
  Crown,
  Star,
  Download,
  Palette,
  Flame,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { useInstall } from '../context/InstallContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenAdminModal: () => void;
  onOpenOfflineModal: () => void;
  onOpenRealtimeSyncModal?: () => void;
  onOpenThemeModal?: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (t: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenAdminModal,
  onOpenOfflineModal,
  onOpenRealtimeSyncModal,
  onOpenThemeModal,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  const { isAdmin } = useAuth();
  const { isOfflineMode, toggleOfflineMode, tracks, realtimeSyncInfo } = useMusic();
  const { isInstalled, promptInstall } = useInstall();
  const { currentTheme } = useTheme();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const cachedCount = tracks.filter((t) => t.isOfflineCached).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090F]/95 border-b border-white/10 backdrop-blur-2xl transition-colors duration-500">
      
      {/* Dynamic top brand gradient beam */}
      <div 
        className="w-full h-[1.5px] transition-colors duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, transparent)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo & Studio Identity */}
        <div 
          onClick={() => setActiveTab('featured')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl p-[1.5px] bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-md">
            <div className="w-full h-full bg-[#080B14] rounded-2xl overflow-hidden relative">
              <img 
                src="/subhajit-sanpui.jpg" 
                alt="Subhajit Sanpui"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            {/* Live studio green badge */}
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#07090F]" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-base sm:text-lg tracking-tight text-white">
                Subha <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">BEATS</span>
              </span>
              {isAdmin && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
              Ultra-HQ YouTube Audio Studio
            </p>
          </div>
        </div>

        {/* Desktop Global Search Bar (Spotify Style) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:bg-slate-900 text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                title="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Search songs"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Real-time Cloud Sync Badge (Sm+ screens) */}
          {onOpenRealtimeSyncModal && (
            <button
              onClick={onOpenRealtimeSyncModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer"
              title="Cloud Sync Active"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Sync: {realtimeSyncInfo.roomCode}</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch Color Theme"
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
              <span className="hidden sm:inline">Theme</span>
            </button>
          )}

          {/* Install App Button */}
          <button
            onClick={() => promptInstall()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Install Web App"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isInstalled ? 'App Ready' : 'Install'}</span>
          </button>

          {/* Offline Mode Toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              isOfflineMode 
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isOfflineMode ? "Offline Mode (Cached songs only)" : "Online Streaming Mode"}
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-emerald-400" /> : <Wifi className="w-3.5 h-3.5 text-cyan-400" />}
            <span className="hidden md:inline">{isOfflineMode ? `Offline (${cachedCount})` : 'Live'}</span>
          </button>

          {/* Admin Song Add (If already unlocked) */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title="Add YouTube Song"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Song</span>
            </button>
          )}

          {/* PROMINENT ADMIN PANEL BUTTON (Crown Icon + Amber Border) */}
          <button
            onClick={onOpenAdminModal}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-extrabold border transition-all cursor-pointer shadow-md active:scale-95 ${
              isAdmin 
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 shadow-amber-500/20 ring-1 ring-amber-400/40' 
                : 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border-amber-500/50 text-amber-300 hover:border-amber-400 hover:bg-amber-500/25 hover:text-white'
            }`}
            title="Open Subha Beats Admin Panel (Protected by Secret Code)"
          >
            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30" />
            <span className="font-heading tracking-wide">Admin Panel</span>
          </button>

        </div>

      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 animate-in slide-in-from-top-2 duration-150">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists, Bangla melodies..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 text-xs text-white placeholder-slate-400 outline-none shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub Navigation Category Pills (Spotify App Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'featured', label: 'Featured', icon: Star },
          { id: 'all', label: `All Tracks (${tracks.length})`, icon: Music },
          { id: 'bengali', label: 'বাংলা (Bengali)', icon: Music },
          { id: 'trending', label: 'Trending', icon: Flame },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

    </header>
  );
};
