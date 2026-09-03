import React from 'react';
import { TargetRole, TestCategory } from '../../types';
import { 
  Layers, 
  CheckCircle2, 
  Settings, 
  Calculator, 
  Maximize2, 
  Palette, 
  Mic, 
  Award, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Flame,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: TestCategory | 'tips' | 'tryout-full') => void;
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  targetRole,
  setTargetRole
}) => {
  const roleDisplayNames: Record<TargetRole, { name: string; target: string; desc: string }> = {
    operator: {
      name: 'Operator Produksi',
      target: 'PT Astra Daihatsu / PT Yamaha Motor / PT Denso',
      desc: 'Tes Kraepelin, Mekanika Roda Gigi, Ketahanan Fisik & Kesiapan Shift.'
    },
    qc: {
      name: 'Quality Control (QC)',
      target: 'PT Epson Indonesia / PT Omron / PT Mayora',
      desc: 'Tes Ketelitian Barcode, Drawing Toleransi, Sikap Tegas Reject NG.'
    },
    maintenance: {
      name: 'Maintenance & Teknisi',
      target: 'PT Toyota Motor / PT Astra Honda Motor',
      desc: 'Mekanika Bennett, Sirkuit Listrik Dasar, K3 LOTO & Preventive Maintenance.'
    },
    logistics: {
      name: 'Logistik & Gudang',
      target: 'PT Indofood / PT Lion Super Indo / Shopee Express',
      desc: 'Aritmatika Cepat, Metode FIFO, Akurasi Stock Opname & Barcode.'
    }
  };

  const currentRoleInfo = roleDisplayNames[targetRole];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner with Target Role Tracker */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-3 py-1 rounded-full text-xs font-bold border border-brand-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Persiapan Lolos Tes Kerja SMA / SMK 2026</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Siap Lolos Seleksi Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-300">Pabrik & Perusahaan Impian</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Platform latihan psikotes terlengkap dengan bank soal terverifikasi, simulator tes Koran (Kraepelin/Pauli) presisi, tes ketelitian QC, mekanika Bennett, dan simulasi interview AI suara natural.
            </p>

            {/* Target Role Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Posisi Anda:</span>
                <strong className="text-sky-300 text-sm font-black">{currentRoleInfo.name}</strong>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Benchmark Perusahaan:</span>
                <strong className="text-emerald-300 text-xs font-bold">{currentRoleInfo.target}</strong>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Simulasi Tryout CAT Real</h3>
              <p className="text-xs text-slate-300 mt-1">Gabungan seluruh modul tes dengan timer otomatis mirip tes seleksi asli.</p>
            </div>
            <button
              onClick={() => setActiveTab('tryout-full')}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              Mulai Simulasi Tryout Penuh
            </button>
          </div>

        </div>
      </div>

      {/* 6 Core Test Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Pilihan Modul Latihan & Tes Spesifik
            </h2>
            <p className="text-xs text-slate-500">Pilih modul yang ingin Anda latih hari ini:</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Kraepelin */}
          <div 
            onClick={() => setActiveTab('kraepelin')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-brand-100 text-brand-800 px-2 py-0.5 rounded">
                  ★ Wajib Lolos
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                Tes Kraepelin & Pauli (Koran)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Simulasi penjumlahan angka cepat per kolom (15s/30s), grafik kestabilan emosi, dan analisis ketahanan kerja.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
              <span>Mulai Latihan Tes Koran</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: QC Accuracy */}
          <div 
            onClick={() => setActiveTab('qc-accuracy')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  QC & Operator
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Tes Ketelitian Barcode & Kode
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pencocokan kode cepat (45s speed match), deteksi part number cacat (NG), dan toleransi dimensi mikrometer.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>Mulai Latihan Ketelitian</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Bennett Mechanical */}
          <div 
            onClick={() => setActiveTab('mechanical')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
                  Astra / Yamaha
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                Mekanika Dasar Bennett (Visual)
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Soal interaktif arah putar roda gigi (gear), katrol beban, tuas pengungkit, bejana air, dan kelistrikan dasar.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600">
              <span>Mulai Latihan Mekanika</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Arithmetic & Series */}
          <div 
            onClick={() => setActiveTab('arithmetic')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  Hitung Cepat
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Aritmatika & Deret Angka
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Trik cepat perbandingan tenaga kerja pabrik, kapasitas mesin, persentase defect, dan pola deret bertingkat.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Mulai Latihan Hitungan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Wartegg Canvas */}
          <div 
            onClick={() => setActiveTab('wartegg')}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Palette className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Psikotes Gambar
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                Kanvas & Panduan Tes Wartegg
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Kanvas gambar 8 kotak stimulus, urutan terbaik, penjelasan arti psikologis, dan contoh gambar yang disukai psikolog.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600">
              <span>Buka Kanvas Wartegg</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: AI Voice Mock Interview */}
          <div 
            onClick={() => setActiveTab('interview')}
            className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                  Tahap 2 AI
                </span>
              </div>
              <h3 className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
                AI Voice Mock Interview HRD
              </h3>
              <p className="text-xs text-purple-200 mt-1.5 leading-relaxed">
                Simulasi wawancara suara natural berbahasa Indonesia dengan HRD AI + prediksi % kemungkinan diterima.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-amber-300">
              <span>Mulai Wawancara AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
