import React from 'react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { currentTheme, themeId, setTheme, themesList } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div 
        className="relative w-full max-w-lg rounded-3xl glass-panel border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 25px 50px -12px ${currentTheme.glowColor}`
        }}
      >
        {/* Top Gradient Beam */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500"
          style={{
            background: `linear-gradient(to right, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor}, ${currentTheme.accentColor})`
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.primaryColor}33, ${currentTheme.secondaryColor}22)`,
                border: `1px solid ${currentTheme.primaryColor}66`
              }}
            >
              <Palette className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-xl text-white flex items-center gap-2">
                <span>কালার থিম সিলেক্টর</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-medium">Themes</span>
              </h3>
              <p className="text-xs text-slate-400">
                আপনার পছন্দের ভাইব্রেন্ট নিয়ন থিম সিলেক্ট করুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {themesList.map((t) => {
            const isSelected = themeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer group ${
                  isSelected 
                    ? 'bg-white/10 shadow-lg' 
                    : 'bg-slate-900/40 hover:bg-slate-900/80 border-white/5 hover:border-white/20'
                }`}
                style={{
                  borderColor: isSelected ? t.primaryColor : undefined,
                  boxShadow: isSelected ? `0 0 20px ${t.primaryColor}33` : undefined
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Swatch Pill */}
                  <div className="flex items-center -space-x-1 flex-shrink-0">
                    <span 
                      className="w-5 h-5 rounded-full border border-black shadow" 
                      style={{ backgroundColor: t.primaryColor }} 
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-black shadow" 
                      style={{ backgroundColor: t.secondaryColor }} 
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-black shadow" 
                      style={{ backgroundColor: t.accentColor }} 
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-white group-hover:text-slate-100 transition-colors">
                        {t.name}
                      </span>
                      {isSelected && (
                        <span 
                          className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded"
                          style={{
                            backgroundColor: `${t.primaryColor}33`,
                            color: t.primaryColor
                          }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {t.nameBn}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isSelected ? (
                    <div 
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow"
                      style={{ backgroundColor: t.primaryColor }}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl border border-white/10 group-hover:border-white/30 flex items-center justify-center" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>স্মার্ট সাবহা বিটস আল্ট্রা-এইচডি ডিজাইন</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-900 font-bold text-xs transition-transform transform active:scale-95 cursor-pointer shadow-md"
            style={{ backgroundColor: currentTheme.primaryColor }}
          >
            Apply & Close
          </button>
        </div>

      </div>
    </div>
  );
};
