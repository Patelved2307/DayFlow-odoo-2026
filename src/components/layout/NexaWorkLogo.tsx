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
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
  };

  const taglineSizes = {
    sm: 'text-[7px]',
    md: 'text-[8.5px]',
    lg: 'text-[10px]',
    xl: 'text-[11.5px]',
  };

  const textColorNexa =
    variant === 'white'
      ? 'text-white'
      : 'text-[#1C2522]';

  const textColorWork =
    variant === 'white'
      ? 'text-emerald-300'
      : 'text-[#006837]';

  const taglineColor =
    variant === 'white'
      ? 'text-emerald-200 font-bold'
      : 'text-[#1C2522] font-extrabold';

  const lineColor =
    variant === 'white'
      ? 'bg-emerald-300'
      : 'bg-[#50C878]';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {/* Official NexaWork Exact Vector Logo Symbol */}
      <div className={`relative shrink-0 ${iconSizes[size]} flex items-center justify-center`}>
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Top-Right Outer Arc (Dark Green) */}
          <path
            d="M 68 32 A 76 76 0 0 1 168 118"
            stroke="#006837"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottom-Left Outer Arc (Light Mint Green) */}
          <path
            d="M 32 128 A 76 76 0 0 1 132 168"
            stroke="#50C878"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />

          {/* Inner Mint Green Dot */}
          <circle cx="98" cy="62" r="16" fill="#50C878" />

          {/* Main 'N' Left Leg (Deep Forest Green) */}
          <path
            d="M 40 125 L 75 75 C 82 65, 96 68, 102 78 L 138 135 C 146 148, 134 162, 118 152 L 72 120 C 60 112, 44 116, 40 125 Z"
            fill="#006837"
          />

          {/* Main 'N' Right Fold (Vibrant Mint Green) */}
          <path
            d="M 104 82 L 152 118 C 160 124, 156 138, 142 138 L 118 108 C 110 98, 106 88, 104 82 Z"
            fill="#50C878"
          />
        </svg>
      </div>

      {/* Typography & Tagline */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center tracking-tight font-display font-extrabold leading-none">
          <span className={`${textSizes[size]} ${textColorNexa}`}>Nexa</span>
          <span className={`${textSizes[size]} ${textColorWork}`}>Work</span>
        </div>

        {showTagline && (
          <div className={`flex items-center gap-2 mt-1 tracking-[0.2em] uppercase ${taglineSizes[size]} ${taglineColor}`}>
            <span className={`h-[2px] w-5 rounded-full shrink-0 ${lineColor}`} />
            <span className="truncate">EVERY WORKDAY, PERFECTLY ALIGNED.</span>
            <span className={`h-[2px] w-5 rounded-full shrink-0 ${lineColor}`} />
          </div>
        )}
      </div>
    </div>
  );
};
