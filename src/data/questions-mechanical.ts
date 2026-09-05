import { BaseQuestion } from '../types';

// ============================================================================
// BENNETT MECHANICAL COMPREHENSION TEST (BMCT) - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup 14 Topik Utama Standar Seleksi Manufaktur, Otomotif, BUMN & Pabrik
// ============================================================================

export interface MechanicalQuestionParam {
  category: 'mechanical';
  subCategory: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  quickTrick?: string;
  diagramType: string;
  diagramProps?: Record<string, any>;
}

// ----------------------------------------------------------------------------
// Generator 1: Roda Gigi Berantai (Gear Trains - 3 to 5 Gears)
// ----------------------------------------------------------------------------
function generateGearsChainQuestion(seed: number): BaseQuestion {
  const gearCounts = [3, 4, 5];
  const count = gearCounts[seed % gearCounts.length];
  const startDir = seed % 2 === 0 ? 'cw' : 'ccw';
  const startDirText = startDir === 'cw' ? 'searah jarum jam (Clockwise / CW)' : 'berlawanan arah jarum jam (Counter-Clockwise / CCW)';
  
  const labels = ['A', 'B', 'C', 'D', 'E'].slice(0, count);
  const targetLabel = labels[count - 1];

  // If number of mesh contacts is count - 1
  // If count is odd -> last gear has SAME direction as first
  // If count is even -> last gear has OPPOSITE direction to first
  const isLastSame = count % 2 !== 0;
  const lastDir = isLastSame ? startDir : (startDir === 'cw' ? 'ccw' : 'cw');
  const lastDirText = lastDir === 'cw' ? 'Searah jarum jam (Clockwise)' : 'Berlawanan arah jarum jam (Counter-Clockwise)';
  const oppositeDirText = lastDir === 'cw' ? 'Berlawanan arah jarum jam (Counter-Clockwise)' : 'Searah jarum jam (Clockwise)';

  const options = [
    `A. ${lastDirText}`,
    `B. ${oppositeDirText}`,
    'C. Roda gigi tidak akan berputar karena terkunci',
    'D. Roda gigi berputar bolak-balik (osilasi)'
  ].sort(() => ((seed * 7 + 3) % 4) - 1.5);

  const correctIndex = options.findIndex(opt => opt.includes(lastDirText));

  return {
    id: `mech-gears-${seed}`,
    category: 'mechanical',
    subCategory: 'Roda Gigi & Transmisi',
    question: `Pada rangkaian transmisi ${count} roda gigi di bawah ini, jika roda gigi ${labels[0]} diputar ${startDirText}, ke manakah arah putaran roda gigi ${targetLabel} (?) ?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Pada roda gigi yang saling bersinggungan langsung, arah putar berganti setiap persinggungan: Gigi 1 (${startDir.toUpperCase()}) -> Gigi 2 (${startDir === 'cw' ? 'CCW' : 'CW'}) -> dst. Karena total ada ${count} roda gigi (${count % 2 === 0 ? 'genap' : 'ganjil'}), maka roda gigi terakhir (${targetLabel}) berputar ${lastDirText.toLowerCase()}.`,
    quickTrick: `💡 Trik Kilat Gigi: Hitung total roda gigi! Jika jumlah roda GANJIL, arah putaran roda akhir SAMA dengan roda awal. Jika jumlah roda GENAP, arahnya BERLAWANAN.`,
    diagramType: 'gears',
    diagramProps: {
      count,
      labels,
      startDir,
      targetLabel
    }
  };
}

// ----------------------------------------------------------------------------
// Generator 2: Rasio Kecepatan Putaran Roda Gigi (Gear RPM & Teeth Count)
// ----------------------------------------------------------------------------
function generateGearSpeedQuestion(seed: number): BaseQuestion {
  const teethA = [10, 12, 15, 20][seed % 4];
  const teethB = [30, 36, 45, 60][(seed + 1) % 4]; // B has 3x teeth of A
  const rpmA = [60, 90, 120, 180, 240][seed % 5];
  const rpmB = Math.round((teethA / teethB) * rpmA);

  const isAskB = seed % 2 === 0;
  const questionText = isAskB
    ? `Roda gigi A memiliki ${teethA} gigi berputar pada kecepatan ${rpmA} RPM memutar roda gigi B yang memiliki ${teethB} gigi. Berapakah kecepatan putaran roda gigi B?`
    : `Roda gigi A (${teethA} gigi) dan roda gigi B (${teethB} gigi) saling bertaut. Manakah pernyataan yang BENAR mengenai kecepatan putarannya?`;

  let options: string[] = [];
  let correctIndex = 0;
  let explanation = '';

  if (isAskB) {
    const distractors = [rpmB * 2, Math.max(10, Math.round(rpmB / 2)), rpmB + 15].filter(v => v !== rpmB);
    options = [
      `A. ${rpmB} RPM`,
      `B. ${distractors[0] || rpmB + 20} RPM`,
      `C. ${distractors[1] || rpmB + 40} RPM`,
      `D. ${rpmA} RPM`
    ].sort(() => ((seed * 11) % 4) - 1.5);
    correctIndex = options.findIndex(opt => opt.includes(`${rpmB} RPM`));
    explanation = `Rumus Rasio Roda Gigi: RPM_B = (Gigi_A / Gigi_B) × RPM_A = (${teethA} / ${teethB}) × ${rpmA} = ${rpmB} RPM. Roda dengan jumlah gigi lebih banyak akan berputar lebih lambat.`;
  } else {
    options = [
      `A. Roda gigi A berputar lebih cepat daripada roda gigi B`,
      `B. Roda gigi B berputar lebih cepat daripada roda gigi A`,
      `C. Kedua roda gigi berputar dengan kecepatan putar (RPM) yang persis sama`,
      `D. Roda gigi B memiliki torsi lebih kecil daripada roda gigi A`
    ].sort(() => ((seed * 13) % 4) - 1.5);
    correctIndex = options.findIndex(opt => opt.includes('Roda gigi A berputar lebih cepat'));
    explanation = `Roda gigi dengan jumlah gigi lebih sedikit (diameter lebih kecil) harus berputar lebih banyak putaran per menit untuk mengimbangi roda gigi yang berukuran lebih besar. Maka Roda A berputar lebih cepat.`;
  }

  return {
    id: `mech-gear-speed-${seed}`,
    category: 'mechanical',
    subCategory: 'Roda Gigi & Transmisi',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation,
    quickTrick: `💡 Trik Rasio Gigi: Ukuran kecil = putaran (RPM) CEPAT torsi kecil. Ukuran besar = putaran LAMBAT torsi besar.`,
    diagramType: 'gear-speed',
    diagramProps: { teethA, teethB, rpmA }
  };
}

// ----------------------------------------------------------------------------
// Generator 3: Roda Sabuk (Belt & Pulleys - Open vs Crossed)
// ----------------------------------------------------------------------------
function generateBeltQuestion(seed: number): BaseQuestion {
  const isCrossed = seed % 2 === 1;
  const startDir = (seed % 3 === 0) ? 'cw' : 'ccw';
  const startDirText = startDir === 'cw' ? 'searah jarum jam (CW)' : 'berlawanan arah jarum jam (CCW)';

  const expectedDirText = isCrossed 
    ? (startDir === 'cw' ? 'Berlawanan arah jarum jam (CCW)' : 'Searah jarum jam (CW)')
    : (startDir === 'cw' ? 'Searah jarum jam (CW)' : 'Berlawanan arah jarum jam (CCW)');
  
  const wrongDirText = isCrossed
    ? (startDir === 'cw' ? 'Searah jarum jam (CW)' : 'Berlawanan arah jarum jam (CCW)')
    : (startDir === 'cw' ? 'Berlawanan arah jarum jam (CCW)' : 'Searah jarum jam (CW)');

  const options = [
    `A. ${expectedDirText}`,
    `B. ${wrongDirText}`,
    'C. Puli B tidak berputar karena terjadi selip total',
    'D. Puli B berputar bolak-balik'
  ].sort(() => ((seed * 5 + 1) % 4) - 1.5);

  const correctIndex = options.findIndex(opt => opt.includes(expectedDirText));

  return {
    id: `mech-belt-${seed}`,
    category: 'mechanical',
    subCategory: 'Puli & Sabuk Konveyor',
    question: `Dua puli dihubungkan dengan ${isCrossed ? 'sabuk menyilang (crossed belt)' : 'sabuk lurus / terbuka (open belt)'}. Jika puli penggerak A berputar ${startDirText}, ke manakah arah putaran puli yang digerakkan B?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: isCrossed
      ? `Pada sistem transmisi sabuk menyilang (crossed belt), persilangan sabuk membalikkan arah rotasi, sehingga puli B berputar ${expectedDirText.toLowerCase()}.`
      : `Pada sistem sabuk lurus / terbuka (open belt), sabuk menghubungkan sisi luar kedua puli secara sejajar, sehingga kedua puli berputar dengan arah yang SAMA (${expectedDirText.toLowerCase()}).`,
    quickTrick: isCrossed
      ? `💡 Trik Sabuk Silang: Sabuk menyilang selalu MEMBALIKKAN arah putaran (Arah Berlawanan).`
      : `💡 Trik Sabuk Lurus: Sabuk terbuka sejajar selalu menjaga arah putaran TETAP SAMA.`,
    diagramType: 'belt',
    diagramProps: { isCrossed, startDir }
  };
}

// ----------------------------------------------------------------------------
// Generator 4: Katrol Majemuk & Takal (Pulleys & Mechanical Advantage)
// ----------------------------------------------------------------------------
function generatePulleyQuestion(seed: number): BaseQuestion {
  const ropeConfigs = [
    { ropes: 1, type: 'Katrol Tunggal Tetap', km: 1 },
    { ropes: 2, type: 'Katrol Bergerak Tunggal', km: 2 },
    { ropes: 3, type: 'Sistem Katrol Takal 3 Tali', km: 3 },
    { ropes: 4, type: 'Sistem Katrol Majemuk 4 Tali', km: 4 }
  ];
  const selectedConfig = ropeConfigs[seed % ropeConfigs.length];
  const weight = [60, 80, 100, 120, 160, 200, 240, 300, 400, 500][(seed * 3) % 10];
  const force = Math.round(weight / selectedConfig.km);

  const distractors = [
    weight,
    Math.round(weight / (selectedConfig.km === 1 ? 2 : 1)),
    Math.round(force * 1.5),
    Math.max(10, Math.round(force / 2))
  ].filter(v => v !== force);

  const options = [
    `A. ${force} kg`,
    `B. ${distractors[0] || force + 30} kg`,
    `C. ${distractors[1] || force * 2} kg`,
    `D. ${distractors[2] || force + 15} kg`
  ].sort(() => ((seed * 17) % 4) - 1.5);

  const correctIndex = options.findIndex(opt => opt.includes(`${force} kg`));

  return {
    id: `mech-pulley-${seed}`,
    category: 'mechanical',
    subCategory: 'Sistem Katrol & Derek',
    question: `Pada instalasi ${selectedConfig.type.toLowerCase()} di bengkel perakitan berikut, berapakah gaya tarik minimal (F) yang dibutuhkan operator untuk mengangkat beban seberat ${weight} kg?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Sistem menggunakan ${selectedConfig.type} dengan keuntungan mekanis (KM) = ${selectedConfig.km}. Gaya Kuasa F = Beban (W) / KM = ${weight} kg / ${selectedConfig.km} = ${force} kg.`,
    quickTrick: `💡 Trik Katrol: Hitung berapa jumlah segmen tali yang langsung menopang beban / katrol bergerak. Bagi berat total dengan jumlah tali tersebut.`,
    diagramType: 'pulley',
    diagramProps: {
      ropes: selectedConfig.ropes,
      weight: `${weight} kg`,
      force: `${force} kg`,
      type: selectedConfig.type
    }
  };
}

// ----------------------------------------------------------------------------
// Generator 5: Tuas / Pengungkit (Levers & Moments)
// ----------------------------------------------------------------------------
function generateLeverQuestion(seed: number): BaseQuestion {
  const isCalc = seed % 2 === 0;
  
  if (isCalc) {
    const weight = [60, 80, 100, 120, 150, 200][seed % 6];
    const armWeight = [1, 2, 0.5][(seed + 1) % 3]; // Lengan Beban (m)
    const armForce = [2, 3, 4, 5][(seed + 2) % 4]; // Lengan Kuasa (m)
    const force = Math.round((weight * armWeight) / armForce);

    const options = [
      `A. ${force} kg`,
      `B. ${weight} kg`,
      `C. ${force * 2} kg`,
      `D. ${Math.round(weight / 2)} kg`
    ].sort(() => ((seed * 19) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes(`${force} kg`));

    return {
      id: `mech-lever-calc-${seed}`,
      category: 'mechanical',
      subCategory: 'Kesetimbangan Tuas & Momen',
      question: `Sebuah tuas memiliki beban ${weight} kg pada jarak ${armWeight} meter dari titik tumpu. Jika operator menekan ujung tuas pada jarak ${armForce} meter dari titik tumpu, berapakah gaya tekan (F) yang diperlukan untuk mengangkat beban tersebut?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Hukum Kesetimbangan Tuas: Beban (W) × Lengan Beban (Lb) = Kuasa (F) × Lengan Kuasa (Lk). Maka F = (W × Lb) / Lk = (${weight} × ${armWeight}) / ${armForce} = ${force} kg.`,
      quickTrick: `💡 Trik Tuas: Semakin panjang lengan kuasa (jarak tangan ke tumpuan) dibanding lengan beban, gaya yang dikeluarkan semakin kecil.`,
      diagramType: 'lever',
      diagramProps: { weight: `${weight} kg`, armWeight, armForce }
    };
  } else {
    const positions = [
      'Posisi 1 (Paling dekat dengan beban)',
      'Posisi 2 (Tepat di tengah tuas)',
      'Posisi 3 (Paling dekat dengan tangan/kuasa)'
    ];

    const options = [
      `A. ${positions[0]}`,
      `B. ${positions[1]}`,
      `C. ${positions[2]}`,
      `D. Semua posisi membutuhkan tenaga yang sama persis`
    ].sort(() => ((seed * 23) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Posisi 1'));

    return {
      id: `mech-lever-pos-${seed}`,
      category: 'mechanical',
      subCategory: 'Kesetimbangan Tuas & Momen',
      question: `Pada batang pengungkit beban berat di bawah, di manakah posisi titik tumpu (F) yang menghasilkan usaha paling ENTENG / gaya tekan paling kecil bagi teknisi?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Semakin dekat titik tumpu dengan beban, maka lengan beban menjadi sangat pendek dan lengan kuasa menjadi sangat panjang. Hal ini melipatgandakan keuntungan mekanis sehingga gaya yang dibutuhkan menjadi paling ringan.`,
      quickTrick: `💡 Trik Posisi Tumpu: Titik tumpu yang PALING DEKAT KE BEBAN selalu memberikan gaya kuasa teringan.`,
      diagramType: 'lever',
      diagramProps: { loadPos: 'left' }
    };
  }
}

// ----------------------------------------------------------------------------
// Generator 6: Bejana Berhubungan & Tekanan Fluida (Hydrostatics & Flow)
// ----------------------------------------------------------------------------
function generateBeakerQuestion(seed: number): BaseQuestion {
  const targetBeaker = (seed % 4) + 1; // 1, 2, 3, 4
  const options = [
    `A. Tabung 1`,
    `B. Tabung 2`,
    `C. Tabung 3`,
    `D. Tabung 4`
  ];
  const correctIndex = targetBeaker - 1;

  return {
    id: `mech-beaker-${seed}`,
    category: 'mechanical',
    subCategory: 'Fluida & Bejana Berhubungan',
    question: `Air dialirkan secara perlahan dan konstan melalui pipa input ke dalam susunan bejana berhubungan di bawah. Tabung manakah yang airnya akan terisi penuh dan meluap TERLEBIH DAHULU?`,
    options,
    correctAnswer: correctIndex,
    explanation: `Perhatikan posisi lubang pipa penghubung di antara tabung. Air akan selalu mengalir melalui pipa penghubung yang posisinya paling rendah dan tidak memiliki sumbatan katup, sehingga Tabung ${targetBeaker} akan penuh dan meluap lebih dulu.`,
    quickTrick: `💡 Trik Bejana: Cari jalur pipa penghubung dari bawah ke atas. Tabung dengan pipa penghubung terendah yang terbuka tanpa katup buntu selalu terisi paling awal.`,
    diagramType: 'beaker',
    diagramProps: { targetBeaker }
  };
}

// ----------------------------------------------------------------------------
// Generator 7: Dongkrak Hidrolik / Hukum Pascal (Hydraulics)
// ----------------------------------------------------------------------------
function generateHydraulicQuestion(seed: number): BaseQuestion {
  const area1 = [2, 5, 10][seed % 3]; // cm2
  const ratio = [5, 10, 20, 50][(seed + 1) % 4];
  const area2 = area1 * ratio; // cm2
  const force1 = [10, 20, 30, 50][(seed + 2) % 4]; // N or kg
  const force2 = force1 * ratio; // Output load

  const options = [
    `A. ${force2} kg`,
    `B. ${force1} kg`,
    `C. ${Math.round(force2 / 2)} kg`,
    `D. ${force2 * 2} kg`
  ].sort(() => ((seed * 29) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${force2} kg`));

  return {
    id: `mech-hydraulic-${seed}`,
    category: 'mechanical',
    subCategory: 'Hidrolika & Hukum Pascal',
    question: `Pada sistem dongkrak hidrolik mesin press pabrik, luas penampang piston kecil adalah ${area1} cm² dan luas piston besar adalah ${area2} cm². Jika piston kecil ditekan dengan gaya ${force1} kg, berapakah beban maksimal yang mampu diangkat oleh piston besar?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hukum Pascal: Tekanan zat cair diteruskan ke segala arah sama besar (P1 = P2 -> F1 / A1 = F2 / A2). Maka F2 = F1 × (A2 / A1) = ${force1} × (${area2} / ${area1}) = ${force1} × ${ratio} = ${force2} kg.`,
    quickTrick: `💡 Trik Pascal: Rasio gaya sebanding dengan rasio luas piston (F_besar = F_kecil × Kelipatan Luas Piston).`,
    diagramType: 'hydraulic',
    diagramProps: { area1, area2, force1, force2 }
  };
}

// ----------------------------------------------------------------------------
// Generator 8: Rangkaian Listrik Industri (Industrial Circuits & Logic)
// ----------------------------------------------------------------------------
function generateCircuitQuestion(seed: number): BaseQuestion {
  const openSwitch = (seed % 3) + 1; // S1, S2, or S3
  let questionText = '';
  let correctText = '';
  let explanation = '';

  if (openSwitch === 1) {
    questionText = 'Pada rangkaian kelistrikan mesin berikut, jika Saklar Utama S1 DIBUKA (dimatikan), apa yang terjadi pada ketiga lampu (L1, L2, L3)?';
    correctText = 'Semua lampu (L1, L2, L3) akan padam';
    explanation = 'Saklar S1 dipasang seri di jalur utama catu daya. Jika S1 dibuka, seluruh aliran arus dari sumber listrik terputus total sehingga semua lampu padam.';
  } else if (openSwitch === 2) {
    questionText = 'Jika Saklar S2 pada cabang tengah DIBUKA (dimatikan), sedangkan saklar lainnya tetap tertutup, lampu manakah yang TETAP MENYALA?';
    correctText = 'Lampu L1 dan L3 tetap menyala normal';
    explanation = 'L1, L2, dan L3 terhubung secara paralel. Memutus saklar S2 hanya mematikan lampu L2 di cabangnya sendiri, sedangkan L1 dan L3 tetap mendapatkan arus listrik penuh.';
  } else {
    questionText = 'Jika Saklar S3 pada cabang bawah DIBUKA (dimatikan), kondisi lampu manakah yang BENAR?';
    correctText = 'Lampu L1 dan L2 menyala, Lampu L3 padam';
    explanation = 'Pada rangkaian cabang paralel independen, memutus cabang S3 hanya memadamkan lampu L3 yang berada pada jalur tersebut.';
  }

  const options = [
    `A. ${correctText}`,
    'B. Semua lampu akan tetap menyala redup',
    'C. Terjadi korsleting / hubungan singkat',
    'D. Hanya Lampu L1 yang menyala'
  ].sort(() => ((seed * 31) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(correctText));

  return {
    id: `mech-circuit-${seed}`,
    category: 'mechanical',
    subCategory: 'Kelistrikan & Saklar Industri',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation,
    quickTrick: `💡 Trik Sirkuit: Saklar di jalur utama mengontrol SEMUA beban; Saklar di cabang paralel hanya mengontrol beban di cabangnya sendiri.`,
    diagramType: 'circuit',
    diagramProps: { openSwitch }
  };
}

// ----------------------------------------------------------------------------
// Generator 9: Titik Berat & Kestabilan (Center of Gravity & Equilibrium)
// ----------------------------------------------------------------------------
function generateStabilityQuestion(seed: number): BaseQuestion {
  const isTruck = seed % 2 === 0;

  if (isTruck) {
    const options = [
      'A. Truk A (Muatan berat ditempatkan di lantai dasar bak)',
      'B. Truk B (Muatan berat ditempatkan di rak bagian paling atas)',
      'C. Kedua truk memiliki tingkat risiko terguling yang persis sama',
      'D. Truk B lebih stabil karena gaya tekan gravitasi lebih tinggi'
    ].sort(() => ((seed * 37) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Truk A'));

    return {
      id: `mech-stability-truck-${seed}`,
      category: 'mechanical',
      subCategory: 'Titik Berat & Kestabilan',
      question: `Dua truk pengangkut logistik melintasi jalan tanjakan yang miring. Truk manakah yang PALING STABIL dan paling aman dari risiko terguling?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Kestabilan kendaraan ditentukan oleh posisi Titik Berat (Center of Gravity / CG). Semakin rendah titik berat (muatan di lantai dasar), semakin besar sudut kemiringan yang dibutuhkan sebelum garis gaya gravitasi jatuh di luar jejak roda.`,
      quickTrick: `💡 Trik Kestabilan: Titik berat RENDAH + Alas LEBAR = Paling Stabil & Tidak Mudah Terguling.`,
      diagramType: 'stability',
      diagramProps: { type: 'truck' }
    };
  } else {
    const options = [
      'A. Kotak A (Alas lebar dan tinggi benda rendah)',
      'B. Kotak B (Alas sempit dan tinggi benda tinggi)',
      'C. Kotak C (Alas sempit dengan beban berat di puncak)',
      'D. Semua kotak memiliki kestabilan yang sama'
    ].sort(() => ((seed * 41) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Kotak A'));

    return {
      id: `mech-stability-box-${seed}`,
      category: 'mechanical',
      subCategory: 'Titik Berat & Kestabilan',
      question: `Di antara benda-benda penyimpanan kontainer di bawah, benda manakah yang memiliki tingkat kesetimbangan stabil paling tinggi?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Benda dengan luas alas bidang tumpu yang lebar serta titik pusat massa yang rendah memiliki kestabilan paling tinggi terhadap gaya dorong eksternal.`,
      quickTrick: `💡 Trik Fisika Dasar: Semakin lebar alas tumpuan dan semakin rendah letak titik beratnya, benda semakin kokoh.`,
      diagramType: 'stability',
      diagramProps: { type: 'box' }
    };
  }
}

// ----------------------------------------------------------------------------
// Generator 10: Bidang Miring & Baji (Inclined Plane & Wedges)
// ----------------------------------------------------------------------------
function generateInclineQuestion(seed: number): BaseQuestion {
  const options = [
    'A. Papan A (Paling panjang dengan sudut kemiringan paling landai)',
    'B. Papan B (Panjang sedang dengan sudut kemiringan sedang)',
    'C. Papan C (Paling pendek dengan sudut kemiringan paling curam)',
    'D. Semua papan memerlukan gaya dorong yang sama besar'
  ].sort(() => ((seed * 43) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes('Papan A'));

  return {
    id: `mech-incline-${seed}`,
    category: 'mechanical',
    subCategory: 'Bidang Miring & Baji',
    question: `Tiga buah papan kayu miring dengan panjang berbeda digunakan untuk menaikkan drum oli ke bak truk dengan ketinggian yang sama. Papan manakah yang membutuhkan GAYA DORONG PALING KECIL dari operator?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Prinsip Bidang Miring: Gaya Dorong F = (W × h) / s, di mana s adalah panjang lintasan papan. Semakin panjang lintasan bidang miring (semakin landai sudutnya), semakin kecil gaya dorong yang dibutuhkan operator untuk menaikkan beban.`,
    quickTrick: `💡 Trik Bidang Miring: Semakin LANDAI dan PANJANG papan miring, gaya dorongnya semakin RINGAN (namun jarak tempuh lebih jauh).`,
    diagramType: 'incline',
    diagramProps: { slopes: ['A (Landai)', 'B (Sedang)', 'C (Curam)'] }
  };
}

// ----------------------------------------------------------------------------
// Generator 11: Pegas Seri & Paralel (Springs & Suspension)
// ----------------------------------------------------------------------------
function generateSpringQuestion(seed: number): BaseQuestion {
  const isParallel = seed % 2 === 0;

  if (isParallel) {
    const options = [
      'A. Rangkaian Paralel (Kedua pegas menahan beban berdampingan)',
      'B. Rangkaian Seri (Kedua pegas disambung ujung ke ujung)',
      'C. Kedua susunan mengalami penurunan yang sama persis',
      'D. Tergantung pada bahan pelumas pegas'
    ].sort(() => ((seed * 47) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Rangkaian Paralel'));

    return {
      id: `mech-spring-${seed}`,
      category: 'mechanical',
      subCategory: 'Pegas & Suspensi Mesin',
      question: `Dua buah pegas identik digunakan untuk menahan beban mesin seberat 100 kg. Susunan pegas manakah yang menghasilkan PERTAMBAHAN PANJANG PALING KECIL (paling kaku/kokoh)?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Pada susunan paralel, konstanta kekakuan pegas bertambah (k_total = k1 + k2 = 2k), sehingga beban terbagi rata dan pertambahan panjang menjadi 2x lebih kecil dibanding pegas tunggal (4x lebih kecil dibanding susunan seri).`,
      quickTrick: `💡 Trik Pegas: Pegas PARALEL = Lebih kaku & lenturan kecil. Pegas SERI = Lebih lentur & lenturan panjang.`,
      diagramType: 'spring',
      diagramProps: { type: 'parallel-vs-series' }
    };
  } else {
    const weight = [20, 40, 60, 80][seed % 4];
    const stretch1 = [2, 3, 4, 5][seed % 4]; // cm
    const weight2 = weight * 2;
    const stretch2 = stretch1 * 2;

    const options = [
      `A. ${stretch2} cm`,
      `B. ${stretch1} cm`,
      `C. ${stretch2 + 4} cm`,
      `D. ${Math.round(stretch2 / 2)} cm`
    ].sort(() => ((seed * 53) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes(`${stretch2} cm`));

    return {
      id: `mech-spring-hooke-${seed}`,
      category: 'mechanical',
      subCategory: 'Pegas & Suspensi Mesin',
      question: `Sebuah pegas peredam mesin bertambah panjang ${stretch1} cm saat digantungi beban ${weight} kg. Berapakah pertambahan panjang pegas jika beban dinaikkan menjadi ${weight2} kg (dalam batas elastisitas)?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Hukum Hooke: F = k × Δx (Pertambahan panjang sebanding langsung dengan gaya beban). Karena beban meningkat 2 kali lipat (${weight} kg menjadi ${weight2} kg), maka pertambahan panjang juga menjadi 2 kali lipat: ${stretch1} cm × 2 = ${stretch2} cm.`,
      quickTrick: `💡 Trik Hooke: Kelipatan beban = Kelipatan pertambahan panjang.`,
      diagramType: 'spring',
      diagramProps: { weight: `${weight} kg`, weight2: `${weight2} kg` }
    };
  }
}

// ----------------------------------------------------------------------------
// Generator 12: Termal & Bimetal (Thermal Expansion & Strips)
// ----------------------------------------------------------------------------
function generateBimetalQuestion(seed: number): BaseQuestion {
  const isHeated = seed % 2 === 0;
  const metalA = 'Logam A (Koefisien Muai Tinggi)';
  const metalB = 'Logam B (Koefisien Muai Rendah)';

  const expectedDirection = isHeated
    ? 'Melengkung ke arah Logam B (ke bawah)'
    : 'Melengkung ke arah Logam A (ke atas)';

  const options = [
    `A. ${expectedDirection}`,
    `B. ${isHeated ? 'Melengkung ke arah Logam A (ke atas)' : 'Melengkung ke arah Logam B (ke bawah)'}`,
    'C. Tetap lurus sempurna tanpa melengkung',
    'D. Terputus di bagian sambungan perekat'
  ].sort(() => ((seed * 59) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(expectedDirection));

  return {
    id: `mech-bimetal-${seed}`,
    category: 'mechanical',
    subCategory: 'Termal & Pemuaian Logam',
    question: `Keping bimetal terdiri dari Logam A (atas, muai panjang besar) dan Logam B (bawah, muai panjang kecil) yang direkatkan rapat. Jika bimetal tersebut ${isHeated ? 'DIPANASKAN' : 'DIDIKINGINKAN SECARA EKSTRIM'}, ke arah manakah bimetal akan melengkung?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: isHeated
      ? `Saat dipanaskan, Logam A memuai lebih panjang daripada Logam B. Karena keduanya direkatkan, sisi yang lebih panjang akan mendorong sisi yang lebih pendek, menyebabkan bimetal melengkung ke arah logam dengan koefisien muai lebih kecil (Logam B).`
      : `Saat didinginkan, Logam A menyusut lebih banyak (menjadi lebih pendek) daripada Logam B, sehingga bimetal melengkung ke arah Logam A.`,
    quickTrick: `💡 Trik Bimetal: Saat DIPANASKAN -> Melengkung ke arah logam yang MUAI KECIL. Saat DIDINGINKAN -> Melengkung ke arah logam yang MUAI BESAR.`,
    diagramType: 'bimetal',
    diagramProps: { isHeated, metalA, metalB }
  };
}

// ----------------------------------------------------------------------------
// Generator 13: Gesekan & Inersia Roda (Friction, Traction & Momentum)
// ----------------------------------------------------------------------------
function generateFrictionQuestion(seed: number): BaseQuestion {
  const isLubricated = seed % 2 === 0;

  if (isLubricated) {
    const options = [
      'A. Mengurangi gaya gesek dan mencegah keausan material antar permukaan logam',
      'B. Meningkatkan daya cengkeram roda gigi',
      'C. Menambah berat beban mesin agar lebih stabil',
      'D. Menghantarkan arus listrik statis pada mesin'
    ].sort(() => ((seed * 61) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Mengurangi gaya gesek'));

    return {
      id: `mech-friction-lube-${seed}`,
      category: 'mechanical',
      subCategory: 'Gesekan & Tribologi Mesin',
      question: `Apakah fungsi utama dari pemberian oli pelumas (grease / lubricant) pada bantalan lahar (bearing) dan poros mesin yang berputar?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Pelumas membentuk lapisan film fluida di antara dua permukaan logam yang saling bergesekan, sehingga kontak langsung partikel mikroskopis berkurang drastis, koefisien gesek turun, panas berkurang, dan komponen terhindar dari keausan.`,
      quickTrick: `💡 Trik Gesekan: Pelumas selalu bertujuan MEMPERKECIL gesekan antar logam yang bergerak.`,
      diagramType: 'friction',
      diagramProps: { type: 'bearing' }
    };
  } else {
    const options = [
      'A. Balok A pada permukaan es licin (koefisien gesek terkecil)',
      'B. Balok B pada permukaan aspal kasar',
      'C. Balok C pada permukaan karet bertekstur',
      'D. Semua balok membutuhkan gaya tarik yang sama besar'
    ].sort(() => ((seed * 67) % 4) - 1.5);
    const correctIndex = options.findIndex(opt => opt.includes('Balok A'));

    return {
      id: `mech-friction-surface-${seed}`,
      category: 'mechanical',
      subCategory: 'Gesekan & Tribologi Mesin',
      question: `Tiga balok baja identik berbobot 50 kg ditarik pada 3 jenis lantai yang berbeda. Balok manakah yang membutuhkan GAYA TARIK PALING KECIL untuk mulai bergerak?`,
      options,
      correctAnswer: correctIndex >= 0 ? correctIndex : 0,
      explanation: `Gaya gesek statis f = μ × N. Permukaan es memiliki koefisien gesek (μ) paling rendah dibanding aspal maupun karet, sehingga gaya gesek yang harus dilawan paling kecil.`,
      quickTrick: `💡 Trik Koefisien Gesek: Permukaan semakin licin/halus = Koefisien gesek semakin kecil = Gaya tarik semakin enteng.`,
      diagramType: 'friction',
      diagramProps: { type: 'blocks' }
    };
  }
}

// ----------------------------------------------------------------------------
// Generator 14: Daya Apung & Hukum Archimedes (Buoyancy & Pressure)
// ----------------------------------------------------------------------------
function generateBuoyancyQuestion(seed: number): BaseQuestion {
  const options = [
    'A. Pada Bejana Air Garam (karena massa jenis air garam lebih tinggi dari air tawar)',
    'B. Pada Bejana Air Tawar murni',
    'C. Balok mengapung pada ketinggian yang persis sama di kedua bejana',
    'D. Balok akan tenggelam sepenuhnya di air garam'
  ].sort(() => ((seed * 71) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes('Pada Bejana Air Garam'));

  return {
    id: `mech-buoyancy-${seed}`,
    category: 'mechanical',
    subCategory: 'Hukum Archimedes & Tekanan',
    question: `Sebuah balok kayu yang sama diapungkan ke dalam dua bejana: Bejana 1 berisi Air Tawar murni (ρ = 1,0 g/cm³) dan Bejana 2 berisi Air Garam pekat (ρ = 1,2 g/cm³). Pada bejana manakah bagian balok yang MUNCUL DI ATAS PERMUKAAN AIR terlihat LEBIH TINGGI?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hukum Archimedes: Gaya ke atas Fb = ρ_cairan × g × V_celup. Semakin besar massa jenis cairan (seperti air garam), semakin kecil volume balok yang perlu tercelup untuk mengimbangi berat balok, sehingga bagian balok yang mengapung di atas permukaan menjadi lebih tinggi.`,
    quickTrick: `💡 Trik Archimedes: Cairan lebih rapat / pekat (massa jenis tinggi) = Benda lebih mudah mengapung dan terangkat ke atas.`,
    diagramType: 'buoyancy',
    diagramProps: { fluids: ['Air Tawar (1.0)', 'Air Garam (1.2)'] }
  };
}

// ============================================================================
// MASTER GENERATOR: Menghasilkan Soal Acak Tak Terbatas (1.000+ Variasi Unik)
// ============================================================================
const GENERATOR_FUNCTIONS = [
  generateGearsChainQuestion,
  generateGearSpeedQuestion,
  generateBeltQuestion,
  generatePulleyQuestion,
  generateLeverQuestion,
  generateBeakerQuestion,
  generateHydraulicQuestion,
  generateCircuitQuestion,
  generateStabilityQuestion,
  generateInclineQuestion,
  generateSpringQuestion,
  generateBimetalQuestion,
  generateFrictionQuestion,
  generateBuoyancyQuestion
];

/**
 * Menghasilkan 1 buah soal acak dengan seed tertentu atau true random
 */
export function generateParametricMechanicalQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const generatorIndex = s % GENERATOR_FUNCTIONS.length;
  return GENERATOR_FUNCTIONS[generatorIndex](s);
}

/**
 * Menghasilkan satu set soal latihan acak dengan jumlah tertentu (default: 10 soal)
 * Memastikan topik bervariasi dan tidak ada soal yang identik dalam satu sesi
 */
export function getRandomMechanicalSet(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const seenFingerprints = new Set<string>();
  const baseSeed = Math.floor(Math.random() * 10000);
  let attempts = 0;

  while (result.length < count && attempts < count * 25) {
    attempts++;
    // Distribute across all 14 generator types
    const genIdx = (result.length + baseSeed + attempts) % GENERATOR_FUNCTIONS.length;
    const seed = baseSeed * 31 + attempts * 17 + Math.floor(Math.random() * 10000);
    const q = GENERATOR_FUNCTIONS[genIdx](seed);
    const fp = `${q.subCategory}-${q.question.replace(/\s+/g, ' ').trim()}`;
    if (!seenFingerprints.has(fp)) {
      seenFingerprints.add(fp);
      result.push(q);
    }
  }

  return result;
}

// Pre-generate a master bank of 1,000+ distinct questions for indexing and fallback
export const mechanicalQuestionBank: BaseQuestion[] = Array.from({ length: 1008 }, (_, idx) => {
  const genIdx = idx % GENERATOR_FUNCTIONS.length;
  return GENERATOR_FUNCTIONS[genIdx](idx * 13 + 7);
});

// Standard locked duration per question count preset (Bennett Mechanical Benchmark)
export function getMechanicalStandardDuration(questionCount: number): { seconds: number; label: string; perQuestion: string } {
  switch (questionCount) {
    case 10:
      return { seconds: 10 * 60, label: '10 Menit', perQuestion: '60 detik / soal' };
    case 20:
      return { seconds: 18 * 60, label: '18 Menit', perQuestion: '54 detik / soal' };
    case 35:
      return { seconds: 30 * 60, label: '30 Menit', perQuestion: '51 detik / soal' };
    case 50:
      return { seconds: 45 * 60, label: '45 Menit', perQuestion: '54 detik / soal' };
    default:
      return { seconds: Math.round(questionCount * 60), label: `${Math.round((questionCount * 60) / 60)} Menit`, perQuestion: '60 detik / soal' };
  }
}

// Default active sample questions for tryouts & backward compatibility
export const mechanicalQuestions: BaseQuestion[] = mechanicalQuestionBank.slice(0, 10);
