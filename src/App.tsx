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
  Check,
  Home
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
import { YTMusicExplorer } from './components/YTMusicExplorer';
import { FloatingNavbar } from './components/FloatingNavbar';
import { PlaylistManagerView } from './components/PlaylistManagerView';
import { useInstall } from './context/InstallContext';
import { useTheme } from './context/ThemeContext';
import { StarsBackground } from './components/ui/stars-background';
import { ShootingStars } from './components/ui/shooting-stars';

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
  const [isBengaliOpen, setIsBengaliOpen] = useState(false);
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
      particleCount: 40,
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
    <div 
      className="min-h-screen text-slate-100 flex flex-col relative pb-36 md:pb-28 overflow-x-hidden transition-colors duration-500 font-sans"
      style={{ backgroundColor: 'var(--theme-bg, #06080F)' }}
    >
      
      {/* Background Starry Canvas & Theme Atmosphere */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <StarsBackground starDensity={0.00015} allStarsTwinkle={true} minTwinkleSpeed={0.5} maxTwinkleSpeed={1.5} />
        <ShootingStars minSpeed={15} maxSpeed={35} minDelay={3000} maxDelay={7000} starColor={currentTheme.primaryColor} trailColor={currentTheme.secondaryColor} />
        
        {/* Soft Ambient Radiance */}
        <div 
          className="absolute -top-[15%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vw] rounded-full blur-[150px] opacity-15 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: currentTheme.secondaryColor }}
        />
      </div>

      {/* Top Professional Navbar */}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-8 flex-1 w-full flex flex-col gap-8 relative z-10">
        
        {/* Editorial Featured Hero Banner (Spotify / Apple Music Style) */}
        {activeTab === 'featured' && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-[#0C101C] to-slate-900 border border-white/10 shadow-xl backdrop-blur-xl">
            
            {/* Subtle brand glow behind text */}
            <div 
              className="absolute -top-16 -left-16 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: currentTheme.primaryColor }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              <div className="max-w-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-cyan-300 font-mono tracking-wider uppercase">Studio Ultra-HD 320kbps</span>
                  <span>·</span>
                  <span>Curated by Subha</span>
                </div>

                <h1 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Smart Subha <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">BEATS</span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Stream high-fidelity YouTube audio, play in background with screen locked, and cache your favorite Bangla melodies offline.
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    onClick={handlePlayAllInOrder}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-slate-950 font-bold text-xs hover:bg-slate-200 transition-all active:scale-95 shadow-md cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play All</span>
                  </button>

                  <button
                    onClick={handleShufflePlayAll}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-all active:scale-95 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    onClick={focusCatalogSearch}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Search</span>
                  </button>

                  <button
                    onClick={() => setIsAdminOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold text-xs transition-all active:scale-95 cursor-pointer shadow-sm"
                    title="Open Subha Beats Admin Panel"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Panel 👑</span>
                  </button>
                </div>
              </div>

              {/* Right: Active Track Preview or Live Waveform */}
              {currentTrack && (
                <div 
                  onClick={() => setIsFullPlayerOpen(true)}
                  className="w-full md:w-auto p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center gap-3 backdrop-blur-md cursor-pointer hover:border-purple-500/40 transition-colors shadow-lg"
                >
                  <img 
                    src={currentTrack.thumbnail} 
                    alt="" 
                    className="w-14 h-14 rounded-xl object-cover shadow"
                  />
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                      Now In Player
                    </span>
                    <p className="text-xs font-bold text-white truncate max-w-[180px]">
                      {currentTrack.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {currentTrack.artist}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* RENDER TAB VIEWS: PLAYLISTS, YT EXPLORE, OR MAIN CATALOG */}
        {activeTab === 'playlists' ? (
          <PlaylistManagerView onNavigateToYtExplore={() => setActiveTab('ytexplore')} />
        ) : activeTab === 'ytexplore' ? (
          <YTMusicExplorer />
        ) : (
          <section className="space-y-4">
          
          {/* Main Catalog Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                {activeTab === 'featured' 
                  ? (showAllTracks ? `All Library Songs (${tracks.length})` : `Featured Songs (${displayedTracks.length})`)
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
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {displayedTracks.length} of {tracks.length} tracks
              </p>
            </div>

            {/* Controls: Sort Dropdown & View Mode Switcher */}
            <div className="flex items-center gap-2 flex-wrap">
              {activeTab === 'featured' && (
                <button
                  onClick={() => setShowAllTracks(!showAllTracks)}
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  {showAllTracks ? "Show Featured" : `See All (${tracks.length})`}
                </button>
              )}

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs text-cyan-300 font-semibold outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-slate-900 text-slate-200">Featured Picks</option>
                  <option value="az" className="bg-slate-900 text-slate-200">Title: A → Z</option>
                  <option value="za" className="bg-slate-900 text-slate-200">Title: Z → A</option>
                  <option value="artist-az" className="bg-slate-900 text-slate-200">Artist: A → Z</option>
                  <option value="artist-za" className="bg-slate-900 text-slate-200">Artist: Z → A</option>
                  <option value="newest" className="bg-slate-900 text-slate-200">Recently Added</option>
                  <option value="duration-desc" className="bg-slate-900 text-slate-200">Duration: Longest</option>
                  <option value="duration-asc" className="bg-slate-900 text-slate-200">Duration: Shortest</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center p-0.5 rounded-full bg-white/5 border border-white/10">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Search Input for Catalog */}
          <div className="relative w-full flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={catalogSearchRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists (Arijit, Jeet Gannguli, Atif...), Bangla melodies..."
              className="w-full pl-10 pr-24 py-2 rounded-xl bg-slate-900/60 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-400 outline-none transition-all"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => catalogSearchRef.current?.focus()}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-[10px] font-bold text-slate-300 transition-colors cursor-pointer"
              >
                Search
              </button>
            )}
          </div>

          {/* Category Filter Pills (Horizontal scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'bengali', label: 'বাংলা (Bengali)' },
              { id: 'lofi', label: 'Lofi Chill' },
              { id: 'edm', label: 'EDM & Bass' },
              { id: 'trending', label: 'Trending Hits' },
              { id: 'pop', label: 'Pop' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Artist Filter Pills (Horizontal scroll) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-semibold text-slate-500 pl-1 pr-1 flex-shrink-0">
              Artist:
            </span>
            {topArtists.map((artist) => (
              <button
                key={artist}
                onClick={() => setSelectedArtist(artist)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedArtist === artist
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                    : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200'
                }`}
              >
                {artist}
              </button>
            ))}
          </div>

          {/* Alphabetical Quick Jump Bar (A-Z) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 px-1 bg-white/[0.02] rounded-xl border border-white/5">
            <span className="text-[10px] font-mono text-slate-500 pl-2 pr-1 flex-shrink-0">A-Z:</span>
            {alphabetList.map((char) => (
              <button
                key={char}
                onClick={() => setSelectedLetter(char)}
                className={`min-w-[24px] h-6 px-1 rounded-md text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                  selectedLetter === char
                    ? 'bg-white text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {char}
              </button>
            ))}
          </div>

          {/* Songs Grid or List Display */}
          {displayedTracks.length === 0 ? (
            <div className="py-16 text-center space-y-3 rounded-2xl bg-white/[0.02] border border-white/5">
              <Music className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">No tracks found</h3>
              <p className="text-xs text-slate-400">
                No songs match your search or filter criteria.
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
                className="mt-2 px-4 py-2 rounded-full bg-white text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
              {displayedTracks.map((track, idx) => (
                <TrackCard key={`${track.id}-${idx}`} track={track} index={idx} />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-white/5 rounded-2xl bg-white/[0.02] border border-white/5 p-1 sm:p-2">
              {displayedTracks.map((track, idx) => (
                <TrackListItem key={`${track.id}-${idx}`} track={track} index={idx} />
              ))}
            </div>
          )}

        </section>
        )}

      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 z-40 p-2.5 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-500 transition-all cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Floating Mini Player (Desktop & Mobile) */}
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

      {/* Bengali Explanation Modal */}
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

      {/* Color Themes Switcher Modal */}
      <ThemeSwitcherModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      {/* Aceternity & Skipper UI Floating Island Dock Navbar */}
      <FloatingNavbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'featured' && tab !== 'ytexplore') setShowAllTracks(true);
        }}
      />

      {/* Footer */}
      <Footer 
        onOpenRealtimeSyncModal={() => setIsRealtimeSyncOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
      />

    </div>
  );
};

export default App;
