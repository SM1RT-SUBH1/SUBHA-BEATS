import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Crown, 
  Radio, 
  Music, 
  WifiOff, 
  DownloadCloud, 
  Headphones, 
  LayoutGrid, 
  List, 
  Shuffle, 
  ArrowUp, 
  Search, 
  Filter,
  Star,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMusic } from './context/MusicContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { TrackCard } from './components/TrackCard';
import { TrackListItem } from './components/TrackListItem';
import { MusicPlayer } from './components/MusicPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { AddTrackModal } from './components/AddTrackModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { BengaliExplanationModal } from './components/BengaliExplanationModal';
import { Visualizer } from './components/Visualizer';
import { LoginGate } from './components/LoginGate';
import { Footer } from './components/Footer';
import { InstallAppModal } from './components/InstallAppModal';
import { RealtimeSyncModal } from './components/RealtimeSyncModal';
import { useInstall } from './context/InstallContext';
import { StarsBackground } from './components/ui/stars-background';
import { ShootingStars } from './components/ui/shooting-stars';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';

export const App: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { tracks, playlists, playTrack, currentTrack, isPlaying, isOfflineMode, favoriteTrackIds, featuredTrackIds } = useMusic();
  const { isInstalled, promptInstall } = useInstall();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedArtist, setSelectedArtist] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isOfflineOpen, setIsOfflineOpen] = useState(false);
  const [isBengaliOpen, setIsBengaliOpen] = useState(false);
  const [isRealtimeSyncOpen, setIsRealtimeSyncOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const topArtists = useMemo(() => {
    return [
      'ALL',
      'Arijit Singh',
      'Jeet Gannguli',
      'Raj Barman',
      'Atif Aslam',
      'Zubeen Garg',
      'Shaan',
      'Mohammed Irfan',
      'Nakash Aziz',
      'Akriti Kakkar',
      'Pritam',
      'Mohit Chauhan',
      'Monali Thakur',
      'Nachiketa',
    ];
  }, []);

  const alphabetList = useMemo(() => {
    return ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  }, []);

  // Filtered tracks
  const displayedTracks = useMemo(() => {
    let list = tracks;

    if (activeTab === 'featured') {
      if (!showAllTracks) {
        list = list.filter((t) => featuredTrackIds.includes(t.id));
      }
    } else if (activeTab === 'curated') {
      list = list.filter((t) => t.isCurated);
    } else if (activeTab === 'lofi') {
      list = list.filter((t) => t.category === 'lofi');
    } else if (activeTab === 'bengali') {
      list = list.filter((t) => t.category === 'bengali');
    } else if (activeTab === 'favorites') {
      list = list.filter((t) => favoriteTrackIds.includes(t.id));
    } else if (activeTab === 'offline') {
      list = list.filter((t) => t.isOfflineCached);
    }

    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    if (selectedArtist !== 'ALL') {
      list = list.filter((t) => t.artist.toLowerCase().includes(selectedArtist.toLowerCase()));
    }

    if (selectedLetter !== 'ALL') {
      list = list.filter((t) => t.title.toUpperCase().startsWith(selectedLetter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tracks, activeTab, showAllTracks, featuredTrackIds, selectedCategory, selectedArtist, selectedLetter, searchQuery, favoriteTrackIds]);

  const handleShufflePlayAll = () => {
    if (displayedTracks.length === 0) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#a855f7', '#06b6d4', '#ec4899', '#10b981']
    });

    const shuffled = [...displayedTracks].sort(() => Math.random() - 0.5);
    playTrack(shuffled[0], shuffled);
  };

  // Google Sign-In Gate
  if (!user && !authLoading) {
    return <LoginGate />;
  }

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 flex flex-col relative pb-32 overflow-x-hidden selection:bg-purple-500/30 selection:text-cyan-200">
      
      {/* Global Aceternity UI Stars & Cosmic Atmosphere Canvas */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <StarsBackground starDensity={0.0002} allStarsTwinkle={true} minTwinkleSpeed={0.4} maxTwinkleSpeed={1.2} />
        <ShootingStars minSpeed={15} maxSpeed={35} minDelay={2000} maxDelay={5000} starColor="#8B5CF6" trailColor="#06B6D4" />
        
        {/* Aceternity Aurora Radiance Orbs */}
        <div className="absolute -top-[25%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/12 blur-[150px] animate-pulse-slow" />
        <div className="absolute top-[25%] -right-[15%] w-[55vw] h-[55vw] rounded-full bg-cyan-500/10 blur-[160px] animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[10%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[170px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        onOpenOfflineModal={() => setIsOfflineOpen(true)}
        onOpenRealtimeSyncModal={() => setIsRealtimeSyncOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'featured') setShowAllTracks(true);
        }}
      />

      {/* Main Studio Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full flex flex-col gap-10 relative z-10">
        
        {/* Aceternity Master Hero Studio Card */}
        {activeTab === 'featured' && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.15)] bg-gradient-to-br from-slate-950/90 via-[#0B0F19] to-slate-900/90 backdrop-blur-2xl">
            {/* Subtle radial grid matrix overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b from-cyan-500/20 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              
              <div className="max-w-2xl space-y-5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Cloud Session: {user?.email}</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Smart Subha <br />
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    BEATS Master Studio
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {showAllTracks 
                    ? `Showing all ${tracks.length} master tracks. Enjoy crystal-clear YouTube audio with real IndexedDB offline caching and custom equalizer controls.`
                    : `Showing ${displayedTracks.length} Featured Beats handpicked by Subha Master Admin. Click "See All Songs" below to explore all ${tracks.length} tracks.`
                  }
                </p>

                {/* Aceternity Interactive Action Controls */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <HoverBorderGradient
                    containerClassName="rounded-2xl"
                    as="button"
                    onClick={handleShufflePlayAll}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-transform active:scale-95"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Shuffle Beats</span>
                  </HoverBorderGradient>

                  <button
                    onClick={() => setShowAllTracks(!showAllTracks)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-purple-950/40"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{showAllTracks ? "Show Only Featured" : `See All Songs (${tracks.length} Beats)`}</span>
                  </button>

                  <button
                    onClick={() => setIsRealtimeSyncOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-950/70 hover:bg-cyan-900/70 text-cyan-200 border border-cyan-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/20"
                    title="Real-Time 2-Way Sync across all devices"
                  >
                    <Radio className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>Real-Time Cloud Sync</span>
                  </button>

                  <button
                    onClick={() => setIsOfflineOpen(true)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-xs transition-colors"
                  >
                    <DownloadCloud className="w-4 h-4 text-emerald-400" />
                    <span>Real Offline Sync</span>
                  </button>

                  <button
                    onClick={() => promptInstall()}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 hover:from-emerald-900/60 hover:to-cyan-900/60 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/10"
                    title="Install Smart Subha Beats as a Native APK on Android Phone"
                  >
                    <Download className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>{isInstalled ? "APK Installed ✓" : "Install Android APK"}</span>
                  </button>
                </div>
              </div>

              {/* Real-time spectrum card widget */}
              <div className="w-full lg:w-80 p-5 rounded-2xl bg-slate-950/80 border border-purple-500/30 shadow-2xl flex flex-col gap-3 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    Live Frequency Stream
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold">
                    320kbps Master
                  </span>
                </div>

                <div className="h-16 flex items-center justify-center">
                  <Visualizer barCount={24} height={52} className="w-full" />
                </div>

                {currentTrack && (
                  <div className="pt-2 border-t border-white/5 flex items-center gap-2.5">
                    <img 
                      src={currentTrack.thumbnail} 
                      alt="" 
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-white truncate">{currentTrack.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentTrack.artist}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Featured Curated Playlists Row */}
        {activeTab === 'featured' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Official Curated Playlists
                </h2>
                <p className="text-xs text-slate-400">
                  Curated by Subha Admin with verified YouTube HD audio
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {playlists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => {
                    const plTracks = tracks.filter((t) => pl.trackIds.includes(t.id));
                    if (plTracks.length > 0) playTrack(plTracks[0], plTracks);
                  }}
                  className="group relative rounded-2xl p-4 bg-slate-900/60 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5 mb-3">
                    <img
                      src={pl.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400'}
                      alt={pl.title}
                      className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform duration-300 shadow-md flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                          {pl.title}
                        </h3>
                        {pl.isOfficial && (
                          <span className="p-0.5 rounded bg-amber-500/20 text-amber-300">
                            <Crown className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                        {pl.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[11px] text-cyan-400 font-mono">
                      {pl.trackIds.length} HD Tracks
                    </span>
                    <button 
                      className="w-8 h-8 rounded-full bg-purple-600/30 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center transition-all shadow-md group-hover:scale-110"
                      title="Play Playlist"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tracks Feed, Letter Filter & Quick Artists Bar */}
        <section className="space-y-4">
          
          {/* Header Row with View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                  {activeTab === 'featured' 
                    ? (showAllTracks ? `All Library Tracks (${tracks.length})` : `Featured Beats (${displayedTracks.length})`)
                    : activeTab === 'explore'
                    ? `All ${tracks.length} Master Audio Tracks`
                    : activeTab === 'bengali'
                    ? 'Bangla Melodies'
                    : activeTab === 'curated'
                    ? "Subha's Curated Bangers"
                    : activeTab === 'favorites'
                    ? "Your Favorite Tracks"
                    : "Offline Synced Library"
                  }
                </h2>

                {activeTab === 'featured' && !showAllTracks && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                    Homepage Curated
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-0.5">
                {activeTab === 'featured' && !showAllTracks 
                  ? "Admin featured songs active on homepage. Click 'See All' to unlock all tracks."
                  : `Showing ${displayedTracks.length} tracks ready for background YouTube audio streaming.`
                }
              </p>
            </div>

            {/* Right controls: See All / View Mode Switcher */}
            <div className="flex items-center gap-2">
              {activeTab === 'featured' && (
                <button
                  onClick={() => setShowAllTracks(!showAllTracks)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all active:scale-95"
                >
                  {showAllTracks ? "Show Only Featured" : `See All Songs (${tracks.length})`}
                </button>
              )}

              <button
                onClick={handleShufflePlayAll}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-all active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>

              <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="3D Card Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Studio Compact List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Artist Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 pl-1 pr-2 flex-shrink-0">
              <Filter className="w-3 h-3" /> Artist:
            </span>
            {topArtists.map((artist) => (
              <button
                key={artist}
                onClick={() => setSelectedArtist(artist)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedArtist === artist
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                {artist}
              </button>
            ))}
          </div>

          {/* Alphabetical Quick Jump Bar (A-Z) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 bg-slate-950/40 rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 pl-2 pr-1 flex-shrink-0">A-Z:</span>
            {alphabetList.map((char) => (
              <button
                key={char}
                onClick={() => setSelectedLetter(char)}
                className={`min-w-[26px] h-6 px-1 rounded-md text-[11px] font-mono font-semibold transition-all ${
                  selectedLetter === char
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Tracks Display: Grid or Compact List */}
          {displayedTracks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 space-y-3">
              <Headphones className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-300">No tracks match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting artist/letter filters or click See All Songs.
              </p>
              <button
                onClick={() => {
                  setSelectedArtist('ALL');
                  setSelectedLetter('ALL');
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowAllTracks(true);
                }}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
              >
                Reset All Filters & View All Songs
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {displayedTracks.map((track, idx) => (
                <TrackCard key={`${track.id}-${idx}`} track={track} index={idx} />
              ))}
            </div>
          ) : (
            <div className="space-y-1.5 rounded-2xl bg-slate-900/40 backdrop-blur-xl p-3 border border-white/5">
              {displayedTracks.map((track, idx) => (
                <TrackListItem key={`${track.id}-${idx}`} track={track} index={idx} />
              ))}
            </div>
          )}

          {/* See All Banner at Bottom if in Featured view */}
          {activeTab === 'featured' && !showAllTracks && displayedTracks.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/40 border border-purple-500/20 text-center space-y-3 mt-4 backdrop-blur-xl">
              <p className="text-sm text-slate-300">
                Want to listen to more songs? You have <strong>{tracks.length - displayedTracks.length} more tracks</strong> in the library!
              </p>
              <button
                onClick={() => setShowAllTracks(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
              >
                See All {tracks.length} Songs Now
              </button>
            </div>
          )}
        </section>

      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/40 hover:bg-purple-500 transition-all hover:scale-110 active:scale-95"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Floating Bottom Dock Music Player */}
      <MusicPlayer onOpenFullPlayer={() => setIsFullPlayerOpen(true)} />

      {/* Full-Screen Studio Player Modal */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
      />

      {/* Add Track via YouTube Modal (Admin only) */}
      <AddTrackModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Offline Sync Manager Modal */}
      <OfflineSyncModal
        isOpen={isOfflineOpen}
        onClose={() => setIsOfflineOpen(false)}
      />

      {/* Bengali Architecture Modal */}
      <BengaliExplanationModal
        isOpen={isBengaliOpen}
        onClose={() => setIsBengaliOpen(false)}
      />

      {/* PWA App Installation Modal */}
      <InstallAppModal />

      {/* Real-Time Cross-Device Cloud Sync Modal */}
      <RealtimeSyncModal
        isOpen={isRealtimeSyncOpen}
        onClose={() => setIsRealtimeSyncOpen(false)}
      />

      {/* Footer with Mandatory Copyright & Hyperlink */}
      <Footer 
        onOpenRealtimeSyncModal={() => setIsRealtimeSyncOpen(true)}
      />

    </div>
  );
};

export default App;
