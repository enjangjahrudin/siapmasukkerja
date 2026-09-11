import React from 'react';
import { 
  Sparkles, 
  Mic, 
  Lock, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  Headphones, 
  Coins, 
  CheckCircle2, 
  BookOpen
} from 'lucide-react';
import { useTheme } from '../../utils/theme-context';

interface AiInterviewComingSoonProps {
  onExploreTests?: () => void;
  onExploreTips?: () => void;
}

export const AiInterviewComingSoon: React.FC<AiInterviewComingSoonProps> = ({
  onExploreTests,
  onExploreTips
}) => {
  const { isDark } = useTheme();

  return (
    <div className="space-y-4 select-none pb-8 animate-in fade-in duration-300">
      {/* Hero Header Card */}
      <div className={`relative overflow-hidden rounded-3xl p-6 border shadow-xl ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-950/60 to-slate-900 border-purple-800/40 text-white' 
          : 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-800'
      }`}>
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black tracking-wide uppercase shadow-xs">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Tahap Pengembangan (Coming Soon)</span>
          </div>

          {/* Icon Composition */}
          <div className="relative my-2">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-0.5 shadow-2xl shadow-purple-500/40 flex items-center justify-center">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center">
                <Mic className="w-10 h-10 text-purple-300" />
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-amber-400 text-slate-950 shadow-md">
              <Sparkles className="w-4 h-4 fill-current" />
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Simulasi AI Voice Interview HRD
          </h2>

          <p className="text-xs sm:text-sm text-purple-200/90 max-w-sm leading-relaxed">
            Fitur latihan wawancara suara dua arah interaktif bersama AI Recruiter industri manufaktur sedang dalam tahap pengoptimalan sistem suara natural bebas jeda.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-sky-400" />
              Suara Natural Indonesia
            </span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/10 border border-white/15 text-slate-200 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Sistem Top Up Kredit
            </span>
          </div>
        </div>
      </div>

      {/* Sneak Peek Features List */}
      <div className={`p-5 rounded-3xl border shadow-xs space-y-3.5 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <h3 className={`text-xs font-black uppercase tracking-wider ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Fitur yang Sedang Disiapkan
          </h3>
        </div>

        <div className="space-y-3">
          {/* Feature 1 */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
              <Mic className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                1. Voice Call Realtime dengan Avatar HRD
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tanya jawab interaktif langsung melalui suara (audio) dengan karakter HRD berpengalaman (Pak Hendra, Bu Sarah, dan Bu Rina) berstandar Toyota, Astra, dan Epson.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                2. Penilaian Otomatis 4 Pilar Kompetensi
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Evaluasi komprehensif mengukur metode STAR, etika bahasa sopan santun, ketegasan artikulasi, dan kesesuaian posisi operator/QC pabrik.
              </p>
            </div>
          </div>

          {/* Feature 3: Top Up Kredit */}
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
            isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
              <Coins className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  3. Sistem Saldo & Top Up Kredit Otomatis
                </h4>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 bg-amber-400/20 text-amber-400 rounded">
                  Segera
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Paket kredit latihan sesi wawancara dengan sistem aktivasi otomatis untuk memudahkan siswa berlatih berkali-kali sampai percaya diri.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notice Card */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
        isDark ? 'bg-sky-500/10 border-sky-500/20 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-900'
      }`}>
        <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Akses Terkunci Sementara</p>
          <p className="text-[11px] text-sky-700 dark:text-sky-300 leading-relaxed">
            Selama tim pengembang menyempurnakan fitur suara AI dan gateway pembayaran, akses ke simulator ini hanya dibuka untuk pengujian role Administrator.
          </p>
        </div>
      </div>

      {/* Alternative Actions */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onExploreTests}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-emerald-500 hover:from-sky-700 hover:to-emerald-600 text-white font-extrabold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Fokus Latihan Modul Tes Lainnya</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>

        <button
          onClick={onExploreTips}
          className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700' 
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Buka Pojok Tips & Trik Interview (Video)</span>
        </button>
      </div>
    </div>
  );
};
