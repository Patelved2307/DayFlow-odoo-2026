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
  variant = 'dark',
}) => {
  const heights = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20',
  };

  return (
    <div className={`inline-flex items-center select-none ${heights[size]} ${className}`}>
      <img
        src="/assets/nexawork-logo.png"
        alt="NexaWork - Every Workday, Perfectly Aligned."
        className={`h-full w-auto object-contain transition-all ${
          variant === 'white' ? 'brightness-0 invert' : ''
        }`}
        loading="eager"
      />
    </div>
  );
};
