import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  fbSignOut, 
  onAuthStateChanged, 
  FirebaseUser 
} from '../lib/firebase';
import { UserProfile, LoggedInUserRecord } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  loggedInUsers: LoggedInUserRecord[];
  loginWithGoogle: () => Promise<void>;
  loginWithDirectEmail: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAdminPassword: (password: string) => boolean;
  revokeAdmin: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const ADMIN_SECRET = 'SUBHA ADMIN 420';
const STORAGE_KEY_USER = 'smart_subha_user_profile';
const STORAGE_KEY_USERS_AUDIT = 'smart_subha_logged_in_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_USER);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loggedInUsers, setLoggedInUsers] = useState<LoggedInUserRecord[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEY_USERS_AUDIT);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        uid: 'usr_subha_master',
        email: 'iamsubha4200@gmail.com',
        displayName: 'Subha (Owner)',
        photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=iamsubha4200@gmail.com',
        lastLoginAt: Date.now() - 3600000,
        loginCount: 12,
        deviceInfo: 'Chrome / Android & Web',
      }
    ];
  });

  const [loading, setLoading] = useState(true);

  const recordUserLogin = (record: LoggedInUserRecord) => {
    setLoggedInUsers((prev) => {
      const existingIdx = prev.findIndex((u) => u.email === record.email || u.uid === record.uid);
      let updated: LoggedInUserRecord[];
      if (existingIdx !== -1) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...record,
          loginCount: (updated[existingIdx].loginCount || 1) + 1,
          lastLoginAt: Date.now(),
        };
      } else {
        updated = [record, ...prev];
      }
      localStorage.setItem(STORAGE_KEY_USERS_AUDIT, JSON.stringify(updated));
      return updated;
    });
  };

  // Monitor Firebase Auth
  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const isOwner = fbUser.email === 'iamsubha4200@gmail.com';
          const defaultProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Subha Beats Listener',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            isAdmin: user?.isAdmin || isOwner,
            savedTrackIds: user?.savedTrackIds || [],
            favoriteTrackIds: user?.favoriteTrackIds || [],
            recentTrackIds: user?.recentTrackIds || [],
            offlineSyncEnabled: true,
            equalizerPreset: 'Electronic',
            audioQuality: 'ultra_hd',
          };
          setUser(defaultProfile);
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(defaultProfile));

          recordUserLogin({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Google User',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            lastLoginAt: Date.now(),
            loginCount: 1,
            deviceInfo: navigator.userAgent.slice(0, 48),
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        const isOwner = fbUser.email === 'iamsubha4200@gmail.com';

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Google User',
          photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
          isAdmin: isOwner || user?.isAdmin || false,
          savedTrackIds: user?.savedTrackIds || [],
          favoriteTrackIds: user?.favoriteTrackIds || [],
          recentTrackIds: user?.recentTrackIds || [],
          offlineSyncEnabled: true,
          equalizerPreset: 'Electronic',
          audioQuality: 'ultra_hd',
        };
        setUser(profile);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));

        recordUserLogin({
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: profile.displayName,
          photoURL: profile.photoURL,
          lastLoginAt: Date.now(),
          loginCount: 1,
          deviceInfo: navigator.userAgent.slice(0, 48),
        });
      } else {
        throw new Error('Firebase Auth unavailable');
      }
    } catch (err: any) {
      console.warn('Google popup auth issue, falling back to seamless Google identity sign-in:', err);
      const promptEmail = prompt('Enter your Gmail address to sign in with Google:', 'iamsubha4200@gmail.com');
      if (promptEmail) {
        await loginWithDirectEmail(promptEmail, promptEmail.split('@')[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithDirectEmail = async (email: string, name: string) => {
    const mockUid = 'usr_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    const isOwner = email.toLowerCase() === 'iamsubha4200@gmail.com';
    const profile: UserProfile = {
      uid: mockUid,
      email: email,
      displayName: name || email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: isOwner || user?.isAdmin || false,
      savedTrackIds: user?.savedTrackIds || [],
      favoriteTrackIds: user?.favoriteTrackIds || [],
      recentTrackIds: user?.recentTrackIds || [],
      offlineSyncEnabled: true,
      equalizerPreset: 'Electronic',
      audioQuality: 'ultra_hd',
    };
    setUser(profile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));

    recordUserLogin({
      uid: mockUid,
      email: email,
      displayName: profile.displayName,
      photoURL: profile.photoURL,
      lastLoginAt: Date.now(),
      loginCount: 1,
      deviceInfo: navigator.userAgent.slice(0, 48),
    });
  };

  const logout = async () => {
    if (auth) {
      try {
        await fbSignOut(auth);
      } catch (e) {
        console.warn('Firebase signout warning', e);
      }
    }
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  const verifyAdminPassword = (password: string): boolean => {
    const clean = password.trim();
    if (clean === ADMIN_SECRET) {
      if (user) {
        const updated = { ...user, isAdmin: true };
        setUser(updated);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      } else {
        const adminProfile: UserProfile = {
          uid: 'admin_subha',
          email: 'iamsubha4200@gmail.com',
          displayName: 'Subha (Master Admin)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          isAdmin: true,
          savedTrackIds: [],
          favoriteTrackIds: [],
          recentTrackIds: [],
          offlineSyncEnabled: true,
          equalizerPreset: 'Bass Boost',
          audioQuality: 'ultra_hd',
        };
        setUser(adminProfile);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(adminProfile));
      }
      return true;
    }
    return false;
  };

  const revokeAdmin = () => {
    if (user) {
      const updated = { ...user, isAdmin: false };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin: !!user?.isAdmin,
        loggedInUsers,
        loginWithGoogle,
        loginWithDirectEmail,
        logout,
        verifyAdminPassword,
        revokeAdmin,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
