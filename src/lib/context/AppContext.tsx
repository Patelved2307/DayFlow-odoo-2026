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
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  login: (role: UserRole) => void;
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
  // Start on landing page by default or restore from state
  const [currentUser, setCurrentUser] = useState<User | null>(ADMIN_USER);
  const [currentView, setCurrentView] = useState<AppView>('admin-dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>('emp-104');
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('df_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('df_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('df_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE_RECORDS;
  });

  const [payslips, setPayslips] = useState<Payslip[]>(() => {
    const saved = localStorage.getItem('df_payslips');
    return saved ? JSON.parse(saved) : INITIAL_PAYSLIPS;
  });

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

  const login = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(ADMIN_USER);
      setCurrentView('admin-dashboard');
      showToast('Signed in as HR Administrator (Eleanor Vance)', 'success');
    } else {
      setCurrentUser(EMPLOYEE_USER);
      setCurrentView('emp-dashboard');
      showToast('Signed in as Employee (Ravi Sharma)', 'success');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
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

    showToast(`Employee ${newEmp.name} added and welcome credentials dispatched via email.`, 'success');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
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
    showToast('Employee profile updated successfully', 'success');
  };

  const deactivateEmployee = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: 'Offboarded', todayStatus: 'Absent' } : emp))
    );
    showToast('Employee moved to Offboarding workflow.', 'warning');
  };

  // Standard Leave Request Submit
  const submitLeaveRequest = (data: {
    type: LeaveType;
    startDate: string;
    endDate: string;
    daysCount: number;
    reason: string;
  }) => {
    const requester = currentUser || EMPLOYEE_USER;
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
    addActivity({
      type: 'leave_applied',
      employeeName: requester.name,
      employeeAvatar: requester.avatar,
      title: `applied for ${data.type} (${data.daysCount} days)`,
      badgeType: 'info',
    });
    showToast(`Leave request for ${data.daysCount} days submitted for Admin approval.`, 'success');
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

    showToast('Emergency leave logged immediately. HR and your manager have been notified.', 'warning');
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

    // Send email notification to employee
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
        adminComment: comment || 'Approved by HR Administrator.',
      },
    });

    showToast(`Leave request for ${target.employeeName} approved and employee notified via email.`, 'success');
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
    setIsCheckedIn(true);
    setCheckInTime(now);
    showToast(`Checked in successfully at ${now}`, 'success');
    addActivity({
      type: 'check_in',
      employeeName: currentUser?.name || 'Ravi Sharma',
      employeeAvatar: currentUser?.avatar || '',
      title: `checked in at ${now}`,
      badgeType: 'success',
    });
  };

  const checkOut = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsCheckedIn(false);
    showToast(`Checked out successfully at ${now}. Workday logged!`, 'info');
    addActivity({
      type: 'check_out',
      employeeName: currentUser?.name || 'Ravi Sharma',
      employeeAvatar: currentUser?.avatar || '',
      title: `checked out at ${now} (${(workedSeconds / 3600).toFixed(1)} hrs worked)`,
      badgeType: 'info',
    });
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
