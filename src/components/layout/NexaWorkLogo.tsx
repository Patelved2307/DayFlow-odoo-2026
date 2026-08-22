import React from 'react';

interface NexaWorkLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'dark' | 'light' | 'white';
}

export const NexaWorkLogo: React.FC<NexaWorkLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  variant = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const taglineSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[10px]',
    xl: 'text-[11px]',
  };

  const textColor =
    variant === 'white'
      ? 'text-white'
      : variant === 'light'
      ? 'text-[#0B1E17]'
      : 'text-[#1C1F1E]';

  const subtextColor =
    variant === 'white'
      ? 'text-emerald-200'
      : 'text-[#006837] font-semibold';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official NexaWork Vector Logo Icon */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="nwGrad1" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#005B30" />
              <stop offset="100%" stopColor="#0A7C46" />
            </linearGradient>
            <linearGradient id="nwGrad2" x1="30" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
          </defs>

          {/* Outer Circle Arc Ring */}
          <path
            d="M 28 82 A 40 40 0 1 1 82 72"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Solid Green Outer Ring Accent */}
          <circle cx="50" cy="50" r="44" stroke="#047857" strokeWidth="4" fill="none" opacity="0.3" />

          {/* Inner Mint Green Dot */}
          <circle cx="50" cy="32" r="10" fill="#34D399" />

          {/* Main 'N / W' Geometric Swoosh Fold */}
          <path
            d="M 22 68 C 22 50, 32 38, 46 54 L 64 76 C 72 85, 82 76, 82 65 C 82 48, 68 34, 52 34 C 40 34, 30 42, 26 52"
            fill="url(#nwGrad1)"
          />
          <path
            d="M 44 54 C 54 40, 68 40, 76 50 L 78 54 C 82 62, 75 72, 65 72 C 55 72, 48 64, 44 54 Z"
            fill="url(#nwGrad2)"
          />
        </svg>
      </div>

      {/* Typography & Tagline */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1">
          <span className={`font-display font-extrabold tracking-tight leading-none ${textSizes[size]} ${textColor}`}>
            Nexa<span className="text-[#006837]">Work</span>
          </span>
        </div>

        {showTagline && (
          <div className={`flex items-center gap-1.5 mt-0.5 tracking-wider uppercase font-semibold ${taglineSizes[size]} ${subtextColor}`}>
            <span className="w-2 h-[1.5px] bg-[#006837] rounded-full shrink-0" />
            <span className="truncate">EVERY WORKDAY, PERFECTLY ALIGNED.</span>
            <span className="w-2 h-[1.5px] bg-[#006837] rounded-full shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
};
