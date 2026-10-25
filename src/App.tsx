import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Download,
  ArrowUpDown,
  Flame,
  Volume2,
  X,
  Compass,
  Check
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
import { Footer } from './components/Footer';
import { InstallAppModal } from './components/InstallAppModal';
import { RealtimeSyncModal } from './components/RealtimeSyncModal';
import { ThemeSwitcherModal } from './components/ThemeSwitcherModal';
import { useInstall } from './context/InstallContext';
import { useTheme } from './context/ThemeContext';
import { StarsBackground } from './components/ui/stars-background';
import { ShootingStars } from './components/ui/shooting-stars';
import { HoverBorderGradient } from './components/ui/hover-border-gradient';

export const App: React.FC = () => {
  const { isAdmin } = useAuth();
  const { 
    tracks, 
    playlists, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    favoriteTrackIds, 
    featuredTrackIds 
  } = useMusic();
  const { isInstalled, promptInstall } = useInstall();
  const { currentTheme } = useTheme();

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('featured');
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedArtist, setSelectedArtist] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sorting Options: A-Z, Z-A, Artist A-Z, Artist Z-A, Newest, Duration
  const [sortBy, setSortBy] = useState<
    'featured' | 'az' | 'za' | 'artist-az' | 'artist-za' | 'newest' | 'duration-desc' | 'duration-asc'
  >('featured');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isOfflineOpen, setIsOfflineOpen] = useState(false);
  const [isRealtimeSyncOpen, setIsRealtimeSyncOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const catalogSearchRef = useRef<HTMLInputElement>(null);

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

  const focusCatalogSearch = () => {
    catalogSearchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      catalogSearchRef.current?.focus();
    }, 300);
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

  // Filtered and Sorted tracks
  const displayedTracks = useMemo(() => {
    let list = [...tracks];

    // Filter by Tab
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
    } else if (activeTab === 'trending') {
      list = list.filter((t) => t.category === 'trending');
    } else if (activeTab === 'favorites') {
      list = list.filter((t) => favoriteTrackIds.includes(t.id));
    } else if (activeTab === 'offline') {
      list = list.filter((t) => t.isOfflineCached);
    }

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Filter by Artist
    if (selectedArtist !== 'ALL') {
      list = list.filter((t) => t.artist.toLowerCase().includes(selectedArtist.toLowerCase()));
    }

    // Filter by Alphabet Letter
    if (selectedLetter !== 'ALL') {
      list = list.filter((t) => t.title.toUpperCase().startsWith(selectedLetter));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => 
        t.title.toLowerCase().includes(q) || 
        t.artist.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }

    // Apply Sorting: A-Z, Z-A, Artist A-Z, Artist Z-A, Newest, Duration
    switch (sortBy) {
      case 'az':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'artist-az':
        list.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
        break;
      case 'artist-za':
        list.sort((a, b) => b.artist.localeCompare(a.artist) || a.title.localeCompare(b.title));
        break;
      case 'newest':
        list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
        break;
      case 'duration-desc':
        list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        break;
      case 'duration-asc':
        list.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case 'featured':
      default:
        list.sort((a, b) => {
          const aFeatured = featuredTrackIds.includes(a.id) ? 1 : 0;
          const bFeatured = featuredTrackIds.includes(b.id) ? 1 : 0;
          return bFeatured - aFeatured;
        });
        break;
    }

    return list;
  }, [
    tracks, 
    activeTab, 
    showAllTracks, 
    featuredTrackIds, 
    selectedCategory, 
    selectedArtist, 
    selectedLetter, 
    searchQuery, 
    favoriteTrackIds,
    sortBy
  ]);

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

  const handlePlayAllInOrder = () => {
    if (displayedTracks.length === 0) return;
    playTrack(displayedTracks[0], displayedTracks);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bgClass} text-slate-100 flex flex-col relative pb-32 overflow-x-hidden selection:bg-purple-500/30 selection:text-cyan-200 transition-colors duration-500 font-sans`}>
      
      {/* Global Aceternity UI Stars & Cosmic Atmosphere Canvas with Dynamic Theme Radiance */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <StarsBackground starDensity={0.0002} allStarsTwinkle={true} minTwinkleSpeed={0.4} maxTwinkleSpeed={1.2} />
        <ShootingStars minSpeed={15} maxSpeed={35} minDelay={2000} maxDelay={5000} starColor={currentTheme.primaryColor} trailColor={currentTheme.secondaryColor} />
        
        {/* Dynamic Theme Aurora Radiance Orbs */}
        <div 
          className="absolute -top-[25%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[150px] animate-pulse-slow transition-all duration-700 opacity-20"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <div 
          className="absolute top-[25%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[160px] animate-pulse-slow transition-all duration-700 opacity-20" 
          style={{ backgroundColor: currentTheme.secondaryColor, animationDelay: '3s' }} 
        />
        <div 
          className="absolute bottom-[10%] left-[25%] w-[50vw] h-[50vw] rounded-full blur-[170px] animate-pulse-slow transition-all duration-700 opacity-15" 
          style={{ backgroundColor: currentTheme.accentColor, animationDelay: '1.5s' }} 
        />
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        onOpenOfflineModal={() => setIsOfflineOpen(true)}
        onOpenRealtimeSyncModal={() => setIsRealtimeSyncOpen(true)}
        onOpenThemeModal={() => setIsThemeOpen(true)}
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
                  <span>Ultra-HQ Music Streaming Engine Active • YouTube 320kbps</span>
                </div>

                <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Smart Subha <br />
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                    BEATS Audio Studio
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                  {showAllTracks 
                    ? `Showing all ${tracks.length} master tracks. Enjoy crystal-clear audio, live visualizer equalizer, and offline caching.`
                    : `Showing ${displayedTracks.length} handpicked Featured Beats by Subha Master. Click "Explore All Songs" or search below to access the full collection.`
                  }
                </p>

                {/* Interactive Action Controls with Dedicated Search Button */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handlePlayAllInOrder}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-xl shadow-purple-600/30 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play All Beats</span>
                  </button>

                  <HoverBorderGradient
                    containerClassName="rounded-2xl"
                    as="button"
                    onClick={handleShufflePlayAll}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-transform active:scale-95 cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4 text-purple-400" />
                    <span>Shuffle Beats</span>
                  </HoverBorderGradient>

                  {/* DEDICATED SEARCH BUTTON IN HERO */}
                  <button
                    onClick={focusCatalogSearch}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/10 cursor-pointer"
                    title="Search songs, artists, and Bangla melodies"
                  >
                    <Search className="w-4 h-4 text-cyan-300" />
                    <span>Search Library 🔍</span>
                  </button>

                  <button
                    onClick={() => setShowAllTracks(!showAllTracks)}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-purple-950/40 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{showAllTracks ? "Show Featured Only" : `Explore All (${tracks.length} Songs)`}</span>
                  </button>

                  <button
                    onClick={() => promptInstall()}
                    className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 hover:from-emerald-900/60 hover:to-cyan-900/60 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/10 cursor-pointer"
                    title="Install APK on Mobile"
                  >
                    <Download className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>{isInstalled ? "App Ready ✓" : "Install APK"}</span>
                  </button>
                </div>
              </div>

              {/* Real-time spectrum visualizer widget */}
              <div className="w-full lg:w-80 p-5 rounded-3xl bg-slate-950/80 border border-purple-500/30 shadow-2xl flex flex-col gap-3 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono flex items-center gap-1.5 text-cyan-300 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    Live Visualizer Wave
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
                      className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-white/10 shadow-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{currentTrack.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentTrack.artist}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Featured Curated Playlists Row with Dedicated Search Button */}
        {activeTab === 'featured' && !searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-400" />
                  Official Curated Playlists
                </h2>
                <p className="text-xs text-slate-400">
                  Curated with verified YouTube Ultra-HD audio
                </p>
              </div>

              {/* Dedicated Search button for Playlists */}
              <button
                onClick={focusCatalogSearch}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-cyan-400 text-xs text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search Songs</span>
              </button>
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
                    <span className="text-[11px] text-cyan-400 font-mono font-medium">
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

        {/* SONG CATALOG SECTION: DEDICATED SEARCH, A-Z / Z-A SORTING, & VIEW CONTROLS */}
        <section className="space-y-4">
          
          {/* Main Controls Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/70 border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
            
            {/* Row 1: Section Title & Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                    {activeTab === 'featured' 
                      ? (showAllTracks ? `All Library Songs (${tracks.length})` : `Featured Beats (${displayedTracks.length})`)
                      : activeTab === 'all'
                      ? `All Library Songs (${tracks.length})`
                      : activeTab === 'bengali'
                      ? `বাংলা Melodies (${displayedTracks.length})`
                      : activeTab === 'lofi'
                      ? `Lofi & Chill (${displayedTracks.length})`
                      : activeTab === 'trending'
                      ? `Trending Hits (${displayedTracks.length})`
                      : activeTab === 'curated'
                      ? `Subha's Picks (${displayedTracks.length})`
                      : activeTab === 'favorites'
                      ? `Your Favorite Songs (${displayedTracks.length})`
                      : `Offline Synced Songs (${displayedTracks.length})`
                    }
                  </h2>

                  {activeTab === 'featured' && !showAllTracks && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                      Homepage Curated
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {displayedTracks.length} of {tracks.length} songs ready for background audio playback.
                </p>
              </div>

              {/* View Switcher & Action Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {activeTab === 'featured' && (
                  <button
                    onClick={() => setShowAllTracks(!showAllTracks)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
                  >
                    {showAllTracks ? "Show Featured Only" : `See All Songs (${tracks.length})`}
                  </button>
                )}

                <button
                  onClick={handleShufflePlayAll}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/25 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Shuffle</span>
                </button>

                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="3D Card Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                    title="Studio Compact List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: DEDICATED SEARCH BAR & SORT BY SELECTOR */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-white/5">
              
              {/* Dedicated Search Input & Search Button */}
              <div className="md:col-span-7 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={catalogSearchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search songs, artists (Arijit, Jeet Gannguli, Atif...), Bangla melodies..."
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 outline-none shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => catalogSearchRef.current?.focus()}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>

              {/* SORT OPTIONS: A-Z, Z-A, ARTIST A-Z, ETC (GAN SHOW KORARA OPTION) */}
              <div className="md:col-span-5 flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <ArrowUpDown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e: any) => setSortBy(e.target.value)}
                    className="w-full bg-transparent text-xs text-cyan-300 font-semibold outline-none cursor-pointer"
                  >
                    <option value="featured" className="bg-slate-900 text-slate-200">⭐ Featured / Top Picks</option>
                    <option value="az" className="bg-slate-900 text-slate-200">🔤 Song Title: A → Z</option>
                    <option value="za" className="bg-slate-900 text-slate-200">🔤 Song Title: Z → A</option>
                    <option value="artist-az" className="bg-slate-900 text-slate-200">🎤 Artist Name: A → Z</option>
                    <option value="artist-za" className="bg-slate-900 text-slate-200">🎤 Artist Name: Z → A</option>
                    <option value="newest" className="bg-slate-900 text-slate-200">⏱️ Recently Added</option>
                    <option value="duration-desc" className="bg-slate-900 text-slate-200">⏳ Duration: Longest First</option>
                    <option value="duration-asc" className="bg-slate-900 text-slate-200">⚡ Duration: Shortest First</option>
                  </select>
                </div>

                {/* Quick A-Z / Z-A Fast Toggle Buttons */}
                <button
                  onClick={() => setSortBy(sortBy === 'az' ? 'za' : 'az')}
                  className={`px-3 py-2.5 rounded-2xl text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                    sortBy === 'az' || sortBy === 'za'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Song Name A-Z or Z-A"
                >
                  <span>{sortBy === 'za' ? 'Z→A' : 'A→Z'}</span>
                </button>
              </div>

            </div>

            {/* Quick Filter Categories Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'bengali', label: 'বাংলা (Bengali)' },
                { id: 'lofi', label: 'Lofi Chill' },
                { id: 'edm', label: 'EDM & Bass' },
                { id: 'trending', label: 'Trending Hits' },
                { id: 'pop', label: 'Pop' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Quick Artist Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1 pl-1 pr-1 flex-shrink-0">
                <Filter className="w-3 h-3 text-cyan-400" /> Artist:
              </span>
              {topArtists.map((artist) => (
                <button
                  key={artist}
                  onClick={() => setSelectedArtist(artist)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    selectedArtist === artist
                      ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm font-bold'
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {artist}
                </button>
              ))}
            </div>

            {/* Alphabetical Quick Jump Bar (A-Z) */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1.5 bg-slate-950/60 rounded-2xl border border-white/5">
              <span className="text-[10px] font-mono text-slate-500 pl-2 pr-1 flex-shrink-0">Alphabet A-Z:</span>
              {alphabetList.map((char) => (
                <button
                  key={char}
                  onClick={() => setSelectedLetter(char)}
                  className={`min-w-[26px] h-6 px-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                    selectedLetter === char
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {char}
                </button>
              ))}
            </div>

          </div>

          {/* Tracks Display: Grid or Compact List */}
          {displayedTracks.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/5 space-y-4">
              <Headphones className="w-12 h-12 text-slate-600 mx-auto animate-bounce" />
              <h3 className="text-base font-bold text-slate-300 font-heading">No songs match your search or filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting artist/letter filters, clearing your search query, or clicking See All Songs.
              </p>
              <button
                onClick={() => {
                  setSelectedArtist('ALL');
                  setSelectedLetter('ALL');
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowAllTracks(true);
                  setSortBy('featured');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
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
            <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-cyan-950/40 border border-purple-500/20 text-center space-y-3 mt-4 backdrop-blur-xl">
              <p className="text-sm text-slate-300">
                Want to listen to more songs? You have <strong>{tracks.length - displayedTracks.length} more tracks</strong> in the library!
              </p>
              <button
                onClick={() => setShowAllTracks(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
          className="fixed bottom-24 right-6 z-40 p-3 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-600/40 hover:bg-purple-500 transition-all hover:scale-110 active:scale-95 cursor-pointer"
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

      {/* Add Track via YouTube Modal */}
      <AddTrackModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />

      {/* Admin Panel Modal (Secret Code Protected) */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Offline Sync Manager Modal */}
      <OfflineSyncModal
        isOpen={isOfflineOpen}
        onClose={() => setIsOfflineOpen(false)}
      />

      {/* PWA App Installation Modal */}
      <InstallAppModal />

      {/* Real-Time Cross-Device Cloud Sync Modal */}
      <RealtimeSyncModal
        isOpen={isRealtimeSyncOpen}
        onClose={() => setIsRealtimeSyncOpen(false)}
      />

      {/* Color Themes Switcher Modal */}
      <ThemeSwitcherModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      {/* Mobile-Only Bottom Navigation Dock */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-2 inset-x-3 z-40 bg-[#07090E]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl flex items-center justify-around"
      >
        <button
          onClick={() => { setActiveTab('featured'); setShowAllTracks(false); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'featured'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          style={{
            backgroundColor: activeTab === 'featured' ? `${currentTheme.primaryColor}25` : 'transparent',
            color: activeTab === 'featured' ? currentTheme.primaryColor : undefined,
          }}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px]">Featured</span>
        </button>

        {/* Dedicated Search button in Mobile Dock */}
        <button
          onClick={() => {
            setShowAllTracks(true);
            focusCatalogSearch();
          }}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all text-slate-400 hover:text-cyan-300 cursor-pointer"
        >
          <Search className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px]">Search</span>
        </button>

        <button
          onClick={() => { setActiveTab('bengali'); setShowAllTracks(true); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'bengali'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          style={{
            backgroundColor: activeTab === 'bengali' ? `${currentTheme.primaryColor}25` : 'transparent',
            color: activeTab === 'bengali' ? currentTheme.primaryColor : undefined,
          }}
        >
          <Music className="w-4 h-4" />
          <span className="text-[10px]">বাংলা</span>
        </button>

        <button
          onClick={() => { setActiveTab('favorites'); setShowAllTracks(true); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'favorites'
              ? 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          style={{
            backgroundColor: activeTab === 'favorites' ? `${currentTheme.primaryColor}25` : 'transparent',
            color: activeTab === 'favorites' ? currentTheme.primaryColor : undefined,
          }}
        >
          <Star className="w-4 h-4" />
          <span className="text-[10px]">Favorites</span>
        </button>

        {/* Dedicated Admin Portal button in Mobile Dock (Secret Code Protected) */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isAdmin ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <Crown className={`w-4 h-4 ${isAdmin ? 'text-amber-400' : 'text-slate-400'}`} />
          <span className="text-[10px]">{isAdmin ? 'Admin' : 'Passcode'}</span>
        </button>

        <button
          onClick={() => setIsThemeOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all text-slate-400 hover:text-white cursor-pointer"
        >
          <span 
            className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
            style={{ backgroundColor: currentTheme.primaryColor }}
          />
          <span className="text-[10px]">Theme</span>
        </button>
      </nav>

      {/* Footer */}
      <Footer 
        onOpenRealtimeSyncModal={() => setIsRealtimeSyncOpen(true)}
      />

    </div>
  );
};

export default App;
