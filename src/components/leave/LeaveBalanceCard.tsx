import React from 'react';
import { AlignGauge } from '../dashboard/AlignGauge';

interface LeaveBalanceCardProps {
  title: string;
  remaining: number;
  total: number;
  type: 'paid' | 'sick' | 'unpaid' | 'emergency';
  description?: string;
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  title,
  remaining,
  total,
  type,
  description,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((remaining / (total || 1)) * 100)));

  const getColor = () => {
    if (type === 'paid') return '#006837';
    if (type === 'sick') return '#34D399';
    if (type === 'emergency') return '#F59E0B';
    return '#6B7280';
  };

  return (
    <div className="rounded-2xl bg-white p-5 border border-gray-100 shadow-2xs flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-[#6B7280]">{title}</span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-bold text-[#1C1F1E]">{remaining}</span>
          <span className="text-xs text-[#6B7280]">/ {total} Days</span>
        </div>
        <p className="text-[11px] text-gray-500 mt-1">
          {description ||
            (type === 'paid'
              ? 'Annual planned time-off'
              : type === 'sick'
              ? 'Medical & wellness allocation'
              : type === 'emergency'
              ? 'Instant half-day emergency logging'
              : 'Loss of Pay (LOP) logged')}
        </p>
      </div>

      <AlignGauge
        percentage={percentage}
        variant="ring"
        size="md"
        color={getColor()}
      />
    </div>
  );
};
