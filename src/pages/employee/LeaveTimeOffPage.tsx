import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { LeaveBalanceCard } from '../../components/leave/LeaveBalanceCard';
import { LeaveHistoryTable } from '../../components/leave/LeaveHistoryTable';
import { LeaveRequestModal } from '../../components/leave/LeaveRequestModal';
import { EmergencyLeaveModal } from '../../components/leave/EmergencyLeaveModal';
import { Plus, Zap, CalendarDays, ShieldAlert, Sparkles } from 'lucide-react';

export const LeaveTimeOffPage: React.FC = () => {
  const { employeeLeaveBalances, leaveRequests, currentUser } = useApp();
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const empId = currentUser?.employeeId || 'DF-1002';
  const balance = employeeLeaveBalances?.[empId] || {
    paid: 14,
    sick: 7,
    unpaid: 12,
    emergency: 2.5,
  };

  const myHistory = leaveRequests.filter((r) => r.employeeId === empId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Track accrued balances, apply for planned vacation, or log an urgent emergency half-day
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEmergencyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#F2994A]/40 bg-[#FEF6EC] hover:bg-[#F2994A]/20 px-3.5 py-2 text-xs font-bold text-[#F2994A] transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Emergency Half-Day</span>
          </button>

          <button
            onClick={() => setIsApplyOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-4 py-2 text-xs font-bold text-white shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#7EC9A0]" />
            <span>Apply For Leave</span>
          </button>
        </div>
      </div>

      {/* Leave Balance Cards (4 cards with Align Rings) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <LeaveBalanceCard
          title="Paid Annual Leave"
          remaining={balance.paid}
          total={18}
          type="paid"
          description="Accrues 1.5 days/month"
        />

        <LeaveBalanceCard
          title="Sick & Medical Leave"
          remaining={balance.sick}
          total={10}
          type="sick"
          description="Doctor note if > 2 days"
        />

        <LeaveBalanceCard
          title="Emergency Half-Days"
          remaining={balance.emergency}
          total={3.0}
          type="emergency"
          description="Instant log bypass"
        />

        <LeaveBalanceCard
          title="Unpaid Leave Pool"
          remaining={balance.unpaid}
          total={15}
          type="unpaid"
          description="Requires manager review"
        />
      </div>

      {/* Emergency Leave explanation callout */}
      <div className="rounded-2xl bg-linear-to-r from-[#FEF6EC] to-white p-4 border border-[#F2994A]/30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F2994A] text-white flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-[#1C1F1E]">
              What is Emergency Half-Day Leave?
            </h4>
            <p className="text-[11px] text-[#6B7280]">
              DayFlow empowers you to leave immediately when urgent personal matters arise. It automatically logs 0.5 days off and checks you out on the spot without approval delay.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="shrink-0 rounded-xl bg-[#F2994A] text-white font-bold text-xs px-3.5 py-1.5 hover:bg-[#d87c2b] transition-colors cursor-pointer shadow-2xs"
        >
          Use Now
        </button>
      </div>

      {/* History Table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-base text-[#1C1F1E]">
            My Leave Request History
          </h3>
          <span className="text-xs text-[#6B7280] font-mono">{myHistory.length} total entries</span>
        </div>
        <LeaveHistoryTable requests={myHistory} isAdmin={false} />
      </div>

      <LeaveRequestModal isOpen={isApplyOpen} onClose={() => setIsApplyOpen(false)} />
      <EmergencyLeaveModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
    </div>
  );
};
