import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Award, 
  Mic, 
  Star, 
  Users, 
  TrendingUp,
  Building2,
  Lock,
  Flame
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between select-none">
      
      {/* Top App Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-sky-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-brand-500/30">
            SMK
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base tracking-tight text-white block leading-none">
                SMK
              </span>
              <span className="text-[10px] text-sky-400 font-extrabold px-1.5 py-0.2 rounded bg-sky-950 border border-sky-800">
                Siap Masuk Kerja
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold tracking-tight">
              Simulasikan Seleksi. Tingkatkan Kesiapan.
            </span>
          </div>
        </div>

        <button
          onClick={onLogin}
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-700 transition-colors"
        >
          Masuk
        </button>
      </div>

      {/* Main Hero & Sales Content */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto pb-8">
        
        {/* Tagline & Main Headline */}
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-500/20 text-sky-300 px-3 py-1 rounded-full text-[11px] font-bold border border-brand-500/30 mb-2.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Simulasikan Seleksi. Tingkatkan Kesiapan</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
            Kunci Sukses Lolos Seleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Pabrik & Industri Impian</span>
          </h1>
          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            Platform latihan interaktif tes Koran (Kraepelin/Pauli), ketelitian barcode QC, logika mekanika Bennett, dan simulasi interview AI dengan standar kelulusan PT Astra, Epson, Yamaha, Denso & Mayora.
          </p>
        </div>

        {/* Value Highlight Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5">
            <Layers className="w-5 h-5 text-sky-400 mb-1.5" />
            <strong className="text-xs font-extrabold block text-white">Simulasi Kraepelin</strong>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Timer presisi & grafik kestabilan ritme kerja.
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-1.5" />
            <strong className="text-xs font-extrabold block text-white">Tes Ketelitian QC</strong>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Pencocokan barcode 45s & batas reject NG.
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5">
            <Award className="w-5 h-5 text-amber-400 mb-1.5" />
            <strong className="text-xs font-extrabold block text-white">Mekanika Bennett</strong>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Diagram visual roda gigi, katrol & tuas.
            </span>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3.5">
            <Mic className="w-5 h-5 text-purple-400 mb-1.5" />
            <strong className="text-xs font-extrabold block text-white">AI Mock Interview</strong>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Suara natural ID + prediksi % kemungkinan lolos.
            </span>
          </div>
        </div>

        {/* Company Targets */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
            Standar Format Ujian Perusahaan:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['PT Astra Daihatsu', 'PT Epson Indonesia', 'PT Yamaha Motor', 'PT Denso', 'PT Mayora Indah', 'PT Indofood', 'PT KAI'].map((comp, idx) => (
              <span key={idx} className="bg-slate-700/60 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-600/50">
                ✓ {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-brand-900/60 to-indigo-950/60 border border-brand-500/20 rounded-2xl p-3.5">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">A</div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">R</div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">D</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-slate-300 font-medium">
              Tingkat kelulusan <strong>92.4%</strong> lulusan SMK/SMA
            </span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Buttons */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md sticky bottom-0 z-20 space-y-2">
        <button
          onClick={onStart}
          className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <span>Mulai Belajar Sekarang (Gratis)</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[10px] text-slate-400">
          Akses modul latihan gratis tanpa perlu kartu kredit
        </p>
      </div>

    </div>
  );
};
