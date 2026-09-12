import React, { useState, useEffect, useRef } from 'react';
import { getRandomTryoutSet, TRYOUT_CONFIG } from '../../data/questions-tryout';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { recordUserTestResult, getActiveSession, UserTestRecord } from '../../utils/auth-storage';
import { useTheme } from '../../utils/theme-context';
import { 
  Award, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  X,
  History,
  BookOpen,
  Sparkles,
  Layers,
  Check,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FullTryoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullTryoutModal: React.FC<FullTryoutModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [allQuestions, setAllQuestions] = useState<BaseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(TRYOUT_CONFIG.durationSeconds);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [tryoutHistory, setTryoutHistory] = useState<UserTestRecord[]>([]);

  const timerRef = useRef<any>(null);

  // Load user tryout history
  const loadHistory = () => {
    const user = getActiveSession();
    if (user?.testHistory) {
      const filtered = user.testHistory.filter(
        h => h.testType === 'tryout' || h.testName?.toLowerCase().includes('tryout')
      );
      setTryoutHistory(filtered);
    }
  };

  // Start new tryout session
  const initNewTryout = () => {
    // Generate freshly randomized 30 questions from 6 industrial domains
    const randomizedSet = getRandomTryoutSet(TRYOUT_CONFIG.totalQuestions);
    setAllQuestions(randomizedSet);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(TRYOUT_CONFIG.durationSeconds);
    setIsSubmitted(false);
    setShowReview(false);
    setShowHistoryModal(false);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
      initNewTryout();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playCelebration();
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    const correctCount = Object.entries(answers).filter(
      ([idx, ans]) => allQuestions[Number(idx)]?.correctAnswer === ans
    ).length;
    const totalQ = allQuestions.length || TRYOUT_CONFIG.totalQuestions;
    const scorePercent = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
    const timeSpent = TRYOUT_CONFIG.durationSeconds - timeLeft;

    // Breakdown per sub-category
    const breakdown: Record<string, { total: number; correct: number }> = {};
    allQuestions.forEach((q, idx) => {
      const cat = q.subCategory || q.category || 'Umum';
      if (!breakdown[cat]) breakdown[cat] = { total: 0, correct: 0 };
      breakdown[cat].total += 1;
      if (answers[idx] === q.correctAnswer) {
        breakdown[cat].correct += 1;
      }
    });

    recordUserTestResult({
      testType: 'tryout',
      testName: `Simulasi CAT Tryout Akbar (${totalQ} Soal)`,
      score: scorePercent,
      totalQuestions: totalQ,
      correctAnswers: correctCount,
      details: {
        timeSpentSeconds: timeSpent,
        breakdown,
        passingGrade: TRYOUT_CONFIG.passingGradePercent,
        isPassed: scorePercent >= TRYOUT_CONFIG.passingGradePercent,
        completedAt: new Date().toISOString()
      } as any
    }).then(() => {
      loadHistory();
    });
  };

  if (!isOpen) return null;

  const currentQ = allQuestions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft <= TRYOUT_CONFIG.timeWarningSeconds;

  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => allQuestions[Number(idx)]?.correctAnswer === ans
  ).length;
  const totalQ = allQuestions.length || TRYOUT_CONFIG.totalQuestions;
  const scorePercent = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;
  const isPassed = scorePercent >= TRYOUT_CONFIG.passingGradePercent;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className={`rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border relative max-h-[94vh] flex flex-col justify-between transition-colors overflow-y-auto ${
        isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>

        {/* Top Header Bar */}
        <div className={`flex items-center justify-between pb-3.5 mb-3 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  Simulasi CAT Akbar • 30 Soal
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  Bank Soal +1.000 Teracak
                </span>
              </div>
              <h2 className={`text-sm sm:text-base font-black mt-0.5 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Tryout Kesiapan Kerja Seleksi Pabrik
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Riwayat Tryout Button */}
            <button
              onClick={() => setShowHistoryModal(true)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Lihat Riwayat Tryout Saya"
            >
              <History className="w-3.5 h-3.5 text-sky-500" />
              <span className="hidden sm:inline">Riwayat ({tryoutHistory.length})</span>
            </button>

            {/* Timer if active */}
            {!isSubmitted && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono font-black text-xs sm:text-sm ${
                isTimeCritical
                  ? 'bg-red-500/20 text-red-500 border-red-500/40 animate-pulse'
                  : isDark
                  ? 'bg-slate-800/80 text-sky-400 border-slate-700'
                  : 'bg-sky-50 text-sky-700 border-sky-200'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'animate-spin' : ''}`} />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: ACTIVE EXAM MODE */}
        {/* ------------------------------------------------------------- */}
        {!isSubmitted && !showReview && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Questions Number Strip (1 s/d 30) */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                <span>Progress Pengerjaan: <strong className="text-amber-500 font-black">{answeredCount}</strong> / {totalQ} Soal</span>
                <span>Passing Grade: <strong className="text-emerald-500 font-bold">{TRYOUT_CONFIG.passingGradePercent}%</strong></span>
              </div>

              <div className="grid grid-cols-10 sm:grid-cols-15 gap-1 p-2 rounded-2xl border max-h-24 overflow-y-auto no-scrollbar bg-slate-500/5 border-slate-200 dark:border-slate-800">
                {allQuestions.map((_, i) => {
                  const isAnswered = answers[i] !== undefined;
                  const isCurrent = currentIndex === i;

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 font-black scale-105 shadow-xs'
                          : isAnswered
                          ? 'bg-sky-500 text-white font-bold'
                          : isDark
                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question Body */}
            {currentQ && (
              <div className={`p-4 rounded-2xl border my-2 ${
                isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-500/20 text-brand-500">
                      Soal #{currentIndex + 1} dari {totalQ}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 truncate max-w-[200px] sm:max-w-none">
                      {currentQ.subCategory || currentQ.category}
                    </span>
                  </div>
                  {answers[currentIndex] !== undefined && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Terjawab
                    </span>
                  )}
                </div>

                <h3 className={`text-sm sm:text-base font-bold leading-relaxed mb-4 ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {currentQ.question}
                </h3>

                {/* Multiple Choice Options (A, B, C, D) */}
                <div className="space-y-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentIndex] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
                          sounds.playClick();
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 font-bold ring-1 ring-amber-400'
                            : isDark
                            ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Bottom Nav Controls */}
            <div className={`flex items-center justify-between pt-3 mt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                  isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-center text-[10px] text-slate-400 hidden sm:block">
                Nomor {currentIndex + 1} dari {totalQ}
              </div>

              {currentIndex + 1 < allQuestions.length ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kumpulkan Jawaban</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: EXAM RESULTS REPORT */}
        {/* ------------------------------------------------------------- */}
        {isSubmitted && !showReview && (
          <div className="py-2 space-y-4">
            <div className="text-center space-y-1.5">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-2 ${
                isPassed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <Award className="w-8 h-8" />
              </div>
              <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Rapor Simulasi Tryout CAT
              </h3>
              <p className="text-xs text-slate-400">
                Uji Kompetensi Kesiapan Kerja Standar Astra • Toyota • Epson • Yamaha
              </p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-black mt-1 ${
                isPassed 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isPassed ? '✓ LOLOS PASSING GRADE INDUSTRI (≥ 75%)' : '✗ BELUM MEMENUHI PASSING GRADE (< 75%)'}
              </div>
            </div>

            {/* Main Score Metrics */}
            <div className="grid grid-cols-3 gap-2.5 max-w-lg mx-auto">
              <div className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Skor Akurasi</span>
                <div className="text-2xl font-black text-amber-500 mt-0.5">{scorePercent}%</div>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Jawaban Benar</span>
                <div className="text-2xl font-black text-emerald-500 mt-0.5">{correctCount} <span className="text-xs text-slate-400 font-normal">/ {totalQ}</span></div>
              </div>

              <div className={`p-3 rounded-2xl border text-center ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Durasi Pengerjaan</span>
                <div className="text-lg font-black text-sky-400 mt-1">
                  {Math.floor((TRYOUT_CONFIG.durationSeconds - timeLeft) / 60)}m {(TRYOUT_CONFIG.durationSeconds - timeLeft) % 60}s
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => setShowReview(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Lihat Pembahasan & Kunci Jawaban</span>
              </button>

              <button
                onClick={initNewTryout}
                className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Tryout (30 Soal Baru)</span>
              </button>

              <button
                onClick={onClose}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
              >
                Tutup Sesi
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: QUESTION-BY-QUESTION REVIEW & EXPLANATION */}
        {/* ------------------------------------------------------------- */}
        {showReview && currentQ && (
          <div className="flex-1 flex flex-col justify-between py-1">
            {/* Header Review */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase text-sky-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Pembahasan Soal #{currentIndex + 1} dari {totalQ}
              </span>
              <button
                onClick={() => setShowReview(false)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                  isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Kembali ke Rapor
              </button>
            </div>

            {/* Quick Strip for review */}
            <div className="grid grid-cols-10 sm:grid-cols-15 gap-1 p-1.5 rounded-2xl border mb-3 overflow-x-auto no-scrollbar bg-slate-500/5 border-slate-200 dark:border-slate-800">
              {allQuestions.map((q, i) => {
                const userAns = answers[i];
                const isCorrect = userAns === q.correctAnswer;
                const isCurrent = currentIndex === i;

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-6 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-sky-400 font-black'
                        : ''
                    } ${
                      isCorrect
                        ? 'bg-emerald-500 text-white'
                        : userAns !== undefined
                        ? 'bg-red-500 text-white'
                        : isDark
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Card with Explanation */}
            <div className={`p-4 rounded-2xl border space-y-3 max-h-[50vh] overflow-y-auto ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">{currentQ.subCategory || currentQ.category}</span>
                {answers[currentIndex] === currentQ.correctAnswer ? (
                  <span className="text-emerald-500 font-black flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Jawaban Anda Benar
                  </span>
                ) : (
                  <span className="text-red-400 font-black flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Jawaban Anda Salah
                  </span>
                )}
              </div>

              <p className={`text-sm font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentQ.question}
              </p>

              {/* Options in Review */}
              <div className="space-y-1.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isUserSelected = answers[currentIndex] === optIdx;
                  const isCorrect = currentQ.correctAnswer === optIdx;

                  return (
                    <div
                      key={optIdx}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                        isCorrect
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-black'
                          : isUserSelected
                          ? 'bg-red-500/20 border-red-500 text-red-400 font-bold'
                          : isDark
                          ? 'bg-slate-800/40 border-slate-800 text-slate-400'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCorrect && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-400">
                          Kunci Benar
                        </span>
                      )}
                      {isUserSelected && !isCorrect && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-500/30 text-red-400">
                          Pilihan Anda
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Text */}
              {currentQ.explanation && (
                <div className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                  isDark ? 'bg-sky-950/30 border-sky-900/50 text-sky-200' : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}>
                  <strong className="block text-sky-400 font-bold">Pembahasan:</strong>
                  <span>{currentQ.explanation}</span>
                  {currentQ.quickTrick && (
                    <span className="block pt-1 text-amber-400 font-medium">{currentQ.quickTrick}</span>
                  )}
                </div>
              )}
            </div>

            {/* Review Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1 ${
                  isDark ? 'border-slate-700 text-slate-300 disabled:opacity-30' : 'border-slate-200 text-slate-700 disabled:opacity-30'
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalQ - 1, prev + 1))}
                disabled={currentIndex === totalQ - 1}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1 ${
                  isDark ? 'border-slate-700 text-slate-300 disabled:opacity-30' : 'border-slate-200 text-slate-700 disabled:opacity-30'
                }`}
              >
                Soal Berikutnya <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL RIWAYAT TRYOUT SAYA */}
      {/* ------------------------------------------------------------- */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className={`rounded-3xl max-w-lg w-full p-5 shadow-2xl border space-y-4 max-h-[85vh] flex flex-col justify-between ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black">Riwayat Simulasi Tryout CAT</h4>
                  <p className="text-[10px] text-slate-400">Daftar capaian simulasi tryout yang pernah Anda selesaikan</p>
                </div>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[55vh]">
              {tryoutHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada riwayat simulasi tryout yang tersimpan.<br/>
                  Selesaikan sesi Tryout 30 Soal pertama Anda untuk mulai mencatat riwayat.
                </div>
              ) : (
                tryoutHistory.map((h, i) => {
                  const isPass = h.score >= 75;
                  const dateStr = h.completedAt ? new Date(h.completedAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Tanggal tidak tercatat';

                  return (
                    <div
                      key={h.id || i}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                        isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.2 rounded ${
                            isPass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {isPass ? 'Lolos' : 'Perlu Latihan'}
                          </span>
                          <span className="text-[11px] font-extrabold text-slate-200">
                            {h.testName || 'Simulasi Tryout CAT'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                          <span>{dateStr}</span>
                          {h.totalQuestions && (
                            <span>• {h.correctAnswers || 0}/{h.totalQuestions} Benar</span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-black ${
                          isPass ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {h.score}%
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs border transition-colors ${
                isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
            >
              Tutup Riwayat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
