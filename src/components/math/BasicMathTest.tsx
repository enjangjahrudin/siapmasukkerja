import React, { useState, useEffect, useRef } from 'react';
import { 
  getCustomMathTestBatch, 
  getMathStandardDuration 
} from '../../data/questions-basic-math';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { recordUserTestResult } from '../../utils/auth-storage';
import { 
  Calculator, 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Award, 
  Clock, 
  Sparkles,
  Shuffle,
  Play,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BasicMathTest: React.FC = () => {
  // Test Setup State
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<'setup' | 'running' | 'completed'>('setup');

  // Test Runtime State
  const [questions, setQuestions] = useState<BaseQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);

  const timerRef = useRef<any>(null);

  const durationInfo = getMathStandardDuration(selectedQuestionCount);

  const handleStartTest = () => {
    const generatedBatch = getCustomMathTestBatch(selectedQuestionCount);
    setQuestions(generatedBatch);
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

    const correctCount = Object.entries(selectedAnswers).filter(
      ([idx, ans]) => questions[Number(idx)] && questions[Number(idx)].correctAnswer === ans
    ).length;
    const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    recordUserTestResult({
      testType: 'math',
      testName: `Matematika Dasar (${questions.length} Soal)`,
      score: scorePercent,
      totalQuestions: questions.length,
      correctAnswers: correctCount
    });
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

  const handleBackToSetup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('setup');
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => questions[Number(idx)]?.correctAnswer === ans
  ).length;
  const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      
      {/* 1. SETUP SCREEN: PILIHAN JUMLAH SOAL & DURASI STANDAR */}
      {gameState === 'setup' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-sky-100 text-sky-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-sky-200">
                Bank Soal Matematika Dasar
              </span>
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Tes Matematika Dasar & Konversi
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Mencakup operasi bilangan dasar, kabataku, pecahan desimal, persen, perbandingan shift, dan <strong>konversi satuan lengkap (panjang, berat, volume, waktu, kuantitas)</strong>.
            </p>
          </div>

          {/* Question Count Selector Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                Pilih Jumlah Soal Latihan:
              </label>
              
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { count: 10, label: '10 Soal', dur: '10 Menit', desc: 'Latihan Kilat', badge: 'Ringan' },
                  { count: 30, label: '30 Soal', dur: '25 Menit', desc: 'Standar Seleksi', badge: 'Populer' },
                  { count: 50, label: '50 Soal', dur: '40 Menit', desc: 'Standar Astra/Epson', badge: 'Ideal' },
                  { count: 100, label: '100 Soal', dur: '75 Menit', desc: 'Full CAT Endurance', badge: 'Tantangan' },
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setSelectedQuestionCount(item.count)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      selectedQuestionCount === item.count
                        ? 'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-200 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-black">{item.label}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                        selectedQuestionCount === item.count ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 block">
                      ⏱️ {item.dur}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {item.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Locked Duration Info */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Durasi Tes (Terkunci Standar):</span>
                <strong className="text-amber-400 font-mono font-black text-sm">
                  {durationInfo.label}
                </strong>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Alokasi Waktu:</span>
                <span className="text-sky-300 font-semibold">{durationInfo.perQuestion}</span>
              </div>
            </div>

            {/* Topic Checklist */}
            <div className="bg-sky-50/80 border border-sky-200 rounded-2xl p-3 text-xs text-sky-950 space-y-1.5">
              <strong className="block text-sky-900 font-bold text-[11px]">Kisi-kisi Materi yang Diujikan:</strong>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-sky-900">
                <div>✓ Penjumlahan & Pengurangan</div>
                <div>✓ Perkalian & Pembagian</div>
                <div>✓ Bilangan Negatif & Akar</div>
                <div>✓ Konversi Panjang (m/mm)</div>
                <div>✓ Konversi Berat (ton/kg)</div>
                <div>✓ Konversi Volume (liter/cc)</div>
                <div>✓ Konversi Lusin/Kodi/Rim</div>
                <div>✓ Persen & Soal Cerita Shift</div>
              </div>
            </div>

            <button
              onClick={handleStartTest}
              className="w-full py-4 bg-gradient-to-r from-sky-600 via-brand-600 to-teal-500 hover:from-sky-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Latihan {selectedQuestionCount} Soal ({durationInfo.label})</span>
            </button>
          </div>

        </div>
      )}

      {/* 2. RUNNING TEST SCREEN */}
      {gameState === 'running' && currentQ && (
        <div className="flex-1 flex flex-col justify-between p-3.5 pb-12 overflow-y-auto">
          
          <div className="space-y-3">
            
            {/* Top Compact Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                  Soal {currentIndex + 1}/{questions.length}
                </span>
                <span className="text-[10px] text-slate-500 font-bold hidden sm:inline">
                  {currentQ.subCategory}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-xl font-mono font-black text-xs">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
                </div>
                <button
                  onClick={handleBackToSetup}
                  className="text-[10px] text-slate-400 hover:text-red-500 font-bold ml-1"
                  title="Batalkan Tes"
                >
                  Batal
                </button>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-sky-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-md">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                {currentQ.subCategory || 'Matematika Dasar'}
              </span>
              <h2 className="text-xs sm:text-sm font-extrabold leading-relaxed text-white">
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
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {showExplanation && (
              <div className="bg-sky-50/90 border border-sky-200 rounded-2xl p-3 text-xs space-y-1.5 text-sky-950">
                <strong className="text-sky-900 font-bold block text-[11px]">📖 Cara Penyelesaian:</strong>
                <p className="text-[11px] leading-relaxed">{currentQ.explanation}</p>
                {currentQ.quickTrick && (
                  <div className="bg-white/90 p-2 rounded-lg border border-sky-200 text-sky-900 font-semibold text-[10px]">
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
                className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
              >
                <span>{currentIndex + 1 === questions.length ? 'Selesai & Skor' : 'Lanjut'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      )}

      {/* 3. COMPLETED SCORE RAPOR */}
      {gameState === 'completed' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Hasil Tes Matematika Dasar ({questions.length} Soal)
            </h2>
            <div className={`inline-block mt-1.5 px-3 py-1 rounded-full text-[11px] font-black ${
              scorePercent >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {scorePercent >= 75 ? '✓ Memenuhi Standar Kelulusan' : '⚠️ Perlu Penguatan Rumus Cepat'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Nilai Skor</span>
              <div className="text-2xl font-black text-sky-600 mt-0.5 font-mono">{scorePercent}%</div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Benar / Total</span>
              <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">{correctCount} / {questions.length}</div>
            </div>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-left text-xs text-sky-950 space-y-1">
            <strong className="block text-sky-900 font-bold mb-0.5">Rekomendasi Evaluator:</strong>
            <p className="text-[11px] leading-relaxed">
              {scorePercent >= 75
                ? '🎉 Pemahaman matematika dasar dan konversi satuan Anda sangat mantap. Siap menghadapi psikotes numerik PT Astra, Denso, Yamaha, dan Epson!'
                : '💡 Latih kembali konversi tangga satuan (m -> mm, ton -> kg, lusin -> unit) dan urutan Kabataku agar dapat menyelesaikan soal dengan akurat.'}
            </p>
          </div>

          <button
            onClick={handleBackToSetup}
            className="w-full py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl shadow-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pilih Paket Soal Baru</span>
          </button>

        </div>
      )}

    </div>
  );
};
