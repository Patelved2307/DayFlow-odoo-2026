import React, { useState } from 'react';
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
  Layers,
  Sparkles,
  ChevronRight,
  UserPlus,
  CheckCircle2,
  FileCode2,
  Workflow,
  Layout,
  Zap,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    employees,
    leaveRequests,
    reminders,
    setCurrentView,
    setSelectedEmployeeId,
    showToast,
  } = useApp();

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  // Projects data matching the reference UI screenshot
  const projectList = [
    {
      id: 'p-1',
      title: 'Develop API Endpoints',
      dueDate: 'Due date: Nov 26, 2024',
      iconBg: 'bg-blue-100 text-blue-600',
      icon: FileCode2,
    },
    {
      id: 'p-2',
      title: 'Onboarding Flow',
      dueDate: 'Due date: Nov 28, 2024',
      iconBg: 'bg-teal-100 text-teal-700',
      icon: Workflow,
    },
    {
      id: 'p-3',
      title: 'Build Dashboard',
      dueDate: 'Due date: Nov 30, 2024',
      iconBg: 'bg-emerald-100 text-[#006837]',
      icon: Layout,
    },
    {
      id: 'p-4',
      title: 'Optimize Page Load',
      dueDate: 'Due date: Dec 5, 2024',
      iconBg: 'bg-amber-100 text-amber-700',
      icon: Zap,
    },
    {
      id: 'p-5',
      title: 'Cross-Browser Testing',
      dueDate: 'Due date: Dec 6, 2024',
      iconBg: 'bg-purple-100 text-purple-700',
      icon: Layers,
    },
  ];

  // Team collaboration roster matching the reference UI screenshot
  const teamRoster = [
    {
      id: 'emp-101',
      name: 'Alexandra Deff',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      task: 'Working on Github Project Repository',
      status: 'Completed',
      statusClass: 'bg-emerald-100 text-[#006837]',
    },
    {
      id: 'emp-102',
      name: 'Edwin Adenike',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      task: 'Working on Integrate User Authentication System',
      status: 'In Progress',
      statusClass: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'emp-103',
      name: 'Isaac Oluwatemilorun',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      task: 'Working on Develop Search and Filter Functionality',
      status: 'Pending',
      statusClass: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'emp-104',
      name: 'David Oshodi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      task: 'Working on Responsive Layout for Homepage',
      status: 'In Progress',
      statusClass: 'bg-amber-100 text-amber-800',
    },
  ];

  const handleStartMeeting = async () => {
    showToast('Connecting to company video conference...', 'info');
    // Dispatch automated email invitation to team
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
    showToast('Meeting invitation email automatically sent to team members!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#1C1F1E] tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Plan, prioritize, and accomplish your tasks with ease.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddEmployeeOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => {
              showToast('Exporting workforce summary report (CSV)...', 'success');
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-[#1C1F1E] shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span>Import Data</span>
          </button>
        </div>
      </div>

      {/* Row 1 — 4 Featured Metric Cards (Exact Reference Design) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Projects"
          value={24}
          subValue="Increased from last month"
          isPrimary={true}
          onClick={() => setCurrentView('admin-employees')}
        />
        <MetricCard
          title="Ended Projects"
          value={10}
          subValue="Increased from last month"
          onClick={() => setCurrentView('admin-attendance')}
        />
        <MetricCard
          title="Running Projects"
          value={12}
          subValue="Increased from last month"
          onClick={() => setCurrentView('admin-leave-requests')}
        />
        <MetricCard
          title="Pending Project"
          value={2}
          subValue="On Discuss"
          onClick={() => setCurrentView('admin-leave-requests')}
        />
      </div>

      {/* Row 2 — 3 Column Grid: Project Analytics (left), Reminders Meeting Card (middle), Project List (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Project Analytics Bar Chart */}
        <div className="lg:col-span-5">
          <ProjectAnalyticsChart />
        </div>

        {/* Middle (3 cols): Reminders & Meeting Card */}
        <div className="lg:col-span-3 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280]">Reminders</span>
            <h3 className="font-display font-bold text-base text-[#1C1F1E] mt-3">
              Meeting with Arc Company
            </h3>
            <p className="text-xs text-[#6B7280] mt-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Time : 02.00 pm - 04.00 pm</span>
            </p>

            <button
              onClick={handleStartMeeting}
              className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#006837] hover:bg-[#05522C] px-4 py-3 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-emerald-300" />
              <span>Start Meeting</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Upcoming Action
            </div>
            {reminders.slice(0, 2).map((item) => (
              <div key={item.id} className="text-xs text-[#1C1F1E] flex items-center justify-between py-1">
                <span className="truncate pr-2">{item.title}</span>
                <span className="font-mono text-[10px] text-gray-400 shrink-0">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right (4 cols): Project List with Icons and Due Dates */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  Project
                </h3>
                <p className="text-xs text-[#6B7280]">Active workforce deliverables</p>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-gray-200 px-2.5 py-1 text-xs font-semibold text-[#1C1F1E] transition-colors cursor-pointer"
              >
                <span>+ New</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {projectList.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.iconBg}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-[#1C1F1E] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-gray-400 truncate">
                          {item.dueDate}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 — Bottom 3-Column Layout: Team Collaboration, Project Progress, Time Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left (5 cols): Team Collaboration List */}
        <div className="lg:col-span-5 rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  Team Collaboration
                </h3>
                <p className="text-xs text-[#6B7280]">Real-time member status</p>
              </div>
              <button
                onClick={() => setIsAddEmployeeOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#006837] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <span>+ Add Member</span>
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {teamRoster.map((member) => (
                <div
                  key={member.id}
                  onClick={() => {
                    setSelectedEmployeeId(member.id);
                    setCurrentView('admin-employee-profile');
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-[#1C1F1E] truncate">{member.name}</div>
                      <div className="text-[11px] text-[#6B7280] truncate">
                        {member.task}
                      </div>
                    </div>
                  </div>

                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${member.statusClass}`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle (3 cols): Project Progress Arc Gauge */}
        <div className="lg:col-span-3">
          <ProjectProgressGauge />
        </div>

        {/* Right (4 cols): Time Tracker Widget */}
        <div className="lg:col-span-4">
          <TimeTrackerWidget />
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />
    </div>
  );
};
