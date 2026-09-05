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
  Moon,
  PenTool,
  Brain,
  Video,
  Timer,
  CheckCircle,
  HelpCircle
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
      
      {/* Top App Header with Iconic Logo, Theme Toggle, and Login Button */}
      <div className={`p-4 sm:p-5 flex items-center justify-between border-b sticky top-0 z-20 backdrop-blur-md transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        
        {/* Iconic Logo */}
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

      {/* Main Hero & Content Showcase */}
      <div className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto pb-8">
        
        {/* Tagline & Main Headline */}
        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border mb-2.5 ${
            isDark ? 'bg-brand-500/20 text-sky-300 border-brand-500/30' : 'bg-brand-50 text-brand-800 border-brand-200'
          }`}>
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Platform Persiapan Seleksi Kerja #1 Terlengkap</span>
          </div>

          <h1 className={`text-2xl sm:text-3xl font-black leading-tight tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Kunci Sukses Lolos Seleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500">Pabrik & Industri Impian</span>
          </h1>
          <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Simulasi interaktif terlengkap: Tes Koran (Kraepelin/Pauli), Kanvas Wartegg, Ketelitian QC, Mekanika Bennett, 1.000+ Psikotes, Tryout CAT, hingga AI Mock Interview standar PT Astra, Epson, Yamaha & Mayora.
          </p>
        </div>

        {/* Quick Highlights Stats Pill Bar */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700/70' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-sm sm:text-base font-black text-sky-500">1.000+</div>
            <div className="text-[10px] text-slate-400 font-medium">Bank Soal</div>
          </div>
          <div className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700/70' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-sm sm:text-base font-black text-emerald-500">9+ Modul</div>
            <div className="text-[10px] text-slate-400 font-medium">Tes Standar</div>
          </div>
          <div className={`p-2.5 rounded-2xl border ${
            isDark ? 'bg-slate-800/60 border-slate-700/70' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="text-sm sm:text-base font-black text-amber-500">Real-Time</div>
            <div className="text-[10px] text-slate-400 font-medium">Statistik & AI</div>
          </div>
        </div>

        {/* Complete Feature Grid Showcase (8 Key Modules) */}
        <div>
          <span className={`text-[11px] uppercase font-extrabold tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fitur & Modul Latihan Lengkap:
          </span>
          
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Kraepelin */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Layers className="w-4 h-4 text-sky-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Tes Kraepelin & Pauli</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Timer presisi, grafik Panker/Janker & analisis ritme kerja.
              </span>
            </div>

            {/* 2. Wartegg Canvas */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <PenTool className="w-4 h-4 text-pink-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Kanvas Tes Wartegg</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                8 kotak gambar fokus penuh, simpan riwayat & bedah makna psikologis.
              </span>
            </div>

            {/* 3. Ketelitian QC */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Ketelitian Kode QC</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pencocokan barcode 45 detik & toleransi reject NG.
              </span>
            </div>

            {/* 4. Mekanika Bennett */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Award className="w-4 h-4 text-amber-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Mekanika Bennett</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Diagram visual roda gigi, katrol, tuas & fluida.
              </span>
            </div>

            {/* 5. Psikotes 1000+ */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Brain className="w-4 h-4 text-indigo-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>1.000+ Soal Psikotes</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Figural, spasial, analogi, silogisme & matematika dasar.
              </span>
            </div>

            {/* 6. AI Interview */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Mic className="w-4 h-4 text-purple-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Mock Interview</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Tanya jawab suara interaktif & prediksi skor kelulusan HRD.
              </span>
            </div>

            {/* 7. Tryout CAT Akbar */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Timer className="w-4 h-4 text-rose-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Tryout CAT Akbar</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Simulasi komprehensif berbatas waktu dengan passing grade nyata.
              </span>
            </div>

            {/* 8. Tips & Video Edukasi */}
            <div className={`border rounded-2xl p-3 transition-colors ${
              isDark ? 'bg-slate-800/70 border-slate-700/80' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <Video className="w-4 h-4 text-teal-500 mb-1" />
              <strong className={`text-xs font-extrabold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Tips & Video Edukasi</strong>
              <span className={`text-[10px] leading-tight block mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Video trik & artikel pop-up rahasia lolos dari praktisi industri.
              </span>
            </div>
          </div>
        </div>

        {/* Company Targets */}
        <div className={`border rounded-2xl p-3.5 transition-colors ${
          isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-100/80 border-slate-200'
        }`}>
          <span className={`text-[10px] uppercase font-bold tracking-wider block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Standar Format Ujian Perusahaan:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              'PT Astra Daihatsu', 
              'PT Epson Indonesia', 
              'PT Yamaha Motor', 
              'PT Denso Indonesia', 
              'PT Mayora Indah', 
              'PT Indofood', 
              'PT KAI',
              'PT Toyota Boshoku',
              'PT Honda Prospect Motor'
            ].map((comp, idx) => (
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
              Tingkat kelulusan <strong>94.8%</strong> siswa SMK & calon operator
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

