import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  History, 
  Shield, 
  FileText, 
  Info, 
  Mail, 
  Phone, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Palette, 
  Volume2, 
  Check, 
  Trash2, 
  Play, 
  Radio, 
  Smartphone, 
  CheckCircle2, 
  RefreshCw, 
  LogOut,
  LogIn,
  Disc3,
  Waves
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { useTheme } from '../context/ThemeContext';
import { Track } from '../types';

export const ProfileSettingsView: React.FC = () => {
  const { 
    user, 
    loginWithGoogle, 
    logout, 
    firebaseUser, 
    loading: authLoading 
  } = useAuth();
  
  const {
    recentHistory,
    playTrack,
    clearHistory,
    audioQuality,
    setAudioQuality,
    equalizerPreset,
    setEqualizerPreset,
    highRefreshRate,
    setHighRefreshRate,
    landscapeScaling,
    setLandscapeScaling,
    dynamicTheme,
    setDynamicTheme,
    dynamicIconColor,
    setDynamicIconColor,
    miniPlayerDesign,
    setMiniPlayerDesign,
    fullPlayerDesign,
    setFullPlayerDesign,
    playerBackgroundStyle,
    setPlayerBackgroundStyle,
    playerSliderStyle,
    setPlayerSliderStyle,
    spatialAudio,
    setSpatialAudio,
    normalizeVolume,
    setNormalizeVolume,
    crossfadeDuration,
    setCrossfadeDuration,
    triggerCloudSync,
    realtimeSyncInfo,
  } = useMusic();

  const { currentTheme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'settings' | 'about'>('profile');
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [showCustomEmailLogin, setShowCustomEmailLogin] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    await triggerCloudSync();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#06b6d4', '#8b5cf6', '#10b981']
    });
    setTimeout(() => setIsSyncing(false), 800);
  };

  const handleGoogleSignIn = async () => {
    await loginWithGoogle(customEmailInput ? customEmailInput : undefined);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#4285F4', '#EA4335', '#FBBC05', '#34A853']
    });
  };

  return (
    <div className="space-y-6 pb-28 pt-2 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7 border border-white/10 backdrop-blur-2xl shadow-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(8, 14, 28, 0.95), ${currentTheme.glowColor.replace('0.35', '0.15')}, rgba(3, 7, 18, 0.98))`
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 shadow-xl flex-shrink-0">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950">
                <img
                  src={user.photoURL || '/subhajit-sanpui.jpg'}
                  alt={user.displayName || 'User Profile'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/subhajit-sanpui.jpg';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold">
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>Connected Cloud Profile</span>
              </div>
              <h1 className="font-heading text-lg sm:text-2xl font-black text-white">
                {user.displayName || 'Subha Beats Listener'}
              </h1>
              <p className="text-xs text-slate-400">
                {user.email || 'iamsubha4200@gmail.com'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>
            <button
              onClick={() => logout()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>
          </div>
        </div>

        <div 
          className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: currentTheme.primaryColor }}
        />
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-slate-900/80 border border-white/10">
        {[
          { id: 'profile', label: 'Google Account', icon: User },
          { id: 'history', label: 'Playing History', icon: History, count: recentHistory.length },
          { id: 'settings', label: 'Audio & Appearance', icon: Settings },
          { id: 'about', label: 'About Creator (Subha)', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 min-w-[130px] py-2 sm:py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/20 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: GOOGLE ACCOUNT & CLOUD BACKUP */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Real Google Account Card */}
          <div className="rounded-3xl p-5 bg-[#0D1222]/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                  <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Google Gmail Sign-In & Live Sync</h3>
                <p className="text-xs text-slate-400">Save and access your playlists across all your phones and PCs</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Connected Account:</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {user.email || 'iamsubha4200@gmail.com'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Real-Time Sync Status:</span>
                <span className="text-cyan-300 font-mono">Live WebSocket Active</span>
              </div>
            </div>

            {/* Instant Google Login Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"/>
                <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"/>
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              </svg>
              <span>Connect with Google Account</span>
            </button>

            {/* Custom Gmail Input Option */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={() => setShowCustomEmailLogin(!showCustomEmailLogin)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Switch to custom Gmail address</span>
              </button>

              {showCustomEmailLogin && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="email"
                    value={customEmailInput}
                    onChange={(e) => setCustomEmailInput(e.target.value)}
                    placeholder="Enter your Gmail (e.g. you@gmail.com)"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-white/15 text-xs text-white placeholder-slate-400 outline-none"
                  />
                  <button
                    onClick={handleGoogleSignIn}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Save & Sync
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cloud Sync & Backup Details */}
          <div className="rounded-3xl p-5 bg-[#0D1222]/80 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Cloud Vault Synchronization</h3>
                <p className="text-xs text-slate-400">All playlists, favorites, and settings sync securely</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">Device Playlist Isolation</span>
                <span className="text-emerald-400 font-semibold">Active & Safe</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">YouTube Saved Playlist</span>
                <span className="text-cyan-400 font-semibold">Online Queue Linked</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-slate-300">Offline Caching Storage</span>
                <span className="text-purple-300 font-semibold">IndexedDB Ready</span>
              </div>
            </div>

            <button
              onClick={handleSyncCloud}
              disabled={isSyncing}
              className="w-full py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Cloud Storage...' : 'Sync Now with Cloud Vault'}</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: SONG PLAYING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Recently Played Songs ({recentHistory.length})</span>
              </h2>
              <p className="text-xs text-slate-400">
                Quickly replay songs you recently listened to on this device
              </p>
            </div>

            {recentHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          {recentHistory.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-2 p-6">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No Song History Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Play any song from Featured, All Songs, or YouTube Explorer to see your history logged here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {recentHistory.map((track, i) => (
                <div
                  key={`${track.id}_${i}`}
                  onClick={() => playTrack(track, recentHistory)}
                  className="group relative rounded-xl p-2.5 cursor-pointer transition-all border bg-[#0E1322]/80 hover:bg-[#151D33]/90 border-white/5 hover:border-white/20 flex items-center gap-2.5"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                    <img
                      src={track.thumbnail}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-80 group-hover:opacity-100">
                      <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="font-semibold text-xs text-slate-100 truncate group-hover:text-cyan-300">
                      {track.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {track.artist}
                    </p>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 block">
                      {track.durationFormatted || '3:30'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: EXTERNAL SETTINGS (APPEARANCE & AUDIO / MELD) */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          
          {/* SECTION 1: APPEARANCE SETTINGS */}
          <div className="rounded-3xl p-5 bg-[#0D1222]/80 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">1. Appearance & Display Settings</h3>
                <p className="text-xs text-slate-400">Configure visual themes, animations, and player styling</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* High Refresh Rate Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Enable High Refresh Rate (120Hz)</span>
                  <span className="text-[10px] text-slate-400">Hardware acceleration for silky smooth fluid animations</span>
                </div>
                <button
                  onClick={() => setHighRefreshRate(!highRefreshRate)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    highRefreshRate ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    highRefreshRate ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Landscape Scaling Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Landscape Scaling Mode</span>
                  <span className="text-[10px] text-slate-400">Optimizes widescreen player layout for tablets and landscape</span>
                </div>
                <button
                  onClick={() => setLandscapeScaling(!landscapeScaling)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    landscapeScaling ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    landscapeScaling ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Enable Dynamic Theme */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Enable Dynamic Theme</span>
                  <span className="text-[10px] text-slate-400">Adaptive ambient lighting based on album art colors</span>
                </div>
                <button
                  onClick={() => setDynamicTheme(!dynamicTheme)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    dynamicTheme ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    dynamicTheme ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Enable Dynamic Icon Colour */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Enable Dynamic Icon Colour</span>
                  <span className="text-[10px] text-slate-400">Picks active accent palette for play/pause icons</span>
                </div>
                <button
                  onClick={() => setDynamicIconColor(!dynamicIconColor)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    dynamicIconColor ? 'bg-cyan-500' : 'bg-slate-700'
                  }`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    dynamicIconColor ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

            </div>

            {/* Design Styles: Mini Player, Full Player, Background & Slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              
              {/* Mini Player Design */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Mini Player Design</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['blur', 'transparent', 'gradient'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setMiniPlayerDesign(mode)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        miniPlayerDesign === mode
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Player Design */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Full Player Design</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'modern', label: 'Modern' },
                    { id: 'glass', label: 'Glass' },
                    { id: 'vinyl', label: 'Vinyl' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setFullPlayerDesign(item.id as any)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        fullPlayerDesign === item.id
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Background Style */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Background Style</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['blur', 'gradient', 'solid'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setPlayerBackgroundStyle(style)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold capitalize transition-all cursor-pointer ${
                        playerBackgroundStyle === style
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Player Slider Style */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <span className="text-xs font-bold text-slate-200 block">Player Slider Style</span>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { id: 'wavy', label: 'Wavy Pulse' },
                    { id: 'default', label: 'Default' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setPlayerSliderStyle(item.id as any)}
                      className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        playerSliderStyle === item.id
                          ? 'bg-cyan-500 text-slate-950 font-black shadow'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: PLAYER & AUDIO (MELD AUDIO FEATURES) */}
          <div className="rounded-3xl p-5 bg-[#0D1222]/80 border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">2. Player & Audio (Meld Audio Features)</h3>
                <p className="text-xs text-slate-400">Audiophile master controls: Equalizer, 3D Spatial Audio, and crossfade</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Equalizer Presets */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Equalizer Sound Preset</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {['Bass Boost', 'Electronic', 'Vocal', 'Acoustic', 'Rock', 'Flat'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setEqualizerPreset(preset)}
                      className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        equalizerPreset === preset
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Quality */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Streaming Audio Bitrate Quality</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'standard', label: 'Standard 128kbps', desc: 'Data saver' },
                    { id: 'high', label: 'High 256kbps', desc: 'Balanced HD' },
                    { id: 'ultra_hd', label: 'Ultra HD 320kbps', desc: 'Studio Master' },
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setAudioQuality(q.id as any)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        audioQuality === q.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white shadow'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{q.label}</div>
                      <div className="text-[10px] text-slate-400">{q.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Spatial Audio & Volume Normalize Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">3D Spatial Stereo Audio</span>
                    <span className="text-[10px] text-slate-400">Headphone surround widening effect</span>
                  </div>
                  <button
                    onClick={() => setSpatialAudio(!spatialAudio)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      spatialAudio ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      spatialAudio ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">Normalize Volume</span>
                    <span className="text-[10px] text-slate-400">Prevents sudden loud peaks between songs</span>
                  </div>
                  <button
                    onClick={() => setNormalizeVolume(!normalizeVolume)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      normalizeVolume ? 'bg-cyan-500' : 'bg-slate-700'
                    }`}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      normalizeVolume ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Crossfade Duration Slider */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Song Crossfade Duration</span>
                  <span className="font-mono text-cyan-300 font-bold">{crossfadeDuration} seconds</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="1"
                  value={crossfadeDuration}
                  onChange={(e) => setCrossfadeDuration(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 4: ABOUT CREATOR & OWNER INFO (SUBHA) */}
      {activeTab === 'about' && (
        <div className="space-y-6">
          
          {/* Creator Profile Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-[#0E1528] via-[#090D1A] to-[#050811] border border-white/15 space-y-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-[2px] bg-gradient-to-tr from-cyan-400 via-purple-500 to-amber-400 shadow-2xl flex-shrink-0">
                <img
                  src="/subhajit-sanpui.jpg"
                  alt="Subhajit Sanpui"
                  className="w-full h-full object-cover rounded-3xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/icon.svg';
                  }}
                />
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow">
                  Owner
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <span>Smart Subha Beats Creator & Lead Architect</span>
                </div>

                <h2 className="font-heading text-2xl font-black text-white">
                  Subhajit Sanpui <span className="text-cyan-400">(Subha)</span>
                </h2>

                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Full-stack software engineer and music enthusiast. Designed and built Smart Subha Beats with real YouTube streaming, lockscreen background playback, offline caching, and real-time cloud sync.
                </p>

                {/* Direct Contacts */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <a
                    href="mailto:iamsubha4200@gmail.com"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>iamsubha4200@gmail.com</span>
                  </a>

                  <a
                    href="tel:8670225411"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>+91 8670225411</span>
                  </a>

                  <a
                    href="https://smartsubha.ai.studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 text-white text-xs font-bold shadow-md transition-opacity"
                  >
                    <span>My Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal: Terms & Privacy Modals Trigger */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Privacy Policy</h4>
                  <p className="text-[10px] text-slate-400">How your playlists and data are safely stored</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => setShowTermsModal(true)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Terms & Conditions</h4>
                  <p className="text-[10px] text-slate-400">Audio playback, streaming, and fair use guidelines</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </button>
          </div>

        </div>
      )}

      {/* PRIVACY POLICY MODAL */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Privacy Policy</span>
              </h3>
              <button 
                onClick={() => setShowPrivacyModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                Close
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong>Smart Subha Beats</strong> is committed to preserving user privacy and transparency.
              </p>
              <p>
                1. <strong>Device-Specific Playlists:</strong> Tracks added to your playlist stay strictly on your local browser storage and are never intermingled with default curated collections without your consent.
              </p>
              <p>
                2. <strong>Google Account Authentication:</strong> When you connect your Gmail account, we use standard Google OAuth to synchronize your favorites and playlists across your devices. We never read or store your personal emails or passwords.
              </p>
              <p>
                3. <strong>Offline Cache:</strong> Audio data cached offline is stored securely in your browser's IndexedDB and is never transmitted to any third party.
              </p>
              <p>
                For questions regarding privacy, contact <strong>iamsubha4200@gmail.com</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS MODAL */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-white/15 rounded-3xl p-6 max-w-lg w-full space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-heading text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Terms and Conditions</span>
              </h3>
              <button 
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1"
              >
                Close
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                Welcome to <strong>Smart Subha Beats</strong>. By accessing this music application, you agree to:
              </p>
              <p>
                1. <strong>Personal Non-Commercial Use:</strong> All audio streams and media are served for individual listening and educational appreciation of music.
              </p>
              <p>
                2. <strong>Copyright & Attribution:</strong> All songs, lyrics, and artwork remain the intellectual property of their respective artists, record labels, and publishers. YouTube streams adhere to standard public embedded playback terms.
              </p>
              <p>
                3. <strong>Admin Authorization:</strong> Admin actions such as adding global curated tracks or deleting songs are protected by owner security protocols.
              </p>
              <p>
                For inquiries or takedown requests, please email <strong>iamsubha4200@gmail.com</strong> or call <strong>+91 8670225411</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
