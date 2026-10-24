import React from 'react';
import { 
  ArrowLeft, 
  Palette, 
  PlayCircle, 
  Globe, 
  Languages, 
  Navigation, 
  ShieldCheck, 
  ChevronRight,
  Headphones,
  Sparkles
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppearance: () => void;
  onOpenAdmin: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onOpenAppearance,
  onOpenAdmin,
}) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050608] text-slate-100 overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-200 pb-36">
      
      {/* Top Header Bar matching Screenshot 3 */}
      <header className="sticky top-0 z-10 flex items-center gap-4 px-5 py-4 bg-[#050608]/90 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
          title="Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="font-heading font-black text-2xl text-white tracking-tight">Settings</h1>
      </header>

      {/* Main Settings Grouped List */}
      <main className="max-w-xl mx-auto w-full px-5 py-6 space-y-7">
        
        {/* Interface Group matching Screenshot 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-[#8EB89B] tracking-wide px-1">Interface</h2>
          <div 
            onClick={onOpenAppearance}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <Palette className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Appearance</p>
                <p className="text-xs text-slate-400">Current Theme: {theme.name}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </section>

        {/* Player & Content Group matching Screenshot 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-[#8EB89B] tracking-wide px-1">Player & Content</h2>
          <div className="space-y-2">
            
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                  <PlayCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Player and audio</p>
                  <p className="text-xs text-slate-400">320kbps YouTube HQ audio stream & background playback</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">Content</p>
                  <p className="text-xs text-slate-400">Bangla, Hindi, Bollywood & Lo-Fi curated libraries</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                  <Languages className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">AI lyrics translation</p>
                  <p className="text-xs text-slate-400">Bengali & English synced lyric engine</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </div>

          </div>
        </section>

        {/* Android Auto Group matching Screenshot 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-[#8EB89B] tracking-wide px-1">Android Auto</h2>
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <Navigation className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Android Auto</p>
                <p className="text-xs text-slate-400">In-car dashboard & steering wheel control support</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </section>

        {/* Privacy & Security Group matching Screenshot 3 */}
        <section className="space-y-2.5">
          <h2 className="text-sm font-semibold text-[#8EB89B] tracking-wide px-1">Privacy & Security</h2>
          <div 
            onClick={onOpenAdmin}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#141814] hover:bg-[#1B221B] border border-white/5 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">Master Admin Security</p>
                <p className="text-xs text-slate-400">Passcode authentication for library management</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </div>
        </section>

      </main>

    </div>
  );
};
