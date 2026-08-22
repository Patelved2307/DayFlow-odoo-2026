import React from 'react';
import { ActivityItem } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, FileText, UserPlus, Zap } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'check_in':
      case 'check_out':
        return <Clock className="w-3.5 h-3.5 text-[#1F6D4D]" />;
      case 'emergency_leave':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#F2994A]" />;
      case 'leave_approved':
        return <CheckCircle2 className="w-3.5 h-3.5 text-[#1F6D4D]" />;
      case 'leave_rejected':
        return <AlertTriangle className="w-3.5 h-3.5 text-[#E5484D]" />;
      case 'payroll_run':
        return <Zap className="w-3.5 h-3.5 text-[#1F6D4D]" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-[#6B7280]" />;
    }
  };

  const getPill = (type: ActivityItem['type']) => {
    switch (type) {
      case 'emergency_leave':
        return (
          <span className="rounded-full bg-[#FEF6EC] px-2 py-0.5 text-[10px] font-semibold text-[#F2994A]">
            Emergency
          </span>
        );
      case 'check_in':
        return (
          <span className="rounded-full bg-[#EBF5F0] px-2 py-0.5 text-[10px] font-semibold text-[#1F6D4D]">
            Punch In
          </span>
        );
      case 'check_out':
        return (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]">
            Punch Out
          </span>
        );
      case 'leave_applied':
        return (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
            Leave Req
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <h3 className="font-display font-bold text-sm text-[#1C1F1E]">
            Recent Employee Activity
          </h3>
          <p className="text-xs text-[#6B7280]">Live feed of workday events</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#1F6D4D]">
          <span className="w-2 h-2 rounded-full bg-[#1F6D4D] animate-ping" />
          <span>Real-time</span>
        </div>
      </div>

      <div className="mt-3 divide-y divide-gray-50 max-h-72 overflow-y-auto pr-1">
        {activities.slice(0, 6).map((item) => (
          <div key={item.id} className="py-2.5 flex items-start gap-3 group hover:bg-gray-50/60 rounded-xl px-2 transition-colors">
            <div className="relative shrink-0">
              <img
                src={item.employeeAvatar}
                alt={item.employeeName}
                className="w-8 h-8 rounded-full object-cover border border-gray-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-xs">
                {getIcon(item.type)}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[#1C1F1E] truncate">
                  {item.employeeName}
                </span>
                <span className="font-mono text-[10px] text-gray-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] line-clamp-1 mt-0.5">
                {item.title}
              </p>
            </div>

            {getPill(item.type)}
          </div>
        ))}
      </div>
    </div>
  );
};
