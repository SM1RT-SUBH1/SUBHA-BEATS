import React from 'react';
import { ExternalLink, Music, Radio, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { useInstall } from '../context/InstallContext';
import { useMusic } from '../context/MusicContext';

interface FooterProps {
  onOpenRealtimeSyncModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenRealtimeSyncModal,
}) => {
  const { isInstalled, promptInstall } = useInstall();
  const { realtimeSyncInfo } = useMusic();

  return (
    <footer className="w-full mt-20 border-t border-white/10 bg-[#06080E]/90 backdrop-blur-2xl py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow beam */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent" />
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-24 bg-purple-600/15 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Top Footer Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-8">
          
          {/* Brand & Developer Note */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#080B14] rounded-2xl overflow-hidden relative">
                <img 
                  src="/subhajit-sanpui.jpg" 
                  alt="Subhajit Sanpui" 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/icon.svg'; }}
                />
              </div>
            </div>
            <div>
              <p className="font-heading font-extrabold text-base text-white flex items-center gap-2">
                <span>Smart Subha <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">BEATS</span></span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold">
                  STUDIO HQ
                </span>
              </p>
              <p className="text-xs text-slate-400">
                Aceternity Sound System • Ultra-HQ Audio • Real-Time Cross-Device Synced
              </p>
            </div>
          </div>

          {/* Real-time Status & PWA Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Real-time Cross-Device Sync Badge */}
            <button
              onClick={onOpenRealtimeSyncModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-950/40"
              title="Real-Time Sync Active Across All Devices"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Real-Time Sync: {realtimeSyncInfo.roomCode}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </button>

            {/* PWA App Install Action */}
            <button
              onClick={() => promptInstall()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 hover:border-cyan-400 text-purple-200 hover:text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isInstalled ? 'App Active on Device ✓' : 'Install App (PWA)'}</span>
            </button>
          </div>

        </div>

        {/* Mandatory Hyperlinked Copyright Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-medium text-slate-300">All Copyright Reserved ©</span>
            <a
              href="https://smartsubhaportfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-purple-400 hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-purple-500/60 hover:decoration-cyan-400 group"
            >
              <span>Smart Subha</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] text-slate-400">
              Official Production Architecture: Asia-East1 Cloud Edge • Real-Time Firestore Sync
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Audio Streams 100% Operational
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
};
