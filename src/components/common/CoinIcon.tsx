import React from 'react';

interface CoinIconProps {
  className?: string;
  size?: number;
}

export const CoinIcon: React.FC<CoinIconProps> = ({ className = '', size = 20 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]"
      >
        <circle cx="12" cy="12" r="10" fill="url(#goldGradientOuter)" stroke="#F4D477" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="7.5" stroke="#D4AF37" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <path
          d="M10 8H13.2C14.3 8 15 8.7 15 9.7C15 10.7 14.3 11.4 13.2 11.4H11V16H9.5V8H10ZM11 9.4V10.1H13C13.5 10.1 13.8 9.8 13.8 9.4C13.8 9 13.5 8.7 13 8.7H11V9.4Z"
          fill="#593E05"
        />
        <defs>
          <linearGradient id="goldGradientOuter" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F9E29D" />
            <stop offset="0.45" stopColor="#D4AF37" />
            <stop offset="1" stopColor="#967215" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

