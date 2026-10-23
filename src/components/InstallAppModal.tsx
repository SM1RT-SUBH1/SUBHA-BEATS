import React, { useState } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Laptop, 
  Apple, 
  CheckCircle2, 
  Sparkles, 
  WifiOff, 
  Headphones, 
  Share2, 
  PlusSquare, 
  ShieldCheck,
  FileCode,
  Languages,
  Check,
  Radio
} from 'lucide-react';
import { useInstall } from '../context/InstallContext';

export const InstallAppModal: React.FC = () => {
  const { 
    isInstallModalOpen, 
    setIsInstallModalOpen, 
    promptInstall, 
    deferredPrompt, 
    isInstalled, 
    browserEnv 
  } = useInstall();

  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>(
    browserEnv.isIOS ? 'ios' : browserEnv.isAndroid ? 'android' : 'android'
  );

  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isInstallModalOpen) return null;

  // Function to create a direct desktop/mobile web shortcut launcher file
  const handleDownloadShortcut = () => {
    const appUrl = window.location.origin;
    const shortcutHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Smart Subha Beats Launcher</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="refresh" content="0; url=${appUrl}">
  <style>
    body { background: #07090e; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .card { background: #111827; padding: 30px; border-radius: 20px; border: 1px solid #8b5cf6; }
    h1 { color: #8b5cf6; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Smart Subha Beats</h1>
    <p>Launching Ultra-HQ YouTube Audio Studio with Background Playback...</p>
    <p><a href="${appUrl}" style="color: #06b6d4;">Click here if not redirected automatically</a></p>
  </div>
</body>
</html>`;

    const blob = new Blob([shortcutHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Smart-Subha-Beats.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-slate-900 via-[#0B0F19] to-slate-950 border border-purple-500/30 shadow-2xl shadow-purple-900/40 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Glow header backdrop */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-purple-600/20 via-cyan-500/10 to-transparent pointer-events-none" />
        
        {/* Modal Top Bar */}
        <div className="relative z-10 px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#090D16] border border-purple-500/40 p-1 shadow-lg shadow-purple-500/20 flex items-center justify-center flex-shrink-0">
              <img 
                src="/icon-192.png" 
                alt="Smart Subha Beats" 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-extrabold text-white">
                  Install Android APK
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  WebAPK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'bn' ? 'ফোনে আসল APK অ্যাপ হিসেবে ইনস্টল করুন' : 'Install Standalone APK to your Mobile Phone'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-[11px] font-semibold text-cyan-300 border border-cyan-500/30 transition-colors"
              title="Toggle Bengali / English"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            <button
              onClick={() => setIsInstallModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="relative z-10 px-6 py-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Main Action Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-cyan-900/40 border border-purple-500/40 shadow-xl">
            {isInstalled ? (
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-7 h-7 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-white">
                    {language === 'bn' ? 'অ্যাপটি আপনার ডিভাইসে সফলভাবে ইনস্টল করা হয়েছে!' : 'App is Successfully Installed!'}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {language === 'bn' 
                      ? 'আপনি এখন ফোন লক করলেও বা ব্যাকগ্রাউন্ডে থাকলেও আনলিমিটেড গান শুনতে পারবেন।' 
                      : 'You are running the standalone app with background playback enabled.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      {language === 'bn' ? '১-ক্লিকে Android APK ইনস্টল করুন' : '1-Click Direct Android APK Installation'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {language === 'bn' 
                        ? 'Google Chrome স্বয়ংক্রিয়ভাবে একটি অফিসিয়াল Android APK (.apk) তৈরি করে আপনার ফোনের অ্যাপ ড্রয়ারে ইনস্টল করবে।'
                        : 'Google Chrome automatically generates an official signed Android APK (WebAPK) directly into your phone.'
                      }
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => promptInstall()}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-600 hover:from-emerald-400 hover:to-purple-500 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Download className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                  <span>{language === 'bn' ? 'ফোনে Android APK ইনস্টল করুন' : 'Install Android APK to Phone Now'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Bengali Quick Guide Highlight */}
          {language === 'bn' ? (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>ফোনে প্রপার APK হিসেবে ইনস্টল করার সহজ নিয়ম:</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-none pl-1">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">১</span>
                  <span>আপনার অ্যান্ড্রয়েড ফোনের <strong>Google Chrome</strong> ব্রাউজারে এই লিংকটি খুলুন।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">২</span>
                  <span>উপরের <strong>"ফোনে Android APK ইনস্টল করুন"</strong> বাটনে চাপ দিন (অথবা Chrome এর উপরের ৩টি ডট <strong>⋮</strong> থেকে <strong>"Install app"</strong> চাপুন)।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">৩</span>
                  <span>Google আপনার ফোনে স্বয়ংক্রিয়ভাবে আসল <strong>WebAPK</strong> ইনস্টল করে অ্যাপ ড্রয়ারে আইকন যুক্ত করে দেবে।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">✓</span>
                  <span>এবার <strong>ফোন লক করলেও বা অন্য অ্যাপে গেলেও</strong> গান ব্যাকগ্রাউন্ডে নন-স্টপ চলতে থাকবে!</span>
                </li>
              </ul>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>How WebAPK installs on your Android phone:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you tap Install in Google Chrome on Android, Chrome's WebAPK engine automatically packages and signs a real <strong>.apk</strong> on Google Play services and installs it directly into your Android OS App Drawer. It runs with zero browser address bars and supports continuous background playback with lock-screen media player notifications.
              </p>
            </div>
          )}

          {/* Platform Selector Tabs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {language === 'bn' ? 'ডিভাইস অনুযায়ী স্টেপস' : 'Device-Specific Installation Steps'}
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActivePlatform('android')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  activePlatform === 'android'
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android (APK)</span>
              </button>

              <button
                onClick={() => setActivePlatform('ios')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  activePlatform === 'ios'
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Apple className="w-3.5 h-3.5 text-slate-200" />
                <span>iPhone/iPad</span>
              </button>

              <button
                onClick={() => setActivePlatform('desktop')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                  activePlatform === 'desktop'
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                <span>PC / Mac</span>
              </button>
            </div>

            {/* Platform Specific Step Cards */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
              {activePlatform === 'android' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
                    <p className="text-slate-200">
                      In Chrome, tap the <strong>three dots menu (⋮)</strong> in the upper right corner of your browser.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
                    <p className="text-slate-200">
                      Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">3</span>
                    <p className="text-slate-200">
                      Click <strong>"Install"</strong> to confirm. Android builds the native APK and adds Smart Subha Beats to your phone drawer with background playback enabled!
                    </p>
                  </div>
                </div>
              )}

              {activePlatform === 'ios' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
                    <p className="text-slate-200 flex items-center gap-1.5 flex-wrap">
                      In Safari, tap the <strong>Share button</strong> 
                      <span className="p-1 rounded bg-slate-800 border border-slate-700 inline-flex"><Share2 className="w-3 h-3 text-cyan-400" /></span> 
                      at the bottom bar.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
                    <p className="text-slate-200 flex items-center gap-1.5 flex-wrap">
                      Scroll down and tap <strong>"Add to Home Screen"</strong>
                      <span className="p-1 rounded bg-slate-800 border border-slate-700 inline-flex"><PlusSquare className="w-3 h-3 text-purple-400" /></span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">3</span>
                    <p className="text-slate-200">
                      Tap <strong>"Add"</strong> in the top right. Enjoy full-screen standalone audio on iOS!
                    </p>
                  </div>
                </div>
              )}

              {activePlatform === 'desktop' && (
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">1</span>
                    <p className="text-slate-200">
                      Look at the right side of the address bar at the top of your Chrome/Edge browser for the <strong>Install App icon (⊕ or 💻)</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">2</span>
                    <p className="text-slate-200">
                      Or click the 3-dots menu (⋮) → <strong>"Save and share"</strong> → <strong>"Install Smart Subha Beats"</strong>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0 mt-0.5">3</span>
                    <p className="text-slate-200">
                      Click <strong>"Install"</strong> to launch the native desktop window with media keyboard shortcuts and background playback!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Launcher Shortcut Downloader */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-3">
            <div>
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'bn' ? 'স্ট্যান্ডঅ্যালোন অফলাইন লঞ্চার' : 'Standalone App Launcher File'}
              </h5>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' 
                  ? '১-ক্লিকে ফোন বা কম্পিউটারে লঞ্চার ফাইল (.html) ডাউনলোড করুন' 
                  : 'Download a 1-click standalone launcher file (.html) to your device.'}
              </p>
            </div>
            <button
              onClick={handleDownloadShortcut}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 flex-shrink-0 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>{downloadSuccess ? (language === 'bn' ? 'ডাউনলোড সম্পন্ন!' : 'Downloaded!') : (language === 'bn' ? 'ডাউনলোড' : 'Download')}</span>
            </button>
          </div>

          {/* Key Advantages Card */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                <Headphones className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ব্যাকগ্রাউন্ড অডিও' : 'Background Audio'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'স্ক্রিন লক বা অন্য অ্যাপে গেলেও নিরবচ্ছিন্ন গান চলে।' : 'Audio keeps playing when screen is locked or switching apps.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অফলাইন ক্যাশ' : 'Real Offline Mode'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'bn' ? 'ইন্টারনেট ছাড়াও ক্যাশ করা গান যেকোনো সময় শুনুন।' : 'Enjoy cached songs anytime without consuming internet.'}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="relative z-10 px-6 py-4 border-t border-white/10 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verified Android WebAPK Standards Compliant
          </span>
          <button
            onClick={() => setIsInstallModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
