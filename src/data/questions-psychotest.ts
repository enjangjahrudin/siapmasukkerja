import { BaseQuestion } from '../types';

// ============================================================================
// PSIKOTES PENALARAN & LOGIKA - GENERATOR & BANK ENGINE (1.000+ SOAL)
// Mencakup Sinonim Industri, Antonim, Analogi, Silogisme Deduksi,
// Logika Posisi, Logika Komparasi, & Pengelompokan Kategori (Odd One Out)
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
  },
  {
    word: 'KOMPREHENSIF',
    synonym: 'Menyeluruh / Lengkap Luas',
    antonym: 'Parsial / Sepotong / Dangkal',
    synonymDistractors: ['Terbatas', 'Singkat', 'Terpisah'],
    antonymDistractors: ['Total', 'Holistik', 'Utuh'],
    explanation: 'Komprehensif berarti bersifat menyeluruh, mampu menangkap dan mencakup banyak hal secara luas dan lengkap.'
  },
  {
    word: 'KONSISTEN',
    synonym: 'Ajeg / Tetap Tidak Berubah',
    antonym: 'Inkonsisten / Berubah-ubah / Plinplan',
    synonymDistractors: ['Keras Kepala', 'Kaku', 'Tertutup'],
    antonymDistractors: ['Konstan', 'Stabil', 'Kukuh'],
    explanation: 'Konsisten adalah kesesuaian dan ketetapan sikap atau tindakan dari awal hingga akhir tanpa penyimpangan.'
  },
  {
    word: 'KONTINUITAS',
    synonym: 'Keberlanjutan / Kesinambungan',
    antonym: 'Diskontinuitas / Terputus-putus',
    synonymDistractors: ['Kelambatan', 'Penghentian', 'Kerapuhan'],
    antonymDistractors: ['Keteraturan', 'Kelanggengan', 'Urutan'],
    explanation: 'Kontinuitas adalah kelangsungan proses atau keadaan yang berjalan secara terus-menerus tanpa jeda terputus.'
  },
  {
    word: 'DEGRADASI',
    synonym: 'Kemerosotan / Penurunan Mutu',
    antonym: 'Peningkatan / Elevasi / Progresi',
    synonymDistractors: ['Penghancuran', 'Ketiadaan', 'Pemisahan'],
    antonymDistractors: ['Kemunduran', 'Kerusakan', 'Penyusutan'],
    explanation: 'Degradasi adalah proses penurunan mutu, kualitas, atau status dari kondisi semula.'
  },
  {
    word: 'KAPASITAS',
    synonym: 'Daya Tampung / Kemampuan Muat',
    antonym: 'Keterbatasan Ruang / Ketidakmampuan',
    synonymDistractors: ['Kecepatan', 'Jarak Tempuh', 'Ketebalan'],
    antonymDistractors: ['Daya Serap', 'Volume', 'Potensi'],
    explanation: 'Kapasitas adalah daya tampung atau batas kemampuan maksimal suatu wadah, ruang, atau mesin dalam menampung sesuatu.'
  },
  {
    word: 'INTEGRITAS',
    synonym: 'Kejujuran Mutlak / Ketulusan Moral',
    antonym: 'Kemunafikan / Kecurangan / Korupsi',
    synonymDistractors: ['Ketegasan', 'Kecerdasan', 'Keberanian'],
    antonymDistractors: ['Loyalitas', 'Kehormatan', 'Kelurusan'],
    explanation: 'Integritas adalah keselarasan antara perkataan dan perbuatan yang dilandasi oleh prinsip moral dan kejujuran tinggi.'
  },
  {
    word: 'SIMULTAN',
    synonym: 'Serentak / Bersamaan Waktu',
    antonym: 'Sekuensial / Bergantian / Bertahap',
    synonymDistractors: ['Berturut-turut', 'Terpisah', 'Masing-masing'],
    antonymDistractors: ['Serentak', 'Kolektif', 'Berdampingan'],
    explanation: 'Simultan merujuk pada beberapa peristiwa atau tindakan yang berlangsung pada saat yang sama secara bersamaan.'
  },
  {
    word: 'HIERARKI',
    synonym: 'Tingkatan Bertingkat / Jenjang Jabatan',
    antonym: 'Egaliter / Kesejajaran / Setara',
    synonymDistractors: ['Pengelompokan', 'Persaingan', 'Koordinasi'],
    antonymDistractors: ['Struktur', 'Silsilah', 'Skala Urutan'],
    explanation: 'Hierarki adalah susunan tingkatan atau jenjang otoritas kedudukan dari yang tertinggi hingga terendah.'
  },
  {
    word: 'INSPEKSI',
    synonym: 'Pemeriksaan Seksama / Peninjauan',
    antonym: 'Pembiaran / Pengabaian / Kelalaian',
    synonymDistractors: ['Pengumuman', 'Perbaikan', 'Pencatatan'],
    antonymDistractors: ['Audit', 'Pengecekan', 'Verifikasi'],
    explanation: 'Inspeksi adalah kegiatan memeriksa suatu produk atau sistem secara teliti untuk memastikan kesesuaian dengan standar.'
  },
  {
    word: 'KALIBRASI',
    synonym: 'Penyelarasan Standar / Peneraan Akurasi',
    antonym: 'Deviasi / Desinkronisasi / Pembiasan',
    synonymDistractors: ['Pembersihan', 'Penggantian', 'Pelumasan'],
    antonymDistractors: ['Peneraan', 'Penyesuaian', 'Standarisasi'],
    explanation: 'Kalibrasi adalah proses pengecekan dan pengaturan akurasi alat ukur dengan membandingkannya terhadap standar baku yang sah.'
  },
  {
    word: 'STANDARISASI',
    synonym: 'Pembakuan Norma / Penyeragaman',
    antonym: 'Diversifikasi Bebas / Keragaman Acak',
    synonymDistractors: ['Pengawasan', 'Pemberian Izin', 'Pendaftaran'],
    antonymDistractors: ['Keseragaman', 'Kepatuhan', 'Formalisasi'],
    explanation: 'Standarisasi adalah penentuan aturan atau ukuran baku yang harus diikuti agar seragam dan berkualitas sama.'
  },
  {
    word: 'PRODUKTIVITAS',
    synonym: 'Daya Hasil / Efektivitas Kerja',
    antonym: 'Kemandekan / Kelesuan / Stagnasi',
    synonymDistractors: ['Jam Kerja', 'Pengeluaran', 'Kelelahan'],
    antonymDistractors: ['Kinerja', 'Hasil Usaha', 'Daya Cipta'],
    explanation: 'Produktivitas adalah perbandingan antara hasil yang dicapai (output) dengan keseluruhan sumber daya yang digunakan (input).'
  },
  {
    word: 'DISIPLIN',
    synonym: 'Kepatuhan Aturan / Ketertiban',
    antonym: 'Pembangkangan / Indisipliner / Liar',
    synonymDistractors: ['Hukuman', 'Kekerasan', 'Ketakutan'],
    antonymDistractors: ['Loyalitas', 'Ketaatan', 'Dedikasi'],
    explanation: 'Disiplin adalah sikap patuh dan taat secara konsisten terhadap norma, aturan, dan tata tertib yang berlaku.'
  },
  {
    word: 'ESTIMASI',
    synonym: 'Prakiraan / Taksiran Perhitungan',
    antonym: 'Kepastian Mutlak / Angka Eksak',
    synonymDistractors: ['Keputusan', 'Pengukuran Pasti', 'Anggaran'],
    antonymDistractors: ['Proyeksi', 'Dugaan', 'Kalkulasi'],
    explanation: 'Estimasi adalah perkiraan atau taksiran kasar mengenai nilai, biaya, kuantitas, atau waktu yang dibutuhkan.'
  },
  {
    word: 'FLUIDITAS',
    synonym: 'Kelancaran Alir / Fleksibilitas',
    antonym: 'Kekakuan / Kebekuan / Hambatan',
    synonymDistractors: ['Kepadatan', 'Kecepatan', 'Kejernihan'],
    antonymDistractors: ['Dinamika', 'Kelenturan', 'Kemudahan'],
    explanation: 'Fluiditas adalah tingkat kemudahan mengalir atau keluwesan suatu sistem dalam menyesuaikan perubahan.'
  },
  {
    word: 'VERIFIKASI',
    synonym: 'Pembuktian Kebenaran / Pengujian Fakta',
    antonym: 'Pemalsuan / Falsifikasi / Asumsi Semu',
    synonymDistractors: ['Pengarsipan', 'Penghapusan', 'Penundaan'],
    antonymDistractors: ['Validasi', 'Konfirmasi', 'Autentikasi'],
    explanation: 'Verifikasi adalah tindakan memeriksa keabsahan dan kebenaran suatu data atau proses dengan bukti konkret.'
  },
  {
    word: 'TOLERANSI',
    synonym: 'Batas Deviasi Izin / Kelonggaran',
    antonym: 'Intoleransi / Kekakuan Mutlak',
    synonymDistractors: ['Kesalahan Berat', 'Pelecehan', 'Kerusakan'],
    antonymDistractors: ['Batas Wajar', 'Margin Error', 'Kelonggaran'],
    explanation: 'Toleransi dalam dunia teknik adalah batas penyimpangan ukuran atau kondisi yang masih dapat diterima/diizinkan.'
  },
  {
    word: 'MODIFIKASI',
    synonym: 'Pengubahan Bentuk / Penyesuaian',
    antonym: 'Orisinalitas / Pemurnian / Ketetapan Asli',
    synonymDistractors: ['Penghancuran', 'Penyalinan', 'Pembersihan'],
    antonymDistractors: ['Inovasi', 'Restrukturisasi', 'Variasi'],
    explanation: 'Modifikasi adalah proses melakukan perubahan atau penyesuaian pada bagian tertentu tanpa menghilangkan fungsi dasar aslinya.'
  },
  {
    word: 'AUDIT',
    synonym: 'Uji Kelayakan / Evaluasi Resmi',
    antonym: 'Pembiaran / Pengabaian Total',
    synonymDistractors: ['Hukuman', 'Pemberhentian', 'Pelatihan'],
    antonymDistractors: ['Evaluasi', 'Pemeriksaan', 'Tinjauan'],
    explanation: 'Audit adalah pemeriksaan dan evaluasi sistematis serta independen terhadap laporan, catatan, atau proses kerja.'
  },
  {
    word: 'KOMPETENSI',
    synonym: 'Kemampuan Keahlian / Kecakapan',
    antonym: 'Inkompetensi / Ketidakcakapan / Kelemahan',
    synonymDistractors: ['Status Sosial', 'Gaji Pokok', 'Usia Kerja'],
    antonymDistractors: ['Kapabilitas', 'Keterampilan', 'Kualifikasi'],
    explanation: 'Kompetensi adalah penguasaan keterampilan, pengetahuan, dan sikap kerja yang dipersyaratkan untuk menjalankan tugas dengan baik.'
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
  { a1: 'SOP PABRIK', a2: 'KEDISIPLINAN', b1: 'UNDANG-UNDANG', b2: 'KETERTIBAN', exp: 'SOP menjaga kedisiplinan kerja, UU menjaga ketertiban masyarakat.' },
  { a1: 'BARCODE SCANNER', a2: 'INVENTARIS GUDANG', b1: 'FINGERPRINT SCANNER', b2: 'ABSENSI PEGAWAI', exp: 'Barcode scanner merekam barang gudang, fingerprint scanner merekam kehadiran pegawai.' },
  { a1: 'SARUNG TANGAN KARET', a2: 'BAHAN KIMIA', b1: 'EARPLUG (SUMBAT TELINGA)', b2: 'KEBISINGAN MESIN', exp: 'Sarung tangan karet pelindung dari zat kimia, earplug pelindung dari kebisingan suara.' },
  { a1: 'APAR (PEMADAM API)', a2: 'KEBAKARAN', b1: 'KOTAK P3K', b2: 'LUKA KECELAKAAN', exp: 'APAR untuk penanganan pertama kebakaran, P3K untuk penanganan pertama luka fisik.' },
  { a1: 'GENERATOR LISTRIK', a2: 'DAYA ENERGI', b1: 'POMPA HIDROLIK', b2: 'TEKANAN CAIRAN', exp: 'Generator menghasilkan energi listrik, pompa hidrolik menghasilkan tekanan fluida.' },
  { a1: 'AMPEREMETER', a2: 'ARUS LISTRIK', b1: 'TACHOMETER', b2: 'KECEPATAN PUTARAN (RPM)', exp: 'Amperemeter mengukur arus listrik, tachometer mengukur kecepatan putaran mesin.' },
  { a1: 'POKA-YOKE', a2: 'PENCEGAHAN CACAT', b1: 'PAGAR PENGAMAN', b2: 'PENCEGAHAN JATUH', exp: 'Poka-yoke sistem pencegah cacat kerja, pagar pengaman pencegah bahaya jatuh.' },
  { a1: 'OPERATOR', a2: 'MESIN PRODUKSI', b1: 'PILOT', b2: 'PESAWAT TERBANG', exp: 'Operator mengemudikan/mengendalikan mesin produksi, pilot mengendalikan pesawat terbang.' },
  { a1: 'GUDANG RAW MATERIAL', a2: 'BAHAN BAKU', b1: 'GUDANG FINISHED GOODS', b2: 'PRODUK JADI', exp: 'Gudang raw material tempat bahan mentah, gudang finished goods tempat produk jadi.' },
  { a1: 'KALIBRASI', a2: 'AKURASI ALAT', b1: 'ASAH PISAU', b2: 'KETAJAMAN MATA PISAU', exp: 'Kalibrasi menjaga akurasi alat, mengasah menjaga ketajaman pisau.' },
  { a1: 'VENTILASI UDARA', a2: 'SIRKULASI OKSIGEN', b1: 'DRAINASE SALURAN', b2: 'PEMBUANGAN AIR', exp: 'Ventilasi melancarkan sirkulasi udara, drainase melancarkan pembuangan air.' }
];

export const SYLLOGISM_TEMPLATES = [
  {
    p1: 'Semua operator perakitan di Line 1 wajib mengenakan kacamata safety.',
    p2: 'Budi sedang bekerja di Line 1 dan tidak mengenakan kacamata safety.',
    ans: 'Budi melanggar SOP K3 atau bukan operator perakitan resmi di Line 1',
    distractors: [
      'Budi adalah supervisor yang kebal aturan SOP',
      'Kacamata safety tidak wajib di Line 1',
      'Semua operator Line 1 boleh melepas kacamata saat lelah'
    ],
    exp: 'Jika aturan berlaku umum untuk semua subjek di lokasi tersebut, maka subjek yang tidak mematuhi telah melanggar aturan.'
  },
  {
    p1: 'Semua mesin cetak yang dirawat secara berkala tidak mengalami mati mendadak (breakdown).',
    p2: 'Mesin cetak nomor 05 hari ini mengalami mati mendadak (breakdown).',
    ans: 'Mesin cetak nomor 05 tidak dirawat secara berkala sesuai jadwal',
    distractors: [
      'Mesin cetak nomor 05 adalah tipe mesin tercanggih di pabrik',
      'Semua mesin cetak di pabrik rusak total hari ini',
      'Operator mesin nomor 05 sengaja menekan tombol darurat'
    ],
    exp: 'Modus Tollens: Jika P -> Q, maka Tidak Q -> Tidak P (Mesin breakdown membuktikan syarat perawatan berkala tidak terpenuhi).'
  },
  {
    p1: 'Semua komponen yang lolos uji QC memiliki label stempel Hijau.',
    p2: 'Komponen suku cadang seri X-90 tidak memiliki label stempel Hijau.',
    ans: 'Komponen seri X-90 tidak lolos uji QC (Status Hold / Reject)',
    distractors: [
      'Komponen seri X-90 adalah komponen kualitas terbaik',
      'Tinta stempel hijau sedang habis di seluruh pabrik',
      'Komponen seri X-90 langsung dikirim ke pelanggan tanpa izin'
    ],
    exp: 'Karena stempel hijau adalah syarat mutlak lolos QC, ketiadaan stempel menandakan komponen belum/tidak lolos QC.'
  },
  {
    p1: 'Jika pasokan listrik PLN padam dan genset otomatis tidak menyala, maka seluruh lini produksi berhenti.',
    p2: 'Hari ini seluruh lini produksi tetap beroperasi normal tanpa henti.',
    ans: 'Pasokan listrik PLN tidak padam atau genset otomatis menyala',
    distractors: [
      'Semua operator bekerja manual tanpa bantuan listrik',
      'Listrik PLN padam total seharian penuh',
      'Pabrik ditutup sementara karena pemadaman'
    ],
    exp: 'Hukum De Morgan & Modus Tollens: Karena lini produksi tidak berhenti, maka premis pemadaman ganda tidak terjadi.'
  },
  {
    p1: 'Setiap karyawan teladan selalu hadir tepat waktu dan mematuhi 5S di tempat kerja.',
    p2: 'Rian selalu hadir tepat waktu, tetapi sering meninggalkan meja kerja dalam kondisi berantakan (tidak menerapkan 5S).',
    ans: 'Rian tidak memenuhi syarat sebagai karyawan teladan',
    distractors: [
      'Rian tetap berhak menjadi karyawan teladan terbaik',
      'Budaya 5S tidak berpengaruh pada penilaian prestasi kerja',
      'Rian akan dipromosikan langsung menjadi manajer'
    ],
    exp: 'Syarat karyawan teladan adalah konjungsi (DAN), sehingga jika salah satu syarat gugur, status tersebut tidak terpenuhi.'
  },
  {
    p1: 'Semua barang yang disimpan di Gudang Berbahaya (B3) wajib memiliki label MSDS (Lembar Data Keselamatan).',
    p2: 'Cairan Pelarut Kimia T-20 disimpan di Gudang Berbahaya (B3).',
    ans: 'Cairan Pelarut Kimia T-20 wajib memiliki label MSDS',
    distractors: [
      'Cairan Pelarut T-20 tidak berbahaya bagi tubuh',
      'Gudang B3 tidak membutuhkan lembar pengawasan MSDS',
      'Hanya barang padat yang wajib memiliki MSDS'
    ],
    exp: 'Modus Ponens: Semua anggota himpunan Gudang B3 wajib berlabel MSDS, maka Cairan T-20 wajib berlabel MSDS.'
  },
  {
    p1: 'Jika suhu ruangan server melebihi 25°C, maka alarm pendingin darurat akan berbunyi.',
    p2: 'Alarm pendingin darurat saat ini berbunyi nyaring.',
    ans: 'Suhu ruangan server melebihi 25°C (atau ada malfungsi sensor darurat)',
    distractors: [
      'Suhu ruangan server berada di bawah 15°C',
      'Listrik gedung sedang padam total',
      'Tidak ada server yang menyala di ruangan tersebut'
    ],
    exp: 'Kondisi alarm aktif mengindikasikan pemicu batas suhu kritis telah tercapai.'
  },
  {
    p1: 'Tidak ada material logam reject yang boleh dimasukkan ke dalam kotak pallet pengiriman konsumen.',
    p2: 'Beberapa produk pada Batch C adalah material logam reject.',
    ans: 'Beberapa produk pada Batch C tidak boleh dimasukkan ke dalam kotak pallet pengiriman',
    distractors: [
      'Semua produk Batch C boleh langsung dikirim ke konsumen',
      'Semua material logam reject telah lolos standar ekspor',
      'Kotak pallet pengiriman khusus memuat barang cacat'
    ],
    exp: 'Silogisme Kategoris: Material reject yang ada pada Batch C dilarang masuk ke pallet pengiriman.'
  },
  {
    p1: 'Semua operator mesin bubut wajib lulus sertifikasi teknik mesin tingkat dasar.',
    p2: 'Sebagian peserta pelatihan hari ini belum lulus sertifikasi teknik mesin tingkat dasar.',
    ans: 'Sebagian peserta pelatihan hari ini belum boleh menjadi operator mesin bubut mandiri',
    distractors: [
      'Semua peserta pelatihan langsung diangkat menjadi operator senior',
      'Sertifikasi teknik mesin tidak diperlukan di industri',
      'Semua peserta pelatihan sudah pasti lulus sertifikasi'
    ],
    exp: 'Peserta yang belum tersertifikasi belum memenuhi syarat kelayakan sebagai operator mesin bubut mandiri.'
  },
  {
    p1: 'Jika target produksi tercapai dan tingkat cacat produk di bawah 0,5%, maka seluruh tim menerima bonus shift.',
    p2: 'Hari ini target produksi tercapai, namun tingkat cacat produk mencapai 1,8%.',
    ans: 'Seluruh tim tidak berhak menerima bonus shift hari ini',
    distractors: [
      'Seluruh tim tetap menerima bonus shift penuh',
      'Target produksi dinyatakan gagal total',
      'Semua mesin pabrik harus diganti baru'
    ],
    exp: 'Karena syarat kedua (cacat < 0,5%) dilanggar, maka kondisi pemberian bonus shift tidak terpenuhi.'
  }
];

// ----------------------------------------------------------------------------
// Generator 1: Sinonim Kata Industri
// ----------------------------------------------------------------------------
function generateSynonymQuestion(seed: number, usedWords?: Set<string>): BaseQuestion {
  const availableVocabs = usedWords ? VOCAB_BANK.filter(v => !usedWords.has(v.word)) : VOCAB_BANK;
  const list = availableVocabs.length > 0 ? availableVocabs : VOCAB_BANK;
  const vocab = list[seed % list.length];
  if (usedWords) usedWords.add(vocab.word);

  const options = [
    `A. ${vocab.synonym}`,
    `B. ${vocab.synonymDistractors[0]}`,
    `C. ${vocab.synonymDistractors[1]}`,
    `D. ${vocab.synonymDistractors[2]}`
  ].sort(() => ((seed * 7) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(vocab.synonym));

  return {
    id: `psy-syn-${vocab.word}-${seed}`,
    category: 'psychotest',
    subCategory: 'Sinonim Kata Industri',
    question: `Pilihlah kata atau padanan makna yang PALING TEPAT (SINONIM) dengan istilah: "${vocab.word}"`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${vocab.explanation} Jadi, sinonim yang paling tepat adalah: ${vocab.synonym}.`,
    quickTrick: `💡 Trik Kosakata: Hubungkan kata dengan konteks industri kerja nyata (misal: perawatan preventif = pencegahan dini).`
  };
}

// ----------------------------------------------------------------------------
// Generator 2: Antonim / Lawan Kata
// ----------------------------------------------------------------------------
function generateAntonymQuestion(seed: number, usedWords?: Set<string>): BaseQuestion {
  const availableVocabs = usedWords ? VOCAB_BANK.filter(v => !usedWords.has(v.word)) : VOCAB_BANK;
  const list = availableVocabs.length > 0 ? availableVocabs : VOCAB_BANK;
  const vocab = list[seed % list.length];
  if (usedWords) usedWords.add(vocab.word);

  const options = [
    `A. ${vocab.antonym}`,
    `B. ${vocab.antonymDistractors[0]}`,
    `C. ${vocab.antonymDistractors[1]}`,
    `D. ${vocab.antonymDistractors[2]}`
  ].sort(() => ((seed * 11) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(vocab.antonym));

  return {
    id: `psy-ant-${vocab.word}-${seed}`,
    category: 'psychotest',
    subCategory: 'Antonim / Lawan Kata',
    question: `Pilihlah lawan kata yang PALING SESUAI (ANTONIM) untuk istilah: "${vocab.word}"`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Istilah "${vocab.word}" bermakna ${vocab.synonym.toLowerCase()}. Lawan katanya (kebalikannya) adalah: ${vocab.antonym}.`,
    quickTrick: `💡 Trik Lawan Kata: Jangan terkecoh memilih sinonim! Cari kata yang maknanya 180 derajat bertolak belakang.`
  };
}

// ----------------------------------------------------------------------------
// Generator 3: Analogi & Hubungan Kata
// ----------------------------------------------------------------------------
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
    id: `psy-ana-${seed % ANALOGY_BANK.length}`,
    category: 'psychotest',
    subCategory: 'Analogi & Hubungan Kata',
    question: `Tentukan pasangan kata yang memiliki hubungan analogi paling setara: "${analogy.a1} : ${analogy.a2} = ... : ..."`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Hubungan analogi: ${analogy.exp}. Pasangan yang polanya identik adalah ${analogy.b1} : ${analogy.b2}.`,
    quickTrick: `💡 Trik Analogi: Buat kalimat penghubung singkat antara kata A dan B, lalu terapkan pola kalimat yang sama persis pada pilihan jawaban.`
  };
}

// ----------------------------------------------------------------------------
// Generator 4: Silogisme & Logika Deduksi
// ----------------------------------------------------------------------------
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
    id: `psy-syl-${seed % SYLLOGISM_TEMPLATES.length}`,
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
// Generator 5: Logika Posisi & Urutan Kerja
// ----------------------------------------------------------------------------
function generateAnalyticalPositionQuestion(seed: number): BaseQuestion {
  const namePools = [
    ['Andi', 'Budi', 'Candra', 'Deni', 'Eko'],
    ['Fajar', 'Gilang', 'Hadi', 'Irfan', 'Joko'],
    ['Kurnia', 'Lukman', 'Maulana', 'Noval', 'Oki'],
    ['Rian', 'Surya', 'Taufik', 'Wahyu', 'Yusuf']
  ];
  const names = namePools[seed % namePools.length];
  
  // Posisi: Pos 1, 2, 3, 4, 5
  const p1 = names[0]; // Pos 1 (Paling depan)
  const p2 = names[1]; // Pos 2
  const p3 = names[2]; // Pos 3 (Tengah)
  const p4 = names[3]; // Pos 4
  const p5 = names[4]; // Pos 5 (Paling belakang)

  const askTarget = seed % 3; // 0: tengah (pos 3), 1: pos 2, 2: pos 4
  let targetQuestion = '';
  let ans = '';

  if (askTarget === 0) {
    targetQuestion = `Siapakah operator yang berdiri tepat di posisi ke-3 (tengah antrean briefing)?`;
    ans = p3;
  } else if (askTarget === 1) {
    targetQuestion = `Siapakah operator yang berdiri tepat di belakang ${p1}?`;
    ans = p2;
  } else {
    targetQuestion = `Siapakah operator yang berdiri tepat di depan ${p5}?`;
    ans = p4;
  }

  const clues = [
    `• ${p1} berdiri di posisi paling depan (posisi 1).`,
    `• ${p2} berdiri tepat di antara ${p1} dan ${p3}.`,
    `• ${p4} berdiri tepat di belakang ${p3}.`,
    `• ${p5} berdiri di posisi paling belakang (posisi 5).`
  ];

  const questionText = `Lima operator (${names.join(', ')}) berdiri dalam barisan pengarahan pagi:\n${clues.join('\n')}\n\n${targetQuestion}`;

  const options = [
    `A. ${ans}`,
    `B. ${names[(names.indexOf(ans) + 1) % 5]}`,
    `C. ${names[(names.indexOf(ans) + 2) % 5]}`,
    `D. ${names[(names.indexOf(ans) + 3) % 5]}`
  ].sort(() => ((seed * 23) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ans));

  return {
    id: `psy-pos-${seed % 12}`,
    category: 'psychotest',
    subCategory: 'Logika Analitis & Urutan Posisi',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Urutan barisan dari depan ke belakang adalah: 1. ${p1} -> 2. ${p2} -> 3. ${p3} -> 4. ${p4} -> 5. ${p5}. Maka jawaban yang tepat adalah ${ans}.`,
    quickTrick: `💡 Trik Posisi: Buat garis 1 sampai 5 di kertas coretan, lalu masukkan nama yang posisinya sudah pasti (paling depan & belakang) terlebih dahulu.`
  };
}

// ----------------------------------------------------------------------------
// Generator 6: Logika Komparasi Efisiensi & Output Mesin
// ----------------------------------------------------------------------------
function generateAnalyticalComparisonQuestion(seed: number): BaseQuestion {
  const machines = ['Mesin Alpha', 'Mesin Beta', 'Mesin Gamma', 'Mesin Delta', 'Mesin Epsilon'];
  
  // Urutan kecepatan: Alpha > Beta > Gamma > Delta > Epsilon
  const askFastest = seed % 2 === 0;

  const questionText = `Dalam uji performa kecepatan perakitan lima mesin di pabrik:\n• ${machines[0]} lebih cepat daripada ${machines[1]}.\n• ${machines[1]} lebih cepat daripada ${machines[2]}.\n• ${machines[3]} lebih lambat daripada ${machines[2]}, tetapi lebih cepat daripada ${machines[4]}.\n\nManakah mesin yang ${askFastest ? 'memiliki kecepatan kerja PALING CEPAT (peringkat 1)' : 'memiliki kecepatan kerja PALING LAMBAT (peringkat terakhir)'}?`;
  
  const ans = askFastest ? machines[0] : machines[4];
  const distractors = machines.filter(m => m !== ans);

  const options = [
    `A. ${ans}`,
    `B. ${distractors[0]}`,
    `C. ${distractors[1]}`,
    `D. ${distractors[2]}`
  ].sort(() => ((seed * 31) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ans));

  return {
    id: `psy-comp-${seed % 10}`,
    category: 'psychotest',
    subCategory: 'Logika Komparasi & Pemeringkatan',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Urutan kecepatan dari yang tercepat ke paling lambat: 1. ${machines[0]} > 2. ${machines[1]} > 3. ${machines[2]} > 4. ${machines[3]} > 5. ${machines[4]}. Maka mesin yang ${askFastest ? 'paling cepat adalah ' + machines[0] : 'paling lambat adalah ' + machines[4]}.`,
    quickTrick: `💡 Trik Pemeringkatan: Gunakan simbol ketidaksamaan ( > atau < ) secara berurutan untuk menyusun rantai perbandingan dengan cepat.`
  };
}

// ----------------------------------------------------------------------------
// Generator 7: Pengelompokan Kategori / Odd One Out (Kata yang Tidak Sekelompok)
// ----------------------------------------------------------------------------
interface CategoryGroup {
  categoryName: string;
  items: string[];
  oddItem: string;
  oddReason: string;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    categoryName: 'Alat Pelindung Diri (APD) K3',
    items: ['Helm Safety', 'Kacamata Safety', 'Sepatu Safety Boots', 'Rompi Reflektor'],
    oddItem: 'Obeng Plus',
    oddReason: 'Obeng Plus adalah alat kerja (hand tools), sedangkan yang lainnya adalah Alat Pelindung Diri (APD).'
  },
  {
    categoryName: 'Alat Ukur Presisi Dimensi',
    items: ['Jangka Sorong (Vernier Caliper)', 'Mikrometer Sekrup', 'Dial Indicator', 'Height Gauge'],
    oddItem: 'Gergaji Besi (Hacksaw)',
    oddReason: 'Gergaji Besi adalah alat potong/benda kerja, sedangkan yang lainnya adalah alat ukur presisi.'
  },
  {
    categoryName: 'Prinsip Budaya 5S / 5R',
    items: ['Seiri (Ringkas)', 'Seiton (Rapi)', 'Seiso (Resik)', 'Shitsuke (Rajin)'],
    oddItem: 'Overtime (Lembur)',
    oddReason: 'Overtime adalah durasi jam kerja tambahan, bukan pilar budaya 5S/5R tempat kerja.'
  },
  {
    categoryName: 'Jenis Cacat Visual Produk Manufaktur',
    items: ['Burry (Gerigi Tajam)', 'Scratch (Baret Gores)', 'Dent (Penyok Fisik)', 'Flash (Sirip Plastik)'],
    oddItem: 'SOP Perakitan',
    oddReason: 'SOP Perakitan adalah prosedur instruksi kerja standar, bukan jenis cacat fisik produk.'
  },
  {
    categoryName: 'Komponen Kelistrikan Panel Mesin',
    items: ['MCB (Circuit Breaker)', 'Relay Kontaktor', 'Fuse (Sekring)', 'Inverter Motor'],
    oddItem: 'Minyak Gemuk (Grease)',
    oddReason: 'Minyak Gemuk adalah pelumas mekanik, bukan komponen instalasi kelistrikan/kontrol.'
  }
];

function generateCategoryOddOneOutQuestion(seed: number): BaseQuestion {
  const group = CATEGORY_GROUPS[seed % CATEGORY_GROUPS.length];
  const items = [...group.items.slice(0, 3), group.oddItem].sort(() => ((seed * 37) % 4) - 1.5);
  const correctIndex = items.indexOf(group.oddItem);

  return {
    id: `psy-odd-${seed % CATEGORY_GROUPS.length}`,
    category: 'psychotest',
    subCategory: 'Pengelompokan Kata & Kategori Logis',
    question: `Manakah di antara pilihan berikut yang TIDAK TERMASUK dalam kelompok yang sama (Pilihlah kata yang ganjil / berbeda sifat)?`,
    options: items.map((it, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${it}`),
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${group.oddReason}`,
    quickTrick: `💡 Trik Pengelompokan: Cari kesamaan fungsi utama dari 3 pilihan yang ada, lalu pilih satu opsi yang menyimpang dari tema tersebut.`
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
  generateAnalyticalPositionQuestion,
  generateAnalyticalComparisonQuestion,
  generateCategoryOddOneOutQuestion
];

export function generateParametricPsychotestQuestion(seed?: number): BaseQuestion {
  const s = seed !== undefined ? seed : Math.floor(Math.random() * 1000000);
  const genIdx = s % PSYCHOTEST_GENERATORS.length;
  return PSYCHOTEST_GENERATORS[genIdx](s);
}

/**
 * Menghasilkan 10 soal psikotes & penalaran acak tanpa duplikasi sama sekali dalam 1 sesi.
 */
export function getPsychotestBatch(count: number = 10): BaseQuestion[] {
  const result: BaseQuestion[] = [];
  const seenFingerprints = new Set<string>();
  const usedVocabWords = new Set<string>();
  const baseSeed = Math.floor(Math.random() * 10000);
  let attempts = 0;

  while (result.length < count && attempts < count * 25) {
    attempts++;
    const genIdx = (result.length + baseSeed + attempts) % PSYCHOTEST_GENERATORS.length;
    const seed = baseSeed * 47 + attempts * 23 + Math.floor(Math.random() * 10000);

    let q: BaseQuestion;
    if (genIdx === 0) {
      q = generateSynonymQuestion(seed, usedVocabWords);
    } else if (genIdx === 1) {
      q = generateAntonymQuestion(seed, usedVocabWords);
    } else {
      q = PSYCHOTEST_GENERATORS[genIdx](seed);
    }

    // Fingerprint unik berdasarkan pertanyaan yang dinormalisasi
    const fp = `${q.subCategory}-${q.question.replace(/\s+/g, ' ').trim()}`;
    if (!seenFingerprints.has(fp)) {
      seenFingerprints.add(fp);
      result.push(q);
    }
  }

  return result;
}

export const psychotestQuestionBank: BaseQuestion[] = Array.from({ length: 1000 }, (_, idx) => {
  const genIdx = idx % PSYCHOTEST_GENERATORS.length;
  return PSYCHOTEST_GENERATORS[genIdx](idx * 19 + 7);
});

export const psychotestQuestions: BaseQuestion[] = psychotestQuestionBank.slice(0, 10);
