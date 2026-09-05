import React, { useState, useEffect, useRef } from 'react';
import { 
  generateSequentialMultiplicationList, 
  SequentialMultiplicationItem, 
  evaluateSequentialMultiplication 
} from '../../data/multiplication-data';
import { sounds } from '../../utils/sound-effects';
import { recordUserTestResult } from '../../utils/auth-storage';
import { 
  Clock, 
  Award, 
  RotateCcw, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  XCircle,
  Play,
  ArrowRight,
  Delete,
  Grid
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MultiplicationBlitzTest: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [questions, setQuestions] = useState<SequentialMultiplicationItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 Menit (120 Detik)
  
  // History log for each question answered
  const [history, setHistory] = useState<{
    item: SequentialMultiplicationItem;
    userAnswer: number;
    isCorrect: boolean;
  }[]>([]);

  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [pressedDigit, setPressedDigit] = useState<number | string | null>(null);

  const timerRef = useRef<any>(null);

  const startSequentialTest = () => {
    const list = generateSequentialMultiplicationList();
    setQuestions(list);
    setCurrentIndex(0);
    setCurrentInput('');
    setHistory([]);
    setTimeLeft(120); // 2 Minutes
    setGameState('running');
    sounds.playBeep();
  };

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, history, currentIndex]);

  const finishTest = () => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playCelebration();
    confetti({ particleCount: 85, spread: 70 });

    const totalAnswered = history.length;
    const correctAnswers = history.filter(h => h.isCorrect).length;
    const accuracy = totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0;

    recordUserTestResult({
      testType: 'multiplication',
      testName: `Tabel Perkalian Blitz (${totalAnswered} Butir)`,
      score: accuracy,
      totalQuestions: totalAnswered,
      correctAnswers,
      details: { completed: totalAnswered, correct: correctAnswers, accuracy }
    });
  };

  const handleDigitPress = (digit: number) => {
    if (gameState !== 'running' || !questions[currentIndex]) return;

    setPressedDigit(digit);
    setTimeout(() => setPressedDigit(null), 120);

    const currentItem = questions[currentIndex];
    const newInput = currentInput + digit.toString();
    setCurrentInput(newInput);

    if (newInput.length >= currentItem.expectedDigits) {
      evaluateAndAdvance(parseInt(newInput, 10), currentItem);
    }
  };

  const handleBackSpace = () => {
    if (currentInput.length > 0) {
      setCurrentInput(prev => prev.slice(0, -1));
    }
  };

  const evaluateAndAdvance = (userVal: number, item: SequentialMultiplicationItem) => {
    const isCorrect = userVal === item.correctAnswer;

    if (isCorrect) {
      sounds.playCorrect();
      setLastFeedback('correct');
    } else {
      sounds.playWrong();
    }

    setTimeout(() => setLastFeedback(null), 200);

    const newHistory = [...history, { item, userAnswer: userVal, isCorrect }];
    setHistory(newHistory);
    setCurrentInput('');

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  // Keyboard physical listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'running') return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(parseInt(e.key, 10));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackSpace();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentInput, currentIndex, questions, history]);

  const currentItem = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const correctCount = history.filter(h => h.isCorrect).length;
  const evaluation = evaluateSequentialMultiplication(history, 120 - timeLeft);

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      
      {/* 1. IDLE / RULES SCREEN */}
      {gameState === 'idle' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-200">
                Tabel Perkalian Berurutan
              </span>
              <div className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-xl border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                <span>2 Menit (120s)</span>
              </div>
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Tabel Perkalian 1×1 s/d 10×10
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Soal disajikan <strong>secara berurutan</strong> dari 1×1, 1×2, ..., hingga 10×10. Gunakan papan tombol angka di bawah layar untuk menjawab secepat mungkin.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <Grid className="w-7 h-7 text-amber-600" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Aturan & Mekanisme Tes
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sistem akan mencatat <strong>sampai di perkalian berapa</strong> Anda berhasil menjawab ketika waktu 2 menit berakhir.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <strong className="text-slate-900 block text-[11px] mb-0.5">🔢 Urutan</strong>
                <span className="text-slate-500 text-[10px]">1×1 s/d 10×10</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <strong className="text-slate-900 block text-[11px] mb-0.5">⏱️ Durasi</strong>
                <span className="text-slate-500 text-[10px]">Tepat 2 Menit</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                <strong className="text-slate-900 block text-[11px] mb-0.5">🎯 Standar</strong>
                <span className="text-slate-500 text-[10px]">&ge; 50 Soal Selesai</span>
              </div>
            </div>

            <button
              onClick={startSequentialTest}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Tes Perkalian Berurutan (2 Menit)</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. RUNNING SEQUENTIAL MULTIPLICATION TEST (EXPANDED LARGE HIGH-VISIBILITY CARDS) */}
      {gameState === 'running' && currentItem && (
        <div className="flex-1 flex flex-col justify-between p-3.5 overflow-hidden">
          
          {/* Top Status Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                Soal #{currentItem.index}/100
              </span>
              <span className="text-xs text-slate-500 font-bold">
                Benar: <strong className="text-emerald-600">{correctCount}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-black text-red-600 bg-red-50 px-3 py-1 rounded-xl border border-red-200 font-mono">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Center Card Display (SIGNIFICANTLY ENLARGED, CRISP, HIGH-VISIBILITY) */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 my-2 shadow-xl flex flex-col items-center justify-center relative overflow-hidden shrink-0 space-y-3 min-h-[190px]">
            
            {/* Feedback badge */}
            {lastFeedback && (
              <div className={`absolute top-2.5 px-4 py-0.5 rounded-full text-xs font-black tracking-wide animate-bounce ${
                lastFeedback === 'correct' ? 'bg-emerald-500 text-white shadow-md' : 'bg-red-500 text-white shadow-md'
              }`}>
                {lastFeedback === 'correct' ? '✓ BENAR' : '✗ SALAH'}
              </div>
            )}

            <span className="text-[10px] sm:text-xs text-amber-400 font-extrabold uppercase tracking-widest block">
              PERKALIAN BERURUTAN #{currentItem.index}
            </span>

            {/* Large Expression Box */}
            <div className="flex items-center justify-center gap-2.5 sm:gap-3 font-mono font-black select-none">
              
              {/* Factor A */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl sm:text-4xl text-sky-300 shadow-inner">
                {currentItem.factorA}
              </div>

              {/* Multiply Sign */}
              <span className="text-amber-400 text-2xl sm:text-3xl font-extrabold">×</span>

              {/* Factor B */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl sm:text-4xl text-sky-300 shadow-inner">
                {currentItem.factorB}
              </div>

              {/* Equal Sign */}
              <span className="text-slate-500 text-2xl sm:text-3xl font-extrabold">=</span>
              
              {/* Answer Input Box */}
              <div className="min-w-[70px] px-3 h-16 sm:h-18 rounded-2xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg text-3xl sm:text-4xl font-mono">
                {currentInput ? currentInput : <span className="text-slate-600 animate-pulse">?</span>}
              </div>

            </div>

            <span className="text-[11px] text-slate-400 font-medium">
              Ketik angka hasil perkalian di keyboard bawah:
            </span>
          </div>

          {/* Bottom Fixed Tactile Numpad (Zero Scroll, Large 48-54px Buttons) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-xs shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitPress(digit)}
                  className={`h-12 sm:h-13 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center border active:scale-95 touch-manipulation ${
                    pressedDigit === digit
                      ? 'bg-amber-500 text-slate-950 border-amber-600 scale-95 shadow-inner'
                      : 'bg-slate-100/90 hover:bg-amber-50 active:bg-amber-500 active:text-slate-950 border-slate-200 text-slate-900'
                  }`}
                >
                  {digit}
                </button>
              ))}

              {/* Backspace Button */}
              <button
                onClick={handleBackSpace}
                className="h-12 sm:h-13 rounded-2xl font-bold text-xs transition-all flex items-center justify-center border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-95"
                title="Hapus"
              >
                <Delete className="w-4 h-4" />
              </button>

              {/* 0 Button */}
              <button
                onClick={() => handleDigitPress(0)}
                className={`h-12 sm:h-13 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center border active:scale-95 touch-manipulation ${
                  pressedDigit === 0
                    ? 'bg-amber-500 text-slate-950 border-amber-600 scale-95 shadow-inner'
                    : 'bg-slate-100/90 hover:bg-amber-50 active:bg-amber-500 active:text-slate-950 border-slate-200 text-slate-900'
                }`}
              >
                0
              </button>

              {/* Cancel Button */}
              <button
                onClick={() => setGameState('idle')}
                className="h-12 sm:h-13 rounded-2xl font-bold text-[10px] transition-all flex flex-col items-center justify-center border border-red-200 bg-red-50 text-red-600 active:bg-red-100"
              >
                <RotateCcw className="w-3.5 h-3.5 mb-0.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. COMPLETED SCORE & MULTIPLICATION MATRIX RAPOR */}
      {gameState === 'completed' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Rapor Tes Perkalian 2 Menit
            </h2>
            <div className={`inline-block mt-1.5 px-3.5 py-1 rounded-full text-[11px] font-black border ${evaluation.badgeColor}`}>
              {evaluation.grade}
            </div>
          </div>

          {/* Stopped At Highlight Card */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 rounded-2xl p-4 shadow-md text-center">
            <span className="text-[10px] font-black uppercase tracking-wider block text-slate-900/80">
              Pencapaian Kecepatan Anda:
            </span>
            <div className="text-base sm:text-lg font-black mt-0.5">
              {evaluation.stoppedAtText}
            </div>
            <span className="text-xs font-bold text-slate-900 block mt-1">
              Menyelesaikan {evaluation.totalCompleted} dari 100 Soal ({evaluation.progressPercentage}%) dalam 2 Menit
            </span>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Jawaban Benar</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5 font-mono">{evaluation.correctCount} <span className="text-xs text-slate-500 font-normal">soal</span></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tingkat Akurasi</span>
              <div className="text-2xl font-black text-brand-600 mt-0.5 font-mono">{evaluation.accuracy}%</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Jawaban Salah</span>
              <div className="text-2xl font-black text-red-500 mt-0.5 font-mono">{evaluation.wrongCount}</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Soal Belum Tercapai</span>
              <div className="text-2xl font-black text-slate-400 mt-0.5 font-mono">{100 - evaluation.totalCompleted}</div>
            </div>
          </div>

          {/* 10x10 Interactive Matrix Progress Map */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-amber-600" />
                <span>Peta Matriks 100 Perkalian (1×1 s/d 10×10):</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">{evaluation.totalCompleted}/100</span>
            </div>

            {/* Matrix 10x10 Grid */}
            <div className="grid grid-cols-10 gap-1 p-2 bg-slate-900 rounded-2xl">
              {Array.from({ length: 100 }).map((_, i) => {
                const itemIndex = i + 1;
                const hist = history[i];
                let cellColor = 'bg-slate-800 border-slate-700 text-slate-600'; // Not reached

                if (hist) {
                  cellColor = hist.isCorrect 
                    ? 'bg-emerald-500 border-emerald-400 text-white font-bold' 
                    : 'bg-red-500 border-red-400 text-white font-bold';
                }

                const factorA = Math.floor(i / 10) + 1;
                const factorB = (i % 10) + 1;

                return (
                  <div
                    key={i}
                    title={`${factorA} × ${factorB} = ${factorA * factorB}`}
                    className={`aspect-square rounded-md border text-[8px] sm:text-[9px] flex items-center justify-center font-mono ${cellColor}`}
                  >
                    {itemIndex}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Benar
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" /> Salah
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700 inline-block" /> Belum Tercapai
              </span>
            </div>
          </div>

          {/* Feedback message */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-950 space-y-1">
            <strong className="block text-amber-900 font-bold">Catatan Kecepatan:</strong>
            <p className="text-[11px] leading-relaxed">{evaluation.message}</p>
          </div>

          <button
            onClick={startSequentialTest}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ulangi Tes Perkalian Berurutan</span>
          </button>

        </div>
      )}

    </div>
  );
};
