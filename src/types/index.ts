export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  employeeId: string;
  designation: string;
  department: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: string; // e.g. 'Senior Product Designer', 'Frontend Lead'
  department: 'Engineering' | 'Design' | 'Product' | 'Marketing' | 'People & HR' | 'Operations' | 'Finance';
  manager: string;
  dateOfJoining: string;
  status: 'Active' | 'Probation' | 'Notice Period' | 'Offboarded';
  todayStatus: 'Present' | 'Absent' | 'Half-Day' | 'Emergency Leave' | 'On Leave';
  checkInTime?: string;
  checkOutTime?: string;
  emergencyLeaveNote?: string;
  
  // Payroll info
  salary: {
    monthlyBasic: number; // e.g. 8500
    yearlyBasic: number;
    allowances: {
      da: number; // Dearness Allowance
      hra: number; // House Rent Allowance
      travel: number;
      special: number;
    };
    deductions: {
      pf: number; // Provident Fund
      tax: number; // Income Tax / PT
      insurance: number;
    };
  };

  // Leave balances
  leaveBalance: {
    paid: number; // total remaining
    paidTotal: number;
    sick: number;
    sickTotal: number;
    unpaidUsed: number;
  };

  documents: {
    name: string;
    type: string;
    uploadedOn: string;
    size: string;
  }[];
}

export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Unpaid Leave' | 'Emergency Half-Day';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Logged';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  employeeRole: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: LeaveStatus;
  requestedOn: string;
  isEmergency?: boolean;
  emergencyReasonCategory?: 'Medical' | 'Family Emergency' | 'Accident' | 'Personal Urgent' | 'Other';
  adminComment?: string;
  actionedBy?: string;
  actionedAt?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Half-Day' | 'Half-day Emergency' | 'On Leave';
  workedHours: number;
  location?: string;
  hasAnomaly?: boolean;
  anomalyReason?: string;
  emergencyNote?: string;
}

export interface Payslip {
  id: string;
  payslipNumber: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  month: string; // e.g. "October 2026"
  period: string; // "01 Oct 2026 - 31 Oct 2026"
  generatedDate: string;
  paymentDate: string;
  payableDays: number;
  presentDays: number;
  leaveDays: number;
  lossOfPayDays: number;
  basicSalary: number;
  allowances: {
    hra: number;
    da: number;
    travel: number;
    special: number;
  };
  deductions: {
    pf: number;
    tax: number;
    insurance: number;
  };
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'Published' | 'Draft' | 'Processing';
}

export interface ActivityItem {
  id: string;
  type: 'check_in' | 'check_out' | 'leave_applied' | 'leave_approved' | 'leave_rejected' | 'emergency_leave' | 'payroll_run' | 'profile_update';
  employeeName: string;
  employeeAvatar: string;
  title: string;
  timestamp: string;
  badgeType?: 'success' | 'warning' | 'error' | 'info';
}

export interface ReminderItem {
  id: string;
  title: string;
  type: 'probation' | 'contract' | 'meeting' | 'compliance' | 'holiday';
  date: string;
  time?: string;
  urgent?: boolean;
  actionLabel?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  content: string;
  author: string;
}

export interface LeaveBalanceSummary {
  paid: number;
  paidTotal: number;
  sick: number;
  sickTotal: number;
  unpaid: number;
  emergency: number;
}
