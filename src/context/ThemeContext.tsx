import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'cyber-violet' | 'midnight-cyan' | 'emerald-bass' | 'sunset-gold' | 'amoled-dark';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameBn: string;
  bgColor: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgClass: string;
  gradientText: string;
  cardBorder: string;
  glowColor: string;
  pillColor: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'cyber-violet': {
    id: 'cyber-violet',
    name: 'Cyberpunk Violet',
    nameBn: 'সাইবারপঙ্ক ভায়োলেট (ডিফল্ট)',
    bgColor: '#06080F',
    primaryColor: '#8B5CF6',
    secondaryColor: '#06B6D4',
    accentColor: '#EC4899',
    bgClass: 'bg-[#06080F]',
    gradientText: 'from-purple-400 via-cyan-300 to-indigo-300',
    cardBorder: 'border-purple-500/20 hover:border-purple-500/50',
    glowColor: 'rgba(139, 92, 246, 0.35)',
    pillColor: 'bg-purple-600',
    primary: '#8B5CF6',
    secondary: '#06B6D4',
    accent: '#EC4899',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
  'midnight-cyan': {
    id: 'midnight-cyan',
    name: 'Electric Midnight',
    nameBn: 'ইলেকট্রিক সায়ান ব্লু',
    bgColor: '#040915',
    primaryColor: '#06B6D4',
    secondaryColor: '#3B82F6',
    accentColor: '#10B981',
    bgClass: 'bg-[#040915]',
    gradientText: 'from-cyan-300 via-blue-400 to-teal-300',
    cardBorder: 'border-cyan-500/20 hover:border-cyan-500/50',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    pillColor: 'bg-cyan-500',
    primary: '#06B6D4',
    secondary: '#3B82F6',
    accent: '#10B981',
    glow: 'rgba(6, 182, 212, 0.35)',
  },
  'emerald-bass': {
    id: 'emerald-bass',
    name: 'Emerald Bass',
    nameBn: 'এমারেল্ড নিয়ন বাস',
    bgColor: '#030D08',
    primaryColor: '#10B981',
    secondaryColor: '#84CC16',
    accentColor: '#06B6D4',
    bgClass: 'bg-[#030D08]',
    gradientText: 'from-emerald-300 via-lime-400 to-teal-300',
    cardBorder: 'border-emerald-500/20 hover:border-emerald-500/50',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    pillColor: 'bg-emerald-500',
    primary: '#10B981',
    secondary: '#84CC16',
    accent: '#06B6D4',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  'sunset-gold': {
    id: 'sunset-gold',
    name: 'Sunset Gold',
    nameBn: 'সানসেট রয়্যাল গোল্ড',
    bgColor: '#0D0904',
    primaryColor: '#F59E0B',
    secondaryColor: '#F43F5E',
    accentColor: '#8B5CF6',
    bgClass: 'bg-[#0D0904]',
    gradientText: 'from-amber-300 via-orange-400 to-rose-400',
    cardBorder: 'border-amber-500/20 hover:border-amber-500/50',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    pillColor: 'bg-amber-500',
    primary: '#F59E0B',
    secondary: '#F43F5E',
    accent: '#8B5CF6',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  'amoled-dark': {
    id: 'amoled-dark',
    name: 'AMOLED Obsidian',
    nameBn: 'পিউর অ্যামোলেড ব্ল্যাক',
    bgColor: '#000000',
    primaryColor: '#E2E8F0',
    secondaryColor: '#8B5CF6',
    accentColor: '#38BDF8',
    bgClass: 'bg-[#000000]',
    gradientText: 'from-white via-slate-200 to-slate-400',
    cardBorder: 'border-white/15 hover:border-white/40',
    glowColor: 'rgba(255, 255, 255, 0.2)',
    pillColor: 'bg-slate-200 text-black',
    primary: '#E2E8F0',
    secondary: '#8B5CF6',
    accent: '#38BDF8',
    glow: 'rgba(255, 255, 255, 0.2)',
  },
};

interface ThemeContextType {
  currentTheme: ThemeConfig;
  theme: ThemeConfig;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  themesList: ThemeConfig[];
}

const STORAGE_KEY_THEME = 'smart_subha_theme_id';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_THEME) as ThemeId;
    return cached && THEMES[cached] ? cached : 'cyber-violet';
  });

  const currentTheme = THEMES[themeId] || THEMES['cyber-violet'];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_THEME, themeId);
    
    // Apply CSS variables to root and HTML/Body
    const root = document.documentElement;
    root.style.setProperty('--theme-bg', currentTheme.bgColor);
    root.style.setProperty('--theme-primary', currentTheme.primaryColor);
    root.style.setProperty('--theme-secondary', currentTheme.secondaryColor);
    root.style.setProperty('--theme-accent', currentTheme.accentColor);
    root.style.setProperty('--theme-glow', currentTheme.glowColor);
    root.setAttribute('data-theme', themeId);

    // Ensure document.body inherits theme background color directly
    document.body.style.backgroundColor = currentTheme.bgColor;
    
    // Update theme-color meta tag for mobile status bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme.bgColor);
    }
  }, [themeId, currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        theme: currentTheme,
        themeId,
        setTheme: (id: ThemeId) => setThemeId(id),
        themesList: Object.values(THEMES),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
