import React, { useState, useEffect, useRef } from 'react';
import { qcSampleComparisonBank, qcMultipleChoiceQuestions, QcComparisonItem } from '../../data/questions-qc';
import { sounds } from '../../utils/sound-effects';
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
  ArrowRight
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
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  const startSpeedMatch = () => {
    const shuffled = [...qcSampleComparisonBank].sort(() => Math.random() - 0.5);
    setItems([...shuffled, ...shuffled, ...shuffled]);
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

  const currentItem = items[currentIndex];
  const totalAnswered = correctCount + wrongCount;
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      
      {/* IDLE SCREEN (Petunjuk & Pilihan Mode) */}
      {gameState === 'idle' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-emerald-200">
                Standar QC & Operator
              </span>
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Tes Ketelitian Barcode & Kode QC
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Uji ketajaman visual dalam mendeteksi anomali, kode cacat (NG), dan toleransi drawing di bawah tekanan waktu.
            </p>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => setTestMode('speed-match')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  testMode === 'speed-match'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Speed Match (45s)
              </button>
              <button
                onClick={() => setTestMode('mc-test')}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  testMode === 'mc-test'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Toleransi Drawing
              </button>
            </div>
          </div>

          {testMode === 'speed-match' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <Search className="w-7 h-7" />
              </div>

              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Simulasi Speed Match 45 Detik
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Bandingkan kode Kiri dan Kanan secepat mungkin. Tentukan apakah <strong>100% SAMA</strong> atau <strong>BEDA</strong>.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-left text-xs">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <strong className="text-slate-900 block text-[11px] mb-0.5">⏱️ Waktu</strong>
                  <span className="text-slate-500 text-[10px]">45 Detik</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <strong className="text-slate-900 block text-[11px] mb-0.5">🔥 Streak</strong>
                  <span className="text-slate-500 text-[10px]">Combo Poin</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <strong className="text-slate-900 block text-[11px] mb-0.5">🎯 Lolos</strong>
                  <span className="text-slate-500 text-[10px]">&ge; 95%</span>
                </div>
              </div>

              <button
                onClick={startSpeedMatch}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
              >
                <span>Mulai Tes Ketelitian (45s)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {testMode === 'mc-test' && (
            <div className="space-y-4">
              {qcMultipleChoiceQuestions.map((q, qIndex) => (
                <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Soal #{qIndex + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 my-2.5 leading-relaxed">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOption === optIndex;
                      const isCorrect = optIndex === q.correctAnswer;

                      return (
                        <button
                          key={optIndex}
                          onClick={() => {
                            setSelectedOption(optIndex);
                            setShowExplanation(true);
                            if (isCorrect) sounds.playCorrect();
                            else sounds.playWrong();
                          }}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                            showExplanation
                              ? isCorrect
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                                : isSelected
                                ? 'bg-red-50 border-red-400 text-red-950'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1.5 text-emerald-950">
                      <strong className="block text-emerald-900 font-bold">📖 Pembahasan:</strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* RUNNING SPEED MATCH (100% ZERO SCROLL - ERGONOMIC SCREEN) */}
      {gameState === 'running' && currentItem && (
        <div className="flex-1 flex flex-col justify-between p-3.5 max-h-[820px] overflow-hidden">
          
          {/* Top Compact Status */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200 font-mono">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{timeLeft}s</span>
              </div>
              {combo > 1 && (
                <div className="flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 animate-pulse">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{combo}x Combo</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="text-slate-500">Skor: <strong className="text-slate-900">{score}</strong></span>
              <span className="text-slate-500">Akurasi: <strong className="text-emerald-600">{accuracy}%</strong></span>
            </div>
          </div>

          {/* Center Inspection Box (Compact & High Contrast) */}
          <div className="bg-slate-900 text-white rounded-3xl p-4 my-2 shadow-lg flex flex-col items-center justify-center relative overflow-hidden shrink-0 space-y-2.5">
            
            {/* Feedback badge */}
            {lastFeedback && (
              <div className={`absolute top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide animate-bounce ${
                lastFeedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {lastFeedback === 'correct' ? '✓ TEPAT' : '✗ SALAH'}
              </div>
            )}

            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block">
              KODE #{currentIndex + 1} ({currentItem.category})
            </span>

            {/* Master Code */}
            <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-center shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Master Code (Kiri)</span>
              <span className="text-base sm:text-lg font-black font-mono tracking-wider text-white select-none block">
                {currentItem.leftCode}
              </span>
            </div>

            {/* Sample Check Code */}
            <div className="w-full bg-slate-800/90 border border-slate-700 rounded-2xl p-3 text-center shadow-inner">
              <span className="text-[9px] text-slate-400 uppercase font-bold block mb-1">Sample Check (Kanan)</span>
              <span className="text-base sm:text-lg font-black font-mono tracking-wider text-sky-300 select-none block">
                {currentItem.rightCode}
              </span>
            </div>

            <span className="text-[10px] text-slate-400 text-center">
              Apakah kedua deret kode di atas 100% identik?
            </span>
          </div>

          {/* Bottom Huge Action Buttons (ZERO SCROLL, EASY THUMB REACH) */}
          <div className="grid grid-cols-2 gap-3 shrink-0 pt-1">
            <button
              onClick={() => handleMatchAnswer(true)}
              className="py-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 touch-manipulation"
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>SAMA</span>
            </button>
            <button
              onClick={() => handleMatchAnswer(false)}
              className="py-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-black text-base rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-95 touch-manipulation"
            >
              <XCircle className="w-6 h-6" />
              <span>BEDA</span>
            </button>
          </div>

        </div>
      )}

      {/* COMPLETED RESULT SCREEN */}
      {gameState === 'completed' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Hasil Tes Ketelitian Barcode QC
            </h2>
            <div className="inline-block mt-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
              {accuracy >= 92 ? '✓ Lolos Standar QC' : '⚠️ Perlu Latihan Fokus'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Skor</span>
              <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">{score}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Akurasi</span>
              <div className="text-xl font-black text-emerald-600 mt-0.5 font-mono">{accuracy}%</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Max Combo</span>
              <div className="text-xl font-black text-amber-600 mt-0.5 font-mono">{maxCombo}x</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Benar / Salah</span>
              <div className="text-lg font-black text-slate-800 mt-0.5 font-mono">{correctCount} / {wrongCount}</div>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-950 space-y-1">
            <strong className="block text-emerald-900 font-bold">Evaluasi QC:</strong>
            <p className="text-[11px] leading-relaxed">
              {accuracy >= 92 
                ? '🎯 Kecermatan visual Anda sangat tinggi dan konsisten, memenuhi standar QC Inspector di industri otomotif dan elektronik.'
                : '⚠️ Ketelitian masih bisa ditingkatkan. Usahakan scan 3 karakter tengah terlebih dahulu sebelum menekan tombol.'}
            </p>
          </div>

          <button
            onClick={startSpeedMatch}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Ulangi Tes Ketelitian
          </button>

        </div>
      )}

    </div>
  );
};
