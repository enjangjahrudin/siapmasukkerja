import { BaseQuestion } from '../types';

// ============================================================================
// ARITHMETIC & NUMBER SERIES TEST - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup Deret Angka, Huruf, Kombinasi, Perbandingan Pekerja & Hitung Cepat
// ============================================================================

// ----------------------------------------------------------------------------
// Generator 1: Deret Aritmatika Linier (+N atau -N)
// ----------------------------------------------------------------------------
function generateLinearSeries(seed: number): BaseQuestion {
  const isAdd = seed % 2 === 0;
  const step = [3, 4, 5, 6, 7, 8, 9, 11, 12, 15][seed % 10];
  const start = [5, 8, 12, 17, 24, 30, 45, 60, 100, 120][(seed * 3) % 10];
  
  const seq: number[] = [];
  for (let i = 0; i < 6; i++) {
    seq.push(isAdd ? start + i * step : start - i * step);
  }
  const ans = seq[5];
  const displaySeq = seq.slice(0, 5).join(', ') + ', ... ?';

  const distractors = [ans + step, ans - step, ans + (isAdd ? 2 : -2)].filter(v => v !== ans);
  const options = [
    `A. ${ans}`,
    `B. ${distractors[0] || ans + 10}`,
    `C. ${distractors[1] || ans - 10}`,
    `D. ${ans + (isAdd ? step * 2 : -step * 2)}`
  ].sort(() => ((seed * 7) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ans}`));

  return {
    id: `arith-linear-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Aritmatika Linier',
    question: `Tentukan angka kelanjutan dari deret berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pola deret adalah ${isAdd ? 'penambahan' : 'pengurangan'} konstan sebesar ${step} pada setiap langkah (${seq.slice(0, 5).join(' -> ')}). Maka suku berikutnya adalah ${seq[4]} ${isAdd ? '+' : '-'} ${step} = ${ans}.`,
    quickTrick: `💡 Trik Selisih Konstan: Kurangkan suku ke-2 dengan suku ke-1 (${seq[1]} - ${seq[0]} = ${isAdd ? step : -step}). Pola selisihnya bernilai tetap.`
  };
}

// ----------------------------------------------------------------------------
// Generator 2: Deret Geometri (Perkalian & Pembagian)
// ----------------------------------------------------------------------------
function generateGeometricSeries(seed: number): BaseQuestion {
  const ratios = [2, 3, 4];
  const ratio = ratios[seed % ratios.length];
  const start = ratio === 4 ? [2, 3, 5][seed % 3] : [2, 3, 4, 5, 6, 7][seed % 6];

  const seq: number[] = [];
  for (let i = 0; i < 5; i++) {
    seq.push(start * Math.pow(ratio, i));
  }
  const ans = seq[4];
  const displaySeq = seq.slice(0, 4).join(', ') + ', ... ?';

  const distractors = [ans + 12, ans - 16, Math.round(ans * 1.5)].filter(v => v !== ans);
  const options = [
    `A. ${ans}`,
    `B. ${distractors[0] || ans + 24}`,
    `C. ${distractors[1] || ans - 20}`,
    `D. ${seq[3] + ratio * 10}`
  ].sort(() => ((seed * 11) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ans}`));

  return {
    id: `arith-geom-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Geometri / Rasio',
    question: `Berapakah angka selanjutnya dari deret geometri berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pola deret adalah perkalian dengan faktor rasio konstan (×${ratio}). Maka suku berikutnya adalah ${seq[3]} × ${ratio} = ${ans}.`,
    quickTrick: `💡 Trik Geometri: Bagi suku ke-2 dengan suku ke-1 (${seq[1]} / ${seq[0]} = ${ratio}). Kalikan langsung suku terakhir dengan rasio tersebut.`
  };
}

// ----------------------------------------------------------------------------
// Generator 3: Deret Bertingkat / Selisih Bertambah (+2, +4, +6 atau +3, +5, +7)
// ----------------------------------------------------------------------------
function generateSteppedSeries(seed: number): BaseQuestion {
  const start = [2, 4, 5, 7, 10][seed % 5];
  const diffStep = [2, 3, 4][(seed + 1) % 3];
  let firstDiff = [2, 3, 5][(seed + 2) % 3];

  const seq: number[] = [start];
  for (let i = 0; i < 5; i++) {
    seq.push(seq[i] + (firstDiff + i * diffStep));
  }
  const ans = seq[5];
  const displaySeq = seq.slice(0, 5).join(', ') + ', ... ?';

  const options = [
    `A. ${ans}`,
    `B. ${ans + 4}`,
    `C. ${ans - 5}`,
    `D. ${ans + 10}`
  ].sort(() => ((seed * 13) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ans}`));

  return {
    id: `arith-stepped-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Bertingkat',
    question: `Tentukan kelanjutan dari deret bertingkat berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hitung selisih antar suku: selisih bertambah +${diffStep} pada setiap langkah. Maka penambahan untuk suku terakhir adalah +${firstDiff + 4 * diffStep}, menghasilkan ${seq[4]} + ${firstDiff + 4 * diffStep} = ${ans}.`,
    quickTrick: `💡 Trik Deret Bertingkat: Tulis selisih di atas masing-masing angka deret untuk melihat pola kenaikan selisih tingkat dua.`
  };
}

// ----------------------------------------------------------------------------
// Generator 4: Deret Fibonacci & Penjumlahan Dua Suku Sebelumnya
// ----------------------------------------------------------------------------
function generateFibonacciSeries(seed: number): BaseQuestion {
  const a = [1, 2, 3, 4, 5][seed % 5];
  const b = [2, 3, 4, 5, 7][(seed + 1) % 5];
  
  const seq = [a, b];
  for (let i = 2; i < 6; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  const ans = seq[5];
  const displaySeq = seq.slice(0, 5).join(', ') + ', ... ?';

  const options = [
    `A. ${ans}`,
    `B. ${ans + 3}`,
    `C. ${ans - 4}`,
    `D. ${ans + 7}`
  ].sort(() => ((seed * 17) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ans}`));

  return {
    id: `arith-fibo-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Pola Fibonacci',
    question: `Berapakah angka berikutnya dari deret pola berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Setiap suku adalah hasil penjumlahan dari DUA suku persis sebelumnya: ${seq[3]} + ${seq[4]} = ${ans}.`,
    quickTrick: `💡 Trik Fibonacci: Jika deret tidak memiliki selisih maupun rasio yang pas, cek apakah angka ke-3 merupakan hasil penjumlahan angka ke-1 dan ke-2.`
  };
}

// ----------------------------------------------------------------------------
// Generator 5: Deret Lompat / Selang-Seling (Interleaved Series)
// ----------------------------------------------------------------------------
function generateInterleavedSeries(seed: number): BaseQuestion {
  const startA = [2, 3, 5, 8][seed % 4];
  const stepA = [2, 3, 4][(seed + 1) % 3];
  const startB = [50, 60, 80, 100][(seed + 2) % 4];
  const stepB = [3, 5, 10][(seed + 3) % 3];

  const seq = [
    startA, startB,
    startA + stepA, startB - stepB,
    startA + stepA * 2, startB - stepB * 2,
    startA + stepA * 3, startB - stepB * 3
  ];
  // Target: find next two numbers
  const ansA = seq[6];
  const ansB = seq[7];
  const displaySeq = seq.slice(0, 6).join(', ') + ', ..., ... ?';

  const options = [
    `A. ${ansA}, ${ansB}`,
    `B. ${ansA + 2}, ${ansB - 2}`,
    `C. ${ansA}, ${ansB + 5}`,
    `D. ${ansA - 1}, ${ansB}`
  ].sort(() => ((seed * 19) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ansA}, ${ansB}`));

  return {
    id: `arith-interleave-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Lompat / Selang-Seling',
    question: `Tentukan dua angka selanjutnya dari deret kombinasi berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Deret terdiri dari 2 pola bergantian: Pola Ganjil (naik +${stepA}) -> ${startA}, ${startA + stepA}, ${startA + stepA * 2}, ${ansA}. Pola Genap (turun -${stepB}) -> ${startB}, ${startB - stepB}, ${startB - stepB * 2}, ${ansB}.`,
    quickTrick: `💡 Trik Deret Lompat: Jika angka naik-turun secara tidak teratur, pisahkan urutan ganjil dan urutan genap menjadi dua deret terpisah.`
  };
}

// ----------------------------------------------------------------------------
// Generator 6: Deret Huruf & Kombinasi Alfanumerik
// ----------------------------------------------------------------------------
function generateLetterSeries(seed: number): BaseQuestion {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const isSkip2 = seed % 2 === 0;
  const step = isSkip2 ? 2 : 3;
  const startIdx = seed % 6; // A - F

  const letters: string[] = [];
  const numbers: number[] = [];
  for (let i = 0; i < 5; i++) {
    letters.push(alphabet[(startIdx + i * step) % alphabet.length]);
    numbers.push(Math.pow(2, i + 1));
  }

  // Combined: A, 2, C, 4, E, 8, G, 16, ...
  const seq: string[] = [];
  for (let i = 0; i < 4; i++) {
    seq.push(letters[i]);
    seq.push(`${numbers[i]}`);
  }

  const ansLetter = letters[4];
  const ansNumber = numbers[4];
  const displaySeq = seq.join(', ') + ', ..., ... ?';

  const options = [
    `A. ${ansLetter}, ${ansNumber}`,
    `B. ${alphabet[(startIdx + 4 * step - 1) % alphabet.length]}, ${ansNumber}`,
    `C. ${ansLetter}, ${ansNumber - 4}`,
    `D. ${alphabet[(startIdx + 4 * step + 1) % alphabet.length]}, ${ansNumber * 2}`
  ].sort(() => ((seed * 23) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${ansLetter}, ${ansNumber}`));

  return {
    id: `arith-letter-${seed}`,
    category: 'arithmetic',
    subCategory: 'Deret Huruf & Alfanumerik',
    question: `Berapakah kelanjutan dari deret kombinasi huruf dan angka berikut: ${displaySeq}`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pola huruf melompat ${step} abjad (${letters.slice(0, 4).join(', ')} -> ${ansLetter}). Pola angka adalah perkalian 2 (${numbers.slice(0, 4).join(', ')} -> ${ansNumber}).`,
    quickTrick: `💡 Trik Deret Huruf: Konversikan huruf ke angka urutan abjadnya (A=1, B=2, C=3...) untuk mempermudah melihat polanya.`
  };
}

// ----------------------------------------------------------------------------
// Generator 7: Perbandingan Pekerja, Waktu & Kapasitas Produksi Pabrik
// ----------------------------------------------------------------------------
function generateWorkforceComparison(seed: number): BaseQuestion {
  const workers1 = [4, 6, 8, 10][seed % 4];
  const hours1 = [2, 3, 4][(seed + 1) % 3];
  const ratePerWorkerHour = [5, 8, 10, 12][(seed + 2) % 4]; // unit/worker-hour
  const output1 = workers1 * hours1 * ratePerWorkerHour;

  const workers2 = [8, 12, 15, 20][(seed + 3) % 4];
  const hours2 = [4, 5, 6][(seed + 4) % 3];
  const output2 = workers2 * hours2 * ratePerWorkerHour;

  const options = [
    `A. ${output2} unit`,
    `B. ${output2 + 100} unit`,
    `C. ${Math.round(output2 * 0.75)} unit`,
    `D. ${output2 * 2} unit`
  ].sort(() => ((seed * 29) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${output2} unit`));

  return {
    id: `arith-workforce-${seed}`,
    category: 'arithmetic',
    subCategory: 'Perbandingan Produksi Manufaktur',
    question: `Jika ${workers1} orang operator perakitan dapat menyelesaikan ${output1} unit komponen dalam waktu ${hours1} jam, berapakah unit komponen yang mampu diselesaikan oleh ${workers2} orang operator dalam waktu ${hours2} jam dengan kecepatan kerja yang sama?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Kapasitas 1 operator per jam = ${output1} / (${workers1} × ${hours1}) = ${ratePerWorkerHour} unit/orang-jam. Maka untuk ${workers2} operator selama ${hours2} jam = ${workers2} × ${hours2} × ${ratePerWorkerHour} = ${output2} unit.`,
    quickTrick: `💡 Trik Rumus Cepat: Output / (Orang × Waktu) = Konstan. Hitung nilai 1 orang-jam terlebih dahulu.`
  };
}

// ----------------------------------------------------------------------------
// Generator 8: Defect Rate & Persentase Efisiensi Manufaktur
// ----------------------------------------------------------------------------
function generateDefectRate(seed: number): BaseQuestion {
  const totalProduced = [500, 800, 1000, 1200, 1500, 2000][seed % 6];
  const percentRate = [2, 2.5, 3, 4, 5][(seed + 1) % 5];
  const defectCount = Math.round((totalProduced * percentRate) / 100);

  const options = [
    `A. ${percentRate}%`,
    `B. ${percentRate + 1.5}%`,
    `C. ${Math.max(1, percentRate - 1)}%`,
    `D. ${(percentRate * 1.5).toFixed(1)}%`
  ].sort(() => ((seed * 31) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${percentRate}%`));

  return {
    id: `arith-defect-${seed}`,
    category: 'arithmetic',
    subCategory: 'Persentase & Defect Rate QC',
    question: `Sebuah lini produksi menghasilkan ${totalProduced.toLocaleString('id-ID')} unit produk dalam satu shift kerja. Dari hasil inspeksi mutu, ditemukan sebanyak ${defectCount} unit produk cacat (reject). Berapakah persentase produk cacat (defect rate) pada shift tersebut?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Defect Rate = (Jumlah Produk Cacat / Total Produksi) × 100% = (${defectCount} / ${totalProduced}) × 100% = ${percentRate}%.`,
    quickTrick: `💡 Trik Persen Cepat: Coret dua angka nol pada total produksi untuk mencari nilai 1%, lalu bagi jumlah cacat dengan angka tersebut.`
  };
}

// ----------------------------------------------------------------------------
// Generator 9: Kecepatan, Jarak & Waktu Tempuh Distribusi Logistik
// ----------------------------------------------------------------------------
function generateSpeedDistance(seed: number): BaseQuestion {
  const speed = [40, 50, 60, 80][seed % 4]; // km/jam
  const hours = [2, 3, 2.5, 3.5][(seed + 1) % 4];
  const distance = speed * hours;

  const options = [
    `A. ${distance} km`,
    `B. ${distance + 30} km`,
    `C. ${distance - 25} km`,
    `D. ${distance * 2} km`
  ].sort(() => ((seed * 37) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${distance} km`));

  return {
    id: `arith-speed-${seed}`,
    category: 'arithmetic',
    subCategory: 'Kecepatan & Waktu Logistik',
    question: `Sebuah armada truk logistik mengantar suku cadang dari pabrik perakitan menuju gudang distribusi dengan kecepatan rata-rata ${speed} km/jam selama ${hours} jam tanpa henti. Berapakah jarak total yang ditempuh truk tersebut?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Jarak (s) = Kecepatan (v) × Waktu (t) = ${speed} km/jam × ${hours} jam = ${distance} km.`,
    quickTrick: `💡 Trik Fisika Dasar: Jarak = Kecepatan × Waktu. Perhatikan kesamaan satuan jam dan km.`
  };
}

// ----------------------------------------------------------------------------
// Generator 10: Target Shift & Laba Rugi Operasional
// ----------------------------------------------------------------------------
function generateProductionTarget(seed: number): BaseQuestion {
  const targetPerDay = [1200, 1500, 2000, 2400][seed % 4];
  const days = [5, 6, 7][(seed + 1) % 3];
  const achievedPercent = [85, 90, 95, 110][(seed + 2) % 4];
  const totalTarget = targetPerDay * days;
  const actual = Math.round((totalTarget * achievedPercent) / 100);

  const options = [
    `A. ${actual.toLocaleString('id-ID')} unit`,
    `B. ${(actual + 200).toLocaleString('id-ID')} unit`,
    `C. ${(actual - 300).toLocaleString('id-ID')} unit`,
    `D. ${totalTarget.toLocaleString('id-ID')} unit`
  ].sort(() => ((seed * 41) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${actual.toLocaleString('id-ID')} unit`));

  return {
    id: `arith-target-${seed}`,
    category: 'arithmetic',
    subCategory: 'Target Produksi & Efisiensi',
    question: `Target produksi sebuah pabrik adalah ${targetPerDay.toLocaleString('id-ID')} unit per hari selama ${days} hari kerja. Jika pada akhir periode pencapaian tim mencapai ${achievedPercent}% dari total target, berapakah jumlah aktual komponen yang berhasil diproduksi?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Total Target = ${targetPerDay} × ${days} = ${totalTarget.toLocaleString('id-ID')} unit. Realisasi = ${achievedPercent}% × ${totalTarget} = ${actual.toLocaleString('id-ID')} unit.`,
    quickTrick: `💡 Trik Hitung Mental: Kalikan dulu target harian dengan jumlah hari, lalu kalikan dengan persentase realisasi.`
  };
}

// ============================================================================
// MASTER GENERATOR & BANK
// ============================================================================
const ARITHMETIC_GENERATORS = [
  generateLinearSeries,
  generateGeometricSeries,
  generateSteppedSeries,
  generateFibonacciSeries,
  generateInterleavedSeries,
  generateLetterSeries,
  generateWorkforceComparison,
  generateDefectRate,
  generateSpeedDistance,
  generateProductionTarget
];

export function generateParametricArithmeticQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % ARITHMETIC_GENERATORS.length;
  return ARITHMETIC_GENERATORS[genIdx](s);
}

export function getRandomArithmeticSet(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const baseSeed = Math.floor(Math.random() * 10000);

  for (let i = 0; i < count; i++) {
    const genIdx = (i + baseSeed) % ARITHMETIC_GENERATORS.length;
    const seed = baseSeed * 29 + i * 19 + Math.floor(Math.random() * 1000);
    result.push(ARITHMETIC_GENERATORS[genIdx](seed));
  }

  return result;
}

// Pre-generated 1,000+ Question Master Bank
export const arithmeticQuestionBank: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % ARITHMETIC_GENERATORS.length;
  return ARITHMETIC_GENERATORS[genIdx](idx * 17 + 5);
});

// Backward compatibility active sample set
export const arithmeticQuestions: BaseQuestion[] = arithmeticQuestionBank.slice(0, 10);
