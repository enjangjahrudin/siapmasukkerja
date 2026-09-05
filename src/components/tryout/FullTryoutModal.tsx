import React, { useState, useEffect, useRef } from 'react';
import { getRandomMechanicalSet } from '../../data/questions-mechanical';
import { getRandomArithmeticSet } from '../../data/questions-arithmetic';
import { getRandomQcMcSet } from '../../data/questions-qc';
import { getRandomSpatialSet } from '../../data/questions-spatial';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { recordUserTestResult } from '../../utils/auth-storage';
import { 
  Award, 
  Clock, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FullTryoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullTryoutModal: React.FC<FullTryoutModalProps> = ({ isOpen, onClose }) => {
  const [allQuestions, setAllQuestions] = useState<BaseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes (600s)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Assemble mixed randomized question set
      const combined = [
        ...getRandomMechanicalSet(3),
        ...getRandomArithmeticSet(3),
        ...getRandomQcMcSet(2),
        ...getRandomSpatialSet(2)
      ];
      setAllQuestions(combined);
      setCurrentIndex(0);
      setAnswers({});
      setTimeLeft(600);
      setIsSubmitted(false);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  const handleSubmitExam = () => {
    setIsSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    sounds.playCelebration();
    confetti({ particleCount: 90, spread: 70 });

    const correctCount = Object.entries(answers).filter(
      ([idx, ans]) => allQuestions[Number(idx)]?.correctAnswer === ans
    ).length;
    const scorePercent = allQuestions.length > 0 ? Math.round((correctCount / allQuestions.length) * 100) : 0;

    recordUserTestResult({
      testType: 'tryout',
      testName: `Simulasi CAT Tryout (${allQuestions.length} Soal)`,
      score: scorePercent,
      totalQuestions: allQuestions.length,
      correctAnswers: correctCount
    });
  };

  if (!isOpen) return null;

  const currentQ = allQuestions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => allQuestions[Number(idx)]?.correctAnswer === ans
  ).length;
  const scorePercent = allQuestions.length > 0 ? Math.round((correctCount / allQuestions.length) * 100) : 0;
  const isPassed = scorePercent >= 75;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col justify-between">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header Exam Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  Simulasi CAT Resmi
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  Tryout Seleksi Masuk Pabrik (10 Soal)
                </h2>
              </div>

              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-xl border border-red-200 font-mono font-black text-sm">
                <Clock className="w-4 h-4 text-red-600 animate-spin" />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Questions Grid Navigation */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 no-scrollbar">
              {allQuestions.map((_, i) => {
                const isAnswered = answers[i] !== undefined;
                const isCurrent = currentIndex === i;

                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all ${
                      isCurrent
                        ? 'bg-slate-900 text-white ring-2 ring-brand-500'
                        : isAnswered
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Question Body */}
            {currentQ && (
              <div className="my-4">
                <span className="text-xs font-bold text-brand-600 uppercase">
                  Soal #{currentIndex + 1} ({currentQ.category})
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2 mb-4 leading-relaxed">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentIndex] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, [currentIndex]: optIdx }));
                          sounds.playClick();
                        }}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-50 border-brand-500 text-brand-900 ring-1 ring-brand-400 font-bold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-5 mt-6 border-t border-slate-200">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 disabled:opacity-30"
              >
                ← Sebelumnya
              </button>

              {currentIndex + 1 < allQuestions.length ? (
                <button
                  onClick={() => setCurrentIndex(prev => prev + 1)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md"
                >
                  Selesai & Kumpulkan Jawaban
                </button>
              )}
            </div>
          </div>
        ) : (
          /* RESULT REPORT */
          <div className="text-center py-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              Rapor Hasil Tryout CAT
            </h2>
            <div className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-black ${
              isPassed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {isPassed ? '✓ LOLOS PASSING GRADE PERUSAHAAN (75%)' : '✗ BELUM MEMENUHI PASSING GRADE'}
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Jawaban Benar</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{correctCount} / {allQuestions.length}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Skor Akurasi</span>
                <div className="text-2xl font-black text-brand-600 mt-1">{scorePercent}%</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors mx-auto"
            >
              Tutup & Kembali ke Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
