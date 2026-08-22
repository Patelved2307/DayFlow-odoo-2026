import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { RunPayrollModal } from '../../components/payroll/RunPayrollModal';
import { PayslipViewModal } from '../../components/payroll/PayslipViewModal';
import { Payslip } from '../../types';
import {
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  FileText,
  TrendingUp,
  Download,
  AlertCircle,
} from 'lucide-react';

export const PayrollOverviewPage: React.FC = () => {
  const { employees, payslips, showToast } = useApp();
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);

  // Total payroll cost calculation
  const totalMonthlyGross = employees.reduce((sum, emp) => {
    const gross =
      emp.salary.monthlyBasic +
      emp.salary.allowances.hra +
      emp.salary.allowances.da +
      emp.salary.allowances.travel +
      emp.salary.allowances.special;
    return sum + gross;
  }, 0);

  const totalMonthlyNet = employees.reduce((sum, emp) => {
    const gross =
      emp.salary.monthlyBasic +
      emp.salary.allowances.hra +
      emp.salary.allowances.da +
      emp.salary.allowances.travel +
      emp.salary.allowances.special;
    const deductions =
      emp.salary.deductions.pf + emp.salary.deductions.tax + emp.salary.deductions.insurance;
    return sum + (gross - deductions);
  }, 0);

  const handleOpenPayslip = (empId: string) => {
    const slip = payslips.find((p) => p.employeeId === empId) || payslips[0];
    setSelectedPayslip(slip);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
            Payroll & Salary Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Attendance-synchronized compensation calculations, tax deductions, and payslips
          </p>
        </div>

        <button
          onClick={() => setIsRunModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#7EC9A0]" />
          <span>Run August Payroll</span>
        </button>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">Total Monthly Payroll Cost</span>
          <div className="mt-2 font-mono text-3xl font-bold text-[#1C1F1E]">
            ${totalMonthlyNet.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center justify-between text-xs text-[#6B7280]">
            <span>Gross: ${totalMonthlyGross.toLocaleString()}</span>
            <span className="text-[#1F6D4D] font-medium">+0% vs forecast</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">Next Scheduled Pay Date</span>
          <div className="mt-2 font-mono text-2xl font-bold text-[#1F6D4D]">
            01 September 2026
          </div>
          <div className="mt-1 text-xs text-[#6B7280]">
            Direct ACH batch deposit queued
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-xs">
          <span className="text-xs font-semibold text-[#6B7280]">Employees Pending Setup</span>
          <div className="mt-2 font-mono text-3xl font-bold text-[#1C1F1E]">
            0
          </div>
          <div className="mt-1 text-xs text-[#1F6D4D] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Compensation structures verified</span>
          </div>
        </div>
      </div>

      {/* Master Employee Payroll Table */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-[#F4F6F5]/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#1C1F1E]">
            Employee Salary Breakdown & Payslip Index
          </span>
          <span className="text-[11px] font-mono text-[#6B7280]">
            Cycle: 01 Aug 2026 - 31 Aug 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1C1F1E]">
            <thead className="bg-[#F4F6F5] text-[#6B7280] font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Basic Salary</th>
                <th className="py-3.5 px-4">Allowances</th>
                <th className="py-3.5 px-4">Deductions (PF+Tax)</th>
                <th className="py-3.5 px-4">Net Monthly Pay</th>
                <th className="py-3.5 px-4 text-right">Payslip Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((emp) => {
                const allowancesTotal =
                  emp.salary.allowances.hra +
                  emp.salary.allowances.da +
                  emp.salary.allowances.travel +
                  emp.salary.allowances.special;
                const deductionsTotal =
                  emp.salary.deductions.pf +
                  emp.salary.deductions.tax +
                  emp.salary.deductions.insurance;
                const net = emp.salary.monthlyBasic + allowancesTotal - deductionsTotal;

                return (
                  <tr key={emp.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-semibold text-[#1C1F1E]">{emp.name}</div>
                          <div className="font-mono text-[10px] text-[#6B7280]">
                            {emp.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280]">{emp.department}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#1C1F1E]">
                      ${emp.salary.monthlyBasic.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#1F6D4D]">
                      +${allowancesTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#E5484D]">
                      -${deductionsTotal.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-sm text-[#1F6D4D]">
                      ${net.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenPayslip(emp.employeeId)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#1C1F1E] hover:bg-gray-50 transition-colors cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-[#1F6D4D]" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <RunPayrollModal isOpen={isRunModalOpen} onClose={() => setIsRunModalOpen(false)} />
      <PayslipViewModal
        payslip={selectedPayslip}
        isOpen={Boolean(selectedPayslip)}
        onClose={() => setSelectedPayslip(null)}
      />
    </div>
  );
};
