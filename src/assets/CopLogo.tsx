import React from 'react';

interface CopLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  textColor?: 'white' | 'dark';
  variant?: 'full' | 'emblem-only';
}

export const CopLogo: React.FC<CopLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  textColor = 'dark',
  variant = 'full',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Church of Pentecost Emblem */}
      <div className={`relative flex-shrink-0 ${currentSizeClass} drop-shadow-sm rounded-full bg-cop-blue-900 overflow-hidden ring-2 ring-cop-gold-500/80`}>
        <img
          src="/cop-logo.svg"
          alt="The Church of Pentecost Official Logo"
          className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback SVG representation if img fails
            const target = e.target as HTMLElement;
            target.style.display = 'none';
          }}
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-heading font-extrabold tracking-tight text-base sm:text-lg uppercase ${
              textColor === 'white' ? 'text-white' : 'text-cop-blue-900'
            }`}
          >
            THE CHURCH OF PENTECOST
          </span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cop-gold-500"></span>
            <span
              className={`text-xs font-semibold tracking-wider uppercase ${
                textColor === 'white' ? 'text-cop-gold-400' : 'text-cop-blue-700'
              }`}
            >
              COP Connect &bull; Leadership Portal
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
