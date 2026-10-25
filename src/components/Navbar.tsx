import React from 'react';
import { 
  Music, 
  Search, 
  Shield, 
  Wifi, 
  WifiOff, 
  LogOut, 
  PlusCircle, 
  Radio, 
  Sparkles,
  Crown,
  Star,
  Download,
  Palette
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
  onOpenNameModal?: () => void;
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
  onOpenNameModal,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { isOfflineMode, toggleOfflineMode, tracks, realtimeSyncInfo } = useMusic();
  const { isInstalled, promptInstall } = useInstall();
  const { currentTheme } = useTheme();

  const cachedCount = tracks.filter((t) => t.isOfflineCached).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/85 border-b border-white/10 backdrop-blur-2xl">
      {/* Top subtle radiant beam */}
      <div 
        className="absolute top-0 inset-x-0 h-[1.5px] transition-colors duration-500" 
        style={{
          background: `linear-gradient(to right, transparent, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, transparent)`
        }}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Name with Subhajit Photo */}
        <div 
          onClick={() => setActiveTab('featured')}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group flex-shrink-0"
        >
          <div 
            className="relative w-12 h-12 rounded-2xl p-[1.5px] shadow-lg transition-transform duration-300 group-hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, ${currentTheme.accentColor})`,
              boxShadow: `0 8px 24px -4px ${currentTheme.glowColor}`
            }}
          >
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
            {/* Music note badge floating on logo */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#080B14] rounded-full border border-cyan-400/60 flex items-center justify-center shadow">
              <Music className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
            </div>
            {/* Live studio green status dot */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#080B14] shadow" />
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Smart Subha
              </span>
              <span 
                className="font-heading font-black text-lg sm:text-xl tracking-wide bg-gradient-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
                }}
              >
                BEATS
              </span>
              {isAdmin && (
                <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Ultra-HD Studio • 320kbps</span>
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 271+ master tracks..."
              className="relative w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/40 focus:outline-none text-sm text-slate-200 placeholder-slate-500 transition-all shadow-inner backdrop-blur-md"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
          
          {/* Real-Time Cross-Device Cloud Sync Button */}
          <button
            onClick={onOpenRealtimeSyncModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:text-white shadow-md shadow-cyan-500/20 active:scale-95 hover:border-cyan-400"
            title="Real-Time Sync Active Across All Devices"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden sm:inline">
              Sync: {realtimeSyncInfo.roomCode}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          </button>

          {/* Install APK App Button */}
          <button
            onClick={() => promptInstall()}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all duration-200 shadow-md ${
              isInstalled
                ? 'bg-slate-900/70 border-emerald-500/40 text-emerald-300'
                : 'bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-cyan-500/30 border-purple-500/50 text-white hover:border-cyan-400 hover:from-purple-600/50 hover:to-cyan-500/50 shadow-purple-500/20 active:scale-95'
            }`}
            title="Install Smart Subha Beats APK on Mobile Phone"
          >
            <Download className={`w-4 h-4 ${isInstalled ? 'text-emerald-400' : 'text-cyan-300 animate-bounce'}`} />
            <span>
              {isInstalled ? 'APK Installed ✓' : 'Install APK'}
            </span>
            {!isInstalled && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black shadow-sm">
                APK
              </span>
            )}
          </button>

          {/* Color Themes Switcher Button */}
          {onOpenThemeModal && (
            <button
              onClick={onOpenThemeModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 bg-slate-900/60 border-slate-700/60 text-slate-300 hover:text-white hover:border-slate-500 cursor-pointer active:scale-95 shadow-sm"
              title="Change Color Theme"
            >
              <Palette 
                className="w-4 h-4 transition-transform group-hover:rotate-12" 
                style={{ color: currentTheme.primaryColor }}
              />
              <span className="hidden md:inline">Theme</span>
            </button>
          )}

          {/* Offline Sync Mode Button */}
          <button
            onClick={toggleOfflineMode}
            title={isOfflineMode ? "Offline Mode Active (Cached tracks only)" : "Online Mode (Streaming live)"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
              isOfflineMode 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10' 
                : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-4 h-4 text-emerald-400" /> : <Wifi className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">
              {isOfflineMode ? `Offline (${cachedCount})` : 'Live Stream'}
            </span>
          </button>

          {/* Add Track Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="Add YouTube Beat (Admin Only)"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Beat</span>
            </button>
          )}

          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdminModal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isAdmin 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30' 
                : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500'
            }`}
            title="Subha Master Security Portal"
          >
            <Shield className={`w-4 h-4 ${isAdmin ? 'text-amber-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isAdmin ? 'Admin Console' : 'Admin'}</span>
          </button>

          {/* User Profile / Name Button */}
          <button
            onClick={onOpenNameModal}
            className="flex items-center gap-2 pl-2 border-l border-white/10 hover:opacity-90 transition-opacity cursor-pointer group"
            title="নাম পরিবর্তন করুন (Change Name)"
          >
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
              alt={user.displayName}
              className="w-9 h-9 rounded-xl border border-purple-500/40 object-cover ring-2 ring-purple-500/20 group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                {user.displayName}
              </span>
              <span className="text-[10px] text-cyan-400 font-medium group-hover:underline">Edit Name ✏️</span>
            </div>
          </button>

        </div>
      </div>

      {/* Sub Navigation Tabs with Aceternity glowing pill styling */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {[
            { id: 'featured', label: '⭐ Featured Beats', icon: Star },
            { id: 'explore', label: 'All 271 Tracks', icon: Music },
            { id: 'curated', label: "Subha's Picks", icon: Crown },
            { id: 'bengali', label: 'Bangla Melodies', icon: Music },
            { id: 'favorites', label: 'Favorites', icon: Star },
            { id: 'offline', label: `Offline Cached (${cachedCount})`, icon: WifiOff },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'text-cyan-300 bg-gradient-to-r from-purple-900/50 via-slate-900/90 to-cyan-950/50 border border-cyan-500/40 shadow-lg shadow-cyan-500/15'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent hover:border-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Total tracks indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span className="text-slate-300 font-mono">{tracks.length} HD Tracks Synced</span>
        </div>
      </div>
    </header>
  );
};
