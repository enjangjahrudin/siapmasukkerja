import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  isDark?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  isDark = true,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-9 h-9', text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-12 h-12', text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', badge: 'text-xs px-2.5 py-1' }
  };

  const { icon, text, badge } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Iconic Vector Emblem */}
      <div className={`${icon} shrink-0 relative rounded-2xl bg-gradient-to-tr from-sky-600 via-brand-500 to-emerald-400 p-[1.5px] shadow-md shadow-brand-500/25 group`}>
        <div className="w-full h-full rounded-[14px] bg-[#090d16] flex items-center justify-center relative overflow-hidden">
          
          {/* Internal Geometric SVG Icon */}
          <svg viewBox="0 0 48 48" className="w-4/5 h-4/5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#34d399" />
              </linearGradient>
            </defs>

            {/* Ascending Performance Steps */}
            <path d="M10 32 L15 32 L15 24 L10 26 Z" fill="#38bdf8" opacity="0.8" />
            <path d="M18 32 L23 32 L23 18 L18 20 Z" fill="#0ea5e9" />
            <path d="M26 32 L31 32 L38 12 L32 12 L26 27 Z" fill="url(#logoGrad)" />
            
            {/* Top Victory Diamond */}
            <polygon points="38,8 41,11 38,14 35,11" fill="#34d399" />
          </svg>

        </div>
      </div>

      {/* Typography (Optional) */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'} ${text}`}>
              SMK
            </span>
            <span className={`font-black uppercase tracking-wider rounded-md border ${badge} ${
              isDark 
                ? 'bg-sky-950/80 text-sky-400 border-sky-800/80' 
                : 'bg-sky-100 text-sky-800 border-sky-200'
            }`}>
              Siap Masuk Kerja
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
