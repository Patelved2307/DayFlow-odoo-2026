import React, { useState } from 'react';
import { UserPlus, Sparkles, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState<'Engineering' | 'Design' | 'Product' | 'Marketing' | 'People & HR' | 'Operations' | 'Finance'>('Engineering');
  const [monthlyBasic, setMonthlyBasic] = useState<number>(7500);
  const [manager, setManager] = useState('Eleanor Vance');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      addEmployee({
        name,
        email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@dayflow.work`,
        role: role || 'Team Member',
        department,
        manager,
        salary: {
          monthlyBasic,
          yearlyBasic: monthlyBasic * 12,
          allowances: {
            hra: Math.round(monthlyBasic * 0.4),
            da: Math.round(monthlyBasic * 0.1),
            travel: 500,
            special: 800,
          },
          deductions: {
            pf: Math.round(monthlyBasic * 0.12),
            tax: Math.round(monthlyBasic * 0.15),
            insurance: 250,
          },
        },
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1F1E]">
                Add New Employee
              </h3>
              <p className="text-xs text-[#6B7280]">
                Creates profile and dispatches automated login onboarding email
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Maya Lin"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!email) {
                    setEmail(`${e.target.value.toLowerCase().replace(/\s+/g, '.')}@dayflow.work`);
                  }
                }}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Work Email Address
              </label>
              <input
                type="email"
                placeholder="name@dayflow.work"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Job Title / Role <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Full Stack Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e: any) => setDepartment(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Reporting Manager
              </label>
              <input
                type="text"
                value={manager}
                onChange={(e) => setManager(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Monthly Basic Salary ($)
              </label>
              <input
                type="number"
                value={monthlyBasic}
                onChange={(e) => setMonthlyBasic(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] font-mono focus:border-[#1F6D4D] focus:ring-1 focus:ring-[#1F6D4D] outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[#F4F6F5] p-3 border border-gray-200 text-xs">
            <div className="flex items-center gap-1.5 text-[#1F6D4D] font-semibold">
              <Mail className="w-3.5 h-3.5" />
              <span>Automated Credential Dispatch</span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-1">
              A temporary secure password will be generated and dispatched to the employee's email. They will set their custom password upon first login.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-[#6B7280] hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="rounded-xl bg-[#1F6D4D] hover:bg-[#144933] disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
            >
              {isSubmitting ? 'Creating Employee...' : 'Add & Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
