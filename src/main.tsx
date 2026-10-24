import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MusicProvider } from './context/MusicContext';
import { InstallProvider } from './context/InstallContext';
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

import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MusicProvider>
            <InstallProvider>
              <App />
            </InstallProvider>
          </MusicProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
