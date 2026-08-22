import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { AttendanceTable } from '../../components/attendance/AttendanceTable';
import {
  Calendar,
  Filter,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const AttendanceRecordsPage: React.FC = () => {
  const { attendanceRecords } = useApp();
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = attendanceRecords.filter((rec) => {
    const matchesDept = departmentFilter === 'All' || rec.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
            Attendance & Workday Logs
          </h1>
          <p className="text-xs text-[#6B7280]">
            Org-wide punch monitoring, geofence verification, and anomaly detection
          </p>
        </div>

        {/* Daily/Weekly Mode Selector */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white p-1 border border-gray-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'daily'
                  ? 'bg-[#1F6D4D] text-white shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#1C1F1E]'
              }`}
            >
              Daily View
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'weekly'
                  ? 'bg-[#1F6D4D] text-white shadow-2xs'
                  : 'text-[#6B7280] hover:text-[#1C1F1E]'
              }`}
            >
              Weekly Rollup
            </button>
          </div>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Calendar className="w-3.5 h-3.5" />
            <input
              type="date"
              defaultValue="2026-08-22"
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#1C1F1E] outline-none"
            />
          </div>

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
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Half-day Emergency">Emergency Half-Day</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#1F6D4D] bg-[#EBF5F0] px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold">Proxy Detector Active: 1 Anomaly Flagged</span>
        </div>
      </div>

      {/* Main Table */}
      <AttendanceTable records={filtered} isAdmin={true} />
    </div>
  );
};
