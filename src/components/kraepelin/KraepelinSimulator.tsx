import React, { useState, useEffect, useRef } from 'react';
import { 
  KraepelinConfig, 
  generateColumnNumbers, 
  calculateKraepelinMetrics
} from '../../data/kraepelin-data';
import { KraepelinAnalysis } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Volume2, 
  VolumeX, 
  TrendingUp, 
  Activity, 
  Award,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KraepelinSimulatorProps {
  onFinishTest?: (metrics: any) => void;
}

export const KraepelinSimulator: React.FC<KraepelinSimulatorProps> = ({ onFinishTest }) => {
  // Test Settings
  const [mode, setMode] = useState<'kraepelin' | 'pauli'>('kraepelin');
  const [secondsPerColumn, setSecondsPerColumn] = useState<number>(15);
  const [totalColumns, setTotalColumns] = useState<number>(6);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Test Runtime State
  const [gameState, setGameState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [currentColumnIndex, setCurrentColumnIndex] = useState<number>(0);
  const [columnData, setColumnData] = useState<number[][]>([]);
  const [currentRowIndex, setCurrentRowIndex] = useState<number>(0);
  const [columnTimeRemaining, setColumnTimeRemaining] = useState<number>(secondsPerColumn);
  
  // Results & Tracking
  const [columnResults, setColumnResults] = useState<{ answered: number; correct: number; wrong: number }[]>([]);
  const [analysis, setAnalysis] = useState<KraepelinAnalysis | null>(null);
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [pressedDigit, setPressedDigit] = useState<number | null>(null);

  const timerRef = useRef<any>(null);

  const startTest = () => {
    const generated: number[][] = [];
    for (let i = 0; i < totalColumns; i++) {
      generated.push(generateColumnNumbers(32));
    }
    setColumnData(generated);
    setCurrentColumnIndex(0);
    setCurrentRowIndex(0);
    setColumnResults([]);
    setAnalysis(null);
    setColumnTimeRemaining(secondsPerColumn);
    setGameState('running');

    if (soundEnabled) sounds.playBeep();
  };

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = setInterval(() => {
        setColumnTimeRemaining(prev => {
          if (prev <= 1) {
            handleColumnShift();
            return secondsPerColumn;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentColumnIndex, columnResults]);

  const handleColumnShift = () => {
    if (soundEnabled) sounds.playPindahKolom();

    const currentColRes = columnResults[currentColumnIndex] || { answered: 0, correct: 0, wrong: 0 };
    const updatedResults = [...columnResults];
    updatedResults[currentColumnIndex] = currentColRes;
    setColumnResults(updatedResults);

    if (currentColumnIndex + 1 >= totalColumns) {
      finishTest(updatedResults);
    } else {
      setCurrentColumnIndex(prev => prev + 1);
      setCurrentRowIndex(0);
    }
  };

  const finishTest = (finalResults: typeof columnResults) => {
    setGameState('completed');
    if (timerRef.current) clearInterval(timerRef.current);

    const calc = calculateKraepelinMetrics(finalResults);
    setAnalysis(calc);

    if (soundEnabled) sounds.playCelebration();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onFinishTest) onFinishTest(calc);
  };

  const handleNumberInput = (digit: number) => {
    if (gameState !== 'running' || !columnData[currentColumnIndex]) return;

    setPressedDigit(digit);
    setTimeout(() => setPressedDigit(null), 120);

    const currentNumbers = columnData[currentColumnIndex];
    let numA: number, numB: number;
    const totalPairs = currentNumbers.length - 1;

    if (mode === 'kraepelin') {
      const bottomIdx = totalPairs - currentRowIndex;
      numA = currentNumbers[bottomIdx];
      numB = currentNumbers[bottomIdx - 1];
    } else {
      numA = currentNumbers[currentRowIndex];
      numB = currentNumbers[currentRowIndex + 1];
    }

    if (numA === undefined || numB === undefined) return;

    const expectedSumDigit = (numA + numB) % 10;
    const isCorrect = digit === expectedSumDigit;

    if (isCorrect) {
      if (soundEnabled) sounds.playCorrect();
      setLastFeedback('correct');
    } else {
      if (soundEnabled) sounds.playWrong();
      setLastFeedback('wrong');
    }

    setTimeout(() => setLastFeedback(null), 250);

    const existing = columnResults[currentColumnIndex] || { answered: 0, correct: 0, wrong: 0 };
    const updated = {
      answered: existing.answered + 1,
      correct: existing.correct + (isCorrect ? 1 : 0),
      wrong: existing.wrong + (isCorrect ? 0 : 1)
    };

    const newResults = [...columnResults];
    newResults[currentColumnIndex] = updated;
    setColumnResults(newResults);

    if (currentRowIndex + 1 < totalPairs) {
      setCurrentRowIndex(prev => prev + 1);
    } else {
      handleColumnShift();
    }
  };

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'running') return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleNumberInput(parseInt(e.key, 10));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentColumnIndex, currentRowIndex, columnData, columnResults]);

  const activeColNums = columnData[currentColumnIndex] || [];
  const totalPairs = Math.max(0, activeColNums.length - 1);
  const activePairIdx = mode === 'kraepelin' ? totalPairs - currentRowIndex : currentRowIndex;

  const currentBottomNum = mode === 'kraepelin' ? activeColNums[activePairIdx] : activeColNums[activePairIdx + 1];
  const currentTopNum = mode === 'kraepelin' ? activeColNums[activePairIdx - 1] : activeColNums[activePairIdx];

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      
      {/* 1. IDLE SCREEN (Pengaturan Tes) */}
      {gameState === 'idle' && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="bg-brand-100 text-brand-700 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-brand-200">
                Tes Koran Pabrik
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            <h1 className="text-lg font-extrabold text-slate-900 leading-tight">
              Simulasi Tes Kraepelin & Pauli
            </h1>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Uji ketahanan, kecepatan kerja, stabilitas emosi, dan ketelitian standar rekrutmen PT Astra, Epson, Yamaha, & Mayora.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
            
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Arah Penjumlahan:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('kraepelin')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    mode === 'kraepelin'
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-100'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Kraepelin</span>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-normal mt-0.5">Bawah ke Atas (Umum)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('pauli')}
                  className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                    mode === 'pauli'
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-100'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Pauli</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] text-slate-500 block font-normal mt-0.5">Atas ke Bawah</span>
                </button>
              </div>
            </div>

            {/* Time per column */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Waktu per Kolom (Durasi Pindah):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { sec: 10, label: '10 Detik', desc: 'Blitz Cepat' },
                  { sec: 15, label: '15 Detik', desc: 'Standar Pabrik' },
                  { sec: 30, label: '30 Detik', desc: 'Full Endurance' }
                ].map((t) => (
                  <button
                    key={t.sec}
                    type="button"
                    onClick={() => setSecondsPerColumn(t.sec)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      secondsPerColumn === t.sec
                        ? 'bg-brand-600 text-white font-bold border-brand-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <span className="text-xs block leading-tight">{t.label}</span>
                    <span className={`text-[9px] block ${secondsPerColumn === t.sec ? 'text-sky-200' : 'text-slate-400'}`}>
                      {t.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Total columns */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Jumlah Kolom Tes:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { cols: 4, label: '4 Kolom' },
                  { cols: 6, label: '6 Kolom (Ideal)' },
                  { cols: 10, label: '10 Kolom' }
                ].map((c) => (
                  <button
                    key={c.cols}
                    type="button"
                    onClick={() => setTotalColumns(c.cols)}
                    className={`py-2 rounded-xl border text-xs text-center transition-all ${
                      totalColumns === c.cols
                        ? 'bg-brand-600 text-white font-bold border-brand-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold hover:bg-slate-100'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          <div className="bg-brand-50/80 border border-brand-200 rounded-2xl p-3.5 text-xs text-brand-950 space-y-1">
            <strong className="text-brand-900 block font-bold">💡 Aturan Penjumlahan:</strong>
            <p className="text-[11px] leading-relaxed">
              Jika hasil jumlah ≥ 10 (dua digit), ketuk <strong>angka satuannya saja</strong> (contoh: 8 + 7 = 15 → tekan angka <strong>5</strong>).
            </p>
          </div>

          <button
            onClick={startTest}
            className="w-full py-4 bg-gradient-to-r from-brand-600 via-sky-500 to-teal-400 hover:from-brand-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Mulai Tes Kraepelin</span>
          </button>

        </div>
      )}

      {/* 2. RUNNING TEST SCREEN (100% ZERO-SCROLL MOBILE ERGONOMIC VIEW) */}
      {gameState === 'running' && (
        <div className="flex-1 flex flex-col justify-between p-3.5 max-h-[820px] overflow-hidden">
          
          {/* Top Compact Status Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xs shrink-0">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-200">
                  Kolom {currentColumnIndex + 1}/{totalColumns}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Terjawab: <strong className="text-slate-900">{columnResults[currentColumnIndex]?.answered || 0}</strong> baris
                </span>
              </div>

              <div className="flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-xl font-mono font-black text-xs">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{columnTimeRemaining}s</span>
              </div>
            </div>

            {/* Time progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-600 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(columnTimeRemaining / secondsPerColumn) * 100}%` }}
              />
            </div>
          </div>

          {/* Center: Digits Display Box (Compact & Ultra Clear) */}
          <div className="bg-slate-900 text-white rounded-3xl p-4 my-2 shadow-lg flex flex-col items-center justify-center relative overflow-hidden shrink-0 min-h-[160px]">
            
            {/* Feedback badge */}
            {lastFeedback && (
              <div className={`absolute top-2 px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide animate-bounce ${
                lastFeedback === 'correct' 
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/50' 
                  : 'bg-red-500 text-white shadow-md shadow-red-500/50'
              }`}>
                {lastFeedback === 'correct' ? '✓ BENAR' : '✗ SALAH'}
              </div>
            )}

            {/* Vertical Digits Pill */}
            <div className="flex flex-col items-center justify-center space-y-1">
              
              {/* Top digit */}
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl sm:text-4xl font-black text-white font-mono shadow-inner">
                {currentTopNum ?? '-'}
              </div>

              {/* Plus indicator */}
              <div className="text-sky-400 font-extrabold text-base leading-none select-none">
                +
              </div>

              {/* Bottom digit */}
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-3xl sm:text-4xl font-black text-white font-mono shadow-inner">
                {currentBottomNum ?? '-'}
              </div>

            </div>

            <span className="text-[10px] text-slate-400 mt-2">
              Arah: {mode === 'kraepelin' ? 'Bawah + Atas (Kraepelin)' : 'Atas + Bawah (Pauli)'}
            </span>
          </div>

          {/* Bottom: Big Touch-Friendly Numpad Grid (Zero Scrolling, Fits 100% on Mobile) */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-sm shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleNumberInput(digit)}
                  className={`h-12 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center border active:scale-95 touch-manipulation ${
                    pressedDigit === digit
                      ? 'bg-brand-600 text-white border-brand-700 scale-95 shadow-inner'
                      : 'bg-slate-100/90 hover:bg-brand-50 active:bg-brand-600 active:text-white border-slate-200 text-slate-900'
                  }`}
                >
                  {digit}
                </button>
              ))}

              {/* Empty placeholder for aesthetic balance */}
              <div className="flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Satuan</span>
              </div>

              {/* 0 digit */}
              <button
                onClick={() => handleNumberInput(0)}
                className={`h-12 sm:h-14 rounded-2xl font-black text-xl sm:text-2xl transition-all shadow-xs flex items-center justify-center border active:scale-95 touch-manipulation ${
                  pressedDigit === 0
                    ? 'bg-brand-600 text-white border-brand-700 scale-95 shadow-inner'
                    : 'bg-slate-100/90 hover:bg-brand-50 active:bg-brand-600 active:text-white border-slate-200 text-slate-900'
                }`}
              >
                0
              </button>

              {/* Reset/Stop button */}
              <button
                onClick={() => setGameState('idle')}
                className="h-12 sm:h-14 rounded-2xl font-bold text-[11px] transition-all flex flex-col items-center justify-center border border-red-200 bg-red-50 text-red-600 active:bg-red-100"
              >
                <RotateCcw className="w-3.5 h-3.5 mb-0.5" />
                <span>Batal</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* 3. COMPLETED REPORT SCREEN */}
      {gameState === 'completed' && analysis && (
        <div className="p-4 space-y-4 pb-12 overflow-y-auto">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Rapor Hasil Tes Kraepelin
            </h2>
            <div className="inline-block mt-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-brand-50 text-brand-700 border border-brand-200">
              {analysis.statusGrade}
            </div>
          </div>

          {/* 4 Psychometric Scores */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Panker (Kecepatan)</span>
              <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">{analysis.panker}</div>
              <span className="text-[9px] text-slate-500">baris/kolom (Min: 14)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Janker (Ketelitian)</span>
              <div className="text-xl font-black text-emerald-600 mt-0.5 font-mono">{analysis.janker}%</div>
              <span className="text-[9px] text-slate-500">Akurasi (Min: 90%)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tianker (Stabilitas)</span>
              <div className="text-xl font-black text-sky-600 mt-0.5 font-mono">±{analysis.tianker}</div>
              <span className="text-[9px] text-slate-500">Deviasi (Ideal: &le; 2.5)</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Hankan (Ketahanan)</span>
              <div className="text-xl font-black text-purple-600 mt-0.5 font-mono">
                {analysis.hankan > 0 ? `+${analysis.hankan}` : analysis.hankan}
              </div>
              <span className="text-[9px] text-slate-500">Slope Regresi</span>
            </div>
          </div>

          {/* Column Chart */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-brand-600" />
              Grafik Kecepatan per Kolom:
            </h3>

            <div className="flex items-end gap-1.5 h-28 pt-4 px-1 border-b border-slate-200">
              {columnResults.map((col, idx) => {
                const maxVal = Math.max(...columnResults.map(c => c.answered), 20);
                const heightPercent = (col.answered / maxVal) * 100;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-700 mb-0.5">
                      {col.answered}
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-brand-600 to-sky-400 rounded-t-md"
                      style={{ height: `${Math.max(12, heightPercent)}%` }}
                    />
                    <span className="text-[9px] text-slate-400 mt-1">
                      K{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback list */}
          <div className="bg-brand-50/80 border border-brand-200 rounded-2xl p-3.5 text-xs text-brand-950 space-y-1">
            <strong className="text-brand-900 block font-bold">Catatan Psikologis:</strong>
            <ul className="space-y-1 list-disc list-inside text-[11px]">
              {analysis.feedback.map((fb: string, idx: number) => (
                <li key={idx}>{fb}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setGameState('idle')}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Latihan Ulang Kraepelin
          </button>

        </div>
      )}

    </div>
  );
};
