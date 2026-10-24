import React from 'react';
import { Home, Search, Library } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export type NavTab = 'home' | 'search' | 'library';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { theme } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#07090D]/95 border-t border-white/5 backdrop-blur-2xl pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] pt-2 select-none">
      <div className="max-w-md mx-auto px-6 flex items-center justify-around">
        
        {/* Home Tab matching Screenshot 1 */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex flex-col items-center gap-1 min-w-[64px] transition-all group"
        >
          <div 
            className={`px-5 py-1.5 rounded-full transition-all ${
              currentTab === 'home'
                ? 'bg-[#3A4B3D] text-[#A5D6A7]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
            style={{
              backgroundColor: currentTab === 'home' ? `${theme.secondary}26` : undefined,
              color: currentTab === 'home' ? theme.secondary : undefined,
            }}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold tracking-wide ${
            currentTab === 'home' ? 'text-white' : 'text-slate-400'
          }`}>
            Home
          </span>
        </button>

        {/* Search Tab matching Screenshot 1 */}
        <button
          onClick={() => onSelectTab('search')}
          className="flex flex-col items-center gap-1 min-w-[64px] transition-all group"
        >
          <div 
            className={`px-5 py-1.5 rounded-full transition-all ${
              currentTab === 'search'
                ? 'bg-[#3A4B3D] text-[#A5D6A7]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
            style={{
              backgroundColor: currentTab === 'search' ? `${theme.secondary}26` : undefined,
              color: currentTab === 'search' ? theme.secondary : undefined,
            }}
          >
            <Search className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold tracking-wide ${
            currentTab === 'search' ? 'text-white' : 'text-slate-400'
          }`}>
            Search
          </span>
        </button>

        {/* Library Tab matching Screenshot 1 */}
        <button
          onClick={() => onSelectTab('library')}
          className="flex flex-col items-center gap-1 min-w-[64px] transition-all group"
        >
          <div 
            className={`px-5 py-1.5 rounded-full transition-all ${
              currentTab === 'library'
                ? 'bg-[#3A4B3D] text-[#A5D6A7]'
                : 'text-slate-400 group-hover:text-slate-200'
            }`}
            style={{
              backgroundColor: currentTab === 'library' ? `${theme.secondary}26` : undefined,
              color: currentTab === 'library' ? theme.secondary : undefined,
            }}
          >
            <Library className="w-5 h-5" />
          </div>
          <span className={`text-[11px] font-semibold tracking-wide ${
            currentTab === 'library' ? 'text-white' : 'text-slate-400'
          }`}>
            Library
          </span>
        </button>

      </div>
    </nav>
  );
};
