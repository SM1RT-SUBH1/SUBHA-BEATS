import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallContextType {
  deferredPrompt: BeforeInstallPromptEvent | null;
  isInstallable: boolean;
  isInstalled: boolean;
  isInstallModalOpen: boolean;
  setIsInstallModalOpen: (open: boolean) => void;
  promptInstall: () => Promise<boolean>;
  browserEnv: {
    isIOS: boolean;
    isAndroid: boolean;
    isStandalone: boolean;
    isMobile: boolean;
  };
}

const InstallContext = createContext<InstallContextType | undefined>(undefined);

export const InstallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const [browserEnv, setBrowserEnv] = useState({
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    isMobile: false,
  });

  useEffect(() => {
    // Detect environment
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    setBrowserEnv({ isIOS, isAndroid, isStandalone, isMobile });

    if (isStandalone) {
      setIsInstalled(true);
    }

    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      console.log('[Smart Subha Beats] beforeinstallprompt event received, PWA is installable');
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('[Smart Subha Beats] App successfully installed!');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          console.log('[Smart Subha Beats] User accepted install prompt');
          setIsInstalled(true);
          setDeferredPrompt(null);
          setIsInstallable(false);
          setIsInstallModalOpen(false);
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#06b6d4', '#ec4899', '#10b981']
          });
          return true;
        } else {
          console.log('[Smart Subha Beats] User dismissed install prompt');
          return false;
        }
      } catch (err) {
        console.warn('[Smart Subha Beats] Error calling prompt():', err);
        setIsInstallModalOpen(true);
        return false;
      }
    } else {
      // If no native deferred prompt, open the detailed install modal with device instructions & web app launcher
      setIsInstallModalOpen(true);
      return false;
    }
  };

  return (
    <InstallContext.Provider
      value={{
        deferredPrompt,
        isInstallable,
        isInstalled,
        isInstallModalOpen,
        setIsInstallModalOpen,
        promptInstall,
        browserEnv,
      }}
    >
      {children}
    </InstallContext.Provider>
  );
};

export const useInstall = () => {
  const context = useContext(InstallContext);
  if (!context) {
    throw new Error('useInstall must be used within an InstallProvider');
  }
  return context;
};
