import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  subValue: string;
  isPrimary?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subValue,
  isPrimary = false,
  onClick,
}) => {
  if (isPrimary) {
    return (
      <div
        onClick={onClick}
        className="rounded-2xl bg-gradient-to-br from-[#006837] via-[#0A522E] to-[#05381E] p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[140px]"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-100/90">{title}</span>
          <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="my-2">
          <div className="font-display font-extrabold text-4xl tracking-tight text-white drop-shadow-2xs">
            {value}
          </div>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/10">
            <span>5% ↑</span>
            <span>{subValue}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="rounded-2xl bg-white p-6 border border-gray-100 shadow-2xs flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[140px] hover:shadow-xs"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280]">{title}</span>
        <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors border border-gray-100">
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="my-2">
        <div className="font-display font-extrabold text-4xl tracking-tight text-[#1C1F1E]">
          {value}
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-1">
        {subValue.includes('Increased') || subValue.includes('%') ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
            <span className="text-[#006837] font-bold">6% ↑</span>
            <span>{subValue}</span>
          </span>
        ) : (
          <span className="text-[11px] font-medium text-gray-500">{subValue}</span>
        )}
      </div>
    </div>
  );
};
