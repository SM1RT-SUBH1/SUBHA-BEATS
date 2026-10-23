import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  Firestore 
} from 'firebase/firestore';

// Default config with environment fallbacks
const firebaseConfig = {
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || "AIzaSyMockSubhaKey123456789Beats",
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || "smart-subha-beats.firebaseapp.com",
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || "smart-subha-beats",
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || "smart-subha-beats.appspot.com",
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "100000000001",
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || "1:100000000001:web:subhabeatsmock"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase init warning:', err);
}

export { app, auth, db, GoogleAuthProvider, signInWithPopup, fbSignOut, onAuthStateChanged };
export type { FirebaseUser };
