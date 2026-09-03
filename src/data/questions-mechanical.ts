import { BaseQuestion } from '../types';

export const mechanicalQuestions: BaseQuestion[] = [
  {
    id: 'mech-1',
    category: 'mechanical',
    question: 'Jika roda gigi A diputar searah jarum jam (CW), ke arah manakah roda gigi D akan berputar?',
    options: [
      'A. Searah jarum jam (Clockwise)',
      'B. Berlawanan arah jarum jam (Counter-Clockwise)',
      'C. Roda D tidak akan berputar',
      'D. Roda D berputar bolak-balik'
    ],
    correctAnswer: 1, // B
    explanation: 'Pada susunan roda gigi yang saling bersentuhan: Gigi 1 (CW) -> Gigi 2 (CCW) -> Gigi 3 (CW) -> Gigi 4 (CCW). Karena ada 4 roda gigi (jumlah genap), arah putaran roda terakhir akan berlawanan arah dengan roda pertama.',
    quickTrick: '💡 Trik Kilat Nalar: Hitung jumlah roda gigi! Jika jumlah total roda bernilai GENAP, maka arah roda akhir BERLAWANAN arah awal. Jika GANJIL, arahnya SAMA dengan roda awal.',
    diagramType: 'gears',
    diagramProps: {
      gears: [
        { label: 'A', dir: 'cw', teeth: 12, x: 70, y: 70, r: 40 },
        { label: 'B', dir: 'ccw', teeth: 16, x: 145, y: 70, r: 35 },
        { label: 'C', dir: 'cw', teeth: 12, x: 215, y: 70, r: 35 },
        { label: 'D', dir: 'ccw', teeth: 18, x: 290, y: 70, r: 40 }
      ]
    }
  },
  {
    id: 'mech-2',
    category: 'mechanical',
    question: 'Pada sistem katrol di bawah ini, berapakah gaya tarik (F) minimal yang diperlukan untuk mengangkat beban seberat 120 kg?',
    options: [
      'A. 120 kg',
      'B. 60 kg',
      'C. 40 kg',
      'D. 30 kg'
    ],
    correctAnswer: 1, // B (60 kg)
    explanation: 'Sistem katrol menggunakan 1 katrol tetap dan 1 katrol bergerak (katrol majemuk sederhana dengan 2 tali penopang beban). Keuntungan mekanis (KM) = 2. Maka Gaya (F) = Beban (W) / 2 = 120 kg / 2 = 60 kg.',
    quickTrick: '💡 Trik Katrol: Hitung jumlah tali yang menahan katrol bergerak yang menggantung beban. Bagi berat beban dengan jumlah tali penopang tersebut (W / jumlah tali).',
    diagramType: 'pulley',
    diagramProps: {
      weight: '120 kg',
      ropeCount: 2
    }
  },
  {
    id: 'mech-3',
    category: 'mechanical',
    question: 'Pada tuas pengungkit di bawah ini, di titik manakah posisi tumpuan (F) yang memberikan usaha paling ringan bagi operator untuk mengangkat beban W?',
    options: [
      'A. Posisi 1 (Paling dekat dengan beban)',
      'B. Posisi 2 (Tepat di tengah)',
      'C. Posisi 3 (Paling dekat dengan kuasa/tangan)',
      'D. Semua posisi membutuhkan tenaga yang persis sama'
    ],
    correctAnswer: 0, // A
    explanation: 'Prinsip kesetimbangan tuas: Beban x Lengan Beban = Kuasa x Lengan Kuasa. Semakin dekat titik tumpu ke beban (Lengan beban semakin pendek dan Lengan kuasa semakin panjang), semakin kecil gaya kuasa yang dibutuhkan operator untuk mengangkat beban.',
    quickTrick: '💡 Trik Tuas: Semakin panjang jarak tangan ke titik tumpu dibanding jarak beban ke titik tumpu, tenaga yang dikeluarkan semakin enteng.',
    diagramType: 'lever',
    diagramProps: {
      loadPos: 'left',
      pivotPoints: ['1 (Dekat Beban)', '2 (Tengah)', '3 (Dekat Tangan)']
    }
  },
  {
    id: 'mech-4',
    category: 'mechanical',
    question: 'Jika kran utama dibuka dan air mengalir stabil ke dalam bejana berhubungan di bawah, tabung manakah yang airnya akan penuh dan tumpah terlebih dahulu?',
    options: [
      'A. Tabung 1',
      'B. Tabung 2',
      'C. Tabung 3',
      'D. Tabung 4'
    ],
    correctAnswer: 2, // C
    explanation: 'Perhatikan ketinggian pipa penghubung dan katup penutup pada masing-masing bejana. Pipa yang menghubungkan ke Tabung 3 berada pada posisi paling rendah dan tidak memiliki sumbatan, sehingga air akan terisi penuh di Tabung 3 lebih dulu.',
    quickTrick: '💡 Trik Bejana: Teliti jalan pipa penghubung dari bawah ke atas. Cari bejana yang posisinya paling rendah dan pipanya tidak buntu.',
    diagramType: 'beaker',
    diagramProps: {
      activeTarget: 3
    }
  },
  {
    id: 'mech-5',
    category: 'mechanical',
    question: 'Pada rangkaian listrik lampu pabrik di bawah ini, jika saklar S2 dibuka (dimatikan), lampu mana sajakah yang tetap menyala?',
    options: [
      'A. Hanya Lampu L1',
      'B. Lampu L1 dan L3',
      'C. Semua lampu akan padam',
      'D. Hanya Lampu L2'
    ],
    correctAnswer: 1, // B
    explanation: 'Lampu L2 dirangkai seri dengan saklar S2 pada cabang paralel tengah. Lampu L1 dan L3 berada pada cabang paralel yang berbeda langsung ke sumber arus listrik. Sehingga jika S2 dibuka, hanya L2 yang padam, sedangkan L1 dan L3 tetap menyala normal.',
    quickTrick: '💡 Trik Sirkuit Paralel: Jalur paralel independen! Memutus satu cabang tidak akan memadamkan cabang lain yang terhubung langsung ke kutub baterai.',
    diagramType: 'circuit',
    diagramProps: {
      switches: ['S1 (On)', 'S2 (Off)', 'S3 (On)']
    }
  }
];
