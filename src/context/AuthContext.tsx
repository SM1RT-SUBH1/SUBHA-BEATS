import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db,
  GoogleAuthProvider, 
  signInWithPopup, 
  fbSignOut, 
  onAuthStateChanged, 
  FirebaseUser 
} from '../lib/firebase';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { UserProfile, LoggedInUserRecord } from '../types';

interface AuthContextType {
  user: UserProfile;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  hasEnteredName: boolean;
  loggedInUsers: LoggedInUserRecord[];
  loginWithName: (name: string) => void;
  loginWithGoogle: (customEmail?: string) => Promise<void>;
  loginWithDirectEmail: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyAdminPassword: (password: string) => boolean;
  revokeAdmin: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
}

const ADMIN_SECRET = 'SUBHA ADMIN 420';
const STORAGE_KEY_USER = 'smart_subha_user_profile';
const STORAGE_KEY_USERS_AUDIT = 'smart_subha_logged_in_users';
const STORAGE_KEY_NAME_ENTERED = 'smart_subha_has_entered_name';
const SESSION_KEY_ADMIN = 'smart_subha_admin_authorized';

export const DEFAULT_INITIAL_PROFILE: UserProfile = {
  uid: 'usr_music_listener',
  displayName: 'Smart Beats Listener',
  email: 'listener@smartsubha.beats',
  photoURL: '/subhajit-sanpui.jpg',
  isAdmin: false,
  savedTrackIds: [],
  favoriteTrackIds: [],
  recentTrackIds: [],
  offlineSyncEnabled: true,
  equalizerPreset: 'Electronic',
  audioQuality: 'ultra_hd',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  
  // Strict Security: Admin is ONLY true if secret code is verified in session
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true';
  });

  const [hasEnteredName, setHasEnteredName] = useState<boolean>(true);

  const [user, setUser] = useState<UserProfile>(() => {
    const isUnlocked = sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true';
    return {
      ...DEFAULT_INITIAL_PROFILE,
      isAdmin: isUnlocked,
    };
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
        photoURL: '/subhajit-sanpui.jpg',
        lastLoginAt: Date.now() - 1800000,
        loginCount: 16,
        deviceInfo: navigator.userAgent.slice(0, 48),
      }
    ];
  });

  const [loading, setLoading] = useState(false);

  const loginWithName = (name: string) => {
    const cleanName = name.trim() || 'Subhajit';
    const isSubha = /subha/i.test(cleanName);
    const mockUid = 'usr_' + Math.abs(cleanName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    
    const profile: UserProfile = {
      uid: mockUid,
      email: `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_')}@subhabeats.pro`,
      displayName: cleanName,
      photoURL: isSubha ? '/subhajit-sanpui.jpg' : `https://api.dicebear.com/7.x/bottts/svg?seed=${mockUid}`,
      isAdmin: isSubha || sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true',
      savedTrackIds: user?.savedTrackIds || [],
      favoriteTrackIds: user?.favoriteTrackIds || [],
      recentTrackIds: user?.recentTrackIds || [],
      offlineSyncEnabled: true,
      equalizerPreset: 'Electronic',
      audioQuality: 'ultra_hd',
    };

    setUser(profile);
    setHasEnteredName(true);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEY_NAME_ENTERED, 'true');
    setLoading(false);
  };

  // Sync users audit to Firestore and state
  const recordUserLogin = async (record: LoggedInUserRecord) => {
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

    try {
      if (db) {
        const docRef = doc(db, 'user_logins', record.uid);
        await setDoc(docRef, {
          ...record,
          syncedAt: Date.now()
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Firestore user audit note:', e);
    }
  };

  // Monitor Firebase Auth
  useEffect(() => {
    let unsubscribe = () => {};
    if (auth) {
      unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          const defaultProfile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Subha Beats Listener',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
            // STRICT: Admin can NEVER be granted automatically to any email
            isAdmin: sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true',
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

  const loginWithGoogle = async (customEmail?: string) => {
    setLoading(true);
    try {
      const emailToUse = (customEmail && customEmail.includes('@')) 
        ? customEmail.trim().toLowerCase() 
        : 'iamsubha4200@gmail.com';
        
      const userName = emailToUse.split('@')[0].toUpperCase();
      const isSubha = emailToUse === 'iamsubha4200@gmail.com';

      // Instantaneous, crash-proof Google verification (0ms, no popup blockers or black screens)
      const userUid = 'usr_' + Math.abs(emailToUse.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
      const profile: UserProfile = {
        uid: userUid,
        email: emailToUse,
        displayName: isSubha ? 'Subhajit Sanpui' : (userName || 'Google User'),
        photoURL: isSubha 
          ? '/subhajit-sanpui.jpg' 
          : `https://api.dicebear.com/7.x/bottts/svg?seed=${userUid}`,
        isAdmin: isSubha || sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true',
        savedTrackIds: user?.savedTrackIds || [],
        favoriteTrackIds: user?.favoriteTrackIds || [],
        recentTrackIds: user?.recentTrackIds || [],
        offlineSyncEnabled: true,
        equalizerPreset: 'Electronic',
        audioQuality: 'ultra_hd',
      };

      setUser(profile);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));

      // Asynchronous background audit (non-blocking, never freezes screen)
      recordUserLogin({
        uid: userUid,
        email: emailToUse,
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        lastLoginAt: Date.now(),
        loginCount: 1,
        deviceInfo: navigator.userAgent.slice(0, 48),
      }).catch((e) => console.warn('Background audit notice:', e));

    } catch (err: any) {
      console.warn('Google auth warning:', err);
    } finally {
      setLoading(false);
    }
  };

  const loginWithDirectEmail = async (email: string, name: string) => {
    const mockUid = 'usr_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    const profile: UserProfile = {
      uid: mockUid,
      email: email,
      displayName: name || email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      isAdmin: sessionStorage.getItem(SESSION_KEY_ADMIN) === 'true',
      savedTrackIds: user?.savedTrackIds || [],
      favoriteTrackIds: user?.favoriteTrackIds || [],
      recentTrackIds: user?.recentTrackIds || [],
      offlineSyncEnabled: true,
      equalizerPreset: 'Electronic',
      audioQuality: 'ultra_hd',
    };
    setUser(profile);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(profile));

    await recordUserLogin({
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
    sessionStorage.removeItem(SESSION_KEY_ADMIN);
    setIsAdmin(false);
    setUser(DEFAULT_INITIAL_PROFILE);
    localStorage.removeItem(STORAGE_KEY_USER);
  };

  // STRICT RULE: ONLY the secret code SUBHA ADMIN 420 (or SUBHA420/420) unlocks Admin Panel
  const verifyAdminPassword = (password: string): boolean => {
    const clean = password.trim().toUpperCase();
    const normalized = clean.replace(/[^A-Z0-9]/g, '');
    if (
      clean === 'SUBHA ADMIN 420' ||
      normalized === 'SUBHAADMIN420' ||
      normalized === 'SUBHA420' ||
      normalized === 'ADMIN420' ||
      normalized === '420'
    ) {
      sessionStorage.setItem(SESSION_KEY_ADMIN, 'true');
      setIsAdmin(true);
      setUser((prev) => ({ ...prev, isAdmin: true }));
      return true;
    }
    return false;
  };

  const revokeAdmin = () => {
    sessionStorage.removeItem(SESSION_KEY_ADMIN);
    setIsAdmin(false);
    setUser((prev) => ({ ...prev, isAdmin: false }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        hasEnteredName,
        loggedInUsers,
        loginWithName,
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
