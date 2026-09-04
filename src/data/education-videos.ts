export interface EducationVideo {
  id: string;
  title: string;
  description: string;
  category: 'kraepelin' | 'psikotes' | 'interview' | 'math' | 'culture-physical';
  duration: string;
  youtubeId: string;
  thumbnailUrl: string;
  speaker: string;
  speakerRole: string;
  viewsCount: string;
  badge?: string;
  isFeatured?: boolean;
  keyTakeaways: string[];
}

export const educationVideosData: EducationVideo[] = [
  {
    id: 'vid-kraepelin-1',
    title: 'Trik Rahasia Tes Koran (Kraepelin & Pauli) Nilai Grafik Stabil',
    description: 'Panduan lengkap cara mengatur ritme napas, teknik pegang pensil, dan menjaga grafik penjumlahan tetap stabil dari kolom awal hingga kolom akhir.',
    category: 'kraepelin',
    duration: '10:24',
    youtubeId: 'qj8B35CqQ5Y',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    speaker: 'Kak Budi Hartono',
    speakerRole: 'Praktisi Psikotes & Mentor BKK',
    viewsCount: '48.2 rb',
    badge: 'Wajib Tonton',
    isFeatured: true,
    keyTakeaways: [
      'Jangan terlalu cepat di 3 kolom pertama agar tenaga tidak habis di akhir.',
      'Tulis hanya angka satuan hasil penjumlahan (contoh: 8+7 = 15, tulis angka 5).',
      'Usahakan grafik rata mendatar atau sedikit naik, hindari grafik menurun tajam.'
    ]
  },
  {
    id: 'vid-wartegg-1',
    title: 'Bedah Tuntas 8 Kotak Tes Wartegg Sesuai Kaidah Psikologis',
    description: 'Pelajari makna psikologis di balik setiap stimulus titik, garis lengkung, kotak hitam, dan garis paralel pada tes Wartegg agar hasil gambar mencerminkan calon pekerja produktif.',
    category: 'psikotes',
    duration: '12:45',
    youtubeId: 'bB4oZq5Wk1U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80',
    speaker: 'Psikolog Ratna Dewi, M.Psi',
    speakerRole: 'Konsultan Rekrutmen Manufaktur',
    viewsCount: '35.6 rb',
    badge: 'Populer',
    isFeatured: true,
    keyTakeaways: [
      'Kotak organik (lengkung) sebaiknya digambar makhluk hidup atau alam.',
      'Kotak anorganik (garis lurus/kaku) sebaiknya digambar benda teknik atau arsitektur.',
      'Urutan pengerjaan yang disarankan: kombinasi teratur (misal 1-2-3-4-5-6-7-8 atau 1-2-3-8-7-6-5-4).'
    ]
  },
  {
    id: 'vid-baum-dap',
    title: 'Cara Menggambar Pohon (BAUM) & Orang (DAP) yang Lolos Seleksi',
    description: 'Bocoran kriteria gambar pohon berkambium dan gambar orang profesional yang dinilai memiliki kepribadian pekerja keras, jujur, dan bertanggung jawab.',
    category: 'psikotes',
    duration: '14:18',
    youtubeId: 'pG8W3xP4O30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
    speaker: 'Tim Psikotes SiapKerja',
    speakerRole: 'Assessor Kompetensi Kerja',
    viewsCount: '29.1 rb',
    keyTakeaways: [
      'Gambar pohon berkambium/berakar tunggang (seperti mangga, beringin). Jangan gambar pohon kelapa atau pisang.',
      'Pastikan ada dahan, ranting, dan daun lebat yang mencerminkan produktivitas.',
      'Gambar orang dengan proporsi wajar dan sedang beraktivitas kerja profesional.'
    ]
  },
  {
    id: 'vid-interview-1',
    title: 'Simulasi Interview HRD & User Pabrik Astra, Epson, & Yamaha',
    description: 'Contoh nyata cara menjawab pertanyaan pembuka "Ceritakan tentang diri Anda", kesiapan kerja shift malam, lembur kerja, dan motivasi bergabung.',
    category: 'interview',
    duration: '15:30',
    youtubeId: 'jNQXAC9IVRw',
    thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    speaker: 'HRD Manager Industrial',
    speakerRole: '12+ Tahun Praktisi HR Pabrik',
    viewsCount: '52.7 rb',
    badge: 'Interview Emas',
    isFeatured: true,
    keyTakeaways: [
      'Gunakan metode STAR (Situation, Task, Action, Result) saat menceritakan pengalaman PKL.',
      'Tunjukkan sikap tegas dan antusias terhadap jam kerja shift dan standar keselamatan K3.',
      'Jawab jujur kelebihan dan kekurangan diri yang disertai langkah perbaikan nyata.'
    ]
  },
  {
    id: 'vid-math-1',
    title: 'Trik Cepat Menghitung Matematika Dasar & Pola Deret Angka',
    description: 'Trik kilat menghitung perkalian pecahan, persentase diskon/efisiensi pabrik, dan menemukan rumus pola deret angka dalam hitungan detik tanpa cemas waktu habis.',
    category: 'math',
    duration: '09:50',
    youtubeId: 'kJQP7kiw5Fk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
    speaker: 'Kak Hendra Math',
    speakerRole: 'Spesialis Logika Angka',
    viewsCount: '22.8 rb',
    keyTakeaways: [
      'Cek selisih antar angka (deret aritmatika tingkat 1 atau 2).',
      'Perhatikan pola lompat 1 atau lompat 2 bilangan jika deret terlihat naik-turun.',
      'Gunakan metode pembulatan estimasi cepat untuk soal cerita bertempo singkat.'
    ]
  },
  {
    id: 'vid-5s-mcu',
    title: 'Budaya Kerja 5S/5R & Tips Lolos Tes Medis / Fisik (MCU)',
    description: 'Pemahaman prinsip Seiri, Seiton, Seiso, Seiketsu, Shitsuke (Ringkas, Rapi, Resik, Rawat, Rajin) serta tips menjaga kesehatan paru-paru, mata bebas buta warna, dan tensi darah sebelum tes.',
    category: 'culture-physical',
    duration: '11:15',
    youtubeId: 'dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    speaker: 'Supervisor Produksi Senior',
    speakerRole: 'Praktisi Manufaktur Otomotif',
    viewsCount: '18.4 rb',
    keyTakeaways: [
      '5S adalah budaya wajib yang sering ditanyakan pada interview User pabrik Jepang.',
      'Tidur cukup minimal 8 jam sebelum Medical Check Up (MCU) agar tensi stabil.',
      'Latih penglihatan dengan buku Ishihara jika ada keraguan pada buta warna parsial.'
    ]
  }
];
