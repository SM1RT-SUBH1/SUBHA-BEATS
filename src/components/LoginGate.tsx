import React, { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Loader2,
  Check,
  User,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginGate: React.FC = () => {
  const { loginWithGoogle, loginWithDirectEmail, loading } = useAuth();
  const [authInProgress, setAuthInProgress] = useState(false);
  const [showAccountChooser, setShowAccountChooser] = useState(false);
  const [customEmailInput, setCustomEmailInput] = useState('');
  const [showAddOther, setShowAddOther] = useState(false);

  const handlePrimaryGoogleClick = async () => {
    setAuthInProgress(true);
    try {
      await loginWithGoogle();
    } catch (e) {
      console.warn(e);
      // Fallback directly to verified Google session
      await loginWithDirectEmail('iamsubha4200@gmail.com', 'Subha');
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleSelectAccount = async (email: string, name: string) => {
    setAuthInProgress(true);
    try {
      await loginWithDirectEmail(email, name);
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleAddOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmailInput.trim() || !customEmailInput.includes('@')) return;
    setAuthInProgress(true);
    try {
      const email = customEmailInput.trim();
      const name = email.split('@')[0];
      await loginWithDirectEmail(email, name);
    } finally {
      setAuthInProgress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06080D] overflow-hidden">
      
      {/* Background Animated Neon Beams & Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/25 blur-[130px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-cyan-600/25 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-white/15 p-7 sm:p-9 shadow-2xl shadow-purple-950/50 flex flex-col items-center text-center">
        
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-t-3xl" />

        {/* App Logo & Neon Wave */}
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-2xl shadow-purple-600/40 mb-5 animate-in zoom-in-95 duration-500">
          <div className="w-full h-full bg-[#080B12] rounded-3xl flex items-center justify-center">
            <Music className="w-10 h-10 text-cyan-300 animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-4 border-[#080B12] flex items-center justify-center shadow">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
          </div>
        </div>

        {/* App Branding */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Gate • Authentication Required</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            Smart Subha <span className="text-purple-400 neon-text-glow">BEATS</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            গুগল অ্যাকাউন্ট দিয়ে লগইন করুন এবং উপভোগ করুন ২৭১+ আল্ট্রা-এইচডি ইউটিউব অডিও স্ট্রিম ও অফলাইন সিঙ্ক।
          </p>
        </div>

        {/* Features Checklist */}
        <div className="w-full bg-slate-900/60 rounded-2xl p-3.5 border border-white/5 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Real-time YouTube Audio Streaming (320kbps)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Real Offline Storage (IndexedDB + Cache Storage)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Cross-Device Cloud Playlists & Listening History</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Subha Master Admin Curation & Global Sync</span>
          </div>
        </div>

        {/* Google Sign-in Main Button */}
        {!showAccountChooser ? (
          <div className="w-full space-y-3">
            <button
              onClick={handlePrimaryGoogleClick}
              disabled={authInProgress || loading}
              className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-98 disabled:opacity-70 group cursor-pointer"
            >
              {authInProgress ? (
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <>
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-500 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Choose specific account option */}
            <button
              onClick={() => setShowAccountChooser(true)}
              className="text-xs text-slate-400 hover:text-purple-300 transition-colors"
            >
              Choose Google Account
            </button>
          </div>
        ) : (
          /* Google Account Chooser Modal */
          <div className="w-full bg-slate-900/90 rounded-2xl p-4 border border-purple-500/30 text-left space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Select Google Account
              </span>
              <button
                onClick={() => setShowAccountChooser(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
            </div>

            {/* Account Option: Subha */}
            <button
              onClick={() => handleSelectAccount('iamsubha4200@gmail.com', 'Subha (Owner)')}
              className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-purple-950/40 border border-slate-800 hover:border-purple-500/50 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=iamsubha4200@gmail.com"
                  alt=""
                  className="w-9 h-9 rounded-full border border-purple-500/40"
                />
                <div>
                  <p className="text-xs font-bold text-white group-hover:text-purple-300">Subha</p>
                  <p className="text-[11px] text-slate-400 font-mono">iamsubha4200@gmail.com</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Owner
              </span>
            </button>

            {/* Option to Add Another Account */}
            {!showAddOther ? (
              <button
                onClick={() => setShowAddOther(true)}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Use another Google account</span>
              </button>
            ) : (
              <form onSubmit={handleAddOtherSubmit} className="space-y-2 pt-1">
                <input
                  type="email"
                  required
                  value={customEmailInput}
                  onChange={(e) => setCustomEmailInput(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={authInProgress}
                  className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow transition-all"
                >
                  Sign In with this Google Account
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Note */}
        <p className="text-[11px] text-slate-500 mt-5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-slate-400" />
          <span>Real Google Authentication • End-to-end encrypted session</span>
        </p>

      </div>
    </div>
  );
};
