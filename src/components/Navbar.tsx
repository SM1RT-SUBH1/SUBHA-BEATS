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
    <header className="sticky top-0 z-40 w-full bg-[#07090F]/90 backdrop-blur-2xl border-b border-white/10 transition-colors duration-500">
      
      {/* Dynamic top brand gradient beam */}
      <div 
        className="w-full h-[1.5px] transition-colors duration-500"
        style={{
          background: `linear-gradient(to right, transparent, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, transparent)`
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Studio Identity */}
        <div 
          onClick={() => setActiveTab('featured')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl p-[1.5px] bg-gradient-to-tr from-purple-500 to-cyan-400 shadow-md">
            <div className="w-full h-full bg-[#080B14] rounded-xl overflow-hidden relative">
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
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#07090F]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-heading font-black text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                Subha <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">BEATS</span>
              </span>
              {isAdmin && (
                <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  ADMIN
                </span>
              )}
            </div>
            <p className="text-[9px] text-slate-400 font-medium hidden sm:block">
              Ultra-HQ YouTube Audio Studio
            </p>
          </div>
        </div>

        {/* Desktop Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you want to play?"
              className="w-full pl-10 pr-9 py-1.5 rounded-full bg-slate-900/90 border border-white/10 focus:border-cyan-400 focus:bg-slate-900 text-xs text-white placeholder-slate-400 outline-none transition-all shadow-inner"
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

        {/* Right Action Controls - Ultra Compact for Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Search songs"
          >
            <Search className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Real-time Cloud Sync Badge (Lg+ screens) */}
          {onOpenRealtimeSyncModal && (
            <button
              onClick={onOpenRealtimeSyncModal}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all cursor-pointer"
              title="Cloud Sync Active"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Sync</span>
            </button>
          )}

          {/* Theme Switcher Button */}
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch Color Theme"
            >
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: currentTheme.primaryColor }} />
              <span className="hidden sm:inline">Theme</span>
            </button>
          )}

          {/* Install App Button (Desktop/Tablet) */}
          <button
            onClick={() => promptInstall()}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="Install Web App"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isInstalled ? 'Installed' : 'Install'}</span>
          </button>

          {/* Offline Mode Toggle */}
          <button
            onClick={toggleOfflineMode}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
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
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              title="Add YouTube Song"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}

          {/* PROMINENT ADMIN PANEL BUTTON (Compact on mobile) */}
          <button
            onClick={onOpenAdminModal}
            className={`flex items-center gap-1 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border transition-all cursor-pointer shadow-md active:scale-95 ${
              isAdmin 
                ? 'bg-amber-500/25 border-amber-400 text-amber-300 ring-1 ring-amber-400/40' 
                : 'bg-gradient-to-r from-amber-500/15 via-slate-900 to-amber-500/15 border-amber-500/50 text-amber-300 hover:border-amber-400 hover:bg-amber-500/25'
            }`}
            title="Open Subha Beats Admin Panel (Protected by Secret Code)"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span className="font-heading tracking-wide">
              <span className="inline sm:hidden">Admin</span>
              <span className="hidden sm:inline">Admin Panel</span>
            </span>
          </button>

        </div>

      </div>

      {/* Mobile Search Expandable Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden px-3 pb-2 animate-in slide-in-from-top-2 duration-150">
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-900 border border-cyan-400/50 text-xs text-white placeholder-slate-400 outline-none shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sub Navigation Category Pills - STRICTLY ONLY TWO OPTIONS as requested: Featured & All Songs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-2 pt-0.5 flex items-center gap-2">
        <button
          onClick={() => setActiveTab('featured')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'featured'
              ? 'bg-white text-slate-950 shadow-md scale-100'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${activeTab === 'featured' ? 'fill-current text-amber-500' : 'text-slate-400'}`} />
          <span>Featured</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-white text-slate-950 shadow-md scale-100'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Music className={`w-3.5 h-3.5 ${activeTab === 'all' ? 'text-purple-600' : 'text-slate-400'}`} />
          <span>All Songs</span>
        </button>
      </div>

    </header>
  );
};
