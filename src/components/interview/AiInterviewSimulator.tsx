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
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiInterviewSimulatorProps {
  targetRole: TargetRole;
  setTargetRole: (role: TargetRole) => void;
}

export const AiInterviewSimulator: React.FC<AiInterviewSimulatorProps> = ({
  targetRole,
  setTargetRole
}) => {
  const [sessionState, setSessionState] = useState<'idle' | 'interviewing' | 'evaluated'>('idle');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userInputText, setUserInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState<boolean>(false);
  
  // Results
  const [sessionResponses, setSessionResponses] = useState<{
    question: InterviewQuestionItem;
    userAnswer: string;
    rubric: InterviewRubric;
  }[]>([]);

  const recognitionRef = useRef<any>(null);

  const questionsList = interviewQuestionsBank[targetRole] || interviewQuestionsBank.operator;
  const currentQuestion = questionsList[currentQIndex];

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'id-ID';

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserInputText(transcript);
        };

        recognition.onerror = (err: any) => {
          console.log('Speech recognition error:', err);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // AI Voice Synthesis (Text-to-Speech)
  const speakQuestion = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.95; // Natural pace
    utterance.pitch = 1.0;

    // Try finding Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    utterance.onstart = () => setIsAiSpeaking(true);
    utterance.onend = () => setIsAiSpeaking(false);
    utterance.onerror = () => setIsAiSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startInterview = () => {
    setSessionState('interviewing');
    setCurrentQIndex(0);
    setUserInputText('');
    setSessionResponses([]);
    sounds.playBeep();

    setTimeout(() => {
      speakQuestion(questionsList[0].question);
    }, 600);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Browser Anda belum mendukung input suara Web Speech API langsung. Anda dapat mengetikkan jawaban secara manual pada kotak teks.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setUserInputText('');
      recognitionRef.current.start();
      setIsRecording(true);
      sounds.playClick();
    }
  };

  const handleSubmitAnswer = () => {
    if (!userInputText.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const evaluation = evaluateUserInterviewResponse(userInputText, currentQuestion);

    const updatedResponses = [
      ...sessionResponses,
      {
        question: currentQuestion,
        userAnswer: userInputText,
        rubric: evaluation
      }
    ];
    setSessionResponses(updatedResponses);

    if (currentQIndex + 1 < questionsList.length) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setUserInputText('');
      setTimeout(() => {
        speakQuestion(questionsList[nextIdx].question);
      }, 500);
    } else {
      // Completed all questions
      setSessionState('evaluated');
      sounds.playCelebration();
      confetti({ particleCount: 80, spread: 70 });
    }
  };

  // Overall calculations
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                Fitur Premium Tahap 2
              </span>
              <span className="text-xs font-semibold text-purple-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Voice Interviewer Bahasa Indonesia
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Simulasi Interview AI HRD & User Pabrik
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
              Latihan wawancara suara dua arah secara langsung dengan AI Persona Perekrut Industri. Dilengkapi analisis akurat prediksi probabilitas diterima (%).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 text-center self-start sm:self-auto shrink-0">
            <span className="text-[10px] uppercase font-bold text-purple-200 block">Status Akses:</span>
            <span className="text-xs font-extrabold text-amber-300">Unlimited Demo</span>
          </div>
        </div>
      </div>

      {/* IDLE SCREEN / ROLE SELECTOR */}
      {sessionState === 'idle' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Pilih Target Posisi Pekerjaan Wawancara:
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[
              { id: 'operator', title: 'Operator Produksi', desc: 'Fokus kesiapan fisik, stamina shift malam, disiplin SOP, dan target kerja line perakitan.', hr: 'Bapak Hendra (HRD PT Astra)' },
              { id: 'qc', title: 'Quality Control (QC)', desc: 'Fokus ketelitian, ketegasan reject produk NG, alat ukur presisi, dan komitmen zero defect.', hr: 'Ibu Ratna (QA Manager PT Epson)' },
              { id: 'maintenance', title: 'Maintenance & Teknisi', desc: 'Fokus kelistrikan dasar, pencegahan breakdown mesin, dan K3 LOTO.', hr: 'Bapak Suryo (Chief Eng. Yamaha)' },
              { id: 'logistics', title: 'Logistik & Gudang', desc: 'Fokus sistem FIFO, stock opname akurat, dan barcode scanning barang.', hr: 'Bapak Anton (Warehouse Lead)' }
            ].map((role) => (
              <div
                key={role.id}
                onClick={() => setTargetRole(role.id as TargetRole)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  targetRole === role.id
                    ? 'border-purple-600 bg-purple-50/50 shadow-md ring-2 ring-purple-100'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <strong className="text-sm text-slate-900">{role.title}</strong>
                  {targetRole === role.id && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{role.desc}</p>
                <span className="text-[10px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                  Interviewer: {role.hr}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-xs text-slate-700 space-y-1.5">
            <strong className="text-slate-900 block font-bold mb-1">🎙️ Tips Melakukan Simulasi Interview:</strong>
            <div>1. Pastikan mikrofon perangkat Anda aktif dan izin browser diizinkan.</div>
            <div>2. AI akan membacakan pertanyaan dengan suara Bahasa Indonesia. Anda juga dapat menekan tombol speaker untuk mengulang suara.</div>
            <div>3. Jawab pertanyaan dengan tenang, jelas, dan gunakan metode STAR (Situation, Task, Action, Result).</div>
          </div>

          <button
            onClick={startInterview}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            Mulai Sesi Interview dengan AI HRD
          </button>
        </div>
      )}

      {/* INTERVIEW IN PROGRESS */}
      {sessionState === 'interviewing' && currentQuestion && (
        <div className="space-y-6">
          
          {/* Status Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                Pertanyaan {currentQIndex + 1} dari {questionsList.length}
              </span>
              <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
                Posisi: <strong className="text-slate-900 capitalize">{targetRole}</strong>
              </span>
            </div>

            <button
              onClick={() => speakQuestion(currentQuestion.question)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                isAiSpeaking
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isAiSpeaking ? 'AI Sedang Bicara...' : 'Ulangi Suara HRD'}</span>
            </button>
          </div>

          {/* AI HRD Speech Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-extrabold text-sm text-sky-400">
                    {currentQuestion.interviewerPersona}
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    Interviewer AI
                  </span>
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed mt-2">
                  "{currentQuestion.question}"
                </p>

                {/* Animated Voice Waveform when speaking */}
                {isAiSpeaking && (
                  <div className="flex items-center gap-1 mt-4">
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <div className="w-1 bg-sky-400 rounded-full wave-bar" />
                    <span className="text-[11px] text-sky-300 ml-2 font-medium">Memutar Audio Pertanyaan...</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* User Answer Card (Speech or Text) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-600" />
                Jawaban Anda:
              </span>
              
              <button
                onClick={toggleRecording}
                className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${
                  isRecording
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Hentikan Rekam' : 'Jawab via Suara (Mikrofon)'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
              placeholder="Ketik jawaban Anda di sini atau gunakan tombol mikrofon di atas untuk berbicara langsung..."
              className="w-full text-xs sm:text-sm p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none leading-relaxed text-slate-800"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <span className="text-[11px] text-slate-500">
                Jumlah Kata: <strong>{userInputText.trim().split(/\s+/).filter(Boolean).length}</strong> kata
              </span>

              <button
                onClick={handleSubmitAnswer}
                disabled={!userInputText.trim()}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{currentQIndex + 1 === questionsList.length ? 'Kirim & Selesaikan Interview' : 'Kirim Jawaban & Lanjut'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* COMPLETED REPORT & PREDICTED ACCEPTANCE PROBABILITY */}
      {sessionState === 'evaluated' && (
        <div className="space-y-6">
          
          {/* Grand Score Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950 flex items-center justify-center mx-auto mb-3 shadow-lg font-black text-xl">
              {totalProbability}%
            </div>
            
            <span className="text-xs uppercase tracking-widest text-purple-300 font-bold">
              Hasil Evaluasi AI HRD
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              Probabilitas Kelulusan Interview: {totalProbability}%
            </h2>
            <p className="text-xs text-purple-200 mt-2 max-w-md mx-auto">
              {totalProbability >= 80 
                ? '🌟 Peluang Sangat Tinggi! Pola jawaban dan pemahaman SOP Anda sangat memuaskan standar perekrut pabrik.' 
                : '💡 Potensi Baik. Pelajari catatan evaluasi dan contoh jawaban rekomendasi di bawah untuk meningkatkan skor kelulusan.'}
            </p>

            {/* 4 Pillars Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">1. Relevansi STAR</span>
                <div className="text-xl font-black text-amber-300 mt-1">{avgRelevance}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">2. Artikulasi</span>
                <div className="text-xl font-black text-sky-300 mt-1">{avgArticulation}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">3. Sikap & Etika</span>
                <div className="text-xl font-black text-emerald-300 mt-1">{avgEtiquette}%</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                <span className="text-[10px] text-purple-200 uppercase font-bold">4. Kesesuaian Role</span>
                <div className="text-xl font-black text-purple-300 mt-1">{avgJobFit}%</div>
              </div>
            </div>
          </div>

          {/* Detailed Question Review Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Detail Transkrip & Masukan per Pertanyaan:
            </h3>

            {sessionResponses.map((res, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Pertanyaan #{i + 1}
                  </span>
                  <span className="text-xs font-black text-emerald-600">
                    Skor: {res.rubric.totalAcceptanceProbability}%
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900">
                  HRD: "{res.question.question}"
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                  <strong>Jawaban Anda:</strong> "{res.userAnswer}"
                </div>

                {/* Feedback pill */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
                  <div>
                    <strong className="text-amber-900 block font-bold">💡 Saran Perbaikan Jawaban:</strong>
                    <p className="text-amber-950">{res.rubric.actionableFeedback}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-800 block font-bold">✨ Contoh Jawaban Ideal (Model Answer):</strong>
                    <p className="text-emerald-950 bg-white/80 p-2.5 rounded-lg border border-emerald-200 font-medium">
                      "{res.rubric.idealAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSessionState('idle')}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Lakukan Simulasi Interview Baru
          </button>

        </div>
      )}

    </div>
  );
};
