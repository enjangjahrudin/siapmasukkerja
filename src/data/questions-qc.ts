import { BaseQuestion } from '../types';

export interface QcComparisonItem {
  id: string;
  leftCode: string;
  rightCode: string;
  isSame: boolean;
  category: 'part-number' | 'serial-code' | 'spec-label' | 'dimension';
  diffIndex?: number;
}

export const qcSampleComparisonBank: QcComparisonItem[] = [
  { id: 'qc-1', leftCode: 'ASTRA-89240-B77', rightCode: 'ASTRA-89240-B77', isSame: true, category: 'part-number' },
  { id: 'qc-2', leftCode: 'EPSON-L3150-C902', rightCode: 'EPSON-L3150-G902', isSame: false, category: 'part-number', diffIndex: 12 },
  { id: 'qc-3', leftCode: 'YMH-2DP-E2111-00', rightCode: 'YMH-2DP-E2111-00', isSame: true, category: 'serial-code' },
  { id: 'qc-4', leftCode: 'DENSO-068300-8140', rightCode: 'DENSO-068300-814O', isSame: false, category: 'serial-code', diffIndex: 17 }, // Nol vs O
  { id: 'qc-5', leftCode: 'QC-PASS-T7719283-OK', rightCode: 'QC-PASS-T7719283-OK', isSame: true, category: 'spec-label' },
  { id: 'qc-6', leftCode: 'LOT: 2026/08/30-SHIFT-A', rightCode: 'LOT: 2026/08/30-SH1FT-A', isSame: false, category: 'spec-label', diffIndex: 18 },
  { id: 'qc-7', leftCode: 'TOL: 0.025 mm ±0.005', rightCode: 'TOL: 0.025 mm ±0.005', isSame: true, category: 'dimension' },
  { id: 'qc-8', leftCode: 'TORQUE: 45.8 N·m', rightCode: 'TORQUE: 48.5 N·m', isSame: false, category: 'dimension', diffIndex: 9 },
  { id: 'qc-9', leftCode: 'BARCODE: 8992770144901', rightCode: 'BARCODE: 8992770144901', isSame: true, category: 'serial-code' },
  { id: 'qc-10', leftCode: 'VOLT: 220V/50Hz-12A', rightCode: 'VOLT: 220V/50Hz-1.2A', isSame: false, category: 'dimension', diffIndex: 16 },
  { id: 'qc-11', leftCode: 'PART# K45-N01-INJECT', rightCode: 'PART# K45-N01-INJECT', isSame: true, category: 'part-number' },
  { id: 'qc-12', leftCode: 'SN: 998012-XZ881-KL', rightCode: 'SN: 998012-XZ88I-KL', isSame: false, category: 'serial-code', diffIndex: 14 }, // 1 vs I
  { id: 'qc-13', leftCode: 'SPEC: DIN-7985-M4x10', rightCode: 'SPEC: DIN-7985-M4x10', isSame: true, category: 'part-number' },
  { id: 'qc-14', leftCode: 'MAT: SUS304-2B-1.5T', rightCode: 'MAT: SUS304-2B-1.5T', isSame: true, category: 'spec-label' },
  { id: 'qc-15', leftCode: 'BATCH: 2608-MYR-098', rightCode: 'BATCH: 2608-MYR-099', isSame: false, category: 'spec-label', diffIndex: 18 }
];

export const qcMultipleChoiceQuestions: BaseQuestion[] = [
  {
    id: 'qc-mc-1',
    category: 'qc-accuracy',
    question: 'Seorang inspektur QC memeriksa batas toleransi diameter poros as. Standar drawing: 25.00 mm ± 0.05 mm. Hasil ukur mikrometer manakah yang harus dinyatakan REJECT (NG)?',
    options: [
      'A. 24.96 mm',
      'B. 25.04 mm',
      'C. 25.06 mm',
      'D. 25.00 mm'
    ],
    correctAnswer: 2, // C (25.06)
    explanation: 'Batas toleransi adalah 24.95 mm (minimal) hingga 25.05 mm (maksimal). Nilai 25.06 mm melebihi batas toleransi atas sebesar 0.01 mm, sehingga benda kerja dinyatakan Reject / Not Good (NG).',
    quickTrick: '💡 Trik QC Drawing: Hitung batas bawah (Standar - Toleransi) dan batas atas (Standar + Toleransi). Angka di luar rentang tersebut pasti NG.'
  },
  {
    id: 'qc-mc-2',
    category: 'qc-accuracy',
    question: 'Di antara 4 deret kode produksi di bawah ini, manakah yang memiliki susunan karakter PERSIS SAMA dengan master kode [PT-EPS-2026-X99Z-01] ?',
    options: [
      'A. [PT-EPS-2026-X992-01]',
      'B. [PT-EPS-2026-X99Z-01]',
      'C. [PT-EPS-2026-X99Z-10]',
      'D. [PT-ESP-2026-X99Z-01]'
    ],
    correctAnswer: 1, // B
    explanation: 'Opsi A salah di angka 2 (seharusnya Z). Opsi C salah urutan 10 (seharusnya 01). Opsi D salah ketik ESP (seharusnya EPS). Hanya opsi B yang 100% identik.',
    quickTrick: '💡 Trik Ketelitian: Periksa dari belakang (posisi 01) lalu periksa tengah (X99Z). Mata manusia lebih cepat mendeteksi anomali jika diperiksa per-cluster 3 huruf.'
  }
];
