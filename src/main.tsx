import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { InstallProvider } from './context/InstallContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

// Register Service Worker for offline audio caching and background stream playback
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[Smart Subha Beats] Service Worker registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.warn('[Smart Subha Beats] Service Worker registration note:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MusicProvider>
          <InstallProvider>
            <App />
          </InstallProvider>
        </MusicProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
