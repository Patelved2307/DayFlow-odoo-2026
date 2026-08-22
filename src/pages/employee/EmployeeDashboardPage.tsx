import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { ProjectAnalyticsChart } from '../../components/dashboard/ProjectAnalyticsChart';
import { TimeTrackerWidget } from '../../components/dashboard/TimeTrackerWidget';
import { ProjectProgressGauge } from '../../components/dashboard/ProjectProgressGauge';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Send,
  Sparkles,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { LeaveRequestModal } from '../../components/leave/LeaveRequestModal';
import { EmergencyLeaveModal } from '../../components/leave/EmergencyLeaveModal';

export const EmployeeDashboardPage: React.FC = () => {
  const {
    currentUser,
    isCheckedIn,
    checkInTime,
    checkIn,
    checkOut,
    leaveRequests,
    employeeLeaveBalances,
    setCurrentView,
    showToast,
  } = useApp();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const empId = currentUser?.employeeId || 'DF-EMP-104';
  const balances = employeeLeaveBalances[empId] || {
    paid: 14,
    paidTotal: 18,
    sick: 8,
    sickTotal: 10,
    unpaid: 12,
  };

  const myLeaves = leaveRequests.filter(
    (r) => r.employeeId === empId || r.employeeName === currentUser?.name
  );

  const pendingLeaves = myLeaves.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#1C1F1E] tracking-tight">
            Employee Workspace
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Welcome back, {currentUser?.name || 'Ravi Sharma'} • {currentUser?.designation || 'Senior Software Engineer'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-100" />
            <span>Emergency Half-Day</span>
          </button>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Apply For Leave</span>
          </button>
        </div>
      </div>

      {/* Row 1 — 4 Featured Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Paid Leave Available"
          value={`${balances.paid} Days`}
          subValue={`Out of ${balances.paidTotal} total annual`}
          isPrimary={true}
          onClick={() => setCurrentView('emp-leave')}
        />
        <MetricCard
          title="Sick Balance"
          value={`${balances.sick} Days`}
          subValue={`Out of ${balances.sickTotal} total annual`}
          onClick={() => setCurrentView('emp-leave')}
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingLeaves}
          subValue="Submitted for HR manager review"
          onClick={() => setCurrentView('emp-leave')}
        />
        <MetricCard
          title="Attendance Status"
          value={isCheckedIn ? 'Checked In' : 'Checked Out'}
          subValue={isCheckedIn ? `Punched in at ${checkInTime}` : 'Ready for workday check-in'}
          onClick={() => setCurrentView('emp-attendance')}
        />
      </div>

      {/* Row 2 — 3 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Personal Attendance Analytics */}
        <div className="lg:col-span-5">
          <ProjectAnalyticsChart />
        </div>

        {/* Middle (3 cols): Time Tracker Widget */}
        <div className="lg:col-span-3">
          <TimeTrackerWidget />
        </div>

        {/* Right (4 cols): My Recent Leave Submissions */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  My Leave Requests
                </h3>
                <p className="text-xs text-[#6B7280]">Recent applications & status</p>
              </div>
              <button
                onClick={() => setCurrentView('emp-leave')}
                className="text-xs font-semibold text-[#006837] hover:underline cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {myLeaves.slice(0, 4).map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-gray-50/80 border border-gray-100 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-[#1C1F1E] flex items-center gap-1.5">
                      <span>{req.type}</span>
                      {req.isEmergency && (
                        <span className="bg-amber-100 text-amber-700 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase">
                          Emergency
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">
                      {req.startDate} • {req.daysCount} Day(s)
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      req.status === 'Approved'
                        ? 'bg-emerald-100 text-[#006837]'
                        : req.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Project Progress & Quick Action Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5">
          <ProjectProgressGauge />
        </div>

        <div className="lg:col-span-7 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#1C1F1E] mb-1">
              Quick Self-Service Actions
            </h3>
            <p className="text-xs text-[#6B7280] mb-4">
              Access payslips, update personal info, or download tax forms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setCurrentView('emp-payslips')}
                className="p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center font-bold text-xs mb-2">
                  PDF
                </div>
                <div className="font-bold text-xs text-[#1C1F1E] group-hover:text-[#006837]">
                  View Payslips
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Itemized monthly salary</div>
              </button>

              <button
                onClick={() => setCurrentView('emp-profile')}
                className="p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center font-bold text-xs mb-2">
                  ID
                </div>
                <div className="font-bold text-xs text-[#1C1F1E] group-hover:text-[#006837]">
                  My Profile
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Job designation & info</div>
              </button>

              <button
                onClick={() => setIsLeaveModalOpen(true)}
                className="p-4 rounded-xl bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 transition-all text-left group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#006837] flex items-center justify-center font-bold text-xs mb-2">
                  PTO
                </div>
                <div className="font-bold text-xs text-[#1C1F1E] group-hover:text-[#006837]">
                  Time Off Request
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">Schedule paid leave</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
      />

      <EmergencyLeaveModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
};
