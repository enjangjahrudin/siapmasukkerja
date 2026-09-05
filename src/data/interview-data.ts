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
      idealAnswer: 'Selamat pagi Bapak Hendra. Nama saya Ahmad Fauzi, lulusan SMK Negeri 1 Jurusan Teknik Mesin. Selama masa sekolah, saya aktif dalam kegiatan bengkel dan menyelesaikan Praktik Kerja Lapangan (PKL) selama 6 bulan di bagian line perakitan mesin. Saya terbiasa dengan target produksi harian, disiplin waktu, dan penerapan K3 di tempat kerja.'
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
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['stop', 'matikan', 'lapor', 'leader', 'foreman', 'andon', 'sop', 'jangan dipaksa'],
      followUpPrompt: 'Mengapa kepatuhan pada wewenang kerja sangat penting di industri pabrik?',
      idealAnswer: 'Tindakan pertama saya adalah segera menghentikan mesin (menekan tombol stop/andon) untuk mencegah kerusakan lebih parah atau kecelakaan kerja. Kemudian, saya langsung melaporkan ke Team Leader atau Foreman. Saya tidak mencoba memperbaikinya sendiri karena hal teknis mesin adalah wewenang teknisi maintenance sesuai SOP keselamatan K3.'
    },
    {
      id: 'op-5',
      role: 'operator',
      question: 'Bagaimana pemahaman Anda mengenai budaya kerja 5S atau 5R (Ringkas, Rapi, Resik, Rawat, Rajin) dan bagaimana penerapannya secara nyata di area kerja Anda setiap hari?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['5s', '5r', 'ringkas', 'rapi', 'resik', 'rawat', 'rajin', 'kebersihan', 'alat'],
      followUpPrompt: 'Mengapa meja kerja yang rapi bisa meningkatkan efisiensi dan mencegah kecelakaan kerja?',
      idealAnswer: 'Saya selalu memastikan alat kerja diletakkan kembali pada tempatnya setelah dipakai (Seiton/Rapi), membersihkan serpihan debu atau oli di stasiun kerja (Seiso/Resik), serta mematuhi standardisasi tata letak agar mempermudah pengambilan barang dan menjaga keselamatan kerja.'
    },
    {
      id: 'op-6',
      role: 'operator',
      question: 'Dalam satu line produksi, jika rekan di stasiun kerja sebelum Anda terlambat atau stasiun Anda mengalami penumpukan barang (bottleneck), bagaimana sikap kerjasama dan komunikasi Anda dengan rekan kerja?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['komunikasi', 'bantu', 'koordinasi', 'tim', 'leader', 'takt time', 'kecepatan'],
      followUpPrompt: 'Pernahkah Anda membantu rekan kerja saat mengejar target akhir shift?',
      idealAnswer: 'Saya akan berkomunikasi dengan tenang dan saling bantu tanpa mengabaikan kualitas stasiun sendiri. Jika beban terus menumpuk, saya segera menginformasikan ke Team Leader agar dapat dialokasikan bantuan atau penyesuaian takt time secara tepat.'
    },
    {
      id: 'op-7',
      role: 'operator',
      question: 'Bagaimana sikap dan respon Anda apabila suatu hari Anda ditegur secara tegas oleh Foreman atau Supervisor karena ada kelalaian kerja atau hasil perakitan yang kurang presisi?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['terima', 'evaluasi', 'lapang dada', 'perbaiki', 'tidak membantah', 'tanggung jawab'],
      followUpPrompt: 'Bagaimana Anda memastikan kesalahan yang sama tidak terulang kembali?',
      idealAnswer: 'Saya akan menerima teguran tersebut dengan lapang dada dan penuh tanggung jawab sebagai masukan berharga. Saya akan meminta arahan mengenai letak kekeliruan, mengevaluasi diri, dan membuat catatan pengingat agar kesalahan yang sama tidak terulang lagi.'
    },
    {
      id: 'op-8',
      role: 'operator',
      question: 'Pekerjaan operator seringkali bersifat repetitif dan menuntut berdiri selama 8 jam sehari. Bagaimana Anda menjaga motivasi kerja agar tidak mudah merasa jenuh dan tetap konsisten menghasilkan produk bermutu?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['konsisten', 'fokus', 'tanggung jawab', 'kebanggaan', 'target', 'kualitas'],
      followUpPrompt: 'Apa yang membuat Anda bangga bekerja di bidang manufaktur?',
      idealAnswer: 'Saya memandang setiap komponen yang saya rakit adalah bagian penting dari produk akhir yang akan dipakai masyarakat luas. Tanggung jawab dan kebanggaan atas kualitas produk tersebut membuat saya tetap fokus dan termotivasi menjaga konsistensi kerja.'
    },
    {
      id: 'op-9',
      role: 'operator',
      question: 'Apa motivasi terbesar Anda melamar di perusahaan kami, dan apa komitmen Anda terkait kedisiplinan absensi dan kesiapan bekerja lembur saat ada lonjakan target produksi?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['motivasi', 'komitmen', 'loyal', 'disiplin', 'lembur', 'kehadiran', 'zero absen'],
      followUpPrompt: 'Apakah Anda siap berkomitmen tidak absen tanpa alasan mendesak?',
      idealAnswer: 'Motivasi terbesar saya adalah ingin membangun karier profesional jangka panjang di perusahaan terkemuka ini. Komitmen saya adalah menjaga kehadiran 100% (zero absentism), selalu hadir tepat waktu, dan siap lembur kapan pun perusahaan membutuhkan tambahan kapasitas produksi.'
    },
    {
      id: 'op-10',
      role: 'operator',
      question: 'Baik, saya rasa gambaran kemampuan dan kesiapan kerja Anda sudah sangat jelas. Sebelum kita akhiri sesi wawancara ini, apakah ada hal yang ingin Anda tanyakan kepada kami?',
      interviewerPersona: 'Bapak Hendra (Senior HRD Industri Otomotif)',
      expectedKeywords: ['tanya', 'pelatihan', 'training', 'jenjang', 'kriteria', 'budaya'],
      followUpPrompt: 'Pertanyaan yang sangat bagus, mari kita bahas sejenak.',
      idealAnswer: 'Terima kasih Bapak Hendra. Saya ingin menanyakan, bagaimana tahapan pelatihan awal (onboarding training) bagi operator baru di line produksi, dan hal apa yang paling dinilai agar operator baru bisa cepat beradaptasi dengan ritme kerja tim?'
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
      idealAnswer: 'Selamat pagi Ibu Ratna. Bagi saya, Quality Control adalah garda terdepan penjamin mutu produk. Tugas utama QC adalah memastikan seluruh proses di line produksi hingga barang jadi memenuhi standar spesifikasi dan toleransi ukuran agar tidak ada produk reject yang lolos ke konsumen.'
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
      question: 'Dalam pencatatan data mutu harian, bagaimana Anda memastikan bahwa check sheet inspeksi selalu terisi akurat dan bebas dari manipulasi angka?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['jujur', 'integritas', 'check sheet', 'fakta', 'aktual', 'akurasi'],
      followUpPrompt: 'Mengapa manipulasi data inspeksi sangat berbahaya bagi reputasi perusahaan?',
      idealAnswer: 'Saya selalu mencatat angka aktual hasil pengukuran secara real-time langsung di check sheet tanpa menunda atau mengira-ngira. Integritas data adalah nyawa seorang QC, karena satu kesalahan pencatatan bisa berakibat fatal pada keselamatan konsumen.'
    },
    {
      id: 'qc-6',
      role: 'qc',
      question: 'Bagaimana pemahaman Anda mengenai perbedaan antara cacat fungsional (critical defect) dengan cacat kosmetik/visual (minor defect)?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['kritis', 'fungsional', 'visual', 'go no go', 'toleransi', 'safety'],
      followUpPrompt: 'Berikan contoh cacat fungsional yang pernah Anda jumpai.',
      idealAnswer: 'Cacat fungsional berdampak langsung pada kinerja dan keselamatan produk, seperti ukuran lubang drat yang longgar atau retak mikro. Sedangkan cacat kosmetik berupa goresan halus pada permukaan luar yang tidak mengganggu fungsi kerja.'
    },
    {
      id: 'qc-7',
      role: 'qc',
      question: 'Bekerja di QC seringkali berada di antara tekanan target produksi dan tuntutan kualitas tanpa kompromi. Bagaimana Anda menjaga stabilitas emosi dan fokus saat menghadapi situasi kerja yang menegangkan?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['tenang', 'profesional', 'data', 'fakta', 'fokus', 'regulasi'],
      followUpPrompt: 'Bagaimana Anda menghindari perdebatan subjektif saat inspeksi?',
      idealAnswer: 'Saya selalu mengandalkan data terukur, foto visual limit, dan standar SOP tertulis sebagai dasar argumen. Dengan berbicara berbasis data objektif dan menjaga nada bicara profesional, kita dapat menyelesaikan perdebatan secara tenang dan berbasis fakta.'
    },
    {
      id: 'qc-8',
      role: 'qc',
      question: 'Bagaimana kesiapan fisik Anda untuk melakukan inspeksi keliling (patrol check) di area produksi yang bersuara bising, berpindah antar stasiun kerja, dan sistem kerja shift?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['siap', 'patrol', 'earplug', 'apd', 'stamina', 'shift'],
      followUpPrompt: 'Apakah Anda terbiasa memakai APD telinga dan kacamata safety sepanjang hari?',
      idealAnswer: 'Saya sangat siap. Saya terbiasa bergerak aktif dan selalu mematuhi kewajiban APD di area produksi, seperti earplug untuk meredam kebisingan dan safety glasses. Saya juga siap menjalankan rotasi shift secara disiplin.'
    },
    {
      id: 'qc-9',
      role: 'qc',
      question: 'Apa motivasi terbesar Anda ingin bergabung di departemen Quality Control kami, dan bagaimana komitmen Anda dalam menerapkan prinsip Kaizen (continuous improvement)?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['kaizen', 'improvement', 'mutu', 'komitmen', 'belajar', 'loyal'],
      followUpPrompt: 'Pernahkah Anda mengusulkan perbaikan kecil saat PKL?',
      idealAnswer: 'Motivasi saya adalah menjadi bagian dari jaminan mutu perusahaan berstandar internasional. Saya berkomitmen tidak hanya mendeteksi cacat, namun juga ikut menganalisis akar masalah (root cause) untuk memberikan ide perbaikan berkelanjutan.'
    },
    {
      id: 'qc-10',
      role: 'qc',
      question: 'Baik, seluruh pemahaman dan integritas mutu Anda telah kami catat dengan baik. Apakah ada hal yang ingin Anda tanyakan kepada kami sebelum mengakhiri sesi wawancara ini?',
      interviewerPersona: 'Ibu Ratna (QA & Quality Control Manager)',
      expectedKeywords: ['tanya', 'standar', 'sertifikasi', 'peralatan', 'cmm'],
      followUpPrompt: 'Silakan, saya senang menjawab pertanyaan kritis dari calon QC.',
      idealAnswer: 'Terima kasih Ibu Ratna. Saya ingin menanyakan mengenai standar sistem manajemen mutu yang saat ini diterapkan di pabrik (seperti ISO 9001 atau IATF 16949), dan apakah ada kesempatan untuk mempelajari alat ukur digital lanjutan seperti CMM atau Projector Profile?'
    }
  ],
  maintenance: [
    {
      id: 'maint-1',
      role: 'maintenance',
      question: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan keahlian dasar kelistrikan dan mekanik yang Anda kuasai.',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['preventive', 'perawatan', 'multimeter', 'wiring', 'motor', 'pelumasan', 'troubleshooting'],
      followUpPrompt: 'Apa langkah pertama Anda dalam melakukan isolasi sumber tegangan (LOTO)?',
      idealAnswer: 'Selamat pagi Bapak Suryo. Nama saya Rizky Pratama, lulusan SMK Teknik Otomasi / Mesin. Saya memiliki kompetensi dalam membaca diagram kelistrikan (wiring diagram), pengukuran multimeter, instalasi motor listrik 3 fasa, dan perawatan mekanikal dasar.'
    },
    {
      id: 'maint-2',
      role: 'maintenance',
      question: 'Bisa jelaskan perbedaan mendasar antara Preventive Maintenance dan Breakdown Maintenance, serta mengapa pabrik modern sangat memprioritaskan Preventive Maintenance?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['preventive', 'berkala', 'breakdown', 'terjadwal', 'downtime', 'efisiensi', 'umur mesin'],
      followUpPrompt: 'Contoh tindakan preventif apa yang rutin dilakukan pada motor listrik atau kompresor?',
      idealAnswer: 'Preventive maintenance adalah perawatan berkala terjadwal untuk mencegah terjadinya kerusakan sebelum terjadi, seperti pelumasan bearing dan pembersihan filter. Sedangkan breakdown maintenance adalah perbaikan setelah mesin mati. Preventive sangat diprioritaskan karena mencegah kerugian downtime produksi yang besar.'
    },
    {
      id: 'maint-3',
      role: 'maintenance',
      question: 'Jelaskan prosedur keselamatan kerja LOTO (Lockout Tagout) saat Anda hendak melakukan perbaikan pada panel kelistrikan bertegangan tinggi atau mesin berputar.',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['loto', 'lockout', 'tagout', 'gembok', 'kartu', 'isolasi', 'nol tegangan', 'k3'],
      followUpPrompt: 'Bagaimana cara memastikan bahwa benar-benar tidak ada sisa tegangan sebelum tangan menyentuh kabel?',
      idealAnswer: 'Prosedur LOTO diawali dengan mematikan sumber daya utama, memasang gembok pengaman fisik (Lock) dan label peringatan bahaya (Tag) pada saklar utama. Kemudian melakukan pengetesan dengan multimeter (test before touch) untuk memastikan status tegangan benar-benar nol.'
    },
    {
      id: 'maint-4',
      role: 'maintenance',
      question: 'Jika terjadi situasi darurat di mana dua mesin di line perakitan utama mengalami gangguan teknis bersamaan, bagaimana Anda menentukan prioritas penanganannya?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['prioritas', 'bottleneck', 'downtime', 'koordinasi', 'keselamatan', 'foreman'],
      followUpPrompt: 'Kapan Anda perlu meminta bantuan tambahan dari tim engineering lain?',
      idealAnswer: 'Saya akan mengutamakan mesin yang menjadi jalur utama (bottleneck) atau mesin yang berdampak langsung pada keselamatan operator. Saya segera berkoordinasi dengan Foreman Maintenance untuk membagi tugas penanganan agar perbaikan berlangsung paralel dan downtime minimal.'
    },
    {
      id: 'maint-5',
      role: 'maintenance',
      question: 'Bagaimana kebiasaan Anda dalam merawat dan menata perkakas kerja teknisi (toolbox) setelah menyelesaikan pekerjaan perbaikan mesin?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['toolbox', 'rapi', '5s', 'hitung', 'bersih', 'perkakas', 'fOD'],
      followUpPrompt: 'Mengapa alat yang tertinggal di dalam mesin produksi sangat berbahaya?',
      idealAnswer: 'Setelah perbaikan selesai, saya selalu membersihkan alat dari oli dan menghitung kembali kelengkapan toolbox. Ketinggalan perkakas di dalam mesin dapat memicu kerusakan fatal saat mesin dinyalakan kembali.'
    },
    {
      id: 'maint-6',
      role: 'maintenance',
      question: 'Seberapa familiar Anda dengan sistem kontrol otomatis seperti sensor pneumatik, silinder hidrolik, atau PLC (Programmable Logic Controller)?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['plc', 'sensor', 'pneumatik', 'hidrolik', 'ladder', 'input output'],
      followUpPrompt: 'Bagaimana cara mengecek sensor proximity yang tidak merespon?',
      idealAnswer: 'Saya memahami dasar pembacaan input-output PLC dan rangkaian pneumatik dasar menggunakan solenoid valve. Untuk mengecek sensor, saya memeriksa lampu indikator daya, jarak deteksi mekanik, dan kabel sinyal menggunakan multimeter.'
    },
    {
      id: 'maint-7',
      role: 'maintenance',
      question: 'Teknisi maintenance dituntut siap siaga (on-call) saat ada mesin breakdown mendadak pada jam lembur atau shift malam. Bagaimana kesiapan komitmen Anda?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['siap', 'on call', 'standby', 'shift', 'tanggung jawab', 'responsif'],
      followUpPrompt: 'Apakah Anda bersedia dihubungi di luar jam kerja normal jika terjadi kendala kritis pabrik?',
      idealAnswer: 'Saya sangat siap menjalankan jadwal standby dan shift malam. Saya menyadari kelancaran operasional pabrik bergantung pada kesiapan tim maintenance dalam merespon breakdown secara cepat dan tepat.'
    },
    {
      id: 'maint-8',
      role: 'maintenance',
      question: 'Jika saat menganalisis kerusakan mesin Anda menemukan bahwa kerusakan disebabkan oleh kelalaian operator dalam pengoperasian, bagaimana cara Anda menyampaikan edukasi kepada operator tersebut?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['edukasi', 'sopan', 'komunikasi', 'sop', 'tidak menyalahkan', 'solusi'],
      followUpPrompt: 'Bagaimana cara membangun hubungan baik antara tim maintenance dan tim produksi?',
      idealAnswer: 'Saya akan menyampaikan dengan bahasa yang sopan dan solutif, menjelaskan cara pengoperasian yang benar sesuai SOP tanpa nada menyalahkan. Kolaborasi yang harmonis antara operator dan teknisi adalah kunci keandalan mesin.'
    },
    {
      id: 'maint-9',
      role: 'maintenance',
      question: 'Apa motivasi terbesar Anda bergabung di tim Engineering kami dan target kompetensi apa yang ingin Anda kuasai dalam 2 tahun ke depan?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['target', 'otomasi', 'robotik', 'jenjang karir', 'kompetensi', 'loyal'],
      followUpPrompt: 'Apakah Anda tertarik mendalami sistem otomasi dan robotik pabrik?',
      idealAnswer: 'Motivasi saya adalah menjadi teknisi maintenance yang andal dan menguasai teknologi industri modern. Dalam 2 tahun, target saya adalah mahir mendiagnosis error PLC tingkat lanjut dan sistem robotik perakitan.'
    },
    {
      id: 'maint-10',
      role: 'maintenance',
      question: 'Baik, pemahaman teknis dan kedisiplinan K3 Anda sangat memuaskan. Sebelum kita akhiri pertemuan ini, apakah ada pertanyaan yang ingin Anda sampaikan kepada saya?',
      interviewerPersona: 'Bapak Suryo (Chief Engineering & Maintenance Lead)',
      expectedKeywords: ['tanya', 'mesin', 'otomasi', 'tantangan', 'software'],
      followUpPrompt: 'Silakan, saya senang berdiskusi teknis dengan calon teknisi kami.',
      idealAnswer: 'Terima kasih Pak Suryo. Saya ingin menanyakan jenis mesin utama dan brand PLC apa yang paling dominan digunakan di line produksi saat ini, serta bagaimana program pelatihan sertifikasi teknisi di perusahaan ini?'
    }
  ],
  logistics: [
    {
      id: 'log-1',
      role: 'logistics',
      question: 'Selamat pagi. Silakan perkenalkan diri Anda dan ceritakan pengalaman Anda dalam manajemen barang di gudang atau pergudangan sekolah/PKL.',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['fifo', 'stock', 'opname', 'akurasi', 'barcode', 'labeling', 'tata letak'],
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
      question: 'Bagaimana Anda memastikan barang yang disiapkan (picking) untuk dikirim ke line produksi benar-benar sesuai dengan part number, kode lot, dan jumlah yang diminta?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['part number', 'barcode', 'scanner', 'label', 'teliti', 'double check'],
      followUpPrompt: 'Mengapa salah suplai part ke line produksi bisa memicu stop line massal?',
      idealAnswer: 'Saya menerapkan prosedur double-check dengan memindai barcode part number dan mencocokkan kode pada delivery order sheet. Ketelitian part number sangat krusial agar tidak ada kesalahan rakit di line produksi.'
    },
    {
      id: 'log-6',
      role: 'logistics',
      question: 'Bagaimana cara Anda menata palet barang di rak penyimpanan gudang (racking system) agar stabil, rapi, dan tidak berisiko roboh?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['kunci palet', 'berat bawah', 'wrapping', 'stabil', 'beban maksimal'],
      followUpPrompt: 'Bagaimana aturan peletakan barang berat vs barang ringan pada rak vertikal?',
      idealAnswer: 'Barang yang lebih berat selalu ditempatkan di tingkat rak paling bawah untuk menjaga pusat gravitasi rak. Setiap tumpukan kardus dipastikan di-wrapping plastik secara kencang dan tidak melebihi kapasitas beban maksimum (SWL).'
    },
    {
      id: 'log-7',
      role: 'logistics',
      question: 'Bagaimana kesiapan fisik Anda dalam menangani aktivitas manual handling seperti memindahkan kardus barang, mengangkat dengan postur tubuh yang benar, dan bekerja di gudang non-AC?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['ergonomis', 'jongkok', 'tulang belakang', 'fisik', 'stamina', 'siap'],
      followUpPrompt: 'Bagaimana teknik mengangkat barang berat agar tidak mencederai punggung?',
      idealAnswer: 'Saya selalu menerapkan teknik ergonomis, yaitu menekuk lutut dan bertumpu pada kekuatan paha, bukan membungkukkan tulang belakang. Saya memiliki stamina fisik yang sehat dan siap bekerja aktif di area pergudangan.'
    },
    {
      id: 'log-8',
      role: 'logistics',
      question: 'Jika suatu hari terjadi keterlambatan kedatangan truk suplai dari vendor sementara line perakitan membutuhkan material tersebut dalam 15 menit ke depan, bagaimana langkah cepat dan koordinasi Anda?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['lapor', 'prioritas', 'jalur cepat', 'koordinasi', 'siaga', 'bongkar cepat'],
      followUpPrompt: 'Bagaimana Anda berkoordinasi dengan tim receiving?',
      idealAnswer: 'Saya segera melaporkan status ke Leader dan mempersiapkan area receiving khusus (fast-track). Begitu truk tiba, tim langsung melakukan unloading dan verifikasi cepat agar material bisa segera diantar ke line tanpa menghentikan produksi.'
    },
    {
      id: 'log-9',
      role: 'logistics',
      question: 'Apa komitmen terbesar Anda terhadap akurasi stok (inventory accuracy), kedisiplinan jam kerja, dan kemauan bekerja lembur di akhir pekan saat jadwal stock opname?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['komitmen', 'akurasi 100', 'stock opname', 'lembur', 'disiplin', 'tanggung jawab'],
      followUpPrompt: 'Apakah Anda bersedia masuk di akhir pekan saat jadwal opname tahunan?',
      idealAnswer: 'Komitmen saya adalah menjaga akurasi data 100% dan selalu siap lembur saat jadwal stock opname bulanan atau tahunan. Bagi saya, keakuratan stok gudang adalah fondasi kelancaran seluruh operasional pabrik.'
    },
    {
      id: 'log-10',
      role: 'logistics',
      question: 'Baik, penjelasan mengenai alur pergudangan dan komitmen K3 Anda sangat meyakinkan. Sebelum kita akhiri wawancara ini, apakah ada hal yang ingin Anda tanyakan kepada kami?',
      interviewerPersona: 'Bapak Anton (Warehouse & Logistics Lead)',
      expectedKeywords: ['tanya', 'sistem wms', 'sap', 'forklift', 'alur kerja'],
      followUpPrompt: 'Silakan, saya sangat terbuka menjawab hal yang ingin Anda ketahui.',
      idealAnswer: 'Terima kasih Pak Anton. Saya ingin menanyakan sistem manajemen pergudangan (WMS atau SAP) apa yang digunakan di sini, dan apakah ada pelatihan resmi untuk pengoperasian alat angkat seperti Reach Truck atau Forklift?'
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
  baseQuestionItem: InterviewQuestionItem,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
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
        questionIndex: nextQuestionIndex,
        baseQuestionText: baseQuestionItem.question,
        conversationHistory
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

  // Dynamic Question from Questions Bank (10 progressive stages, guaranteed unique per stage)
  const baseBank = interviewQuestionsBank[role] || interviewQuestionsBank.operator;
  const questionIndex = Math.min(nextQuestionIndex, baseBank.length - 1);
  const currentBankItem = baseBank[questionIndex] || baseQuestionItem;

  // Each stage uses its own distinct question from the 10-stage interview bank
  const adaptiveQuestion = currentBankItem.question;

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
  transcript: Array<{ speaker: string; text: string; role?: string }>
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
  // 1. Strict Candidate Response Verification
  const candidateTurns = transcript.filter(t => 
    t.role === 'user' ||
    t.speaker === candidateName || 
    t.speaker.toLowerCase().includes('anda') || 
    t.speaker.toLowerCase().includes('kandidat')
  );
  const totalWords = candidateTurns
    .map(t => t.text || '')
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  // Zero responses guard: Candidate didn't answer or hung up immediately
  if (candidateTurns.length === 0 || totalWords < 4) {
    return {
      totalAcceptanceProbability: 0,
      relevanceScore: 0,
      articulationScore: 0,
      etiquetteScore: 10,
      jobFitScore: 0,
      summary: 'Sesi wawancara diakhiri tanpa adanya jawaban atau respons suara dari kandidat. HRD belum dapat memberikan nilai kelulusan karena Anda belum menjawab pertanyaan yang diajukan.',
      strengths: ['Panggilan telepon berhasil tersambung ke sistem'],
      weaknesses: [
        'Kandidat tidak memberikan jawaban atas pertanyaan yang diajukan oleh HRD',
        'Panggilan telepon diakhiri sebelum proses wawancara berlangsung'
      ],
      actionableFeedback: 'Nyalakan mikrofon Anda dan berbicaralah saat HRD selesai memberikan pertanyaan. Jangan menutup panggilan sebelum Anda menjawab agar kemampuan Anda dapat dinilai secara objektif.',
      isAiEvaluated: true
    };
  }

  // Very minimal response: 1 short turn (< 15 words)
  if (candidateTurns.length === 1 && totalWords < 15) {
    return {
      totalAcceptanceProbability: 15,
      relevanceScore: 15,
      articulationScore: 20,
      etiquetteScore: 35,
      jobFitScore: 10,
      summary: 'Sesi wawancara diakhiri terlalu cepat. Anda hanya memberikan 1 jawaban yang sangat singkat lalu mengakhiri panggilan, sehingga belum memenuhi standar minimum asesmen HRD.',
      strengths: ['Merespons pembuka di awal sesi wawancara'],
      weaknesses: [
        'Jawaban terputus dan belum memuat informasi kompetensi teknis',
        'Sesi dihentikan sebelum aspek kesiapan kerja & shift pabrik dapat digali'
      ],
      actionableFeedback: 'Ikuti sesi wawancara hingga selesai (minimal 6-10 pertanyaan). Uraikan pengalaman PKL, keterampilan teknis, dan kesiapan shift kerja Anda secara mendalam menggunakan metode STAR.',
      isAiEvaluated: true
    };
  }

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
        const evalObj = data.evaluation;
        return {
          totalAcceptanceProbability: typeof evalObj.totalAcceptanceProbability === 'number' ? evalObj.totalAcceptanceProbability : 0,
          relevanceScore: typeof evalObj.relevanceScore === 'number' ? evalObj.relevanceScore : 0,
          articulationScore: typeof evalObj.articulationScore === 'number' ? evalObj.articulationScore : 0,
          etiquetteScore: typeof evalObj.etiquetteScore === 'number' ? evalObj.etiquetteScore : 0,
          jobFitScore: typeof evalObj.jobFitScore === 'number' ? evalObj.jobFitScore : 0,
          summary: evalObj.summary || 'Sesi wawancara selesai.',
          strengths: Array.isArray(evalObj.strengths) && evalObj.strengths.length > 0 ? evalObj.strengths : ['Menghadiri sesi wawancara'],
          weaknesses: Array.isArray(evalObj.weaknesses) && evalObj.weaknesses.length > 0 ? evalObj.weaknesses : ['Tingkatkan penguasaan metode STAR'],
          actionableFeedback: evalObj.actionableFeedback || 'Latihlah artikulasi dan sampaikan bukti konkret saat menjawab pertanyaan.',
          isAiEvaluated: true
        };
      }
    }
  } catch (err) {
    console.warn('[Evaluate Session API Error]', err);
  }

  // Fallback Heuristic evaluation based on actual candidate turns
  const baseScore = Math.min(92, Math.max(15, Math.round(15 + (candidateTurns.length * 8) + (totalWords * 0.15))));
  return {
    totalAcceptanceProbability: baseScore,
    relevanceScore: Math.min(95, baseScore),
    articulationScore: Math.min(95, Math.max(15, baseScore - 5)),
    etiquetteScore: Math.min(98, baseScore + 5),
    jobFitScore: Math.min(95, baseScore),
    summary: `Kandidat telah menyelesaikan wawancara dengan ${candidateTurns.length} pertanyaan terartikulasi.`,
    strengths: ['Aktif merespons setiap pertanyaan', 'Menunjukkan motivasi kerja tinggi'],
    weaknesses: ['Perlu mempertajam contoh konkret pengalaman kerja dengan metode STAR'],
    actionableFeedback: 'Latihlah artikulasi secara rutin dan sampaikan contoh konkret dari pengalaman PKL Anda.',
    isAiEvaluated: false
  };
}
