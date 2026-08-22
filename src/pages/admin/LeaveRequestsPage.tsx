import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { LeaveHistoryTable } from '../../components/leave/LeaveHistoryTable';
import {
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
} from 'lucide-react';

export const LeaveRequestsPage: React.FC = () => {
  const { leaveRequests } = useApp();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Emergency'>('All');

  const filteredRequests = leaveRequests.filter((req) => {
    if (filter === 'Pending') return req.status === 'Pending' && !req.isEmergency;
    if (filter === 'Approved') return req.status === 'Approved';
    if (filter === 'Emergency') return req.isEmergency;
    return true;
  });

  const emergencyCount = leaveRequests.filter((r) => r.isEmergency).length;
  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending' && !r.isEmergency).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
            Leave Requests & Approvals Queue
          </h1>
          <p className="text-xs text-[#6B7280]">
            Review standard time-off requests and review auto-logged emergency leaves
          </p>
        </div>

        <div className="flex items-center gap-2">
          {emergencyCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF6EC] border border-[#F2994A]/30 px-3 py-1 text-xs font-bold text-[#F2994A]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{emergencyCount} Emergency Logged</span>
            </span>
          )}
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
              <Clock className="w-3.5 h-3.5" />
              <span>{pendingCount} Pending Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex rounded-xl bg-white p-1 border border-gray-100 shadow-xs text-xs font-semibold max-w-md">
        {(['All', 'Pending', 'Emergency', 'Approved'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#1F6D4D] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#1C1F1E]'
            }`}
          >
            {tab === 'Emergency' ? '⚡ Emergency' : tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <LeaveHistoryTable requests={filteredRequests} isAdmin={true} />
    </div>
  );
};
