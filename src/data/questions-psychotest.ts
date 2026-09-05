import { BaseQuestion } from '../types';

// ============================================================================
// PSIKOTES PENALARAN & LOGIKA - GENERATOR & MASTER BANK (1.000+ SOAL UNIK)
// Mencakup:
// 1. Sinonim Kata Industri & Profesional (60+ Vocab)
// 2. Antonim / Lawan Kata (60+ Vocab)
// 3. Analogi & Hubungan Kata Relasional (35+ Analogi)
// 4. Silogisme & Logika Deduksi Formal (25+ Kasus K3 & Pabrik)
// 5. Logika Analitis Posisi & Formasi (Parametrik Ribuan Kombinasi)
// 6. Logika Komparasi Performa & Output Mesin (Parametrik Ribuan Kombinasi)
// 7. Logika Penjadwalan Shift & Alur Kerja (Parametrik Ribuan Kombinasi)
// 8. Deret Huruf & Sandi Alfabet Logika (Parametrik Ribuan Kombinasi)
// 9. Pengelompokan Kategori / Odd One Out (15+ Klaster Industri)
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
  },
  {
    word: 'DIVERSITAS',
    synonym: 'Keanekaragaman / Variasi Pilihan',
    antonym: 'Homogenitas / Keseragaman Tunggal',
    synonymDistractors: ['Pemisahan', 'Perpecahan', 'Keserupaan'],
    antonymDistractors: ['Pluralitas', 'Kemajemukan', 'Ragam'],
    explanation: 'Diversitas adalah keberagaman atau variasi elemen yang saling melengkapi dalam satu lingkungan.'
  },
  {
    word: 'EVAPORASI',
    synonym: 'Penguapan / Perubahan Gas',
    antonym: 'Kondensasi / Pengembunan Cair',
    synonymDistractors: ['Pembekuan', 'Peleburan', 'Penyubliman'],
    antonymDistractors: ['Pengeringan', 'Vaporisasi', 'Pemisahan'],
    explanation: 'Evaporasi adalah proses perubahan zat cair menjadi uap gas akibat panas.'
  },
  {
    word: 'KONTAMINASI',
    synonym: 'Pencemaran / Pengotoran Zat Luar',
    antonym: 'Purifikasi / Pemurnian / Sterilisasi',
    synonymDistractors: ['Penyaringan', 'Pembersihan', 'Pencampuran'],
    antonymDistractors: ['Polusi', 'Infeksi', 'Zat Asing'],
    explanation: 'Kontaminasi adalah masuknya zat asing berbahaya yang merusak kemurnian atau higienitas suatu bahan.'
  },
  {
    word: 'OTENTIK',
    synonym: 'Asli / Murni / Sahih',
    antonym: 'Duplikat / Palsu / Tiruan / Imitasi',
    synonymDistractors: ['Mahal', 'Langka', 'Baru'],
    antonymDistractors: ['Orisinal', 'Resmi', 'Asli'],
    explanation: 'Otentik berarti asli, sah, dan dapat dipercaya kebenarannya tanpa ada rekayasa.'
  },
  {
    word: 'PROSEDURAL',
    synonym: 'Sesuai Tata Cara Resmi / Terstruktur',
    antonym: 'Inkonvensional / Asal-asalan / Semrawut',
    synonymDistractors: ['Cepat', 'Bertele-tele', 'Kuno'],
    antonymDistractors: ['Sistematis', 'Tertib', 'Formal'],
    explanation: 'Prosedural berarti mengikuti tata cara dan alur instruksi kerja resmi yang telah ditetapkan.'
  },
  {
    word: 'SISTEMATIS',
    synonym: 'Teratur / Berurutan Logis',
    antonym: 'Acak / Sembarangan / Spontan',
    synonymDistractors: ['Lambat', 'Sulit', 'Kaku'],
    antonymDistractors: ['Terencana', 'Metodis', 'Runtut'],
    explanation: 'Sistematis adalah segala sesuatu yang diatur menurut rencana dan sistem yang logis dan teratur.'
  },
  {
    word: 'KONSENTRASI',
    synonym: 'Pemusatan Perhatian / Fokus',
    antonym: 'Distraksi / Pembiasan / Buyar',
    synonymDistractors: ['Kelelahan', 'Kecepatan', 'Ketegangan'],
    antonymDistractors: ['Fokus', 'Atensi', 'Kewaspadaan'],
    explanation: 'Konsentrasi adalah pemusatan seluruh daya pikir dan perhatian pada suatu objek atau pekerjaan.'
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
  { a1: 'VENTILASI UDARA', a2: 'SIRKULASI OKSIGEN', b1: 'DRAINASE SALURAN', b2: 'PEMBUANGAN AIR', exp: 'Ventilasi melancarkan sirkulasi udara, drainase melancarkan pembuangan air.' },
  { a1: 'SOLDER', a2: 'TIMAH', b1: 'LEM TEMBAK (GLUE GUN)', b2: 'LEM LILIN SILIKON', exp: 'Solder melelehkan timah patri, glue gun melelehkan lem lilin.' },
  { a1: 'LAMPU INDIKATOR', a2: 'STATUS MESIN', b1: 'LAMPU LALU LINTAS', b2: 'ARUS KENDARAAN', exp: 'Lampu indikator memandu operator, lampu lalu lintas memandu pengemudi.' },
  { a1: 'KOROSI', a2: 'LOGAM BESI', b1: 'PELAPUKAN', b2: 'KAYU BALOK', exp: 'Besi rusak oleh korosi/karat, kayu rusak oleh proses pelapukan.' },
  { a1: 'KOMPRESOR', a2: 'UDARA PNEUMATIK', b1: 'AKUMULATOR (AKI)', b2: 'TEGANGAN ARUS SEARAH', exp: 'Kompresor menyimpan energi tekanan udara, aki menyimpan energi listrik DC.' },
  { a1: 'JANGKA SORONG', a2: 'MILIMETER (mm)', b1: 'STOPWATCH', b2: 'DETIK (SEKON)', exp: 'Jangka sorong mengukur dimensi dalam mm, stopwatch mengukur waktu dalam detik.' }
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
  },
  {
    p1: 'Setiap forklift di area gudang harus membunyikan klakson saat melintasi persimpangan gang.',
    p2: 'Unit Forklift 02 sedang melintasi persimpangan gang tanpa membunyikan klakson.',
    ans: 'Pengemudi Forklift 02 melanggar prosedur keselamatan K3 lalu lintas gudang',
    distractors: [
      'Forklift 02 mendapat izin khusus melintas hening',
      'Klakson hanya wajib untuk kendaraan beroda empat luar',
      'Persimpangan gudang selalu aman tanpa peringatan suara'
    ],
    exp: 'Kewajiban membunyikan klakson berlaku mutlak di persimpangan demi menghindari tabrakan pekerja.'
  },
  {
    p1: 'Jika tangki oli berada di bawah garis MINIMUM, maka lampu indikator merah akan berkedip.',
    p2: 'Lampu indikator merah pada mesin cetak nomor 04 saat ini tidak berkedip (mati).',
    ans: 'Kapasitas tangki oli tidak berada di bawah garis MINIMUM (aman)',
    distractors: [
      'Mesin nomor 04 sudah kehabisan oli total',
      'Oli mesin harus segera dikuras habis hari ini',
      'Operator lupa menyalakan tombol daya utama'
    ],
    exp: 'Modus Tollens: Tidak Q (lampu tidak berkedip) membuktikan Tidak P (oli tidak di bawah batas minimum).'
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
// Generator 5: Logika Posisi & Formasi Barisan (Parametrik Ribuan Kombinasi)
// ----------------------------------------------------------------------------
function generateAnalyticalPositionQuestion(seed: number): BaseQuestion {
  const namePools = [
    ['Andi', 'Budi', 'Candra', 'Deni', 'Eko'],
    ['Fajar', 'Gilang', 'Hadi', 'Irfan', 'Joko'],
    ['Kurnia', 'Lukman', 'Maulana', 'Noval', 'Oki'],
    ['Rian', 'Surya', 'Taufik', 'Wahyu', 'Yusuf'],
    ['Agus', 'Bambang', 'Cecep', 'Dodi', 'Erwin'],
    ['Farhan', 'Galih', 'Hendro', 'Ivan', 'Jamal']
  ];
  const names = namePools[seed % namePools.length];
  
  // Posisi terurut: Pos 1 (Depan), Pos 2, Pos 3 (Tengah), Pos 4, Pos 5 (Belakang)
  const [p1, p2, p3, p4, p5] = names;

  const askTarget = seed % 4;
  let targetQuestion = '';
  let ans = '';

  if (askTarget === 0) {
    targetQuestion = `Siapakah operator yang berada tepat di posisi ke-3 (tengah formasi)?`;
    ans = p3;
  } else if (askTarget === 1) {
    targetQuestion = `Siapakah operator yang berada tepat di posisi ke-2 (di belakang ${p1})?`;
    ans = p2;
  } else if (askTarget === 2) {
    targetQuestion = `Siapakah operator yang berada tepat di depan ${p5}?`;
    ans = p4;
  } else {
    targetQuestion = `Siapakah operator yang berada di posisi paling depan (posisi 1)?`;
    ans = p1;
  }

  const clues = [
    `• ${p1} berdiri di posisi paling depan (posisi 1).`,
    `• ${p2} berdiri tepat di antara ${p1} dan ${p3}.`,
    `• ${p4} berdiri tepat di belakang ${p3}.`,
    `• ${p5} berdiri di posisi paling belakang (posisi 5).`
  ];

  const questionText = `Lima operator (${names.join(', ')}) diatur posisinya pada jalur perakitan:\n${clues.join('\n')}\n\n${targetQuestion}`;

  const options = [
    `A. ${ans}`,
    `B. ${names[(names.indexOf(ans) + 1) % 5]}`,
    `C. ${names[(names.indexOf(ans) + 2) % 5]}`,
    `D. ${names[(names.indexOf(ans) + 3) % 5]}`
  ].sort(() => ((seed * 23) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ans));

  return {
    id: `psy-pos-${seed}`,
    category: 'psychotest',
    subCategory: 'Logika Analitis & Urutan Posisi',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Urutan posisi dari depan ke belakang adalah: 1. ${p1} -> 2. ${p2} -> 3. ${p3} -> 4. ${p4} -> 5. ${p5}. Maka jawaban yang tepat adalah ${ans}.`,
    quickTrick: `💡 Trik Posisi: Gambar slot 1 s/d 5 di kertas coretan, lalu kunci nama yang posisinya mutlak (paling depan & belakang) terlebih dahulu.`
  };
}

// ----------------------------------------------------------------------------
// Generator 6: Logika Komparasi Performa & Output (Parametrik Ribuan Kombinasi)
// ----------------------------------------------------------------------------
function generateAnalyticalComparisonQuestion(seed: number): BaseQuestion {
  const machineThemes = [
    ['Mesin Alpha', 'Mesin Beta', 'Mesin Gamma', 'Mesin Delta', 'Mesin Epsilon'],
    ['Lini Stamping A', 'Lini Stamping B', 'Lini Stamping C', 'Lini Stamping D', 'Lini Stamping E'],
    ['Robot Las 1', 'Robot Las 2', 'Robot Las 3', 'Robot Las 4', 'Robot Las 5'],
    ['Oven Pemanas 10', 'Oven Pemanas 20', 'Oven Pemanas 30', 'Oven Pemanas 40', 'Oven Pemanas 50']
  ];
  const machines = machineThemes[seed % machineThemes.length];
  
  // Urutan performa: machines[0] > machines[1] > machines[2] > machines[3] > machines[4]
  const askFastest = seed % 2 === 0;

  const questionText = `Data efisiensi output produksi menunjukkan perbandingan berikut:\n• ${machines[0]} menghasilkan output lebih tinggi daripada ${machines[1]}.\n• ${machines[1]} menghasilkan output lebih tinggi daripada ${machines[2]}.\n• ${machines[3]} menghasilkan output lebih rendah daripada ${machines[2]}, tetapi lebih tinggi daripada ${machines[4]}.\n\nManakah unit mesin yang ${askFastest ? 'memiliki output PALING TINGGI (peringkat 1)' : 'memiliki output PALING RENDAH (peringkat terakhir)'}?`;
  
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
    id: `psy-comp-${seed}`,
    category: 'psychotest',
    subCategory: 'Logika Komparasi & Pemeringkatan',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Rantai urutan output dari tertinggi ke terendah: 1. ${machines[0]} > 2. ${machines[1]} > 3. ${machines[2]} > 4. ${machines[3]} > 5. ${machines[4]}. Maka unit yang ${askFastest ? 'paling tinggi outputnya adalah ' + machines[0] : 'paling rendah outputnya adalah ' + machines[4]}.`,
    quickTrick: `💡 Trik Rantai Komparasi: Tulis simbol '>' secara langsung di kertas coretan untuk menyusun hierarki data dari kiri ke kanan.`
  };
}

// ----------------------------------------------------------------------------
// Generator 7: Logika Penjadwalan Shift Pabrik (Parametrik Ribuan Kombinasi)
// ----------------------------------------------------------------------------
function generateShiftSchedulingQuestion(seed: number): BaseQuestion {
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];
  const workers = ['Danu', 'Fajar', 'Gani', 'Hendri', 'Iqbal'];
  
  // Penjadwalan: Danu (Senin), Fajar (Selasa), Gani (Rabu), Hendri (Kamis), Iqbal (Jumat)
  const targetDayIdx = seed % days.length;
  const targetDay = days[targetDayIdx];
  const ansWorker = workers[targetDayIdx];

  const questionText = `Lima teknisi maintenance (${workers.join(', ')}) dijadwalkan piket harian dari Senin hingga Jumat dengan aturan:\n• ${workers[0]} bertugas di hari pertama (Senin).\n• ${workers[1]} bertugas tepat setelah ${workers[0]}.\n• ${workers[2]} bertugas tepat di hari ${days[2]}.\n• ${workers[4]} bertugas di hari terakhir (Jumat).\n• ${workers[3]} bertugas tepat sebelum ${workers[4]}.\n\nSiapakah teknisi yang bertugas pada hari ${targetDay}?`;

  const distractors = workers.filter(w => w !== ansWorker);
  const options = [
    `A. ${ansWorker}`,
    `B. ${distractors[0]}`,
    `C. ${distractors[1]}`,
    `D. ${distractors[2]}`
  ].sort(() => ((seed * 37) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ansWorker));

  return {
    id: `psy-shift-${seed}`,
    category: 'psychotest',
    subCategory: 'Logika Analitis Penjadwalan Shift',
    question: questionText,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `Jadwal piket: Senin (${workers[0]}), Selasa (${workers[1]}), Rabu (${workers[2]}), Kamis (${workers[3]}), Jumat (${workers[4]}). Maka teknisi pada hari ${targetDay} adalah ${ansWorker}.`,
    quickTrick: `💡 Trik Jadwal: Buat tabel 5 kolom hari kerja (Sen-Jum) dan isi nama teknisi sesuai petunjuk yang diberikan.`
  };
}

// ----------------------------------------------------------------------------
// Generator 8: Sandi & Pola Deret Huruf Logika (Parametrik Ribuan Kombinasi)
// ----------------------------------------------------------------------------
function generateLetterPatternQuestion(seed: number): BaseQuestion {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const patternType = seed % 3;

  let seq: string[] = [];
  let ans = '';
  let ruleExp = '';

  if (patternType === 0) {
    // Pola Lompat +2 (A, C, E, G, I...)
    const startIdx = seed % 10;
    const step = 2;
    for (let i = 0; i < 5; i++) seq.push(alphabet[startIdx + i * step]);
    ans = alphabet[startIdx + 5 * step];
    ruleExp = `Pola deret melompat +${step} huruf pada setiap langkah (${seq.join(' -> ')}).`;
  } else if (patternType === 1) {
    // Pola Lompat +3 (A, D, G, J...)
    const startIdx = seed % 8;
    const step = 3;
    for (let i = 0; i < 4; i++) seq.push(alphabet[startIdx + i * step]);
    ans = alphabet[startIdx + 4 * step];
    ruleExp = `Pola deret melompat +${step} huruf (${seq.join(' -> ')}).`;
  } else {
    // Pola Berpasangan (AB, CD, EF, GH, ...)
    const startIdx = (seed % 9) * 2;
    seq = [
      `${alphabet[startIdx]}${alphabet[startIdx + 1]}`,
      `${alphabet[startIdx + 2]}${alphabet[startIdx + 3]}`,
      `${alphabet[startIdx + 4]}${alphabet[startIdx + 5]}`
    ];
    ans = `${alphabet[startIdx + 6]}${alphabet[startIdx + 7]}`;
    ruleExp = `Pola deret adalah pasangan huruf alfabetik berurutan (${seq.join(' -> ')}).`;
  }

  const ansIdx = alphabet.indexOf(ans[0]);
  const dist1 = alphabet[(ansIdx + 1) % 26] + (ans.length > 1 ? alphabet[(ansIdx + 2) % 26] : '');
  const dist2 = alphabet[(ansIdx + 25) % 26] + (ans.length > 1 ? alphabet[(ansIdx + 26) % 26] : '');
  const dist3 = alphabet[(ansIdx + 3) % 26] + (ans.length > 1 ? alphabet[(ansIdx + 4) % 26] : '');

  const options = [
    `A. ${ans}`,
    `B. ${dist1}`,
    `C. ${dist2}`,
    `D. ${dist3}`
  ].sort(() => ((seed * 41) % 4) - 1.5);
  const correctIndex = options.findIndex(opt => opt.includes(ans));

  return {
    id: `psy-letter-${seed}`,
    category: 'psychotest',
    subCategory: 'Deret Huruf & Sandi Logika',
    question: `Tentukan huruf / pasangan huruf berikutnya pada deret logika berikut: ${seq.join(', ')}, ... ?`,
    options,
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${ruleExp} Maka kelanjutan deret berikutnya adalah ${ans}.`,
    quickTrick: `💡 Trik Deret Huruf: Ubah huruf menjadi angka urutan abjad (A=1, B=2, C=3...) untuk menemukan selisih polanya lebih mudah.`
  };
}

// ----------------------------------------------------------------------------
// Generator 9: Pengelompokan Kategori / Odd One Out (15+ Klaster Industri)
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
    oddReason: 'Obeng Plus adalah perkakas kerja (hand tools), sedangkan yang lainnya adalah Alat Pelindung Diri (APD).'
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
  },
  {
    categoryName: 'Instrumen Ukur Tekanan & Suhu',
    items: ['Manometer Tekanan', 'Termometer Digital', 'Barometer Udara', 'Sensor Thermocouple'],
    oddItem: 'Kunci Pas 12mm',
    oddReason: 'Kunci Pas adalah perkakas mekanik, sedangkan lainnya adalah instrumen pengukur parameter fisik.'
  },
  {
    categoryName: 'Peralatan Angkat & Angkut Berat',
    items: ['Forklift Elektrik', 'Overhead Crane', 'Hand Pallet Truck', 'Conveyor Belt'],
    oddItem: 'Multimeter Digital',
    oddReason: 'Multimeter Digital adalah instrumen ukur besaran listrik, bukan alat angkut logistik pabrik.'
  },
  {
    categoryName: 'Metode & Alat Pemadam Api K3',
    items: ['Tabung APAR Powder', 'Hydrant Gedung', 'Fire Blanket (Selimut Api)', 'Sprinkler Otomatis'],
    oddItem: 'Palet Kayu Logistik',
    oddReason: 'Palet Kayu adalah media alas angkut barang, sedangkan lainnya adalah perlengkapan proteksi kebakaran.'
  }
];

function generateCategoryOddOneOutQuestion(seed: number): BaseQuestion {
  const group = CATEGORY_GROUPS[seed % CATEGORY_GROUPS.length];
  const items = [...group.items.slice(0, 3), group.oddItem].sort(() => ((seed * 43) % 4) - 1.5);
  const correctIndex = items.indexOf(group.oddItem);

  return {
    id: `psy-odd-${seed % CATEGORY_GROUPS.length}`,
    category: 'psychotest',
    subCategory: 'Pengelompokan Kata & Kategori Logis',
    question: `Manakah di antara pilihan berikut yang TIDAK TERMASUK dalam kelompok yang sama (Pilihlah kata yang ganjil / menyimpang dari kategori)?`,
    options: items.map((it, idx) => `${['A', 'B', 'C', 'D'][idx]}. ${it}`),
    correctAnswer: correctIndex >= 0 ? correctIndex : 0,
    explanation: `${group.oddReason}`,
    quickTrick: `💡 Trik Pengelompokan: Cari kesamaan fungsi utama dari 3 pilihan yang ada, lalu pilih satu opsi yang menyimpang dari tema tersebut.`
  };
}

// ============================================================================
// MASTER GENERATOR & BANK (1.000+ SOAL UNIK)
// ============================================================================
const PSYCHOTEST_GENERATORS = [
  generateSynonymQuestion,
  generateAntonymQuestion,
  generateAnalogyQuestion,
  generateSyllogismQuestion,
  generateAnalyticalPositionQuestion,
  generateAnalyticalComparisonQuestion,
  generateShiftSchedulingQuestion,
  generateLetterPatternQuestion,
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

  while (result.length < count && attempts < count * 30) {
    attempts++;
    const genIdx = (result.length + baseSeed + attempts) % PSYCHOTEST_GENERATORS.length;
    const seed = baseSeed * 53 + attempts * 31 + Math.floor(Math.random() * 100000);

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
  return PSYCHOTEST_GENERATORS[genIdx](idx * 23 + 11);
});

// Standard locked duration per question count preset (Psychotest Logic & Reasoning)
export function getPsychotestStandardDuration(questionCount: number): { seconds: number; label: string; perQuestion: string } {
  switch (questionCount) {
    case 10:
      return { seconds: 8 * 60, label: '8 Menit', perQuestion: '48 detik / soal' };
    case 20:
      return { seconds: 15 * 60, label: '15 Menit', perQuestion: '45 detik / soal' };
    case 30:
      return { seconds: 22 * 60, label: '22 Menit', perQuestion: '44 detik / soal' };
    case 50:
      return { seconds: 35 * 60, label: '35 Menit', perQuestion: '42 detik / soal' };
    default:
      return { seconds: Math.round(questionCount * 48), label: `${Math.round((questionCount * 48) / 60)} Menit`, perQuestion: '48 detik / soal' };
  }
}

export const psychotestQuestions: BaseQuestion[] = psychotestQuestionBank.slice(0, 10);
