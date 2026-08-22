import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import {
  Settings,
  Building,
  ShieldCheck,
  Bell,
  Clock,
  Save,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { showToast } = useApp();
  const [orgName, setOrgName] = useState('DayFlow Technologies HQ');
  const [workdayStart, setWorkdayStart] = useState('09:00');
  const [workdayEnd, setWorkdayEnd] = useState('18:00');
  const [gracePeriod, setGracePeriod] = useState('15');
  const [emergencyLeaveQuota, setEmergencyLeaveQuota] = useState('3.0');
  const [geofencingRadius, setGeofencingRadius] = useState('200');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Organization settings & policy rules updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">
          Organization Settings & Policies
        </h1>
        <p className="text-xs text-[#6B7280]">
          Configure attendance thresholds, emergency leave bylaws, geofencing and security
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Info */}
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1F1E] border-b border-gray-100 pb-3">
            <Building className="w-4 h-4 text-[#1F6D4D]" />
            <span>Company Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none focus:border-[#1F6D4D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Headquarters Timezone
              </label>
              <input
                type="text"
                disabled
                readOnly
                value="America/New_York (EST / EDT)"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-[#1C1F1E] disabled:opacity-75"
              />
            </div>
          </div>
        </div>

        {/* Work Hours & Attendance Policy */}
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1F1E] border-b border-gray-100 pb-3">
            <Clock className="w-4 h-4 text-[#1F6D4D]" />
            <span>Attendance & Shift Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Standard Shift Start
              </label>
              <input
                type="time"
                value={workdayStart}
                onChange={(e) => setWorkdayStart(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Standard Shift End
              </label>
              <input
                type="time"
                value={workdayEnd}
                onChange={(e) => setWorkdayEnd(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Grace Period for Late Punch (mins)
              </label>
              <input
                type="number"
                value={gracePeriod}
                onChange={(e) => setGracePeriod(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Office Geofence Radius (meters)
              </label>
              <input
                type="number"
                value={geofencingRadius}
                onChange={(e) => setGeofencingRadius(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">
                Annual Emergency Half-Day Quota (days)
              </label>
              <input
                type="number"
                step="0.5"
                value={emergencyLeaveQuota}
                onChange={(e) => setEmergencyLeaveQuota(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Security & Audit */}
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1F1E] border-b border-gray-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-[#1F6D4D]" />
            <span>Anti-Proxy Security & Audit Trail</span>
          </div>
          <div className="flex items-center justify-between text-xs py-1">
            <div>
              <span className="font-semibold text-[#1C1F1E] block">
                Automatic Anomaly & Buddy Punch Detection
              </span>
              <span className="text-[11px] text-[#6B7280]">
                Flags punches originating from unrecognized IP subnetworks or impossible transit speeds
              </span>
            </div>
            <span className="rounded-full bg-[#EBF5F0] px-3 py-1 text-xs font-bold text-[#1F6D4D]">
              Enabled
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#7EC9A0]" />
            <span>Save Organization Rules</span>
          </button>
        </div>
      </form>
    </div>
  );
};
