import React, { useEffect } from 'react';
import { 
  Flame, 
  Award, 
  CheckCircle2, 
  Zap, 
  Clock, 
  Trophy, 
  X, 
  Sparkles, 
  ArrowRight, 
  Calendar,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../utils/theme-context';
import { RegisteredUser, getUserStreakInfo } from '../../utils/auth-storage';
import { sounds } from '../../utils/sound-effects';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: RegisteredUser | null;
  onStartPractice?: () => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  user,
  onStartPractice
}) => {
  const { isDark } = useTheme();

  const streakInfo = getUserStreakInfo(user);

  useEffect(() => {
    if (isOpen) {
      sounds.playClick();
      if (streakInfo.streakDays >= 3) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (_) {}
      }
    }
  }, [isOpen, streakInfo.streakDays]);

  if (!isOpen) return null;

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
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-md shadow-orange-500/30">
              <Flame className="w-5 h-5 fill-current animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black leading-tight">
                Streak Latihan Harian
              </h2>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Konsistensi Belajar & Latihan Kerja
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

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
          
          {/* Main Hero Glowing Flame Card */}
          <div className={`rounded-3xl p-5 sm:p-6 text-center relative overflow-hidden border shadow-sm ${
            isDark 
              ? 'bg-gradient-to-b from-orange-950/40 via-slate-900 to-slate-900 border-orange-500/20' 
              : 'bg-gradient-to-b from-orange-50 via-amber-50/50 to-white border-orange-200'
          }`}>
            {/* Ambient background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Glowing Big Flame Icon */}
            <div className="relative inline-block mx-auto mb-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-xl shadow-orange-500/30 ring-4 ring-orange-400/20 animate-bounce">
                <Flame className="w-12 h-12 sm:w-14 sm:h-14 fill-white" />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-950 text-amber-400 border border-amber-500/40 shadow-md whitespace-nowrap">
                {streakInfo.isActiveToday ? 'Api Menyala! 🔥' : 'Siaga Latihan ⚡'}
              </span>
            </div>

            {/* Streak Number & Headline */}
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500">
                {streakInfo.streakDays} Hari Beruntun!
              </div>
              <p className={`text-xs mt-1.5 font-semibold max-w-xs mx-auto leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {streakInfo.isActiveToday
                  ? 'Keren! Kamu sudah latihan hari ini. Kebiasaan konsisten ini membuat peluang lolos seleksi pabrik meningkat drastis.'
                  : 'Selesaikan minimal 1 modul latihan tes atau tryout hari ini agar apimu tidak padam!'}
              </p>
            </div>

            {/* Daily Status Pill */}
            <div className="mt-4 pt-3.5 border-t border-orange-200/50 dark:border-orange-500/20 flex items-center justify-center gap-2">
              {streakInfo.isActiveToday ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Misi Harian Selesai Hari Ini</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-full border border-amber-300 dark:border-amber-700">
                  <Clock className="w-4 h-4 shrink-0 animate-spin" />
                  <span>Belum Latihan Hari Ini (Batas 23.59 WIB)</span>
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Weekly Flame Tracker (Senin - Minggu) */}
          <div className={`rounded-2xl p-4 border transition-colors ${
            isDark ? 'bg-slate-800/60 border-slate-700/80' : 'bg-slate-50 border-slate-200/80'
          }`}>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />
                <span>Pelacak Minggu Ini</span>
              </span>
              <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Senin — Minggu
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {streakInfo.weeklyHistory.map((d, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                    d.isToday 
                      ? 'ring-2 ring-orange-500 ring-offset-2 dark:ring-offset-slate-900 bg-orange-500/10 border-orange-400' 
                      : d.isCompleted 
                        ? isDark ? 'bg-slate-800 border-orange-500/30' : 'bg-white border-orange-200' 
                        : isDark ? 'bg-slate-850 border-slate-750 opacity-60' : 'bg-slate-100/70 border-slate-200 opacity-60'
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase ${
                    d.isToday ? 'text-orange-600 dark:text-orange-400' : isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {d.shortDay}
                  </span>

                  <div className="my-1.5 flex items-center justify-center">
                    {d.isCompleted ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
                        <Flame className="w-4 h-4 fill-white" />
                      </div>
                    ) : d.isToday ? (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-orange-500 text-orange-500 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <span className="text-[10px] font-bold">•</span>
                      </div>
                    )}
                  </div>

                  <span className={`text-[10px] font-mono font-bold ${
                    d.isToday ? 'text-orange-600 dark:text-orange-400' : isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {d.dayNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones / Target Streak Badges */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider px-1 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Target & Pencapaian Konsistensi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {streakInfo.milestones.map((m) => (
                <div 
                  key={m.days}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    m.achieved
                      ? isDark 
                        ? 'bg-amber-950/30 border-amber-500/40 text-white' 
                        : 'bg-amber-50/70 border-amber-300 text-slate-900'
                      : isDark 
                        ? 'bg-slate-800/40 border-slate-700/60 opacity-60' 
                        : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                      m.achieved 
                        ? 'bg-amber-500 text-slate-950 shadow-xs' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {m.days}H
                    </div>
                    <div>
                      <h4 className="text-xs font-black leading-snug">{m.title}</h4>
                      <p className={`text-[10px] mt-0.5 line-clamp-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {m.desc}
                      </p>
                    </div>
                  </div>

                  {m.achieved ? (
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded-md shrink-0">
                      ✓ Aktif
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 shrink-0">
                      Kunci
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Psychology / Industrial Tip Box */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
            isDark 
              ? 'bg-sky-950/40 border-sky-800/60 text-sky-200' 
              : 'bg-sky-50 border-sky-200 text-sky-900'
          }`}>
            <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <strong className="font-extrabold block">Fakta Seleksi Pabrik:</strong>
              <p className="text-[11px] opacity-90">
                Peserta yang rutin latihan 10-15 menit per hari memiliki kecepatan hitung Kraepelin <strong>3x lebih stabil</strong> dan tingkat kelulusan <strong>94.8%</strong> di tes psikotes industri otomotif & manufaktur.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Action Footer */}
        <div className={`p-4 border-t shrink-0 flex items-center gap-2.5 ${
          isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'
        }`}>
          <button
            onClick={() => {
              onClose();
              if (onStartPractice) onStartPractice();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 hover:from-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all transform active:scale-98 cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{streakInfo.isActiveToday ? 'Lanjut Latihan Soal' : 'Latihan Sekarang (+1 Hari)'}</span>
          </button>

          <button
            onClick={onClose}
            className={`px-4 py-3 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
