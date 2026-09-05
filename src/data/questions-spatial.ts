import { BaseQuestion } from '../types';

// ============================================================================
// SPATIAL REASONING & 3D ROTATION - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup Jaring Kubus, Hitung Balok Tumpuk, Rotasi 2D/3D, & Lipatan Kertas
// ============================================================================

const CUBE_SYMBOLS = ['★ (Bintang)', '● (Lingkaran)', '■ (Kotak)', '▲ (Segitiga)', '✖ (Silang)', '◆ (Belah Ketupat)'];

// ----------------------------------------------------------------------------
// Generator 1: Jaring-jaring Kubus 3D (Opposite Face Prediction)
// ----------------------------------------------------------------------------
function generateCubeNetQuestion(seed: number): BaseQuestion {
  const symbols = [...CUBE_SYMBOLS].sort(() => ((seed * 7) % 6) - 2.5);
  
  // Cross net standard layout:
  // Row 1: [0]
  // Row 2: [1], [2], [3], [4] -> 1 is opposite to 3, 2 is opposite to 4
  // Row 3: [5] -> 0 is opposite to 5
  const oppositePairs = [
    { target: symbols[0], opposite: symbols[5] },
    { target: symbols[1], opposite: symbols[3] },
    { target: symbols[2], opposite: symbols[4] }
  ];

  const chosenPair = oppositePairs[seed % oppositePairs.length];
  const distractors = symbols.filter(s => s !== chosenPair.opposite && s !== chosenPair.target);

  const options = [
    `A. Sisi ${chosenPair.opposite}`,
    `B. Sisi ${distractors[0]}`,
    `C. Sisi ${distractors[1]}`,
    `D. Sisi ${distractors[2]}`
  ].sort(() => ((seed * 11) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(chosenPair.opposite));

  return {
    id: `spa-cube-${seed}`,
    category: 'spatial',
    subCategory: 'Jaring-jaring Kubus 3D',
    question: `Jika pola jaring-jaring kertas di bawah dilipat menjadi bangun kubus 3D tertutup sempurna, sisi manakah yang akan BERHADAPAN LANGSUNG (saling berseberangan) dengan sisi berlogo "${chosenPair.target}"?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pada pola jaring-jaring kubus bentuk salib standar, dua bidang yang berada pada satu garis lurus dan berselang SATU kotak (melompati 1 bidang) pasti akan menjadi pasangan sisi yang saling berhadapan saat dirakit menjadi kubus 3 dimensi. Maka sisi "${chosenPair.target}" berhadapan dengan "${chosenPair.opposite}".`,
    quickTrick: `💡 Trik Selang 1 Kotak: Pada satu deret lurus, lewati tepat 1 kotak untuk menemukan sisi pasangannya yang saling berhadapan.`,
    diagramType: 'cube-net',
    diagramProps: { faces: symbols }
  };
}

// ----------------------------------------------------------------------------
// Generator 2: Hitung Jumlah Kubus / Balok Susun 3D
// ----------------------------------------------------------------------------
function generateBlockCountQuestion(seed: number): BaseQuestion {
  const layer1 = [9, 12, 16, 20][seed % 4]; // Base layer (e.g. 3x3=9, 3x4=12, 4x4=16)
  const layer2 = [4, 6, 8, 9][(seed + 1) % 4];
  const layer3 = [2, 3, 4][(seed + 2) % 3];
  const layer4 = [0, 1, 2][(seed + 3) % 3];

  const totalCubes = layer1 + layer2 + layer3 + layer4;

  const distractors = [totalCubes - 2, totalCubes + 3, totalCubes - 4].filter(v => v !== totalCubes);
  const options = [
    `A. ${totalCubes} kubus satuan`,
    `B. ${distractors[0] || totalCubes + 2} kubus satuan`,
    `C. ${distractors[1] || totalCubes - 3} kubus satuan`,
    `D. ${distractors[2] || totalCubes + 5} kubus satuan`
  ].sort(() => ((seed * 13) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${totalCubes} kubus`));

  return {
    id: `spa-count-${seed}`,
    category: 'spatial',
    subCategory: 'Hitung Balok Tumpuk 3D',
    question: `Berapakah jumlah total kubus satuan penyusun bangun ruang 3D bertingkat di bawah (termasuk kubus pondasi tersembunyi yang menopang lantai di atasnya)?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hitung secara bertingkat dari lantai dasar ke atas: Lantai 1 = ${layer1} kubus, Lantai 2 = ${layer2} kubus, Lantai 3 = ${layer3} kubus${layer4 > 0 ? `, Lantai 4 = ${layer4} kubus` : ''}. Total kubus = ${totalCubes} kubus.`,
    quickTrick: `💡 Trik Hitung Balok: Hitung per-lantai dari bawah ke atas. Jangan lupa bahwa kubus di lantai atas selalu ditopang oleh kubus di bawahnya walau tidak terlihat dari depan.`,
    diagramType: 'stacked-cubes',
    diagramProps: { layer1, layer2, layer3, layer4, total: totalCubes }
  };
}

// ----------------------------------------------------------------------------
// Generator 3: Rotasi Objek 2D & 3D (90°, 180°, 270°)
// ----------------------------------------------------------------------------
function generateRotationQuestion(seed: number): BaseQuestion {
  const degrees = [90, 180, 270][seed % 3];
  const dir = seed % 2 === 0 ? 'searah jarum jam (Clockwise / CW)' : 'berlawanan arah jarum jam (Counter-Clockwise / CCW)';
  
  const options = [
    'A. Gambar Opsi A (Posisi fitur utama berputar tepat sesuai sudut rotasi)',
    'B. Gambar Opsi B (Hasil pencerminan / mirror terbalik)',
    'C. Gambar Opsi C (Posisi rotasi 90 derajat lebih awal)',
    'D. Gambar Opsi D (Posisi tidak berubah)'
  ].sort(() => ((seed * 17) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes('Gambar Opsi A'));

  return {
    id: `spa-rot-${seed}`,
    category: 'spatial',
    subCategory: 'Rotasi Objek 2D & 3D',
    question: `Jika bangun 2 dimensi berikut diputar sebesar ${degrees} derajat ${dir}, manakah bentuk hasil rotasi yang PALING TEPAT?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pilih satu titik penanda khusus (misal: panah atau titik hitam di sudut). Putar titik tersebut sebesar ${degrees}° ${dir}. Opsi A adalah satu-satunya gambar yang mempertahankan orientasi geometris yang benar tanpa terjadi pencerminan terbalik.`,
    quickTrick: `💡 Trik Rotasi: Kunci pandangan pada SATU elemen unik (misal: lekukan atau titik hitam) dan bayangkan ke mana titik tersebut berpindah setelah diputar.`
  };
}

// ----------------------------------------------------------------------------
// Generator 4: Lipatan Kertas & Lubang (Paper Folding & Punching)
// ----------------------------------------------------------------------------
function generatePaperFoldQuestion(seed: number): BaseQuestion {
  const folds = [2, 3][seed % 2]; // Dilipat 2x (4 lapis) atau 3x (8 lapis)
  const holesPunched = [1, 2][(seed + 1) % 2];
  const totalHoles = holesPunched * Math.pow(2, folds);

  const options = [
    `A. ${totalHoles} lubang simetris`,
    `B. ${totalHoles / 2} lubang`,
    `C. ${totalHoles + 2} lubang`,
    `D. ${holesPunched} lubang saja`
  ].sort(() => ((seed * 19) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${totalHoles} lubang`));

  return {
    id: `spa-fold-${seed}`,
    category: 'spatial',
    subCategory: 'Lipatan & Lubang Kertas',
    question: `Sebuah kertas persegi dilipat sebanyak ${folds} kali lipatan simetris, kemudian dilubangi dengan ${holesPunched} lubang tembus. Saat kertas dibuka kembali secara utuh, berapakah jumlah total lubang yang terbentuk?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Setiap lipatan melipatgandakan jumlah lapisan kertas sebanyak 2 kali (2^${folds} = ${Math.pow(2, folds)} lapisan). Dengan ${holesPunched} lubang tembus, jumlah lubang saat dibuka adalah ${holesPunched} × ${Math.pow(2, folds)} = ${totalHoles} lubang simetris.`,
    quickTrick: `💡 Trik Lipatan: Rumus Total Lubang = Jumlah Lubang Tembus × 2^(Jumlah Lipatan).`
  };
}

// ============================================================================
// MASTER SPATIAL GENERATOR & BANK (1.000+ SOAL)
// ============================================================================
const SPATIAL_GENERATORS = [
  generateCubeNetQuestion,
  generateBlockCountQuestion,
  generateRotationQuestion,
  generatePaperFoldQuestion
];

export function generateParametricSpatialQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % SPATIAL_GENERATORS.length;
  return SPATIAL_GENERATORS[genIdx](s);
}

export function getRandomSpatialSet(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const seenFingerprints = new Set<string>();
  const baseSeed = Math.floor(Math.random() * 10000);
  let attempts = 0;

  while (result.length < count && attempts < count * 25) {
    attempts++;
    const genIdx = (result.length + baseSeed + attempts) % SPATIAL_GENERATORS.length;
    const seed = baseSeed * 41 + attempts * 23 + Math.floor(Math.random() * 10000);
    const q = SPATIAL_GENERATORS[genIdx](seed);
    const fp = `${q.subCategory}-${q.question.replace(/\s+/g, ' ').trim()}`;
    if (!seenFingerprints.has(fp)) {
      seenFingerprints.add(fp);
      result.push(q);
    }
  }

  return result;
}

export const spatialQuestionBank: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % SPATIAL_GENERATORS.length;
  return SPATIAL_GENERATORS[genIdx](idx * 29 + 13);
});

export const spatialQuestions: BaseQuestion[] = spatialQuestionBank.slice(0, 10);
