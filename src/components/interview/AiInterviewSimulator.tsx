import React, { useState, useEffect, useRef } from 'react';
import { TargetRole, InterviewRubric } from '../../types';
import { 
  interviewQuestionsBank, 
  recruiterPersonas,
  RecruiterPersonaInfo,
  generateAdaptiveFollowUp,
  evaluateInterviewSessionWithAi,
  InterviewQuestionItem 
} from '../../data/interview-data';
import { sounds } from '../../utils/sound-effects';
import { 
  Mic, 
  MicOff, 
  Volume2, 
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
  Coins,
  CreditCard,
  PhoneCall,
  PhoneOff,
  Radio,
  ChevronRight,
  X,
  Flame,
  Check,
  Clock,
  Subtitles,
  VolumeX,
  Send,
  FileText,
  History,
  ArrowLeft,
  Calendar,
  Trash2,
  Keyboard
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

interface TranscriptTurn {
  id: string;
  speaker: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export interface SavedInterviewSession {
  id: string;
  completedAt: string;
  targetRole: TargetRole;
  recruiterPersona: string;
  score: number;
  totalQuestions: number;
  evaluation: any;
  transcript?: TranscriptTurn[];
}


export const AiInterviewSimulator: React.FC<AiInterviewSimulatorProps> = ({
  targetRole,
  setTargetRole
}) => {
  const { isDark } = useTheme();
  const activeUser = getActiveSession();

  // Recruiter Persona for chosen target role
  const persona: RecruiterPersonaInfo = recruiterPersonas[targetRole] || recruiterPersonas.operator;

  // Session & Flow States
  const [sessionState, setSessionState] = useState<'idle' | 'interviewing' | 'evaluated'>('idle');
  const [turnCount, setTurnCount] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isSubtitlesVisible, setIsSubtitlesVisible] = useState<boolean>(true);
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const [conversationStatus, setConversationStatus] = useState<'ai_talking' | 'user_listening' | 'evaluating' | 'idle'>('idle');
  
  // Call Timer
  const [callSeconds, setCallSeconds] = useState<number>(0);

  // Full Dialogue Transcript Stream
  const [transcriptHistory, setTranscriptHistory] = useState<TranscriptTurn[]>([]);
  const [latestAiDialogue, setLatestAiDialogue] = useState<string>('');

  // Tokens / Credit System State
  const [tokenBalance, setTokenBalance] = useState<number>(() => getUserInterviewTokens());
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState<boolean>(false);
  const [selectedTopUpPackage, setSelectedTopUpPackage] = useState<number | null>(null);
  const [topUpSuccessNotice, setTopUpSuccessNotice] = useState<string | null>(null);
  const [micPermissionBlocked, setMicPermissionBlocked] = useState<boolean>(false);

  // Evaluation Results
  const [aiEvaluation, setAiEvaluation] = useState<{
    totalAcceptanceProbability: number;
    relevanceScore: number;
    articulationScore: number;
    etiquetteScore: number;
    jobFitScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    actionableFeedback: string;
    isAiEvaluated: boolean;
  } | null>(null);
  const [isEvaluatingPostCall, setIsEvaluatingPostCall] = useState<boolean>(false);

  // Idle Navigation Tab: Setup vs History
  const [activeSetupTab, setActiveSetupTab] = useState<'setup' | 'history'>('setup');
  const [interviewSessions, setInterviewSessions] = useState<SavedInterviewSession[]>([]);
  const [reviewingSessionMeta, setReviewingSessionMeta] = useState<SavedInterviewSession | null>(null);

  // Helper: Retrieve all stored interview sessions across activeUser testHistory & local storage
  const getStoredInterviewSessions = (): SavedInterviewSession[] => {
    const sessions: SavedInterviewSession[] = [];
    const user = getActiveSession();
    if (user && Array.isArray(user.testHistory)) {
      user.testHistory
        .filter(rec => (rec.testType === 'interview' || rec.testName?.toLowerCase().includes('voice call') || rec.testName?.toLowerCase().includes('interview')) && rec.details)
        .forEach(rec => {
          sessions.push({
            id: rec.id,
            completedAt: rec.completedAt,
            targetRole: (rec.details?.targetRole || targetRole || 'operator') as TargetRole,
            recruiterPersona: rec.details?.recruiterPersona || rec.testName?.replace('AI Voice Call — ', '') || 'Bapak Hendra',
            score: rec.score,
            totalQuestions: rec.totalQuestions || 5,
            evaluation: rec.details?.evaluation,
            transcript: rec.details?.transcript || []
          });
        });
    }

    try {
      const raw = localStorage.getItem('siapkerja_interview_sessions');
      if (raw) {
        const localSessions: SavedInterviewSession[] = JSON.parse(raw);
        if (Array.isArray(localSessions)) {
          localSessions.forEach(ls => {
            if (!sessions.some(s => s.id === ls.id)) {
              sessions.push(ls);
            }
          });
        }
      }
    } catch (e) {}

    return sessions.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  };

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const recognitionActiveRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null); // For server TTS playback & interrupt
  const audioContextRef = useRef<AudioContext | null>(null); // Web Audio API for volume boost

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

  // Synchronize Interview History on Mount & Updates
  useEffect(() => {
    setInterviewSessions(getStoredInterviewSessions());
    const handleHistorySync = () => {
      setInterviewSessions(getStoredInterviewSessions());
    };
    window.addEventListener('siapkerja_user_updated', handleHistorySync);
    return () => {
      window.removeEventListener('siapkerja_user_updated', handleHistorySync);
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

  // Speech Recognition Initialization
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
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          const fullText = (finalTranscript + interimTranscript).trim();
          if (fullText) {
            setUserInputText(fullText);

            // Reset silence detector
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            // Relaxed natural pause: 3000ms (3.0 seconds) and at least 4 words so user doesn't get cut off mid-thought!
            if (fullText.split(/\s+/).length >= 4) {
              silenceTimerRef.current = setTimeout(() => {
                if (recognitionActiveRef.current) {
                  handleCommitCandidateAnswer(fullText);
                }
              }, 3000);
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

  // ─── Interrupt AI speech (user taps avatar while AI is talking) ──────────
  const interruptAiSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();
    setIsAiSpeaking(false);
    startListeningToUser();
  };

  // ─── Web Speech API fallback TTS (last resort) ────────────────────────────
  const speakWithWebSpeech = (text: string, onDoneCallback?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onDoneCallback) onDoneCallback();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    const isMale = persona.gender === 'male';
    utterance.pitch = isMale ? 0.75 : 1.05;
    utterance.rate = isMale ? 0.92 : 0.97;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => { setIsAiSpeaking(true); setConversationStatus('ai_talking'); };
    utterance.onend = () => {
      setIsAiSpeaking(false);
      if (onDoneCallback) onDoneCallback(); else startListeningToUser();
    };
    utterance.onerror = () => {
      setIsAiSpeaking(false);
      if (onDoneCallback) onDoneCallback(); else startListeningToUser();
    };
    window.speechSynthesis.speak(utterance);
  };

  // ─── Primary TTS: Server-side Neural Voice (OpenAI / TikTok / Edge) ────
  const speakText = async (text: string, onDoneCallback?: () => void) => {
    if (!text.trim()) {
      if (onDoneCallback) onDoneCallback();
      return;
    }

    // Stop mic recognition immediately before playing so mobile devices switch away from in-call earpiece to loud loudspeaker
    stopListeningToUser();

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    window.speechSynthesis?.cancel();

    setIsAiSpeaking(true);
    setConversationStatus('ai_talking');

    try {
      const response = await fetch('/api/interview/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: persona.ttsVoice || 'onyx',
          speed: persona.gender === 'male' ? 0.92 : 0.98
        }),
        signal: AbortSignal.timeout(15000) // 15s timeout
      });

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 0) {
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.volume = 1.0;
          audioRef.current = audio;

          // Hardware volume booster using Web Audio API GainNode (85% boost for loud speaker output)
          try {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
              if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new AudioCtx();
              }
              const ctx = audioContextRef.current;
              if (ctx.state === 'suspended') {
                ctx.resume();
              }
              const source = ctx.createMediaElementSource(audio);
              const gainNode = ctx.createGain();
              gainNode.gain.value = 1.85; // 85% louder volume boost
              source.connect(gainNode);
              gainNode.connect(ctx.destination);
            }
          } catch (audioCtxErr) {
            console.log('Audio boost note:', audioCtxErr);
          }

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            setIsAiSpeaking(false);
            if (onDoneCallback) onDoneCallback(); else startListeningToUser();
          };

          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            setIsAiSpeaking(false);
            // Fallback to Web Speech on audio error
            speakWithWebSpeech(text, onDoneCallback);
          };

          audio.play().catch(() => {
            // Autoplay blocked or error — use Web Speech fallback
            setIsAiSpeaking(false);
            speakWithWebSpeech(text, onDoneCallback);
          });
          return; // Success path
        }
      }

      // Server returned non-ok or empty → fallback
      console.warn('[TTS] Server TTS unavailable, using Web Speech fallback');
      setIsAiSpeaking(false);
      speakWithWebSpeech(text, onDoneCallback);

    } catch (err) {
      console.warn('[TTS] Server TTS error:', err);
      setIsAiSpeaking(false);
      speakWithWebSpeech(text, onDoneCallback);
    }
  };

  // Start listening to user voice automatically
  const startListeningToUser = () => {
    if (isMicMuted) {
      setConversationStatus('user_listening');
      return;
    }
    if (!recognitionRef.current) {
      setConversationStatus('user_listening');
      return;
    }
    setConversationStatus('user_listening');
    setUserInputText('');
    try {
      if (!recognitionActiveRef.current) {
        recognitionRef.current.start();
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

  // Start interview call session
  const handleStartCall = () => {
    if (tokenBalance <= 0) {
      sounds.playWrong();
      setIsTopUpModalOpen(true);
      return;
    }

    const success = deductUserInterviewToken();
    if (!success) {
      setIsTopUpModalOpen(true);
      return;
    }
    setTokenBalance(getUserInterviewTokens());

    sounds.playBeep();
    setSessionState('interviewing');
    setTurnCount(1);
    setUserInputText('');
    setTranscriptHistory([]);
    setAiEvaluation(null);

    const initialGreeting = persona.greeting;
    setLatestAiDialogue(initialGreeting);

    const initialTurn: TranscriptTurn = {
      id: `turn-ai-0`,
      speaker: persona.name,
      role: 'assistant',
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setTranscriptHistory([initialTurn]);

    setTimeout(() => {
      speakText(initialGreeting);
    }, 600);
  };

  // Candidate finished speaking turn -> submit to AI HRD
  const handleCommitCandidateAnswer = async (textToSubmit?: string) => {
    const answer = (textToSubmit || userInputText).trim();
    if (!answer) return;

    stopListeningToUser();
    sounds.playCorrect();
    setConversationStatus('evaluating');

    const candidateTurn: TranscriptTurn = {
      id: `turn-cand-${turnCount}`,
      speaker: activeUser?.name || 'Kandidat (Anda)',
      role: 'user',
      text: answer,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedTranscript = [...transcriptHistory, candidateTurn];
    setTranscriptHistory(updatedTranscript);
    setUserInputText('');

    // Comprehensive interview session: auto-wrap up only after extensive exploration (turn 11+)
    // Candidate can also end anytime with the red button
    if (turnCount >= 11) {
      handleEndCallAndEvaluate(updatedTranscript);
      return;
    }

    // Call dynamic follow-up AI generator with multi-turn history
    const baseBank = interviewQuestionsBank[targetRole] || interviewQuestionsBank.operator;
    const baseQuestion = baseBank[turnCount] || baseBank[baseBank.length - 1];

    // Pass conversation history so AI has full context and does NOT repeat questions or phrases
    const historyForAi = updatedTranscript.map(t => ({
      role: (t.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: t.text
    }));

    const followUp = await generateAdaptiveFollowUp(answer, targetRole, turnCount, baseQuestion, historyForAi);
    const aiSpeech = followUp.fullSpokenDialogue;

    setLatestAiDialogue(aiSpeech);
    setTurnCount(prev => prev + 1);

    const aiNextTurn: TranscriptTurn = {
      id: `turn-ai-${turnCount}`,
      speaker: persona.name,
      role: 'assistant',
      text: aiSpeech,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setTranscriptHistory([...updatedTranscript, aiNextTurn]);

    setTimeout(() => {
      speakText(aiSpeech);
    }, 300);
  };

  // Gracefully end call and compute AI Evaluation
  const handleEndCallAndEvaluate = async (transcriptToEvaluate?: TranscriptTurn[]) => {
    stopListeningToUser();
    window.speechSynthesis.cancel();
    setIsAiSpeaking(false);
    setIsEvaluatingPostCall(true);

    const currentTranscript = transcriptToEvaluate || transcriptHistory;

    // Speak natural closing remark
    speakText(persona.closing, async () => {
      // Analyze entire transcript with Sumopod AI
      const evalResult = await evaluateInterviewSessionWithAi(
        activeUser?.name || 'Kandidat',
        targetRole,
        persona.name,
        currentTranscript.map(t => ({ speaker: t.speaker, text: t.text }))
      );

      setAiEvaluation(evalResult);
      setIsEvaluatingPostCall(false);
      setReviewingSessionMeta(null);
      setSessionState('evaluated');
      setConversationStatus('idle');

      sounds.playCelebration();
      confetti({ particleCount: 100, spread: 80 });

      // Save to local archive
      const newSession: SavedInterviewSession = {
        id: 'iv_' + Date.now(),
        completedAt: new Date().toISOString(),
        targetRole,
        recruiterPersona: persona.name,
        score: evalResult.totalAcceptanceProbability,
        totalQuestions: currentTranscript.filter(t => t.role === 'user').length,
        evaluation: evalResult,
        transcript: currentTranscript
      };

      try {
        const raw = localStorage.getItem('siapkerja_interview_sessions');
        const existing: SavedInterviewSession[] = raw ? JSON.parse(raw) : [];
        const updated = [newSession, ...existing.filter(s => s.id !== newSession.id)];
        localStorage.setItem('siapkerja_interview_sessions', JSON.stringify(updated.slice(0, 50)));
        setInterviewSessions(getStoredInterviewSessions());
      } catch (e) {
        console.error('Failed to save session locally', e);
      }

      // Save score & history to User Database
      if (activeUser) {
        updateActiveUserScore({ interviewScore: evalResult.totalAcceptanceProbability });
        recordUserTestResult({
          testType: 'interview',
          testName: `AI Voice Call — ${persona.name}`,
          score: evalResult.totalAcceptanceProbability,
          totalQuestions: currentTranscript.filter(t => t.role === 'user').length,
          correctAnswers: evalResult.totalAcceptanceProbability >= 70 ? 1 : 0,
          details: {
            targetRole,
            recruiterPersona: persona.name,
            evaluation: evalResult,
            transcript: currentTranscript
          }
        });
      }
    });
  };

  // Open historical session review
  const handleOpenHistorySession = (session: SavedInterviewSession) => {
    sounds.playClick();
    setReviewingSessionMeta(session);
    setAiEvaluation(session.evaluation);
    setTranscriptHistory(session.transcript || []);
    setSessionState('evaluated');
  };

  // Delete historical session
  const handleDeleteHistorySession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem('siapkerja_interview_sessions');
      if (raw) {
        const existing: SavedInterviewSession[] = JSON.parse(raw);
        const updated = existing.filter(s => s.id !== sessionId);
        localStorage.setItem('siapkerja_interview_sessions', JSON.stringify(updated));
      }
    } catch (err) {}
    setInterviewSessions(prev => prev.filter(s => s.id !== sessionId));
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

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-3 select-none transition-colors ${
      isDark ? 'text-white' : 'text-slate-900'
    }`}>
      
      {/* Top Banner & Token Balance Bar */}
      <div className={`border rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-purple-900/60' 
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white border-purple-800'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                Fitur Unggulan Premium
              </span>
              <span className="text-xs font-semibold text-purple-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live Voice Call AI HRD (Mode ChatGPT Voice)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Simulasi Panggilan Wawancara HRD Industri
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
              Panggilan suara langsung dua arah bebas jeda dengan Avatar HRD pabrik untuk menguji kesiapan mental & teknis kerja Anda.
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
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Top Up</span>
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 1. IDLE / PRE-INTERVIEW SETUP STATE                                */}
      {/* =================================================================== */}
      {sessionState === 'idle' && (
        <div className={`border rounded-3xl p-5 sm:p-7 shadow-xs space-y-6 transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Segmented Tab: Mulai Panggilan Baru vs Riwayat Sesi */}
          <div className={`p-1.5 rounded-2xl flex items-center gap-1.5 border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSetupTab('setup');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                activeSetupTab === 'setup'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Mulai Panggilan Baru</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSetupTab('history');
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
                activeSetupTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Riwayat Sesi ({interviewSessions.length})</span>
            </button>
          </div>

          {/* TAB 1: SETUP INTERVIEW */}
          {activeSetupTab === 'setup' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Target Role Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-3">
                  Pilih Target Posisi Wawancara:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'operator', title: 'Operator Produksi', subtitle: 'Line Perakitan & Mesin', icon: '⚙️' },
                    { id: 'qc', title: 'Quality Control (QC)', subtitle: 'Inspeksi Mutu & Presisi', icon: '🔍' },
                    { id: 'maintenance', title: 'Maintenance & Teknisi', subtitle: 'Perawatan Mesin & K3', icon: '🔧' },
                    { id: 'logistics', title: 'Warehouse / Logistik', subtitle: 'Gudang, FIFO & Stok', icon: '📦' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        sounds.playClick();
                        setTargetRole(r.id as TargetRole);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        targetRole === r.id
                          ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20 dark:bg-purple-950/40'
                          : isDark
                            ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-2xl mb-1.5">{r.icon}</div>
                      <h4 className="font-black text-xs text-slate-800 dark:text-slate-100">{r.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{r.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Recruiter Card Preview */}
              <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-purple-50/70 border-purple-200'
              }`}>
                <div className="relative">
                  <img
                    src={persona.avatarUrl}
                    alt={persona.name}
                    className="w-20 h-20 rounded-full object-cover border-3 border-purple-500 shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  </span>
                </div>

                <div className="text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">{persona.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                      AI Recruiter
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-300">{persona.roleTitle}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{persona.companyContext}</p>
                </div>
              </div>

              {/* Quick Guidance Box */}
              <div className={`border rounded-2xl p-3.5 text-xs space-y-1.5 ${
                isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <strong className="block font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Panduan Panggilan Suara (Hands-Free):</span>
                </strong>
                <div>1. AI HRD akan langsung menyapa Anda lewat audio suara saat panggilan tersambung.</div>
                <div>2. Bicaralah secara alami melalui mikrofon HP/laptop Anda. Sistem otomatis mendeteksi ketika Anda selesai berbicara.</div>
                <div>3. Percakapan mengalir santai layaknya panggilan telepon asli. Klik tombol merah di akhir untuk menerima laporan evaluasi.</div>
              </div>

              {/* Start Call CTA Button */}
              <button
                onClick={handleStartCall}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-98"
              >
                <PhoneCall className="w-5 h-5 fill-current animate-bounce" />
                <span>Mulai Panggilan Voice Call dengan {persona.name} (1 Kredit)</span>
              </button>
            </div>
          )}

          {/* TAB 2: RIWAYAT SESI INTERVIEW */}
          {activeSetupTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {interviewSessions.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                    <History className="w-8 h-8 opacity-70" />
                  </div>
                  <div className="space-y-1 max-w-sm mx-auto">
                    <h3 className="font-black text-sm text-slate-800 dark:text-slate-100">
                      Belum Ada Riwayat Interview
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Selesaikan simulasi wawancara suara pertamamu untuk melihat analisis skor, masukan evaluasi HRD, dan rekaman transkrip lengkap di sini!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playClick();
                      setActiveSetupTab('setup');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Mulai Panggilan Interview Pertama</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span>Total <strong>{interviewSessions.length}</strong> sesi latihan wawancara tersimpan:</span>
                    <span className="text-[11px]">Klik kartu untuk meninjau skor & transkrip</span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {interviewSessions.map((session) => {
                      const sessionRolePersona = recruiterPersonas[session.targetRole] || recruiterPersonas.operator;
                      const dateObj = new Date(session.completedAt);
                      const formattedDate = isNaN(dateObj.getTime())
                        ? session.completedAt
                        : dateObj.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                      const isPassed = session.score >= 70;

                      return (
                        <div
                          key={session.id}
                          onClick={() => handleOpenHistorySession(session)}
                          className={`border rounded-2xl p-4 transition-all cursor-pointer hover:shadow-md ${
                            isDark
                              ? 'bg-slate-800/60 border-slate-700/70 hover:border-purple-500/60 hover:bg-slate-800'
                              : 'bg-slate-50/80 border-slate-200 hover:border-purple-400 hover:bg-white'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={sessionRolePersona.avatarUrl}
                                alt={session.recruiterPersona}
                                className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/60 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                                    {session.recruiterPersona}
                                  </h4>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                                    {sessionRolePersona.roleTitle}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formattedDate}
                                  </span>
                                  <span>•</span>
                                  <span>{session.totalQuestions || session.transcript?.filter(t => t.role === 'user').length || 5} Pertanyaan</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                              <div className="text-right">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${
                                  isPassed
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                }`}>
                                  <Award className="w-3.5 h-3.5" />
                                  <span>Skor: {session.score}%</span>
                                </span>
                                <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                                  {isPassed ? '✅ Probabilitas Lolos Tinggi' : '⚠️ Perlu Penguatan Jawaban'}
                                </span>
                              </div>

                              <button
                                onClick={(e) => handleDeleteHistorySession(session.id, e)}
                                title="Hapus riwayat sesi ini"
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Evaluation Summary snippet */}
                          {session.evaluation?.summary && (
                            <div className={`mt-3 pt-3 border-t text-xs line-clamp-2 leading-relaxed ${
                              isDark ? 'border-slate-700/50 text-slate-300' : 'border-slate-200 text-slate-600'
                            }`}>
                              "{session.evaluation.summary}"
                            </div>
                          )}

                          {/* 4 pillar scores preview if present */}
                          {session.evaluation?.relevanceScore && (
                            <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2 text-[10px] text-center border-t border-dashed border-slate-200 dark:border-slate-700/50">
                              <div>
                                <span className="text-slate-400 block">STAR</span>
                                <strong className="text-purple-600 dark:text-purple-400">{session.evaluation.relevanceScore}%</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Artikulasi</span>
                                <strong className="text-purple-600 dark:text-purple-400">{session.evaluation.articulationScore}%</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Etika</span>
                                <strong className="text-purple-600 dark:text-purple-400">{session.evaluation.etiquetteScore}%</strong>
                              </div>
                              <div>
                                <span className="text-slate-400 block">Role Fit</span>
                                <strong className="text-purple-600 dark:text-purple-400">{session.evaluation.jobFitScore}%</strong>
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-end text-xs font-bold text-purple-600 dark:text-purple-400 gap-1">
                            <span>Buka Detail Evaluasi & Transkrip</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      )}

      {/* =================================================================== */}
      {/* 2. LIVE CHATGPT-STYLE VOICE CALL INTERFACE (FULL IMMERSIVE ROOM)    */}
      {/* =================================================================== */}
      {sessionState === 'interviewing' && (
        <div className="space-y-3 animate-in fade-in duration-300">
          
          {/* Live Top Call Status Bar */}
          <div className={`border rounded-2xl p-3 sm:p-4 shadow-xs flex items-center justify-between transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span>Panggilan Suara Langsung • {formatTime(callSeconds)}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                    Pertanyaan #{turnCount}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {persona.name} — {persona.roleTitle}
                </span>
              </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSubtitlesVisible(!isSubtitlesVisible)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                  isSubtitlesVisible
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Tampilkan/Sembunyikan Teks Subtitle"
              >
                <Subtitles className="w-4 h-4" />
                <span className="hidden sm:inline">{isSubtitlesVisible ? 'Teks ON' : 'Teks OFF'}</span>
              </button>

              <button
                onClick={() => speakText(latestAiDialogue)}
                disabled={isAiSpeaking}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                title="Ulangi Suara HRD"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main ChatGPT-style Immersive Stage with HRD Animated Avatar */}
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-indigo-900/60 relative overflow-hidden flex flex-col items-center justify-between min-h-[440px] sm:min-h-[500px]">
            
            {/* Ambient Aura Background */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
              isAiSpeaking 
                ? 'bg-purple-600/30 scale-125' 
                : conversationStatus === 'user_listening' 
                  ? 'bg-emerald-500/25 scale-110' 
                  : 'bg-indigo-600/15'
            }`} />

            {/* Recruiter Identity & Stage Indicator */}
            <div className="text-center relative z-10 space-y-1">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {persona.name}
              </h2>
              <p className="text-xs text-purple-300 font-medium">{persona.roleTitle}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] text-purple-200 font-medium mt-1">
                <span>Tahap {turnCount <= 2 ? '1: Latar Belakang & PKL' : turnCount <= 4 ? '2: Keahlian Teknis & Mesin' : turnCount <= 6 ? '3: K3, 5S & Standar Presisi' : turnCount <= 8 ? '4: Ketahanan Fisik & 3 Shift' : turnCount <= 10 ? '5: Problem Solving & Kerjasama' : '6: Tanya Jawab Balik & Penutup'}</span>
              </div>
            </div>

            {/* Center Animated HRD Avatar with Acoustic Pulsing Ripples */}
            <div className="relative my-6 z-10 flex items-center justify-center">
              
              {/* Concentric Audio Ripples when AI is Speaking */}
              {isAiSpeaking && (
                <>
                  <div className="absolute -inset-12 rounded-full bg-purple-500/10 animate-ping opacity-50" />
                  <div className="absolute -inset-7 rounded-full bg-indigo-500/20 animate-pulse" />
                  <div className="absolute -inset-3 rounded-full bg-purple-400/25 animate-pulse" />
                </>
              )}

              {/* Concentric Audio Ripples when Candidate is Speaking */}
              {isRecording && !isAiSpeaking && (
                <>
                  <div className="absolute -inset-9 rounded-full bg-emerald-400/15 animate-ping opacity-60" />
                  <div className="absolute -inset-5 rounded-full bg-teal-500/25 animate-pulse" />
                </>
              )}

              {/* Avatar Image Frame — Tappable to Interrupt AI Speech */}
              <div
                onClick={isAiSpeaking ? interruptAiSpeech : undefined}
                className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 shadow-2xl transition-all duration-500 ${
                  isAiSpeaking
                    ? 'border-purple-400 ring-8 ring-purple-500/30 scale-105 cursor-pointer hover:scale-110 hover:ring-purple-400/60'
                    : isRecording
                      ? 'border-emerald-400 ring-8 ring-emerald-500/30 scale-105'
                      : 'border-slate-700'
                }`}
                title={isAiSpeaking ? `Tap untuk interupsi ${persona.name}` : undefined}
              >
                <img
                  src={persona.avatarUrl}
                  alt={persona.name}
                  className="w-full h-full object-cover"
                />
                {/* Interrupt overlay hint */}
                {isAiSpeaking && (
                  <div className="absolute inset-0 bg-purple-900/30 flex items-end justify-center pb-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[9px] text-white font-bold bg-purple-600/80 px-2 py-0.5 rounded-full">TAP = INTERUPSI</span>
                  </div>
                )}
              </div>

            </div>

            {/* Live Interactive Status Pill */}
            <div className="relative z-10 min-h-[2rem] flex items-center justify-center">
              {isAiSpeaking && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold">
                  {/* Animated speaking bars */}
                  <div className="flex items-end gap-0.5 h-4">
                    {[1, 2, 3, 2, 1].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 bg-purple-400 rounded-full animate-pulse"
                        style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                  <span>{persona.name} sedang berbicara...</span>
                  <span className="text-[9px] opacity-60 ml-1">• Tap avatar untuk interupsi</span>
                </div>
              )}

              {conversationStatus === 'user_listening' && !isAiSpeaking && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                  <Radio className="w-4 h-4 text-emerald-400 animate-ping" />
                  <span>Mendengarkan Anda... Silakan berbicara</span>
                </div>
              )}

              {conversationStatus === 'evaluating' && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  {/* Thinking dots animation */}
                  <div className="flex items-center gap-0.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                  <span>{persona.name} sedang memikirkan respons...</span>
                </div>
              )}
            </div>

            {/* Live Floating Dialogue Bubble / Subtitles */}
            {isSubtitlesVisible && (
              <div className="w-full max-w-xl bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 my-4 relative z-10 text-center space-y-1.5 animate-in fade-in">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  {isAiSpeaking ? `${persona.name}:` : conversationStatus === 'evaluating' ? 'Memproses...' : 'Suara Anda:'}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-100 leading-relaxed italic min-h-[2.5rem] flex items-center justify-center">
                  {isAiSpeaking 
                    ? `"${latestAiDialogue}"` 
                    : conversationStatus === 'evaluating'
                      ? '...'
                      : userInputText.trim() 
                        ? `"${userInputText}"` 
                        : 'Bicaralah langsung ke mikrofon, suara Anda akan tertangkap otomatis...'}
                </p>
              </div>
            )}

            {/* Keyboard Input Drawer (Optional for typing if in noisy room) */}
            {isKeyboardMode && (
              <div className="w-full max-w-xl bg-slate-900/90 border border-slate-700 rounded-2xl p-3 my-2 relative z-10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span>Ketik Jawaban Manual:</span>
                  <button onClick={() => setIsKeyboardMode(false)} className="text-slate-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInputText}
                    onChange={(e) => setUserInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && userInputText.trim()) {
                        handleCommitCandidateAnswer();
                      }
                    }}
                    placeholder="Ketik jawaban Anda lalu tekan Kirim..."
                    className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleCommitCandidateAnswer()}
                    disabled={!userInputText.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim</span>
                  </button>
                </div>
              </div>
            )}

            {/* Friendly guidance hint */}
            <div className="w-full max-w-md text-center pt-2 relative z-10">
              <p className="text-[11px] text-slate-400 font-medium">
                💡 Bicaralah dengan santai. Klik <span className="text-emerald-400 font-bold">✓ Selesai Bicara</span> jika sudah tuntas, atau tombol merah <span className="text-red-400 font-bold">📞</span> untuk akhiri sesi & lihat skor kapan saja.
              </p>
            </div>

            {/* Bottom In-Call Control Bar */}
            <div className="w-full max-w-md pt-3 flex items-center justify-around relative z-10 border-t border-white/10 mt-1">
              
              {/* Mic Mute / Unmute */}
              <button
                onClick={() => {
                  sounds.playClick();
                  if (isMicMuted) {
                    setIsMicMuted(false);
                    startListeningToUser();
                  } else {
                    setIsMicMuted(true);
                    stopListeningToUser();
                  }
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isMicMuted
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
                title={isMicMuted ? 'Nyalakan Mikrofon' : 'Mute Mikrofon'}
              >
                {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Selesai Bicara (Manual Commit Button) */}
              {conversationStatus === 'user_listening' && (
                <button
                  onClick={() => handleCommitCandidateAnswer()}
                  disabled={!userInputText.trim()}
                  className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-full shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all transform active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  <span>Selesai Bicara</span>
                </button>
              )}

              {/* Keyboard Mode Button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  setIsKeyboardMode(!isKeyboardMode);
                }}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center transition-all"
                title="Ketik Jawaban Manual"
              >
                <Keyboard className="w-5 h-5" />
              </button>

              {/* Red End Call Button */}
              <button
                onClick={() => handleEndCallAndEvaluate()}
                disabled={isEvaluatingPostCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/40 flex items-center justify-center transition-all transform active:scale-95"
                title="Akhiri Panggilan & Dapatkan Skor Evaluasi"
              >
                <PhoneOff className="w-6 h-6" />
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 3. POST-CALL EVALUATION & SCORECARD REPORT                         */}
      {/* =================================================================== */}
      {sessionState === 'evaluated' && aiEvaluation && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          {/* Historical Review Mode Banner */}
          {reviewingSessionMeta && (
            <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? 'bg-purple-950/40 border-purple-900/60' : 'bg-purple-50 border-purple-200'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setSessionState('idle');
                    setActiveSetupTab('history');
                  }}
                  className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Riwayat</span>
                </button>
                <div>
                  <div className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" />
                    <span>Meninjau Arsip Riwayat Sesi Interview</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                    Pewawancara: <strong className="text-slate-900 dark:text-white">{reviewingSessionMeta.recruiterPersona}</strong> • {
                      (() => {
                        const d = new Date(reviewingSessionMeta.completedAt);
                        return isNaN(d.getTime()) ? reviewingSessionMeta.completedAt : d.toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        });
                      })()
                    }
                  </div>
                </div>
              </div>

              <div className="text-right self-end sm:self-auto">
                <span className="text-xs font-black text-purple-600 dark:text-purple-300">
                  {reviewingSessionMeta.totalQuestions || transcriptHistory.filter(t => t.role === 'user').length || 5} Pertanyaan Tercatat
                </span>
              </div>
            </div>
          )}

          {/* Main Scorecard Header */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 text-center shadow-xl border border-indigo-900/60 relative overflow-hidden space-y-4">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>HASIL EVALUASI LIVE VOICE INTERVIEW</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 font-black text-3xl sm:text-4xl flex items-center justify-center shadow-2xl border-4 border-white/20 my-2">
                {aiEvaluation.totalAcceptanceProbability}%
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Probabilitas Kelulusan Interview: {aiEvaluation.totalAcceptanceProbability}%
              </h2>
              <p className="text-xs text-purple-200 mt-1 max-w-lg leading-relaxed">
                {aiEvaluation.summary}
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {[
                { title: '1. Relevansi STAR', score: aiEvaluation.relevanceScore },
                { title: '2. Artikulasi', score: aiEvaluation.articulationScore },
                { title: '3. Sikap & Etika', score: aiEvaluation.etiquetteScore },
                { title: '4. Kesesuaian Role', score: aiEvaluation.jobFitScore }
              ].map((p, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <span className="text-[10px] font-bold uppercase text-purple-300 block">{p.title}</span>
                  <span className="text-lg font-black text-amber-400 mt-1 block">{p.score}%</span>
                </div>
              ))}
            </div>

          </div>

          {/* Feedback & Improvement Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Strengths */}
            <div className={`border rounded-2xl p-4 space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase">
                <CheckCircle2 className="w-4 h-4" />
                <span>Kelebihan Jawaban Anda:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {aiEvaluation.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses & Actionable Feedback */}
            <div className={`border rounded-2xl p-4 space-y-2 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Saran Peningkatan dari HRD:</span>
              </h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {aiEvaluation.actionableFeedback}
              </p>
            </div>

          </div>

          {/* Full Conversation Transcript Box */}
          <div className={`border rounded-2xl p-4 space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Transkrip Rekaman Percakapan ({transcriptHistory.length} Ucapan)</span>
              </span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {transcriptHistory.map((turn) => (
                <div
                  key={turn.id}
                  className={`p-3 rounded-2xl text-xs space-y-1 ${
                    turn.role === 'assistant'
                      ? 'bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60'
                      : 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className={turn.role === 'assistant' ? 'text-purple-700 dark:text-purple-300' : 'text-slate-800 dark:text-slate-200'}>
                      {turn.speaker}
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">{turn.timestamp}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{turn.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={() => {
                sounds.playClick();
                setReviewingSessionMeta(null);
                setSessionState('idle');
                setActiveSetupTab('history');
              }}
              className={`flex-1 py-4 px-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 border transition-all ${
                isDark 
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <History className="w-4 h-4 text-purple-500" />
              <span>Lihat Semua Riwayat Sesi ({interviewSessions.length})</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setReviewingSessionMeta(null);
                setSessionState('idle');
                setActiveSetupTab('setup');
              }}
              className="flex-1 py-4 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Mulai Simulasi Wawancara Baru</span>
            </button>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 4. TOP UP TOKEN MODAL                                              */}
      {/* =================================================================== */}
      {isTopUpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-md border rounded-3xl p-5 sm:p-6 shadow-2xl relative space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <button
              onClick={() => {
                sounds.playClick();
                setIsTopUpModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-500 flex items-center justify-center mx-auto mb-2">
                <Coins className="w-6 h-6 fill-amber-400" />
              </div>
              <h3 className="text-lg font-black tracking-tight">Top Up Saldo Kredit AI Interview</h3>
              <p className="text-xs text-slate-400">
                Pilih paket sesi simulasi live interview dengan AI Recruiter industri manufaktur.
              </p>
            </div>

            {topUpSuccessNotice && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl font-bold text-center">
                {topUpSuccessNotice}
              </div>
            )}

            {/* Pricing Packages */}
            <div className="space-y-2.5">
              {[
                { id: 1, amount: 3, price: 'Rp 15.000', badge: 'Paket Basic', desc: '3 Sesi Panggilan Wawancara AI' },
                { id: 2, amount: 10, price: 'Rp 35.000', badge: 'Paling Populer ⭐', desc: '10 Sesi Panggilan + Evaluasi Lengkap', isPopular: true },
                { id: 3, amount: 30, price: 'Rp 75.000', badge: 'Paket Intensif Lolos', desc: '30 Sesi Panggilan + Rekaman Transkrip' }
              ].map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedTopUpPackage(pkg.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedTopUpPackage === pkg.id
                      ? 'border-amber-400 bg-amber-400/10 ring-2 ring-amber-400/20'
                      : isDark
                        ? 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black">{pkg.amount} Sesi Interview</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        pkg.isPopular ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {pkg.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">{pkg.desc}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-amber-500 block">{pkg.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTopUpTokens(pkg.amount, pkg.badge);
                      }}
                      className="mt-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] rounded-lg shadow-xs"
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
