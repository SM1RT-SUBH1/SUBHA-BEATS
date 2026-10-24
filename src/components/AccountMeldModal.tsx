import React, { useState } from 'react';
import { 
  X, 
  LogOut, 
  UserCheck, 
  Key, 
  Layers, 
  Settings, 
  Puzzle, 
  Check, 
  Copy, 
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMusic } from '../context/MusicContext';
import { SUBHA_IMAGE_URL } from './BrandLogo';

interface AccountMeldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const AccountMeldModal: React.FC<AccountMeldModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  const { user, logout } = useAuth();
  const { realtimeSyncInfo, triggerCloudSync } = useMusic();

  const [moreContentEnabled, setMoreContentEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(realtimeSyncInfo.roomCode);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const userPhoto = user?.email === 'iamsubha4200@gmail.com' 
    ? SUBHA_IMAGE_URL 
    : (user?.photoURL || SUBHA_IMAGE_URL);

  const displayName = user?.displayName?.toUpperCase() || 'SUBHAJIT SANPUI';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#121612] border border-white/10 shadow-2xl p-5 flex flex-col gap-4 text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar matching Screenshot 2 */}
        <div className="flex items-center justify-between pb-1">
          <h2 className="font-heading font-black text-xl text-white tracking-tight">Meld</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card matching Screenshot 2 */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={userPhoto}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = SUBHA_IMAGE_URL;
              }}
            />
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-white truncate tracking-wide">
                {displayName}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email || 'Verified Account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition-all active:scale-95 flex-shrink-0"
          >
            Log out
          </button>
        </div>

        {/* Action List matching Screenshot 2 */}
        <div className="space-y-2">
          
          {/* Switch YouTube channel */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200">Switch YouTube channel</p>
            </div>
          </div>

          {/* Tap to show token */}
          <div 
            onClick={() => setShowToken(!showToken)}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
                <Key className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-200">
                {showToken ? `Room Token: ${realtimeSyncInfo.roomCode}` : 'Tap to show token'}
              </p>
            </div>
            {showToken && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyToken();
                }}
                className="p-1 rounded-lg hover:bg-white/20 text-emerald-400 text-xs flex items-center gap-1 font-semibold"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedToken ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* More content toggle switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
                <RefreshCw className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-200">More content</p>
            </div>
            <button
              onClick={() => setMoreContentEnabled(!moreContentEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                moreContentEnabled ? 'bg-[#98D8A0]' : 'bg-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                moreContentEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Auto-sync with account toggle switch */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
                <RefreshCw className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-200">Auto-sync with account</p>
            </div>
            <button
              onClick={() => {
                const next = !autoSyncEnabled;
                setAutoSyncEnabled(next);
                if (next) triggerCloudSync();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                autoSyncEnabled ? 'bg-[#98D8A0]' : 'bg-slate-700'
              }`}
            >
              <span className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                autoSyncEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Integrations */}
          <div 
            onClick={() => {
              window.open('https://smartsubhaportfolio.netlify.app', '_blank');
            }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
                <Puzzle className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-200">Integrations</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </div>

          {/* Settings */}
          <div 
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-slate-300">
              <Settings className="w-4 h-4" />
            </div>
            <p className="text-sm font-medium text-slate-200">Settings</p>
          </div>

        </div>

      </div>
    </div>
  );
};
