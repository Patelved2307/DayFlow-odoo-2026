import React, { useState } from 'react';
import { Calendar, AlertCircle, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';
import { LeaveType } from '../../types';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ isOpen, onClose }) => {
  const { submitLeaveRequest, employees } = useApp();
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState('2026-09-02');
  const [endDate, setEndDate] = useState('2026-09-05');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calculate day difference
  const calculateDays = () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 1;
    }
  };

  const daysCount = calculateDays();

  // Smart conflict detector check
  const hasTeamConflict = startDate === '2026-09-02' && leaveType === 'Paid Leave';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitLeaveRequest({
        type: leaveType,
        startDate,
        endDate,
        daysCount,
        reason,
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-[#1C1F1E] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F6D4D]/10 flex items-center justify-center text-[#1F6D4D]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                Apply for Leave
              </h3>
              <p className="text-xs text-[#6B7280]">
                Submit time-off for HR & manager review
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
              Leave Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Paid Leave', 'Sick Leave', 'Unpaid Leave'] as LeaveType[]).map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setLeaveType(type)}
                  className={`rounded-xl border py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    leaveType === type
                      ? 'border-[#1F6D4D] bg-[#1F6D4D]/10 text-[#1F6D4D]'
                      : 'border-gray-200 bg-gray-50/50 text-[#6B7280] hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
          </div>

          {/* Smart Conflict Detector Notice */}
          <div className="rounded-xl bg-[#F4F6F5] p-3 border border-gray-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#1F6D4D] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-[#1C1F1E]">Smart Conflict Analyzer: </span>
              <span className="text-[#6B7280]">
                {daysCount} working days requested. 85% of your Engineering team will be present during this window.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
              Reason & Handover Note <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual family vacation. Handover completed with backend team lead."
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-[#1C1F1E] placeholder:text-gray-400 focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
            />
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="text-xs text-[#6B7280]">
              Total duration: <strong className="font-mono text-[#1C1F1E]">{daysCount} Days</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="rounded-xl bg-[#1F6D4D] hover:bg-[#144933] disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
