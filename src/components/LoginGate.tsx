import React, { useState } from 'react';
import { 
  Music, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginGate: React.FC = () => {
  const { loginWithGoogle, loading } = useAuth();
  const [authInProgress, setAuthInProgress] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async (customEmail?: string) => {
    setAuthInProgress(true);
    setStatusMessage('Google অ্যাকাউন্টে কানেক্ট করা হচ্ছে...');
    try {
      await loginWithGoogle(customEmail);
    } catch (e) {
      console.warn('Google sign-in caught notice:', e);
    } finally {
      setAuthInProgress(false);
      setStatusMessage(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06080D] overflow-hidden select-none">
      
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

        {/* App Logo & Neon Wave with Subhajit Photo */}
        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-2xl shadow-purple-600/50 mb-5 animate-in zoom-in-95 duration-500">
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
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Google Authentication Required</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
            Smart Subha <span className="text-purple-400 neon-text-glow">BEATS</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            গুগল দিয়ে সাইন-ইন করে সরাসরি ২৭১+ গান, ব্যাকগ্রাউন্ড প্লেব্যাক ও সার্ভিস ওয়ার্কার অফলাইন ক্যাশিং উপভোগ করুন।
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
            <span>Service Worker Background Audio Caching</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Continuous Smart Auto-Advance (No Repeated Songs)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Master Admin Protected by Security Passcode</span>
          </div>
        </div>

        {/* Google Sign-in Single Direct Button */}
        <div className="w-full space-y-3">
          <button
            onClick={() => handleGoogleSignIn()}
            disabled={authInProgress || loading}
            className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-98 disabled:opacity-80 group cursor-pointer"
          >
            {authInProgress ? (
              <div className="flex items-center gap-2 text-purple-700">
                <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                <span>{statusMessage || 'Google অ্যাকাউন্টে কানেক্ট হচ্ছে...'}</span>
              </div>
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
                <div className="flex flex-col text-left">
                  <span className="text-slate-900 font-black text-sm">Continue with Google</span>
                  <span className="text-[11px] text-slate-500 font-normal">iamsubha4200@gmail.com</span>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-slate-500 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Security Assurance */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real Google Authentication • Verified OAuth Session</span>
        </div>

      </div>
    </div>
  );
};
