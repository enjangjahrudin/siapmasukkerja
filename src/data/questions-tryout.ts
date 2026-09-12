import { BaseQuestion } from '../types';
import { getRandomMechanicalSet, mechanicalQuestionBank } from './questions-mechanical';
import { getRandomArithmeticSet, arithmeticQuestionBank } from './questions-arithmetic';
import { getCustomMathTestBatch } from './questions-basic-math';
import { getPsychotestBatch, psychotestQuestionBank } from './questions-psychotest';
import { getRandomQcMcSet, qcMultipleChoiceQuestions } from './questions-qc';
import { getRandomSpatialSet, spatialQuestionBank } from './questions-spatial';

// ============================================================================
// TRYOUT CAT AKBAR - BANK SOAL +1.000 & GENERATOR ENGINE TERPADU
// Menggabungkan 6 Dimensi Inti Rekrutmen Industri:
// 1. Mekanika Bennett (BMCT)        : 6 Soal
// 2. Aritmatika & Deret Angka       : 6 Soal
// 3. Matematika Dasar & Pabrik       : 6 Soal
// 4. Psikotes Logika & Penalaran     : 6 Soal
// 5. Ketelitian Kode & Mutu QC       : 3 Soal
// 6. Spasial & Rotasi 3D             : 3 Soal
// TOTAL SOAL PER SESI               : 30 Soal (Passing Grade 75%)
// ============================================================================

/**
 * Fisher-Yates True Shuffle Algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Memastikan dan mengacak posisi opsi jawaban (A, B, C, D) sehingga
 * kunci jawaban merata dan tidak monoton di satu huruf.
 */
function ensureShuffledOptions(q: BaseQuestion): BaseQuestion {
  if (!q.options || q.options.length < 2) return q;

  const correctText = q.options[q.correctAnswer] || '';
  const cleanCorrect = correctText.replace(/^[A-E]\.\s*/, '').trim();

  // Bersihkan prefiks huruf lama dari opsi
  const cleanOptions = q.options.map(opt => opt.replace(/^[A-E]\.\s*/, '').trim());

  // Acak opsi
  const shuffledClean = shuffleArray(cleanOptions);

  // Pasang prefiks huruf baru A, B, C, D
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const newOptions = shuffledClean.map((opt, idx) => `${letters[idx] || '?'}. ${opt}`);
  const newCorrectIndex = shuffledClean.indexOf(cleanCorrect);

  return {
    ...q,
    options: newOptions,
    correctAnswer: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}

/**
 * Menghasilkan 1 set Tryout CAT lengkap sebanyak 30 soal (atau kustom)
 * dengan komposisi seimbang 6 dimensi industri dan pengacakan penuh.
 */
export function getRandomTryoutSet(totalCount: number = 30): BaseQuestion[] {
  let mechCount = 6;
  let arithCount = 6;
  let mathCount = 6;
  let psychoCount = 6;
  let qcCount = 3;
  let spatialCount = 3;

  // Jika jumlah kustom berbeda dari 30
  if (totalCount !== 30) {
    const ratio = totalCount / 30;
    mechCount = Math.max(1, Math.round(6 * ratio));
    arithCount = Math.max(1, Math.round(6 * ratio));
    mathCount = Math.max(1, Math.round(6 * ratio));
    psychoCount = Math.max(1, Math.round(6 * ratio));
    qcCount = Math.max(1, Math.round(3 * ratio));
    spatialCount = Math.max(1, totalCount - (mechCount + arithCount + mathCount + psychoCount + qcCount));
  }

  // Tarik soal dari masing-masing generator bank
  const mechQuestions = getRandomMechanicalSet(mechCount);
  const arithQuestions = getRandomArithmeticSet(arithCount);
  const mathQuestions = getCustomMathTestBatch(mathCount);
  const psychoQuestions = getPsychotestBatch(psychoCount);
  const qcQuestions = getRandomQcMcSet(qcCount);
  const spatialQuestions = getRandomSpatialSet(spatialCount);

  // Gabungkan seluruh kategori
  const rawCombined: BaseQuestion[] = [
    ...mechQuestions,
    ...arithQuestions,
    ...mathQuestions,
    ...psychoQuestions,
    ...qcQuestions,
    ...spatialQuestions
  ];

  // Acak urutan opsi jawaban tiap soal
  const withShuffledOptions = rawCombined.map(q => ensureShuffledOptions(q));

  // Acak penuh urutan seluruh 30 soal sehingga kategori terdistribusi secara acak
  const finalShuffled = shuffleArray(withShuffledOptions);

  return finalShuffled.slice(0, totalCount);
}

/**
 * Master Pre-Generated Tryout Bank (1.200+ Soal Terpadu)
 * Menggabungkan bank-bank master untuk ketersediaan offline & verifikasi bank +1.000
 */
export const masterTryoutQuestionBank: BaseQuestion[] = [
  ...mechanicalQuestionBank.slice(0, 300),
  ...arithmeticQuestionBank.slice(0, 300),
  ...psychotestQuestionBank.slice(0, 300),
  ...qcMultipleChoiceQuestions.slice(0, 150),
  ...spatialQuestionBank.slice(0, 150)
];

/**
 * Parameter standar waktu ujian CAT (25 Menit untuk 30 Soal = 50 detik / soal)
 */
export const TRYOUT_CONFIG = {
  totalQuestions: 30,
  durationMinutes: 25,
  durationSeconds: 25 * 60, // 1500 detik
  passingGradePercent: 75,
  timeWarningSeconds: 300, // 5 menit terakhir
  composition: [
    { category: 'Mekanika Bennett', count: 6, label: 'BMCT Fisika Pabrik' },
    { category: 'Aritmatika & Deret', count: 6, label: 'Pola Angka & Huruf' },
    { category: 'Matematika Terapan', count: 6, label: 'Kabataku & Persen' },
    { category: 'Psikotes Logika', count: 6, label: 'Verbal & Silogisme K3' },
    { category: 'Ketelitian Mutu QC', count: 3, label: 'Speed Match & Toleransi' },
    { category: 'Spasial 3D', count: 3, label: 'Jaring & Rotasi Bangun' }
  ]
};
