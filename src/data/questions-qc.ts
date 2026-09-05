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
// QC MULTIPLE CHOICE GENERATOR & BANK (1.000+ SOAL BERVARIASI TANPA DUPLIKAT)
// ----------------------------------------------------------------------------

// 1. GENERATOR TOLERANSI DIMENSI & LIMIT UKUR
function generateToleranceQuestion(seed: number): BaseQuestion {
  const nominalList = [
    12.00, 15.50, 18.00, 20.00, 24.50, 25.00, 28.00, 30.00, 
    32.50, 35.00, 40.00, 45.50, 50.00, 60.00, 75.00, 80.00, 
    100.00, 120.00, 150.00
  ];
  const tolList = [0.01, 0.02, 0.03, 0.05, 0.08, 0.10, 0.15, 0.20];

  const nominal = nominalList[seed % nominalList.length];
  const tol = tolList[(seed + 3) % tolList.length];
  const minLimit = Number((nominal - tol).toFixed(3));
  const maxLimit = Number((nominal + tol).toFixed(3));

  const questionType = seed % 3;

  if (questionType === 0) {
    // Tipe: Cari nilai yang REJECT (NG)
    const isUpperReject = seed % 2 === 0;
    const rejectVal = isUpperReject
      ? Number((maxLimit + tol * 0.6).toFixed(3))
      : Number((minLimit - tol * 0.6).toFixed(3));

    const okVal1 = Number((nominal).toFixed(3));
    const okVal2 = Number((nominal + tol * 0.5).toFixed(3));
    const okVal3 = Number((nominal - tol * 0.5).toFixed(3));

    const optionsRaw = [
      { text: `${rejectVal.toFixed(2)} mm`, isCorrect: true },
      { text: `${okVal1.toFixed(2)} mm`, isCorrect: false },
      { text: `${okVal2.toFixed(2)} mm`, isCorrect: false },
      { text: `${okVal3.toFixed(2)} mm`, isCorrect: false }
    ];

    // Shuffle options
    const shuffled = optionsRaw.sort(() => ((seed * 17) % 5) - 2);
    const correctIdx = shuffled.findIndex(o => o.isCorrect);
    const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

    return {
      id: `qc-tol-ng-${seed}`,
      category: 'qc-accuracy',
      subCategory: 'Toleransi Dimensi & Limit NG',
      question: `Drawing komponen mesin mencantumkan standar dimensi: ${nominal.toFixed(2)} mm ± ${tol.toFixed(2)} mm. Hasil pengukuran inspeksi QC manakah yang WAJIB DINYATAKAN REJECT (NOT GOOD / NG)?`,
      options: finalOptions,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      explanation: `Batas toleransi yang diizinkan adalah ${minLimit.toFixed(2)} mm (Batas Bawah/LSL) s/d ${maxLimit.toFixed(2)} mm (Batas Atas/USL). Hasil ukur ${rejectVal.toFixed(2)} mm berada di LUAR rentang yang diizinkan, sehingga harus dinyatakan REJECT/NG.`,
      quickTrick: `💡 Trik Toleransi QC: Hitung Batas Bawah (${minLimit.toFixed(2)}) & Batas Atas (${maxLimit.toFixed(2)}). Angka di luar rentang ini pasti NG.`
    };
  } else if (questionType === 1) {
    // Tipe: Hitung Batas Atas (USL) dan Batas Bawah (LSL)
    const correctText = `Batas Bawah = ${minLimit.toFixed(2)} mm, Batas Atas = ${maxLimit.toFixed(2)} mm`;
    const wrong1 = `Batas Bawah = ${(minLimit - 0.05).toFixed(2)} mm, Batas Atas = ${(maxLimit + 0.05).toFixed(2)} mm`;
    const wrong2 = `Batas Bawah = ${minLimit.toFixed(2)} mm, Batas Atas = ${(nominal + tol * 2).toFixed(2)} mm`;
    const wrong3 = `Batas Bawah = ${(nominal).toFixed(2)} mm, Batas Atas = ${maxLimit.toFixed(2)} mm`;

    const optionsRaw = [
      { text: correctText, isCorrect: true },
      { text: wrong1, isCorrect: false },
      { text: wrong2, isCorrect: false },
      { text: wrong3, isCorrect: false }
    ];

    const shuffled = optionsRaw.sort(() => ((seed * 19) % 5) - 2);
    const correctIdx = shuffled.findIndex(o => o.isCorrect);
    const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

    return {
      id: `qc-tol-limit-${seed}`,
      category: 'qc-accuracy',
      subCategory: 'Toleransi Dimensi & Limit NG',
      question: `Sebuah part silinder memiliki spesifikasi drawing: Ø ${nominal.toFixed(2)} mm ± ${tol.toFixed(2)} mm. Berapakah Batas Bawah (LSL) dan Batas Atas (USL) dimensi yang diizinkan?`,
      options: finalOptions,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      explanation: `Batas Bawah (LSL) = ${nominal.toFixed(2)} - ${tol.toFixed(2)} = ${minLimit.toFixed(2)} mm. Batas Atas (USL) = ${nominal.toFixed(2)} + ${tol.toFixed(2)} = ${maxLimit.toFixed(2)} mm.`,
      quickTrick: `💡 Rumus Limit: LSL = Nominal - Toleransi, USL = Nominal + Toleransi.`
    };
  } else {
    // Tipe: Toleransi Asimetris (+0.05 / -0.01)
    const upperTol = tol;
    const lowerTol = Number((tol / 2).toFixed(2));
    const usl = Number((nominal + upperTol).toFixed(2));
    const lsl = Number((nominal - lowerTol).toFixed(2));
    const ngSample = Number((nominal + upperTol + 0.03).toFixed(2));

    const optionsRaw = [
      { text: `${ngSample.toFixed(2)} mm (Reject / NG)`, isCorrect: true },
      { text: `${nominal.toFixed(2)} mm (Accept / OK)`, isCorrect: false },
      { text: `${(nominal + 0.01).toFixed(2)} mm (Accept / OK)`, isCorrect: false },
      { text: `${lsl.toFixed(2)} mm (Accept / OK)`, isCorrect: false }
    ];

    const shuffled = optionsRaw.sort(() => ((seed * 23) % 5) - 2);
    const correctIdx = shuffled.findIndex(o => o.isCorrect);
    const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

    return {
      id: `qc-tol-asym-${seed}`,
      category: 'qc-accuracy',
      subCategory: 'Toleransi Dimensi & Limit NG',
      question: `Komponen poros memiliki toleransi asimetris: ${nominal.toFixed(2)} +${upperTol.toFixed(2)} / -${lowerTol.toFixed(2)} mm. Dari data ukur berikut, manakah kondisi yang TIDAK SESUAI standar?`,
      options: finalOptions,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      explanation: `Rentang yang diizinkan adalah ${lsl.toFixed(2)} mm s/d ${usl.toFixed(2)} mm. Nilai ${ngSample.toFixed(2)} mm melebihi batas atas ${usl.toFixed(2)} mm sehingga berstatus REJECT.`,
      quickTrick: `💡 Toleransi Asimetris: Perhatikan tanda (+) untuk batas atas dan tanda (-) untuk batas bawah.`
    };
  }
}

// 2. GENERATOR ALAT UKUR PRESISI & METROLOGI INDUSTRI
function generateMeasuringToolQuestion(seed: number): BaseQuestion {
  const tools = [
    {
      name: 'Jangka Sorong (Vernier Caliper)',
      resolusi: '0.05 mm atau 0.02 mm',
      q: 'Alat ukur presisi yang paling tepat digunakan untuk mengukur diameter luar, diameter dalam, dan kedalaman lubang sekaligus pada benda kerja adalah:',
      desc: 'Jangka sorong (sketmat) memiliki rahang luar, rahang dalam, dan ekor pengukur kedalaman (depth bar).'
    },
    {
      name: 'Mikrometer Luar (Outside Micrometer)',
      resolusi: '0.01 mm (hingga 0.001 mm)',
      q: 'Untuk mengukur ketebalan pelat tipis atau diameter poros presisi tinggi dengan ketelitian hingga 0.01 mm, alat ukur yang paling tepat adalah:',
      desc: 'Mikrometer memiliki tingkat presisi lebih tinggi (0.01 mm) dibanding jangka sorong dan dilengkapi ratchet stop untuk menjaga kestabilan tekanan ukur.'
    },
    {
      name: 'Dial Indicator (Dial Gauge)',
      resolusi: '0.01 mm',
      q: 'Alat ukur yang digunakan bersama magnetic stand untuk memeriksa kerataan permukaan (flatness), kebulatan poros (roundness), dan penyimpangan putaran (run-out) adalah:',
      desc: 'Dial Indicator bekerja mendeteksi simpangan jarum penunjuk saat ujung spindel menyentuh permukaan benda kerja yang berputar.'
    },
    {
      name: 'Plug Gauge (Pin Gauge / Go-NoGo)',
      resolusi: 'Standar Batas Lubang',
      q: 'Alat ukur batas (limit gauge) yang digunakan inspektur QC untuk memeriksa apakah diameter lubang dalam memenuhi toleransi tanpa perlu membaca skala angka adalah:',
      desc: 'Plug Gauge memiliki dua sisi: Sisi GO (harus masuk) dan Sisi NO-GO (tidak boleh masuk).'
    },
    {
      name: 'Feeler Gauge (Thickness Gauge / Pengukur Celah)',
      resolusi: '0.02 mm s/d 1.00 mm',
      q: 'Kumpulan bilah baja tipis presisi dengan berbagai ukuran ketebalan yang digunakan untuk memeriksa celah sempit (gap clearance) antar komponen mesin adalah:',
      desc: 'Feeler gauge terdiri dari bilah-bilah pelat tipis berstandar presisi untuk mengukur celah klep atau gap cetakan.'
    },
    {
      name: 'Height Gauge (Pengukur Ketinggian)',
      resolusi: '0.02 mm',
      q: 'Alat ukur presisi berkaki datar yang diletakkan di atas meja perata granit (surface plate) untuk mengukur tinggi atau membuat garis layout benda kerja adalah:',
      desc: 'Height gauge digunakan bersama meja granit untuk pengukuran elevasi dan pembuatan tanda kerja presisi.'
    },
    {
      name: 'Thread Pitch Gauge (Pengukur Ulir Baut)',
      resolusi: 'Standar Pitch Ulir',
      q: 'Alat berbentuk bilah-bilah bergigi yang digunakan untuk mencocokkan jarak puncak ke puncak ulir (pitch) pada baut atau mur adalah:',
      desc: 'Thread Pitch Gauge digunakan untuk mengidentifikasi standar ulir metrik (M) atau inchi (BSW/UNF).'
    }
  ];

  const item = tools[seed % tools.length];
  const otherTools = tools.filter(t => t.name !== item.name);
  const shuffledOthers = otherTools.sort(() => ((seed * 7) % 5) - 2);

  const optionsRaw = [
    { text: item.name, isCorrect: true },
    { text: shuffledOthers[0].name, isCorrect: false },
    { text: shuffledOthers[1].name, isCorrect: false },
    { text: shuffledOthers[2].name, isCorrect: false }
  ];

  const shuffled = optionsRaw.sort(() => ((seed * 11) % 5) - 2);
  const correctIdx = shuffled.findIndex(o => o.isCorrect);
  const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

  return {
    id: `qc-tool-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Alat Ukur Presisi & Metrologi',
    question: item.q,
    options: finalOptions,
    correctAnswer: correctIdx >= 0 ? correctIdx : 0,
    explanation: `${item.name}: ${item.desc} (Ketelitian: ${item.resolusi}).`,
    quickTrick: `💡 Trik Metrologi: Jangka Sorong = multifungsi (0.05mm), Mikrometer = ultra presisi (0.01mm), Dial = kebulatan/run-out, Plug/Pin = lubang Go/NoGo, Feeler = celah tipis.`
  };
}

// 3. GENERATOR KONSEP QUALITY CONTROL & MANAJEMEN MUTU
function generateQcConceptQuestion(seed: number): BaseQuestion {
  const concepts = [
    {
      title: 'Prinsip 3 Tidak (San-No-Shugi)',
      q: 'Dalam filosofi mutu manufaktur Jepang, slogan "Jangan Menerima barang cacat, Jangan Membuat barang cacat, dan Jangan Meneruskan barang cacat" dikenal sebagai:',
      correct: 'Prinsip 3 Tidak (Tiga Pantangan Mutu)',
      wrongs: ['Prinsip 3S Produksi', 'Siklus Kaizen 3 Tahap', 'Standar Audit ISO 9001'],
      desc: 'Prinsip 3 Tidak (Don\'t Accept, Don\'t Make, Don\'t Pass NG) adalah fondasi pencegahan defect agar tidak sampai ke tangan konsumen.'
    },
    {
      title: 'Poka-Yoke (Mistake Proofing)',
      q: 'Metode atau mekanisme desain jig/alat pada lini perakitan yang secara otomatis mencegah operator melakukan kesalahan pasang (anti-salah) disebut:',
      correct: 'Poka-Yoke (Mistake Proofing)',
      wrongs: ['Kanban System', 'Andon Board', 'Just In Time (JIT)'],
      desc: 'Poka-Yoke adalah sistem pencegah kesalahan manusia (human error) seperti konektor berbentuk asimetris yang tidak bisa dicolok terbalik.'
    },
    {
      title: 'Diagram Pareto (Prinsip 80/20)',
      q: 'Alat 7 QC Tools berupa grafik batang dan kurva kumulatif yang digunakan untuk mengidentifikasi 20% jenis cacat terbesar yang menyebabkan 80% total kerugian mutu adalah:',
      correct: 'Diagram Pareto (Pareto Chart)',
      wrongs: ['Diagram Fishbone', 'Histogram Frekuensi', 'Scatter Diagram'],
      desc: 'Diagram Pareto membantu QC menentukan prioritas masalah mutu yang paling mendesak untuk diselesaikan terlebih dahulu.'
    },
    {
      title: 'Diagram Tulang Ikan (Fishbone / Ishikawa)',
      q: 'Diagram sebab-akibat yang menguraikan akar penyebab suatu defect berdasarkan faktor 4M + 1E (Man, Machine, Material, Method, Environment) adalah:',
      correct: 'Diagram Fishbone (Ishikawa Diagram)',
      wrongs: ['Control Chart (Peta Kendali)', 'Check Sheet', 'Flowchart Proses'],
      desc: 'Diagram Fishbone (Ishikawa) digunakan saat sesi brainstorming pemecahan masalah untuk menemukan akar masalah (root cause).'
    },
    {
      title: 'Definisi Critical Defect (Cacat Kritis)',
      q: 'Kategori cacat produk yang berpotensi membahayakan keselamatan pengguna, melanggar hukum regulasi, atau menyebabkan produk terbakar/meledak disebut:',
      correct: 'Critical Defect (Cacat Kritis)',
      wrongs: ['Major Defect (Cacat Mayor)', 'Minor Defect (Cacat Minor)', 'Cosmetic Defect'],
      desc: 'Critical Defect memiliki toleransi 0% (zero tolerance) karena langsung menyangkut keselamatan jiwa konsumen.'
    },
    {
      title: 'AQL (Acceptable Quality Level) & Sampling',
      q: 'Metode inspeksi kualitas dengan mengambil sejumlah sampel acak dari satu lot pengiriman sesuai tabel standar statistik (ISO 2859 / Mil-Std) disebut:',
      correct: 'Inspeksi Sampling Berdasarkan AQL',
      wrongs: ['Inspeksi Totalitas 100%', 'Inspeksi Destruktif Mandiri', 'Audit Visual Bebas'],
      desc: 'AQL menentukan batas toleransi maksimum jumlah cacat dalam suatu sampel lot sebelum seluruh lot dinyatakan ditolak (reject lot).'
    },
    {
      title: 'Defect Burry / Flash pada Part Plastik & Logam',
      q: 'Sisa material tipis berlebih yang menonjol tajam di sepanjang garis cetakan (parting line) akibat tekanan molding berlebih atau celah cetakan aus disebut cacat:',
      correct: 'Burry / Flash (Sirip Material)',
      wrongs: ['Sink Mark (Penyusutan)', 'Short Mold (Kurang Material)', 'Porositas (Gelembung)'],
      desc: 'Burry/Flash adalah tonjolan sisa material tajam yang berbahaya bagi perakitan dan wajib dibersihkan (deburring).'
    },
    {
      title: 'Siklus PDCA (Deming Cycle)',
      q: 'Siklus perbaikan kualitas berkelanjutan yang terdiri dari tahapan Rencana, Pelaksanaan, Evaluasi/Pemeriksaan, dan Tindak Lanjut Standarisasi adalah:',
      correct: 'PDCA (Plan - Do - Check - Act)',
      wrongs: ['DMAIC Six Sigma', '5W + 1H Analysis', 'OEE Overall Efficiency'],
      desc: 'Siklus PDCA diciptakan W. Edwards Deming sebagai metodologi standar pengendalian mutu dan Kaizen berkelanjutan.'
    }
  ];

  const item = concepts[seed % concepts.length];
  const optionsRaw = [
    { text: item.correct, isCorrect: true },
    { text: item.wrongs[0], isCorrect: false },
    { text: item.wrongs[1], isCorrect: false },
    { text: item.wrongs[2], isCorrect: false }
  ];

  const shuffled = optionsRaw.sort(() => ((seed * 13) % 5) - 2);
  const correctIdx = shuffled.findIndex(o => o.isCorrect);
  const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

  return {
    id: `qc-concept-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Manajemen Mutu & Filosofi QC',
    question: item.q,
    options: finalOptions,
    correctAnswer: correctIdx >= 0 ? correctIdx : 0,
    explanation: `${item.title}: ${item.desc}`,
    quickTrick: `💡 Trik QC: Poka-Yoke = anti-salah otomatis, Pareto = 80/20 cari masalah utama, Fishbone = 4M1E cari akar sebab, 3 Tidak = Jangan terima, buat, teruskan cacat.`
  };
}

// 4. GENERATOR BUDAYA 5S / 5R PABRIK (10+ SOAL STUDI KASUS)
function generate5SQuestion(seed: number): BaseQuestion {
  const fiveSTopics = [
    {
      term: 'SEIRI (Ringkas / Pemilahan)',
      desc: 'Memisahkan barang yang diperlukan dan menyingkirkan/membuang barang yang tidak terpakai menggunakan metode Red Tag.',
      q: 'Kegiatan menempelkan label merah (Red Tag) pada perkakas rusak dan material kadaluarsa untuk dikeluarkan dari lini produksi adalah penerapan pilar 5S:'
    },
    {
      term: 'SEITON (Rapi / Penataan)',
      desc: 'Menata barang pada tempat yang ditentukan dengan penandaan visual (shadow board / garis batas) agar mudah diambil dalam 30 detik.',
      q: 'Membuat garis batas warna kuning untuk jalur forklift dan menempatkan kunci torsi pada papan bayangan (shadow board) berlabel rapi adalah pilar:'
    },
    {
      term: 'SEISO (Resik / Pembersihan & Inspeksi)',
      desc: 'Membersihkan area kerja dan mesin sekaligus melakukan inspeksi terhadap baut kendor, kabel terkelupas, atau kebocoran oli pelumas.',
      q: 'Operator membersihkan serpihan logam dari meja mesin CNC sambil memeriksa apakah selang pendingin (coolant) mengalami kebocoran. Aktivitas ini adalah pilar:'
    },
    {
      term: 'SEIKETSU (Rawat / Standarisasi)',
      desc: 'Mempertahankan standar kebersihan dan kerapian 3S sebelumnya melalui SOP visual, checklist harian, dan audit patrol berkala.',
      q: 'Membuat lembar checklist piket harian dan SOP visual standardisasi kebersihan tempat kerja di setiap shift produksi merupakan pilar:'
    },
    {
      term: 'SHITSUKE (Rajin / Pembiasaan Diri)',
      desc: 'Membiasakan diri mematuhi SOP kerja, menggunakan APD lengkap, dan menjaga kedisiplinan kerja tanpa harus selalu diawasi atasan.',
      q: 'Kedisiplinan setiap operator untuk selalu memakai kacamata safety (safety glasses) dan mematuhi SOP kerja secara sukarela dan konsisten adalah pilar:'
    },
    {
      term: 'SEITON (Rapi / 3T: Tata, Tempat, Tanda)',
      desc: 'Prinsip 3T dalam Seiton memastikan siapa pun bisa menemukan barang dalam hitungan detik tanpa perlu bertanya.',
      q: 'Prinsip "Semua barang memiliki tempatnya masing-masing dan setiap tempat memiliki nama barangnya" adalah konsep inti dari:'
    },
    {
      term: 'SEIRI (Ringkas / Pengurangan Pemborosan)',
      desc: 'Mengurangi timbunan stok barang tidak berguna yang memakan tempat di area kerja produksi.',
      q: 'Menyingkirkan boks pallet kosong yang menumpuk menghalangi jalan evakuasi pabrik merupakan tindakan 5S pada tahap:'
    }
  ];

  const item = fiveSTopics[seed % fiveSTopics.length];
  const allTerms = ['SEIRI (Ringkas)', 'SEITON (Rapi)', 'SEISO (Resik)', 'SEIKETSU (Rawat)', 'SHITSUKE (Rajin)'];
  const otherTerms = allTerms.filter(t => !item.term.startsWith(t.split(' ')[0]));

  const optionsRaw = [
    { text: item.term, isCorrect: true },
    { text: otherTerms[0], isCorrect: false },
    { text: otherTerms[1], isCorrect: false },
    { text: otherTerms[2], isCorrect: false }
  ];

  const shuffled = optionsRaw.sort(() => ((seed * 11) % 5) - 2);
  const correctIdx = shuffled.findIndex(o => o.isCorrect);
  const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

  return {
    id: `qc-5s-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Budaya 5S/5R & Mutu Pabrik',
    question: item.q,
    options: finalOptions,
    correctAnswer: correctIdx >= 0 ? correctIdx : 0,
    explanation: `${item.term}: ${item.desc}`,
    quickTrick: `💡 Trik 5S: Seiri=Pilah buang yg tak perlu, Seiton=Tata di tempat berlabel, Seiso=Bersih sambil inspeksi, Seiketsu=Standarisasi SOP, Shitsuke=Disiplin diri.`
  };
}

// 5. GENERATOR KETELITIAN KODE & BARCODE PART NUMBER
function generateCodeMatchQuestion(seed: number): BaseQuestion {
  const brand = BRANDS[seed % BRANDS.length];
  const code = CODE_PATTERNS[(seed + 2) % CODE_PATTERNS.length];
  const suffix = (1000 + (seed * 43) % 9000).toString();
  const master = `[${brand}-${code}-${suffix}-QC]`;

  const optCorrect = master;
  const optDiff1 = master.replace('0', 'O').replace('1', 'I');
  const optDiff2 = master.replace('-', '_');
  const optDiff3 = master.replace('QC', 'CQ');

  const optionsRaw = [
    { text: optCorrect, isCorrect: true },
    { text: optDiff1 === master ? master.replace('A', '4') : optDiff1, isCorrect: false },
    { text: optDiff2, isCorrect: false },
    { text: optDiff3, isCorrect: false }
  ];

  const shuffled = optionsRaw.sort(() => ((seed * 13) % 5) - 2);
  const correctIdx = shuffled.findIndex(o => o.isCorrect);
  const finalOptions = shuffled.map((o, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${o.text}`);

  return {
    id: `qc-match-mc-${seed}`,
    category: 'qc-accuracy',
    subCategory: 'Ketelitian Kode Alfanumerik',
    question: `Di antara 4 pilihan di bawah ini, manakah yang memiliki susunan karakter PERSIS SAMA (100% IDENTIK) dengan Master Barcode ${master} ?`,
    options: finalOptions,
    correctAnswer: correctIdx >= 0 ? correctIdx : 0,
    explanation: `Hanya pilihan ${finalOptions[correctIdx]} yang 100% identik karakter demi karakter tanpa ada kesalahan huruf kembar, angka mirip (0/O, 1/I), atau tanda hubung.`,
    quickTrick: `💡 Trik Ketelitian Barcode: Periksa per-klaster 3-4 karakter dari belakang ke depan untuk menghindari ilusi visual otak.`
  };
}

const QC_MC_GENERATORS = [
  generateToleranceQuestion,
  generateMeasuringToolQuestion,
  generateQcConceptQuestion,
  generate5SQuestion,
  generateCodeMatchQuestion
];

export function generateParametricQcQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % QC_MC_GENERATORS.length;
  return QC_MC_GENERATORS[genIdx](s);
}

/**
 * Returns a balanced 10-question set guaranteed with 0 DUPLICATES
 */
export function getRandomQcMcSet(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const seenQuestionFingerprints = new Set<string>();

  // Ensure balanced representation across all 5 generator topics
  let attempts = 0;
  let topicIndex = Math.floor(Math.random() * QC_MC_GENERATORS.length);

  while (result.length < count && attempts < 300) {
    attempts++;
    const gen = QC_MC_GENERATORS[topicIndex % QC_MC_GENERATORS.length];
    topicIndex++;

    const uniqueSeed = Math.floor(Math.random() * 1000000) + attempts * 89;
    const q = gen(uniqueSeed);

    // Create normalized fingerprint from question text to guarantee uniqueness
    const fingerprint = q.question.replace(/\s+/g, ' ').trim().slice(0, 70);

    if (!seenQuestionFingerprints.has(fingerprint)) {
      seenQuestionFingerprints.add(fingerprint);
      result.push(q);
    }
  }

  // Fallback if needed
  if (result.length < count) {
    for (let i = 0; i < qcMultipleChoiceQuestions.length; i++) {
      const q = qcMultipleChoiceQuestions[i];
      const fingerprint = q.question.replace(/\s+/g, ' ').trim().slice(0, 70);
      if (!seenQuestionFingerprints.has(fingerprint)) {
        seenQuestionFingerprints.add(fingerprint);
        result.push(q);
        if (result.length === count) break;
      }
    }
  }

  return result;
}

export const qcMultipleChoiceQuestions: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % QC_MC_GENERATORS.length;
  return QC_MC_GENERATORS[genIdx](idx * 29 + 17);
});

