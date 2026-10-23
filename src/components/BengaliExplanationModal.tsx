import React from 'react';
import { X, Sparkles, BookOpen, Layers, Shield, Wifi, Music } from 'lucide-react';

interface BengaliExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BengaliExplanationModal: React.FC<BengaliExplanationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[88vh] rounded-3xl glass-panel border border-purple-500/30 shadow-2xl p-6 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300">
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                স্মার্ট শুভ বিটস (Smart Subha Beats) — স্থাপত্য ও ফিচার বিবরণ
              </h3>
              <p className="text-xs text-purple-300">
                হাই-কোয়ালিটি অডিও স্ট্রিমিং ও ক্রস-ডিভাইস সিঙ্ক আর্কিটেকচার
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bengali Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-200 text-sm leading-relaxed">
          
          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              ১. মূল উদ্দেশ্য ও অ্যাপ্লিকেশন মেল্ড (Application Meld)
            </h4>
            <p className="text-xs text-slate-300">
              <strong>Smart Subha Beats</strong> একটি নেক্সট-লেভেল অডিও অ্যাপ্লিকেশন যা সরাসরি YouTube থেকে রিয়েল-টাইমে হাই-ফিডেলিটি অডিও স্ট্রিম করে। Aceternity UI, Animaster এবং Skipper UI-এর আধুনিক গ্লাস-মরফিক ডার্ক থিম, নিয়ন গ্লো এবং রিয়েল-টাইম ফ্রিকোয়েন্সি ভিজ্যুয়ালাইজার দিয়ে এটি তৈরি করা হয়েছে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              ২. মাস্টার অ্যাডমিন পোর্টাল (পাসকোড: <code className="text-amber-300 font-mono">SUBHA ADMIN 420</code>)
            </h4>
            <p className="text-xs text-slate-300">
              আপনি নির্দিষ্ট পাসকোড <strong>SUBHA ADMIN 420</strong> দিয়ে অ্যাপের মাস্টার অ্যাডমিন মোড আনলক করতে পারবেন। অ্যাডমিন মোডে যেকোনো নতুন ইউটিউব ভিডিও বা প্লেলিস্ট লিংক কিউরেটেড ট্র্যাক হিসেবে যুক্ত করা যায়, যা <strong>সকল ডিভাইসে স্বয়ংক্রিয়ভাবে সিঙ্ক</strong> (Global Cross-Device Sync) হয়ে যায়।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <Wifi className="w-4 h-4 text-emerald-400" />
              ৩. অফলাইন প্লেলিস্ট সিনক্রোনাইজেশন (IndexedDB Engine)
            </h4>
            <p className="text-xs text-slate-300">
              ব্রাউজারের আধুনিক <strong>IndexedDB</strong> প্রযুক্তির মাধ্যমে আপনার পছন্দের গান ও প্লেলিস্ট অফলাইনে ক্যাশ করে রাখা যায়। ইন্টারনেট সংযোগ না থাকলেও 'Offline Library' থেকে গান শোনা ও প্লেলিস্ট অ্যাক্সেস করা যাবে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              ৪. রিয়েল জিমেইল / গুগল অথেন্টিকেশন
            </h4>
            <p className="text-xs text-slate-300">
              Firebase Auth ও Google Sign-In এর মাধ্যমে আপনার জিমেইল অ্যাকাউন্ট দিয়ে সরাসরি লগইন করা যায়। এর ফলে আপনার ফেভারিট লিস্ট, রিসেন্ট গান এবং ব্যক্তিগত প্লেলিস্ট ক্লাউডে সংরক্ষিত থাকে।
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white flex items-center gap-2 mb-1.5">
              <Music className="w-4 h-4 text-indigo-400" />
              ৫. হাই-কোয়ালিটি স্টুডিও প্লেয়ার ও ইকুয়ালাইজার
            </h4>
            <p className="text-xs text-slate-300">
              ৩২০kbps Ultra HD ও ২৫৬kbps HQ অডিও মোড, স্পিনিং ভিনাইল ডিস্ক আর্ট, ক্যানভাস স্পেকট্রাম ভিজ্যুয়ালাইজার এবং ৬টি টিউনড ইকুয়ালাইজার প্রিসেট (Bass Boost, Electronic, Vocal, Acoustic, Rock, Flat) অন্তর্ভুক্ত।
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
          >
            অ্যাপ্লিকেশন শুরু করুন (Start App)
          </button>
        </div>

      </div>
    </div>
  );
};
