import React, { useState, useEffect, useRef } from 'react';
import { 
  qcSampleComparisonBank, 
  getRandomQcMcSet, 
  getQcComparisonBatch, 
  QcComparisonItem 
} from '../../data/questions-qc';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { recordUserTestResult } from '../../utils/auth-storage';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Award, 
  RotateCcw, 
  Sparkles, 
  ShieldAlert,
  Search,
  ArrowRight,
  Shuffle,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QcAccuracyTest: React.FC = () => {
  const [testMode, setTestMode] = useState<'speed-match' | 'mc-test'>('speed-match');
  const [gameState, setGameState] = useState<'idle' | 'running' | 'completed'>('idle');

  // Speed match state
  const [items, setItems] = useState<QcComparisonItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);

  // MC State
  const [mcQuestions, setMcQuestions] = useState<BaseQuestion[]>(() => getRandomQcMcSet(10));
  const [mcIndex, setMcIndex] = useState<number>(0);
  const [mcAnswers, setMcAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isMcFinished, setIsMcFinished] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const startSpeedMatch = () => {
    const freshBatch = getQcComparisonBatch(60);
    setItems(freshBatch);
    setCurrentIndex(0);
    setTimeLeft(45);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectCount(0);
    setWrongCount(0);
    setGameState('running');
    sounds.playBeep();
  };

  useEffect(() => {
    if (gameState === 'running' && testMode === 'speed-match') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishSpeedMatch();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, testMode]);

  const finishSpeedMatch = () => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playCelebration();
    confetti({ particleCount: 70, spread: 60 });

    const totalAns = correctCount + wrongCount;
    const acc = totalAns > 0 ? Math.round((correctCount / totalAns) * 100) : 0;

    recordUserTestResult({
      testType: 'qc',
      testName: `Pencocokan Cepat QC (${totalAns} Butir)`,
      score: acc,
      totalQuestions: totalAns,
      correctAnswers: correctCount
    });
  };

  const handleMatchAnswer = (userChoiceSame: boolean) => {
    if (gameState !== 'running' || !items[currentIndex]) return;

    const currentItem = items[currentIndex];
    const isCorrect = userChoiceSame === currentItem.isSame;

    if (isCorrect) {
      sounds.playCorrect();
      setLastFeedback('correct');
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setScore(prev => prev + 10 + newCombo * 2);
      setCorrectCount(prev => prev + 1);
    } else {
      sounds.playWrong();
      setLastFeedback('wrong');
      setCombo(0);
      setWrongCount(prev => prev + 1);
    }

    setTimeout(() => setLastFeedback(null), 250);

    if (currentIndex + 1 < items.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishSpeedMatch();
    }
  };

  // MC Handlers
  const handleSelectMcOption = (optIdx: number) => {
    if (mcAnswers[mcIndex] !== undefined) return;
    const currentQ = mcQuestions[mcIndex];
    const isCorrect = optIdx === currentQ.correctAnswer;
    setMcAnswers(prev => ({ ...prev, [mcIndex]: optIdx }));
    setShowExplanation(true);
    if (isCorrect) sounds.playCorrect();
    else sounds.playWrong();
  };

  const handleNextMc = () => {
    if (mcIndex + 1 < mcQuestions.length) {
      setMcIndex(prev => prev + 1);
      setShowExplanation(mcAnswers[mcIndex + 1] !== undefined);
    } else {
      setIsMcFinished(true);
      sounds.playCelebration();
      confetti({ particleCount: 70, spread: 60 });

      const correctMcCount = Object.entries(mcAnswers).filter(
        ([idx, ans]) => mcQuestions[Number(idx)] && mcQuestions[Number(idx)].correctAnswer === ans
      ).length;
      const mcScorePercent = mcQuestions.length > 0 ? Math.round((correctMcCount / mcQuestions.length) * 100) : 0;

      recordUserTestResult({
        testType: 'qc',
        testName: `Teori QC & Toleransi (${mcQuestions.length} Soal)`,
        score: mcScorePercent,
        totalQuestions: mcQuestions.length,
        correctAnswers: correctMcCount
      });
    }
  };

  const handlePrevMc = () => {
    if (mcIndex > 0) {
      setMcIndex(prev => prev - 1);
      setShowExplanation(mcAnswers[mcIndex - 1] !== undefined);
    }
  };

  const handleResetMc = () => {
    setMcQuestions(getRandomQcMcSet(10));
    setMcAnswers({});
    setMcIndex(0);
    setShowExplanation(false);
    setIsMcFinished(false);
    sounds.playBeep();
  };

  const currentItem = items[currentIndex];
  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const currentMcQ = mcQuestions[mcIndex] || mcQuestions[0];
  const selectedMcOpt = mcAnswers[mcIndex];
  const hasAnsweredMc = selectedMcOpt !== undefined;
  const correctMcCount = Object.entries(mcAnswers).filter(
    ([idx, ans]) => mcQuestions[Number(idx)]?.correctAnswer === ans
  ).length;
  const mcScorePercent = mcQuestions.length > 0 ? Math.round((correctMcCount / mcQuestions.length) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      
      {/* IDLE SCREEN (Petunjuk & Pilihan Mode) */}
      {gameState === 'idle' && (
        <div className="p-3.5 space-y-3 pb-12 overflow-y-auto">
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Standar QC & Operator Mutu
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Bank 1.000+ Soal
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Tes Ketelitian Barcode & Standar QC
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Uji ketajaman visual mendeteksi kode cacat (NG) dan pemahaman toleransi limit drawing pabrik.
            </p>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => setTestMode('speed-match')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  testMode === 'speed-match'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Speed Match (45s)
              </button>
              <button
                onClick={() => setTestMode('mc-test')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                  testMode === 'mc-test'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Teori QC & Toleransi
              </button>
            </div>
          </div>

          {testMode === 'speed-match' && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-xs space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-100 dark:border-emerald-800">
                <Search className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                  Simulasi Speed Match 45 Detik
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bandingkan kode Kiri dan Kanan secepat mungkin. Tentukan apakah <strong>100% SAMA</strong> atau <strong>BEDA</strong>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left text-xs">
                <div className="bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                  <strong className="text-slate-900 dark:text-white block text-[11px] mb-0.5">⏱️ Waktu</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">45 Detik</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                  <strong className="text-slate-900 dark:text-white block text-[11px] mb-0.5">🔥 Bank</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">1.000+ Acak</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5">
                  <strong className="text-slate-900 dark:text-white block text-[11px] mb-0.5">🎯 Lolos</strong>
                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">&ge; 95%</span>
                </div>
              </div>

              <button
                onClick={startSpeedMatch}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <span>Mulai Speed Match (45s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MC TEST MODE (10 Questions from 1,000+ Bank) */}
          {testMode === 'mc-test' && (
            <div className="space-y-3">
              {!isMcFinished ? (
                <>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        Soal {mcIndex + 1}/{mcQuestions.length}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {currentMcQ.subCategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${((mcIndex + 1) / mcQuestions.length) * 100}%` }}
                        />
                      </div>
                      <button
                        onClick={handleResetMc}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 text-[10px] font-bold"
                        title="Acak 10 Soal Baru"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Box */}
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs">
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                      {currentMcQ.question}
                    </h3>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {currentMcQ.options.map((opt, optIndex) => {
                      const isSelected = selectedMcOpt === optIndex;
                      const isCorrect = optIndex === currentMcQ.correctAnswer;

                      let optionStyle = 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
                      if (hasAnsweredMc) {
                        if (isCorrect) {
                          optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-bold shadow-xs';
                        } else if (isSelected) {
                          optionStyle = 'bg-red-50 dark:bg-red-950/50 border-red-400 dark:border-red-600 text-red-950 dark:text-red-200 font-semibold';
                        } else {
                          optionStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIndex}
                          disabled={hasAnsweredMc}
                          onClick={() => handleSelectMcOption(optIndex)}
                          className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <span className="leading-snug pr-2">{opt}</span>
                          {hasAnsweredMc && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                          {hasAnsweredMc && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {showExplanation && (
                    <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-xs space-y-1.5 text-emerald-950 dark:text-emerald-100">
                      <strong className="block text-emerald-900 dark:text-emerald-300 font-bold text-[11px]">📖 Pembahasan QC:</strong>
                      <p className="text-[11px] leading-relaxed">{currentMcQ.explanation}</p>
                      {currentMcQ.quickTrick && (
                        <div className="bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg border border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 font-semibold text-[10px]">
                          {currentMcQ.quickTrick}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handlePrevMc}
                      disabled={mcIndex === 0}
                      className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                    >
                      ← Sebelum
                    </button>
                    <button
                      onClick={handleNextMc}
                      disabled={!hasAnsweredMc}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
                    >
                      <span>{mcIndex + 1 === mcQuestions.length ? 'Selesai & Skor' : 'Lanjut'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                /* MC Result */
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xs text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <Award className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Hasil Tes Teori QC & Toleransi</h2>
                    <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">{mcScorePercent}%</div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {correctMcCount} dari {mcQuestions.length} Soal Benar
                    </p>
                  </div>
                  <button
                    onClick={handleResetMc}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    Latihan Lagi (10 Soal Acak Baru)
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* RUNNING SPEED MATCH (100% ZERO SCROLL - ERGONOMIC SCREEN) */}
      {gameState === 'running' && currentItem && (
        <div className="flex-1 flex flex-col justify-between p-3.5 max-h-[820px] overflow-hidden">
          
          {/* Top Status */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-xl border border-red-200 dark:border-red-800 font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{timeLeft}s</span>
              </div>
              {combo > 2 && (
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg animate-bounce border border-amber-200 dark:border-amber-800">
                  <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>{combo}x STREAK!</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold">Skor QC:</span>
              <span className="text-sm font-black text-emerald-600 font-mono">{score}</span>
            </div>
          </div>

          {/* Center Comparison Cards */}
          <div className="my-auto space-y-3 py-2">
            
            {/* Master Code (Left) */}
            <div className="bg-slate-900 rounded-2xl p-3.5 text-center shadow-md border border-slate-800">
              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block mb-1">
                MASTER CODE (STANDAR MUTU)
              </span>
              <div className="text-sm sm:text-base font-black font-mono text-emerald-400 tracking-wider break-all select-all">
                {currentItem.leftCode}
              </div>
            </div>

            {/* Target Sample (Right) */}
            <div className={`rounded-2xl p-3.5 text-center shadow-md transition-all border ${
              lastFeedback === 'correct' 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-950' 
                : lastFeedback === 'wrong' 
                ? 'bg-rose-500/20 border-rose-500 text-rose-950' 
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'
            }`}>
              <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase block mb-1">
                SAMPLE FISIK (BENDA UJI)
              </span>
              <div className="text-sm sm:text-base font-black font-mono text-slate-900 dark:text-white tracking-wider break-all">
                {currentItem.rightCode}
              </div>
            </div>

          </div>

          {/* Bottom Huge Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2 shrink-0">
            <button
              onClick={() => handleMatchAnswer(false)}
              className="py-4 bg-rose-600 hover:bg-rose-700 text-white font-black text-sm rounded-2xl shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            >
              <XCircle className="w-6 h-6" />
              <span>TIDAK SAMA (NG)</span>
            </button>

            <button
              onClick={() => handleMatchAnswer(true)}
              className="py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>SAMA (OK)</span>
            </button>
          </div>

        </div>
      )}

      {/* COMPLETED SPEED MATCH SCREEN */}
      {gameState === 'completed' && (
        <div className="p-4 space-y-4 pb-12 my-auto text-center">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Hasil Speed Match QC</h2>
            <div className="text-4xl font-black text-emerald-600 font-mono mt-1">{score} Poin</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Akurasi: <strong className="text-slate-900 dark:text-white">{accuracy}%</strong> ({correctCount} Benar, {wrongCount} Salah)
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-left text-xs space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Evaluasi Ketelitian Pabrik:</span>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              {accuracy >= 95 ? '🏆 Luar Biasa! Lolos Standar Ketelitian Inspektur QC Astra / Toyota.' : accuracy >= 80 ? '👍 Cukup Bagus. Tingkatkan fokus visual pada karakter mirip (0 vs O).' : '⚠️ Perlu Melatih Ketajaman Mata & Kecepatan Membaca.'}
            </p>
          </div>

          <button
            onClick={startSpeedMatch}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Lagi (Acak 45 Detik Baru)
          </button>
        </div>
      )}

    </div>
  );
};
