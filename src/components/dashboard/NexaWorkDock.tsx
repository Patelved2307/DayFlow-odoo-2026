import React from 'react';
import {
  Clock,
  CalendarDays,
  FileText,
  User,
  Sparkles,
  Smartphone,
  Settings,
  LayoutDashboard,
  DollarSign,
  Users,
  UserCheck,
} from 'lucide-react';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { useApp } from '../../lib/context/AppContext';

export const NexaWorkDock: React.FC = () => {
  const {
    currentUser,
    currentView,
    setCurrentView,
    isCheckedIn,
    checkIn,
    checkOut,
    setIsCopilotOpen,
    showToast,
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Cohesive Theme Icon Color Helper
  const getIconColor = (isActive: boolean, specialType?: 'clock' | 'copilot') => {
    if (isActive) return 'text-white';
    if (specialType === 'clock') {
      return isCheckedIn ? 'text-[#1F6D4D] dark:text-[#7EC9A0]' : 'text-amber-500 dark:text-amber-400';
    }
    if (specialType === 'copilot') {
      return 'text-[#1F6D4D] dark:text-[#7EC9A0] animate-pulse';
    }
    return 'text-[#1F6D4D] dark:text-[#7EC9A0]';
  };

  const employeeDockItems = [
    {
      id: 'clock',
      title: isCheckedIn ? 'Clock Out' : 'Clock In',
      icon: (isActive: boolean) => (
        <Clock className={`h-full w-full transition-colors ${getIconColor(isActive, 'clock')}`} />
      ),
      onClick: () => {
        if (isCheckedIn) {
          checkOut();
        } else {
          checkIn();
        }
      },
      active: false,
    },
    {
      id: 'emp-leave',
      title: 'Apply Leave',
      icon: (isActive: boolean) => (
        <CalendarDays className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('emp-leave'),
      active: currentView === 'emp-leave',
    },
    {
      id: 'emp-payslips',
      title: 'My Payslips',
      icon: (isActive: boolean) => (
        <FileText className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('emp-payslips'),
      active: currentView === 'emp-payslips',
    },
    {
      id: 'emp-profile',
      title: 'My Profile',
      icon: (isActive: boolean) => (
        <User className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('emp-profile'),
      active: currentView === 'emp-profile',
    },
    {
      id: 'copilot',
      title: 'AI HR Copilot',
      icon: (isActive: boolean) => (
        <Sparkles className={`h-full w-full transition-colors ${getIconColor(isActive, 'copilot')}`} />
      ),
      onClick: () => setIsCopilotOpen(true),
      active: false,
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      icon: (isActive: boolean) => (
        <Smartphone className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => showToast('NexaWork Mobile App download link sent to your device!', 'info'),
      active: false,
    },
    {
      id: 'emp-settings',
      title: 'Settings',
      icon: (isActive: boolean) => (
        <Settings className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('emp-settings'),
      active: currentView === 'emp-settings',
    },
  ];

  const adminDockItems = [
    {
      id: 'admin-dashboard',
      title: 'Dashboard',
      icon: (isActive: boolean) => (
        <LayoutDashboard className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-dashboard'),
      active: currentView === 'admin-dashboard',
    },
    {
      id: 'admin-attendance',
      title: 'Attendance Logs',
      icon: (isActive: boolean) => (
        <Clock className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-attendance'),
      active: currentView === 'admin-attendance',
    },
    {
      id: 'admin-leave-requests',
      title: 'Leave Requests',
      icon: (isActive: boolean) => (
        <CalendarDays className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-leave-requests'),
      active: currentView === 'admin-leave-requests',
    },
    {
      id: 'admin-payroll',
      title: 'Run Payroll',
      icon: (isActive: boolean) => (
        <DollarSign className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-payroll'),
      active: currentView === 'admin-payroll',
    },
    {
      id: 'admin-employees',
      title: 'Employee Directory',
      icon: (isActive: boolean) => (
        <Users className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-employees'),
      active: currentView === 'admin-employees',
    },
    {
      id: 'admin-recruitment',
      title: 'Recruitment Board',
      icon: (isActive: boolean) => (
        <UserCheck className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-recruitment'),
      active: currentView === 'admin-recruitment',
    },
    {
      id: 'copilot',
      title: 'AI HR Copilot',
      icon: (isActive: boolean) => (
        <Sparkles className={`h-full w-full transition-colors ${getIconColor(isActive, 'copilot')}`} />
      ),
      onClick: () => setIsCopilotOpen(true),
      active: false,
    },
    {
      id: 'admin-settings',
      title: 'Admin Settings',
      icon: (isActive: boolean) => (
        <Settings className={`h-full w-full transition-colors ${getIconColor(isActive)}`} />
      ),
      onClick: () => setCurrentView('admin-settings'),
      active: currentView === 'admin-settings',
    },
  ];

  const dockItems = isAdmin ? adminDockItems : employeeDockItems;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-full px-2 pointer-events-auto">
      <Dock
        distance={120}
        magnification={64}
        panelHeight={54}
        spring={{ mass: 0.1, stiffness: 320, damping: 20 }}
        className="items-center"
      >
        {dockItems.map((item) => (
          <DockItem
            key={item.id}
            onClick={item.onClick}
            className={`aspect-square rounded-xl transition-all duration-200 relative flex items-center justify-center ${
              item.active
                ? 'bg-gradient-to-br from-[#1F6D4D] to-[#144933] text-white shadow-lg shadow-[#1F6D4D]/25 border border-[#7EC9A0]/40 ring-2 ring-[#7EC9A0]/30'
                : 'bg-[#EBF5F0]/80 hover:bg-[#7EC9A0]/25 text-[#1F6D4D] dark:bg-[#144933]/50 dark:hover:bg-[#1F6D4D]/60 dark:text-[#7EC9A0] border border-[#1F6D4D]/10 dark:border-[#7EC9A0]/20'
            }`}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon(item.active)}</DockIcon>
            {item.active && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#7EC9A0] shadow-sm shadow-[#7EC9A0]" />
            )}
          </DockItem>
        ))}
      </Dock>
    </div>
  );
};

