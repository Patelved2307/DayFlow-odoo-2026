import React, { useState } from 'react';
import { LeaveRequest } from '../../types';
import { useApp } from '../../lib/context/AppContext';
import { CheckCircle2, XCircle, AlertTriangle, Clock, MessageSquare } from 'lucide-react';

interface LeaveHistoryTableProps {
  requests: LeaveRequest[];
  isAdmin?: boolean;
}

export const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ requests, isAdmin = false }) => {
  const { approveLeaveRequest, rejectLeaveRequest } = useApp();
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Sort emergency first, then pending, then others
  const sorted = [...requests].sort((a, b) => {
    if (a.isEmergency && !b.isEmergency) return -1;
    if (!a.isEmergency && b.isEmergency) return 1;
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  const handleApprove = (id: string) => {
    approveLeaveRequest(id, commentText || undefined);
    setActiveCommentId(null);
    setCommentText('');
  };

  const handleReject = (id: string) => {
    rejectLeaveRequest(id, commentText || undefined);
    setActiveCommentId(null);
    setCommentText('');
  };

  const getStatusBadge = (status: LeaveRequest['status'], isEmergency?: boolean) => {
    if (isEmergency || status === 'Logged') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF6EC] px-2.5 py-0.5 text-xs font-semibold text-[#F2994A] border border-[#F2994A]/20">
          <AlertTriangle className="w-3 h-3" />
          <span>Emergency Logged</span>
        </span>
      );
    }
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF5F0] px-2.5 py-0.5 text-xs font-semibold text-[#1F6D4D] border border-[#1F6D4D]/20">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#FDEEEE] px-2.5 py-0.5 text-xs font-semibold text-[#E5484D] border border-[#E5484D]/20">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1C1F1E]">
          <thead className="bg-[#F4F6F5] text-[#6B7280] font-semibold border-b border-gray-100">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Dates & Duration</th>
              <th className="py-3.5 px-4">Reason / Notes</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Requested On</th>
              {isAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((item) => (
              <React.Fragment key={item.id}>
                <tr className={`hover:bg-gray-50/70 transition-colors ${item.isEmergency ? 'bg-[#FEF6EC]/30' : ''}`}>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.employeeAvatar}
                        alt={item.employeeName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-[#1C1F1E]">{item.employeeName}</div>
                        <div className="text-[11px] text-[#6B7280]">{item.employeeRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#1C1F1E]">{item.type}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[11px] text-[#1C1F1E]">
                      {item.startDate} {item.startDate !== item.endDate && `→ ${item.endDate}`}
                    </div>
                    <div className="text-[11px] text-[#6B7280] font-medium">
                      {item.daysCount} {item.daysCount === 1 || item.daysCount === 0.5 ? 'Day' : 'Days'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="line-clamp-2 text-[#1C1F1E]">{item.reason}</p>
                    {item.adminComment && (
                      <p className="mt-1 text-[11px] text-[#1F6D4D] italic flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 shrink-0" />
                        <span>HR: {item.adminComment}</span>
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(item.status, item.isEmergency)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-500 font-mono text-[11px]">
                    {item.requestedOn}
                  </td>
                  {isAdmin && (
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {item.status === 'Pending' && !item.isEmergency ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              if (activeCommentId === item.id) {
                                setActiveCommentId(null);
                              } else {
                                setActiveCommentId(item.id);
                              }
                            }}
                            className="rounded-lg border border-gray-200 px-2 py-1 text-[11px] text-[#6B7280] hover:bg-gray-100"
                            title="Add comment"
                          >
                            Comment
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="rounded-lg border border-[#E5484D]/30 bg-[#FDEEEE] px-2.5 py-1 text-[11px] font-semibold text-[#E5484D] hover:bg-[#E5484D] hover:text-white transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="rounded-lg bg-[#1F6D4D] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#144933] transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 font-mono">Resolved</span>
                      )}
                    </td>
                  )}
                </tr>

                {/* Inline Comment Box if toggled */}
                {activeCommentId === item.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="py-2.5 px-4">
                      <div className="flex items-center gap-2 max-w-xl ml-auto">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Optional comment for employee..."
                          className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs text-[#1C1F1E] outline-none"
                        />
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="rounded-lg bg-[#1F6D4D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#144933]"
                        >
                          Approve with Comment
                        </button>
                        <button
                          onClick={() => setActiveCommentId(null)}
                          className="rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
