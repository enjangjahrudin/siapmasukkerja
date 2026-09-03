import { BaseQuestion } from '../types';

export const arithmeticQuestions: BaseQuestion[] = [
  {
    id: 'arith-1',
    category: 'arithmetic',
    question: 'Berapakah kelanjutan dari deret angka berikut: 3, 6, 12, 24, 48, ... ?',
    options: ['A. 72', 'B. 84', 'C. 96', 'D. 108'],
    correctAnswer: 2, // C (96)
    explanation: 'Pola deret adalah perkalian dengan 2 (x2 pada setiap langkah). 3x2=6, 6x2=12, 12x2=24, 24x2=48, 48x2 = 96.',
    quickTrick: '💡 Trik Deret Geometri: Cek rasio suku kedua terhadap suku pertama (6 / 3 = 2). Kalikan suku terakhir langsung dengan 2: 48 x 2 = 96.'
  },
  {
    id: 'arith-2',
    category: 'arithmetic',
    question: 'Tentukan dua angka selanjutnya dari deret bertingkat: 4, 7, 12, 19, 28, ..., ... ?',
    options: ['A. 37, 48', 'B. 39, 52', 'C. 38, 50', 'D. 40, 54'],
    correctAnswer: 1, // B (39, 52)
    explanation: 'Selisih antar suku adalah bilangan ganjil bertambah: +3, +5, +7, +9, +11, +13. Maka: 28 + 11 = 39, lalu 39 + 13 = 52.',
    quickTrick: '💡 Trik Selisih Tingkat 1: Tulis selisih di atas deret: (+3, +5, +7, +9). Pola selisihnya konsisten naik +2.'
  },
  {
    id: 'arith-3',
    category: 'arithmetic',
    question: 'Jika 6 orang operator perakitan dapat merakit 180 unit komponen dalam waktu 3 jam, berapa unitkah yang dapat dirakit oleh 10 orang operator dalam waktu 5 jam?',
    options: ['A. 360 unit', 'B. 450 unit', 'C. 500 unit', 'D. 600 unit'],
    correctAnswer: 2, // C (500 unit)
    explanation: 'Kapasitas 1 orang per jam = 180 unit / (6 operator x 3 jam) = 180 / 18 = 10 unit per orang-jam. Untuk 10 operator selama 5 jam = 10 orang x 5 jam x 10 unit/jam = 500 unit.',
    quickTrick: '💡 Trik Perbandingan Gabungan: Rumus Produk (P) / (Orang x Waktu) = Konstan. 180 / (6 x 3) = P2 / (10 x 5) -> 10 = P2 / 50 -> P2 = 500 unit.'
  },
  {
    id: 'arith-4',
    category: 'arithmetic',
    question: 'Sebuah mesin cetak pabrik menghasilkan 1.200 botol per shift. Dari jumlah tersebut ditemukan 36 botol cacat (defect). Berapakah persentase produk cacat (defect rate)?',
    options: ['A. 2.5%', 'B. 3.0%', 'C. 3.6%', 'D. 4.0%'],
    correctAnswer: 1, // B (3.0%)
    explanation: 'Defect Rate = (Jumlah Cacat / Total Produksi) x 100% = (36 / 1200) x 100% = 36 / 12 = 3.0%.',
    quickTrick: '💡 Trik Coret Nol Persen: Coret dua nol pada penyebut (1200 menjadi 12), lalu bagi langsung 36 / 12 = 3%.'
  },
  {
    id: 'arith-5',
    category: 'arithmetic',
    question: 'Berapakah kelanjutan dari deret kombinasi huruf dan angka: A, 2, C, 4, E, 8, G, 16, ..., ... ?',
    options: ['A. H, 32', 'B. I, 32', 'C. I, 24', 'D. J, 32'],
    correctAnswer: 1, // B (I, 32)
    explanation: 'Pola terbagi 2: Deret huruf melompat 1 huruf (A, C, E, G, I). Deret angka dikali 2 (2, 4, 8, 16, 32). Sehingga jawabannya adalah I dan 32.',
    quickTrick: '💡 Trik Deret Lompat/Kombinasi: Pisahkan posisi ganjil (huruf) dan posisi genap (angka). Kerjakan secara mandiri.'
  }
];
