import { BaseQuestion } from '../types';

// Helper to format currency Rupiah
const formatRupiah = (val: number) => 'Rp ' + Math.round(val).toLocaleString('id-ID');

// Comprehensive Dynamic Question Generator Engine capable of generating thousands of unique randomized questions across 16 core patterns
export function generateParametricMathQuestion(): BaseQuestion {
  const patternIndex = Math.floor(Math.random() * 16);
  const randomId = 'math-gen-' + Math.random().toString(36).substr(2, 9);

  // PATTERN 1: Penjumlahan & Pengurangan Ratusan/Ribuan
  if (patternIndex === 0) {
    const isAdd = Math.random() > 0.5;
    const a = Math.floor(Math.random() * 700) + 250;
    const b = Math.floor(Math.random() * 450) + 120;
    const ans = isAdd ? a + b : a - b;

    const distractors = new Set<number>();
    distractors.add(ans + 10);
    distractors.add(ans - 10);
    distractors.add(ans + (isAdd ? -100 : 100));
    distractors.delete(ans);

    const options = [ans, ...Array.from(distractors).slice(0, 3)]
      .sort(() => Math.random() - 0.5)
      .map((val, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${val}`);

    const correctIdx = options.findIndex(o => o.includes(`${ans}`));

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: isAdd ? 'Penjumlahan Dasar' : 'Pengurangan Dasar',
      question: `Berapakah hasil dari ${a} ${isAdd ? '+' : '-'} ${b} ?`,
      options,
      correctAnswer: correctIdx >= 0 ? correctIdx : 0,
      explanation: `${a} ${isAdd ? '+' : '-'} ${b} = ${ans}.`,
      quickTrick: `💡 Trik Hitung Cepat: Pecah angka ratusan dan puluhan untuk menghitung mental lebih cepat.`
    };
  }

  // PATTERN 2: Perkalian Bilangan Belasan & Pembagian
  if (patternIndex === 1) {
    const isMult = Math.random() > 0.5;
    if (isMult) {
      const a = Math.floor(Math.random() * 25) + 11; // 11 - 35
      const b = [12, 15, 20, 25, 14, 16][Math.floor(Math.random() * 6)];
      const ans = a * b;

      const options = [
        `A. ${ans}`,
        `B. ${ans + 20}`,
        `C. ${ans - 15}`,
        `D. ${ans + 35}`
      ].sort(() => Math.random() - 0.5);

      return {
        id: randomId,
        category: 'math-basic',
        subCategory: 'Perkalian Dasar',
        question: `Berapakah hasil dari ${a} × ${b} ?`,
        options,
        correctAnswer: options.findIndex(o => o.includes(`${ans}`)),
        explanation: `${a} × ${b} = ${ans}.`,
        quickTrick: `💡 Trik Pecah Pengali: ${a} × ${b} = (${a} × ${b >= 20 ? 20 : 10}) + (${a} × ${b % 10}).`
      };
    } else {
      const divisor = [12, 14, 15, 16, 18, 24, 25][Math.floor(Math.random() * 7)];
      const quotient = Math.floor(Math.random() * 20) + 12;
      const dividend = divisor * quotient;

      const options = [
        `A. ${quotient}`,
        `B. ${quotient + 4}`,
        `C. ${quotient - 3}`,
        `D. ${quotient + 8}`
      ].sort(() => Math.random() - 0.5);

      return {
        id: randomId,
        category: 'math-basic',
        subCategory: 'Pembagian Dasar',
        question: `Berapakah hasil dari ${dividend} ÷ ${divisor} ?`,
        options,
        correctAnswer: options.findIndex(o => o.includes(`${quotient}`)),
        explanation: `${dividend} ÷ ${divisor} = ${quotient}.`,
        quickTrick: `💡 Trik Pembagian: Estimasi digit terakhir perkalian (${divisor % 10} × ${quotient % 10} = ${dividend % 10}).`
      };
    }
  }

  // PATTERN 3: Operasi Campuran Kabataku
  if (patternIndex === 2) {
    const a = Math.floor(Math.random() * 40) + 25;
    const b = Math.floor(Math.random() * 12) + 6;
    const c = Math.floor(Math.random() * 5) + 3;
    const div = [12, 15, 18, 20, 24, 30][Math.floor(Math.random() * 6)];
    const d = [3, 4, 5, 6][Math.floor(Math.random() * 4)];
    const divRes = Math.floor(div / d);
    const ans = a + (b * c) - divRes;

    const options = [
      `A. ${ans}`,
      `B. ${ans + 8}`,
      `C. ${ans - 6}`,
      `D. ${ans + 15}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Operasi Campuran Kabataku',
      question: `Berapakah hasil dari ${a} + ${b} × ${c} - ${div} ÷ ${d} ?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${ans}`)),
      explanation: `Urutan Kabataku: Dahulukan perkalian (${b} × ${c} = ${b * c}) dan pembagian (${div} ÷ ${d} = ${divRes}). Maka: ${a} + ${b * c} - ${divRes} = ${ans}.`,
      quickTrick: `💡 Trik Kabataku: Hitung perkalian dan pembagian lebih dulu sebelum penjumlahan.`
    };
  }

  // PATTERN 4: Bilangan Bulat Negatif
  if (patternIndex === 3) {
    const a = Math.floor(Math.random() * 35) + 15;
    const b = Math.floor(Math.random() * 45) + 20;
    const c = Math.floor(Math.random() * 25) + 10;
    // -a + (-b) - (-c) = -a - b + c
    const ans = -a - b + c;

    const options = [
      `A. ${ans}`,
      `B. ${ans - 10}`,
      `C. ${-ans}`,
      `D. ${ans + 20}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Bilangan Negatif',
      question: `Berapakah hasil dari -${a} + (-${b}) - (-${c}) ?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${ans}`)),
      explanation: `-${a} + (-${b}) = -${a + b}. Pengurangan negatif menjadi positif: -${a + b} + ${c} = ${ans}.`,
      quickTrick: `💡 Trik Tanda Minus: Minus ketemu minus menjadi plus (- -${c} = +${c}).`
    };
  }

  // PATTERN 5: Akar & Pangkat Sederhana
  if (patternIndex === 4) {
    const rootVal1 = [12, 13, 14, 15, 16, 20, 25][Math.floor(Math.random() * 7)];
    const rootVal2 = [6, 7, 8, 9, 10][Math.floor(Math.random() * 5)];
    const squareVal = [2, 3, 4][Math.floor(Math.random() * 3)];
    const sqRes = squareVal * squareVal;
    const sq1 = rootVal1 * rootVal1;
    const sq2 = rootVal2 * rootVal2;
    const ans = rootVal1 + rootVal2 - sqRes;

    const options = [
      `A. ${ans}`,
      `B. ${ans + 5}`,
      `C. ${ans - 4}`,
      `D. ${ans + 12}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Akar & Pangkat',
      question: `Berapakah nilai dari √${sq1} + √${sq2} - ${squareVal}² ?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${ans}`)),
      explanation: `√${sq1} = ${rootVal1}, √${sq2} = ${rootVal2}, ${squareVal}² = ${sqRes}. Maka: ${rootVal1} + ${rootVal2} - ${sqRes} = ${ans}.`,
      quickTrick: `💡 Trik Hafalan Kuadrat: Kuadratkan ${squareVal}² = ${sqRes}, lalu jumlahkan nilai akarnya.`
    };
  }

  // PATTERN 6: Pecahan & Persen
  if (patternIndex === 5) {
    const fractions = [
      { f: '1/4', p: '25%' },
      { f: '3/4', p: '75%' },
      { f: '2/5', p: '40%' },
      { f: '3/5', p: '60%' },
      { f: '4/5', p: '80%' },
      { f: '1/8', p: '12,5%' },
      { f: '3/8', p: '37,5%' },
      { f: '5/8', p: '62,5%' }
    ];
    const item = fractions[Math.floor(Math.random() * fractions.length)];
    const options = [
      `A. ${item.p}`,
      `B. ${(parseFloat(item.p) + 10).toString().replace('.', ',')}%`,
      `C. ${(parseFloat(item.p) - 5).toString().replace('.', ',')}%`,
      `D. ${(parseFloat(item.p) + 15).toString().replace('.', ',')}%`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Pecahan ke Persen',
      question: `Bentuk persen (%) dari pecahan ${item.f} adalah ...`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${item.p}`)),
      explanation: `Kalikan pecahan dengan 100%: (${item.f}) × 100% = ${item.p}.`,
      quickTrick: `💡 Trik Pengali 100: Bagi 100 dengan penyebut lalu kalikan dengan pembilang.`
    };
  }

  // PATTERN 7: Persentase & Diskon Belanja Pabrik
  if (patternIndex === 6) {
    const prices = [250000, 350000, 450000, 500000, 650000, 800000, 1200000];
    const discounts = [10, 15, 20, 25, 30, 40];
    const price = prices[Math.floor(Math.random() * prices.length)];
    const disc = discounts[Math.floor(Math.random() * discounts.length)];
    const discAmount = (price * disc) / 100;
    const finalPrice = price - discAmount;

    const options = [
      `A. ${formatRupiah(finalPrice)}`,
      `B. ${formatRupiah(finalPrice + 25000)}`,
      `C. ${formatRupiah(finalPrice - 20000)}`,
      `D. ${formatRupiah(finalPrice + 50000)}`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Persen Diskon',
      question: `Satu set suku cadang perkakas seharga ${formatRupiah(price)} mendapatkan potongan diskon ${disc}%. Berapakah harga yang harus dibayar?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(formatRupiah(finalPrice))),
      explanation: `Besar diskon = ${disc}% × ${formatRupiah(price)} = ${formatRupiah(discAmount)}. Harga akhir = ${formatRupiah(price)} - ${formatRupiah(discAmount)} = ${formatRupiah(finalPrice)}.`,
      quickTrick: `💡 Trik Persen Cepat: Kalikan langsung harga dengan ${100 - disc}% (0,${100 - disc}).`
    };
  }

  // PATTERN 8: Perbandingan Tenaga Kerja Shift (Berbalik Nilai)
  if (patternIndex === 7) {
    const workers1 = [6, 8, 10, 12, 15, 20][Math.floor(Math.random() * 6)];
    const days1 = [12, 15, 20, 24, 30][Math.floor(Math.random() * 5)];
    const totalManDays = workers1 * days1;
    const days2Options = [6, 8, 10, 12, 15].filter(d => d !== days1 && totalManDays % d === 0);
    const days2 = days2Options.length > 0 ? days2Options[0] : 10;
    const workers2 = Math.round(totalManDays / days2);

    const options = [
      `A. ${workers2} orang`,
      `B. ${workers2 + 3} orang`,
      `C. ${workers2 - 2} orang`,
      `D. ${workers2 + 6} orang`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Perbandingan Tenaga Kerja',
      question: `Suatu proyek assembling pabrik dapat diselesaikan oleh ${workers1} orang teknisi dalam waktu ${days1} hari. Jika target penyelesaian dipercepat menjadi ${days2} hari, berapa total teknisi yang dibutuhkan?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${workers2} orang`)),
      explanation: `Gunakan perbandingan berbalik nilai: (Teknisi 1 × Hari 1) = (Teknisi 2 × Hari 2). ${workers1} × ${days1} = X × ${days2} -> ${totalManDays} = ${days2}X -> X = ${workers2} orang.`,
      quickTrick: `💡 Trik Beban Kerja: Kalikan orang dan hari (${workers1} × ${days1} = ${totalManDays} man-days). Bagi dengan target hari: ${totalManDays} ÷ ${days2} = ${workers2} orang.`
    };
  }

  // PATTERN 9: Kecepatan Produksi Mesin
  if (patternIndex === 8) {
    const speedPerMin = [15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 6)];
    const minutesSample = 15;
    const outputSample = speedPerMin * minutesSample;
    const targetHours = [1.5, 2, 2.5, 3][Math.floor(Math.random() * 4)];
    const targetMinutes = targetHours * 60;
    const totalOutput = speedPerMin * targetMinutes;

    const options = [
      `A. ${totalOutput.toLocaleString('id-ID')} unit`,
      `B. ${(totalOutput + 300).toLocaleString('id-ID')} unit`,
      `C. ${(totalOutput - 250).toLocaleString('id-ID')} unit`,
      `D. ${(totalOutput + 600).toLocaleString('id-ID')} unit`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Kapasitas Mesin',
      question: `Sebuah mesin stamping otomatis mampu menghasilkan ${outputSample} komponen dalam waktu ${minutesSample} menit. Berapakah jumlah komponen yang dihasilkan jika mesin beroperasi stabil selama ${targetHours} jam?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${totalOutput.toLocaleString('id-ID')} unit`)),
      explanation: `Kapasitas per menit = ${outputSample} ÷ ${minutesSample} = ${speedPerMin} unit/menit. Waktu ${targetHours} jam = ${targetMinutes} menit. Total produksi = ${speedPerMin} × ${targetMinutes} = ${totalOutput} unit.`,
      quickTrick: `💡 Trik Kapasitas Jam: Hitung output per jam (${speedPerMin * 60} unit/jam), lalu kalikan dengan ${targetHours} jam.`
    };
  }

  // PATTERN 10: Konversi Satuan Panjang (m, cm, mm)
  if (patternIndex === 9) {
    const meters = (Math.floor(Math.random() * 12) + 2) + 0.5; // e.g. 3.5, 5.5, 7.5
    const mm = meters * 1000;

    const options = [
      `A. ${mm.toLocaleString('id-ID')} mm`,
      `B. ${(mm / 10).toLocaleString('id-ID')} mm`,
      `C. ${(mm * 10).toLocaleString('id-ID')} mm`,
      `D. ${(mm / 100).toLocaleString('id-ID')} mm`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Konversi Satuan Panjang',
      question: `Batang pipa tembaga memiliki panjang ${meters} meter. Berapakah panjang pipa tersebut jika dinyatakan dalam milimeter (mm)?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${mm.toLocaleString('id-ID')} mm`)),
      explanation: `1 meter = 100 cm = 1.000 mm. Maka ${meters} m × 1.000 = ${mm} mm.`,
      quickTrick: `💡 Tangga Satuan Panjang: Meter ke milimeter turun 3 tingkat -> dikalikan 1.000.`
    };
  }

  // PATTERN 11: Konversi Satuan Berat (Ton, Kuintal, Kg)
  if (patternIndex === 10) {
    const tons = (Math.floor(Math.random() * 4) + 1) + 0.5; // e.g. 1.5, 2.5, 3.5
    const kuintal = Math.floor(Math.random() * 5) + 2; // e.g. 3, 4, 5
    const totalKg = (tons * 1000) + (kuintal * 100);

    const options = [
      `A. ${totalKg.toLocaleString('id-ID')} kg`,
      `B. ${(totalKg + 200).toLocaleString('id-ID')} kg`,
      `C. ${(totalKg - 300).toLocaleString('id-ID')} kg`,
      `D. ${(totalKg + 500).toLocaleString('id-ID')} kg`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Konversi Satuan Berat',
      question: `Sebuah kontainer memuat ${tons} ton pelat baja dan ${kuintal} kuintal mur baut. Berapakah berat total muatan tersebut dalam kilogram (kg)?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${totalKg.toLocaleString('id-ID')} kg`)),
      explanation: `1 ton = 1.000 kg -> ${tons} ton = ${tons * 1000} kg. 1 kuintal = 100 kg -> ${kuintal} kuintal = ${kuintal * 100} kg. Total = ${tons * 1000} + ${kuintal * 100} = ${totalKg} kg.`,
      quickTrick: `💡 Konversi Berat: 1 Ton = 1.000 kg, 1 Kuintal = 100 kg.`
    };
  }

  // PATTERN 12: Konversi Satuan Volume (Liter, ml, cc, dm3, m3)
  if (patternIndex === 11) {
    const liters = (Math.floor(Math.random() * 6) + 2) + 0.5; // e.g. 2.5, 4.5
    const ml = liters * 1000;

    const options = [
      `A. ${ml.toLocaleString('id-ID')} ml`,
      `B. ${(ml / 10).toLocaleString('id-ID')} ml`,
      `C. ${(ml * 10).toLocaleString('id-ID')} ml`,
      `D. ${(ml / 100).toLocaleString('id-ID')} ml`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Konversi Satuan Volume',
      question: `Drum hidrolik berisi ${liters} liter oli pelumas mesin. Berapakah volume oli tersebut dalam satuan mililiter (ml) atau cc?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${ml.toLocaleString('id-ID')} ml`)),
      explanation: `1 liter = 1 dm³ = 1.000 ml = 1.000 cc. Maka ${liters} liter × 1.000 = ${ml} ml.`,
      quickTrick: `💡 Satuan Volume: 1 Liter = 1.000 ml = 1.000 cc.`
    };
  }

  // PATTERN 13: Konversi Satuan Waktu (Jam, Menit, Detik)
  if (patternIndex === 12) {
    const hours = (Math.floor(Math.random() * 5) + 1) + 0.5; // e.g. 1.5, 2.5, 3.5
    const minutes = hours * 60;

    const options = [
      `A. ${minutes} menit`,
      `B. ${minutes + 20} menit`,
      `C. ${minutes - 15} menit`,
      `D. ${minutes + 40} menit`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Konversi Satuan Waktu',
      question: `Waktu siklus pengujian produk di lab QC adalah ${hours} jam. Berapakah waktu tersebut jika dikonversikan ke satuan menit?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${minutes} menit`)),
      explanation: `1 jam = 60 menit. Maka ${hours} jam × 60 = ${minutes} menit.`,
      quickTrick: `💡 Satuan Waktu: Kalikan jumlah jam dengan 60 menit.`
    };
  }

  // PATTERN 14: Konversi Kuantitas Grosir (Lusin, Kodi, Gross, Rim)
  if (patternIndex === 13) {
    const lusin = Math.floor(Math.random() * 5) + 3; // e.g. 4 lusin
    const kodi = Math.floor(Math.random() * 3) + 1; // e.g. 2 kodi
    const totalUnits = (lusin * 12) + (kodi * 20);

    const options = [
      `A. ${totalUnits} unit`,
      `B. ${totalUnits + 10} unit`,
      `C. ${totalUnits - 12} unit`,
      `D. ${totalUnits + 16} unit`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Satuan Kuantitas Pabrik',
      question: `Gudang logistik menerima ${lusin} lusin APD kacamata dan ${kodi} kodi sarung tangan. Berapakah jumlah total unit barang tersebut?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${totalUnits} unit`)),
      explanation: `1 lusin = 12 unit (${lusin} × 12 = ${lusin * 12} unit). 1 kodi = 20 unit (${kodi} × 20 = ${kodi * 20} unit). Total = ${lusin * 12} + ${kodi * 20} = ${totalUnits} unit.`,
      quickTrick: `💡 Kuantitas Grosir: Lusin = 12, Kodi = 20, Gross = 144 (12 lusin), Rim = 500 lembar.`
    };
  }

  // PATTERN 15: Luas & Dimensi Bangun Datar
  if (patternIndex === 14) {
    const p = Math.floor(Math.random() * 15) + 10;
    const l = Math.floor(Math.random() * 8) + 4;
    const area = p * l;

    const options = [
      `A. ${area} m²`,
      `B. ${area + 12} m²`,
      `C. ${area - 8} m²`,
      `D. ${area + 24} m²`
    ].sort(() => Math.random() - 0.5);

    return {
      id: randomId,
      category: 'math-basic',
      subCategory: 'Luas Bangun Datar',
      question: `Area workshop stamping berbentuk persegi panjang dengan panjang ${p} meter dan lebar ${l} meter. Berapakah luas area workshop tersebut?`,
      options,
      correctAnswer: options.findIndex(o => o.includes(`${area} m²`)),
      explanation: `Luas persegi panjang = Panjang × Lebar = ${p} m × ${l} m = ${area} m².`,
      quickTrick: `💡 Rumus Luas: Panjang × Lebar.`
    };
  }

  // PATTERN 16: Statistik Rata-rata Output
  const d1 = Math.floor(Math.random() * 15) + 10;
  const d2 = Math.floor(Math.random() * 15) + 15;
  const d3 = Math.floor(Math.random() * 15) + 12;
  const d4 = Math.floor(Math.random() * 15) + 18;
  const sum = d1 + d2 + d3 + d4;
  const avg = sum / 4;

  const options = [
    `A. ${avg} unit`,
    `B. ${avg + 2} unit`,
    `C. ${avg - 1.5} unit`,
    `D. ${avg + 4} unit`
  ].sort(() => Math.random() - 0.5);

  return {
    id: randomId,
    category: 'math-basic',
    subCategory: 'Rata-rata Statistik',
    question: `Data jumlah produk reject selama 4 shift berturut-turut adalah: ${d1}, ${d2}, ${d3}, dan ${d4} unit. Berapakah rata-rata produk reject per shift?`,
    options,
    correctAnswer: options.findIndex(o => o.includes(`${avg} unit`)),
    explanation: `Rata-rata = (${d1} + ${d2} + ${d3} + ${d4}) ÷ 4 = ${sum} ÷ 4 = ${avg} unit.`,
    quickTrick: `💡 Trik Rata-rata: Jumlahkan seluruh data lalu bagi dengan jumlah shift (4).`
  };
}

// Generate exact count of unique questions requested (10, 30, 50, 100, up to 1,000+)
export function getCustomMathTestBatch(count: number = 10): BaseQuestion[] {
  const batch: BaseQuestion[] = [];
  const seenSignatures = new Set<string>();

  while (batch.length < count) {
    const q = generateParametricMathQuestion();
    const sig = q.question;
    if (!seenSignatures.has(sig)) {
      seenSignatures.add(sig);
      batch.push(q);
    }
  }

  return batch;
}

// Standard locked duration per question count preset
export function getMathStandardDuration(questionCount: number): { seconds: number; label: string; perQuestion: string } {
  switch (questionCount) {
    case 10:
      return { seconds: 10 * 60, label: '10 Menit', perQuestion: '60 detik / soal' };
    case 30:
      return { seconds: 25 * 60, label: '25 Menit', perQuestion: '50 detik / soal' };
    case 50:
      return { seconds: 40 * 60, label: '40 Menit', perQuestion: '48 detik / soal' };
    case 100:
      return { seconds: 75 * 60, label: '75 Menit', perQuestion: '45 detik / soal' };
    default:
      return { seconds: 10 * 60, label: '10 Menit', perQuestion: '60 detik / soal' };
  }
}
