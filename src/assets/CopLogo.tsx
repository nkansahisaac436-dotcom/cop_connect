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
    xs: 'w-7 h-7',
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    '2xl': 'w-36 h-36',
  };

  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Official Church of Pentecost Emblem */}
      <div className={`relative flex-shrink-0 ${currentSizeClass} rounded-full bg-white overflow-hidden p-0.5 shadow-sm border border-slate-200`}>
        <img
          src="/cop_emblem_circle.png"
          alt="The Church of Pentecost Official Seal"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight text-left">
          <span
            className={`font-serif font-black tracking-wider text-base sm:text-lg uppercase ${
              textColor === 'white' ? 'text-white' : 'text-[#0B2545]'
            }`}
          >
            THE CHURCH OF PENTECOST
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F1B51C]"></span>
            <span
              className={`text-[11px] font-bold tracking-widest uppercase ${
                textColor === 'white' ? 'text-[#F1B51C]' : 'text-[#002D72]'
              }`}
            >
              COP Connect &bull; Official Network
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
