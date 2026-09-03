export interface SequentialMultiplicationItem {
  index: number; // 1 to 100
  factorA: number;
  factorB: number;
  correctAnswer: number;
  expectedDigits: number;
}

// Generates the strict 100 sequential items: 1x1, 1x2, ... 1x10, 2x1, ... 10x10
export function generateSequentialMultiplicationList(): SequentialMultiplicationItem[] {
  const list: SequentialMultiplicationItem[] = [];
  let index = 1;

  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      const ans = a * b;
      list.push({
        index,
        factorA: a,
        factorB: b,
        correctAnswer: ans,
        expectedDigits: ans.toString().length
      });
      index++;
    }
  }

  return list;
}

export function evaluateSequentialMultiplication(
  history: { item: SequentialMultiplicationItem; userAnswer: number; isCorrect: boolean }[],
  timeSpentSeconds: number = 120
) {
  const totalCompleted = history.length;
  const correctCount = history.filter(h => h.isCorrect).length;
  const wrongCount = totalCompleted - correctCount;
  const accuracy = totalCompleted > 0 ? Math.round((correctCount / totalCompleted) * 100) : 0;
  
  const lastItem = history[history.length - 1];
  const stoppedAtText = lastItem 
    ? `Perkalian ${lastItem.item.factorA} × ${lastItem.item.factorB} (Soal #${lastItem.item.index} dari 100)`
    : 'Belum memulai';

  let grade = 'Perlu Latihan';
  let badgeColor = 'bg-amber-100 text-amber-900 border-amber-200';
  let message = 'Tingkatkan kecepatan berhitung dasar perkalian 6 sampai 9 setiap hari.';

  if (totalCompleted >= 80 && accuracy >= 95) {
    grade = 'Sangat Istimewa (Master Aritmatika Pabrik)';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    message = 'Luar biasa! Kecepatan mental aritmatika Anda mencapai level teratas standar seleksi industri manufaktur!';
  } else if (totalCompleted >= 50 && accuracy >= 90) {
    grade = 'Sangat Baik (Lolos PT Astra/Epson)';
    badgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
    message = 'Kemampuan dan kecepatan perkalian Anda sangat baik dan siap bersaing dalam psikotes kerja.';
  } else if (totalCompleted >= 30 && accuracy >= 80) {
    grade = 'Cukup Baik';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-200';
    message = 'Sudah cukup baik, latih refleks ketukan angka di keyboard agar lebih cepat mencapai 50+ soal.';
  }

  return {
    totalCompleted,
    correctCount,
    wrongCount,
    accuracy,
    stoppedAtText,
    lastFactorA: lastItem?.item.factorA || 1,
    lastFactorB: lastItem?.item.factorB || 1,
    progressPercentage: Math.round((totalCompleted / 100) * 100),
    grade,
    badgeColor,
    message
  };
}
