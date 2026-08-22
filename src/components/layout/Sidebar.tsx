import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  DollarSign,
  FileText,
  Users,
  UserCheck,
  User,
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

  const mainNavItems = isAdmin
    ? [
        {
          id: 'admin-dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'admin-attendance',
          label: 'Attendance Logs',
          icon: Clock,
          badge: '12+',
        },
        {
          id: 'admin-leave-requests',
          label: 'Leave Requests',
          icon: CalendarDays,
          badge: null,
        },
        {
          id: 'admin-payroll',
          label: 'Payroll Overview',
          icon: DollarSign,
          badge: null,
        },
        {
          id: 'admin-employees',
          label: 'Employee Directory',
          icon: Users,
          badge: null,
        },
      ]
    : [
        {
          id: 'emp-dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          badge: null,
        },
        {
          id: 'emp-attendance',
          label: 'My Attendance',
          icon: Clock,
          badge: null,
        },
        {
          id: 'emp-leave',
          label: 'Leave & Time-Off',
          icon: CalendarDays,
          badge: null,
        },
        {
          id: 'emp-payslips',
          label: 'My Payslips',
          icon: FileText,
          badge: null,
        },
        {
          id: 'emp-profile',
          label: 'My Profile',
          icon: User,
          badge: null,
        },
      ];

  const generalNavItems = [
    ...(isAdmin
      ? [
          {
            id: 'admin-recruitment',
            label: 'Recruitment Board',
            icon: UserCheck,
          },
        ]
      : []),
    {
      id: isAdmin ? 'admin-settings' : 'emp-settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'help',
      label: 'Help & Docs',
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-[#006837] font-bold shadow-2xs border-l-4 border-[#006837]'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1C1F1E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#006837]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="rounded-full bg-[#006837] text-white px-2 py-0.5 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* GENERAL Group */}
        <div className="space-y-1">
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
                      showToast('Opening NexaWork Documentation & Help Center...', 'info');
                    } else {
                      setCurrentView(item.id as any);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-[#006837] font-bold border-l-4 border-[#006837]'
                      : 'text-[#6B7280] hover:bg-gray-50 hover:text-[#1C1F1E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#006837]' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Logout Action */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Download Mobile App Card matching reference screenshot */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="rounded-2xl bg-gradient-to-br from-[#006837] to-[#0A7C46] p-4 text-white shadow-sm space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="font-bold text-xs">Download App</div>
              <div className="text-[10px] text-emerald-100/80">iOS & Android Sync</div>
            </div>
          </div>
          <p className="text-[11px] text-emerald-100/90 leading-tight">
            Log attendance, request leaves, and view payslips on the go.
          </p>
          <button
            onClick={() => showToast('Redirecting to App Store & Google Play...', 'info')}
            className="w-full py-1.5 rounded-xl bg-white text-[#006837] hover:bg-gray-100 text-[11px] font-bold transition-all cursor-pointer"
          >
            Get Mobile App
          </button>
        </div>
      </div>
    </aside>
  );
};
