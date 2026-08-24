import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { Gauge, CheckCircle2, TrendingUp } from 'lucide-react';

export const ProjectProgressGauge: React.FC = () => {
  return (
    <div className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-[#1C1F1E] flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#006837]" />
            <span>Workforce Alignment Score</span>
          </h3>
          <span className="bg-emerald-50 text-[#006837] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
            Monthly Target
          </span>
        </div>
        <p className="text-xs text-[#6B7280] mt-1">Real-time attendance & shift completion metric</p>
      </div>

      {/* Animated Speedometer Arc Visual */}
      <div className="relative flex flex-col items-center justify-center my-4">
        <svg viewBox="0 0 200 115" className="w-52 h-30">
          {/* Background Track Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Dotted Guide Path */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Animated 94.2% Target Arc Sweep */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 170 80"
            fill="none"
            stroke="url(#speedometerGrad)"
            strokeWidth="20"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />

          <defs>
            <linearGradient id="speedometerGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7EC9A0" />
              <stop offset="100%" stopColor="#006837" />
            </linearGradient>
          </defs>
        </svg>

        {/* Animated Center Display */}
        <div className="absolute top-8 flex flex-col items-center justify-center text-center">
          <div className="font-display font-extrabold text-3xl text-[#1C1F1E] tracking-tight flex items-center">
            <AnimatedCounter to={94.2} decimals={1} suffix="%" />
          </div>
          <span className="text-[11px] font-bold text-[#006837] flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-[#006837]" />
            <span>Shift Target Met</span>
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-[#6B7280] pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#006837]" />
          <span className="text-[11px] font-semibold text-gray-700">Present (94.2%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-[11px] font-semibold text-gray-700">Approved Leave (4.8%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <span className="text-[11px] font-semibold text-gray-700">Unexcused (1.0%)</span>
        </div>
      </div>
    </div>
  );
};
