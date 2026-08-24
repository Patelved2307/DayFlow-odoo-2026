import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { Employee, LeaveRequest, AttendanceRecord } from '../../types';

/**
 * Real-Time Supabase Database Sync Service
 */

export async function syncEmployeeToSupabase(emp: Employee): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload = {
      employee_id: emp.employeeId,
      full_name: emp.name,
      email: emp.email,
      role: emp.role?.toLowerCase().includes('admin') || emp.role?.toLowerCase().includes('head') ? 'ADMIN' : 'EMPLOYEE',
      phone: emp.phone || '+1 (555) 000-0000',
      address: emp.address || 'Company HQ',
      department: emp.department || 'Engineering',
      job_role: emp.role || 'Software Engineer',
      designation: emp.role || 'Staff Member',
    };

    const { error } = await supabase
      .from('employees')
      .upsert([payload], { onConflict: 'employee_id' });

    if (error) {
      console.warn('[Supabase Employee Sync Note]', error.message);
      return false;
    }
    console.log('[Supabase Employee Synced]', emp.name);
    return true;
  } catch (err) {
    console.warn('[Supabase Sync Error]', err);
    return false;
  }
}

export async function syncLeaveRequestToSupabase(req: LeaveRequest): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload = {
      employee_id: req.employeeId,
      leave_type: req.type.includes('Sick') ? 'Sick' : req.type.includes('Unpaid') ? 'Unpaid' : 'Paid',
      start_date: req.startDate,
      end_date: req.endDate,
      total_days: req.daysCount,
      reason: req.reason,
      status: req.status === 'Approved' ? 'Approved' : req.status === 'Rejected' ? 'Rejected' : 'Pending',
    };

    const { error } = await supabase.from('leave_requests').insert([payload]);
    if (error) {
      console.warn('[Supabase Leave Sync Note]', error.message);
      return false;
    }
    console.log('[Supabase Leave Request Synced]', req.id);
    return true;
  } catch (err) {
    console.warn('[Supabase Sync Error]', err);
    return false;
  }
}

export async function syncAttendanceToSupabase(att: AttendanceRecord): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  try {
    const payload = {
      employee_id: att.employeeId,
      date: att.date,
      check_in_time: att.checkIn !== '--' ? att.checkIn : null,
      check_out_time: att.checkOut !== '--' ? att.checkOut : null,
      status: att.status.includes('Half') ? 'Half-day' : att.status.includes('Absent') ? 'Absent' : 'Present',
    };

    const { error } = await supabase.from('attendance_logs').insert([payload]);
    if (error) {
      console.warn('[Supabase Attendance Sync Note]', error.message);
      return false;
    }
    console.log('[Supabase Attendance Log Synced]', att.id);
    return true;
  } catch (err) {
    console.warn('[Supabase Sync Error]', err);
    return false;
  }
}

export async function fetchEmployeesFromSupabase(): Promise<Partial<Employee>[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase.from('employees').select('*');
    if (error) {
      console.warn('[Supabase Fetch Note]', error.message);
      return null;
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id || 'emp-' + row.employee_id,
      employeeId: row.employee_id,
      name: row.full_name || 'Team Member',
      email: row.email,
      phone: row.phone || '+1 (555) 000-0000',
      address: row.address || 'Executive Center',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      role: row.job_role || row.designation || 'Team Member',
      department: row.department || 'Engineering',
      manager: 'Eleanor Vance',
      dateOfJoining: row.date_of_joining || new Date().toISOString().split('T')[0],
      status: 'Active',
      todayStatus: 'Present',
    }));
  } catch (err) {
    console.warn('[Supabase Fetch Error]', err);
    return null;
  }
}
