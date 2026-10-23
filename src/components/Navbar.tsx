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
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { useInstall } from '../context/InstallContext';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenAdminModal: () => void;
  onOpenOfflineModal: () => void;
  onOpenRealtimeSyncModal?: () => void;
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
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { isOfflineMode, toggleOfflineMode, tracks, realtimeSyncInfo } = useMusic();
  const { isInstalled, promptInstall } = useInstall();

  const cachedCount = tracks.filter((t) => t.isOfflineCached).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/80 border-b border-white/10 backdrop-blur-2xl">
      {/* Top subtle radiant beam */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('featured')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#080B14] rounded-2xl flex items-center justify-center">
              <Music className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080B14]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Smart Subha
              </span>
              <span className="font-heading font-black text-xl bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent tracking-wide">
                BEATS
              </span>
              {isAdmin && (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Admin
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
              Aceternity Audio Engine • 320k Ultra-HD
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

          {/* Authenticated User Status */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-white/10">
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                alt={user.displayName || 'User'}
                className="w-9 h-9 rounded-xl border border-purple-500/40 object-cover ring-2 ring-purple-500/20"
                title={`Logged in as ${user.email || user.displayName}`}
              />
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

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
