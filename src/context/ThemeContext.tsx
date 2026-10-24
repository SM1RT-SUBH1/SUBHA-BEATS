import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  primary: string;       // main accent color (e.g. #8b5cf6)
  secondary: string;     // complementary accent (e.g. #06b6d4)
  accent: string;        // highlight color (e.g. #ec4899)
  glow: string;          // shadow glow rgba (e.g. rgba(139, 92, 246, 0.35))
  bgGradient: string;    // CSS background or radial overlay
  starColor: string;     // shooting stars color
  trailColor: string;    // shooting stars trail
  previewColors: string[]; // colors shown on theme pill/badge
}

export const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'violet',
    name: 'Cosmic Violet',
    description: 'Deep obsidian night with Aceternity violet & cyan aurora',
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    accent: '#ec4899',
    glow: 'rgba(139, 92, 246, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(139, 92, 246, 0.25), transparent 70%)',
    starColor: '#8B5CF6',
    trailColor: '#06B6D4',
    previewColors: ['#8b5cf6', '#06b6d4', '#ec4899'],
  },
  {
    id: 'emerald',
    name: 'Emerald Aurora',
    description: 'Bioluminescent emerald, mint glow & deep boreal green',
    primary: '#10b981',
    secondary: '#06b6d4',
    accent: '#84cc16',
    glow: 'rgba(16, 185, 129, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(16, 185, 129, 0.25), transparent 70%)',
    starColor: '#10B981',
    trailColor: '#34D399',
    previewColors: ['#10b981', '#34d399', '#06b6d4'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    description: 'Hyper-vibrant hot fuchsia, electric cyan & neo-Tokyo glow',
    primary: '#ec4899',
    secondary: '#3b82f6',
    accent: '#eab308',
    glow: 'rgba(236, 72, 153, 0.4)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(236, 72, 153, 0.25), transparent 70%)',
    starColor: '#EC4899',
    trailColor: '#3B82F6',
    previewColors: ['#ec4899', '#3b82f6', '#facc15'],
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    description: 'Abyssal navy trench with ice cyan & sapphire luminescence',
    primary: '#0ea5e9',
    secondary: '#6366f1',
    accent: '#14b8a6',
    glow: 'rgba(14, 165, 233, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(14, 165, 233, 0.25), transparent 70%)',
    starColor: '#0EA5E9',
    trailColor: '#6366F1',
    previewColors: ['#0ea5e9', '#6366f1', '#14b8a6'],
  },
  {
    id: 'amber',
    name: 'Sunset Amber & Gold',
    description: 'Warm solar gold, velvet amber & royal luxury radiance',
    primary: '#f59e0b',
    secondary: '#f97316',
    accent: '#e11d48',
    glow: 'rgba(245, 158, 11, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(245, 158, 11, 0.25), transparent 70%)',
    starColor: '#F59E0B',
    trailColor: '#F97316',
    previewColors: ['#f59e0b', '#f97316', '#e11d48'],
  },
  {
    id: 'ruby',
    name: 'Ruby Crimson',
    description: 'Blood moon velvet with scarlet embers & dark royal rose',
    primary: '#e11d48',
    secondary: '#9333ea',
    accent: '#fb7185',
    glow: 'rgba(225, 29, 72, 0.35)',
    bgGradient: 'radial-gradient(ellipse at 50% -20%, rgba(225, 29, 72, 0.25), transparent 70%)',
    starColor: '#E11D48',
    trailColor: '#9333EA',
    previewColors: ['#e11d48', '#9333ea', '#fb7185'],
  },
];

interface ThemeContextType {
  theme: ThemeConfig;
  themeId: string;
  setThemeId: (id: string) => void;
  themes: ThemeConfig[];
}

const STORAGE_KEY_THEME = 'smart_subha_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<string>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY_THEME);
      if (cached && AVAILABLE_THEMES.some((t) => t.id === cached)) {
        return cached;
      }
    } catch (e) {}
    return 'violet';
  });

  const activeTheme = AVAILABLE_THEMES.find((t) => t.id === themeId) || AVAILABLE_THEMES[0];

  const setThemeId = (id: string) => {
    if (AVAILABLE_THEMES.some((t) => t.id === id)) {
      setThemeIdState(id);
      try {
        localStorage.setItem(STORAGE_KEY_THEME, id);
      } catch (e) {}
    }
  };

  useEffect(() => {
    // Inject dynamic CSS custom properties on document root
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', activeTheme.primary);
    root.style.setProperty('--theme-secondary', activeTheme.secondary);
    root.style.setProperty('--theme-accent', activeTheme.accent);
    root.style.setProperty('--theme-glow', activeTheme.glow);
    root.setAttribute('data-theme', activeTheme.id);
  }, [activeTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeId,
        setThemeId,
        themes: AVAILABLE_THEMES,
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
