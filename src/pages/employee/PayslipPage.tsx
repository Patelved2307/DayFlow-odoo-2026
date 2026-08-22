import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { PayslipViewModal } from '../../components/payroll/PayslipViewModal';
import { Payslip } from '../../types';
import { FileText, Download, DollarSign, Calendar, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PayslipPage: React.FC = () => {
  const { payslips, currentUser, showToast } = useApp();
  const [selectedSlip, setSelectedSlip] = useState<Payslip | null>(null);

  const empId = currentUser?.employeeId || 'DF-1002';
  const mySlips = payslips.filter((p) => p.employeeId === empId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">Payslips & Compensation</h1>
          <p className="text-xs text-[#6B7280]">
            Itemized earning statements, tax deductions, and historical pay documents
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F6D4D] bg-[#EBF5F0] px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Direct ACH Transfer Active</span>
        </div>
      </div>

      {/* Latest Payslip Highlight Card */}
      {mySlips[0] && (
        <div className="rounded-3xl bg-[#1F6D4D] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#7EC9A0]">
              Latest Pay Period • {mySlips[0].period}
            </span>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-bold">${mySlips[0].netPay.toLocaleString()}</span>
              <span className="text-xs text-white/70">Net Take-Home Pay</span>
            </div>
            <p className="text-xs text-white/80 mt-1">
              Dispatched on {mySlips[0].paymentDate} • Direct ACH Deposit #{mySlips[0].id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSlip(mySlips[0])}
              className="rounded-xl bg-white text-[#1F6D4D] hover:bg-gray-100 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#1F6D4D]" />
              <span>View Full Payslip</span>
            </button>
            <button
              onClick={() => showToast('Simulated: Downloaded PDF Statement', 'success')}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Payslip History Table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#F4F6F5]/50 flex items-center justify-between">
          <span className="font-display font-bold text-xs text-[#1C1F1E]">All Issued Payslips</span>
          <span className="text-xs text-[#6B7280] font-mono">{mySlips.length} Statements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C1F1E]">
            <thead className="bg-[#F4F6F5] text-[#6B7280] font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Pay Period</th>
                <th className="py-3 px-4">Dispatched Date</th>
                <th className="py-3 px-4">Gross Earnings</th>
                <th className="py-3 px-4">Total Deductions</th>
                <th className="py-3 px-4">Net Take-Home</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mySlips.map((slip) => (
                <tr key={slip.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#1C1F1E]">{slip.period}</td>
                  <td className="py-3.5 px-4 text-[#6B7280]">{slip.paymentDate}</td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1C1F1E]">
                    ${slip.grossEarnings.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#E5484D]">
                    -${slip.totalDeductions.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1F6D4D]">
                    ${slip.netPay.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF5F0] px-2.5 py-0.5 text-[10px] font-bold text-[#1F6D4D]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedSlip(slip)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1F6D4D] hover:underline"
                    >
                      <span>View Breakdown</span>
                      <span>→</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PayslipViewModal
        payslip={selectedSlip}
        isOpen={Boolean(selectedSlip)}
        onClose={() => setSelectedSlip(null)}
      />
    </div>
  );
};
