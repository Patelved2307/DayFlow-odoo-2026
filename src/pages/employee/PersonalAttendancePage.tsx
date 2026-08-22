import React from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import { CheckInCard } from '../../components/dashboard/CheckInCard';
import { Clock, CalendarCheck, ShieldCheck } from 'lucide-react';

export const PersonalAttendancePage: React.FC = () => {
  const { attendanceRecords, currentUser } = useApp();

  const myRecords = attendanceRecords.filter(
    (rec) => rec.employeeId === (currentUser?.employeeId || 'DF-1002')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">My Attendance Records</h1>
          <p className="text-xs text-[#6B7280]">
            Verified check-in timestamps, daily hours worked, and geofence logs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1F6D4D] bg-[#EBF5F0] px-3.5 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Biometric & GPS Validated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceTable records={myRecords} isAdmin={false} />
        </div>
        <div>
          <CheckInCard />
        </div>
      </div>
    </div>
  );
};
