import React, { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Play,
  Crown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginGateProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ isOpen = true, onClose }) => {
  const { user, loginWithName } = useAuth();
  const [nameInput, setNameInput] = useState(user?.displayName || 'Subhajit');

  if (!isOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalName = nameInput.trim() || 'Subhajit';
    loginWithName(finalName);
    if (onClose) onClose();
  };

  const handleQuickSubha = () => {
    loginWithName('Subhajit');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-hidden select-none animate-in fade-in duration-200">
      
      {/* Background Animated Neon Beams & Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/25 blur-[130px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-600/25 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px] pointer-events-none" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 flex flex-col items-center text-center">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-3xl" />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* App Logo & Subhajit Photo */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-purple-600/50 mb-4 animate-in zoom-in-95 duration-500">
          <div className="w-full h-full bg-[#080B12] rounded-3xl overflow-hidden relative">
            <img 
              src="/subhajit-sanpui.jpg" 
              alt="Subhajit Sanpui"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#080B14] rounded-full border border-cyan-400/60 flex items-center justify-center shadow-lg">
            <Music className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#080B12] shadow" />
        </div>

        {/* App Branding */}
        <div className="space-y-1 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Welcome to Subha Beats</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Smart Subha <span className="text-purple-400 neon-text-glow">BEATS</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            কোনো পাসওয়ার্ড বা জটিল লগইনের ঝামেলা নেই — শুধু আপনার নাম লিখে সরাসরি গান শুনুন!
          </p>
        </div>

        {/* Simple Name Entry Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3.5 mb-2">
          
          <div className="relative text-left">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 ml-1">
              আপনার নাম (Enter Your Name):
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="যেমন: Subhajit"
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/40 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none text-white text-sm font-semibold transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2.5 transform hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>গান শুনুন • Enter Studio</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>

          {/* Quick Subhajit 1-Tap Shortcut */}
          <button
            type="button"
            onClick={handleQuickSubha}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Continue as Subhajit (Owner)</span>
          </button>

        </form>

        {/* Feature Highlights */}
        <div className="mt-4 pt-4 border-t border-white/5 w-full flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ২৭১+ গান লাইভ
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            ব্যাকগ্রাউন্ড প্লেব্যাক
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            কালার থিমস
          </span>
        </div>

      </div>
    </div>
  );
};
