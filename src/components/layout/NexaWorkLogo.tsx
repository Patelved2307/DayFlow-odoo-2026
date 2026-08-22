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
  const heights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-18',
  };

  const nexaColor = variant === 'white' ? '#FFFFFF' : '#1C2522';
  const workColor = variant === 'white' ? '#6EE7B7' : '#006837';
  const taglineColor = variant === 'white' ? '#A7F3D0' : '#1C2522';
  const lineColor = variant === 'white' ? '#6EE7B7' : '#50C878';

  return (
    <div className={`inline-flex items-center select-none ${heights[size]} ${className}`}>
      <svg
        viewBox="0 0 460 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        {/* Emblem Group */}
        <g transform="translate(10, 5)">
          {/* Outer Dark Green Circular Arc */}
          <path
            d="M 46 12 A 40 40 0 1 1 88 66"
            stroke="#006837"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Bottom Light Mint Circular Arc */}
          <path
            d="M 22 68 A 40 40 0 0 0 78 86"
            stroke="#50C878"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Inner Mint Circle Dot */}
          <circle cx="48" cy="32" r="9" fill="#50C878" />

          {/* Main 'N' Ribbon (Deep Green) */}
          <path
            d="M 18 64 C 18 50, 30 40, 46 56 L 65 82 C 72 90, 82 82, 82 70 C 82 54, 66 42, 48 42 C 34 42, 22 52, 18 64 Z"
            fill="#006837"
          />

          {/* Mint Ribbon Fold */}
          <path
            d="M 46 56 C 56 42, 70 42, 78 54 L 80 58 C 84 66, 77 78, 66 78 C 56 78, 48 66, 46 56 Z"
            fill="#50C878"
          />
        </g>

        {/* NexaWork Title Text */}
        <g transform="translate(115, 52)">
          <text
            fontFamily="'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif"
            fontWeight="800"
            fontSize="46"
            letterSpacing="-1.2"
          >
            <tspan fill={nexaColor}>Nexa</tspan>
            <tspan fill={workColor}>Work</tspan>
          </text>
        </g>

        {/* Tagline & Side Accent Lines */}
        {showTagline && (
          <g transform="translate(115, 82)">
            {/* Left Accent Line */}
            <rect x="0" y="-4" width="32" height="2.5" rx="1.25" fill={lineColor} />

            {/* Tagline Text */}
            <text
              x="44"
              y="0"
              fontFamily="'Inter', system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="10.5"
              letterSpacing="2.8"
              fill={taglineColor}
            >
              EVERY WORKDAY, PERFECTLY ALIGNED.
            </text>

            {/* Right Accent Line */}
            <rect x="292" y="-4" width="32" height="2.5" rx="1.25" fill={lineColor} />
          </g>
        )}
      </svg>
    </div>
  );
};
