import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  X, 
  Share, 
  PlusSquare, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../utils/theme-context';
import { usePwaInstall } from '../../utils/pwa-manager';
import { sounds } from '../../utils/sound-effects';
import { AppLogo } from '../common/AppLogo';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({
  isOpen,
  onClose
}) => {
  const { isDark } = useTheme();
  const { isStandalone, hasNativePrompt, isIos, install } = usePwaInstall();
  const [isInstalling, setIsInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    sounds.playClick();
    if (hasNativePrompt) {
      setIsInstalling(true);
      try {
        const outcome = await install();
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          sounds.playCelebration();
          try {
            confetti({
              particleCount: 50,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (_) {}
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (err) {
        console.warn('[PWA Install Error]', err);
      } finally {
        setIsInstalling(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div 
        className={`w-full max-w-md sm:max-w-lg rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        
        {/* Top Header Bar */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between shrink-0 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-brand-500 to-teal-400 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black leading-tight">
                Install Aplikasi (PWA)
              </h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Aplikasi Resmi SMK Siap Masuk Kerja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          
          {/* Logo & Hero Card */}
          <div className={`rounded-3xl p-5 text-center relative overflow-hidden border ${
            isDark 
              ? 'bg-gradient-to-b from-sky-950/40 via-slate-900 to-slate-900 border-sky-500/20' 
              : 'bg-gradient-to-b from-sky-50 via-teal-50/40 to-white border-sky-200'
          }`}>
            <div className="flex justify-center mb-3">
              <AppLogo size="lg" isDark={isDark} showText={false} />
            </div>

            <h3 className="text-base sm:text-lg font-black tracking-tight">
              SMK — Siap Masuk Kerja
            </h3>
            <p className={`text-xs mt-1 leading-relaxed max-w-xs mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Pasang aplikasi di layar utama HP / Tablet Anda untuk pengalaman belajar yang jauh lebih cepat dan responsif.
            </p>

            {/* Badges */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-sky-300 border border-brand-200 dark:border-brand-800">
                Ukuran 0 MB (Cloud PWA)
              </span>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Bebas Iklan
              </span>
            </div>
          </div>

          {/* Key Advantages Checklist */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 block px-1">
              Keunggulan Aplikasi Terpasang
            </span>

            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  icon: Smartphone,
                  color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
                  title: 'Akses Instan dari Layar Utama (Home Screen)',
                  desc: 'Buka latihan soal dan tes koran dengan sekali ketuk tanpa perlu buka browser terlebih dahulu.'
                },
                {
                  icon: Zap,
                  color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
                  title: 'Tampilan Layar Penuh Standalone',
                  desc: 'Bebas dari bilah URL browser dan tombol navigasi website yang mengganggu saat mengerjakan tes cepat.'
                },
                {
                  icon: Layers,
                  color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
                  title: 'Lebih Cepat & Hemat Kuota',
                  desc: 'Aset modul dan bank soal disimpan dalam cache perangkat untuk transisi halaman super instan.'
                }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className={`p-3 rounded-2xl border flex items-start gap-3 transition-colors ${
                      isDark ? 'bg-slate-800/50 border-slate-700/80' : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold block leading-snug">
                        {item.title}
                      </strong>
                      <p className={`text-[11px] mt-0.5 leading-tight ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* iOS / Safari Specific Guidance */}
          {isIos && !isStandalone && (
            <div className={`rounded-2xl p-4 border space-y-2.5 ${
              isDark ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <strong className="text-xs font-bold">Panduan Pasang di iPhone & iPad (Safari):</strong>
              </div>

              <ol className="text-xs space-y-2 pl-4 list-decimal leading-relaxed">
                <li>
                  Ketuk tombol <strong className="inline-flex items-center gap-1 font-extrabold"><Share className="w-3.5 h-3.5 inline text-sky-500" /> Bagikan (Share)</strong> di bilah bawah browser Safari.
                </li>
                <li>
                  Gulir ke bawah dan pilih menu <strong className="inline-flex items-center gap-1 font-extrabold"><PlusSquare className="w-3.5 h-3.5 inline text-emerald-500" /> Tambahkan ke Layar Utama (Add to Home Screen)</strong>.
                </li>
                <li>
                  Ketuk tombol <strong>"Tambah" (Add)</strong> di pojok kanan atas layar. Ikon SiapKerja akan langsung muncul di HP Anda!
                </li>
              </ol>
            </div>
          )}

          {/* Already installed state */}
          {isStandalone && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <strong className="text-xs font-bold block">Aplikasi Sudah Terpasang!</strong>
                <p className="text-[11px] opacity-90">Anda sedang menjalankan versi aplikasi PWA mandiri di perangkat ini.</p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Action Footer */}
        <div className={`p-4 border-t shrink-0 flex items-center gap-2.5 ${
          isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
        }`}>
          {!isStandalone && (
            <button
              onClick={handleInstallClick}
              disabled={isInstalling || installSuccess}
              className="flex-1 py-3.5 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {installSuccess
                  ? 'Aplikasi Berhasil Dipasang!'
                  : isInstalling
                    ? 'Sedang Memasang...'
                    : hasNativePrompt
                      ? 'Install Aplikasi Sekarang'
                      : isIos
                        ? 'Ikuti Petunjuk di Atas'
                        : 'Pasang ke Layar Utama'}
              </span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {isStandalone ? 'Tutup' : 'Nanti Saja'}
          </button>
        </div>

      </div>
    </div>
  );
};
