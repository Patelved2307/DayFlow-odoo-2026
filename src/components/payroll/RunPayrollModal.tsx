import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

interface RunPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RunPayrollModal: React.FC<RunPayrollModalProps> = ({ isOpen, onClose }) => {
  const { employees, generateAndPublishPayslips } = useApp();
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'review' | 'success'>('review');

  if (!isOpen) return null;

  const totalMonthlyCost = employees.reduce((sum, emp) => {
    const gross =
      emp.salary.monthlyBasic +
      emp.salary.allowances.hra +
      emp.salary.allowances.da +
      emp.salary.allowances.travel +
      emp.salary.allowances.special;
    return sum + gross;
  }, 0);

  const handleFinalizeAndPublish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      generateAndPublishPayslips(selectedMonth);
      setIsProcessing(false);
      setStep('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 text-[#1C1F1E] shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1F6D4D]/10 flex items-center justify-center text-[#1F6D4D]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                Run Payroll Calculation
              </h3>
              <p className="text-xs text-[#6B7280]">
                Attendance-synchronized salary calculation & payslip generator
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

        {step === 'review' ? (
          <div className="mt-4 space-y-4">
            {/* Cycle selector */}
            <div className="flex items-center justify-between rounded-xl bg-[#F4F6F5] p-3">
              <div>
                <span className="text-xs text-[#6B7280]">Payroll Processing Cycle</span>
                <div className="font-semibold text-sm text-[#1C1F1E]">{selectedMonth}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6B7280]">Total Gross Expense</span>
                <div className="font-mono font-bold text-base text-[#1F6D4D]">
                  ${totalMonthlyCost.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Anomaly Pre-check list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1C1F1E]">
                  Anomaly Audit & Compliance Verification
                </span>
                <span className="text-[11px] font-medium text-[#1F6D4D] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified 8 Employees</span>
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between rounded-xl border border-gray-100 p-3 bg-white text-xs">
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1F6D4D] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#1C1F1E]">
                        Aman Verma — 0.5 Day Emergency Leave Logged
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Deducted from Paid Leave allocation. Zero Loss of Pay (LOP) impact.
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-gray-700">Auto-balanced</span>
                </div>

                <div className="flex items-start justify-between rounded-xl border border-amber-200 bg-[#FEF6EC] p-3 text-xs">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F2994A] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#1C1F1E]">
                        Liam O’Connor — 1 Absent Day on Record
                      </div>
                      <div className="text-[11px] text-[#6B7280]">
                        Adjusted payable days to 30/31. Loss of Pay deduction applied automatically.
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#F2994A]">Review Confirmed</span>
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Clicking <strong>Finalize & Publish</strong> will generate verifiable PDF payslips for all {employees.length} employees and make them immediately viewable inside their employee portals.
            </p>

            <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalizeAndPublish}
                disabled={isProcessing}
                className="rounded-xl bg-[#1F6D4D] hover:bg-[#144933] disabled:opacity-50 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#7EC9A0]" />
                <span>{isProcessing ? 'Processing Payroll...' : 'Finalize & Publish Payslips'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center py-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF5F0] text-[#1F6D4D] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-[#1C1F1E]">
              Payroll Published Successfully
            </h4>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
              Payslips for {selectedMonth} have been generated and dispatched to all {employees.length} employee accounts.
            </p>
            <button
              onClick={() => {
                setStep('review');
                onClose();
              }}
              className="mt-4 rounded-xl bg-[#1F6D4D] px-6 py-2 text-xs font-semibold text-white hover:bg-[#144933]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
