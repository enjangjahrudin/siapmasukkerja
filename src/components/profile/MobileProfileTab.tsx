import React from 'react';
import { TargetRole } from '../../types';
import { 
  User, 
  Target, 
  Award, 
  Flame, 
  ShieldCheck, 
  LogOut, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  Briefcase, 
  LayoutDashboard,
  Sun,
  Moon
} from 'lucide-react';
import { sounds } from '../../utils/sound-effects';
import { useTheme } from '../../utils/theme-context';

interface MobileProfileTabProps {
  userName: string;
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
  onLogout: () => void;
  onOpenAdmin?: () => void;
}

export const MobileProfileTab: React.FC<MobileProfileTabProps> = ({
  userName,
  targetRole,
  setTargetRole,
  onLogout,
  onOpenAdmin
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <div className={`p-4 space-y-4 pb-20 select-none transition-colors ${
      isDark ? 'text-white' : 'text-slate-900'
    }`}>
      
      {/* Profile Header */}
      <div className={`border rounded-3xl p-5 shadow-xs text-center transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 text-slate-950 font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-brand-500/20">
          {userName.charAt(0).toUpperCase()}
        </div>

        <h2 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userName}</h2>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Calon Pekerja SMK / SMA</p>

        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mt-3 ${
          isDark ? 'bg-sky-950/60 text-sky-300 border-sky-800' : 'bg-brand-50 text-brand-700 border-brand-200'
        }`}>
          <Briefcase className="w-3.5 h-3.5" />
          <span className="capitalize">{targetRole}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tes Diikuti</span>
          <strong className={`text-base font-black mt-0.5 block ${isDark ? 'text-white' : 'text-slate-900'}`}>14x</strong>
        </div>
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Akurasi Rata2</span>
          <strong className="text-base font-black text-emerald-500 mt-0.5 block">88%</strong>
        </div>
        <div className={`border rounded-2xl p-3 shadow-xs transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Prediksi Lolos</span>
          <strong className="text-base font-black text-sky-400 mt-0.5 block">91%</strong>
        </div>
      </div>

      {/* Appearance Theme Selector */}
      <div className={`border rounded-3xl p-4 shadow-xs space-y-2.5 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Tema Tampilan Aplikasi:
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (!isDark) toggleTheme();
              sounds.playClick();
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isDark 
                ? 'bg-slate-800 border-sky-500 text-sky-300 ring-1 ring-sky-500' 
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Moon className="w-4 h-4 text-sky-400" />
            <span>Mode Gelap (Dark)</span>
          </button>

          <button
            onClick={() => {
              if (isDark) toggleTheme();
              sounds.playClick();
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              !isDark 
                ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-300 font-black' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Mode Terang (Light)</span>
          </button>
        </div>
      </div>

      {/* Target Setting */}
      <div className={`border rounded-3xl p-4 shadow-xs space-y-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Pengaturan Target Posisi:
        </span>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'operator', title: 'Operator Produksi' },
            { id: 'qc', title: 'QC Inspector' },
            { id: 'maintenance', title: 'Maintenance' },
            { id: 'logistics', title: 'Logistik & Gudang' }
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setTargetRole(r.id as TargetRole);
                sounds.playClick();
              }}
              className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                targetRole === r.id
                  ? isDark 
                    ? 'bg-brand-600/30 border-brand-500 text-sky-300 ring-1 ring-brand-500' 
                    : 'bg-brand-50 border-brand-500 text-brand-700 font-black'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Command Center Quick Access */}
      {onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 border border-slate-800"
        >
          <LayoutDashboard className="w-4 h-4 text-amber-400" />
          <span>Buka Dashboard Admin (Command Center)</span>
        </button>
      )}

      {/* Logout Action */}
      <div className="space-y-2">
        <button
          onClick={onLogout}
          className={`w-full py-3 border font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 ${
            isDark 
              ? 'bg-red-950/40 hover:bg-red-950/80 border-red-900/60 text-red-400' 
              : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
          }`}
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun (Logout)</span>
        </button>
      </div>

      <div className="text-center text-[10px] text-slate-400 pt-2 leading-relaxed">
        <strong>SMK — Siap Masuk Kerja</strong> v1.0.0<br />
        <em>“Simulasikan Seleksi. Tingkatkan Kesiapan”</em>
      </div>

    </div>
  );
};
