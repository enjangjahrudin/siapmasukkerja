import { BaseQuestion } from '../types';

export interface VocabPair {
  word: string;
  synonym: string;
  antonym: string;
  explanation: string;
}

export const industrialVocabDatabase: VocabPair[] = [
  { word: 'PREMIS', synonym: 'Asumsi / Landasan Dasar', antonym: 'Konklusi / Kesimpulan Akhir', explanation: 'Premis adalah pernyataan landasan dalam logika berpikir.' },
  { word: 'EFISIENSI', synonym: 'Ketepatan Guna / Kehematan', antonym: 'Pemborosan / Inefisiensi', explanation: 'Efisiensi adalah perbandingan terbaik antara masukan dan keluaran.' },
  { word: 'RELIABEL', synonym: 'Dapat Diandalkan / Konsisten', antonym: 'Rentan Rusak / Goyah', explanation: 'Reliabilitas adalah tingkat keandalan dan konsistensi mutu.' },
  { word: 'DEFISIT', synonym: 'Kekurangan / Minus', antonym: 'Surplus / Kelebihan', explanation: 'Defisit adalah kondisi kekurangan dari standar yang ditetapkan.' },
  { word: 'KONVENSIONAL', synonym: 'Tradisional / Cara Lama', antonym: 'Modern / Mutakhir / Inovatif', explanation: 'Konvensional berpatokan pada kebiasaan baku yang lama.' },
  { word: 'SPORADIS', synonym: 'Kadang-kadang / Jarang', antonym: 'Kontinu / Teratur / Rutin', explanation: 'Sporadis berarti terjadi secara tidak menentu.' },
  { word: 'PREVENTIF', synonym: 'Pencegahan / Tindakan Awal', antonym: 'Kuratif / Pengobatan Pasca Kerusakan', explanation: 'Preventif adalah perawatan dini sebelum terjadi kerusakan.' },
  { word: 'ANOMALI', synonym: 'Kejanggalan / Penyimpangan', antonym: 'Normal / Sesuai Standar', explanation: 'Anomali adalah ketidaksesuaian terhadap kondisi normal.' },
  { word: 'OTONOM', synonym: 'Mandiri / Swakarsa', antonym: 'Tergantung / Bergantung', explanation: 'Otonom berarti dapat beroperasi mandiri tanpa intervensi.' },
  { word: 'STABILITAS', synonym: 'Keseimbangan / Kestabilan', antonym: 'Fluktuasi / Gejolak', explanation: 'Stabilitas adalah kondisi tetap dan tidak mudah goyah.' },
  { word: 'OPTIMAL', synonym: 'Hasil Terbaik / Maksimal', antonym: 'Minimal / Kurang Memadai', explanation: 'Optimal adalah kondisi terbaik yang dapat dicapai.' },
  { word: 'PRESISE', synonym: 'Tepat / Akurat / Seksama', antonym: 'Meleset / Bias / Kasar', explanation: 'Presisi adalah ketelitian tingkat tinggi pada ukuran.' },
  { word: 'KREDIBEL', synonym: 'Dapat Dipercaya / Sahih', antonym: 'Meragukan / Palsu', explanation: 'Kredibel berarti memiliki reputasi yang dapat dipercaya.' },
  { word: 'DEFISIENSI', synonym: 'Ketiadaan / Ketidakcukupan', antonym: 'Kecukupan / Kelebihan', explanation: 'Defisiensi adalah kondisi kekurangan komponen penting.' }
];

export const analogyRelationshipBank = [
  { a1: 'RODA GIGI', a2: 'MESIN', b1: 'BUSI', b2: 'MOTOR / KENDARAAN', exp: 'Roda gigi bagian vital mesin, busi bagian vital kendaraan.' },
  { a1: 'MIKROMETER', a2: 'PRESISI', b1: 'TIMBANGAN', b2: 'BERAT / MASSA', exp: 'Mikrometer ukur panjang presisi, timbangan ukur berat.' },
  { a1: 'HELM SAFETY', a2: 'KEPALA', b1: 'SEPATU SAFETY', b2: 'KAKI', exp: 'Helm lindungi kepala, sepatu safety lindungi kaki.' },
  { a1: 'QC INSPECTOR', a2: 'PRODUK REJECT (NG)', b1: 'DOKTER', b2: 'PENYAKIT', exp: 'QC deteksi reject, dokter deteksi penyakit.' },
  { a1: 'OLI PELUMAS', a2: 'GESEKAN', b1: 'SEKRING', b2: 'KORSLETIK LISTRIK', exp: 'Oli cegah gesekan, sekring cegah korsleting.' },
  { a1: 'FORKLIFT', a2: 'PALET', b1: 'DEREK / CRANE', b2: 'KONTAINER', exp: 'Forklift angkat palet, crane angkat kontainer.' },
  { a1: 'TERMOMETER', a2: 'SUHU OVEN', b1: 'MANOMETER', b2: 'TEKANAN ANGIN', exp: 'Termometer ukur suhu, manometer ukur tekanan gas.' }
];

export const syllogismScenarioBank = [
  {
    rule1: 'Semua operator perakitan di Line 1 wajib mengenakan rompi reflektor.',
    rule2: 'Rahmat sedang bekerja di Line 1 dan tidak mengenakan rompi reflektor.',
    ans: 'Rahmat bukan operator perakitan atau melanggar SOP K3',
    wrong1: 'Rahmat adalah manajer yang bebas aturan',
    wrong2: 'Rompi reflektor hanya opsional',
    wrong3: 'Area Line 1 bebas aturan keselamatan',
    exp: 'Jika kewajiban dilanggar, subjek berada di luar kategori atau melanggar SOP.'
  },
  {
    rule1: 'Semua mesin cetak yang dirawat berkala tidak mengalami mati mendadak (breakdown).',
    rule2: 'Mesin cetak nomor 07 hari ini mengalami mati mendadak (breakdown).',
    ans: 'Mesin cetak nomor 07 tidak dirawat berkala sesuai jadwal',
    wrong1: 'Mesin nomor 07 adalah mesin keluaran terbaru',
    wrong2: 'Semua mesin cetak rusak hari ini',
    wrong3: 'Operator nomor 07 salah menekan tombol',
    exp: 'Modus Tollens: Jika P -> Q, maka tidak Q -> tidak P.'
  },
  {
    rule1: 'Semua komponen yang lolos uji QC memiliki label stempel Hijau.',
    rule2: 'Komponen nomor seri B-99 tidak memiliki label stempel Hijau.',
    ans: 'Komponen nomor seri B-99 tidak lolos uji QC (Status Hold/NG)',
    wrong1: 'Komponen nomor seri B-99 adalah komponen terbaik',
    wrong2: 'Stempel hijau hanya hiasan packaging',
    wrong3: 'Semua komponen di pabrik tidak berstempel',
    exp: 'Pernyataan negasi menghasilkan kesimpulan bahwa syarat tidak terpenuhi.'
  }
];

// Generates infinite randomized psychotest questions
export function generateRandomPsychotestQuestion(): BaseQuestion {
  const pattern = Math.floor(Math.random() * 4);
  const randomId = 'psy-dyn-' + Math.random().toString(36).substr(2, 9);

  // 1. SINONIM
  if (pattern === 0) {
    const vocab = industrialVocabDatabase[Math.floor(Math.random() * industrialVocabDatabase.length)];
    const otherVocabs = industrialVocabDatabase.filter(v => v.word !== vocab.word);
    const shuffledOthers = otherVocabs.sort(() => Math.random() - 0.5);

    const options = [
      `A. ${vocab.synonym}`,
      `B. ${vocab.antonym}`,
      `C. ${shuffledOthers[0].synonym}`,
      `D. ${shuffledOthers[1].antonym}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'psychotest',
      subCategory: 'Sinonim (Persamaan Kata)',
      question: `SINONIM (Persamaan Kata) dari : ${vocab.word} = ...`,
      options,
      correctAnswer: options.findIndex(o => o.includes(vocab.synonym)),
      explanation: `${vocab.word} memiliki arti yang serupa dengan "${vocab.synonym}". ${vocab.explanation}`,
      quickTrick: `💡 Trik Kosakata: ${vocab.word} = ${vocab.synonym}.`
    };
  }

  // 2. ANTONIM
  if (pattern === 1) {
    const vocab = industrialVocabDatabase[Math.floor(Math.random() * industrialVocabDatabase.length)];
    const otherVocabs = industrialVocabDatabase.filter(v => v.word !== vocab.word);
    const shuffledOthers = otherVocabs.sort(() => Math.random() - 0.5);

    const options = [
      `A. ${vocab.antonym}`,
      `B. ${vocab.synonym}`,
      `C. ${shuffledOthers[0].antonym}`,
      `D. ${shuffledOthers[1].synonym}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'psychotest',
      subCategory: 'Antonim (Lawan Kata)',
      question: `ANTONIM (Lawan Kata) dari : ${vocab.word} >< ...`,
      options,
      correctAnswer: options.findIndex(o => o.includes(vocab.antonym)),
      explanation: `Lawan kata dari ${vocab.word} adalah "${vocab.antonym}".`,
      quickTrick: `💡 Trik Lawan Kata: ${vocab.word} >< ${vocab.antonym}.`
    };
  }

  // 3. ANALOGI
  if (pattern === 2) {
    const item = analogyRelationshipBank[Math.floor(Math.random() * analogyRelationshipBank.length)];
    const options = [
      `A. ${item.b2}`,
      `B. ${item.a1}`,
      `C. Udara`,
      `D. Gedung Pabrik`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'psychotest',
      subCategory: 'Analogi Hubungan Logika',
      question: `${item.a1} : ${item.a2} = ${item.b1} : ...`,
      options,
      correctAnswer: options.findIndex(o => o.includes(item.b2)),
      explanation: item.exp,
      quickTrick: `💡 Trik Analogi: Cari hubungan fungsi komponen terhadap objek utamanya.`
    };
  }

  // 4. SILOGISME
  const syl = syllogismScenarioBank[Math.floor(Math.random() * syllogismScenarioBank.length)];
  const options = [
    `A. ${syl.ans}`,
    `B. ${syl.wrong1}`,
    `C. ${syl.wrong2}`,
    `D. ${syl.wrong3}`
  ].sort(() => Math.random() - 0.5);

  return {
    id: randomId,
    category: 'psychotest',
    subCategory: 'Silogisme Logika Deduksi',
    question: `Premis 1: ${syl.rule1}\nPremis 2: ${syl.rule2}\nKesimpulan yang paling tepat adalah ...`,
    options,
    correctAnswer: options.findIndex(o => o.includes(syl.ans)),
    explanation: syl.exp,
    quickTrick: `💡 Trik Silogisme: Gunakan hukum deduksi formal (Modus Ponens / Tollens).`
  };
}

export function getPsychotestBatch(count: number = 10): BaseQuestion[] {
  const batch: BaseQuestion[] = [];
  const seen = new Set<string>();

  while (batch.length < count) {
    const q = generateRandomPsychotestQuestion();
    if (!seen.has(q.question)) {
      seen.add(q.question);
      batch.push(q);
    }
  }

  return batch;
}
