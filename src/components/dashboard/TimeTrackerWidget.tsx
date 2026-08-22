import React, { useState, useEffect } from 'react';
import { Pause, Play, Square } from 'lucide-react';
import { useApp } from '../../lib/context/AppContext';

export const TimeTrackerWidget: React.FC = () => {
  const { showToast } = useApp();
  const [seconds, setSeconds] = useState(5048); // 01:24:08
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    let timer: any = null;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
    showToast(isRunning ? 'Time tracker paused' : 'Time tracker resumed', 'info');
  };

  const handleStop = () => {
    setIsRunning(false);
    showToast('Workday timer stopped and logged to attendance database', 'success');
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-[#0A3B24] via-[#072C1B] to-[#041A10] p-6 text-white overflow-hidden shadow-md flex flex-col justify-between h-full min-h-[190px]">
      {/* Background Graphic Waves */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M 0 100 Q 75 50 150 100 T 300 100 L 300 200 L 0 200 Z"
            fill="url(#waveGrad)"
          />
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="300" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#052416" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <span className="text-xs font-semibold text-emerald-300 tracking-wider">Time Tracker</span>
      </div>

      {/* Large Digital Timer */}
      <div className="relative z-10 text-center my-2">
        <div className="font-mono font-bold text-4xl tracking-tight text-white drop-shadow-sm">
          {formatTime(seconds)}
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="relative z-10 flex items-center justify-center gap-4 pt-1">
        <button
          onClick={handleToggle}
          className="w-10 h-10 rounded-full bg-white text-[#0A3B24] hover:bg-emerald-100 transition-colors flex items-center justify-center shadow-md cursor-pointer"
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <button
          onClick={handleStop}
          className="w-10 h-10 rounded-full bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center shadow-md cursor-pointer"
          title="Stop & Log Session"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
};
