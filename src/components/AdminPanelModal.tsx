import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Crown, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  Star, 
  Radio, 
  Clock, 
  Laptop,
  CheckSquare,
  Square
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
  const { isAdmin, verifyAdminPassword, revokeAdmin, user, loggedInUsers } = useAuth();
  const { tracks, addCustomTrack, deleteTrack, toggleFeatured, featuredTrackIds } = useMusic();

  const [activeAdminTab, setActiveAdminTab] = useState<'manage' | 'featured' | 'users' | 'add'>('manage');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Quick Curate Form
  const [curatedUrl, setCuratedUrl] = useState('');
  const [curatedTitle, setCuratedTitle] = useState('');
  const [curatedArtist, setCuratedArtist] = useState('');
  const [curatedCategory, setCuratedCategory] = useState<'lofi' | 'bengali' | 'edm' | 'trending' | 'pop' | 'custom'>('bengali');
  const [curatedAsFeatured, setCuratedAsFeatured] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const valid = verifyAdminPassword(passwordInput);
    if (valid) {
      setSuccessMsg('Master Admin Authorized! Security clearance confirmed.');
      setPasswordInput('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setAuthError('Access Denied: Incorrect Security Passcode.');
    }
  };

  const handleAddCuratedTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curatedUrl.trim()) return;

    const parsed = parseYouTubeUrl(curatedUrl);
    if (!parsed.videoId) {
      setAuthError('Invalid YouTube URL provided.');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalTitle = curatedTitle.trim();
      let finalArtist = curatedArtist.trim();

      if (!finalTitle || !finalArtist) {
        const meta = await fetchYouTubeOEmbed(curatedUrl);
        if (meta) {
          if (!finalTitle) finalTitle = meta.title;
          if (!finalArtist) finalArtist = meta.author_name;
        }
      }

      const newTrack: Track = {
        id: parsed.videoId,
        title: finalTitle || 'Curated Subha Beat',
        artist: finalArtist || 'Subha Beats Master',
        thumbnail: getYouTubeThumbnail(parsed.videoId),
        duration: 240,
        durationFormatted: '4:00',
        youtubeUrl: curatedUrl.trim(),
        isCurated: true,
        isFeatured: curatedAsFeatured,
        addedBy: user?.displayName || 'SUBHA MASTER ADMIN',
        addedAt: Date.now(),
        category: curatedCategory,
        audioQuality: 'ultra_hd',
        isOfflineCached: false,
      };

      await addCustomTrack(newTrack);
      setSuccessMsg(`"${newTrack.title}" published to global database!`);
      setCuratedUrl('');
      setCuratedTitle('');
      setCuratedArtist('');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setAuthError(err?.message || 'Failed to curate track');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCatalog = tracks.filter((t) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-3xl glass-panel border border-amber-500/30 shadow-2xl flex flex-col">
        
        {/* Top Gold Amber Accent Beam */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-white">
                  Subha Master Admin Security Portal
                </h3>
                {isAdmin && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/50">
                    Cleared
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Manage global music, configure homepage featured beats, and monitor logged-in users
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        {isAdmin && (
          <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-950/70 border-b border-white/5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveAdminTab('manage')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeAdminTab === 'manage' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Manage Music ({tracks.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('featured')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeAdminTab === 'featured' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Featured on Homepage ({featuredTrackIds.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('add')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeAdminTab === 'add' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Global Beat</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('users')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeAdminTab === 'users' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Logged In Users ({loggedInUsers.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Notifications */}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Secure Passcode Authentication Barrier */}
          {!isAdmin ? (
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center text-center max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Lock className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">
                  Enter Master Admin Passcode
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Confidential administrative access for managing beats and monitoring system accounts.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="w-full space-y-3">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter security passcode"
                    className="w-full px-4 py-3 pr-11 rounded-2xl bg-slate-950 border border-slate-700/80 focus:border-amber-500 text-sm text-white placeholder-slate-600 outline-none"
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
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
                >
                  Verify Master Clearance
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* TAB 1: MANAGE MUSIC & FEATURE TOGGLE */}
              {activeAdminTab === 'manage' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Search to feature or delete songs..."
                      className="w-full sm:w-80 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-slate-400">
                      Showing {filteredCatalog.length} songs
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
                    {filteredCatalog.map((t) => {
                      const isFeatured = featuredTrackIds.includes(t.id);
                      return (
                        <div
                          key={t.id}
                          className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={t.thumbnail}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-white truncate">{t.title}</p>
                              <p className="text-[11px] text-slate-400 truncate">{t.artist} • {t.category}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* Feature on Homepage Checkbox */}
                            <button
                              onClick={() => toggleFeatured(t.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                                isFeatured
                                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              }`}
                              title={isFeatured ? "Featured on Home Page (click to unfeature)" : "Feature on Home Page"}
                            >
                              <Star className={`w-3.5 h-3.5 ${isFeatured ? 'fill-current text-amber-400' : ''}`} />
                              <span>{isFeatured ? 'Featured' : 'Not Featured'}</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => {
                                if (confirm(`Delete "${t.title}" from library?`)) {
                                  deleteTrack(t.id);
                                }
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                              title="Delete track"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ONLY FEATURED SONGS */}
              {activeAdminTab === 'featured' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                    🌟 <strong>Homepage Featured Curation:</strong> These songs appear in the primary Featured section of the homepage. Clicking the star removes them from the homepage featured feed.
                  </div>

                  <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
                    {tracks.filter((t) => featuredTrackIds.includes(t.id)).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/60 border border-amber-500/30 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={t.thumbnail}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{t.title}</p>
                            <p className="text-[11px] text-slate-400 truncate">{t.artist}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFeatured(t.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1.5 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                          title="Remove from featured"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Remove from Featured</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ADD GLOBAL BEAT */}
              {activeAdminTab === 'add' && (
                <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-400" />
                    Add YouTube Song to Global Library
                  </h4>

                  <form onSubmit={handleAddCuratedTrack} className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">
                        YouTube Link / Video ID *
                      </label>
                      <input
                        type="text"
                        required
                        value={curatedUrl}
                        onChange={(e) => setCuratedUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or 11-char ID"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 focus:border-amber-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <input
                          type="text"
                          value={curatedTitle}
                          onChange={(e) => setCuratedTitle(e.target.value)}
                          placeholder="Song Title (auto-fetched if blank)"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={curatedArtist}
                          onChange={(e) => setCuratedArtist(e.target.value)}
                          placeholder="Artist Name"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-600 focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                      <select
                        value={curatedCategory}
                        onChange={(e) => setCuratedCategory(e.target.value as any)}
                        className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 outline-none"
                      >
                        <option value="bengali">Bangla Beats</option>
                        <option value="trending">Trending Hits</option>
                        <option value="lofi">Lo-Fi Chill</option>
                        <option value="edm">EDM Drops</option>
                        <option value="pop">Pop / Acoustic</option>
                      </select>

                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={curatedAsFeatured}
                          onChange={(e) => setCuratedAsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
                        />
                        <span>Feature on Homepage immediately</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-[1.01] active:scale-95"
                    >
                      {isSubmitting ? 'Publishing...' : 'Publish to All Devices'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: LOGGED IN USERS DIRECTORY */}
              {activeAdminTab === 'users' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active User Accounts ({loggedInUsers.length})
                    </h4>
                    <span className="text-[11px] text-amber-400 font-mono">
                      Real-time Session Audit
                    </span>
                  </div>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {loggedInUsers.map((u, i) => (
                      <div
                        key={`${u.uid}-${i}`}
                        className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={u.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.uid}`}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-purple-500/30"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-white truncate">{u.displayName || 'Google User'}</p>
                              {u.email === 'iamsubha4200@gmail.com' && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                                  Owner
                                </span>
                              )}
                            </div>
                            <p className="text-slate-400 font-mono text-[11px] truncate">{u.email}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 justify-end">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {new Date(u.lastLoginAt).toLocaleDateString()} {new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] text-purple-300 font-mono">
                            {u.loginCount} session(s)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Lockout Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-500">
                <span>Passcode is secure and confidential</span>
                <button
                  onClick={revokeAdmin}
                  className="text-slate-400 hover:text-rose-400 underline font-semibold"
                >
                  Lock Master Portal
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
