import React, { useState } from 'react';
import { getPsychotestBatch } from '../../data/questions-psychotest';
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
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PsychotestHub: React.FC = () => {
  const [questions, setQuestions] = useState<BaseQuestion[]>(() => getPsychotestBatch(10));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

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
      setIsFinished(true);
      sounds.playCelebration();
      confetti({ particleCount: 75, spread: 60 });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(selectedAnswers[currentIndex - 1] !== undefined);
    }
  };

  const handleResetWithNewBatch = () => {
    setQuestions(getPsychotestBatch(10));
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
    sounds.playBeep();
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => questions[Number(idx)]?.correctAnswer === ans
  ).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 pb-12 select-none overflow-y-auto">
      
      {!isFinished ? (
        <div className="space-y-3">
          
          {/* Top Compact Header Card */}
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

            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <button
                onClick={handleResetWithNewBatch}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-all flex items-center gap-1 text-[10px] font-bold"
                title="Acak 10 Soal Baru dari Bank Soal"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Acak Soal</span>
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
      ) : (
        /* Result Screen */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xs text-center space-y-5">
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
              onClick={handleResetWithNewBatch}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Latihan Lagi (10 Soal Acak Baru)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
