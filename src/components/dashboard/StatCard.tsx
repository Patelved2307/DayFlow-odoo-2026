import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'error' | 'neutral';
  accent?: 'green' | 'amber' | 'rose' | 'default';
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subValue,
  badge,
  badgeType = 'neutral',
  accent = 'default',
  onClick,
  icon,
}) => {
  const getBadgeClass = () => {
    switch (badgeType) {
      case 'warning':
        return 'bg-[#FEF6EC] text-[#F2994A] border border-[#F2994A]/20';
      case 'success':
        return 'bg-[#EBF5F0] text-[#1F6D4D] border border-[#1F6D4D]/20';
      case 'error':
        return 'bg-[#FDEEEE] text-[#E5484D] border border-[#E5484D]/20';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getAccentBorder = () => {
    if (accent === 'amber') return 'hover:border-[#F2994A]/50';
    if (accent === 'green') return 'hover:border-[#1F6D4D]/50';
    if (accent === 'rose') return 'hover:border-[#E5484D]/50';
    return 'hover:border-gray-300';
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-white p-5 border border-gray-100 shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 ' + getAccentBorder() : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6B7280]">{title}</span>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="font-mono text-3xl font-bold tracking-tight text-[#1C1F1E]">
          {value}
        </div>
        {badge && (
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getBadgeClass()}`}>
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <div className="mt-1 flex items-center justify-between text-xs text-[#6B7280]">
          <span>{subValue}</span>
          {onClick && (
            <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#1F6D4D]">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3" />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
