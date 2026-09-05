import React, { useState, useEffect, useRef } from 'react';
import { getPsychotestBatch, getPsychotestStandardDuration } from '../../data/questions-psychotest';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { 
  Brain, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award, 
  Sparkles,
  Shuffle,
  Layers,
  Clock,
  Play,
  Check,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PsychotestHub: React.FC = () => {
  // Mode State: setup, running, completed
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<'setup' | 'running' | 'completed'>('setup');

  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(8 * 60);

  const timerRef = useRef<any>(null);
  const durationInfo = getPsychotestStandardDuration(selectedQuestionCount);

  const handleStartTest = () => {
    const batch = getPsychotestBatch(selectedQuestionCount);
    setQuestions(batch);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowExplanation(false);
    setTimeLeft(durationInfo.seconds);
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
  }, [gameState, questions, selectedAnswers]);

  const finishTest = () => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playCelebration();
    confetti({ particleCount: 80, spread: 70 });
  };

  const currentQ = questions[currentIndex] || questions[0];
  const selectedOpt = selectedAnswers[currentIndex];
  const hasAnswered = selectedOpt !== undefined;

  const handleSelectOption = (optIdx: number) => {
    if (selectedOpt !== undefined) return;

    const isCorrect = optIdx === currentQ.correctAnswer;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
    setShowExplanation(true);

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      finishTest();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(selectedAnswers[currentIndex - 1] !== undefined);
    }
  };

  const handleResetToSetup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('setup');
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    sounds.playBeep();
  };

  const handleRestartNewBatch = () => {
    const freshBatch = getPsychotestBatch(selectedQuestionCount);
    setQuestions(freshBatch);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setTimeLeft(durationInfo.seconds);
    setGameState('running');
    sounds.playBeep();
  };

  // Helper format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => questions[Number(idx)]?.correctAnswer === ans
  ).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const isTimeLow = timeLeft < 60;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 pb-12 select-none overflow-y-auto">
      
      {/* 1. SETUP SCREEN: PILIHAN JUMLAH SOAL & WAKTU STANDAR */}
      {gameState === 'setup' && (
        <div className="space-y-4 pb-8 max-w-2xl mx-auto w-full">
          {/* Header Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                Bank Soal 1.000+ Variasi
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                Standar BUMN & Astra
              </span>
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
              Psikotes Penalaran & Logika Deduksi
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Mencakup sinonim kata industri, antonim, analogi, silogisme formal K3 & pabrik, logika posisi, komparasi performa mesin, jadwal shift, dan deret huruf.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Pilih Jumlah Soal & Waktu Pengerjaan Standar:
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { count: 10, label: '10 Soal', dur: '8 Menit', desc: 'Standar Latihan Kilat', badge: 'Populer' },
                  { count: 20, label: '20 Soal', dur: '15 Menit', desc: 'Standar Rekrutmen', badge: 'Ideal' },
                  { count: 30, label: '30 Soal', dur: '22 Menit', desc: 'Standar Astra / CAT', badge: 'Lengkap' },
                  { count: 50, label: '50 Soal', dur: '35 Menit', desc: 'Full Simulation CAT', badge: 'Tantangan' },
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setSelectedQuestionCount(item.count)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedQuestionCount === item.count
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500 text-purple-950 dark:text-purple-200 ring-2 ring-purple-200 dark:ring-purple-800 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black">{item.label}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        selectedQuestionCount === item.count ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-650 text-slate-600 dark:text-slate-300'
                      }`}>
                        {item.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700 dark:text-purple-300 mb-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.dur}</span>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>

                    {selectedQuestionCount === item.count && (
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Info Waktu Standar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-750 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-bold text-slate-700 dark:text-slate-300">Waktu yang Disediakan:</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-purple-600 dark:text-purple-400">{durationInfo.label}</span>
                <span className="text-[10px] text-slate-400 ml-1.5">({durationInfo.perQuestion})</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartTest}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Tes Psikotes Sekarang</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* 2. RUNNING TEST SCREEN */}
      {gameState === 'running' && currentQ && (
        <div className="space-y-3 max-w-2xl mx-auto w-full">
          
          {/* Top Compact Header Card with Timer */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                Soal {currentIndex + 1}/{questions.length}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg">
                <Layers className="w-3 h-3 text-purple-600" />
                Bank Soal 1.000+
              </span>
            </div>

            {/* Timer Badge */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-extrabold border ${
                isTimeLow 
                  ? 'bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${isTimeLow ? 'text-red-500' : 'text-purple-600'}`} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                onClick={handleResetToSetup}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1 text-[10px] font-bold"
                title="Keluar / Ganti Paket"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Ganti Paket</span>
              </button>
            </div>
          </div>

          {/* SubCategory Tag */}
          {currentQ.subCategory && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                Topik: {currentQ.subCategory}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ID: {currentQ.id}
              </span>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
              {currentQ.subCategory || 'Psikotes Logika Verbal'}
            </span>
            <h2 className="text-xs sm:text-sm font-extrabold leading-relaxed text-white whitespace-pre-line">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOpt === optIdx;
              const isCorrect = optIdx === currentQ.correctAnswer;

              let optionStyle = 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
              if (hasAnswered) {
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
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span className="leading-snug pr-2">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-purple-50/90 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-2xl p-3 text-xs space-y-1.5 text-purple-950 dark:text-purple-100">
              <strong className="text-purple-900 dark:text-purple-300 font-bold block text-[11px]">📖 Kunci & Penjelasan Logika:</strong>
              <p className="text-[11px] leading-relaxed">{currentQ.explanation}</p>
              {currentQ.quickTrick && (
                <div className="bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg border border-purple-200 dark:border-purple-700 text-purple-900 dark:text-purple-200 font-semibold text-[10px]">
                  {currentQ.quickTrick}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
            >
              ← Sebelum
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
            >
              <span>{currentIndex + 1 === questions.length ? 'Selesai & Skor' : 'Lanjut'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* 3. RESULT SCREEN */}
      {gameState === 'completed' && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xs text-center space-y-5 max-w-xl mx-auto w-full">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Hasil Tes Psikotes & Penalaran</h2>
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 font-mono mt-1">{scorePercent}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {correctCount} dari {questions.length} Soal Benar
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 rounded-2xl text-left space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Standar Lolos Psikotes BUMN & Astra:</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {scorePercent >= 80 ? '🌟 Sangat Tajam & Logis (Kategori Sangat Direkomendasikan)' : scorePercent >= 60 ? '👍 Cukup Baik (Perbanyak Latihan Silogisme Deduksi)' : '⚠️ Perlu Memperluas Kosakata & Latihan Logika'}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleRestartNewBatch}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Latihan Lagi ({selectedQuestionCount} Soal Acak Baru)
            </button>
            <button
              onClick={handleResetToSetup}
              className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
            >
              Pilih Paket Soal Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
