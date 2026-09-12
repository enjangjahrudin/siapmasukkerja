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
    sm: { icon: 'w-7 h-7 rounded-xl', imgRadius: 'rounded-xl', text: 'text-sm', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 'w-9 h-9 rounded-xl', imgRadius: 'rounded-xl', text: 'text-base', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 'w-16 h-16 rounded-2xl', imgRadius: 'rounded-2xl', text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 'w-24 h-24 rounded-3xl', imgRadius: 'rounded-3xl', text: 'text-2xl', badge: 'text-xs px-2.5 py-1' }
  };

  const { icon, imgRadius, text, badge } = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Brand Logo Emblem */}
      <div className={`${icon} shrink-0 relative shadow-md shadow-brand-500/20 group`}>
        <img 
          src="/android-chrome-192x192.png" 
          alt="SMK - Siap Masuk Kerja" 
          className={`w-full h-full object-cover ${imgRadius} select-none pointer-events-none`}
          loading="eager"
        />
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
