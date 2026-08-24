import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { Gauge, TrendingUp } from 'lucide-react';

export const ProjectProgressGauge: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-2xs flex flex-col justify-between h-full relative overflow-hidden">
      {/* Header with inline Icon + Title + Badge */}
      <div className="flex items-start justify-between gap-2 pb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4 text-[#006837]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-sm text-[#1C1F1E] leading-snug truncate">
              Workforce Alignment
            </h3>
            <p className="text-[11px] text-[#6B7280] truncate">Real-time shift metric</p>
          </div>
        </div>

        <span className="shrink-0 bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
          Monthly Target
        </span>
      </div>

      {/* Speedometer Arc Visual */}
      <div className="relative flex flex-col items-center justify-center my-2 py-1">
        <svg viewBox="0 0 200 110" className="w-48 h-26">
          {/* Background Track Arc */}
          <path
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Dotted Guide Path */}
          <path
            d="M 25 95 A 75 75 0 0 1 175 95"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />

          {/* Animated 94.2% Target Arc Sweep */}
          <motion.path
            d="M 25 95 A 75 75 0 0 1 166 78"
            fill="none"
            stroke="url(#speedometerGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          <defs>
            <linearGradient id="speedometerGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7EC9A0" />
              <stop offset="100%" stopColor="#006837" />
            </linearGradient>
          </defs>
        </svg>

        {/* Perfectly Centered Percentage Display */}
        <div className="absolute top-[34%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center">
          <div className="font-display font-extrabold text-3xl text-[#1C1F1E] tracking-tight leading-none">
            <AnimatedCounter to={94.2} decimals={1} suffix="%" />
          </div>
          <span className="text-[10px] font-bold text-[#006837] flex items-center gap-1 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            <TrendingUp className="w-3 h-3 text-[#006837]" />
            <span>Shift Target Met</span>
          </span>
        </div>
      </div>

      {/* Clean 3-Column Legend */}
      <div className="grid grid-cols-3 gap-1 text-center pt-3 border-t border-gray-100">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#006837]" />
            <span className="text-[10px] font-bold text-gray-500">Present</span>
          </div>
          <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">94.2%</span>
        </div>

        <div className="flex flex-col items-center border-x border-gray-100 px-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-[10px] font-bold text-gray-500">Leave</span>
          </div>
          <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">4.8%</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-gray-500">Unexcused</span>
          </div>
          <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">1.0%</span>
        </div>
      </div>
    </div>
  );
};
