import React, { useState, useEffect } from 'react';
import { useMusic } from './context/MusicContext';
import { useAuth } from './context/AuthContext';
import { useInstall } from './context/InstallContext';
import { useTheme } from './context/ThemeContext';

// Components
import { SpeedDialHome } from './components/SpeedDialHome';
import { SearchView } from './components/SearchView';
import { LibraryView } from './components/LibraryView';
import { BottomNav, NavTab } from './components/BottomNav';
import { MusicPlayer } from './components/MusicPlayer';
import { FullPlayerModal } from './components/FullPlayerModal';
import { AccountMeldModal } from './components/AccountMeldModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeModal } from './components/ThemeModal';
import { RealtimeSyncModal } from './components/RealtimeSyncModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { OfflineSyncModal } from './components/OfflineSyncModal';
import { InstallAppModal } from './components/InstallAppModal';
import { LoginGate } from './components/LoginGate';

// Canvas / Ambient Atmosphere
import { StarsBackground } from './components/ui/stars-background';
import { ShootingStars } from './components/ui/shooting-stars';

export const App: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme } = useTheme();

  // Navigation State
  const [currentNavTab, setCurrentNavTab] = useState<NavTab>('home');

  // Modals
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOfflineOpen, setIsOfflineOpen] = useState(false);

  // Mandatory Real-Time Gmail Auth Gate
  if (!user && !authLoading) {
    return <LoginGate />;
  }

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Dynamic Cosmic Stars & Ambient Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <StarsBackground starDensity={0.00015} allStarsTwinkle={true} minTwinkleSpeed={0.5} maxTwinkleSpeed={1.5} />
        <ShootingStars minSpeed={15} maxSpeed={30} minDelay={2500} maxDelay={6000} starColor={theme.starColor} trailColor={theme.trailColor} />
        
        {/* Subtle Ambient Vignettes */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full blur-[160px] pointer-events-none opacity-20"
          style={{ backgroundColor: theme.primary }}
        />
        <div 
          className="absolute top-[30%] -right-[15%] w-[45vw] h-[45vw] rounded-full blur-[170px] pointer-events-none opacity-15"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>

      {/* Main Viewport Routed by Bottom Navigation */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col relative z-10 pt-2">
        {currentNavTab === 'home' && (
          <SpeedDialHome
            onOpenAccountModal={() => setIsAccountOpen(true)}
            onOpenSyncModal={() => setIsSyncOpen(true)}
            onOpenInstallModal={() => {}}
            onOpenHistoryModal={() => setCurrentNavTab('library')}
            onOpenTrendingModal={() => setCurrentNavTab('search')}
          />
        )}

        {currentNavTab === 'search' && (
          <SearchView />
        )}

        {currentNavTab === 'library' && (
          <LibraryView />
        )}
      </main>

      {/* Floating RiMusic Mini Player anchored above Bottom Navigation */}
      <MusicPlayer onOpenFullPlayer={() => setIsFullPlayerOpen(true)} />

      {/* Native Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentNavTab}
        onSelectTab={setCurrentNavTab}
      />

      {/* Full-Screen Now Playing Player Modal matching Screenshot 4 */}
      <FullPlayerModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
      />

      {/* Account / Meld Modal matching Screenshot 2 */}
      <AccountMeldModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal matching Screenshot 3 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenAppearance={() => setIsThemeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Appearance / Theme Modal */}
      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
      />

      {/* Real-Time Cross-Device Sync Modal */}
      <RealtimeSyncModal
        isOpen={isSyncOpen}
        onClose={() => setIsSyncOpen(false)}
      />

      {/* Master Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Offline Sync Manager Modal */}
      <OfflineSyncModal
        isOpen={isOfflineOpen}
        onClose={() => setIsOfflineOpen(false)}
      />

      {/* PWA App Installation Modal */}
      <InstallAppModal />

    </div>
  );
};

export default App;
