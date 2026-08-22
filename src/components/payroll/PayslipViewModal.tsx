import React from 'react';
import { Payslip } from '../../types';
import { Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

interface PayslipViewModalProps {
  payslip: Payslip | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PayslipViewModal: React.FC<PayslipViewModalProps> = ({
  payslip,
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp();

  if (!isOpen || !payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast(`Downloading Payslip #${payslip.payslipNumber} as PDF...`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 md:p-8 text-[#1C1F1E] shadow-2xl">
        {/* Actions header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#EBF5F0] px-2.5 py-0.5 text-xs font-bold text-[#1F6D4D]">
              Verified & Published
            </span>
            <span className="font-mono text-xs text-[#6B7280]">
              Ref: {payslip.payslipNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#1C1F1E] hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F6D4D] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#144933] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="mt-6 border border-gray-200 rounded-2xl p-6 bg-white print:border-none print:p-0">
          {/* Company Branding */}
          <div className="flex items-start justify-between border-b border-gray-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#1F6D4D] text-white font-bold flex items-center justify-center font-display text-sm">
                  DF
                </div>
                <h2 className="font-display font-bold text-xl text-[#1C1F1E]">DayFlow Inc.</h2>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">
                100 Innovation Boulevard, Tech Park, CA 94107
              </p>
              <p className="text-[11px] text-[#6B7280]">Corporate Tax ID: US-994-8291-DF</p>
            </div>
            <div className="text-right">
              <h3 className="font-display font-bold text-base text-[#1F6D4D]">
                PAYSLIP FOR {payslip.month.toUpperCase()}
              </h3>
              <p className="font-mono text-xs text-[#6B7280] mt-0.5">Period: {payslip.period}</p>
              <p className="font-mono text-xs text-[#6B7280]">Pay Date: {payslip.paymentDate}</p>
            </div>
          </div>

          {/* Employee Metadata */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl bg-[#F4F6F5] p-4 text-xs">
            <div>
              <span className="text-[#6B7280] block text-[11px]">Employee Name</span>
              <span className="font-semibold text-[#1C1F1E]">{payslip.employeeName}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Employee ID</span>
              <span className="font-mono font-semibold text-[#1C1F1E]">{payslip.employeeId}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Department / Role</span>
              <span className="font-semibold text-[#1C1F1E]">{payslip.department}</span>
            </div>
            <div>
              <span className="text-[#6B7280] block text-[11px]">Payable Days / Present</span>
              <span className="font-mono font-semibold text-[#1C1F1E]">
                {payslip.payableDays} Days ({payslip.presentDays} Pres.)
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#EBF5F0] px-4 py-2.5 font-semibold text-xs text-[#1F6D4D] flex justify-between">
                <span>EARNINGS</span>
                <span>AMOUNT ($)</span>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Basic Salary</span>
                  <span className="font-mono font-semibold text-[#1C1F1E]">
                    ${payslip.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">House Rent Allowance (HRA)</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.allowances.hra.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Dearness Allowance (DA)</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.allowances.da.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Travel Allowance</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.allowances.travel.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Special Allowance</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.allowances.special.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2.5 font-bold text-xs text-[#1C1F1E] flex justify-between border-t border-gray-100">
                <span>Gross Earnings</span>
                <span className="font-mono text-[#1F6D4D]">
                  ${payslip.grossEarnings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Deductions */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#FDEEEE] px-4 py-2.5 font-semibold text-xs text-[#E5484D] flex justify-between">
                <span>DEDUCTIONS</span>
                <span>AMOUNT ($)</span>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Provident Fund (PF)</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.deductions.pf.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Income Tax (Withholding)</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.deductions.tax.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between">
                  <span className="text-gray-700">Health & Life Insurance</span>
                  <span className="font-mono text-[#1C1F1E]">
                    ${payslip.deductions.insurance.toLocaleString()}
                  </span>
                </div>
                <div className="px-4 py-2 flex justify-between text-gray-400 italic">
                  <span>Loss of Pay (LOP)</span>
                  <span className="font-mono">$0</span>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2.5 font-bold text-xs text-[#1C1F1E] flex justify-between border-t border-gray-100">
                <span>Total Deductions</span>
                <span className="font-mono text-[#E5484D]">
                  ${payslip.totalDeductions.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight */}
          <div className="mt-6 rounded-xl bg-[#1F6D4D] text-white p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7EC9A0] font-semibold uppercase tracking-wider">
                Total Net Payable Pay
              </span>
              <p className="text-[11px] text-white/80 mt-0.5">
                Directly credited to linked corporate bank account
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-white">
                ${payslip.netPay.toLocaleString()}
              </span>
              <span className="block text-[11px] text-[#7EC9A0]">USD Net Salary</span>
            </div>
          </div>

          {/* Audit seal */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F6D4D]" />
              <span>Digitally encrypted and compliance-checked by DayFlow Payroll Core.</span>
            </div>
            <span className="font-mono">Generated: {payslip.generatedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
