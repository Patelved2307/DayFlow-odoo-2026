import React from 'react';

export const ProjectProgressGauge: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      <div>
        <h3 className="font-display font-bold text-base text-[#1C1F1E]">
          Project Progress
        </h3>
        <p className="text-xs text-[#6B7280]">Overall workforce alignment</p>
      </div>

      {/* Semi-Arc Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg viewBox="0 0 200 110" className="w-48 h-28">
          {/* Background Hatched Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="20"
            strokeDasharray="4 4"
            strokeLinecap="round"
          />

          {/* Active 41% Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 115 25"
            fill="none"
            stroke="#006837"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute top-10 flex flex-col items-center justify-center text-center">
          <span className="font-display font-extrabold text-3xl text-[#1C1F1E] tracking-tight">
            41%
          </span>
          <span className="text-[11px] font-medium text-[#6B7280]">Project Ended</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-[#6B7280] pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-[11px] font-semibold text-gray-700">Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" />
          <span className="text-[11px] font-semibold text-gray-700">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-300 border border-dashed border-gray-500" />
          <span className="text-[11px] font-semibold text-gray-700">Pending</span>
        </div>
      </div>
    </div>
  );
};
