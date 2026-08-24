import React, { useState } from 'react';
import { Search, Bell, Mail, Command, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';
import { EmailPreviewModal } from '../common/EmailPreviewModal';

export const Topbar: React.FC = () => {
  const { currentUser, switchRole, showToast, setIsCopilotOpen } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const userName = currentUser?.name || 'Totok Michael';
  const userEmail = currentUser?.email || 'tmichael20@mail.com';
  const userAvatar =
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-6 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
        {/* Left: Pill Search Bar matching screenshot */}
        <div className="relative flex-1 max-w-md">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search task..."
              className="w-full pl-10 pr-12 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006837]/30 focus:border-[#006837] transition-all"
            />
            <div className="absolute right-3 flex items-center gap-0.5 text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200 shadow-2xs">
              <Command className="w-2.5 h-2.5" />
              <span>F</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons & Profile Info */}
        <div className="flex items-center gap-3 shrink-0">
          {/* AI Copilot Button */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-[#006837] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#006837]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          {/* Mail / Dispatched Email Drawer Trigger */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="View Dispatched HTML Emails Log"
          >
            <Mail className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#006837] rounded-full ring-2 ring-white" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => showToast('No unread notifications', 'info')}
            className="relative p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile Pill matching screenshot */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <img
              src={userAvatar}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-2xs"
              referrerPolicy="no-referrer"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-[#1C1F1E] leading-snug">{userName}</span>
              <span className="text-[11px] text-gray-400 leading-none">{userEmail}</span>
            </div>

            {/* RBAC Role Indicator Badge */}
            <span
              className={`ml-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                currentUser?.role === 'admin'
                  ? 'text-[#006837] bg-emerald-50 border-emerald-200'
                  : 'text-blue-700 bg-blue-50 border-blue-200'
              }`}
            >
              {currentUser?.role === 'admin' ? 'HR Administrator' : 'Employee Staff'}
            </span>
          </div>
        </div>
      </header>

      {/* Dispatched Emails Viewer Drawer Modal */}
      <EmailPreviewModal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />
    </>
  );
};
