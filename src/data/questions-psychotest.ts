import { BaseQuestion } from '../types';

// ============================================================================
// PSIKOTES PENALARAN & LOGIKA - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup Sinonim Industri, Antonim, Analogi, Silogisme Deduksi, & Logika Posisi
// ============================================================================

export interface VocabItem {
  word: string;
  synonym: string;
  antonym: string;
  synonymDistractors: string[];
  antonymDistractors: string[];
  explanation: string;
}

export const VOCAB_BANK: VocabItem[] = [
  {
    word: 'PREMIS',
    synonym: 'Landasan Asumsi / Pokok Pikiran',
    antonym: 'Konklusi / Kesimpulan Akhir',
    synonymDistractors: ['Hasil Akhir', 'Penolakan', 'Perdebatan'],
    antonymDistractors: ['Dasar Pemikiran', 'Pengantar', 'Rangkuman'],
    explanation: 'Premis adalah pernyataan atau anggapan dasar yang dijadikan landasan untuk menarik suatu kesimpulan dalam logika.'
  },
  {
    word: 'EFISIENSI',
    synonym: 'Ketepatgunaan / Kehematan',
    antonym: 'Inefisiensi / Pemborosan',
    synonymDistractors: ['Kelambatan', 'Pengeluaran', 'Kekurangan'],
    antonymDistractors: ['Penghematan', 'Kerapian', 'Kedisiplinan'],
    explanation: 'Efisiensi adalah kemampuan menyelesaikan tugas dengan rasio usaha dan hasil terbaik tanpa pemborosan waktu/biaya.'
  },
  {
    word: 'RELIABEL',
    synonym: 'Dapat Diandalkan / Konsisten',
    antonym: 'Rentan Rusak / Goyah / Fluktuatif',
    synonymDistractors: ['Cepat Rusak', 'Sementara', 'Murah'],
    antonymDistractors: ['Kuat', 'Tahan Lama', 'Terpercaya'],
    explanation: 'Reliabel berarti memiliki tingkat keandalan yang tinggi dan memberikan hasil yang konsisten dari waktu ke waktu.'
  },
  {
    word: 'PREVENTIF',
    synonym: 'Pencegahan / Tindakan Dini',
    antonym: 'Kuratif / Penanganan Pasca Kerusakan',
    synonymDistractors: ['Pengobatan', 'Perbaikan', 'Pembersihan'],
    antonymDistractors: ['Protektif', 'Antisipatif', 'Penjagaan'],
    explanation: 'Preventif adalah tindakan antisipasi atau pencegahan sebelum timbul suatu masalah atau kerusakan mesin.'
  },
  {
    word: 'ANOMALI',
    synonym: 'Kejanggalan / Penyimpangan Standar',
    antonym: 'Normal / Sesuai Standar Baku',
    synonymDistractors: ['Ketetapan', 'Keteraturan', 'Kemiripan'],
    antonymDistractors: ['Penyimpangan', 'Cacat', 'Keanehan'],
    explanation: 'Anomali adalah fenomena atau data yang menyimpang dari kondisi normal atau standar baku operasi.'
  },
  {
    word: 'DEFISIT',
    synonym: 'Kekurangan / Minus Anggaran',
    antonym: 'Surplus / Kelebihan Stok',
    synonymDistractors: ['Keuntungan', 'Penumpukan', 'Kelebihan'],
    antonymDistractors: ['Kerugian', 'Ketiadaan', 'Penyusutan'],
    explanation: 'Defisit adalah kondisi di mana jumlah aktual lebih sedikit daripada jumlah yang seharusnya atau diperlukan.'
  },
  {
    word: 'KONVENSIONAL',
    synonym: 'Tradisional / Cara Lama',
    antonym: 'Mutakhir / Modern / Inovatif',
    synonymDistractors: ['Masa Depan', 'Digital', 'Cepat'],
    antonymDistractors: ['Kuno', 'Ketinggalan Zaman', 'Baku'],
    explanation: 'Konvensional berdasar pada adat, kebiasaan, atau metode lama yang lazim digunakan secara umum.'
  },
  {
    word: 'SPORADIS',
    synonym: 'Kadang-kadang / Tidak Menentu',
    antonym: 'Kontinu / Rutin / Berkesinambungan',
    synonymDistractors: ['Teratur', 'Setiap Hari', 'Pasti'],
    antonymDistractors: ['Jarang', 'Terpisah-pisah', 'Tersebar'],
    explanation: 'Sporadis berarti terjadi secara tidak teratur, terpencar-pencar, atau hanya sesekali saja.'
  },
  {
    word: 'OTONOM',
    synonym: 'Mandiri / Bekerja Sendiri',
    antonym: 'Tergantung / Terikat / Dependen',
    synonymDistractors: ['Bersama-sama', 'Diperintah', 'Menumpang'],
    antonymDistractors: ['Swakarsa', 'Bebas', 'Lepas'],
    explanation: 'Otonom berarti memiliki kebebasan dan kemampuan untuk beroperasi atau mengambil keputusan sendiri secara mandiri.'
  },
  {
    word: 'PRESISE',
    synonym: 'Akurat / Tepat / Seksama',
    antonym: 'Meleset / Bias / Sembarangan',
    synonymDistractors: ['Kira-kira', 'Bebas', 'Longgar'],
    antonymDistractors: ['Pasti', 'Rinci', 'Cermat'],
    explanation: 'Presisi adalah tingkat kecermatan dan ketelitian yang sangat tinggi pada ukuran dimensi atau pengukuran.'
  },
  {
    word: 'STABILITAS',
    synonym: 'Keseimbangan / Kestabilan',
    antonym: 'Fluktuasi / Gejolak / Instabilitas',
    synonymDistractors: ['Kekacauan', 'Pergerakan', 'Getaran'],
    antonymDistractors: ['Ketetapan', 'Kekokohan', 'Ketenangan'],
    explanation: 'Stabilitas adalah kondisi mantap, kokoh, dan tidak mudah berubah atau goyah.'
  },
  {
    word: 'KREDIBEL',
    synonym: 'Dapat Dipercaya / Sahih',
    antonym: 'Meragukan / Palsu / Fiktif',
    synonymDistractors: ['Terkenal', 'Mahal', 'Banyak'],
    antonymDistractors: ['Valid', 'Terbukti', 'Otentik'],
    explanation: 'Kredibel adalah sifat yang dapat dipercaya karena memiliki integritas atau bukti yang sahih.'
  },
  {
    word: 'OPTIMAL',
    synonym: 'Hasil Terbaik / Maksimal',
    antonym: 'Minimal / Buruk / Tidak Memadai',
    synonymDistractors: ['Rata-rata', 'Sedang', 'Cukup'],
    antonymDistractors: ['Sempurna', 'Tertinggi', 'Puncak'],
    explanation: 'Optimal adalah kondisi terbaik atau paling menguntungkan yang dapat dicapai dari suatu proses.'
  },
  {
    word: 'FLUKTUATIF',
    synonym: 'Berubah-ubah / Naik Turun',
    antonym: 'Statis / Konstan / Tetap',
    synonymDistractors: ['Meningkat Terus', 'Macet', 'Turun Drastis'],
    antonymDistractors: ['Goyah', 'Labil', 'Dinamis'],
    explanation: 'Fluktuatif berarti menunjukkan gejala naik turun atau tidak stabil dalam jangka waktu tertentu.'
  },
  {
    word: 'SINKRON',
    synonym: 'Serempak / Selaras / Sejalan',
    antonym: 'Asinkron / Tidak Selaras / Timpang',
    synonymDistractors: ['Tertinggal', 'Berlawanan', 'Terpisah'],
    antonymDistractors: ['Seirama', 'Bersamaan', 'Kompak'],
    explanation: 'Sinkron berarti terjadi atau bekerja pada waktu yang bersamaan dengan ritme yang selaras.'
  },
  {
    word: 'URGENSI',
    synonym: 'Keharusan Mendesak / Kepentingan Utama',
    antonym: 'Keleluasaan / Hal Sepele / Sekunder',
    synonymDistractors: ['Keterlambatan', 'Kebetulan', 'Kelalaian'],
    antonymDistractors: ['Prioritas', 'Kritis', 'Penting'],
    explanation: 'Urgensi adalah tingkat kepentingan yang mendesak dan harus segera diselesaikan tanpa penundaan.'
  },
  {
    word: 'AKUNTABEL',
    synonym: 'Dapat Dipertanggungjawabkan',
    antonym: 'Mencurigakan / Gelap / Ilegal',
    synonymDistractors: ['Tersembunyi', 'Misterius', 'Tertutup'],
    antonymDistractors: ['Transparan', 'Terbuka', 'Terpercaya'],
    explanation: 'Akuntabel berarti setiap tindakan atau laporan kerja dapat dinilai dan dipertanggungjawabkan secara terbuka.'
  },
  {
    word: 'KOORDINASI',
    synonym: 'Penyelarasan / Kerja Sama Terpadu',
    antonym: 'Disorganisasi / Kekacauan / Egoisme',
    synonymDistractors: ['Pengawasan', 'Perintah', 'Pemisahan'],
    antonymDistractors: ['Integrasi', 'Kompak', 'Kemitraan'],
    explanation: 'Koordinasi adalah perihal mengatur dan menggabungkan berbagai bagian agar bekerja harmonis menuju satu tujuan.'
  }
];

export const ANALOGY_BANK = [
  { a1: 'RODA GIGI', a2: 'MESIN TRANSMISI', b1: 'BUSI', b2: 'SISTEM PENGAPIAN', exp: 'Roda gigi komponen vital transmisi, busi komponen vital pengapian.' },
  { a1: 'MIKROMETER', a2: 'KETELITIAN UKUR', b1: 'TIMBANGAN', b2: 'MASSA BEBAN', exp: 'Mikrometer alat ukur presisi panjang, timbangan alat ukur massa.' },
  { a1: 'HELM SAFETY', a2: 'KEPALA', b1: 'SEPATU SAFETY', b2: 'KAKI', exp: 'Helm safety melindungi kepala pekerja, sepatu safety melindungi kaki.' },
  { a1: 'INSPEKTUR QC', a2: 'PRODUK CACAT (NG)', b1: 'DOKTER', b2: 'PENYAKIT PASIEN', exp: 'QC bertugas mendeteksi produk reject, dokter mendeteksi penyakit.' },
  { a1: 'OLI PELUMAS', a2: 'GESEKAN LOGAM', b1: 'SEKRING / MCB', b2: 'KORSLETIK LISTRIK', exp: 'Oli mencegah keausan gesekan, sekring mencegah kebakaran korsleting.' },
  { a1: 'FORKLIFT', a2: 'PALET BARANG', b1: 'DEREK / CRANE', b2: 'KONTAINER PELABUHAN', exp: 'Forklift memindahkan palet, crane memindahkan kontainer.' },
  { a1: 'TERMOMETER', a2: 'SUHU OVEN', b1: 'MANOMETER', b2: 'TEKANAN KOMPRESOR', exp: 'Termometer mengukur suhu, manometer mengukur tekanan fluida.' },
  { a1: 'CONVEYOR', a2: 'DISTRIBUSI PRODUK', b1: 'PIPA SALURAN', b2: 'ALIRAN FLUIDA', exp: 'Conveyor mengalirkan produk fisik, pipa mengalirkan cairan fluida.' },
  { a1: 'MUR', a2: 'BAUT', b1: 'STEKER', b2: 'STOPKONTAK', exp: 'Mur dan baut adalah pasangan mekanik, steker dan stopkontak pasangan listrik.' },
  { a1: 'SOP PABRIK', a2: 'KEDISIPLINAN', b1: 'UNDANG-UNDANG', b2: 'KETERTIBAN', exp: 'SOP menjaga kedisiplinan kerja, UU menjaga ketertiban masyarakat.' }
];

export const SYLLOGISM_TEMPLATES = [
  {
    p1: 'Semua operator perakitan di Line 1 wajib mengenakan kacamata safety.',
    p2: 'Budi sedang bekerja di Line 1 dan tidak mengenakan kacamata safety.',
    ans: 'Budi melanggar SOP K3 atau bukan operator perakitan resmi',
    distractors: [
      'Budi adalah supervisor yang kebal aturan',
      'Kacamata safety tidak wajib di Line 1',
      'Semua operator Line 1 boleh melepas kacamata'
    ],
    exp: 'Jika aturan berlaku umum untuk semua subjek di lokasi tersebut, maka subjek yang tidak mematuhi telah melanggar aturan.'
  },
  {
    p1: 'Semua mesin cetak yang dirawat secara berkala tidak mengalami mati mendadak (breakdown).',
    p2: 'Mesin cetak nomor 05 hari ini mengalami mati mendadak (breakdown).',
    ans: 'Mesin cetak nomor 05 tidak dirawat secara berkala sesuai jadwal',
    distractors: [
      'Mesin cetak nomor 05 adalah tipe tercanggih',
      'Semua mesin cetak di pabrik rusak hari ini',
      'Operator mesin nomor 05 menekan tombol darurat'
    ],
    exp: 'Modus Tollens: Jika P -> Q, maka Tidak Q -> Tidak P (Mesin breakdown berarti perawatan berkala tidak terpenuhi).'
  },
  {
    p1: 'Semua komponen yang lolos uji QC memiliki label stempel Hijau.',
    p2: 'Komponen suku cadang seri X-90 tidak memiliki label stempel Hijau.',
    ans: 'Komponen seri X-90 tidak lolos uji QC (Status Hold / Reject)',
    distractors: [
      'Komponen seri X-90 adalah komponen kualitas terbaik',
      'Tinta stempel hijau sedang habis di pabrik',
      'Komponen seri X-90 langsung dikirim ke pelanggan'
    ],
    exp: 'Karena stempel hijau adalah syarat mutlak lolos QC, ketiadaan stempel menandakan komponen belum/tidak lolos QC.'
  },
  {
    p1: 'Jika pasokan listrik PLN padam dan genset otomatis tidak menyala, maka seluruh lini produksi berhenti.',
    p2: 'Hari ini seluruh lini produksi tetap beroperasi normal tanpa henti.',
    ans: 'Pasokan listrik PLN tidak padam atau genset otomatis menyala',
    distractors: [
      'Semua operator bekerja manual tanpa listrik',
      'Listrik PLN padam total seharian penuh',
      'Pabrik ditutup sementara'
    ],
    exp: 'Hukum De Morgan & Modus Tollens: Karena lini produksi tidak berhenti, maka premis pemadaman ganda tidak terjadi.'
  },
  {
    p1: 'Setiap karyawan teladan selalu hadir tepat waktu dan mematuhi 5S di tempat kerja.',
    p2: 'Rian selalu hadir tepat waktu, tetapi sering meninggalkan meja kerja dalam kondisi berantakan (tidak menerapkan 5S).',
    ans: 'Rian tidak memenuhi syarat sebagai karyawan teladan',
    distractors: [
      'Rian tetap berhak menjadi karyawan teladan terbaik',
      'Budaya 5S tidak berpengaruh pada penilaian',
      'Rian akan dipromosikan menjadi manajer'
    ],
    exp: 'Syarat karyawan teladan adalah konjungsi (DAN), sehingga jika salah satu syarat gugur, status tersebut tidak terpenuhi.'
  }
];

// ----------------------------------------------------------------------------
// Generator Functions
// ----------------------------------------------------------------------------

function generateSynonymQuestion(seed: number): BaseQuestion {
  const vocab = VOCAB_BANK[seed % VOCAB_BANK.length];
  const options = [
    `A. ${vocab.synonym}`,
    `B. ${vocab.synonymDistractors[0]}`,
    `C. ${vocab.synonymDistractors[1]}`,
    `D. ${vocab.synonymDistractors[2]}`
  ].sort(() => ((seed * 7) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(vocab.synonym));

  return {
    id: `psy-syn-${seed}`,
    category: 'psychotest',
    subCategory: 'Sinonim Kata Industri',
    question: `Pilihlah kata atau padanan makna yang PALING TEPAT (SINONIM) dengan kata: "${vocab.word}"`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${vocab.explanation} Jadi, sinonim yang tepat adalah: ${vocab.synonym}.`,
    quickTrick: `💡 Trik Kosakata: Hubungkan kata dengan konteks industri kerja nyata (misal: perawatan preventif = pencegahan).`
  };
}

function generateAntonymQuestion(seed: number): BaseQuestion {
  const vocab = VOCAB_BANK[seed % VOCAB_BANK.length];
  const options = [
    `A. ${vocab.antonym}`,
    `B. ${vocab.antonymDistractors[0]}`,
    `C. ${vocab.antonymDistractors[1]}`,
    `D. ${vocab.antonymDistractors[2]}`
  ].sort(() => ((seed * 11) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(vocab.antonym));

  return {
    id: `psy-ant-${seed}`,
    category: 'psychotest',
    subCategory: 'Antonim / Lawan Kata',
    question: `Pilihlah lawan kata yang PALING SESUAI (ANTONIM) untuk kata: "${vocab.word}"`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Kata "${vocab.word}" bermakna ${vocab.synonym.toLowerCase()}. Lawan katanya (kebalikannya) adalah: ${vocab.antonym}.`,
    quickTrick: `💡 Trik Lawan Kata: Jangan terkecoh memilih sinonim! Cari kata yang maknanya 180 derajat bertolak belakang.`
  };
}

function generateAnalogyQuestion(seed: number): BaseQuestion {
  const analogy = ANALOGY_BANK[seed % ANALOGY_BANK.length];
  const distractors = [
    `${analogy.b2} : ${analogy.b1}`, // Terbalik
    `OBENG : KAYU BALOK`,
    `LAMPU : SUHU PANAS`
  ];

  const options = [
    `A. ${analogy.b1} : ${analogy.b2}`,
    `B. ${distractors[0]}`,
    `C. ${distractors[1]}`,
    `D. ${distractors[2]}`
  ].sort(() => ((seed * 13) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(`${analogy.b1} : ${analogy.b2}`));

  return {
    id: `psy-ana-${seed}`,
    category: 'psychotest',
    subCategory: 'Analogi & Hubungan Kata',
    question: `Tentukan pasangan kata yang memiliki hubungan analogi paling setara: "${analogy.a1} : ${analogy.a2} = ... : ..."`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hubungan analogi: ${analogy.exp}. Pasangan yang polanya identik adalah ${analogy.b1} : ${analogy.b2}.`,
    quickTrick: `💡 Trik Analogi: Buat kalimat penghubung singkat antara kata A dan B, lalu terapkan pola kalimat yang sama persis pada pilihan jawaban.`
  };
}

function generateSyllogismQuestion(seed: number): BaseQuestion {
  const template = SYLLOGISM_TEMPLATES[seed % SYLLOGISM_TEMPLATES.length];
  const options = [
    `A. ${template.ans}`,
    `B. ${template.distractors[0]}`,
    `C. ${template.distractors[1]}`,
    `D. ${template.distractors[2]}`
  ].sort(() => ((seed * 17) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(template.ans));

  return {
    id: `psy-syl-${seed}`,
    category: 'psychotest',
    subCategory: 'Silogisme & Logika Deduksi',
    question: `Premis 1: ${template.p1}\nPremis 2: ${template.p2}\n\nKesimpulan yang paling tepat dan sahih adalah:`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: template.exp,
    quickTrick: `💡 Trik Silogisme: Jangan masukkan opini pribadi atau asumsi luar. Cukup ikuti fakta murni yang tertulis pada kedua premis.`
  };
}

// ----------------------------------------------------------------------------
// Generator 5: Logika Posisi & Urutan Antrian Produksi
// ----------------------------------------------------------------------------
function generateAnalyticalPositionQuestion(seed: number): BaseQuestion {
  const names = ['Andi', 'Budi', 'Candra', 'Deni', 'Eko'];
  const shiftedNames = [...names].sort(() => ((seed * 23) % 5) - 2);
  const [p1, p2, p3, p4, p5] = shiftedNames;

  const questionText = `Lima operator (${names.join(', ')}) berdiri dalam antrean briefing pagi:\n• ${p1} berdiri tepat di depan ${p2}.\n• ${p3} berdiri tepat di belakang ${p2}.\n• ${p4} berdiri di posisi paling depan.\n• ${p5} berdiri di posisi paling belakang.\n\nSiapakah operator yang berdiri tepat di posisi ke-3 (tengah antrean)?`;
  const ans = p2;

  const options = [
    `A. ${ans}`,
    `B. ${p1}`,
    `C. ${p3}`,
    `D. ${p4}`
  ].sort(() => ((seed * 29) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ans));

  return {
    id: `psy-pos-${seed}`,
    category: 'psychotest',
    subCategory: 'Logika Analitis & Posisi',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Urutan antrean dari depan ke belakang adalah: ${p4} (posisi 1) -> ${p1} (posisi 2) -> ${p2} (posisi 3) -> ${p3} (posisi 4) -> ${p5} (posisi 5). Maka orang di posisi ke-3 adalah ${ans}.`,
    quickTrick: `💡 Trik Posisi: Gambar garis 1 s/d 5 di kertas coretan, tempatkan posisi yang sudah pasti (paling depan & belakang) terlebih dahulu.`
  };
}

// ============================================================================
// MASTER GENERATOR & BANK (1.000+ SOAL)
// ============================================================================
const PSYCHOTEST_GENERATORS = [
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateAnalogyQuestion,
  generateSyllogismQuestion,
  generateAnalyticalPositionQuestion
];

export function generateParametricPsychotestQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % PSYCHOTEST_GENERATORS.length;
  return PSYCHOTEST_GENERATORS[genIdx](s);
}

export function getPsychotestBatch(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const baseSeed = Math.floor(Math.random() * 10000);

  for (let i = 0; i < count; i++) {
    const genIdx = (i + baseSeed) % PSYCHOTEST_GENERATORS.length;
    const seed = baseSeed * 37 + i * 19 + Math.floor(Math.random() * 1000);
    result.push(PSYCHOTEST_GENERATORS[genIdx](seed));
  }

  return result;
}

export const psychotestQuestionBank: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % PSYCHOTEST_GENERATORS.length;
  return PSYCHOTEST_GENERATORS[genIdx](idx * 19 + 7);
});

export const psychotestQuestions: BaseQuestion[] = psychotestQuestionBank.slice(0, 10);
