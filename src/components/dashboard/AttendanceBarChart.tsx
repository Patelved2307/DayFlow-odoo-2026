import React, { useState } from 'react';

interface AttendanceBarChartProps {
  isPersonal?: boolean;
}

export const AttendanceBarChart: React.FC<AttendanceBarChartProps> = ({ isPersonal = false }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Wed');

  // Days S, M, T, W, T, F, S with Donezo pill-bar aesthetic
  const daysData = isPersonal
    ? [
        { day: 'Sun', label: 'S', heightPct: 15, isCurrent: false, value: 'Off' },
        { day: 'Mon', label: 'M', heightPct: 65, isCurrent: false, value: '8.5h' },
        { day: 'Tue', label: 'T', heightPct: 75, isCurrent: false, value: '8.2h' },
        { day: 'Wed', label: 'W', heightPct: 95, isCurrent: true, value: '9.0h' },
        { day: 'Thu', label: 'T', heightPct: 45, isCurrent: false, value: '8.0h' },
        { day: 'Fri', label: 'F', heightPct: 30, isCurrent: false, value: '6.5h' },
        { day: 'Sat', label: 'S', heightPct: 15, isCurrent: false, value: 'Off' },
      ]
    : [
        { day: 'Sun', label: 'S', heightPct: 20, isCurrent: false, value: 'Weekend' },
        { day: 'Mon', label: 'M', heightPct: 70, isCurrent: false, value: '92%' },
        { day: 'Tue', label: 'T', heightPct: 78, isCurrent: false, value: '95%' },
        { day: 'Wed', label: 'W', heightPct: 96, isCurrent: true, value: '98%' },
        { day: 'Thu', label: 'T', heightPct: 48, isCurrent: false, value: '90%' },
        { day: 'Fri', label: 'F', heightPct: 35, isCurrent: false, value: '85%' },
        { day: 'Sat', label: 'S', heightPct: 20, isCurrent: false, value: 'Weekend' },
      ];

  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-[#1C1F1E]">
            {isPersonal ? 'Attendance Analytics' : 'Workforce Presence Trend'}
          </h3>
          <p className="text-xs text-[#6B7280]">
            {isPersonal ? 'Daily hours logged this cycle' : 'Daily active workforce presence'}
          </p>
        </div>
      </div>

      {/* Styled Pill Bars matching Donezo aesthetic */}
      <div className="my-6 flex items-end justify-between gap-3 h-44 px-2">
        {daysData.map((item, idx) => {
          const isSelected = selectedDay === item.day;
          return (
            <div
              key={idx}
              onClick={() => setSelectedDay(item.day)}
              className="flex-1 flex flex-col items-center gap-3 cursor-pointer group"
            >
              {/* Pill Container */}
              <div className="relative w-full max-w-[36px] h-32 flex flex-col justify-end items-center">
                {/* Value tooltip pill on selected / active bar */}
                {isSelected && (
                  <div className="absolute -top-7 z-10 bg-[#1C1F1E] text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                    {item.value}
                  </div>
                )}

                {item.isCurrent ? (
                  // Deep solid green pill for top active day
                  <div
                    style={{ height: `${item.heightPct}%` }}
                    className="w-full rounded-full bg-[#144933] shadow-xs transition-all duration-300 group-hover:scale-105"
                  />
                ) : item.heightPct > 50 ? (
                  // Mint green solid pill
                  <div
                    style={{ height: `${item.heightPct}%` }}
                    className={`w-full rounded-full transition-all duration-300 group-hover:scale-105 ${
                      isSelected ? 'bg-[#1F6D4D]' : 'bg-[#7EC9A0]'
                    }`}
                  />
                ) : (
                  // Striped / patterned empty pillar
                  <div
                    style={{ height: `${Math.max(item.heightPct, 25)}%` }}
                    className="w-full rounded-full border-2 border-dashed border-gray-200 bg-gray-50/50 transition-all duration-300 group-hover:border-gray-300"
                  />
                )}
              </div>

              {/* Day Label */}
              <span
                className={`text-xs font-semibold ${
                  isSelected ? 'text-[#1F6D4D] font-bold' : 'text-[#6B7280]'
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend strip */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#6B7280]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#144933]" />
            <span className="text-[11px]">Peak Day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7EC9A0]" />
            <span className="text-[11px]">Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-gray-300 bg-gray-100" />
            <span className="text-[11px]">Off-Hours</span>
          </div>
        </div>
        <span className="text-[11px] font-mono text-gray-400">Week 34</span>
      </div>
    </div>
  );
};
