import React from 'react';
import { useApp } from '../../lib/context/AppContext';
import { EmployeeProfileTabs } from '../../components/employees/EmployeeProfileTabs';

export const EmployeeProfilePage: React.FC = () => {
  const { currentUser, employees } = useApp();

  const currentEmp =
    employees.find((e) => e.id === currentUser?.id || e.employeeId === currentUser?.employeeId) ||
    employees[1]; // fallback to Ravi

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">My Personal Profile</h1>
        <p className="text-xs text-[#6B7280]">
          Manage your contact credentials, review job mapping, and verify salary structure
        </p>
      </div>

      <EmployeeProfileTabs employee={currentEmp} isAdmin={false} />
    </div>
  );
};
