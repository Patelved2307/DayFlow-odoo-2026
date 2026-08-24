import React, { useState } from 'react';
import { FoldText } from '../../components/ui/FoldText';
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
  UserCheck,
  CheckCircle2,
  Users,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';
import { LeaveRequestModal } from '../../components/leave/LeaveRequestModal';
import { EmergencyLeaveModal } from '../../components/leave/EmergencyLeaveModal';
import { motion } from 'framer-motion';

export const EmployeeDashboardPage: React.FC = () => {
  const {
    currentUser,
    isCheckedIn,
    checkInTime,
    leaveRequests,
    employeeLeaveBalances,
    setCurrentView,
    setIsCopilotOpen,
    showToast,
    employees,
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
  const totalBalanceRemaining = balances.paid + balances.sick;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#1C1F1E] tracking-tight flex flex-wrap items-center gap-2">
            <FoldText
              text="NexaWork Workforce Command Center"
              splitBy="word"
              hinge="top"
              trigger="mount"
              duration={0.65}
              stagger={0.04}
              color="#1C1F1E"
            />
            <span className="rounded-full bg-emerald-100 text-[#006837] text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider border border-emerald-200">
              Staff Portal
            </span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Welcome back, {currentUser?.name || 'Patel Ved'} • {currentUser?.designation || 'Lead Full Stack Engineer'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-100" />
            <span>Leave Early / Emergency</span>
          </button>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-emerald-300" />
            <span>Request Leave</span>
          </button>
        </div>
      </div>

      {/* Row 1 — Top Stat Cards (Spec 4.1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Status"
          value={isCheckedIn ? 'Checked In' : 'Not Checked In'}
          subValue={isCheckedIn ? `Since ${checkInTime || '09:00 AM'}` : 'Click widget below to clock in'}
          isPrimary={true}
          onClick={() => setCurrentView('emp-attendance')}
        />
        <MetricCard
          title="Days Present This Month"
          value="21 Days"
          subValue="95.5% attendance rate"
          onClick={() => setCurrentView('emp-attendance')}
        />
        <MetricCard
          title="Leave Requests Pending"
          value={pendingLeaves}
          subValue="Awaiting HR review"
          onClick={() => setCurrentView('emp-leave')}
        />
        <MetricCard
          title="Total Leave Balance"
          value={`${totalBalanceRemaining} Days`}
          subValue="Paid + Sick remaining"
          onClick={() => setCurrentView('emp-leave')}
        />
      </div>

      {/* Row 2 — Leave Balance Strip */}
      <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#006837]" />
          <span className="text-xs font-bold text-[#1C1F1E] uppercase tracking-wider">
            Personal Leave Balances
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full sm:w-auto">
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Paid Leave</div>
            <div className="text-sm font-bold text-[#006837] font-mono">
              {balances.paid} / {balances.paidTotal} Remaining
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Sick Leave</div>
            <div className="text-sm font-bold text-teal-700 font-mono">
              {balances.sick} / {balances.sickTotal} Remaining
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Unpaid Leave</div>
            <div className="text-sm font-bold text-gray-700 font-mono">
              {balances.unpaid} Days Available
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — 3-Column Grid: My Attendance Chart, Reminders/Announcements, My Leave Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): My Attendance Bar Chart */}
        <div className="lg:col-span-5">
          <ProjectAnalyticsChart />
        </div>

        {/* Middle (3 cols): NexaWork Workforce System Notice & Announcements */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">System Notice & Policy</span>
              <span className="rounded-full bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 border border-emerald-200/60">
                NexaWork Live
              </span>
            </div>

            <h3 className="font-display font-bold text-base text-[#1C1F1E] mt-3 leading-snug">
              Geofenced Attendance & AI HR Copilot Active
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GPS Radius 50m • Real-Time Sync</span>
            </p>

            <button
              onClick={() => setIsCopilotOpen(true)}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#006837] font-bold text-xs border border-emerald-200/60 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#006837] animate-pulse" />
              <span>Ask AI HR Copilot</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Workforce Guidelines & Reminders
            </div>
            <div className="text-xs text-[#1C1F1E] font-medium leading-relaxed">
              • Emergency Leave Fast-Track enabled for 1-click HR resolution.
            </div>
            <div className="text-xs text-[#1C1F1E] font-medium leading-relaxed">
              • Monthly Automated Payslips published on 30th at 06:00 PM.
            </div>
            <div className="text-xs text-[#1C1F1E] font-medium leading-relaxed">
              • Geofence punch active — verify location before clocking in.
            </div>
          </div>
        </div>

        {/* Right (4 cols): My Leave Requests Status List */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  My Leave Requests
                </h3>
                <p className="text-xs text-[#6B7280]">Status history</p>
              </div>
              <button
                onClick={() => setCurrentView('emp-leave')}
                className="text-xs font-bold text-[#006837] hover:underline"
              >
                View Center →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {myLeaves.slice(0, 3).map((req) => (
                <div key={req.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1C1F1E]">{req.type}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
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
                  <div className="text-[11px] text-gray-400 mt-1">
                    {req.startDate} to {req.endDate} ({req.daysCount} days)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — 3-Column Grid: Team Status Today, Monthly Attendance Gauge, Check-In Live Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Team Status Today */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1F1E] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#006837]" />
                <span>Team Status Today</span>
              </h3>
              <p className="text-xs text-[#6B7280]">Engineering squad roster</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {employees.slice(0, 4).map((m) => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img
                    src={m.avatar}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#1C1F1E]">{m.name}</div>
                    <div className="text-[11px] text-gray-400">{m.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#006837] bg-emerald-50 px-2 py-0.5 rounded-full">
                  {m.todayStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle (3 cols): My Monthly Attendance Gauge */}
        <div className="lg:col-span-3">
          <ProjectProgressGauge />
        </div>

        {/* Right (4 cols): Live Check-In / Check-Out Card with Emergency Leave Button */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <TimeTrackerWidget />

          <button
            onClick={() => setIsEmergencyModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-amber-100" />
            <span>Leave Early / Emergency Half-Day</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <LeaveRequestModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} />
      <EmergencyLeaveModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </motion.div>
  );
};
