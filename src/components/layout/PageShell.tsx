import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { AICopilotModal } from './AICopilotModal';
import { NexaWorkDock } from '../dashboard/NexaWorkDock';
import { useApp } from '../../lib/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen bg-[#F4F6F5] flex font-sans relative pb-20">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />

        {/* Content View Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 pb-12">
          {children}
        </main>
      </div>

      {/* Interactive Apple-Style NexaWork Dock */}
      <NexaWorkDock />

      {/* Global AI Copilot */}
      <AICopilotModal />

      {/* Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-lg border animate-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#1F6D4D] text-white border-[#1F6D4D]'
                : toast.type === 'warning'
                ? 'bg-[#FEF6EC] text-[#F2994A] border-[#F2994A]/30'
                : toast.type === 'error'
                ? 'bg-[#FDEEEE] text-[#E5484D] border-[#E5484D]/30'
                : 'bg-gray-900 text-white border-gray-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#7EC9A0]" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#F2994A]" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#E5484D]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-300" />}

            <span className="leading-snug">{toast.message}</span>

            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-current opacity-70 hover:opacity-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
