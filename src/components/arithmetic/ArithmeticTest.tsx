import React, { useState } from 'react';
import { arithmeticQuestions } from '../../data/questions-arithmetic';
import { sounds } from '../../utils/sound-effects';
import { 
  Calculator, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ArithmeticTest: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = arithmeticQuestions[currentIndex];
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
    if (currentIndex + 1 < arithmeticQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setShowExplanation(selectedAnswers[currentIndex + 1] !== undefined);
    } else {
      setIsFinished(true);
      sounds.playCelebration();
      confetti({ particleCount: 70, spread: 60 });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowExplanation(selectedAnswers[currentIndex - 1] !== undefined);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => arithmeticQuestions[Number(idx)].correctAnswer === ans
  ).length;
  const scorePercent = Math.round((correctCount / arithmeticQuestions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                Aritmatika & Deret Angka
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Hitung Cepat & Logika Pola Angka
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Tes Matematika Dasar & Logika Deret Pabrik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Latihan perhitungan perbandingan pekerja pabrik, kapasitas produksi, persen defect, dan deret bertingkat.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="self-end sm:self-auto flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Soal
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
            <span>Soal {currentIndex + 1} dari {arithmeticQuestions.length}</span>
            <span>Terjawab: {Object.keys(selectedAnswers).length}/{arithmeticQuestions.length}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / arithmeticQuestions.length) * 100}%` }}
            />
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md mb-6">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2">
              Pertanyaan Hitung Cepat:
            </span>
            <h2 className="text-base sm:text-lg font-bold leading-relaxed text-white font-mono">
              {currentQ.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
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
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span>{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 text-xs space-y-3 mb-6 animate-fadeIn">
              <div>
                <strong className="text-blue-900 font-bold block mb-1 text-sm">📖 Langkah Penyelesaian Rumus Cepat:</strong>
                <p className="text-blue-950 leading-relaxed">{currentQ.explanation}</p>
              </div>
              {currentQ.quickTrick && (
                <div className="bg-white/90 p-3 rounded-lg border border-blue-200 text-blue-900 font-semibold shadow-xs">
                  {currentQ.quickTrick}
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Soal Sebelumnya
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>{currentIndex + 1 === arithmeticQuestions.length ? 'Selesai & Lihat Skor' : 'Soal Selanjutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Hasil Tes Aritmatika & Deret Angka
          </h2>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Jawaban Benar</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                {correctCount} / {arithmeticQuestions.length}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Skor Akhir</span>
              <div className="text-2xl font-black text-blue-600 mt-1">
                {scorePercent}%
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            Latihan Ulang Soal Aritmatika
          </button>
        </div>
      )}

    </div>
  );
};
