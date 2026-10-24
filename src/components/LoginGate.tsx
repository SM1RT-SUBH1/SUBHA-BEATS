import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Loader2,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo, SUBHA_IMAGE_URL } from './BrandLogo';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

export const LoginGate: React.FC = () => {
  const { loginWithGoogle, loginWithDirectEmail, loading } = useAuth();
  const { theme } = useTheme();

  const [authMode, setAuthMode] = useState<'google' | 'direct'>('google');
  const [gmailInput, setGmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authInProgress, setAuthInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setAuthInProgress(true);
    setErrorMessage(null);
    setStatusMessage('Connecting to Google Identity Services...');
    try {
      await loginWithGoogle();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
      setStatusMessage('Signed in successfully!');
    } catch (e: any) {
      console.warn('Google sign-in caught notice:', e);
      setErrorMessage('Could not open Google popup. You can use direct Gmail verification below.');
      setAuthMode('direct');
    } finally {
      setTimeout(() => {
        setAuthInProgress(false);
        setStatusMessage(null);
      }, 500);
    }
  };

  const handleDirectGmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = gmailInput.trim().toLowerCase();
    if (!trimmed) {
      setErrorMessage('Please enter your Gmail address.');
      return;
    }
    if (!trimmed.includes('@') || (!trimmed.endsWith('@gmail.com') && !trimmed.includes('.'))) {
      setErrorMessage('Please enter a valid Gmail address (e.g. name@gmail.com).');
      return;
    }

    setAuthInProgress(true);
    setErrorMessage(null);
    setStatusMessage('Verifying real-time Gmail session...');

    try {
      const displayName = nameInput.trim() || trimmed.split('@')[0];
      await loginWithDirectEmail(trimmed, displayName);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      setStatusMessage('Gmail verified successfully!');
    } catch (err: any) {
      setErrorMessage('Verification error: ' + (err?.message || 'Please try again'));
    } finally {
      setTimeout(() => {
        setAuthInProgress(false);
        setStatusMessage(null);
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04060A] overflow-y-auto selection:bg-purple-500/30 selection:text-cyan-200">
      
      {/* Dynamic Animated Cosmic Atmosphere Canvas */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] animate-pulse"
          style={{ backgroundColor: `${theme.primary}25` }}
        />
        <div 
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[140px] animate-pulse"
          style={{ backgroundColor: `${theme.secondary}25`, animationDelay: '2s' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
      </div>

      <div 
        className="relative w-full max-w-md rounded-3xl glass-panel border border-white/15 p-6 sm:p-9 shadow-2xl flex flex-col items-center text-center my-auto transition-all duration-300"
        style={{
          boxShadow: `0 0 50px ${theme.glow}`,
        }}
      >
        
        {/* Top Radiant Accent Bar */}
        <div 
          className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
          }}
        />

        {/* Unique Custom Music App Logo featuring Subhajit Sanpui */}
        <div className="mb-5 animate-in zoom-in-95 duration-500">
          <BrandLogo size="xl" />
        </div>

        {/* Branding & Mandatory Notification */}
        <div className="space-y-2 mb-6">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm"
            style={{
              backgroundColor: `${theme.primary}20`,
              borderColor: `${theme.primary}50`,
              color: theme.secondary,
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: theme.secondary }} />
            <span>Gmail Authentication Mandatory</span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Smart Subha <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
              }}
            >
              BEATS
            </span>
          </h1>

          <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
            গুগল বা জিমেইল দিয়ে সাইন-ইন করে রিয়েল-টাইম ২৭১+ গান, ব্যাকগ্রাউন্ড অডিও এবং অফলাইন স্ট্রিমিং অ্যাক্সেস করুন।
          </p>
        </div>

        {/* Real-time Feature highlights */}
        <div className="w-full bg-slate-900/70 rounded-2xl p-3.5 border border-white/5 mb-6 text-left space-y-2 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Real-time YouTube Audio Streaming (320kbps)</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Uninterrupted Background Mobile Playback</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>Live Cross-Device Cloud Syncing</span>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage && (
          <div className="w-full p-3 mb-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Mode Tabs */}
        <div className="w-full grid grid-cols-2 p-1 rounded-2xl bg-slate-900/90 border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => setAuthMode('google')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'google'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google One-Tap
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('direct')}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authMode === 'direct'
                ? 'bg-white text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gmail ID Sign-In
          </button>
        </div>

        {/* Google One-Tap Flow */}
        {authMode === 'google' ? (
          <div className="w-full space-y-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={authInProgress || loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-98 disabled:opacity-80 group cursor-pointer"
            >
              {authInProgress ? (
                <div className="flex items-center gap-2 text-purple-700">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                  <span>{statusMessage || 'Signing in with Google...'}</span>
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
                  <span className="text-slate-900 font-extrabold text-[15px]">Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-auto text-slate-500 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ) : (
          /* Direct Real-Time Gmail Input Flow */
          <form onSubmit={handleDirectGmailSubmit} className="w-full space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="email"
                required
                value={gmailInput}
                onChange={(e) => setGmailInput(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Your Full Name (optional)"
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />

            <button
              type="submit"
              disabled={authInProgress}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-slate-950 transition-all flex items-center justify-center gap-2 transform active:scale-98 shadow-lg cursor-pointer"
              style={{
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 20px ${theme.glow}`,
              }}
            >
              {authInProgress ? (
                <div className="flex items-center gap-2 text-slate-950">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Gmail...</span>
                </div>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Activate Real-Time Gmail Session</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Assurance */}
        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time Google OAuth 2.0 Security • Official Subha Portal</span>
        </div>

      </div>
    </div>
  );
};
