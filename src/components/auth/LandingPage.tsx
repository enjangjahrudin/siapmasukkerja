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
  Flame,
  UserPlus,
  LogIn,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../utils/theme-context';
import { AppLogo } from '../common/AppLogo';

interface LandingPageProps {
  onGoToRegister: () => void;
  onGoToLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToRegister, onGoToLogin }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col justify-between select-none transition-colors duration-200 ${
      isDark ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Top App Header with Iconic Logo, Theme Toggle, and Login Button (Clean & Ringkas) */}
      <div className={`p-4 sm:p-5 flex items-center justify-between border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        
        {/* Iconic Logo without tagline subtext for minimal clean look */}
        <AppLogo size="md" isDark={isDark} showText={true} />

        <div className="flex items-center gap-2">
          {/* Theme Toggle Sun / Moon Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-750' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Beralih ke Mode Terang (Light Mode)' : 'Beralih ke Mode Gelap (Dark Mode)'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onGoToLogin}
            className={`text-xs font-bold px-3 py-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700' 
                : 'bg-brand-50 hover:bg-brand-100 text-brand-800 border-brand-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk</span>
          </button>
        </div>
      </div>

      {/* Main Hero & Sales Content */}
      <div className="p-5 space-y-5 flex-1 overflow-y-auto pb-8">
        
        {/* Tagline & Main Headline */}
        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border mb-2.5 ${
            isDark ? 'bg-brand-500/20 text-sky-300 border-brand-500/30' : 'bg-brand-50 text-brand-800 border-brand-200'
          }`}>
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Simulasikan Seleksi. Tingkatkan Kesiapan</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Kunci Sukses Lolos Seleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500">Pabrik & Industri Impian</span>
          </h1>
          <p className={`text-xs mt-2.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Platform latihan interaktif tes Koran (Kraepelin/Pauli), ketelitian barcode QC, logika mekanika Bennett, dan simulasi interview AI dengan standar kelulusan PT Astra, Epson, Yamaha, Denso & Mayora.
          </p>
        </div>

        {/* Value Highlight Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className={`border rounded-2xl p-3.5 transition-colors ${
            isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <Layers className="w-5 h-5 text-sky-500 mb-1.5" />
            <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Simulasi Kraepelin</strong>
            <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Timer presisi & grafik kestabilan ritme kerja.
            </span>
          </div>

          <div className={`border rounded-2xl p-3.5 transition-colors ${
            isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mb-1.5" />
            <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Tes Ketelitian QC</strong>
            <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pencocokan barcode 45s & batas reject NG.
            </span>
          </div>

          <div className={`border rounded-2xl p-3.5 transition-colors ${
            isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <Award className="w-5 h-5 text-amber-500 mb-1.5" />
            <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Mekanika Bennett</strong>
            <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Diagram visual roda gigi, katrol & tuas.
            </span>
          </div>

          <div className={`border rounded-2xl p-3.5 transition-colors ${
            isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <Mic className="w-5 h-5 text-purple-500 mb-1.5" />
            <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Mock Interview</strong>
            <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Suara natural ID + prediksi % kemungkinan lolos.
            </span>
          </div>
        </div>

        {/* Company Targets */}
        <div className={`border rounded-2xl p-4 transition-colors ${
          isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Standar Format Ujian Perusahaan:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['PT Astra Daihatsu', 'PT Epson Indonesia', 'PT Yamaha Motor', 'PT Denso', 'PT Mayora Indah', 'PT Indofood', 'PT KAI'].map((comp, idx) => (
              <span key={idx} className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                isDark ? 'bg-slate-700/60 text-slate-200 border-slate-600/50' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
              }`}>
                ✓ {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className={`flex items-center gap-3 border rounded-2xl p-3.5 transition-colors ${
          isDark 
            ? 'bg-gradient-to-r from-brand-900/60 to-indigo-950/60 border-brand-500/20' 
            : 'bg-sky-50/90 border-sky-200'
        }`}>
          <div className="flex -space-x-2 overflow-hidden">
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center">A</div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center">R</div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">D</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Tingkat kelulusan <strong>92.4%</strong> lulusan SMK/SMA
            </span>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Action Buttons */}
      <div className={`p-4 border-t backdrop-blur-md sticky bottom-0 z-20 space-y-2 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <button
          onClick={onGoToRegister}
          className="w-full py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <UserPlus className="w-4 h-4" />
          <span>Daftar Akun Baru (Gratis)</span>
        </button>

        <button
          onClick={onGoToLogin}
          className={`w-full py-2.5 font-bold text-xs rounded-xl border flex items-center justify-center gap-1.5 transition-colors ${
            isDark 
              ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
        >
          <span>Sudah Punya Akun? Masuk di Sini</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
