import React from 'react';
import { TargetRole, TestCategory } from '../../types';
import { 
  Layers, 
  CheckCircle2, 
  Settings, 
  Calculator, 
  Palette, 
  Mic, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Building2, 
  Clock, 
  Target,
  Flame,
  Brain,
  Zap
} from 'lucide-react';

interface MobileHomeDashboardProps {
  onSelectTest: (test: TestCategory | 'tips' | 'tryout-full') => void;
  targetRole: TargetRole;
  userName: string;
}

export const MobileHomeDashboard: React.FC<MobileHomeDashboardProps> = ({
  onSelectTest,
  targetRole,
  userName
}) => {
  const sectorTargets: Record<TargetRole, { sector: string; examples: string; roleLabel: string }> = {
    operator: {
      sector: 'Manufaktur Otomotif & Assembling',
      examples: 'Toyota, Astra Group, Yamaha, Honda & Suzuki',
      roleLabel: 'Operator Produksi'
    },
    qc: {
      sector: 'Industri Elektronika & Presisi Mutu',
      examples: 'Epson, Omron, Panasonic, Denso & Sharp',
      roleLabel: 'Quality Control (QC)'
    },
    maintenance: {
      sector: 'Teknik Otomasi, Mesin & Alat Berat',
      examples: 'Astra Otoparts, Komatsu, United Tractors & Denso',
      roleLabel: 'Teknisi Maintenance'
    },
    logistics: {
      sector: 'Logistik, Pergudangan & Distribusi FMCG',
      examples: 'Mayora, Indofood, Unilever, Kalbe & Wings Group',
      roleLabel: 'Logistik & Gudang'
    }
  };

  const currentTarget = sectorTargets[targetRole] || sectorTargets.operator;

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      
      {/* Target Status Card */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-md relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-sky-400 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Target Rekrutmen 2026
            </span>
            <h2 className="text-base font-extrabold text-white leading-tight">
              {currentTarget.sector}
            </h2>
            <p className="text-[11px] text-sky-300 font-medium">
              Contoh: <span className="text-slate-200">{currentTarget.examples}</span>
            </p>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Standar Seleksi SMK/SMA • <strong className="text-sky-300">{currentTarget.roleLabel}</strong>
            </p>
          </div>

          <button
            onClick={() => onSelectTest('tryout-full')}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-[11px] px-3 py-2 rounded-xl shadow-md flex items-center gap-1"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Tryout</span>
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
          <span>Passing Grade Rata-rata: <strong className="text-emerald-400 font-bold">75%</strong></span>
          <span className="text-sky-300 font-semibold">Simulasikan Seleksi</span>
        </div>
      </div>

      {/* Main Grid App Icons Menu (Android Style) */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Menu Latihan Tes Seleksi
          </h3>
          <span className="text-[10px] text-brand-600 font-bold">Pilih Modul</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          
          {/* 1. Kraepelin */}
          <div
            onClick={() => onSelectTest('kraepelin')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-brand-100 text-brand-800 px-1.5 py-0.2 rounded">
                Koran
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Tes Kraepelin & Pauli
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Hitung cepat & ritme kerja
              </span>
            </div>
          </div>

          {/* 2. QC Accuracy */}
          <div
            onClick={() => onSelectTest('qc-accuracy')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                QC & Barcode
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Ketelitian Kode QC
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Speed match 45s & NG reject
              </span>
            </div>
          </div>

          {/* 3. NEW: Matematika Dasar */}
          <div
            onClick={() => onSelectTest('math-basic')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">
                Bank Acak
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Matematika Dasar
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Kabataku, persen, aljabar & soal cerita
              </span>
            </div>
          </div>

          {/* 4. NEW: Tabel Perkalian (1x1 - 10x10) 2 Menit */}
          <div
            onClick={() => onSelectTest('multiplication-table')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-amber-500" />
              </div>
              <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                2 Menit
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Tabel Perkalian Kilat
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Tantangan 1×1 s/d 10×10 (120s)
              </span>
            </div>
          </div>

          {/* 5. NEW: Psikotes Umum Lengkap */}
          <div
            onClick={() => onSelectTest('psychotest')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                Psikotes
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Psikotes & Penalaran
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Sinonim, antonim, analogi & silogisme
              </span>
            </div>
          </div>

          {/* 6. Bennett Mechanical */}
          <div
            onClick={() => onSelectTest('mechanical')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                Mekanika
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Mekanika Bennett
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                Roda gigi, katrol & tuas
              </span>
            </div>
          </div>

          {/* 7. Wartegg Canvas */}
          <div
            onClick={() => onSelectTest('wartegg')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                Gambar
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Kanvas Tes Wartegg
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                8 Kotak psikotes & panduan
              </span>
            </div>
          </div>

          {/* 8. Tips & Edu */}
          <div
            onClick={() => onSelectTest('tips')}
            className="bg-white border border-slate-200/90 rounded-2xl p-3.5 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">
                Materi
              </span>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-slate-900 block leading-snug">
                Pojok Tips & Trik
              </strong>
              <span className="text-[10px] text-slate-500 mt-0.5 block line-clamp-1">
                5S/5R, tes fisik & interview
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* AI Voice Mock Interview Hero Card (Tahap 2 Feature) */}
      <div 
        onClick={() => onSelectTest('interview')}
        className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-lg active:scale-98 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Fitur Premium Tahap 2</span>
          </div>
          <span className="text-[10px] text-purple-300 font-bold">Suara Natural ID</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              AI Voice Mock Interview HRD
            </h4>
            <p className="text-[11px] text-purple-200 leading-tight">
              Simulasi wawancara suara dengan HRD + kalkulator % probabilitas diterima kerja.
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0 border border-white/20">
            <Mic className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-bold">
          <span>Mulai Simulasi Wawancara Suara</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

    </div>
  );
};
