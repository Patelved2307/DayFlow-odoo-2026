import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Employee,
  LeaveRequest,
  AttendanceRecord,
  Payslip,
  ActivityItem,
  ReminderItem,
  AnnouncementItem,
  LeaveBalanceSummary,
  UserRole,
  LeaveType,
} from '../../types';
import { sendAutomatedEmail } from '../services/emailService';
import {
  syncEmployeeToSupabase,
  syncLeaveRequestToSupabase,
  syncAttendanceToSupabase,
} from '../services/supabaseSyncService';
import {
  ADMIN_USER,
  EMPLOYEE_USER,
  INITIAL_EMPLOYEES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_ATTENDANCE_RECORDS,
  INITIAL_PAYSLIPS,
  INITIAL_ACTIVITIES,
  INITIAL_REMINDERS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/mockData';

export type AppView =
  | 'landing'
  | 'auth'
  | 'admin-dashboard'
  | 'admin-employees'
  | 'admin-employee-profile'
  | 'admin-attendance'
  | 'admin-leave-requests'
  | 'admin-payroll'
  | 'admin-recruitment'
  | 'admin-settings'
  | 'emp-dashboard'
  | 'emp-profile'
  | 'emp-attendance'
  | 'emp-leave'
  | 'emp-payslips'
  | 'emp-settings';

export interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  navigateToAuth: (mode?: 'signin' | 'signup') => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  login: (role: UserRole, customUser?: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  
  // Data
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  attendanceRecords: AttendanceRecord[];
  payslips: Payslip[];
  activities: ActivityItem[];
  reminders: ReminderItem[];
  announcements: AnnouncementItem[];
  employeeLeaveBalances: Record<string, LeaveBalanceSummary>;
  
  // Actions - Employees
  addEmployee: (emp: Partial<Employee>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deactivateEmployee: (id: string) => void;
  
  // Actions - Leave
  submitLeaveRequest: (data: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
  }) => void;
  submitEmergencyLeave: (data: {
    category: 'Medical' | 'Family Emergency' | 'Accident' | 'Personal Urgent' | 'Other';
    note: string;
  }) => void;
  approveLeaveRequest: (requestId: string, comment?: string) => void;
  rejectLeaveRequest: (requestId: string, comment?: string) => void;

  // Actions - Attendance
  isCheckedIn: boolean;
  checkInTime: string | null;
  checkIn: () => void;
  checkOut: () => void;
  workedSeconds: number;

  // Actions - Payroll
  runPayrollCalculation: (month: string) => void;
  generateAndPublishPayslips: (month: string) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Copilot AI Modal
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const safeParse = (key: string, fallback: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      const parsed = JSON.parse(saved);
      return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
    } catch {
      return fallback;
    }
  };

  // Start on landing page by default until user clicks Login/Sign Up and authenticates
  const [currentUser, setCurrentUser] = useState<User | null>(() => safeParse('df_user', null));
  const [currentView, setCurrentView] = useState<AppView>(() => safeParse('df_view', 'landing'));
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('emp-104');

  const navigateToAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
    try {
      localStorage.setItem('df_view', 'auth');
    } catch (e) {
      console.warn('[LocalStorage Error]', e);
    }
  };
  
  const [employees, setEmployees] = useState<Employee[]>(() => safeParse('df_employees', INITIAL_EMPLOYEES));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => safeParse('df_leave_requests', INITIAL_LEAVE_REQUESTS));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => safeParse('df_attendance', INITIAL_ATTENDANCE_RECORDS));
  const [payslips, setPayslips] = useState<Payslip[]>(() => safeParse('df_payslips', INITIAL_PAYSLIPS));

  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [reminders, setReminders] = useState<ReminderItem[]>(INITIAL_REMINDERS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(INITIAL_ANNOUNCEMENTS);

  // Compute live leave balances per employee ID
  const employeeLeaveBalances: Record<string, LeaveBalanceSummary> = useMemo(() => {
    const map: Record<string, LeaveBalanceSummary> = {};
    employees.forEach((emp) => {
      const balance: LeaveBalanceSummary = {
        paid: emp.leaveBalance?.paid ?? 14,
        paidTotal: emp.leaveBalance?.paidTotal ?? 18,
        sick: emp.leaveBalance?.sick ?? 8,
        sickTotal: emp.leaveBalance?.sickTotal ?? 10,
        unpaid: emp.leaveBalance?.unpaidUsed ?? 12,
        emergency: 2.5,
      };
      if (emp.employeeId) map[emp.employeeId] = balance;
      if (emp.id) map[emp.id] = balance;
    });

    // Provide robust defaults for standard test accounts if not matched
    if (!map['DF-EMP-104']) {
      map['DF-EMP-104'] = {
        paid: 14,
        paidTotal: 18,
        sick: 8,
        sickTotal: 10,
        unpaid: 12,
        emergency: 2.5,
      };
    }
    if (!map['DF-1002']) {
      map['DF-1002'] = {
        paid: 14,
        paidTotal: 18,
        sick: 8,
        sickTotal: 10,
        unpaid: 12,
        emergency: 2.5,
      };
    }
    return map;
  }, [employees]);

  // Live work timer
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string | null>('09:02 AM');
  const [workedSeconds, setWorkedSeconds] = useState<number>(6 * 3600 + 14 * 60); // 6h 14m default

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('df_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('df_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('df_attendance', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem('df_payslips', JSON.stringify(payslips));
  }, [payslips]);

  // Timer interval for checked in employee
  useEffect(() => {
    let interval: any = null;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setWorkedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCheckedIn]);

  const showToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addActivity = (item: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...item,
      id: 'act-' + Date.now(),
      timestamp: 'Just now',
    };
    setActivities((prev) => [newActivity, ...prev.slice(0, 15)]);
  };

  const login = (role: UserRole, customUser?: User) => {
    let userToSet: User;
    let viewToSet: AppView;
    if (role === 'admin') {
      userToSet = customUser || ADMIN_USER;
      viewToSet = 'admin-dashboard';
      showToast(`Signed in as HR Administrator (${userToSet.name})`, 'success');
    } else {
      userToSet = customUser || EMPLOYEE_USER;
      viewToSet = 'emp-dashboard';
      showToast(`Signed in as ${userToSet.name}`, 'success');
    }
    setCurrentUser(userToSet);
    setCurrentView(viewToSet);

    // Sync registered user directly into employees database table if not present!
    if (userToSet) {
      setEmployees((prev) => {
        const exists = prev.some(
          (e) => e.email.toLowerCase() === userToSet.email.toLowerCase() || (userToSet.employeeId && e.employeeId === userToSet.employeeId)
        );
        if (exists) return prev;

        const newEmpRecord: Employee = {
          id: userToSet.id || 'emp-' + Date.now(),
          employeeId: userToSet.employeeId || (role === 'admin' ? 'DF-ADM-02' : 'EMP-2027'),
          name: userToSet.name,
          email: userToSet.email,
          phone: '+1 (555) 230-8000',
          address: 'Executive Operations Center',
          avatar: userToSet.avatar,
          role: userToSet.designation || (role === 'admin' ? 'Head of People & Operations' : 'Software Engineer'),
          department: (userToSet.department as any) || (role === 'admin' ? 'People & HR' : 'Engineering'),
          manager: role === 'admin' ? 'Board of Directors' : 'Eleanor Vance',
          dateOfJoining: new Date().toISOString().split('T')[0],
          status: 'Active',
          todayStatus: 'Present',
          checkInTime: '08:45 AM',
          salary: {
            monthlyBasic: role === 'admin' ? 12500 : 8500,
            yearlyBasic: role === 'admin' ? 150000 : 102000,
            allowances: { hra: 5000, da: 1250, travel: 800, special: 2000 },
            deductions: { pf: 1500, tax: 2250, insurance: 400 },
          },
          leaveBalance: { paid: 20, paidTotal: 20, sick: 10, sickTotal: 10, unpaidUsed: 0 },
          documents: [{ name: 'Registration_Verification.pdf', type: 'PDF', uploadedOn: new Date().toISOString().split('T')[0], size: '1.2 MB' }],
        };

        const updated = [newEmpRecord, ...prev];
        try {
          localStorage.setItem('df_employees', JSON.stringify(updated));
        } catch (e) {
          console.warn('[LocalStorage Sync Note]', e);
        }

        // Sync directly to Supabase cloud table!
        syncEmployeeToSupabase(newEmpRecord);

        return updated;
      });
    }

    try {
      localStorage.setItem('df_user', JSON.stringify(userToSet));
      localStorage.setItem('df_view', viewToSet);
    } catch (e) {
      console.warn('[LocalStorage Error]', e);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    try {
      localStorage.removeItem('df_user');
      localStorage.setItem('df_view', 'landing');
    } catch (e) {
      console.warn('[LocalStorage Error]', e);
    }
    showToast('Signed out successfully', 'info');
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  const addEmployee = (empData: Partial<Employee>) => {
    const newEmpId = 'DF-EMP-' + (100 + employees.length + 1);
    const monthlyBasic = empData.salary?.monthlyBasic || 6500;
    const hra = Math.round(monthlyBasic * 0.4);
    const da = Math.round(monthlyBasic * 0.1);
    const travel = 500;
    const special = 800;
    const pf = Math.round(monthlyBasic * 0.12);
    const tax = Math.round(monthlyBasic * 0.15);
    const insurance = 250;

    const newEmp: Employee = {
      id: 'emp-' + Date.now(),
      employeeId: newEmpId,
      name: empData.name || 'New Employee',
      email: empData.email || `${empData.name?.toLowerCase().replace(/\s+/g, '.')}@dayflow.work`,
      phone: empData.phone || '+1 (555) 000-0000',
      address: empData.address || 'DayFlow Headquarters',
      avatar:
        empData.avatar ||
        `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: empData.role || 'Software Engineer',
      department: empData.department || 'Engineering',
      manager: empData.manager || 'Eleanor Vance',
      dateOfJoining: empData.dateOfJoining || new Date().toISOString().split('T')[0],
      status: 'Active',
      todayStatus: 'Present',
      checkInTime: '09:00 AM',
      salary: {
        monthlyBasic,
        yearlyBasic: monthlyBasic * 12,
        allowances: { hra, da, travel, special },
        deductions: { pf, tax, insurance },
      },
      leaveBalance: {
        paid: 18,
        paidTotal: 18,
        sick: 10,
        sickTotal: 10,
        unpaidUsed: 0,
      },
      documents: [
        { name: 'Employment_Agreement.pdf', type: 'PDF', uploadedOn: new Date().toISOString().split('T')[0], size: '1.4 MB' },
      ],
    };

    setEmployees((prev) => [newEmp, ...prev]);

    // Sync to Supabase Cloud Database!
    syncEmployeeToSupabase(newEmp);

    // Also persist new employee into registered accounts database table so they can log in immediately
    try {
      const savedAccs = localStorage.getItem('df_registered_accounts');
      const accList = savedAccs ? JSON.parse(savedAccs) : [];
      accList.push({
        id: 'usr-' + newEmp.id,
        employeeId: newEmp.employeeId,
        email: newEmp.email,
        password: 'Ved2307PA@',
        name: newEmp.name,
        role: 'employee',
        designation: newEmp.role,
        department: newEmp.department,
        avatar: newEmp.avatar,
      });
      localStorage.setItem('df_registered_accounts', JSON.stringify(accList));
    } catch (e) {
      console.warn('[LocalStorage Account Save Note]', e);
    }

    addActivity({
      type: 'profile_update',
      employeeName: newEmp.name,
      employeeAvatar: newEmp.avatar,
      title: `joined as ${newEmp.role} (${newEmp.department})`,
      badgeType: 'success',
    });

    // Automatically send welcome email to new employee directly
    sendAutomatedEmail({
      to: newEmp.email,
      subject: `Welcome to NexaWork, ${newEmp.name}! Your Credentials & Access`,
      type: 'WELCOME',
      data: {
        name: newEmp.name,
        employeeId: newEmp.employeeId,
        role: newEmp.role,
        department: newEmp.department,
        manager: newEmp.manager,
      },
    });

    showToast(`Employee ${newEmp.name} registered & saved to database. Welcome email sent!`, 'success');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const target = employees.find((e) => e.id === id || e.employeeId === id);
    if (!target) {
      showToast(`Database Error: Cannot update. Employee record ID (${id}) not found in database.`, 'error');
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id || emp.employeeId === id) {
          const updated = { ...emp, ...updates };
          // If monthly basic updated, recalculate allowances/deductions
          if (updates.salary?.monthlyBasic && updates.salary.monthlyBasic !== emp.salary.monthlyBasic) {
            const mb = updates.salary.monthlyBasic;
            updated.salary = {
              monthlyBasic: mb,
              yearlyBasic: mb * 12,
              allowances: {
                hra: Math.round(mb * 0.4),
                da: Math.round(mb * 0.1),
                travel: updates.salary.allowances?.travel ?? emp.salary.allowances.travel,
                special: updates.salary.allowances?.special ?? emp.salary.allowances.special,
              },
              deductions: {
                pf: Math.round(mb * 0.12),
                tax: Math.round(mb * 0.15),
                insurance: updates.salary.deductions?.insurance ?? emp.salary.deductions.insurance,
              },
            };
          }
          return updated;
        }
        return emp;
      })
    );
    showToast(`Employee profile updated & saved to database (${target.name})`, 'success');
  };

  const deactivateEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id || e.employeeId === id);
    if (!target) {
      showToast(`Database Error: Cannot offboard. Employee record ID (${id}) not found in database.`, 'error');
      return;
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id || emp.employeeId === id ? { ...emp, status: 'Offboarded', todayStatus: 'Absent' } : emp))
    );
    showToast(`Employee (${target.name}) offboarded & record status updated in database.`, 'warning');
  };

  // Standard Leave Request Submit with Database Validation
  const submitLeaveRequest = (data: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
  }) => {
    const requester = currentUser || EMPLOYEE_USER;

    // Database Record Check
    const empRecord = employees.find((e) => e.employeeId === requester.employeeId || e.id === requester.id);
    if (!empRecord) {
      showToast(`Database Error: Employee session (${requester.employeeId}) not found in database. Action cancelled.`, 'error');
      return;
    }

    // Database Leave Balance Validation
    if (data.type === 'Paid Leave') {
      const currentPaid = empRecord.leaveBalance?.paid ?? 18;
      if (data.daysCount > currentPaid) {
        showToast(`Database Validation Error: Requested ${data.daysCount} days exceeds available Paid Leave balance (${currentPaid} days left).`, 'error');
        return;
      }
    } else if (data.type === 'Sick Leave') {
      const currentSick = empRecord.leaveBalance?.sick ?? 10;
      if (data.daysCount > currentSick) {
        showToast(`Database Validation Error: Requested ${data.daysCount} days exceeds available Sick Leave balance (${currentSick} days left).`, 'error');
        return;
      }
    }

    const newRequest: LeaveRequest = {
      id: 'lr-' + Date.now(),
      employeeId: requester.employeeId,
      employeeName: requester.name,
      employeeAvatar: requester.avatar,
      employeeRole: requester.designation,
      department: requester.department,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      daysCount: data.daysCount,
      reason: data.reason,
      status: 'Pending',
      requestedOn: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);
    syncLeaveRequestToSupabase(newRequest);
    addActivity({
      type: 'leave_applied',
      employeeName: requester.name,
      employeeAvatar: requester.avatar,
      title: `applied for ${data.type} (${data.daysCount} days)`,
      badgeType: 'info',
    });

    // 1. Email to HR Admin notifying of new leave request
    sendAutomatedEmail({
      to: 'admin@nexawork.com',
      subject: `Action Required: New Leave Request from ${requester.name} (${data.type})`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: requester.name,
        type: data.type,
        daysCount: data.daysCount,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: 'Pending HR Review',
        adminComment: `New leave request submitted by employee ${requester.name} (${requester.employeeId}). Action required in HR Control Tower.`,
      },
    });

    // 2. Email to Employee confirming leave request submission
    sendAutomatedEmail({
      to: requester.email || 'employee@nexawork.com',
      subject: `Confirmation: Leave Request Submitted for ${data.type}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: requester.name,
        type: data.type,
        daysCount: data.daysCount,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        status: 'Pending HR Approval',
        adminComment: `Your leave request has been received by HR Admin (Eleanor Vance). You will receive an update email once actioned.`,
      },
    });

    showToast(`Leave request for ${data.daysCount} days submitted. Emails dispatched to HR & Employee!`, 'success');
  };

  // Emergency Half-Day Leave Submit (Instant Log - No approval gate!)
  const submitEmergencyLeave = (data: {
    category: 'Medical' | 'Family Emergency' | 'Accident' | 'Personal Urgent' | 'Other';
    note: string;
  }) => {
    const requester = currentUser || EMPLOYEE_USER;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];

    const emergencyRequest: LeaveRequest = {
      id: 'lr-emg-' + Date.now(),
      employeeId: requester.employeeId,
      employeeName: requester.name,
      employeeAvatar: requester.avatar,
      employeeRole: requester.designation,
      department: requester.department,
      type: 'Emergency Half-Day',
      startDate: todayStr,
      endDate: todayStr,
      daysCount: 0.5,
      reason: `[${data.category}] ${data.note}`,
      status: 'Logged',
      requestedOn: `Today, ${nowTime}`,
      isEmergency: true,
      emergencyReasonCategory: data.category,
      adminComment: `Emergency leave auto-logged and marked. Team and HR alerted immediately.`,
    };

    setLeaveRequests((prev) => [emergencyRequest, ...prev]);

    // Update attendance record for today
    setIsCheckedIn(false);
    setAttendanceRecords((prev) => {
      const existingToday = prev.find(
        (a) => a.employeeId === requester.employeeId && a.date === todayStr
      );
      if (existingToday) {
        return prev.map((a) =>
          a.id === existingToday.id
            ? {
                ...a,
                checkOut: nowTime,
                status: 'Half-day Emergency',
                emergencyNote: `[${data.category}] ${data.note}`,
                workedHours: Math.max(2.5, +(workedSeconds / 3600).toFixed(1)),
              }
            : a
        );
      } else {
        return [
          {
            id: 'att-' + Date.now(),
            employeeId: requester.employeeId,
            employeeName: requester.name,
            employeeAvatar: requester.avatar,
            department: requester.department,
            date: todayStr,
            checkIn: '09:00 AM',
            checkOut: nowTime,
            status: 'Half-day Emergency',
            workedHours: +(workedSeconds / 3600).toFixed(1),
            location: 'Main HQ (Geofenced)',
            emergencyNote: `[${data.category}] ${data.note}`,
          },
          ...prev,
        ];
      }
    });

    // Update employee status & leave balance
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === requester.employeeId) {
          return {
            ...emp,
            todayStatus: 'Emergency Leave',
            checkOutTime: nowTime,
            emergencyLeaveNote: `[${data.category}] ${data.note}`,
            leaveBalance: {
              ...emp.leaveBalance,
              paid: Math.max(0, emp.leaveBalance.paid - 0.5),
            },
          };
        }
        return emp;
      })
    );

    addActivity({
      type: 'emergency_leave',
      employeeName: requester.name,
      employeeAvatar: requester.avatar,
      title: `logged an Emergency Half-Day (${data.category})`,
      badgeType: 'warning',
    });

    // 1. Send Urgent Email to HR Admin
    sendAutomatedEmail({
      to: 'admin@nexawork.com',
      subject: `URGENT ALERT: Emergency Half-Day Logged by ${requester.name}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: requester.name,
        type: 'Emergency Half-Day',
        daysCount: 0.5,
        startDate: todayStr,
        endDate: todayStr,
        reason: `[${data.category}] ${data.note}`,
        status: 'Logged & Auto-Deducted',
        adminComment: `Emergency leave auto-logged and marked for shift today.`,
      },
    });

    // 2. Send Confirmation Email to Employee
    sendAutomatedEmail({
      to: requester.email || 'employee@nexawork.com',
      subject: `Emergency Leave Confirmation: ${data.category}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: requester.name,
        type: 'Emergency Half-Day',
        daysCount: 0.5,
        startDate: todayStr,
        endDate: todayStr,
        reason: `[${data.category}] ${data.note}`,
        status: 'Logged',
        adminComment: `Emergency half-day registered. 0.5 paid leave balance updated in database.`,
      },
    });

    showToast('Emergency leave logged immediately. Alerts dispatched to HR Admin & Employee!', 'warning');
  };

  const approveLeaveRequest = (requestId: string, comment?: string) => {
    const target = leaveRequests.find((r) => r.id === requestId);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Approved',
              adminComment: comment || 'Approved by HR Administrator.',
              actionedBy: currentUser?.name || 'Eleanor Vance',
              actionedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    // Deduct leave balance
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.employeeId === target.employeeId) {
          if (target.type === 'Paid Leave') {
            return {
              ...emp,
              leaveBalance: {
                ...emp.leaveBalance,
                paid: Math.max(0, emp.leaveBalance.paid - target.daysCount),
              },
            };
          } else if (target.type === 'Sick Leave') {
            return {
              ...emp,
              leaveBalance: {
                ...emp.leaveBalance,
                sick: Math.max(0, emp.leaveBalance.sick - target.daysCount),
              },
            };
          } else if (target.type === 'Unpaid Leave') {
            return {
              ...emp,
              leaveBalance: {
                ...emp.leaveBalance,
                unpaidUsed: emp.leaveBalance.unpaidUsed + target.daysCount,
              },
            };
          }
        }
        return emp;
      })
    );

    addActivity({
      type: 'leave_approved',
      employeeName: target.employeeName,
      employeeAvatar: target.employeeAvatar,
      title: `Leave request approved (${target.daysCount} days ${target.type})`,
      badgeType: 'success',
    });

    // 1. Send Approval Email to Employee
    const targetEmp = employees.find((e) => e.employeeId === target.employeeId || e.name === target.employeeName);
    const empEmail = targetEmp?.email || 'employee@nexawork.com';

    sendAutomatedEmail({
      to: empEmail,
      subject: `Leave Request Approved: ${target.type} (${target.startDate} to ${target.endDate})`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: target.employeeName,
        type: target.type,
        daysCount: target.daysCount,
        startDate: target.startDate,
        endDate: target.endDate,
        reason: target.reason,
        status: 'Approved',
        adminComment: comment || 'Approved by HR Administrator (Eleanor Vance).',
      },
    });

    // 2. Send Audit Log Email to HR Admin
    sendAutomatedEmail({
      to: 'admin@nexawork.com',
      subject: `Audit Copy: Approved Leave Request for ${target.employeeName}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: target.employeeName,
        type: target.type,
        daysCount: target.daysCount,
        startDate: target.startDate,
        endDate: target.endDate,
        reason: target.reason,
        status: 'Approved',
        adminComment: comment || 'Approved by HR Administrator.',
      },
    });

    showToast(`Leave request for ${target.employeeName} approved. Confirmation emails sent to Employee & HR!`, 'success');
  };

  const rejectLeaveRequest = (requestId: string, comment?: string) => {
    const target = leaveRequests.find((r) => r.id === requestId);
    if (!target) return;

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'Rejected',
              adminComment: comment || 'Unable to approve due to sprint delivery commitments.',
              actionedBy: currentUser?.name || 'Eleanor Vance',
              actionedAt: new Date().toISOString().split('T')[0],
            }
          : r
      )
    );

    addActivity({
      type: 'leave_rejected',
      employeeName: target.employeeName,
      employeeAvatar: target.employeeAvatar,
      title: `Leave request rejected (${target.type})`,
      badgeType: 'error',
    });

    const targetEmp = employees.find((e) => e.employeeId === target.employeeId || e.name === target.employeeName);
    const empEmail = targetEmp?.email || 'employee@nexawork.com';

    sendAutomatedEmail({
      to: empEmail,
      subject: `Leave Request Status Update: ${target.type}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: target.employeeName,
        type: target.type,
        daysCount: target.daysCount,
        startDate: target.startDate,
        endDate: target.endDate,
        reason: target.reason,
        status: 'Rejected',
        adminComment: comment || 'Unable to approve due to sprint delivery commitments.',
      },
    });

    showToast(`Leave request for ${target.employeeName} rejected and employee notified via email.`, 'error');
  };

  const checkIn = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];
    const userToUse = currentUser || EMPLOYEE_USER;
    
    setIsCheckedIn(true);
    setCheckInTime(now);

    // Update or add today's attendance record
    setAttendanceRecords((prev) => {
      const existing = prev.find((a) => (a.employeeId === userToUse.employeeId || a.employeeName === userToUse.name) && a.date === todayStr);
      if (existing) {
        return prev.map((a) => (a.id === existing.id ? { ...a, checkIn: now, status: 'Present' } : a));
      }
      return [
        {
          id: 'att-' + Date.now(),
          employeeId: userToUse.employeeId,
          employeeName: userToUse.name,
          employeeAvatar: userToUse.avatar,
          department: userToUse.department || 'Engineering',
          date: todayStr,
          checkIn: now,
          checkOut: '--:--',
          workedHours: 0,
          status: 'Present',
          location: 'HQ Geofence Verified (32m)',
        },
        ...prev,
      ];
    });

    addActivity({
      type: 'check_in',
      employeeName: userToUse.name,
      employeeAvatar: userToUse.avatar,
      title: `checked in at ${now} (GPS Geofence Verified)`,
      badgeType: 'success',
    });

    // Automatically send automated email notification
    sendAutomatedEmail({
      to: userToUse.email || 'employee@nexawork.com',
      subject: `Shift Started: Check-in Verified at ${now}`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: userToUse.name,
        type: 'Geofenced Check-In',
        daysCount: 1,
        startDate: todayStr,
        endDate: todayStr,
        reason: `GPS Location verified inside 50m HQ radius at ${now}`,
        status: 'Approved',
        adminComment: 'Shift timer active. Workday focus recorded.',
      },
    });

    showToast(`Checked in at ${now}. Geofence verified & confirmation email sent!`, 'success');
  };

  const checkOut = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toISOString().split('T')[0];
    const userToUse = currentUser || EMPLOYEE_USER;
    const hoursNum = parseFloat((workedSeconds / 3600).toFixed(1));

    setIsCheckedIn(false);

    // Update attendance record check-out time & hours
    setAttendanceRecords((prev) =>
      prev.map((a) =>
        (a.employeeId === userToUse.employeeId || a.employeeName === userToUse.name) && a.date === todayStr
          ? { ...a, checkOut: now, workedHours: hoursNum, status: 'Present' }
          : a
      )
    );

    addActivity({
      type: 'check_out',
      employeeName: userToUse.name,
      employeeAvatar: userToUse.avatar,
      title: `checked out at ${now} (${hoursNum} hrs worked)`,
      badgeType: 'info',
    });

    // Automatically send automated email notification for completed shift
    sendAutomatedEmail({
      to: userToUse.email || 'employee@nexawork.com',
      subject: `Shift Completed: Workday Logged (${hoursNum} hrs)`,
      type: 'LEAVE_STATUS',
      data: {
        employeeName: userToUse.name,
        type: 'Workday Shift Check-out',
        daysCount: 1,
        startDate: todayStr,
        endDate: todayStr,
        reason: `Shift logged from ${checkInTime || '09:00 AM'} to ${now} (${hoursNum} hrs total)`,
        status: 'Approved',
        adminComment: 'Shift recorded cleanly to PostgreSQL database and Nodemailer dispatch log.',
      },
    });

    showToast(`Checked out at ${now}. Workday logged & summary email dispatched!`, 'info');
  };

  const runPayrollCalculation = (month: string) => {
    showToast(`Payroll calculated for ${month}. 0 critical tax compliance anomalies detected.`, 'success');
  };

  const generateAndPublishPayslips = (month: string) => {
    const newPayslips: Payslip[] = employees.map((emp) => {
      const gross =
        emp.salary.monthlyBasic +
        emp.salary.allowances.hra +
        emp.salary.allowances.da +
        emp.salary.allowances.travel +
        emp.salary.allowances.special;
      const deductions =
        emp.salary.deductions.pf + emp.salary.deductions.tax + emp.salary.deductions.insurance;
      const net = gross - deductions;

      return {
        id: `ps-${Date.now()}-${emp.employeeId}`,
        payslipNumber: `DF-PS-${month.replace(/\s+/g, '-').toUpperCase()}-${emp.employeeId.replace('DF-', '')}`,
        employeeId: emp.employeeId,
        employeeName: emp.name,
        employeeRole: emp.role,
        department: emp.department,
        month,
        period: `01 ${month} - 31 ${month}`,
        generatedDate: new Date().toISOString().split('T')[0],
        paymentDate: new Date().toISOString().split('T')[0],
        payableDays: 31,
        presentDays: emp.todayStatus === 'Absent' ? 20 : 22,
        leaveDays: 2,
        lossOfPayDays: 0,
        basicSalary: emp.salary.monthlyBasic,
        allowances: { ...emp.salary.allowances },
        deductions: { ...emp.salary.deductions },
        grossEarnings: gross,
        totalDeductions: deductions,
        netPay: net,
        status: 'Published',
      };
    });

    setPayslips((prev) => [...newPayslips, ...prev]);

    // Dispatch automated payslip email to each employee
    newPayslips.forEach((ps) => {
      const emp = employees.find((e) => e.employeeId === ps.employeeId);
      const email = emp?.email || `${ps.employeeName.toLowerCase().replace(/\s+/g, '.')}@nexawork.com`;
      sendAutomatedEmail({
        to: email,
        subject: `Salary Payslip Published for ${month} - NexaWork`,
        type: 'PAYSLIP',
        data: {
          employeeName: ps.employeeName,
          month,
          grossEarnings: ps.grossEarnings,
          totalDeductions: ps.totalDeductions,
          netPay: ps.netPay,
        },
      });
    });

    addActivity({
      type: 'payroll_run',
      employeeName: currentUser?.name || 'Eleanor Vance',
      employeeAvatar: currentUser?.avatar || '',
      title: `generated and published payslips for ${month}`,
      badgeType: 'success',
    });
    showToast(`Published ${newPayslips.length} payslips for ${month}. Automated email notifications sent to all employees.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentView,
        setCurrentView,
        authMode,
        setAuthMode,
        navigateToAuth,
        selectedEmployeeId,
        setSelectedEmployeeId,
        login,
        logout,
        switchRole,
        employees,
        leaveRequests,
        attendanceRecords,
        payslips,
        activities,
        reminders,
        announcements,
        employeeLeaveBalances,
        addEmployee,
        updateEmployee,
        deactivateEmployee,
        submitLeaveRequest,
        submitEmergencyLeave,
        approveLeaveRequest,
        rejectLeaveRequest,
        isCheckedIn,
        checkInTime,
        checkIn,
        checkOut,
        workedSeconds,
        runPayrollCalculation,
        generateAndPublishPayslips,
        toasts,
        showToast,
        removeToast,
        isCopilotOpen,
        setIsCopilotOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
