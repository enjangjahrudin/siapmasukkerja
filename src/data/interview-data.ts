import { TargetRole, InterviewRubric } from '../types';

export interface RecruiterPersonaInfo {
  id: string;
  name: string;
  roleTitle: string;
  companyContext: string;
  avatarUrl: string;
  gender: 'male' | 'female';
  ttsVoice: 'onyx' | 'echo' | 'fable' | 'nova' | 'alloy' | 'shimmer';
  greeting: string;
  closing: string;
}

export const recruiterPersonas: Record<TargetRole, RecruiterPersonaInfo> = {
  operator: {
    id: 'hendra',
    name: 'Bapak Hendra',
    roleTitle: 'Senior HRD & Talent Recruiter Otomotif',
    companyContext: 'Divisi Rekrutmen Manufaktur & Perakitan',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    ttsVoice: 'onyx',
    greeting: 'Halo, selamat pagi. Terima kasih sudah hadir tepat waktu. Bagaimana kabarnya? Silakan perkenalkan diri Anda secara singkat, ceritakan latar belakang sekolah dan pengalaman PKL Anda.',
    closing: 'Baik, terima kasih banyak ya. Penjelasan Anda kami catat. Nanti saya sampaikan hasil evaluasinya.'
  },
  qc: {
    id: 'ratna',
    name: 'Ibu Ratna',
    roleTitle: 'Quality Assurance & QC Manager',
    companyContext: 'Divisi Standar Mutu & Inspeksi Presisi',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    gender: 'female',
    ttsVoice: 'nova',
    greeting: 'Selamat pagi. Terima kasih atas kehadirannya. Silakan perkenalkan diri dan ceritakan pemahaman Anda mengenai peran Quality Control di pabrik manufaktur.',
    closing: 'Baik, terima kasih atas penjelasannya. Ketelitian dan komitmen mutu Anda cukup terlihat. Mari kita lihat hasilnya.'
  },
  maintenance: {
    id: 'suryo',
    name: 'Bapak Suryo',
    roleTitle: 'Chief Engineering & Maintenance Lead',
    companyContext: 'Divisi Perawatan Mesin & Otomasi Pabrik',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    ttsVoice: 'echo',
    greeting: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan keahlian dasar kelistrikan dan mekanik yang Anda kuasai.',
    closing: 'Oke, terima kasih. Pemahaman teknis dan kepedulian K3 Anda kami nilai dengan baik. Silakan lihat hasil asesmen ini.'
  },
  logistics: {
    id: 'anton',
    name: 'Bapak Anton',
    roleTitle: 'Warehouse & Supply Chain Lead',
    companyContext: 'Divisi Logistik, Pergudangan & Distribusi',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    gender: 'male',
    ttsVoice: 'fable',
    greeting: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan pengalaman dalam manajemen barang di gudang atau saat PKL.',
    closing: 'Oke baik, terima kasih. Ketelitian pencatatan stok dan kedisiplinan adalah kunci. Kita lihat evaluasi Anda ya.'
  }
};

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
      question: 'Halo, selamat pagi. Terima kasih sudah hadir tepat waktu. Silakan perkenalkan diri Anda secara singkat, ceritakan latar belakang pendidikan, kebiasaan, dan pengalaman Praktik Kerja Lapangan (PKL) Anda.',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['nama', 'smk', 'jurusan', 'pkl', 'disiplin', 'perakitan', 'mesin', 'tanggung jawab'],
      followUpPrompt: 'Bagus. Dari pengalaman PKL tersebut, apa tugas utama yang paling sering Anda kerjakan di line produksi?',
      idealAnswer: 'Selamat pagi Bapak Hendra. Nama saya Ahmad Fauzi, lulusan SMK Negeri 1 Jurusan Teknik Mesin. Selama masa sekolah, saya aktif dalam kegiatan bengkel dan menyelesaikan Praktik Kerja Lapangan (PKL) selama 6 bulan di bagian line perakitan mesin. Saya terbiasa dengan target produksi harian, disiplin waktu, dan penerapan K3 di tempat kerja. Saya sangat termotivasi untuk bergabung dan berkontribusi sebagai Operator Produksi di perusahaan ini.'
    },
    {
      id: 'op-2',
      role: 'operator',
      question: 'Dari pengalaman PKL dan praktik di sekolah yang Anda sebutkan tadi, keterampilan teknis apa yang paling Anda kuasai dalam mengoperasikan alat kerja atau mesin produksi?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['mesin', 'perakitan', 'alat', 'obeng', 'kunci', 'presisi', 'cepat', 'teliti', 'sop'],
      followUpPrompt: 'Bagaimana Anda memastikan hasil kerja perakitan Anda selalu rapi dan bebas dari kesalahan?',
      idealAnswer: 'Saya terbiasa mengoperasikan perkakas tangan elektrik (power tools) dan alat penunjang perakitan sesuai urutan kerja standar. Saya selalu melakukan pengecekan visual mandiri (self-check) pada setiap komponen sebelum dipasang untuk memastikan tidak ada baut yang kendor atau part yang terbalik.'
    },
    {
      id: 'op-3',
      role: 'operator',
      question: 'Di posisi Operator Produksi, Anda akan menghadapi pekerjaan dengan target harian ketat dan sistem 3 shift termasuk shift malam. Bagaimana kesiapan fisik Anda dan cara menjaga stamina agar tetap fokus saat bekerja di shift malam?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['siap', 'shift', 'malam', 'fisik', 'kebugaran', 'fokus', 'lembur', 'olahraga', 'sop'],
      followUpPrompt: 'Bagaimana cara Anda membagi waktu istirahat agar tidak mengantuk di line perakitan?',
      idealAnswer: 'Saya sangat siap fisik dan mental untuk bekerja dalam sistem shift maupun lembur sesuai kebutuhan produksi. Untuk shift malam, saya menerapkan pola istirahat teratur di siang hari, menjaga asupan cairan, dan rutin berolahraga ringan agar tubuh tetap fit dan fokus.'
    },
    {
      id: 'op-4',
      role: 'operator',
      question: 'Jika saat Anda sedang bekerja, mesin yang Anda operasikan tiba-tiba mengeluarkan suara berdecit tidak wajar atau lampu indikator andon menyala merah, apa tindakan pertama yang Anda ambil dan mengapa Anda tidak disarankan memperbaikinya sendiri?',
      interviewerPersona: 'Bapak Dimas (Supervisor Produksi Manufaktur)',
      expectedKeywords: ['stop', 'matikan', 'lapor', 'leader', 'foreman', 'andon', 'sop', 'jangan dipaksa'],
      followUpPrompt: 'Mengapa kepatuhan pada wewenang kerja sangat penting di industri pabrik?',
      idealAnswer: 'Tindakan pertama saya adalah segera menghentikan mesin (menekan tombol stop/andon) untuk mencegah kerusakan lebih parah atau kecelakaan kerja. Kemudian, saya langsung melaporkan ke Team Leader atau Foreman. Saya tidak mencoba memperbaikinya sendiri karena hal teknis mesin adalah wewenang teknisi maintenance sesuai SOP keselamatan K3.'
    },
    {
      id: 'op-5',
      role: 'operator',
      question: 'Terakhir, apa motivasi terbesar Anda melamar di perusahaan kami, dan apa komitmen Anda jika diberikan kesempatan untuk bekerja dan berkembang di sini dalam jangka panjang?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['motivasi', 'komitmen', 'loyal', 'disiplin', 'berkembang', 'kontribusi', 'jangka panjang', 'reputasi'],
      followUpPrompt: 'Bagus. Apakah ada hal yang ingin Anda tanyakan kepada kami sebelum sesi ini berakhir?',
      idealAnswer: 'Motivasi terbesar saya adalah ingin membangun karier profesional di perusahaan manufaktur ternama ini dan membantu perekonomian keluarga. Komitmen saya adalah bekerja dengan disiplin tinggi, tidak absen tanpa izin, selalu mematuhi target dan SOP mutu, serta siap belajar hal baru untuk memajukan target produksi perusahaan.'
    }
  ],
  qc: [
    {
      id: 'qc-1',
      role: 'qc',
      question: 'Selamat pagi. Terima kasih atas kehadirannya. Silakan perkenalkan diri Anda dan jelaskan pemahaman Anda mengenai peran Quality Control (QC) di pabrik manufaktur.',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['standar', 'spesifikasi', 'cacat', 'defect', 'zero defect', 'inspeksi', 'kepuasan pelanggan', 'sop'],
      followUpPrompt: 'Alat ukur presisi apa saja yang sudah pernah Anda gunakan saat sekolah atau PKL?',
      idealAnswer: 'Selamat pagi Ibu Ratna. Nama saya Rahmat Hidayat, lulusan SMK. Bagi saya, Quality Control adalah garda terdepan penjamin mutu produk. Tugas utama QC adalah memastikan seluruh proses di line produksi hingga barang jadi memenuhi standar spesifikasi dan toleransi ukuran agar tidak ada produk reject yang lolos ke konsumen.'
    },
    {
      id: 'qc-2',
      role: 'qc',
      question: 'Alat ukur presisi apa saja yang paling Anda kuasai (misalnya jangka sorong/vernier caliper, mikrometer, dial gauge), dan bagaimana cara Anda memastikan alat tersebut terkalibrasi dengan benar sebelum digunakan?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['jangka sorong', 'caliper', 'mikrometer', 'kalibrasi', 'zero point', 'ketelitian', 'presisi'],
      followUpPrompt: 'Bagaimana cara Anda membaca angka nonius pada jangka sorong?',
      idealAnswer: 'Saya terbiasa menggunakan jangka sorong dengan ketelitian 0.02 mm dan mikrometer sekrup 0.01 mm. Sebelum melakukan inspeksi harian, saya selalu memeriksa titik nol (zero setting) dan kebersihan rahang ukur untuk memastikan tidak ada deviasi pembacaan.'
    },
    {
      id: 'qc-3',
      role: 'qc',
      question: 'Misalkan Anda menemukan satu batch produk mengalami deviasi dimensi di luar toleransi (Reject/NG), namun bagian produksi mendesak agar produk tersebut diloloskan karena target pengiriman sangat mendesak. Bagaimana sikap dan tindakan tegas Anda?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['tegas', 'tahan', 'hold', 'tolak', 'sop', 'lapor', 'leader', 'komunikasi baik', 'tidak kompromi'],
      followUpPrompt: 'Bagaimana cara Anda menyampaikannya ke tim produksi secara profesional?',
      idealAnswer: 'Saya akan tetap tegas berpegang teguh pada standar mutu dengan menahan (HOLD) batch tersebut dan memberi label status Reject. Saya akan menyampaikan data hasil pengukuran secara objektif dan sopan kepada Foreman QC dan Supervisor Produksi. Mutu tidak dapat dikompromikan demi mengejar target semata.'
    },
    {
      id: 'qc-4',
      role: 'qc',
      question: 'Dalam pengambilan sampel inspeksi (Sampling Inspection), bagaimana Anda memastikan bahwa sampel yang Anda ambil benar-benar mewakili keseluruhan kualitas populasi produk?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['sampling', 'aql', 'acak', 'random', 'awal', 'tengah', 'akhir', 'lot'],
      followUpPrompt: 'Apa yang Anda lakukan jika dari 10 sampel ditemukan 1 produk cacat kritis?',
      idealAnswer: 'Saya menerapkan metode pengambilan sampel acak (Random Sampling) dari bagian awal, tengah, dan akhir proses produksi sesuai tabel standar AQL. Jika ditemukan cacat, saya akan memperluas jumlah sampel atau melakukan 100% check untuk mengisolasi lot yang bermasalah.'
    },
    {
      id: 'qc-5',
      role: 'qc',
      question: 'Terakhir, mengapa Anda tertarik berkarir di bidang Quality Control dan apa nilai integritas yang paling Anda junjung tinggi dalam pekerjaan?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['integritas', 'kejujuran', 'ketelitian', 'tanggung jawab', 'mutu', 'komitmen'],
      followUpPrompt: 'Terima kasih, apakah ada yang ingin Anda tanyakan seputar standar kerja di bagian QC kami?',
      idealAnswer: 'Saya menyukai pekerjaan yang membutuhkan ketelitian tinggi dan kejujuran data. Nilai utama yang saya junjung adalah integritas, yaitu tidak pernah memanipulasi catatan inspeksi dan selalu mengutamakan keselamatan konsumen melalui produk berkualitas prima.'
    }
  ],
  maintenance: [
    {
      id: 'maint-1',
      role: 'maintenance',
      question: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan keahlian dasar kelistrikan dan mekanik yang Anda kuasai.',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['preventive', 'pencegahan', 'perawatan', 'multimeter', 'wiring', 'motor', 'pelumasan', 'troubleshooting'],
      followUpPrompt: 'Apa langkah pertama Anda dalam melakukan isolasi sumber tegangan (LOTO)?',
      idealAnswer: 'Selamat pagi Bapak Suryo. Nama saya Rizky Pratama, lulusan SMK Teknik Otomasi / Mesin. Saya memiliki kompetensi dalam membaca diagram kelistrikan (wiring diagram), pengukuran multimeter, instalasi motor listrik 3 fasa, dan perawatan mekanikal dasar.'
    },
    {
      id: 'maint-2',
      role: 'maintenance',
      question: 'Bisa jelaskan perbedaan mendasar antara Preventive Maintenance dan Breakdown Maintenance, serta mengapa pabrik modern sangat memprioritaskan Preventive Maintenance?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['preventive', 'berkala', 'breakdown', 'terjadwal', 'downtime', 'efisiensi', 'umur mesin'],
      followUpPrompt: 'Contoh tindakan preventif apa yang rutin dilakukan pada motor listrik atau kompresor?',
      idealAnswer: 'Preventive maintenance adalah perawatan berkala terjadwal untuk mencegah terjadinya kerusakan sebelum terjadi, seperti pelumasan bearing dan pembersihan filter. Sedangkan breakdown maintenance adalah perbaikan setelah mesin mati. Preventive sangat diprioritaskan karena mencegah kerugian downtime produksi yang besar.'
    },
    {
      id: 'maint-3',
      role: 'maintenance',
      question: 'Jelaskan prosedur keselamatan kerja LOTO (Lockout Tagout) saat Anda hendak melakukan perbaikan pada panel kelistrikan bertegangan tinggi atau mesin berputar.',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['loto', 'lockout', 'tagout', 'gembok', 'kartu', 'isolasi', 'nol tegangan', 'k3'],
      followUpPrompt: 'Bagaimana cara memastikan bahwa benar-benar tidak ada sisa tegangan sebelum tangan menyentuh kabel?',
      idealAnswer: 'Prosedur LOTO diawali dengan mematikan sumber daya utama, memasang gembok pengaman fisik (Lock) dan label peringatan bahaya (Tag) pada saklar utama. Kemudian melakukan pengetesan dengan multimeter (test before touch) untuk memastikan status tegangan benar-benar nol.'
    },
    {
      id: 'maint-4',
      role: 'maintenance',
      question: 'Jika terjadi situasi darurat di mana dua mesin di line perakitan utama mengalami gangguan teknis bersamaan, bagaimana Anda menentukan prioritas penanganannya?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['prioritas', 'bottleneck', 'downtime', 'koordinasi', 'keselamatan', 'foreman'],
      followUpPrompt: 'Kapan Anda perlu meminta bantuan tambahan dari tim engineering lain?',
      idealAnswer: 'Saya akan mengutamakan mesin yang menjadi jalur utama (bottleneck) atau mesin yang berdampak langsung pada keselamatan operator. Saya segera berkoordinasi dengan Foreman Maintenance untuk membagi tugas penanganan agar perbaikan berlangsung paralel dan downtime minimal.'
    },
    {
      id: 'maint-5',
      role: 'maintenance',
      question: 'Terakhir, apa komitmen Anda terhadap kedisiplinan jam kerja, kesiapan standby saat shift darurat, dan pengembangan keterampilan teknis Anda di perusahaan ini?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance)',
      expectedKeywords: ['standby', 'komitmen', 'shift', 'belajar', 'loyalitas', 'disiplin'],
      followUpPrompt: 'Bagus sekali. Ada pertanyaan yang ingin Anda sampaikan mengenai mesin produksi kami?',
      idealAnswer: 'Saya siap 100% mengikuti jadwal shift dan siap dipanggil saat terjadi panggilan darurat mesin. Saya juga sangat antusias untuk terus belajar sistem otomasi baru seperti PLC dan robotik guna meningkatkan efisiensi pabrik.'
    }
  ],
  logistics: [
    {
      id: 'log-1',
      role: 'logistics',
      question: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan pengalaman Anda dalam manajemen barang di gudang atau pergudangan sekolah/PKL.',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['fifo', 'first in first out', 'stock', 'opname', 'akurasi', 'barcode', 'labeling', 'tata letak'],
      followUpPrompt: 'Bagaimana Anda memastikan barang yang keluar dari gudang tidak mengalami selisih data sistem dengan fisik?',
      idealAnswer: 'Selamat pagi Bapak Anton. Nama saya Deni Irawan, lulusan SMK. Saya memiliki pengalaman PKL di bagian logistik dan memahami alur penerimaan barang (receiving), penyimpanan rak (putaway), hingga penyiapan pengiriman (picking & dispatching).'
    },
    {
      id: 'log-2',
      role: 'logistics',
      question: 'Jelaskan bagaimana Anda menerapkan metode FIFO (First In First Out) di gudang dan mengapa metode ini sangat krusial bagi kelancaran produksi?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['fifo', 'urutan', 'masuk pertama', 'label tanggal', 'rotasi stok', 'kadaluwarsa'],
      followUpPrompt: 'Bagaimana tanda visual yang Anda berikan pada palet barang lama vs barang baru datang?',
      idealAnswer: 'Metode FIFO memastikan barang yang masuk lebih awal harus dikeluarkan terlebih dahulu. Ini penting untuk mencegah material tersimpan terlalu lama, berkarat, atau rusak kualitasnya. Saya menerapkannya dengan penataan jalur rak teratur dan label kode tanggal (lot number).'
    },
    {
      id: 'log-3',
      role: 'logistics',
      question: 'Saat proses Stock Opname fisik mingguan atau bulanan, jika Anda menemukan selisih antara jumlah fisik di rak dengan data sistem WMS, langkah investigasi apa yang pertama kali Anda lakukan?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['cek ulang', 'kartu stok', 'mutasi', 'surat jalan', 'lapor', 'investigasi', 'transparan'],
      followUpPrompt: 'Bagaimana mencegah terjadinya barang salah letak (misplacement)?',
      idealAnswer: 'Langkah pertama saya adalah menghitung ulang secara fisik untuk memastikan tidak ada salah hitung. Kemudian memeriksa riwayat mutasi transaksi keluar-masuk terakhir dan surat jalan pengiriman. Jika tetap ada selisih, saya segera melapor kepada Leader Gudang dengan catatan transparan.'
    },
    {
      id: 'log-4',
      role: 'logistics',
      question: 'Di gudang dengan mobilitas alat berat seperti Forklift dan Hand Pallet yang padat, bagaimana Anda menjaga keselamatan kerja (K3) diri sendiri dan rekan kerja?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['k3', 'jalur hijau', 'safety shoes', 'rompi', 'klakson', 'blind spot', 'helm'],
      followUpPrompt: 'Apa yang Anda lakukan saat melihat palet barang ditumpuk melebihi batas aman?',
      idealAnswer: 'Saya selalu mengenakan APD lengkap (safety shoes, rompi reflektif, helm), berjalan hanya di jalur pejalan kaki yang ditentukan (green walkway), dan selalu waspada pada bunyi klakson serta area blind spot forklift.'
    },
    {
      id: 'log-5',
      role: 'logistics',
      question: 'Terakhir, apa motivasi Anda bergabung di tim Logistik kami dan apa komitmen Anda terhadap ketepatan waktu pengiriman suplai komponen ke line produksi?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['tepat waktu', 'disiplin', 'tanggung jawab', 'komitmen', 'kerjasama', 'zero delay'],
      followUpPrompt: 'Apakah ada hal yang ingin Anda tanyakan seputar alur kerja pergudangan kami?',
      idealAnswer: 'Motivasi saya adalah menjadi bagian dari rantai pasok manufaktur yang solid. Komitmen saya adalah memastikan ketersediaan dan suplai material ke line produksi selalu tepat waktu (Just-In-Time) dengan akurasi 100% sehingga line produksi tidak pernah mengalami stop produksi.'
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

/**
 * Dynamic Contextual Conversation Engine
 * Analyzes candidate's previous response, extracts topical cues, and synthesizes a natural contextual transition + adaptive question
 */
export async function generateAdaptiveFollowUp(
  userPreviousAnswer: string,
  role: TargetRole,
  nextQuestionIndex: number,
  baseQuestionItem: InterviewQuestionItem
): Promise<{
  acknowledgement: string;
  adaptiveQuestionText: string;
  fullSpokenDialogue: string;
  isAiLiveGenerated?: boolean;
}> {
  // 1. Try Live Backend LLM / Gemini Generation if server is online
  try {
    const res = await fetch('/api/interview/generate-followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetRole: role,
        interviewerPersona: baseQuestionItem.interviewerPersona,
        userAnswer: userPreviousAnswer,
        questionIndex: nextQuestionIndex
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.isAiGenerated && data.fullSpoken) {
        return {
          acknowledgement: data.acknowledgement || 'Baik, terima kasih atas penjelasannya.',
          adaptiveQuestionText: data.nextQuestion || baseQuestionItem.question,
          fullSpokenDialogue: data.fullSpoken,
          isAiLiveGenerated: true
        };
      }
    }
  } catch (e) {
    // offline or backend not available, proceed to dynamic heuristic engine
  }

  // 2. Intelligent High-Grade Heuristic Engine Fallback (Zero Latency)
  const text = (userPreviousAnswer || '').toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Topical extraction
  const hasPkl = text.includes('pkl') || text.includes('magang') || text.includes('prakerin') || text.includes('bengkel') || text.includes('sekolah');
  const hasTech = text.includes('mesin') || text.includes('rakit') || text.includes('perakitan') || text.includes('ukur') || text.includes('listrik') || text.includes('wiring') || text.includes('alat');
  const hasDiscipline = text.includes('disiplin') || text.includes('sop') || text.includes('k3') || text.includes('tanggung jawab') || text.includes('aturan');
  const hasStamina = text.includes('fisik') || text.includes('shift') || text.includes('malam') || text.includes('olahraga') || text.includes('sehat') || text.includes('stamina');
  const hasQuality = text.includes('kualitas') || text.includes('reject') || text.includes('cacat') || text.includes('zero defect') || text.includes('presisi') || text.includes('inspeksi');
  const hasTeam = text.includes('tim') || text.includes('leader') || text.includes('atasan') || text.includes('lapor') || text.includes('komunikasi') || text.includes('teman');

  // Dynamic Acknowledgement Generation
  let acknowledgement = 'Baik, terima kasih atas penjelasannya.';
  if (hasPkl && hasTech) {
    acknowledgement = 'Bagus sekali, saya melihat Anda sudah memiliki bekal praktik kerja dan pemahaman teknis dasar yang cukup relevan.';
  } else if (hasQuality) {
    acknowledgement = 'Sangat tepat, kepedulian terhadap standar kualitas dan detail adalah prinsip utama yang sangat kami hargai.';
  } else if (hasStamina || hasDiscipline) {
    acknowledgement = 'Saya catat kesiapan dan komitmen disiplin kerja yang Anda sampaikan barusan.';
  } else if (hasTeam) {
    acknowledgement = 'Bagus, kemampuan koordinasi dan kepatuhan jalur komando memang sangat krusial di pabrik.';
  } else if (wordCount >= 25) {
    acknowledgement = 'Penjelasan yang cukup terstruktur dan lugas.';
  } else {
    acknowledgement = 'Baik, poin inti jawaban Anda sudah saya tangkap.';
  }

  // Dynamic Question Synthesis based on Question Index & Role
  let adaptiveQuestion = baseQuestionItem.question;

  if (nextQuestionIndex === 1) {
    // Stage 2: Kesiapan fisik, shift & ritme kerja
    if (role === 'operator') {
      adaptiveQuestion = hasPkl
        ? `Menghubungkan dengan pengalaman dan kebiasaan kerja Anda tadi, di posisi Operator Produksi ini ritme kerjanya cepat, repetitif, dan menggunakan sistem 3 shift termasuk shift malam. Bagaimana strategi konkret Anda menjaga stamina, fokus, dan ketelitian agar tidak drop saat berada di shift 3?`
        : `Di industri manufaktur, Anda akan menghadapi target harian yang ketat dan sistem shift kerja termasuk shift malam. Bagaimana kesiapan fisik dan mental Anda dalam beradaptasi dengan ritme kerja lembur dan pergantian shift tersebut?`;
    } else if (role === 'qc') {
      adaptiveQuestion = hasQuality
        ? `Tadi Anda menyebutkan pentingnya menjaga standar mutu. Dalam praktik lapangan QC, seringkali target pengiriman barang sangat mendesak namun ditemukan produk dengan deviasi dimensi minor. Bagaimana sikap tegas dan cara Anda menahan produk reject tersebut tanpa memicu konflik dengan tim produksi?`
        : `Jika saat inspeksi akhir Anda menemukan batch produk mengalami cacat (NG) menjelang jam pergantian shift, apa prosedur isolasi barang dan komunikasi yang akan Anda terapkan?`;
    } else if (role === 'maintenance') {
      adaptiveQuestion = hasTech
        ? `Melanjutkan kemampuan teknis yang Anda ceritakan, dalam perawatan mesin pabrik kita mengutamakan Preventive Maintenance. Bagaimana cara Anda mendeteksi potensi keausan komponen sebelum mesin mengalami breakdown mendadak di tengah jam produksi?`
        : `Bisa ceritakan pemahaman Anda tentang prosedur keselamatan kerja LOTO (Lockout Tagout) saat melakukan perbaikan pada panel kelistrikan bertegangan tinggi?`;
    } else if (role === 'logistics') {
      adaptiveQuestion = `Dalam operasional gudang dengan mobilitas tinggi, bagaimana Anda memastikan penerapan metode FIFO dan pencatatan barcode barang tetap akurat 100% tanpa ada selisih stok fisik?`;
    }
  } else if (nextQuestionIndex >= 2) {
    // Stage 3: Problem solving, K3 & Komitmen
    if (role === 'operator') {
      adaptiveQuestion = `Nah, jika saat Anda sedang mengoperasikan mesin di line perakitan, tiba-tiba mesin berbunyi tidak wajar atau lampu indikator andon menyala merah, apa langkah pertama yang Anda lakukan dan mengapa Anda tidak disarankan memperbaikinya sendiri?`;
    } else if (role === 'qc') {
      adaptiveQuestion = `Alat ukur presisi apa saja yang paling Anda kuasai, dan bagaimana cara Anda memastikan alat ukur tersebut selalu terkalibrasi dengan benar sebelum digunakan inspeksi harian?`;
    } else if (role === 'maintenance') {
      adaptiveQuestion = `Jika ada dua mesin di line berbeda mengalami gangguan secara bersamaan, bagaimana Anda menentukan prioritas penanganan perbaikan agar downtime produksi tetap minimal?`;
    } else if (role === 'logistics') {
      adaptiveQuestion = `Jika terjadi selisih jumlah barang saat proses loading ke truk pengiriman, langkah investigasi apa yang pertama kali Anda jalankan?`;
    }
  }

  const fullSpokenDialogue = `${acknowledgement} ${adaptiveQuestion}`;

  return {
    acknowledgement,
    adaptiveQuestionText: adaptiveQuestion,
    fullSpokenDialogue,
    isAiLiveGenerated: false
  };
}

/**
 * Post-Call Comprehensive Session Evaluator
 * Calls /api/interview/evaluate-session to analyze entire transcript with Sumopod AI
 */
export async function evaluateInterviewSessionWithAi(
  candidateName: string,
  targetRole: TargetRole,
  interviewerPersona: string,
  transcript: Array<{ speaker: string; text: string }>
): Promise<{
  totalAcceptanceProbability: number;
  relevanceScore: number;
  articulationScore: number;
  etiquetteScore: number;
  jobFitScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  actionableFeedback: string;
  isAiEvaluated: boolean;
}> {
  try {
    const res = await fetch('/api/interview/evaluate-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName,
        targetRole,
        interviewerPersona,
        transcript
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.isAiEvaluated && data.evaluation) {
        return {
          totalAcceptanceProbability: data.evaluation.totalAcceptanceProbability || 78,
          relevanceScore: data.evaluation.relevanceScore || 75,
          articulationScore: data.evaluation.articulationScore || 80,
          etiquetteScore: data.evaluation.etiquetteScore || 85,
          jobFitScore: data.evaluation.jobFitScore || 72,
          summary: data.evaluation.summary || 'Kandidat menunjukkan kesiapan kerja dan potensi yang baik dalam menjawab pertanyaan wawancara.',
          strengths: data.evaluation.strengths || ['Komunikasi cukup lugas', 'Memiliki bekal dasar industri'],
          weaknesses: data.evaluation.weaknesses || ['Perlu memperdalam istilah teknis K3'],
          actionableFeedback: data.evaluation.actionableFeedback || 'Gunakan metode STAR untuk memperjelas hasil kerja konkret Anda.',
          isAiEvaluated: true
        };
      }
    }
  } catch (err) {
    console.warn('[Evaluate Session API Error]', err);
  }

  // Fallback Heuristic evaluation
  const allText = transcript.map(t => t.text).join(' ').toLowerCase();
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  const turnsCount = transcript.filter(t => t.speaker === candidateName || t.speaker.includes('Anda')).length;

  const score = Math.min(95, Math.max(55, Math.round(50 + (turnsCount * 6) + (wordCount * 0.1))));
  return {
    totalAcceptanceProbability: score,
    relevanceScore: Math.min(95, score + 2),
    articulationScore: Math.min(95, score - 3),
    etiquetteScore: Math.min(98, score + 5),
    jobFitScore: Math.min(95, score - 1),
    summary: 'Sesi wawancara suara selesai dengan komunikasi yang aktif dan interaktif.',
    strengths: ['Aktif merespons setiap pertanyaan', 'Menunjukkan motivasi kerja tinggi'],
    weaknesses: ['Perlu melatih intonasi suara agar lebih mantap saat wawancara offline'],
    actionableFeedback: 'Latihlah artikulasi secara rutin dan sampaikan contoh konkret dari pengalaman PKL Anda.',
    isAiEvaluated: false
  };
}
