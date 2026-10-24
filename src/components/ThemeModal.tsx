import React from 'react';
import { Palette, Check, Sparkles, X, Sun, Moon } from 'lucide-react';
import { useTheme, ThemeConfig } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { theme, themeId, setThemeId, themes } = useTheme();

  if (!isOpen) return null;

  const handleSelectTheme = (selected: ThemeConfig) => {
    setThemeId(selected.id);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.6 },
      colors: selected.previewColors,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#090C15]/95 border border-white/10 shadow-2xl p-6 sm:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto no-scrollbar"
        style={{
          boxShadow: `0 0 40px ${theme.glow}`,
        }}
      >
        {/* Subtle top glow bar */}
        <div 
          className="absolute top-0 inset-x-0 h-1.5 rounded-t-3xl transition-colors duration-500"
          style={{
            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`,
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}33, ${theme.secondary}33)`,
                border: `1px solid ${theme.primary}66`,
              }}
            >
              <Palette className="w-5 h-5" style={{ color: theme.secondary }} />
            </div>
            <div>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                Studio Theme Studio
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                  Custom Look
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Choose your favorite visual theme without losing any music or data
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themes.map((t) => {
            const isSelected = t.id === themeId;
            return (
              <div
                key={t.id}
                onClick={() => handleSelectTheme(t)}
                className={`relative rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 border ${
                  isSelected
                    ? 'bg-slate-900/90 shadow-lg scale-[1.02]'
                    : 'bg-slate-950/60 hover:bg-slate-900/50 border-white/10 hover:border-white/20'
                }`}
                style={{
                  borderColor: isSelected ? t.primary : undefined,
                  boxShadow: isSelected ? `0 0 25px ${t.glow}` : undefined,
                }}
              >
                {/* Theme Color Palette Dots */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {t.previewColors.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {isSelected && (
                    <span 
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-950 shadow-sm"
                      style={{ backgroundColor: t.secondary }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" /> Active
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                    {t.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {t.description}
                  </p>
                </div>

                {/* Color swatches strip */}
                <div 
                  className="h-1.5 w-full rounded-full opacity-70"
                  style={{
                    background: `linear-gradient(90deg, ${t.primary}, ${t.secondary}, ${t.accent})`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="pt-2 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Theme persists across restarts & device sync
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{
              background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
              boxShadow: `0 0 20px ${theme.glow}`,
            }}
          >
            Apply & Done
          </button>
        </div>

      </div>
    </div>
  );
};
