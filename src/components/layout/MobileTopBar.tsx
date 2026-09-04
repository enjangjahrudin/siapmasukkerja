import React from 'react';
import { TargetRole } from '../../types';
import { 
  ArrowLeft, 
  Briefcase, 
  Award, 
  Flame, 
  ChevronDown,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../utils/theme-context';

import { AppLogo } from '../common/AppLogo';

interface MobileTopBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
  userName: string;
  onOpenTryout: () => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  title,
  showBack,
  onBack,
  targetRole,
  setTargetRole,
  userName,
  onOpenTryout
}) => {
  const { isDark, toggleTheme } = useTheme();

  if (showBack) {
    return (
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-3 flex items-center justify-between shadow-xs transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200/80 text-slate-900'
      }`}>
        <button
          onClick={onBack}
          className={`p-1.5 -ml-1.5 rounded-xl transition-colors flex items-center gap-1 font-bold text-xs ${
            isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        <span className={`font-extrabold text-sm truncate max-w-[180px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {title || 'SMK — Siap Masuk Kerja'}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl border transition-colors ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onOpenTryout}
            className="p-1.5 bg-amber-50 text-amber-800 border border-amber-300 rounded-xl text-[10px] font-extrabold flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Tryout</span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-2.5 shadow-xs transition-colors ${
      isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200/80 text-slate-900'
    }`}>
      <div className="flex items-center justify-between">
        
        {/* User Info with AppLogo & Role Dropdown */}
        <div className="flex items-center gap-2.5">
          <AppLogo size="md" isDark={isDark} showText={false} />
          <div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-black leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Hai, {userName.split(' ')[0]} 👋
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 border outline-none cursor-pointer ${
                  isDark 
                    ? 'text-sky-300 bg-slate-800 border-slate-700' 
                    : 'text-brand-800 bg-brand-50 border-brand-200'
                }`}
              >
                <option value="operator">Operator Produksi</option>
                <option value="qc">QC Inspector</option>
                <option value="maintenance">Maintenance</option>
                <option value="logistics">Logistik & Gudang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions (Theme Toggle, Streak & Tryout) */}
        <div className="flex items-center gap-1.5">
          
          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 text-orange-700 px-2 py-1 rounded-xl text-[11px] font-extrabold">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>3 Hari</span>
          </div>

          <button
            onClick={onOpenTryout}
            className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tryout</span>
          </button>
        </div>

      </div>
    </header>
  );
};
