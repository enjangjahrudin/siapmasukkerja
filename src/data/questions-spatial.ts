import { BaseQuestion } from '../types';

export const spatialQuestions: BaseQuestion[] = [
  {
    id: 'spatial-1',
    category: 'spatial',
    question: 'Jika pola jaring-jaring di bawah ini dilipat menjadi sebuah kubus 3D tertutup, pola sisi manakah yang akan berhadapan langsung (saling berseberangan) dengan sisi berlogo BINTANG (★)?',
    options: [
      'A. Sisi Lingkaran (●)',
      'B. Sisi Kotak Hitam (■)',
      'C. Sisi Segitiga (▲)',
      'D. Sisi Tanda Silang (✖)'
    ],
    correctAnswer: 2, // C (Segitiga)
    explanation: 'Pada jaring-jaring kubus bentuk salib standar, dua sisi yang berada pada satu garis lurus dan berselang 1 kotak pasti akan menjadi sisi yang saling berhadapan saat dirakit menjadi kubus 3D.',
    quickTrick: '💡 Trik Jaring Kubus: Prinsip Selang 1 Kotak! Bidang yang berhadapan selalu melompati 1 kotak pada satu baris atau kolom yang sama.',
    diagramType: 'cube-net',
    diagramProps: {
      faces: ['●', '★', '■', '▲', '✖', '◆']
    }
  },
  {
    id: 'spatial-2',
    category: 'spatial',
    question: 'Berapakah jumlah total kubus satuan kecil yang menyusun bangun ruang 3 dimensi di bawah ini (termasuk kubus yang tertutup di bagian dalam/bawah)?',
    options: ['A. 14 kubus', 'B. 16 kubus', 'C. 18 kubus', 'D. 20 kubus'],
    correctAnswer: 1, // B (16 kubus)
    explanation: 'Hitung berdasarkan lapisan vertikal (lantai): Lantai dasar (Layer 1) = 9 kubus (3x3). Lantai 2 = 5 kubus. Lantai 3 = 2 kubus. Total = 9 + 5 + 2 = 16 kubus.',
    quickTrick: '💡 Trik Hitung Balok/Kubus: Hitung per tingkat lantai dari bawah ke atas. Jangan lupakan kubus tak terlihat yang menopang lantai di atasnya.'
  },
  {
    id: 'spatial-3',
    category: 'spatial',
    question: 'Jika gambar pola di bawah diputar 90 derajat searah jarum jam (Clockwise), gambar manakah hasil rotasi yang tepat?',
    options: ['A. Opsi A', 'B. Opsi B', 'C. Opsi C', 'D. Opsi D'],
    correctAnswer: 0, // A
    explanation: 'Perhatikan titik sudut hitam di kiri atas. Jika diputar 90 derajat searah jarum jam, titik sudut tersebut akan berpindah tepat ke pojok kanan atas.',
    quickTrick: '💡 Trik Rotasi Gambar: Fokuskan pandangan hanya pada SATU ciri khas (misal: panah atau titik tebal), lacak ke mana titik itu bergerak.'
  }
];
