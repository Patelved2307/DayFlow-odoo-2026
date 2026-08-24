import { Employee, LeaveRequest, AttendanceRecord, Payslip, ActivityItem, ReminderItem, AnnouncementItem, User } from '../../types';

export const ADMIN_USER: User = {
  id: 'usr-admin-1',
  name: 'Eleanor Vance',
  email: 'eleanor.vance@dayflow.work',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  employeeId: 'DF-ADM-01',
  designation: 'Head of People & Operations',
  department: 'People & HR',
};

export const EMPLOYEE_USER: User = {
  id: 'usr-emp-2026',
  name: 'Patel Ved',
  email: 'paved2307@gmail.com',
  role: 'employee',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  employeeId: 'EMP-2026',
  designation: 'Lead Full Stack Engineer',
  department: 'Engineering',
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-2026',
    employeeId: 'EMP-2026',
    name: 'Patel Ved',
    email: 'paved2307@gmail.com',
    phone: '+1 (555) 230-7000',
    address: '100 Innovation Park, Suite 500',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Full Stack Engineer',
    department: 'Engineering',
    manager: 'Eleanor Vance',
    dateOfJoining: '2026-01-01',
    status: 'Active',
    todayStatus: 'Present',
    checkInTime: '08:58 AM',
    salary: {
      monthlyBasic: 8500,
      yearlyBasic: 102000,
      allowances: {
        hra: 3400,
        da: 850,
        travel: 600,
        special: 1000,
      },
      deductions: {
        pf: 1020,
        tax: 1530,
        insurance: 300,
      },
    },
    leaveBalance: {
      paid: 18,
      paidTotal: 18,
      sick: 10,
      sickTotal: 10,
      unpaidUsed: 0,
    },
    documents: [
      { name: 'Employment_Agreement.pdf', type: 'PDF', uploadedOn: '2026-01-01', size: '1.4 MB' },
    ],
  },
  {
    id: 'emp-admin-1',
    employeeId: 'DF-ADM-01',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@dayflow.work',
    phone: '+1 (555) 100-2000',
    address: 'Executive Tower, Suite 1000',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'Head of People & Operations',
    department: 'People & HR',
    manager: 'Board of Directors',
    dateOfJoining: '2025-01-01',
    status: 'Active',
    todayStatus: 'Present',
    checkInTime: '08:30 AM',
    salary: {
      monthlyBasic: 12500,
      yearlyBasic: 150000,
      allowances: {
        hra: 5000,
        da: 1250,
        travel: 800,
        special: 2000,
      },
      deductions: {
        pf: 1500,
        tax: 2250,
        insurance: 400,
      },
    },
    leaveBalance: {
      paid: 24,
      paidTotal: 24,
      sick: 12,
      sickTotal: 12,
      unpaidUsed: 0,
    },
    documents: [
      { name: 'Executive_Agreement.pdf', type: 'PDF', uploadedOn: '2025-01-01', size: '2.5 MB' },
    ],
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [];

export const INITIAL_ATTENDANCE_RECORDS: AttendanceRecord[] = [];

export const INITIAL_PAYSLIPS: Payslip[] = [];

export const INITIAL_ACTIVITIES: ActivityItem[] = [];

export const INITIAL_REMINDERS: ReminderItem[] = [];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'NexaWork Platform Activated',
    date: new Date().toISOString().split('T')[0],
    content: 'All HR workflows, geofenced attendance tracking, automated email dispatch, and leave balance ledgers are active.',
    author: 'Eleanor Vance (People Operations)',
  },
];
