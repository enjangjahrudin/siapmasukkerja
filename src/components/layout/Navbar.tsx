import React from 'react';
import { TargetRole, TestCategory } from '../../types';
import { 
  Briefcase, 
  Layers, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Award,
  Mic,
  Activity,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: TestCategory | 'dashboard' | 'tips' | 'tryout';
  setActiveTab: (tab: any) => void;
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  targetRole,
  setTargetRole
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-brand-500/20">
              SMK
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-sky-600 bg-clip-text text-transparent">
                  SMK
                </span>
                <span className="text-[10px] bg-brand-100 text-brand-700 font-extrabold px-1.5 py-0.5 rounded border border-brand-200">
                  Siap Masuk Kerja
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                Simulasikan Seleksi. Tingkatkan Kesiapan.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('kraepelin')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'kraepelin'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Tes Kraepelin
            </button>

            <button
              onClick={() => setActiveTab('qc-accuracy')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'qc-accuracy'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Ketelitian QC
            </button>

            <button
              onClick={() => setActiveTab('mechanical')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'mechanical'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Mekanika Bennett
            </button>

            <button
              onClick={() => setActiveTab('tips')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'tips'
                  ? 'bg-brand-50 text-brand-700 border border-brand-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              Tips & Trik
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`ml-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'interview'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>AI Interview</span>
              <span className="text-[9px] bg-amber-400 text-slate-950 px-1 py-0.2 rounded font-black uppercase">
                AI
              </span>
            </button>
          </nav>

          {/* Target Role Selector & Action */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 pl-2">Role:</span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="bg-white text-xs font-bold text-slate-800 py-1 px-2.5 rounded-lg border-0 shadow-xs focus:ring-2 focus:ring-brand-500 cursor-pointer outline-none"
              >
                <option value="operator">Operator Produksi</option>
                <option value="qc">QC Inspector</option>
                <option value="maintenance">Maintenance</option>
                <option value="logistics">Logistik & Gudang</option>
              </select>
            </div>

            <button
              onClick={() => setActiveTab('tryout-full')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Award className="w-4 h-4" />
              <span>Tryout Real</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
