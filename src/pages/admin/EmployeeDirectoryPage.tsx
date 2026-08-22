import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AddEmployeeModal } from '../../components/employees/AddEmployeeModal';
import {
  Search,
  Filter,
  UserPlus,
  ArrowUpRight,
  Mail,
  Phone,
  Building,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const EmployeeDirectoryPage: React.FC = () => {
  const { employees, setSelectedEmployeeId, setCurrentView } = useApp();
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.todayStatus === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenProfile = (empId: string) => {
    setSelectedEmployeeId(empId);
    setCurrentView('admin-employee-profile');
  };

  const getStatusDot = (status: string) => {
    if (status === 'Present') return 'bg-[#1F6D4D] ring-2 ring-[#7EC9A0]/40';
    if (status === 'Absent') return 'bg-[#E5484D]';
    if (status === 'Emergency Leave') return 'bg-[#F2994A] animate-pulse';
    return 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
            Employee Master Directory
          </h1>
          <p className="text-xs text-[#6B7280]">
            Manage {employees.length} team members, compensation structures, and records
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#7EC9A0]" />
          <span>+ Add Employee</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, employee ID, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4F6F5] border border-transparent focus:border-gray-300 focus:bg-white text-xs text-[#1C1F1E] outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#1C1F1E] outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="People & HR">People & HR</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#1C1F1E] outline-none"
          >
            <option value="All">All Today Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Emergency Leave">Emergency Leave</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => {
          const gross =
            emp.salary.monthlyBasic +
            emp.salary.allowances.hra +
            emp.salary.allowances.da +
            emp.salary.allowances.travel +
            emp.salary.allowances.special;
          const deductions =
            emp.salary.deductions.pf + emp.salary.deductions.tax + emp.salary.deductions.insurance;
          const net = gross - deductions;

          return (
            <div
              key={emp.id}
              onClick={() => handleOpenProfile(emp.id)}
              className="group rounded-2xl bg-white p-5 border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="relative">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                      referrerPolicy="no-referrer"
                    />
                    <span
                      title={`Today: ${emp.todayStatus}`}
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusDot(
                        emp.todayStatus
                      )}`}
                    />
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold text-[#6B7280] block">
                      {emp.employeeId}
                    </span>
                    <span className="inline-block mt-0.5 rounded-full bg-[#F4F6F5] px-2 py-0.5 text-[10px] font-semibold text-[#1C1F1E]">
                      {emp.department}
                    </span>
                  </div>
                </div>

                {/* Name & Role */}
                <div className="mt-3">
                  <h3 className="font-display font-bold text-base text-[#1C1F1E] group-hover:text-[#1F6D4D] transition-colors flex items-center justify-between">
                    <span>{emp.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#1F6D4D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </h3>
                  <p className="text-xs text-[#6B7280] mt-0.5">{emp.role}</p>
                </div>

                {/* Today Status Pill */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[#6B7280]">Today's Status:</span>
                  <span
                    className={`font-semibold ${
                      emp.todayStatus === 'Present'
                        ? 'text-[#1F6D4D]'
                        : emp.todayStatus === 'Emergency Leave'
                        ? 'text-[#F2994A]'
                        : emp.todayStatus === 'Absent'
                        ? 'text-[#E5484D]'
                        : 'text-gray-600'
                    }`}
                  >
                    {emp.todayStatus} {emp.checkInTime && `(${emp.checkInTime})`}
                  </span>
                </div>
              </div>

              {/* Salary Preview */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs bg-[#F4F6F5]/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <div>
                  <span className="text-[11px] text-[#6B7280] block">Net Pay</span>
                  <span className="font-mono font-bold text-sm text-[#1F6D4D]">
                    ${net.toLocaleString()}/mo
                  </span>
                </div>
                <span className="text-[11px] text-[#1F6D4D] font-semibold group-hover:underline">
                  View Record →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
