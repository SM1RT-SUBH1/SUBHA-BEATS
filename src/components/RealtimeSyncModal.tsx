import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Laptop, 
  Radio, 
  Check, 
  Copy, 
  ArrowRight, 
  Sparkles, 
  Wifi, 
  RefreshCw, 
  Layers, 
  ShieldCheck,
  Headphones,
  Music2,
  Tv
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import { getDeviceLabel } from '../lib/realtimeSync';

interface RealtimeSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RealtimeSyncModal: React.FC<RealtimeSyncModalProps> = ({ isOpen, onClose }) => {
  const { 
    realtimeSyncInfo, 
    setSyncRoomCode, 
    toggleRemotePlayback, 
    triggerCloudSync,
    favoriteTrackIds,
    playlists,
    tracks 
  } = useMusic();
  const { user } = useAuth();

  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentDevice = getDeviceLabel();
  const activeRoom = realtimeSyncInfo.roomCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeRoom);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setSyncRoomCode(inputCode.trim());
    setInputCode('');
    setFeedbackMsg(`Connected to Sync Room: ${inputCode.trim().toUpperCase()}! All devices now in real-time sync.`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleForceSync = async () => {
    setSyncing(true);
    await triggerCloudSync();
    setSyncing(false);
    setFeedbackMsg('Cloud sync completed! All library changes pushed to connected devices.');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-[#0B0F19] to-slate-950 border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 p-6 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 p-2.5 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Real-Time Cross-Device Sync
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instant 2-way cloud sync across Phone, PC, Tablet & Smart TV
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

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="mb-4 p-3 rounded-xl bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-cyan-300 flex-shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="relative z-10 space-y-5 overflow-y-auto pr-1 flex-1 custom-scrollbar">

          {/* Sync Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-purple-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">
                  Real-Time Cloud Channel Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                User: <strong>{user?.email || 'Authenticated User'}</strong> • This Device: <strong>{currentDevice}</strong>
              </p>
              <p className="text-[10px] text-slate-400">
                {realtimeSyncInfo.lastSyncedAt 
                  ? `Last synced with ${realtimeSyncInfo.lastSyncedDevice} ${Math.max(1, Math.round((Date.now() - realtimeSyncInfo.lastSyncedAt) / 1000))}s ago`
                  : 'Listening for real-time updates from other devices...'
                }
              </p>
            </div>

            <button
              onClick={handleForceSync}
              disabled={syncing}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/30 transition-all flex items-center justify-center gap-1.5 self-start sm:self-center flex-shrink-0 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>

          {/* Sync Room Pairing Code Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                  Your Device Sync PIN / Room Code
                </h4>
                <p className="text-[11px] text-slate-400">
                  Enter this code on your other phone or computer to link them instantly
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 font-mono font-black text-cyan-300 text-center tracking-widest text-lg shadow-inner">
                {activeRoom}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5"
                title="Copy Sync Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Join an existing sync code */}
            <form onSubmit={handleJoinRoom} className="flex items-center gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Or enter code from other device..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 text-xs text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1"
              >
                <span>Connect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Remote Playback / Listen Together Toggle */}
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-white">
                  Remote Playback / Listen Together
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                When enabled, changing tracks or play/pause on this device controls your other devices live.
              </p>
            </div>

            <button
              onClick={toggleRemotePlayback}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                realtimeSyncInfo.remotePlaybackActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {realtimeSyncInfo.remotePlaybackActive ? 'Active (Remote Sync)' : 'Disabled'}
            </button>
          </div>

          {/* What Syncs Live Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Synchronized Across All Connected Devices
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Favorites & Bookmarks</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {favoriteTrackIds.length} favorited tracks stay in sync in real time.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                  <Music2 className="w-3.5 h-3.5" />
                  <span>Custom & Admin Tracks</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Any track added from YouTube appears instantly across all devices.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Custom Playlists</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {playlists.length} playlists synchronized across your mobile and desktop.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Cross-Platform Ready</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Seamless handoff between Android, iOS, Windows, Mac and Linux.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Zero-Latency Firestore + BroadcastChannel
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-semibold"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
