import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  Star, 
  Radio, 
  Search, 
  RefreshCw, 
  Save, 
  Music, 
  ShieldCheck, 
  AlertCircle,
  ArrowLeft,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { parseYouTubeUrl, fetchYouTubeOEmbed, getYouTubeThumbnail } from '../lib/youtube';
import { Track } from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose }) => {
  const { isAdmin, verifyAdminPassword, revokeAdmin } = useAuth();
  const { 
    tracks, 
    addCustomTrack, 
    updateTrack, 
    deleteTrack, 
    toggleFeatured, 
    featuredTrackIds, 
    triggerCloudSync,
    realtimeSyncInfo 
  } = useMusic();

  const [activeAdminTab, setActiveAdminTab] = useState<'manage' | 'add' | 'featured' | 'sync' | 'edit'>('manage');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Search in Admin
  const [searchFilter, setSearchFilter] = useState('');

  // Add Track Form
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newCategory, setNewCategory] = useState<string>('bengali');
  const [newIsFeatured, setNewIsFeatured] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);

  // Edit / Modify Track State
  const [editingTrack, setEditingTrack] = useState<Track | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editArtist, setEditArtist] = useState('');
  const [editCategory, setEditCategory] = useState<string>('bengali');
  const [editYoutubeUrl, setEditYoutubeUrl] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // In-App Deletion Confirmation State (Works 100% in iFrames)
  const [deletingTrack, setDeletingTrack] = useState<Track | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const valid = verifyAdminPassword(passwordInput);
    if (valid) {
      setSuccessMsg('Master Admin Unlocked! Welcome.');
      setPasswordInput('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setAuthError('Access Denied: Incorrect Master Passcode.');
    }
  };

  // Auto-fetch YouTube metadata for Add
  const handleFetchMetadata = async () => {
    if (!newUrl.trim()) return;
    setIsFetchingMeta(true);
    setAuthError(null);
    try {
      const parsed = parseYouTubeUrl(newUrl);
      if (!parsed.videoId) {
        setAuthError('Please enter a valid YouTube link or video ID.');
        return;
      }
      const meta = await fetchYouTubeOEmbed(newUrl);
      if (meta) {
        if (!newTitle) setNewTitle(meta.title);
        if (!newArtist) setNewArtist(meta.author_name);
      }
    } catch {
      // Fallback
    } finally {
      setIsFetchingMeta(false);
    }
  };

  const handleAddTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const parsed = parseYouTubeUrl(newUrl);
    if (!parsed.videoId) {
      setAuthError('Invalid YouTube URL or Video ID.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalTitle = newTitle.trim();
      let finalArtist = newArtist.trim();

      if (!finalTitle || !finalArtist) {
        const meta = await fetchYouTubeOEmbed(newUrl);
        if (meta) {
          if (!finalTitle) finalTitle = meta.title;
          if (!finalArtist) finalArtist = meta.author_name;
        }
      }

      const newTrack: Track = {
        id: parsed.videoId,
        title: finalTitle || 'New Subha Beat',
        artist: finalArtist || 'Smart Subha Artist',
        thumbnail: getYouTubeThumbnail(parsed.videoId),
        duration: 220,
        durationFormatted: '3:40',
        youtubeUrl: newUrl.trim(),
        isCurated: true,
        isFeatured: newIsFeatured,
        addedBy: 'SUBHA MASTER ADMIN',
        addedAt: Date.now(),
        category: newCategory,
        audioQuality: 'ultra_hd',
        isOfflineCached: false,
      };

      await addCustomTrack(newTrack);
      setSuccessMsg(`"${newTrack.title}" added and synced across all devices!`);
      setNewUrl('');
      setNewTitle('');
      setNewArtist('');
      setTimeout(() => setSuccessMsg(null), 3500);
      setActiveAdminTab('manage');
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to add track.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Full-View Edit Screen
  const startEditTrack = (track: Track) => {
    setEditingTrack(track);
    setEditTitle(track.title);
    setEditArtist(track.artist);
    setEditCategory(track.category || 'bengali');
    setEditYoutubeUrl(track.youtubeUrl || `https://www.youtube.com/watch?v=${track.id}`);
    setEditThumbnail(track.thumbnail);
    setEditFeatured(featuredTrackIds.includes(track.id));
    setActiveAdminTab('edit');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrack) return;
    setIsSavingEdit(true);

    try {
      const updates: Partial<Track> = {
        title: editTitle.trim() || editingTrack.title,
        artist: editArtist.trim() || editingTrack.artist,
        category: editCategory,
        youtubeUrl: editYoutubeUrl.trim() || editingTrack.youtubeUrl,
        thumbnail: editThumbnail.trim() || editingTrack.thumbnail,
        isFeatured: editFeatured,
      };

      await updateTrack(editingTrack.id, updates);
      
      const isCurrentlyFeatured = featuredTrackIds.includes(editingTrack.id);
      if (editFeatured !== isCurrentlyFeatured) {
        toggleFeatured(editingTrack.id);
      }

      setSuccessMsg(`"${updates.title}" modified and synced across all devices!`);
      setEditingTrack(null);
      setActiveAdminTab('manage');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to save changes.');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Reliable In-App Deletion Execution (NO window.confirm required)
  const confirmDeleteTrack = async () => {
    if (!deletingTrack) return;
    setIsDeleting(true);
    try {
      const title = deletingTrack.title;
      await deleteTrack(deletingTrack.id);
      setDeletingTrack(null);
      setSuccessMsg(`"${title}" successfully deleted and removed from all devices.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to delete track.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCatalog = tracks.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] overflow-hidden rounded-3xl glass-panel border border-amber-500/30 shadow-2xl flex flex-col bg-[#07090E]/95">
        
        {/* Top Gold Amber Accent Beam */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                  Smart Subha Beats Admin Portal
                </h3>
                {isAdmin ? (
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Protected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {isAdmin 
                  ? 'Add, modify, and delete music with real-time cross-device cloud sync'
                  : 'Enter Master Secret Code to access administrative controls'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={revokeAdmin}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer"
                title="Lock Admin Panel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock Panel</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        {isAdmin && (
          <div className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-slate-950/80 border-b border-white/5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => { setEditingTrack(null); setActiveAdminTab('manage'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'manage' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Manage Music ({tracks.length})</span>
            </button>

            {/* If currently editing a track, show active Modify Tab */}
            {editingTrack && (
              <button
                onClick={() => setActiveAdminTab('edit')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeAdminTab === 'edit' ? 'bg-purple-600 text-white shadow-md font-bold' : 'text-purple-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                <span>Modify: {editingTrack.title.slice(0, 15)}...</span>
              </button>
            )}

            <button
              onClick={() => { setEditingTrack(null); setActiveAdminTab('add'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'add' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Music to Cloud</span>
            </button>

            <button
              onClick={() => { setEditingTrack(null); setActiveAdminTab('featured'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'featured' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Featured on Home ({featuredTrackIds.length})</span>
            </button>

            <button
              onClick={() => { setEditingTrack(null); setActiveAdminTab('sync'); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                activeAdminTab === 'sync' ? 'bg-amber-500 text-slate-950 shadow-md font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Sync Network</span>
            </button>
          </div>
        )}

        {/* Modal Body - Fully scrollable with comfortable padding */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="font-medium">{authError}</span>
            </div>
          )}

          {/* Secure Passcode Gate (COMPLETELY SECRET - NO CODE SHOWN) */}
          {!isAdmin ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center max-w-md mx-auto space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
                <Lock className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white font-heading">
                  Enter Master Admin Passcode
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Confidential administrative access. Enter the private passcode to unlock music management.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="w-full space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter confidential passcode..."
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-700/80 focus:border-amber-500 text-sm text-white placeholder-slate-600 outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
                >
                  Verify Clearance
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* TAB 1: MANAGE MUSIC & TRIGGER EDIT / DELETE */}
              {activeAdminTab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Search song title, artist, or YouTube ID to modify or delete..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                      />
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap pl-1">
                      {filteredCatalog.length} songs available
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {filteredCatalog.length === 0 ? (
                      <div className="p-8 text-center text-slate-500 text-xs">
                        No songs found matching "{searchFilter}".
                      </div>
                    ) : (
                      filteredCatalog.map((t) => {
                        const isFeatured = featuredTrackIds.includes(t.id);
                        return (
                          <div
                            key={t.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <img
                                src={t.thumbnail}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/5 shadow-md"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-white truncate text-sm">{t.title}</p>
                                <p className="text-xs text-slate-400 truncate mt-0.5">
                                  {t.artist} • <span className="text-cyan-400 uppercase text-[10px] font-mono">{t.category}</span>
                                </p>
                                <span className="text-[10px] text-slate-500 font-mono">ID: {t.id}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                              {/* Feature on Home Toggle */}
                              <button
                                onClick={() => toggleFeatured(t.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                                  isFeatured
                                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                                title={isFeatured ? "Featured on Home (Click to unfeature)" : "Feature on Homepage"}
                              >
                                <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-current text-amber-400' : ''}`} />
                                <span className="text-[11px]">{isFeatured ? 'Featured' : 'Feature'}</span>
                              </button>

                              {/* Modify / Edit Button -> Opens Full Modify Screen */}
                              <button
                                onClick={() => startEditTrack(t)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 text-purple-200 border border-purple-500/40 font-bold text-xs transition-colors cursor-pointer"
                                title="Modify Track Details"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-purple-300" />
                                <span>Modify</span>
                              </button>

                              {/* Delete Button -> Opens Custom In-App Confirmation Modal */}
                              <button
                                onClick={() => setDeletingTrack(t)}
                                className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                                title="Delete Track"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB: MODIFY / EDIT SONG - FULL-VIEW INTEGRATED SCREEN (100% VISIBLE) */}
              {activeAdminTab === 'edit' && editingTrack && (
                <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-purple-500/30 shadow-2xl space-y-5 animate-in fade-in duration-200">
                  
                  {/* Top Bar with Back Button */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <button
                      onClick={() => { setEditingTrack(null); setActiveAdminTab('manage'); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Songs</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-purple-400" />
                      <h4 className="font-heading font-bold text-sm sm:text-base text-white">
                        Modify Song: <span className="text-purple-300">{editingTrack.title}</span>
                      </h4>
                    </div>
                  </div>

                  {/* Modify Form */}
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                    
                    {/* Live Preview Card */}
                    <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center gap-3">
                      <img
                        src={editThumbnail || editingTrack.thumbnail}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-white/10 shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = editingTrack.thumbnail;
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase font-mono text-cyan-400">Live Preview</p>
                        <p className="text-sm font-bold text-white truncate">{editTitle || editingTrack.title}</p>
                        <p className="text-xs text-slate-400 truncate">{editArtist || editingTrack.artist}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/40 text-purple-300 border border-purple-500/30 font-mono">
                            {editCategory}
                          </span>
                          {editFeatured && (
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current" /> Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Song Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Artist Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editArtist}
                          onChange={(e) => setEditArtist(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Music Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e: any) => setEditCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="bengali">বাংলা Melodies (Bengali)</option>
                          <option value="lofi">Lofi & Chill</option>
                          <option value="edm">EDM & Bass</option>
                          <option value="trending">Trending Hits</option>
                          <option value="pop">Pop</option>
                          <option value="custom">Custom Audio</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-5">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={editFeatured}
                            onChange={(e) => setEditFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 bg-slate-950 border-slate-700"
                          />
                          <span>Pin to Homepage Featured Songs</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        YouTube URL or Video ID
                      </label>
                      <input
                        type="text"
                        value={editYoutubeUrl}
                        onChange={(e) => setEditYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Thumbnail Artwork URL
                      </label>
                      <input
                        type="text"
                        value={editThumbnail}
                        onChange={(e) => setEditThumbnail(e.target.value)}
                        placeholder="https://images.unsplash.com/... or i.ytimg.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-500 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Action Buttons: 100% Visible & Sticky */}
                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => { setEditingTrack(null); setActiveAdminTab('manage'); }}
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingEdit ? 'Saving & Broadcasting...' : 'Save Changes & Sync to All Devices'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* TAB 2: ADD MUSIC TO CLOUD */}
              {activeAdminTab === 'add' && (
                <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                      <Plus className="w-5 h-5 text-amber-400" />
                      Add YouTube Song to Global Library
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      New songs are immediately broadcast and synced to all devices connected to the cloud network.
                    </p>
                  </div>

                  <form onSubmit={handleAddTrackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        YouTube URL or Video ID *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={newUrl}
                          onChange={(e) => setNewUrl(e.target.value)}
                          onBlur={handleFetchMetadata}
                          placeholder="e.g. https://www.youtube.com/watch?v=k4yXQkG2s1E or Video ID"
                          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleFetchMetadata}
                          disabled={isFetchingMeta || !newUrl.trim()}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          {isFetchingMeta ? 'Fetching...' : 'Fetch Info'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Song Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. Tum Hi Ho / Kesariya"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Artist Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newArtist}
                          onChange={(e) => setNewArtist(e.target.value)}
                          placeholder="e.g. Arijit Singh / Jeet Gannguli"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                          Music Category
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e: any) => setNewCategory(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-amber-500 text-xs text-white outline-none cursor-pointer"
                        >
                          <option value="bengali">বাংলা Melodies (Bengali)</option>
                          <option value="lofi">Lofi & Chill</option>
                          <option value="edm">EDM & Bass</option>
                          <option value="trending">Trending</option>
                          <option value="pop">Pop</option>
                          <option value="custom">Custom Audio</option>
                        </select>
                      </div>

                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                          <input
                            type="checkbox"
                            checked={newIsFeatured}
                            onChange={(e) => setNewIsFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                          />
                          <span>Pin to Homepage Featured Songs</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? 'Publishing & Syncing...' : 'Add & Broadcast to All Devices'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: FEATURED SONGS CURATION */}
              {activeAdminTab === 'featured' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                    🌟 <strong>Featured Songs on Homepage:</strong> These tracks are prominently featured at the top of the app. Click the star to toggle or remove from the homepage feed.
                  </div>

                  <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                    {tracks.filter((t) => featuredTrackIds.includes(t.id)).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-amber-500/30 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={t.thumbnail}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/5 shadow-md"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate text-sm">{t.title}</p>
                            <p className="text-xs text-slate-400 truncate mt-0.5">{t.artist}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFeatured(t.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1.5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-colors cursor-pointer"
                          title="Remove from featured"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Remove Featured</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REAL-TIME DEVICE SYNC STATUS */}
              {activeAdminTab === 'sync' && (
                <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                        <Radio className="w-5 h-5 text-cyan-400" />
                        Cloud Firestore Real-Time Sync Network
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Active live broadcast connecting all phones, desktops, tablets, and browsers.
                      </p>
                    </div>

                    <button
                      onClick={async () => {
                        await triggerCloudSync();
                        setSuccessMsg('Pushed instant synchronization broadcast to all connected devices!');
                        setTimeout(() => setSuccessMsg(null), 3000);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync All Devices Now</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Status</span>
                      <p className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Live Synchronized
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Total Library Songs</span>
                      <p className="text-sm font-bold text-white font-mono">
                        {tracks.length} Songs Active
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold">Master Sync Room</span>
                      <p className="text-sm font-bold text-cyan-300 font-mono">
                        {realtimeSyncInfo.roomCode}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* IN-APP CONFIRMATION MODAL FOR DELETION (REPLACES window.confirm) */}
        {deletingTrack && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-md rounded-3xl bg-[#0A0E18] border border-rose-500/40 p-6 shadow-2xl shadow-rose-950/50 space-y-4">
              
              <div className="flex items-center gap-3 text-rose-400">
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-base text-white">
                    Confirm Permanent Deletion
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    This action will remove the song from all devices.
                  </p>
                </div>
              </div>

              {/* Track Details Card */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-white/5 flex items-center gap-3">
                <img
                  src={deletingTrack.thumbnail}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{deletingTrack.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{deletingTrack.artist}</p>
                  <span className="text-[10px] text-rose-400 font-mono">ID: {deletingTrack.id}</span>
                </div>
              </div>

              <p className="text-xs text-rose-300/90 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20 leading-relaxed">
                ⚠️ Are you sure you want to delete this track? It will be removed immediately from your database, playlists, and all synced devices.
              </p>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setDeletingTrack(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteTrack}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Deleting...' : 'Yes, Delete Song'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
