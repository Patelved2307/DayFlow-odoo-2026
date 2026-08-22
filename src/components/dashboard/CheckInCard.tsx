import React, { useState } from 'react';
import { Play, Pause, Square, Clock, MapPin } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

export const CheckInCard: React.FC = () => {
  const { isCheckedIn, checkInTime, checkIn, checkOut, workedSeconds } = useApp();

  const formatHours = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#144933] text-white p-6 shadow-2xs h-full flex flex-col justify-between transition-all duration-200">
      {/* Background glow */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#7EC9A0]/15 blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white/70">Time Tracker</span>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#7EC9A0]">
            <span
              className={`w-2 h-2 rounded-full ${
                isCheckedIn ? 'bg-[#7EC9A0] animate-pulse' : 'bg-gray-300'
              }`}
            />
            {isCheckedIn ? 'In Progress' : 'Paused'}
          </div>
        </div>

        <div className="mt-5 text-center">
          <div className="font-mono text-4xl font-bold tracking-tight text-white">
            {formatHours(workedSeconds)}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/70">
            <MapPin className="w-3.5 h-3.5 text-[#7EC9A0]" />
            <span>
              {isCheckedIn ? `Punch: ${checkInTime || '09:00 AM'} · HQ Geofence` : 'Shift Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Donezo-style circular control buttons */}
      <div className="mt-6 flex items-center justify-center gap-4">
        {isCheckedIn ? (
          <>
            <button
              onClick={checkOut}
              title="Pause Shift"
              className="w-12 h-12 rounded-full bg-white text-[#144933] hover:bg-gray-100 flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={checkOut}
              title="End Shift"
              className="w-12 h-12 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </>
        ) : (
          <button
            onClick={checkIn}
            className="inline-flex items-center gap-2 rounded-xl bg-white text-[#144933] hover:bg-gray-100 px-6 py-3 text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Shift</span>
          </button>
        )}
      </div>
    </div>
  );
};
