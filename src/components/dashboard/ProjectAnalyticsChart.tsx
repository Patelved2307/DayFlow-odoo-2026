import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export const ProjectAnalyticsChart: React.FC = () => {
  const days = [
    { label: 'S', height: '45%', status: 'inactive' },
    { label: 'M', height: '80%', status: 'active' },
    { label: 'T', height: '65%', status: 'active', popover: '74%' },
    { label: 'W', height: '90%', status: 'primary' },
    { label: 'T', height: '70%', status: 'inactive' },
    { label: 'F', height: '50%', status: 'inactive' },
    { label: 'S', height: '60%', status: 'inactive' },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base text-[#1C1F1E] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#006837]" />
            <span>Workforce Weekly Velocity</span>
          </h3>
          <p className="text-xs text-[#6B7280]">Daily shift completion & attendance activity</p>
        </div>
      </div>

      <div className="relative h-44 my-4 flex items-end justify-between px-2 gap-3">
        {days.map((day, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            {day.popover && (
              <div className="mb-1 bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs animate-bounce">
                {day.popover}
              </div>
            )}

            {/* Column Bar with Animated Height Growth */}
            <motion.div
              className="w-full relative flex flex-col justify-end"
              initial={{ height: 0 }}
              animate={{ height: day.height }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {day.status === 'inactive' ? (
                <div
                  className="w-full h-full rounded-full border border-gray-200 transition-all duration-300 group-hover:scale-105"
                  style={{
                    backgroundColor: '#F8FAFC',
                    backgroundImage: `repeating-linear-gradient(45deg, #E2E8F0, #E2E8F0 3px, transparent 3px, transparent 8px)`,
                  }}
                />
              ) : day.status === 'primary' ? (
                <div className="w-full h-full rounded-full bg-[#006837] transition-all duration-300 group-hover:scale-105 shadow-xs" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#7EC9A0] transition-all duration-300 group-hover:scale-105" />
              )}
            </motion.div>

            <span className="text-xs font-semibold text-gray-500">{day.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" />
          <span>Peak Productivity</span>
        </span>
        <span className="font-semibold text-gray-800">Average: 82%</span>
      </div>
    </div>
  );
};
