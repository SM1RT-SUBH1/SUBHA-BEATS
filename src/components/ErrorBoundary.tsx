import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Music } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside Smart Subha Beats:', error, errorInfo);
  }

  private handleReset = () => {
    // Clear any corrupted local state and reload cleanly
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="w-full max-w-md rounded-3xl glass-panel border border-rose-500/30 p-8 shadow-2xl shadow-rose-950/40 flex flex-col items-center">
            
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mb-5">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>

            <h2 className="font-heading font-black text-2xl text-white mb-2">
              Smart Subha Beats রিলোড করুন
            </h2>
            
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              অ্যাপটি চালু করতে একটি সাময়িক সমস্যা হয়েছে। নিচের বাটনে ক্লিক করে ফ্রেশ সেশনে রিলোড করুন।
            </p>

            <button
              onClick={this.handleReset}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
              <span>রিলোড করুন (Reload Beats)</span>
            </button>

            <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-500">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>Smart Subha Beats • All 271+ Songs Safe</span>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
