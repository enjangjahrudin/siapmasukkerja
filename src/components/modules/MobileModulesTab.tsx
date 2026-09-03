import React, { useState } from 'react';
import { TestCategory } from '../../types';
import { 
  Layers, 
  CheckCircle2, 
  Settings, 
  Calculator, 
  Palette, 
  Mic, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Sparkles,
  Zap,
  Brain
} from 'lucide-react';

interface MobileModulesTabProps {
  onSelectTest: (test: TestCategory | 'tips' | 'tryout-full') => void;
}

export const MobileModulesTab: React.FC<MobileModulesTabProps> = ({ onSelectTest }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'hitung' | 'visual' | 'interview'>('all');

  const modules = [
    {
      id: 'kraepelin',
      title: 'Tes Kraepelin & Pauli',
      category: 'hitung',
      badge: 'Psikotes Koran',
      badgeColor: 'bg-brand-100 text-brand-700',
      icon: Layers,
      iconColor: 'text-brand-600 bg-brand-50',
      description: 'Latihan penjumlahan beruntun bawah ke atas / atas ke bawah dengan timer 15s per kolom.'
    },
    {
      id: 'multiplication-table',
      title: 'Tabel Perkalian Kilat (2 Menit)',
      category: 'hitung',
      badge: 'Speed Blitz',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Zap,
      iconColor: 'text-amber-600 bg-amber-50',
      description: 'Tantangan kecepatan hitung perkalian 1×1 sampai 10×10 dalam waktu 120 detik non-stop.'
    },
    {
      id: 'math-basic',
      title: 'Matematika Dasar & Soal Cerita',
      category: 'hitung',
      badge: 'Bank Acak',
      badgeColor: 'bg-sky-100 text-sky-800',
      icon: Calculator,
      iconColor: 'text-sky-600 bg-sky-50',
      description: 'Kabataku, pecahan, persen diskon, perbandingan tenaga kerja shift, dan konversi satuan.'
    },
    {
      id: 'psychotest',
      title: 'Psikotes Penalaran & Logika',
      category: 'visual',
      badge: 'Bank Acak',
      badgeColor: 'bg-purple-100 text-purple-800',
      icon: Brain,
      iconColor: 'text-purple-600 bg-purple-50',
      description: 'Sinonim istilah industri, lawan kata antonim, analogi kata, dan silogisme deduksi.'
    },
    {
      id: 'qc-accuracy',
      title: 'Ketelitian & Barcode QC',
      category: 'visual',
      badge: 'Standar QC Pabrik',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600 bg-emerald-50',
      description: 'Pencocokan cepat barcode master vs sample dalam 45 detik dan pemahaman toleransi limit NG.'
    },
    {
      id: 'mechanical',
      title: 'Tes Mekanika Bennett',
      category: 'visual',
      badge: 'Teknik & Mesin',
      badgeColor: 'bg-blue-100 text-blue-700',
      icon: Settings,
      iconColor: 'text-blue-600 bg-blue-50',
      description: 'Prinsip putaran roda gigi (CW/CCW), keuntungan mekanis katrol, dan titik tumpu tuas pengungkit.'
    },
    {
      id: 'wartegg',
      title: 'Kanvas Tes Wartegg (8 Kotak)',
      category: 'visual',
      badge: 'Psikodiagnostik',
      badgeColor: 'bg-rose-100 text-rose-700',
      icon: Palette,
      iconColor: 'text-rose-600 bg-rose-50',
      description: 'Panduan lengkap dan kanvas menggambar 8 stimulus untuk mengungkap kepribadian kerja.'
    },
    {
      id: 'interview',
      title: 'AI Voice Mock Interview HRD',
      category: 'interview',
      badge: 'Fitur Premium AI',
      badgeColor: 'bg-purple-100 text-purple-700',
      icon: Mic,
      iconColor: 'text-purple-600 bg-purple-50',
      description: 'Simulasi wawancara suara real-time dengan persona HRD Astra/Epson & prediksi % kelulusan.'
    },
    {
      id: 'tips',
      title: 'Pojok Materi & Tips Sukses',
      category: 'interview',
      badge: 'Edukasi K3 & 5S',
      badgeColor: 'bg-teal-100 text-teal-700',
      icon: BookOpen,
      iconColor: 'text-teal-600 bg-teal-50',
      description: 'Panduan budaya industri 5S/5R, persiapan tes fisik MCU, dan trik menjawab interview HRD.'
    }
  ];

  const filteredModules = modules.filter(m => {
    if (selectedFilter === 'all') return true;
    return m.category === selectedFilter;
  });

  return (
    <div className="p-4 space-y-4 pb-20 select-none">
      
      {/* Title & Filter Tabs */}
      <div>
        <h1 className="text-base font-extrabold text-slate-900">Daftar Modul Tes Masuk Kerja</h1>
        <p className="text-xs text-slate-500 mt-0.5">Pilih jenis soal yang ingin Anda pelajari dan latih.</p>

        {/* Filter Badges */}
        <div className="flex gap-1.5 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: 'all', label: 'Semua Modul (9)' },
            { id: 'hitung', label: 'Hitung Cepat' },
            { id: 'visual', label: 'Visual & Logika' },
            { id: 'interview', label: 'Interview & Tips' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedFilter === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-3">
        {filteredModules.map(mod => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.id}
              onClick={() => onSelectTest(mod.id as any)}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs active:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl ${mod.iconColor} flex items-center justify-center shrink-0 shadow-xs`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded-md ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                    {mod.description}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
            </div>
          );
        })}
      </div>

    </div>
  );
};
