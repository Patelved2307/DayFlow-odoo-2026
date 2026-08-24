import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    console.error('[ErrorBoundary Caught Exception]:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A1A14] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#0B1E17] border border-emerald-900 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-bold border border-emerald-800">
              ⚡
            </div>
            
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-extrabold text-white">
                Workspace Session Restored
              </h1>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                An unexpected state collision occurred. Click reset to restore your clean workspace session.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/40 border border-emerald-950 text-left font-mono text-[11px] text-emerald-400 overflow-x-auto">
              {this.state.error?.message || 'Application rendering error'}
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-3 rounded-2xl bg-[#006837] hover:bg-[#05522C] text-white text-xs font-bold transition-all shadow-lg cursor-pointer"
            >
              Reset Session & Go to Landing Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
