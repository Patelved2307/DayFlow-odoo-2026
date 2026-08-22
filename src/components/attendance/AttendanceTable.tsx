import React, { useState } from 'react';
import { AttendanceRecord } from '../../types';
import {
  ShieldAlert,
  MapPin,
  Clock,
  FileSpreadsheet,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  isAdmin?: boolean;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, isAdmin = true }) => {
  const { showToast } = useApp();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Employee,Date,CheckIn,CheckOut,Status,Hours,Location']
        .concat(
          records.map(
            (r) =>
              `"${r.employeeName}","${r.date}","${r.checkIn}","${r.checkOut}","${r.status}","${r.workedHours}","${r.location || 'N/A'}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DayFlow_Attendance_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported as CSV.', 'success');
  };

  const getStatusBadge = (status: AttendanceRecord['status'], hasAnomaly?: boolean) => {
    if (status === 'Half-day Emergency') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF6EC] px-2.5 py-0.5 text-xs font-semibold text-[#F2994A] border border-[#F2994A]/20">
          <AlertTriangle className="w-3 h-3" />
          <span>Emergency Half-Day</span>
        </span>
      );
    }
    if (status === 'Present') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF5F0] px-2.5 py-0.5 text-xs font-semibold text-[#1F6D4D] border border-[#1F6D4D]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F6D4D]" />
          <span>Present</span>
        </span>
      );
    }
    if (status === 'Absent') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#FDEEEE] px-2.5 py-0.5 text-xs font-semibold text-[#E5484D] border border-[#E5484D]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E5484D]" />
          <span>Absent</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-xs overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-[#F4F6F5]/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#1C1F1E]">
            Attendance Records ({records.length} entries)
          </span>
          <span className="rounded-full bg-[#EBF5F0] px-2 py-0.5 text-[10px] font-bold text-[#1F6D4D]">
            Geofence Synchronized
          </span>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#1C1F1E] hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[#1F6D4D]" />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#1C1F1E]">
          <thead className="bg-[#F4F6F5] text-[#6B7280] font-semibold border-b border-gray-100">
            <tr>
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Check-In</th>
              <th className="py-3.5 px-4">Check-Out</th>
              <th className="py-3.5 px-4">Hours Logged</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((item) => {
              const isExpanded = expandedRowId === item.id;

              return (
                <React.Fragment key={item.id}>
                  <tr
                    onClick={() => toggleRow(item.id)}
                    className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${
                      item.hasAnomaly ? 'bg-rose-50/40' : item.status === 'Half-day Emergency' ? 'bg-[#FEF6EC]/30' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.employeeAvatar}
                          alt={item.employeeName}
                          className="w-8 h-8 rounded-full object-cover border border-gray-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-semibold text-[#1C1F1E] flex items-center gap-1.5">
                            <span>{item.employeeName}</span>
                            {item.hasAnomaly && (
                              <span
                                title="Proxy Attendance Detector Flagged this row"
                                className="text-[#E5484D] inline-flex items-center"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#6B7280]">{item.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1C1F1E]">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1C1F1E]">
                      {item.checkIn}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1C1F1E]">
                      {item.checkOut}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#1C1F1E]">
                      {item.workedHours > 0 ? `${item.workedHours} hrs` : '--'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status, item.hasAnomaly)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Row with location and emergency/anomaly notes */}
                  {isExpanded && (
                    <tr className="bg-gray-50/80">
                      <td colSpan={7} className="py-3 px-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#1F6D4D]" />
                            <span className="text-[#6B7280]">Punch Verification Location:</span>
                            <span className="font-semibold text-[#1C1F1E]">
                              {item.location || 'Main HQ Geofence (Latitude 37.7749, Longitude -122.4194)'}
                            </span>
                          </div>

                          {item.emergencyNote && (
                            <div className="rounded-lg bg-[#FEF6EC] border border-[#F2994A]/30 px-3 py-1.5 text-xs text-[#1C1F1E] flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-[#F2994A]" />
                              <span>Emergency Note: {item.emergencyNote}</span>
                            </div>
                          )}

                          {item.hasAnomaly && (
                            <div className="rounded-lg bg-[#FDEEEE] border border-[#E5484D]/30 px-3 py-1.5 text-xs text-[#E5484D] flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" />
                              <span>Proxy Detector Warning: {item.anomalyReason}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
