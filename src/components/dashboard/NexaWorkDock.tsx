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

  const employeeDockItems = [
    {
      id: 'clock',
      title: isCheckedIn ? 'Clock Out' : 'Clock In',
      icon: (
        <Clock
          className={`h-full w-full ${
            isCheckedIn ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'
          }`}
        />
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
      icon: <CalendarDays className="h-full w-full text-blue-600 dark:text-blue-400" />,
      onClick: () => setCurrentView('emp-leave'),
      active: currentView === 'emp-leave',
    },
    {
      id: 'emp-payslips',
      title: 'My Payslips',
      icon: <FileText className="h-full w-full text-purple-600 dark:text-purple-400" />,
      onClick: () => setCurrentView('emp-payslips'),
      active: currentView === 'emp-payslips',
    },
    {
      id: 'emp-profile',
      title: 'My Profile',
      icon: <User className="h-full w-full text-indigo-600 dark:text-indigo-400" />,
      onClick: () => setCurrentView('emp-profile'),
      active: currentView === 'emp-profile',
    },
    {
      id: 'copilot',
      title: 'AI Copilot',
      icon: <Sparkles className="h-full w-full text-[#006837] animate-pulse" />,
      onClick: () => setIsCopilotOpen(true),
      active: false,
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      icon: <Smartphone className="h-full w-full text-teal-600 dark:text-teal-400" />,
      onClick: () => showToast('NexaWork Mobile App download link sent to your device!', 'info'),
      active: false,
    },
    {
      id: 'emp-settings',
      title: 'Settings',
      icon: <Settings className="h-full w-full text-gray-600 dark:text-gray-400" />,
      onClick: () => setCurrentView('emp-settings'),
      active: currentView === 'emp-settings',
    },
  ];

  const adminDockItems = [
    {
      id: 'admin-dashboard',
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-full w-full text-[#006837] dark:text-emerald-400" />,
      onClick: () => setCurrentView('admin-dashboard'),
      active: currentView === 'admin-dashboard',
    },
    {
      id: 'admin-attendance',
      title: 'Attendance Logs',
      icon: <Clock className="h-full w-full text-amber-600 dark:text-amber-400" />,
      onClick: () => setCurrentView('admin-attendance'),
      active: currentView === 'admin-attendance',
    },
    {
      id: 'admin-leave-requests',
      title: 'Leave Requests',
      icon: <CalendarDays className="h-full w-full text-blue-600 dark:text-blue-400" />,
      onClick: () => setCurrentView('admin-leave-requests'),
      active: currentView === 'admin-leave-requests',
    },
    {
      id: 'admin-payroll',
      title: 'Run Payroll',
      icon: <DollarSign className="h-full w-full text-emerald-600 dark:text-emerald-400" />,
      onClick: () => setCurrentView('admin-payroll'),
      active: currentView === 'admin-payroll',
    },
    {
      id: 'admin-employees',
      title: 'Employee Directory',
      icon: <Users className="h-full w-full text-indigo-600 dark:text-indigo-400" />,
      onClick: () => setCurrentView('admin-employees'),
      active: currentView === 'admin-employees',
    },
    {
      id: 'admin-recruitment',
      title: 'Recruitment Board',
      icon: <UserCheck className="h-full w-full text-cyan-600 dark:text-cyan-400" />,
      onClick: () => setCurrentView('admin-recruitment'),
      active: currentView === 'admin-recruitment',
    },
    {
      id: 'copilot',
      title: 'AI HR Copilot',
      icon: <Sparkles className="h-full w-full text-[#006837] animate-pulse" />,
      onClick: () => setIsCopilotOpen(true),
      active: false,
    },
    {
      id: 'admin-settings',
      title: 'Admin Settings',
      icon: <Settings className="h-full w-full text-gray-600 dark:text-gray-400" />,
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
        panelHeight={52}
        spring={{ mass: 0.1, stiffness: 320, damping: 20 }}
        className="items-center"
      >
        {dockItems.map((item) => (
          <DockItem
            key={item.id}
            onClick={item.onClick}
            className={`aspect-square rounded-xl transition-colors ${
              item.active
                ? 'bg-emerald-100/90 border border-[#006837]/40 dark:bg-emerald-950/60'
                : 'bg-gray-100/90 hover:bg-emerald-50 dark:bg-neutral-800 dark:hover:bg-neutral-700'
            }`}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
};
