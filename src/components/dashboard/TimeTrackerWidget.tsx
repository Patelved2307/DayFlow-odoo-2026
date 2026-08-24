import React, { useState, useEffect } from 'react';
import { Pause, Play, Square, MapPin, Coffee, ShieldCheck } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';
import { motion } from 'framer-motion';

export const TimeTrackerWidget: React.FC = () => {
  const { showToast, isCheckedIn, checkOut, checkIn, checkInTime, workedSeconds } = useApp();
  const [isPaused, setIsPaused] = useState(false);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const shiftProgressPercent = Math.min(Math.round((workedSeconds / (8 * 3600)) * 100), 100);

  const handleTogglePause = () => {
    if (!isCheckedIn) {
      checkIn();
      return;
    }
    setIsPaused((prev) => !prev);
    showToast(isPaused ? 'Shift timer resumed!' : 'Shift timer paused for break', 'info');
  };

  const handleClockOut = () => {
    if (!isCheckedIn) {
      showToast('You are currently off duty.', 'info');
      return;
    }
    checkOut();
  };

  const handleLogBreak = () => {
    showToast('30-minute Lunch Break logged to shift record!', 'info');
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-[#0A2417] via-[#071D12] to-[#04120A] p-6 text-white overflow-hidden shadow-xl border border-emerald-900/60 flex flex-col justify-between h-full min-h-[220px]">
      {/* Background Glowing Ambient Orbs */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-44 h-44 bg-[#006837]/30 rounded-full blur-2xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-36 h-36 bg-[#7EC9A0]/15 rounded-full blur-2xl" />

      {/* Header Row */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#7EC9A0]" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            Workday Shift Focus
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-500/20 text-[#7EC9A0] text-[10px] font-bold font-mono px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-[#7EC9A0] animate-ping" />
          <span>{isCheckedIn ? (isPaused ? 'PAUSED' : 'LIVE SHIFT') : 'OFF DUTY'}</span>
        </div>
      </div>

      {/* Center Clock Display & Geofence Tag */}
      <div className="relative z-10 my-3 text-center space-y-1">
        <div className="font-mono font-extrabold text-4xl sm:text-5xl text-white tracking-tight drop-shadow-md">
          {formatTime(workedSeconds)}
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-200/80 pt-0.5">
          <MapPin className="w-3.5 h-3.5 text-[#7EC9A0]" />
          <span>Punch: {checkInTime || '09:02 AM'} • HQ Geofence Verified (32m)</span>
        </div>
      </div>

      {/* Shift Progress Meter */}
      <div className="relative z-10 space-y-1.5 my-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-emerald-200/70">
          <span>8h Target Shift</span>
          <span className="font-mono">{shiftProgressPercent}% Completed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7EC9A0] to-[#006837] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${shiftProgressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Action Controls */}
      <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
        {/* Pause/Resume Button */}
        <button
          onClick={handleTogglePause}
          className="flex-1 py-2.5 rounded-xl bg-white text-[#0A2417] hover:bg-emerald-100 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
          <span>{isPaused ? 'Resume Shift' : 'Pause'}</span>
        </button>

        {/* Break Log Button */}
        <button
          onClick={handleLogBreak}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
          title="Log Break"
        >
          <Coffee className="w-4 h-4" />
        </button>

        {/* Clock Out Button */}
        <button
          onClick={handleClockOut}
          className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
          title="Clock Out"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Clock Out</span>
        </button>
      </div>
    </div>
  );
};
