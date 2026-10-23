import React, { useState } from 'react';
import { 
  X, 
  Link2, 
  Sparkles, 
  DownloadCloud, 
  Music, 
  Check, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { parseYouTubeUrl, fetchYouTubeOEmbed, getYouTubeThumbnail } from '../lib/youtube';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { Track } from '../types';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTrackModal: React.FC<AddTrackModalProps> = ({ isOpen, onClose }) => {
  const { addCustomTrack, playTrack } = useMusic();
  const { user, isAdmin } = useAuth();

  const [inputUrl, setInputUrl] = useState('');
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState<'lofi' | 'bengali' | 'edm' | 'trending' | 'pop' | 'custom'>('custom');
  const [cacheOffline, setCacheOffline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUrlBlur = async () => {
    if (!inputUrl.trim()) return;
    setError(null);
    const parsed = parseYouTubeUrl(inputUrl);

    if (parsed.videoId) {
      setPreviewId(parsed.videoId);
      setLoading(true);
      try {
        const metadata = await fetchYouTubeOEmbed(inputUrl);
        if (metadata) {
          if (!title) setTitle(metadata.title);
          if (!artist) setArtist(metadata.author_name);
        }
      } catch (e) {
        console.warn('oEmbed fetch failed', e);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please provide a valid YouTube video link (e.g., https://youtube.com/watch?v=... or youtu.be/...)');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseYouTubeUrl(inputUrl);
    if (!parsed.videoId) {
      setError('Could not extract a valid YouTube video ID from the link.');
      return;
    }

    const videoId = parsed.videoId;
    const finalTitle = title.trim() || 'YouTube Audio Track';
    const finalArtist = artist.trim() || (isAdmin ? 'Subha Curated' : 'Subha Beats Music');

    const newTrack: Track = {
      id: videoId,
      title: finalTitle,
      artist: finalArtist,
      thumbnail: getYouTubeThumbnail(videoId),
      duration: 210, // estimated default, updated once played
      durationFormatted: '3:30',
      youtubeUrl: inputUrl.trim(),
      isCurated: isAdmin,
      addedBy: user?.displayName || user?.email || (isAdmin ? 'Subha Admin' : 'User'),
      addedAt: Date.now(),
      category: category,
      audioQuality: 'ultra_hd',
      isOfflineCached: cacheOffline,
    };

    setLoading(true);
    try {
      await addCustomTrack(newTrack);
      playTrack(newTrack);
      onClose();
      // Reset form
      setInputUrl('');
      setTitle('');
      setArtist('');
      setPreviewId(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to save track.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/10 shadow-2xl p-6 overflow-hidden">
        
        {/* Aceternity header background light beam */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Save YouTube Track
              </h3>
              <p className="text-xs text-slate-400">
                Paste any YouTube video or playlist URL to stream & sync
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

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* YouTube URL input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              YouTube URL / Link *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onBlur={handleUrlBlur}
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
              {loading && (
                <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Thumbnail preview if detected */}
          {previewId && (
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/20">
              <img
                src={getYouTubeThumbnail(previewId)}
                alt="Preview"
                className="w-20 h-12 object-cover rounded-lg flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-cyan-400">Detected Video ID</span>
                <p className="text-xs font-mono text-slate-300 truncate">{previewId}</p>
              </div>
            </div>
          )}

          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Track Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Auto-detected or custom"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Artist / Channel
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 text-sm text-white placeholder-slate-500 outline-none"
              />
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Beat Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bengali', label: 'Bangla Beats' },
                { id: 'lofi', label: 'Lo-Fi Chill' },
                { id: 'edm', label: 'EDM Drops' },
                { id: 'trending', label: 'Trending' },
                { id: 'pop', label: 'Pop / Acoustic' },
                { id: 'custom', label: 'Custom' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all truncate ${
                    category === c.id
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Offline caching checkbox */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <input
              type="checkbox"
              id="offlineCacheToggle"
              checked={cacheOffline}
              onChange={(e) => setCacheOffline(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-slate-800 border-slate-700 focus:ring-purple-500 cursor-pointer"
            />
            <label htmlFor="offlineCacheToggle" className="text-xs text-slate-300 cursor-pointer flex-1">
              <span className="font-semibold text-white block">Sync to Offline Library</span>
              Enables offline metadata synchronization and local caching
            </label>
            <DownloadCloud className={`w-5 h-5 ${cacheOffline ? 'text-emerald-400' : 'text-slate-500'}`} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 transform active:scale-98"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save & Stream Beat Now</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
