import React from 'react';
import { useApp } from '../../lib/context/AppContext';
import { EmployeeProfileTabs } from '../../components/employees/EmployeeProfileTabs';
import { ArrowLeft } from 'lucide-react';

export const EmployeeProfilePage: React.FC = () => {
  const { employees, selectedEmployeeId, setCurrentView } = useApp();

  const employee = employees.find((e) => e.id === selectedEmployeeId) || employees[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('admin-employees')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#1C1F1E] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </button>
        <span className="text-xs text-[#6B7280]">• Master Employee Record</span>
      </div>

      <EmployeeProfileTabs employee={employee} isAdmin={true} />
    </div>
  );
};
