import React, { useState, useEffect, useRef } from 'react';
import { TargetRole, InterviewRubric } from '../../types';
import { interviewQuestionsBank, evaluateUserInterviewResponse, InterviewQuestionItem } from '../../data/interview-data';
import { sounds } from '../../utils/sound-effects';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Play, 
  RotateCcw, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare,
  Bot,
  User,
  ShieldCheck,
  Zap,
  Send,
  Coins,
  CreditCard,
  PhoneCall,
  PhoneOff,
  Radio,
  ChevronRight,
  X,
  Flame,
  Check,
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../../utils/theme-context';
import { 
  getUserInterviewTokens, 
  deductUserInterviewToken, 
  topUpUserInterviewTokens,
  getActiveSession,
  updateActiveUserScore,
  recordUserTestResult
} from '../../utils/auth-storage';

interface AiInterviewSimulatorProps {
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
}

export const AiInterviewSimulator: React.FC<AiInterviewSimulatorProps> = ({
  targetRole,
  setTargetRole
}) => {
  const { isDark } = useTheme();

  // Session & Flow States
  const [sessionState, setSessionState] = useState<'idle' | 'interviewing' | 'evaluated'>('idle');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [interactionMode, setInteractionMode] = useState<'live' | 'manual'>('live'); // 'live' = continuous 2-way call
  const [conversationStatus, setConversationStatus] = useState<'ai_talking' | 'user_listening' | 'evaluating' | 'idle'>('idle');
  
  // Call Timer
  const [callSeconds, setCallSeconds] = useState<number>(0);

  // Tokens / Credit System State
  const [tokenBalance, setTokenBalance] = useState<number>(() => getUserInterviewTokens());
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);
  const [selectedTopUpPackage, setSelectedTopUpPackage] = useState<number | null>(null);
  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState<string | null>(null);
  const [micPermissionBlocked, setMicPermissionBlocked] = useState<boolean>(false);

  // Results
  const [sessionResponses, setSessionResponses] = useState<{
    question: InterviewQuestionItem;
    userAnswer: string;
    rubric: InterviewRubric;
  }[]>([]);

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const recognitionActiveRef = useRef<boolean>(false);

  const questionsList = interviewQuestionsBank[targetRole] || interviewQuestionsBank.operator;
  const currentQuestion = questionsList[currentQIndex];

  // Synchronize Token Balance with storage & events
  useEffect(() => {
    const handleTokenUpdate = (e: any) => {
      setTokenBalance(e.detail ?? getUserInterviewTokens());
    };
    window.addEventListener('siapkerja_tokens_updated', handleTokenUpdate);
    return () => {
      window.removeEventListener('siapkerja_tokens_updated', handleTokenUpdate);
    };
  }, []);

  // Call duration stopwatch
  useEffect(() => {
    if (sessionState === 'interviewing') {
      setCallSeconds(0);
      callTimerRef.current = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [sessionState]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onstart = () => {
          recognitionActiveRef.current = true;
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setUserInputText(transcript);

            // If in continuous live call mode, reset silence detector
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (transcript.trim().split(/\s+/).length >= 4) {
              // Auto-advance after 2.8s of silence if user has answered adequately
              silenceTimerRef.current = setTimeout(() => {
                if (recognitionActiveRef.current) {
                  autoCommitLiveAnswer(transcript);
                }
              }, 2800);
            }
          }
        };

        recognition.onerror = (err: any) => {
          console.log('Speech recognition notice:', err);
          recognitionActiveRef.current = false;
          setIsRecording(false);
          if (err?.error === 'not-allowed' || err?.error === 'service-not-allowed') {
            setMicPermissionBlocked(true);
          }
        };

        recognition.onend = () => {
          recognitionActiveRef.current = false;
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      if (recognitionRef.current && recognitionActiveRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // AI Voice Synthesis (Text-to-Speech)
  const speakQuestion = (text: string, onDoneCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onDoneCallback) onDoneCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.98; // Natural pace
    utterance.pitch = 1.0;

    // Indonesian voice preference
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => {
      setIsAiSpeaking(true);
      setConversationStatus('ai_talking');
    };

    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onDoneCallback) {
        onDoneCallback();
      } else if (interactionMode === 'live') {
        // Automatically start listening after AI finishes speaking
        startListeningToUser();
      } else {
        setConversationStatus('user_listening');
      }
    };

    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onDoneCallback) onDoneCallback();
      else if (interactionMode === 'live') startListeningToUser();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start listening to user voice automatically
  const startListeningToUser = () => {
    if (!recognitionRef.current) {
      setConversationStatus('user_listening');
      return;
    }
    setConversationStatus('user_listening');
    setUserInputText('');
    try {
      if (!recognitionActiveRef.current) {
        recognitionRef.current.start();
        sounds.playClick();
      }
    } catch (e) {
      console.log('Mic start err:', e);
    }
  };

  // Stop listening
  const stopListeningToUser = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current && recognitionActiveRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    recognitionActiveRef.current = false;
    setIsRecording(false);
  };

  // Auto-commit in live voice call mode
  const autoCommitLiveAnswer = (textToSubmit?: string) => {
    const finalAnswer = (textToSubmit || userInputText).trim();
    if (!finalAnswer) return;
    stopListeningToUser();
    processAnswerAndAdvance(finalAnswer);
  };

  // Start interview with Token Check
  const startInterviewSession = () => {
    if (tokenBalance <= 0) {
      sounds.playWrong();
      setIsTopUpModalOpen(true);
      return;
    }

    // Deduct 1 token
    const success = deductUserInterviewToken();
    if (!success) {
      setIsTopUpModalOpen(true);
      return;
    }
    setTokenBalance(getUserInterviewTokens());

    setSessionState('interviewing');
    setCurrentQIndex(0);
    setUserInputText('');
    setSessionResponses([]);
    sounds.playBeep();

    // Begin conversation
    setTimeout(() => {
      speakQuestion(questionsList[0].question);
    }, 800);
  };

  // Submit Answer & Transition to Next Question
  const processAnswerAndAdvance = (answerText: string) => {
    setConversationStatus('evaluating');
    sounds.playCorrect();

    const evaluation = evaluateUserInterviewResponse(answerText, currentQuestion);

    const updatedResponses = [
      ...sessionResponses,
      {
        question: currentQuestion,
        userAnswer: answerText,
        rubric: evaluation
      }
    ];
    setSessionResponses(updatedResponses);

    const isLastQuestion = currentQIndex + 1 >= questionsList.length;

    if (!isLastQuestion) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setUserInputText('');

      // Spoken transitional phrase
      const transitions = [
        'Baik, terima kasih atas penjelasannya. Mari lanjut ke pertanyaan selanjutnya.',
        'Bagus, saya catat jawaban Anda. Pertanyaan berikutnya:',
        'Menarik sekali. Selanjutnya silakan tanggapi pertanyaan ini:'
      ];
      const randomTransition = transitions[currentQIndex % transitions.length];

      setTimeout(() => {
        speakQuestion(`${randomTransition} ${questionsList[nextIdx].question}`);
      }, 600);
    } else {
      // Completed all questions
      stopListeningToUser();
      const finalAvgScore = Math.round(
        updatedResponses.reduce((sum, r) => sum + r.rubric.totalAcceptanceProbability, 0) / updatedResponses.length
      );

      // Speak closing remark before showing evaluation
      speakQuestion(
        'Terima kasih sudah mengikuti sesi wawancara ini dengan sangat baik. Sesi wawancara telah selesai, mari kita lihat hasil evaluasi dan rekomendasi kelulusan Anda.',
        () => {
          setSessionState('evaluated');
          setConversationStatus('idle');
          sounds.playCelebration();
          confetti({ particleCount: 100, spread: 80 });

          // Persist user test record and score
          const user = getActiveSession();
          if (user) {
            updateActiveUserScore({ interviewScore: finalAvgScore });
            recordUserTestResult({
              testType: 'psychotest',
              testName: `AI Interview — ${currentQuestion.interviewerPersona}`,
              score: finalAvgScore,
              totalQuestions: questionsList.length,
              correctAnswers: updatedResponses.filter(r => r.rubric.totalAcceptanceProbability >= 70).length,
              details: {
                targetRole,
                responses: updatedResponses
              }
            });
          }
        }
      );
    }
  };

  // Top Up Tokens Handler
  const handleTopUpTokens = (amount: number, packageName: string) => {
    sounds.playCorrect();
    const newBal = topUpUserInterviewTokens(amount);
    setTokenBalance(newBal);
    setTopUpSuccessNotice(`🎉 Berhasil Top Up ${amount} Kredit Interview (${packageName})! Saldo Anda sekarang: ${newBal} Kredit.`);
    confetti({ particleCount: 50, spread: 60 });
    setTimeout(() => {
      setTopUpSuccessNotice(null);
      setIsTopUpModalOpen(false);
    }, 1800);
  };

  // Overall calculations for evaluated state
  const totalProbability = sessionResponses.length > 0
    ? Math.round(sessionResponses.reduce((sum, r) => sum + r.rubric.totalAcceptanceProbability, 0) / sessionResponses.length)
    : 0;

  const avgRelevance = sessionResponses.length > 0
    ? Math.round(sessionResponses.reduce((sum, r) => sum + r.rubric.relevanceScore, 0) / sessionResponses.length)
    : 0;
  const avgArticulation = sessionResponses.length > 0
    ? Math.round(sessionResponses.reduce((sum, r) => sum + r.rubric.articulationScore, 0) / sessionResponses.length)
    : 0;
  const avgEtiquette = sessionResponses.length > 0
    ? Math.round(sessionResponses.reduce((sum, r) => sum + r.rubric.etiquetteScore, 0) / sessionResponses.length)
    : 0;
  const avgJobFit = sessionResponses.length > 0
    ? Math.round(sessionResponses.reduce((sum, r) => sum + r.rubric.jobFitScore, 0) / sessionResponses.length)
    : 0;

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-3 select-none transition-colors ${
      isDark ? 'text-white' : 'text-slate-900'
    }`}>
      
      {/* Top Banner & Token Balance Bar (Maximized Width) */}
      <div className={`border rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-purple-900/60' 
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Fitur Premium AI
              </span>
              <span className="text-xs font-semibold text-purple-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live 2-Way Voice Interview
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Simulasi Interview AI HRD & User Pabrik
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
              Percakapan suara langsung dua arah tanpa jeda seperti panggilan video call asli dengan perekrut industri.
            </p>
          </div>

          {/* Token Balance Pill & Top Up Trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl px-3.5 py-2 text-left">
              <span className="text-[10px] uppercase font-bold text-purple-300 block">Saldo Kredit AI:</span>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-black text-amber-300">{tokenBalance} Sesi</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setIsTopUpModalOpen(true);
              }}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-2xl shadow-md shadow-amber-500/25 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Top Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. IDLE SCREEN / ROLE SELECTOR                                      */}
      {/* =================================================================== */}
      {sessionState === 'idle' && (
        <div className={`border rounded-3xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm sm:text-base font-black">
                Pilih Target Posisi Pekerjaan Wawancara:
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Setiap posisi memiliki persona HRD & bank pertanyaan standar seleksi kerja asli.
              </p>
            </div>

            {/* Interaction Mode Switch (Live Voice Call vs Manual Typing) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => {
                  sounds.playClick();
                  setInteractionMode('live');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  interactionMode === 'live'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>Live Call (Suara Langsung)</span>
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setInteractionMode('manual');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  interactionMode === 'manual'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mode Teks / Manual</span>
              </button>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'operator', title: 'Operator Produksi', desc: 'Fokus kesiapan fisik, stamina shift malam, disiplin SOP, dan target kerja line perakitan.', hr: 'Bapak Hendra (Senior HRD Otomotif)' },
              { id: 'qc', title: 'Quality Control (QC)', desc: 'Fokus ketelitian, ketegasan reject produk NG, alat ukur presisi, dan komitmen zero defect.', hr: 'Ibu Ratna (QA & QC Manager)' },
              { id: 'maintenance', title: 'Maintenance & Teknisi', desc: 'Fokus kelistrikan dasar, pencegahan breakdown mesin, dan K3 LOTO.', hr: 'Bapak Suryo (Chief Engineering)' },
              { id: 'logistics', title: 'Logistik & Gudang', desc: 'Fokus sistem FIFO, stock opname akurat, dan barcode scanning barang.', hr: 'Bapak Anton (Warehouse Lead)' }
            ].map((role) => (
              <div
                key={role.id}
                onClick={() => {
                  sounds.playClick();
                  setTargetRole(role.id as TargetRole);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                  targetRole === role.id
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 shadow-md ring-2 ring-purple-500/20'
                    : isDark 
                      ? 'border-slate-800 hover:border-slate-700 bg-slate-800/40' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-xs sm:text-sm font-black">{role.title}</strong>
                  {targetRole === role.id && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{role.desc}</p>
                <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-900/50 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                  Interviewer: {role.hr}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Guidance Box */}
          <div className={`border rounded-2xl p-3.5 text-xs space-y-1.5 ${
            isDark ? 'bg-slate-800/50 border-slate-700/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <strong className="block font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Panduan Percakapan Langsung 2-Arah:</span>
            </strong>
            <div>1. Pastikan izin mikrofon browser aktif. AI HRD akan langsung menyapa dan mengajukan pertanyaan dengan suara.</div>
            <div>2. Setelah AI selesai berbicara, sistem otomatis mendengarkan jawaban suara Anda secara bergantian (hands-free).</div>
            <div>3. Setiap 1 sesi simulasi lengkap menggunakan 1 Kredit AI Interview.</div>
          </div>

          {/* Start Call CTA Button */}
          <button
            onClick={startInterviewSession}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
          >
            <PhoneCall className="w-5 h-5 fill-current animate-bounce" />
            <span>Mulai Panggilan Interview Langsung (1 Kredit)</span>
          </button>

        </div>
      )}

      {/* =================================================================== */}
      {/* 2. LIVE TWO-WAY VOICE CALL / INTERVIEW IN PROGRESS (NO JEDDA)      */}
      {/* =================================================================== */}
      {sessionState === 'interviewing' && currentQuestion && (
        <div className="space-y-3">
          
          {/* Live Call Header Bar */}
          <div className={`border rounded-2xl p-3 sm:p-4 shadow-xs flex items-center justify-between transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Panggilan Aktif • {formatTime(callSeconds)}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Pertanyaan {currentQIndex + 1} dari {questionsList.length} ({targetRole.toUpperCase()})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => speakQuestion(currentQuestion.question)}
                disabled={isAiSpeaking}
                className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isAiSpeaking
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
                title="Ulangi Suara Pertanyaan"
              >
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Ulangi Pertanyaan</span>
              </button>

              <button
                onClick={() => {
                  stopListeningToUser();
                  window.speechSynthesis.cancel();
                  setSessionState('idle');
                  sounds.playClick();
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 transition-all"
                title="Akhiri Panggilan"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>Akhiri</span>
              </button>
            </div>
          </div>

          {/* Main Conversational Stage (Call Interface Screen) */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-indigo-900/60 relative overflow-hidden flex flex-col items-center justify-between min-h-[380px] sm:min-h-[440px]">
            
            {/* Ambient Background Aura Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Persona Avatar & Ripple Visualizer */}
            <div className="flex flex-col items-center text-center space-y-3 relative z-10 pt-2">
              
              <div className="relative">
                {/* Rippling circles when AI is talking */}
                {isAiSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-purple-500/30 animate-ping" />
                    <div className="absolute -inset-3 rounded-full bg-indigo-500/20 animate-pulse" />
                  </>
                )}

                {/* Rippling circles when user is speaking */}
                {isRecording && (
                  <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-pulse" />
                )}

                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-white shadow-2xl border-4 transition-all ${
                  isAiSpeaking 
                    ? 'border-purple-400 bg-gradient-to-tr from-purple-600 to-indigo-600 scale-105' 
                    : isRecording 
                      ? 'border-emerald-400 bg-gradient-to-tr from-emerald-600 to-teal-600 scale-105' 
                      : 'border-slate-700 bg-slate-800'
                }`}>
                  <Bot className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {currentQuestion.interviewerPersona}
                </h3>
                <span className="text-[11px] text-purple-300 font-semibold bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800 mt-1 inline-block">
                  Pewawancara AI Rekrutmen Industri
                </span>
              </div>

              {/* Dynamic Conversational Status Pill */}
              <div className="pt-1">
                {isAiSpeaking && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold animate-pulse">
                    <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>🗣️ HRD sedang berbicara...</span>
                  </div>
                )}

                {conversationStatus === 'user_listening' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" />
                    <span>🎙️ Giliran Anda berbicara (Mendengarkan)...</span>
                  </div>
                )}

                {conversationStatus === 'evaluating' && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    <span>🧠 AI sedang menganalisa jawaban Anda...</span>
                  </div>
                )}
              </div>

            </div>

            {/* Live Spoken Captions & Subtitles Box */}
            <div className="w-full max-w-xl bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 my-3 relative z-10 text-center space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                {isAiSpeaking ? 'Pertanyaan HRD:' : 'Transkrip Suara Anda:'}
              </span>
              
              <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed italic min-h-[3rem] flex items-center justify-center">
                {isAiSpeaking 
                  ? `"${currentQuestion.question}"` 
                  : userInputText.trim() 
                    ? `"${userInputText}"` 
                    : 'Silakan berbicara langsung melalui mikrofon perangkat Anda...'}
              </p>
            </div>

            {/* Mic Permission Blocked / Overlay Guidance Banner */}
            {micPermissionBlocked && (
              <div className="w-full max-w-xl bg-amber-500/20 border border-amber-500/60 text-amber-200 text-xs p-3.5 rounded-2xl space-y-1.5 text-left mb-3 relative z-10 animate-in fade-in">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-300 text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Izin Mikrofon Terhalang Keamanan HP (Overlay Terdeteksi)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-100">
                  Sistem Android memblokir dialog izin jika ada balon chat (Messenger/WA) atau tombol melayang.
                </p>
                <div className="text-[11px] font-medium text-amber-200 space-y-0.5 pt-1 border-t border-amber-500/30">
                  <div>👉 <strong>Solusi Cepat:</strong> Ketuk ikon gembok di sebelah URL <code>siapkerja.buatdigital.id</code> &gt; <strong>Izin</strong> &gt; pilih <strong>Izinkan Mikrofon</strong>.</div>
                  <div>👉 Atau tutup balon chat / floating app yang sedang aktif di HP Anda.</div>
                </div>
              </div>
            )}

            {/* Bottom Call Action Controls */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 relative z-10">
              
              {/* Primary Action Button */}
              {conversationStatus === 'user_listening' && (
                <button
                  onClick={() => autoCommitLiveAnswer()}
                  disabled={!userInputText.trim()}
                  className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Selesai Bicara (Lanjut)</span>
                </button>
              )}

              {/* Manual Mic Toggle if user wants to toggle recording */}
              {interactionMode === 'manual' && (
                <div className="w-full space-y-2">
                  <textarea
                    rows={3}
                    value={userInputText}
                    onChange={(e) => setUserInputText(e.target.value)}
                    placeholder="Atau ketik jawaban Anda di sini jika tidak menggunakan mikrofon..."
                    className="w-full text-xs p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-400 outline-none focus:border-purple-500"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => autoCommitLiveAnswer()}
                      disabled={!userInputText.trim()}
                      className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Jawaban</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 3. EVALUATION REPORT & PREDICTED PROBABILITY SCREEN                 */}
      {/* =================================================================== */}
      {sessionState === 'evaluated' && (
        <div className="space-y-4">
          
          {/* Grand Score Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-5 sm:p-8 shadow-xl text-center relative overflow-hidden border border-purple-900/60">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950 flex items-center justify-center mx-auto mb-2 shadow-lg font-black text-xl">
              {totalProbability}%
            </div>
            
            <span className="text-[11px] uppercase tracking-widest text-purple-300 font-bold">
              Hasil Evaluasi AI Interview
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Probabilitas Kelulusan Interview: {totalProbability}%
            </h2>
            <p className="text-xs text-purple-200 mt-1 max-w-md mx-auto leading-relaxed">
              {totalProbability >= 80 
                ? '🌟 Peluang Sangat Tinggi! Pola jawaban dan pemahaman SOP Anda sangat memuaskan standar perekrut pabrik.' 
                : '💡 Potensi Baik. Pelajari catatan evaluasi dan contoh jawaban rekomendasi di bawah untuk meningkatkan skor kelulusan.'}
            </p>

            {/* 4 Pillars Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-5 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">1. Relevansi STAR</span>
                <div className="text-lg font-black text-amber-300 mt-0.5">{avgRelevance}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">2. Artikulasi</span>
                <div className="text-lg font-black text-sky-300 mt-0.5">{avgArticulation}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">3. Sikap & Etika</span>
                <div className="text-lg font-black text-emerald-300 mt-0.5">{avgEtiquette}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-2.5 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">4. Kesesuaian Role</span>
                <div className="text-lg font-black text-purple-300 mt-0.5">{avgJobFit}%</div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Detail Transkrip & Masukan per Pertanyaan:
            </h3>

            {sessionResponses.map((res, i) => (
              <div 
                key={i} 
                className={`border rounded-2xl p-4 shadow-xs space-y-2.5 transition-colors ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                    Pertanyaan #{i + 1}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                    Skor: {res.rubric.totalAcceptanceProbability}%
                  </span>
                </div>

                <div className="text-xs font-extrabold leading-snug">
                  HRD: "{res.question.question}"
                </div>

                <div className={`p-3 rounded-xl border text-xs italic leading-relaxed ${
                  isDark ? 'bg-slate-800/60 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <strong>Jawaban Anda:</strong> "{res.userAnswer}"
                </div>

                {/* Feedback Box */}
                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3 text-xs space-y-2">
                  <div>
                    <strong className="text-amber-900 dark:text-amber-200 block font-bold">💡 Saran Perbaikan Jawaban:</strong>
                    <p className="text-amber-950 dark:text-amber-100">{res.rubric.actionableFeedback}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-800 dark:text-emerald-300 block font-bold">✨ Contoh Jawaban Ideal:</strong>
                    <p className="text-emerald-950 dark:text-emerald-100 bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
                      "{res.rubric.idealAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setSessionState('idle');
            }}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Lakukan Simulasi Interview Baru</span>
          </button>

        </div>
      )}

      {/* =================================================================== */}
      {/* 4. TOP UP KREDIT / TOKEN MODAL                                      */}
      {/* =================================================================== */}
      {isTopUpModalOpen && (
        <div 
          onClick={() => setIsTopUpModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl border shadow-2xl p-5 sm:p-6 relative my-auto overflow-hidden cursor-default transition-colors ${
              isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Top Up Kredit AI Interview</h3>
                  <span className="text-[10px] text-slate-400 block">Saldo Saat Ini: {tokenBalance} Sesi</span>
                </div>
              </div>

              <button
                onClick={() => setIsTopUpModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Success alert notice */}
            {topUpSuccessNotice && (
              <div className="mt-3 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold animate-in fade-in">
                {topUpSuccessNotice}
              </div>
            )}

            {/* Package Choices */}
            <div className="py-4 space-y-2.5">
              
              {/* Package 1 */}
              <div className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-black">1 Sesi Simulasi AI</strong>
                    <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-bold">Starter</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">1x Wawancara Lengkap + Skor Evaluasi</span>
                  <div className="text-xs font-extrabold text-amber-500 mt-1">Rp 10.000</div>
                </div>

                <button
                  onClick={() => handleTopUpTokens(1, 'Paket Starter 1 Sesi')}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                >
                  Pilih
                </button>
              </div>

              {/* Package 2 */}
              <div className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between relative overflow-hidden ${
                isDark ? 'bg-purple-950/30 border-purple-600/80' : 'bg-purple-50/60 border-purple-500'
              }`}>
                <div className="absolute -right-6 -top-6 w-16 h-16 bg-purple-500/10 rounded-full blur-md" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-black">3 Sesi Simulasi AI</strong>
                    <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black">Hemat 17%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">3x Sesi Latihan Wawancara + Tips Jawaban</span>
                  <div className="text-xs font-extrabold text-amber-500 mt-1">Rp 25.000</div>
                </div>

                <button
                  onClick={() => handleTopUpTokens(3, 'Paket Pro 3 Sesi')}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs rounded-xl shadow-xs transition-all"
                >
                  Pilih
                </button>
              </div>

              {/* Package 3 */}
              <div className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between relative overflow-hidden ${
                isDark ? 'bg-amber-950/20 border-amber-500/80' : 'bg-amber-50/60 border-amber-500'
              }`}>
                <div>
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-black">10 Sesi AI VIP</strong>
                    <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded-full font-black">Paling Populer</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Latihan intensif hingga lolos interview</span>
                  <div className="text-xs font-extrabold text-amber-500 mt-1">Rp 50.000 <span className="text-[10px] text-slate-400 line-through">Rp 100.000</span></div>
                </div>

                <button
                  onClick={() => handleTopUpTokens(10, 'Paket VIP 10 Sesi')}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all"
                >
                  Pilih
                </button>
              </div>

            </div>

            {/* WA Support Info */}
            <div className={`p-3 rounded-xl border text-[11px] text-slate-400 text-center ${
              isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            }`}>
              Memerlukan bantuan pembayaran manual atau voucher sekolah? Hubungi Admin via WhatsApp.
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
