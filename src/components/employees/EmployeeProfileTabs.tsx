import React, { useState } from 'react';
import { Employee } from '../../types';
import { useApp } from '../../lib/context/AppContext';
import {
  User,
  Briefcase,
  DollarSign,
  FileText,
  Save,
  UserX,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Building,
  Upload,
} from 'lucide-react';

interface EmployeeProfileTabsProps {
  employee: Employee;
  isAdmin?: boolean;
}

export const EmployeeProfileTabs: React.FC<EmployeeProfileTabsProps> = ({
  employee,
  isAdmin = true,
}) => {
  const { updateEmployee, deactivateEmployee, showToast, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'salary'>('personal');

  // Editable local state
  const [phone, setPhone] = useState(employee.phone);
  const [address, setAddress] = useState(employee.address);
  const [role, setRole] = useState(employee.role);
  const [department, setDepartment] = useState(employee.department);
  const [manager, setManager] = useState(employee.manager);
  const [status, setStatus] = useState(employee.status);

  // Salary state
  const [monthlyBasic, setMonthlyBasic] = useState<number>(employee.salary.monthlyBasic);
  const [hra, setHra] = useState<number>(employee.salary.allowances.hra);
  const [da, setDa] = useState<number>(employee.salary.allowances.da);
  const [travel, setTravel] = useState<number>(employee.salary.allowances.travel);
  const [special, setSpecial] = useState<number>(employee.salary.allowances.special);
  const [pf, setPf] = useState<number>(employee.salary.deductions.pf);
  const [tax, setTax] = useState<number>(employee.salary.deductions.tax);
  const [insurance, setInsurance] = useState<number>(employee.salary.deductions.insurance);

  // Live recalculation when monthly basic changes
  const handleBasicChange = (newBasic: number) => {
    setMonthlyBasic(newBasic);
    // Auto-update default proportional allowances & deductions
    setHra(Math.round(newBasic * 0.4));
    setDa(Math.round(newBasic * 0.1));
    setPf(Math.round(newBasic * 0.12));
    setTax(Math.round(newBasic * 0.15));
  };

  const grossEarnings = monthlyBasic + hra + da + travel + special;
  const totalDeductions = pf + tax + insurance;
  const netPay = grossEarnings - totalDeductions;

  const handleSave = () => {
    updateEmployee(employee.id, {
      phone,
      address,
      role: isAdmin ? role : employee.role,
      department: isAdmin ? department : employee.department,
      manager: isAdmin ? manager : employee.manager,
      status: isAdmin ? status : employee.status,
      salary: isAdmin
        ? {
            monthlyBasic,
            yearlyBasic: monthlyBasic * 12,
            allowances: { hra, da, travel, special },
            deductions: { pf, tax, insurance },
          }
        : employee.salary,
    });
  };

  const handleDeactivate = () => {
    if (confirm(`Move ${employee.name} to the Offboarding workflow?`)) {
      deactivateEmployee(employee.id);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-[#1C1F1E]">{employee.name}</h2>
              <span className="rounded-full bg-[#EBF5F0] px-2.5 py-0.5 text-xs font-bold text-[#1F6D4D]">
                {employee.status}
              </span>
            </div>
            <div className="text-xs text-[#6B7280] flex items-center gap-3 mt-1">
              <span className="font-mono">{employee.employeeId}</span>
              <span>•</span>
              <span>{employee.role}</span>
              <span>•</span>
              <span>{employee.department}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && employee.status !== 'Offboarded' && (
            <button
              onClick={handleDeactivate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-[#E5484D] hover:bg-rose-50 transition-colors"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Deactivate / Offboard</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-[#7EC9A0]" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 px-1">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'personal'
              ? 'border-b-2 border-[#1F6D4D] text-[#1F6D4D]'
              : 'text-[#6B7280] hover:text-[#1C1F1E]'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>

        <button
          onClick={() => setActiveTab('job')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'job'
              ? 'border-b-2 border-[#1F6D4D] text-[#1F6D4D]'
              : 'text-[#6B7280] hover:text-[#1C1F1E]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Job Details</span>
        </button>

        <button
          onClick={() => setActiveTab('salary')}
          className={`pb-3 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === 'salary'
              ? 'border-b-2 border-[#1F6D4D] text-[#1F6D4D]'
              : 'text-[#6B7280] hover:text-[#1C1F1E]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Salary & Payroll Info</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-sm text-[#1C1F1E]">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  readOnly
                  value={employee.name}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Work Email</label>
                <input
                  type="email"
                  disabled={!isAdmin}
                  readOnly
                  value={employee.email}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] disabled:opacity-75"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Phone Number {isAdmin && <span className="text-[#1F6D4D]">(Editable)</span>}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-bold text-sm text-[#1C1F1E]">Verified Documents</h3>
              {isAdmin && (
                <button
                  onClick={() => showToast('Document upload dialog simulated.', 'info')}
                  className="text-xs text-[#1F6D4D] font-semibold hover:underline flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </button>
              )}
            </div>
            <div className="space-y-2.5">
              {employee.documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-[#F4F6F5] p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#1F6D4D]" />
                    <div>
                      <div className="font-semibold text-[#1C1F1E] truncate max-w-[140px]">
                        {doc.name}
                      </div>
                      <div className="text-[10px] text-[#6B7280]">{doc.size} • Verified</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Opening ${doc.name}`, 'info')}
                    className="text-[11px] font-semibold text-[#1F6D4D] hover:underline"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'job' && (
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-sm text-[#1C1F1E]">Employment & Role Mapping</h3>
            {!isAdmin && (
              <span className="text-xs text-[#6B7280] italic">
                Role and manager details are managed by HR.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Job Designation</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Department</label>
              <select
                disabled={!isAdmin}
                value={department}
                onChange={(e: any) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Marketing">Marketing</option>
                <option value="People & HR">People & HR</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Reporting Manager</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Date of Joining</label>
              <input
                type="date"
                disabled={!isAdmin}
                readOnly
                value={employee.dateOfJoining}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Employment Status</label>
              <select
                disabled={!isAdmin}
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white disabled:bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="Notice Period">Notice Period</option>
                <option value="Offboarded">Offboarded</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="space-y-5">
          {/* Salary Structure Card */}
          <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-sm text-[#1C1F1E]">
                  Compensation & Salary Structure
                </h3>
                <p className="text-xs text-[#6B7280]">
                  {isAdmin
                    ? 'Editing Monthly Basic instantly updates proportional allowances and deductions.'
                    : 'Your verified compensation record for the current pay cycle.'}
                </p>
              </div>
              {!isAdmin && (
                <button
                  onClick={() => setCurrentView('emp-payslips')}
                  className="text-xs font-semibold text-[#1F6D4D] hover:underline"
                >
                  View Payslips →
                </button>
              )}
            </div>

            {/* Basic Salary control */}
            <div className="rounded-xl bg-[#F4F6F5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-[#1C1F1E]">Monthly Basic Salary</span>
                <span className="block text-[11px] text-[#6B7280]">Base calculation for PF & HRA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-500">$</span>
                <input
                  type="number"
                  disabled={!isAdmin}
                  value={monthlyBasic}
                  onChange={(e) => handleBasicChange(Number(e.target.value))}
                  className="w-36 rounded-xl border border-gray-300 bg-white disabled:bg-gray-100 px-3 py-2 font-mono text-base font-bold text-[#1C1F1E] focus:border-[#1F6D4D] outline-none"
                />
                <span className="text-xs text-[#6B7280]">/ month</span>
              </div>
            </div>

            {/* Breakdown inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Allowances */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F6D4D]">
                  Allowances (Earnings)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">House Rent Allowance (HRA - 40%)</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${hra}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Dearness Allowance (DA - 10%)</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${da}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Travel Allowance</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${travel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Special Allowance</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${special}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5484D]">
                  Deductions (Withholding)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Provident Fund (PF - 12%)</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${pf}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Income Tax (Est. 15%)</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${tax}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B7280]">Health & Life Insurance</span>
                    <span className="font-mono font-semibold text-[#1C1F1E]">${insurance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Net Pay Preview */}
            <div className="rounded-xl bg-[#1F6D4D] p-4 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7EC9A0] font-semibold uppercase tracking-wider">
                  Live Net Pay Preview
                </span>
                <p className="text-[11px] text-white/80">
                  Gross ${grossEarnings.toLocaleString()} − Deductions ${totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-2xl font-bold text-white">
                  ${netPay.toLocaleString()}
                </span>
                <span className="block text-[11px] text-[#7EC9A0]">/ month</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
