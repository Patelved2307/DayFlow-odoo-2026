import React, { useState } from 'react';
import { useApp } from '../../lib/context/AppContext';
import { Settings, Bell, Lock, Smartphone, Save, CheckCircle2 } from 'lucide-react';

export const EmployeeSettingsPage: React.FC = () => {
  const { showToast, currentUser } = useApp();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [punchReminders, setPunchReminders] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl text-[#1C1F1E]">Personal Preferences</h1>
        <p className="text-xs text-[#6B7280]">
          Manage notifications, reminders, and profile security settings
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notifications */}
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1F1E] border-b border-gray-100 pb-3">
            <Bell className="w-4 h-4 text-[#1F6D4D]" />
            <span>Alerts & Communications</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div>
                <span className="font-semibold text-[#1C1F1E] block">Email Notifications</span>
                <span className="text-[11px] text-[#6B7280]">
                  Receive leave approval updates and monthly payslip releases
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-[#1F6D4D] rounded-sm focus:ring-[#1F6D4D]"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 cursor-pointer">
              <div>
                <span className="font-semibold text-[#1C1F1E] block">Daily Check-In Reminders</span>
                <span className="text-[11px] text-[#6B7280]">
                  Notify me 10 minutes before standard shift start (08:50 AM)
                </span>
              </div>
              <input
                type="checkbox"
                checked={punchReminders}
                onChange={(e) => setPunchReminders(e.target.checked)}
                className="w-4 h-4 text-[#1F6D4D] rounded-sm focus:ring-[#1F6D4D]"
              />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1C1F1E] border-b border-gray-100 pb-3">
            <Lock className="w-4 h-4 text-[#1F6D4D]" />
            <span>Password & Security</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none focus:border-[#1F6D4D]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#1C1F1E] mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs text-[#1C1F1E] outline-none focus:border-[#1F6D4D]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1F6D4D] hover:bg-[#144933] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#7EC9A0]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
