import React, { useEffect, useState } from 'react';
import { 
  X, 
  WifiOff, 
  HardDrive, 
  DownloadCloud, 
  Trash2, 
  CheckCircle2, 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getOfflineTracks, getOfflineStorageEstimate, removeTrackOffline } from '../lib/db';
import { Track } from '../types';

interface OfflineSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineSyncModal: React.FC<OfflineSyncModalProps> = ({ isOpen, onClose }) => {
  const { isOfflineMode, toggleOfflineMode, playTrack } = useMusic();
  const [offlineList, setOfflineList] = useState<Track[]>([]);
  const [storageInfo, setStorageInfo] = useState<{ usageMB: string; quotaMB: string }>({ usageMB: '0', quotaMB: 'N/A' });
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const tracks = await getOfflineTracks();
      setOfflineList(tracks);
      const storage = await getOfflineStorageEstimate();
      setStorageInfo(storage);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRemove = async (trackId: string) => {
    await removeTrackOffline(trackId);
    setOfflineList((prev) => prev.filter((t) => t.id !== trackId));
    const storage = await getOfflineStorageEstimate();
    setStorageInfo(storage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl glass-panel border border-emerald-500/30 shadow-2xl p-6 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Top Emerald Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Offline Playlist Synchronization
              </h3>
              <p className="text-xs text-slate-400">
                IndexedDB storage & cached audio metadata for offline listening
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

        {/* Status & Storage Card */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-[11px] text-slate-400">Offline Cache</p>
                <p className="text-sm font-bold text-white">{storageInfo.usageMB} MB</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[11px] text-slate-400">Sync Status</p>
                <p className="text-sm font-bold text-emerald-300">
                  {offlineList.length} Tracks Ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Offline Mode Toggle Bar */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold text-emerald-300 block">
              Simulate Offline Playback Mode
            </span>
            <span className="text-[11px] text-slate-400">
              Only display and play cached offline tracks
            </span>
          </div>
          <button
            onClick={toggleOfflineMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isOfflineMode
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            {isOfflineMode ? 'Active (Offline)' : 'Turn On'}
          </button>
        </div>

        {/* Tracks List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {offlineList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No tracks synced offline yet. Click the download icon on any song to save it for offline listening!
            </div>
          ) : (
            offlineList.map((t) => (
              <div 
                key={t.id}
                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={t.thumbnail}
                    alt={t.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-200 truncate">{t.title}</p>
                    <p className="text-[11px] text-slate-400 truncate">{t.artist} • {t.durationFormatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => {
                      playTrack(t);
                      onClose();
                    }}
                    className="p-1.5 rounded-lg bg-purple-600/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-colors"
                    title="Play track"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>

                  <button
                    onClick={() => handleRemove(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from offline cache"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
