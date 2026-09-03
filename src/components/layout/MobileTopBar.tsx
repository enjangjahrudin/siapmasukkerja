import React from 'react';
import { TargetRole } from '../../types';
import { 
  ArrowLeft, 
  Briefcase, 
  Award, 
  Flame, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

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
  if (showBack) {
    return (
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1 font-bold text-xs"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800" />
          <span>Kembali</span>
        </button>

        <span className="font-extrabold text-sm text-slate-900 truncate max-w-[200px]">
          {title || 'SMK — Siap Masuk Kerja'}
        </span>

        <button
          onClick={onOpenTryout}
          className="p-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-[10px] font-extrabold flex items-center gap-1"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Tryout</span>
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        
        {/* User Info & Role Dropdown */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center shadow-md shadow-brand-500/20">
            SMK
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-black text-slate-900 leading-none">
                Hai, {userName.split(' ')[0]} 👋
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="text-[10px] font-bold text-brand-700 bg-brand-50 rounded-md px-1.5 py-0.5 border border-brand-200 outline-none cursor-pointer"
              >
                <option value="operator">Operator Produksi</option>
                <option value="qc">QC Inspector</option>
                <option value="maintenance">Maintenance</option>
                <option value="logistics">Logistik & Gudang</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions (Streak & Tryout) */}
        <div className="flex items-center gap-1.5">
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
