import { BaseQuestion } from '../types';

// ============================================================================
// QUALITY CONTROL (QC) & KETELITIAN KODE - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup Speed Match Barcode, Part Number, Toleransi Limit NG, & 5S Mutu
// ============================================================================

export interface QcComparisonItem {
  id: string;
  leftCode: string;
  rightCode: string;
  isSame: boolean;
  category: 'part-number' | 'serial-code' | 'spec-label' | 'dimension';
  diffIndex?: number;
}

// Prefix templates for industrial realistic codes
const BRANDS = ['ASTRA', 'EPSON', 'TOYOTA', 'DENSO', 'DAIHATSU', 'YAMAHA', 'HONDA', 'SAMSUNG', 'PANASONIC', 'MITSUBISHI'];
const CODE_PATTERNS = [
  '89240-B77', 'L3150-C902', '2DP-E2111-00', '068300-8140', '11115-BZ010',
  '90915-YZZE1', '17220-RB6-Z00', 'GH96-12345A', 'TX-4091-REV3', 'K45-N01-INJECT',
  'SUS304-2B-1.5T', 'DIN-7985-M4x10', 'LOT-2026/09-SH1', 'QC-PASS-T771928'
];

// Confusable character pairs for realistic factory QC eye tests
const CONFUSABLES: Record<string, string> = {
  '0': 'O',
  'O': '0',
  '1': 'I',
  'I': '1',
  '5': 'S',
  'S': '5',
  '8': 'B',
  'B': '8',
  '2': 'Z',
  'Z': '2',
  '6': 'G',
  'G': '6'
};

/**
 * Generates an ultra-realistic QC comparison item
 */
export function generateRandomQcComparisonItem(seed?: number): QcComparisonItem {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const brand = BRANDS[s % BRANDS.length];
  const pattern = CODE_PATTERNS[(s + 3) % CODE_PATTERNS.length];
  const serialSuffix = (1000 + (s * 37) % 9000).toString();
  
  const categories: Array<QcComparisonItem['category']> = ['part-number', 'serial-code', 'spec-label', 'dimension'];
  const category = categories[s % categories.length];

  let baseCode = `${brand}-${pattern}-${serialSuffix}`;
  if (category === 'dimension') {
    const dim = ((s % 500) / 10 + 10).toFixed(2);
    const tol = ((s % 5) / 100 + 0.01).toFixed(3);
    baseCode = `TOL: ${dim} mm ±${tol}`;
  } else if (category === 'spec-label') {
    baseCode = `LOT: 2026/09/${(s % 28 + 1).toString().padStart(2, '0')}-SHIFT-${['A', 'B', 'C'][s % 3]}`;
  }

  const isSame = (s * 7) % 2 === 0;

  if (isSame) {
    return {
      id: `qc-match-${s}`,
      leftCode: baseCode,
      rightCode: baseCode,
      isSame: true,
      category
    };
  }

  // Mutate one character slightly
  const chars = baseCode.split('');
  let mutatedIndex = -1;

  // Try to find a confusable character
  for (let i = chars.length - 1; i >= 0; i--) {
    const ch = chars[i];
    if (CONFUSABLES[ch]) {
      chars[i] = CONFUSABLES[ch];
      mutatedIndex = i;
      break;
    }
  }

  // Fallback: swap two adjacent alphanumeric characters
  if (mutatedIndex === -1) {
    for (let i = chars.length - 2; i >= 0; i--) {
      if (/[A-Z0-9]/.test(chars[i]) && /[A-Z0-9]/.test(chars[i + 1]) && chars[i] !== chars[i + 1]) {
        const tmp = chars[i];
        chars[i] = chars[i + 1];
        chars[i + 1] = tmp;
        mutatedIndex = i;
        break;
      }
    }
  }

  const rightCode = chars.join('');

  return {
    id: `qc-match-${s}`,
    leftCode: baseCode,
    rightCode: rightCode === baseCode ? baseCode + '-NG' : rightCode,
    isSame: false,
    category,
    diffIndex: mutatedIndex >= 0 ? mutatedIndex : undefined
  };
}

export function getQcComparisonBatch(count: number = 40): QcComparisonItem[] {
  const result: QcComparisonItem[] = [];
  const baseSeed = Math.floor(Math.random() * 10000);
  for (let i = 0; i < count; i++) {
    result.push(generateRandomQcComparisonItem(baseSeed * 31 + i * 17));
  }
  return result;
}

// 1,000+ QC Comparison Bank
export const qcSampleComparisonBank: QcComparisonItem[] = Array.from({ length: 1000 }, (_, idx) => {
  return generateRandomQcComparisonItem(idx * 19 + 3);
});

// ----------------------------------------------------------------------------
// QC MULTIPLE CHOICE GENERATOR & BANK (1.000+ SOAL)
// ----------------------------------------------------------------------------

function generateToleranceQuestion(seed: number): BaseQuestion {
  const nominal = [20.00, 25.00, 30.00, 50.00, 100.00][seed % 5];
  const tol = [0.02, 0.05, 0.10, 0.03][(seed + 1) % 4];
  const minLimit = Number((nominal - tol).toFixed(2));
  const maxLimit = Number((nominal + tol).toFixed(2));

  const isUpperReject = seed % 2 === 0;
  const rejectValue = isUpperReject 
    ? Number((maxLimit + 0.02).toFixed(2))
    : Number((minLimit - 0.02).toFixed(2));

  const validValues = [
    nominal.toFixed(2) + ' mm',
    Number((nominal + tol / 2).toFixed(2)).toFixed(2) + ' mm',
    Number((nominal - tol / 2).toFixed(2)).toFixed(2) + ' mm'
  ];

  const options = [
    `A. ${rejectValue.toFixed(2)} mm`,
    `B. ${validValues[0]}`,
    `C. ${validValues[1]}`,
    `D. ${validValues[2]}`
  ].sort(() => ((seed * 7) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${rejectValue.toFixed(2)} mm`));

  return {
    id: `qc-tol-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Toleransi Dimensi & Limit NG',
    question: `Seorang inspektur QC memeriksa dimensi benda kerja dengan standar drawing: ${nominal.toFixed(2)} mm ± ${tol.toFixed(2)} mm. Hasil pengukuran mikrometer manakah yang WAJIB DINYATAKAN REJECT (NOT GOOD / NG)?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Batas toleransi yang diizinkan adalah ${minLimit.toFixed(2)} mm (Batas Bawah) s/d ${maxLimit.toFixed(2)} mm (Batas Atas). Hasil ukur ${rejectValue.toFixed(2)} mm berada di LUAR batas toleransi yang ditentukan, sehingga harus dinyatakan REJECT / NG.`,
    quickTrick: `💡 Trik Toleransi QC: Hitung Batas Bawah = Standar - Toleransi (${minLimit.toFixed(2)}) dan Batas Atas = Standar + Toleransi (${maxLimit.toFixed(2)}). Angka di luar rentang tersebut pasti NG.`
  };
}

function generateCodeMatchQuestion(seed: number): BaseQuestion {
  const brand = BRANDS[seed % BRANDS.length];
  const code = CODE_PATTERNS[(seed + 2) % CODE_PATTERNS.length];
  const master = `[${brand}-${code}-OK]`;

  const optCorrect = master;
  const optDiff1 = master.replace('0', 'O').replace('1', 'I');
  const optDiff2 = master.replace('-', '_');
  const optDiff3 = master.replace('OK', 'KO');

  const options = [
    `A. ${optCorrect}`,
    `B. ${optDiff1 === master ? master.replace('A', '4') : optDiff1}`,
    `C. ${optDiff2}`,
    `D. ${optDiff3}`
  ].sort(() => ((seed * 11) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(optCorrect));

  return {
    id: `qc-match-mc-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Ketelitian Kode Alfanumerik',
    question: `Di antara 4 pilihan di bawah ini, manakah yang memiliki susunan karakter PERSIS SAMA (100% IDENTIK) dengan Master Barcode ${master} ?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hanya pilihan ${options[correctIndex]} yang 100% identik karakter demi karakter tanpa ada kesalahan huruf kembar, angka mirip, atau tanda hubung.`,
    quickTrick: `💡 Trik Ketelitian Barcode: Periksa per-klaster 3-4 karakter dari belakang ke depan untuk menghindari ilusi visual otak membaca kata utuh.`
  };
}

function generate5SQuestion(seed: number): BaseQuestion {
  const fiveSTopics = [
    {
      term: 'SEIRI (Ringkas)',
      desc: 'Memisahkan dan membuang barang yang tidak diperlukan dari area kerja lini produksi.',
      q: 'Aktivitas memilah barang yang diperlukan dan menyingkirkan barang yang sudah tidak terpakai (Red Tag) termasuk dalam pilar 5S / 5R:'
    },
    {
      term: 'SEITON (Rapi)',
      desc: 'Menata barang pada tempatnya dengan label yang jelas (shadow board) agar mudah ditemukan dalam hitungan detik.',
      q: 'Menempatkan kunci perkakas pada papan bayangan (shadow board) dengan penandaan label yang rapi merupakan penerapan pilar 5S:'
    },
    {
      term: 'SEISO (Resik)',
      desc: 'Membersihkan area kerja dan mesin sekaligus melakukan inspeksi terhadap kebocoran oli atau baut kendor.',
      q: 'Membersihkan lantai pabrik dan mesin sambil memeriksa apakah ada rembesan oli pelumas atau baut longgar termasuk dalam:'
    },
    {
      term: 'SEIKETSU (Rawat)',
      desc: 'Mempertahankan standar 3S sebelumnya secara konsisten melalui SOP dan visual control audit berkala.',
      q: 'Membuat jadwal piket harian dan SOP visual checklist untuk menjaga kebersihan dan kerapian kerja merupakan pilar:'
    },
    {
      term: 'SHITSUKE (Rajin)',
      desc: 'Membiasakan diri mematuhi aturan SOP dan K3 secara mandiri tanpa harus selalu diawasi supervisor.',
      q: 'Kedisiplinan pribadi karyawan untuk selalu mengenakan APD lengkap dan mematuhi SOP tanpa harus ditegur supervisor adalah:'
    }
  ];

  const item = fiveSTopics[seed % fiveSTopics.length];
  const options = [
    `A. ${item.term}`,
    `B. ${fiveSTopics[(seed + 1) % 5].term}`,
    `C. ${fiveSTopics[(seed + 2) % 5].term}`,
    `D. ${fiveSTopics[(seed + 3) % 5].term}`
  ].sort(() => ((seed * 13) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(item.term));

  return {
    id: `qc-5s-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Budaya 5S/5R & Mutu Pabrik',
    question: item.q,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${item.term}: ${item.desc}`,
    quickTrick: `💡 Trik 5S: Seiri=Ringkas (Pilah), Seiton=Rapi (Tata), Seiso=Resik (Bersih & Cek), Seiketsu=Rawat (Standar), Shitsuke=Rajin (Disiplin Diri).`
  };
}

const QC_MC_GENERATORS = [
  generateToleranceQuestion,
  generateCodeMatchQuestion,
  generate5SQuestion
];

export function generateParametricQcQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % QC_MC_GENERATORS.length;
  return QC_MC_GENERATORS[genIdx](s);
}

export function getRandomQcMcSet(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const baseSeed = Math.floor(Math.random() * 10000);
  for (let i = 0; i < count; i++) {
    const genIdx = (i + baseSeed) % QC_MC_GENERATORS.length;
    const seed = baseSeed * 37 + i * 19 + Math.floor(Math.random() * 1000);
    result.push(QC_MC_GENERATORS[genIdx](seed));
  }
  return result;
}

export const qcMultipleChoiceQuestions: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % QC_MC_GENERATORS.length;
  return QC_MC_GENERATORS[genIdx](idx * 23 + 11);
});
