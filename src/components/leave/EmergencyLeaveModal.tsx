import React, { useState } from 'react';
import { AlertTriangle, Clock, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

interface EmergencyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyLeaveModal: React.FC<EmergencyLeaveModalProps> = ({ isOpen, onClose }) => {
  const { submitEmergencyLeave } = useApp();
  const [category, setCategory] = useState<'Medical' | 'Family Emergency' | 'Accident' | 'Personal Urgent' | 'Other'>('Family Emergency');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitEmergencyLeave({ category, note });
      setIsSubmitting(false);
      setNote('');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-[#1C1F1E] shadow-2xl border border-amber-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF6EC] border border-[#F2994A]/30 flex items-center justify-center text-[#F2994A]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                  Emergency Half-Day Leave
                </h3>
                <span className="rounded-full bg-[#FEF6EC] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#F2994A]">
                  Instant Log
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Immediate check-out without approval delay. HR and manager auto-alerted.
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

        {/* Info banner */}
        <div className="mt-4 rounded-xl bg-[#FEF6EC] p-3 border border-[#F2994A]/20 text-xs text-[#1C1F1E]">
          <div className="flex items-center gap-1.5 font-semibold text-[#F2994A]">
            <Clock className="w-3.5 h-3.5" />
            <span>How DayFlow handles emergencies</span>
          </div>
          <p className="mt-1 text-[11px] text-gray-700 leading-relaxed">
            Your workday will be timestamped immediately as <strong>Half-Day (0.5 day)</strong>. You do not need to wait for manager approval before leaving.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
              Emergency Reason Category
            </label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
            >
              <option value="Family Emergency">Family Emergency</option>
              <option value="Medical">Medical / Sudden Illness</option>
              <option value="Accident">Accident / Road Incident</option>
              <option value="Personal Urgent">Personal Urgent Commitment</option>
              <option value="Other">Other Unforeseen Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
              Brief Note for HR & Team Handover <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Taking family member to urgent care clinic. Will check emails later tonight."
              className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-[#1C1F1E] placeholder:text-gray-400 focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
            />
          </div>

          <div className="rounded-xl bg-[#F4F6F5] p-3 flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">Leave Deducted</span>
            <span className="font-mono font-semibold text-[#1C1F1E]">0.5 Day (Paid Balance)</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !note.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-100" />
              <span>{isSubmitting ? 'Logging Emergency...' : 'Confirm & Leave Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
