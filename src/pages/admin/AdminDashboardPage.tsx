import React, { useState } from 'react';
import { FoldText } from '../../components/ui/FoldText';
import { useApp } from '../../lib/context/AppContext';
import { MetricCard } from '../../components/dashboard/MetricCard';
import { ProjectAnalyticsChart } from '../../components/dashboard/ProjectAnalyticsChart';
import { ProjectProgressGauge } from '../../components/dashboard/ProjectProgressGauge';
import { TimeTrackerWidget } from '../../components/dashboard/TimeTrackerWidget';
import { sendAutomatedEmail } from '../../lib/services/emailService';
import { AddEmployeeModal } from '../../components/employees/AddEmployeeModal';
import {
  Plus,
  Download,
  Clock,
  Video,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck,
  UserX,
  AlertCircle,
  FileCheck2,
  XCircle,
  Check,
  X,
  Zap,
  Activity,
  Gauge,
  TrendingUp,
  RotateCw,
} from 'lucide-react';

import { motion } from 'framer-motion';

export const AdminDashboardPage: React.FC = () => {
  const {
    employees,
    leaveRequests,
    reminders,
    approveLeaveRequest,
    rejectLeaveRequest,
    setCurrentView,
    setSelectedEmployeeId,
    showToast,
  } = useApp();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculations for Row 1 & Row 2
  const totalEmployees = employees.length;
  const presentCount = employees.filter((e) => e.todayStatus === 'Present').length;
  const absentCount = employees.filter((e) => e.todayStatus === 'Absent').length;
  const emergencyHalfDayCount = employees.filter(
    (e) => e.todayStatus === 'Half-Day' || e.todayStatus === 'Emergency Leave' || e.todayStatus === 'On Leave'
  ).length;

  const totalRequests = leaveRequests.length;
  const approvedRequests = leaveRequests.filter((r) => r.status === 'Approved').length;
  const rejectedRequests = leaveRequests.filter((r) => r.status === 'Rejected').length;
  const pendingRequests = leaveRequests.filter((r) => r.status === 'Pending').length;

  // Sorted Leave Requests Queue (Emergency pinned to top)
  const queueRequests = [...leaveRequests].sort((a, b) => {
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;
    return new Date(b.requestedOn).getTime() - new Date(a.requestedOn).getTime();
  });

  const handleInlineAction = async (id: string, newStatus: 'Approved' | 'Rejected') => {
    if (newStatus === 'Approved') {
      approveLeaveRequest(id, 'Approved from Admin Control Tower');
    } else {
      rejectLeaveRequest(id, 'Rejected from Admin Control Tower');
    }
  };

  const handleStartMeeting = async () => {
    showToast('Connecting to company video conference...', 'info');
    await sendAutomatedEmail({
      to: 'team@nexawork.com',
      subject: 'Meeting Invitation: Weekly All-Hands & Policy Sync',
      type: 'MEETING_INVITE',
      data: {
        title: 'Meeting with Arc Company & All-Hands Sync',
        time: '02.00 pm - 04.00 pm',
        host: 'Eleanor Vance (HR Operations)',
      },
    });
    showToast('Meeting invitation email automatically dispatched to team!', 'success');
  };

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
              text="NexaWork Operations & HR Control Tower"
              splitBy="word"
              hinge="top"
              trigger="mount"
              duration={0.65}
              stagger={0.04}
              color="#1C1F1E"
            />
            <span className="rounded-full bg-emerald-100 text-[#006837] text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider border border-emerald-200">
              Org-Wide Executive Command
            </span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Real-time workforce alignment, geofenced logs, emergency leave queues, and automated payroll management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsRefreshing(true);
              showToast('Refreshing HR Control Tower & database logs...', 'info');
              setTimeout(() => {
                setIsRefreshing(false);
                showToast('HR Dashboard & database state synchronized!', 'success');
              }, 600);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2.5 text-xs font-bold text-[#006837] shadow-2xs transition-all cursor-pointer"
            title="Refresh dashboard and database logs"
          >
            <RotateCw className={`w-4 h-4 text-[#006837] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>+ Add Employee</span>
          </button>
          <button
            onClick={() => showToast('Exporting org-wide operations summary (CSV)...', 'success')}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-[#1C1F1E] shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Row 1 — Top Stat Cards (Deep-links to relevant pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={totalEmployees}
          subValue="Active workforce roster"
          isPrimary={true}
          onClick={() => setCurrentView('admin-employees')}
        />
        <MetricCard
          title="Present Today"
          value={presentCount}
          subValue="On-site & remote active"
          onClick={() => setCurrentView('admin-attendance')}
        />
        <MetricCard
          title="Absent Today"
          value={absentCount}
          subValue="Unexcused or missing check-in"
          onClick={() => setCurrentView('admin-attendance')}
        />
        {/* On Half-Day / Emergency Leave Card with Amber Accent */}
        <div
          onClick={() => setCurrentView('admin-leave-requests')}
          className="rounded-2xl bg-amber-500 text-white p-5 border border-amber-600 shadow-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">
              On Half-Day / Emergency
            </span>
            <AlertTriangle className="w-5 h-5 text-amber-200" />
          </div>

          <div className="mt-3">
            <div className="font-display font-extrabold text-3xl">{emergencyHalfDayCount}</div>
            <div className="text-xs text-amber-100 mt-1 flex items-center gap-1">
              <span>Emergency logged & active</span>
              <span>↗</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — Requests Strip (Total · Approved · Rejected · Pending this month) */}
      <div className="rounded-2xl bg-white p-4 border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-[#006837]" />
          <span className="text-xs font-bold text-[#1C1F1E] uppercase tracking-wider">
            Monthly Time-Off Ledger
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full sm:w-auto">
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Requests</div>
            <div className="text-base font-bold text-[#1C1F1E] font-mono">{totalRequests}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-emerald-600 uppercase font-semibold">Approved</div>
            <div className="text-base font-bold text-[#006837] font-mono">{approvedRequests}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-rose-600 uppercase font-semibold">Rejected</div>
            <div className="text-base font-bold text-rose-600 font-mono">{rejectedRequests}</div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-[10px] text-amber-600 uppercase font-semibold">Pending Review</div>
            <div className="text-base font-bold text-amber-600 font-mono">{pendingRequests}</div>
          </div>
        </div>
      </div>

      {/* Row 3 — 3-Column Grid: Attendance Analytics, Reminders, Leave Requests Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Attendance Analytics Bar Chart */}
        <div className="lg:col-span-5">
          <ProjectAnalyticsChart />
        </div>

        {/* Middle (3 cols): NexaWork HR Operations & Compliance Sync */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6B7280]">Compliance & Sync</span>
              <span className="rounded-full bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 border border-emerald-200/60">
                HR Tower
              </span>
            </div>

            <h3 className="font-display font-bold text-base text-[#1C1F1E] mt-3 leading-snug">
              Weekly HR All-Hands & Recruitment Sync
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Today • 02:00 PM - 03:30 PM</span>
            </p>

            <button
              onClick={handleStartMeeting}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-300" />
              <span>Start All-Hands Sync</span>
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              HR Compliance & Audit Alerts
            </div>
            {reminders.slice(0, 3).map((item) => (
              <div key={item.id} className="text-xs text-[#1C1F1E] flex items-center justify-between py-1">
                <span className="truncate pr-2">{item.title}</span>
                <span className="font-mono text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 cols): Leave Requests Queue (Inline Approve/Reject, Emergency Pinned) */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  Leave Requests Queue
                </h3>
                <p className="text-xs text-[#6B7280]">Emergency pinned to top</p>
              </div>
              <button
                onClick={() => setCurrentView('admin-leave-requests')}
                className="text-xs font-bold text-[#006837] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {queueRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="font-semibold text-gray-600">No Pending Leave Requests</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Real employee leave applications will appear here in real-time.</p>
                </div>
              ) : (
                queueRequests.slice(0, 4).map((req) => (
                  <div
                    key={req.id}
                    className={`p-3 rounded-xl border transition-all ${
                      req.isEmergency
                        ? 'bg-amber-50 border-amber-300'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#1C1F1E]">{req.employeeName}</span>
                        {req.isEmergency && (
                          <span className="rounded-full bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                            Emergency
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{req.daysCount} Day(s)</span>
                    </div>

                    <div className="text-[11px] text-[#6B7280] mt-1 line-clamp-1">{req.reason}</div>

                    {req.status === 'Pending' ? (
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => handleInlineAction(req.id, 'Approved')}
                          className="flex-1 py-1 rounded-lg bg-[#006837] hover:bg-[#05522C] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleInlineAction(req.id, 'Rejected')}
                          className="flex-1 py-1 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-[10px] font-bold flex items-center gap-1 text-gray-500">
                        <span>Status:</span>
                        <span
                          className={
                            req.status === 'Approved'
                              ? 'text-emerald-700 font-bold'
                              : req.status === 'Rejected'
                              ? 'text-rose-700 font-bold'
                              : 'text-amber-700 font-bold'
                          }
                        >
                          {req.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4 — 3-Column Layout: Activity Feed, Today's Attendance Speedometer, HR Overhead Meter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Recent Employee Activity Feed */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1F1E] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#006837]" />
                <span>Recent Employee Activity</span>
              </h3>
              <p className="text-xs text-[#6B7280]">Live system check-ins and logs</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {employees.slice(0, 4).map((emp) => (
              <div
                key={emp.id}
                onClick={() => {
                  setSelectedEmployeeId(emp.id);
                  setCurrentView('admin-employee-profile');
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-[#1C1F1E] truncate">{emp.name}</div>
                    <div className="text-[11px] text-[#6B7280] truncate">
                      Checked in at {emp.checkInTime || '09:00 AM'} ({emp.department})
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
                    emp.todayStatus === 'Present'
                      ? 'bg-emerald-100 text-[#006837]'
                      : emp.todayStatus === 'Absent'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {emp.todayStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Middle (3 cols): Today's Attendance Speedometer */}
        <div className="lg:col-span-3">
          <ProjectProgressGauge />
        </div>

        {/* Right (4 cols): HR Overhead Reduction Meter (Dark Green Card) */}
        <div className="lg:col-span-4 rounded-2xl bg-[#006837] text-white p-6 border border-emerald-900 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                HR Overhead Reduction Meter
              </span>
              <TrendingUp className="w-5 h-5 text-emerald-300" />
            </div>

            <h3 className="font-display font-extrabold text-4xl mt-4 text-white">
              142 <span className="text-lg font-normal text-emerald-200">hrs saved</span>
            </h3>

            <p className="text-xs text-emerald-100 leading-relaxed mt-2">
              Automated leave resolution, conflict-aware approvals, and instant emergency logging reduced manual HR admin overhead by <strong className="text-white">68%</strong> this month.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200">
            <span>Next Payroll Sync</span>
            <span className="font-mono font-bold text-white">Nov 30, 2024</span>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />
    </motion.div>
  );
};
