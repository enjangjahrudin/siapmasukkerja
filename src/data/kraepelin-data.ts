// Generator and utilities for Kraepelin and Pauli test
export interface KraepelinConfig {
  mode: 'kraepelin' | 'pauli'; // kraepelin: bottom-to-top, pauli: top-to-bottom
  secondsPerColumn: number;
  totalColumns: number;
  rowsPerColumn: number;
}

export function generateColumnNumbers(rows: number = 30): number[] {
  const nums: number[] = [];
  for (let i = 0; i < rows; i++) {
    // Generate random 1 to 9 (no zero in classic Kraepelin)
    nums.push(Math.floor(Math.random() * 9) + 1);
  }
  return nums;
}

export function calculateKraepelinMetrics(
  columnResults: { answered: number; correct: number; wrong: number }[]
) {
  if (columnResults.length === 0) {
    return {
      panker: 0,
      tianker: 0,
      janker: 0,
      hankan: 0,
      totalSum: 0,
      statusGrade: 'Perlu Latihan' as const,
      feedback: ['Belum ada data pengerjaan yang terekam.']
    };
  }

  const answeredList = columnResults.map(c => c.answered);
  const totalAnswered = answeredList.reduce((a, b) => a + b, 0);
  const totalCorrect = columnResults.reduce((a, b) => a + b.correct, 0);
  const totalWrong = columnResults.reduce((a, b) => a + b.wrong, 0);

  // 1. Panker (Kecepatan rata-rata per kolom)
  const panker = totalAnswered / columnResults.length;

  // 2. Tianker (Kestabilan - Standar Deviasi)
  const mean = panker;
  const variance = answeredList.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / columnResults.length;
  const tianker = Math.sqrt(variance);

  // 3. Janker (Ketelitian %)
  const janker = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

  // 4. Hankan (Ketahanan Kerja - Slope Garis Regresi Linier)
  const n = columnResults.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = answeredList[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const hankan = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) : 0;

  // Grade classification
  let statusGrade: 'Sangat Baik (Lolos PT Astra/Epson)' | 'Baik (Lolos Standar)' | 'Cukup' | 'Perlu Latihan' = 'Perlu Latihan';
  const feedback: string[] = [];

  if (panker >= 16 && janker >= 95 && tianker <= 2.5 && hankan >= 0) {
    statusGrade = 'Sangat Baik (Lolos PT Astra/Epson)';
    feedback.push('Performa luar biasa! Kecepatan dan ketelitian Anda berada di 10% teratas standar rekrutmen Astra & Epson.');
  } else if (panker >= 12 && janker >= 90) {
    statusGrade = 'Baik (Lolos Standar)';
    feedback.push('Kecepatan dan ketelitian Anda sudah memenuhi standar seleksi sebagian besar pabrik manufaktur.');
  } else if (panker >= 9 && janker >= 80) {
    statusGrade = 'Cukup';
    feedback.push('Kecepatan masih bisa ditingkatkan. Cobalah untuk tidak terlalu lama memikirkan satu angka.');
  } else {
    statusGrade = 'Perlu Latihan';
    feedback.push('Tingkat ketelitian atau kecepatan masih di bawah standar minimal. Latihlah penjumlahan cepat setiap hari 15 menit.');
  }

  if (tianker > 3.5) {
    feedback.push('Grafik kerja Anda fluktuatif/kurang stabil. Jaga ritme napas dan konsentrasi agar ritme kerja konstan dari awal hingga akhir.');
  }
  if (hankan < -0.3) {
    feedback.push('Grafik Anda menurun tajam di kolom-kolom akhir (indikasi cepat lelah/stamina mental drop). Jangan terlalu memforsir di awal.');
  }

  return {
    panker: parseFloat(panker.toFixed(1)),
    tianker: parseFloat(tianker.toFixed(2)),
    janker: parseFloat(janker.toFixed(1)),
    hankan: parseFloat(hankan.toFixed(2)),
    totalSum: totalAnswered,
    statusGrade,
    feedback
  };
}
