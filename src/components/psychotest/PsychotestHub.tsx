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
    <div className="w-full h-full flex flex-col justify-between p-4 pb-12 select-none overflow-y-auto">
      
      {!isFinished ? (
        <div className="space-y-3">
          
          {/* Top Compact Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                Soal {currentIndex + 1}/{questions.length}
              </span>
              <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                {currentQ.subCategory || 'Psikotes Logika'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetWithNewBatch}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Acak Paket Soal Baru"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
              <div className="w-24 sm:w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-md">
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

              let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
              if (hasAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-xs';
                } else if (isSelected) {
                  optionStyle = 'bg-red-50 border-red-400 text-red-950 font-semibold';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-purple-50/90 border border-purple-200 rounded-2xl p-3 text-xs space-y-1.5 text-purple-950">
              <strong className="text-purple-900 font-bold block text-[11px]">📖 Kunci & Penjelasan Logika:</strong>
              <p className="text-[11px] leading-relaxed">{currentQ.explanation}</p>
              {currentQ.quickTrick && (
                <div className="bg-white/90 p-2 rounded-lg border border-purple-200 text-purple-900 font-semibold text-[10px]">
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
              className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30"
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
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Hasil Tes Psikotes Logika</h2>
            <div className="text-2xl font-black text-purple-600 font-mono mt-1">{scorePercent}%</div>
            <span className="text-xs text-slate-500">{correctCount} dari {questions.length} Soal Benar</span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-left text-xs text-purple-950">
            <strong className="block text-purple-900 font-bold mb-0.5">Analisis Psikotes:</strong>
            {scorePercent >= 75
              ? '🌟 Sangat Tajam! Logika verbal, silogisme, dan daya nalar Anda sangat baik, memenuhi kriteria seleksi HRD pabrik otomotif & manufaktur.'
              : '💡 Tingkatkan pemahaman sinonim/antonim industri dan logika silogisme deduktif.'}
          </div>

          <button
            onClick={handleResetWithNewBatch}
            className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Acak Paket Soal Psikotes Baru</span>
          </button>
        </div>
      )}

    </div>
  );
};
