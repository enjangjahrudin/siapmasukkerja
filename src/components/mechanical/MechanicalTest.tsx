import React, { useState } from 'react';
import { mechanicalQuestions } from '../../data/questions-mechanical';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { 
  Settings, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MechanicalTest: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = mechanicalQuestions[currentIndex];
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
    if (currentIndex + 1 < mechanicalQuestions.length) {
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

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => mechanicalQuestions[Number(idx)].correctAnswer === ans
  ).length;
  const scorePercent = Math.round((correctCount / mechanicalQuestions.length) * 100);

  const renderDiagram = (q: BaseQuestion) => {
    if (q.diagramType === 'gears') {
      return (
        <div className="bg-slate-900 rounded-2xl p-2.5 flex flex-col items-center justify-center">
          <svg viewBox="0 0 360 140" className="w-full max-w-xs h-28">
            <g transform="translate(60, 70)">
              <circle r="34" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <circle r="12" fill="#0f172a" />
              <text x="0" y="5" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
              <path d="M -20 -20 A 28 28 0 0 1 20 -20" fill="none" stroke="#facc15" strokeWidth="3" />
              <text x="0" y="-24" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">CW</text>
            </g>
            <g transform="translate(125, 70)">
              <circle r="30" fill="#0369a1" stroke="#38bdf8" strokeWidth="3" />
              <circle r="10" fill="#0f172a" />
              <text x="0" y="5" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">B</text>
            </g>
            <g transform="translate(185, 70)">
              <circle r="30" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <circle r="10" fill="#0f172a" />
              <text x="0" y="5" fill="#ffffff" fontSize="13" fontWeight="bold" textAnchor="middle">C</text>
            </g>
            <g transform="translate(255, 70)">
              <circle r="38" fill="#e11d48" stroke="#fda4af" strokeWidth="3" strokeDasharray="4 2" />
              <circle r="14" fill="#0f172a" />
              <text x="0" y="5" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">D (?)</text>
            </g>
          </svg>
          <span className="text-[9px] text-slate-400 mt-0.5">Rangkaian Roda Gigi Mesin (A - B - C - D)</span>
        </div>
      );
    }

    if (q.diagramType === 'pulley') {
      return (
        <div className="bg-slate-900 rounded-2xl p-2.5 flex flex-col items-center justify-center">
          <svg viewBox="0 0 280 180" className="w-full max-w-[200px] h-32">
            <rect x="40" y="10" width="200" height="8" fill="#475569" rx="2" />
            <line x1="140" y1="18" x2="140" y2="40" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="140" cy="40" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="140" cy="40" r="3" fill="#ffffff" />
            
            <circle cx="110" cy="105" r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="110" cy="105" r="3" fill="#ffffff" />

            <path d="M 80 18 L 110 105 L 140 40 L 180 130" fill="none" stroke="#facc15" strokeWidth="3" />
            <rect x="90" y="125" width="40" height="30" fill="#334155" stroke="#64748b" strokeWidth="2" rx="4" />
            <text x="110" y="144" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">120 kg</text>
            
            <path d="M 180 110 L 180 150" stroke="#4ade80" strokeWidth="3" />
            <polygon points="175,145 180,155 185,145" fill="#4ade80" />
            <text x="205" y="135" fill="#4ade80" fontSize="11" fontWeight="bold">F = ?</text>
          </svg>
          <span className="text-[9px] text-slate-400 mt-0.5">Sistem Katrol Majemuk Pabrik</span>
        </div>
      );
    }

    if (q.diagramType === 'lever') {
      return (
        <div className="bg-slate-900 rounded-2xl p-2.5 flex flex-col items-center justify-center">
          <svg viewBox="0 0 320 140" className="w-full max-w-xs h-28">
            <rect x="30" y="60" width="260" height="8" fill="#e2e8f0" rx="3" />
            <rect x="35" y="25" width="35" height="35" fill="#e11d48" rx="4" />
            <text x="52" y="47" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">W</text>

            <polygon points="90,68 80,95 100,95" fill="#0284c7" />
            <text x="90" y="110" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Posisi 1</text>

            <polygon points="160,68 150,95 170,95" fill="#64748b" strokeDasharray="2 2" />
            <text x="160" y="110" fill="#94a3b8" fontSize="9" textAnchor="middle">Posisi 2</text>

            <polygon points="230,68 220,95 240,95" fill="#64748b" strokeDasharray="2 2" />
            <text x="230" y="110" fill="#94a3b8" fontSize="9" textAnchor="middle">Posisi 3</text>

            <path d="M 280 30 L 280 55" stroke="#4ade80" strokeWidth="3" />
            <polygon points="275,50 280,60 285,50" fill="#4ade80" />
            <text x="280" y="22" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">Kuasa (F)</text>
          </svg>
          <span className="text-[9px] text-slate-400 mt-0.5">Kesetimbangan Tuas Pengungkit</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 pb-12 select-none overflow-y-auto">
      
      {!isFinished ? (
        <div className="space-y-3">
          
          {/* Top Compact Progress */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
            <span className="text-[11px] font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
              Soal {currentIndex + 1}/{mechanicalQuestions.length}
            </span>
            <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / mechanicalQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Diagram Box */}
          {renderDiagram(currentQ)}

          {/* Question */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-relaxed">
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
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
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
            <div className="bg-brand-50/90 border border-brand-200 rounded-2xl p-3 text-xs space-y-1.5 text-brand-950">
              <strong className="text-brand-900 font-bold block text-[11px]">📖 Penjelasan:</strong>
              <p className="text-[11px] leading-relaxed">{currentQ.explanation}</p>
              {currentQ.quickTrick && (
                <div className="bg-white/90 p-2 rounded-lg border border-brand-200 text-brand-900 font-semibold text-[10px]">
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
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
            >
              <span>{currentIndex + 1 === mechanicalQuestions.length ? 'Selesai & Skor' : 'Lanjut'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Hasil Tes Mekanika Bennett</h2>
            <div className="text-2xl font-black text-brand-600 font-mono mt-1">{scorePercent}%</div>
            <span className="text-xs text-slate-500">{correctCount} dari {mechanicalQuestions.length} Soal Benar</span>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-xs"
          >
            Latihan Ulang
          </button>
        </div>
      )}

    </div>
  );
};
