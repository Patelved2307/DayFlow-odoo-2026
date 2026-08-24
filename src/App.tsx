/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from './lib/context/AppContext';
import { PageShell } from './components/layout/PageShell';

// Public Pages
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { EmployeeDirectoryPage } from './pages/admin/EmployeeDirectoryPage';
import { EmployeeProfilePage as AdminEmployeeProfilePage } from './pages/admin/EmployeeProfilePage';
import { AttendanceRecordsPage } from './pages/admin/AttendanceRecordsPage';
import { LeaveRequestsPage } from './pages/admin/LeaveRequestsPage';
import { PayrollOverviewPage } from './pages/admin/PayrollOverviewPage';
import { InterviewBoardPage } from './pages/admin/InterviewBoardPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Employee Pages
import { EmployeeDashboardPage } from './pages/employee/EmployeeDashboardPage';
import { EmployeeProfilePage } from './pages/employee/EmployeeProfilePage';
import { PersonalAttendancePage } from './pages/employee/PersonalAttendancePage';
import { LeaveTimeOffPage } from './pages/employee/LeaveTimeOffPage';
import { PayslipPage } from './pages/employee/PayslipPage';
import { EmployeeSettingsPage } from './pages/employee/EmployeeSettingsPage';

export default function App() {
  const { currentView, currentUser } = useApp();

  const isAdmin = currentUser?.role === 'admin';
  const isEmployee = currentUser?.role === 'employee';

  // Public Full-Page Views
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'auth') {
    return <AuthPage />;
  }

  // Render Role-Based Pages inside PageShell with strict RBAC Guards
  const renderAppContent = () => {
    // RBAC Guard 1: Employees cannot access admin views
    if (isEmployee && currentView.startsWith('admin-')) {
      return <EmployeeDashboardPage />;
    }

    // RBAC Guard 2: Admins cannot access employee views
    if (isAdmin && currentView.startsWith('emp-')) {
      return <AdminDashboardPage />;
    }

    switch (currentView) {
      // Admin Views (Visible strictly to HR Admins)
      case 'admin-dashboard':
        return <AdminDashboardPage />;
      case 'admin-employees':
        return <EmployeeDirectoryPage />;
      case 'admin-employee-profile':
        return <AdminEmployeeProfilePage />;
      case 'admin-attendance':
        return <AttendanceRecordsPage />;
      case 'admin-leave-requests':
        return <LeaveRequestsPage />;
      case 'admin-payroll':
        return <PayrollOverviewPage />;
      case 'admin-recruitment':
        return <InterviewBoardPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;

      // Employee Views (Visible strictly to Staff)
      case 'emp-dashboard':
        return <EmployeeDashboardPage />;
      case 'emp-profile':
        return <EmployeeProfilePage />;
      case 'emp-attendance':
        return <PersonalAttendancePage />;
      case 'emp-leave':
        return <LeaveTimeOffPage />;
      case 'emp-payslips':
        return <PayslipPage />;
      case 'emp-settings':
        return <EmployeeSettingsPage />;

      default:
        return isAdmin ? <AdminDashboardPage /> : <EmployeeDashboardPage />;
    }
  };

  return <PageShell>{renderAppContent()}</PageShell>;
}
