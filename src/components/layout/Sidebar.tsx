import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  Smartphone,
} from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';
import { NexaWorkLogo } from './NexaWorkLogo';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, logout, showToast, currentUser } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const mainNavItems = [
    {
      id: isAdmin ? 'admin-dashboard' : 'emp-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: isAdmin ? 'admin-attendance' : 'emp-attendance',
      label: 'Tasks',
      icon: CheckSquare,
      badge: '12+',
    },
    {
      id: isAdmin ? 'admin-leave-requests' : 'emp-leave',
      label: 'Calendar',
      icon: Calendar,
      badge: null,
    },
    {
      id: isAdmin ? 'admin-payroll' : 'emp-payslips',
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: isAdmin ? 'admin-employees' : 'emp-profile',
      label: 'Team',
      icon: Users,
      badge: null,
    },
  ];

  const generalNavItems = [
    {
      id: isAdmin ? 'admin-settings' : 'emp-settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between shrink-0 h-screen sticky top-0 p-5 select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Official NexaWork Logo */}
        <div
          className="cursor-pointer pt-1 pb-2"
          onClick={() => setCurrentView(isAdmin ? 'admin-dashboard' : 'emp-dashboard')}
        >
          <NexaWorkLogo size="md" showTagline={true} />
        </div>

        {/* MENU Group */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3">
            Menu
          </span>

          <nav className="mt-2 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer relative ${
                    isActive
                      ? 'bg-emerald-50 text-[#006837] font-bold shadow-2xs'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#006837] rounded-r-full" />
                  )}

                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#006837]' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="bg-[#006837] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* GENERAL Group */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3">
            General
          </span>

          <nav className="mt-2 space-y-1">
            {generalNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'help') {
                      showToast('Connecting to NexaWork 24/7 Enterprise Support...', 'info');
                    } else {
                      setCurrentView(item.id as any);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-[#006837] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Download Mobile App Bottom Banner Card (Matching Screenshot) */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#0A3B24] via-[#072C1B] to-[#041A10] p-4 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-white">Download our Mobile App</span>
        </div>

        <p className="text-[11px] text-emerald-200/70 mb-3 leading-tight">
          Get easy in another way
        </p>

        <button
          onClick={() => showToast('Redirecting to App Store & Google Play download link...', 'info')}
          className="w-full py-2 bg-[#34D399] hover:bg-[#22C55E] text-[#052416] font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
        >
          Download
        </button>
      </div>
    </aside>
  );
};
