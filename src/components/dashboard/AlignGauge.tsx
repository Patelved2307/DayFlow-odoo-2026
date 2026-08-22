import React from 'react';

interface AlignGaugeProps {
  percentage: number; // 0 to 100
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'speedometer' | 'ring';
  statusText?: string;
  color?: string;
  subValue?: string;
}

export const AlignGauge: React.FC<AlignGaugeProps> = ({
  percentage,
  title,
  subtitle,
  size = 'md',
  variant = 'speedometer',
  statusText,
  color = '#1F6D4D',
  subValue,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));

  if (variant === 'ring') {
    // Circular Ring
    const radius = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;
    const strokeWidth = size === 'sm' ? 4 : size === 'lg' ? 7 : 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clamped / 100) * circumference;
    const boxSize = (radius + strokeWidth) * 2;

    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center" style={{ width: boxSize, height: boxSize }}>
          <svg className="transform -rotate-90" width={boxSize} height={boxSize}>
            <circle
              cx={boxSize / 2}
              cy={boxSize / 2}
              r={radius}
              stroke="#E5E7EB"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={boxSize / 2}
              cy={boxSize / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-[#1C1F1E]">
            {clamped}%
          </div>
        </div>
        {(title || subtitle) && (
          <div>
            {title && <div className="text-sm font-semibold text-[#1C1F1E]">{title}</div>}
            {subtitle && <div className="text-xs text-[#6B7280]">{subtitle}</div>}
          </div>
        )}
      </div>
    );
  }

  // Semicircular Speedometer Arc
  const width = size === 'sm' ? 140 : size === 'lg' ? 220 : 180;
  const height = width / 2 + 16;
  const radius = width / 2 - 14;
  const strokeWidth = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (clamped / 100) * arcLength;

  // Determine status color based on percentage
  const getZoneColor = (val: number) => {
    if (val >= 80) return '#1F6D4D'; // Align Green
    if (val >= 60) return '#F2994A'; // Amber
    return '#E5484D'; // Rose
  };

  const activeColor = color === '#1F6D4D' ? getZoneColor(clamped) : color;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative flex flex-col items-center" style={{ width, height }}>
        <svg width={width} height={height} className="overflow-visible">
          {/* Background Arc */}
          <path
            d={`M 14,${height - 10} A ${radius} ${radius} 0 0 1 ${width - 14},${height - 10}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Active Colored Arc */}
          <path
            d={`M 14,${height - 10} A ${radius} ${radius} 0 0 1 ${width - 14},${height - 10}`}
            fill="none"
            stroke={activeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center text */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="font-mono text-3xl font-bold tracking-tight text-[#1C1F1E]">
            {clamped}%
          </span>
          {subValue && (
            <span className="text-[11px] font-medium text-[#6B7280]">{subValue}</span>
          )}
        </div>
      </div>

      {title && <div className="mt-2 text-sm font-semibold text-[#1C1F1E]">{title}</div>}
      {(subtitle || statusText) && (
        <div className="text-xs text-[#6B7280] mt-0.5">
          {statusText ? (
            <span className="inline-flex items-center gap-1 font-medium text-[#1F6D4D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F6D4D]" />
              {statusText}
            </span>
          ) : (
            subtitle
          )}
        </div>
      )}
    </div>
  );
};
