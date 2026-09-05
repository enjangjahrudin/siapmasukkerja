import { TargetRole, InterviewRubric } from '../types';

export interface InterviewQuestionItem {
  id: string;
  role: TargetRole;
  question: string;
  interviewerPersona: string;
  expectedKeywords: string[];
  followUpPrompt: string;
  idealAnswer: string;
}

export const interviewQuestionsBank: Record<TargetRole, InterviewQuestionItem[]> = {
  operator: [
    {
      id: 'op-1',
      role: 'operator',
      question: 'Halo, selamat pagi. Silakan perkenalkan diri Anda secara singkat, ceritakan latar belakang pendidikan dan pengalaman praktik kerja (PKL) Anda.',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['nama', 'smk', 'jurusan', 'pkl', 'disiplin', 'perakitan', 'mesin', 'tanggung jawab'],
      followUpPrompt: 'Bagus. Dari pengalaman PKL tersebut, hal tersulit apa yang pernah Anda hadapi dan bagaimana Anda mengatasinya?',
      idealAnswer: 'Selamat pagi Bapak Hendra. Nama saya Ahmad Fauzi, lulusan SMK Negeri 1 Jurusan Teknik Mesin. Selama masa sekolah, saya aktif dalam kegiatan bengkel dan menyelesaikan Praktik Kerja Lapangan (PKL) selama 6 bulan di bagian line perakitan mesin. Saya terbiasa dengan target produksi harian, disiplin waktu, dan penerapan K3 di tempat kerja. Saya sangat termotivasi untuk bergabung dan berkontribusi sebagai Operator Produksi di perusahaan ini.'
    },
    {
      id: 'op-2',
      role: 'operator',
      question: 'Di posisi Operator Produksi, Anda akan menghadapi pekerjaan berulang (repetitif), target harian yang ketat, dan sistem shift termasuk shift malam. Bagaimana kesiapan fisik dan mental Anda?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['siap', 'shift', 'malam', 'fisik', 'kebugaran', 'fokus', 'lembur', 'olahraga', 'sop'],
      followUpPrompt: 'Bagaimana cara Anda menjaga stamina agar tetap fokus dan tidak mengantuk saat shift 3?',
      idealAnswer: 'Saya sangat siap fisik dan mental untuk bekerja dalam sistem shift maupun lembur sesuai kebutuhan produksi. Di masa sekolah dan PKL, saya terbiasa dengan aktivitas fisik aktif dan rutin menjaga kebugaran dengan berolahraga. Untuk shift malam, saya menerapkan pola istirahat teratur di siang hari, menjaga asupan cairan, dan selalu mematuhi SOP keselamatan kerja agar tetap fokus dan terhindar dari kecelakaan kerja.'
    },
    {
      id: 'op-3',
      role: 'operator',
      question: 'Jika saat Anda sedang bekerja di line produksi, mesin yang Anda operasikan tiba-tiba mengeluarkan suara tidak normal atau hasil rakitan tidak presisi, apa tindakan pertama yang akan Anda lakukan?',
      interviewerPersona: 'Bapak Dimas (Supervisor Produksi Manufaktur)',
      expectedKeywords: ['stop', 'matikan', 'lapor', 'leader', 'foreman', 'andon', 'sop', 'jangan dipaksa'],
      followUpPrompt: 'Mengapa Anda tidak mencoba memperbaiki mesin tersebut sendiri?',
      idealAnswer: 'Tindakan pertama saya adalah segera menghentikan mesin (menekan tombol stop/andon) untuk mencegah kerusakan lebih parah atau kecelakaan kerja. Kemudian, saya akan segera melaporkan kondisi tersebut kepada Team Leader atau Foreman dan mencatat kronologinya. Saya tidak akan mencoba membongkar mesin sendiri di luar wewenang karena itu melanggar SOP keselamatan dan penanganan teknis.'
    }
  ],
  qc: [
    {
      id: 'qc-1',
      role: 'qc',
      question: 'Selamat pagi. Silakan jelaskan pemahaman Anda mengenai tugas seorang Quality Control (QC) dan mengapa posisi ini sangat penting di sebuah pabrik manufaktur?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['standar', 'spesifikasi', 'cacat', 'defect', 'zero defect', 'inspeksi', 'kepuasan pelanggan', 'sop'],
      followUpPrompt: 'Alat ukur presisi apa saja yang sudah pernah Anda gunakan saat sekolah atau PKL?',
      idealAnswer: 'Selamat pagi Ibu Ratna. Bagi saya, Quality Control adalah garda terdepan penjamin mutu produk sebelum sampai ke tangan konsumen. Tugas utama QC adalah memastikan seluruh bahan baku, proses di line produksi, hingga barang jadi (finished goods) memenuhi standar spesifikasi dan toleransi gambar kerja (drawing). QC sangat penting untuk mencegah produk cacat (NG) lolos ke pasar, menjaga reputasi perusahaan, dan memastikan efisiensi biaya produksi.'
    },
    {
      id: 'qc-2',
      role: 'qc',
      question: 'Misalkan Anda menemukan satu batch produk mengalami penyimpangan dimensi (Reject), namun bagian produksi mendesak agar produk tersebut diloloskan karena mengejar target pengiriman hari ini. Bagaimana sikap Anda?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['tegas', 'tahan', 'hold', 'tolak', 'sop', 'lapor', 'leader', 'komunikasi baik', 'tidak kompromi'],
      followUpPrompt: 'Bagaimana cara Anda menyampaikannya ke supervisor produksi agar tidak terjadi konflik personal?',
      idealAnswer: 'Saya akan tetap tegas berpegang teguh pada standar kualitas dan SOP yang berlaku dengan menahan (HOLD) batch tersebut dan memberi label status Reject / NG. Saya akan menyampaikan data hasil pengukuran secara objektif dan sopan kepada Foreman QC dan Supervisor Produksi. Kualitas tidak dapat dikompromikan demi target semata, karena meloloskan barang reject akan menimbulkan klaim konsumen dan kerugian yang jauh lebih besar bagi perusahaan.'
    }
  ],
  maintenance: [
    {
      id: 'maint-1',
      role: 'maintenance',
      question: 'Silakan ceritakan keahlian dasar kelistrikan dan mekanik yang Anda kuasai, serta pemahaman Anda tentang Preventive Maintenance.',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['preventive', 'pencegahan', 'perawatan', 'multimeter', 'wiring', 'motor', 'pelumasan', 'troubleshooting'],
      followUpPrompt: 'Apa langkah pertama Anda dalam melakukan isolasi sumber tegangan (LOTO)?',
      idealAnswer: 'Saya memiliki kompetensi dasar dalam membaca diagram kelistrikan (wiring diagram), penggunaan alat ukur seperti multimeter dan tang ampere, serta perawatan mekanikal dasar seperti pelumasan bearing dan penggantian belt. Preventive Maintenance adalah perawatan berkala terjadwal untuk mencegah terjadinya kerusakan mendadak pada mesin (breakdown), sehingga usia pakai mesin optimal dan downtime produksi minimal.'
    }
  ],
  logistics: [
    {
      id: 'log-1',
      role: 'logistics',
      question: 'Ceritakan pengalaman Anda dalam manajemen barang, stock opname, dan penerapan metode FIFO di gudang.',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['fifo', 'first in first out', 'stock', 'opname', 'akurasi', 'barcode', 'labeling', 'tata letak'],
      followUpPrompt: 'Bagaimana Anda memastikan barang yang keluar dari gudang tidak mengalami selisih data sistem dengan fisik?',
      idealAnswer: 'Saya memahami konsep FIFO (First In First Out), di mana barang yang pertama kali masuk ke gudang harus menjadi barang pertama yang dikeluarkan ke line perakitan atau pengiriman untuk mencegah kedaluwarsa atau penumpukan stok lama. Saya terbiasa dengan pencatatan kartu stok, scan barcode, dan pelaksanaan stock opname fisik secara teliti agar data sistem selalu cocok 100% dengan fisik di rak gudang.'
    }
  ]
};

export function evaluateUserInterviewResponse(
  userText: string,
  questionItem: InterviewQuestionItem
): InterviewRubric {
  const lower = userText.toLowerCase().trim();
  const wordCount = lower.split(/\s+/).filter(Boolean).length;

  if (wordCount < 5) {
    return {
      relevanceScore: 25,
      articulationScore: 30,
      etiquetteScore: 50,
      jobFitScore: 25,
      totalAcceptanceProbability: 32,
      strengths: ['Sudah bersedia mencoba menjawab.'],
      weaknesses: ['Jawaban terlalu singkat dan belum memuat detail pengalaman atau alasan konkret.'],
      actionableFeedback: 'Kembangkan jawaban Anda menjadi minimal 3-4 kalimat terstruktur menggunakan metode STAR (Situation, Task, Action, Result).',
      idealAnswer: questionItem.idealAnswer
    };
  }

  // Count keyword hits
  const matchedKeywords = questionItem.expectedKeywords.filter(kw => lower.includes(kw));
  const keywordRatio = matchedKeywords.length / Math.max(1, questionItem.expectedKeywords.length);

  // 1. Relevance Score (35%)
  let relevanceScore = Math.min(100, Math.round(50 + keywordRatio * 50));
  if (wordCount > 30) relevanceScore = Math.min(100, relevanceScore + 10);

  // 2. Articulation Score (25%)
  const fillerCount = (lower.match(/\b(e+|anu|apa ya|gitu lah|kayak|ee+)\b/g) || []).length;
  let articulationScore = Math.min(100, Math.round(70 + (wordCount >= 25 ? 20 : 5) - fillerCount * 8));
  articulationScore = Math.max(40, articulationScore);

  // 3. Etiquette Score (20%)
  const politeWords = ['selamat', 'pagi', 'siang', 'bapak', 'ibu', 'terima kasih', 'saya', 'siap', 'izin', 'mohon'];
  const matchedPolite = politeWords.filter(w => lower.includes(w)).length;
  let etiquetteScore = Math.min(100, Math.round(60 + matchedPolite * 10));

  // 4. Job Fit Score (20%)
  let jobFitScore = Math.min(100, Math.round(55 + keywordRatio * 45));

  // Calculate Weighted Total Probability
  const totalAcceptanceProbability = Math.round(
    relevanceScore * 0.35 +
    articulationScore * 0.25 +
    etiquetteScore * 0.20 +
    jobFitScore * 0.20
  );

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (matchedKeywords.length >= 3) {
    strengths.push(`Menyebutkan istilah teknis yang relevan (${matchedKeywords.slice(0, 3).join(', ')}).`);
  }
  if (wordCount >= 30) {
    strengths.push('Penjelasan runtut dan memberikan gambaran pengalaman yang cukup komprehensif.');
  }
  if (matchedPolite >= 2) {
    strengths.push('Bahasa dan etika penyampaian sopan dan santun.');
  }
  if (strengths.length === 0) {
    strengths.push('Berani menyampaikan poin inti dengan jelas.');
  }

  if (keywordRatio < 0.4) {
    weaknesses.push('Belum banyak mengaitkan jawaban dengan SOP industri, standar K3, atau komitmen kerja nyata.');
  }
  if (fillerCount > 1) {
    weaknesses.push(`Terdeteksi beberapa filler words (${fillerCount}x), usahakan jeda hening sejenak daripada mengucapkan "eee".`);
  }
  if (wordCount < 20) {
    weaknesses.push('Jawaban agak singkat, tambahkan contoh nyata saat PKL atau kegiatan di sekolah.');
  }

  let actionableFeedback = '';
  if (totalAcceptanceProbability >= 85) {
    actionableFeedback = 'Performa interview luar biasa! Pertahankan tempo bicara yang tenang dan artikulasi tegas ini saat sesi tatap muka langsung.';
  } else if (totalAcceptanceProbability >= 70) {
    actionableFeedback = 'Jawaban sudah baik dan berpotensi besar lolos. Untuk meningkatkan peluang ke atas 90%, gunakan struktur jawaban: Contoh Masalah -> Tindakan Anda -> Hasil Positifnya.';
  } else {
    actionableFeedback = 'Tingkatkan penguasaan istilah industri (SOP, K3, Zero Defect) dan latih kembali intonasi bicara agar terdengar lebih mantap dan percaya diri.';
  }

  return {
    relevanceScore,
    articulationScore,
    etiquetteScore,
    jobFitScore,
    totalAcceptanceProbability,
    strengths,
    weaknesses,
    actionableFeedback,
    idealAnswer: questionItem.idealAnswer
  };
}
