import React from 'react';
import { ExternalLink, Heart, Music, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-white/10 bg-[#06080E]/90 backdrop-blur-xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        
        {/* Brand & Developer Note */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
            <Music className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <p className="font-heading font-bold text-sm text-white">
              Smart Subha <span className="text-purple-400">BEATS</span>
            </p>
            <p className="text-[11px] text-slate-500">
              Next-Gen Studio Audio Streaming • Curated by Subha Master Admin
            </p>
          </div>
        </div>

        {/* Hyperlinked Copyright Requirement */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>All Copyright Reserved ©</span>
          <a
            href="https://smartsubhaportfolio.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-purple-400 hover:text-cyan-300 transition-colors underline underline-offset-4 decoration-purple-500/60 hover:decoration-cyan-400 group"
          >
            <span>Smart Subha</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

      </div>
    </footer>
  );
};
