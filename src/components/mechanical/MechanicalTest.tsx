import React, { useState, useEffect } from 'react';
import { getRandomMechanicalSet, mechanicalQuestionBank } from '../../data/questions-mechanical';
import { BaseQuestion } from '../../types';
import { sounds } from '../../utils/sound-effects';
import { 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award,
  Sparkles,
  Shuffle,
  Layers,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MechanicalTest: React.FC = () => {
  const [questions, setQuestions] = useState<BaseQuestion[]>(() => getRandomMechanicalSet(10));
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

  const handleReset = (newBatch: boolean = true) => {
    if (newBatch) {
      setQuestions(getRandomMechanicalSet(10));
    }
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowExplanation(false);
    setIsFinished(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([idx, ans]) => questions[Number(idx)] && questions[Number(idx)].correctAnswer === ans
  ).length;
  const scorePercent = Math.round((correctCount / questions.length) * 100);

  // --------------------------------------------------------------------------
  // Rich SVG Mechanical Diagram Renderers (14 Dynamic Diagram Types)
  // --------------------------------------------------------------------------
  const renderDiagram = (q: BaseQuestion) => {
    const p = q.diagramProps || {};

    // 1. GEARS CHAIN (3, 4, or 5 Gears)
    if (q.diagramType === 'gears') {
      const count = p.count || 4;
      const startDir = p.startDir || 'cw';
      const labels = p.labels || ['A', 'B', 'C', 'D'];
      const totalWidth = 360;
      const spacing = count === 3 ? 90 : count === 4 ? 68 : 55;
      const startX = count === 3 ? 90 : count === 4 ? 60 : 45;
      const r = count === 3 ? 34 : count === 4 ? 28 : 22;

      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 360 140" className="w-full max-w-sm h-32">
            {labels.map((lbl: string, idx: number) => {
              const cx = startX + idx * spacing;
              const isTarget = idx === count - 1;
              const isFirst = idx === 0;
              const color = isTarget ? '#e11d48' : idx % 2 === 0 ? '#0284c7' : '#0369a1';
              const strokeColor = isTarget ? '#fda4af' : '#38bdf8';

              return (
                <g key={lbl} transform={`translate(${cx}, 70)`}>
                  <circle 
                    r={r} 
                    fill={color} 
                    stroke={strokeColor} 
                    strokeWidth="3" 
                    strokeDasharray={isTarget ? '4 2' : 'none'} 
                  />
                  <circle r={r * 0.35} fill="#0f172a" />
                  <text x="0" y="5" fill="#ffffff" fontSize={isTarget ? '13' : '12'} fontWeight="bold" textAnchor="middle">
                    {isTarget ? `${lbl} (?)` : lbl}
                  </text>
                  
                  {isFirst && (
                    <>
                      <path 
                        d={startDir === 'cw' ? "M -16 -16 A 22 22 0 0 1 16 -16" : "M 16 -16 A 22 22 0 0 0 -16 -16"} 
                        fill="none" 
                        stroke="#facc15" 
                        strokeWidth="3" 
                      />
                      <polygon 
                        points={startDir === 'cw' ? "14,-20 20,-14 13,-12" : "-14,-20 -20,-14 -13,-12"} 
                        fill="#facc15" 
                      />
                      <text x="0" y="-22" fill="#facc15" fontSize="8" fontWeight="bold" textAnchor="middle">
                        {startDir.toUpperCase()}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">
            Rangkaian Transmisi Roda Gigi ({labels.join(' - ')})
          </span>
        </div>
      );
    }

    // 2. GEAR SPEED & RATIO
    if (q.diagramType === 'gear-speed') {
      const teethA = p.teethA || 12;
      const teethB = p.teethB || 36;
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 360 140" className="w-full max-w-sm h-32">
            {/* Gear A (Small) */}
            <g transform="translate(100, 70)">
              <circle r="28" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <circle r="9" fill="#0f172a" />
              <text x="0" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">A</text>
              <text x="0" y="42" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">{teethA} Gigi</text>
            </g>
            {/* Gear B (Large) */}
            <g transform="translate(210, 70)">
              <circle r="50" fill="#0369a1" stroke="#38bdf8" strokeWidth="3" />
              <circle r="14" fill="#0f172a" />
              <text x="0" y="5" fill="#ffffff" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
              <text x="0" y="66" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">{teethB} Gigi</text>
            </g>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Rasio Pasangan Roda Gigi (Gigi A: {teethA}T &bull; Gigi B: {teethB}T)</span>
        </div>
      );
    }

    // 3. BELT & PULLEY (Open vs Crossed)
    if (q.diagramType === 'belt') {
      const isCrossed = p.isCrossed;
      const startDir = p.startDir || 'cw';
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 360 140" className="w-full max-w-sm h-32">
            {/* Belt */}
            {isCrossed ? (
              <path d="M 90 40 L 250 100 A 30 30 0 0 0 250 40 L 90 100 A 30 30 0 0 0 90 40" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="6 3" />
            ) : (
              <path d="M 90 40 L 250 40 A 30 30 0 0 1 250 100 L 90 100 A 30 30 0 0 1 90 40" fill="none" stroke="#facc15" strokeWidth="3" strokeDasharray="6 3" />
            )}
            
            {/* Pulley A */}
            <g transform="translate(90, 70)">
              <circle r="30" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <circle r="8" fill="#0f172a" />
              <text x="0" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">A (Driver)</text>
              <path d={startDir === 'cw' ? "M -16 -16 A 20 20 0 0 1 16 -16" : "M 16 -16 A 20 20 0 0 0 -16 -16"} fill="none" stroke="#34d399" strokeWidth="3" />
              <text x="0" y="-22" fill="#34d399" fontSize="8" fontWeight="bold" textAnchor="middle">{startDir.toUpperCase()}</text>
            </g>

            {/* Pulley B */}
            <g transform="translate(250, 70)">
              <circle r="30" fill="#e11d48" stroke="#fda4af" strokeWidth="3" />
              <circle r="8" fill="#0f172a" />
              <text x="0" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">B (?)</text>
            </g>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">
            Sistem Transmisi Puli ({isCrossed ? 'Sabuk Menyilang / Crossed Belt' : 'Sabuk Lurus Terbuka / Open Belt'})
          </span>
        </div>
      );
    }

    // 4. PULLEY & TACKLE
    if (q.diagramType === 'pulley') {
      const ropes = p.ropes || 2;
      const weight = p.weight || '120 kg';

      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 280 160" className="w-full max-w-[220px] h-32">
            {/* Ceiling */}
            <rect x="40" y="8" width="200" height="6" fill="#64748b" rx="2" />
            
            {/* Top Fixed Pulley */}
            <line x1="140" y1="14" x2="140" y2="34" stroke="#94a3b8" strokeWidth="3" />
            <circle cx="140" cy="34" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="140" cy="34" r="3" fill="#ffffff" />
            
            {/* Bottom Movable Pulley */}
            {ropes > 1 && (
              <>
                <circle cx="110" cy="95" r="14" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <circle cx="110" cy="95" r="3" fill="#ffffff" />
                
                {/* Ropes */}
                <path d="M 80 14 L 110 95 L 140 34 L 180 115" fill="none" stroke="#facc15" strokeWidth="3" />
                
                {/* Load */}
                <rect x="90" y="112" width="40" height="26" fill="#334155" stroke="#64748b" strokeWidth="2" rx="4" />
                <text x="110" y="129" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{weight}</text>
              </>
            )}

            {ropes === 1 && (
              <>
                <path d="M 110 95 L 140 34 L 180 115" fill="none" stroke="#facc15" strokeWidth="3" />
                <rect x="90" y="95" width="40" height="26" fill="#334155" stroke="#64748b" strokeWidth="2" rx="4" />
                <text x="110" y="112" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">{weight}</text>
              </>
            )}

            {/* Pull Vector Arrow */}
            <path d="M 180 100 L 180 135" stroke="#4ade80" strokeWidth="3" />
            <polygon points="175,130 180,140 185,130" fill="#4ade80" />
            <text x="200" y="125" fill="#4ade80" fontSize="10" fontWeight="bold">F = ?</text>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Sistem Katrol Derek (Beban: {weight})</span>
        </div>
      );
    }

    // 5. LEVER & FULCRUM
    if (q.diagramType === 'lever') {
      const weight = p.weight || 'W';
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Beam */}
            <rect x="30" y="60" width="260" height="8" fill="#e2e8f0" rx="3" />
            
            {/* Load W */}
            <rect x="35" y="25" width="35" height="35" fill="#e11d48" rx="4" />
            <text x="52" y="47" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">{weight}</text>

            {/* Fulcrums 1, 2, 3 */}
            <polygon points="90,68 80,95 100,95" fill="#0284c7" />
            <text x="90" y="110" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Posisi 1</text>

            <polygon points="160,68 150,95 170,95" fill="#64748b" strokeDasharray="2 2" />
            <text x="160" y="110" fill="#94a3b8" fontSize="9" textAnchor="middle">Posisi 2</text>

            <polygon points="230,68 220,95 240,95" fill="#64748b" strokeDasharray="2 2" />
            <text x="230" y="110" fill="#94a3b8" fontSize="9" textAnchor="middle">Posisi 3</text>

            {/* Force Arrow */}
            <path d="M 280 30 L 280 55" stroke="#4ade80" strokeWidth="3" />
            <polygon points="275,50 280,60 285,50" fill="#4ade80" />
            <text x="280" y="22" fill="#4ade80" fontSize="10" fontWeight="bold" textAnchor="middle">Kuasa (F)</text>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Kesetimbangan Tuas Pengungkit</span>
        </div>
      );
    }

    // 6. BEAKERS & COMMUNICATING VESSELS
    if (q.diagramType === 'beaker') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Input water tap */}
            <rect x="50" y="10" width="20" height="15" fill="#0284c7" rx="2" />
            <path d="M 60 25 L 60 45" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 3" />
            
            {/* 4 Connected Vessels */}
            {[0, 1, 2, 3].map(idx => (
              <g key={idx} transform={`translate(${50 + idx * 60}, 45)`}>
                <rect x="0" y="0" width="40" height="60" fill="none" stroke="#64748b" strokeWidth="2" />
                <rect x="2" y="25" width="36" height="33" fill="#0284c7" opacity="0.3" />
                <text x="20" y="45" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">{idx + 1}</text>
              </g>
            ))}

            {/* Interconnecting Pipes */}
            <line x1="90" y1="90" x2="110" y2="90" stroke="#0284c7" strokeWidth="6" />
            <line x1="150" y1="80" x2="170" y2="80" stroke="#0284c7" strokeWidth="6" />
            <line x1="210" y1="95" x2="230" y2="95" stroke="#0284c7" strokeWidth="6" />
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Susunan Bejana Berhubungan & Pipa Aliran</span>
        </div>
      );
    }

    // 7. HYDRAULIC PRESS (PASCAL'S LAW)
    if (q.diagramType === 'hydraulic') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Hydraulic Chamber U-Tube */}
            <path d="M 60 40 L 60 110 L 260 110 L 260 40" fill="none" stroke="#64748b" strokeWidth="4" />
            <path d="M 90 40 L 90 90 L 210 90 L 210 40" fill="none" stroke="#64748b" strokeWidth="4" />
            
            {/* Oil Fluid */}
            <path d="M 62 70 L 62 108 L 258 108 L 258 60 L 212 60 L 212 88 L 88 88 L 88 70 Z" fill="#0284c7" opacity="0.4" />

            {/* Small Piston A1 */}
            <rect x="63" y="65" width="24" height="10" fill="#e11d48" rx="2" />
            <path d="M 75 35 L 75 60" stroke="#fda4af" strokeWidth="3" />
            <polygon points="70,55 75,65 80,55" fill="#fda4af" />
            <text x="75" y="28" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">F1 (A1)</text>

            {/* Large Piston A2 */}
            <rect x="213" y="55" width="44" height="12" fill="#0284c7" rx="2" />
            <rect x="220" y="25" width="30" height="30" fill="#334155" stroke="#64748b" strokeWidth="2" rx="4" />
            <text x="235" y="44" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Beban</text>
            <text x="235" y="80" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">A2 (Besar)</text>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Prinsip Dongkrak Hidrolik Fluida (Hukum Pascal)</span>
        </div>
      );
    }

    // 8. CIRCUIT & SWITCHES
    if (q.diagramType === 'circuit') {
      const openSwitch = p.openSwitch || 2;
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Main Battery */}
            <g transform="translate(40, 70)">
              <line x1="0" y1="-20" x2="0" y2="20" stroke="#facc15" strokeWidth="4" />
              <line x1="8" y1="-10" x2="8" y2="10" stroke="#64748b" strokeWidth="4" />
              <text x="-8" y="5" fill="#facc15" fontSize="10" fontWeight="bold">+</text>
              <text x="14" y="5" fill="#64748b" fontSize="10" fontWeight="bold">-</text>
            </g>

            {/* Master Switch S1 */}
            <line x1="44" y1="50" x2="90" y2="50" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="90" cy="50" r="3" fill="#38bdf8" />
            <line x1="90" y1="50" x2={openSwitch === 1 ? "110" : "115"} y2={openSwitch === 1 ? "38" : "50"} stroke="#e11d48" strokeWidth="3" />
            <circle cx="115" cy="50" r="3" fill="#38bdf8" />
            <text x="100" y="32" fill="#fda4af" fontSize="9" fontWeight="bold">S1</text>

            {/* Branches to Lamps */}
            {/* Branch 1 - L1 */}
            <line x1="115" y1="50" x2="160" y2="30" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="200" cy="30" r="10" fill={openSwitch === 1 ? "#334155" : "#facc15"} stroke="#38bdf8" strokeWidth="2" />
            <text x="200" y="34" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">L1</text>
            <line x1="210" y1="30" x2="270" y2="70" stroke="#38bdf8" strokeWidth="2" />

            {/* Branch 2 - L2 & S2 */}
            <line x1="115" y1="50" x2="150" y2="70" stroke="#38bdf8" strokeWidth="2" />
            <line x1="150" y1="70" x2="165" y2={openSwitch === 2 ? "60" : "70"} stroke="#e11d48" strokeWidth="3" />
            <text x="155" y="58" fill="#fda4af" fontSize="9" fontWeight="bold">S2</text>
            <circle cx="200" cy="70" r="10" fill={openSwitch === 2 || openSwitch === 1 ? "#334155" : "#facc15"} stroke="#38bdf8" strokeWidth="2" />
            <text x="200" y="74" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">L2</text>
            <line x1="210" y1="70" x2="270" y2="70" stroke="#38bdf8" strokeWidth="2" />

            {/* Branch 3 - L3 */}
            <line x1="115" y1="50" x2="160" y2="110" stroke="#38bdf8" strokeWidth="2" />
            <circle cx="200" cy="110" r="10" fill={openSwitch === 1 ? "#334155" : "#facc15"} stroke="#38bdf8" strokeWidth="2" />
            <text x="200" y="114" fill="#0f172a" fontSize="9" fontWeight="bold" textAnchor="middle">L3</text>
            <line x1="210" y1="110" x2="270" y2="70" stroke="#38bdf8" strokeWidth="2" />

            {/* Return Wire */}
            <line x1="270" y1="70" x2="270" y2="90" stroke="#38bdf8" strokeWidth="2" />
            <line x1="270" y1="90" x2="44" y2="90" stroke="#38bdf8" strokeWidth="2" />
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Sirkuit Kelistrikan Paralel Mesin (S1: Saklar Utama &bull; S2: Saklar Cabang)</span>
        </div>
      );
    }

    // 9. STABILITY & CENTER OF GRAVITY
    if (q.diagramType === 'stability') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Slope Ground */}
            <line x1="30" y1="110" x2="290" y2="70" stroke="#64748b" strokeWidth="4" />
            
            {/* Truck A (Low CG) */}
            <g transform="translate(80, 85) rotate(-9.5)">
              <rect x="-30" y="-35" width="60" height="30" fill="#0284c7" rx="3" />
              <rect x="-25" y="-20" width="50" height="12" fill="#e11d48" rx="2" />
              <circle cx="-18" cy="0" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="18" cy="0" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <text x="0" y="-40" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">Truk A (CG Rendah)</text>
            </g>

            {/* Truck B (High CG) */}
            <g transform="translate(210, 63) rotate(-9.5)">
              <rect x="-30" y="-45" width="60" height="40" fill="#0369a1" rx="3" />
              <rect x="-25" y="-42" width="50" height="15" fill="#e11d48" rx="2" />
              <circle cx="-18" cy="0" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <circle cx="18" cy="0" r="6" fill="#334155" stroke="#94a3b8" strokeWidth="2" />
              <text x="0" y="-50" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">Truk B (CG Tinggi)</text>
            </g>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Uji Kestabilan Muatan Kendaraan pada Tanjakan Miring</span>
        </div>
      );
    }

    // 10. INCLINED PLANES (BIDANG MIRING)
    if (q.diagramType === 'incline') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Truck Bed / Height */}
            <rect x="250" y="30" width="50" height="80" fill="#334155" stroke="#64748b" strokeWidth="2" rx="4" />
            <text x="275" y="75" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Truk (h)</text>

            {/* Ramp A (Long & Gentle) */}
            <line x1="30" y1="110" x2="250" y2="40" stroke="#38bdf8" strokeWidth="3" />
            <text x="110" y="65" fill="#38bdf8" fontSize="9" fontWeight="bold">Papan A (Panjang/Landai)</text>

            {/* Ramp B (Medium) */}
            <line x1="90" y1="110" x2="250" y2="40" stroke="#facc15" strokeWidth="3" strokeDasharray="4 2" />
            <text x="160" y="85" fill="#facc15" fontSize="9" fontWeight="bold">Papan B</text>

            {/* Ramp C (Short & Steep) */}
            <line x1="160" y1="110" x2="250" y2="40" stroke="#e11d48" strokeWidth="3" strokeDasharray="2 2" />
            <text x="200" y="105" fill="#fda4af" fontSize="9" fontWeight="bold">Papan C (Curam)</text>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Keuntungan Mekanis Bidang Miring (Gaya vs Panjang Papan)</span>
        </div>
      );
    }

    // 11. SPRINGS (PEGAS SERI VS PARALEL)
    if (q.diagramType === 'spring') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Ceiling */}
            <rect x="30" y="10" width="260" height="6" fill="#64748b" rx="2" />

            {/* Setup 1: Parallel Springs */}
            <g transform="translate(90, 16)">
              <path d="M -15 0 L -15 10 L -22 15 L -8 20 L -22 25 L -8 30 L -15 35 L -15 45" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 15 0 L 15 10 L 8 15 L 22 20 L 8 25 L 22 30 L 15 35 L 15 45" fill="none" stroke="#38bdf8" strokeWidth="3" />
              <line x1="-25" y1="45" x2="25" y2="45" stroke="#94a3b8" strokeWidth="3" />
              <rect x="-20" y="48" width="40" height="25" fill="#0284c7" rx="3" />
              <text x="0" y="64" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">100 kg</text>
              <text x="0" y="88" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Paralel</text>
            </g>

            {/* Setup 2: Series Springs */}
            <g transform="translate(220, 16)">
              <path d="M 0 0 L 0 8 L -8 12 L 8 16 L -8 20 L 8 24 L 0 28 L 0 36 L -8 40 L 8 44 L -8 48 L 8 52 L 0 56 L 0 64" fill="none" stroke="#facc15" strokeWidth="3" />
              <rect x="-20" y="64" width="40" height="25" fill="#0369a1" rx="3" />
              <text x="0" y="80" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">100 kg</text>
              <text x="0" y="104" fill="#facc15" fontSize="9" fontWeight="bold" textAnchor="middle">Seri</text>
            </g>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Konfigurasi Rangkaian Pegas (Paralel vs Seri)</span>
        </div>
      );
    }

    // 12. BIMETAL STRIP
    if (q.diagramType === 'bimetal') {
      const isHeated = p.isHeated !== false;
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Clamp Base */}
            <rect x="30" y="40" width="20" height="60" fill="#475569" rx="3" />

            {/* Bimetal Strip (Before vs After) */}
            <g transform="translate(50, 60)">
              {/* Metal A (Top) */}
              <path d={isHeated ? "M 0 0 Q 110 5 200 40 L 195 48 Q 110 13 0 8 Z" : "M 0 0 Q 110 -5 200 -30 L 195 -22 Q 110 3 0 8 Z"} fill="#38bdf8" />
              {/* Metal B (Bottom) */}
              <path d={isHeated ? "M 0 8 Q 110 13 195 48 L 190 56 Q 110 21 0 16 Z" : "M 0 8 Q 110 3 195 -22 L 190 -14 Q 110 11 0 16 Z"} fill="#facc15" />
            </g>

            {/* Heat / Cool Indicator */}
            {isHeated ? (
              <text x="160" y="115" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">🔥 Dipanaskan (Logam A Muai Lebih Cepat)</text>
            ) : (
              <text x="160" y="115" fill="#7dd3fc" fontSize="10" fontWeight="bold" textAnchor="middle">❄️ Didinginkan Ekstrim</text>
            )}
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Perilaku Pemuaian Termal Keping Bimetal</span>
        </div>
      );
    }

    // 13. FRICTION & TRIBOLOGY
    if (q.diagramType === 'friction') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Surface */}
            <line x1="30" y1="100" x2="290" y2="100" stroke="#64748b" strokeWidth="4" />
            
            {/* Block */}
            <rect x="100" y="55" width="70" height="45" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" rx="4" />
            <text x="135" y="82" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">50 kg</text>

            {/* Pull Vector */}
            <path d="M 170 77 L 230 77" stroke="#4ade80" strokeWidth="4" />
            <polygon points="225,72 235,77 225,82" fill="#4ade80" />
            <text x="245" y="81" fill="#4ade80" fontSize="10" fontWeight="bold">F (Tarik)</text>

            {/* Friction Vector */}
            <path d="M 100 95 L 60 95" stroke="#f87171" strokeWidth="3" />
            <polygon points="65,91 55,95 65,99" fill="#f87171" />
            <text x="45" y="99" fill="#f87171" fontSize="9" fontWeight="bold">f (Gesek)</text>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Gaya Gesek Permukaan Dinamis & Koefisien Gesek (f = &mu; &times; N)</span>
        </div>
      );
    }

    // 14. BUOYANCY & ARCHIMEDES
    if (q.diagramType === 'buoyancy') {
      return (
        <div className="bg-slate-900 rounded-2xl p-3 flex flex-col items-center justify-center border border-slate-800 shadow-inner">
          <svg viewBox="0 0 320 140" className="w-full max-w-sm h-32">
            {/* Vessel 1: Fresh Water */}
            <g transform="translate(60, 20)">
              <rect x="0" y="0" width="80" height="85" fill="none" stroke="#64748b" strokeWidth="2" rx="4" />
              <rect x="2" y="30" width="76" height="53" fill="#0284c7" opacity="0.3" />
              <rect x="20" y="20" width="40" height="35" fill="#d97706" rx="2" />
              <text x="40" y="100" fill="#7dd3fc" fontSize="9" fontWeight="bold" textAnchor="middle">Air Tawar (&rho;=1.0)</text>
            </g>

            {/* Vessel 2: Salt Water */}
            <g transform="translate(180, 20)">
              <rect x="0" y="0" width="80" height="85" fill="none" stroke="#64748b" strokeWidth="2" rx="4" />
              <rect x="2" y="30" width="76" height="53" fill="#0369a1" opacity="0.5" />
              <rect x="20" y="10" width="40" height="35" fill="#d97706" rx="2" />
              <text x="40" y="100" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">Air Garam (&rho;=1.2)</text>
            </g>
          </svg>
          <span className="text-[10px] text-slate-400 mt-1 font-medium">Daya Apung Fluida & Massa Jenis Zat Cair (Hukum Archimedes)</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-3.5 pb-12 select-none overflow-y-auto">
      
      {!isFinished ? (
        <div className="space-y-3">
          
          {/* Top Header Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-lg border border-brand-200 dark:border-brand-800">
                Soal {currentIndex + 1}/{questions.length}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg">
                <Layers className="w-3 h-3 text-brand-600" />
                Bank Soal 1.000+
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-24 sm:w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <button
                onClick={() => handleReset(true)}
                title="Acak 10 Soal Baru dari Bank Soal"
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-brand-100 dark:hover:bg-brand-900/50 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all flex items-center gap-1 text-[10px] font-bold"
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
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                Topik: {currentQ.subCategory}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ID: {currentQ.id}
              </span>
            </div>
          )}

          {/* Diagram Box */}
          {renderDiagram(currentQ)}

          {/* Question Text */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-xs">
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          {/* Options List */}
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
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                >
                  <span className="leading-snug pr-2">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Quick Trick */}
          {showExplanation && (
            <div className="bg-brand-50/90 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 rounded-2xl p-3 text-xs space-y-1.5 text-brand-950 dark:text-brand-100">
              <strong className="text-brand-900 dark:text-brand-300 font-bold block text-[11px]">📖 Pembahasan & Logika Mekanika:</strong>
              <p className="text-[11px] leading-relaxed">{currentQ.explanation}</p>
              {currentQ.quickTrick && (
                <div className="bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-900 dark:text-brand-200 font-semibold text-[10px]">
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
              className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
            >
              <span>{currentIndex + 1 === questions.length ? 'Selesai & Lihat Skor' : 'Lanjut'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Result Summary Screen */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-xs text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Hasil Tes Mekanika Bennett</h2>
            <div className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono mt-1">{scorePercent}%</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {correctCount} dari {questions.length} Soal Benar
            </p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-750 border border-slate-100 dark:border-slate-700 rounded-2xl text-left space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Standar Kelulusan Industri:</span>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {scorePercent >= 80 ? '🎉 Lolos Kualifikasi Astra / Toyota / Epson (Sangat Siap)' : scorePercent >= 60 ? '👍 Cukup Siap (Perbanyak Latihan Variasi Katrol & Roda Gigi)' : '⚠️ Perlu Latihan Intensif Logika Mekanika'}
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => handleReset(true)}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Latihan Lagi (10 Soal Acak Baru)
            </button>

            <button
              onClick={() => handleReset(false)}
              className="w-full py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ulangi 10 Soal yang Sama
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
