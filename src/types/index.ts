export type TargetRole = 'operator' | 'qc' | 'maintenance' | 'logistics';

export interface UserProfile {
  name: string;
  targetRole: TargetRole;
  targetCompany: string;
  completedTestsCount: number;
  averageScore: number;
  interviewTokens: number;
}

export type TestCategory = 
  | 'kraepelin' 
  | 'qc-accuracy' 
  | 'mechanical' 
  | 'arithmetic' 
  | 'math-basic'
  | 'multiplication-table'
  | 'psychotest'
  | 'spatial' 
  | 'wartegg' 
  | 'interview' 
  | 'tryout-full';

export interface BaseQuestion {
  id: string;
  category: TestCategory;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  quickTrick?: string;
  diagramType?: string;
  diagramProps?: Record<string, any>;
  subCategory?: string;
}

export interface KraepelinColumnResult {
  columnIndex: number;
  totalAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface KraepelinAnalysis {
  totalSum: number;
  panker: number; // Kecepatan kerja (rata-rata per kolom)
  tianker: number; // Kestabilan ritme kerja (deviasi standar)
  janker: number; // Ketelitian (%)
  hankan: number; // Ketahanan (slope garis regresi)
  columnData?: KraepelinColumnResult[];
  statusGrade: 'Sangat Baik (Lolos PT Astra/Epson)' | 'Baik (Lolos Standar)' | 'Cukup' | 'Perlu Latihan';
  feedback: string[];
}

export interface InterviewRubric {
  relevanceScore: number; // 0-100 (Bobot 35%)
  articulationScore: number; // 0-100 (Bobot 25%)
  etiquetteScore: number; // 0-100 (Bobot 20%)
  jobFitScore: number; // 0-100 (Bobot 20%)
  totalAcceptanceProbability: number; // 0-100 %
  strengths: string[];
  weaknesses: string[];
  actionableFeedback: string;
  idealAnswer: string;
}

export interface InterviewSession {
  id: string;
  role: TargetRole;
  currentQuestionIndex: number;
  questions: {
    questionText: string;
    interviewerTone: 'neutral' | 'probing' | 'friendly';
    recordedTranscript?: string;
    audioUrl?: string;
    rubric?: InterviewRubric;
  }[];
  overallProbability?: number;
  status: 'not_started' | 'in_progress' | 'completed';
}
