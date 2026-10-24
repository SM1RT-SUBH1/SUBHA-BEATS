import React from 'react';
import { Music, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const SUBHA_IMAGE_URL = 'https://smartsubhaportfolio.netlify.app/subhajit-sanpui.jpg';

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
  onClick,
}) => {
  const { theme } = useTheme();

  const dimensions = {
    sm: { box: 'w-8 h-8', img: 'w-6 h-6', icon: 'w-3 h-3', text: 'text-sm' },
    md: { box: 'w-11 h-11', img: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-base' },
    lg: { box: 'w-14 h-14', img: 'w-11 h-11', icon: 'w-5 h-5', text: 'text-xl' },
    xl: { box: 'w-20 h-20', img: 'w-16 h-16', icon: 'w-7 h-7', text: 'text-2xl' },
  }[size];

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 cursor-pointer group select-none ${className}`}
    >
      {/* Unique Custom Music Logo containing Subhajit Sanpui portrait & neon music emblem */}
      <div 
        className={`relative ${dimensions.box} rounded-2xl p-[1.5px] transition-all duration-300 transform group-hover:scale-105 active:scale-95`}
        style={{
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
          boxShadow: `0 0 20px ${theme.glow}`,
        }}
      >
        {/* Outer Vinyl / Soundwave Groove */}
        <div className="w-full h-full bg-[#05070D] rounded-2xl overflow-hidden relative flex items-center justify-center">
          
          {/* Subhajit Sanpui Portrait */}
          <img
            src={SUBHA_IMAGE_URL}
            alt="Subhajit Sanpui"
            className="w-full h-full object-cover rounded-2xl group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              // Graceful fallback to verified avatar if offline
              (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/bottts/svg?seed=subhajitsanpui';
            }}
          />

          {/* Vignette & Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Overlaid Music Emblem Ring */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 rounded-tl-xl rounded-br-2xl flex items-center justify-center shadow-md backdrop-blur-md"
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            }}
          >
            <Music className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-950 fill-current" />
          </div>

          {/* Active Soundwave Pulse Ring */}
          <div 
            className="absolute inset-0 rounded-2xl border pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: theme.secondary }}
          />
        </div>

        {/* Live Online Verified Indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#05070D] shadow-sm animate-pulse" />
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-black tracking-tight text-white ${dimensions.text}`}>
              Smart Subha
            </span>
            <span 
              className={`font-heading font-black tracking-wide bg-clip-text text-transparent ${dimensions.text}`}
              style={{
                backgroundImage: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`
              }}
            >
              BEATS
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            Official Subhajit Sanpui Music Studio
          </span>
        </div>
      )}
    </div>
  );
};
